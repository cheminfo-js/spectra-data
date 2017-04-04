'use strict';

//const JAnalyzer = require('./../peakPicking/JAnalyzer');
// const peakPicking = require('../peakPicking/peakPicking');
// const peaks2Ranges = require('../peakPicking/peaks2Ranges');
const acs = require('./acs/acs');
const peak2Vector = require('./peak2Vector');
const GUI = require('./visualizer/index');

class Ranges extends Array {

    constructor(ranges) {
        if (Array.isArray(ranges)) {
            super(ranges.length);
            for (let i = 0; i < ranges.length; i++) {
                this[i] = ranges[i];
            }
        } else if (typeof ranges === 'number') {
            super(ranges);
        } else {
            super();
        }
    }

    /**
     * This function return a Range instance from predictions
     * @param {Object} predictions - predictions of a spin system
     * @param {Object} options - options object
     * @param {number} [options.lineWidth] - spectral line width
     * @param {number} [options.frequency] - frequency to determine the [from, to] of a range
     * @returns {Ranges}
     */
    static fromPrediction(predictions, options) {
        options = Object.assign({}, {lineWidth: 1, frequency: 400, nucleus: '1H'}, options);
        //1. Collapse all the equivalent predictions
        const nPredictions = predictions.length;
        const ids = new Array(nPredictions);
        var i,
            j,
            diaIDs,
            prediction,
            width,
            center,
            jc;
        for (i = 0; i < nPredictions; i++) {
            if (!ids[predictions[i].diaIDs[0]]) {
                ids[predictions[i].diaIDs[0]] = [i];
            } else {
                ids[predictions[i].diaIDs[0]].push(i);
            }
        }
        const idsKeys = Object.keys(ids);
        const result = new Array(idsKeys.length);

        for (i = 0; i < idsKeys.length; i++) {
            diaIDs = ids[idsKeys[i]];
            prediction = predictions[diaIDs[0]];
            width = 0;
            jc = prediction.j;
            if (jc) {
                for (j = 0; j < jc.length; j++) {
                    width += jc[j].coupling;
                }
            }

            width += 2 * options.lineWidth;//Add 2 times the spectral lineWidth

            width /= options.frequency;

            result[i] = {from: prediction.delta - width,
                to: prediction.delta + width,
                integral: 1,
                signal: [predictions[diaIDs[0]]]};

            var multiplicity = ""
            for(var kk = 0; kk < predictions[diaIDs[0]].j.length; kk++) multiplicity += predictions[diaIDs[0]].j[kk].multiplicity;

            for (var k = 1; k < diaIDs.length; k++) {
                result[i].signal.push(predictions[diaIDs[k]]);
                for(var kk = 0; kk < predictions[diaIDs[k]].j.length; kk++) {
                    multiplicity += predictions[diaIDs[k]].j[kk].multiplicity;
                }
                result[i].integral++;
            }
            if (multiplicity == "") {
                result[i].multiplicity = 's'
            } else {
                result[i].multiplicity = multiplicity;
            }
        }
        //2. Merge the overlaping ranges
        for (i = 0; i < result.length; i++) {
            result[i]._highlight = result[i].signal[0].diaIDs;
            center = (result[i].from + result[i].to) / 2;
            width = Math.abs(result[i].from - result[i].to);
            for (j = result.length - 1; j > i; j--) {
                //Does it overlap?
                if (Math.abs(center - (result[j].from + result[j].to) / 2)
                    <= Math.abs(width + Math.abs(result[j].from - result[j].to)) / 2) {
                    result[i].multiplicity = 'm';
                    result[i].from = Math.min(result[i].from, result[j].from);
                    result[i].to = Math.max(result[i].to, result[j].to);
                    result[i].integral = result[i].integral + result[j].integral;
                    result[i]._highlight.push(result[j].signal[0].diaIDs[0]);
                    result.splice(j, 1);
                    j = result.length - 1;
                    center = (result[i].from + result[i].to) / 2;
                    width = Math.abs(result[i].from - result[i].to);
                }
            }
        }

        return new Ranges(result);
    }

    /**
     * This function return Ranges instance from a SD instance
     * @param {SD} spectrum - SD instance
     * @param {object} opt - options object to extractPeaks function
     * @returns {Ranges}
     */
    static fromSpectrum(spectrum, opt) {
        this.options = Object.assign({}, {
            nH: 99,
            clean: true,
            realTop: false,
            thresholdFactor: 1,
            compile: true,
            integralType: 'sum',
            optimize: true,
            idPrefix: '',
            format: 'new',
            frequencyCluster: 16,
        }, opt);

        return spectrum.getRanges(this.options);
    }

    /**
     * This function put signal.multiplicity with respect to
     * @returns {Ranges}
     */
    updateMultiplicity() {
        for (let i = 0; i < this.length; i++) {
            var range = this[i];
            for (let j = 0; j < range.signal.length; j++) {
                var signal = range.signal[j];
                if (signal.j && !signal.multiplicity) {
                    signal.multiplicity = '';
                    for (let k = 0; k < signal.j.length; k++) {
                        signal.multiplicity += signal.j[k].multiplicity;
                    }
                }
            }
        }
        return this;
    }

    /**
     * This function normalize or scale the integral data
     * @param {Object} options - object with the options
     * @param {Boolean} [options.sum] - anything factor to normalize the integrals, Similar to the number of proton in the molecule for a nmr spectrum
     * @param {number} [options.factor] - Factor that multiply the intensities, if [options.sum] is defined it is override
     * @returns {Ranges}
     */
    updateIntegrals(options) {
        var factor = options.factor || 1;
        var i;
        if (options.sum) {
            var nH = options.sum || 1;
            var sumObserved = 0;
            for (i = 0; i < this.length; i++) {
                sumObserved += this[i].integral;
            }
            factor = nH / sumObserved;
        }
        for (i = 0; i < this.length; i++) {
            this[i].integral *= factor;
        }
        return this;
    }

    /**
     * This function return the peak list as a object with x and y arrays
     * @param {Object} options - See the options parameter in {@link #peak2vector} function documentation
     * @returns {Object} - {x: Array, y: Array}
     */
    getVector(options) {
        return peak2Vector(this.getPeakList(), options);
    }

    /**
     * This function return the peaks of a Ranges instance into an array
     * @returns {Array}
     */
    getPeakList() {
        var peaks = [];
        var i,
            j;
        for (i = 0; i < this.length; i++) {
            var range = this[i];
            for (j = 0; j < range.signal.length; j++) {
                peaks = peaks.concat(range.signal[j].peak);
            }
        }
        return peaks;
    }

    /**
     * This function return format for each range
     * @param {Object} options - options object for toAcs function
     * @returns {*}
     */
    getACS(options) {
        return acs(this, options);
    }

    getAnnotations(options) {
        return GUI.annotations1D(this, options);
    }

    //this work with a spectrum as source
    // toIndex() {
    //     var ranges = this.getRanges(parameters);
    //     var toc = new Array(ranges.length);
    //     for(var i = 0; i < ranges.length; i++) {
    //         toc[i] = {
    //             multiplicity: ranges[i].signal[0].multiplicity,
    //             delta: ranges[i].to - (ranges[i].to - ranges[i].from) / 2
    //         }
    //     }
    //     return toc;
    // }

    toIndex() {
        var index = new Array(this.length);
        for(var i = 0; i < this.length; i++) {
            index[i] = {
                multiplicity: this[i].signal[0].multiplicity,
                delta: this[i].to - (this[i].to - this[i].from) / 2
            }
        }
        return index;
    }
}

module.exports = Ranges;
