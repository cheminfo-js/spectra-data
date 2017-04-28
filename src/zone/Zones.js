'use strict';

//const JAnalyzer = require('./../peakPicking/JAnalyzer');
const peakPicking2D = require('./../peakPicking/peakPicking2D');
const GUI = require('./visualizer/index');

class Zones extends Array {

    constructor(zones) {
        if (Array.isArray(zones)) {
            super(zones.length);
            for (let i = 0; i < zones.length; i++) {
                this[i] = zones[i];
            }
        } else if (typeof zones === 'number') {
            super(zones);
        } else {
            super();
        }
    }

    /**
     * This function return a Range instance from predictions
     * @param {object} predictions - predictions of a spin system
     * @param {object} options - options Object
     * @param {number} [options.lineWidth] - spectral line width
     * @param {number} [options.frequency] - frequency to determine the [from, to] of a range
     * @return {Ranges}
     */
    static fromPrediction(predictions, options) {
        /*
        let defOptions = {'H': {frequency: 400, lineWidth: 10}, 'C': {frequency: 100, lineWidth: 10}};
        const fromLabel = predictions[0].fromAtomLabel;
        const toLabel = predictions[0].toLabel;

        const frequencyX = options.frequencyX || defOptions[fromLabel].frequency;
        const frequencyY = options.frequencyY || defOptions[toLabel].frequency;
        var lineWidthX = options.lineWidthX || defOptions[fromLabel].lineWidth;
        var lineWidthY = options.lineWidthY || defOptions[toLabel].lineWidth; //http://www.eltiempo.com/estilo-de-vida/gente/charles-feeney-creador-de-duty-free-dono-su-fortuna/16830757
        */
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
            for (j = 1; j < diaIDs.length; j++) {
                result[i].signal.push(predictions[diaIDs[j]]);
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

        return new Zones(result);
    }

    /**
     * This function return Ranges instance from a SD instance
     * @param {SD} spectrum - SD instance
     * @param {object} opt - options object to extractPeaks function
     * @return {Ranges}
     */
    static fromSpectrum(spectrum, opt) {
        this.options = Object.assign({}, {}, opt);
        return new Zones(peakPicking2D(spectrum, this.options));
    }


    getAnnotations(options) {
        return GUI.annotations2D(this, options);
    }
}

module.exports = Zones;
