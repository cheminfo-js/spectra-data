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

function updateSignals(pdata, maxShiftDifference) {
    var signals = getSignals(pdata, maxShiftDifference);
    signals.sort(
        (a,b) => {return a - b}
    );
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

function peakPickingSomeRegions(pdata, filename, regions) {
    // console.log("peakPicking on some regions info:");
    var i,
        j,
        k;
    for (i = 0; i < pdata.length; i++) {
        if (pdata[i].filename === filename) {
            for (j = 0; j < regions.length; j++) {
                var range = regions[j].range;
                if (range.length === 2) {
                    var from = range[0];
                    var to = range[1];
                    if (from > to) {
                        var temp = from;
                        from = to;
                        to = temp;
                    }
                    var tmp = JSON.parse(JSON.stringify(pdata[i]));
                    var SE = false, counter = 0 ;
                    for (k = 0; k < tmp.peakPicking.length; k++) {
                        var delta = tmp.peakPicking[k].signal[0].delta;
                        if (delta <= to && delta >= from) counter += 1;
                        if (counter >= regions[j].NbSignal) {
                            k = tmp.peakPicking.length;
                            SE = true;
                        }
                    }
                    if (!SE) {
                        var spectrum = new SD.NMR(tmp.value, {});
                        var options = pdata[i].optionsNMRPeakDetection;
                        options.from = from;
                        options.to = to;
                        var peakList = spectrum.createRanges(options);
                        tmp = pdata[i];
                        for (k = 0; k < peakList.length; k++) {
                            tmp.peakPicking.push(peakList[k]);
                        }
                    }
                }
            }
            tmp.peakPicking.sort(
                    (a, b) => {return a.from - b.from}
            );
            //tmp.annotations = SD.GUI.annotations1D(tmp.peakPicking);
            i = pdata.length;
        }
    }
};
