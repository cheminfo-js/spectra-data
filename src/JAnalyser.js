/**
 * Created by acastillo on 4/5/15.
 */
var pascalTriangle = [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1],[1,5,10,10,5,1]];
var symRatio = 2.2;
var maxErrorIter1 = 2;//Hz
var maxErrorIter2 = 1;//Hz
var DEBUG = true;

var compilePattern = function(signal){
    if(DEBUG)console.log("Debugin...");
    signal.multiplicity="ms";
    //1.1 symmetrice
    signal.symRank = symmetriceChoiseBest(signal,maxErrorIter1,1);
    //Is the signal asymmetric?
    if(signal.symRank<0.95){
        /*******************************************
         *This is only for debuging
         */
        /*signal.peaksComp = new Array(signal.peaks.length);
         //Convert PPM to Hz
         for(i=0;i<signal.peaks.length;i++){
         signal.peaksComp[i]={x:signal.peaks[i].x*signal.observe,intensity:signal.peaks[i].intensity};
         }
         */
        /*******************************************/
        signal.J = [];
        return;
    }
    if(DEBUG)console.log("nbPeaks "+signal.peaksComp.length);
    var i,j,min,max,k=1,P1,Jc=[],n2,maxFlagged;

    for(var n=1;n<7;n++){
        if(DEBUG)console.log("Trying "+n+" couplings");
        //1.2 Normalize. It makes a deep copy of the peaks before to modify them.
        var peaks = normalize(signal,n);
        //Convert PPM to HZ
        /*for(i=0;i<peaks.length;i++){
         peaks[i].x*=signal.observe;
         }*/
        if(peaks.length == 1){
            signal.multiplicity = "s";
            continue;
        }
        //1.3 Establish a range for the Heights Hi [peaks.intensity*0.85,peaks.intensity*1.15];
        var ranges = getRanges(peaks);
        n2 = Math.pow(2,n);
        if(DEBUG){
            console.log(ranges);
            console.log("Target sum: "+n2);
        }
        //console.log(ranges);
        //1.4 Find a combination of integer heights Hi, one from each Si, that sums to 2^n.
        var heights = null;
        Jc = [];
        var validPattern = false;
        while(!validPattern&&(heights = getNextCombination(ranges, n2))!==null){
            if(DEBUG){
                console.log("Possible pattern found with "+n+" couplings!!!");
                console.log(heights);
            }
            //Number the components of the multiplet consecutively from 1 to 2n,
            //starting at peak 1
            var numbering = new Array(heights.length);
            k=1;
            for(i=0;i<heights.length;i++){
                numbering[i]=new Array(heights[i]);
                for(j=0;j<heights[i];j++){
                    numbering[i][j]=k++;
                }
            }
            if(DEBUG){
                console.log(JSON.stringify(numbering));
            }
            Jc = [];//The j couplings array.
            j=1;
            //Set j = 1; J1 = P2 - P1. Flag components 1 and 2 as accounted for.
            Jc.push(peaks[1].x-peaks[0].x);
            P1 = peaks[0].x;
            numbering[0].splice(0,1);//Flagged
            numbering[1].splice(0,1);//Flagged
            k=1;
            var nFlagged = 2;
            maxFlagged = Math.pow(2,n)-1;
            while(Jc.length<n&&nFlagged<maxFlagged&&k<peaks.length){
                if(DEBUG){
                    console.log(Jc);
                    console.log(JSON.stringify(numbering));
                }
                // 4.1. Increment j. Set k to the number of the first unflagged component.
                j++;
                while(k<peaks.length&&numbering[k].length===0){
                    k++;
                }
                if(k<peaks.length){
                    //4.2 Jj = Pk - P1.
                    Jc.push(peaks[k].x-peaks[0].x);
                    //Flag component k and, for each sum of the...
                    numbering[k].splice(0,1);//Flageed
                    nFlagged++;
                    //Flag the other components of the multiplete

                    for(var u=2;u<=j;u++){
                        //TODO improve those loops
                        var jSum = 0;
                        for(i=0;i<u;i++){
                            jSum+=Jc[i];
                        }
                        for(i=1;i<numbering.length;i++){
                            //console.log(u+" x "+Jc+" x "+P1+" "+jSum+" "+(P1+jSum)+" "+peaks[i].x);
                            if(Math.abs(peaks[i].x-(P1+jSum))<0.25){
                                numbering[i].splice(0,1);//Flageed
                                break;
                            }
                        }
                    }
                }
            }
            var pattern = idealPattern(Jc);
            //Compare the ideal pattern with the proposed intensities
            validPattern = true;
            for(i=0;i<pattern.length;i++){
                if(pattern[i].intensity != heights[i])
                    validPattern = false;
            }
            if(DEBUG){
                console.log("Jc "+JSON.stringify(Jc));
                console.log("Heights "+JSON.stringify(heights));
                console.log("pattern "+JSON.stringify(pattern));
                console.log("Valid? "+validPattern);
            }
        }
        if(validPattern){
            signal.multiplicity = "";
            for( i=0;i<Jc.length;i++){
                signal.multiplicity+= "d";
            }
            signal.J = Jc;

            if(DEBUG){
                console.log(Jc);
            }
            //break;
        }
    }
}
/**
 *This function creates an ideal pattern for the given J-couplings
 */
