'use strict';
/**
 * @private
 * Created by Abol on 12/21/2016.
 */

const ML = require('ml-curve-fitting');
const LM = ML.LM;
const algebra = ML.Matrix.algebra;

/**
 * This function make a fitting of data with sigmoid behavior
 * @param {Matrix} xDat - spatial vector in centimeter or spoffs units, if is it in spoffs is needed to put
 * options.spoffs and options.optSpoffsToCentimeters
 * @param {Matrix} yDat - integral values vector.
 * @param {Object} options - some parameter for optimize and spoffsToCentimeters functions
 * @param {Matrix} [options.pInit] - guest to least
 * @param {Array} [options.consts = []] - optional vector of constants default: []
 * @param {Matrix} [options.weight] - weights vector at the moment of the fitting, default is
 * [xDat.length / algebra.sqrt(algebra.multiply(algebra.transpose(yDat), yDat))]
 * @param {Array} [options.parameters] - parameter to LM.optimize function. Default is 
 * [3, 100, 1e-3, 1e-3, 1e-3, 1e-2, 1e-2, 11, 9,  1]
 * @param {object} [options.spoffsToCentimeters] - if it is defined, the Day will be converted to centimeter units, 
 * it should has two properties needed to convert
 * @param {number} [options.spoffsToCentimeters.gamma = 42.57747892] - Giromagnetic ratio of observe nuclei in MHz * T^(-1) units
 * Default: proton value  -> 42.57747892 MHz * T^(-1)
 * @param {number} [options.spoffsToCentimeters.gradientValue] - strength of gradient in Gauss unit
 * @returns {object}
 */
function fittingProfile(xDat, yDat, options) {

    if (!options.pInit) return;

    xDat = ML.Matrix.checkMatrix(xDat);
    yDat = ML.Matrix.checkMatrix(yDat);

    if (options.spoffsToCentimeters || false) {
       var optionsSpoffsToCentimeters = options.spoffsToCentimeters ? options.spoffsToCentimeters : {};
       xDat = spoffsToCentimeters(xDat, optionsSpoffsToCentimeters);
    }

    var weight = options.weight ? options.weight : [xDat.length / algebra.sqrt(algebra.multiply(algebra.transpose(yDat), yDat))];

    var pMin = options.pMin ? options.pMin : algebra.multiply(algebra.abs(options.pInit), -10);
    var pMax = options.pMax ? options.pMax : algebra.multiply(algebra.abs(options.pInit), 10);

    var parameters = options.parameters ? options.parameters : [3, 100, 1e-3, 1e-3, 1e-3, 1e-2, 1e-2, 11, 9,  1];
    var consts = options.consts ? options.consts : [];

    var pFit = LM.optimize(errFunc, options.pInit, xDat, yDat, weight, -0.01, pMin, pMax, consts, parameters);

    return pFit;
}

// function singleFitting(data, pInit, opts) {
//
//     var y = (data.y === undefined) ? data.data.y : data.data[0].y;
//     var x = (data.x === undefined) ? data.data.x : data.data[0].x;
//
//     //Get the max for normalize
//     var max = y[0];
//     for (var i = 1; i < y.length; i++) {
//         if (y[i] > max) max = y[i];
//     }
//
//     // prepare of the data for fitting
//     var xDat = algebra.matrix(y.length, 1);
//     var yDat = algebra.matrix(y.length, 1);
//
//     for (i = 0; i < xDat.length; i++) {
//         xDat[i][0] = x[i];
//         yDat[i][0] = y[i] / max;
//     }
//     //calcule z position from spoffs data
//     xDat = zGenerator(xDat, 6.811384250474384, 4258);
//
//     x = [];
//     y = [];
//
//     for (i = 0; i < xDat.length; i++) {
//         x.push(xDat[i][0]);
//         y.push(yDat[i][0]);
//     }
//
//     var weight = [xDat.length / algebra.sqrt(algebra.multiply(algebra.transpose(yDat), yDat))];
//
//     var pMin = algebra.multiply(algebra.abs(pInit), -10);
//     var pMax = algebra.multiply(algebra.abs(pInit), 10);
//
//     var consts = [];// optional vector of constants
//
//     var pFit = LM.optimize(errFunc, pInit, xDat, yDat, weight, -0.01, pMin, pMax, consts, opts);
//
//     pFit = pFit.p;
//
//     var rango = [xDat[0][0], xDat[xDat.length - 1][0]];
//     var t = algebra.matrix(100, 1);
//     var ini = algebra.min(rango[0], rango[1]);
//     var jump = algebra.abs(rango[0] - rango[1]) / 100;
//
//     for (i = 0; i < 100; i++) t[i][0] = ini + jump * i;
//
//     var yFitting = errFunc(t, pFit);
//
//     var yFit = [];
//     var xFit = [];
//
//     for (i = 0; i < 100; i++) {
//         xFit.push(t[i][0]);
//         yFit.push(yFitting[i][0]);
//     }
//     return {dataProfile: {title: '', data: {x: x, y: y}}, fittingProfile: {title: '', data: {x: xFit, y: yFit}}, pFit: pFit};
// }

/**
 * @private
 * This function make an approximation with elementary functions of error function present in:
 * Winitzki, Sergei (6 February 2008). "A handy approximation for the error function and its inverse"
 * https://sites.google.com/site/winitzki/sergei-winitzkis-files/erf-approx.pdf?attredirects=0
 * it make use of Matrix methods to be compatible with 'optimize' function
 * @param {Matrix} z - it is a vector of independent variable in format Matrix or 2DArray,
 * the function need Matrix methods.
 * @param {Matrix} p - four parameters of the function.
 * p[0][0] -> offset respect to dependent axis
 * p[1][0] -> curvature factor of the sigmoid shape
 * p[2][0] -> fix the range in the independent axis
 * p[3][0] -> offset respect to independent axis
 * @returns {Matrix} 2DArray with values of dependent axis.
 */

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


/**
 * @private
 * This function convert spoffs units to centimeters
 * @param {Matrix} x - vector of spoffs values
 * @param {object} options - two parameter need to convert
 * @param {number} [options.gamma] - giromagnetic ratio of observe nuclei in MHz * T^(-1) units
 * @param {number} [options.gradientValue] - strength of gradient in Gauss unit
 * @returns {Matrix} z - vector converted to centimeters units
 */

function spoffsToCentimeters(x, options) {
    var g = options.gradientValue ? options.gradientValue : 9.4786;
    var gamma = options.gamma ? options.gamma * 100 : 4257.747892;
    var z = algebra.multiply(x, algebra.inv(g * gamma));
    return z;
}

module.exports = fittingProfile;
