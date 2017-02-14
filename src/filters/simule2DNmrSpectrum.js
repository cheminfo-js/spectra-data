'use strict';

const Matrix = require('ml-matrix');

var defaultOptions = {
    nbPointsX: 1024 * 1,
    nbPointsY: 1024 * 2
}

function simule2DNmrSpectrum(table, options) {
    const fromLabel = table[0].fromAtomLabel;
    const toLabel = table[0].toLabel;
    var i,
        j;

    if (fromLabel === toLabel) {
        var homoNuclear = true;
        var nbPointsX = options.nbPointsX || 100;//1024 * 16;
        var nbPointsY = options.nbPointsY || nbPointsX;
        var spectraMatrix = new Matrix(nbPointsY, nbPointsX).fill(0) // esto si primero son rows y luego columns
    } else {
        var homonuclear = false;
        var nbPointsX = options.nbPointsX || 100;//1024 * 16;
        var nbPointsY = options.nbPointsY || 100;//1024 * 16;
        var spectraMatrix = new Matrix(nbPointsY, nbPointsX).fill(0); // esto si primero son rows y luego columns
    }

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
            minX = table[i].toChemicalShift;
        } else if (maxX < table[i].toChemicalShift) {
            maxX = table[i].toChemicalShift;
        }
        i += 1;
    };
    var parameters = {
        nbPointsX: nbPointsX,
        fromToX: {from: minX - 0.5, to: maxX + 0.5},
        fromToY: {from: minY - 0.5, to: maxY + 0.5},
        nbPointsY: nbPointsY
    }
    i = 0;
    while(i < table.length) {
        parameters.fromAtoms = table[i].fromAtom
        parameters.toAtoms = table[i].toAtoms
        parameters.jCoupling = table[i].j
        parameters.pathLength = table[i].pathLength
        parameters.fromChemicalShift = table[i].fromChemicalShift
        parameters.toChemicalShift = table[i].toChemicalShift
        addPeak(spectraMatrix, parameters);
        i += 1;
    }
    return spectraMatrix;
}



function getIndex(ppm, from, to, nbPoints) {
    return Math.round(
        (ppm - from) * (nbPoints - 1) / (to - from)
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

    var xIndex = getIndex(X, fromToX.from, fromToX.to, nbPointsX);
    var yIndex = getIndex(Y, fromToY.from, fromToY.to, nbPointsY);

    var yMax = Y + couplingConstant * 2.32;
    var yMaxIndex = getIndex(yMax, fromToY.from, fromToY.to, nbPointsY)
    var xMax = X + couplingConstant * 2.32;
    var xMaxIndex = getIndex(xMax, fromToX.from, fromToX.to, nbPointsX)
    for (var i = 0; i < Math.abs(xIndex - xMaxIndex + 1); i++) {
        for(var j = 0; j < Math.abs(yIndex - yMaxIndex + 1); j++) {
            var sigmaX = couplingConstant;
            var sigmaY = couplingConstant;

            var result = Math.exp(
                -1 * (Math.pow(i, 2) /(2 * sigmaX * sigmaX) +
                      Math.pow(j, 2) /(2 * sigmaY * sigmaY))
                ) / (2 * 3.1416 * sigmaX * sigmaY);

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