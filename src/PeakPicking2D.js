'use strict';

var lib = require("ml-fft");
var PeakOptimizer = require("./PeakOptimizer");
var SimpleClustering =  require("./SimpleClustering");
var StatArray = require('ml-stat/array');
var FFTUtils = lib.FFTUtils;

const DEBUG = false;
const smallFilter = [
    [0, 0, 1, 2, 2, 2, 1, 0, 0],
    [0, 1, 4, 7, 7, 7, 4, 1, 0],
    [1, 4, 5, 3, 0, 3, 5, 4, 1],
    [2, 7, 3, -12, -23, -12, 3, 7, 2],
    [2, 7, 0, -23, -40, -23, 0, 7, 2],
    [2, 7, 3, -12, -23, -12, 3, 7, 2],
    [1, 4, 5, 3, 0, 3, 5, 4, 1],
    [0, 1, 3, 7, 7, 7, 3, 1, 0],
    [0, 0, 1, 2, 2, 2, 1, 0, 0]];

module.exports  = function(spectraData, thresholdFactor){
    if(thresholdFactor==0)
        thresholdFactor=1;
    if(thresholdFactor<0)
        thresholdFactor=-thresholdFactor;
    var nbPoints = spectraData.getNbPoints();
    var nbSubSpectra = spectraData.getNbSubSpectra();

    var data = new Array(nbPoints * nbSubSpectra);
    //var data = new Array(nbPoints * nbSubSpectra/2);

    var isHomonuclear = spectraData.isHomoNuclear();

    //var sum = new Array(nbPoints);

    for (var iSubSpectra = 0; iSubSpectra < nbSubSpectra; iSubSpectra++) {
        var spectrum = spectraData.getYData(iSubSpectra);
        for (var iCol = 0; iCol < nbPoints; iCol++) {
            if(isHomonuclear){
                data[iSubSpectra * nbPoints + iCol] =(spectrum[iCol]>0?spectrum[iCol]:0);
            }
            else{
                data[iSubSpectra * nbPoints + iCol] =Math.abs(spectrum[iCol]);
            }
        }
    }

    var nStdDev = getLoGnStdDevNMR(spectraData);
    if(isHomonuclear){
        var convolutedSpectrum = convoluteWithLoG(data, nbSubSpectra, nbPoints);
        var peaksMC1 = findPeaks2DLoG(data, convolutedSpectrum, nbSubSpectra, nbPoints, nStdDev*thresholdFactor);//)1.5);
        var peaksMax1 = findPeaks2DMax(data, convolutedSpectrum, nbSubSpectra, nbPoints, (nStdDev+0.5)*thresholdFactor);//2.0);
        for(var i=0;i<peaksMC1.length;i++)
            peaksMax1.push(peaksMC1[i]);
        //console.log(peaksMax1);
        return PeakOptimizer.enhanceSymmetry(createSignals2D(peaksMax1,spectraData,24));

    }
    else{
        var convolutedSpectrum = convoluteWithLoG(data, nbSubSpectra, nbPoints);
        var peaksMC1 = findPeaks2DLoG(data, convolutedSpectrum, nbSubSpectra, nbPoints, nStdDev*thresholdFactor);
        //Peak2D[] peaksMC1 = PeakPicking2D.findPeaks2DMax(data, nbSubSpectra, nbPoints, (nStdDev+0.5)*thresholdFactor);
        //Remove peaks with less than 3% of the intensity of the highest peak
        return createSignals2D(PeakOptimizer.clean(peaksMC1, 0.05), spectraData,24);
    }

}

