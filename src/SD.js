// small note on the best way to define array
// http://jsperf.com/lp-array-and-loops/2

var StatArray = require('ml-stat/array');
var JcampConverter=require("jcampconverter");

function SD(sd) {
    this.sd=sd;
    this.activeElement=0;
}

SD.fromJcamp = function(jcamp) {
    var spectrum= JcampConverter.convert(jcamp,{xy:true});
    return new SD(spectrum);
}


/**
 * @function setActiveElement(nactiveSpectrum);
 * This function sets the nactiveSpectrum sub-spectrum as active
 * 
 */
SD.prototype.setActiveElement = function(nactiveSpectrum){
    this.activeElement=nactiveSpectrum;
}

/**
 * @function getActiveElement();
 * This function returns the index of the active sub-spectrum.
 */
SD.prototype.getActiveElement = function(){
    return this.activeElement;
},



/**
*   Returns the number of points in the current spectrum
*/
SD.prototype.getNbPoints=function(i){
    i=i||this.activeElement;
    return this.getSpectrumData(this.activeElement).length/2;
}

/**
 * Return the first value of the direct dimension
 */
SD.prototype.getFirstX=function(i) {
    i=i||this.activeElement;
    return this.sd.spectra[i].firstX;
}

/**
 * Return the last value of the direct dimension
 */
SD.prototype.getLastX=function(i) {
    i=i||this.activeElement;
    return this.sd.spectra[i].lastX;
}

/**
 * Return the first value of the direct dimension
 */
SD.prototype.getFirstY=function(i) {
    i=i||this.activeElement;
    return this.sd.spectra[i].firstY;
}

/**
 * Return the first value of the direct dimension
 */
SD.prototype.getLastY = function(i){
    i=i||this.activeElement;
    return this.sd.spectra[i].lastY;
}

/**
* Return the i-th sub-spectra in the current spectrum
*/
SD.prototype.getSpectrumData=function(i) {
    i=i||this.activeElement;
    return this.sd.spectra[i].data[0];
}

/**
 * Return the i-th sub-spectra in the current spectrum
 */
SD.prototype.getSpectrum=function(i) {
    i=i||this.activeElement;
    return this.sd.spectra[i];
}

/**
 * Returns the number of sub-spectra in this object
 */
SD.prototype.getNbSubSpectra=function(){
    return this.sd.spectra.length;
}


/**
 *   Returns an array containing the x values of the spectrum
 */
SD.prototype.getXData=function(i){
    i=i||this.activeElement;
    return this.getSpectrumData(i).x;
}

/**
 * @function getYData();
 * This function returns a double array containing the values of the intensity for the current sub-spectrum.
 */
SD.prototype.getYData=function(i){
    i=i||this.activeElement;
    return this.getSpectrumData(i).y;
}


/**
 * @function getXYData();
 * To get a 2 dimensional array with the x and y of this spectraData( Only for 1D spectra).
 * Returns a double[2][nbPoints] where the first row contains the x values and the second row the y values.
 */
SD.prototype.getXYData=function(i){
    return [this.getXData(i),this.getYData(i)];
}

SD.prototype.getTitle=function(i) {
    i=i||this.activeElement;
    return this.getSpectrum(i).title;
}

/**
 * @function setTitle(newTitle);
 * To set the title of this spectraData.
 * @param newTitle The new title
 */
SD.prototype.setTitle=function(newTitle,i) {
    this.getSpectrum(i).title=newTitle;
}

/**
 * @function getMinY(i)
 * This function returns the minimal value of Y
 */
SD.prototype.getMinY=function(i) {
    return  StatArray.min(this.getYData(i));
}

/**
 * @function getMaxY(i)
 * This function returns the maximal value of Y
 */
SD.prototype.getMaxY=function(i) {
    return  StatArray.max(this.getYData(i));
}

/**
 * @function getMinMax(i)
 */
SD.prototype.getMinMaxY=function(i) {
    return  StatArray.minMax(this.getYData(i));
}


/**
* Get the noise threshold level of the current spectrum. It uses median instead of the mean
*/
SD.prototype.getNoiseLevel=function(){
    var mean = 0,stddev=0;
    var y = this.getYData();
    var length = this.getNbPoints(),i=0;
    for(i = 0; i < length; i++){
        mean+=y[i];
    }
    mean/=this.getNbPoints();
    var averageDeviations = new Array(length);
    for (i = 0; i < length; i++)
        averageDeviations[i] = Math.abs(y[i] - mean);
    averageDeviations.sort();
    if (length % 2 == 1) {
        stddev = averageDeviations[(length-1)/2] / 0.6745;
    } else {
        stddev = 0.5*(averageDeviations[length/2]+averageDeviations[length/2-1]) / 0.6745;
    }

    return stddev*this.getNMRPeakThreshold(this.getNucleus(1));
}


/**
* Return the xValue for the given index
*/
SD.prototype.arrayPointToUnits=function(doublePoint){
    return (this.getFirstX() - (doublePoint* (this.getFirstX() - this.getLastX()) / (this.getNbPoints()-1)));
}


/**
* Returns the separation between 2 consecutive points in the spectra domain
*/
SD.prototype.getDeltaX=function(){
    return (this.getLastX()-this.getFirstX()) / (this.getNbPoints()-1);
}

/**
 * @function setMinMax(min,max)
 * This function scales the values of Y between the min and max parameters
 * @param min   Minimum desired value for Y
 * @param max   Maximum desired value for Y
 */
