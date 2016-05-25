/**
 * Created by Abol on 5/23/2016.
 */

var lib = require("ml-fft");
var FFT = lib.FFT;
var FFTUtils = lib.FFTUtils

var nmrSpectrum;
var nDerivative = 1;
var gamma = 5e-5;
var waveletScale = 1;
var bitmask, reTmp;

function getWaveletScale(){
    return waveletScale;
}

function setWaveletScale(var waveletScale) {
    this.waveletScale = waveletScale;
}

function getNmrSpectrum(){
    return nmrSpectrum;
}

function getNDerivative() {
    return nDerivative;
}

function setNDerivative(derivative) {
    nDerivative = derivative;
}

function getGamma() {
    return gamma;
}

function setGamma(gamma) {
    this.gamma = gamma;
}

function getBitmask() {
    return bitmask;
}

Function EntropyCalculator(nmrSpectrum, derivative, gamma){
    this.nmrSpectrum = nmrSpectrum;
    var nDerivative = derivative;
    this.gamma = gamma;
    this.reTmp = new Array(nmrSpectrum[0].length);
    this.calculateBitmask();
}

function getNumberOfCoordinates(){
    return 2;
}

function getValueAt(coordinates){
    var nbPoints = nmrSpectrum[0].length;
    var phi0 = coordinates[0];
    var phi1 = coordinates[1] / nbPoints;
    var delta = phi1;
    var alpha = 2 * Math.pow(Math.sin(delta / 2), 2);
    var beta = Math.sin(delta);
    var cosTheta = Math.cos(phi0);
    var sinTheta = Math.sin(phi0);
    var cosThetaNew, sinThetaNew;
    
    var penalty = 0.0;
    //var penaltyAccumulator = 0.0;
    var pSquared;
    for (var i = 0; i < nbPoints; i++) {
        reTmp[i] = nmrSpectrum[0][i] * cosTheta - nmrSpectrum[1][i] * sinTheta;
        pSquared = reTmp[i] * reTmp[i] * this.bitmask[i];
        // pSquared = 100;
        if (reTmp[i] < 0)
            penalty += pSquared;
        //penaltyAccumulator += pSquared;
        // calculate angles i+1 from i
        cosThetaNew = cosTheta - (alpha * cosTheta + beta * sinTheta);
        sinThetaNew = sinTheta - (alpha * sinTheta - beta * cosTheta);
        cosTheta = cosThetaNew;
        sinTheta = sinThetaNew;
    }
    penalty *= gamma;
    var derivative = MathUtils.waveletDerivative(reTmp, waveletScale, nDerivative);
    var probabilities = derivative;
    
    var acc = 0.0;
    for (var i = 0; i < nbPoints; i++) {
        probabilities[i] = Math.abs(probabilities[i]) * this.bitmask[i];
        acc += probabilities[i] * this.bitmask[i];
    }

    var entropy = 0.0;
    for (var i = 0; i < nbPoints; i++) {
        probabilities[i] /= acc;
        if (this.bitmask[i] == 1)
            if(probabilities[i]>0)
                entropy -= probabilities[i] * Math.log(probabilities[i]);
    }

    entropy += penalty;

    return entropy;
}


function setNmrSpectrum(nmrSpectrum) {
    this.nmrSpectrum = nmrSpectrum;
    this.reTmp = new Array(this.nmrSpectrum[0].length);
    this.calculateBitmask();
}

function calculateBitmask() {
    if (this.nmrSpectrum == null)
        return;
    this.bitmask = new Array(this.nmrSpectrum[0].length);
    this.genPeakDetBitmask();

}

function genPeakDetBitmask() {
    var baseline1 = BaselineCorrection.haarWhittakerBaselineCorrection(this.nmrSpectrum[0],100,10000);
    var baseline2 = BaselineCorrection.haarWhittakerBaselineCorrection(this.nmrSpectrum[1],100,10000);
    for (var i = 0; i < baseline1.length; i++) {
        baseline1[i] = this.nmrSpectrum[0][i] - baseline1[i];
        baseline2[i] = this.nmrSpectrum[1][i] - baseline2[i];
    }
    var stats1 = MathUtils.getRobustMeanAndStddev(baseline1, 0, baseline1.length);//@TODO HAY QUE MIRAR LA TRADUCCION
    var stats2 = MathUtils.getRobustMeanAndStddev(baseline2, 0, baseline2.length);
    var thresh1 = stats1[1]*3;
    var thresh2 = stats2[1]*3;
    for (var i = 0; i < baseline1.length; i++) {
        if (baseline1[i] > thresh1 || baseline2[i] > thresh2)
            this.bitmask[i] = 1;
        else
            this.bitmask[i] = 0;
    }


    for (var i = 0; i < (this.nmrSpectrum[0].length * 0.10); i++) {
        this.bitmask[i] = 0;
        this.bitmask[this.bitmask.length-i-1] = 0;
    }
}

