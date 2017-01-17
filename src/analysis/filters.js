'use strict';
/**
 * Created by Abol on 12/23/2016.
 */

const ML = require('ml-curve-fitting');
const algebra = ML.algebra;
const singleFitting = require('./fittingProfile')


function getSignals(pdata, maxShiftDifference) {
    var signals = [];
    var signalsTemp = [];
    if (maxShiftDifference === undefined) {
        var maxShiftDifference = 0.06;
    }

    for (var k = 0; k < pdata[0].peakPicking.length; k++) {
        signals.push(pdata[0].peakPicking[k].signal[0].delta);
        signalsTemp.push(pdata[0].peakPicking[k].signal[0].delta);
    }

    for (var i = 0; i < pdata.length; i++) {
        //console.log("i: "+i)
        var peaks = pdata[i].peakPicking;
        for (var k = 0; k < peaks.length; k++) {
            var newSignal = true;
            for (var j = 0; j < signals.length; j++) {
                if (Math.abs(peaks[k].signal[0].delta - signalsTemp[j]) <= maxShiftDifference) {
                    signalsTemp[j] = peaks[k].signal[0].delta;
                    newSignal = false;
                    j = signals.length;
                }
            }
            if (newSignal) {
                signals.push(peaks[k].signal[0].delta);
                signalsTemp.push(peaks[k].signal[0].delta);
            }
        }
    }
    return signals;
}

function mddnmrPlot(pdata, pInit, opts) {
    pInit = pInit ? pInit : algebra.matrix([[0.1], [0.2], [8], [0.1]]);
    opts = opts ? opts : [3, 100, 1e-3, 1e-3, 1e-3, 1e-2, 1e-2, 11, 9,  1];
    var parAjusted = new Array(pdata.length);

    for (var i = 0; i < pdata.length; i++) {
        var profile = pdata[i].profile;
        var fitting = singleFitting(profile, pInit, opts);
        parAjusted[i] = [pdata[i].delta, fitting.pFit[1][0]]
    }
}

