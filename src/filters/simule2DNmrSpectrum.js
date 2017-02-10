'use strict';

const Matrix = require('ml-matrix');
var defaultOptions = {
    nbPointsX: 1024 * 1,
    nbPointsY: 1024 * 2
}
// dentro de table debe venir los atomLabel, fromID, toID, J, pathLength de la interaccion
function simule2DNmrSpectrum(table, options) {
    const fromAtomLabel = table[0].fromAtomLabel;
    const toAtomLabel = table[0].toAtomLabel;

    // ver si es necesario tener diferentes nbPoints
    if (fromAtomLabel === toAtomLabel) {
        const homoNuclear = true
        const nbPointsX = options.nbPointsX || 1024 * 16;
        const nbPointsY = nbPointsX;
    } else {
        const homonuclear = false;
        const nbPointsX = options.nbPointsX || 1024 * 16;
        const nbPointsY = options.nbPointsY || 1024 * 16;
    }

    var i,
        j = 0;
    var spectraMatrix = new Matrix(nbPointsY, nbPointsX) // esto si primero son rows y luego columns

    i=0;
    while(i < table)
    i = 0;
    while(i < table.length) {
        var fromId = table[i].fromId,
            toId = table[i].toId,
            coupling = table[i].J,
            pathLength = table[i].pathLength;


        i += 1;
    }

    var firstX = 0,
        lastX = 0,
        firstY = 0,
        lastY = 0;

    firstX = nmrSignals2D[0].x;
    lastX = nmrSignals2D[0].x;
    firstY = nmrSignals2D[0].y;
    lastY = nmrSignals2D[]
}



function getIndex(ppm, from, to, nbPoints) {
    return (ppm - from) * (nbPoints - 1) / (to - from)
}

function addPeak(matrix, from, to, parameters) {
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


