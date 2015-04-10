/**
 * This library implements the J analyser described by Cobas et al in the paper:
 * A two-stage approach to automatic determination of 1H NMR coupling constants
 * Created by acastillo on 4/5/15.
 */
var JAnalyzer = {
    pascalTriangle : [[0],[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1],[1,5,10,10,5,1],[1,6,15,20,15,6,1]],
    patterns: ["s","d","t","q","quint","h","sept","o","n"],
    symRatio : 2.2,
    maxErrorIter1 : 2,//Hz
    maxErrorIter2 : 1,//Hz
    DEBUG : false,

    /**
     * The compilation process implements at the first stage a normalization procedure described by Golotvin et al.
     * embedding in peak-component-counting method described by Hoyes et al.
     * @param signal
     */
    compilePattern : function(signal){

        if(this.DEBUG)console.log("Debugin...");

        signal.multiplicity="massive";//By default the multiplicity is massive
        // 1.1 symmetrize
        // It will add a set of peaks(signal.peaksComp) to the signal that will be used during
        // the compilation process. The unit of those peaks will be in Hz
        signal.symRank = this.symmetrizeChoiseBest(signal,this.maxErrorIter1,1);

        //Is the signal asymmetric?
        if(signal.symRank<0.95){
            return;
        }

        if(this.DEBUG)console.log(signal.delta1+ " nbPeaks "+signal.peaksComp.length);

        var i,j,min,max,k=1,P1,Jc=[],n2,maxFlagged;

        //Lets check if the signal could be a singulet.
        var peaks = this.normalize(signal,0);
        if(peaks.length == 1){
            //Lets mark it like that for now, but it can change within the next loop
            signal.multiplicity = "s";
        }
        //Loop over the possible number of coupling contributing to the multiplet
        for(var n=1;n<9;n++){
            if(this.DEBUG)console.log("Trying "+n+" couplings");

            //1.2 Normalize. It makes a deep copy of the peaks before to modify them.
            peaks = this.normalize(signal,n);

            if(peaks.length == 1){
                continue;
            }
            // 1.3 Establish a range for the Heights Hi [peaks.intensity*0.85,peaks.intensity*1.15];
            var ranges = this.getRanges(peaks);
            n2 = Math.pow(2,n);
            
            if(this.DEBUG){
                console.log("ranges: "+JSON.stringify(ranges));
                console.log("Target sum: "+n2);
            }
            
            // 1.4 Find a combination of integer heights Hi, one from each Si, that sums to 2^n.
            var heights = null;
            var validPattern = false;//It will change to true, when we find the good patter
            while(!validPattern&&(heights = this.getNextCombination(ranges, n2))!==null){
                
                if(this.DEBUG){
                    console.log("Possible pattern found with "+n+" couplings!!!");
                    console.log(heights);
                }
                // 2.1 Number the components of the multiplet consecutively from 1 to 2n,
                //starting at peak 1
                var numbering = new Array(heights.length);
                k=1;
                for(i=0;i<heights.length;i++){
                    numbering[i]=new Array(heights[i]);
                    for(j=0;j<heights[i];j++){
                        numbering[i][j]=k++;
                    }
                }
                if(this.DEBUG){
                    console.log("Numbering: "+JSON.stringify(numbering));
                }
                Jc = []; //The array to store the detected j-coupling
                // 2.2 Set j = 1; J1 = P2 - P1. Flag components 1 and 2 as accounted for.
                j=1;
                Jc.push(peaks[1].x-peaks[0].x);
                P1 = peaks[0].x;
                numbering[0].splice(0,1);//Flagged
                numbering[1].splice(0,1);//Flagged
                k=1;
                var nFlagged = 2;
                maxFlagged = Math.pow(2,n)-1;
                while(Jc.length<n&&nFlagged<maxFlagged&&k<peaks.length){
                    if(this.DEBUG){
                        console.log("New Jc"+JSON.stringify(Jc));
                        console.log("Aval. numbering "+JSON.stringify(numbering));
                    }
                    // 4.1. Increment j. Set k to the number of the first unflagged component.
                    j++;
                    while(k<peaks.length&&numbering[k].length===0){
                        k++;
                    }

                    if(k<peaks.length){
                        // 4.2 Jj = Pk - P1.
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
                                //Maybe 0.25 Hz is too much?
                                if(Math.abs(peaks[i].x-(P1+jSum))<0.25){
                                    numbering[i].splice(0,1);//Flageed
                                    nFlagged++;
                                    break;
                                }
                            }
                        }
                    }
                }
                //Calculate the ideal patter by using the extracted j-couplings
                var pattern = this.idealPattern(Jc);
                //Compare the ideal pattern with the proposed intensities.
                // All the intensities have to match to accept the multiplet
                validPattern = true;
                for(i=0;i<pattern.length;i++){
                    if(pattern[i].intensity != heights[i])
                        validPattern = false;
                }
                //More verbosity of the process
                if(this.DEBUG){
                    console.log("Jc "+JSON.stringify(Jc));
                    console.log("Heights "+JSON.stringify(heights));
                    console.log("pattern "+JSON.stringify(pattern));
                    console.log("Valid? "+validPattern);
                }
            }
            //If we found a valid pattern we should inform about the patter.
            //I'm lazy so it will be just doublets of doublets
            if(validPattern){
                signal.multiplicity = "";
                signal.nmrJs = new Array(Jc.length);
                for( i=0;i<Jc.length;i++){
                    signal.nmrJs[i]={coupling:Math.abs(Jc[i])};
                    signal.multiplicity+= "d";
                }

                if(this.DEBUG){
                    console.log("Final j-couplings: "+JSON.stringify(Jc));
                }
            }
        }
        signal.pattern=signal.multiplicity;//Our library depends on this parameter, but it is old
        //Before to return, change the units of peaksComp from Hz to PPM again
        for(i=0;i<signal.peaksComp.length;i++){
            signal.peaksComp[i].x/=signal.observe;
        }
    },

    /**
     *This function creates an ideal pattern from the given J-couplings
     */
    idealPattern : function(Jc){
        var hsum = Math.pow(2,Jc.length),i,j;
        var pattern = [{x:0,intensity:hsum}];
        //To split the initial height
        for(i=0;i<Jc.length;i++){
            for(j=pattern.length-1;j>=0;j--){
                pattern.push({x:pattern[j].x+Jc[i]/2,
                    intensity:pattern[j].intensity/2});
                pattern[j].x = pattern[j].x-Jc[i]/2;
                pattern[j].intensity = pattern[j].intensity/2;
            }
        }
        //To sum the heights in the same positions
        pattern.sort(function compare(a,b) { return a.x-b.x});
        for(j=pattern.length-2;j>=0;j--){
            if(Math.abs(pattern[j].x-pattern[j+1].x)<0.1){
                pattern[j].intensity+= pattern[j+1].intensity
                pattern.splice(j+1,1);
            }
        }
        return pattern;
    },

    /**
     * Find a combination of integer heights Hi, one from each Si, that sums to 2n.
     */
    getNextCombination : function(ranges, value){
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
            // Sum the heights for this combination
            sum=0;
            for(i=0;i<half;i++){
                sum+= ranges.values[i][ranges.currentIndex[i]]*2;
            }
            if(ranges.values.length%2!==0){
                sum-= ranges.values[half-1][ranges.currentIndex[half-1]];
            }
            if(this.DEBUG){
                console.log(ranges.currentIndex);
                console.log(sum+" "+value);
            }
        }
        //If the sum is equal to the expected value, fill the array to return
        if(sum==value){
            var heights = new Array(lng);
            for(i=0;i<half;i++){
                heights[i] = ranges.values[i][ranges.currentIndex[i]];
                heights[lng-i-1] = ranges.values[i][ranges.currentIndex[i]];
            }
            return heights;
        }
        return null;
    },

    /**
     * This function generates the possible values that each peak can contribute
     * to the multiplet.
     * @param peaks
     * @returns {{values: Array, currentIndex: Array, active: number}}
     */
    getRanges : function(peaks){
        var ranges = new Array(peaks.length);
        var currentIndex = new Array(peaks.length);
        var min,max;
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
    },
    /**
     * Performs a symmetrization of the signal by using different aproximations to the center. 
     * It will return the result of the symmetrization that removes less peaks from the signal
     * @param signal
     * @param maxError
     * @param iteration
     * @returns {*}
     */
    symmetrizeChoiseBest : function(signal,maxError,iteration){
        var symRank1 = this.symmetrize(signal,maxError,iteration);
        var tmpPeaks = signal.peaksComp;
        var cs = signal.delta1;
        signal.delta1 = (signal.peaks[0].x+signal.peaks[signal.peaks.length-1].x)/2;
        var symRank2 = this.symmetrize(signal,maxError,iteration);
        if(signal.peaksComp.length>tmpPeaks.length)
            return symRank2;
        else{
            signal.delta1 = cs;
            signal.peaksComp = tmpPeaks;
            return symRank1;
        }

    },
    /**
     * This function will return a set of symmetric peaks that will
     * be the enter point for the patter compilation process.
     */
    symmetrize : function(signal, maxError, iteration){
        //Before to symmetrize we need to keep only the peaks that possibly conforms the multiplete
        var max, min, avg, ratio, avgWidth;
        var peaks = new Array(signal.peaks.length);
        //Make a deep copy of the peaks and convert PPM ot HZ
        for(j=0;j<peaks.length;j++){
            peaks[j]= {x:signal.peaks[j].x*signal.observe,
                       intensity:signal.peaks[j].intensity,
                       width:signal.peaks[j].width};
        }
        //Join the peaks that are closer than 0.25 Hz
        for(j=peaks.length-2;j>=0;j--){
            if(Math.abs(peaks[j].x-peaks[j+1].x)<0.25){
                peaks[j].x = (peaks[j].x*peaks[j].intensity+peaks[j+1].x*peaks[j+1].intensity);
                peaks[j].intensity = peaks[j].intensity+peaks[j+1].intensity;
                peaks[j].x/=peaks[j].intensity;
                peaks[j].intensity/=2;
                peaks[j].width+=peaks[j+1].width;
                peaks.splice(j+1,1);
            }

        }
        signal.peaksComp = peaks;
        var nbPeaks = peaks.length;
        var mask = new Array(nbPeaks);
        var left=0, right=peaks.length-1;
        var cs = signal.delta1*signal.observe;
        var heightSum = 0;
        //We try to symmetrize the extreme peaks. We consider as candidates for symmetricing those which
        //ratio smaller than 3
        for(var i=0;i<nbPeaks;i++){
            mask[i]= true;
            heightSum+=signal.peaks[i].intensity;
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
                if(ratio>this.symRatio){
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
                        avgWidth = Math.min(peaks[left].width,peaks[right].width);
                        peaks[left].intensity=avg
                        peaks[right].intensity=avg;
                        peaks[left].width=avgWidth
                        peaks[right].width=avgWidth;
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
                    if(this.DEBUG){
                        console.log(iteration+" CS: "+cs+" Hz "+cs/signal.observe+" PPM");
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
                cs = this.chemicalShift(peaks, mask);
                //There is not more available peaks
                if(isNaN(cs)){
                    console.log("No more signals");
                    return 0;
                }
            }
        }
        //To remove the weak peaks and recalculate the cs
        for(i=nbPeaks-1;i>=0;i--){
            if(mask[i]===false){
                peaks.splice(i,1);
            }
        }
        cs = this.chemicalShift(peaks);
        if(isNaN(cs)){
            return 0;
        }
        signal.delta1 = cs/signal.observe;
        //Now, the peak should be symmetric in heights, but we need to know if it is symmetric in x
        var symFactor = 0;
        if(peaks.length>1){
            var weight = 0;
            for(i=Math.ceil(peaks.length/2)-1;i>=0;i--){
                symFactor+=Math.min(Math.abs(peaks[i].x-cs),Math.abs(peaks[peaks.length-1-i].x-cs))
                /Math.max(Math.abs(peaks[i].x-cs),Math.abs(peaks[peaks.length-1-i].x-cs))*peaks[i].intensity;
                weight+=peaks[i].intensity;
            }
            symFactor/=weight;///(Math.ceil(peaks.length/2));
        }
        else{
            if(peaks.length==1)
                symFactor=1;
        }
        var newSumHeights = 0;
        for(i=0;i<peaks.length;i++){
            newSumHeights+=peaks[i].intensity;
        }
        symFactor-=(heightSum-newSumHeights)/heightSum*0.1; //Removed peaks penalty
        if(this.DEBUG){
            console.log("Penalty "+(heightSum-newSumHeights)/heightSum*0.1);
            console.log("cs: "+(cs/signal.observe)+" symFactor: "+symFactor);
        }
        //Sometimes we need a second opinion after the first symmetrization.
        if(symFactor>0.8&&symFactor<0.97&&iteration<2){
            return this.symmetrize(signal, this.maxErrorIter2, 2);
        }{
            //Center the given pattern at cs and symmetrize x
            if(peaks.length>1) {
                var weight = 0, dxi;
                for (i = Math.ceil(peaks.length / 2) - 1; i >= 0; i--) {
                    dxi = (peaks[i].x - peaks[peaks.length - 1 - i].x)/2.0;
                    peaks[i].x =cs+dxi;
                    peaks[peaks.length - 1 - i].x=cs-dxi;
                }
            }
        }
        return symFactor;
    },
    /**
     * Normalize the heights of the peaks to Math.pow(2,n)
     * @param signal
     * @param n
     * @returns {*}
     */
    normalize : function(signal, n){
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
                if(this.DEBUG)
                    console.log("Peak "+i+" does not seem to belong to this multiplet "+peaks[i].intensity);
                peaks.splice(i,1);
            }
        }
        if(this.DEBUG) console.log(JSON.stringify(peaks));
        return peaks;
    },

    /**
     * Calculates the chemical shift as the weighted sum of the peaks
     * @param peaks
     * @param mask
     * @returns {number}
     */
    chemicalShift : function(peaks, mask){
        var sum=0,cs= 0, i, area;
        if(mask){
            for(i=0;i<peaks.length;i++){
                //console.log(mask[i]);
                if(mask[i]===true){
                    area = this.area(peaks[i]);
                    sum+=area;
                    cs+=area*peaks[i].x;
                }
            }
        }
        else{
            for(i=0;i<peaks.length;i++){
                area = this.area(peaks[i]);
                sum+=area;
                cs+=area*peaks[i].x;
            }
        }
        return cs/sum;
    },

    /*chemicalShift : function(peaks, mask){
        var sum=0,cs= 0, i, area;
        if(mask){
            for(i=0;i<peaks.length;i++){
                //console.log(mask[i]);
                if(mask[i]===true){
                    area = this.area(peaks[i]);
                    sum+=peaks[i].intensity;
                    cs+=peaks[i].intensity*peaks[i].x;
                }
            }
        }
        else{
            for(i=0;i<peaks.length;i++){
                sum+=peaks[i].intensity;
                cs+=peaks[i].intensity*peaks[i].x;
            }
        }
        return cs/sum;
    }*/

    area: function(peak){
        return Math.abs(peak.intensity*peak.width*1.772453851);
    }
}

module.exports = JAnalyzer;