/**
 * Created by acastillo on 8/17/16.
 */
'use strict';

//lineWidth in Hz frequency in MHz
const defaultOptions = {lineWidth: 1, frequency: 400};

module.exports.prediction2Ranges = function (predictions, opt) {
    const options = Object.assign({}, defaultOptions, opt);
    //1. Collapse all the equivalent predictions
    const nPredictions = predictions.length;
    const ids = new Array(nPredictions);
    var i, j, diaIDs, prediction, width, center, jc;
    for (i = 0; i < nPredictions; i++) {
        if (!ids[predictions[i].diaIDs[0]]) {
            ids[predictions[i].diaIDs[0]] = [i];
        }        else {
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
    for (i  =  0; i < result.length; i++) {
        result[i]._highlight = result[i].signal[0].diaIDs;
        center = (result[i].from + result[i].to) / 2;
        width = Math.abs(result[i].from - result[i].to);
        for (j  = result.length - 1; j > i; j--) {
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

    return result;
};
