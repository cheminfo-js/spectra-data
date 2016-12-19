'use strict';
/**
 * Created by abol on 12/9/16.
 */

// const SD = require('../SD');
// const Brukerconverter = require('brukerconverter');
// const statArray = require('ml-stat');
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



function singleFitting(data, pInit, opts) {
    
    var y = (data.y === undefined) ? data.data.y : data.data[0].y;
    var x = (data.x === undefined) ? data.data.x : data.data[0].x;

    //Get the max for normalize
    var max = y[0];
    for (var i = 1; i < y.length; i++) {
        if (y[i] > max) max = y[i];
    }

    // prepare of the data for fitting
    var xDat = math.matrix(y.length, 1);
    var yDat = math.matrix(y.length, 1);

    for (i = 0; i < xDat.length; i++) {
        xDat[i][0] = x[i];
        yDat[i][0] = y[i]/max;
    }
    //calcule z position
    xDat = zGenerator(xDat, 6.811384250474384, 4258);

    x = [], y = [];

    for (i = 0; i < xDat.length; i++) {
        x.push(xDat[i][0]);
        y.push(yDat[i][0]);
    }

    var weight = [xDat.length / math.sqrt(math.multiply(math.transpose(yDat), yDat))];

    var pMin = math.multiply(math.abs(pInit), -10);
    var pMax = math.multiply(math.abs(pInit), 10);

    var consts = [];// optional vector of constants

    var pFit = LM.optimize(errFunc, pInit, xDat, yDat, weight, -0.01, pMin, pMax, consts, opts);

    pFit = pFit.p;

    var rango = [xDat[0][0], xDat[xDat.length - 1][0]];
    var t = math.matrix(100, 1);
    var ini = math.min(rango[0], rango[1]);
    var jump = math.abs(rango[0] - rango[1]) / 100;

    for (i = 0; i < 100; i++) t[i][0] = ini + jump * i;

    var yFitting = errFunc(t, pFit);

    var yFit = [], xFit = [];

    for (i=0; i < 100; i++) {
        xFit.push(t[i][0]);
        yFit.push(yFitting[i][0]);
    }
    return {dataProfile:{title: "", data: {x: x, y: y}}, fittingProfile: {title: "", data: {x: xFit, y: yFit}}, pFit: pFit};
}

function errFunc(z, p) {
    var a = p[0][0], b = p[1][0], c = p[2][0], d = p[3][0];
    var x = math.multiply(c, math.add(z, -d));
    const erfA = 0.147;
    var signOfX = math.matrix(x.length, 1);
    for (var i = 0; i < x.length; i++) {
        if (x[i][0] === 0) {
            signOfX[i][0] = 0;
        } else if(x[i][0] > 0) {
            signOfX[i][0] = 1;
        } else {
            signOfX[i][0] = -1;
        }
    }
    var potencia = math.dotMultiply(x, x);
    var onePlusA = math.add(1, math.multiply(erfA, potencia));
    var fourO = math.add(math.multiply(4, Math.pow(Math.PI, -1)), math.multiply(potencia, erfA));
    var ratio = math.dotDivide(fourO, onePlusA);
    ratio = math.dotMultiply(ratio, math.multiply(-1, potencia));
    var expofun = math.multiply(-1, math.exp(ratio));
    var radical = math.sqrt(math.add(expofun, 1));
    z = math.dotMultiply(signOfX, radical);
    z = math.add(a, math.multiply(b, z));
    return z;
}

function zGenerator(x, g, gamma) {
    var z = math.multiply(x, math.inv(g*gamma));
    return z;
}


module.exports = profile;