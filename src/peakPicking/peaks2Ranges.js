'use strict';

const JAnalyzer = require('./jAnalyzer');
const Ranges = require('../range/Ranges');
//var extend = require("extend");
//var removeImpurities = require('./ImpurityRemover');

const defaultOptions = {
    nH: 99,
    clean: true,
    compile: true,
    integralFn: 0,
    idPrefix: '',
    format: 'old',         // TODO: remove support for old format
    frequencyCluster: 16
};
/**
 * This function clustering peaks and calculate the integral value for each range from the peak list returned from extractPeaks function
 * @param {Object} spectrum - SD instance
 * @param {Object} peakList - nmr signals
 * @param {Object} options - options object with some parameter for GSD, detectSignal functions.
 * @param {number} [options.nH] - Number of hydrogens or some number to normalize the integral data.
 * @param {number} [options.integralFn] - option to chose between approx area with gaussian function or sum of the points of given range
 * @param {number} [options.frequencyCluster] - distance limit to clustering the peaks.
 * @param {boolean} [options.clean] - If true remove all the signals with integral < 0.5
 * @param {boolean} [options.compile] - If true, the Janalyzer function is run over signals to compile the patterns.
 * @param {string} [options.idPrefix] - prefix for signal ID
 * @returns {Array}
 */

function createRanges(spectrum, peakList, options) {
    options = Object.assign({}, defaultOptions, options);
    var i, j, nHi, sum;

    var signals = detectSignals(peakList, spectrum, options.nH, options.integralFn, options.frequencyCluster);

    //Remove all the signals with small integral
    if (options.clean || false) {
        for (i = signals.length - 1; i >= 0; i--) {
            if (signals[i].integralData.value < 0.5) {
                signals.splice(i, 1);
            }
        }
    }

    if (options.compile || false) {
        for (i = 0; i < signals.length; i++) {
            //console.log("Sum "+signals[i].integralData.value);
            JAnalyzer.compilePattern(signals[i]);

            if (signals[i].maskPattern && signals[i].multiplicity !== 'm'
                && signals[i].multiplicity !== '') {
                //Create a new signal with the removed peaks
                nHi = 0;
                sum = 0;
                var peaksO = [];
                for (j = signals[i].maskPattern.length - 1; j >= 0; j--) {
                    sum += area(signals[i].peaks[j]);

                    if (signals[i].maskPattern[j] === false) {
                        var peakR = signals[i].peaks.splice(j, 1)[0];
                        peaksO.push({x: peakR.x, y: peakR.intensity, width: peakR.width});
                        //peaksO.push(peakR);
                        signals[i].mask.splice(j, 1);
                        signals[i].mask2.splice(j, 1);
                        signals[i].maskPattern.splice(j, 1);
                        signals[i].nbPeaks--;
                        nHi += area(peakR);
                    }
                }
                if (peaksO.length > 0) {
                    nHi = nHi * signals[i].integralData.value / sum;
                    signals[i].integralData.value -= nHi;
                    var peaks1 = [];
                    for (j = peaksO.length - 1; j >= 0; j--) {
                        peaks1.push(peaksO[j]);
                    }
                    let ranges = detectSignals(peaks1, spectrum, nHi, options.integralFn, options.frequencyCluster);

                    for (j = 0; j < ranges.length; j++) {
                        signals.push(ranges[j]);
                    }
                }
            }
        }
        // it was a updateIntegrals function.
        var sumIntegral = 0, sumObserved = 0;
        for (i = 0; i < signals.length; i++) {
            sumObserved += Math.round(signals[i].integralData.value);
        }
        if (sumObserved !== options.nH) {
            sumIntegral = options.nH / sumObserved;
            for (i = 0; i < signals.length; i++) {
                signals[i].integralData.value *= sumIntegral;
            }
        }
    }
    
    signals.sort(function (a, b) {
        return b.delta1 - a.delta1;
    });

    if (options.clean || false) {
        for (i = signals.length - 1; i >= 0; i--) {
            //console.log(signals[i]);
            if (signals[i].integralData.value < 0.5) {
                signals.splice(i, 1);
            }
        }
    }

    for (i = 0; i < signals.length; i++) {
        if (options.idPrefix && options.idPrefix.length > 0) {
            signals[i].signalID = options.idPrefix + '_' + (i + 1);
        } else {
            signals[i].signalID = (i + 1) + '';
        }
        signals[i]._highlight = [signals[i].signalID];
    }

    if (options.format === 'new') {
        let ranges = new Array(signals.length);
        for (i = 0; i < signals.length; i++) {
            var signal = signals[i];
            ranges[i] = {
                from: signal.integralData.from,
                to: signal.integralData.to,
                integral: signal.integralData.value,
                signal: [{
                    nbAtoms: 0,
                    diaID: [],
                    multiplicity: signal.multiplicity,
                    peak: signal.peaks,
                    kind: '',
                    remark: ''
                }],
                signalID: signal.signalID,
                _highlight: signal._highlight

            };
            if (signal.nmrJs) {
                ranges[i].signal[0].j = signal.nmrJs;
            }
            if (!signal.asymmetric || signal.multiplicity === 'm') {
                ranges[i].signal[0].delta = signal.delta1;
            }
        }
        signals = new Ranges(ranges);
    }

    return signals;
}


