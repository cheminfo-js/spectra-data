/**
 * Created by acastillo on 4/5/15.
 */
var pascalTriangle = [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1],[1,5,10,10,5,1]];
var symRatio = 2;
var delta = 0.6;
var maxError = 0.001;//ppm
var DEBUG = true;

var compilePattern = function(signal){
    signal.multiplicity="ms";
    //1.1 symmetrice
    symmetrice(signal);
    var i,j,min,max,k=1,P1,Jc=[];
    for(var n=5;n<6;n++){
        console.log("Trying "+n);
        //1.2 Normalize. It makes a deep copy of the peaks before to modify them.
        var peaks = normalize(signal,n);
        if(peaks.length == 1){
            signal.multiplicity = "s";
            continue;
        }
        //1.3 Establish a range for the Heights Hi [peaks.intensity*0.85,peaks.intensity*1.15];
        var ranges = getRanges(peaks);
        var n2 = Math.pow(2,n);
        if(DEBUG){
            console.log(ranges);
            console.log("Target sum: "+n2);
        }
        //console.log(ranges);
        //1.4 Find a combination of integer heights Hi, one from each Si, that sums to 2^n.
        var heights = null;
        Jc = [];
        while((heights = getNextCombination(ranges, n2))!==null&&Jc.length===0){
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
                console.log();
                for(j=0;j<heights[i];j++){
                    numbering[i][j]=k++;
                }
            }
            Jc = [];//The j couplings array.
            j=1;
            //Set j = 1; J1 = P2 - P1. Flag components 1 and 2 as accounted for.
            Jc.push(peaks[1].x-peaks[0].x);
            P1 = peaks[0].x;
            numbering[0].splice(0,1);
            numbering[1].splice(0,1);
            k=1;
            var nFlagged = 2;
            n2 = Math.pow(2,n)-1;
            while(Jc.length<n&&nFlagged<n2&&k<peaks.length){
                if(DEBUG){
                    console.log(JSON.stringify(numbering));
                    console.log(Jc);
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
                    numbering[k].splice(0,1);
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
                            if(Math.abs(peaks[i].x-(P1+jSum))<0.0025){
                                numbering[i].splice(0,1);
                                break;
                            }
                        }
                    }
                }
            }
            //console.log(JSON.stringify(numbering));
            signal.multiplicity = "";
            for( i=0;i<Jc.length;i++){
                //console.log("Heree");
                Jc[i]=Math.abs(Jc[i]*signal.observe);
                signal.multiplicity+= "d";
            }
            console.log(Jc);
            signal.J = Jc;
        }
    }
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
        //console.log(ranges.currentIndex);
        sum=0;
        for(i=0;i<half;i++){
            sum+= ranges.values[i][ranges.currentIndex[i]]*2;
        }
        if(ranges.values.length%2!==0){
            sum-= ranges.values[half-1][ranges.currentIndex[half-1]];
        }
    }

    if(sum==value){
        console.log(sum);
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
/**
 * This function will return a set of symmetric peaks that will
 * be the enter point for the patter compilation process.
 */
var symmetrice = function(signal){
    //Before to symmetrice we need to keep only the peaks that possibly conforms the multiplete
    var max, min, avg, ratio;
    var peaks = new Array(signal.peaks.length);
    for(j=0;j<peaks.length;j++){
        peaks[j]= {x:signal.peaks[j].x, intensity:signal.peaks[j].intensity};
    }
    signal.peaksComp = peaks;
    var nbPeaks = peaks.length;
    var mask = new Array(nbPeaks);
    var left=0, right=peaks.length-1;
    var cs = signal.delta1;
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
                if(Math.min(diffL,diffR)/Math.max(diffL,diffR)>delta){
                    //avg = (peaks[left].intensity+peaks[right].intensity)/2;
                    avg = Math.min(peaks[left].intensity,peaks[right].intensity);
                    peaks[left].intensity=avg
                    peaks[right].intensity=avg;
                }
                else{
                    mask[left] = false;
                    mask[right] = false;
                    if(Math.max(diffL,diffR)==diffR){
                        mask[right] = false;
                        left--;
                    }
                    else{
                        mask[left] = false;
                        right++;
                    }
                }
            }
        }
        left++;
        right--;
        cs = chemicalShift(peaks, mask);
        //console.log("Chemical shift "+cs);
    }
    //To remove the weak peaks and recalculate the cs
    for(i=nbPeaks-1;i>=0;i--){
        if(mask[i]===false){
            peaks.splice(i,1);
        }
    }

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
        if(peaks[i].intensity<0.5){
            if(DEBUG)
                console.log("Peak "+i+" does not seem to belong to this multiplet "+peaks[i].intensity);
            peaks.splice(i,1);
        }
    }
    return peaks;
}

var chemicalShift = function(peaks, mask){
    var sum=0,cs=0;
    //console.log(peaks.length);
    for(var i=0;i<peaks.length;i++){
        //console.log(mask[i]);
        if(mask[i]===true){
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

var peakPicking = spectrum.nmrPeakDetection({"nH":nH,realTop:true});
//The peak picking depends on the spectrum, and in the given number of hidrogens
//var result = spectrum.nmrPeakDetection({"nH":nH});

//This is to show the raw peakList. You will need the peaks you still.
var listP = [];
var alpha, beta, gamma, p,currentPoint;
for(var i=0;i<peakPicking.length;i++){
    var signal = peakPicking[i];
    //console.log(signal);
    signal.multiplicity = "ms";
    if(Math.abs(signal.delta1-1.3183)<0.1)
        compilePattern(signal);
    //console.log(signal);
    signal.peaksComp = signal.peaks;
    for(j=0;j<signal.peaksComp.length;j++){
        listP.push(signal.peaksComp[j].x);
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

