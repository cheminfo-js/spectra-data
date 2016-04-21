var SD = require('./SD');
var PeakPicking = require('./PeakPicking');
var JcampConverter=require("jcampconverter");
var fft = require("ml-fft");
var Filters = require("./filters/Filter.js");
var fftfilter = require("./filters/fourierTransform.js");

function NMR(sd) {
    SD.call(this, sd); // Héritage
}

NMR.prototype = Object.create(SD.prototype);
NMR.prototype.constructor = NMR;

NMR.fromJcamp = function(jcamp,options) {
    options = options || {xy:true,keepSpectra:true,keepRecordsRegExp:/^.+$/};
    var spectrum= JcampConverter.convert(jcamp,options);
    return new NMR(spectrum);
}

/**
* Return the observed nucleus 
*/
NMR.prototype.getNucleus=function(dim){
    if(!dim||dim==0||dim==1)
        return this.sd.xType;
    else{
        return "";
    }
}

/**
* Returns the solvent name
*/
NMR.prototype.getSolventName=function(){
    return (this.sd.info[".SOLVENTNAME"]||this.sd.info["$SOLVENT"]||"").replace("<","").replace(">","");
}

//Returns the observe frequency in the direct dimension
NMR.prototype.observeFrequencyX=function(){
    return this.sd.spectra[0].observeFrequency;
}

/**
* Returns the noise factor depending on the nucleus.
*/
NMR.prototype.getNMRPeakThreshold=function(nucleus) {
    if (nucleus == "1H")
        return 3.0;
    if (nucleus =="13C")
        return 5.0;
    return 1.0;
}


    
/**
 * @function addNoise(SNR)
 * This function adds white noise to the the given spectraData. The intensity of the noise is 
 * calculated from the given signal to noise ratio.
 * @param SNR Signal to noise ratio
 */
 NMR.prototype.addNoise=function(SNR) {
     //@TODO Implement addNoise filter
}


/**
 * @function addSpectraDatas(spec2,factor1,factor2,autoscale )   
 *  This filter performs a linear combination of two spectraDatas.
 * A=spec1
 * B=spec2
 * After to apply this filter you will get:
 *      A=A*factor1+B*factor2
 * if autoscale is set to 'true' then you will obtain:
 *  A=A*factor1+B*k*factor2
 * Where the k is a factor such that the maximum peak in A is equal to the maximum peak in spectraData2 
 * @param spec2 spectraData2
 * @param factor1 linear factor for spec1
 * @param factor2 linear factor for spec2
 * @param autoscale Auto-adjust scales before combine the spectraDatas
 * @example spec1 = addSpectraDatas(spec1,spec2,1,-1, false) This subtract spec2 from spec1
*/
NMR.prototype.addSpectraDatas=function(spec2,factor1,factor2,autoscale ) {
    //@TODO Implement addSpectraDatas filter
}

/**
 * @function autoBaseline()
 * Automatically corrects the base line of a given spectraData. After this process the spectraData
 * should have meaningful integrals.
 */
NMR.prototype.autoBaseline=function( ) {
    //@TODO Implement autoBaseline filter
}

/**
 * @function fourierTransform()
 * Fourier transforms the given spectraData (Note. no 2D handling yet) this spectraData have to be of type NMR_FID or 2DNMR_FID
 */
NMR.prototype.fourierTransform=function( ) {
    return Filters.fourierTransform(this);
}

/**
 * @function postFourierTransform(ph1corr)
 * This filter makes an phase 1 correction that corrects the problem of the spectra that has been obtained 
 * on spectrometers using the Bruker digital filters. This method is used in cases when the BrukerSpectra 
 * filter could not find the correct number of points to perform a circular shift.
 * The actual problem is that not all of the spectra has the necessary parameters for use only one method for 
 * correcting the problem of the Bruker digital filters.
 * @param spectraData A fourier transformed spectraData.
 * @param ph1corr Phase 1 correction value in radians.
 */
NMR.prototype.postFourierTransform=function(ph1corr) {
    //@TODO Implement postFourierTransform filter
}

/**
 * @function zeroFilling(nPointsX [,nPointsY])
 * This function increase the size of the spectrum, filling the new positions with zero values. Doing it one 
 * could increase artificially the spectral resolution.
 * @param nPointsX Number of new zero points in the direct dimension
 * @param nPointsY Number of new zero points in the indirect dimension
 */
NMR.prototype.zeroFilling=function(nPointsX, nPointsY) {
    //@TODO Implement zeroFilling filter

}

