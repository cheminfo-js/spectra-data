'use strict';
/**
 * This function converts an array of peaks [{x, y, width}] in a vector equally x,y vector from a given window
 * TODO: This function is very general and should be placed somewhere else
 * @param {Array} peaks - List of the peaks
 * @param {object} options - it has some options to
 * @param {number} [options.from] - one limit of given window
 * @param {number} [options.to] - one limit of given window
 * @param {string} [options.fnName] - function name to generate the signals form
 * @param {number} [options.nWidth] - width factor of signal form
 * @param {number} [options.nbPoints] - number of points that the vector will have
 * @return {{x: Array, y: Array}}
 */

function peak2Vector(peaks, options = {}) {
    var {
        from = null,
        to = null,
        nbPoints = 16384,
        functionName = '',
        nWidth = 4
    } = options;

    var factor;
    if (from === null) {
        from = Number.MAX_VALUE;
        for (let i = 0; i < peaks.length; i++) {
            factor = peaks[i].x - peaks[i].width * nWidth;
            if (factor < from) {
                from = factor;
            }
        }
    }
    if (to === null) {
        to = Number.MIN_VALUE;
        for (let i = 0; i < peaks.length; i++) {
            factor = peaks[i].x + peaks[i].width * nWidth;
            if (factor > to) {
                to = factor;
            }
        }
    }

    var x = new Array(nbPoints);
    var y = new Array(nbPoints);
    var dx = (to - from) / (nbPoints - 1);
    for (let i = 0; i < nbPoints; i++) {
        x[i] = from + i * dx;
        y[i] = 0;
    }

    var intensity = peaks[0].y ? 'y' : 'intensity';

    var functionToUse;
    switch (functionName.toLowerCase()) {
        case 'lorentzian':
            functionToUse = lorentzian;
            break;
        default:
            functionToUse = gaussian;
    }

    for (let i = 0; i < peaks.length; i++) {
        var peak = peaks[i];
        if (peak.x > from && peak.x < to) {
            var index = Math.round((peak.x - from) / dx);
            var w = Math.round(peak.width * nWidth / dx);
            for (var j = index - w; j < index + w; j++) {
                if (j >= 0 && j < nbPoints) {
                    y[j] += functionToUse(peak[intensity], x[j], peak.width, peak.x);
                }
            }
        }
    }

    function lorentzian(intensity, x, width, mean) {
        var factor = intensity * Math.pow(width, 2) / 4;
        return factor / (Math.pow(mean - x, 2) + Math.pow(width / 2, 2));
    }

    function gaussian(intensity, x, width, mean) {
        return intensity * Math.exp(-0.5 * Math.pow((mean - x) / (width / 2), 2));
    }

    return {x: x, y: y};
}

module.exports = peak2Vector;