/**
 Calculates the 1st derivative of the 2D matrix, using the LoG kernel approximation
 */
 function convoluteWithLoG(inputSpectrum, nRows, nCols){
    var ftSpectrum = new Array(nCols * nRows);
    for (var i = nRows * nCols-1; i >=0; i--){
        ftSpectrum[i] = inputSpectrum[i];
    }

    ftSpectrum = FFTUtils.fft2DArray(ftSpectrum, nRows, nCols);

    var dim = smallFilter.length;
    var ftFilterData = new Array(nCols * nRows);
    for(var i=nCols * nRows-1;i>=0;i--){
        ftFilterData[i]=0;
    }

    var iRow, iCol;
    var shift = (dim - 1) / 2;
    //console.log(dim);
    for (var ir = 0; ir < dim; ir++) {
        iRow = (ir - shift + nRows) % nRows;
        for (var ic = 0; ic < dim; ic++) {
            iCol = (ic - shift + nCols) % nCols;
            ftFilterData[iRow * nCols + iCol] = smallFilter[ir][ic];
        }
    }

    ftFilterData = FFTUtils.fft2DArray(ftFilterData, nRows, nCols);

    var ftRows = nRows * 2;
    var ftCols = nCols / 2 + 1;
    FFTUtils.convolute2DI(ftSpectrum, ftFilterData, ftRows, ftCols);

    return  FFTUtils.ifft2DArray(ftSpectrum, ftRows, ftCols);
}
/**
 Detects all the 2D-peaks in the given spectrum based on center of mass logic.
 */
function findPeaks2DLoG(inputSpectrum, convolutedSpectrum, nRows, nCols, nStdDev) {
    var threshold = 0;
    for(var i=nCols*nRows-2;i>=0;i--)
        threshold+=Math.pow(convolutedSpectrum[i]-convolutedSpectrum[i+1],2);
    threshold=-Math.sqrt(threshold);
    threshold*=nStdDev/nRows;

    var bitmask = new Array(nCols * nRows);
    for(var i=nCols * nRows-1;i>=0;i--){
        bitmask[i]=0;
    }
    var nbDetectedPoints = 0;
    var lasti=-1;
    for (var i = convolutedSpectrum.length-1; i >=0 ; i--) {
        if (convolutedSpectrum[i] < threshold) {
            bitmask[i] = 1;
            nbDetectedPoints++;
        }
    }
    var iStart = 0;
    //int ranges = 0;
    var peakList = [];

    while (nbDetectedPoints != 0) {
        for (iStart; iStart < bitmask.length && bitmask[iStart]==0; iStart++){};
        //
        if (iStart == bitmask.length)
            break;

        nbDetectedPoints -= extractArea(inputSpectrum, convolutedSpectrum,
            bitmask, iStart, nRows, nCols, peakList, threshold);
    }

    if (peakList.length > 0&&DEBUG) {
        console.log("No peak found");
    }
    return peakList;
}
/**
 Detects all the 2D-peaks in the given spectrum based on the Max logic.
 */
function findPeaks2DMax(inputSpectrum, cs, nRows, nCols, nStdDev) {
    var threshold = 0;
    for(var i=nCols*nRows-2;i>=0;i--)
        threshold+=Math.pow(cs[i]-cs[i+1],2);
    threshold=-Math.sqrt(threshold);
    threshold*=nStdDev/nRows;

    var rowI,colI;
    var peakListMax = [];
    var tmpIndex = 0;
    for (var i = 0; i < cs.length; i++) {
        if (cs[i] < threshold) {
            //It is a peak?
            rowI=Math.floor(i/nCols);
            colI=i%nCols;
            //Verifies if this point is a peak;
            if(rowI>0&&rowI+1<nRows&&colI+1<nCols&&colI>0){
                //It is the minimum in the same row
                if(cs[i]<cs[i+1]&&cs[i]<cs[i-1]){
                    //It is the minimum in the previous row
                    tmpIndex=(rowI-1)*nCols+colI;
                    if(cs[i]<cs[tmpIndex-1]&&cs[i]<cs[tmpIndex]&&cs[i]<cs[tmpIndex+1]){
                        //It is the minimum in the next row
                        tmpIndex=(rowI+1)*nCols+colI;
                        if(cs[i]<cs[tmpIndex-1]&&cs[i]<cs[tmpIndex]&&cs[i]<cs[tmpIndex+1]){
                            peakListMax.push({x:colI,y:rowI,z:inputSpectrum[i]});
                        }
                    }
                }
            }
        }
    }
    return peakListMax;
}
/*
 This function detects the peaks
 */