SD.prototype.setMinMax=function(min,max) {
    var y = this.getYData();
    var minMax = StatArray.minMax(y);
    var factor = (max - min)/(minMax.max-minMax.min);
    for(var i=0;i< y.length;i++){
        y[i]=(y[i]-minMax.min)*factor+min;
    }
}

/**
 * @function setMin(min)
 * This function scales the values of Y to fit the min parameter
 * @param min   Minimum desired value for Y
 */
SD.prototype.setMin=function(min) {
    var y = this.getYData();
    var currentMin = StatArray.min(y);
    var factor = min/currentMin;
    for(var i=0;i< y.length;i++){
        y[i]*=factor;
    }
}

/**
 * @function setMax(max)
 * This function scales the values of Y to fit the max parameter
 * @param max   Maximum desired value for Y
 */
SD.prototype.setMax=function(max) {
    var y = this.getYData();
    var currentMin = StatArray.max(y);
    var factor = max/currentMin;
    for(var i=0;i< y.length;i++){
        y[i]*=factor;
    }
}

/**
 * @function YShift(value)
 * This function shifts the values of Y
 * @param value Distance of the shift
 */
SD.prototype.YShift=function(value) {
    var y = this.getSpectrumData(this.activeElement).y;
    var length = this.getNbPoints(),i=0;
    for(i=0;i<length;i++){
        y[i]+=value;
    }
}

/**
 * @function peakPicking(parameters)
 * This function performs a simple peak detection in a spectraData. The parameters that can be specified are:
 * Returns a two dimensional array of double specifying [x,y] of the detected peaks.
 * @option from:    Lower limit.
 * @option to:      Upper limit.
 * @option threshold: The minimum intensity to consider a peak as a signal, expressed as a percentage of the highest peak. 
 * @option stdev: Number of standard deviation of the noise for the threshold calculation if a threshold is not specified.
 * @option resolution: The maximum resolution of the spectrum for considering peaks.
 * @option yInverted: Is it a Y inverted spectrum?(like an IR spectrum)
 * @option smooth: A function for smoothing the spectraData before the detection. If your are dealing with
 * experimental spectra, smoothing will make the algorithm less prune to false positives.
 */
SD.prototype.simplePeakPicking=function(parameters) {
    //@TODO implements this filter
}

/**
 * @function getMaxPeak();
 * Get the maximum peak
 */
SD.prototype.getMaxPeak = function(){
    var y = this.getSpectraDataY();
    var max=y[0], index=0;
    for(var i=0;i< y.length;i++){
        if(max<y[i]){
            max = y[i];
            index=i;
        }
    }
    return [this.getSpectraDataX()[index],max];
}

/**
 * @function getParamDouble(name, defvalue);
 * Get the value of the parameter
 * @param  name The parameter name
 * @param  defvalue The default value
 */
SD.prototype.getParamDouble = function(name, defvalue){
    var value = this.sd.info[name];
    if(!value)
        value = defvalue;
    return value;
}

/**
 * @function getParamString(name, defvalue);
 * Get the value of the parameter
 * @param  name The parameter name
 * @param  defvalue The default value
 */
SD.prototype.getParamString = function(name, defvalue){
    var value = this.sd.info[name];
    if(!value)
        value = defvalue;
    return value+"";
}

/**
 * @function getParamInt(name, defvalue);
 * Get the value of the parameter
 * @param  name The parameter name
 * @param  defvalue The default value
 */
SD.prototype.getParamInt = function(name, defvalue){
    var value = this.sd.info[name];
    if(!value)
        value = defvalue;
    return value;
}

/**
 * Return the y elements of the current spectrum
 * @returns {*}
 */
SD.prototype.getSpectrumDataY = function(){
    return this.getYData(this.activeElement);
}

/**
 * Return the x elements of the current spectrum
 * @returns {*}
 */
SD.prototype.getSpectraDataX = function(){
    return this.getXData(this.activeElement);
}

/**
 * Set a new parameter to this spectrum
 * @param name
 * @param value
 */
SD.prototype.putParam = function(name, value){
    this.sd.info[name]=value;
}

/**
 * Returns a equally spaced vector within the given window.
 * @param from
 * @param to
 * @param nPoints
 * @returns {*}
 */
SD.prototype.getVector = function(from, to, nPoints){
    var x = this.getSpectraDataX();
    var y = this.getSpectraDataY();
    var result = [];
    var start = 0, end = x.length- 1,direction=1;
    var reversed = false;

    if(x[0]>x[1]){
        direction = -1;
        start= x.length-1;
        end = 0;
    }

    if(from > to){
        var tmp = from;
        from = to;
        to = tmp;
        reversed = true;
    }

    if(x[end]>from||x[start]>to)
        return [];

    while(x[start]<from){start+=direction;}

    if(x[end]>to){
        var end = start;
        while(x[end]<to){end+=direction;}
    }
    var winPoints = Math.abs(end-start)+1;
    var xwin = new Array(winPoints), ywin = new Array(winPoints);
    var index = 0;
    if(direction==-1)
        index=winPoints-1;
    var i=start-direction;
    do{
        i+=direction;
        xwin[index]=x[i];
        ywin[index]=y[i];
        index+=direction;
    }while(i!=end);

    return [xwin,ywin];
}


module.exports = SD;

