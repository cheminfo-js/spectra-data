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

var  isDebug = false;

function haarWhittakerBaselineCorrection(data, waveletScale, whittakerLambda) {
    var firstDer = MathUtils.waveletDerivative(data, waveletScale);

    var weights = PeakFinders.dietrichBitmask(firstDer);
    //for(int i=0;i<weights.length;i++)
    //	System.out.print(weights[i]+", ");
    var i = weights.length - 1;
    while (weights[i] === 0)
        weights[i--] = 1;

    return Whittaker.whittakerFirstDifferences(data, weights, whittakerLambda);
}

function haarWhittakerBaselineCorrection(data, bitmask, waveletScale, whittakerLambda) {
    var firstDer = MathUtils.waveletDerivative(data, waveletScale);
    var weights = PeakFinders.dietrichBitmask(firstDer);
    var i = weights.length - 1;
    while (weights[i] === 0)
        weights[i--] = 1;
    System.arraycopy(weights, 0, bitmask, 0, data.length);
    return Whittaker.whittakerFirstDifferences(data, weights, whittakerLambda);
}