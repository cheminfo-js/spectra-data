/**
 * Created by abol on 4/20/16.
 */
function fourierTransform(spectraData){
    var nbPoints = spectraData.getNbPoints();
    var nSubSpectra = spectraData.getNbSubSpectra() / 2;
    var spectraType = this.TYPE_NMR_SPECTRUM;
    var FFT = fft.FFT;
    if (nSubSpectra > 1)
        spectraType = this.TYPE_2DNMR_SPECTRUM;

    FFT.init(nbPoints);


    var fcor = this.getParamDouble("$FCOR", 0.0);
    var tempArray = new Array(nbPoints / 2);
    for (var iSubSpectra = 0; iSubSpectra < nSubSpectra; iSubSpectra++)
    {
        var re = this.getYData(2 * iSubSpectra);
        var im = this.getYData(2 * iSubSpectra + 1);
        if (true) {
            console.log("firstPoint: (" + re[0] + "," + im[0] + ")");
            console.log("fcor: " + fcor);
        }
    }

    re[0] *= fcor;
    im[0] *= fcor;

    FFT.fft(re, im);
    re = re.concat(re.slice(0,(nbPoints+1)/2));
    re.splice(0, (nbPoints+1)/2);
    im = im.concat(im.slice(0,(nbPoints+1)/2));
    im.splice(0, (nbPoints+1)/2);
    var baseFrequency = this.getParamDouble("$BF1", NaN);
    var spectralFrequency = this.getParamDouble("$SFO1", NaN);
    var spectralWidth = this.getParamDouble("$SW", NaN);
    var xMiddle = ((spectralFrequency - baseFrequency) / baseFrequency )* 1e6;
    var dx = 0.5 * spectralWidth * spectralFrequency / baseFrequency;
    return spectraData;
}

module.exports = fourierTransform;