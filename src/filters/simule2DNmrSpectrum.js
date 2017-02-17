'use strict';

const Matrix = require('ml-matrix');

var defaultOptions = {
    nbPointsX: 1024 * 1,
    nbPointsY: 1024 * 2
}

function simule2DNmrSpectrum(table, options) {
    var i, j;
    const fromLabel = table[0].fromAtomLabel;
    const toLabel = table[0].toLabel;
    const resolution = options.resolution || 0.6;
    const freqResonanceCarbon = options.freqResonance / 4 || 75;
    const freqResonanceProton = options.freqResonance || 300;

    // find the maximum and minimum chemical shift
    i = 1;
    var minX = table[0].fromChemicalShift,
        maxX = table[0].fromChemicalShift,
        minY = table[0].toChemicalShift,
        maxY = table[0].toChemicalShift;

    while(i < table.length) {
        if(minX > table[i].fromChemicalShift) {
            minX = table[i].fromChemicalShift;
        } else if (maxX < table[i].fromChemicalShift) {
            maxX = table[i].fromChemicalShift;
        }
        if(minY > table[i].toChemicalShift) {
            minY = table[i].toChemicalShift;
        } else if (maxY < table[i].toChemicalShift) {
            maxY = table[i].toChemicalShift;
        }
        i += 1;
    }

    var nbPointsX = options.nbPointsX || 2 * (maxX - minX) *
    freqResonanceCarbon * Math.pow(10, 6) / resolution;

    var nbPointsY = options.nbPointsY || 2 * (maxY - minY) *
    freqResonanceProton * Math.pow(10, 6) / resolution;

    // con esto se busca simplificar el codigo para los casos en que toLabel === "C" ya que el cuerpo
    // del codigo esta disenado para tener fromChemicalShift como en el eje X y la solucion es transponer al final.
    var transpose = false;
    var homoNuclear = false;
    if (fromLabel === toLabel) {
        homoNuclear = true;
        var parameters = {
            nbPointsX: nbPointsX,
            fromToX: [minX - 3, maxX + 3],
            fromToY: [minX - 3, maxX + 3],
            nbPointsY: nbPointsY,
            sigmaX: 0.1,
            sigmaY: 0.1,
        }
    } else {
        if(fromLabel === "H") {
            var parameters = {
                nbPointsX: nbPointsY,
                nbPointsY: nbPointsX,
                fromToX: [minY - 15, maxY + 15],
                fromToY: [minX - 3, maxX + 3],
                sigmaX: 0.1,
                sigmaY: 0.2,
            }
            transpose = true;
        } else {
            var parameters = {
                nbPointsX: nbPointsX,
                nbPointsY: nbPointsY,
                fromToX: [minX - 15, maxX + 15],
                fromToY: [minY - 3, maxY + 3],
                sigmaX: 0.2,
                sigmaY: 0.1,
            }
        }
    }


    var spectraMatrix = new Matrix(parameters.nbPointsY, parameters.nbPointsX).fill(0);


    i = 0;
    while(i < table.length) {
        parameters.couplingConstant = table[i].j;
        parameters.pathLength = table[i].pathLength;
        if(transpose) {
            parameters.integral = table[i].toAtoms.length;
            parameters.fromChemicalShift = table[i].toChemicalShift;
            parameters.toChemicalShift = table[i].fromChemicalShift;
        } else {
            parameters.integral = homoNuclear ? table[i].toAtoms.length + table[i].fromAtoms.length : table[i].fromAtoms.length;
            parameters.fromChemicalShift = table[i].fromChemicalShift;
            parameters.toChemicalShift = table[i].toChemicalShift;
        }
        addPeak(spectraMatrix, parameters, transpose);
        i += 1;
    }
    return spectraMatrix;
}

function getIndex(ppm, from, to, nbPoints) {
    return Math.round(
        (ppm - from) * (nbPoints) / (to - from)
    );
}

function addPeak(matrix, parameters) {
    const fromToX = parameters.fromToX;
    const fromToY = parameters.fromToY;
    const X = parameters.fromChemicalShift;
    const Y = parameters.toChemicalShift;
    const couplingConstant = parameters.couplingConstant;
    const nbPointsX = parameters.nbPointsX;
    const nbPointsY = parameters.nbPointsY;
    const sigmaX = parameters.sigmaX;
    const sigmaY = parameters.sigmaY;
    const integral = parameters.integral;

    var xIndex = getIndex(X, fromToX[0], fromToX[1], nbPointsX);
    var yIndex = getIndex(Y, fromToY[0], fromToY[1], nbPointsY);

    var yMax = Y - sigmaY * (Math.log(integral) + 0.2258);
    var yMaxIndex = getIndex(yMax, fromToY[0], fromToY[1], nbPointsY)

    var xMax = X - sigmaY * (Math.log(integral) + 0.2258);
    var xMaxIndex = getIndex(xMax, fromToX[0], fromToX[1], nbPointsX)

    for (var i = 0; i < Math.abs(xIndex - xMaxIndex + 1); i++) {
        for(var j = 0; j < Math.abs(yIndex - yMaxIndex + 1); j++) {

            var result = Math.exp(
                -1 * (Math.pow(i, 2) /(2 * sigmaX * sigmaX) +
                      Math.pow(j, 2) /(2 * sigmaY * sigmaY))
                ) / (2 * 3.1416 * sigmaX * sigmaY) * 100000;
            // console.log(result);
            matrix[yIndex + j][xIndex + i] += result;
            matrix[yIndex - j][xIndex + i] += result;
            matrix[yIndex + j][xIndex - i] += result;
            matrix[yIndex - j][xIndex - i] += result;
        }
    }
}




// function createPeaksFromNmrSignals(spectraData, signals) {
//     car firstX = 1
// }
//
// function getSpectraData(nmrSignals2D, parameters) {
//     if(!signals) return;
//
//     if(parameters !== undefined) {
//         var width = parameters.width,
//             heigth = parameters.heigth,
//             nbPoints = parameters.nbPoints,
//             nbSubSpectraData = parameters.nbSubSpectra;
//     } else {
//         return;
//     }
//
//     var firstX = 0,
//         lastX = 0,
//         firstY = 0,
//         lastY = 0;
//
//     firstX = nmrSignals2D[0].x;
//     lastX = nmrSignals2D[0].x;
//     firstY = nmrSignals2D[0].y;
//     lastY = nmrSignals2D[]
// }


module.exports = simule2DNmrSpectrum;