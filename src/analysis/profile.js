'use strict';
/**
 * Created by abol on 12/9/16.
 */

const ML = require('ml-curve-fitting');
const LM = ML.LM;
const math = ML.algebra;

/**
 *  This function extract the grandient concentration for a spatial (z) profile acquired with a spatially selective NMR experiment.
 * @param {array} pdata
 * @param {array} signals
 * @param {number} threshold
 * @returns {Array}
 */

function profile(pdata, signals, threshold) {

    var peaks = pdata[0].peakPicking;

    var Data = new Array(signals.length);

    var dataShift = {}, dataProfile = {};

    for (var i = 0; i < signals.length; i++) {
        var ini = true;
        for (var k = 0; k < peaks.length; k++) {
            if (Math.abs(peaks[k].signal[0].delta - signals[i]) <= threshold) {
                dataShift = {x: [peaks[k].signal[0].delta], y: [Number(pdata[0].filename)]};
                dataProfile = {x: [Number(pdata[0].filename)], y: [peaks[k].integral]};
                Data[i] = {title: signals[i].toString(), shift: {data: dataShift}, profile: {data: dataProfile}};
                k = peaks.length;
                ini = false;
            }
        }
        if (ini) {
            dataShift = {x: [], y: []};
            dataProfile = {x: [], y: []};
            Data[i] = {title: signals[i].toString(), shift: {data: dataShift}, profile: {data: dataProfile}};
        }
    }

    for (i = 1; i < pdata.length; i++) {
        peaks = pdata[i].peakPicking;
        for (var j = 0; j < signals.length; j++) {
            for (k = 0; k < peaks.length; k++) {
                if (Math.abs(peaks[k].signal[0].delta - signals[j]) <= threshold) {
                    var temp = Data[j];
                    temp.profile.data.y.push(peaks[k].integral);
                    temp.profile.data.x.push(Number(pdata[i].filename));
                    temp.shift.data.y.push(Number(pdata[i].filename));
                    temp.shift.data.x.push(peaks[k].signal[0].delta);
                    signals[j] = peaks[k].signal[0].delta;
                    k = peaks.length;
                }
            }
        }
    }
    return Data;
}






module.exports = profile;