/**
 * @private
 * Extract the signals from the peakList and the given spectrum.
 * @param {object} peakList - nmr signals
 * @param {object} spectrum - spectra data
 * @param {number} nH - Number of hydrogens or some number to normalize the integral data
 * @param {number} integralType - option to chose between approx area with gaussian function or sum of the points of given range
 * @param {number} frequencyCluster - distance limit to clustering the peaks.
 * range = frequencyCluster / observeFrequency -> Peaks withing this range are considered to belongs to the same signal1D
 * @return {Array} nmr signals
 */
function detectSignals(peakList, spectrum, nH, integralType, frequencyCluster) {
    const frequency = spectrum.observeFrequencyX();
    var signals = [];
    var signal1D = {};
    var prevPeak = {x: 100000, y: 0, width: 0};
    var peaks = null;
    var rangeX = frequencyCluster / frequency;
    var spectrumIntegral = 0;
    var cs, sum, i, j;
    for (i = 0; i < peakList.length; i++) {
        if (Math.abs(peakList[i].x - prevPeak.x) > rangeX) {
            signal1D = {nbPeaks: 1, units: 'PPM',
                'startX': peakList[i].x - peakList[i].width,
                'stopX': peakList[i].x + peakList[i].width,
                'multiplicity': '', 'pattern': '',
                'observe': frequency, 'nucleus': '1H',
                'integralData': {'from': peakList[i].x - peakList[i].width * 3,
                    'to': peakList[i].x + peakList[i].width * 3
                     //"value":area(peakList[i])
                },
                'peaks': []};
            signal1D.peaks.push({x: peakList[i].x, 'intensity': peakList[i].y, width: peakList[i].width});
            signals.push(signal1D);
            //spectrumIntegral+=area(peakList[i]);
        } else {
            var tmp = peakList[i].x + peakList[i].width;
            signal1D.stopX = Math.max(signal1D.stopX, tmp);
            tmp = peakList[i].x - peakList[i].width;
            signal1D.startX = Math.min(signal1D.startX, tmp);
            signal1D.nbPeaks++;
            signal1D.peaks.push({x: peakList[i].x, 'intensity': peakList[i].y, width: peakList[i].width});
            //signal1D.integralData.value+=area(peakList[i]);
            signal1D.integralData.from = Math.min(signal1D.integralData.from, peakList[i].x - peakList[i].width * 3);
            signal1D.integralData.to = Math.max(signal1D.integralData.to, peakList[i].x + peakList[i].width * 3);
            //spectrumIntegral+=area(peakList[i]);
        }
        prevPeak = peakList[i];
    }
    //Normalize the integral to the normalization parameter and calculate cs
    for (i = 0; i < signals.length; i++) {
        peaks = signals[i].peaks;
        let integral = signals[i].integralData;
        cs = 0;
        sum = 0;

        for (j = 0; j < peaks.length; j++) {
            cs += peaks[j].x * area(peaks[j]);//.intensity;
            sum += area(peaks[j]);
        }
        signals[i].delta1 = cs / sum;

        if (integralType === 0) {
            integral.value = sum;
        } else {
            integral.value = spectrum.getArea(integral.from, integral.to);
        }
        spectrumIntegral += integral.value;

    }
    if (nH !== 0) {
        for (i = 0; i < signals.length; i++) {
            //console.log(integral.value);
            let integral = signals[i].integralData;
            integral.value *= nH / spectrumIntegral;
        }
    }

    return signals;
}

/**
 * Updates the score that a given impurity is present in the current spectrum. In this part I would expect
 * to have into account the multiplicity of the signal. Also the relative intensity of the signals.
 * THIS IS the KEY part of the algorithm!!!!!!!!!
 * @param candidates
 * @param peakList
 * @param maxIntensity
 * @param frequency
 * @return {number}
 */