/**
 * @function  haarWhittakerBaselineCorrection(waveletScale,whittakerLambda)
 * Applies a baseline correction as described in J Magn Resonance 183 (2006) 145-151 10.1016/j.jmr.2006.07.013
 * The needed parameters are the wavelet scale and the lambda used in the whittaker smoother.
 * @param waveletScale To be described
 * @param whittakerLambda To be described
 */
NMR.prototype.haarWhittakerBaselineCorrection=function(waveletScale,whittakerLambda) {
    //@TODO Implement haarWhittakerBaselineCorrection filter
}

/**
 * @function whittakerBaselineCorrection(whittakerLambda,ranges)
 * Applies a baseline correction as described in J Magn Resonance 183 (2006) 145-151 10.1016/j.jmr.2006.07.013
 * The needed parameters are the Wavelet scale and the lambda used in the Whittaker smoother.
 * @param waveletScale To be described
 * @param whittakerLambda To be described
 * @param ranges A string containing the ranges of no signal.
 */
NMR.prototype.whittakerBaselineCorrection=function(whittakerLambda,ranges) {
    //@TODO Implement whittakerBaselineCorrection filter
}

/**
 * @function brukerSpectra(options)
 * This filter applies a circular shift(phase 1 correction in the time domain) to an NMR FID spectrum that 
 * have been obtained on spectrometers using the Bruker digital filters. The amount of shift depends on the 
 * parameters DECIM and DSPFVS. This spectraData have to be of type NMR_FID
 * @option DECIM: Acquisition parameter
 * @option DSPFVS: Acquisition parameter
 */
NMR.prototype.brukerSpectra=function(options) {
    //@TODO Implement brukerSpectra filter
}

/**
 * @function apodization(functionName, lineBroadening)
 * Apodization of a spectraData object.
 * @param spectraData An spectraData of type NMR_FID
 * @param functionName Valid values for functionsName are
 *  Exponential, exp
 *  Hamming, hamming
 *  Gaussian, gauss
 *  TRAF, traf
 *  Sine Bell, sb
 *  Sine Bell Squared, sb2
 * @param lineBroadening The parameter LB should either be a line broadening factor in Hz 
 * or alternatively an angle given by degrees for sine bell functions and the like.
 * @example SD.apodization(, lineBroadening)
 */
NMR.prototype.apodization=function(functionName, lineBroadening) {
    //@TODO Implement apodization filter
    //org.cheminfo.hook.nemo.filters.ApodizationFilter

    /*public String toString() {
        switch (this) {
            case NONE:
                return "None";
            case EXPONENTIAL:
                return "Exponential";
            case GAUSSIAN:
                return "Gaussian";
            case TRAF:
                return "TRAF";
            case SINE_BELL:
                return "Sine Bell";
            case SINE_BELL_SQUARED:
                return "Sine Bell Squared";
            default:
                return "";
        }
    }*/
}

/**
 * @function echoAntiechoFilter();
 * That decodes an Echo-Antiecho 2D spectrum.
 */
NMR.prototype.echoAntiechoFilter=function() {
    //@TODO Implement echoAntiechoFilter filter
}

/**
 * @function SNVFilter()
 * This function apply a Standard Normal Variate Transformation over the given spectraData. Mainly used for IR spectra.
 */
NMR.prototype.SNVFilter=function() {
    //@TODO Implement SNVFilter
}

/**
 * @function powerFilter(power)
 * This function applies a power to all the Y values.<br>If the power is less than 1 and the spectrum has negative values, it will be shifted so that the lowest value is zero 
 * @param   power   The power to apply
 */
NMR.prototype.powerFilter=function(power) {
    var minY=this.getMinY();
    if(power<1 && minY<0){
        this.YShift(-1*minY);
        console.warn("SD.powerFilter: The spectrum had negative values and was automatically shifted before applying the function.");
    }
    //@TODO Implement powerFilter
}

/**
 * @function logarithmFilter(base)
 * This function applies a log to all the Y values.<br>If the spectrum has negative or zero values, it will be shifted so that the lowest value is 1 
 * @param   base    The base to use
 */
NMR.prototype.logarithmFilter=function(base) {
    var minY=this.getMinY();
    if(minY<=0){
        this.YShift((-1*minY)+1);
        console.warn("SD.logarithmFilter: The spectrum had negative values and was automatically shifted before applying the function.");
    }
   //@TODO Implement logarithmFilter filter
}


