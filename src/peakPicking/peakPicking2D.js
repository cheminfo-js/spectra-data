'use strict';

var PeakOptimizer = require('./peakOptimizer');
var simpleClustering = require('ml-simple-clustering');
var matrixPeakFinders = require('ml-matrix-peaks-finder');
var FFTUtils = require('ml-fft').FFTUtils;

const smallFilter = [
    [0, 0, 1, 2, 2, 2, 1, 0, 0],
    [0, 1, 4, 7, 7, 7, 4, 1, 0],
    [1, 4, 5, 3, 0, 3, 5, 4, 1],
    [2, 7, 3, -12, -23, -12, 3, 7, 2],
    [2, 7, 0, -23, -40, -23, 0, 7, 2],
    [2, 7, 3, -12, -23, -12, 3, 7, 2],
    [1, 4, 5, 3, 0, 3, 5, 4, 1],
    [0, 1, 3, 7, 7, 7, 3, 1, 0],
    [0, 0, 1, 2, 2, 2, 1, 0, 0]];

function getZones(spectraData, thresholdFactor) {
    if (thresholdFactor === 0) {
        thresholdFactor = 1;
    }
    if (thresholdFactor < 0) {
        thresholdFactor = -thresholdFactor;
    }
    var nbPoints = spectraData.getNbPoints();
    var nbSubSpectra = spectraData.getNbSubSpectra();

    var data = new Array(nbPoints * nbSubSpectra);
    var isHomonuclear = spectraData.isHomoNuclear();

    for (var iSubSpectra = 0; iSubSpectra < nbSubSpectra; iSubSpectra++) {
        var spectrum = spectraData.getYData(iSubSpectra);
        for (var iCol = 0; iCol < nbPoints; iCol++) {
            if (isHomonuclear) {
                data[iSubSpectra * nbPoints + iCol] = (spectrum[iCol] > 0 ? spectrum[iCol] : 0);
            } else {
                data[iSubSpectra * nbPoints + iCol] = Math.abs(spectrum[iCol]);
            }
        }
    }

    var nStdDev = getLoGnStdDevNMR(spectraData);
    if (isHomonuclear) {
        let convolutedSpectrum = FFTUtils.convolute(data, smallFilter, nbSubSpectra, nbPoints);
        let peaksMC1 = matrixPeakFinders.findPeaks2DRegion(data, {filteredData: convolutedSpectrum, rows: nbSubSpectra, cols: nbPoints, nStdDev: nStdDev * thresholdFactor});//)1.5);
        var peaksMax1 = matrixPeakFinders.findPeaks2DMax(data, {filteredData: convolutedSpectrum, rows: nbSubSpectra, cols: nbPoints, nStdDev: (nStdDev + 0.5) * thresholdFactor});//2.0);
        for (var i = 0; i < peaksMC1.length; i++) {
            peaksMax1.push(peaksMC1[i]);
        }
        return PeakOptimizer.enhanceSymmetry(createSignals2D(peaksMax1, spectraData, 24));

    } else {
        let convolutedSpectrum = FFTUtils.convolute(data, smallFilter, nbSubSpectra, nbPoints);
        let peaksMC1 = matrixPeakFinders.findPeaks2DRegion(data, {filteredData: convolutedSpectrum, rows: nbSubSpectra, cols: nbPoints, nStdDev: nStdDev * thresholdFactor});
        //Peak2D[] peaksMC1 = matrixPeakFinders.findPeaks2DMax(data, nbSubSpectra, nbPoints, (nStdDev+0.5)*thresholdFactor);
        //Remove peaks with less than 3% of the intensity of the highest peak
        return createSignals2D(PeakOptimizer.clean(peaksMC1, 0.05), spectraData, 24);
    }
}


//How noisy is the spectrum depending on the kind of experiment.
function getLoGnStdDevNMR(spectraData) {
    if (spectraData.isHomoNuclear()) {
        return 1.5;
    } else {
        return 3;
    }
}

