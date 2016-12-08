'use strict';
/**
 * Implementation of the peak pickig method described by Cobas in:
 * A new approach to improving automated analysis of proton NMR spectra
 * through Global Spectral Deconvolution (GSD)
 * http://www.spectroscopyeurope.com/images/stories/ColumnPDFs/TD_23_1.pdf
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

function clearList(peakList, threshold) {
    for (var i = peakList.length - 1; i >= 0; i--) {
        if (Math.abs(peakList[i].y) < threshold) {
            peakList.splice(i, 1);
        }
    }
    return peakList;
}

module.exports = extractPeaks;
