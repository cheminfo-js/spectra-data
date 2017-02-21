'use strict';

const Matrix = require('ml-matrix');

var defaultOptions = {
    nbPointsX: 1024 * 1,
    nbPointsY: 1024 * 2
}

function simule2DNmrSpectrum(table, options) {
    var i, j;
    // console.log(table)
    const fromLabel = table[0].fromAtomLabel;
    const toLabel = table[0].toLabel;
    const freqResonanceCarbon = options.frequencyX || 100;
    const freqResonanceProton = options.frequencyY || 400;
    var lineWidthX = options.lineWidthX  || 20;
    var lineWidthY = options.lineWidthY  || 4;
    const resolutionX = lineWidthX / 2;
    const resolutionY = lineWidthY / 2
    const addX = 5;
    const addY = 3;
    lineWidthX = lineWidthX / freqResonanceCarbon ;
    lineWidthY = lineWidthY / freqResonanceProton ;
    // console.log("lineWidthX ", lineWidthX)
    // console.log("lineWidthY ", lineWidthY)

    if ((options.firstY !== undefined && options.lastY !== undefined)) {
        min
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
            minY = table[i].toChemicalShift;
        } else if (maxY < table[i].toChemicalShift) {
            maxY = table[i].toChemicalShift;
        }
        i += 1;
    }

    var nbPointsX = options.nbPointsX || Math.round(2 * (maxX - minX + 2 * addX) *
            freqResonanceCarbon / resolutionX);

    var nbPointsY = options.nbPointsY || Math.round(2 * (maxY - minY + 2 * addY) *
            freqResonanceProton / resolutionY);


    var transpose = false;
    var homoNuclear = false;
    var parameters;
    if (fromLabel === toLabel) {
        homoNuclear = true;
        parameters = {
            nbPointsX: nbPointsY,
            fromToX: [minX - addY, maxX + addY],
            fromToY: [minY - addY, maxY + addY],
            nbPointsY: nbPointsY,
            sigmaX: lineWidthY,
            sigmaY: lineWidthY,
        };
    } else {
        if(fromLabel === "H") {
            parameters = {
                nbPointsX: nbPointsY,
                nbPointsY: nbPointsX,
                fromToX: [minY - addX, maxY + addX],
                fromToY: [minX - addY, maxX + addY],
                sigmaX: lineWidthX,
                sigmaY: lineWidthY,
            };
            transpose = true;
        } else {
            parameters = {
                nbPointsX: nbPointsX,
                nbPointsY: nbPointsY,
                fromToX: [minX - addX, maxX + addX],
                fromToY: [minY - addY, maxY + addY],
                sigmaX: lineWidthX,
                sigmaY: lineWidthY,
            };
        }
    }

    var spectraMatrix = new Matrix(parameters.nbPointsY, parameters.nbPointsX).fill(0);

    var xVector = range(parameters.fromToX[0], parameters.fromToX[1], parameters.nbPointsX);
    var yVector = range(parameters.fromToY[0], parameters.fromToY[1], parameters.nbPointsY);

    i = 0;
    while(i < table.length) {
        parameters.couplingConstant = table[i].j;
        parameters.pathLength = table[i].pathLength;
        if(transpose) {
            parameters.integral = table[i].fromAtoms.length;
            parameters.fromChemicalShift = table[i].toChemicalShift;
            parameters.toChemicalShift = table[i].fromChemicalShift;
        } else {
            parameters.integral = homoNuclear ? table[i].toAtoms.length + table[i].fromAtoms.length : table[i].fromAtoms.length;
            parameters.fromChemicalShift = table[i].fromChemicalShift;
            parameters.toChemicalShift = table[i].toChemicalShift;
        }
        addPeak(spectraMatrix, xVector, yVector, parameters);
        i += 1;
    }
    return spectraMatrix;
}

function addPeak(matrix, xVector, yVector, parameters) {

    const fromToX = parameters.fromToX;
    const fromToY = parameters.fromToY;
    const X = parameters.fromChemicalShift;
    const Y = parameters.toChemicalShift;
    const couplingConstant = parameters.couplingConstant;
    const nbPointsX = parameters.nbPointsX;
    const nbPointsY = parameters.nbPointsY;
    const squareSigmaX = Math.pow(parameters.sigmaX, 2) * 2;
    const squareSigmaY = Math.pow(parameters.sigmaY, 2) * 2;
    const integral = parameters.integral;

    var xIndex = getIndex(X, fromToX[0], fromToX[1], nbPointsX);
    var yIndex = getIndex(Y, fromToY[0], fromToY[1], nbPointsY);

    var yMax = Y + parameters.sigmaY * 4;
    var yMaxIndex = getIndex(yMax, fromToY[0], fromToY[1], nbPointsY);

    var xMax = X + parameters.sigmaX * 4;
    var xMaxIndex = getIndex(xMax, fromToX[0], fromToX[1], nbPointsX);

    for (var j = 0; j < Math.abs(yIndex - yMaxIndex + 1); j++) {
        for (var i = 0; i < Math.abs(xIndex - xMaxIndex + 1); i++) {

            var exponent = Math.pow(xVector[xIndex + i] - X, 2) / squareSigmaX +
                Math.pow(yVector[yIndex + j] - Y, 2) / squareSigmaY;
            var result = integral / Math.exp(exponent);

            matrix[yIndex + j][xIndex + i] += result;
            matrix[yIndex - j][xIndex + i] += result;
            matrix[yIndex + j][xIndex - i] += result;
            matrix[yIndex - j][xIndex - i] += result;
        }
    }
}

function getIndex(ppm, from, to, nbPoints) {
    console.log("fromT")
    console.log(from, to)
    return Math.round(
        (ppm - from) * (nbPoints) / (to - from)
    );
}

function range(start, end, NbPoints) {
    var a = new Array(NbPoints);
    console.log(end, start, NbPoints)
    var jump = (end - start)/(NbPoints-1);
    // console.log("jump range")
    // console.log(jump)
    for (var i = 0; i < NbPoints; i++) {
        a[i] = start + jump * i;
    }
    return a;
}



module.exports = simule2DNmrSpectrum;