var idealPattern = function(Jc){
    var hsum = Math.pow(2,Jc.length),i,j;
    var pattern = [{x:0,intensity:hsum}];
    for(i=0;i<Jc.length;i++){
        for(j=pattern.length-1;j>=0;j--){
            pattern.push({x:pattern[j].x+Jc[i]/2,
                intensity:pattern[j].intensity/2});
            pattern[j].x = pattern[j].x-Jc[i]/2;
            pattern[j].intensity = pattern[j].intensity/2;
        }
    }
    pattern.sort(function compare(a,b) { return a.x-b.x});
    for(j=pattern.length-2;j>=0;j--){
        if(Math.abs(pattern[j].x-pattern[j+1].x)<0.1){
            pattern[j].intensity+= pattern[j+1].intensity
            pattern.splice(j+1,1);
        }
    }
    return pattern;
}
/**
 * Find a combination of integer heights Hi, one from each Si, that sums to 2n.
 */
var getNextCombination = function(ranges, value){
    var half = Math.ceil(ranges.values.length/2), lng = ranges.values.length;
    var sum = 0,i;
    while(sum!=value){
        //Update the indexes to point at the next possible combination
        ok = false;
        var leftIndex = 0;
        while(!ok){
            ok = true;
            ranges.currentIndex[ranges.active]++;
            if(ranges.currentIndex[ranges.active]>=ranges.values[ranges.active].length){
                //In this case, there is no more possible combinations
                if(ranges.active+1==half){
                    return null;
                }
                else{
                    //If this happens we need to try the next active peak
                    ranges.currentIndex[ranges.active]=0;
                    ok=false;
                    ranges.active++;
                }
            }
            else{
                ranges.active=0;
            }
        }
        //
        sum=0;
        for(i=0;i<half;i++){
            sum+= ranges.values[i][ranges.currentIndex[i]]*2;
        }
        if(ranges.values.length%2!==0){
            sum-= ranges.values[half-1][ranges.currentIndex[half-1]];
        }
        if(DEBUG){
            console.log(ranges.currentIndex);
            console.log(sum+" "+value);
        }
    }

    if(sum==value){
        var heights = new Array(lng);
        for(i=0;i<half;i++){
            heights[i] = ranges.values[i][ranges.currentIndex[i]];
            heights[lng-i-1] = ranges.values[i][ranges.currentIndex[i]];
        }
        return heights;
    }
    return null;
}

var getRanges = function(peaks){
    var ranges = new Array(peaks.length);
    var currentIndex = new Array(peaks.length);
    ranges[0] = [1];
    ranges[peaks.length-1] = [1];
    currentIndex[0]=-1;
    currentIndex[peaks.length-1] = 0;
    for(var i=1;i<peaks.length-1;i++){
        min = Math.round(peaks[i].intensity*0.85);
        max = Math.round(peaks[i].intensity*1.15);
        ranges[i] =[];
        for(var j=min;j<=max;j++){
            ranges[i].push(j);
        }
        currentIndex[i]=0;
    }
    return {values:ranges, currentIndex:currentIndex, active:0};
}
var symmetriceChoiseBest = function(signal,maxError,iteration){
    var symRank1 = symmetrice(signal,maxError,iteration);
    var tmpPeaks = signal.peaksComp;
    var cs = signal.delta1;
    signal.delta1 = (signal.peaks[0].x+signal.peaks[signal.peaks.length-1].x)/2;
    var symRank2 = symmetrice(signal,maxError,iteration);
    if(signal.peaksComp.length>tmpPeaks.length)
        return symRank2;
    else{
        signal.delta1 = cs;
        signal.peaksComp = tmpPeaks;
        return symRank1;
    }

}
/**
 * This function will return a set of symmetric peaks that will
 * be the enter point for the patter compilation process.
 */
