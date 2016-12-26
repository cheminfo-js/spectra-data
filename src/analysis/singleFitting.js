'use strict';
/**
 * Created by Abol on 12/21/2016.
 */

const ML = require('ml-curve-fitting');
const LM = ML.LM;
const algebra = ML.algebra;

function singleFitting(data, pInit, opts) {

    var y = (data.y === undefined) ? data.data.y : data.data[0].y;
    var x = (data.x === undefined) ? data.data.x : data.data[0].x;

    //Get the max for normalize
    var max = y[0];
    for (var i = 1; i < y.length; i++) {
        if (y[i] > max) max = y[i];
    }

    // prepare of the data for fitting
    var xDat = algebra.matrix(y.length, 1);
    var yDat = algebra.matrix(y.length, 1);

    for (i = 0; i < xDat.length; i++) {
        xDat[i][0] = x[i];
        yDat[i][0] = y[i] / max;
    }
    //calcule z position from spoffs data
    xDat = zGenerator(xDat, 6.811384250474384, 4258);

    x = [];
    y = [];

    for (i = 0; i < xDat.length; i++) {
        x.push(xDat[i][0]);
        y.push(yDat[i][0]);
    }

    var weight = [xDat.length / algebra.sqrt(algebra.multiply(algebra.transpose(yDat), yDat))];

    var pMin = algebra.multiply(algebra.abs(pInit), -10);
    var pMax = algebra.multiply(algebra.abs(pInit), 10);

    var consts = [];// optional vector of constants

    var pFit = LM.optimize(errFunc, pInit, xDat, yDat, weight, -0.01, pMin, pMax, consts, opts);

    pFit = pFit.p;

    var rango = [xDat[0][0], xDat[xDat.length - 1][0]];
    var t = algebra.matrix(100, 1);
    var ini = algebra.min(rango[0], rango[1]);
    var jump = algebra.abs(rango[0] - rango[1]) / 100;

    for (i = 0; i < 100; i++) t[i][0] = ini + jump * i;

    var yFitting = errFunc(t, pFit);

    var yFit = [];
    var xFit = [];

    for (i = 0; i < 100; i++) {
        xFit.push(t[i][0]);
        yFit.push(yFitting[i][0]);
    }
    return {dataProfile: {title: '', data: {x: x, y: y}}, fittingProfile: {title: '', data: {x: xFit, y: yFit}}, pFit: pFit};
}

function errFunc(z, p) {
    var a = p[0][0], b = p[1][0], c = p[2][0], d = p[3][0];
    var x = algebra.multiply(c, algebra.add(z, -d));
    const erfA = 0.147;
    var signOfX = algebra.matrix(x.length, 1);
    for (var i = 0; i < x.length; i++) {
        if (x[i][0] === 0) {
            signOfX[i][0] = 0;
        } else if (x[i][0] > 0) {
            signOfX[i][0] = 1;
        } else {
            signOfX[i][0] = -1;
        }
    }
    var potencia = algebra.dotMultiply(x, x);
    var onePlusA = algebra.add(1, algebra.multiply(erfA, potencia));
    var fourO = algebra.add(algebra.multiply(4, Math.pow(Math.PI, -1)), algebra.multiply(potencia, erfA));
    var ratio = algebra.dotDivide(fourO, onePlusA);
    ratio = algebra.dotMultiply(ratio, algebra.multiply(-1, potencia));
    var expofun = algebra.multiply(-1, algebra.exp(ratio));
    var radical = algebra.sqrt(algebra.add(expofun, 1));
    z = algebra.dotMultiply(signOfX, radical);
    z = algebra.add(a, algebra.multiply(b, z));
    return z;
}

function zGenerator(x, g, gamma) {
    var z = algebra.multiply(x, algebra.inv(g * gamma));
    return z;
}

module.exports = singleFitting;
