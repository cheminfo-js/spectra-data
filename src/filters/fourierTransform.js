'use strict';

const fft = require('ml-fft');

/**
 * This function make a fourier transformation to each FID withing a SD instance
 * @param {SD} spectraData - SD instance
 * @returns {SD} return SD with spectrum and FID
 */

function fourierTransform(spectraData) {

    var nbPoints = spectraData.getNbPoints();
    var nSubSpectra = spectraData.getNbSubSpectra() / 2;
    var spectraType = 'NMR SPECTRUM';//spectraData.TYPE_NMR_SPECTRUM;
    var FFT = fft.FFT;
    if (nSubSpectra > 1) {
        spectraType = 'nD NMR SPECTRUM';
    }//spectraData.TYPE_2DNMR_SPECTRUM;

    FFT.init(nbPoints);

    var fcor = spectraData.getParamDouble('$FCOR', 0.0);
    //var tempArray = new Array(nbPoints / 2);
    for (var iSubSpectra = 0; iSubSpectra < nSubSpectra; iSubSpectra++) {
        var re = spectraData.getYData(2 * iSubSpectra);
        var im = spectraData.getYData(2 * iSubSpectra + 1);

        re[0] *= fcor;
        im[0] *= fcor;

        FFT.fft(re, im);
        re = re.concat(re.slice(0, (nbPoints + 1) / 2));
        re.splice(0, (nbPoints + 1) / 2);
        im = im.concat(im.slice(0, (nbPoints + 1) / 2));
        im.splice(0, (nbPoints + 1) / 2);

        spectraData.setActiveElement(2 * iSubSpectra);
        updateSpectra(spectraData, spectraType);

        spectraData.setActiveElement(2 * iSubSpectra + 1);
        updateSpectra(spectraData, spectraType);
    }
    //TODO For Alejandro
    //Now we can try to apply the FFt on the second dimension
    if (spectraData.is2D()) {
        //var mode = spectraData.getParam('.ACQUISITION SCHEME');
        /*switch (mode) {
            case 1://"State-TPP"
                break;
            case 2://State
                break;
            case 3://Echo-Antiecho
                break;
                //QF
                //Does not transform in the indirect dimension
        }*/
    }
    spectraData.setActiveElement(0);
    return spectraData;
}

function updateSpectra(spectraData, spectraType) {
    var baseFrequency = spectraData.getParamDouble('$BF1', NaN);
    var spectralFrequency = spectraData.getParamDouble('$SFO1', NaN);
    var spectralWidth = spectraData.getParamDouble('$SW', NaN);
    var xMiddle = ((spectralFrequency - baseFrequency) / baseFrequency) * 1e6;
    var dx = 0.5 * spectralWidth * spectralFrequency / baseFrequency;

    spectraData.setDataType(spectraType);
    spectraData.setFirstX(xMiddle + dx);
    spectraData.setLastX(xMiddle - dx);
    spectraData.setXUnits('PPM');

    var x = spectraData.getXData();
    var tmp = xMiddle + dx;
    dx = -2 * dx / (x.length - 1);

    for (var i = 0; i < x.length; i++) {
        x[i] = tmp;
        tmp += dx;
    }

    //TODO update minmax in Y axis
}

module.exports = fourierTransform;
