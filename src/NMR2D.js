var SD = require('./SD');
var JcampConverter=require("jcampconverter");

function NMR2D(sd) {
    console.log(sd);
}

NMR2D.prototype = Object.create(SD.prototype);
NMR2D.prototype.constructor = NMR2D;

NMR2D.fromJcamp = function(jcamp) {
    var spectrum= JcampConverter.convert(jcamp);
    return new NMR2D(spectrum);;
}

NMR2D.prototype.isHomoNuclear=function(){
    return this.sd.xType==this.sd.yType;
}

//Returns the observe frequency in the direct dimension
NMR2D.prototype.observeFrequencyX=function(){
    return this.sd.spectra[0].observeFrequency;
}

//Returns the observe frequency in the indirect dimension
NMR2D.prototype.observeFrequencyY=function(){
    return this.sd.indirectFrequency;
}

//Returns the separation between 2 consecutive points in the indirect domain
NMR2D.prototype.getDeltaY=function(){
    return ( this.getLastY()-this.getFirstY()) / (this.getNbSubSpectra()-1);
}

/**
 * @function nmrPeakDetection2D(options)
 * This function process the given spectraData and tries to determine the NMR signals. 
 + Returns an NMRSignal2D array containing all the detected 2D-NMR Signals
 * @param	options:+Object			Object containing the options
 * @option	thresholdFactor:number	A factor to scale the automatically determined noise threshold.
 * @returns	+Object	set of NMRSignal2D
 */
NMR2D.prototype.nmrPeakDetection2D=function(options){
    options = options||{};
    if(!options.thresholdFactor)
        options.thresholdFactor=1;
    return PeakPicking._findPeaks2DLoG(this, options.thresholdFactor);
}

/**
* Returns the noise factor depending on the nucleus.
*/
NMR2D.prototype.getNMRPeakThreshold=function(nucleus) {
    if (nucleus == "1H")
        return 3.0;
    if (nucleus =="13C")
        return 5.0;
    return 1.0;
}

/**
* Returns the nucleus in the specified dimension
*/
NMR2D.prototype.getNucleus=function(dim){
    if(dim==1)
        return this.sd.xType;
    if(dim==2)
        return this.sd.yType;
    return this.sd.xType;
}

module.exports = NMR2D;
