'use strict';

const Matrix = require('ml-matrix');

var defaultOptions = {
    nbPointsX: 1024 * 1,
    nbPointsY: 1024 * 2
}

function simule2DNmrSpectrum(table, options) {
    const fromLabel = table[0].fromAtomLabel;
    const toLabel = table[0].toLabel;
    var nbPointsX = options.nbPointsX || 1024;
    var nbPointsY = options.nbPointsY || 1024;
    var i,
        j;

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

    // con esto se busca simplificar el codigo para los casos en que toLabel === "C" ya que el cuerpo
    // del codigo esta disenado para tener fromChemicalShift como en el eje X y la solucion es transponer al final.
    var transpose = false;
    var homoNuclear = false;
    if (fromLabel === toLabel) {
        homoNuclear = true;
        var parameters = {
            nbPointsX: nbPointsX,
            fromToX: {from: minY - 0.5, to: maxY + 0.5},
            fromToY: {from: minY - 0.5, to: maxY + 0.5},
            nbPointsY: nbPointsY,
            sigmaX: 0.2,
            sigmaY: 0.2,
        }
    } else {
        if(toLabel === "C") {
            var parameters = {
                nbPointsX: nbPointsY,
                fromToX: {from: minX - 0.5, to: maxX + 0.5},
                fromToY: {from: minY - 10, to: maxY + 10},
                nbPointsY: nbPointsX
            }
            transpose = true;
        } else {
            var parameters = {
                nbPointsX: nbPointsX,
                fromToX: {from: minY - 15, to: maxY + 15},
                fromToY: {from: minX - 3, to: maxX + 3},
                nbPointsY: nbPointsY
            }
        }
    }

    var spectraMatrix = new Matrix(parameters.nbPointsY, parameters.nbPointsX).fill(0)


    i = 0;
    while(i < table.length) {
        parameters.fromAtoms = table[i].fromAtoms;
        parameters.toAtoms = table[i].toAtoms;
        parameters.couplingConstant = table[i].j;
        parameters.pathLength = table[i].pathLength;
        parameters.fromChemicalShift = table[i].fromChemicalShift;
        parameters.toChemicalShift = table[i].toChemicalShift;
        addPeak(spectraMatrix, parameters, transpose);
        i += 1;
    }
    return transpose ? spectraMatrix.transpose() : spectraMatrix;
}

function getIndex(ppm, from, to, nbPoints) {
    return Math.round(
        (ppm - from) * (nbPoints) / (to - from)
    );
}

function addPeak(matrix, parameters, transpose) {
    const fromToX = parameters.fromToX;
    const fromToY = parameters.fromToY;
    const toAtoms = parameters.toAtoms;
    const fromAtoms = parameters.fromAtoms;
    const X = parameters.fromChemicalShift;
    const Y = parameters.toChemicalShift;
    const couplingConstant = parameters.couplingConstant;
    const nbPointsX = parameters.nbPointsX;
    const nbPointsY = parameters.nbPointsY;

    var xIndex = getIndex(X, fromToX.from, fromToX.to, nbPointsX);
    var yIndex = getIndex(Y, fromToY.from, fromToY.to, nbPointsY);

    var yMax = transpose ? Y + 1.52;
    var yMaxIndex = getIndex(yMax, fromToY.from, fromToY.to, nbPointsY)
    var xMax = X + 1.;
    var xMaxIndex = getIndex(xMax, fromToX.from, fromToX.to, nbPointsX)
    // console.log(Y, X)
    for (var i = 0; i < Math.abs(xIndex - xMaxIndex + 1); i++) {
        for(var j = 0; j < Math.abs(yIndex - yMaxIndex + 1); j++) {
            var sigmaX = 0.5;
            var sigmaY = 0.2;

            var result = Math.exp(
                -1 * (Math.pow(i, 2) /(2 * sigmaX * sigmaX) +
                      Math.pow(j, 2) /(2 * sigmaY * sigmaY))
                ) / (2 * 3.1416 * sigmaX * sigmaY) * (toAtoms.length + fromAtoms.length);
            console.log(result);
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