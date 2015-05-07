/**
 * Implementation of the peak pickig method described by Cobas in:
 * A new approach to improving automated analysis of proton NMR spectra
 * through Global Spectral Deconvolution (GSD)
 * http://www.spectroscopyeurope.com/images/stories/ColumnPDFs/TD_23_1.pdf
 */
var JAnalyzer = require('./JAnalyzer');
var PeakPicking={
    impurities:[],
    maxJ:20,

    peakPicking:function(spectrum, options){
        options = options||{nH:10, clean:true, realTop:false, thresholdFactor:1, compile:true}

        var nH=options.nH||10;
        //options.realTop = options.realTop||false;
        //options.thresholdFactor = options.thresholdFactor || 1;
        //options.compile = options.compile || false;
        //options.clean = options.clean || false;
        var peakList = this.GSD(spectrum, options.thresholdFactor||1);

        if(options.realTop || false)
            this.realTopDetection(peakList,spectrum);
        //console.log(peakList);
        var signals = this.detectSignals(peakList, spectrum, nH);
        //Remove all the signals with small integral
        if(options.clean||false){
            for(var i=signals.length-1;i>=0;i--){
                if(signals[i].integralData.value<0.5) {
                    signals.splice(i, 1);
                }
            }
        }
        if(options.compile||false){
            for(var i=signals.length-1;i>=0;i--){
                JAnalyzer.compilePattern(signals[i]);
            }
            this.updateIntegrals(signals, nH);
        }
        //For now just return the peak List
        //@TODO work in the peakPicking
        return signals;

        /*var frequency = spectrum.observeFrequencyX();//getParamDouble("$BF1",400);
        var imp = this.labelPeaks(peakList, solvent, frequency);
        return [peakList,imp];
        */
        //return createSignals(peakList,nH);
    },

    updateLimits : function(signal){
        if(signal.multiplicity!="m" && signal.multiplicity!=""){
            //Remove the integral of the removed peaks
            var peaksO = signal.peaks;
            var nbPeaks0 = peaksO.length, index = 0, factor = 0, toRemove = 0;

            for(var i=0;i<nbPeaks0;i++){
                if(signal.maskPattern[i]===false)
                    toRemove+=this.area(peaksO[i])*0.666;
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
            for(i=0;i<signals.length;i++){
                //Re-assign the integral to the remaining signals.
                sumIntegral+=this.updateLimits(signals[i]);
                sumObserved+=Math.round(signals[i].integralData.value);
            }
            sumIntegral=nH/sumIntegral;
            for(i=0;i<signals.length;i++){
                signals[i].integralData.value*=sumIntegral;
            }
        }
    },

    realTopDetection: function(peakList, spectrum){
        var listP = [];
        var alpha, beta, gamma, p,currentPoint;
        for(j=0;j<peakList.length;j++){
            currentPoint = spectrum.unitsToArrayPoint(peakList[j][0]);
            //The detected peak could be moved 1 or 2 unit to left or right.
            if(spectrum.getY(currentPoint-1)>=spectrum.getY(currentPoint-2)
                &&spectrum.getY(currentPoint-1)>=spectrum.getY(currentPoint)) {
                currentPoint--;
            }
            else{
                if(spectrum.getY(currentPoint+1)>=spectrum.getY(currentPoint)
                    &&spectrum.getY(currentPoint+1)>=spectrum.getY(currentPoint+2)) {
                    currentPoint++;
                }
                else{
                    if(spectrum.getY(currentPoint-2)>=spectrum.getY(currentPoint-3)
                        &&spectrum.getY(currentPoint-2)>=spectrum.getY(currentPoint-1)) {
                        currentPoint-=2;
                    }
                    else{
                        if(spectrum.getY(currentPoint+2)>=spectrum.getY(currentPoint+1)
                            &&spectrum.getY(currentPoint+2)>=spectrum.getY(currentPoint+3)) {
                            currentPoint+=2;
                        }
                    }
                }
            }
            if(spectrum.getY(currentPoint-1)>0&&spectrum.getY(currentPoint+1)>0
                &&spectrum.getY(currentPoint)>=spectrum.getY(currentPoint-1)
                &&spectrum.getY(currentPoint)>=spectrum.getY(currentPoint+1)) {
                alpha = 20 * Math.log10(spectrum.getY(currentPoint - 1));
                beta = 20 * Math.log10(spectrum.getY(currentPoint));
                gamma = 20 * Math.log10(spectrum.getY(currentPoint + 1));
                p = 0.5 * (alpha - gamma) / (alpha - 2 * beta + gamma);

                peakList[j][0] = spectrum.arrayPointToUnits(currentPoint + p);
                peakList[j][1] = spectrum.getY(currentPoint) - 0.25 * (spectrum.getY(currentPoint - 1) - spectrum.getY(currentPoint + 1)) * p;//signal.peaks[j].intensity);

            }
        }
    },

    /**
     * Should we read the impurities table from somewhere else?
     */
    init:function(){
        this.impurities = [{"impurities":[{"shifts":[{"proton":"X","coupling":0,"multiplicity":"","shift":7.26}],"name":"solvent_residual_peak"},{"shifts":[{"proton":"H2O","coupling":0,"multiplicity":"s","shift":1.56}],"name":"H2O"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.1}],"name":"acetic_acid"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.17}],"name":"acetone"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.1}],"name":"acetonitrile"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.36}],"name":"benzene"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.28}],"name":"tert-butyl_alcohol"},{"shifts":[{"proton":"CCH3","coupling":0,"multiplicity":"s","shift":1.19},{"proton":"OCH3","coupling":0,"multiplicity":"s","shift":3.22}],"name":"tert-butyl_methyl_ether"},{"shifts":[{"proton":"ArH","coupling":0,"multiplicity":"s","shift":6.98},{"proton":"OHc","coupling":0,"multiplicity":"s","shift":5.01},{"proton":"ArCH3","coupling":0,"multiplicity":"s","shift":2.27},{"proton":"ArC(CH3)3","coupling":0,"multiplicity":"s","shift":1.43}],"name":"BHTb"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.26}],"name":"chloroform"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":1.43}],"name":"cyclohexane"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.73}],"name":"1,2-dichloroethane"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":5.3}],"name":"dichloromethane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.21},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":3.48}],"name":"diethyl_ether"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"m","shift":3.65},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":3.57},{"proton":"OCH3","coupling":0,"multiplicity":"s","shift":3.39}],"name":"diglyme"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.4},{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.55}],"name":"1,2-dimethoxyethane"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":2.09},{"proton":"NCH3","coupling":0,"multiplicity":"s","shift":3.02},{"proton":"NCH3","coupling":0,"multiplicity":"s","shift":2.94}],"name":"dimethylacetamide"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":8.02},{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.96},{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.88}],"name":"dimethylformamide"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.62}],"name":"dimethyl_sulfoxide"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.71}],"name":"dioxane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.25},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":3.72},{"proton":"OH","coupling":5,"multiplicity":"s,t","shift":1.32}],"name":"ethanol"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":2.05},{"proton":"CH2CH3","coupling":7,"multiplicity":"q","shift":4.12},{"proton":"CH2CH3","coupling":7,"multiplicity":"t","shift":1.26}],"name":"ethyl_acetate"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":2.14},{"proton":"CH2CH3","coupling":7,"multiplicity":"q","shift":2.46},{"proton":"CH2CH3","coupling":7,"multiplicity":"t","shift":1.06}],"name":"ethyl_methyl_ketone"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":3.76}],"name":"ethylene_glycol"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"m","shift":0.86},{"proton":"CH2","coupling":0,"multiplicity":"br_s","shift":1.26}],"name":"grease^f"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"t","shift":0.88},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.26}],"name":"n-hexane"},{"shifts":[{"proton":"CH3","coupling":9.5,"multiplicity":"d","shift":2.65}],"name":"HMPAg"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.49},{"proton":"OH","coupling":0,"multiplicity":"s","shift":1.09}],"name":"methanol"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":4.33}],"name":"nitromethane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":7},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.27}],"name":"n-pentane"},{"shifts":[{"proton":"CH3","coupling":6,"multiplicity":"d","shift":1.22},{"proton":"CH","coupling":6,"multiplicity":"sep","shift":4.04}],"name":"2-propanol"},{"shifts":[{"proton":"CH(2)","coupling":0,"multiplicity":"m","shift":8.62},{"proton":"CH(3)","coupling":0,"multiplicity":"m","shift":7.29},{"proton":"CH(4)","coupling":0,"multiplicity":"m","shift":7.68}],"name":"pyridine"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":0.07}],"name":"silicone_greasei"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.85},{"proton":"CH2O","coupling":0,"multiplicity":"m","shift":3.76}],"name":"tetrahydrofuran"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.36},{"proton":"CH(o/p)","coupling":0,"multiplicity":"m","shift":7.17},{"proton":"CH(m)","coupling":0,"multiplicity":"m","shift":7.25}],"name":"toluene"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.03},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":2.53}],"name":"triethylamine"}],"solvent":"CDCl3"},{"impurities":[{"shifts":[{"proton":"X","coupling":0,"multiplicity":"","shift":2.05}],"name":"solvent_residual_peak"},{"shifts":[{"proton":"H2O","coupling":0,"multiplicity":"s","shift":2.84}],"name":"H2O"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.96}],"name":"acetic_acid"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.09}],"name":"acetone"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.05}],"name":"acetonitrile"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.36}],"name":"benzene"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.18}],"name":"tert-butyl_alcohol"},{"shifts":[{"proton":"CCH3","coupling":0,"multiplicity":"s","shift":1.13},{"proton":"OCH3","coupling":0,"multiplicity":"s","shift":3.13}],"name":"tert-butyl_methyl_ether"},{"shifts":[{"proton":"ArH","coupling":0,"multiplicity":"s","shift":6.96},{"proton":"ArCH3","coupling":0,"multiplicity":"s","shift":2.22},{"proton":"ArC(CH3)3","coupling":0,"multiplicity":"s","shift":1.41}],"name":"BHTb"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":8.02}],"name":"chloroform"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":1.43}],"name":"cyclohexane"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.87}],"name":"1,2-dichloroethane"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":5.63}],"name":"dichloromethane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.11},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":3.41}],"name":"diethyl_ether"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"m","shift":3.56},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":3.47},{"proton":"OCH3","coupling":0,"multiplicity":"s","shift":3.28}],"name":"diglyme"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.28},{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.46}],"name":"1,2-dimethoxyethane"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":1.97},{"proton":"NCH3","coupling":0,"multiplicity":"s","shift":3},{"proton":"NCH3","coupling":0,"multiplicity":"s","shift":2.83}],"name":"dimethylacetamide"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.96},{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.94},{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.78}],"name":"dimethylformamide"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.52}],"name":"dimethyl_sulfoxide"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.59}],"name":"dioxane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.12},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":3.57},{"proton":"OH","coupling":5,"multiplicity":"s,t","shift":3.39}],"name":"ethanol"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":1.97},{"proton":"CH2CH3","coupling":7,"multiplicity":"q","shift":4.05},{"proton":"CH2CH3","coupling":7,"multiplicity":"t","shift":1.2}],"name":"ethyl_acetate"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":2.07},{"proton":"CH2CH3","coupling":7,"multiplicity":"q","shift":2.45},{"proton":"CH2CH3","coupling":7,"multiplicity":"t","shift":0.96}],"name":"ethyl_methyl_ketone"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":3.28}],"name":"ethylene_glycol"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"m","shift":0.87},{"proton":"CH2","coupling":0,"multiplicity":"br_s","shift":1.29}],"name":"grease^f"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"t","shift":0.88},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.28}],"name":"n-hexane"},{"shifts":[{"proton":"CH3","coupling":9.5,"multiplicity":"d","shift":2.59}],"name":"HMPAg"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.31},{"proton":"OH","coupling":0,"multiplicity":"s","shift":3.12}],"name":"methanol"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":4.43}],"name":"nitromethane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":0.88},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.27}],"name":"n-pentane"},{"shifts":[{"proton":"CH3","coupling":6,"multiplicity":"d","shift":1.1},{"proton":"CH","coupling":6,"multiplicity":"sep","shift":3.9}],"name":"2-propanol"},{"shifts":[{"proton":"CH(2)","coupling":0,"multiplicity":"m","shift":8.58},{"proton":"CH(3)","coupling":0,"multiplicity":"m","shift":7.35},{"proton":"CH(4)","coupling":0,"multiplicity":"m","shift":7.76}],"name":"pyridine"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":0.13}],"name":"silicone_greasei"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.79},{"proton":"CH2O","coupling":0,"multiplicity":"m","shift":3.63}],"name":"tetrahydrofuran"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.32},{"proton":"CH(o/p)","coupling":0,"multiplicity":"m","shift":7.5},{"proton":"CH(m)","coupling":0,"multiplicity":"m","shift":7.5}],"name":"toluene"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":0.96},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":2.45}],"name":"triethylamine"}],"solvent":"(CD3)2CO"},{"impurities":[{"shifts":[{"proton":"X","coupling":0,"multiplicity":"","shift":2.5}],"name":"solvent_residual_peak"},{"shifts":[{"proton":"H2O","coupling":0,"multiplicity":"s","shift":3.33}],"name":"H2O"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.91}],"name":"acetic_acid"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.09}],"name":"acetone"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.07}],"name":"acetonitrile"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.37}],"name":"benzene"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.11},{"proton":"OHc","coupling":0,"multiplicity":"s","shift":4.19}],"name":"tert-butyl_alcohol"},{"shifts":[{"proton":"CCH3","coupling":0,"multiplicity":"s","shift":1.11},{"proton":"OCH3","coupling":0,"multiplicity":"s","shift":3.08}],"name":"tert-butyl_methyl_ether"},{"shifts":[{"proton":"ArH","coupling":0,"multiplicity":"s","shift":6.87},{"proton":"OHc","coupling":0,"multiplicity":"s","shift":6.65},{"proton":"ArCH3","coupling":0,"multiplicity":"s","shift":2.18},{"proton":"ArC(CH3)3","coupling":0,"multiplicity":"s","shift":1.36}],"name":"BHTb"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":8.32}],"name":"chloroform"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":1.4}],"name":"cyclohexane"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.9}],"name":"1,2-dichloroethane"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":5.76}],"name":"dichloromethane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.09},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":3.38}],"name":"diethyl_ether"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"m","shift":3.51},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":3.38},{"proton":"OCH3","coupling":0,"multiplicity":"s","shift":3.24}],"name":"diglyme"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.24},{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.43}],"name":"1,2-dimethoxyethane"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":1.96},{"proton":"NCH3","coupling":0,"multiplicity":"s","shift":2.94},{"proton":"NCH3","coupling":0,"multiplicity":"s","shift":2.78}],"name":"dimethylacetamide"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.95},{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.89},{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.73}],"name":"dimethylformamide"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.54}],"name":"dimethyl_sulfoxide"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.57}],"name":"dioxane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.06},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":3.44},{"proton":"OH","coupling":5,"multiplicity":"s,t","shift":4.63}],"name":"ethanol"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":1.99},{"proton":"CH2CH3","coupling":7,"multiplicity":"q","shift":4.03},{"proton":"CH2CH3","coupling":7,"multiplicity":"t","shift":1.17}],"name":"ethyl_acetate"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":2.07},{"proton":"CH2CH3","coupling":7,"multiplicity":"q","shift":2.43},{"proton":"CH2CH3","coupling":7,"multiplicity":"t","shift":0.91}],"name":"ethyl_methyl_ketone"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":3.34}],"name":"ethylene_glycol"},{"shifts":[],"name":"grease^f"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"t","shift":0.86},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.25}],"name":"n-hexane"},{"shifts":[{"proton":"CH3","coupling":9.5,"multiplicity":"d","shift":2.53}],"name":"HMPAg"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.16},{"proton":"OH","coupling":0,"multiplicity":"s","shift":4.01}],"name":"methanol"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":4.42}],"name":"nitromethane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":0.88},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.27}],"name":"n-pentane"},{"shifts":[{"proton":"CH3","coupling":6,"multiplicity":"d","shift":1.04},{"proton":"CH","coupling":6,"multiplicity":"sep","shift":3.78}],"name":"2-propanol"},{"shifts":[{"proton":"CH(2)","coupling":0,"multiplicity":"m","shift":8.58},{"proton":"CH(3)","coupling":0,"multiplicity":"m","shift":7.39},{"proton":"CH(4)","coupling":0,"multiplicity":"m","shift":7.79}],"name":"pyridine"},{"shifts":[],"name":"silicone_greasei"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.76},{"proton":"CH2O","coupling":0,"multiplicity":"m","shift":3.6}],"name":"tetrahydrofuran"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.3},{"proton":"CH(o/p)","coupling":0,"multiplicity":"m","shift":7.18},{"proton":"CH(m)","coupling":0,"multiplicity":"m","shift":7.25}],"name":"toluene"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":0.93},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":2.43}],"name":"triethylamine"}],"solvent":"(CD3)2SO/DMSO"},{"impurities":[{"shifts":[{"proton":"X","coupling":0,"multiplicity":"","shift":7.16}],"name":"solvent_residual_peak"},{"shifts":[{"proton":"H2O","coupling":0,"multiplicity":"s","shift":0.4}],"name":"H2O"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.55}],"name":"acetic_acid"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.55}],"name":"acetone"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.55}],"name":"acetonitrile"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.15}],"name":"benzene"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.05},{"proton":"OHc","coupling":0,"multiplicity":"s","shift":1.55}],"name":"tert-butyl_alcohol"},{"shifts":[{"proton":"CCH3","coupling":0,"multiplicity":"s","shift":1.07},{"proton":"OCH3","coupling":0,"multiplicity":"s","shift":3.04}],"name":"tert-butyl_methyl_ether"},{"shifts":[{"proton":"ArH","coupling":0,"multiplicity":"s","shift":7.05},{"proton":"OHc","coupling":0,"multiplicity":"s","shift":4.79},{"proton":"ArCH3","coupling":0,"multiplicity":"s","shift":2.24},{"proton":"ArC(CH3)3","coupling":0,"multiplicity":"s","shift":1.38}],"name":"BHTb"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":6.15}],"name":"chloroform"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":1.4}],"name":"cyclohexane"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":2.9}],"name":"1,2-dichloroethane"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":4.27}],"name":"dichloromethane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.11},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":3.26}],"name":"diethyl_ether"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"m","shift":3.46},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":3.34},{"proton":"OCH3","coupling":0,"multiplicity":"s","shift":3.11}],"name":"diglyme"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.12},{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.33}],"name":"1,2-dimethoxyethane"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":1.6},{"proton":"NCH3","coupling":0,"multiplicity":"s","shift":2.57},{"proton":"NCH3","coupling":0,"multiplicity":"s","shift":2.05}],"name":"dimethylacetamide"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.63},{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.36},{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.86}],"name":"dimethylformamide"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.68}],"name":"dimethyl_sulfoxide"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.35}],"name":"dioxane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":0.96},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":3.34}],"name":"ethanol"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":1.65},{"proton":"CH2CH3","coupling":7,"multiplicity":"q","shift":3.89},{"proton":"CH2CH3","coupling":7,"multiplicity":"t","shift":0.92}],"name":"ethyl_acetate"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":1.58},{"proton":"CH2CH3","coupling":7,"multiplicity":"q","shift":1.81},{"proton":"CH2CH3","coupling":7,"multiplicity":"t","shift":0.85}],"name":"ethyl_methyl_ketone"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":3.41}],"name":"ethylene_glycol"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"m","shift":0.92},{"proton":"CH2","coupling":0,"multiplicity":"br_s","shift":1.36}],"name":"grease^f"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"t","shift":0.89},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.24}],"name":"n-hexane"},{"shifts":[{"proton":"CH3","coupling":9.5,"multiplicity":"d","shift":2.4}],"name":"HMPAg"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.07}],"name":"methanol"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.94}],"name":"nitromethane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":0.86},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.23}],"name":"n-pentane"},{"shifts":[{"proton":"CH3","coupling":6,"multiplicity":"d","shift":0.95},{"proton":"CH","coupling":6,"multiplicity":"sep","shift":3.67}],"name":"2-propanol"},{"shifts":[{"proton":"CH(2)","coupling":0,"multiplicity":"m","shift":8.53},{"proton":"CH(3)","coupling":0,"multiplicity":"m","shift":6.66},{"proton":"CH(4)","coupling":0,"multiplicity":"m","shift":6.98}],"name":"pyridine"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":0.29}],"name":"silicone_greasei"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.4},{"proton":"CH2O","coupling":0,"multiplicity":"m","shift":3.57}],"name":"tetrahydrofuran"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.11},{"proton":"CH(o/p)","coupling":0,"multiplicity":"m","shift":7.02},{"proton":"CH(m)","coupling":0,"multiplicity":"m","shift":7.13}],"name":"toluene"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":0.96},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":2.4}],"name":"triethylamine"}],"solvent":"C6D6"},{"impurities":[{"shifts":[{"proton":"X","coupling":0,"multiplicity":"","shift":1.94}],"name":"solvent_residual_peak"},{"shifts":[{"proton":"H2O","coupling":0,"multiplicity":"s","shift":2.13}],"name":"H2O"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.96}],"name":"acetic_acid"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.08}],"name":"acetone"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.96}],"name":"acetonitrile"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.37}],"name":"benzene"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.16},{"proton":"OHc","coupling":0,"multiplicity":"s","shift":2.18}],"name":"tert-butyl_alcohol"},{"shifts":[{"proton":"CCH3","coupling":0,"multiplicity":"s","shift":1.14},{"proton":"OCH3","coupling":0,"multiplicity":"s","shift":3.13}],"name":"tert-butyl_methyl_ether"},{"shifts":[{"proton":"ArH","coupling":0,"multiplicity":"s","shift":6.97},{"proton":"OHc","coupling":0,"multiplicity":"s","shift":5.2},{"proton":"ArCH3","coupling":0,"multiplicity":"s","shift":2.22},{"proton":"ArC(CH3)3","coupling":0,"multiplicity":"s","shift":1.39}],"name":"BHTb"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.58}],"name":"chloroform"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":1.44}],"name":"cyclohexane"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.81}],"name":"1,2-dichloroethane"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":5.44}],"name":"dichloromethane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.12},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":3.42}],"name":"diethyl_ether"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"m","shift":3.53},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":3.45},{"proton":"OCH3","coupling":0,"multiplicity":"s","shift":3.29}],"name":"diglyme"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.28},{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.45}],"name":"1,2-dimethoxyethane"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":1.97},{"proton":"NCH3","coupling":0,"multiplicity":"s","shift":2.96},{"proton":"NCH3","coupling":0,"multiplicity":"s","shift":2.83}],"name":"dimethylacetamide"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.92},{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.89},{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.77}],"name":"dimethylformamide"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.5}],"name":"dimethyl_sulfoxide"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.6}],"name":"dioxane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.12},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":3.54},{"proton":"OH","coupling":5,"multiplicity":"s,t","shift":2.47}],"name":"ethanol"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":1.97},{"proton":"CH2CH3","coupling":7,"multiplicity":"q","shift":4.06},{"proton":"CH2CH3","coupling":7,"multiplicity":"t","shift":1.2}],"name":"ethyl_acetate"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":2.06},{"proton":"CH2CH3","coupling":7,"multiplicity":"q","shift":2.43},{"proton":"CH2CH3","coupling":7,"multiplicity":"t","shift":0.96}],"name":"ethyl_methyl_ketone"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":3.51}],"name":"ethylene_glycol"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"m","shift":0.86},{"proton":"CH2","coupling":0,"multiplicity":"br_s","shift":1.27}],"name":"grease^f"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"t","shift":0.89},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.28}],"name":"n-hexane"},{"shifts":[{"proton":"CH3","coupling":9.5,"multiplicity":"d","shift":2.57}],"name":"HMPAg"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.28},{"proton":"OH","coupling":0,"multiplicity":"s","shift":2.16}],"name":"methanol"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":4.31}],"name":"nitromethane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":0.87},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.29}],"name":"n-pentane"},{"shifts":[{"proton":"CH3","coupling":6,"multiplicity":"d","shift":1.09},{"proton":"CH","coupling":6,"multiplicity":"sep","shift":3.87}],"name":"2-propanol"},{"shifts":[{"proton":"CH(2)","coupling":0,"multiplicity":"m","shift":8.57},{"proton":"CH(3)","coupling":0,"multiplicity":"m","shift":7.33},{"proton":"CH(4)","coupling":0,"multiplicity":"m","shift":7.73}],"name":"pyridine"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":0.08}],"name":"silicone_greasei"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.8},{"proton":"CH2O","coupling":0,"multiplicity":"m","shift":3.64}],"name":"tetrahydrofuran"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.33},{"proton":"CH(o/p)","coupling":0,"multiplicity":"m","shift":7.2},{"proton":"CH(m)","coupling":0,"multiplicity":"m","shift":7.2}],"name":"toluene"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":0.96},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":2.45}],"name":"triethylamine"}],"solvent":"CD3CN"},{"impurities":[{"shifts":[{"proton":"X","coupling":0,"multiplicity":"","shift":3.31}],"name":"solvent_residual_peak"},{"shifts":[{"proton":"H2O","coupling":0,"multiplicity":"s","shift":4.87}],"name":"H2O"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.99}],"name":"acetic_acid"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.15}],"name":"acetone"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.03}],"name":"acetonitrile"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.33}],"name":"benzene"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.4}],"name":"tert-butyl_alcohol"},{"shifts":[{"proton":"CCH3","coupling":0,"multiplicity":"s","shift":1.15},{"proton":"OCH3","coupling":0,"multiplicity":"s","shift":3.2}],"name":"tert-butyl_methyl_ether"},{"shifts":[{"proton":"ArH","coupling":0,"multiplicity":"s","shift":6.92},{"proton":"ArCH3","coupling":0,"multiplicity":"s","shift":2.21},{"proton":"ArC(CH3)3","coupling":0,"multiplicity":"s","shift":1.4}],"name":"BHTb"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.9}],"name":"chloroform"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":1.45}],"name":"cyclohexane"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.78}],"name":"1,2-dichloroethane"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":5.49}],"name":"dichloromethane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.18},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":3.49}],"name":"diethyl_ether"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"m","shift":3.61},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":3.58},{"proton":"OCH3","coupling":0,"multiplicity":"s","shift":3.35}],"name":"diglyme"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.35},{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.52}],"name":"1,2-dimethoxyethane"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":2.07},{"proton":"NCH3","coupling":0,"multiplicity":"s","shift":3.31},{"proton":"NCH3","coupling":0,"multiplicity":"s","shift":2.92}],"name":"dimethylacetamide"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.97},{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.99},{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.86}],"name":"dimethylformamide"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.65}],"name":"dimethyl_sulfoxide"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.66}],"name":"dioxane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.19},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":3.6}],"name":"ethanol"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":2.01},{"proton":"CH2CH3","coupling":7,"multiplicity":"q","shift":4.09},{"proton":"CH2CH3","coupling":7,"multiplicity":"t","shift":1.24}],"name":"ethyl_acetate"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":2.12},{"proton":"CH2CH3","coupling":7,"multiplicity":"q","shift":2.5},{"proton":"CH2CH3","coupling":7,"multiplicity":"t","shift":1.01}],"name":"ethyl_methyl_ketone"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":3.59}],"name":"ethylene_glycol"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"m","shift":0.88},{"proton":"CH2","coupling":0,"multiplicity":"br_s","shift":1.29}],"name":"grease^f"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"t","shift":0.9},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.29}],"name":"n-hexane"},{"shifts":[{"proton":"CH3","coupling":9.5,"multiplicity":"d","shift":2.64}],"name":"HMPAg"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.34}],"name":"methanol"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":4.34}],"name":"nitromethane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":0.89},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.29}],"name":"n-pentane"},{"shifts":[{"proton":"CH3","coupling":6,"multiplicity":"d","shift":1.5},{"proton":"CH","coupling":6,"multiplicity":"sep","shift":3.92}],"name":"2-propanol"},{"shifts":[{"proton":"CH(2)","coupling":0,"multiplicity":"m","shift":8.53},{"proton":"CH(3)","coupling":0,"multiplicity":"m","shift":7.44},{"proton":"CH(4)","coupling":0,"multiplicity":"m","shift":7.85}],"name":"pyridine"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":0.1}],"name":"silicone_greasei"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.87},{"proton":"CH2O","coupling":0,"multiplicity":"m","shift":3.71}],"name":"tetrahydrofuran"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.32},{"proton":"CH(o/p)","coupling":0,"multiplicity":"m","shift":7.16},{"proton":"CH(m)","coupling":0,"multiplicity":"m","shift":7.16}],"name":"toluene"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.05},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":2.58}],"name":"triethylamine"}],"solvent":"CD3OD"},{"impurities":[{"shifts":[{"proton":"X","coupling":0,"multiplicity":"","shift":4.79}],"name":"solvent_residual_peak"},{"shifts":[],"name":"H2O"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.08}],"name":"acetic_acid"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.22}],"name":"acetone"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.06}],"name":"acetonitrile"},{"shifts":[],"name":"benzene"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.24}],"name":"tert-butyl_alcohol"},{"shifts":[{"proton":"CCH3","coupling":0,"multiplicity":"s","shift":1.21},{"proton":"OCH3","coupling":0,"multiplicity":"s","shift":3.22}],"name":"tert-butyl_methyl_ether"},{"shifts":[],"name":"BHTb"},{"shifts":[],"name":"chloroform"},{"shifts":[],"name":"cyclohexane"},{"shifts":[],"name":"1,2-dichloroethane"},{"shifts":[],"name":"dichloromethane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.17},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":3.56}],"name":"diethyl_ether"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"m","shift":3.67},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":3.61},{"proton":"OCH3","coupling":0,"multiplicity":"s","shift":3.37}],"name":"diglyme"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.37},{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.6}],"name":"1,2-dimethoxyethane"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":2.08},{"proton":"NCH3","coupling":0,"multiplicity":"s","shift":3.06},{"proton":"NCH3","coupling":0,"multiplicity":"s","shift":2.9}],"name":"dimethylacetamide"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.92},{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.01},{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.85}],"name":"dimethylformamide"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.71}],"name":"dimethyl_sulfoxide"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.75}],"name":"dioxane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.17},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":3.65}],"name":"ethanol"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":2.07},{"proton":"CH2CH3","coupling":7,"multiplicity":"q","shift":4.14},{"proton":"CH2CH3","coupling":7,"multiplicity":"t","shift":1.24}],"name":"ethyl_acetate"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":2.19},{"proton":"CH2CH3","coupling":7,"multiplicity":"q","shift":3.18},{"proton":"CH2CH3","coupling":7,"multiplicity":"t","shift":1.26}],"name":"ethyl_methyl_ketone"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":3.65}],"name":"ethylene_glycol"},{"shifts":[],"name":"grease^f"},{"shifts":[],"name":"n-hexane"},{"shifts":[{"proton":"CH3","coupling":9.5,"multiplicity":"d","shift":2.61}],"name":"HMPAg"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.34}],"name":"methanol"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":4.4}],"name":"nitromethane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":0.9}],"name":"n-pentane"},{"shifts":[{"proton":"CH3","coupling":6,"multiplicity":"d","shift":1.17},{"proton":"CH","coupling":6,"multiplicity":"sep","shift":4.02}],"name":"2-propanol"},{"shifts":[{"proton":"CH(2)","coupling":0,"multiplicity":"m","shift":8.52},{"proton":"CH(3)","coupling":0,"multiplicity":"m","shift":7.45},{"proton":"CH(4)","coupling":0,"multiplicity":"m","shift":7.87}],"name":"pyridine"},{"shifts":[],"name":"silicone_greasei"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.88},{"proton":"CH2O","coupling":0,"multiplicity":"m","shift":3.74}],"name":"tetrahydrofuran"},{"shifts":[],"name":"toluene"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":0.99},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":2.57}],"name":"triethylamine"}],"solvent":"D2O"}];
        //this.impurities = API.getVar("impurities").getValue();
        //File.parse("solvent1H.txt", {header:false});
        //console.log(this.impurities[0]);
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
    detectSignals: function(peakList, spectrum, nH){
        var frequency = spectrum.observeFrequencyX();
        var signals = [];
        var signal1D = {};
        var prevPeak = [100000,0],peaks=null;
        var rangeX = 16/frequency;//Peaks withing this range are considered to belongs to the same signal1D
        var spectrumIntegral = 0,cs,sum;
        for(var i=0;i<peakList.length;i++){
            if(Math.abs(peakList[i][0]-prevPeak[0])>rangeX){
                signal1D = {"nbPeaks":1,"units":"PPM",
                    "startX":peakList[i][0]+peakList[i][2],
                    "stopX":peakList[i][0]-peakList[i][2],
                    "multiplicity":"","pattern":"",
                    "observe":frequency,"nucleus":"1H",
                    "integralData":{"from":peakList[i][0]-peakList[i][2]*3,
                                    "to":peakList[i][0]+peakList[i][2]*3
                                    //"value":this.area(peakList[i])
                    },
                    "peaks":[]};
                signal1D.peaks.push({x:peakList[i][0],"intensity":peakList[i][1], width:peakList[i][2]});
                signals.push(signal1D);
                //spectrumIntegral+=this.area(peakList[i]);
            }
            else{
                signal1D.stopX=peakList[i][0]-peakList[i][2];
                signal1D.nbPeaks++;
                signal1D.peaks.push({x:peakList[i][0],"intensity":peakList[i][1], width:peakList[i][2]});
                //signal1D.integralData.value+=this.area(peakList[i]);
                signal1D.integralData.from=peakList[i][0]-peakList[i][2]*3;
                //spectrumIntegral+=this.area(peakList[i]);
            }
            prevPeak = peakList[i];
        }
        //Normalize the integral to the normalization parameter and calculate cs
        for(var i=0;i<signals.length;i++){
            peaks = signals[i].peaks;
            var integral = signals[i].integralData;
            integral.value=spectrum.getArea(integral.from,integral.to);//*nH/spectrumIntegral;
            spectrumIntegral+=integral.value;
            cs = 0;
            sum = 0;
            for(var j=0;j<peaks.length;j++){
                cs+=peaks[j].x*this.area(peaks[j]);//.intensity;
                sum+=this.area(peaks[j]);
            }
            signals[i].delta1 = cs/sum;
        }
        for(var i=0;i<signals.length;i++){
            //console.log(integral.value);
            var integral = signals[i].integralData;
            integral.value*=nH/spectrumIntegral;
        }

        return signals;
    },

    area: function(peak){
        return Math.abs(peak.intensity*peak.width*1.772453851);
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
        console.log(nImpurities);
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
    GSD:function(spectrum, thresholdFactor){
        var data= spectrum.getXYData();
        var y = data[1];
        var x = data[0];

        //Lets remove the noise for better performance
        var noiseLevel = Math.abs(spectrum.getNoiseLevel())*thresholdFactor;

        //console.log("noise level "+noiseLevel);
        for(var i=y.length-1;i>=0;i--)
            if(Math.abs(y[i])<noiseLevel)
                y[i]=0;

        var dx = x[1]-x[0];
        // fill convolution frequency axis
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
        var maxDy = 0;
//console.log(Y.length);
        for (var i = 1; i < Y.length -1 ; i++){
            if(Math.abs(dY[i])>maxDy){
                maxDy = Math.abs(dY[i]);
            }
            if ((Y[i] >= Y[i-1]) && (Y[i] >= Y[i+1])) {
                maxY.push(X[i]);
            }
            if ((dY[i] <= dY[i-1]) && (dY[i] <= dY[i+1])) {
                stackInt.push(X[i]);
            }
            if ((dY[i] >= dY[i-1]) && (dY[i] >= dY[i+1])) {
                try{
                    intervals.push( [X[i] , stackInt.pop()] );
                }
                catch(e){
                    console.log("Error I don't know why "+e);
                }
            }
            if ((ddY[i] < ddY[i-1]) && (ddY[i] < ddY[i+1])) {
                minddY.push( [X[i], Y[i], i] );
            }
        }
        // creates a list with (frequency, linewith, height)
        var signalsS = new Array();
        var signals = new Array();
        for (var j = 0; j < minddY.length; j++)
        {
            var f = minddY[j];
            var frequency = f[0];
            var possible = new Array();
            for (var k=0;k<intervals.length;k++){
                var i = intervals[k];
                if (frequency > i[0] && frequency < i[1])
                    possible.push(i);
            }
            //Lets give the opportunity to other peaks to exist
            /******It did not work. amc************
            /*if (possible.length === 0){
                if(Math.abs(dY[f[2]])>0.2*maxDy){
                    possible.push([frequency+dx,frequency-dx]);
                }
            }*/
            if (possible.length > 0) {
                if (possible.length == 1) {
                    var inter = possible[0];
                    var linewith = inter[1] - inter[0];
                    var height = f[1];
                    var points = Y;
                    //console.log(frequency);
                    points.sort(function (a, b) {
                        return a - b
                    });
                    if ((linewith >= 2 * dx) && (height > 0.0001 * points[0])) {
                        signals.push([frequency, height, linewith]);
                        signalsS.push([frequency, height]);

                    }
                }
                else {
                    //TODO: nested peaks
                    console.log("Nested " + possible);
                }
            }
        }
        return signals;
        //jexport("peakPicking",signalsS);
    }
}

module.exports = PeakPicking;