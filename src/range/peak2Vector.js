'use strict';
/**
 * This function converts an array of peaks [{x, y, width}] in a vector equally x,y vector from a given window
 * TODO: This function is very general and should be placed somewhere else
 * @param {Array} peaks - List of the peaks
 * @param {object} options - it has some options to
 * @option {number} [options.from] - one limit of given window
 * @option {number} [options.to] - one limit of given window
 * @option {string} [options.fnName] - function name to generate the signals form
 * @option {number} [options.nWidth] - width factor of signal form
 * @option {number} [options.nbPoints] - number of points that the vector will have
 * @return {{x: Array, y: Array}}
 */
function peak2Vector(peaks, options) {
    var options = options || {};
    var from = options.from;
    var to = options.to;
    var nbPoints = options.nbPoints || 16 * 1024;
    var fnName = options.fnName || 'gaussian';
    var nWidth = options.nWidth || 4;

    if (!from) {
        from = Number.MAX_VALUE;
        for (let i = 0; i < peaks.length; i++) {
            if (peaks[i].x - peaks[i].width * nWidth < from) {
                from = peaks[i].x - peaks[i].width * nWidth;
            }
        }
    }

    if (!to) {
        to = Number.MIN_VALUE;
        for (let i = 0; i < peaks.length; i++) {
            if (peaks[i].x + peaks[i].width * nWidth > to) {
                to = peaks[i].x + peaks[i].width * nWidth;
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

    var intensity = 'intensity';
    if (peaks[0].y) {
        intensity = 'y';
    }

    for (let i = 0; i < peaks.length; i++) {
        var peak = peaks[i];
        if (peak.x > from && peak.x < to) {
            var index = Math.round((peak.x - from) / dx);
            var w = Math.round(peak.width * nWidth / dx);
            if (fnName === 'gaussian') {
                for (var j = index - w; j < index + w; j++) {
                    if (j >= 0 && j < nbPoints) {
                        y[j] += peak[intensity] * Math.exp(-0.5 * Math.pow((peak.x - x[j]) / (peak.width / 2), 2));
                    }
                }
            } else {
                var factor = peak[intensity] * Math.pow(peak.width, 2) / 4;
                for (let j = index - w; j < index + w; j++) {
                    if (j >= 0 && j < nbPoints) {
                        y[j] += factor / (Math.pow(peak.x - x[j], 2) + Math.pow(peak.width / 2, 2));

                    }
                }
            }

        }
    }

    return {x: x, y: y};
}

module.exports = peak2Vector;

