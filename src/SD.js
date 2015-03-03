var JcampConverter=require("jcampconverter");

function SD(sd) {
    console.log(sd);
}


SD.fromJcamp = function(jcamp) {
    var spectrum= JcampConverter.convert(jcamp);
    return new SD(spectrum);;
}


//Return the first value of the direct dimension
SD.prototype.getLastY = function(){
    return this.sd.minMax.maxY;
}


SD.prototype.getNbPoints=function(){
    return this.getSpectraData(0).length/2;
}

SD.prototype.getSpectraData=function(i) {
    return this.sd.spectra[i].data[0];
}

SD.prototype.getYData=function(i){
    var y = new Array(this.getNbPoints());
    var tmp = this.getSpectraData(i);
    for(var i=this.getNbPoints()-1;i>=0;i--){
        y[i]=tmp[i*2+1];
    }
    return y;
}

SD.prototype.getXYData=function(){
    var y = new Array(this.getNbPoints());
    var x = new Array(this.getNbPoints());
    var tmp = this.getSpectraData(0);
    for(var i=this.getNbPoints()-1;i>=0;i--){
        x[i]=tmp[i*2];
        y[i]=tmp[i*2+1];
    }
    return [x,y];
}


SD.prototype.getNoiseLevel=function(){
    var mean = 0,stddev=0;
    var tmp = this.getSpectraData(0);
    var length = this.getNbPoints(),i=0;
    for(i=length-1;i>=0;i--){
        mean+=tmp[i*2+1];
    }
    mean/=this.getNbPoints();
    var averageDeviations = new Array(length);
    for (i = 0; i < length; i++)
        averageDeviations[i] = Math.abs(tmp[i*2+1] - mean);
    averageDeviations.sort();
    if (length % 2 == 1) {
        stddev = averageDeviations[(length-1)/2] / 0.6745;
    } else {
        stddev = 0.5*(averageDeviations[length/2]+averageDeviations[length/2-1]) / 0.6745;
    }

    return stddev*this.getNMRPeakThreshold(this.getNucleus(1));
}

SD.prototype.getNbSubSpectra=function(){
    return this.sd.spectra.length;
}


//Return the xValue for the given index
SD.prototype.arrayPointToUnits=function(doublePoint){
    return (this.getFirstX() - (doublePoint* (this.getFirstX() - this.getLastX()) / (this.getNbPoints()-1)));
}

//Return the first value of the direct dimension
SD.prototype.getFirstX=function(){
    return this.sd.minMax.minX;
}

//Return the first value of the direct dimension
SD.prototype.getLastX=function(){
    return this.sd.minMax.maxX;
}

//Return the first value of the direct dimension
SD.prototype.getFirstY=function(){
    return this.sd.minMax.minY;
}
//Returns the separation between 2 consecutive points in the spectra domain
SD.prototype.getDeltaX=function(){
    return (this.getLastX()-this.getFirstX()) / (this.getNbPoints()-1);
}


module.exports = SD;

console.log(SD.fromJcamp)