function extractArea(spectrum, convolutedSpectrum, bitmask, iStart,
                       nRows, nCols, peakList, threshold) {
    var iRow = Math.floor(iStart / nCols);
    var iCol = iStart % nCols;
    var peakPoints =[];
    //console.log(iStart+" "+iRow+" "+iCol);
    // scanBitmask(bitmask, convolutedSpectrum, nRows, nCols, iRow, iCol,
    // peakPoints);
    scanBitmask(bitmask, nRows, nCols, iRow, iCol, peakPoints);
    //console.log("extractArea.lng "+peakPoints.length);
    var x = new Array(peakPoints.length);
    var y = new Array(peakPoints.length);
    var z = new Array(peakPoints.length);
    var nValues = peakPoints.length;
    var xAverage = 0.0;
    var yAverage = 0.0;
    var zSum = 0.0;
    if (nValues >= 9) {
        if (DEBUG)
            console.log("nValues=" + nValues);
        var maxValue = Number.NEGATIVE_INFINITY;
        var maxIndex = -1;
        for (var i = 0; i < nValues; i++) {
            var pt = (peakPoints.splice(0,1))[0];
            x[i] = pt[0];
            y[i] = pt[1];
            z[i] = spectrum[pt[1] * nCols + pt[0]];
            xAverage += x[i] * z[i];
            yAverage += y[i] * z[i];
            zSum += z[i];
            if (z[i] > maxValue) {
                maxValue = z[i];
                maxIndex = i;
            }
        }
        if (maxIndex != -1) {
            xAverage /= zSum;
            yAverage /= zSum;
            var newPeak = {x:xAverage, y:yAverage, z:zSum};
            var minmax;
            minmax =StatArray.minMax(x);
            newPeak.minX=minmax.min;
            newPeak.maxX=minmax.max;
            minmax = StatArray.minMax(y);
            newPeak.minY=minmax.min;
            newPeak.maxY=minmax.max;
            peakList.push(newPeak);
        }
    }
    return nValues;
}
//How noisy is the spectrum depending on the kind of experiment.
function getLoGnStdDevNMR(spectraData) {
    if (spectraData.isHomoNuclear())
        return 1.5
    else
        return 3;
}

/*
 Return all the peaks(x,y points) that composes a signal.
 */
function scanBitmask(bitmask, nRows, nCols, iRow, iCol, peakPoints) {
    //console.log(nRows+" "+iRow+" "+nCols+" "+iCol);
    if (iRow < 0 || iCol < 0 || iCol == nCols || iRow == nRows)
        return;
    if (bitmask[iRow * nCols + iCol]) {
        bitmask[iRow * nCols + iCol] = 0;
        peakPoints.push([iCol, iRow]);
        scanBitmask(bitmask, nRows, nCols, iRow + 1, iCol, peakPoints);
        scanBitmask(bitmask, nRows, nCols, iRow - 1, iCol, peakPoints);
        scanBitmask(bitmask, nRows, nCols, iRow, iCol + 1, peakPoints);
        scanBitmask(bitmask, nRows, nCols, iRow, iCol - 1, peakPoints);
    }
}
/**
 This function converts a set of 2D-peaks in 2D-signals. Each signal could be composed
 of many 2D-peaks, and it has some additional information related to the NMR spectrum.
 */