var symmetrice = function(signal,maxError,iteration){
    //Before to symmetrice we need to keep only the peaks that possibly conforms the multiplete
    var max, min, avg, ratio;
    var peaks = new Array(signal.peaks.length);
    //Make a deep copy of the peaks and convert PPM ot HZ
    for(j=0;j<peaks.length;j++){
        peaks[j]= {x:signal.peaks[j].x*signal.observe, intensity:signal.peaks[j].intensity};
    }
    //Join the peaks that are closer than 0.25 Hz
    for(j=peaks.length-2;j>=0;j--){
        if(Math.abs(peaks[j].x-peaks[j+1].x)<0.25){
            peaks[j].x = (peaks[j].x*peaks[j].intensity+peaks[j+1].x*peaks[j+1].intensity);
            peaks[j].intensity = peaks[j].intensity+peaks[j+1].intensity;
            peaks[j].x/=peaks[j].intensity;
            peaks[j].intensity/=2;
            peaks.splice(j+1,1);
        }

    }
    signal.peaksComp = peaks;
    var nbPeaks = peaks.length;
    var mask = new Array(nbPeaks);
    var left=0, right=peaks.length-1;
    var cs = signal.delta1*signal.observe;
    //We try to symmetrice the extreme peaks. We consider as candidates for symmetricing those which
    //ratio smaller than 3
    for(var i=0;i<nbPeaks;i++){
        mask[i]= true;
    }

    while(left<=right){
        mask[left] = true;
        mask[right] = true;
        if(left==right){
            if(nbPeaks>2&&Math.abs(peaks[left].x-cs)>maxError){
                mask[left] = false;
            }
        }
        else{
            max = Math.max(peaks[left].intensity,peaks[right].intensity);
            min = Math.min(peaks[left].intensity,peaks[right].intensity);
            ratio = max/min;
            if(ratio>symRatio){
                if(peaks[left].intensity==min){
                    mask[left] = false;
                    right++;
                }
                else{
                    mask[right] = false;
                    left--;
                }
            }
            else{
                var diffL = Math.abs(peaks[left].x-cs);
                var diffR = Math.abs(peaks[right].x-cs);

                if(Math.abs(diffL-diffR)<maxError){
                    //avg = (peaks[left].intensity+peaks[right].intensity)/2;
                    avg = Math.min(peaks[left].intensity,peaks[right].intensity);
                    peaks[left].intensity=avg
                    peaks[right].intensity=avg;
                }
                else{
                    if(Math.max(diffL,diffR)==diffR){
                        mask[right] = false;
                        left--;
                    }
                    else{
                        mask[left] = false;
                        right++;
                    }
                }
                if(DEBUG){
                    console.log(iteration+" CS: "+cs);
                    console.log(diffL+ " "+diffR);
                    console.log(Math.abs(diffL-diffR));
                    console.log(JSON.stringify(peaks));
                    console.log(JSON.stringify(mask));
                }
            }
        }
        left++;
        right--;
        //Only alter cs if its the first iteration of the sym process.
        if(iteration==1){
            cs = chemicalShift(peaks, mask);
            //There is not more available peaks
            if(isNaN(cs)){
                console.log("No more signals");
                return 0;
            }
        }
        //cs = (signal.peaksComp[0].x+signal.peaksComp[signal.peaksComp.length-1].x)/2;
        console.log("Chemical shift "+cs/signal.observe);
    }
    //To remove the weak peaks and recalculate the cs
    for(i=nbPeaks-1;i>=0;i--){
        if(mask[i]===false){
            peaks.splice(i,1);
        }
    }
    cs = chemicalShift(peaks);
    if(isNaN(cs)){
        return 0;
    }
    signal.delta1 = cs/signal.observe;;
    //Now, the peak should be symmetric in heigths, but we need to know if it is symmetric in x
    var symFactor = 0;
    if(peaks.length>1){
        var weigth = 0;
        for(i=Math.ceil(peaks.length/2)-1;i>=0;i--){
            symFactor+=Math.min(Math.abs(peaks[i].x-cs),Math.abs(peaks[peaks.length-1-i].x-cs))
            /Math.max(Math.abs(peaks[i].x-cs),Math.abs(peaks[peaks.length-1-i].x-cs))*peaks[i].intensity;
            weigth+=peaks[i].intensity;
        }
        symFactor/=weigth;///(Math.ceil(peaks.length/2));
    }
    else{
        if(peaks.length==1)
            symFactor=1;
    }
    symFactor-=(nbPeaks-peaks.length)/30; //Removed peaks peanalty
    if(DEBUG)
        console.log("cs: "+(cs/signal.observe)+" symFactor: "+symFactor);
    //Sometimes we need a second opinion after the first symmetrization.
    if(symFactor>0.8&&symFactor<0.97&&iteration<2){
        return symmetrice(signal, maxErrorIter2, 2);
    }
    return symFactor;
}

