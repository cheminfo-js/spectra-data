var SD = require('./SD');
var JcampConverter=require("jcampconverter");

function NMR(sd) {
    console.log(sd);
}

NMR.prototype = Object.create(SD.prototype);
NMR.prototype.constructor = NMR;

NMR.fromJcamp = function(jcamp) {
    var spectrum= JcampConverter.convert(jcamp);
    return new NMR(spectrum);;
}



//Return the nucleus of the direct dimension
NMR.prototype.getNucleus=function(dim){
    if(dim==1)
        return this.sd.xType;
    if(dim==2)
        return this.sd.yType;
}

/**
 * @function nmrPeakDetection2D(options)
 * This function process the given spectraData and tries to determine the NMR signals. Returns an NMRSignal2D array containing all the detected 2D-NMR Signals
 * @param	options:+Object			Object containing the options
 * @option	thresholdFactor:number	A factor to scale the automatically determined noise threshold.
 * @returns	+Object	set of NMRSignal2D
 */
NMR.prototype.nmrPeakDetection2D=function(options){
    options = options||{};
    if(!options.thresholdFactor)
        options.thresholdFactor=1;
    return PeakFinders2D._findPeaks2DLoG(this, options.thresholdFactor);
}

NMR.prototype.getSolventName=function(){
    return this.sd.info[".SOLVENTNAME"];
}


NMR.prototype.getNMRPeakThreshold=function(nucleus) {
    if (nucleus == "1H")
        return 3.0;
    if (nucleus =="13C")
        return 5.0;
    return 1.0;
}




module.exports = NMR;
