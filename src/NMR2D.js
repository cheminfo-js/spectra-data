var SD = require('./SD');
var PeakPicking2D = require('./PeakPicking2D');
var PeakOptimizer = require("./PeakOptimizer");
var JcampConverter=require("jcampconverter");

function NMR2D(sd) {
    SD.call(this, sd); // Héritage
}

NMR2D.prototype = Object.create(SD.prototype);
NMR2D.prototype.constructor = NMR2D;

NMR2D.fromJcamp = function(jcamp,options) {
    options = options || {xy:true,keepSpectra:true,keepRecordsRegExp:/^.+$/};
    var spectrum= JcampConverter.convert(jcamp,options);
    return new NMR2D(spectrum);
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

/**
 * Returns the solvent name
 */
NMR2D.prototype.getSolventName=function(){
    return (this.sd.info[".SOLVENTNAME"]||this.sd.info["$SOLVENT"]).replace("<","").replace(">","");
}

/**
 * This function returns the units of the direct dimension. It overrides the SD getXUnits function
 * @returns {ntuples.units|*|b.units}
 */
NMR2D.prototype.getXUnits = function(){
    return this.sd.ntuples[1].units;
}
/**
 * This function returns the units of the indirect dimension. It overrides the SD getYUnits function
 * @returns {ntuples.units|*|b.units}
 */
NMR2D.prototype.getYUnits = function(){
    return this.sd.ntuples[0].units;
}
/**
 * Returns the units of the dependent variable
 * @returns {ntuples.units|*|b.units}
 */
NMR2D.prototype.getZUnits = function(){
    return this.sd.ntuples[2].units;
}
/**
 * Overwrite this function. Now, the Y axe refers to the indirect dimension
 * @returns {sd.minMax.maxY}
 */
NMR2D.prototype.getLastY = function(){
    return this.sd.minMax.maxY;
}
/**
 * * Overwrite this function. Now, the Y axe refers to the indirect dimension
 * @returns {sd.minMax.minY}
 */
NMR2D.prototype.getFirstY = function(){
    return this.sd.minMax.minY;
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
    var id = Math.round(Math.random()*255);
    if(options.id){
        id=options.id;
    }
    var peakList = PeakPicking2D.findPeaks2D(this, options.thresholdFactor);

    //lets add an unique ID for each peak.
    for(var i=0;i<peakList.length;i++){
        peakList[i]._highlight=[id+"_"+i];
        peakList[i].id = id+"_"+i;
    }
    if(options.references)
        PeakOptimizer.alignDimensions(peakList,options.references);

    return peakList;
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