/**
 * @function correlationFilter(func) 
 * This function correlates the given spectraData with the given vector func. The correlation
 * operation (*) is defined as:
 * 
 *                    __ inf
 *  c(x)=f(x)(*)g(x)= \        f(x)*g(x+i)
 *                   ./    
 *                    -- i=-inf
 * @param func A double array containing the function to correlates the spectraData
 * @example var smoothedSP = SD.correlationFilter(spectraData,[1,1]) returns a smoothed version of the
 * given spectraData. 
 */
NMR.prototype.correlationFilter=function(func) {
    //@TODO Implement correlationFilter filter
}

/**
 * @function  phaseCorrection(phi0, phi1)
 * Applies the phase correction (phi0,phi1) to a Fourier transformed spectraData. The angles must be given in radians.
 * @param phi0 Zero order phase correction
 * @param phi1 One order phase correction
*/
NMR.prototype.phaseCorrection=function(phi0, phi1) {
//System.out.println(spectraData.toString());
    /*int nbPoints = spectraData.getNbPoints();
     double[] reData = spectraData.getSubSpectraDataY(0);
     double[] imData = spectraData.getSubSpectraDataY(1);

     for(int k=this.corrections.size()-toApply;k<this.corrections.size();k++){
     Point2D phi = this.corrections.elementAt(k);

     double phi0 = phi.getX();
     double phi1 = phi.getY();

     if(DEBUG) System.out.println(" ph0 = "+phi0);
     if(DEBUG) System.out.println(" ph1 = "+phi1);

     double delta = phi1 / nbPoints;
     double alpha = 2 * Math.pow(Math.sin(delta / 2), 2);
     double beta = Math.sin(delta);
     double cosTheta = Math.cos(phi0);
     double sinTheta = Math.sin(phi0);
     double cosThetaNew, sinThetaNew;

     double reTmp, imTmp;
     int index;
     for (int i = 0; i < nbPoints; i++) {
     index = nbPoints - i - 1;
     index = i;
     reTmp = reData[index] * cosTheta - imData[index] * sinTheta;
     imTmp = reData[index] * sinTheta + imData[index] * cosTheta;
     reData[index] = reTmp;
     imData[index] = imTmp;
     // calculate angles i+1 from i
     cosThetaNew = cosTheta - (alpha * cosTheta + beta * sinTheta);
     sinThetaNew = sinTheta - (alpha * sinTheta - beta * cosTheta);
     cosTheta = cosThetaNew;
     sinTheta = sinThetaNew;
     }
     toApply--;
     }

     spectraData.resetMinMax();
     spectraData.updateDefaults();
     spectraData.updateY();
     spectraData.putParam("PHC0", getPhi0());
     spectraData.putParam("PHC1", getPhi1());
     if (this.jsonResult!=null) {
     JSONObject jsonObject=new JSONObject();
     try {
     jsonObject.put("filter", this.getScriptingCommand());
     jsonObject.put("status", "OK");
     jsonObject.put("value", 0);
     jsonResult.put(jsonResult.length(),jsonObject);
     } catch (JSONException e) {
     // TODO Auto-generated catch block
     e.printStackTrace();
     }
     }}*/
}

/**
 * @function automaticPhase() 
 * This function determines automatically the correct parameters phi0 and phi1 for a phaseCorrection
 * function and applies it.
 */ 
NMR.prototype.automaticPhase=function() {
    //@TODO Implement automaticPhase filter
}

/**
 *  @function useBrukerPhase()
 *  This function extract the parameters of the phaseCorrection from the jcamp-dx parameters
 *  if the spectrum was acquired in Bruker spectrometers . Basically it will look for the parameters
 *  $PHC0 and $PHC1, and will use it to call the phaseCorrection function.
 */
NMR.prototype.useBrukerPhase=function() {
   //@TODO Implement useBrukerPhase filter
}

/**
 * @function nmrPeakDetection(parameters);
 * This function process the given spectraData and tries to determine the NMR signals. Returns an NMRSignal1D array containing all the detected 1D-NMR Signals
 * @param parameters A JSONObject containing the optional parameters:
 * @option fromX:   Lower limit.
 * @option toX:     Upper limit.
 * @option threshold: The minimum intensity to consider a peak as a signal, expressed as a percentage of the highest peak. 
 * @option stdev: Number of standard deviation of the noise for the threshold calculation if a threshold is not specified.
 */
NMR.prototype.nmrPeakDetection=function(parameters) {
    return PeakPicking.peakPicking(this, parameters);
}



module.exports = NMR;
