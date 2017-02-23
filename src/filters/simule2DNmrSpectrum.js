'use strict';

const Matrix = require('ml-matrix');

let defOptions = {'H': {frequency: 400, lineWidth: 10}, 'C': {frequency: 100, lineWidth: 10}}


function simule2DNmrSpectrum(table, options) {
    var i, j;
    const fromLabel = table[0].fromAtomLabel;
    const toLabel = table[0].toLabel;
    const frequencyX = options.frequencyX || defOptions[fromLabel].frequency;
    const frequencyY = options.frequencyY || defOptions[toLabel].frequency;
    var lineWidthX = options.lineWidthX  || defOptions[fromLabel].lineWidth;
    var lineWidthY = options.lineWidthY  || defOptions[toLabel].lineWidth;

    var sigmaX = lineWidthX / frequencyX;
    var sigmaY = lineWidthY / frequencyY;

    var minX = table[0].fromChemicalShift;
    var maxX = table[0].fromChemicalShift;
    var minY = table[0].toChemicalShift;
    var maxY = table[0].toChemicalShift;
    i = 1;
    while(i < table.length) {
        minX = Math.min(minX, table[i].fromChemicalShift);
        maxX = Math.max(maxX, table[i].fromChemicalShift);
        minY = Math.min(minY, table[i].toChemicalShift);
        maxY = Math.max(maxY, table[i].toChemicalShift);
        i++;
    }

    if(options.firstX !== null && !isNaN(options.firstX))
        minX = options.firstX;
    if(options.firstY !== null && !isNaN(options.firstY))
        minY = options.firstY;
    if(options.lastX !== null && !isNaN(options.lastX))
        maxX = options.lastX
    if(options.lastY !== null && !isNaN(options.lastY))
        maxY = options.lastY;

    var nbPointsX = options.nbPointsX || 512;
    var nbPointsY = options.nbPointsY || 512;

    var spectraMatrix = new Matrix(nbPointsY, nbPointsX).fill(0);
    i = 0;
    while(i < table.length) {
        //parameters.couplingConstant = table[i].j;
        //parameters.pathLength = table[i].pathLength;
        let peak = {
            x: unitsToArrayPoints(table[i].fromChemicalShift, minX, maxX, nbPointsX),
            y: unitsToArrayPoints(table[i].toChemicalShift, minY, maxY, nbPointsY),
            z: table[i].fromAtoms.length + table[i].toAtoms.length,
            widthX: unitsToArrayPoints(sigmaX + minX, minX, maxX, nbPointsX),
            widthY: unitsToArrayPoints(sigmaY+ minY, minY, maxY, nbPointsY)
        }
        addPeak(spectraMatrix, peak);
        i++;
    }
    return spectraMatrix;
}

function unitsToArrayPoints(x, from, to, nbPoints) {
    return ((x - from) * nbPoints - 1) / (to - from);
}

function addPeak(matrix, peak) {
    var nSigma = 4;
    var fromX = Math.max(0, Math.round(peak.x - peak.widthX * nSigma));
    var toX = Math.min(matrix[0].length - 1, Math.round(peak.x + peak.widthX * nSigma));
    var fromY =  Math.max(0, Math.round(peak.y - peak.widthY * nSigma));
    var toY = Math.min(matrix.length - 1, Math.round(peak.y + peak.widthY * nSigma));

    var squareSigmaX = peak.widthX * peak.widthX;
    var squareSigmaY = peak.widthY * peak.widthY;
    for (var j = fromY; j < toY; j++) {
        for (var i = fromX; i < toX; i++) {
            var exponent = Math.pow(peak.x - i, 2) / squareSigmaX +
                Math.pow(peak.y - j, 2) / squareSigmaY;
            var result = 10000 * peak.z * Math.exp( - exponent);
            matrix[j][i] += result;
        }
    }
}


module.exports = simule2DNmrSpectrum;