function createSignals2D(peaks, spectraData, tolerance){
    //console.log(peaks.length);
    var signals=[];
    var nbSubSpectra = spectraData.getNbSubSpectra();

    var bf1=spectraData.observeFrequencyX();
    var bf2=spectraData.observeFrequencyY();

    var firstY = spectraData.getFirstY();
    var lastY = spectraData.getLastY();
    var dy = spectraData.getDeltaY();

    //console.log(firstY+" "+lastY+" "+dy+" "+nbSubSpectra);
    //spectraData.setActiveElement(0);
    var noValid=0;
    for (var i = peaks.length-1; i >=0 ; i--) {
        //console.log(peaks[i].x+" "+spectraData.arrayPointToUnits(peaks[i].x));
        //console.log(peaks[i].y+" "+(firstY + dy * (peaks[i].y)));
        peaks[i].x=(spectraData.arrayPointToUnits(peaks[i].x));
        peaks[i].y=(firstY + dy * (peaks[i].y));

        //console.log(peaks[i])
        //Still having problems to correctly detect peaks on those areas. So I'm removing everything there.
        if(peaks[i].y<-1||peaks[i].y>=210){
            peaks.splice(i,1);
        }
    }
    //console.log(peaks);
    //The connectivity matrix is an square and symmetric matrix, so we'll only store the upper diagonal in an
    //array like form
    var connectivity = [];
    var tmp=0;
    tolerance*=tolerance;
    //console.log(tolerance);
    for (var i = 0; i < peaks.length; i++) {
        for (var j = i; j < peaks.length; j++) {
            tmp=Math.pow((peaks[i].x-peaks[j].x)*bf1,2)+Math.pow((peaks[i].y-peaks[j].y)*bf2,2);
            //Console.log(peaks[i].getX()+" "+peaks[j].getX()+" "+tmp);
            if(tmp<tolerance){//30*30Hz We cannot distinguish peaks with less than 20 Hz of separation
                connectivity.push(1);
            }
            else{
                connectivity.push(0);
            }
        }
    }

    //console.log(connectivity);

    var clusters = SimpleClustering.fullClusterGenerator(connectivity);

    //console.log(clusters)

    var signals = [];
    if (peaks != null) {
        var xValue, yValue;
        for (var iCluster = 0; iCluster < clusters.length; iCluster++) {
            var signal={nucleusX:spectraData.getNucleus(1),nucleusY:spectraData.getNucleus(2)};
            signal.resolutionX=( spectraData.getLastX()-spectraData.getFirstX()) / spectraData.getNbPoints();
            signal.resolutionY=dy;
            var peaks2D = [];
            signal.shiftX = 0;
            signal.shiftY = 0;
            var minMax1 = [Number.MAX_VALUE,0];
            var minMax2 = [Number.MAX_VALUE,0];
            var sumZ = 0;
            for(var jPeak = clusters[iCluster].length-1;jPeak>=0;jPeak--){
                if(clusters[iCluster][jPeak]==1){
                    peaks2D.push({
                        x: peaks[jPeak].x,
                        y: peaks[jPeak].y,
                        z: peaks[jPeak].z

                    }  );
                    signal.shiftX+=peaks[jPeak].x*peaks[jPeak].z;
                    signal.shiftY+=peaks[jPeak].y*peaks[jPeak].z;
                    sumZ+=peaks[jPeak].z;
                    if(peaks[jPeak].x<minMax1[0]){
                        minMax1[0]=peaks[jPeak].x;
                    }
                    if(peaks[jPeak].x>minMax1[1]){
                        minMax1[1]=peaks[jPeak].x;
                    }
                    if(peaks[jPeak].y<minMax2[0]){
                        minMax2[0]=peaks[jPeak].y
                    }
                    if(peaks[jPeak].y>minMax2[1]){
                        minMax2[1]=peaks[jPeak].y;
                    }

                }
            }
            signal.fromTo = [{from:minMax1[0],to:minMax1[1]},
                {from:minMax2[0],to:minMax2[1]}];
            signal.shiftX/=sumZ;
            signal.shiftY/=sumZ;
            signal.peaks = peaks2D;
            signals.push(signal);
        }
    }
    return signals;
}