'use strict';
/**
 * Implementation of the peak picking method described by Cobas in:
 * A new approach to improving automated analysis of proton NMR spectra
 * through Global Spectral Deconvolution (GSD)
 * http://www.spectroscopyeurope.com/images/stories/ColumnPDFs/TD_23_1.pdf
 * @param {Object} spectrum - SD instance
 * @param {Object} peakList - nmr signals
 * @param {Object} options - options object with some parameter for GSD, detectSignal functions.
 * @param {number} [options.nH] - Number of hydrogens or some number to normalize the integral data.
 * @param {number} [options.frequencyCluster] - distance limit to clustering the peaks.
 * @param {boolean} [options.clean] - If true remove all the signals with integral < 0.5
 * @param {number} [options.minMaxRatio] - Threshold to determine if a given peak should be considered as a noise, bases on its relative height compared to the highest peak.
 * @param {number} [options.broadRatio] - If broadRatio is higher than 0, then all the peaks which second derivative smaller than broadRatio * maxAbsSecondDerivative will be marked with the soft mask equal to true.
 * @param {boolean} [options.smoothY] - Select the peak intensities from a smoothed version of the independent variables?
 * @param {number} [options.nL] - factor to determine the width at the moment to group the peaks in signals in 'GSD.optimizePeaks' function.
 * @param {boolean} [options.optimize] - if it's true adjust an train of gaussian or lorentzian shapes to spectrum.
 * @param {string} [options.functionType] - This option allows us choose between gaussian or lorentzian function when options.optimize is true.
 * @param {number} [options.broadWidth] - Threshold to determine if some peak is candidate to clustering into range. /@TODO it's review
 * @returns {Array}
 */
const GSD = require('ml-gsd');
//var extend = require("extend");
//var removeImpurities = require('./ImpurityRemover');

const defaultOptions = {

    clean: true,
    thresholdFactor: 1,
    optimize: true,
    minMaxRatio: 0.01,
    broadRatio: 0.00025,
    smoothY: true,
    nL: 4,
    functionType: 'gaussian',
    broadWidth: 0.25,
    sgOptions: {windowSize: 9, polynomial: 3}
};


function extractPeaks(spectrum, optionsEx) {
    var options = Object.assign({}, defaultOptions, optionsEx);
    var noiseLevel = Math.abs(spectrum.getNoiseLevel()) * (options.thresholdFactor);
    var data = spectrum.getXYData();

    if (options.from && options.to) {
        data = spectrum.getVector(options.from, options.to);
    }

    var peakList = GSD.gsd(data[0], data[1], options);

    if (options.broadWidth) {
        peakList = GSD.post.joinBroadPeaks(peakList, {width: options.broadWidth});
    }

    if (options.optimize) {
        peakList = GSD.post.optimizePeaks(peakList, data[0], data[1], options.nL, options.functionType);
    }

    return clearList(peakList, noiseLevel);
}

/**
 * this function remove the peaks with an intensity lower to threshold
 * @param {object} peakList - peaks
 * @param {number} threshold
 * @returns {object} the clean peakList
 * @private
 */
function clearList(peakList, threshold) {
    for (var i = peakList.length - 1; i >= 0; i--) {
        if (Math.abs(peakList[i].y) < threshold) {
            peakList.splice(i, 1);
        }
    }
    return peakList;
}

module.exports = extractPeaks;
