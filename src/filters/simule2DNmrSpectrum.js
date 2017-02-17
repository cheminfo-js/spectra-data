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
    const resolution = options.resolution || 3;
    const freqResonanceCarbon = options.frequencyX || 100;
    const freqResonanceProton = options.frequencyY || 400;
    var lineWidthX = options.lineWidthX  || 8;
    var lineWidthY = options.lineWidthY  || 12;
    const addX = 5;
    const addY = 0.5
    lineWidthX = lineWidthX / freqResonanceCarbon;
    lineWidthY = lineWidthY / freqResonanceProton;
    // console.log("lineWidthX ", lineWidthX)
    // console.log("lineWidthY ", lineWidthY)

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
    // console.log("minMax of X and Y")
    // console.log(minX, maxX)
    // console.log(minY, maxY)
    var nbPointsX = options.nbPointsX || Math.round(2 * (maxX - minX + 2 * addX) *
            freqResonanceCarbon / resolution);

    var nbPointsY = options.nbPointsY || Math.round(2 * (maxY - minY + 2 * addY) *
            freqResonanceProton / resolution);


    var transpose = false;
    var homoNuclear = false;
    if (fromLabel === toLabel) {
        homoNuclear = true;
        var parameters = {
            nbPointsX: nbPointsX,
            fromToX: [minX - addY, maxX + addY],
            fromToY: [minY - addY, maxY + addY],
            nbPointsY: nbPointsY,
            sigmaX: lineWidthX,
            sigmaY: lineWidthY,
        }
    } else {
        if(fromLabel === "H") {
            var parameters = {
                nbPointsX: nbPointsY,
                nbPointsY: nbPointsX,
                fromToX: [minY - addX, maxY + addX],
                fromToY: [minX - addY, maxX + addY],
                sigmaX: lineWidthY,
                sigmaY: lineWidthX,
            }
            transpose = true;
        } else {
            var parameters = {
                nbPointsX: nbPointsX,
                nbPointsY: nbPointsY,
                fromToX: [minX - addX, maxX + addX],
                fromToY: [minY - addY, maxY + addY],
                sigmaX: lineWidthX,
                sigmaY: lineWidthY,
            }
        }
    }

    console.log(parameters.nbPointsX, parameters.nbPointsY)
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
        addPeak(spectraMatrix, parameters);
        i += 1;
    }
    return spectraMatrix;
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
    // console.log("integral")
    // console.log(integral);

    var xIndex = getIndex(X, fromToX[0], fromToX[1], nbPointsX);
    var yIndex = getIndex(Y, fromToY[0], fromToY[1], nbPointsY);
    // console.log("X and Y")
    // console.log(X, Y)
    var yMax = Y + sigmaY * 2;
    var yMaxIndex = getIndex(yMax, fromToY[0], fromToY[1], nbPointsY);
    var yVector = range(Y, yMax, Math.abs(yIndex - yMaxIndex + 1));

    var xMax = X + sigmaX * 2;
    var xMaxIndex = getIndex(xMax, fromToX[0], fromToX[1], nbPointsX);
    var xVector = range(X, xMax, Math.abs(xIndex - xMaxIndex + 1));
    // console.log("Index x and y")
    // console.log(xMaxIndex, xIndex)
    // console.log(yMaxIndex, yIndex)
    for (var i = 0; i < Math.abs(xIndex - xMaxIndex + 1); i++) {
        for(var j = 0; j < Math.abs(yIndex - yMaxIndex + 1); j++) {
            var result = Math.exp(
                    -1 * (Math.pow(xVector[i] - X, 2) /(2 * sigmaX * sigmaX) +
                    Math.pow(yVector[j] - Y, 2) /(2 * sigmaY * sigmaY))
                ) / (2 * 3.1416 * sigmaX * sigmaY) * 1000 * integral;
            // console.log(result);
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