/*function updateScore(candidates, peakList, maxIntensity, frequency) {
 //You may do it to avoid this part.
 //Check the multiplicity
 var mul, index, k;
 var j = 0;
 var min = 0;
 var indexMin = 0;
 var score = 0;
 for (var i = candidates.length - 1; i >= 0; i--) {
 mul = candidates[i][1];
 j = candidates[i][2];
 index = candidates[i][4][0];
 //I guess we should try to identify the pattern in the nearby.
 if (mul.indexOf('sep') >= 0) {
 if (peakList[index][1] > maxIntensity * 0.33) {
 candidates.splice(i, 1);//Not a candidate anymore.
 }
 } else {
 if (mul.indexOf('s') >= 0 || mul.indexOf('X') >= 0) {
 k = index - 1;
 min = peakList[index][1];
 indexMin = index;
 while (k >= 0 && Math.abs(peakList[index][0] - peakList[k][0]) < 0.025) {
 if (peakList[k][1] < min) {
 min = peakList[k][1];
 indexMin = k;
 }
 k--;
 }
 k = index + 1;
 while (k < peakList.length && Math.abs(peakList[index][0] - peakList[k][0]) < 0.025) {
 if (peakList[k][1] < min) {
 min = peakList[k][1];
 indexMin = k;
 }
 k++;
 }
 candidates[i][4][0] = indexMin;
 score += 1;
 }
 }
 if (mul.indexOf('d') >= 0) {
 if (index > 0 && index < peakList.length - 1) {
 let thisJ1 = Math.abs(Math.abs(peakList[index - 1][0] - peakList[index][0]) * frequency - j);
 let thisJ2 = Math.abs(Math.abs(peakList[index + 1][0] - peakList[index][0]) * frequency - j);
 let thisJ3 = Math.abs(Math.abs(peakList[index + 1][0] - peakList[index - 1][0]) * frequency - j);
 if (thisJ1 < 2 || thisJ2 < 2 || thisJ3 < 2) {
 if (thisJ1 < thisJ2) {
 if (thisJ1 < thisJ3) {
 candidates[i][4] = [index - 1, index];
 score += 1;
 }                        else {
 candidates[i][4] = [index - 1, index + 1];
 score += 1;
 }
 }                    else {
 if (thisJ2 < thisJ3) {
 candidates[i][4] = [index, index + 1];
 score += 1;
 }                        else {
 candidates[i][4] = [index - 1, index + 1];
 score += 1;
 }
 }
 }
 }
 }
 if (mul.indexOf('t') >= 0) {
 if (index > 0 && index < peakList.length - 1) {
 let thisJ1 = Math.abs(Math.abs(peakList[index - 1][0] - peakList[index][0]) * frequency - j);
 let thisJ2 = Math.abs(Math.abs(peakList[index + 1][0] - peakList[index][0]) * frequency - j);
 let thisJ3 = Math.abs(Math.abs(peakList[index + 1][0] - peakList[index + 2][0]) * frequency - j);
 //console.log("XX "+thisJ1+" "+thisJ2);
 if (thisJ1 < 2) {
 candidates[i][4] = [index - 1, index];
 score += 0.5;
 }
 if (thisJ2 < 2) {
 candidates[i][4].push(index + 1);
 score += 0.5;
 }
 if (thisJ3 < 2) {
 candidates[i][4].push(index + 2);
 score += 0.5;
 }

 }
 }
 if (mul.indexOf('q') >= 0) {
 if (index > 1 && index < peakList.length - 2) {
 var thisJ1 = Math.abs(Math.abs(peakList[index - 2][0] - peakList[index - 1][0]) * frequency - j);
 var thisJ2 = Math.abs(Math.abs(peakList[index - 1][0] - peakList[index][0]) * frequency - j);
 var thisJ3 = Math.abs(Math.abs(peakList[index + 1][0] - peakList[index][0]) * frequency - j);
 var thisJ4 = Math.abs(Math.abs(peakList[index + 2][0] - peakList[index + 1][0]) * frequency - j);
 if (thisJ1 < 2) {
 candidates[i][4].push(index - 2);
 score += 0.25;
 }
 if (thisJ2 < 2) {
 candidates[i][4].push(index - 1);
 score += 0.25;
 }
 if (thisJ3 < 2) {
 candidates[i][4].push(index + 1);
 score += 0.25;
 }
 if (thisJ4 < 2) {
 candidates[i][4].push(index + 2);
 score += 0.25;
 }
 }
 }
 }
 //Lets remove the candidates to be impurities.
 //It would be equivalent to mark the peaks as valid again
 if (score / candidates.length < 0.5) {
 for (var i = candidates.length - 1; i >= 0; i--) {
 candidates.splice(i, 1);
 }
 return 0;
 }
 //Check the relative intensity
 return 1;
 }
 */

function area(peak) {
    return Math.abs(peak.intensity * peak.width * 1.57);//1.772453851);
}

module.exports = createRanges;
