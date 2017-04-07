'use strict';

//const JAnalyzer = require('./../peakPicking/JAnalyzer');
// const peakPicking = require('../peakPicking/peakPicking');
// const peaks2Ranges = require('../peakPicking/peaks2Ranges');







// const acs = require('./acs/acs');




const peak2Vector = require('./peak2Vector');
const GUI = require('./visualizer/index');
const patterns = ['s', 'd', 't', 'q', 'quint', 'h', 'sept', 'o', 'n'];

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

            result[i] = {
                from: prediction.delta - width,
                to: prediction.delta + width,
                integral: 1,
                signal: [predictions[diaIDs[0]]]
            };

            var multiplicity = '';

            for (var k = 1; k < diaIDs.length; k++) {
                result[i].signal.push(predictions[diaIDs[k]]);
                for (var kk = 0; kk < predictions[diaIDs[k]].j.length; kk++) {
                    multiplicity += predictions[diaIDs[k]].j[kk].multiplicity;
                }
                result[i].integral++;
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

    /**
     * Return an array of deltas and multiplicity for an index database
     * @options {array} options
     * @returns {Array} [{delta, multiplicity},...]
     */
    toIndex(options) {
        var index = [];

        if (options.compactPattern || false) this.compactPatterns(options);

        for (var range of this) {
            if (Array.isArray(range.signal) && range.signal.length > 0) {
                range.signal.forEach(s => {
                    index.push({
                        multiplicity: s.multiplicity || joinMultiplicityOfJ(s)
                    })
                })
            } else {
                index.push({
                    delta: (range.to + range.from) / 2,
                    multiplicity: 'm'
                })
            }
        }
        return index;
    }


    /**
     * Returns the multiplet in the compact format
     * @param {object} signal
     * @param {object} Jc
     * @return {string}
     * @private
     */
    compactPatterns(options) {
        this.forEach(range => {
            range.signal.forEach(signal => {
                signal.multiplicity = compactPattern(signal, options);
            });
        });
    }

    clone() {
        let newRanges = JSON.parse(JSON.stringify(this));
        return new Ranges(newRanges);
    }
}

module.exports = Ranges;


function compactPattern(signal, options) {
    var jc = signal.j;
    var cont = 1;
    var pattern = '';
    var tolerance = options.tolerance || 0.05;
    var normalLineWidth = options.normalLineWidth || 0.2
    var newNmrJs = [], diaIDs = [], atoms = [];atoms
    if (jc && jc.length > 0) {
        jc.sort(function (a, b) {
            return a.coupling - b.coupling;
        });
        if (jc[0].diaID)
            diaIDs = [jc[0].diaID];
        if (jc[0].assignment)
            atoms = [jc[0].assignment];
        for (var i = 0; i < jc.length - 1; i++) {
            if (Math.abs(jc[i].coupling - jc[i + 1].coupling) < tolerance) {
                cont++;
                diaIDs.push(jc[i].diaID);
                atoms.push(jc[i].assignment);
            } else {
                let jTemp = {
                    'coupling': Math.abs(jc[i].coupling),
                    'multiplicity': patterns[cont]
                };
                if (diaIDs.length > 0)
                    jTemp.diaID = diaIDs;
                if (atoms.length > 0)
                    jTemp.assignment = atoms;
                newNmrJs.push(jTemp);

                pattern += patterns[cont];
                cont = 1;
                if (jc[0].diaID)
                    diaIDs = [jc[i].diaID];
                if (jc[0].assignment)
                    atoms = [jc[i].assignment];
            }
        }
        let jTemp = {
            'coupling': Math.abs(jc[i].coupling),

            'multiplicity': patterns[cont]
        };
        if (diaIDs.length > 0)
            jTemp.diaID = diaIDs;
        if (atoms.length > 0)
            jTemp.assignment = atoms;
        newNmrJs.push(jTemp);

        pattern += patterns[cont];
        signal.j = newNmrJs;

    } else {
        pattern = 's'; // inside of signal don't exist a startX stopX properties
        if (Math.abs(signal.startX - signal.stopX) * signal.observe > normalLineWidth) {
            //TODO this hsould never happen based on the speicifications. startX and stopX does not exists
            throw Error('Should not happen')
            pattern = 's br';
        }
    }
    return pattern;
}

