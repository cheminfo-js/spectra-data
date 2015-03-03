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


module.exports = NMR2D;
