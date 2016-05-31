"use strict";
/**
 * Created by Abol on 5/31/2016.
 */

/**
package org.cheminfo.hook.math.peakdetection;

import java.util.Arrays;

import org.cheminfo.hook.math.fft.Convolution;
import org.cheminfo.hook.math.util.MathUtils;

import ca.uol.aig.fftpack.Complex1D;
import ca.uol.aig.fftpack.ComplexDoubleFFT;


 *
 * @author Marco Engeler
 *
 */

//var  isDebug = false; @TODO Debug

function haarWhittakerBaselineCorrection(data, bitmask, waveletScale, whittakerLambda) {
    var firstDer = MathUtils.waveletDerivative(data, waveletScale);
    var weights = PeakFinders.dietrichBitmask(firstDer);
    var i = weights.length - 1;
    while (weights[i] === 0)
        weights[i--] = 1;
    arrayCopy(weights, 0, bitmask, 0, data.length);
    return Whittaker.whittakerFirstDifferences(data, weights, whittakerLambda); //@TODO implement in javascript
}

function haarWhittakerBaselineCorrection2D(data, nRows, nCols, waveletScale, whittakerLambda) {
    //var startTime = System.currentTimeMillis(); //@TODO Debug
    var baseline = new Array(data.length);
    // assume everything to be in row major order
    // run over rows
    var tmpRow = new Array(nCols);
    for (var iRow = 0; iRow < nRows; iRow++) {
        arrayCopy(data, iRow * nCols, tmpRow, 0, nCols);
        var weights = PeakFinders.dietrichBitmask(MathUtils.waveletDerivative(tmpRow, waveletScale)); //@TODO implement in javascript
        var i = weights.length - 1;
        while (weights[i] === 0)
            weights[i--] = 1;
        tmpRow = Whittaker.whittakerFirstDifferences(tmpRow, weights, whittakerLambda);

        for (i = 0; i < nCols; i++) {
            baseline[iRow * nCols + i] = data[iRow * nCols + i] - tmpRow[i];
        }
    }
    // now tackle the columns
    var tmpCol = nRows;
    for (var iCol = 0; iCol < nCols; iCol++) {
        //
        var ii = iCol;
        for (var iRow = 0; iRow < nRows; iRow++) {
            tmpCol[iRow] = baseline[ii];
            ii += nCols;
        }
        // copy into tmpCol
        var weights = PeakFinders.dietrichBitmask(MathUtils.waveletDerivative(tmpCol, waveletScale));
        var i = weights.length - 1;
        while (weights[i] === 0)
            weights[i--] = 1;
        tmpCol = Whittaker.whittakerFirstDifferences(tmpCol, weights, whittakerLambda);
        // copy into baseline
        ii = iCol;
        for (var iRow = 0; iRow < nRows; iRow++) {
            baseline[ii] -= tmpCol[iRow];
            ii += nCols;
        }
    }
    for (var i = 0; i < baseline.length; i++) {
        baseline[i] = data[i] - baseline[i];
    }
/* @TODO Debug
*    long endTime = System.currentTimeMillis();
*    if (BaselineCorrection.isDebug)
*        System.out.println("elapsed = " + ((endTime - startTime) / 1000));
*/
    return baseline;
}


//Copied from processing.js
function arrayCopy(src, srcPos, dest, destPos, length) {
    var undef;
    for (var i = srcPos, j = destPos; i < length + srcPos; i++, j++) {
        if (dest[j] !== undef) {
            dest[j] = src[i];
        }
    }
};
