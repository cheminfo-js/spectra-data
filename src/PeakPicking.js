/**
 * Implementation of the peak pickig method described by Cobas in:
 * A new approach to improving automated analysis of proton NMR spectra
 * through Global Spectral Deconvolution (GSD)
 * http://www.spectroscopyeurope.com/images/stories/ColumnPDFs/TD_23_1.pdf
 */
var PeakPicking={
    impurities:[],
    maxJ:20,

    peakPicking:function(spectrum, nH, solvent){
        var peakList = this.GSD(spectrum);
        //var solvent = spectrum.getParamString(".SOLVENT NAME", "unknown");
        var frequency = spectrum.observeFrequencyX();//getParamDouble("$BF1",400);
        var imp = this.labelPeaks(peakList, solvent, frequency);
        return [peakList,imp];
        //peakList = labelPeaks(peakList,solvent);
        //return createSignals(peakList,nH);
    },

    init:function(){
        this.impurities = API.getVar("impurities").getValue();
        //File.parse("solvent1H.txt", {header:false});
        //console.log(this.impurities[0]);
    },

    /**
     This function tries to determine which peaks belongs to common laboratory solvents
     as trace impurities from DOI:10.1021/jo971176v. The only parameter of the table is
     the solvent name.
     */
    labelPeaks:function(peakList, solvent, frequency){
        var column = 0;
        //console.log(this.impurities[0]);
        for(column=4;column<this.impurities.length;column++){
            //console.log("sss".contains);
            if(this.impurities[0][column].indexOf(solvent)>=0){
                break;
            }
        }
        //console.log("labelPeaks "+column);
        var nImpurities = this.impurities.length-1;
        var nPeaks = peakList.length;
        //Scores matrix
        var scores = new Array(nImpurities);
        var max = 0, diff=0, score=0;
        var gamma = 0.2;//ppm
        var impurityID=-1;
        var prevImp = "";
        var maxIntensity = 0,i;
        for(var j=nPeaks-1;j>=0;j--){
            if(peakList[j][1]>maxIntensity)
                maxIntensity = peakList[j][1];
        }

        for(i=nImpurities-1;i>=0;i--){
            if(this.impurities[i+1][0]!=prevImp){
                impurityID++;
                prevImp=this.impurities[i+1][0];
            }

            //impID, max, maxIndex, average
            scores[i]=[impurityID,this.impurities[i+1][2],
                this.impurities[i+1][3],0,[],0];
            max = 0;
            for(var j=nPeaks-1;j>=0;j--){
                diff = 10000;//Big numnber
                if(this.impurities[i+1][column]>0)
                    diff = Math.abs(peakList[j][0]-this.impurities[i+1][column]);
                if(diff<gamma*3){
                    score=this.score(diff,gamma);
                    if(score>max){
                        max=score;
                        scores[i][3]=max;
                        scores[i][4]=[j];
                    }
                }
            }
        }
        //Calculate the average score for each impurity set of signals
        var prevIndex = -1, sum=0, count = 0;
        var candidates=[];
        var impuritiesPeaks = [];
        var i=nImpurities-1;
        while(i>=-1){
            if(i==-1||scores[i][0]!=prevIndex&&prevIndex!=-1){
                if(prevIndex!=-1){
                    scores[i+1][5]=sum/count;
                    //Now, lets chech the multiplicities
                    if(scores[i+1][5]>0.9){
                        //console.log(scores[i+1][0]+" SS ");
                        score=this.updateScore(candidates, peakList, maxIntensity, frequency);
                        if(score>0.9){
                            //console.log(candidates);
                            //TODO: Remove peaks and add it do impuritiesPeaks
                            for(var j=0;j<candidates.length;j++){
                                for(var k=candidates[j][4].length-1;k>=0;k--){
                                    impuritiesPeaks.push(peakList[candidates[j][4][k]]);
                                }
                            }
                        }
                    }
                }
                if(i>=0){
                    prevIndex=scores[i][0];
                    sum=scores[i][3];
                    count=1;
                    candidates=[scores[i]];
                }

            }else{
                prevIndex=scores[i][0];
                candidates.push(scores[i]);
                sum+=scores[i][3];
                count++;
            }
            i--;
        }
        //console.log(impuritiesPeaks.length);

        return impuritiesPeaks;
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
    },
    /**
     This function joint all the nearby peaks into single signals. We may try to
     determine the J-couplings and the multiplicity here.
     */
    createSignals:function(){

    },
    /**
     Determine the peaks of the spectrum by applying a global spectrum deconvolution.
     */
    GSD:function(spectrum){
        var data= spectrum.getXYData();
        var y = data[1];
        var x = data[0];

        //Lets remove the noise for better performance
        var noiseLevel = Math.abs(spectrum.getNoiseLevel());

        //console.log("noise level "+noiseLevel);
        for(var i=y.length-1;i>=0;i--)
            if(Math.abs(y[i])<noiseLevel)
                y[i]=0;

        var dx = x[1]-x[0];
        // fill convolution frecuency axis
        var X = [];//x[2:(x.length-2)];

        // fill Savitzky-Golay polynomes
        var Y = new Array();
        var dY = new Array();
        var ddY = new Array();
        for (var j = 2; j < x.length -2; j++){
            Y.push((1/35.0)*(-3*y[j-2] + 12*y[j-1] + 17*y[j] + 12*y[j+1] - 3*y[j+2]));
            X.push(x[j]);
            dY.push((1/(12*dx))*(y[j-2] - 8*y[j-1] + 8*y[j+1] - y[j+2]));
            ddY.push((1/(7*dx*dx))*(2*y[j-2] - y[j-1] - 2*y[j] - y[j+1] + 2*y[j+2]));
        }
        // pushs max and min points in convolution functions
        var maxY = new Array();
        var stackInt = new Array();
        var intervals = new Array();
        var minddY = new Array();
        //console.log(Y.length);
        for (var i = 1; i < Y.length -1 ; i++)
        {
            if ((Y[i] > Y[i-1]) && (Y[i] > Y[i+1]))
            {
                maxY.push(X[i]);
            }
            if ((dY[i] < dY[i-1]) && (dY[i] < dY[i+1]))
            {
                stackInt.push(X[i]);
            }
            if ((dY[i] > dY[i-1]) && (dY[i] > dY[i+1]))
            {
                try{
                    intervals.push( [X[i] , stackInt.pop()] );
                }
                catch(e){
                    console.log("Error I don't know why");
                }
            }
            if ((ddY[i] < ddY[i-1]) && (ddY[i] < ddY[i+1]))
            {
                minddY.push( [X[i], Y[i]] );
            }
        }
        // creates a list with (frecuency, linewith, height)
        var signalsS = new Array();
        var signals = new Array();
        for (var j = 0; j < minddY.length; j++)
        {
            var f = minddY[j];
            var frecuency = f[0];
            var possible = new Array();
            for (var k=0;k<intervals.length;k++){
                var i = intervals[k];
                if (frecuency > i[0] && frecuency < i[1])
                    possible.push(i);
            }
            //console.log("possible "+possible.length);
            if (possible.length > 0)
                if (possible.length == 1)
                {
                    var inter = possible[0];
                    var linewith = inter[1] - inter[0];
                    var height = f[1];
                    var points = Y;
                    //console.log(frecuency);
                    points.sort(function(a, b){return a-b});
                    if ((linewith > 2*dx) && (height > 0.0001*points[0])){
                        signals.push( [frecuency, linewith, height] );
                        signalsS.push([frecuency,height]);

                    }
                }
                else
                {
                    //TODO: nested peaks
                    console.log("Nested "+possible);
                }
        }
        return signalsS;
        //jexport("peakPicking",signalsS);
    }
}