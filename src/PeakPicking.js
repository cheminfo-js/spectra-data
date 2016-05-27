'use strict';
/**
 * Implementation of the peak pickig method described by Cobas in:
 * A new approach to improving automated analysis of proton NMR spectra
 * through Global Spectral Deconvolution (GSD)
 * http://www.spectroscopyeurope.com/images/stories/ColumnPDFs/TD_23_1.pdf
 */
var JAnalyzer = require('./JAnalyzer');
/*var LM = require('ml-curve-fitting');
var Matrix = LM.Matrix;
var math = Matrix.algebra;*/
var GSD = require("ml-gsd");
var extend = require("extend");
var removeImpurities = require("./ImpurityRemover");

var PeakPicking={
    impurities:[],
    maxJ:20,
    defaultOptions:{nH:99,
        clean:true,
        realTop:false,
        thresholdFactor:1,
        compile:true,
        integralFn:0,
        optimize:true,
        idPrefix:"",
        format:"old"
    },

    peakPicking:function(spectrum, optionsEx){
        var options = extend({}, this.defaultOptions, optionsEx);
        var i, j, nHi, sum;

        var noiseLevel = Math.abs(spectrum.getNoiseLevel())*(options.thresholdFactor);

        //console.log("noiseLevel "+noiseLevel);
        var gsdOptions = extend({},
            {noiseLevel: noiseLevel,
                minMaxRatio:0.01,
                broadRatio:0.0025,
                smoothY:true,
                nL:4,
                sgOptions:{windowSize: 9, polynomial: 3}
            },
            options.gsdOptions);

        var data = spectrum.getXYData();
        var peakList = GSD.gsd(data[0],data[1], gsdOptions);
        var peakList = GSD.post.joinBroadPeaks(peakList,{width:0.25});
        if(options.optimize)
            peakList = GSD.post.optimizePeaks(peakList,data[0],data[1],gsdOptions.nL,"lorentzian");

        peakList = this.clearList(peakList, noiseLevel);
        var signals = this.detectSignals(peakList, spectrum, options.nH, options.integralFn);
        //console.log(JSON.stringify(signals));
        //Remove all the signals with small integral
        if(options.clean||false){
            for(var i=signals.length-1;i>=0;i--){
                if(signals[i].integralData.value<0.5) {
                    signals.splice(i, 1);
                }
            }
        }
        
        //console.log(signals);
        if(options.compile||false){
            for(i=0;i<signals.length;i++){
                //console.log("Sum "+signals[i].integralData.value);
                JAnalyzer.compilePattern(signals[i]);
               
                if(signals[i].maskPattern&&signals[i].multiplicity!="m"
                    && signals[i].multiplicity!=""){
                    //Create a new signal with the removed peaks
                    nHi = 0;
                    sum=0;
                    var peaksO = [];
                    for(j=signals[i].maskPattern.length-1;j>=0;j--){
                        sum+=this.area(signals[i].peaks[j]);

                        if(signals[i].maskPattern[j]===false) {
                            var peakR = signals[i].peaks.splice(j,1)[0];
                            peaksO.push({x:peakR.x, y:peakR.intensity, width:peakR.width});
                            //peaksO.push(peakR);
                            signals[i].mask.splice(j,1);
                            signals[i].mask2.splice(j,1);
                            signals[i].maskPattern.splice(j,1);
                            signals[i].nbPeaks--;
                            nHi+=this.area(peakR);
                        }
                    }
                    if(peaksO.length>0){
                        nHi=nHi*signals[i].integralData.value/sum;
                        signals[i].integralData.value-=nHi;
                        var peaks1 = [];
                        for(var j=peaksO.length-1;j>=0;j--)
                            peaks1.push(peaksO[j]);
                        var newSignals = this.detectSignals(peaks1, spectrum, nHi, options.integralFn);

                        for(j=0;j<newSignals.length;j++)
                            signals.push(newSignals[j]);
                    }
                }
            }
            //console.log(signals);
            this.updateIntegrals(signals, options.nH);
        }
        signals.sort(function(a,b){
            return b.delta1- a.delta1
        });
        //Remove all the signals with small integral
        if(options.clean||false){
            for(var i=signals.length-1;i>=0;i--){
                //console.log(signals[i]);
                if(signals[i].integralData.value<0.5) {
                    signals.splice(i, 1);
                }
            }
        }

        for(var i=0;i<signals.length;i++){
            if(options.idPrefix&&options.idPrefix.length>0)
                signals[i].signalID = options.idPrefix+"_"+(i+1);
            else
                signals[i].signalID = (i+1)+"";
            signals[i]._highlight=[signals[i].signalID];
        }

        removeImpurities(signals, spectrum.getSolventName(),options.nH);

        if(options.format==="new"){
            var newSignals = new Array(signals.length);
            for(var i=0;i<signals.length;i++){
                var signal = signals[i];
                newSignals[i] = {
                    from : signal.integralData.from,
                    to : signal.integralData.to,
                    integral : signal.integralData.value,
                    signal:[{
                        delta:signal.delta1,
                        nbAtoms:0,
                        diaID:[],
                        multiplicity:signal.multiplicity,
                        peak:signal.peaks,
                        kind:"",
                        remark:""
                    }],
                    signalID:signal.signalID,
                    _highlight:signal._highlight

                };
                if(signal.nmrJs){
                    newSignals[i].signal[0].j = signal.nmrJs;
                }
            }
            signals = newSignals;
        }

        return signals;


        /*var frequency = spectrum.observeFrequencyX();//getParamDouble("$BF1",400);
        var imp = this.labelPeaks(peakList, solvent, frequency);
        return [peakList,imp];
        */
        //return createSignals(peakList,nH);
    },

    clearList:function(peakList, threshold){
        for(var i=peakList.length-1;i>=0;i--){
            if(Math.abs(peakList[i].y)<threshold){
                peakList.splice(i,1);
            }
        }
        return peakList;
    },


    /**
     * This method implements a non linear sampling of the spectrum. The point close to
     * the critic points are more sampled than the other ones.
     * @param spectrum
     * @param peaks
     * @param rowWise
     */
    sampling: function(spectrum, peaks, rowWise){
        var i0, ie, ic,i, j,nbPoints;
        var xy = []
        if(i0>ie){
            var tmp = i0;
            i0 = ie;
            ie = tmp;
        }
        //Non linear sampling for each peak.
        for(i=0;i<peaks.length;i++){
            var more = true;
            var nL = 4;
            while(more) {
                i0 = spectrum.unitsToArrayPoint(peaks[i][0] - peaks[i][2] * nL);
                ie = spectrum.unitsToArrayPoint(peaks[i][0] + peaks[i][2] * nL);
                ic = spectrum.unitsToArrayPoint(peaks[i][0]);
                if (i0 > ie) {
                    tmp = i0;
                    i0 = ie;
                    ie = tmp;
                }
                i0 = i0 < 0 ? 0 : i0;
                ie = ie >= spectrum.getNbPoints() ? spectrum.getNbPoints() - 1 : ie;

                if (ie - i0 < 10) {
                    for (j = i0; j <= ie; j++) {
                        xy.push([spectrum.getX(j), spectrum.getY(j)]);
                    }
                    more = false;
                }
                else {
                    xy.push([spectrum.getX(i0), spectrum.getY(i0)]);
                    xy.push([spectrum.getX(ie), spectrum.getY(ie)]);
                    if (nL > 0.5) {
                        nL -= 0.5;
                    }
                    else {
                        nL /= 2;
                    }
                }
            }
        }
        //console.log(xy);
        xy.sort(function(a,b){
            return a[0]-b[0];
        });
        //console.log("XX "+xy.length);
        var x=[],y=[];
        var index =0;
        if(rowWise){
            x=[xy[0][0]],y=[xy[0][1]];
            for(i=1;i<xy.length;i++){
                if(x[index]!=xy[i][0]){
                    x.push(xy[i][0]);
                    y.push(xy[i][1]);
                    index++;
                }
            }
        }
        else{
            x=[[xy[0][0]]],y=[[xy[0][1]]];
            for(i=1;i<xy.length;i++){
                if(x[index][0]!=xy[i][0]){
                    x.push([xy[i][0]]);
                    y.push([xy[i][1]]);
                    index++;
                }
            }
        }
        return [x,y];

    },

    getVector: function(spectrum, from, to, rowWise){
        var i0 = spectrum.unitsToArrayPoint(from);
        var ie = spectrum.unitsToArrayPoint(to);
        var x = [];
        var y = [];
        if(i0>ie){
            var tmp = i0;
            i0 = ie;
            ie = tmp;
        }
        i0=i0<0?0:i0;
        ie=ie>=spectrum.getNbPoints()?spectrum.getNbPoints()-1:ie;
        for(var i=i0;i<ie;i+=10){
            if(rowWise){
                y.push(spectrum.getY(i));
                x.push(spectrum.getX(i));
            }
            else{
                y.push([spectrum.getY(i)]);
                x.push([spectrum.getX(i)]);
            }
        }
        return [x,y];
    },



    updateLimits : function(signal){
        if(signal.multiplicity!="m" && signal.multiplicity!=""){
            //Remove the integral of the removed peaks
            var peaksO = signal.peaks;
            var nbPeaks0 = peaksO.length, index = 0, factor = 0, toRemove = 0;

            for(var i=0;i<nbPeaks0;i++){
                if(signal.maskPattern[i]===false)
                    toRemove+=this.area(peaksO[i]);
                factor+= this.area(peaksO[i]);
            }
            factor=signal.integralData.value/factor;
            signal.integralData.value-=toRemove*factor;
        }
        return signal.integralData.value;
    },

    updateIntegrals : function(signals, nH){
        var sumIntegral = 0,i,sumObserved=0;
        for(i=0;i<signals.length;i++){
            sumObserved+=Math.round(signals[i].integralData.value);
        }
        if(sumObserved!=nH){

            sumIntegral=nH/sumObserved;
            for(i=0;i<signals.length;i++){
                signals[i].integralData.value*=sumIntegral;
            }
        }
    },

    /*
     {
     "nbPeaks":1,"multiplicity":"","units":"PPM","startX":3.43505,"assignment":"",
     "pattern":"s","stopX":3.42282,"observe":400.08,"asymmetric":false,
     "delta1":3.42752,
     "integralData":{"to":3.43505,"value":590586504,"from":3.42282},
     "nucleus":"1H",
     "peaks":[{"intensity":60066147,"x":3.42752}]
     }
     */
    detectSignals: function(peakList, spectrum, nH, integralType){

        var frequency = spectrum.observeFrequencyX();
        var signals = [];
        var signal1D = {};
        var prevPeak = {x:100000,y:0,width:0},peaks=null;
        var rangeX = 16/frequency;//Peaks withing this range are considered to belongs to the same signal1D
        var spectrumIntegral = 0,cs,sum, i,j;
        var dx = (spectrum.getX(1)-spectrum.getX(0))>0?1:-1;
        for(i=0;i<peakList.length;i++){
            //console.log(peakList[i].width);
            //console.log(peakList[i]);
            if(Math.abs(peakList[i].x-prevPeak.x)>rangeX){
                //console.log(typeof peakList[i].x+" "+typeof peakList[i].width);
                signal1D = {"nbPeaks":1,"units":"PPM",
                    "startX":peakList[i].x-peakList[i].width,
                    "stopX":peakList[i].x+peakList[i].width,
                    "multiplicity":"","pattern":"",
                    "observe":frequency,"nucleus":"1H",
                    "integralData":{"from":peakList[i].x-peakList[i].width*3,
                                    "to":peakList[i].x+peakList[i].width*3
                                    //"value":this.area(peakList[i])
                    },
                    "peaks":[]};
                signal1D.peaks.push({x:peakList[i].x,"intensity":peakList[i].y, width:peakList[i].width});
                signals.push(signal1D);
                //spectrumIntegral+=this.area(peakList[i]);
            }
            else{
                var tmp = peakList[i].x+peakList[i].width;
                signal1D.stopX = Math.max(signal1D.stopX,tmp);
                tmp = peakList[i].x-peakList[i].width;
                signal1D.startX = Math.min(signal1D.startX,tmp);
                signal1D.nbPeaks++;
                signal1D.peaks.push({x:peakList[i].x,"intensity":peakList[i].y, width:peakList[i].width});
                //signal1D.integralData.value+=this.area(peakList[i]);
                signal1D.integralData.from = Math.min(signal1D.integralData.from, peakList[i].x-peakList[i].width*3);
                signal1D.integralData.to = Math.max(signal1D.integralData.to,peakList[i].x+peakList[i].width*3);
                //spectrumIntegral+=this.area(peakList[i]);
            }
            prevPeak = peakList[i];
        }
        //console.log(signals);
        //Normalize the integral to the normalization parameter and calculate cs
        for(i=0;i<signals.length;i++){
            peaks = signals[i].peaks;
            var integral = signals[i].integralData;
            cs = 0;
            sum = 0;

            for(var j=0;j<peaks.length;j++){
                cs+=peaks[j].x*this.area(peaks[j]);//.intensity;
                sum+=this.area(peaks[j]);
            }
            signals[i].delta1 = cs/sum;

            if(integralType==0)
                integral.value = sum;
            else {
                integral.value=spectrum.getArea(integral.from,integral.to);//*nH/spectrumIntegral;
            }
            spectrumIntegral+=integral.value;

        }
        for(var i=0;i<signals.length;i++){
            //console.log(integral.value);
            var integral = signals[i].integralData;
            integral.value*=nH/spectrumIntegral;
        }

        return signals;
    },

    area: function(peak){
        return Math.abs(peak.intensity*peak.width*1.57)//1.772453851);
    },

    /**
     Updates the score that a given impurity is present in the current spectrum. In this part I would expect
     to have into account the multiplicity of the signal. Also the relative intensity of the signals.
     THIS IS the KEY part of the algorithm!!!!!!!!!
     */
    updateScore:function(candidates, peakList, maxIntensity, frequency){
        //You may do it to avoid this part.
        //return 1;

        //Check the multiplicity
        var mul = "";
        var j = 0,index, k, maxJppm=this.maxJ/frequency;
        var min=0, indexMin=0, score=0;
        for(var i=candidates.length-1;i>=0;i--){
            mul = candidates[i][1];
            j = candidates[i][2];
            //console.log(candidates[i][4]);
            index = candidates[i][4][0];
            //console.log(peakList[index][0]+" "+mul+" "+j+" "+index);
            //I guess we should try to identify the pattern in the nearby.
            if(mul.indexOf("sep")>=0){
                if(peakList[index][1]>maxIntensity*0.33){
                    candidates.splice(i,1);//Not a candidate anymore.
                }
            }else{
                if(mul.indexOf("s")>=0||mul.indexOf("X")>=0){
                    k=index-1;
                    min=peakList[index][1];
                    indexMin=index;
                    while(k>=0&&Math.abs(peakList[index][0]-peakList[k][0])<0.025){
                        if(peakList[k][1]<min){
                            min=peakList[k][1];
                            indexMin=k;
                        }
                        k--;
                    }
                    k=index+1;
                    while(k<peakList.length&&Math.abs(peakList[index][0]-peakList[k][0])<0.025){
                        if(peakList[k][1]<min){
                            min=peakList[k][1];
                            indexMin=k;
                        }
                        k++;
                    }
                    candidates[i][4][0]=indexMin;
                    score+=1;
                }
            }
            if(mul.indexOf("d")>=0){
                if(index>0&&index<peakList.length-1){
                    var thisJ1 = Math.abs(Math.abs(peakList[index-1][0]-peakList[index][0])*frequency-j);
                    var thisJ2 = Math.abs(Math.abs(peakList[index+1][0]-peakList[index][0])*frequency-j);
                    var thisJ3 = Math.abs(Math.abs(peakList[index+1][0]-peakList[index-1][0])*frequency-j);
                    if(thisJ1<2||thisJ2<2||thisJ3<2){
                        if(thisJ1<thisJ2){
                            if(thisJ1<thisJ3){
                                candidates[i][4]=[index-1,index];
                                score+=1;
                            }
                            else{
                                candidates[i][4]=[index-1,index+1];
                                score+=1;
                            }
                        }
                        else{
                            if(thisJ2<thisJ3){
                                candidates[i][4]=[index,index+1];
                                score+=1;
                            }
                            else{
                                candidates[i][4]=[index-1,index+1];
                                score+=1;
                            }
                        }
                    }
                }
            }
            if(mul.indexOf("t")>=0){
                //console.log("here");
                if(index>0&&index<peakList.length-1){
                    var thisJ1 = Math.abs(Math.abs(peakList[index-1][0]-peakList[index][0])*frequency-j);
                    var thisJ2 = Math.abs(Math.abs(peakList[index+1][0]-peakList[index][0])*frequency-j);
                    var thisJ4 = Math.abs(Math.abs(peakList[index+1][0]-peakList[index+2][0])*frequency-j);
                    //console.log("XX "+thisJ1+" "+thisJ2);
                    if(thisJ1<2){
                        candidates[i][4]=[index-1, index];
                        score+=0.5;
                    }
                    if(thisJ2<2){
                        candidates[i][4].push(index+1);
                        score+=0.5;
                    }
                    if(thisJ3<2){
                        candidates[i][4].push(index+2);
                        score+=0.5;
                    }

                }
            }
            if(mul.indexOf("q")>=0){
                if(index>1&&index<peakList.length-2){
                    var thisJ1 = Math.abs(Math.abs(peakList[index-2][0]-peakList[index-1][0])*frequency-j);
                    var thisJ2 = Math.abs(Math.abs(peakList[index-1][0]-peakList[index][0])*frequency-j);
                    var thisJ3 = Math.abs(Math.abs(peakList[index+1][0]-peakList[index][0])*frequency-j);
                    var thisJ4= Math.abs(Math.abs(peakList[index+2][0]-peakList[index+1][0])*frequency-j);
                    if(thisJ1<2){
                        candidates[i][4].push(index-2);
                        score+=0.25;
                    }
                    if(thisJ2<2){
                        candidates[i][4].push(index-1);
                        score+=0.25;
                    }
                    if(thisJ3<2){
                        candidates[i][4].push(index+1);
                        score+=0.25;
                    }
                    if(thisJ4<2){
                        candidates[i][4].push(index+2);
                        score+=0.25;
                    }
                }
            }
        }

        //console.log(score/candidates.length+ " -> "+candidates);
        //Lets remove the candidates to be impurities.
        //It would be equivalent to mark the peaks as valid again
        if(score/candidates.length < 0.5){
            for(var i=candidates.length-1;i>=0;i--){
                candidates.splice(i,1);
            }
            return 0;
        }
        //Check the relative intensity
        return 1;
    },

    score:function(value, gamma){
        return Math.exp(-Math.pow(value/gamma,2)/2.0);
    }

}

module.exports = PeakPicking;