/**
 * This function converts a set of 2D-peaks in 2D-signals. Each signal could be composed
 * of many 2D-peaks, and it has some additional information related to the NMR spectrum.
 * @param {Array} peaks
 * @param {NMR} spectraData
 * @param {number} tolerance
 * @return {Array}
 * @private
 */
function createSignals2D(peaks, spectraData, tolerance) {

    var bf1 = spectraData.observeFrequencyX();
    var bf2 = spectraData.observeFrequencyY();

    var firstY = spectraData.getFirstY();
    var dy = spectraData.getDeltaY();
    var i;
    for (i = peaks.length - 1; i >= 0; i--) {
        peaks[i].x = (spectraData.arrayPointToUnits(peaks[i].x));
        peaks[i].y = (firstY + dy * (peaks[i].y));

        //Still having problems to correctly detect peaks on those areas. So I'm removing everything there.
        if (peaks[i].y < -1 || peaks[i].y >= 210) {
            peaks.splice(i, 1);
        }
    }
    //The connectivity matrix is an square and symmetric matrix, so we'll only store the upper diagonal in an
    //array like form
    var connectivity = [];
    var tmp = 0;
    tolerance *= tolerance;
    //console.log(tolerance);
    for (i = 0; i < peaks.length; i++) {
        for (var j = i; j < peaks.length; j++) {
            tmp = Math.pow((peaks[i].x - peaks[j].x) * bf1, 2) + Math.pow((peaks[i].y - peaks[j].y) * bf2, 2);
            if (tmp < tolerance) {//30*30Hz We cannot distinguish peaks with less than 20 Hz of separation
                connectivity.push(1);
            } else {
                connectivity.push(0);
            }
        }
    }

    var clusters = simpleClustering(connectivity);

    var signals = [];
    if (peaks != null) {
        for (var iCluster = 0; iCluster < clusters.length; iCluster++) {
            var signal = {nucleusX: spectraData.getNucleus(1), nucleusY: spectraData.getNucleus(2)};
            signal.resolutionX = (spectraData.getLastX() - spectraData.getFirstX()) / spectraData.getNbPoints();
            signal.resolutionY = dy;
            var peaks2D = [];
            signal.shiftX = 0;
            signal.shiftY = 0;
            var minMax1 = [Number.MAX_VALUE, 0];
            var minMax2 = [Number.MAX_VALUE, 0];
            var sumZ = 0;
            for (var jPeak = clusters[iCluster].length - 1; jPeak >= 0; jPeak--) {
                if (clusters[iCluster][jPeak] === 1) {
                    peaks2D.push({
                        x: peaks[jPeak].x,
                        y: peaks[jPeak].y,
                        z: peaks[jPeak].z

                    });
                    signal.shiftX += peaks[jPeak].x * peaks[jPeak].z;
                    signal.shiftY += peaks[jPeak].y * peaks[jPeak].z;
                    sumZ += peaks[jPeak].z;
                    if (peaks[jPeak].x < minMax1[0]) {
                        minMax1[0] = peaks[jPeak].x;
                    }
                    if (peaks[jPeak].x > minMax1[1]) {
                        minMax1[1] = peaks[jPeak].x;
                    }
                    if (peaks[jPeak].y < minMax2[0]) {
                        minMax2[0] = peaks[jPeak].y;
                    }
                    if (peaks[jPeak].y > minMax2[1]) {
                        minMax2[1] = peaks[jPeak].y;
                    }

                }
            }
            signal.fromTo = [{from: minMax1[0], to: minMax1[1]},
                {from: minMax2[0], to: minMax2[1]}];
            signal.shiftX /= sumZ;
            signal.shiftY /= sumZ;
            signal.peaks = peaks2D;
            signals.push(signal);
        }
    }
    return signals;
}

module.exports = getZones;