function genPeakDetBitmask() {
    var baseline1 = BaselineCorrection.haarWhittakerBaselineCorrection(this.nmrSpectrum[0],100,10000);
    var baseline2 = BaselineCorrection.haarWhittakerBaselineCorrection(this.nmrSpectrum[1],100,10000);
    for (int i = 0; i < baseline1.length; i++) {
        baseline1[i] = this.nmrSpectrum[0][i] - baseline1[i];
        baseline2[i] = this.nmrSpectrum[1][i] - baseline2[i];
    }
    var stats1 = MathUtils.getRobustMeanAndStddev(baseline1, 0, baseline1.length);
    var stats2 = MathUtils.getRobustMeanAndStddev(baseline2, 0, baseline2.length);
    var thresh1 = stats1[1]*3;
    var thresh2 = stats2[1]*3;
    for (var i = 0; i < baseline1.length; i++) {
        if (baseline1[i] > thresh1 || baseline2[i] > thresh2)
            this.bitmask[i] = 1;
        else
            this.bitmask[i] = 0;
    }


    for (var i = 0; i < (this.nmrSpectrum[0].length * 0.10); i++) {
        this.bitmask[i] = 0;
        this.bitmask[this.bitmask.length-i-1] = 0;
    }
}

function getBitmask() {
    return bitmask;
}

/*
function getMinMaxTarget(){
    var minMax = new Array(2);
    minMax[0]=Double.MAX_VALUE;
    minMax[1] = Double.MIN_NORMAL;
    for(int i=reTmp.length-1;i>=0;i--){
        if(minMax[0]>reTmp[i])
            minMax[0]=reTmp[i];
        if(minMax[1]<reTmp[i])
            minMax[1]=reTmp[i];
    }
    return minMax;
}
*/

var smallFilter = [ 0, 2.7, 7.4, 20.1, 54.6, 148.4, 0, -148.4, -54.6, -20.1, -7.4, -2.7, 0 ];

function convolute( dataIn){
    var nbPoints = dataIn.length;
    var nbSubSpectra = 1;
    var nRows = nbSubSpectra;
    var nCols=nbPoints;
    var data = dataIn;

    var newSpectrum = new Array(nRows * nCols);
    for (var i = 0; i < nRows * nCols; i++){
        newSpectrum[i] = (data[i]);
    }

    var ftSpectrum = FFT.fft(newSpectrum);

    var dim = smallFilter.length;
    var filterData = new Array(nRows * nCols).fill(0);
    var iCol;
    var shift = (dim - 1) / 2;


    for (var ic = 0; ic < dim; ic++) {
        iCol = (ic - shift + nCols) % nCols;
        //console.log(iCol+" ");
        filterData[iCol] = smallFilter[ic];
    }

    FFT.init(nbPoints);
    var ftFilterData = FFT.fft(filterData);

    filterData = null;
    Convolution.convolute(ftSpectrum, ftFilterData);
    var convolutedSpectrum = FFT.ifft(ftSpectrum); //@TODO mirar que pasa ak

    return convolutedSpectrum;
}

function RealFFT(data){
    var
        nbPoints = data.length,
        re = new Array(nbPoints/=2-1),
        im = new Array(nbPoints/=2-1).fill(0);

    for (var i=0; i<re.length;i++){
        re[i] = data[i];
    }
    FFT.fft(re,im);
    var tempRe = new Array(re.length);
    var tempIm = new Array(im.length);
    for(var i=0; i<newData.length;i++){
        tempRe[(re.length-1)-i] = re[i];
        tempIm[(re.length-1)-i] = -im[i];
    }
}