var normalize = function(signal, n){
    //Perhaps this is slow
    var peaks = JSON.parse(JSON.stringify(signal.peaksComp));
    var norm = 0,i;//Math.pow(2,n);
    for(i=0;i<peaks.length;i++){
        norm+= peaks[i].intensity;
    }
    norm=Math.pow(2,n)/norm;
    //console.log("here "+peaks.length);
    for(i=peaks.length-1;i>=0;i--){
        peaks[i].intensity*= norm;
        if(peaks[i].intensity<0.75){
            if(DEBUG)
                console.log("Peak "+i+" does not seem to belong to this multiplet "+peaks[i].intensity);
            peaks.splice(i,1);
        }
    }
    console.log(JSON.stringify(peaks));
    return peaks;
}

var chemicalShift = function(peaks, mask){
    var sum=0,cs=0;
    if(mask){
        for(var i=0;i<peaks.length;i++){
            //console.log(mask[i]);
            if(mask[i]===true){
                sum+=peaks[i].intensity;
                cs+=peaks[i].intensity*peaks[i].x;
            }
        }
    }
    else{
        for(var i=0;i<peaks.length;i++){
            sum+=peaks[i].intensity;
            cs+=peaks[i].intensity*peaks[i].x;
        }
    }

    //console.log(sum);
    return cs/sum;
}

/*********************************************
 * this is your entry point....
 *
 *********************************************/
var h1=API.getVar("jcamp1H").getValue().value+"";
var mf = get("mf");
var nH = mf.replace(/.*H([0-9]+).*/,"$1")*1;
var spectrum = SDlib.NMR.fromJcamp(h1);

var peakPicking = spectrum.nmrPeakDetection({"nH":nH,realTop:true,thresholdFactor:0.8});
//The peak picking depends on the spectrum, and in the given number of hidrogens
//var result = spectrum.nmrPeakDetection({"nH":nH});

//This is to show the raw peakList. You will need the peaks you still.
var listP = [];
var alpha, beta, gamma, p,currentPoint;
for(var i=0;i<peakPicking.length;i++){
    var signal = peakPicking[i];
    //console.log(signal);
    signal.multiplicity = "ms";
    signal.J = [];
    signal.peaksComp = [];
    if(Math.abs(signal.delta1-4.3)<0.1)
        compilePattern(signal);
    signal.JString="";
    for(var j=0;j<signal.J.length;j++){
        signal.JString+=signal.J[j].toFixed(1)+", ";
    }
    signal.cs = signal.delta1.toFixed(2);
    //console.log(signal);
    signal.peaksComp = signal.peaks;
    for(j=0;j<signal.peaksComp.length;j++){
        listP.push(signal.peaksComp[j].x);//signal.observe);
        listP.push(signal.peaksComp[j].intensity);
    }

}
//console.log(listP);
set("listP",listP);

//This is to display the signals. nothing important only cosmetic
peakPicking.sort(function(a,b){
    return a.integralData.value<b.integralData.value?1:-1;
});
//We can remove some peak with low integral. But I would hope not to have those signals if the impurities
//detection works well
var clean = false;
if(clean){
    var j = peakPicking.length-1;
    while(peakPicking[j].integralData.value<0.5&&j>=0){
        peakPicking.splice(j,1);
        j--;
    }
}
//Beautify the signals and add the unique id
for(var j=0;j<peakPicking.length;j++){
    peakPicking[j]._highlight=[-(j+1)];
    peakPicking[j].startX=Math.round(peakPicking[j].startX*1000)/1000;
    peakPicking[j].stopX=Math.round(peakPicking[j].stopX*1000)/1000;
    peakPicking[j].integralData.value=Math.round(peakPicking[j].integralData.value);//Math.round(peakPicking[j].integralData.value*100)/100;
}

API.createData("log", "1h peak picking done!");

set("h1PL",peakPicking);

