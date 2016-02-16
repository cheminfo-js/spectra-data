(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["spectraData"] = factory();
	else
		root["spectraData"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';


	exports.SD = __webpack_require__(1);
	exports.NMR = __webpack_require__(4);
	exports.NMR2D = __webpack_require__(40);
	exports.ACS = __webpack_require__(47);
	exports.JAnalyzer = __webpack_require__(6);
	//exports.SD2 = require('/SD2');

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// small note on the best way to define array
	// http://jsperf.com/lp-array-and-loops/2

	var StatArray = __webpack_require__(2);
	var JcampConverter=__webpack_require__(3);

	function SD(sd) {
	    this.sd=sd;
	    this.activeElement=0;

	    this.DATACLASS_XY = 1;
	    this.DATACLASS_PEAK = 2;

	    this.TYPE_NMR_SPECTRUM = 'NMR Spectrum';
	    this.TYPE_NMR_FID = 'NMR FID';
	    this.TYPE_IR = 'IR';
	    this.TYPE_RAMAN = 'RAMAN';
	    this.TYPE_UV = 'UV';
	    this.TYPE_MASS = 'MASS';
	    this.TYPE_HPLC = 'HPLC';
	    this.TYPE_GC = 'GC';
	    this.TYPE_CD = 'CD';
	    this.TYPE_2DNMR_SPECTRUM = 'nD NMR SPECTRUM';
	    this.TYPE_2DNMR_FID = 'nD NMR FID';
	    this.TYPE_XY_DEC = 'XY DEC';
	    this.TYPE_XY_INC= 'XY INC';
	    this.TYPE_IV = 'IV';
	}

	SD.fromJcamp = function(jcamp, options) {
	    options = options ||{};
	    if(typeof options.xy ==="undefined")
	        options.xy=true;

	    var spectrum= JcampConverter.convert(jcamp,options);
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
	}
	/**
	 * This function returns the units of the independent dimension.
	 * @returns {xUnit|*|M.xUnit}
	 */
	SD.prototype.getXUnits = function(){
	    return this.getSpectrum().xUnit;
	}

	/**
	 * * This function returns the units of the dependent variable.
	 * @returns {yUnit|*|M.yUnit}
	 */
	SD.prototype.getYUnits = function(){
	    return this.getSpectrum().yUnit;
	}

	/**
	*   Returns the number of points in the current spectrum
	*/
	SD.prototype.getNbPoints=function(i){
	    return this.getSpectrumData(i).y.length;
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

	SD.prototype.setDataClass = function(dataClass){
	    if(dataClass==this.DATACLASS_PEAK) {
	        this.getSpectrum().isPeaktable = true;
	        this.getSpectrum().isXYdata = false;
	    }
	    if(dataClass==this.DATACLASS_XY){
	        this.getSpectrum().isXYdata = true;
	        this.getSpectrum().isPeaktable = false;
	    }
	}

	/**
	 * @function isDataClassPeak();
	 * Is this a PEAKTABLE spectrum?
	 */
	SD.prototype.isDataClassPeak = function(){
	    if(this.getSpectrum().isPeaktable)
	        return  this.getSpectrum().isPeaktable;
	    return false;
	}

	/**
	 * @function isDataClassXY();
	 * Is this a XY spectrum?
	 */
	SD.prototype.isDataClassXY = function(){
	    if(this.getSpectrum().isXYdata)
	        return  this.getSpectrum().isXYdata;
	    return false
	}

	SD.prototype.setDataType = function(dataType){
	    this.getSpectrum().dataType=dataType;
	}

	SD.prototype.getDataType = function(){
	    return this.getSpectrum().dataType;
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
	    return this.getSpectrumData(i).x;
	}

	/**
	 * @function getYData();
	 * This function returns a double array containing the values of the intensity for the current sub-spectrum.
	 */
	SD.prototype.getYData=function(i){
	    return this.getSpectrumData(i).y;
	}

	SD.prototype.getX=function(i){
	    return this.getXData()[i];
	}

	SD.prototype.getY=function(i){
	    return this.getYData()[i];
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
	 * Returns the index-value for the data array corresponding to a X-value in
	 * units for the element of spectraData to which it is linked (spectraNb).
	 * This method makes use of spectraData.getFirstX(), spectraData.getLastX()
	 * and spectraData.getNbPoints() to derive the return value if it of data class XY
	 * It performs a binary search if the spectrum is a peak table
	 *
	 * @param inValue
	 *            (value in Units to be converted)
	 * @return an integer representing the index value of the inValue
	 */
	SD.prototype.unitsToArrayPoint=function(inValue){
	    if (this.isDataClassXY()) {
	        return Math.round((this.getFirstX() - inValue) * (-1.0 / this.getDeltaX()));
	    } else if (this.isDataClassPeak())
	    {
	        var currentArrayPoint = 0,upperLimit=this.getNbPoints()-1, lowerLimit=0, midPoint;
	        //If inverted scale
	        if(this.getFirstX()>this.getLastX()){
	            upperLimit=0;
	            lowerLimit=this.getNbPoints()-1;

	            if(inValue>this.getFirstX())
	                return this.getNbPoints();
	            if(inValue<this.getLastX())
	                return -1;
	        }
	        else{
	            if(inValue<this.getFirstX())
	                return -1;
	            if(inValue>this.getLastX())
	                return this.getNbPoints();
	        }

	        while (Math.abs(upperLimit-lowerLimit) > 1)
	        {
	            midPoint=Math.round(Math.floor((upperLimit+lowerLimit)/2));
	            //x=this.getX(midPoint);
	            if(this.getX(midPoint)==inValue)
	                return midPoint;
	            if(this.getX(midPoint)>inValue)
	                upperLimit=midPoint;
	            else
	                lowerLimit=midPoint;
	        }
	        currentArrayPoint=lowerLimit;
	        if(Math.abs(this.getX(lowerLimit)-inValue)>Math.abs(this.getX(upperLimit)-inValue))
	            currentArrayPoint=upperLimit;
	        return currentArrayPoint;
	    } else {
	        return 0;
	    }
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
	    var y = this.getSpectrumData().y;
	    var length = this.getNbPoints(),i=0;
	    for(i=0;i<length;i++){
	        y[i]+=value;
	    }
	    this.getSpectrum().firstY+=value;
	    this.getSpectrum().lastY+=value;
	}

	/**
	 * @function shift(globalShift)
	 * This function shift the given spectraData. After this function is applied, all the peaks in the
	 * spectraData will be found at xi+globalShift
	 * @param globalShift
	 */
	SD.prototype.shift=function(globalShift) {
	    for(var i=0;i<this.getNbSubSpectra();i++){
	        this.setActiveElement(i);
	        var x = this.getSpectrumData().x;
	        var length = this.getNbPoints(),i=0;
	        for(i=0;i<length;i++){
	            x[i]+=globalShift;
	        }

	        this.getSpectrum().firstX+=globalShift;
	        this.getSpectrum().lastX+=globalShift;
	    }

	}

	/**
	 * @function fillWith(from, to, value)
	 * This function fills a zone of the spectrum with the given value.
	 * @param from
	 * @param to
	 * @param fillWith
	 */
	SD.prototype.fillWith=function(from, to, value) {
	    var tmp, start, end, x, y;
	    if(from > to) {
	        var tmp = from;
	        from = to;
	        to = tmp;
	    }

	    for(var i=0;i<this.getNbSubSpectra();i++){
	        this.setActiveElement(i);
	        x = this.getXData();
	        y = this.getYData();
	        start = this.unitsToArrayPoint(from);
	        end = this.unitsToArrayPoint(to);
	        if(start > end){
	            tmp = start;
	            start = end;
	            end = tmp;
	        }
	        if(start<0)
	            start=0;
	        if(end>=this.getNbPoints)
	            end=this.getNbPoints-1;
	        for(i=start;i<=end;i++){
	                y[i]=value;
	        }
	    }
	}

	/**
	 * @function suppressZone(from, to)
	 * This function suppress a zone from the given spectraData within the given x range.
	 * Returns a spectraData of type PEAKDATA without peaks in the given region
	 * @param from
	 * @param to
	 */
	SD.prototype.suppressZone=function(from, to) {
	    var tmp, start, end, x, y;
	    if(from > to) {
	        var tmp = from;
	        from = to;
	        to = tmp;
	    }

	    for(var i=0;i<this.getNbSubSpectra();i++){
	        this.setActiveElement(i);
	        x = this.getXData();
	        y = this.getYData();
	        start = this.unitsToArrayPoint(from);
	        end = this.unitsToArrayPoint(to);
	        if(start > end){
	            tmp = start;
	            start = end;
	            end = tmp;
	        }
	        if(start<0)
	            start=0;
	        if(end>=this.getNbPoints)
	            end=this.getNbPoints-1;
	        for(i=end;i>=start;i--){
	            y.splice(i,1);
	            x.splice(i,1);
	        }
	    }
	    this.setDataClass(this.DATACLASS_PEAK);
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

	SD.prototype.getSpectraDataY = function(){
	    return this.getYData();
	}

	/**
	 * Return the x elements of the current spectrum
	 * @returns {*}
	 */
	SD.prototype.getSpectraDataX = function(){
	    return this.getXData();
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
	 * This function returns the area under the spectrum in the given window
	 */
	SD.prototype.getArea = function(from, to){
	    var i0 = this.unitsToArrayPoint(from);
	    var ie = this.unitsToArrayPoint(to);
	    var area = 0;
	    if(i0>ie){
	        var tmp = i0;
	        i0 = ie;
	        ie = tmp;
	    }
	    i0=i0<0?0:i0;
	    ie=ie>=this.getNbPoints()?this.getNbPoints()-1:ie;
	    for(var i=i0;i<ie;i++){
	        area+= this.getY(i);
	    }
	    return area*Math.abs(this.getDeltaX());
	},

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
	    //console.log(x[end]+" "+from+" "+x[start]+" "+to);
	    if(x[start]>to||x[end]<from){
	        //console.log("ssss");
	        return [];
	    }

	    while(x[start]<from){start+=direction;}
	    while(x[end]>to){end-=direction;}

	    var winPoints = Math.abs(end-start)+1;
	    if(!nPoints){
	        nPoints = winPoints;
	    }
	    var xwin = new Array(nPoints);
	    var ywin = new Array(nPoints);
	    var index = 0;

	    if(direction==-1)
	        index=nPoints-1;

	    var di = winPoints/nPoints;
	    var i=start-direction;
	    for(var k=0;k<nPoints;k++) {
	        i += Math.round(di * direction);
	        //console.log(i+" "+y[i]);
	        xwin[index] = x[i];
	        ywin[index] = y[i];
	        index += direction;
	    }
	    return [xwin,ywin];
	}

	/**
	 * @function is2D();
	 * Is it a 2D spectrum?
	 */
	SD.prototype.is2D = function(){
	    if(typeof this.sd.twoD == "undefined")
	        return false;
	    return this.sd.twoD;
	}


	module.exports = SD;



/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	function compareNumbers(a, b) {
	    return a - b;
	}

	/**
	 * Computes the sum of the given values
	 * @param {Array} values
	 * @returns {number}
	 */
	exports.sum = function sum(values) {
	    var sum = 0;
	    for (var i = 0; i < values.length; i++) {
	        sum += values[i];
	    }
	    return sum;
	};

	/**
	 * Computes the maximum of the given values
	 * @param {Array} values
	 * @returns {number}
	 */
	exports.max = function max(values) {
	    var max = -Infinity;
	    var l = values.length;
	    for (var i = 0; i < l; i++) {
	        if (values[i] > max) max = values[i];
	    }
	    return max;
	};

	/**
	 * Computes the minimum of the given values
	 * @param {Array} values
	 * @returns {number}
	 */
	exports.min = function min(values) {
	    var min = Infinity;
	    var l = values.length;
	    for (var i = 0; i < l; i++) {
	        if (values[i] < min) min = values[i];
	    }
	    return min;
	};

	/**
	 * Computes the min and max of the given values
	 * @param {Array} values
	 * @returns {{min: number, max: number}}
	 */
	exports.minMax = function minMax(values) {
	    var min = Infinity;
	    var max = -Infinity;
	    var l = values.length;
	    for (var i = 0; i < l; i++) {
	        if (values[i] < min) min = values[i];
	        if (values[i] > max) max = values[i];
	    }
	    return {
	        min: min,
	        max: max
	    };
	};

	/**
	 * Computes the arithmetic mean of the given values
	 * @param {Array} values
	 * @returns {number}
	 */
	exports.arithmeticMean = function arithmeticMean(values) {
	    var sum = 0;
	    var l = values.length;
	    for (var i = 0; i < l; i++) {
	        sum += values[i];
	    }
	    return sum / l;
	};

	/**
	 * {@link arithmeticMean}
	 */
	exports.mean = exports.arithmeticMean;

	/**
	 * Computes the geometric mean of the given values
	 * @param {Array} values
	 * @returns {number}
	 */
	exports.geometricMean = function geometricMean(values) {
	    var mul = 1;
	    var l = values.length;
	    for (var i = 0; i < l; i++) {
	        mul *= values[i];
	    }
	    return Math.pow(mul, 1 / l);
	};

	/**
	 * Computes the mean of the log of the given values
	 * If the return value is exponentiated, it gives the same result as the
	 * geometric mean.
	 * @param {Array} values
	 * @returns {number}
	 */
	exports.logMean = function logMean(values) {
	    var lnsum = 0;
	    var l = values.length;
	    for (var i = 0; i < l; i++) {
	        lnsum += Math.log(values[i]);
	    }
	    return lnsum / l;
	};

	/**
	 * Computes the weighted grand mean for a list of means and sample sizes
	 * @param {Array} means - Mean values for each set of samples
	 * @param {Array} samples - Number of original values for each set of samples
	 * @returns {number}
	 */
	exports.grandMean = function grandMean(means, samples) {
	    var sum = 0;
	    var n = 0;
	    var l = means.length;
	    for (var i = 0; i < l; i++) {
	        sum += samples[i] * means[i];
	        n += samples[i];
	    }
	    return sum / n;
	};

	/**
	 * Computes the truncated mean of the given values using a given percentage
	 * @param {Array} values
	 * @param {number} percent - The percentage of values to keep (range: [0,1])
	 * @param {boolean} [alreadySorted=false]
	 * @returns {number}
	 */
	exports.truncatedMean = function truncatedMean(values, percent, alreadySorted) {
	    if (alreadySorted === undefined) alreadySorted = false;
	    if (!alreadySorted) {
	        values = values.slice().sort(compareNumbers);
	    }
	    var l = values.length;
	    var k = Math.floor(l * percent);
	    var sum = 0;
	    for (var i = k; i < (l - k); i++) {
	        sum += values[i];
	    }
	    return sum / (l - 2 * k);
	};

	/**
	 * Computes the harmonic mean of the given values
	 * @param {Array} values
	 * @returns {number}
	 */
	exports.harmonicMean = function harmonicMean(values) {
	    var sum = 0;
	    var l = values.length;
	    for (var i = 0; i < l; i++) {
	        if (values[i] === 0) {
	            throw new RangeError('value at index ' + i + 'is zero');
	        }
	        sum += 1 / values[i];
	    }
	    return l / sum;
	};

	/**
	 * Computes the contraharmonic mean of the given values
	 * @param {Array} values
	 * @returns {number}
	 */
	exports.contraHarmonicMean = function contraHarmonicMean(values) {
	    var r1 = 0;
	    var r2 = 0;
	    var l = values.length;
	    for (var i = 0; i < l; i++) {
	        r1 += values[i] * values[i];
	        r2 += values[i];
	    }
	    if (r2 < 0) {
	        throw new RangeError('sum of values is negative');
	    }
	    return r1 / r2;
	};

	/**
	 * Computes the median of the given values
	 * @param {Array} values
	 * @param {boolean} [alreadySorted=false]
	 * @returns {number}
	 */
	exports.median = function median(values, alreadySorted) {
	    if (alreadySorted === undefined) alreadySorted = false;
	    if (!alreadySorted) {
	        values = values.slice().sort(compareNumbers);
	    }
	    var l = values.length;
	    var half = Math.floor(l / 2);
	    if (l % 2 === 0) {
	        return (values[half - 1] + values[half]) * 0.5;
	    } else {
	        return values[half];
	    }
	};

	/**
	 * Computes the variance of the given values
	 * @param {Array} values
	 * @param {boolean} [unbiased=true] - if true, divide by (n-1); if false, divide by n.
	 * @returns {number}
	 */
	exports.variance = function variance(values, unbiased) {
	    if (unbiased === undefined) unbiased = true;
	    var theMean = exports.mean(values);
	    var theVariance = 0;
	    var l = values.length;

	    for (var i = 0; i < l; i++) {
	        var x = values[i] - theMean;
	        theVariance += x * x;
	    }

	    if (unbiased) {
	        return theVariance / (l - 1);
	    } else {
	        return theVariance / l;
	    }
	};

	/**
	 * Computes the standard deviation of the given values
	 * @param {Array} values
	 * @param {boolean} [unbiased=true] - if true, divide by (n-1); if false, divide by n.
	 * @returns {number}
	 */
	exports.standardDeviation = function standardDeviation(values, unbiased) {
	    return Math.sqrt(exports.variance(values, unbiased));
	};

	exports.standardError = function standardError(values) {
	    return exports.standardDeviation(values) / Math.sqrt(values.length);
	};

	exports.quartiles = function quartiles(values, alreadySorted) {
	    if (typeof(alreadySorted) === 'undefined') alreadySorted = false;
	    if (!alreadySorted) {
	        values = values.slice();
	        values.sort(compareNumbers);
	    }

	    var quart = values.length / 4;
	    var q1 = values[Math.ceil(quart) - 1];
	    var q2 = exports.median(values, true);
	    var q3 = values[Math.ceil(quart * 3) - 1];

	    return {q1: q1, q2: q2, q3: q3};
	};

	exports.pooledStandardDeviation = function pooledStandardDeviation(samples, unbiased) {
	    return Math.sqrt(exports.pooledVariance(samples, unbiased));
	};

	exports.pooledVariance = function pooledVariance(samples, unbiased) {
	    if (typeof(unbiased) === 'undefined') unbiased = true;
	    var sum = 0;
	    var length = 0, l = samples.length;
	    for (var i = 0; i < l; i++) {
	        var values = samples[i];
	        var vari = exports.variance(values);

	        sum += (values.length - 1) * vari;

	        if (unbiased)
	            length += values.length - 1;
	        else
	            length += values.length;
	    }
	    return sum / length;
	};

	exports.mode = function mode(values) {
	    var l = values.length,
	        itemCount = new Array(l),
	        i;
	    for (i = 0; i < l; i++) {
	        itemCount[i] = 0;
	    }
	    var itemArray = new Array(l);
	    var count = 0;

	    for (i = 0; i < l; i++) {
	        var index = itemArray.indexOf(values[i]);
	        if (index >= 0)
	            itemCount[index]++;
	        else {
	            itemArray[count] = values[i];
	            itemCount[count] = 1;
	            count++;
	        }
	    }

	    var maxValue = 0, maxIndex = 0;
	    for (i = 0; i < count; i++) {
	        if (itemCount[i] > maxValue) {
	            maxValue = itemCount[i];
	            maxIndex = i;
	        }
	    }

	    return itemArray[maxIndex];
	};

	exports.covariance = function covariance(vector1, vector2, unbiased) {
	    if (typeof(unbiased) === 'undefined') unbiased = true;
	    var mean1 = exports.mean(vector1);
	    var mean2 = exports.mean(vector2);

	    if (vector1.length !== vector2.length)
	        throw "Vectors do not have the same dimensions";

	    var cov = 0, l = vector1.length;
	    for (var i = 0; i < l; i++) {
	        var x = vector1[i] - mean1;
	        var y = vector2[i] - mean2;
	        cov += x * y;
	    }

	    if (unbiased)
	        return cov / (l - 1);
	    else
	        return cov / l;
	};

	exports.skewness = function skewness(values, unbiased) {
	    if (typeof(unbiased) === 'undefined') unbiased = true;
	    var theMean = exports.mean(values);

	    var s2 = 0, s3 = 0, l = values.length;
	    for (var i = 0; i < l; i++) {
	        var dev = values[i] - theMean;
	        s2 += dev * dev;
	        s3 += dev * dev * dev;
	    }
	    var m2 = s2 / l;
	    var m3 = s3 / l;

	    var g = m3 / (Math.pow(m2, 3 / 2.0));
	    if (unbiased) {
	        var a = Math.sqrt(l * (l - 1));
	        var b = l - 2;
	        return (a / b) * g;
	    }
	    else {
	        return g;
	    }
	};

	exports.kurtosis = function kurtosis(values, unbiased) {
	    if (typeof(unbiased) === 'undefined') unbiased = true;
	    var theMean = exports.mean(values);
	    var n = values.length, s2 = 0, s4 = 0;

	    for (var i = 0; i < n; i++) {
	        var dev = values[i] - theMean;
	        s2 += dev * dev;
	        s4 += dev * dev * dev * dev;
	    }
	    var m2 = s2 / n;
	    var m4 = s4 / n;

	    if (unbiased) {
	        var v = s2 / (n - 1);
	        var a = (n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3));
	        var b = s4 / (v * v);
	        var c = ((n - 1) * (n - 1)) / ((n - 2) * (n - 3));

	        return a * b - 3 * c;
	    }
	    else {
	        return m4 / (m2 * m2) - 3;
	    }
	};

	exports.entropy = function entropy(values, eps) {
	    if (typeof(eps) === 'undefined') eps = 0;
	    var sum = 0, l = values.length;
	    for (var i = 0; i < l; i++)
	        sum += values[i] * Math.log(values[i] + eps);
	    return -sum;
	};

	exports.weightedMean = function weightedMean(values, weights) {
	    var sum = 0, l = values.length;
	    for (var i = 0; i < l; i++)
	        sum += values[i] * weights[i];
	    return sum;
	};

	exports.weightedStandardDeviation = function weightedStandardDeviation(values, weights) {
	    return Math.sqrt(exports.weightedVariance(values, weights));
	};

	exports.weightedVariance = function weightedVariance(values, weights) {
	    var theMean = exports.weightedMean(values, weights);
	    var vari = 0, l = values.length;
	    var a = 0, b = 0;

	    for (var i = 0; i < l; i++) {
	        var z = values[i] - theMean;
	        var w = weights[i];

	        vari += w * (z * z);
	        b += w;
	        a += w * w;
	    }

	    return vari * (b / (b * b - a));
	};

	exports.center = function center(values, inPlace) {
	    if (typeof(inPlace) === 'undefined') inPlace = false;

	    var result = values;
	    if (!inPlace)
	        result = values.slice();

	    var theMean = exports.mean(result), l = result.length;
	    for (var i = 0; i < l; i++)
	        result[i] -= theMean;
	};

	exports.standardize = function standardize(values, standardDev, inPlace) {
	    if (typeof(standardDev) === 'undefined') standardDev = exports.standardDeviation(values);
	    if (typeof(inPlace) === 'undefined') inPlace = false;
	    var l = values.length;
	    var result = inPlace ? values : new Array(l);
	    for (var i = 0; i < l; i++)
	        result[i] = values[i] / standardDev;
	    return result;
	};

	exports.cumulativeSum = function cumulativeSum(array) {
	    var l = array.length;
	    var result = new Array(l);
	    result[0] = array[0];
	    for (var i = 1; i < l; i++)
	        result[i] = result[i - 1] + array[i];
	    return result;
	};


/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	function getConverter() {

	    // the following RegExp can only be used for XYdata, some peakTables have values with a "E-5" ...
	    var xyDataSplitRegExp = /[,\t \+-]*(?=[^\d,\t \.])|[ \t]+(?=[\d+\.-])/;
	    var removeCommentRegExp = /\$\$.*/;
	    var peakTableSplitRegExp = /[,\t ]+/;
	    var DEBUG = false;

	    var GC_MS_FIELDS = ['TIC', '.RIC', 'SCANNUMBER'];

	    function convertToFloatArray(stringArray) {
	        var l = stringArray.length;
	        var floatArray = new Array(l);
	        for (var i = 0; i < l; i++) {
	            floatArray[i] = parseFloat(stringArray[i]);
	        }
	        return floatArray;
	    }

	    /*
	     options.keepSpectra: keep the original spectra for a 2D
	     options.xy: true // create x / y array instead of a 1D array
	     options.keepRecordsRegExp: which fields do we keep
	     */

	    function convert(jcamp, options) {
	        options = options || {};

	        var keepRecordsRegExp=/^[A-Z]+$/;
	        if (options.keepRecordsRegExp) keepRecordsRegExp=options.keepRecordsRegExp;

	        var start = new Date();

	        var ntuples = {},
	            ldr,
	            dataLabel,
	            dataValue,
	            ldrs,
	            i, ii, position, endLine, infos;

	        var result = {};
	        result.profiling = [];
	        result.logs = [];
	        var spectra = [];
	        result.spectra = spectra;
	        result.info = {};
	        var spectrum = {};

	        if (!(typeof jcamp === 'string')) return result;
	        // console.time('start');

	        if (result.profiling) result.profiling.push({action: 'Before split to LDRS', time: new Date() - start});

	        ldrs = jcamp.split(/[\r\n]+##/);

	        if (result.profiling) result.profiling.push({action: 'Split to LDRS', time: new Date() - start});

	        if (ldrs[0]) ldrs[0] = ldrs[0].replace(/^[\r\n ]*##/, '');

	        for (i = 0, ii = ldrs.length; i < ii; i++) {
	            ldr = ldrs[i];
	            // This is a new LDR
	            position = ldr.indexOf('=');
	            if (position > 0) {
	                dataLabel = ldr.substring(0, position);
	                dataValue = ldr.substring(position + 1).trim();
	            } else {
	                dataLabel = ldr;
	                dataValue = '';
	            }
	            dataLabel = dataLabel.replace(/[_ -]/g, '').toUpperCase();

	            if (dataLabel === 'DATATABLE') {
	                endLine = dataValue.indexOf('\n');
	                if (endLine === -1) endLine = dataValue.indexOf('\r');
	                if (endLine > 0) {
	                    var xIndex = -1;
	                    var yIndex = -1;
	                    // ##DATA TABLE= (X++(I..I)), XYDATA
	                    // We need to find the variables

	                    infos = dataValue.substring(0, endLine).split(/[ ,;\t]+/);
	                    if (infos[0].indexOf('++') > 0) {
	                        var firstVariable = infos[0].replace(/.*\(([a-zA-Z0-9]+)\+\+.*/, '$1');
	                        var secondVariable = infos[0].replace(/.*\.\.([a-zA-Z0-9]+).*/, '$1');
	                        xIndex = ntuples.symbol.indexOf(firstVariable);
	                        yIndex = ntuples.symbol.indexOf(secondVariable);
	                    }

	                    if (xIndex === -1) xIndex = 0;
	                    if (yIndex === -1) yIndex = 0;

	                    if (ntuples.first) {
	                        if (ntuples.first.length > xIndex) spectrum.firstX = ntuples.first[xIndex];
	                        if (ntuples.first.length > yIndex) spectrum.firstY = ntuples.first[yIndex];
	                    }
	                    if (ntuples.last) {
	                        if (ntuples.last.length > xIndex) spectrum.lastX = ntuples.last[xIndex];
	                        if (ntuples.last.length > yIndex) spectrum.lastY = ntuples.last[yIndex];
	                    }
	                    if (ntuples.vardim && ntuples.vardim.length > xIndex) {
	                        spectrum.nbPoints = ntuples.vardim[xIndex];
	                    }
	                    if (ntuples.factor) {
	                        if (ntuples.factor.length > xIndex) spectrum.xFactor = ntuples.factor[xIndex];
	                        if (ntuples.factor.length > yIndex) spectrum.yFactor = ntuples.factor[yIndex];
	                    }
	                    if (ntuples.units) {
	                        if (ntuples.units.length > xIndex) spectrum.xUnit = ntuples.units[xIndex];
	                        if (ntuples.units.length > yIndex) spectrum.yUnit = ntuples.units[yIndex];
	                    }
	                    spectrum.datatable = infos[0];
	                    if (infos[1] && infos[1].indexOf('PEAKS') > -1) {
	                        dataLabel = 'PEAKTABLE';
	                    } else if (infos[1] && (infos[1].indexOf('XYDATA') || infos[0].indexOf('++') > 0)) {
	                        dataLabel = 'XYDATA';
	                        spectrum.deltaX = (spectrum.lastX - spectrum.firstX) / (spectrum.nbPoints - 1);
	                    }
	                }
	            }


	            if (dataLabel === 'TITLE') {
	                spectrum.title = dataValue;
	            } else if (dataLabel === 'DATATYPE') {
	                spectrum.dataType = dataValue;
	                if (dataValue.indexOf('nD') > -1) {
	                    result.twoD = true;
	                }
	            } else if (dataLabel === 'XUNITS') {
	                spectrum.xUnit = dataValue;
	            } else if (dataLabel === 'YUNITS') {
	                spectrum.yUnit = dataValue;
	            } else if (dataLabel === 'FIRSTX') {
	                spectrum.firstX = parseFloat(dataValue);
	            } else if (dataLabel === 'LASTX') {
	                spectrum.lastX = parseFloat(dataValue);
	            } else if (dataLabel === 'FIRSTY') {
	                spectrum.firstY = parseFloat(dataValue);
	            } else if (dataLabel === 'NPOINTS') {
	                spectrum.nbPoints = parseFloat(dataValue);
	            } else if (dataLabel === 'XFACTOR') {
	                spectrum.xFactor = parseFloat(dataValue);
	            } else if (dataLabel === 'YFACTOR') {
	                spectrum.yFactor = parseFloat(dataValue);
	            } else if (dataLabel === 'DELTAX') {
	                spectrum.deltaX = parseFloat(dataValue);
	            } else if (dataLabel === '.OBSERVEFREQUENCY' || dataLabel === '$SFO1') {
	                if (!spectrum.observeFrequency) spectrum.observeFrequency = parseFloat(dataValue);
	            } else if (dataLabel === '.OBSERVENUCLEUS') {
	                if (!spectrum.xType) result.xType = dataValue.replace(/[^a-zA-Z0-9]/g, '');
	            } else if (dataLabel === '$SFO2') {
	                if (!result.indirectFrequency) result.indirectFrequency = parseFloat(dataValue);

	            } else if (dataLabel === '$OFFSET') {   // OFFSET for Bruker spectra
	                result.shiftOffsetNum = 0;
	                if (!result.shiftOffsetVal)  result.shiftOffsetVal = parseFloat(dataValue);
	            } else if (dataLabel === '$REFERENCEPOINT') {   // OFFSET for Varian spectra


	                // if we activate this part it does not work for ACD specmanager
	                //         } else if (dataLabel=='.SHIFTREFERENCE') {   // OFFSET FOR Bruker Spectra
	                //                 var parts = dataValue.split(/ *, */);
	                //                 result.shiftOffsetNum = parseInt(parts[2].trim());
	                //                 result.shiftOffsetVal = parseFloat(parts[3].trim());
	            } else if (dataLabel === 'VARNAME') {
	                ntuples.varname = dataValue.split(/[, \t]{2,}/);
	            } else if (dataLabel === 'SYMBOL') {
	                ntuples.symbol = dataValue.split(/[, \t]{2,}/);
	            } else if (dataLabel === 'VARTYPE') {
	                ntuples.vartype = dataValue.split(/[, \t]{2,}/);
	            } else if (dataLabel === 'VARFORM') {
	                ntuples.varform = dataValue.split(/[, \t]{2,}/);
	            } else if (dataLabel === 'VARDIM') {
	                ntuples.vardim = convertToFloatArray(dataValue.split(/[, \t]{2,}/));
	            } else if (dataLabel === 'UNITS') {
	                ntuples.units = dataValue.split(/[, \t]{2,}/);
	            } else if (dataLabel === 'FACTOR') {
	                ntuples.factor = convertToFloatArray(dataValue.split(/[, \t]{2,}/));
	            } else if (dataLabel === 'FIRST') {
	                ntuples.first = convertToFloatArray(dataValue.split(/[, \t]{2,}/));
	            } else if (dataLabel === 'LAST') {
	                ntuples.last = convertToFloatArray(dataValue.split(/[, \t]{2,}/));
	            } else if (dataLabel === 'MIN') {
	                ntuples.min = convertToFloatArray(dataValue.split(/[, \t]{2,}/));
	            } else if (dataLabel === 'MAX') {
	                ntuples.max = convertToFloatArray(dataValue.split(/[, \t]{2,}/));
	            } else if (dataLabel === '.NUCLEUS') {
	                if (result.twoD) {
	                    result.yType = dataValue.split(/[, \t]{2,}/)[0];
	                }
	            } else if (dataLabel === 'PAGE') {
	                spectrum.page = dataValue.trim();
	                spectrum.pageValue = parseFloat(dataValue.replace(/^.*=/, ''));
	                spectrum.pageSymbol = spectrum.page.replace(/=.*/, '');
	                var pageSymbolIndex = ntuples.symbol.indexOf(spectrum.pageSymbol);
	                var unit = '';
	                if (ntuples.units && ntuples.units[pageSymbolIndex]) {
	                    unit = ntuples.units[pageSymbolIndex];
	                }
	                if (result.indirectFrequency && unit !== 'PPM') {
	                    spectrum.pageValue /= result.indirectFrequency;
	                }
	            } else if (dataLabel === 'RETENTIONTIME') {
	                spectrum.pageValue = parseFloat(dataValue);
	            } else if (dataLabel === 'XYDATA') {
	                prepareSpectrum(result, spectrum);
	                // well apparently we should still consider it is a PEAK TABLE if there are no '++' after
	                if (dataValue.match(/.*\+\+.*/)) {
	                    parseXYData(spectrum, dataValue, result);
	                } else {
	                    parsePeakTable(spectrum, dataValue, result);
	                }
	                spectra.push(spectrum);
	                spectrum = {};
	            } else if (dataLabel === 'PEAKTABLE') {
	                prepareSpectrum(result, spectrum);
	                parsePeakTable(spectrum, dataValue, result);
	                spectra.push(spectrum);
	                spectrum = {};
	            } else if (isMSField(dataLabel)) {
	                spectrum[convertMSFieldToLabel(dataLabel)] = dataValue;
	            } else if (dataLabel.match(keepRecordsRegExp)) {
	                result.info[dataLabel] = dataValue.trim();
	            }
	        }

	        // Currently disabled
	        //    if (options && options.lowRes) addLowRes(spectra,options);

	        if (result.profiling) result.profiling.push({action: 'Finished parsing', time: new Date() - start});

	        if (Object.keys(ntuples).length>0) {
	            var newNtuples=[];
	            var keys=Object.keys(ntuples);
	            for (var i=0; i<keys.length; i++) {
	                var key=keys[i];
	                var values=ntuples[key];
	                for (var j=0; j<values.length; j++) {
	                    if (! newNtuples[j]) newNtuples[j]={};
	                    newNtuples[j][key]=values[j];
	                }
	            }
	            result.ntuples=newNtuples;
	        }

	        if (result.twoD) {
	            add2D(result);
	            if (result.profiling) result.profiling.push({
	                action: 'Finished countour plot calculation',
	                time: new Date() - start
	            });
	            if (!options.keepSpectra) {
	                delete result.spectra;
	            }
	        }


	        // maybe it is a GC (HPLC) / MS. In this case we add a new format
	        if (spectra.length > 1 && (! spectra[0].dataType || spectra[0].dataType.toLowerCase().match(/.*mass./))) {
	            addGCMS(result);
	            if (result.profiling) result.profiling.push({
	                action: 'Finished GCMS calculation',
	                time: new Date() - start
	            });
	        }


	        if (options.xy) { // the spectraData should not be a oneD array but an object with x and y
	            if (spectra.length > 0) {
	                for (var i=0; i<spectra.length; i++) {
	                    var spectrum=spectra[i];
	                    if (spectrum.data.length>0) {
	                        for (var j=0; j<spectrum.data.length; j++) {
	                            var data=spectrum.data[j];
	                            var newData={x:Array(data.length/2), y:Array(data.length/2)};
	                            for (var k=0; k<data.length; k=k+2) {
	                                newData.x[k/2]=data[k];
	                                newData.y[k/2]=data[k+1];
	                            }
	                            spectrum.data[j]=newData;
	                        }

	                    }

	                }
	            }
	        }

	        if (result.profiling) {
	            result.profiling.push({action: 'Total time', time: new Date() - start});
	        }

	        //   console.log(result);
	        //    console.log(JSON.stringify(spectra));
	        return result;

	    }


	    function convertMSFieldToLabel(value) {
	        return value.toLowerCase().replace(/[^a-z0-9]/g, '');
	    }

	    function isMSField(dataLabel) {
	        for (var i = 0; i < GC_MS_FIELDS.length; i++) {
	            if (dataLabel === GC_MS_FIELDS[i]) return true;
	        }
	        return false;
	    }

	    function addGCMS(result) {
	        var spectra = result.spectra;
	        var existingGCMSFields = [];
	        var i;
	        for (i = 0; i < GC_MS_FIELDS.length; i++) {
	            var label = convertMSFieldToLabel(GC_MS_FIELDS[i]);
	            if (spectra[0][label]) {
	                existingGCMSFields.push(label);
	            }
	        }
	        if (existingGCMSFields.length===0) return;
	        var gcms = {};
	        gcms.gc = {};
	        gcms.ms = [];
	        for (i = 0; i < existingGCMSFields.length; i++) {
	            gcms.gc[existingGCMSFields[i]] = [];
	        }
	        for (i = 0; i < spectra.length; i++) {
	            var spectrum = spectra[i];
	            for (var j = 0; j < existingGCMSFields.length; j++) {
	                gcms.gc[existingGCMSFields[j]].push(spectrum.pageValue);
	                gcms.gc[existingGCMSFields[j]].push(parseFloat(spectrum[existingGCMSFields[j]]));
	            }
	          if (spectrum.data) gcms.ms[i] = spectrum.data[0];

	        }
	        result.gcms = gcms;
	    }

	    function prepareSpectrum(result, spectrum) {
	        if (!spectrum.xFactor) spectrum.xFactor = 1;
	        if (!spectrum.yFactor) spectrum.yFactor = 1;
	        if (spectrum.observeFrequency) {
	            if (spectrum.xUnit && spectrum.xUnit.toUpperCase() === 'HZ') {
	                spectrum.xUnit = 'PPM';
	                spectrum.xFactor = spectrum.xFactor / spectrum.observeFrequency;
	                spectrum.firstX = spectrum.firstX / spectrum.observeFrequency;
	                spectrum.lastX = spectrum.lastX / spectrum.observeFrequency;
	                spectrum.deltaX = spectrum.deltaX / spectrum.observeFrequency;
	            }
	        }
	        if (result.shiftOffsetVal) {
	            var shift = spectrum.firstX - result.shiftOffsetVal;
	            spectrum.firstX = spectrum.firstX - shift;
	            spectrum.lastX = spectrum.lastX - shift;
	        }
	    }

	    function parsePeakTable(spectrum, value, result) {
	        spectrum.isPeaktable=true;
	        var i, ii, j, jj, values;
	        var currentData = [];
	        spectrum.data = [currentData];

	        // counts for around 20% of the time
	        var lines = value.split(/,? *,?[;\r\n]+ */);

	        var k = 0;
	        for (i = 1, ii = lines.length; i < ii; i++) {
	            values = lines[i].trim().replace(removeCommentRegExp, '').split(peakTableSplitRegExp);
	            if (values.length % 2 === 0) {
	                for (j = 0, jj = values.length; j < jj; j = j + 2) {
	                    // takes around 40% of the time to add and parse the 2 values nearly exclusively because of parseFloat
	                    currentData[k++] = (parseFloat(values[j]) * spectrum.xFactor);
	                    currentData[k++] = (parseFloat(values[j + 1]) * spectrum.yFactor);
	                }
	            } else {
	                result.logs.push('Format error: ' + values);
	            }
	        }
	    }

	    function parseXYData(spectrum, value, result) {
	        // we check if deltaX is defined otherwise we calculate it
	        if (!spectrum.deltaX) {
	            spectrum.deltaX = (spectrum.lastX - spectrum.firstX) / (spectrum.nbPoints - 1);
	        }

	        spectrum.isXYdata=true;

	        var currentData = [];
	        spectrum.data = [currentData];

	        var currentX = spectrum.firstX;
	        var currentY = spectrum.firstY;
	        var lines = value.split(/[\r\n]+/);
	        var lastDif, values, ascii, expectedY;
	        values = [];
	        for (var i = 1, ii = lines.length; i < ii; i++) {
	            //var previousValues=JSON.parse(JSON.stringify(values));
	            values = lines[i].trim().replace(removeCommentRegExp, '').split(xyDataSplitRegExp);
	            if (values.length > 0) {
	                if (DEBUG) {
	                    if (!spectrum.firstPoint) {
	                        spectrum.firstPoint = parseFloat(values[0]);
	                    }
	                    var expectedCurrentX = parseFloat(values[0] - spectrum.firstPoint) * spectrum.xFactor + spectrum.firstX;
	                    if ((lastDif || lastDif === 0)) {
	                        expectedCurrentX += spectrum.deltaX;
	                    }
	                    result.logs.push('Checking X value: currentX: ' + currentX + ' - expectedCurrentX: ' + expectedCurrentX);
	                }
	                for (var j = 1, jj = values.length; j < jj; j++) {
	                    if (j === 1 && (lastDif || lastDif === 0)) {
	                        lastDif = null; // at the beginning of each line there should be the full value X / Y so the diff is always undefined
	                        // we could check if we have the expected Y value
	                        ascii = values[j].charCodeAt(0);

	                        if (false) { // this code is just to check the jcamp DIFDUP and the next line repeat of Y value
	                            // + - . 0 1 2 3 4 5 6 7 8 9
	                            if ((ascii === 43) || (ascii === 45) || (ascii === 46) || ((ascii > 47) && (ascii < 58))) {
	                                expectedY = parseFloat(values[j]);
	                            } else
	                            // positive SQZ digits @ A B C D E F G H I (ascii 64-73)
	                            if ((ascii > 63) && (ascii < 74)) {
	                                // we could use parseInt but parseFloat is faster at least in Chrome
	                                expectedY = parseFloat(String.fromCharCode(ascii - 16) + values[j].substring(1));
	                            } else
	                            // negative SQZ digits a b c d e f g h i (ascii 97-105)
	                            if ((ascii > 96) && (ascii < 106)) {
	                                // we could use parseInt but parseFloat is faster at least in Chrome
	                                expectedY = -parseFloat(String.fromCharCode(ascii - 48) + values[j].substring(1));
	                            }
	                            if (expectedY !== currentY) {
	                                result.logs.push('Y value check error: Found: ' + expectedY + ' - Current: ' + currentY);
	                                result.logs.push('Previous values: ' + previousValues.length);
	                                result.logs.push(previousValues);
	                            }
	                        }
	                    } else {
	                        if (values[j].length > 0) {
	                            ascii = values[j].charCodeAt(0);
	                            // + - . 0 1 2 3 4 5 6 7 8 9
	                            if ((ascii === 43) || (ascii === 45) || (ascii === 46) || ((ascii > 47) && (ascii < 58))) {
	                                lastDif = null;
	                                currentY = parseFloat(values[j]);
	                                currentData.push(currentX, currentY * spectrum.yFactor);;
	                                currentX += spectrum.deltaX;
	                            } else
	                            // positive SQZ digits @ A B C D E F G H I (ascii 64-73)
	                            if ((ascii > 63) && (ascii < 74)) {
	                                lastDif = null;
	                                currentY = parseFloat(String.fromCharCode(ascii - 16) + values[j].substring(1));
	                                currentData.push(currentX, currentY * spectrum.yFactor);;
	                                currentX += spectrum.deltaX;
	                            } else
	                            // negative SQZ digits a b c d e f g h i (ascii 97-105)
	                            if ((ascii > 96) && (ascii < 106)) {
	                                lastDif = null;
	                                currentY = -parseFloat(String.fromCharCode(ascii - 48) + values[j].substring(1));
	                                currentData.push(currentX, currentY * spectrum.yFactor);;
	                                currentX += spectrum.deltaX;
	                            } else



	                            // DUP digits S T U V W X Y Z s (ascii 83-90, 115)
	                            if (((ascii > 82) && (ascii < 91)) || (ascii === 115)) {
	                                var dup = parseFloat(String.fromCharCode(ascii - 34) + values[j].substring(1)) - 1;
	                                if (ascii === 115) {
	                                    dup = parseFloat('9' + values[j].substring(1)) - 1;
	                                }
	                                for (var l = 0; l < dup; l++) {
	                                    if (lastDif) {
	                                        currentY = currentY + lastDif;
	                                    }
	                                    currentData.push(currentX, currentY * spectrum.yFactor);;
	                                    currentX += spectrum.deltaX;
	                                }
	                            } else
	                            // positive DIF digits % J K L M N O P Q R (ascii 37, 74-82)
	                            if (ascii === 37) {
	                                lastDif = parseFloat('0' + values[j].substring(1));
	                                currentY += lastDif;
	                                currentData.push(currentX, currentY * spectrum.yFactor);;
	                                currentX += spectrum.deltaX;
	                            } else if ((ascii > 73) && (ascii < 83)) {
	                                lastDif = parseFloat(String.fromCharCode(ascii - 25) + values[j].substring(1));
	                                currentY += lastDif;
	                                currentData.push(currentX, currentY * spectrum.yFactor);;
	                                currentX += spectrum.deltaX;
	                            } else
	                            // negative DIF digits j k l m n o p q r (ascii 106-114)
	                            if ((ascii > 105) && (ascii < 115)) {
	                                lastDif = -parseFloat(String.fromCharCode(ascii - 57) + values[j].substring(1));
	                                currentY += lastDif;
	                                currentData.push(currentX, currentY * spectrum.yFactor);;
	                                currentX += spectrum.deltaX;
	                            }
	                        }
	                    }
	                }
	            }
	        }

	    }

	    function convertTo3DZ(spectra) {
	        var noise = 0;
	        var minZ = spectra[0].data[0][0];
	        var maxZ = minZ;
	        var ySize = spectra.length;
	        var xSize = spectra[0].data[0].length / 2;
	        var z = new Array(ySize);
	        for (var i = 0; i < ySize; i++) {
	            z[i] = new Array(xSize);
	            for (var j = 0; j < xSize; j++) {
	                z[i][j] = spectra[i].data[0][j * 2 + 1];
	                if (z[i][j] < minZ) minZ = spectra[i].data[0][j * 2 + 1];
	                if (z[i][j] > maxZ) maxZ = spectra[i].data[0][j * 2 + 1];
	                if (i !== 0 && j !== 0) {
	                    noise += Math.abs(z[i][j] - z[i][j - 1]) + Math.abs(z[i][j] - z[i - 1][j]);
	                }
	            }
	        }
	        return {
	            z: z,
	            minX: spectra[0].data[0][0],
	            maxX: spectra[0].data[0][spectra[0].data[0].length - 2],
	            minY: spectra[0].pageValue,
	            maxY: spectra[ySize - 1].pageValue,
	            minZ: minZ,
	            maxZ: maxZ,
	            noise: noise / ((ySize - 1) * (xSize - 1) * 2)
	        };

	    }

	    function add2D(result) {
	        var zData = convertTo3DZ(result.spectra);
	        result.contourLines = generateContourLines(zData);
	        delete zData.z;
	        result.minMax = zData;
	    }


	    function generateContourLines(zData, options) {
	        //console.time('generateContourLines');
	        var noise = zData.noise;
	        var z = zData.z;
	        var contourLevels = [];
	        var nbLevels = 7;
	        var povarHeight = new Float32Array(4);
	        var isOver = [];
	        var nbSubSpectra = z.length;
	        var nbPovars = z[0].length;
	        var pAx, pAy, pBx, pBy;

	        var x0 = zData.minX;
	        var xN = zData.maxX;
	        var dx = (xN - x0) / (nbPovars - 1);
	        var y0 = zData.minY;
	        var yN = zData.maxY;
	        var dy = (yN - y0) / (nbSubSpectra - 1);
	        var minZ = zData.minZ;
	        var maxZ = zData.maxZ;

	        //System.out.prvarln('y0 '+y0+' yN '+yN);
	        // -------------------------
	        // Povars attribution
	        //
	        // 0----1
	        // |  / |
	        // | /  |
	        // 2----3
	        //
	        // ---------------------d------

	        var lineZValue;
	        for (var level = 0; level < nbLevels * 2; level++) { // multiply by 2 for positif and negatif
	            var contourLevel = {};
	            contourLevels.push(contourLevel);
	            var side = level % 2;
	            if (side === 0) {
	                lineZValue = (maxZ - 5 * noise) * Math.exp(level / 2 - nbLevels) + 5 * noise;
	            } else {
	                lineZValue = -(maxZ - 5 * noise) * Math.exp(level / 2 - nbLevels) - 5 * noise;
	            }
	            var lines = [];
	            contourLevel.zValue = lineZValue;
	            contourLevel.lines = lines;

	            if (lineZValue <= minZ || lineZValue >= maxZ) continue;

	            for (var iSubSpectra = 0; iSubSpectra < nbSubSpectra - 1; iSubSpectra++) {
	                for (var povar = 0; povar < nbPovars - 1; povar++) {
	                    povarHeight[0] = z[iSubSpectra][povar];
	                    povarHeight[1] = z[iSubSpectra][povar + 1];
	                    povarHeight[2] = z[(iSubSpectra + 1)][povar];
	                    povarHeight[3] = z[(iSubSpectra + 1)][(povar + 1)];

	                    for (var i = 0; i < 4; i++) {
	                        isOver[i] = (povarHeight[i] > lineZValue);
	                    }

	                    // Example povar0 is over the plane and povar1 and
	                    // povar2 are below, we find the varersections and add
	                    // the segment
	                    if (isOver[0] !== isOver[1] && isOver[0] !== isOver[2]) {
	                        pAx = povar + (lineZValue - povarHeight[0]) / (povarHeight[1] - povarHeight[0]);
	                        pAy = iSubSpectra;
	                        pBx = povar;
	                        pBy = iSubSpectra + (lineZValue - povarHeight[0]) / (povarHeight[2] - povarHeight[0]);
	                        lines.push(pAx * dx + x0, pAy * dy + y0, pBx * dx + x0, pBy * dy + y0);
	                    }
	                    if (isOver[3] !== isOver[1] && isOver[3] !== isOver[2]) {
	                        pAx = povar + 1;
	                        pAy = iSubSpectra + 1 - (lineZValue - povarHeight[3]) / (povarHeight[1] - povarHeight[3]);
	                        pBx = povar + 1 - (lineZValue - povarHeight[3]) / (povarHeight[2] - povarHeight[3]);
	                        pBy = iSubSpectra + 1;
	                        lines.push(pAx * dx + x0, pAy * dy + y0, pBx * dx + x0, pBy * dy + y0);
	                    }
	                    // test around the diagonal
	                    if (isOver[1] !== isOver[2]) {
	                        pAx = povar + 1 - (lineZValue - povarHeight[1]) / (povarHeight[2] - povarHeight[1]);
	                        pAy = iSubSpectra + (lineZValue - povarHeight[1]) / (povarHeight[2] - povarHeight[1]);
	                        if (isOver[1] !== isOver[0]) {
	                            pBx = povar + 1 - (lineZValue - povarHeight[1]) / (povarHeight[0] - povarHeight[1]);
	                            pBy = iSubSpectra;
	                            lines.push(pAx * dx + x0, pAy * dy + y0, pBx * dx + x0, pBy * dy + y0);
	                        }
	                        if (isOver[2] !== isOver[0]) {
	                            pBx = povar;
	                            pBy = iSubSpectra + 1 - (lineZValue - povarHeight[2]) / (povarHeight[0] - povarHeight[2]);
	                            lines.push(pAx * dx + x0, pAy * dy + y0, pBx * dx + x0, pBy * dy + y0);
	                        }
	                        if (isOver[1] !== isOver[3]) {
	                            pBx = povar + 1;
	                            pBy = iSubSpectra + (lineZValue - povarHeight[1]) / (povarHeight[3] - povarHeight[1]);
	                            lines.push(pAx * dx + x0, pAy * dy + y0, pBx * dx + x0, pBy * dy + y0);
	                        }
	                        if (isOver[2] !== isOver[3]) {
	                            pBx = povar + (lineZValue - povarHeight[2]) / (povarHeight[3] - povarHeight[2]);
	                            pBy = iSubSpectra + 1;
	                            lines.push(pAx * dx + x0, pAy * dy + y0, pBx * dx + x0, pBy * dy + y0);
	                        }
	                    }
	                }
	            }
	        }
	        // console.timeEnd('generateContourLines');
	        return {
	            minX: zData.minX,
	            maxX: zData.maxX,
	            minY: zData.minY,
	            maxY: zData.maxY,
	            segments: contourLevels
	        };
	        //return contourLevels;
	    }


	    function addLowRes(spectra, options) {
	        var spectrum;
	        var averageX, averageY;
	        var targetNbPoints = options.lowRes;
	        var highResData;
	        for (var i = 0; i < spectra.length; i++) {
	            spectrum = spectra[i];
	            // we need to find the current higher resolution
	            if (spectrum.data.length > 0) {
	                highResData = spectrum.data[0];
	                for (var j = 1; j < spectrum.data.length; j++) {
	                    if (spectrum.data[j].length > highResData.length) {
	                        highResData = spectrum.data[j];
	                    }
	                }

	                if (targetNbPoints > (highResData.length / 2)) return;
	                var i, ii;
	                var lowResData = [];
	                var modulo = Math.ceil(highResData.length / (targetNbPoints * 2));
	                for (i = 0, ii = highResData.length; i < ii; i = i + 2) {
	                    if (i % modulo === 0) {
	                        lowResData.push(highResData[i], highResData[i + 1])
	                    }
	                }
	                spectrum.data.push(lowResData);
	            }
	        }
	    }

	    return convert;

	}

	var convert = getConverter();

	function JcampConverter(input, options, useWorker) {
	    if (typeof options === 'boolean') {
	        useWorker = options;
	        options = {};
	    }
	    if (useWorker) {
	        return postToWorker(input, options);
	    } else {
	        return convert(input, options);
	    }
	}

	var stamps = {},
	    worker;

	function postToWorker(input, options) {
	    if (!worker) {
	        createWorker();
	    }
	    return new Promise(function (resolve) {
	        var stamp = Date.now() + '' + Math.random();
	        stamps[stamp] = resolve;
	        worker.postMessage({stamp: stamp, input: input, options: options});
	    });
	}

	function createWorker() {
	    var workerURL = URL.createObjectURL(new Blob([
	        'var getConverter =' + getConverter.toString() + ';var convert = getConverter(); onmessage = function (event) { postMessage({stamp: event.data.stamp, output: convert(event.data.input, event.data.options)}); };'
	    ], {type: 'application/javascript'}));
	    worker = new Worker(workerURL);
	    URL.revokeObjectURL(workerURL);
	    worker.addEventListener('message', function (event) {
	        var stamp = event.data.stamp;
	        if (stamps[stamp]) {
	            stamps[stamp](event.data.output);
	        }
	    });
	}

	module.exports = {
	    convert: JcampConverter
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var SD = __webpack_require__(1);
	var PeakPicking = __webpack_require__(5);
	var JcampConverter=__webpack_require__(3);

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
	    //@TODO Implement fourierTransform filter
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
	    //@TODO Implement phaseCorrection filter
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

	/**
	 * @function toJcamp(options)
	 * This function creates a String that represents the given spectraData in the format JCAM-DX 5.0
	 * The X,Y data can be compressed using one of the methods described in: 
	 * "JCAMP-DX. A STANDARD FORMAT FOR THE EXCHANGE OF ION MOBILITY SPECTROMETRY DATA", 
	 *  http://www.iupac.org/publications/pac/pdf/2001/pdf/7311x1765.pdf
	 * @option encode: ['FIX','SQZ','DIF','DIFDUP','CVS','PAC'] (Default: 'FIX')
	 * @option yfactor: The YFACTOR. It allows to compress the data by removing digits from the ordinate. (Default: 1)
	 * @option type: ["NTUPLES", "SIMPLE"] (Default: "SIMPLE")
	 * @option keep: A set of user defined parameters of the given SpectraData to be stored in the jcamp.
	 * @example SD.toJcamp(spectraData,{encode:'DIFDUP',yfactor:0.01,type:"SIMPLE",keep:['#batchID','#url']});
	 */ 
	NMR.prototype.toJcamp=function(options) {
	     //@TODO Implement toJcamp filter
	     return "NOT ImplementED"
	}


	module.exports = NMR;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Implementation of the peak pickig method described by Cobas in:
	 * A new approach to improving automated analysis of proton NMR spectra
	 * through Global Spectral Deconvolution (GSD)
	 * http://www.spectroscopyeurope.com/images/stories/ColumnPDFs/TD_23_1.pdf
	 */
	var JAnalyzer = __webpack_require__(6);
	/*var LM = require('ml-curve-fitting');
	var Matrix = LM.Matrix;
	var math = Matrix.algebra;*/
	var GSD = __webpack_require__(7);
	var extend = __webpack_require__(35);

	var PeakPicking={
	    impurities:[],
	    maxJ:20,
	    defaultOptions:{nH:10,
	        clean:true,
	        realTop:false,
	        thresholdFactor:1,
	        compile:true,
	        integralFn:0,
	        optimize:true,
	        id:""
	    },

	    peakPicking:function(spectrum, optionsEx){
	        var options = extend({}, this.defaultOptions, optionsEx);

	        var i, j, nHi, sum;

	        var noiseLevel = Math.abs(spectrum.getNoiseLevel())*(options.thresholdFactor);

	        //console.log("noiseLevel "+noiseLevel);
	        var gsdOptions = extend({},
	            {noiseLevel: noiseLevel,
	                minMaxRatio:0.01,
	                broadRatio:0.0025,
	                smoothY:true,
	                nL:4,
	                sgOptions:{windowSize: 9, polynomial: 3}
	            },
	            options.gsdOptions);

	        var data = spectrum.getXYData();
	        var peakList = GSD.gsd(data[0],data[1], gsdOptions);
	        var peakList = GSD.post.joinBroadPeaks(peakList,{width:0.25});
	        if(options.optimize)
	            peakList = GSD.post.optimizePeaks(peakList,data[0],data[1],gsdOptions.nL,"lorentzian");

	        peakList = this.clearList(peakList, noiseLevel);
	        var signals = this.detectSignals(peakList, spectrum, options.nH, options.integralFn);
	        //console.log(JSON.stringify(signals));
	        //Remove all the signals with small integral
	        if(options.clean||false){
	            for(var i=signals.length-1;i>=0;i--){
	                if(signals[i].integralData.value<0.5) {
	                    signals.splice(i, 1);
	                }
	            }
	        }
	        if(options.compile||false){
	            for(i=0;i<signals.length;i++){
	                //console.log("Sum "+signals[i].integralData.value);
	                JAnalyzer.compilePattern(signals[i]);
	                //console.log(signals[i])
	                if(signals[i].maskPattern&&signals[i].multiplicity!="m"
	                    && signals[i].multiplicity!=""){
	                    //Create a new signal with the removed peaks
	                    nHi = 0;
	                    sum=0;
	                    var peaksO = [];
	                    for(j=signals[i].maskPattern.length-1;j>=0;j--){
	                        sum+=this.area(signals[i].peaks[j]);

	                        if(signals[i].maskPattern[j]===false) {
	                            var peakR = signals[i].peaks.splice(j,1)[0];
	                            peaksO.push({x:peakR.x, y:peakR.intensity, width:peakR.width});
	                            //peaksO.push(peakR);
	                            signals[i].mask.splice(j,1);
	                            signals[i].mask2.splice(j,1);
	                            signals[i].maskPattern.splice(j,1);
	                            signals[i].nbPeaks--;
	                            nHi+=this.area(peakR);
	                        }
	                    }
	                    if(peaksO.length>0){
	                        nHi=nHi*signals[i].integralData.value/sum;
	                        signals[i].integralData.value-=nHi;
	                        var peaks1 = [];
	                        for(var j=peaksO.length-1;j>=0;j--)
	                            peaks1.push(peaksO[j]);
	                        var newSignals = this.detectSignals(peaks1, spectrum, nHi, options.integralFn);

	                        for(j=0;j<newSignals.length;j++)
	                            signals.push(newSignals[j]);
	                    }
	                }
	            }
	            //console.log(signals);
	            this.updateIntegrals(signals, options.nH);
	        }
	        signals.sort(function(a,b){
	            return b.delta1- a.delta1
	        });
	        //Remove all the signals with small integral
	        if(options.clean||false){
	            for(var i=signals.length-1;i>=0;i--){
	                //console.log(signals[i]);
	                if(signals[i].integralData.value<0.5) {
	                    signals.splice(i, 1);
	                }
	            }
	        }

	        for(var i=0;i<signals.length;i++){
	            signals[i].signalID = options.id+"_"+(i+1);
	            signals[i]._highlight=[signals[i].signalID];
	        }

	        return signals;

	        /*var frequency = spectrum.observeFrequencyX();//getParamDouble("$BF1",400);
	        var imp = this.labelPeaks(peakList, solvent, frequency);
	        return [peakList,imp];
	        */
	        //return createSignals(peakList,nH);
	    },

	    clearList:function(peakList, threshold){
	        for(var i=peakList.length-1;i>=0;i--){
	            if(Math.abs(peakList[i].y)<threshold){
	                peakList.splice(i,1);
	            }
	        }
	        return peakList;
	    },


	    /**
	     * This method implements a non linear sampling of the spectrum. The point close to
	     * the critic points are more sampled than the other ones.
	     * @param spectrum
	     * @param peaks
	     * @param rowWise
	     */
	    sampling: function(spectrum, peaks, rowWise){
	        var i0, ie, ic,i, j,nbPoints;
	        var xy = []
	        if(i0>ie){
	            var tmp = i0;
	            i0 = ie;
	            ie = tmp;
	        }
	        //Non linear sampling for each peak.
	        for(i=0;i<peaks.length;i++){
	            var more = true;
	            var nL = 4;
	            while(more) {
	                i0 = spectrum.unitsToArrayPoint(peaks[i][0] - peaks[i][2] * nL);
	                ie = spectrum.unitsToArrayPoint(peaks[i][0] + peaks[i][2] * nL);
	                ic = spectrum.unitsToArrayPoint(peaks[i][0]);
	                if (i0 > ie) {
	                    tmp = i0;
	                    i0 = ie;
	                    ie = tmp;
	                }
	                i0 = i0 < 0 ? 0 : i0;
	                ie = ie >= spectrum.getNbPoints() ? spectrum.getNbPoints() - 1 : ie;

	                if (ie - i0 < 10) {
	                    for (j = i0; j <= ie; j++) {
	                        xy.push([spectrum.getX(j), spectrum.getY(j)]);
	                    }
	                    more = false;
	                }
	                else {
	                    xy.push([spectrum.getX(i0), spectrum.getY(i0)]);
	                    xy.push([spectrum.getX(ie), spectrum.getY(ie)]);
	                    if (nL > 0.5) {
	                        nL -= 0.5;
	                    }
	                    else {
	                        nL /= 2;
	                    }
	                }
	            }
	        }
	        //console.log(xy);
	        xy.sort(function(a,b){
	            return a[0]-b[0];
	        });
	        //console.log("XX "+xy.length);
	        var x=[],y=[];
	        var index =0;
	        if(rowWise){
	            x=[xy[0][0]],y=[xy[0][1]];
	            for(i=1;i<xy.length;i++){
	                if(x[index]!=xy[i][0]){
	                    x.push(xy[i][0]);
	                    y.push(xy[i][1]);
	                    index++;
	                }
	            }
	        }
	        else{
	            x=[[xy[0][0]]],y=[[xy[0][1]]];
	            for(i=1;i<xy.length;i++){
	                if(x[index][0]!=xy[i][0]){
	                    x.push([xy[i][0]]);
	                    y.push([xy[i][1]]);
	                    index++;
	                }
	            }
	        }
	        return [x,y];

	    },

	    getVector: function(spectrum, from, to, rowWise){
	        var i0 = spectrum.unitsToArrayPoint(from);
	        var ie = spectrum.unitsToArrayPoint(to);
	        var x = [];
	        var y = [];
	        if(i0>ie){
	            var tmp = i0;
	            i0 = ie;
	            ie = tmp;
	        }
	        i0=i0<0?0:i0;
	        ie=ie>=spectrum.getNbPoints()?spectrum.getNbPoints()-1:ie;
	        for(var i=i0;i<ie;i+=10){
	            if(rowWise){
	                y.push(spectrum.getY(i));
	                x.push(spectrum.getX(i));
	            }
	            else{
	                y.push([spectrum.getY(i)]);
	                x.push([spectrum.getX(i)]);
	            }
	        }
	        return [x,y];
	    },



	    updateLimits : function(signal){
	        if(signal.multiplicity!="m" && signal.multiplicity!=""){
	            //Remove the integral of the removed peaks
	            var peaksO = signal.peaks;
	            var nbPeaks0 = peaksO.length, index = 0, factor = 0, toRemove = 0;

	            for(var i=0;i<nbPeaks0;i++){
	                if(signal.maskPattern[i]===false)
	                    toRemove+=this.area(peaksO[i]);
	                factor+= this.area(peaksO[i]);
	            }
	            factor=signal.integralData.value/factor;
	            signal.integralData.value-=toRemove*factor;
	        }
	        return signal.integralData.value;
	    },

	    updateIntegrals : function(signals, nH){
	        var sumIntegral = 0,i,sumObserved=0;
	        for(i=0;i<signals.length;i++){
	            sumObserved+=Math.round(signals[i].integralData.value);
	        }
	        if(sumObserved!=nH){

	            sumIntegral=nH/sumObserved;
	            for(i=0;i<signals.length;i++){
	                signals[i].integralData.value*=sumIntegral;
	            }
	        }
	    },

	    /*
	     {
	     "nbPeaks":1,"multiplicity":"","units":"PPM","startX":3.43505,"assignment":"",
	     "pattern":"s","stopX":3.42282,"observe":400.08,"asymmetric":false,
	     "delta1":3.42752,
	     "integralData":{"to":3.43505,"value":590586504,"from":3.42282},
	     "nucleus":"1H",
	     "peaks":[{"intensity":60066147,"x":3.42752}]
	     }
	     */
	    detectSignals: function(peakList, spectrum, nH, integralType){

	        var frequency = spectrum.observeFrequencyX();
	        var signals = [];
	        var signal1D = {};
	        var prevPeak = {x:100000,y:0,width:0},peaks=null;
	        var rangeX = 16/frequency;//Peaks withing this range are considered to belongs to the same signal1D
	        var spectrumIntegral = 0,cs,sum, i,j;
	        //console.log("RangeX "+rangeX);
	        for(i=0;i<peakList.length;i++){
	            //console.log(peakList[i]);
	            if(Math.abs(peakList[i].x-prevPeak.x)>rangeX){
	                //console.log(typeof peakList[i].x+" "+typeof peakList[i].width);
	                signal1D = {"nbPeaks":1,"units":"PPM",
	                    "startX":peakList[i].x+peakList[i].width,
	                    "stopX":peakList[i].x-peakList[i].width,
	                    "multiplicity":"","pattern":"",
	                    "observe":frequency,"nucleus":"1H",
	                    "integralData":{"from":peakList[i].x-peakList[i].width*3,
	                                    "to":peakList[i].x+peakList[i].width*3
	                                    //"value":this.area(peakList[i])
	                    },
	                    "peaks":[]};
	                signal1D.peaks.push({x:peakList[i].x,"intensity":peakList[i].y, width:peakList[i].width});
	                signals.push(signal1D);
	                //spectrumIntegral+=this.area(peakList[i]);
	            }
	            else{
	                var tmp = peakList[i].x-peakList[i].width;
	                signal1D.stopX = Math.min(signal1D.stopX,tmp);
	                tmp = peakList[i].x+peakList[i].width;
	                signal1D.stopX = Math.max(signal1D.stopX,tmp);
	                signal1D.nbPeaks++;
	                signal1D.peaks.push({x:peakList[i].x,"intensity":peakList[i].y, width:peakList[i].width});
	                //signal1D.integralData.value+=this.area(peakList[i]);
	                signal1D.integralData.from = Math.min(signal1D.integralData.from, peakList[i].x-peakList[i].width*3);
	                signal1D.integralData.to = Math.max(signal1D.integralData.to,peakList[i].x+peakList[i].width*3);
	                //spectrumIntegral+=this.area(peakList[i]);
	            }
	            prevPeak = peakList[i];
	        }
	        //Normalize the integral to the normalization parameter and calculate cs
	        for(i=0;i<signals.length;i++){
	            peaks = signals[i].peaks;
	            var integral = signals[i].integralData;
	            cs = 0;
	            sum = 0;

	            for(var j=0;j<peaks.length;j++){
	                cs+=peaks[j].x*this.area(peaks[j]);//.intensity;
	                sum+=this.area(peaks[j]);
	            }
	            signals[i].delta1 = cs/sum;

	            if(integralType==0)
	                integral.value = sum;
	            else {
	                integral.value=spectrum.getArea(integral.from,integral.to);//*nH/spectrumIntegral;
	            }
	            spectrumIntegral+=integral.value;

	        }
	        for(var i=0;i<signals.length;i++){
	            //console.log(integral.value);
	            var integral = signals[i].integralData;
	            integral.value*=nH/spectrumIntegral;
	        }

	        return signals;
	    },

	    area: function(peak){
	        return Math.abs(peak.intensity*peak.width*1.57)//1.772453851);
	    },
	    /**
	     This function tries to determine which peaks belongs to common laboratory solvents
	     as trace impurities from DOI:10.1021/jo971176v. The only parameter of the table is
	     the solvent name.
	     */
	    labelPeaks:function(peakList, solvent, frequency){
	        var column = 0;
	        //console.log(this.impurities[0]);
	        for(column=4;column<this.impurities.length;column++){
	            //console.log("sss".contains);
	            if(this.impurities[0][column].indexOf(solvent)>=0){
	                break;
	            }
	        }
	        //console.log("labelPeaks "+column);
	        var nImpurities = this.impurities.length-1;
	        var nPeaks = peakList.length;
	        //Scores matrix
	        //console.log(nImpurities);
	        var scores = new Array(nImpurities);
	        var max = 0, diff=0, score=0;
	        var gamma = 0.2;//ppm
	        var impurityID=-1;
	        var prevImp = "";
	        var maxIntensity = 0,i;
	        for(var j=nPeaks-1;j>=0;j--){
	            if(peakList[j][1]>maxIntensity)
	                maxIntensity = peakList[j][1];
	        }

	        for(i=nImpurities-1;i>=0;i--){
	            if(this.impurities[i+1][0]!=prevImp){
	                impurityID++;
	                prevImp=this.impurities[i+1][0];
	            }

	            //impID, max, maxIndex, average
	            scores[i]=[impurityID,this.impurities[i+1][2],
	                this.impurities[i+1][3],0,[],0];
	            max = 0;
	            for(var j=nPeaks-1;j>=0;j--){
	                diff = 10000;//Big numnber
	                if(this.impurities[i+1][column]>0)
	                    diff = Math.abs(peakList[j][0]-this.impurities[i+1][column]);
	                if(diff<gamma*3){
	                    score=this.score(diff,gamma);
	                    if(score>max){
	                        max=score;
	                        scores[i][3]=max;
	                        scores[i][4]=[j];
	                    }
	                }
	            }
	        }
	        //Calculate the average score for each impurity set of signals
	        var prevIndex = -1, sum=0, count = 0;
	        var candidates=[];
	        var impuritiesPeaks = [];
	        var i=nImpurities-1;
	        while(i>=-1){
	            if(i==-1||scores[i][0]!=prevIndex&&prevIndex!=-1){
	                if(prevIndex!=-1){
	                    scores[i+1][5]=sum/count;
	                    //Now, lets chech the multiplicities
	                    if(scores[i+1][5]>0.9){
	                        //console.log(scores[i+1][0]+" SS ");
	                        score=this.updateScore(candidates, peakList, maxIntensity, frequency);
	                        if(score>0.9){
	                            //console.log(candidates);
	                            //TODO: Remove peaks and add it do impuritiesPeaks
	                            for(var j=0;j<candidates.length;j++){
	                                for(var k=candidates[j][4].length-1;k>=0;k--){
	                                    impuritiesPeaks.push(peakList[candidates[j][4][k]]);
	                                }
	                            }
	                        }
	                    }
	                }
	                if(i>=0){
	                    prevIndex=scores[i][0];
	                    sum=scores[i][3];
	                    count=1;
	                    candidates=[scores[i]];
	                }

	            }else{
	                prevIndex=scores[i][0];
	                candidates.push(scores[i]);
	                sum+=scores[i][3];
	                count++;
	            }
	            i--;
	        }
	        //console.log(impuritiesPeaks.length);

	        return impuritiesPeaks;
	    },
	    /**
	     Updates the score that a given impurity is present in the current spectrum. In this part I would expect
	     to have into account the multiplicity of the signal. Also the relative intensity of the signals.
	     THIS IS the KEY part of the algorithm!!!!!!!!!
	     */
	    updateScore:function(candidates, peakList, maxIntensity, frequency){
	        //You may do it to avoid this part.
	        //return 1;

	        //Check the multiplicity
	        var mul = "";
	        var j = 0,index, k, maxJppm=this.maxJ/frequency;
	        var min=0, indexMin=0, score=0;
	        for(var i=candidates.length-1;i>=0;i--){
	            mul = candidates[i][1];
	            j = candidates[i][2];
	            //console.log(candidates[i][4]);
	            index = candidates[i][4][0];
	            //console.log(peakList[index][0]+" "+mul+" "+j+" "+index);
	            //I guess we should try to identify the pattern in the nearby.
	            if(mul.indexOf("sep")>=0){
	                if(peakList[index][1]>maxIntensity*0.33){
	                    candidates.splice(i,1);//Not a candidate anymore.
	                }
	            }else{
	                if(mul.indexOf("s")>=0||mul.indexOf("X")>=0){
	                    k=index-1;
	                    min=peakList[index][1];
	                    indexMin=index;
	                    while(k>=0&&Math.abs(peakList[index][0]-peakList[k][0])<0.025){
	                        if(peakList[k][1]<min){
	                            min=peakList[k][1];
	                            indexMin=k;
	                        }
	                        k--;
	                    }
	                    k=index+1;
	                    while(k<peakList.length&&Math.abs(peakList[index][0]-peakList[k][0])<0.025){
	                        if(peakList[k][1]<min){
	                            min=peakList[k][1];
	                            indexMin=k;
	                        }
	                        k++;
	                    }
	                    candidates[i][4][0]=indexMin;
	                    score+=1;
	                }
	            }
	            if(mul.indexOf("d")>=0){
	                if(index>0&&index<peakList.length-1){
	                    var thisJ1 = Math.abs(Math.abs(peakList[index-1][0]-peakList[index][0])*frequency-j);
	                    var thisJ2 = Math.abs(Math.abs(peakList[index+1][0]-peakList[index][0])*frequency-j);
	                    var thisJ3 = Math.abs(Math.abs(peakList[index+1][0]-peakList[index-1][0])*frequency-j);
	                    if(thisJ1<2||thisJ2<2||thisJ3<2){
	                        if(thisJ1<thisJ2){
	                            if(thisJ1<thisJ3){
	                                candidates[i][4]=[index-1,index];
	                                score+=1;
	                            }
	                            else{
	                                candidates[i][4]=[index-1,index+1];
	                                score+=1;
	                            }
	                        }
	                        else{
	                            if(thisJ2<thisJ3){
	                                candidates[i][4]=[index,index+1];
	                                score+=1;
	                            }
	                            else{
	                                candidates[i][4]=[index-1,index+1];
	                                score+=1;
	                            }
	                        }
	                    }
	                }
	            }
	            if(mul.indexOf("t")>=0){
	                //console.log("here");
	                if(index>0&&index<peakList.length-1){
	                    var thisJ1 = Math.abs(Math.abs(peakList[index-1][0]-peakList[index][0])*frequency-j);
	                    var thisJ2 = Math.abs(Math.abs(peakList[index+1][0]-peakList[index][0])*frequency-j);
	                    var thisJ4 = Math.abs(Math.abs(peakList[index+1][0]-peakList[index+2][0])*frequency-j);
	                    //console.log("XX "+thisJ1+" "+thisJ2);
	                    if(thisJ1<2){
	                        candidates[i][4]=[index-1, index];
	                        score+=0.5;
	                    }
	                    if(thisJ2<2){
	                        candidates[i][4].push(index+1);
	                        score+=0.5;
	                    }
	                    if(thisJ3<2){
	                        candidates[i][4].push(index+2);
	                        score+=0.5;
	                    }

	                }
	            }
	            if(mul.indexOf("q")>=0){
	                if(index>1&&index<peakList.length-2){
	                    var thisJ1 = Math.abs(Math.abs(peakList[index-2][0]-peakList[index-1][0])*frequency-j);
	                    var thisJ2 = Math.abs(Math.abs(peakList[index-1][0]-peakList[index][0])*frequency-j);
	                    var thisJ3 = Math.abs(Math.abs(peakList[index+1][0]-peakList[index][0])*frequency-j);
	                    var thisJ4= Math.abs(Math.abs(peakList[index+2][0]-peakList[index+1][0])*frequency-j);
	                    if(thisJ1<2){
	                        candidates[i][4].push(index-2);
	                        score+=0.25;
	                    }
	                    if(thisJ2<2){
	                        candidates[i][4].push(index-1);
	                        score+=0.25;
	                    }
	                    if(thisJ3<2){
	                        candidates[i][4].push(index+1);
	                        score+=0.25;
	                    }
	                    if(thisJ4<2){
	                        candidates[i][4].push(index+2);
	                        score+=0.25;
	                    }
	                }
	            }


	        }

	        //console.log(score/candidates.length+ " -> "+candidates);
	        //Lets remove the candidates to be impurities.
	        //It would be equivalent to mark the peaks as valid again
	        if(score/candidates.length < 0.5){
	            for(var i=candidates.length-1;i>=0;i--){
	                candidates.splice(i,1);
	            }
	            return 0;
	        }
	        //Check the relative intensity
	        return 1;
	    },

	    score:function(value, gamma){
	        return Math.exp(-Math.pow(value/gamma,2)/2.0);
	    },
	    /**
	     This function joint all the nearby peaks into single signals. We may try to
	     determine the J-couplings and the multiplicity here.
	     */
	    createSignals:function(){

	    }

	}

	module.exports = PeakPicking;



/***/ },
/* 6 */
/***/ function(module, exports) {

	/**
	 * This library implements the J analyser described by Cobas et al in the paper:
	 * A two-stage approach to automatic determination of 1H NMR coupling constants
	 * Created by acastillo on 4/5/15.
	 */
	var JAnalyzer = {
	    pascalTriangle : [[0],[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1],[1,5,10,10,5,1],[1,6,15,20,15,6,1]],
	    patterns: ["s","d","t","q","quint","h","sept","o","n"],
	    symRatio : 1.5,
	    maxErrorIter1 : 2.5,//Hz
	    maxErrorIter2 : 1,//Hz
	    DEBUG : false,

	    /**
	     * The compilation process implements at the first stage a normalization procedure described by Golotvin et al.
	     * embedding in peak-component-counting method described by Hoyes et al.
	     * @param signal
	     */
	    compilePattern : function(signal){
	        if(this.DEBUG)console.log("Debugin...");

	        signal.multiplicity="m";//By default the multiplicity is massive
	        // 1.1 symmetrize
	        // It will add a set of peaks(signal.peaksComp) to the signal that will be used during
	        // the compilation process. The unit of those peaks will be in Hz
	        signal.symRank = this.symmetrizeChoiseBest(signal,this.maxErrorIter1,1);
	        signal.asymmetric = true;
	       // console.log(signal.delta1+" "+signal.symRank);
	        //Is the signal symmetric?
	        if(signal.symRank>=0.95&&signal.peaksComp.length<32){
	            if(this.DEBUG)console.log(signal.delta1+ " nbPeaks "+signal.peaksComp.length);
	            signal.asymmetric = false;
	            var i,j,min,max,k=1,P1,Jc=[],n2,maxFlagged;
	            //Loop over the possible number of coupling contributing to the multiplet
	            for(var n=0;n<9;n++){
	                if(this.DEBUG)console.log("Trying "+n+" couplings");
	                //1.2 Normalize. It makes a deep copy of the peaks before to modify them.
	                peaks = this.normalize(signal,n);
	                //signal.peaksCompX = peaks;
	                var validPattern = false;//It will change to true, when we find the good patter
	                //Lets check if the signal could be a singulet.
	                if(peaks.length == 1 && n === 0){
	                    validPattern=true;
	                }
	                else{
	                    if(peaks.length <= 1){
	                        continue;
	                    }
	                }
	                // 1.3 Establish a range for the Heights Hi [peaks.intensity*0.85,peaks.intensity*1.15];
	                var ranges = this.getRanges(peaks);
	                n2 = Math.pow(2,n);

	                if(this.DEBUG){
	                    console.log("ranges: "+JSON.stringify(ranges));
	                    console.log("Target sum: "+n2);
	                }

	                // 1.4 Find a combination of integer heights Hi, one from each Si, that sums to 2^n.
	                var heights = null;
	                while(!validPattern&&(heights = this.getNextCombination(ranges, n2))!==null){

	                    if(this.DEBUG){
	                        console.log("Possible pattern found with "+n+" couplings!!!");
	                        console.log(heights);
	                    }
	                    // 2.1 Number the components of the multiplet consecutively from 1 to 2n,
	                    //starting at peak 1
	                    var numbering = new Array(heights.length);
	                    k=1;
	                    for(i=0;i<heights.length;i++){
	                        numbering[i]=new Array(heights[i]);
	                        for(j=0;j<heights[i];j++){
	                            numbering[i][j]=k++;
	                        }
	                    }
	                    if(this.DEBUG){
	                        console.log("Numbering: "+JSON.stringify(numbering));
	                    }
	                    Jc = []; //The array to store the detected j-coupling
	                    // 2.2 Set j = 1; J1 = P2 - P1. Flag components 1 and 2 as accounted for.
	                    j=1;
	                    Jc.push(peaks[1].x-peaks[0].x);
	                    P1 = peaks[0].x;
	                    numbering[0].splice(0,1);//Flagged
	                    numbering[1].splice(0,1);//Flagged
	                    k=1;
	                    var nFlagged = 2;
	                    maxFlagged = Math.pow(2,n)-1;
	                    while(Jc.length<n&&nFlagged<maxFlagged&&k<peaks.length){
	                        if(this.DEBUG){
	                            console.log("New Jc"+JSON.stringify(Jc));
	                            console.log("Aval. numbering "+JSON.stringify(numbering));
	                        }
	                        // 4.1. Increment j. Set k to the number of the first unflagged component.
	                        j++;
	                        while(k<peaks.length&&numbering[k].length===0){
	                            k++;
	                        }
	                        if(k<peaks.length){
	                            // 4.2 Jj = Pk - P1.
	                            Jc.push(peaks[k].x-peaks[0].x);
	                            //Flag component k and, for each sum of the...
	                            numbering[k].splice(0,1);//Flageed
	                            nFlagged++;
	                            //Flag the other components of the multiplet
	                            for(var u=2;u<=j;u++){
	                                //TODO improve those loops
	                                var jSum = 0;
	                                for(i=0;i<u;i++){
	                                    jSum+=Jc[i];
	                                }
	                                for(i=1;i<numbering.length;i++){
	                                    //Maybe 0.25 Hz is too much?
	                                    if(Math.abs(peaks[i].x-(P1+jSum))<0.25){
	                                        numbering[i].splice(0,1);//Flageed
	                                        nFlagged++;
	                                        break;
	                                    }
	                                }
	                            }
	                        }
	                    }
	                    //Calculate the ideal patter by using the extracted j-couplings
	                    var pattern = this.idealPattern(Jc);
	                    //Compare the ideal pattern with the proposed intensities.
	                    // All the intensities have to match to accept the multiplet
	                    validPattern = true;
	                    for(i=0;i<pattern.length;i++){
	                        if(pattern[i].intensity != heights[i])
	                            validPattern = false;
	                    }
	                    //More verbosity of the process
	                    if(this.DEBUG){
	                        console.log("Jc "+JSON.stringify(Jc));
	                        console.log("Heights "+JSON.stringify(heights));
	                        console.log("pattern "+JSON.stringify(pattern));
	                        console.log("Valid? "+validPattern);
	                    }
	                }
	                //If we found a valid pattern we should inform about the pattern.
	                if(validPattern){
	                    this.updateSignal(signal,Jc);
	                }
	            }
	        }

	        //Before to return, change the units of peaksComp from Hz to PPM again
	        for(i=0;i<signal.peaksComp.length;i++){
	            signal.peaksComp[i].x/=signal.observe;
	        }
	    },

	    updateSignal : function(signal, Jc){
	        //Update the limits of the signal
	        var peaks = signal.peaksComp;//Always in Hz
	        var nbPeaks = peaks.length;
	        signal.startX=peaks[0].x/signal.observe+peaks[0].width;
	        signal.stopX=peaks[nbPeaks-1].x/signal.observe-peaks[nbPeaks-1].width;
	        signal.integralData.to=peaks[0].x/signal.observe+peaks[0].width*3;
	        signal.integralData.from=peaks[nbPeaks-1].x/signal.observe-peaks[nbPeaks-1].width*3;

	        //Compile the pattern and format the constant couplings
	        signal.maskPattern = signal.mask2;
	        signal.multiplicity = this.abstractPattern(signal,Jc);
	        signal.pattern=signal.multiplicity;//Our library depends on this parameter, but it is old
	        //console.log(signal);
	        if(this.DEBUG)
	            console.log("Final j-couplings: "+JSON.stringify(Jc));
	    },

	    /**
	     * Returns the multiplet in the compact format
	     */
	    abstractPattern : function(signal,Jc){
	        var tol = 0.05,i, pattern = "", cont = 1;
	        var newNmrJs = [];
	        if(Jc&&Jc.length>0){
	            Jc.sort(function(a,b){
	                return a-b;
	            });
	            for(i=0;i<Jc.length-1;i++){
	                if(Math.abs(Jc[i]-Jc[i+1])<tol){
	                    cont++;
	                }
	                else{
	                    newNmrJs.push({"coupling":Math.abs(Jc[i]),"multiplicity":this.patterns[cont]});
	                    pattern+=this.patterns[cont];
	                    cont=1;
	                }
	            }
	            newNmrJs.push({"coupling":Math.abs(Jc[i]),"multiplicity":this.patterns[cont]});
	            pattern+=this.patterns[cont];
	            signal.nmrJs =  newNmrJs;
	        }
	        else{
	            pattern="s";
	            if(Math.abs(signal.startX-signal.stopX)*signal.observe>16){
	                pattern="bs"
	            }
	        }
	        return pattern;
	    },

	    /**
	     *This function creates an ideal pattern from the given J-couplings
	     */
	    idealPattern : function(Jc){
	        var hsum = Math.pow(2,Jc.length),i,j;
	        var pattern = [{x:0,intensity:hsum}];
	        //To split the initial height
	        for(i=0;i<Jc.length;i++){
	            for(j=pattern.length-1;j>=0;j--){
	                pattern.push({x:pattern[j].x+Jc[i]/2,
	                    intensity:pattern[j].intensity/2});
	                pattern[j].x = pattern[j].x-Jc[i]/2;
	                pattern[j].intensity = pattern[j].intensity/2;
	            }
	        }
	        //To sum the heights in the same positions
	        pattern.sort(function compare(a,b) { return a.x-b.x});
	        for(j=pattern.length-2;j>=0;j--){
	            if(Math.abs(pattern[j].x-pattern[j+1].x)<0.1){
	                pattern[j].intensity+= pattern[j+1].intensity
	                pattern.splice(j+1,1);
	            }
	        }
	        return pattern;
	    },

	    /**
	     * Find a combination of integer heights Hi, one from each Si, that sums to 2n.
	     */
	    getNextCombination : function(ranges, value){
	        var half = Math.ceil(ranges.values.length/2), lng = ranges.values.length;
	        var sum = 0,i;
	        while(sum!=value){
	            //Update the indexes to point at the next possible combination
	            ok = false;
	            var leftIndex = 0;
	            while(!ok){
	                ok = true;
	                ranges.currentIndex[ranges.active]++;
	                if(ranges.currentIndex[ranges.active]>=ranges.values[ranges.active].length){
	                    //In this case, there is no more possible combinations
	                    if(ranges.active+1==half){
	                        return null;
	                    }
	                    else{
	                        //If this happens we need to try the next active peak
	                        ranges.currentIndex[ranges.active]=0;
	                        ok=false;
	                        ranges.active++;
	                    }
	                }
	                else{
	                    ranges.active=0;
	                }
	            }
	            // Sum the heights for this combination
	            sum=0;
	            for(i=0;i<half;i++){
	                sum+= ranges.values[i][ranges.currentIndex[i]]*2;
	            }
	            if(ranges.values.length%2!==0){
	                sum-= ranges.values[half-1][ranges.currentIndex[half-1]];
	            }
	            if(this.DEBUG){
	                console.log(ranges.currentIndex);
	                console.log(sum+" "+value);
	            }
	        }
	        //If the sum is equal to the expected value, fill the array to return
	        if(sum==value){
	            var heights = new Array(lng);
	            for(i=0;i<half;i++){
	                heights[i] = ranges.values[i][ranges.currentIndex[i]];
	                heights[lng-i-1] = ranges.values[i][ranges.currentIndex[i]];
	            }
	            return heights;
	        }
	        return null;
	    },

	    /**
	     * This function generates the possible values that each peak can contribute
	     * to the multiplet.
	     * @param peaks
	     * @returns {{values: Array, currentIndex: Array, active: number}}
	     */
	    getRanges : function(peaks){
	        var ranges = new Array(peaks.length);
	        var currentIndex = new Array(peaks.length);
	        var min,max;
	        ranges[0] = [1];
	        ranges[peaks.length-1] = [1];
	        currentIndex[0]=-1;
	        currentIndex[peaks.length-1] = 0;
	        for(var i=1;i<peaks.length-1;i++){
	            min = Math.round(peaks[i].intensity*0.85);
	            max = Math.round(peaks[i].intensity*1.15);
	            ranges[i] =[];
	            for(var j=min;j<=max;j++){
	                ranges[i].push(j);
	            }
	            currentIndex[i]=0;
	        }
	        return {values:ranges, currentIndex:currentIndex, active:0};
	    },
	    /**
	     * Performs a symmetrization of the signal by using different aproximations to the center.
	     * It will return the result of the symmetrization that removes less peaks from the signal
	     * @param signal
	     * @param maxError
	     * @param iteration
	     * @returns {*}
	     */
	    symmetrizeChoiseBest : function(signal,maxError,iteration){
	        var symRank1 = this.symmetrize(signal,maxError,iteration);
	        var tmpPeaks = signal.peaksComp;
	        var tmpMask = signal.mask;
	        var cs = signal.delta1;
	        signal.delta1 = (signal.peaks[0].x+signal.peaks[signal.peaks.length-1].x)/2;
	        var symRank2 = this.symmetrize(signal,maxError,iteration);
	        if(signal.peaksComp.length>tmpPeaks.length)
	            return symRank2;
	        else{
	            signal.delta1 = cs;
	            signal.peaksComp = tmpPeaks;
	            signal.mask = tmpMask;
	            return symRank1;
	        }

	    },
	    /**
	     * This function will return a set of symmetric peaks that will
	     * be the enter point for the patter compilation process.
	     */
	    symmetrize : function(signal, maxError, iteration){
	        //Before to symmetrize we need to keep only the peaks that possibly conforms the multiplete
	        var max, min, avg, ratio, avgWidth;
	        var peaks = new Array(signal.peaks.length);
	        //Make a deep copy of the peaks and convert PPM ot HZ
	        for(j=0;j<peaks.length;j++){
	            peaks[j]= {x:signal.peaks[j].x*signal.observe,
	                intensity:signal.peaks[j].intensity,
	                width:signal.peaks[j].width};
	        }
	        //Join the peaks that are closer than 0.25 Hz
	        for(j=peaks.length-2;j>=0;j--){
	            if(Math.abs(peaks[j].x-peaks[j+1].x)<0.25){
	                peaks[j].x = (peaks[j].x*peaks[j].intensity+peaks[j+1].x*peaks[j+1].intensity);
	                peaks[j].intensity = peaks[j].intensity+peaks[j+1].intensity;
	                peaks[j].x/=peaks[j].intensity;
	                peaks[j].intensity/=2;
	                peaks[j].width+=peaks[j+1].width;
	                peaks.splice(j+1,1);
	            }
	        }
	        signal.peaksComp = peaks;
	        var nbPeaks = peaks.length;
	        var mask = new Array(nbPeaks);
	        signal.mask = mask;
	        var left=0, right=peaks.length-1, cs = signal.delta1*signal.observe, middle = [(peaks[0].x+peaks[nbPeaks-1].x)/2,1];
	        maxError = this.error(Math.abs(cs-middle[0]));
	        var heightSum = 0;
	        //We try to symmetrize the extreme peaks. We consider as candidates for symmetricing those which have
	        //ratio smaller than 3
	        for(var i=0;i<nbPeaks;i++){
	            mask[i]= true;
	            heightSum+=signal.peaks[i].intensity;
	        }

	        while(left<=right){
	            mask[left] = true;
	            mask[right] = true;
	            if(left==right){
	                if(nbPeaks>2&&Math.abs(peaks[left].x-cs)>maxError){
	                    mask[left] = false;
	                }
	            }
	            else{
	                max = Math.max(peaks[left].intensity,peaks[right].intensity);
	                min = Math.min(peaks[left].intensity,peaks[right].intensity);
	                ratio = max/min;
	                if(ratio>this.symRatio){
	                    if(peaks[left].intensity==min){
	                        mask[left] = false;
	                        right++;
	                    }
	                    else{
	                        mask[right] = false;
	                        left--;
	                    }
	                }
	                else{
	                    var diffL = Math.abs(peaks[left].x-cs);
	                    var diffR = Math.abs(peaks[right].x-cs);

	                    if(Math.abs(diffL-diffR)<maxError){
	                        //avg = (peaks[left].intensity+peaks[right].intensity)/2;
	                        avg = Math.min(peaks[left].intensity,peaks[right].intensity);
	                        avgWidth = Math.min(peaks[left].width,peaks[right].width);
	                        peaks[left].intensity=peaks[right].intensity=avg;
	                        peaks[left].width=peaks[right].width=avgWidth;
	                        middle=[middle[0]+((peaks[right].x+peaks[left].x)/2), middle[1]+1];
	                    }
	                    else{
	                        if(Math.max(diffL,diffR)==diffR){
	                            mask[right] = false;
	                            left--;
	                        }
	                        else{
	                            mask[left] = false;
	                            right++;
	                        }
	                    }
	                    if(this.DEBUG){
	                        console.log("MaxError: "+maxError+" "+middle[0]+" "+middle[1]);
	                        console.log(iteration+" CS: "+cs+" Hz "+cs/signal.observe+" PPM");
	                        console.log("Middle: "+(middle[0]/middle[1])+" Hz "+(middle[0]/middle[1])/signal.observe+" PPM");
	                        console.log(diffL+ " "+diffR);
	                        console.log(Math.abs(diffL-diffR));
	                        console.log(JSON.stringify(peaks));
	                        console.log(JSON.stringify(mask));
	                    }
	                }
	            }
	            left++;
	            right--;
	            //Only alter cs if it is the first iteration of the sym process.
	            if(iteration==1){
	                cs = this.chemicalShift(peaks, mask);
	                //There is not more available peaks
	                if(isNaN(cs)){ return 0;}
	            }
	            maxError = this.error(Math.abs(cs-middle[0]/middle[1]));
	        }
	        //To remove the weak peaks and recalculate the cs
	        for(i=nbPeaks-1;i>=0;i--){
	            if(mask[i]===false){
	                peaks.splice(i,1);
	            }
	        }
	        cs = this.chemicalShift(peaks);
	        if(isNaN(cs)){ return 0;}
	        signal.delta1 = cs/signal.observe;
	        //Now, the peak should be symmetric in heights, but we need to know if it is symmetric in x
	        var symFactor = 0,weight = 0;
	        if(peaks.length>1){
	            for(i=Math.ceil(peaks.length/2)-1;i>=0;i--){
	                symFactor+=(3+Math.min(Math.abs(peaks[i].x-cs),Math.abs(peaks[peaks.length-1-i].x-cs)))
	                /(3+Math.max(Math.abs(peaks[i].x-cs),Math.abs(peaks[peaks.length-1-i].x-cs)))*peaks[i].intensity;
	                weight+=peaks[i].intensity;
	            }
	            symFactor/=weight;
	        }
	        else{
	            if(peaks.length==1)
	                symFactor=1;
	        }
	        var newSumHeights = 0;
	        for(i=0;i<peaks.length;i++){
	            newSumHeights+=peaks[i].intensity;
	        }
	        symFactor-=(heightSum-newSumHeights)/heightSum*0.12; //Removed peaks penalty
	        if(this.DEBUG){
	            console.log("Penalty "+(heightSum-newSumHeights)/heightSum*0.12);
	            console.log("cs: "+(cs/signal.observe)+" symFactor: "+symFactor);
	        }
	        //Sometimes we need a second opinion after the first symmetrization.
	        if(symFactor>0.8&&symFactor<0.97&&iteration<2){
	            return this.symmetrize(signal, this.maxErrorIter2, 2);
	        }{
	            //Center the given pattern at cs and symmetrize x
	            if(peaks.length>1) {
	                var weight = 0, dxi;
	                for (i = Math.ceil(peaks.length / 2) - 1; i >= 0; i--) {
	                    dxi = (peaks[i].x - peaks[peaks.length - 1 - i].x)/2.0;
	                    peaks[i].x =cs+dxi;
	                    peaks[peaks.length - 1 - i].x=cs-dxi;
	                }
	            }
	        }
	        return symFactor;
	    },

	    error : function(value){
	        var maxError = value*2.5;
	        if(maxError<0.75)
	            maxError = 0.75;
	        if(maxError > 3)
	            maxError = 3;
	        return maxError;
	    },
	    /**
	     * 2 stages normalizarion of the peaks heights to Math.pow(2,n).
	     * Creates a new mask with the peaks that could contribute to the multiplete
	     * @param signal
	     * @param n
	     * @returns {*}
	     */
	    normalize : function(signal, n){
	        //Perhaps this is slow
	        var peaks = JSON.parse(JSON.stringify(signal.peaksComp));
	        var norm = 0,norm2=0,i;//Math.pow(2,n);
	        for(i=0;i<peaks.length;i++){
	            norm+= peaks[i].intensity;
	        }
	        norm=Math.pow(2,n)/norm;
	        signal.mask2 = JSON.parse(JSON.stringify(signal.mask));
	        //console.log("Mask0 "+JSON.stringify(signal.mask2));
	        var index=signal.mask2.length-1;
	        for(i=peaks.length-1;i>=0;i--){
	            peaks[i].intensity*= norm;
	            while(index>=0&&signal.mask2[index]===false)
	                index--;
	            if(peaks[i].intensity<0.75){
	                if(this.DEBUG)
	                    console.log("Peak "+i+" does not seem to belong to this multiplet "+peaks[i].intensity);
	                peaks.splice(i,1);
	                signal.mask2[index]=false;
	            }
	            else{
	                norm2+= peaks[i].intensity;
	            }
	            index--;
	        }
	        norm2=Math.pow(2,n)/norm2;
	        for(i=peaks.length-1;i>=0;i--){
	            peaks[i].intensity*= norm2;
	        }
	        //console.log("Mask1 "+JSON.stringify(signal.mask2));
	        if(this.DEBUG) console.log(JSON.stringify(peaks));
	        return peaks;
	    },

	    /**
	     * Calculates the chemical shift as the weighted sum of the peaks
	     * @param peaks
	     * @param mask
	     * @returns {number}
	     */
	    chemicalShift : function(peaks, mask){
	        var sum=0,cs= 0, i, area;
	        if(mask){
	            for(i=0;i<peaks.length;i++){
	                //console.log(mask[i]);
	                if(mask[i]===true){
	                    area = this.area(peaks[i]);
	                    sum+=area;
	                    cs+=area*peaks[i].x;
	                }
	            }
	        }
	        else{
	            for(i=0;i<peaks.length;i++){
	                area = this.area(peaks[i]);
	                sum+=area;
	                cs+=area*peaks[i].x;
	            }
	        }
	        return cs/sum;
	    },

	    area: function(peak){
	        return Math.abs(peak.intensity*peak.width*1.57)//1.772453851);
	    }
	}

	module.exports = JAnalyzer;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	
	module.exports.post = __webpack_require__(8);
	module.exports.gsd = __webpack_require__(31);


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by acastillo on 9/6/15.
	 */
	var Opt = __webpack_require__(9);

	function sampleFunction(from, to, x, y, lastIndex){
	    var nbPoints = x.length;
	    var sampleX = [];
	    var sampleY = [];
	    var direction = Math.sign(x[1]-x[0]);//Direction of the derivative
	    if(direction==-1){
	        lastIndex[0]= x.length-1;
	    }

	    var delta = Math.abs(to-from)/2;
	    var mid = (from+to)/2;
	    var stop = false;
	    var index = lastIndex[0];
	    while(!stop&&index<nbPoints&&index>=0){
	        if(Math.abs(x[index]-mid)<=delta){
	            sampleX.push(x[index]);
	            sampleY.push(y[index]);
	            index+=direction;
	        }
	        //It is outside the range.
	        else{

	            if(Math.sign(mid-x[index])==1){
	                //We'll reach the mid going in the current direction
	                index+=direction;
	            }
	            else{
	                //There is not more peaks in the current range
	                stop=true;
	            }
	        }
	        //console.log(sampleX);
	    }
	    lastIndex[0]=index;
	    return [sampleX, sampleY];
	}

	function optimizePeaks(peakList,x,y,n, fnType){
	    var i, j, lastIndex=[0];
	    var groups = groupPeaks(peakList,n);
	    var result = [];
	    var factor = 1;
	    if(fnType=="gaussian")
	        factor = 1.17741;//From https://en.wikipedia.org/wiki/Gaussian_function#Properties
	    for(i=0;i<groups.length;i++){
	        var peaks = groups[i].group;
	        if(peaks.length>1){
	            //Multiple peaks
	            //console.log("Pending group of overlaped peaks "+peaks.length);
	            //console.log("here1");
	            //console.log(groups[i].limits);
	            var sampling = sampleFunction(groups[i].limits[0]-groups[i].limits[1],groups[i].limits[0]+groups[i].limits[1],x,y,lastIndex);
	            //console.log(sampling);
	            if(sampling[0].length>5){
	                var error = peaks[0].width/1000;
	                var opts = [  3,    100, error, error, error, error*10, error*10,    11,    9,        1 ];
	                //var gauss = Opt.optimizeSingleGaussian(sampling[0], sampling[1], opts, peaks);
	                var optPeaks = [];
	                if(fnType=="gaussian")
	                    optPeaks = Opt.optimizeGaussianSum(sampling, peaks, opts);
	                else{
	                    if(fnType=="lorentzian"){
	                        optPeaks = Opt.optimizeLorentzianSum(sampling, peaks, opts);
	                    }
	                }
	                //console.log(optPeak);
	                for(j=0;j<optPeaks.length;j++){
	                    result.push({x:optPeaks[j][0][0],y:optPeaks[j][1][0],width:optPeaks[j][2][0]*factor});
	                }
	            }
	        }
	        else{
	            //Single peak
	            peaks = peaks[0];
	            var sampling = sampleFunction(peaks.x-n*peaks.width,
	                peaks.x+n*peaks.width,x,y,lastIndex);
	            //console.log("here2");
	            //console.log(groups[i].limits);
	            if(sampling[0].length>5){
	                var error = peaks.width/1000;
	                var opts = [  3,    100, error, error, error, error*10, error*10,    11,    9,        1 ];
	                //var gauss = Opt.optimizeSingleGaussian(sampling[0], sampling[1], opts, peaks);
	                //var gauss = Opt.optimizeSingleGaussian([sampling[0],sampling[1]], peaks, opts);
	                var optPeak = [];
	                if(fnType=="gaussian")
	                    var optPeak = Opt.optimizeSingleGaussian([sampling[0],sampling[1]], peaks,  opts);
	                else{
	                    if(fnType=="lorentzian"){
	                        var optPeak = Opt.optimizeSingleLorentzian([sampling[0],sampling[1]], peaks,  opts);
	                    }
	                }
	                //console.log(optPeak);
	                result.push({x:optPeak[0][0],y:optPeak[1][0],width:optPeak[2][0]*factor}); // From https://en.wikipedia.org/wiki/Gaussian_function#Properties}
	            }
	        }

	    }
	    return result;
	}

	function groupPeaks(peakList,nL){
	    var group = [];
	    var groups = [];
	    var i, j;
	    var limits = [peakList[0].x,nL*peakList[0].width];
	    var upperLimit, lowerLimit;
	    //Merge forward
	    for(i=0;i<peakList.length;i++){
	        //If the 2 things overlaps
	        if(Math.abs(peakList[i].x-limits[0])<(nL*peakList[i].width+limits[1])){
	            //Add the peak to the group
	            group.push(peakList[i]);
	            //Update the group limits
	            upperLimit = limits[0]+limits[1];
	            if(peakList[i].x+nL*peakList[i].width>upperLimit){
	                upperLimit = peakList[i].x+nL*peakList[i].width;
	            }
	            lowerLimit = limits[0]-limits[1];
	            if(peakList[i].x-nL*peakList[i].width<lowerLimit){
	                lowerLimit = peakList[i].x-nL*peakList[i].width;
	            }
	            limits = [(upperLimit+lowerLimit)/2,Math.abs(upperLimit-lowerLimit)/2];

	        }
	        else{
	            groups.push({limits:limits,group:group});
	            //var optmimalPeak = fitSpectrum(group,limits,spectrum);
	            group=[peakList[i]];
	            limits = [peakList[i].x,nL*peakList[i].width];
	        }
	    }
	    groups.push({limits:limits,group:group});
	    //Merge backward
	    for(i =groups.length-2;i>=0;i--){
	        //The groups overlaps
	        if(Math.abs(groups[i].limits[0]-groups[i+1].limits[0])<
	            (groups[i].limits[1]+groups[i+1].limits[1])/2){
	            for(j=0;j<groups[i+1].group.length;j++){
	                groups[i].group.push(groups[i+1].group[j]);
	            }
	            upperLimit = groups[i].limits[0]+groups[i].limits[1];
	            if(groups[i+1].limits[0]+groups[i+1].limits[1]>upperLimit){
	                upperLimit = groups[i+1].limits[0]+groups[i+1].limits[1];
	            }
	            lowerLimit = groups[i].limits[0]-groups[i].limits[1];
	            if(groups[i+1].limits[0]-groups[i+1].limits[1]<lowerLimit){
	                lowerLimit = groups[i+1].limits[0]-groups[i+1].limits[1];
	            }
	            //console.log(limits);
	            groups[i].limits = [(upperLimit+lowerLimit)/2,Math.abs(upperLimit-lowerLimit)/2];

	            groups.splice(i+1,1);
	        }
	    }
	    return groups;
	}
	/**
	 * This function try to join the peaks that seems to belong to a broad signal in a single broad peak.
	 * @param peakList
	 * @param options
	 */
	function joinBroadPeaks(peakList, options){
	    var width = options.width;
	    var broadLines=[];
	    //Optimize the possible broad lines
	    var max=0, maxI=0,count=1;
	    var isPartOf = false;
	    for(var i=peakList.length-1;i>=0;i--){
	        if(peakList[i].soft){
	            broadLines.push(peakList.splice(i,1)[0]);
	        }
	    }
	    //Push a feak peak
	    broadLines.push({x:Number.MAX_VALUE});

	    var candidates = [[broadLines[0].x,
	                        broadLines[0].y]];
	    var indexes = [0];

	    for(var i=1;i<broadLines.length;i++){
	        //console.log(broadLines[i-1].x+" "+broadLines[i].x);
	        if(Math.abs(broadLines[i-1].x-broadLines[i].x)<width){
	            candidates.push([broadLines[i].x,broadLines[i].y]);
	            if(broadLines[i].y>max){
	                max = broadLines[i].y;
	                maxI = i;
	            }
	            indexes.push(i);
	            count++;
	        }
	        else{
	            if(count>2){
	                var fitted =  Opt.optimizeSingleLorentzian(candidates,
	                    {x: broadLines[maxI].x, y:max, width: Math.abs(candidates[0][0]-candidates[candidates.length-1][0])});
	                //console.log(fitted)
	                peakList.push({x:fitted[0][0],y:fitted[1][0],width:fitted[2][0],soft:false});

	            }
	            else{
	                //Put back the candidates to the signals list
	                indexes.map(function(index){peakList.push(broadLines[index])});
	            }
	            candidates = [[broadLines[i].x,broadLines[i].y]];
	            indexes = [i];
	            max = broadLines[i].y;
	            maxI = i;
	            count = 1;
	        }
	    }

	    peakList.sort(function (a, b) {
	        return a.x - b.x;
	    });

	    return peakList;

	}

	/*if(options.broadRatio>0){
	 var broadLines=[[Number.MAX_VALUE,0,0]];
	 //Optimize the possible broad lines
	 var max=0, maxI=0,count=0;
	 var candidates = [],broadLinesS=[];
	 var isPartOf = false;

	 for(var i=broadLines.length-1;i>0;i--){
	 //console.log(broadLines[i][0]+" "+rangeX+" "+Math.abs(broadLines[i-1][0]-broadLines[i][0]));
	 if(Math.abs(broadLines[i-1][0]-broadLines[i][0])<rangeX){

	 candidates.push(broadLines[i]);
	 if(broadLines[i][1]>max){
	 max = broadLines[i][1];
	 maxI = i;
	 }
	 count++;
	 }
	 else{
	 isPartOf = true;
	 if(count>30){ // TODO, an options ?
	 isPartOf = false;
	 //for(var j=0;j<signals.length;j++){
	 //    if(Math.abs(broadLines[maxI][0]-signals[j][0])<rangeX)
	 //       isPartOf = true;
	 //    }
	 //console.log("Was part of "+isPartOf);
	 }
	 if(isPartOf){
	 for(var j=0;j<candidates.length;j++){
	 signals.push([candidates[j][0], candidates[j][1], dx]);
	 }
	 }
	 else{
	 var fitted =  Opt.optimizeSingleLorentzian(candidates,{x:candidates[maxI][0],
	 width:Math.abs(candidates[0][0]-candidates[candidates.length-1][0])},
	 []);
	 //console.log(fitted);
	 signals.push([fitted[0][0],fitted[0][1],fitted[0][2]]);
	 }
	 candidates = [];
	 max = 0;
	 maxI = 0;
	 count = 0;
	 }
	 }
	 }*/

	module.exports={optimizePeaks:optimizePeaks,joinBroadPeaks:joinBroadPeaks};



/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var LM = __webpack_require__(10);
	var math = LM.Matrix.algebra;
	var Matrix = __webpack_require__(22);

	/**
	 * This function calculates the spectrum as a sum of lorentzian functions. The Lorentzian
	 * parameters are divided in 3 batches. 1st: centers; 2nd: heights; 3th: widths;
	 * @param t Ordinate values
	 * @param p Lorentzian parameters
	 * @param c Constant parameters(Not used)
	 * @returns {*}
	 */
	function sumOfLorentzians(t,p,c){
	    var nL = p.length/3,factor,i, j,p2, cols = t.rows;
	    var result = Matrix.zeros(t.length,1);

	    for(i=0;i<nL;i++){
	        p2 = Math.pow(p[i+nL*2][0]/2,2);
	        factor = p[i+nL][0]*p2;
	        for(j=0;j<cols;j++){
	            result[j][0]+=factor/(Math.pow(t[j][0]-p[i][0],2)+p2);
	        }
	    }
	    return result;
	}

	/**
	 * This function calculates the spectrum as a sum of gaussian functions. The Gaussian
	 * parameters are divided in 3 batches. 1st: centers; 2nd: height; 3th: std's;
	 * @param t Ordinate values
	 * @param p Gaussian parameters
	 * @param c Constant parameters(Not used)
	 * @returns {*}
	 */
	function sumOfGaussians(t,p,c){
	    var nL = p.length/3,factor,i, j, cols = t.rows;
	    var result = Matrix.zeros(t.length,1);

	    for(i=0;i<nL;i++){
	        factor = p[i+nL*2][0]*p[i+nL*2][0]/2;
	        for(j=0;j<cols;j++){
	            result[j][0]+=p[i+nL][0]*Math.exp(-(t[i][0]-p[i][0])*(t[i][0]-p[i][0])/factor);
	        }
	    }
	    return result;
	}
	/**
	 * Single 4 parameter lorentzian function
	 * @param t Ordinate values
	 * @param p Lorentzian parameters
	 * @param c Constant parameters(Not used)
	 * @returns {*}
	 */
	function singleLorentzian(t,p,c){
	    var factor = p[1][0]*Math.pow(p[2][0]/2,2);
	    var rows = t.rows;
	    var result = new Matrix(t.rows, t.columns);
	    for(var i=0;i<rows;i++){
	        result[i][0]=factor/(Math.pow(t[i][0]-p[0][0],2)+Math.pow(p[2][0]/2,2));
	    }
	    return result;
	}

	/**
	 * Single 3 parameter gaussian function
	 * @param t Ordinate values
	 * @param p Gaussian parameters [mean, height, std]
	 * @param c Constant parameters(Not used)
	 * @returns {*}
	 */
	function singleGaussian(t,p,c){
	    var factor2 = p[2][0]*p[2][0]/2;
	    var rows = t.rows;
	    var result = new Matrix(t.rows, t.columns);
	    for(var i=0;i<rows;i++){
	        result[i][0]=p[1][0]*Math.exp(-(t[i][0]-p[0][0])*(t[i][0]-p[0][0])/factor2);
	    }
	    return result;
	}

	/**
	 * * Fits a set of points to a Lorentzian function. Returns the center of the peak, the width at half height, and the height of the signal.
	 * @param data,[y]
	 * @returns {*[]}
	 */
	function optimizeSingleLorentzian(xy, peak, opts) {
	    var xy2 = parseData(xy);
	    var t = xy2[0];
	    var y_data = xy2[1];
	    var maxY = xy2[2];
	    var nbPoints = t.columns, i;

	    var weight = [nbPoints / Math.sqrt(y_data.dot(y_data))];

	    var opts=Object.create(opts || [  3,    100, 1e-3, 1e-3, 1e-3, 1e-2, 1e-2,    11,    9,        1 ]);
	    //var opts = [  3,    100, 1e-3, 1e-3, 1e-3, 1e-2, 1e-2,    11,    9,        1 ];
	    var consts = [ ];
	    var dt = Math.abs(t[0][0]-t[1][0]);// optional vector of constants
	    var dx = new Matrix([[-dt/10000],[-1e-3],[-dt/10000]]);//-Math.abs(t[0][0]-t[1][0])/100;
	    var p_init = new Matrix([[peak.x],[1],[peak.width]]);
	    var p_min = new Matrix([[peak.x-dt],[0.75],[peak.width/4]]);
	    var p_max = new Matrix([[peak.x+dt],[1.25],[peak.width*4]]);

	    var p_fit = LM.optimize(singleLorentzian,p_init,t,y_data,weight,dx,p_min,p_max,consts,opts);


	    p_fit = p_fit.p;
	    return [p_fit[0],[p_fit[1][0]*maxY],p_fit[2]];

	}

	/**
	 * Fits a set of points to a gaussian bell. Returns the mean of the peak, the std and the height of the signal.
	 * @param data,[y]
	 * @returns {*[]}
	 */
	function optimizeSingleGaussian(xy, peak, opts) {
	    var xy2 = parseData(xy);
	    var t = xy2[0];
	    var y_data = xy2[1];
	    var maxY = xy2[2];

	    var nbPoints = t.columns, i;

	    var weight = [nbPoints / Math.sqrt(y_data.dot(y_data))];

	    var opts=Object.create(opts || [  3,    100, 1e-3, 1e-3, 1e-3, 1e-2, 1e-2,    11,    9,        1 ]);
	    //var opts = [  3,    100, 1e-3, 1e-3, 1e-3, 1e-2, 1e-2,    11,    9,        1 ];
	    var consts = [ ];                         // optional vector of constants
	    var dt = Math.abs(t[0][0]-t[1][0]);
	    var dx = new Matrix([[-dt/10000],[-1e-3],[-dt/10000]]);//-Math.abs(t[0][0]-t[1][0])/100;

	    var dx = new Matrix([[-Math.abs(t[0][0]-t[1][0])/1000],[-1e-3],[-peak.width/1000]]);
	    var p_init = new Matrix([[peak.x],[1],[peak.width]]);
	    var p_min = new Matrix([[peak.x-dt],[0.75],[peak.width/4]]);
	    var p_max = new Matrix([[peak.x+dt],[1.25],[peak.width*4]]);
	    //var p_min = new Matrix([[peak.x-peak.width/4],[0.75],[peak.width/3]]);
	    //var p_max = new Matrix([[peak.x+peak.width/4],[1.25],[peak.width*3]]);

	    var p_fit = LM.optimize(singleGaussian,p_init,t,y_data,weight,dx,p_min,p_max,consts,opts);
	    p_fit = p_fit.p;
	    return [p_fit[0],[p_fit[1][0]*maxY],p_fit[2]];
	}


	/**
	 *
	 * @param xy A two column matrix containing the x and y data to be fitted
	 * @param group A set of initial lorentzian parameters to be optimized [center, heigth, half_width_at_half_height]
	 * @returns {Array} A set of final lorentzian parameters [center, heigth, hwhh*2]
	 */
	function optimizeLorentzianSum(xy, group, opts){
	    var xy2 = parseData(xy);
	    var t = xy2[0];
	    var y_data = xy2[1];
	    var maxY = xy2[2];
	    var nbPoints = t.columns, i;

	    var weight = [nbPoints / math.sqrt(y_data.dot(y_data))];
	    var opts=Object.create(opts || [  3,    100, 1e-3, 1e-3, 1e-3, 1e-2, 1e-2,    11,    9,        1 ]);
	    var consts = [ ];// optional vector of constants

	    var nL = group.length;
	    var p_init = new Matrix(nL*3,1);
	    var p_min =  new Matrix(nL*3,1);
	    var p_max =  new Matrix(nL*3,1);
	    var dx = new Matrix(nL*3,1);
	    var dt = Math.abs(t[0][0]-t[1][0]);
	    for( i=0;i<nL;i++){
	        p_init[i][0] = group[i].x;
	        p_init[i+nL][0] = 1;
	        p_init[i+2*nL][0] = group[i].width;

	        p_min[i][0] = group[i].x-dt;//-group[i].width/4;
	        p_min[i+nL][0] = 0;
	        p_min[i+2*nL][0] = group[i].width/4;

	        p_max[i][0] = group[i].x+dt;//+group[i].width/4;
	        p_max[i+nL][0] = 1.5;
	        p_max[i+2*nL][0] = group[i].width*4;

	        dx[i][0] = -dt/1000;
	        dx[i+nL][0] = -1e-3;
	        dx[i+2*nL][0] = -dt/1000;
	    }

	    var dx = -Math.abs(t[0][0]-t[1][0])/10000;
	    var p_fit = LM.optimize(sumOfLorentzians, p_init, t, y_data, weight, dx, p_min, p_max, consts, opts);
	    p_fit=p_fit.p;
	    //Put back the result in the correct format
	    var result = new Array(nL);
	    for( i=0;i<nL;i++){
	        result[i]=[p_fit[i],[p_fit[i+nL][0]*maxY],p_fit[i+2*nL]];
	    }

	    return result;

	}

	/**
	 *
	 * @param xy A two column matrix containing the x and y data to be fitted
	 * @param group A set of initial lorentzian parameters to be optimized [center, heigth, half_width_at_half_height]
	 * @returns {Array} A set of final lorentzian parameters [center, heigth, hwhh*2]
	 */
	function optimizeGaussianSum(xy, group, opts){
	    var xy2 = parseData(xy);
	    var t = xy2[0];
	    var y_data = xy2[1];
	    var maxY = xy2[2];
	    var nbPoints = t.rows,i;

	    var weight = new Matrix(nbPoints,1);//[nbPoints / math.sqrt(y_data.dot(y_data))];
	    var k = nbPoints / math.sqrt(y_data.dot(y_data));
	    for(i=0;i<nbPoints;i++){
	        weight[i][0]=k;///(y_data[i][0]);
	        //weight[i][0]=k*(2-y_data[i][0]);
	    }

	    var opts=Object.create(opts || [  3,    100, 1e-3, 1e-3, 1e-3, 1e-2, 1e-2,    11,    9,        2 ]);
	    //var opts=[  3,    100, 1e-5, 1e-6, 1e-6, 1e-6, 1e-6,    11,    9,        1 ];
	    var consts = [ ];// optional vector of constants

	    var nL = group.length;
	    var p_init = new Matrix(nL*3,1);
	    var p_min =  new Matrix(nL*3,1);
	    var p_max =  new Matrix(nL*3,1);
	    var dx = new Matrix(nL*3,1);
	    var dt = Math.abs(t[0][0]-t[1][0]);
	    for( i=0;i<nL;i++){
	        p_init[i][0] = group[i].x;
	        p_init[i+nL][0] = group[i].y/maxY;
	        p_init[i+2*nL][0] = group[i].width;

	        p_min[i][0] = group[i].x-dt;
	        p_min[i+nL][0] = group[i].y*0.8/maxY;
	        p_min[i+2*nL][0] = group[i].width/2;

	        p_max[i][0] = group[i].x+dt;
	        p_max[i+nL][0] = group[i].y*1.2/maxY;
	        p_max[i+2*nL][0] = group[i].width*2;

	        dx[i][0] = -dt/1000;
	        dx[i+nL][0] = -1e-3;
	        dx[i+2*nL][0] = -dt/1000;
	    }
	    //console.log(t);
	    var p_fit = LM.optimize(sumOfLorentzians,p_init,t,y_data,weight,dx,p_min,p_max,consts,opts);
	    p_fit = p_fit.p;
	    //Put back the result in the correct format
	    var result = new Array(nL);
	    for( i=0;i<nL;i++){
	        result[i]=[p_fit[i],[p_fit[i+nL][0]*maxY],p_fit[i+2*nL]];
	    }

	    return result;

	}
	/**
	 *
	 * Converts the given input to the required x, y column matrices. y data is normalized to max(y)=1
	 * @param xy
	 * @returns {*[]}
	 */
	function parseData(xy){
	    var nbSeries = xy.length;
	    var t = null;
	    var y_data = null, x,y;
	    var maxY = 0, i,j;

	    if(nbSeries==2){
	        //Looks like row wise matrix [x,y]
	        var nbPoints = xy[0].length;
	        if(nbPoints<3)
	            throw new SizeException(nbPoints);
	        else{
	            t = new Matrix(nbPoints,1);
	            y_data = new Matrix(nbPoints,1);
	            x = xy[0];
	            y = xy[1];
	            if(typeof x[0] === "number"){
	                for(i=0;i<nbPoints;i++){
	                    t[i][0]=x[i];
	                    y_data[i][0]=y[i];
	                    if(y[i]>maxY)
	                        maxY = y[i];
	                }
	            }
	            else{
	                //It is a colum matrix
	                if(typeof x[0] === "object"){
	                    for(i=0;i<nbPoints;i++){
	                        t[i][0]=x[i][0];
	                        y_data[i][0]=y[i][0];
	                        if(y[i][0]>maxY)
	                            maxY = y[i][0];
	                    }
	                }

	            }

	        }
	    }
	    else{
	        //Looks like a column wise matrix [[x],[y]]
	        var nbPoints = nbSeries;
	        if(nbPoints<3)
	            throw new SizeException(nbPoints);
	        else {
	            t = new Matrix(nbPoints, 1);
	            y_data = new Matrix(nbPoints, 1);
	            for (i = 0; i < nbPoints; i++) {
	                t[i][0] = xy[i][0];
	                y_data[i][0] = xy[i][1];
	                if(y_data[i][0]>maxY)
	                    maxY = y_data[i][0];
	            }
	        }
	    }
	    for (i = 0; i < nbPoints; i++) {
	        y_data[i][0]/=maxY;
	    }
	    return [t,y_data,maxY];
	}

	function sizeException(nbPoints) {
	    return new RangeError("Not enough points to perform the optimization: "+nbPoints +"< 3");
	}

	module.exports.optimizeSingleLorentzian = optimizeSingleLorentzian;
	module.exports.optimizeLorentzianSum = optimizeLorentzianSum;
	module.exports.optimizeSingleGaussian = optimizeSingleGaussian;
	module.exports.optimizeGaussianSum = optimizeGaussianSum;
	module.exports.singleGaussian = singleGaussian;
	module.exports.singleLorentzian = singleLorentzian;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(11);
	module.exports.Matrix = __webpack_require__(12);
	module.exports.Matrix.algebra = __webpack_require__(21);


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by acastillo on 8/5/15.
	 */
	var Matrix = __webpack_require__(12);
	var math = __webpack_require__(21);

	var DEBUG = false;
	/** Levenberg Marquardt curve-fitting: minimize sum of weighted squared residuals
	 ----------  INPUT  VARIABLES  -----------
	 func   = function of n independent variables, 't', and m parameters, 'p',
	 returning the simulated model: y_hat = func(t,p,c)
	 p      = n-vector of initial guess of parameter values
	 t      = m-vectors or matrix of independent variables (used as arg to func)
	 y_dat  = m-vectors or matrix of data to be fit by func(t,p)
	 weight = weighting vector for least squares fit ( weight >= 0 ) ...
	 inverse of the standard measurement errors
	 Default:  sqrt(d.o.f. / ( y_dat' * y_dat ))
	 dp     = fractional increment of 'p' for numerical derivatives
	 dp(j)>0 central differences calculated
	 dp(j)<0 one sided 'backwards' differences calculated
	 dp(j)=0 sets corresponding partials to zero; i.e. holds p(j) fixed
	 Default:  0.001;
	 p_min  = n-vector of lower bounds for parameter values
	 p_max  = n-vector of upper bounds for parameter values
	 c      = an optional matrix of values passed to func(t,p,c)
	 opts   = vector of algorithmic parameters
	 parameter    defaults    meaning
	 opts(1)  =  prnt            3        >1 intermediate results; >2 plots
	 opts(2)  =  MaxIter      10*Npar     maximum number of iterations
	 opts(3)  =  epsilon_1       1e-3     convergence tolerance for gradient
	 opts(4)  =  epsilon_2       1e-3     convergence tolerance for parameters
	 opts(5)  =  epsilon_3       1e-3     convergence tolerance for Chi-square
	 opts(6)  =  epsilon_4       1e-2     determines acceptance of a L-M step
	 opts(7)  =  lambda_0        1e-2     initial value of L-M paramter
	 opts(8)  =  lambda_UP_fac   11       factor for increasing lambda
	 opts(9)  =  lambda_DN_fac    9       factor for decreasing lambda
	 opts(10) =  Update_Type      1       1: Levenberg-Marquardt lambda update
	 2: Quadratic update
	 3: Nielsen's lambda update equations

	 ----------  OUTPUT  VARIABLES  -----------
	 p       = least-squares optimal estimate of the parameter values
	 X2      = Chi squared criteria
	 sigma_p = asymptotic standard error of the parameters
	 sigma_y = asymptotic standard error of the curve-fit
	 corr    = correlation matrix of the parameters
	 R_sq    = R-squared cofficient of multiple determination
	 cvg_hst = convergence history

	 Henri Gavin, Dept. Civil & Environ. Engineering, Duke Univ. 22 Sep 2013
	 modified from: http://octave.sourceforge.net/optim/function/leasqr.html
	 using references by
	 Press, et al., Numerical Recipes, Cambridge Univ. Press, 1992, Chapter 15.
	 Sam Roweis       http://www.cs.toronto.edu/~roweis/notes/lm.pdf
	 Manolis Lourakis http://www.ics.forth.gr/~lourakis/levmar/levmar.pdf
	 Hans Nielson     http://www2.imm.dtu.dk/~hbn/publ/TR9905.ps
	 Mathworks        optimization toolbox reference manual
	 K. Madsen, H.B., Nielsen, and O. Tingleff
	 http://www2.imm.dtu.dk/pubdb/views/edoc_download.php/3215/pdf/imm3215.pdf
	 */
	var LM = {

	    optimize: function(func,p,t,y_dat,weight,dp,p_min,p_max,c,opts){

	        var tensor_parameter = 0;			// set to 1 of parameter is a tensor

	        var iteration  = 0;			// iteration counter
	        //func_calls = 0;			// running count of function evaluations

	        if((typeof p[0])!="object"){
	            for(var i=0;i< p.length;i++){
	                p[i]=[p[i]];
	            }

	        }
	        //p = p(:); y_dat = y_dat(:);		// make column vectors
	        var i,k;
	        var eps = 2^-52;
	        var Npar   = p.length;//length(p); 			// number of parameters
	        var Npnt   = y_dat.length;//length(y_dat);		// number of data points
	        var p_old  = Matrix.zeros(Npar,1);		// previous set of parameters
	        var y_old  = Matrix.zeros(Npnt,1);		// previous model, y_old = y_hat(t;p_old)
	        var X2     = 1e-2/eps;			// a really big initial Chi-sq value
	        var X2_old = 1e-2/eps;			// a really big initial Chi-sq value
	        var J =  Matrix.zeros(Npnt,Npar);


	        if (t.length != y_dat.length) {
	            console.log('lm.m error: the length of t must equal the length of y_dat');

	            length_t = t.length;
	            length_y_dat = y_dat.length;
	            var X2 = 0, corr = 0, sigma_p = 0, sigma_y = 0, R_sq = 0, cvg_hist = 0;
	            if (!tensor_parameter) {
	                return;
	            }
	        }

	        weight = weight||Math.sqrt((Npnt-Npar+1)/(math.multiply(math.transpose(y_dat),y_dat)));
	        dp = dp || 0.001;
	        p_min   = p_min || math.multiply(Math.abs(p),-100);
	        p_max   = p_max || math.multiply(Math.abs(p),100);
	        c = c || 1;
	        // Algorithmic Paramters
	        //prnt MaxIter  eps1  eps2  epx3  eps4  lam0  lamUP lamDN UpdateType
	        opts = opts ||[  3,10*Npar, 1e-3, 1e-3, 1e-3, 1e-2, 1e-2, 11, 9, 1 ];

	        var prnt          = opts[0];	// >1 intermediate results; >2 plots
	        var MaxIter       = opts[1];	// maximum number of iterations
	        var epsilon_1     = opts[2];	// convergence tolerance for gradient
	        var epsilon_2     = opts[3];	// convergence tolerance for parameter
	        var epsilon_3     = opts[4];	// convergence tolerance for Chi-square
	        var epsilon_4     = opts[5];	// determines acceptance of a L-M step
	        var lambda_0      = opts[6];	// initial value of damping paramter, lambda
	        var lambda_UP_fac = opts[7];	// factor for increasing lambda
	        var lambda_DN_fac = opts[8];	// factor for decreasing lambda
	        var Update_Type   = opts[9];	// 1: Levenberg-Marquardt lambda update
	        // 2: Quadratic update
	        // 3: Nielsen's lambda update equations

	        if ( tensor_parameter && prnt == 3 ) prnt = 2;


	        if(!dp.length || dp.length == 1){
	            var dp_array = new Array(Npar);
	            for(var i=0;i<Npar;i++)
	                dp_array[i]=[dp];
	            dp=dp_array;
	        }

	        // indices of the parameters to be fit
	        var idx   = [];
	        for(i=0;i<dp.length;i++){
	            if(dp[i][0]!=0){
	                idx.push(i);
	            }
	        }

	        var Nfit = idx.length;			// number of parameters to fit
	        var stop = false;				// termination flag

	        var weight_sq = null;
	        //console.log(weight);
	        if ( !weight.length || weight.length < Npnt )	{
	            // squared weighting vector
	            //weight_sq = ( weight(1)*ones(Npnt,1) ).^2;
	            //console.log("weight[0] "+typeof weight[0]);
	            var tmp = math.multiply(Matrix.ones(Npnt,1),weight[0]);
	            weight_sq = math.dotMultiply(tmp,tmp);
	        }
	        else{
	            //weight_sq = (weight(:)).^2;
	            weight_sq = math.dotMultiply(weight,weight);
	        }


	        // initialize Jacobian with finite difference calculation
	        //console.log("J "+weight_sq);
	        var result = this.lm_matx(func,t,p_old,y_old,1,J,p,y_dat,weight_sq,dp,c);
	        var JtWJ = result.JtWJ,JtWdy=result.JtWdy,X2=result.Chi_sq,y_hat=result.y_hat,J=result.J;
	        //[JtWJ,JtWdy,X2,y_hat,J] = this.lm_matx(func,t,p_old,y_old,1,J,p,y_dat,weight_sq,dp,c);
	        //console.log(JtWJ);

	        if ( Math.max(Math.abs(JtWdy)) < epsilon_1 ){
	            console.log(' *** Your Initial Guess is Extremely Close to Optimal ***')
	            console.log(' *** epsilon_1 = ', epsilon_1);
	            stop = true;
	        }


	        switch(Update_Type){
	            case 1: // Marquardt: init'l lambda
	                lambda  = lambda_0;
	                break;
	            default:    // Quadratic and Nielsen
	                lambda  = lambda_0 * Math.max(math.diag(JtWJ));
	                nu=2;
	        }
	        //console.log(X2);
	        X2_old = X2; // previous value of X2
	        //console.log(MaxIter+" "+Npar);
	        //var cvg_hst = Matrix.ones(MaxIter,Npar+3);		// initialize convergence history
	        var h = null;
	        while ( !stop && iteration <= MaxIter ) {		// --- Main Loop
	            iteration = iteration + 1;
	            // incremental change in parameters
	            switch(Update_Type){
	                case 1:					// Marquardt
	                    //h = ( JtWJ + lambda * math.diag(math.diag(JtWJ)) ) \ JtWdy;
	                    //h = math.multiply(math.inv(JtWdy),math.add(JtWJ,math.multiply(lambda,math.diag(math.diag(Npar)))));
	                    h = math.solve(math.add(JtWJ,math.multiply(math.diag(math.diag(JtWJ)),lambda)),JtWdy);
	                    break;
	                default:					// Quadratic and Nielsen
	                    //h = ( JtWJ + lambda * math.eye(Npar) ) \ JtWdy;

	                    h = math.solve(math.add(JtWJ,math.multiply( Matrix.eye(Npar),lambda)),JtWdy);
	            }

	            /*for(var k=0;k< h.length;k++){
	             h[k]=[h[k]];
	             }*/
	            //console.log("h "+h);
	            //h=math.matrix(h);
	            //  big = max(abs(h./p)) > 2;
	            //this is a big step
	            // --- Are parameters [p+h] much better than [p] ?
	            var hidx = new Array(idx.length);
	            for(k=0;k<idx.length;k++){
	                hidx[k]=h[idx[k]];
	            }
	            var p_try = math.add(p, hidx);// update the [idx] elements

	            for(k=0;k<p_try.length;k++){
	                p_try[k][0]=Math.min(Math.max(p_min[k][0],p_try[k][0]),p_max[k][0]);
	            }
	            // p_try = Math.min(Math.max(p_min,p_try),p_max);           // apply constraints

	            var delta_y = math.subtract(y_dat, func(t,p_try,c));       // residual error using p_try
	            //func_calls = func_calls + 1;
	            //X2_try = delta_y' * ( delta_y .* weight_sq );  // Chi-squared error criteria

	            var X2_try = math.multiply(math.transpose(delta_y),math.dotMultiply(delta_y,weight_sq));

	            if ( Update_Type == 2 ){  			  // Quadratic
	                //    One step of quadratic line update in the h direction for minimum X2
	                //var alpha =  JtWdy'*h / ( (X2_try - X2)/2 + 2*JtWdy'*h ) ;
	                var JtWdy_th = math.multiply(math.transpose(JtWdy),h);
	                var alpha =  math.multiply(JtWdy_th,math.inv(math.add(math.multiply(math.subtract(X2_try - X2),1/2)),math.multiply(JtWdy_th,2)));//JtWdy'*h / ( (X2_try - X2)/2 + 2*JtWdy'*h ) ;

	                h = math.multiply(alpha, h);
	                for(var k=0;k<idx.length;k++){
	                    hidx[k]=h[idx[k]];
	                }

	                p_try = math.add(p ,hidx);                     // update only [idx] elements
	                p_try = math.min(math.max(p_min,p_try),p_max);          // apply constraints

	                delta_y = math.subtract(y_dat, func(t,p_try,c));      // residual error using p_try
	                // func_calls = func_calls + 1;
	                //X2_try = delta_y' * ( delta_y .* weight_sq ); // Chi-squared error criteria
	                X2_try = math.multiply(math.transpose(delta_y), mat.dotMultiply(delta_y, weight_sq));
	            }

	            //rho = (X2 - X2_try) / ( 2*h' * (lambda * h + JtWdy) ); // Nielsen
	            var rho = (X2-X2_try)/math.multiply(math.multiply(math.transpose(h),2),math.add(math.multiply(lambda, h),JtWdy));
	            //console.log("rho "+rho);
	            if ( rho > epsilon_4 ) {		// it IS significantly better
	                //console.log("Here");
	                dX2 = X2 - X2_old;
	                X2_old = X2;
	                p_old = p;
	                y_old = y_hat;
	                p = p_try;			// accept p_try

	                result = this.lm_matx(func, t, p_old, y_old, dX2, J, p, y_dat, weight_sq, dp, c);
	                JtWJ = result.JtWJ,JtWdy=result.JtWdy,X2=result.Chi_sq,y_hat=result.y_hat,J=result.J;
	                // decrease lambda ==> Gauss-Newton method

	                switch (Update_Type) {
	                    case 1:							// Levenberg
	                        lambda = Math.max(lambda / lambda_DN_fac, 1.e-7);
	                        break;
	                    case 2:							// Quadratic
	                        lambda = Math.max(lambda / (1 + alpha), 1.e-7);
	                        break;
	                    case 3:							// Nielsen
	                        lambda = math.multiply(Math.max(1 / 3, 1 - (2 * rho - 1) ^ 3),lambda);
	                        nu = 2;
	                        break;
	                }
	            }
	            else {					// it IS NOT better
	                X2 = X2_old;			// do not accept p_try
	                if (iteration%(2 * Npar)==0) {	// rank-1 update of Jacobian
	                    result = this.lm_matx(func, t, p_old, y_old, -1, J, p, y_dat, weight_sq, dp, c);
	                    JtWJ = result.JtWJ,JtWdy=result.JtWdy,dX2=result.Chi_sq,y_hat=result.y_hat,J=result.J;
	                }

	                // increase lambda  ==> gradient descent method
	                switch (Update_Type) {
	                    case 1:							// Levenberg
	                        lambda = Math.min(lambda * lambda_UP_fac, 1.e7);
	                        break;
	                    case 2:							// Quadratic
	                        lambda = lambda + Math.abs((X2_try - X2) / 2 / alpha);
	                        break;
	                    case 3:						// Nielsen
	                        lambda = lambda * nu;
	                        nu = 2 * nu;
	                        break;
	                }
	            }
	        }// --- End of Main Loop

	        // --- convergence achieved, find covariance and confidence intervals

	        // equal weights for paramter error analysis
	        weight_sq = math.multiply(math.multiply(math.transpose(delta_y),delta_y), Matrix.ones(Npnt,1));

	        weight_sq.apply(function(i,j){
	            weight_sq[i][j] = (Npnt-Nfit+1)/weight_sq[i][j];
	        });
	        //console.log(weight_sq);
	        result = this.lm_matx(func,t,p_old,y_old,-1,J,p,y_dat,weight_sq,dp,c);
	        JtWJ = result.JtWJ,JtWdy=result.JtWdy,X2=result.Chi_sq,y_hat=result.y_hat,J=result.J;

	        /*if nargout > 2				// standard error of parameters
	         covar = inv(JtWJ);
	         sigma_p = sqrt(diag(covar));
	         end

	         if nargout > 3				// standard error of the fit
	         //  sigma_y = sqrt(diag(J * covar * J'));	// slower version of below
	         sigma_y = zeros(Npnt,1);
	         for i=1:Npnt
	         sigma_y(i) = J(i,:) * covar * J(i,:)';
	         end
	         sigma_y = sqrt(sigma_y);
	         end

	         if nargout > 4				// parameter correlation matrix
	         corr = covar ./ [sigma_p*sigma_p'];
	         end

	         if nargout > 5				// coefficient of multiple determination
	         R_sq = corrcoef([y_dat y_hat]);
	         R_sq = R_sq(1,2).^2;
	         end

	         if nargout > 6				// convergence history
	         cvg_hst = cvg_hst(1:iteration,:);
	         end*/

	        // endfunction  # ---------------------------------------------------------- LM

	        return { p:p, X2:X2};
	    },

	    lm_FD_J:function(func,t,p,y,dp,c) {
	        // J = lm_FD_J(func,t,p,y,{dp},{c})
	        //
	        // partial derivatives (Jacobian) dy/dp for use with lm.m
	        // computed via Finite Differences
	        // Requires n or 2n function evaluations, n = number of nonzero values of dp
	        // -------- INPUT VARIABLES ---------
	        // func = function of independent variables, 't', and parameters, 'p',
	        //        returning the simulated model: y_hat = func(t,p,c)
	        // t  = m-vector of independent variables (used as arg to func)
	        // p  = n-vector of current parameter values
	        // y  = func(t,p,c) n-vector initialised by user before each call to lm_FD_J
	        // dp = fractional increment of p for numerical derivatives
	        //      dp(j)>0 central differences calculated
	        //      dp(j)<0 one sided differences calculated
	        //      dp(j)=0 sets corresponding partials to zero; i.e. holds p(j) fixed
	        //      Default:  0.001;
	        // c  = optional vector of constants passed to y_hat = func(t,p,c)
	        //---------- OUTPUT VARIABLES -------
	        // J  = Jacobian Matrix J(i,j)=dy(i)/dp(j)	i=1:n; j=1:m

	        //   Henri Gavin, Dept. Civil & Environ. Engineering, Duke Univ. November 2005
	        //   modified from: ftp://fly.cnuce.cnr.it/pub/software/octave/leasqr/
	        //   Press, et al., Numerical Recipes, Cambridge Univ. Press, 1992, Chapter 15.

	        var m = y.length;			// number of data points
	        var n = p.length;			// number of parameters

	        dp = dp || math.multiply( Matrix.ones(n, 1), 0.001);

	        var ps = p.clone();//JSON.parse(JSON.stringify(p));
	        //var ps = $.extend(true, [], p);
	        var J = new Matrix(m,n), del =new Array(n);         // initialize Jacobian to Zero

	        for (var j = 0;j < n; j++) {
	            //console.log(j+" "+dp[j]+" "+p[j]+" "+ps[j]+" "+del[j]);
	            del[j] = dp[j]*(1+Math.abs(p[j][0]));  // parameter perturbation
	            p[j] = [ps[j][0]+del[j]];	      // perturb parameter p(j)
	            //console.log(j+" "+dp[j]+" "+p[j]+" "+ps[j]+" "+del[j]);

	            if (del[j] != 0){
	                y1 = func(t, p, c);
	                //func_calls = func_calls + 1;
	                if (dp[j][0] < 0) {		// backwards difference
	                    //J(:,j) = math.dotDivide(math.subtract(y1, y),del[j]);//. / del[j];
	                    //console.log(del[j]);
	                    //console.log(y);
	                    var column = math.dotDivide(math.subtract(y1, y),del[j]);
	                    for(var k=0;k< m;k++){
	                        J[k][j]=column[k][0];
	                    }
	                    //console.log(column);
	                }
	                else{
	                    p[j][0] = ps[j][0] - del[j];
	                    //J(:,j) = (y1 - feval(func, t, p, c)). / (2. * del[j]);
	                    var column = math.dotDivide(math.subtract(y1,func(t,p,c)),2*del[j]);
	                    for(var k=0;k< m;k++){
	                        J[k][j]=column[k][0];
	                    }

	                }			// central difference, additional func call
	            }

	            p[j] = ps[j];		// restore p(j)

	        }
	        //console.log("lm_FD_J: "+ JSON.stringify(J));
	        return J;

	    },

	    // endfunction # -------------------------------------------------- LM_FD_J
	    lm_Broyden_J: function(p_old,y_old,J,p,y){
	        // J = lm_Broyden_J(p_old,y_old,J,p,y)
	        // carry out a rank-1 update to the Jacobian matrix using Broyden's equation
	        //---------- INPUT VARIABLES -------
	        // p_old = previous set of parameters
	        // y_old = model evaluation at previous set of parameters, y_hat(t;p_old)
	        // J  = current version of the Jacobian matrix
	        // p     = current  set of parameters
	        // y     = model evaluation at current  set of parameters, y_hat(t;p)
	        //---------- OUTPUT VARIABLES -------
	        // J = rank-1 update to Jacobian Matrix J(i,j)=dy(i)/dp(j)	i=1:n; j=1:m
	        //console.log(p+" X "+ p_old)
	        var h  = math.subtract(p, p_old);

	        //console.log("hhh "+h);
	        var h_t = math.transpose(h);
	        h_t.div(math.multiply(h_t,h));

	        //console.log(h_t);
	        //J = J + ( y - y_old - J*h )*h' / (h'*h);	// Broyden rank-1 update eq'n
	        J = math.add(J, math.multiply(math.subtract(y, math.add(y_old,math.multiply(J,h))),h_t));
	        return J;
	        // endfunction # ---------------------------------------------- LM_Broyden_J
	    },

	    lm_matx : function (func,t,p_old,y_old,dX2,J,p,y_dat,weight_sq,dp,c,iteration){
	        // [JtWJ,JtWdy,Chi_sq,y_hat,J] = this.lm_matx(func,t,p_old,y_old,dX2,J,p,y_dat,weight_sq,{da},{c})
	        //
	        // Evaluate the linearized fitting matrix, JtWJ, and vector JtWdy,
	        // and calculate the Chi-squared error function, Chi_sq
	        // Used by Levenberg-Marquard algorithm, lm.m
	        // -------- INPUT VARIABLES ---------
	        // func   = function ofpn independent variables, p, and m parameters, p,
	        //         returning the simulated model: y_hat = func(t,p,c)
	        // t      = m-vectors or matrix of independent variables (used as arg to func)
	        // p_old  = n-vector of previous parameter values
	        // y_old  = m-vector of previous model ... y_old = y_hat(t;p_old);
	        // dX2    = previous change in Chi-squared criteria
	        // J   = m-by-n Jacobian of model, y_hat, with respect to parameters, p
	        // p      = n-vector of current  parameter values
	        // y_dat  = n-vector of data to be fit by func(t,p,c)
	        // weight_sq = square of the weighting vector for least squares fit ...
	        //	    inverse of the standard measurement errors
	        // dp     = fractional increment of 'p' for numerical derivatives
	        //          dp(j)>0 central differences calculated
	        //          dp(j)<0 one sided differences calculated
	        //          dp(j)=0 sets corresponding partials to zero; i.e. holds p(j) fixed
	        //          Default:  0.001;
	        // c      = optional vector of constants passed to y_hat = func(t,p,c)
	        //---------- OUTPUT VARIABLES -------
	        // JtWJ	 = linearized Hessian matrix (inverse of covariance matrix)
	        // JtWdy   = linearized fitting vector
	        // Chi_sq = Chi-squared criteria: weighted sum of the squared residuals WSSR
	        // y_hat  = model evaluated with parameters 'p'
	        // J   = m-by-n Jacobian of model, y_hat, with respect to parameters, p

	        //   Henri Gavin, Dept. Civil & Environ. Engineering, Duke Univ. November 2005
	        //   modified from: ftp://fly.cnuce.cnr.it/pub/software/octave/leasqr/
	        //   Press, et al., Numerical Recipes, Cambridge Univ. Press, 1992, Chapter 15.


	        var Npnt = y_dat.length;		// number of data points
	        var Npar = p.length;		// number of parameters

	        dp = dp || 0.001;


	        //var JtWJ = new Matrix.zeros(Npar);
	        //var JtWdy  = new Matrix.zeros(Npar,1);

	        var y_hat = func(t,p,c);	// evaluate model using parameters 'p'
	        //func_calls = func_calls + 1;
	        //console.log(J);
	        if ( (iteration%(2*Npar))==0 || dX2 > 0 ) {
	            //console.log("Par");
	            J = this.lm_FD_J(func, t, p, y_hat, dp, c);		// finite difference
	        }
	        else{
	            //console.log("ImPar");
	            J = this.lm_Broyden_J(p_old, y_old, J, p, y_hat); // rank-1 update
	        }
	        var delta_y = math.subtract(y_dat, y_hat);	// residual error between model and data
	        //console.log(delta_y[0][0]);
	        //console.log(delta_y.rows+" "+delta_y.columns+" "+JSON.stringify(weight_sq));
	        //var Chi_sq = delta_y' * ( delta_y .* weight_sq ); 	// Chi-squared error criteria
	        var Chi_sq = math.multiply(math.transpose(delta_y),math.dotMultiply(delta_y,weight_sq));
	        //JtWJ  = J' * ( J .* ( weight_sq * ones(1,Npar) ) );
	        var Jt = math.transpose(J);

	        //console.log(weight_sq);

	        var JtWJ = math.multiply(Jt, math.dotMultiply(J,math.multiply(weight_sq, Matrix.ones(1,Npar))));

	        //JtWdy = J' * ( weight_sq .* delta_y );
	        var JtWdy = math.multiply(Jt, math.dotMultiply(weight_sq,delta_y));


	        return {JtWJ:JtWJ,JtWdy:JtWdy,Chi_sq:Chi_sq,y_hat:y_hat,J:J};
	        // endfunction  # ------------------------------------------------------ LM_MATX
	    }



	};

	module.exports = LM;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(13);
	module.exports.Decompositions = module.exports.DC = __webpack_require__(14);


/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';

	var Asplice = Array.prototype.splice,
	    Aconcat = Array.prototype.concat;

	// For performance : http://jsperf.com/clone-array-slice-vs-while-vs-for
	function slice(arr) {
	    var i = 0,
	        ii = arr.length,
	        result = new Array(ii);
	    for (; i < ii; i++) {
	        result[i] = arr[i];
	    }
	    return result;
	}

	/**
	 * Real matrix.
	 * @constructor
	 * @param {number|Array} nRows - Number of rows of the new matrix or a 2D array containing the data.
	 * @param {number|boolean} [nColumns] - Number of columns of the new matrix or a boolean specifying if the input array should be cloned
	 */
	function Matrix(nRows, nColumns) {
	    var i = 0, rows, columns, matrix, newInstance;
	    if (Array.isArray(nRows)) {
	        newInstance = nColumns;
	        matrix = newInstance ? slice(nRows) : nRows;
	        nRows = matrix.length;
	        nColumns = matrix[0].length;
	        if (typeof nColumns === 'undefined') {
	            throw new TypeError('Data must be a 2D array');
	        }
	        if (nRows > 0 && nColumns > 0) {
	            for (; i < nRows; i++) {
	                if (matrix[i].length !== nColumns) {
	                    throw new RangeError('Inconsistent array dimensions');
	                } else if (newInstance) {
	                    matrix[i] = slice(matrix[i]);
	                }
	            }
	        } else {
	            throw new RangeError('Invalid dimensions: ' + nRows + 'x' + nColumns);
	        }
	    } else if (typeof nRows === 'number') { // Create empty matrix
	        if (nRows > 0 && nColumns > 0) {
	            matrix = new Array(nRows);
	            for (; i < nRows; i++) {
	                matrix[i] = new Array(nColumns);
	            }
	        } else {
	            throw new RangeError('Invalid dimensions: ' + nRows + 'x' + nColumns);
	        }
	    } else {
	        throw new TypeError('Invalid arguments');
	    }

	    Object.defineProperty(matrix, 'rows', {writable: true, value: nRows});
	    Object.defineProperty(matrix, 'columns', {writable: true, value: nColumns});

	    matrix.__proto__ = Matrix.prototype;

	    return matrix;
	}

	/**
	 * Constructs a Matrix with the chosen dimensions from a 1D array.
	 * @param {number} newRows - Number of rows
	 * @param {number} newColumns - Number of columns
	 * @param {Array} newData - A 1D array containing data for the matrix
	 * @returns {Matrix} - The new matrix
	 */
	Matrix.from1DArray = function from1DArray(newRows, newColumns, newData) {
	    var length, data, i = 0;

	    length = newRows * newColumns;
	    if (length !== newData.length)
	        throw new RangeError('Data length does not match given dimensions');

	    data = new Array(newRows);
	    for (; i < newRows; i++) {
	        data[i] = newData.slice(i * newColumns, (i + 1) * newColumns);
	    }
	    return new Matrix(data);
	};

	/**
	 * Creates a row vector, a matrix with only one row.
	 * @param {Array} newData - A 1D array containing data for the vector
	 * @returns {Matrix} - The new matrix
	 */
	Matrix.rowVector = function rowVector(newData) {
	    return new Matrix([newData]);
	};

	/**
	 * Creates a column vector, a matrix with only one column.
	 * @param {Array} newData - A 1D array containing data for the vector
	 * @returns {Matrix} - The new matrix
	 */
	Matrix.columnVector = function columnVector(newData) {
	    var l = newData.length, vector = new Array(l);
	    for (var i = 0; i < l; i++)
	        vector[i] = [newData[i]];
	    return new Matrix(vector);
	};

	/**
	 * Creates an empty matrix with the given dimensions. Values will be undefined. Same as using new Matrix(rows, columns).
	 * @param {number} rows - Number of rows
	 * @param {number} columns - Number of columns
	 * @returns {Matrix} - The new matrix
	 */
	Matrix.empty = function empty(rows, columns) {
	    return new Matrix(rows, columns);
	};

	/**
	 * Creates a matrix with the given dimensions. Values will be set to zero.
	 * @param {number} rows - Number of rows
	 * @param {number} columns - Number of columns
	 * @returns {Matrix} - The new matrix
	 */
	Matrix.zeros = function zeros(rows, columns) {
	    return Matrix.empty(rows, columns).fill(0);
	};

	/**
	 * Creates a matrix with the given dimensions. Values will be set to one.
	 * @param {number} rows - Number of rows
	 * @param {number} columns - Number of columns
	 * @returns {Matrix} - The new matrix
	 */
	Matrix.ones = function ones(rows, columns) {
	    return Matrix.empty(rows, columns).fill(1);
	};

	/**
	 * Creates a matrix with the given dimensions. Values will be randomly set using Math.random().
	 * @param {number} rows - Number of rows
	 * @param {number} columns - Number of columns
	 * @returns {Matrix} The new matrix
	 */
	Matrix.rand = function rand(rows, columns) {
	    var matrix = Matrix.empty(rows, columns);
	    for (var i = 0, ii = matrix.rows; i < ii; i++) {
	        for (var j = 0, jj = matrix.columns; j < jj; j++) {
	            matrix[i][j] = Math.random();
	        }
	    }
	    return matrix;
	};

	/**
	 * Creates an identity matrix with the given dimension. Values of the diagonal will be 1 and other will be 0.
	 * @param {number} n - Number of rows and columns
	 * @returns {Matrix} - The new matrix
	 */
	Matrix.eye = function eye(n) {
	    var matrix = Matrix.zeros(n, n), l = matrix.rows;
	    for (var i = 0; i < l; i++) {
	        matrix[i][i] = 1;
	    }
	    return matrix;
	};

	/**
	 * Creates a diagonal matrix based on the given array.
	 * @param {Array} data - Array containing the data for the diagonal
	 * @returns {Matrix} - The new matrix
	 */
	Matrix.diag = function diag(data) {
	    var l = data.length, matrix = Matrix.zeros(l, l);
	    for (var i = 0; i < l; i++) {
	        matrix[i][i] = data[i];
	    }
	    return matrix;
	};

	/**
	 * Creates an array of indices between two values
	 * @param {number} from
	 * @param {number} to
	 * @returns {Array}
	 */
	Matrix.indices = function indices(from, to) {
	    var vector = new Array(to - from);
	    for (var i = 0; i < vector.length; i++)
	        vector[i] = from++;
	    return vector;
	};

	// TODO DOC
	Matrix.stack = function stack(arg1) {
	    var i, j, k;
	    if (Matrix.isMatrix(arg1)) {
	        var rows = 0,
	            cols = 0;
	        for (i = 0; i < arguments.length; i++) {
	            rows += arguments[i].rows;
	            if (arguments[i].columns > cols)
	                cols = arguments[i].columns;
	        }

	        var r = Matrix.zeros(rows, cols);
	        var c = 0;
	        for (i = 0; i < arguments.length; i++) {
	            var current = arguments[i];
	            for (j = 0; j < current.rows; j++) {
	                for (k = 0; k < current.columns; k++)
	                    r[c][k] = current[j][k];
	                c++;
	            }
	        }
	        return r;
	    }
	    else if (Array.isArray(arg1)) {
	        var matrix = Matrix.empty(arguments.length, arg1.length);
	        for (i = 0; i < arguments.length; i++)
	            matrix.setRow(i, arguments[i]);
	        return matrix;
	    }
	};

	// TODO DOC
	Matrix.expand = function expand(base, count) {
	    var expansion = [];
	    for (var i = 0; i < count.length; i++)
	        for (var j = 0; j < count[i]; j++)
	            expansion.push(base[i]);
	    return new Matrix(expansion);
	};

	/**
	 * Check that the provided value is a Matrix and tries to instantiate one if not
	 * @param value - The value to check
	 * @returns {Matrix}
	 * @throws {TypeError}
	 */
	Matrix.checkMatrix = function checkMatrix(value) {
	    if (!value) {
	        throw new TypeError('Argument has to be a matrix');
	    }
	    if (value.klass !== 'Matrix') {
	        value = new Matrix(value);
	    }
	    return value;
	};

	/**
	 * Returns true if the argument is a Matrix, false otherwise
	 * @param value - The value to check
	 * @returns {boolean}
	 */
	Matrix.isMatrix = function isMatrix(value) {
	    return value ? value.klass === 'Matrix' : false;
	};

	/**
	 * @property {string} - The name of this class.
	 */
	Object.defineProperty(Matrix.prototype, 'klass', {
	    get: function klass() {
	        return 'Matrix';
	    }
	});

	/**
	 * @property {number} - The number of elements in the matrix.
	 */
	Object.defineProperty(Matrix.prototype, 'size', {
	    get: function size() {
	        return this.rows * this.columns;
	    }
	});

	/**
	 * @private
	 * Internal check that a row index is not out of bounds
	 * @param {number} index
	 */
	Matrix.prototype.checkRowIndex = function checkRowIndex(index) {
	    if (index < 0 || index > this.rows - 1)
	        throw new RangeError('Row index out of range.');
	};

	/**
	 * @private
	 * Internal check that a column index is not out of bounds
	 * @param {number} index
	 */
	Matrix.prototype.checkColumnIndex = function checkColumnIndex(index) {
	    if (index < 0 || index > this.columns - 1)
	        throw new RangeError('Column index out of range.');
	};

	/**
	 * @private
	 * Internal check that two matrices have the same dimensions
	 * @param {Matrix} otherMatrix
	 */
	Matrix.prototype.checkDimensions = function checkDimensions(otherMatrix) {
	    if ((this.rows !== otherMatrix.rows) || (this.columns !== otherMatrix.columns))
	        throw new RangeError('Matrices dimensions must be equal.');
	};

	/**
	 * Applies a callback for each element of the matrix. The function is called in the matrix (this) context.
	 * @param {function} callback - Function that will be called with two parameters : i (row) and j (column)
	 * @returns {Matrix} this
	 */
	Matrix.prototype.apply = function apply(callback) {
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            callback.call(this, i, j);
	        }
	    }
	    return this;
	};

	/**
	 * Creates an exact and independent copy of the matrix
	 * @returns {Matrix}
	 */
	Matrix.prototype.clone = function clone() {
	    return new Matrix(this.to2DArray());
	};

	/**
	 * Returns a new 1D array filled row by row with the matrix values
	 * @returns {Array}
	 */
	Matrix.prototype.to1DArray = function to1DArray() {
	    return Aconcat.apply([], this);
	};

	/**
	 * Returns a 2D array containing a copy of the data
	 * @returns {Array}
	 */
	Matrix.prototype.to2DArray = function to2DArray() {
	    var l = this.rows, copy = new Array(l);
	    for (var i = 0; i < l; i++) {
	        copy[i] = slice(this[i]);
	    }
	    return copy;
	};

	/**
	 * @returns {boolean} true if the matrix has one row
	 */
	Matrix.prototype.isRowVector = function isRowVector() {
	    return this.rows === 1;
	};

	/**
	 * @returns {boolean} true if the matrix has one column
	 */
	Matrix.prototype.isColumnVector = function isColumnVector() {
	    return this.columns === 1;
	};

	/**
	 * @returns {boolean} true if the matrix has one row or one column
	 */
	Matrix.prototype.isVector = function isVector() {
	    return (this.rows === 1) || (this.columns === 1);
	};

	/**
	 * @returns {boolean} true if the matrix has the same number of rows and columns
	 */
	Matrix.prototype.isSquare = function isSquare() {
	    return this.rows === this.columns;
	};

	/**
	 * @returns {boolean} true if the matrix is square and has the same values on both sides of the diagonal
	 */
	Matrix.prototype.isSymmetric = function isSymmetric() {
	    if (this.isSquare()) {
	        var l = this.rows;
	        for (var i = 0; i < l; i++) {
	            for (var j = 0; j <= i; j++) {
	                if (this[i][j] !== this[j][i]) {
	                    return false;
	                }
	            }
	        }
	        return true;
	    }
	    return false;
	};

	/**
	 * Sets a given element of the matrix. mat.set(3,4,1) is equivalent to mat[3][4]=1
	 * @param {number} rowIndex - Index of the row
	 * @param {number} columnIndex - Index of the column
	 * @param {number} value - The new value for the element
	 * @returns {Matrix} this
	 */
	Matrix.prototype.set = function set(rowIndex, columnIndex, value) {
	    this[rowIndex][columnIndex] = value;
	    return this;
	};

	/**
	 * Returns the given element of the matrix. mat.get(3,4) is equivalent to matrix[3][4]
	 * @param {number} rowIndex - Index of the row
	 * @param {number} columnIndex - Index of the column
	 * @returns {number}
	 */
	Matrix.prototype.get = function get(rowIndex, columnIndex) {
	    return this[rowIndex][columnIndex];
	};

	/**
	 * Fills the matrix with a given value. All elements will be set to this value.
	 * @param {number} value - New value
	 * @returns {Matrix} this
	 */
	Matrix.prototype.fill = function fill(value) {
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            this[i][j] = value;
	        }
	    }
	    return this;
	};

	/**
	 * Negates the matrix. All elements will be multiplied by (-1)
	 * @returns {Matrix} this
	 */
	Matrix.prototype.neg = function neg() {
	    return this.mulS(-1);
	};

	/**
	 * Adds a scalar or values from another matrix (in place)
	 * @param {number|Matrix} value
	 * @returns {Matrix} this
	 */
	Matrix.prototype.add = function add(value) {
	    if (typeof value === 'number')
	        return this.addS(value);
	    value = Matrix.checkMatrix(value);
	        return this.addM(value);
	};

	/**
	 * Adds a scalar to each element of the matrix
	 * @param {number} value
	 * @returns {Matrix} this
	 */
	Matrix.prototype.addS = function addS(value) {
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            this[i][j] += value;
	        }
	    }
	    return this;
	};

	/**
	 * Adds the value of each element of matrix to the corresponding element of this
	 * @param {Matrix} matrix
	 * @returns {Matrix} this
	 */
	Matrix.prototype.addM = function addM(matrix) {
	    this.checkDimensions(matrix);
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            this[i][j] += matrix[i][j];
	        }
	    }
	    return this;
	};

	/**
	 * Subtracts a scalar or values from another matrix (in place)
	 * @param {number|Matrix} value
	 * @returns {Matrix} this
	 */
	Matrix.prototype.sub = function sub(value) {
	    if (typeof value === 'number')
	        return this.subS(value);
	    value = Matrix.checkMatrix(value);
	        return this.subM(value);
	};

	/**
	 * Subtracts a scalar from each element of the matrix
	 * @param {number} value
	 * @returns {Matrix} this
	 */
	Matrix.prototype.subS = function subS(value) {
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            this[i][j] -= value;
	        }
	    }
	    return this;
	};

	/**
	 * Subtracts the value of each element of matrix from the corresponding element of this
	 * @param {Matrix} matrix
	 * @returns {Matrix} this
	 */
	Matrix.prototype.subM = function subM(matrix) {
	    this.checkDimensions(matrix);
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            this[i][j] -= matrix[i][j];
	        }
	    }
	    return this;
	};

	/**
	 * Multiplies a scalar or values from another matrix (in place)
	 * @param {number|Matrix} value
	 * @returns {Matrix} this
	 */
	Matrix.prototype.mul = function mul(value) {
	    if (typeof value === 'number')
	        return this.mulS(value);
	    value = Matrix.checkMatrix(value);
	        return this.mulM(value);
	};

	/**
	 * Multiplies a scalar with each element of the matrix
	 * @param {number} value
	 * @returns {Matrix} this
	 */
	Matrix.prototype.mulS = function mulS(value) {
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            this[i][j] *= value;
	        }
	    }
	    return this;
	};

	/**
	 * Multiplies the value of each element of matrix with the corresponding element of this
	 * @param {Matrix} matrix
	 * @returns {Matrix} this
	 */
	Matrix.prototype.mulM = function mulM(matrix) {
	    this.checkDimensions(matrix);
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            this[i][j] *= matrix[i][j];
	        }
	    }
	    return this;
	};

	/**
	 * Divides by a scalar or values from another matrix (in place)
	 * @param {number|Matrix} value
	 * @returns {Matrix} this
	 */
	Matrix.prototype.div = function div(value) {
	    if (typeof value === 'number')
	        return this.divS(value);
	    value = Matrix.checkMatrix(value);
	        return this.divM(value);
	};

	/**
	 * Divides each element of the matrix by a scalar
	 * @param {number} value
	 * @returns {Matrix} this
	 */
	Matrix.prototype.divS = function divS(value) {
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            this[i][j] /= value;
	        }
	    }
	    return this;
	};

	/**
	 * Divides each element of this by the corresponding element of matrix
	 * @param {Matrix} matrix
	 * @returns {Matrix} this
	 */
	Matrix.prototype.divM = function divM(matrix) {
	    this.checkDimensions(matrix);
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            this[i][j] /= matrix[i][j];
	        }
	    }
	    return this;
	};

	/**
	 * Returns a new array from the given row index
	 * @param {number} index - Row index
	 * @returns {Array}
	 */
	Matrix.prototype.getRow = function getRow(index) {
	    this.checkRowIndex(index);
	    return slice(this[index]);
	};

	/**
	 * Returns a new row vector from the given row index
	 * @param {number} index - Row index
	 * @returns {Matrix}
	 */
	Matrix.prototype.getRowVector = function getRowVector(index) {
	    return Matrix.rowVector(this.getRow(index));
	};

	/**
	 * Sets a row at the given index
	 * @param {number} index - Row index
	 * @param {Array|Matrix} array - Array or vector
	 * @returns {Matrix} this
	 */
	Matrix.prototype.setRow = function setRow(index, array) {
	    this.checkRowIndex(index);
	    if (Matrix.isMatrix(array)) array = array.to1DArray();
	    if (array.length !== this.columns)
	        throw new RangeError('Invalid row size');
	    this[index] = slice(array);
	    return this;
	};

	/**
	 * Removes a row from the given index
	 * @param {number} index - Row index
	 * @returns {Matrix} this
	 */
	Matrix.prototype.removeRow = function removeRow(index) {
	    this.checkRowIndex(index);
	    if (this.rows === 1)
	        throw new RangeError('A matrix cannot have less than one row');
	    Asplice.call(this, index, 1);
	    this.rows -= 1;
	    return this;
	};

	/**
	 * Adds a row at the given index
	 * @param {number} [index = this.rows] - Row index
	 * @param {Array|Matrix} array - Array or vector
	 * @returns {Matrix} this
	 */
	Matrix.prototype.addRow = function addRow(index, array) {
	    if (typeof array === 'undefined') {
	        array = index;
	        index = this.rows;
	    }
	    if (index < 0 || index > this.rows)
	        throw new RangeError('Row index out of range.');
	    if (Matrix.isMatrix(array)) array = array.to1DArray();
	    if (array.length !== this.columns)
	        throw new RangeError('Invalid row size');
	    Asplice.call(this, index, 0, slice(array));
	    this.rows += 1;
	    return this;
	};

	/**
	 * Swaps two rows
	 * @param {number} row1 - First row index
	 * @param {number} row2 - Second row index
	 * @returns {Matrix} this
	 */
	Matrix.prototype.swapRows = function swapRows(row1, row2) {
	    this.checkRowIndex(row1);
	    this.checkRowIndex(row2);
	    var temp = this[row1];
	    this[row1] = this[row2];
	    this[row2] = temp;
	    return this;
	};

	/**
	 * Returns a new array from the given column index
	 * @param {number} index - Column index
	 * @returns {Array}
	 */
	Matrix.prototype.getColumn = function getColumn(index) {
	    this.checkColumnIndex(index);
	    var l = this.rows, column = new Array(l);
	    for (var i = 0; i < l; i++) {
	        column[i] = this[i][index];
	    }
	    return column;
	};

	/**
	 * Returns a new column vector from the given column index
	 * @param {number} index - Column index
	 * @returns {Matrix}
	 */
	Matrix.prototype.getColumnVector = function getColumnVector(index) {
	    return Matrix.columnVector(this.getColumn(index));
	};

	/**
	 * Sets a column at the given index
	 * @param {number} index - Column index
	 * @param {Array|Matrix} array - Array or vector
	 * @returns {Matrix} this
	 */
	Matrix.prototype.setColumn = function setColumn(index, array) {
	    this.checkColumnIndex(index);
	    if (Matrix.isMatrix(array)) array = array.to1DArray();
	    var l = this.rows;
	    if (array.length !== l)
	        throw new RangeError('Invalid column size');
	    for (var i = 0; i < l; i++) {
	        this[i][index] = array[i];
	    }
	    return this;
	};

	/**
	 * Removes a column from the given index
	 * @param {number} index - Column index
	 * @returns {Matrix} this
	 */
	Matrix.prototype.removeColumn = function removeColumn(index) {
	    this.checkColumnIndex(index);
	    if (this.columns === 1)
	        throw new RangeError('A matrix cannot have less than one column');
	    for (var i = 0, ii = this.rows; i < ii; i++) {
	        this[i].splice(index, 1);
	    }
	    this.columns -= 1;
	    return this;
	};

	/**
	 * Adds a column at the given index
	 * @param {number} [index = this.columns] - Column index
	 * @param {Array|Matrix} array - Array or vector
	 * @returns {Matrix} this
	 */
	Matrix.prototype.addColumn = function addColumn(index, array) {
	    if (typeof array === 'undefined') {
	        array = index;
	        index = this.columns;
	    }
	    if (index < 0 || index > this.columns)
	        throw new RangeError('Column index out of range.');
	    if (Matrix.isMatrix(array)) array = array.to1DArray();
	    var l = this.rows;
	    if (array.length !== l)
	        throw new RangeError('Invalid column size');
	    for (var i = 0; i < l; i++) {
	        this[i].splice(index, 0, array[i]);
	    }
	    this.columns += 1;
	    return this;
	};

	/**
	 * Swaps two columns
	 * @param {number} column1 - First column index
	 * @param {number} column2 - Second column index
	 * @returns {Matrix} this
	 */
	Matrix.prototype.swapColumns = function swapColumns(column1, column2) {
	    this.checkRowIndex(column1);
	    this.checkRowIndex(column2);
	    var l = this.rows, temp, row;
	    for (var i = 0; i < l; i++) {
	        row = this[i];
	        temp = row[column1];
	        row[column1] = row[column2];
	        row[column2] = temp;
	    }
	    return this;
	};

	/**
	 * @private
	 * Internal check that the provided vector is an array with the right length
	 * @param {Array|Matrix} vector
	 * @returns {Array}
	 * @throws {RangeError}
	 */
	Matrix.prototype.checkRowVector = function checkRowVector(vector) {
	    if (Matrix.isMatrix(vector))
	        vector = vector.to1DArray();
	    if (vector.length !== this.columns)
	        throw new RangeError('vector size must be the same as the number of columns');
	    return vector;
	};

	/**
	 * @private
	 * Internal check that the provided vector is an array with the right length
	 * @param {Array|Matrix} vector
	 * @returns {Array}
	 * @throws {RangeError}
	 */
	Matrix.prototype.checkColumnVector = function checkColumnVector(vector) {
	    if (Matrix.isMatrix(vector))
	        vector = vector.to1DArray();
	    if (vector.length !== this.rows)
	        throw new RangeError('vector size must be the same as the number of rows');
	    return vector;
	};

	/**
	 * Adds the values of a vector to each row
	 * @param {Array|Matrix} vector - Array or vector
	 * @returns {Matrix} this
	 */
	Matrix.prototype.addRowVector = function addRowVector(vector) {
	    vector = this.checkRowVector(vector);
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            this[i][j] += vector[j];
	        }
	    }
	    return this;
	};

	/**
	 * Subtracts the values of a vector from each row
	 * @param {Array|Matrix} vector - Array or vector
	 * @returns {Matrix} this
	 */
	Matrix.prototype.subRowVector = function subRowVector(vector) {
	    vector = this.checkRowVector(vector);
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            this[i][j] -= vector[j];
	        }
	    }
	    return this;
	};

	/**
	 * Multiplies the values of a vector with each row
	 * @param {Array|Matrix} vector - Array or vector
	 * @returns {Matrix} this
	 */
	Matrix.prototype.mulRowVector = function mulRowVector(vector) {
	    vector = this.checkRowVector(vector);
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            this[i][j] *= vector[j];
	        }
	    }
	    return this;
	};

	/**
	 * Divides the values of each row by those of a vector
	 * @param {Array|Matrix} vector - Array or vector
	 * @returns {Matrix} this
	 */
	Matrix.prototype.divRowVector = function divRowVector(vector) {
	    vector = this.checkRowVector(vector);
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            this[i][j] /= vector[j];
	        }
	    }
	    return this;
	};

	/**
	 * Adds the values of a vector to each column
	 * @param {Array|Matrix} vector - Array or vector
	 * @returns {Matrix} this
	 */
	Matrix.prototype.addColumnVector = function addColumnVector(vector) {
	    vector = this.checkColumnVector(vector);
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            this[i][j] += vector[i];
	        }
	    }
	    return this;
	};

	/**
	 * Subtracts the values of a vector from each column
	 * @param {Array|Matrix} vector - Array or vector
	 * @returns {Matrix} this
	 */
	Matrix.prototype.subColumnVector = function subColumnVector(vector) {
	    vector = this.checkColumnVector(vector);
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            this[i][j] -= vector[i];
	        }
	    }
	    return this;
	};

	/**
	 * Multiplies the values of a vector with each column
	 * @param {Array|Matrix} vector - Array or vector
	 * @returns {Matrix} this
	 */
	Matrix.prototype.mulColumnVector = function mulColumnVector(vector) {
	    vector = this.checkColumnVector(vector);
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            this[i][j] *= vector[i];
	        }
	    }
	    return this;
	};

	/**
	 * Divides the values of each column by those of a vector
	 * @param {Array|Matrix} vector - Array or vector
	 * @returns {Matrix} this
	 */
	Matrix.prototype.divColumnVector = function divColumnVector(vector) {
	    vector = this.checkColumnVector(vector);
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            this[i][j] /= vector[i];
	        }
	    }
	    return this;
	};

	/**
	 * Multiplies the values of a row with a scalar
	 * @param {number} index - Row index
	 * @param {number} value
	 * @returns {Matrix} this
	 */
	Matrix.prototype.mulRow = function mulRow(index, value) {
	    this.checkRowIndex(index);
	    var i = 0, l = this.columns;
	    for (; i < l; i++) {
	        this[index][i] *= value;
	    }
	    return this;
	};

	/**
	 * Multiplies the values of a column with a scalar
	 * @param {number} index - Column index
	 * @param {number} value
	 * @returns {Matrix} this
	 */
	Matrix.prototype.mulColumn = function mulColumn(index, value) {
	    this.checkColumnIndex(index);
	    var i = 0, l = this.rows;
	    for (; i < l; i++) {
	        this[i][index] *= value;
	    }
	};

	/**
	 * A matrix index
	 * @typedef {Object} MatrixIndex
	 * @property {number} row
	 * @property {number} column
	 */

	/**
	 * Returns the maximum value of the matrix
	 * @returns {number}
	 */
	Matrix.prototype.max = function max() {
	    var v = -Infinity;
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            if (this[i][j] > v) {
	                v = this[i][j];
	            }
	        }
	    }
	    return v;
	};

	/**
	 * Returns the index of the maximum value
	 * @returns {MatrixIndex}
	 */
	Matrix.prototype.maxIndex = function maxIndex() {
	    var v = -Infinity;
	    var idx = {};
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            if (this[i][j] > v) {
	                v = this[i][j];
	                idx.row = i;
	                idx.column = j;
	            }
	        }
	    }
	    return idx;
	};

	/**
	 * Returns the minimum value of the matrix
	 * @returns {number}
	 */
	Matrix.prototype.min = function min() {
	    var v = Infinity;
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            if (this[i][j] < v) {
	                v = this[i][j];
	            }
	        }
	    }
	    return v;
	};

	/**
	 * Returns the index of the minimum value
	 * @returns {MatrixIndex}
	 */
	Matrix.prototype.minIndex = function minIndex() {
	    var v = Infinity;
	    var idx = {};
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            if (this[i][j] < v) {
	                v = this[i][j];
	                idx.row = i;
	                idx.column = j;
	            }
	        }
	    }
	    return idx;
	};

	/**
	 * Returns the maximum value of one row
	 * @param {number} index - Row index
	 * @returns {number}
	 */
	Matrix.prototype.maxRow = function maxRow(index) {
	    this.checkRowIndex(index);
	    var v = -Infinity;
	    for (var i = 0, ii = this.columns; i < ii; i++) {
	        if (this[index][i] > v) {
	            v = this[index][i];
	        }
	    }
	    return v;
	};

	/**
	 * Returns the index of the maximum value of one row
	 * @param {number} index - Row index
	 * @returns {MatrixIndex}
	 */
	Matrix.prototype.maxRowIndex = function maxRowIndex(index) {
	    this.checkRowIndex(index);
	    var v = -Infinity;
	    var idx = {
	            row: index
	        };
	    for (var i = 0, ii = this.columns; i < ii; i++) {
	        if (this[index][i] > v) {
	            v = this[index][i];
	            idx.column = i;
	        }
	    }
	    return idx;
	};

	/**
	 * Returns the minimum value of one row
	 * @param {number} index - Row index
	 * @returns {number}
	 */
	Matrix.prototype.minRow = function minRow(index) {
	    this.checkRowIndex(index);
	    var v = Infinity;
	    for (var i = 0, ii = this.columns; i < ii; i++) {
	        if (this[index][i] < v) {
	            v = this[index][i];
	        }
	    }
	    return v;
	};

	/**
	 * Returns the index of the maximum value of one row
	 * @param {number} index - Row index
	 * @returns {MatrixIndex}
	 */
	Matrix.prototype.minRowIndex = function minRowIndex(index) {
	    this.checkRowIndex(index);
	    var v = Infinity;
	    var idx = {
	        row: index,
	        column: 0
	    };
	    for (var i = 0, ii = this.columns; i < ii; i++) {
	        if (this[index][i] < v) {
	            v = this[index][i];
	            idx.column = i;
	        }
	    }
	    return idx;
	};

	/**
	 * Returns the maximum value of one column
	 * @param {number} index - Column index
	 * @returns {number}
	 */
	Matrix.prototype.maxColumn = function maxColumn(index) {
	    this.checkColumnIndex(index);
	    var v = -Infinity;
	    for (var i = 0, ii = this.rows; i < ii; i++) {
	        if (this[i][index] > v) {
	            v = this[i][index];
	        }
	    }
	    return v;
	};

	/**
	 * Returns the index of the maximum value of one column
	 * @param {number} index - Column index
	 * @returns {MatrixIndex}
	 */
	Matrix.prototype.maxColumnIndex = function maxColumnIndex(index) {
	    this.checkColumnIndex(index);
	    var v = -Infinity;
	    var idx = {
	        row: 0,
	        column: index
	    };
	    for (var i = 0, ii = this.rows; i < ii; i++) {
	        if (this[i][index] > v) {
	            v = this[i][index];
	            idx.row = i;
	        }
	    }
	    return idx;
	};

	/**
	 * Returns the minimum value of one column
	 * @param {number} index - Column index
	 * @returns {number}
	 */
	Matrix.prototype.minColumn = function minColumn(index) {
	    this.checkColumnIndex(index);
	    var v = Infinity;
	    for (var i = 0, ii = this.rows; i < ii; i++) {
	        if (this[i][index] < v) {
	            v = this[i][index];
	        }
	    }
	    return v;
	};

	/**
	 * Returns the index of the minimum value of one column
	 * @param {number} index - Column index
	 * @returns {MatrixIndex}
	 */
	Matrix.prototype.minColumnIndex = function minColumnIndex(index) {
	    this.checkColumnIndex(index);
	    var v = Infinity;
	    var idx = {
	        row: 0,
	        column: index
	    };
	    for (var i = 0, ii = this.rows; i < ii; i++) {
	        if (this[i][index] < v) {
	            v = this[i][index];
	            idx.row = i;
	        }
	    }
	    return idx;
	};

	/**
	 * Returns an array containing the diagonal values of the matrix
	 * @returns {Array}
	 */
	Matrix.prototype.diag = function diag() {
	    if (!this.isSquare())
	        throw new TypeError('Only square matrices have a diagonal.');
	    var diag = new Array(this.rows);
	    for (var i = 0, ii = this.rows; i < ii; i++) {
	        diag[i] = this[i][i];
	    }
	    return diag;
	};

	/**
	 * Returns the sum of all elements of the matrix
	 * @returns {number}
	 */
	Matrix.prototype.sum = function sum() {
	    var v = 0;
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            v += this[i][j];
	        }
	    }
	    return v;
	};

	/**
	 * Returns the mean of all elements of the matrix
	 * @returns {number}
	 */
	Matrix.prototype.mean = function mean() {
	    return this.sum() / this.size;
	};

	/**
	 * Returns the product of all elements of the matrix
	 * @returns {number}
	 */
	Matrix.prototype.prod = function prod() {
	    var prod = 1;
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            prod *= this[i][j];
	        }
	    }
	    return prod;
	};

	/**
	 * Computes the cumulative sum of the matrix elements (in place, row by row)
	 * @returns {Matrix} this
	 */
	Matrix.prototype.cumulativeSum = function cumulativeSum() {
	    var sum = 0;
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            sum += this[i][j];
	            this[i][j] = sum;
	        }
	    }
	    return this;
	};

	/**
	 * Computes the dot (scalar) product between the matrix and another
	 * @param {Matrix} other vector
	 * @returns {number}
	 */
	Matrix.prototype.dot = function dot(other) {
	    if (this.size !== other.size)
	        throw new RangeError('vectors do not have the same size');
	    var vector1 = this.to1DArray();
	    var vector2 = other.to1DArray();
	    var dot = 0, l = vector1.length;
	    for (var i = 0; i < l; i++) {
	        dot += vector1[i] * vector2[i];
	    }
	    return dot;
	};

	/**
	 * Returns the matrix product between this and other
	 * @returns {Matrix}
	 */
	Matrix.prototype.mmul = function mmul(other) {
	    if (!Matrix.isMatrix(other))
	        throw new TypeError('parameter "other" must be a matrix');
	    if (this.columns !== other.rows)
	        console.warn('Number of columns of left matrix are not equal to number of rows of right matrix.');

	    var m = this.rows, n = this.columns, p = other.columns;
	    var result = new Matrix(m, p);

	    var Bcolj = new Array(n);
	    var i, j, k;
	    for (j = 0; j < p; j++) {
	        for (k = 0; k < n; k++)
	            Bcolj[k] = other[k][j];

	        for (i = 0; i < m; i++) {
	            var Arowi = this[i];

	            var s = 0;
	            for (k = 0; k < n; k++)
	                s += Arowi[k] * Bcolj[k];

	            result[i][j] = s;
	        }
	    }
	    return result;
	};

	/**
	 * Sorts the rows (in place)
	 * @param {function} compareFunction - usual Array.prototype.sort comparison function
	 * @returns {Matrix} this
	 */
	Matrix.prototype.sortRows = function sortRows(compareFunction) {
	    for (var i = 0, ii = this.rows; i < ii; i++) {
	        this[i].sort(compareFunction);
	    }
	    return this;
	};

	/**
	 * Sorts the columns (in place)
	 * @param {function} compareFunction - usual Array.prototype.sort comparison function
	 * @returns {Matrix} this
	 */
	Matrix.prototype.sortColumns = function sortColumns(compareFunction) {
	    for (var i = 0, ii = this.columns; i < ii; i++) {
	        this.setColumn(i, this.getColumn(i).sort(compareFunction));
	    }
	    return this;
	};

	/**
	 * Transposes the matrix and returns a new one containing the result
	 * @returns {Matrix}
	 */
	Matrix.prototype.transpose = function transpose() {
	    var result = new Matrix(this.columns, this.rows);
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            result[j][i] = this[i][j];
	        }
	    }
	    return result;
	};

	/**
	 * Returns a subset of the matrix
	 * @param {number} startRow - First row index
	 * @param {number} endRow - Last row index
	 * @param {number} startColumn - First column index
	 * @param {number} endColumn - Last column index
	 * @returns {Matrix}
	 */
	Matrix.prototype.subMatrix = function subMatrix(startRow, endRow, startColumn, endColumn) {
	    if ((startRow > endRow) || (startColumn > endColumn) || (startRow < 0) || (startRow >= this.rows) || (endRow < 0) || (endRow >= this.rows) || (startColumn < 0) || (startColumn >= this.columns) || (endColumn < 0) || (endColumn >= this.columns))
	        throw new RangeError('Argument out of range');
	    var newMatrix = new Matrix(endRow - startRow + 1, endColumn - startColumn + 1);
	    for (var i = startRow; i <= endRow; i++) {
	        for (var j = startColumn; j <= endColumn; j++) {
	            newMatrix[i - startRow][j - startColumn] = this[i][j];
	        }
	    }
	    return newMatrix;
	};

	/**
	 * Returns a subset of the matrix based on an array of row indices
	 * @param {Array} indices - Array containing the row indices
	 * @param {number} [startColumn = 0] - First column index
	 * @param {number} [endColumn = this.columns-1] - Last column index
	 * @returns {Matrix}
	 */
	Matrix.prototype.subMatrixRow = function subMatrixRow(indices, startColumn, endColumn) {
	    if (typeof startColumn === 'undefined') {
	        startColumn = 0;
	        endColumn = this.columns - 1;
	    } else if (typeof endColumn === 'undefined') {
	        endColumn = this.columns - 1;
	    }
	    if ((startColumn > endColumn) || (startColumn < 0) || (startColumn >= this.columns) || (endColumn < 0) || (endColumn >= this.columns))
	        throw new RangeError('Argument out of range.');
	    var l = indices.length, rows = this.rows,
	        X = new Matrix(l, endColumn - startColumn + 1);
	    for (var i = 0; i < l; i++) {
	        for (var j = startColumn; j <= endColumn; j++) {
	            if ((indices[i] < 0) || (indices[i] >= rows))
	                throw new RangeError('Argument out of range.');
	            X[i][j - startColumn] = this[indices[i]][j];
	        }
	    }
	    return X;
	};

	/**
	 * Returns a subset of the matrix based on an array of column indices
	 * @param {Array} indices - Array containing the column indices
	 * @param {number} [startRow = 0] - First row index
	 * @param {number} [endRow = this.rows-1] - Last row index
	 * @returns {Matrix}
	 */
	Matrix.prototype.subMatrixColumn = function subMatrixColumn(indices, startRow, endRow) {
	    if (typeof startRow === 'undefined') {
	        startRow = 0;
	        endRow = this.rows - 1;
	    } else if (typeof endRow === 'undefined') {
	        endRow = this.rows - 1;
	    }
	    if ((startRow > endRow) || (startRow < 0) || (startRow >= this.rows) || (endRow < 0) || (endRow >= this.rows))
	        throw new RangeError('Argument out of range.');
	    var l = indices.length, columns = this.columns,
	        X = new Matrix(endRow - startRow + 1, l);
	    for (var i = 0; i < l; i++) {
	        for (var j = startRow; j <= endRow; j++) {
	            if ((indices[i] < 0) || (indices[i] >= columns))
	                throw new RangeError('Argument out of range.');
	            X[j - startRow][i] = this[j][indices[i]];
	        }
	    }
	    return X;
	};

	/**
	 * Returns the trace of the matrix (sum of the diagonal elements)
	 * @returns {number}
	 */
	Matrix.prototype.trace = function trace() {
	    if (!this.isSquare())
	        throw new TypeError('The matrix is not square');
	    var trace = 0, i = 0, l = this.rows;
	    for (; i < l; i++) {
	        trace += this[i][i];
	    }
	    return trace;
	};

	/**
	 * Sets each element of the matrix to its absolute value
	 * @returns {Matrix} this
	 */
	Matrix.prototype.abs = function abs() {
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            this[i][j] = Math.abs(this[i][j]);
	        }
	    }
	};

	module.exports = Matrix;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Matrix = __webpack_require__(13);

	var SingularValueDecomposition = __webpack_require__(15);
	var EigenvalueDecomposition = __webpack_require__(17);
	var LuDecomposition = __webpack_require__(18);
	var QrDecomposition = __webpack_require__(19);
	var CholeskyDecomposition = __webpack_require__(20);

	function inverse(matrix) {
	    return solve(matrix, Matrix.eye(matrix.rows));
	}

	Matrix.prototype.inverse = function () {
	    return inverse(this);
	};

	function solve(leftHandSide, rightHandSide) {
	    return leftHandSide.isSquare() ? new LuDecomposition(leftHandSide).solve(rightHandSide) : new QrDecomposition(leftHandSide).solve(rightHandSide);
	}

	Matrix.prototype.solve = function (other) {
	    return solve(this, other);
	};

	module.exports = {
	    SingularValueDecomposition: SingularValueDecomposition,
	    SVD: SingularValueDecomposition,
	    EigenvalueDecomposition: EigenvalueDecomposition,
	    EVD: EigenvalueDecomposition,
	    LuDecomposition: LuDecomposition,
	    LU: LuDecomposition,
	    QrDecomposition: QrDecomposition,
	    QR: QrDecomposition,
	    CholeskyDecomposition: CholeskyDecomposition,
	    CHO: CholeskyDecomposition,
	    inverse: inverse,
	    solve: solve
	};


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Matrix = __webpack_require__(13);
	var hypotenuse = __webpack_require__(16).hypotenuse;

	// https://github.com/lutzroeder/Mapack/blob/master/Source/SingularValueDecomposition.cs
	function SingularValueDecomposition(value, options) {
	    if (!(this instanceof SingularValueDecomposition)) {
	        return new SingularValueDecomposition(value, options);
	    }
	    value = Matrix.checkMatrix(value);

	    options = options || {};

	    var a = value.clone(),
	        m = value.rows,
	        n = value.columns,
	        nu = Math.min(m, n);

	    var wantu = true, wantv = true;
	    if (options.computeLeftSingularVectors === false)
	        wantu = false;
	    if (options.computeRightSingularVectors === false)
	        wantv = false;
	    var autoTranspose = options.autoTranspose === true;

	    var swapped = false;
	    if (m < n) {
	        if (!autoTranspose) {
	            console.warn('Computing SVD on a matrix with more columns than rows. Consider enabling autoTranspose');
	        } else {
	            a = a.transpose();
	            m = a.rows;
	            n = a.columns;
	            swapped = true;
	            var aux = wantu;
	            wantu = wantv;
	            wantv = aux;
	        }
	    }

	    var s = new Array(Math.min(m + 1, n)),
	        U = Matrix.zeros(m, nu),
	        V = Matrix.zeros(n, n),
	        e = new Array(n),
	        work = new Array(m);

	    var nct = Math.min(m - 1, n);
	    var nrt = Math.max(0, Math.min(n - 2, m));

	    var i, j, k, p, t, ks, f, cs, sn, max, kase,
	        scale, sp, spm1, epm1, sk, ek, b, c, shift, g;

	    for (k = 0, max = Math.max(nct, nrt); k < max; k++) {
	        if (k < nct) {
	            s[k] = 0;
	            for (i = k; i < m; i++) {
	                s[k] = hypotenuse(s[k], a[i][k]);
	            }
	            if (s[k] !== 0) {
	                if (a[k][k] < 0) {
	                    s[k] = -s[k];
	                }
	                for (i = k; i < m; i++) {
	                    a[i][k] /= s[k];
	                }
	                a[k][k] += 1;
	            }
	            s[k] = -s[k];
	        }

	        for (j = k + 1; j < n; j++) {
	            if ((k < nct) && (s[k] !== 0)) {
	                t = 0;
	                for (i = k; i < m; i++) {
	                    t += a[i][k] * a[i][j];
	                }
	                t = -t / a[k][k];
	                for (i = k; i < m; i++) {
	                    a[i][j] += t * a[i][k];
	                }
	            }
	            e[j] = a[k][j];
	        }

	        if (wantu && (k < nct)) {
	            for (i = k; i < m; i++) {
	                U[i][k] = a[i][k];
	            }
	        }

	        if (k < nrt) {
	            e[k] = 0;
	            for (i = k + 1; i < n; i++) {
	                e[k] = hypotenuse(e[k], e[i]);
	            }
	            if (e[k] !== 0) {
	                if (e[k + 1] < 0)
	                    e[k] = -e[k];
	                for (i = k + 1; i < n; i++) {
	                    e[i] /= e[k];
	                }
	                e[k + 1] += 1;
	            }
	            e[k] = -e[k];
	            if ((k + 1 < m) && (e[k] !== 0)) {
	                for (i = k + 1; i < m; i++) {
	                    work[i] = 0;
	                }
	                for (j = k + 1; j < n; j++) {
	                    for (i = k + 1; i < m; i++) {
	                        work[i] += e[j] * a[i][j];
	                    }
	                }
	                for (j = k + 1; j < n; j++) {
	                    t = -e[j] / e[k + 1];
	                    for (i = k + 1; i < m; i++) {
	                        a[i][j] += t * work[i];
	                    }
	                }
	            }
	            if (wantv) {
	                for (i = k + 1; i < n; i++) {
	                    V[i][k] = e[i];
	                }
	            }
	        }
	    }

	    p = Math.min(n, m + 1);
	    if (nct < n) {
	        s[nct] = a[nct][nct];
	    }
	    if (m < p) {
	        s[p - 1] = 0;
	    }
	    if (nrt + 1 < p) {
	        e[nrt] = a[nrt][p - 1];
	    }
	    e[p - 1] = 0;

	    if (wantu) {
	        for (j = nct; j < nu; j++) {
	            for (i = 0; i < m; i++) {
	                U[i][j] = 0;
	            }
	            U[j][j] = 1;
	        }
	        for (k = nct - 1; k >= 0; k--) {
	            if (s[k] !== 0) {
	                for (j = k + 1; j < nu; j++) {
	                    t = 0;
	                    for (i = k; i < m; i++) {
	                        t += U[i][k] * U[i][j];
	                    }
	                    t = -t / U[k][k];
	                    for (i = k; i < m; i++) {
	                        U[i][j] += t * U[i][k];
	                    }
	                }
	                for (i = k; i < m; i++) {
	                    U[i][k] = -U[i][k];
	                }
	                U[k][k] = 1 + U[k][k];
	                for (i = 0; i < k - 1; i++) {
	                    U[i][k] = 0;
	                }
	            } else {
	                for (i = 0; i < m; i++) {
	                    U[i][k] = 0;
	                }
	                U[k][k] = 1;
	            }
	        }
	    }

	    if (wantv) {
	        for (k = n - 1; k >= 0; k--) {
	            if ((k < nrt) && (e[k] !== 0)) {
	                for (j = k + 1; j < n; j++) {
	                    t = 0;
	                    for (i = k + 1; i < n; i++) {
	                        t += V[i][k] * V[i][j];
	                    }
	                    t = -t / V[k + 1][k];
	                    for (i = k + 1; i < n; i++) {
	                        V[i][j] += t * V[i][k];
	                    }
	                }
	            }
	            for (i = 0; i < n; i++) {
	                V[i][k] = 0;
	            }
	            V[k][k] = 1;
	        }
	    }

	    var pp = p - 1,
	        iter = 0,
	        eps = Math.pow(2, -52);
	    while (p > 0) {
	        for (k = p - 2; k >= -1; k--) {
	            if (k === -1) {
	                break;
	            }
	            if (Math.abs(e[k]) <= eps * (Math.abs(s[k]) + Math.abs(s[k + 1]))) {
	                e[k] = 0;
	                break;
	            }
	        }
	        if (k === p - 2) {
	            kase = 4;
	        } else {
	            for (ks = p - 1; ks >= k; ks--) {
	                if (ks === k) {
	                    break;
	                }
	                t = (ks !== p ? Math.abs(e[ks]) : 0) + (ks !== k + 1 ? Math.abs(e[ks - 1]) : 0);
	                if (Math.abs(s[ks]) <= eps * t) {
	                    s[ks] = 0;
	                    break;
	                }
	            }
	            if (ks === k) {
	                kase = 3;
	            } else if (ks === p - 1) {
	                kase = 1;
	            } else {
	                kase = 2;
	                k = ks;
	            }
	        }

	        k++;

	        switch (kase) {
	            case 1: {
	                f = e[p - 2];
	                e[p - 2] = 0;
	                for (j = p - 2; j >= k; j--) {
	                    t = hypotenuse(s[j], f);
	                    cs = s[j] / t;
	                    sn = f / t;
	                    s[j] = t;
	                    if (j !== k) {
	                        f = -sn * e[j - 1];
	                        e[j - 1] = cs * e[j - 1];
	                    }
	                    if (wantv) {
	                        for (i = 0; i < n; i++) {
	                            t = cs * V[i][j] + sn * V[i][p - 1];
	                            V[i][p - 1] = -sn * V[i][j] + cs * V[i][p - 1];
	                            V[i][j] = t;
	                        }
	                    }
	                }
	                break;
	            }
	            case 2 : {
	                f = e[k - 1];
	                e[k - 1] = 0;
	                for (j = k; j < p; j++) {
	                    t = hypotenuse(s[j], f);
	                    cs = s[j] / t;
	                    sn = f / t;
	                    s[j] = t;
	                    f = -sn * e[j];
	                    e[j] = cs * e[j];
	                    if (wantu) {
	                        for (i = 0; i < m; i++) {
	                            t = cs * U[i][j] + sn * U[i][k - 1];
	                            U[i][k - 1] = -sn * U[i][j] + cs * U[i][k - 1];
	                            U[i][j] = t;
	                        }
	                    }
	                }
	                break;
	            }
	            case 3 : {
	                scale = Math.max(Math.max(Math.max(Math.max(Math.abs(s[p - 1]), Math.abs(s[p - 2])), Math.abs(e[p - 2])), Math.abs(s[k])), Math.abs(e[k]));
	                sp = s[p - 1] / scale;
	                spm1 = s[p - 2] / scale;
	                epm1 = e[p - 2] / scale;
	                sk = s[k] / scale;
	                ek = e[k] / scale;
	                b = ((spm1 + sp) * (spm1 - sp) + epm1 * epm1) / 2;
	                c = (sp * epm1) * (sp * epm1);
	                shift = 0;
	                if ((b !== 0) || (c !== 0)) {
	                    shift = Math.sqrt(b * b + c);
	                    if (b < 0) {
	                        shift = -shift;
	                    }
	                    shift = c / (b + shift);
	                }
	                f = (sk + sp) * (sk - sp) + shift;
	                g = sk * ek;
	                for (j = k; j < p - 1; j++) {
	                    t = hypotenuse(f, g);
	                    cs = f / t;
	                    sn = g / t;
	                    if (j !== k) {
	                        e[j - 1] = t;
	                    }
	                    f = cs * s[j] + sn * e[j];
	                    e[j] = cs * e[j] - sn * s[j];
	                    g = sn * s[j + 1];
	                    s[j + 1] = cs * s[j + 1];
	                    if (wantv) {
	                        for (i = 0; i < n; i++) {
	                            t = cs * V[i][j] + sn * V[i][j + 1];
	                            V[i][j + 1] = -sn * V[i][j] + cs * V[i][j + 1];
	                            V[i][j] = t;
	                        }
	                    }
	                    t = hypotenuse(f, g);
	                    cs = f / t;
	                    sn = g / t;
	                    s[j] = t;
	                    f = cs * e[j] + sn * s[j + 1];
	                    s[j + 1] = -sn * e[j] + cs * s[j + 1];
	                    g = sn * e[j + 1];
	                    e[j + 1] = cs * e[j + 1];
	                    if (wantu && (j < m - 1)) {
	                        for (i = 0; i < m; i++) {
	                            t = cs * U[i][j] + sn * U[i][j + 1];
	                            U[i][j + 1] = -sn * U[i][j] + cs * U[i][j + 1];
	                            U[i][j] = t;
	                        }
	                    }
	                }
	                e[p - 2] = f;
	                iter = iter + 1;
	                break;
	            }
	            case 4: {
	                if (s[k] <= 0) {
	                    s[k] = (s[k] < 0 ? -s[k] : 0);
	                    if (wantv) {
	                        for (i = 0; i <= pp; i++) {
	                            V[i][k] = -V[i][k];
	                        }
	                    }
	                }
	                while (k < pp) {
	                    if (s[k] >= s[k + 1]) {
	                        break;
	                    }
	                    t = s[k];
	                    s[k] = s[k + 1];
	                    s[k + 1] = t;
	                    if (wantv && (k < n - 1)) {
	                        for (i = 0; i < n; i++) {
	                            t = V[i][k + 1];
	                            V[i][k + 1] = V[i][k];
	                            V[i][k] = t;
	                        }
	                    }
	                    if (wantu && (k < m - 1)) {
	                        for (i = 0; i < m; i++) {
	                            t = U[i][k + 1];
	                            U[i][k + 1] = U[i][k];
	                            U[i][k] = t;
	                        }
	                    }
	                    k++;
	                }
	                iter = 0;
	                p--;
	                break;
	            }
	        }
	    }

	    if (swapped) {
	        var tmp = V;
	        V = U;
	        U = tmp;
	    }

	    this.m = m;
	    this.n = n;
	    this.s = s;
	    this.U = U;
	    this.V = V;
	}

	SingularValueDecomposition.prototype = {
	    get condition() {
	        return this.s[0] / this.s[Math.min(this.m, this.n) - 1];
	    },
	    get norm2() {
	        return this.s[0];
	    },
	    get rank() {
	        var eps = Math.pow(2, -52),
	            tol = Math.max(this.m, this.n) * this.s[0] * eps,
	            r = 0,
	            s = this.s;
	        for (var i = 0, ii = s.length; i < ii; i++) {
	            if (s[i] > tol) {
	                r++;
	            }
	        }
	        return r;
	    },
	    get diagonal() {
	        return this.s;
	    },
	    // https://github.com/accord-net/framework/blob/development/Sources/Accord.Math/Decompositions/SingularValueDecomposition.cs
	    get threshold() {
	        return (Math.pow(2, -52) / 2) * Math.max(this.m, this.n) * this.s[0];
	    },
	    get leftSingularVectors() {
	        return this.U;
	    },
	    get rightSingularVectors() {
	        return this.V;
	    },
	    get diagonalMatrix() {
	        return Matrix.diag(this.s);
	    },
	    solve: function (value) {

	        var Y = value,
	            e = this.threshold,
	            scols = this.s.length,
	            Ls = Matrix.zeros(scols, scols),
	            i;

	        for (i = 0; i < scols; i++) {
	            if (Math.abs(this.s[i]) <= e) {
	                Ls[i][i] = 0;
	            } else {
	                Ls[i][i] = 1 / this.s[i];
	            }
	        }


	        var VL = this.V.mmul(Ls),
	            vrows = this.V.rows,
	            urows = this.U.rows,
	            VLU = Matrix.zeros(vrows, urows),
	            j, k, sum;

	        for (i = 0; i < vrows; i++) {
	            for (j = 0; j < urows; j++) {
	                sum = 0;
	                for (k = 0; k < scols; k++) {
	                    sum += VL[i][k] * this.U[j][k];
	                }
	                VLU[i][j] = sum;
	            }
	        }

	        return VLU.mmul(Y);
	    },
	    solveForDiagonal: function (value) {
	        return this.solve(Matrix.diag(value));
	    },
	    inverse: function () {
	        var e = this.threshold,
	            vrows = this.V.rows,
	            vcols = this.V.columns,
	            X = new Matrix(vrows, this.s.length),
	            i, j;

	        for (i = 0; i < vrows; i++) {
	            for (j = 0; j < vcols; j++) {
	                if (Math.abs(this.s[j]) > e) {
	                    X[i][j] = this.V[i][j] / this.s[j];
	                } else {
	                    X[i][j] = 0;
	                }
	            }
	        }

	        var urows = this.U.rows,
	            ucols = this.U.columns,
	            Y = new Matrix(vrows, urows),
	            k, sum;

	        for (i = 0; i < vrows; i++) {
	            for (j = 0; j < urows; j++) {
	                sum = 0;
	                for (k = 0; k < ucols; k++) {
	                    sum += X[i][k] * this.U[j][k];
	                }
	                Y[i][j] = sum;
	            }
	        }

	        return Y;
	    }
	};

	module.exports = SingularValueDecomposition;


/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';

	exports.hypotenuse = function hypotenuse(a, b) {
	    var r;
	    if (Math.abs(a) > Math.abs(b)) {
	        r = b / a;
	        return Math.abs(a) * Math.sqrt(1 + r * r);
	    }
	    if (b !== 0) {
	        r = a / b;
	        return Math.abs(b) * Math.sqrt(1 + r * r);
	    }
	    return 0;
	};


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Matrix = __webpack_require__(13);
	var hypotenuse = __webpack_require__(16).hypotenuse;

	// https://github.com/lutzroeder/Mapack/blob/master/Source/EigenvalueDecomposition.cs
	function EigenvalueDecomposition(matrix) {
	    if (!(this instanceof EigenvalueDecomposition)) {
	        return new EigenvalueDecomposition(matrix);
	    }
	    matrix = Matrix.checkMatrix(matrix);
	    if (!matrix.isSquare()) {
	        throw new Error('Matrix is not a square matrix');
	    }

	    var n = matrix.columns,
	        V = Matrix.zeros(n, n),
	        d = new Array(n),
	        e = new Array(n),
	        value = matrix,
	        i, j;

	    if (matrix.isSymmetric()) {
	        for (i = 0; i < n; i++) {
	            for (j = 0; j < n; j++) {
	                V[i][j] = value[i][j];
	            }
	        }
	        tred2(n, e, d, V);
	        tql2(n, e, d, V);
	    }
	    else {
	        var H = Matrix.zeros(n, n),
	            ort = new Array(n);
	        for (j = 0; j < n; j++) {
	            for (i = 0; i < n; i++) {
	                H[i][j] = value[i][j];
	            }
	        }
	        orthes(n, H, ort, V);
	        hqr2(n, e, d, V, H);
	    }

	    this.n = n;
	    this.e = e;
	    this.d = d;
	    this.V = V;
	}

	EigenvalueDecomposition.prototype = {
	    get realEigenvalues() {
	        return this.d;
	    },
	    get imaginaryEigenvalues() {
	        return this.e;
	    },
	    get eigenvectorMatrix() {
	        return this.V;
	    },
	    get diagonalMatrix() {
	        var n = this.n,
	            e = this.e,
	            d = this.d,
	            X = new Matrix(n, n),
	            i, j;
	        for (i = 0; i < n; i++) {
	            for (j = 0; j < n; j++) {
	                X[i][j] = 0;
	            }
	            X[i][i] = d[i];
	            if (e[i] > 0) {
	                X[i][i + 1] = e[i];
	            }
	            else if (e[i] < 0) {
	                X[i][i - 1] = e[i];
	            }
	        }
	        return X;
	    }
	};

	function tred2(n, e, d, V) {

	    var f, g, h, i, j, k,
	        hh, scale;

	    for (j = 0; j < n; j++) {
	        d[j] = V[n - 1][j];
	    }

	    for (i = n - 1; i > 0; i--) {
	        scale = 0;
	        h = 0;
	        for (k = 0; k < i; k++) {
	            scale = scale + Math.abs(d[k]);
	        }

	        if (scale === 0) {
	            e[i] = d[i - 1];
	            for (j = 0; j < i; j++) {
	                d[j] = V[i - 1][j];
	                V[i][j] = 0;
	                V[j][i] = 0;
	            }
	        } else {
	            for (k = 0; k < i; k++) {
	                d[k] /= scale;
	                h += d[k] * d[k];
	            }

	            f = d[i - 1];
	            g = Math.sqrt(h);
	            if (f > 0) {
	                g = -g;
	            }

	            e[i] = scale * g;
	            h = h - f * g;
	            d[i - 1] = f - g;
	            for (j = 0; j < i; j++) {
	                e[j] = 0;
	            }

	            for (j = 0; j < i; j++) {
	                f = d[j];
	                V[j][i] = f;
	                g = e[j] + V[j][j] * f;
	                for (k = j + 1; k <= i - 1; k++) {
	                    g += V[k][j] * d[k];
	                    e[k] += V[k][j] * f;
	                }
	                e[j] = g;
	            }

	            f = 0;
	            for (j = 0; j < i; j++) {
	                e[j] /= h;
	                f += e[j] * d[j];
	            }

	            hh = f / (h + h);
	            for (j = 0; j < i; j++) {
	                e[j] -= hh * d[j];
	            }

	            for (j = 0; j < i; j++) {
	                f = d[j];
	                g = e[j];
	                for (k = j; k <= i - 1; k++) {
	                    V[k][j] -= (f * e[k] + g * d[k]);
	                }
	                d[j] = V[i - 1][j];
	                V[i][j] = 0;
	            }
	        }
	        d[i] = h;
	    }

	    for (i = 0; i < n - 1; i++) {
	        V[n - 1][i] = V[i][i];
	        V[i][i] = 1;
	        h = d[i + 1];
	        if (h !== 0) {
	            for (k = 0; k <= i; k++) {
	                d[k] = V[k][i + 1] / h;
	            }

	            for (j = 0; j <= i; j++) {
	                g = 0;
	                for (k = 0; k <= i; k++) {
	                    g += V[k][i + 1] * V[k][j];
	                }
	                for (k = 0; k <= i; k++) {
	                    V[k][j] -= g * d[k];
	                }
	            }
	        }

	        for (k = 0; k <= i; k++) {
	            V[k][i + 1] = 0;
	        }
	    }

	    for (j = 0; j < n; j++) {
	        d[j] = V[n - 1][j];
	        V[n - 1][j] = 0;
	    }

	    V[n - 1][n - 1] = 1;
	    e[0] = 0;
	}

	function tql2(n, e, d, V) {

	    var g, h, i, j, k, l, m, p, r,
	        dl1, c, c2, c3, el1, s, s2,
	        iter;

	    for (i = 1; i < n; i++) {
	        e[i - 1] = e[i];
	    }

	    e[n - 1] = 0;

	    var f = 0,
	        tst1 = 0,
	        eps = Math.pow(2, -52);

	    for (l = 0; l < n; l++) {
	        tst1 = Math.max(tst1, Math.abs(d[l]) + Math.abs(e[l]));
	        m = l;
	        while (m < n) {
	            if (Math.abs(e[m]) <= eps * tst1) {
	                break;
	            }
	            m++;
	        }

	        if (m > l) {
	            iter = 0;
	            do {
	                iter = iter + 1;

	                g = d[l];
	                p = (d[l + 1] - g) / (2 * e[l]);
	                r = hypotenuse(p, 1);
	                if (p < 0) {
	                    r = -r;
	                }

	                d[l] = e[l] / (p + r);
	                d[l + 1] = e[l] * (p + r);
	                dl1 = d[l + 1];
	                h = g - d[l];
	                for (i = l + 2; i < n; i++) {
	                    d[i] -= h;
	                }

	                f = f + h;

	                p = d[m];
	                c = 1;
	                c2 = c;
	                c3 = c;
	                el1 = e[l + 1];
	                s = 0;
	                s2 = 0;
	                for (i = m - 1; i >= l; i--) {
	                    c3 = c2;
	                    c2 = c;
	                    s2 = s;
	                    g = c * e[i];
	                    h = c * p;
	                    r = hypotenuse(p, e[i]);
	                    e[i + 1] = s * r;
	                    s = e[i] / r;
	                    c = p / r;
	                    p = c * d[i] - s * g;
	                    d[i + 1] = h + s * (c * g + s * d[i]);

	                    for (k = 0; k < n; k++) {
	                        h = V[k][i + 1];
	                        V[k][i + 1] = s * V[k][i] + c * h;
	                        V[k][i] = c * V[k][i] - s * h;
	                    }
	                }

	                p = -s * s2 * c3 * el1 * e[l] / dl1;
	                e[l] = s * p;
	                d[l] = c * p;

	            }
	            while (Math.abs(e[l]) > eps * tst1);
	        }
	        d[l] = d[l] + f;
	        e[l] = 0;
	    }

	    for (i = 0; i < n - 1; i++) {
	        k = i;
	        p = d[i];
	        for (j = i + 1; j < n; j++) {
	            if (d[j] < p) {
	                k = j;
	                p = d[j];
	            }
	        }

	        if (k !== i) {
	            d[k] = d[i];
	            d[i] = p;
	            for (j = 0; j < n; j++) {
	                p = V[j][i];
	                V[j][i] = V[j][k];
	                V[j][k] = p;
	            }
	        }
	    }
	}

	function orthes(n, H, ort, V) {

	    var low = 0,
	        high = n - 1,
	        f, g, h, i, j, m,
	        scale;

	    for (m = low + 1; m <= high - 1; m++) {
	        scale = 0;
	        for (i = m; i <= high; i++) {
	            scale = scale + Math.abs(H[i][m - 1]);
	        }

	        if (scale !== 0) {
	            h = 0;
	            for (i = high; i >= m; i--) {
	                ort[i] = H[i][m - 1] / scale;
	                h += ort[i] * ort[i];
	            }

	            g = Math.sqrt(h);
	            if (ort[m] > 0) {
	                g = -g;
	            }

	            h = h - ort[m] * g;
	            ort[m] = ort[m] - g;

	            for (j = m; j < n; j++) {
	                f = 0;
	                for (i = high; i >= m; i--) {
	                    f += ort[i] * H[i][j];
	                }

	                f = f / h;
	                for (i = m; i <= high; i++) {
	                    H[i][j] -= f * ort[i];
	                }
	            }

	            for (i = 0; i <= high; i++) {
	                f = 0;
	                for (j = high; j >= m; j--) {
	                    f += ort[j] * H[i][j];
	                }

	                f = f / h;
	                for (j = m; j <= high; j++) {
	                    H[i][j] -= f * ort[j];
	                }
	            }

	            ort[m] = scale * ort[m];
	            H[m][m - 1] = scale * g;
	        }
	    }

	    for (i = 0; i < n; i++) {
	        for (j = 0; j < n; j++) {
	            V[i][j] = (i === j ? 1 : 0);
	        }
	    }

	    for (m = high - 1; m >= low + 1; m--) {
	        if (H[m][m - 1] !== 0) {
	            for (i = m + 1; i <= high; i++) {
	                ort[i] = H[i][m - 1];
	            }

	            for (j = m; j <= high; j++) {
	                g = 0;
	                for (i = m; i <= high; i++) {
	                    g += ort[i] * V[i][j];
	                }

	                g = (g / ort[m]) / H[m][m - 1];
	                for (i = m; i <= high; i++) {
	                    V[i][j] += g * ort[i];
	                }
	            }
	        }
	    }
	}

	function hqr2(nn, e, d, V, H) {
	    var n = nn - 1,
	        low = 0,
	        high = nn - 1,
	        eps = Math.pow(2, -52),
	        exshift = 0,
	        norm = 0,
	        p = 0,
	        q = 0,
	        r = 0,
	        s = 0,
	        z = 0,
	        iter = 0,
	        i, j, k, l, m, t, w, x, y,
	        ra, sa, vr, vi,
	        notlast, cdivres;

	    for (i = 0; i < nn; i++) {
	        if (i < low || i > high) {
	            d[i] = H[i][i];
	            e[i] = 0;
	        }

	        for (j = Math.max(i - 1, 0); j < nn; j++) {
	            norm = norm + Math.abs(H[i][j]);
	        }
	    }

	    while (n >= low) {
	        l = n;
	        while (l > low) {
	            s = Math.abs(H[l - 1][l - 1]) + Math.abs(H[l][l]);
	            if (s === 0) {
	                s = norm;
	            }
	            if (Math.abs(H[l][l - 1]) < eps * s) {
	                break;
	            }
	            l--;
	        }

	        if (l === n) {
	            H[n][n] = H[n][n] + exshift;
	            d[n] = H[n][n];
	            e[n] = 0;
	            n--;
	            iter = 0;
	        } else if (l === n - 1) {
	            w = H[n][n - 1] * H[n - 1][n];
	            p = (H[n - 1][n - 1] - H[n][n]) / 2;
	            q = p * p + w;
	            z = Math.sqrt(Math.abs(q));
	            H[n][n] = H[n][n] + exshift;
	            H[n - 1][n - 1] = H[n - 1][n - 1] + exshift;
	            x = H[n][n];

	            if (q >= 0) {
	                z = (p >= 0) ? (p + z) : (p - z);
	                d[n - 1] = x + z;
	                d[n] = d[n - 1];
	                if (z !== 0) {
	                    d[n] = x - w / z;
	                }
	                e[n - 1] = 0;
	                e[n] = 0;
	                x = H[n][n - 1];
	                s = Math.abs(x) + Math.abs(z);
	                p = x / s;
	                q = z / s;
	                r = Math.sqrt(p * p + q * q);
	                p = p / r;
	                q = q / r;

	                for (j = n - 1; j < nn; j++) {
	                    z = H[n - 1][j];
	                    H[n - 1][j] = q * z + p * H[n][j];
	                    H[n][j] = q * H[n][j] - p * z;
	                }

	                for (i = 0; i <= n; i++) {
	                    z = H[i][n - 1];
	                    H[i][n - 1] = q * z + p * H[i][n];
	                    H[i][n] = q * H[i][n] - p * z;
	                }

	                for (i = low; i <= high; i++) {
	                    z = V[i][n - 1];
	                    V[i][n - 1] = q * z + p * V[i][n];
	                    V[i][n] = q * V[i][n] - p * z;
	                }
	            } else {
	                d[n - 1] = x + p;
	                d[n] = x + p;
	                e[n - 1] = z;
	                e[n] = -z;
	            }

	            n = n - 2;
	            iter = 0;
	        } else {
	            x = H[n][n];
	            y = 0;
	            w = 0;
	            if (l < n) {
	                y = H[n - 1][n - 1];
	                w = H[n][n - 1] * H[n - 1][n];
	            }

	            if (iter === 10) {
	                exshift += x;
	                for (i = low; i <= n; i++) {
	                    H[i][i] -= x;
	                }
	                s = Math.abs(H[n][n - 1]) + Math.abs(H[n - 1][n - 2]);
	                x = y = 0.75 * s;
	                w = -0.4375 * s * s;
	            }

	            if (iter === 30) {
	                s = (y - x) / 2;
	                s = s * s + w;
	                if (s > 0) {
	                    s = Math.sqrt(s);
	                    if (y < x) {
	                        s = -s;
	                    }
	                    s = x - w / ((y - x) / 2 + s);
	                    for (i = low; i <= n; i++) {
	                        H[i][i] -= s;
	                    }
	                    exshift += s;
	                    x = y = w = 0.964;
	                }
	            }

	            iter = iter + 1;

	            m = n - 2;
	            while (m >= l) {
	                z = H[m][m];
	                r = x - z;
	                s = y - z;
	                p = (r * s - w) / H[m + 1][m] + H[m][m + 1];
	                q = H[m + 1][m + 1] - z - r - s;
	                r = H[m + 2][m + 1];
	                s = Math.abs(p) + Math.abs(q) + Math.abs(r);
	                p = p / s;
	                q = q / s;
	                r = r / s;
	                if (m === l) {
	                    break;
	                }
	                if (Math.abs(H[m][m - 1]) * (Math.abs(q) + Math.abs(r)) < eps * (Math.abs(p) * (Math.abs(H[m - 1][m - 1]) + Math.abs(z) + Math.abs(H[m + 1][m + 1])))) {
	                    break;
	                }
	                m--;
	            }

	            for (i = m + 2; i <= n; i++) {
	                H[i][i - 2] = 0;
	                if (i > m + 2) {
	                    H[i][i - 3] = 0;
	                }
	            }

	            for (k = m; k <= n - 1; k++) {
	                notlast = (k !== n - 1);
	                if (k !== m) {
	                    p = H[k][k - 1];
	                    q = H[k + 1][k - 1];
	                    r = (notlast ? H[k + 2][k - 1] : 0);
	                    x = Math.abs(p) + Math.abs(q) + Math.abs(r);
	                    if (x !== 0) {
	                        p = p / x;
	                        q = q / x;
	                        r = r / x;
	                    }
	                }

	                if (x === 0) {
	                    break;
	                }

	                s = Math.sqrt(p * p + q * q + r * r);
	                if (p < 0) {
	                    s = -s;
	                }

	                if (s !== 0) {
	                    if (k !== m) {
	                        H[k][k - 1] = -s * x;
	                    } else if (l !== m) {
	                        H[k][k - 1] = -H[k][k - 1];
	                    }

	                    p = p + s;
	                    x = p / s;
	                    y = q / s;
	                    z = r / s;
	                    q = q / p;
	                    r = r / p;

	                    for (j = k; j < nn; j++) {
	                        p = H[k][j] + q * H[k + 1][j];
	                        if (notlast) {
	                            p = p + r * H[k + 2][j];
	                            H[k + 2][j] = H[k + 2][j] - p * z;
	                        }

	                        H[k][j] = H[k][j] - p * x;
	                        H[k + 1][j] = H[k + 1][j] - p * y;
	                    }

	                    for (i = 0; i <= Math.min(n, k + 3); i++) {
	                        p = x * H[i][k] + y * H[i][k + 1];
	                        if (notlast) {
	                            p = p + z * H[i][k + 2];
	                            H[i][k + 2] = H[i][k + 2] - p * r;
	                        }

	                        H[i][k] = H[i][k] - p;
	                        H[i][k + 1] = H[i][k + 1] - p * q;
	                    }

	                    for (i = low; i <= high; i++) {
	                        p = x * V[i][k] + y * V[i][k + 1];
	                        if (notlast) {
	                            p = p + z * V[i][k + 2];
	                            V[i][k + 2] = V[i][k + 2] - p * r;
	                        }

	                        V[i][k] = V[i][k] - p;
	                        V[i][k + 1] = V[i][k + 1] - p * q;
	                    }
	                }
	            }
	        }
	    }

	    if (norm === 0) {
	        return;
	    }

	    for (n = nn - 1; n >= 0; n--) {
	        p = d[n];
	        q = e[n];

	        if (q === 0) {
	            l = n;
	            H[n][n] = 1;
	            for (i = n - 1; i >= 0; i--) {
	                w = H[i][i] - p;
	                r = 0;
	                for (j = l; j <= n; j++) {
	                    r = r + H[i][j] * H[j][n];
	                }

	                if (e[i] < 0) {
	                    z = w;
	                    s = r;
	                } else {
	                    l = i;
	                    if (e[i] === 0) {
	                        H[i][n] = (w !== 0) ? (-r / w) : (-r / (eps * norm));
	                    } else {
	                        x = H[i][i + 1];
	                        y = H[i + 1][i];
	                        q = (d[i] - p) * (d[i] - p) + e[i] * e[i];
	                        t = (x * s - z * r) / q;
	                        H[i][n] = t;
	                        H[i + 1][n] = (Math.abs(x) > Math.abs(z)) ? ((-r - w * t) / x) : ((-s - y * t) / z);
	                    }

	                    t = Math.abs(H[i][n]);
	                    if ((eps * t) * t > 1) {
	                        for (j = i; j <= n; j++) {
	                            H[j][n] = H[j][n] / t;
	                        }
	                    }
	                }
	            }
	        } else if (q < 0) {
	            l = n - 1;

	            if (Math.abs(H[n][n - 1]) > Math.abs(H[n - 1][n])) {
	                H[n - 1][n - 1] = q / H[n][n - 1];
	                H[n - 1][n] = -(H[n][n] - p) / H[n][n - 1];
	            } else {
	                cdivres = cdiv(0, -H[n - 1][n], H[n - 1][n - 1] - p, q);
	                H[n - 1][n - 1] = cdivres[0];
	                H[n - 1][n] = cdivres[1];
	            }

	            H[n][n - 1] = 0;
	            H[n][n] = 1;
	            for (i = n - 2; i >= 0; i--) {
	                ra = 0;
	                sa = 0;
	                for (j = l; j <= n; j++) {
	                    ra = ra + H[i][j] * H[j][n - 1];
	                    sa = sa + H[i][j] * H[j][n];
	                }

	                w = H[i][i] - p;

	                if (e[i] < 0) {
	                    z = w;
	                    r = ra;
	                    s = sa;
	                } else {
	                    l = i;
	                    if (e[i] === 0) {
	                        cdivres = cdiv(-ra, -sa, w, q);
	                        H[i][n - 1] = cdivres[0];
	                        H[i][n] = cdivres[1];
	                    } else {
	                        x = H[i][i + 1];
	                        y = H[i + 1][i];
	                        vr = (d[i] - p) * (d[i] - p) + e[i] * e[i] - q * q;
	                        vi = (d[i] - p) * 2 * q;
	                        if (vr === 0 && vi === 0) {
	                            vr = eps * norm * (Math.abs(w) + Math.abs(q) + Math.abs(x) + Math.abs(y) + Math.abs(z));
	                        }
	                        cdivres = cdiv(x * r - z * ra + q * sa, x * s - z * sa - q * ra, vr, vi);
	                        H[i][n - 1] = cdivres[0];
	                        H[i][n] = cdivres[1];
	                        if (Math.abs(x) > (Math.abs(z) + Math.abs(q))) {
	                            H[i + 1][n - 1] = (-ra - w * H[i][n - 1] + q * H[i][n]) / x;
	                            H[i + 1][n] = (-sa - w * H[i][n] - q * H[i][n - 1]) / x;
	                        } else {
	                            cdivres = cdiv(-r - y * H[i][n - 1], -s - y * H[i][n], z, q);
	                            H[i + 1][n - 1] = cdivres[0];
	                            H[i + 1][n] = cdivres[1];
	                        }
	                    }

	                    t = Math.max(Math.abs(H[i][n - 1]), Math.abs(H[i][n]));
	                    if ((eps * t) * t > 1) {
	                        for (j = i; j <= n; j++) {
	                            H[j][n - 1] = H[j][n - 1] / t;
	                            H[j][n] = H[j][n] / t;
	                        }
	                    }
	                }
	            }
	        }
	    }

	    for (i = 0; i < nn; i++) {
	        if (i < low || i > high) {
	            for (j = i; j < nn; j++) {
	                V[i][j] = H[i][j];
	            }
	        }
	    }

	    for (j = nn - 1; j >= low; j--) {
	        for (i = low; i <= high; i++) {
	            z = 0;
	            for (k = low; k <= Math.min(j, high); k++) {
	                z = z + V[i][k] * H[k][j];
	            }
	            V[i][j] = z;
	        }
	    }
	}

	function cdiv(xr, xi, yr, yi) {
	    var r, d;
	    if (Math.abs(yr) > Math.abs(yi)) {
	        r = yi / yr;
	        d = yr + r * yi;
	        return [(xr + r * xi) / d, (xi - r * xr) / d];
	    }
	    else {
	        r = yr / yi;
	        d = yi + r * yr;
	        return [(r * xr + xi) / d, (r * xi - xr) / d];
	    }
	}

	module.exports = EigenvalueDecomposition;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Matrix = __webpack_require__(13);

	// https://github.com/lutzroeder/Mapack/blob/master/Source/LuDecomposition.cs
	function LuDecomposition(matrix) {
	    if (!(this instanceof LuDecomposition)) {
	        return new LuDecomposition(matrix);
	    }
	    matrix = Matrix.checkMatrix(matrix);

	    var lu = matrix.clone(),
	        rows = lu.rows,
	        columns = lu.columns,
	        pivotVector = new Array(rows),
	        pivotSign = 1,
	        i, j, k, p, s, t, v,
	        LUrowi, LUcolj, kmax;

	    for (i = 0; i < rows; i++) {
	        pivotVector[i] = i;
	    }

	    LUcolj = new Array(rows);

	    for (j = 0; j < columns; j++) {

	        for (i = 0; i < rows; i++) {
	            LUcolj[i] = lu[i][j];
	        }

	        for (i = 0; i < rows; i++) {
	            LUrowi = lu[i];
	            kmax = Math.min(i, j);
	            s = 0;
	            for (k = 0; k < kmax; k++) {
	                s += LUrowi[k] * LUcolj[k];
	            }
	            LUrowi[j] = LUcolj[i] -= s;
	        }

	        p = j;
	        for (i = j + 1; i < rows; i++) {
	            if (Math.abs(LUcolj[i]) > Math.abs(LUcolj[p])) {
	                p = i;
	            }
	        }

	        if (p !== j) {
	            for (k = 0; k < columns; k++) {
	                t = lu[p][k];
	                lu[p][k] = lu[j][k];
	                lu[j][k] = t;
	            }

	            v = pivotVector[p];
	            pivotVector[p] = pivotVector[j];
	            pivotVector[j] = v;

	            pivotSign = -pivotSign;
	        }

	        if (j < rows && lu[j][j] !== 0) {
	            for (i = j + 1; i < rows; i++) {
	                lu[i][j] /= lu[j][j];
	            }
	        }
	    }

	    this.LU = lu;
	    this.pivotVector = pivotVector;
	    this.pivotSign = pivotSign;
	}

	LuDecomposition.prototype = {
	    isSingular: function () {
	        var data = this.LU,
	            col = data.columns;
	        for (var j = 0; j < col; j++) {
	            if (data[j][j] === 0) {
	                return true;
	            }
	        }
	        return false;
	    },
	    get determinant() {
	        var data = this.LU;
	        if (!data.isSquare())
	            throw new Error('Matrix must be square');
	        var determinant = this.pivotSign, col = data.columns;
	        for (var j = 0; j < col; j++)
	            determinant *= data[j][j];
	        return determinant;
	    },
	    get lowerTriangularFactor() {
	        var data = this.LU,
	            rows = data.rows,
	            columns = data.columns,
	            X = new Matrix(rows, columns);
	        for (var i = 0; i < rows; i++) {
	            for (var j = 0; j < columns; j++) {
	                if (i > j) {
	                    X[i][j] = data[i][j];
	                } else if (i === j) {
	                    X[i][j] = 1;
	                } else {
	                    X[i][j] = 0;
	                }
	            }
	        }
	        return X;
	    },
	    get upperTriangularFactor() {
	        var data = this.LU,
	            rows = data.rows,
	            columns = data.columns,
	            X = new Matrix(rows, columns);
	        for (var i = 0; i < rows; i++) {
	            for (var j = 0; j < columns; j++) {
	                if (i <= j) {
	                    X[i][j] = data[i][j];
	                } else {
	                    X[i][j] = 0;
	                }
	            }
	        }
	        return X;
	    },
	    get pivotPermutationVector() {
	        return this.pivotVector.slice();
	    },
	    solve: function (value) {
	        value = Matrix.checkMatrix(value);

	        var lu = this.LU,
	            rows = lu.rows;

	        if (rows !== value.rows)
	            throw new Error('Invalid matrix dimensions');
	        if (this.isSingular())
	            throw new Error('LU matrix is singular');

	        var count = value.columns,
	            X = value.subMatrixRow(this.pivotVector, 0, count - 1),
	            columns = lu.columns,
	            i, j, k;

	        for (k = 0; k < columns; k++) {
	            for (i = k + 1; i < columns; i++) {
	                for (j = 0; j < count; j++) {
	                    X[i][j] -= X[k][j] * lu[i][k];
	                }
	            }
	        }
	        for (k = columns - 1; k >= 0; k--) {
	            for (j = 0; j < count; j++) {
	                X[k][j] /= lu[k][k];
	            }
	            for (i = 0; i < k; i++) {
	                for (j = 0; j < count; j++) {
	                    X[i][j] -= X[k][j] * lu[i][k];
	                }
	            }
	        }
	        return X;
	    }
	};

	module.exports = LuDecomposition;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Matrix = __webpack_require__(13);
	var hypotenuse = __webpack_require__(16).hypotenuse;

	//https://github.com/lutzroeder/Mapack/blob/master/Source/QrDecomposition.cs
	function QrDecomposition(value) {
	    if (!(this instanceof QrDecomposition)) {
	        return new QrDecomposition(value);
	    }
	    value = Matrix.checkMatrix(value);

	    var qr = value.clone(),
	        m = value.rows,
	        n = value.columns,
	        rdiag = new Array(n),
	        i, j, k, s;

	    for (k = 0; k < n; k++) {
	        var nrm = 0;
	        for (i = k; i < m; i++) {
	            nrm = hypotenuse(nrm, qr[i][k]);
	        }
	        if (nrm !== 0) {
	            if (qr[k][k] < 0) {
	                nrm = -nrm;
	            }
	            for (i = k; i < m; i++) {
	                qr[i][k] /= nrm;
	            }
	            qr[k][k] += 1;
	            for (j = k + 1; j < n; j++) {
	                s = 0;
	                for (i = k; i < m; i++) {
	                    s += qr[i][k] * qr[i][j];
	                }
	                s = -s / qr[k][k];
	                for (i = k; i < m; i++) {
	                    qr[i][j] += s * qr[i][k];
	                }
	            }
	        }
	        rdiag[k] = -nrm;
	    }

	    this.QR = qr;
	    this.Rdiag = rdiag;
	}

	QrDecomposition.prototype = {
	    solve: function (value) {
	        value = Matrix.checkMatrix(value);

	        var qr = this.QR,
	            m = qr.rows;

	        if (value.rows !== m)
	            throw new Error('Matrix row dimensions must agree');
	        if (!this.isFullRank())
	            throw new Error('Matrix is rank deficient');

	        var count = value.columns,
	            X = value.clone(),
	            n = qr.columns,
	            i, j, k, s;

	        for (k = 0; k < n; k++) {
	            for (j = 0; j < count; j++) {
	                s = 0;
	                for (i = k; i < m; i++) {
	                    s += qr[i][k] * X[i][j];
	                }
	                s = -s / qr[k][k];
	                for (i = k; i < m; i++) {
	                    X[i][j] += s * qr[i][k];
	                }
	            }
	        }
	        for (k = n - 1; k >= 0; k--) {
	            for (j = 0; j < count; j++) {
	                X[k][j] /= this.Rdiag[k];
	            }
	            for (i = 0; i < k; i++) {
	                for (j = 0; j < count; j++) {
	                    X[i][j] -= X[k][j] * qr[i][k];
	                }
	            }
	        }

	        return X.subMatrix(0, n - 1, 0, count - 1);
	    },
	    isFullRank: function () {
	        var columns = this.QR.columns;
	        for (var i = 0; i < columns; i++) {
	            if (this.Rdiag[i] === 0) {
	                return false;
	            }
	        }
	        return true;
	    },
	    get upperTriangularFactor() {
	        var qr = this.QR,
	            n = qr.columns,
	            X = new Matrix(n, n),
	            i, j;
	        for (i = 0; i < n; i++) {
	            for (j = 0; j < n; j++) {
	                if (i < j) {
	                    X[i][j] = qr[i][j];
	                } else if (i === j) {
	                    X[i][j] = this.Rdiag[i];
	                } else {
	                    X[i][j] = 0;
	                }
	            }
	        }
	        return X;
	    },
	    get orthogonalFactor() {
	        var qr = this.QR,
	            rows = qr.rows,
	            columns = qr.columns,
	            X = new Matrix(rows, columns),
	            i, j, k, s;

	        for (k = columns - 1; k >= 0; k--) {
	            for (i = 0; i < rows; i++) {
	                X[i][k] = 0;
	            }
	            X[k][k] = 1;
	            for (j = k; j < columns; j++) {
	                if (qr[k][k] !== 0) {
	                    s = 0;
	                    for (i = k; i < rows; i++) {
	                        s += qr[i][k] * X[i][j];
	                    }

	                    s = -s / qr[k][k];

	                    for (i = k; i < rows; i++) {
	                        X[i][j] += s * qr[i][k];
	                    }
	                }
	            }
	        }
	        return X;
	    }
	};

	module.exports = QrDecomposition;


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Matrix = __webpack_require__(13);

	// https://github.com/lutzroeder/Mapack/blob/master/Source/CholeskyDecomposition.cs
	function CholeskyDecomposition(value) {
	    if (!(this instanceof CholeskyDecomposition)) {
	        return new CholeskyDecomposition(value);
	    }
	    value = Matrix.checkMatrix(value);
	    if (!value.isSymmetric())
	        throw new Error('Matrix is not symmetric');

	    var a = value,
	        dimension = a.rows,
	        l = new Matrix(dimension, dimension),
	        positiveDefinite = true,
	        i, j, k;

	    for (j = 0; j < dimension; j++) {
	        var Lrowj = l[j];
	        var d = 0;
	        for (k = 0; k < j; k++) {
	            var Lrowk = l[k];
	            var s = 0;
	            for (i = 0; i < k; i++) {
	                s += Lrowk[i] * Lrowj[i];
	            }
	            Lrowj[k] = s = (a[j][k] - s) / l[k][k];
	            d = d + s * s;
	        }

	        d = a[j][j] - d;

	        positiveDefinite &= (d > 0);
	        l[j][j] = Math.sqrt(Math.max(d, 0));
	        for (k = j + 1; k < dimension; k++) {
	            l[j][k] = 0;
	        }
	    }

	    if (!positiveDefinite) {
	        throw new Error('Matrix is not positive definite');
	    }

	    this.L = l;
	}

	CholeskyDecomposition.prototype = {
	    get leftTriangularFactor() {
	        return this.L;
	    },
	    solve: function (value) {
	        value = Matrix.checkMatrix(value);

	        var l = this.L,
	            dimension = l.rows;

	        if (value.rows !== dimension) {
	            throw new Error('Matrix dimensions do not match');
	        }

	        var count = value.columns,
	            B = value.clone(),
	            i, j, k;

	        for (k = 0; k < dimension; k++) {
	            for (j = 0; j < count; j++) {
	                for (i = 0; i < k; i++) {
	                    B[k][j] -= B[i][j] * l[k][i];
	                }
	                B[k][j] /= l[k][k];
	            }
	        }

	        for (k = dimension - 1; k >= 0; k--) {
	            for (j = 0; j < count; j++) {
	                for (i = k + 1; i < dimension; i++) {
	                    B[k][j] -= B[i][j] * l[i][k];
	                }
	                B[k][j] /= l[k][k];
	            }
	        }

	        return B;
	    }
	};

	module.exports = CholeskyDecomposition;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by acastillo on 8/24/15.
	 */
	/**
	 * Non in-place function definitions, compatible with mathjs code *
	 */

	'use strict';

	var Matrix = __webpack_require__(12);

	function matrix(A,B){
	    return new Matrix(A,B);
	}

	function ones(rows, cols){
	    return Matrix.ones(rows,cols);
	}

	function eye(rows, cols){
	    return Matrix.eye(rows, cols);
	}

	function zeros(rows, cols){
	    return Matrix.zeros(rows, cols);
	}

	function random(rows, cols){
	    return Matrix.rand(rows,cols);
	}

	function transpose(A){
	    if(typeof A == 'number')
	        return A;
	    var result = A.clone();
	    return result.transpose();
	}

	function add(A, B){
	    if(typeof A == 'number'&&typeof B === 'number')
	        return A+B;
	    if(typeof A == 'number')
	        return this.add(B,A);

	    var result = A.clone();
	    return result.add(B);

	}

	function subtract(A, B){
	    if(typeof A == 'number'&&typeof B === 'number')
	        return A-B;
	    if(typeof A == 'number')
	        return this.subtract(B,A);
	    var result = A.clone();
	    return result.sub(B);
	}

	function multiply(A, B){
	    if(typeof A == 'number'&&typeof B === 'number')
	        return A*B;
	    if(typeof A == 'number')
	        return this.multiply(B,A);

	    var result = A.clone();

	    if(typeof B === 'number')
	        result.mul(B);
	    else
	        result = result.mmul(B);

	    if(result.rows==1&&result.columns==1)
	        return result[0][0];
	    else
	        return result;

	}

	function dotMultiply(A, B){
	    var result = A.clone();
	    return result.mul(B);
	}

	function dotDivide(A, B){
	    var result = A.clone();
	    return result.div(B);
	}

	function diag(A){
	    var diag = null;
	    var rows = A.rows, cols = A.columns, j, r;
	    //It is an array
	    if(typeof cols === "undefined" && (typeof A)=='object'){
	        if(A[0]&&A[0].length){
	            rows = A.length;
	            cols = A[0].length;
	            r = Math.min(rows,cols);
	            diag = Matrix.zeros(cols, cols);
	            for (j = 0; j < cols; j++) {
	                diag[j][j]=A[j][j];
	            }
	        }
	        else{
	            cols = A.length;
	            diag = Matrix.zeros(cols, cols);
	            for (j = 0; j < cols; j++) {
	                diag[j][j]=A[j];
	            }
	        }

	    }
	    if(rows == 1){
	        diag = Matrix.zeros(cols, cols);
	        for (j = 0; j < cols; j++) {
	            diag[j][j]=A[0][j];
	        }
	    }
	    else{
	        if(rows>0 && cols > 0){
	            r = Math.min(rows,cols);
	            diag = new Array(r);
	            for (j = 0; j < r; j++) {
	                diag[j] = A[j][j];
	            }
	        }
	    }
	    return diag;
	}

	function min(A, B){
	    if(typeof A==='number' && typeof B ==='number')
	        return Math.min(A,B);
	    var ii = A.rows, jj = A.columns;
	    var result = new Matrix(ii,jj);
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            if (A[i][j] < B[i][j]) {
	                result[i][j] = A[i][j];
	            }
	            else{
	                result[i][j] = B[i][j];
	            }
	        }
	    }
	    return result;
	}

	function max(A, B){
	    if(typeof A==='number' && typeof B ==='number')
	        return Math.max(A,B);
	    var ii = A.rows, jj = A.columns;
	    var result = new Matrix(ii,jj);
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            if (A[i][j] > B[i][j]) {
	                result[i][j] = A[i][j];
	            }
	            else{
	                result[i][j] = B[i][j];
	            }
	        }
	    }
	    return result;
	}

	function sqrt(A){
	    if(typeof A==='number' )
	        return Math.sqrt(A);
	    var ii = A.rows, jj = A.columns;
	    var result = new Matrix(ii,jj);
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            result[i][j] = Math.sqrt(A[i][j]);

	        }
	    }
	    return result;
	}

	function abs(A){
	    if(typeof A==='number' )
	        return Math.abs(A);
	    var ii = A.rows, jj = A.columns;
	    var result = new Matrix(ii,jj);
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            result[i][j] = Math.abs(A[i][j]);

	        }
	    }
	    return result;
	}

	function exp(A){
	    if(typeof A==='number' )
	        return Math.sqrt(A);
	    var ii = A.rows, jj = A.columns;
	    var result = new Matrix(ii,jj);
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            result[i][j] = Math.exp(A[i][j]);
	        }
	    }
	    return result;
	}

	function dotPow(A, b){
	    if(typeof A==='number' )
	        return Math.pow(A,b);
	    //console.log(A);
	    var ii = A.rows, jj = A.columns;
	    var result = new Matrix(ii,jj);
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            result[i][j] = Math.pow(A[i][j],b);
	        }
	    }
	    return result;
	}

	function solve(A, B){
	    return A.solve(B);
	}

	function inv(A){
	    if(typeof A ==="number")
	        return 1/A;
	    return A.inverse();
	}

	module.exports = {
	    transpose:transpose,
	    add:add,
	    subtract:subtract,
	    multiply:multiply,
	    dotMultiply:dotMultiply,
	    dotDivide:dotDivide,
	    diag:diag,
	    min:min,
	    max:max,
	    solve:solve,
	    inv:inv,
	    sqrt:sqrt,
	    exp:exp,
	    dotPow:dotPow,
	    abs:abs,
	    matrix:matrix,
	    ones:ones,
	    zeros:zeros,
	    random:random,
	    eye:eye
	};


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(23);
	module.exports.Decompositions = module.exports.DC = __webpack_require__(24);


/***/ },
/* 23 */
/***/ function(module, exports) {

	'use strict';

	var Asplice = Array.prototype.splice,
	    Aconcat = Array.prototype.concat;

	// For performance : http://jsperf.com/clone-array-slice-vs-while-vs-for
	function slice(arr) {
	    var i = 0,
	        ii = arr.length,
	        result = new Array(ii);
	    for (; i < ii; i++) {
	        result[i] = arr[i];
	    }
	    return result;
	}

	/**
	 * Real matrix.
	 * @constructor
	 * @param {number|Array} nRows - Number of rows of the new matrix or a 2D array containing the data.
	 * @param {number|boolean} [nColumns] - Number of columns of the new matrix or a boolean specifying if the input array should be cloned
	 */
	function Matrix(nRows, nColumns) {
	    var i = 0, rows, columns, matrix, newInstance;
	    if (Array.isArray(nRows)) {
	        newInstance = nColumns;
	        matrix = newInstance ? slice(nRows) : nRows;
	        nRows = matrix.length;
	        nColumns = matrix[0].length;
	        if (typeof nColumns === 'undefined') {
	            throw new TypeError('Data must be a 2D array');
	        }
	        if (nRows > 0 && nColumns > 0) {
	            for (; i < nRows; i++) {
	                if (matrix[i].length !== nColumns) {
	                    throw new RangeError('Inconsistent array dimensions');
	                } else if (newInstance) {
	                    matrix[i] = slice(matrix[i]);
	                }
	            }
	        } else {
	            throw new RangeError('Invalid dimensions: ' + nRows + 'x' + nColumns);
	        }
	    } else if (typeof nRows === 'number') { // Create empty matrix
	        if (nRows > 0 && nColumns > 0) {
	            matrix = new Array(nRows);
	            for (; i < nRows; i++) {
	                matrix[i] = new Array(nColumns);
	            }
	        } else {
	            throw new RangeError('Invalid dimensions: ' + nRows + 'x' + nColumns);
	        }
	    } else {
	        throw new TypeError('Invalid arguments');
	    }

	    Object.defineProperty(matrix, 'rows', {writable: true, value: nRows});
	    Object.defineProperty(matrix, 'columns', {writable: true, value: nColumns});

	    matrix.__proto__ = Matrix.prototype;

	    return matrix;
	}

	/**
	 * Constructs a Matrix with the chosen dimensions from a 1D array.
	 * @param {number} newRows - Number of rows
	 * @param {number} newColumns - Number of columns
	 * @param {Array} newData - A 1D array containing data for the matrix
	 * @returns {Matrix} - The new matrix
	 */
	Matrix.from1DArray = function from1DArray(newRows, newColumns, newData) {
	    var length, data, i = 0;

	    length = newRows * newColumns;
	    if (length !== newData.length)
	        throw new RangeError('Data length does not match given dimensions');

	    data = new Array(newRows);
	    for (; i < newRows; i++) {
	        data[i] = newData.slice(i * newColumns, (i + 1) * newColumns);
	    }
	    return new Matrix(data);
	};

	/**
	 * Creates a row vector, a matrix with only one row.
	 * @param {Array} newData - A 1D array containing data for the vector
	 * @returns {Matrix} - The new matrix
	 */
	Matrix.rowVector = function rowVector(newData) {
	    return new Matrix([newData]);
	};

	/**
	 * Creates a column vector, a matrix with only one column.
	 * @param {Array} newData - A 1D array containing data for the vector
	 * @returns {Matrix} - The new matrix
	 */
	Matrix.columnVector = function columnVector(newData) {
	    var l = newData.length, vector = new Array(l);
	    for (var i = 0; i < l; i++)
	        vector[i] = [newData[i]];
	    return new Matrix(vector);
	};

	/**
	 * Creates an empty matrix with the given dimensions. Values will be undefined. Same as using new Matrix(rows, columns).
	 * @param {number} rows - Number of rows
	 * @param {number} columns - Number of columns
	 * @returns {Matrix} - The new matrix
	 */
	Matrix.empty = function empty(rows, columns) {
	    return new Matrix(rows, columns);
	};

	/**
	 * Creates a matrix with the given dimensions. Values will be set to zero.
	 * @param {number} rows - Number of rows
	 * @param {number} columns - Number of columns
	 * @returns {Matrix} - The new matrix
	 */
	Matrix.zeros = function zeros(rows, columns) {
	    return Matrix.empty(rows, columns).fill(0);
	};

	/**
	 * Creates a matrix with the given dimensions. Values will be set to one.
	 * @param {number} rows - Number of rows
	 * @param {number} columns - Number of columns
	 * @returns {Matrix} - The new matrix
	 */
	Matrix.ones = function ones(rows, columns) {
	    return Matrix.empty(rows, columns).fill(1);
	};

	/**
	 * Creates a matrix with the given dimensions. Values will be randomly set using Math.random().
	 * @param {number} rows - Number of rows
	 * @param {number} columns - Number of columns
	 * @returns {Matrix} The new matrix
	 */
	Matrix.rand = function rand(rows, columns) {
	    var matrix = Matrix.empty(rows, columns);
	    for (var i = 0, ii = matrix.rows; i < ii; i++) {
	        for (var j = 0, jj = matrix.columns; j < jj; j++) {
	            matrix[i][j] = Math.random();
	        }
	    }
	    return matrix;
	};

	/**
	 * Creates an identity matrix with the given dimension. Values of the diagonal will be 1 and other will be 0.
	 * @param {number} n - Number of rows and columns
	 * @returns {Matrix} - The new matrix
	 */
	Matrix.eye = function eye(n) {
	    var matrix = Matrix.zeros(n, n), l = matrix.rows;
	    for (var i = 0; i < l; i++) {
	        matrix[i][i] = 1;
	    }
	    return matrix;
	};

	/**
	 * Creates a diagonal matrix based on the given array.
	 * @param {Array} data - Array containing the data for the diagonal
	 * @returns {Matrix} - The new matrix
	 */
	Matrix.diag = function diag(data) {
	    var l = data.length, matrix = Matrix.zeros(l, l);
	    for (var i = 0; i < l; i++) {
	        matrix[i][i] = data[i];
	    }
	    return matrix;
	};

	/**
	 * Creates an array of indices between two values
	 * @param {number} from
	 * @param {number} to
	 * @returns {Array}
	 */
	Matrix.indices = function indices(from, to) {
	    var vector = new Array(to - from);
	    for (var i = 0; i < vector.length; i++)
	        vector[i] = from++;
	    return vector;
	};

	// TODO DOC
	Matrix.stack = function stack(arg1) {
	    var i, j, k;
	    if (Matrix.isMatrix(arg1)) {
	        var rows = 0,
	            cols = 0;
	        for (i = 0; i < arguments.length; i++) {
	            rows += arguments[i].rows;
	            if (arguments[i].columns > cols)
	                cols = arguments[i].columns;
	        }

	        var r = Matrix.zeros(rows, cols);
	        var c = 0;
	        for (i = 0; i < arguments.length; i++) {
	            var current = arguments[i];
	            for (j = 0; j < current.rows; j++) {
	                for (k = 0; k < current.columns; k++)
	                    r[c][k] = current[j][k];
	                c++;
	            }
	        }
	        return r;
	    }
	    else if (Array.isArray(arg1)) {
	        var matrix = Matrix.empty(arguments.length, arg1.length);
	        for (i = 0; i < arguments.length; i++)
	            matrix.setRow(i, arguments[i]);
	        return matrix;
	    }
	};

	// TODO DOC
	Matrix.expand = function expand(base, count) {
	    var expansion = [];
	    for (var i = 0; i < count.length; i++)
	        for (var j = 0; j < count[i]; j++)
	            expansion.push(base[i]);
	    return new Matrix(expansion);
	};

	/**
	 * Check that the provided value is a Matrix and tries to instantiate one if not
	 * @param value - The value to check
	 * @returns {Matrix}
	 * @throws {TypeError}
	 */
	Matrix.checkMatrix = function checkMatrix(value) {
	    if (!value) {
	        throw new TypeError('Argument has to be a matrix');
	    }
	    if (value.klass !== 'Matrix') {
	        value = new Matrix(value);
	    }
	    return value;
	};

	/**
	 * Returns true if the argument is a Matrix, false otherwise
	 * @param value - The value to check
	 * @returns {boolean}
	 */
	Matrix.isMatrix = function isMatrix(value) {
	    return value ? value.klass === 'Matrix' : false;
	};

	/**
	 * @property {string} - The name of this class.
	 */
	Object.defineProperty(Matrix.prototype, 'klass', {
	    get: function klass() {
	        return 'Matrix';
	    }
	});

	/**
	 * @property {number} - The number of elements in the matrix.
	 */
	Object.defineProperty(Matrix.prototype, 'size', {
	    get: function size() {
	        return this.rows * this.columns;
	    }
	});

	/**
	 * @private
	 * Internal check that a row index is not out of bounds
	 * @param {number} index
	 */
	Matrix.prototype.checkRowIndex = function checkRowIndex(index) {
	    if (index < 0 || index > this.rows - 1)
	        throw new RangeError('Row index out of range.');
	};

	/**
	 * @private
	 * Internal check that a column index is not out of bounds
	 * @param {number} index
	 */
	Matrix.prototype.checkColumnIndex = function checkColumnIndex(index) {
	    if (index < 0 || index > this.columns - 1)
	        throw new RangeError('Column index out of range.');
	};

	/**
	 * @private
	 * Internal check that two matrices have the same dimensions
	 * @param {Matrix} otherMatrix
	 */
	Matrix.prototype.checkDimensions = function checkDimensions(otherMatrix) {
	    if ((this.rows !== otherMatrix.rows) || (this.columns !== otherMatrix.columns))
	        throw new RangeError('Matrices dimensions must be equal.');
	};

	/**
	 * Applies a callback for each element of the matrix. The function is called in the matrix (this) context.
	 * @param {function} callback - Function that will be called with two parameters : i (row) and j (column)
	 * @returns {Matrix} this
	 */
	Matrix.prototype.apply = function apply(callback) {
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            callback.call(this, i, j);
	        }
	    }
	    return this;
	};

	/**
	 * Creates an exact and independent copy of the matrix
	 * @returns {Matrix}
	 */
	Matrix.prototype.clone = function clone() {
	    return new Matrix(this.to2DArray());
	};

	/**
	 * Returns a new 1D array filled row by row with the matrix values
	 * @returns {Array}
	 */
	Matrix.prototype.to1DArray = function to1DArray() {
	    return Aconcat.apply([], this);
	};

	/**
	 * Returns a 2D array containing a copy of the data
	 * @returns {Array}
	 */
	Matrix.prototype.to2DArray = function to2DArray() {
	    var l = this.rows, copy = new Array(l);
	    for (var i = 0; i < l; i++) {
	        copy[i] = slice(this[i]);
	    }
	    return copy;
	};

	/**
	 * @returns {boolean} true if the matrix has one row
	 */
	Matrix.prototype.isRowVector = function isRowVector() {
	    return this.rows === 1;
	};

	/**
	 * @returns {boolean} true if the matrix has one column
	 */
	Matrix.prototype.isColumnVector = function isColumnVector() {
	    return this.columns === 1;
	};

	/**
	 * @returns {boolean} true if the matrix has one row or one column
	 */
	Matrix.prototype.isVector = function isVector() {
	    return (this.rows === 1) || (this.columns === 1);
	};

	/**
	 * @returns {boolean} true if the matrix has the same number of rows and columns
	 */
	Matrix.prototype.isSquare = function isSquare() {
	    return this.rows === this.columns;
	};

	/**
	 * @returns {boolean} true if the matrix is square and has the same values on both sides of the diagonal
	 */
	Matrix.prototype.isSymmetric = function isSymmetric() {
	    if (this.isSquare()) {
	        var l = this.rows;
	        for (var i = 0; i < l; i++) {
	            for (var j = 0; j <= i; j++) {
	                if (this[i][j] !== this[j][i]) {
	                    return false;
	                }
	            }
	        }
	        return true;
	    }
	    return false;
	};

	/**
	 * Sets a given element of the matrix. mat.set(3,4,1) is equivalent to mat[3][4]=1
	 * @param {number} rowIndex - Index of the row
	 * @param {number} columnIndex - Index of the column
	 * @param {number} value - The new value for the element
	 * @returns {Matrix} this
	 */
	Matrix.prototype.set = function set(rowIndex, columnIndex, value) {
	    this[rowIndex][columnIndex] = value;
	    return this;
	};

	/**
	 * Returns the given element of the matrix. mat.get(3,4) is equivalent to matrix[3][4]
	 * @param {number} rowIndex - Index of the row
	 * @param {number} columnIndex - Index of the column
	 * @returns {number}
	 */
	Matrix.prototype.get = function get(rowIndex, columnIndex) {
	    return this[rowIndex][columnIndex];
	};

	/**
	 * Fills the matrix with a given value. All elements will be set to this value.
	 * @param {number} value - New value
	 * @returns {Matrix} this
	 */
	Matrix.prototype.fill = function fill(value) {
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            this[i][j] = value;
	        }
	    }
	    return this;
	};

	/**
	 * Negates the matrix. All elements will be multiplied by (-1)
	 * @returns {Matrix} this
	 */
	Matrix.prototype.neg = function neg() {
	    return this.mulS(-1);
	};

	/**
	 * Adds a scalar or values from another matrix (in place)
	 * @param {number|Matrix} value
	 * @returns {Matrix} this
	 */
	Matrix.prototype.add = function add(value) {
	    if (typeof value === 'number')
	        return this.addS(value);
	    value = Matrix.checkMatrix(value);
	        return this.addM(value);
	};

	/**
	 * Adds a scalar to each element of the matrix
	 * @param {number} value
	 * @returns {Matrix} this
	 */
	Matrix.prototype.addS = function addS(value) {
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            this[i][j] += value;
	        }
	    }
	    return this;
	};

	/**
	 * Adds the value of each element of matrix to the corresponding element of this
	 * @param {Matrix} matrix
	 * @returns {Matrix} this
	 */
	Matrix.prototype.addM = function addM(matrix) {
	    this.checkDimensions(matrix);
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            this[i][j] += matrix[i][j];
	        }
	    }
	    return this;
	};

	/**
	 * Subtracts a scalar or values from another matrix (in place)
	 * @param {number|Matrix} value
	 * @returns {Matrix} this
	 */
	Matrix.prototype.sub = function sub(value) {
	    if (typeof value === 'number')
	        return this.subS(value);
	    value = Matrix.checkMatrix(value);
	        return this.subM(value);
	};

	/**
	 * Subtracts a scalar from each element of the matrix
	 * @param {number} value
	 * @returns {Matrix} this
	 */
	Matrix.prototype.subS = function subS(value) {
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            this[i][j] -= value;
	        }
	    }
	    return this;
	};

	/**
	 * Subtracts the value of each element of matrix from the corresponding element of this
	 * @param {Matrix} matrix
	 * @returns {Matrix} this
	 */
	Matrix.prototype.subM = function subM(matrix) {
	    this.checkDimensions(matrix);
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            this[i][j] -= matrix[i][j];
	        }
	    }
	    return this;
	};

	/**
	 * Multiplies a scalar or values from another matrix (in place)
	 * @param {number|Matrix} value
	 * @returns {Matrix} this
	 */
	Matrix.prototype.mul = function mul(value) {
	    if (typeof value === 'number')
	        return this.mulS(value);
	    value = Matrix.checkMatrix(value);
	        return this.mulM(value);
	};

	/**
	 * Multiplies a scalar with each element of the matrix
	 * @param {number} value
	 * @returns {Matrix} this
	 */
	Matrix.prototype.mulS = function mulS(value) {
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            this[i][j] *= value;
	        }
	    }
	    return this;
	};

	/**
	 * Multiplies the value of each element of matrix with the corresponding element of this
	 * @param {Matrix} matrix
	 * @returns {Matrix} this
	 */
	Matrix.prototype.mulM = function mulM(matrix) {
	    this.checkDimensions(matrix);
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            this[i][j] *= matrix[i][j];
	        }
	    }
	    return this;
	};

	/**
	 * Divides by a scalar or values from another matrix (in place)
	 * @param {number|Matrix} value
	 * @returns {Matrix} this
	 */
	Matrix.prototype.div = function div(value) {
	    if (typeof value === 'number')
	        return this.divS(value);
	    value = Matrix.checkMatrix(value);
	        return this.divM(value);
	};

	/**
	 * Divides each element of the matrix by a scalar
	 * @param {number} value
	 * @returns {Matrix} this
	 */
	Matrix.prototype.divS = function divS(value) {
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            this[i][j] /= value;
	        }
	    }
	    return this;
	};

	/**
	 * Divides each element of this by the corresponding element of matrix
	 * @param {Matrix} matrix
	 * @returns {Matrix} this
	 */
	Matrix.prototype.divM = function divM(matrix) {
	    this.checkDimensions(matrix);
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            this[i][j] /= matrix[i][j];
	        }
	    }
	    return this;
	};

	/**
	 * Returns a new array from the given row index
	 * @param {number} index - Row index
	 * @returns {Array}
	 */
	Matrix.prototype.getRow = function getRow(index) {
	    this.checkRowIndex(index);
	    return slice(this[index]);
	};

	/**
	 * Returns a new row vector from the given row index
	 * @param {number} index - Row index
	 * @returns {Matrix}
	 */
	Matrix.prototype.getRowVector = function getRowVector(index) {
	    return Matrix.rowVector(this.getRow(index));
	};

	/**
	 * Sets a row at the given index
	 * @param {number} index - Row index
	 * @param {Array|Matrix} array - Array or vector
	 * @returns {Matrix} this
	 */
	Matrix.prototype.setRow = function setRow(index, array) {
	    this.checkRowIndex(index);
	    if (Matrix.isMatrix(array)) array = array.to1DArray();
	    if (array.length !== this.columns)
	        throw new RangeError('Invalid row size');
	    this[index] = slice(array);
	    return this;
	};

	/**
	 * Removes a row from the given index
	 * @param {number} index - Row index
	 * @returns {Matrix} this
	 */
	Matrix.prototype.removeRow = function removeRow(index) {
	    this.checkRowIndex(index);
	    if (this.rows === 1)
	        throw new RangeError('A matrix cannot have less than one row');
	    Asplice.call(this, index, 1);
	    this.rows -= 1;
	    return this;
	};

	/**
	 * Adds a row at the given index
	 * @param {number} [index = this.rows] - Row index
	 * @param {Array|Matrix} array - Array or vector
	 * @returns {Matrix} this
	 */
	Matrix.prototype.addRow = function addRow(index, array) {
	    if (typeof array === 'undefined') {
	        array = index;
	        index = this.rows;
	    }
	    if (index < 0 || index > this.rows)
	        throw new RangeError('Row index out of range.');
	    if (Matrix.isMatrix(array)) array = array.to1DArray();
	    if (array.length !== this.columns)
	        throw new RangeError('Invalid row size');
	    Asplice.call(this, index, 0, slice(array));
	    this.rows += 1;
	    return this;
	};

	/**
	 * Swaps two rows
	 * @param {number} row1 - First row index
	 * @param {number} row2 - Second row index
	 * @returns {Matrix} this
	 */
	Matrix.prototype.swapRows = function swapRows(row1, row2) {
	    this.checkRowIndex(row1);
	    this.checkRowIndex(row2);
	    var temp = this[row1];
	    this[row1] = this[row2];
	    this[row2] = temp;
	    return this;
	};

	/**
	 * Returns a new array from the given column index
	 * @param {number} index - Column index
	 * @returns {Array}
	 */
	Matrix.prototype.getColumn = function getColumn(index) {
	    this.checkColumnIndex(index);
	    var l = this.rows, column = new Array(l);
	    for (var i = 0; i < l; i++) {
	        column[i] = this[i][index];
	    }
	    return column;
	};

	/**
	 * Returns a new column vector from the given column index
	 * @param {number} index - Column index
	 * @returns {Matrix}
	 */
	Matrix.prototype.getColumnVector = function getColumnVector(index) {
	    return Matrix.columnVector(this.getColumn(index));
	};

	/**
	 * Sets a column at the given index
	 * @param {number} index - Column index
	 * @param {Array|Matrix} array - Array or vector
	 * @returns {Matrix} this
	 */
	Matrix.prototype.setColumn = function setColumn(index, array) {
	    this.checkColumnIndex(index);
	    if (Matrix.isMatrix(array)) array = array.to1DArray();
	    var l = this.rows;
	    if (array.length !== l)
	        throw new RangeError('Invalid column size');
	    for (var i = 0; i < l; i++) {
	        this[i][index] = array[i];
	    }
	    return this;
	};

	/**
	 * Removes a column from the given index
	 * @param {number} index - Column index
	 * @returns {Matrix} this
	 */
	Matrix.prototype.removeColumn = function removeColumn(index) {
	    this.checkColumnIndex(index);
	    if (this.columns === 1)
	        throw new RangeError('A matrix cannot have less than one column');
	    for (var i = 0, ii = this.rows; i < ii; i++) {
	        this[i].splice(index, 1);
	    }
	    this.columns -= 1;
	    return this;
	};

	/**
	 * Adds a column at the given index
	 * @param {number} [index = this.columns] - Column index
	 * @param {Array|Matrix} array - Array or vector
	 * @returns {Matrix} this
	 */
	Matrix.prototype.addColumn = function addColumn(index, array) {
	    if (typeof array === 'undefined') {
	        array = index;
	        index = this.columns;
	    }
	    if (index < 0 || index > this.columns)
	        throw new RangeError('Column index out of range.');
	    if (Matrix.isMatrix(array)) array = array.to1DArray();
	    var l = this.rows;
	    if (array.length !== l)
	        throw new RangeError('Invalid column size');
	    for (var i = 0; i < l; i++) {
	        this[i].splice(index, 0, array[i]);
	    }
	    this.columns += 1;
	    return this;
	};

	/**
	 * Swaps two columns
	 * @param {number} column1 - First column index
	 * @param {number} column2 - Second column index
	 * @returns {Matrix} this
	 */
	Matrix.prototype.swapColumns = function swapColumns(column1, column2) {
	    this.checkRowIndex(column1);
	    this.checkRowIndex(column2);
	    var l = this.rows, temp, row;
	    for (var i = 0; i < l; i++) {
	        row = this[i];
	        temp = row[column1];
	        row[column1] = row[column2];
	        row[column2] = temp;
	    }
	    return this;
	};

	/**
	 * @private
	 * Internal check that the provided vector is an array with the right length
	 * @param {Array|Matrix} vector
	 * @returns {Array}
	 * @throws {RangeError}
	 */
	Matrix.prototype.checkRowVector = function checkRowVector(vector) {
	    if (Matrix.isMatrix(vector))
	        vector = vector.to1DArray();
	    if (vector.length !== this.columns)
	        throw new RangeError('vector size must be the same as the number of columns');
	    return vector;
	};

	/**
	 * @private
	 * Internal check that the provided vector is an array with the right length
	 * @param {Array|Matrix} vector
	 * @returns {Array}
	 * @throws {RangeError}
	 */
	Matrix.prototype.checkColumnVector = function checkColumnVector(vector) {
	    if (Matrix.isMatrix(vector))
	        vector = vector.to1DArray();
	    if (vector.length !== this.rows)
	        throw new RangeError('vector size must be the same as the number of rows');
	    return vector;
	};

	/**
	 * Adds the values of a vector to each row
	 * @param {Array|Matrix} vector - Array or vector
	 * @returns {Matrix} this
	 */
	Matrix.prototype.addRowVector = function addRowVector(vector) {
	    vector = this.checkRowVector(vector);
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            this[i][j] += vector[j];
	        }
	    }
	    return this;
	};

	/**
	 * Subtracts the values of a vector from each row
	 * @param {Array|Matrix} vector - Array or vector
	 * @returns {Matrix} this
	 */
	Matrix.prototype.subRowVector = function subRowVector(vector) {
	    vector = this.checkRowVector(vector);
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            this[i][j] -= vector[j];
	        }
	    }
	    return this;
	};

	/**
	 * Multiplies the values of a vector with each row
	 * @param {Array|Matrix} vector - Array or vector
	 * @returns {Matrix} this
	 */
	Matrix.prototype.mulRowVector = function mulRowVector(vector) {
	    vector = this.checkRowVector(vector);
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            this[i][j] *= vector[j];
	        }
	    }
	    return this;
	};

	/**
	 * Divides the values of each row by those of a vector
	 * @param {Array|Matrix} vector - Array or vector
	 * @returns {Matrix} this
	 */
	Matrix.prototype.divRowVector = function divRowVector(vector) {
	    vector = this.checkRowVector(vector);
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            this[i][j] /= vector[j];
	        }
	    }
	    return this;
	};

	/**
	 * Adds the values of a vector to each column
	 * @param {Array|Matrix} vector - Array or vector
	 * @returns {Matrix} this
	 */
	Matrix.prototype.addColumnVector = function addColumnVector(vector) {
	    vector = this.checkColumnVector(vector);
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            this[i][j] += vector[i];
	        }
	    }
	    return this;
	};

	/**
	 * Subtracts the values of a vector from each column
	 * @param {Array|Matrix} vector - Array or vector
	 * @returns {Matrix} this
	 */
	Matrix.prototype.subColumnVector = function subColumnVector(vector) {
	    vector = this.checkColumnVector(vector);
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            this[i][j] -= vector[i];
	        }
	    }
	    return this;
	};

	/**
	 * Multiplies the values of a vector with each column
	 * @param {Array|Matrix} vector - Array or vector
	 * @returns {Matrix} this
	 */
	Matrix.prototype.mulColumnVector = function mulColumnVector(vector) {
	    vector = this.checkColumnVector(vector);
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            this[i][j] *= vector[i];
	        }
	    }
	    return this;
	};

	/**
	 * Divides the values of each column by those of a vector
	 * @param {Array|Matrix} vector - Array or vector
	 * @returns {Matrix} this
	 */
	Matrix.prototype.divColumnVector = function divColumnVector(vector) {
	    vector = this.checkColumnVector(vector);
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            this[i][j] /= vector[i];
	        }
	    }
	    return this;
	};

	/**
	 * Multiplies the values of a row with a scalar
	 * @param {number} index - Row index
	 * @param {number} value
	 * @returns {Matrix} this
	 */
	Matrix.prototype.mulRow = function mulRow(index, value) {
	    this.checkRowIndex(index);
	    var i = 0, l = this.columns;
	    for (; i < l; i++) {
	        this[index][i] *= value;
	    }
	    return this;
	};

	/**
	 * Multiplies the values of a column with a scalar
	 * @param {number} index - Column index
	 * @param {number} value
	 * @returns {Matrix} this
	 */
	Matrix.prototype.mulColumn = function mulColumn(index, value) {
	    this.checkColumnIndex(index);
	    var i = 0, l = this.rows;
	    for (; i < l; i++) {
	        this[i][index] *= value;
	    }
	};

	/**
	 * A matrix index
	 * @typedef {Object} MatrixIndex
	 * @property {number} row
	 * @property {number} column
	 */

	/**
	 * Returns the maximum value of the matrix
	 * @returns {number}
	 */
	Matrix.prototype.max = function max() {
	    var v = -Infinity;
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            if (this[i][j] > v) {
	                v = this[i][j];
	            }
	        }
	    }
	    return v;
	};

	/**
	 * Returns the index of the maximum value
	 * @returns {MatrixIndex}
	 */
	Matrix.prototype.maxIndex = function maxIndex() {
	    var v = -Infinity;
	    var idx = {};
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            if (this[i][j] > v) {
	                v = this[i][j];
	                idx.row = i;
	                idx.column = j;
	            }
	        }
	    }
	    return idx;
	};

	/**
	 * Returns the minimum value of the matrix
	 * @returns {number}
	 */
	Matrix.prototype.min = function min() {
	    var v = Infinity;
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            if (this[i][j] < v) {
	                v = this[i][j];
	            }
	        }
	    }
	    return v;
	};

	/**
	 * Returns the index of the minimum value
	 * @returns {MatrixIndex}
	 */
	Matrix.prototype.minIndex = function minIndex() {
	    var v = Infinity;
	    var idx = {};
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            if (this[i][j] < v) {
	                v = this[i][j];
	                idx.row = i;
	                idx.column = j;
	            }
	        }
	    }
	    return idx;
	};

	/**
	 * Returns the maximum value of one row
	 * @param {number} index - Row index
	 * @returns {number}
	 */
	Matrix.prototype.maxRow = function maxRow(index) {
	    this.checkRowIndex(index);
	    var v = -Infinity;
	    for (var i = 0, ii = this.columns; i < ii; i++) {
	        if (this[index][i] > v) {
	            v = this[index][i];
	        }
	    }
	    return v;
	};

	/**
	 * Returns the index of the maximum value of one row
	 * @param {number} index - Row index
	 * @returns {MatrixIndex}
	 */
	Matrix.prototype.maxRowIndex = function maxRowIndex(index) {
	    this.checkRowIndex(index);
	    var v = -Infinity;
	    var idx = {
	            row: index
	        };
	    for (var i = 0, ii = this.columns; i < ii; i++) {
	        if (this[index][i] > v) {
	            v = this[index][i];
	            idx.column = i;
	        }
	    }
	    return idx;
	};

	/**
	 * Returns the minimum value of one row
	 * @param {number} index - Row index
	 * @returns {number}
	 */
	Matrix.prototype.minRow = function minRow(index) {
	    this.checkRowIndex(index);
	    var v = Infinity;
	    for (var i = 0, ii = this.columns; i < ii; i++) {
	        if (this[index][i] < v) {
	            v = this[index][i];
	        }
	    }
	    return v;
	};

	/**
	 * Returns the index of the maximum value of one row
	 * @param {number} index - Row index
	 * @returns {MatrixIndex}
	 */
	Matrix.prototype.minRowIndex = function minRowIndex(index) {
	    this.checkRowIndex(index);
	    var v = Infinity;
	    var idx = {
	        row: index,
	        column: 0
	    };
	    for (var i = 0, ii = this.columns; i < ii; i++) {
	        if (this[index][i] < v) {
	            v = this[index][i];
	            idx.column = i;
	        }
	    }
	    return idx;
	};

	/**
	 * Returns the maximum value of one column
	 * @param {number} index - Column index
	 * @returns {number}
	 */
	Matrix.prototype.maxColumn = function maxColumn(index) {
	    this.checkColumnIndex(index);
	    var v = -Infinity;
	    for (var i = 0, ii = this.rows; i < ii; i++) {
	        if (this[i][index] > v) {
	            v = this[i][index];
	        }
	    }
	    return v;
	};

	/**
	 * Returns the index of the maximum value of one column
	 * @param {number} index - Column index
	 * @returns {MatrixIndex}
	 */
	Matrix.prototype.maxColumnIndex = function maxColumnIndex(index) {
	    this.checkColumnIndex(index);
	    var v = -Infinity;
	    var idx = {
	        row: 0,
	        column: index
	    };
	    for (var i = 0, ii = this.rows; i < ii; i++) {
	        if (this[i][index] > v) {
	            v = this[i][index];
	            idx.row = i;
	        }
	    }
	    return idx;
	};

	/**
	 * Returns the minimum value of one column
	 * @param {number} index - Column index
	 * @returns {number}
	 */
	Matrix.prototype.minColumn = function minColumn(index) {
	    this.checkColumnIndex(index);
	    var v = Infinity;
	    for (var i = 0, ii = this.rows; i < ii; i++) {
	        if (this[i][index] < v) {
	            v = this[i][index];
	        }
	    }
	    return v;
	};

	/**
	 * Returns the index of the minimum value of one column
	 * @param {number} index - Column index
	 * @returns {MatrixIndex}
	 */
	Matrix.prototype.minColumnIndex = function minColumnIndex(index) {
	    this.checkColumnIndex(index);
	    var v = Infinity;
	    var idx = {
	        row: 0,
	        column: index
	    };
	    for (var i = 0, ii = this.rows; i < ii; i++) {
	        if (this[i][index] < v) {
	            v = this[i][index];
	            idx.row = i;
	        }
	    }
	    return idx;
	};

	/**
	 * Returns an array containing the diagonal values of the matrix
	 * @returns {Array}
	 */
	Matrix.prototype.diag = function diag() {
	    if (!this.isSquare())
	        throw new TypeError('Only square matrices have a diagonal.');
	    var diag = new Array(this.rows);
	    for (var i = 0, ii = this.rows; i < ii; i++) {
	        diag[i] = this[i][i];
	    }
	    return diag;
	};

	/**
	 * Returns the sum of all elements of the matrix
	 * @returns {number}
	 */
	Matrix.prototype.sum = function sum() {
	    var v = 0;
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            v += this[i][j];
	        }
	    }
	    return v;
	};

	/**
	 * Returns the mean of all elements of the matrix
	 * @returns {number}
	 */
	Matrix.prototype.mean = function mean() {
	    return this.sum() / this.size;
	};

	/**
	 * Returns the product of all elements of the matrix
	 * @returns {number}
	 */
	Matrix.prototype.prod = function prod() {
	    var prod = 1;
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            prod *= this[i][j];
	        }
	    }
	    return prod;
	};

	/**
	 * Computes the cumulative sum of the matrix elements (in place, row by row)
	 * @returns {Matrix} this
	 */
	Matrix.prototype.cumulativeSum = function cumulativeSum() {
	    var sum = 0;
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            sum += this[i][j];
	            this[i][j] = sum;
	        }
	    }
	    return this;
	};

	/**
	 * Computes the dot (scalar) product between the matrix and another
	 * @param {Matrix} other vector
	 * @returns {number}
	 */
	Matrix.prototype.dot = function dot(other) {
	    if (this.size !== other.size)
	        throw new RangeError('vectors do not have the same size');
	    var vector1 = this.to1DArray();
	    var vector2 = other.to1DArray();
	    var dot = 0, l = vector1.length;
	    for (var i = 0; i < l; i++) {
	        dot += vector1[i] * vector2[i];
	    }
	    return dot;
	};

	/**
	 * Returns the matrix product between this and other
	 * @returns {Matrix}
	 */
	Matrix.prototype.mmul = function mmul(other) {
	    if (!Matrix.isMatrix(other))
	        throw new TypeError('parameter "other" must be a matrix');
	    if (this.columns !== other.rows)
	        console.warn('Number of columns of left matrix are not equal to number of rows of right matrix.');

	    var m = this.rows, n = this.columns, p = other.columns;
	    var result = new Matrix(m, p);

	    var Bcolj = new Array(n);
	    var i, j, k;
	    for (j = 0; j < p; j++) {
	        for (k = 0; k < n; k++)
	            Bcolj[k] = other[k][j];

	        for (i = 0; i < m; i++) {
	            var Arowi = this[i];

	            var s = 0;
	            for (k = 0; k < n; k++)
	                s += Arowi[k] * Bcolj[k];

	            result[i][j] = s;
	        }
	    }
	    return result;
	};

	/**
	 * Sorts the rows (in place)
	 * @param {function} compareFunction - usual Array.prototype.sort comparison function
	 * @returns {Matrix} this
	 */
	Matrix.prototype.sortRows = function sortRows(compareFunction) {
	    for (var i = 0, ii = this.rows; i < ii; i++) {
	        this[i].sort(compareFunction);
	    }
	    return this;
	};

	/**
	 * Sorts the columns (in place)
	 * @param {function} compareFunction - usual Array.prototype.sort comparison function
	 * @returns {Matrix} this
	 */
	Matrix.prototype.sortColumns = function sortColumns(compareFunction) {
	    for (var i = 0, ii = this.columns; i < ii; i++) {
	        this.setColumn(i, this.getColumn(i).sort(compareFunction));
	    }
	    return this;
	};

	/**
	 * Transposes the matrix and returns a new one containing the result
	 * @returns {Matrix}
	 */
	Matrix.prototype.transpose = function transpose() {
	    var result = new Matrix(this.columns, this.rows);
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            result[j][i] = this[i][j];
	        }
	    }
	    return result;
	};

	/**
	 * Returns a subset of the matrix
	 * @param {number} startRow - First row index
	 * @param {number} endRow - Last row index
	 * @param {number} startColumn - First column index
	 * @param {number} endColumn - Last column index
	 * @returns {Matrix}
	 */
	Matrix.prototype.subMatrix = function subMatrix(startRow, endRow, startColumn, endColumn) {
	    if ((startRow > endRow) || (startColumn > endColumn) || (startRow < 0) || (startRow >= this.rows) || (endRow < 0) || (endRow >= this.rows) || (startColumn < 0) || (startColumn >= this.columns) || (endColumn < 0) || (endColumn >= this.columns))
	        throw new RangeError('Argument out of range');
	    var newMatrix = new Matrix(endRow - startRow + 1, endColumn - startColumn + 1);
	    for (var i = startRow; i <= endRow; i++) {
	        for (var j = startColumn; j <= endColumn; j++) {
	            newMatrix[i - startRow][j - startColumn] = this[i][j];
	        }
	    }
	    return newMatrix;
	};

	/**
	 * Returns a subset of the matrix based on an array of row indices
	 * @param {Array} indices - Array containing the row indices
	 * @param {number} [startColumn = 0] - First column index
	 * @param {number} [endColumn = this.columns-1] - Last column index
	 * @returns {Matrix}
	 */
	Matrix.prototype.subMatrixRow = function subMatrixRow(indices, startColumn, endColumn) {
	    if (typeof startColumn === 'undefined') {
	        startColumn = 0;
	        endColumn = this.columns - 1;
	    } else if (typeof endColumn === 'undefined') {
	        endColumn = this.columns - 1;
	    }
	    if ((startColumn > endColumn) || (startColumn < 0) || (startColumn >= this.columns) || (endColumn < 0) || (endColumn >= this.columns))
	        throw new RangeError('Argument out of range.');
	    var l = indices.length, rows = this.rows,
	        X = new Matrix(l, endColumn - startColumn + 1);
	    for (var i = 0; i < l; i++) {
	        for (var j = startColumn; j <= endColumn; j++) {
	            if ((indices[i] < 0) || (indices[i] >= rows))
	                throw new RangeError('Argument out of range.');
	            X[i][j - startColumn] = this[indices[i]][j];
	        }
	    }
	    return X;
	};

	/**
	 * Returns a subset of the matrix based on an array of column indices
	 * @param {Array} indices - Array containing the column indices
	 * @param {number} [startRow = 0] - First row index
	 * @param {number} [endRow = this.rows-1] - Last row index
	 * @returns {Matrix}
	 */
	Matrix.prototype.subMatrixColumn = function subMatrixColumn(indices, startRow, endRow) {
	    if (typeof startRow === 'undefined') {
	        startRow = 0;
	        endRow = this.rows - 1;
	    } else if (typeof endRow === 'undefined') {
	        endRow = this.rows - 1;
	    }
	    if ((startRow > endRow) || (startRow < 0) || (startRow >= this.rows) || (endRow < 0) || (endRow >= this.rows))
	        throw new RangeError('Argument out of range.');
	    var l = indices.length, columns = this.columns,
	        X = new Matrix(endRow - startRow + 1, l);
	    for (var i = 0; i < l; i++) {
	        for (var j = startRow; j <= endRow; j++) {
	            if ((indices[i] < 0) || (indices[i] >= columns))
	                throw new RangeError('Argument out of range.');
	            X[j - startRow][i] = this[j][indices[i]];
	        }
	    }
	    return X;
	};

	/**
	 * Returns the trace of the matrix (sum of the diagonal elements)
	 * @returns {number}
	 */
	Matrix.prototype.trace = function trace() {
	    if (!this.isSquare())
	        throw new TypeError('The matrix is not square');
	    var trace = 0, i = 0, l = this.rows;
	    for (; i < l; i++) {
	        trace += this[i][i];
	    }
	    return trace;
	};

	/**
	 * Sets each element of the matrix to its absolute value
	 * @returns {Matrix} this
	 */
	Matrix.prototype.abs = function abs() {
	    var ii = this.rows, jj = this.columns;
	    for (var i = 0; i < ii; i++) {
	        for (var j = 0; j < jj; j++) {
	            this[i][j] = Math.abs(this[i][j]);
	        }
	    }
	};

	module.exports = Matrix;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Matrix = __webpack_require__(23);

	var SingularValueDecomposition = __webpack_require__(25);
	var EigenvalueDecomposition = __webpack_require__(27);
	var LuDecomposition = __webpack_require__(28);
	var QrDecomposition = __webpack_require__(29);
	var CholeskyDecomposition = __webpack_require__(30);

	function inverse(matrix) {
	    return solve(matrix, Matrix.eye(matrix.rows));
	}

	Matrix.prototype.inverse = function () {
	    return inverse(this);
	};

	function solve(leftHandSide, rightHandSide) {
	    return leftHandSide.isSquare() ? new LuDecomposition(leftHandSide).solve(rightHandSide) : new QrDecomposition(leftHandSide).solve(rightHandSide);
	}

	Matrix.prototype.solve = function (other) {
	    return solve(this, other);
	};

	module.exports = {
	    SingularValueDecomposition: SingularValueDecomposition,
	    SVD: SingularValueDecomposition,
	    EigenvalueDecomposition: EigenvalueDecomposition,
	    EVD: EigenvalueDecomposition,
	    LuDecomposition: LuDecomposition,
	    LU: LuDecomposition,
	    QrDecomposition: QrDecomposition,
	    QR: QrDecomposition,
	    CholeskyDecomposition: CholeskyDecomposition,
	    CHO: CholeskyDecomposition,
	    inverse: inverse,
	    solve: solve
	};


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Matrix = __webpack_require__(23);
	var hypotenuse = __webpack_require__(26).hypotenuse;

	// https://github.com/lutzroeder/Mapack/blob/master/Source/SingularValueDecomposition.cs
	function SingularValueDecomposition(value, options) {
	    if (!(this instanceof SingularValueDecomposition)) {
	        return new SingularValueDecomposition(value, options);
	    }
	    value = Matrix.checkMatrix(value);

	    options = options || {};

	    var a = value.clone(),
	        m = value.rows,
	        n = value.columns,
	        nu = Math.min(m, n);

	    var wantu = true, wantv = true;
	    if (options.computeLeftSingularVectors === false)
	        wantu = false;
	    if (options.computeRightSingularVectors === false)
	        wantv = false;
	    var autoTranspose = options.autoTranspose === true;

	    var swapped = false;
	    if (m < n) {
	        if (!autoTranspose) {
	            console.warn('Computing SVD on a matrix with more columns than rows. Consider enabling autoTranspose');
	        } else {
	            a = a.transpose();
	            m = a.rows;
	            n = a.columns;
	            swapped = true;
	            var aux = wantu;
	            wantu = wantv;
	            wantv = aux;
	        }
	    }

	    var s = new Array(Math.min(m + 1, n)),
	        U = Matrix.zeros(m, nu),
	        V = Matrix.zeros(n, n),
	        e = new Array(n),
	        work = new Array(m);

	    var nct = Math.min(m - 1, n);
	    var nrt = Math.max(0, Math.min(n - 2, m));

	    var i, j, k, p, t, ks, f, cs, sn, max, kase,
	        scale, sp, spm1, epm1, sk, ek, b, c, shift, g;

	    for (k = 0, max = Math.max(nct, nrt); k < max; k++) {
	        if (k < nct) {
	            s[k] = 0;
	            for (i = k; i < m; i++) {
	                s[k] = hypotenuse(s[k], a[i][k]);
	            }
	            if (s[k] !== 0) {
	                if (a[k][k] < 0) {
	                    s[k] = -s[k];
	                }
	                for (i = k; i < m; i++) {
	                    a[i][k] /= s[k];
	                }
	                a[k][k] += 1;
	            }
	            s[k] = -s[k];
	        }

	        for (j = k + 1; j < n; j++) {
	            if ((k < nct) && (s[k] !== 0)) {
	                t = 0;
	                for (i = k; i < m; i++) {
	                    t += a[i][k] * a[i][j];
	                }
	                t = -t / a[k][k];
	                for (i = k; i < m; i++) {
	                    a[i][j] += t * a[i][k];
	                }
	            }
	            e[j] = a[k][j];
	        }

	        if (wantu && (k < nct)) {
	            for (i = k; i < m; i++) {
	                U[i][k] = a[i][k];
	            }
	        }

	        if (k < nrt) {
	            e[k] = 0;
	            for (i = k + 1; i < n; i++) {
	                e[k] = hypotenuse(e[k], e[i]);
	            }
	            if (e[k] !== 0) {
	                if (e[k + 1] < 0)
	                    e[k] = -e[k];
	                for (i = k + 1; i < n; i++) {
	                    e[i] /= e[k];
	                }
	                e[k + 1] += 1;
	            }
	            e[k] = -e[k];
	            if ((k + 1 < m) && (e[k] !== 0)) {
	                for (i = k + 1; i < m; i++) {
	                    work[i] = 0;
	                }
	                for (j = k + 1; j < n; j++) {
	                    for (i = k + 1; i < m; i++) {
	                        work[i] += e[j] * a[i][j];
	                    }
	                }
	                for (j = k + 1; j < n; j++) {
	                    t = -e[j] / e[k + 1];
	                    for (i = k + 1; i < m; i++) {
	                        a[i][j] += t * work[i];
	                    }
	                }
	            }
	            if (wantv) {
	                for (i = k + 1; i < n; i++) {
	                    V[i][k] = e[i];
	                }
	            }
	        }
	    }

	    p = Math.min(n, m + 1);
	    if (nct < n) {
	        s[nct] = a[nct][nct];
	    }
	    if (m < p) {
	        s[p - 1] = 0;
	    }
	    if (nrt + 1 < p) {
	        e[nrt] = a[nrt][p - 1];
	    }
	    e[p - 1] = 0;

	    if (wantu) {
	        for (j = nct; j < nu; j++) {
	            for (i = 0; i < m; i++) {
	                U[i][j] = 0;
	            }
	            U[j][j] = 1;
	        }
	        for (k = nct - 1; k >= 0; k--) {
	            if (s[k] !== 0) {
	                for (j = k + 1; j < nu; j++) {
	                    t = 0;
	                    for (i = k; i < m; i++) {
	                        t += U[i][k] * U[i][j];
	                    }
	                    t = -t / U[k][k];
	                    for (i = k; i < m; i++) {
	                        U[i][j] += t * U[i][k];
	                    }
	                }
	                for (i = k; i < m; i++) {
	                    U[i][k] = -U[i][k];
	                }
	                U[k][k] = 1 + U[k][k];
	                for (i = 0; i < k - 1; i++) {
	                    U[i][k] = 0;
	                }
	            } else {
	                for (i = 0; i < m; i++) {
	                    U[i][k] = 0;
	                }
	                U[k][k] = 1;
	            }
	        }
	    }

	    if (wantv) {
	        for (k = n - 1; k >= 0; k--) {
	            if ((k < nrt) && (e[k] !== 0)) {
	                for (j = k + 1; j < n; j++) {
	                    t = 0;
	                    for (i = k + 1; i < n; i++) {
	                        t += V[i][k] * V[i][j];
	                    }
	                    t = -t / V[k + 1][k];
	                    for (i = k + 1; i < n; i++) {
	                        V[i][j] += t * V[i][k];
	                    }
	                }
	            }
	            for (i = 0; i < n; i++) {
	                V[i][k] = 0;
	            }
	            V[k][k] = 1;
	        }
	    }

	    var pp = p - 1,
	        iter = 0,
	        eps = Math.pow(2, -52);
	    while (p > 0) {
	        for (k = p - 2; k >= -1; k--) {
	            if (k === -1) {
	                break;
	            }
	            if (Math.abs(e[k]) <= eps * (Math.abs(s[k]) + Math.abs(s[k + 1]))) {
	                e[k] = 0;
	                break;
	            }
	        }
	        if (k === p - 2) {
	            kase = 4;
	        } else {
	            for (ks = p - 1; ks >= k; ks--) {
	                if (ks === k) {
	                    break;
	                }
	                t = (ks !== p ? Math.abs(e[ks]) : 0) + (ks !== k + 1 ? Math.abs(e[ks - 1]) : 0);
	                if (Math.abs(s[ks]) <= eps * t) {
	                    s[ks] = 0;
	                    break;
	                }
	            }
	            if (ks === k) {
	                kase = 3;
	            } else if (ks === p - 1) {
	                kase = 1;
	            } else {
	                kase = 2;
	                k = ks;
	            }
	        }

	        k++;

	        switch (kase) {
	            case 1: {
	                f = e[p - 2];
	                e[p - 2] = 0;
	                for (j = p - 2; j >= k; j--) {
	                    t = hypotenuse(s[j], f);
	                    cs = s[j] / t;
	                    sn = f / t;
	                    s[j] = t;
	                    if (j !== k) {
	                        f = -sn * e[j - 1];
	                        e[j - 1] = cs * e[j - 1];
	                    }
	                    if (wantv) {
	                        for (i = 0; i < n; i++) {
	                            t = cs * V[i][j] + sn * V[i][p - 1];
	                            V[i][p - 1] = -sn * V[i][j] + cs * V[i][p - 1];
	                            V[i][j] = t;
	                        }
	                    }
	                }
	                break;
	            }
	            case 2 : {
	                f = e[k - 1];
	                e[k - 1] = 0;
	                for (j = k; j < p; j++) {
	                    t = hypotenuse(s[j], f);
	                    cs = s[j] / t;
	                    sn = f / t;
	                    s[j] = t;
	                    f = -sn * e[j];
	                    e[j] = cs * e[j];
	                    if (wantu) {
	                        for (i = 0; i < m; i++) {
	                            t = cs * U[i][j] + sn * U[i][k - 1];
	                            U[i][k - 1] = -sn * U[i][j] + cs * U[i][k - 1];
	                            U[i][j] = t;
	                        }
	                    }
	                }
	                break;
	            }
	            case 3 : {
	                scale = Math.max(Math.max(Math.max(Math.max(Math.abs(s[p - 1]), Math.abs(s[p - 2])), Math.abs(e[p - 2])), Math.abs(s[k])), Math.abs(e[k]));
	                sp = s[p - 1] / scale;
	                spm1 = s[p - 2] / scale;
	                epm1 = e[p - 2] / scale;
	                sk = s[k] / scale;
	                ek = e[k] / scale;
	                b = ((spm1 + sp) * (spm1 - sp) + epm1 * epm1) / 2;
	                c = (sp * epm1) * (sp * epm1);
	                shift = 0;
	                if ((b !== 0) || (c !== 0)) {
	                    shift = Math.sqrt(b * b + c);
	                    if (b < 0) {
	                        shift = -shift;
	                    }
	                    shift = c / (b + shift);
	                }
	                f = (sk + sp) * (sk - sp) + shift;
	                g = sk * ek;
	                for (j = k; j < p - 1; j++) {
	                    t = hypotenuse(f, g);
	                    cs = f / t;
	                    sn = g / t;
	                    if (j !== k) {
	                        e[j - 1] = t;
	                    }
	                    f = cs * s[j] + sn * e[j];
	                    e[j] = cs * e[j] - sn * s[j];
	                    g = sn * s[j + 1];
	                    s[j + 1] = cs * s[j + 1];
	                    if (wantv) {
	                        for (i = 0; i < n; i++) {
	                            t = cs * V[i][j] + sn * V[i][j + 1];
	                            V[i][j + 1] = -sn * V[i][j] + cs * V[i][j + 1];
	                            V[i][j] = t;
	                        }
	                    }
	                    t = hypotenuse(f, g);
	                    cs = f / t;
	                    sn = g / t;
	                    s[j] = t;
	                    f = cs * e[j] + sn * s[j + 1];
	                    s[j + 1] = -sn * e[j] + cs * s[j + 1];
	                    g = sn * e[j + 1];
	                    e[j + 1] = cs * e[j + 1];
	                    if (wantu && (j < m - 1)) {
	                        for (i = 0; i < m; i++) {
	                            t = cs * U[i][j] + sn * U[i][j + 1];
	                            U[i][j + 1] = -sn * U[i][j] + cs * U[i][j + 1];
	                            U[i][j] = t;
	                        }
	                    }
	                }
	                e[p - 2] = f;
	                iter = iter + 1;
	                break;
	            }
	            case 4: {
	                if (s[k] <= 0) {
	                    s[k] = (s[k] < 0 ? -s[k] : 0);
	                    if (wantv) {
	                        for (i = 0; i <= pp; i++) {
	                            V[i][k] = -V[i][k];
	                        }
	                    }
	                }
	                while (k < pp) {
	                    if (s[k] >= s[k + 1]) {
	                        break;
	                    }
	                    t = s[k];
	                    s[k] = s[k + 1];
	                    s[k + 1] = t;
	                    if (wantv && (k < n - 1)) {
	                        for (i = 0; i < n; i++) {
	                            t = V[i][k + 1];
	                            V[i][k + 1] = V[i][k];
	                            V[i][k] = t;
	                        }
	                    }
	                    if (wantu && (k < m - 1)) {
	                        for (i = 0; i < m; i++) {
	                            t = U[i][k + 1];
	                            U[i][k + 1] = U[i][k];
	                            U[i][k] = t;
	                        }
	                    }
	                    k++;
	                }
	                iter = 0;
	                p--;
	                break;
	            }
	        }
	    }

	    if (swapped) {
	        var tmp = V;
	        V = U;
	        U = tmp;
	    }

	    this.m = m;
	    this.n = n;
	    this.s = s;
	    this.U = U;
	    this.V = V;
	}

	SingularValueDecomposition.prototype = {
	    get condition() {
	        return this.s[0] / this.s[Math.min(this.m, this.n) - 1];
	    },
	    get norm2() {
	        return this.s[0];
	    },
	    get rank() {
	        var eps = Math.pow(2, -52),
	            tol = Math.max(this.m, this.n) * this.s[0] * eps,
	            r = 0,
	            s = this.s;
	        for (var i = 0, ii = s.length; i < ii; i++) {
	            if (s[i] > tol) {
	                r++;
	            }
	        }
	        return r;
	    },
	    get diagonal() {
	        return this.s;
	    },
	    // https://github.com/accord-net/framework/blob/development/Sources/Accord.Math/Decompositions/SingularValueDecomposition.cs
	    get threshold() {
	        return (Math.pow(2, -52) / 2) * Math.max(this.m, this.n) * this.s[0];
	    },
	    get leftSingularVectors() {
	        return this.U;
	    },
	    get rightSingularVectors() {
	        return this.V;
	    },
	    get diagonalMatrix() {
	        return Matrix.diag(this.s);
	    },
	    solve: function (value) {

	        var Y = value,
	            e = this.threshold,
	            scols = this.s.length,
	            Ls = Matrix.zeros(scols, scols),
	            i;

	        for (i = 0; i < scols; i++) {
	            if (Math.abs(this.s[i]) <= e) {
	                Ls[i][i] = 0;
	            } else {
	                Ls[i][i] = 1 / this.s[i];
	            }
	        }


	        var VL = this.V.mmul(Ls),
	            vrows = this.V.rows,
	            urows = this.U.rows,
	            VLU = Matrix.zeros(vrows, urows),
	            j, k, sum;

	        for (i = 0; i < vrows; i++) {
	            for (j = 0; j < urows; j++) {
	                sum = 0;
	                for (k = 0; k < scols; k++) {
	                    sum += VL[i][k] * this.U[j][k];
	                }
	                VLU[i][j] = sum;
	            }
	        }

	        return VLU.mmul(Y);
	    },
	    solveForDiagonal: function (value) {
	        return this.solve(Matrix.diag(value));
	    },
	    inverse: function () {
	        var e = this.threshold,
	            vrows = this.V.rows,
	            vcols = this.V.columns,
	            X = new Matrix(vrows, this.s.length),
	            i, j;

	        for (i = 0; i < vrows; i++) {
	            for (j = 0; j < vcols; j++) {
	                if (Math.abs(this.s[j]) > e) {
	                    X[i][j] = this.V[i][j] / this.s[j];
	                } else {
	                    X[i][j] = 0;
	                }
	            }
	        }

	        var urows = this.U.rows,
	            ucols = this.U.columns,
	            Y = new Matrix(vrows, urows),
	            k, sum;

	        for (i = 0; i < vrows; i++) {
	            for (j = 0; j < urows; j++) {
	                sum = 0;
	                for (k = 0; k < ucols; k++) {
	                    sum += X[i][k] * this.U[j][k];
	                }
	                Y[i][j] = sum;
	            }
	        }

	        return Y;
	    }
	};

	module.exports = SingularValueDecomposition;


/***/ },
/* 26 */
/***/ function(module, exports) {

	'use strict';

	exports.hypotenuse = function hypotenuse(a, b) {
	    var r;
	    if (Math.abs(a) > Math.abs(b)) {
	        r = b / a;
	        return Math.abs(a) * Math.sqrt(1 + r * r);
	    }
	    if (b !== 0) {
	        r = a / b;
	        return Math.abs(b) * Math.sqrt(1 + r * r);
	    }
	    return 0;
	};


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Matrix = __webpack_require__(23);
	var hypotenuse = __webpack_require__(26).hypotenuse;

	// https://github.com/lutzroeder/Mapack/blob/master/Source/EigenvalueDecomposition.cs
	function EigenvalueDecomposition(matrix) {
	    if (!(this instanceof EigenvalueDecomposition)) {
	        return new EigenvalueDecomposition(matrix);
	    }
	    matrix = Matrix.checkMatrix(matrix);
	    if (!matrix.isSquare()) {
	        throw new Error('Matrix is not a square matrix');
	    }

	    var n = matrix.columns,
	        V = Matrix.zeros(n, n),
	        d = new Array(n),
	        e = new Array(n),
	        value = matrix,
	        i, j;

	    if (matrix.isSymmetric()) {
	        for (i = 0; i < n; i++) {
	            for (j = 0; j < n; j++) {
	                V[i][j] = value[i][j];
	            }
	        }
	        tred2(n, e, d, V);
	        tql2(n, e, d, V);
	    }
	    else {
	        var H = Matrix.zeros(n, n),
	            ort = new Array(n);
	        for (j = 0; j < n; j++) {
	            for (i = 0; i < n; i++) {
	                H[i][j] = value[i][j];
	            }
	        }
	        orthes(n, H, ort, V);
	        hqr2(n, e, d, V, H);
	    }

	    this.n = n;
	    this.e = e;
	    this.d = d;
	    this.V = V;
	}

	EigenvalueDecomposition.prototype = {
	    get realEigenvalues() {
	        return this.d;
	    },
	    get imaginaryEigenvalues() {
	        return this.e;
	    },
	    get eigenvectorMatrix() {
	        return this.V;
	    },
	    get diagonalMatrix() {
	        var n = this.n,
	            e = this.e,
	            d = this.d,
	            X = new Matrix(n, n),
	            i, j;
	        for (i = 0; i < n; i++) {
	            for (j = 0; j < n; j++) {
	                X[i][j] = 0;
	            }
	            X[i][i] = d[i];
	            if (e[i] > 0) {
	                X[i][i + 1] = e[i];
	            }
	            else if (e[i] < 0) {
	                X[i][i - 1] = e[i];
	            }
	        }
	        return X;
	    }
	};

	function tred2(n, e, d, V) {

	    var f, g, h, i, j, k,
	        hh, scale;

	    for (j = 0; j < n; j++) {
	        d[j] = V[n - 1][j];
	    }

	    for (i = n - 1; i > 0; i--) {
	        scale = 0;
	        h = 0;
	        for (k = 0; k < i; k++) {
	            scale = scale + Math.abs(d[k]);
	        }

	        if (scale === 0) {
	            e[i] = d[i - 1];
	            for (j = 0; j < i; j++) {
	                d[j] = V[i - 1][j];
	                V[i][j] = 0;
	                V[j][i] = 0;
	            }
	        } else {
	            for (k = 0; k < i; k++) {
	                d[k] /= scale;
	                h += d[k] * d[k];
	            }

	            f = d[i - 1];
	            g = Math.sqrt(h);
	            if (f > 0) {
	                g = -g;
	            }

	            e[i] = scale * g;
	            h = h - f * g;
	            d[i - 1] = f - g;
	            for (j = 0; j < i; j++) {
	                e[j] = 0;
	            }

	            for (j = 0; j < i; j++) {
	                f = d[j];
	                V[j][i] = f;
	                g = e[j] + V[j][j] * f;
	                for (k = j + 1; k <= i - 1; k++) {
	                    g += V[k][j] * d[k];
	                    e[k] += V[k][j] * f;
	                }
	                e[j] = g;
	            }

	            f = 0;
	            for (j = 0; j < i; j++) {
	                e[j] /= h;
	                f += e[j] * d[j];
	            }

	            hh = f / (h + h);
	            for (j = 0; j < i; j++) {
	                e[j] -= hh * d[j];
	            }

	            for (j = 0; j < i; j++) {
	                f = d[j];
	                g = e[j];
	                for (k = j; k <= i - 1; k++) {
	                    V[k][j] -= (f * e[k] + g * d[k]);
	                }
	                d[j] = V[i - 1][j];
	                V[i][j] = 0;
	            }
	        }
	        d[i] = h;
	    }

	    for (i = 0; i < n - 1; i++) {
	        V[n - 1][i] = V[i][i];
	        V[i][i] = 1;
	        h = d[i + 1];
	        if (h !== 0) {
	            for (k = 0; k <= i; k++) {
	                d[k] = V[k][i + 1] / h;
	            }

	            for (j = 0; j <= i; j++) {
	                g = 0;
	                for (k = 0; k <= i; k++) {
	                    g += V[k][i + 1] * V[k][j];
	                }
	                for (k = 0; k <= i; k++) {
	                    V[k][j] -= g * d[k];
	                }
	            }
	        }

	        for (k = 0; k <= i; k++) {
	            V[k][i + 1] = 0;
	        }
	    }

	    for (j = 0; j < n; j++) {
	        d[j] = V[n - 1][j];
	        V[n - 1][j] = 0;
	    }

	    V[n - 1][n - 1] = 1;
	    e[0] = 0;
	}

	function tql2(n, e, d, V) {

	    var g, h, i, j, k, l, m, p, r,
	        dl1, c, c2, c3, el1, s, s2,
	        iter;

	    for (i = 1; i < n; i++) {
	        e[i - 1] = e[i];
	    }

	    e[n - 1] = 0;

	    var f = 0,
	        tst1 = 0,
	        eps = Math.pow(2, -52);

	    for (l = 0; l < n; l++) {
	        tst1 = Math.max(tst1, Math.abs(d[l]) + Math.abs(e[l]));
	        m = l;
	        while (m < n) {
	            if (Math.abs(e[m]) <= eps * tst1) {
	                break;
	            }
	            m++;
	        }

	        if (m > l) {
	            iter = 0;
	            do {
	                iter = iter + 1;

	                g = d[l];
	                p = (d[l + 1] - g) / (2 * e[l]);
	                r = hypotenuse(p, 1);
	                if (p < 0) {
	                    r = -r;
	                }

	                d[l] = e[l] / (p + r);
	                d[l + 1] = e[l] * (p + r);
	                dl1 = d[l + 1];
	                h = g - d[l];
	                for (i = l + 2; i < n; i++) {
	                    d[i] -= h;
	                }

	                f = f + h;

	                p = d[m];
	                c = 1;
	                c2 = c;
	                c3 = c;
	                el1 = e[l + 1];
	                s = 0;
	                s2 = 0;
	                for (i = m - 1; i >= l; i--) {
	                    c3 = c2;
	                    c2 = c;
	                    s2 = s;
	                    g = c * e[i];
	                    h = c * p;
	                    r = hypotenuse(p, e[i]);
	                    e[i + 1] = s * r;
	                    s = e[i] / r;
	                    c = p / r;
	                    p = c * d[i] - s * g;
	                    d[i + 1] = h + s * (c * g + s * d[i]);

	                    for (k = 0; k < n; k++) {
	                        h = V[k][i + 1];
	                        V[k][i + 1] = s * V[k][i] + c * h;
	                        V[k][i] = c * V[k][i] - s * h;
	                    }
	                }

	                p = -s * s2 * c3 * el1 * e[l] / dl1;
	                e[l] = s * p;
	                d[l] = c * p;

	            }
	            while (Math.abs(e[l]) > eps * tst1);
	        }
	        d[l] = d[l] + f;
	        e[l] = 0;
	    }

	    for (i = 0; i < n - 1; i++) {
	        k = i;
	        p = d[i];
	        for (j = i + 1; j < n; j++) {
	            if (d[j] < p) {
	                k = j;
	                p = d[j];
	            }
	        }

	        if (k !== i) {
	            d[k] = d[i];
	            d[i] = p;
	            for (j = 0; j < n; j++) {
	                p = V[j][i];
	                V[j][i] = V[j][k];
	                V[j][k] = p;
	            }
	        }
	    }
	}

	function orthes(n, H, ort, V) {

	    var low = 0,
	        high = n - 1,
	        f, g, h, i, j, m,
	        scale;

	    for (m = low + 1; m <= high - 1; m++) {
	        scale = 0;
	        for (i = m; i <= high; i++) {
	            scale = scale + Math.abs(H[i][m - 1]);
	        }

	        if (scale !== 0) {
	            h = 0;
	            for (i = high; i >= m; i--) {
	                ort[i] = H[i][m - 1] / scale;
	                h += ort[i] * ort[i];
	            }

	            g = Math.sqrt(h);
	            if (ort[m] > 0) {
	                g = -g;
	            }

	            h = h - ort[m] * g;
	            ort[m] = ort[m] - g;

	            for (j = m; j < n; j++) {
	                f = 0;
	                for (i = high; i >= m; i--) {
	                    f += ort[i] * H[i][j];
	                }

	                f = f / h;
	                for (i = m; i <= high; i++) {
	                    H[i][j] -= f * ort[i];
	                }
	            }

	            for (i = 0; i <= high; i++) {
	                f = 0;
	                for (j = high; j >= m; j--) {
	                    f += ort[j] * H[i][j];
	                }

	                f = f / h;
	                for (j = m; j <= high; j++) {
	                    H[i][j] -= f * ort[j];
	                }
	            }

	            ort[m] = scale * ort[m];
	            H[m][m - 1] = scale * g;
	        }
	    }

	    for (i = 0; i < n; i++) {
	        for (j = 0; j < n; j++) {
	            V[i][j] = (i === j ? 1 : 0);
	        }
	    }

	    for (m = high - 1; m >= low + 1; m--) {
	        if (H[m][m - 1] !== 0) {
	            for (i = m + 1; i <= high; i++) {
	                ort[i] = H[i][m - 1];
	            }

	            for (j = m; j <= high; j++) {
	                g = 0;
	                for (i = m; i <= high; i++) {
	                    g += ort[i] * V[i][j];
	                }

	                g = (g / ort[m]) / H[m][m - 1];
	                for (i = m; i <= high; i++) {
	                    V[i][j] += g * ort[i];
	                }
	            }
	        }
	    }
	}

	function hqr2(nn, e, d, V, H) {
	    var n = nn - 1,
	        low = 0,
	        high = nn - 1,
	        eps = Math.pow(2, -52),
	        exshift = 0,
	        norm = 0,
	        p = 0,
	        q = 0,
	        r = 0,
	        s = 0,
	        z = 0,
	        iter = 0,
	        i, j, k, l, m, t, w, x, y,
	        ra, sa, vr, vi,
	        notlast, cdivres;

	    for (i = 0; i < nn; i++) {
	        if (i < low || i > high) {
	            d[i] = H[i][i];
	            e[i] = 0;
	        }

	        for (j = Math.max(i - 1, 0); j < nn; j++) {
	            norm = norm + Math.abs(H[i][j]);
	        }
	    }

	    while (n >= low) {
	        l = n;
	        while (l > low) {
	            s = Math.abs(H[l - 1][l - 1]) + Math.abs(H[l][l]);
	            if (s === 0) {
	                s = norm;
	            }
	            if (Math.abs(H[l][l - 1]) < eps * s) {
	                break;
	            }
	            l--;
	        }

	        if (l === n) {
	            H[n][n] = H[n][n] + exshift;
	            d[n] = H[n][n];
	            e[n] = 0;
	            n--;
	            iter = 0;
	        } else if (l === n - 1) {
	            w = H[n][n - 1] * H[n - 1][n];
	            p = (H[n - 1][n - 1] - H[n][n]) / 2;
	            q = p * p + w;
	            z = Math.sqrt(Math.abs(q));
	            H[n][n] = H[n][n] + exshift;
	            H[n - 1][n - 1] = H[n - 1][n - 1] + exshift;
	            x = H[n][n];

	            if (q >= 0) {
	                z = (p >= 0) ? (p + z) : (p - z);
	                d[n - 1] = x + z;
	                d[n] = d[n - 1];
	                if (z !== 0) {
	                    d[n] = x - w / z;
	                }
	                e[n - 1] = 0;
	                e[n] = 0;
	                x = H[n][n - 1];
	                s = Math.abs(x) + Math.abs(z);
	                p = x / s;
	                q = z / s;
	                r = Math.sqrt(p * p + q * q);
	                p = p / r;
	                q = q / r;

	                for (j = n - 1; j < nn; j++) {
	                    z = H[n - 1][j];
	                    H[n - 1][j] = q * z + p * H[n][j];
	                    H[n][j] = q * H[n][j] - p * z;
	                }

	                for (i = 0; i <= n; i++) {
	                    z = H[i][n - 1];
	                    H[i][n - 1] = q * z + p * H[i][n];
	                    H[i][n] = q * H[i][n] - p * z;
	                }

	                for (i = low; i <= high; i++) {
	                    z = V[i][n - 1];
	                    V[i][n - 1] = q * z + p * V[i][n];
	                    V[i][n] = q * V[i][n] - p * z;
	                }
	            } else {
	                d[n - 1] = x + p;
	                d[n] = x + p;
	                e[n - 1] = z;
	                e[n] = -z;
	            }

	            n = n - 2;
	            iter = 0;
	        } else {
	            x = H[n][n];
	            y = 0;
	            w = 0;
	            if (l < n) {
	                y = H[n - 1][n - 1];
	                w = H[n][n - 1] * H[n - 1][n];
	            }

	            if (iter === 10) {
	                exshift += x;
	                for (i = low; i <= n; i++) {
	                    H[i][i] -= x;
	                }
	                s = Math.abs(H[n][n - 1]) + Math.abs(H[n - 1][n - 2]);
	                x = y = 0.75 * s;
	                w = -0.4375 * s * s;
	            }

	            if (iter === 30) {
	                s = (y - x) / 2;
	                s = s * s + w;
	                if (s > 0) {
	                    s = Math.sqrt(s);
	                    if (y < x) {
	                        s = -s;
	                    }
	                    s = x - w / ((y - x) / 2 + s);
	                    for (i = low; i <= n; i++) {
	                        H[i][i] -= s;
	                    }
	                    exshift += s;
	                    x = y = w = 0.964;
	                }
	            }

	            iter = iter + 1;

	            m = n - 2;
	            while (m >= l) {
	                z = H[m][m];
	                r = x - z;
	                s = y - z;
	                p = (r * s - w) / H[m + 1][m] + H[m][m + 1];
	                q = H[m + 1][m + 1] - z - r - s;
	                r = H[m + 2][m + 1];
	                s = Math.abs(p) + Math.abs(q) + Math.abs(r);
	                p = p / s;
	                q = q / s;
	                r = r / s;
	                if (m === l) {
	                    break;
	                }
	                if (Math.abs(H[m][m - 1]) * (Math.abs(q) + Math.abs(r)) < eps * (Math.abs(p) * (Math.abs(H[m - 1][m - 1]) + Math.abs(z) + Math.abs(H[m + 1][m + 1])))) {
	                    break;
	                }
	                m--;
	            }

	            for (i = m + 2; i <= n; i++) {
	                H[i][i - 2] = 0;
	                if (i > m + 2) {
	                    H[i][i - 3] = 0;
	                }
	            }

	            for (k = m; k <= n - 1; k++) {
	                notlast = (k !== n - 1);
	                if (k !== m) {
	                    p = H[k][k - 1];
	                    q = H[k + 1][k - 1];
	                    r = (notlast ? H[k + 2][k - 1] : 0);
	                    x = Math.abs(p) + Math.abs(q) + Math.abs(r);
	                    if (x !== 0) {
	                        p = p / x;
	                        q = q / x;
	                        r = r / x;
	                    }
	                }

	                if (x === 0) {
	                    break;
	                }

	                s = Math.sqrt(p * p + q * q + r * r);
	                if (p < 0) {
	                    s = -s;
	                }

	                if (s !== 0) {
	                    if (k !== m) {
	                        H[k][k - 1] = -s * x;
	                    } else if (l !== m) {
	                        H[k][k - 1] = -H[k][k - 1];
	                    }

	                    p = p + s;
	                    x = p / s;
	                    y = q / s;
	                    z = r / s;
	                    q = q / p;
	                    r = r / p;

	                    for (j = k; j < nn; j++) {
	                        p = H[k][j] + q * H[k + 1][j];
	                        if (notlast) {
	                            p = p + r * H[k + 2][j];
	                            H[k + 2][j] = H[k + 2][j] - p * z;
	                        }

	                        H[k][j] = H[k][j] - p * x;
	                        H[k + 1][j] = H[k + 1][j] - p * y;
	                    }

	                    for (i = 0; i <= Math.min(n, k + 3); i++) {
	                        p = x * H[i][k] + y * H[i][k + 1];
	                        if (notlast) {
	                            p = p + z * H[i][k + 2];
	                            H[i][k + 2] = H[i][k + 2] - p * r;
	                        }

	                        H[i][k] = H[i][k] - p;
	                        H[i][k + 1] = H[i][k + 1] - p * q;
	                    }

	                    for (i = low; i <= high; i++) {
	                        p = x * V[i][k] + y * V[i][k + 1];
	                        if (notlast) {
	                            p = p + z * V[i][k + 2];
	                            V[i][k + 2] = V[i][k + 2] - p * r;
	                        }

	                        V[i][k] = V[i][k] - p;
	                        V[i][k + 1] = V[i][k + 1] - p * q;
	                    }
	                }
	            }
	        }
	    }

	    if (norm === 0) {
	        return;
	    }

	    for (n = nn - 1; n >= 0; n--) {
	        p = d[n];
	        q = e[n];

	        if (q === 0) {
	            l = n;
	            H[n][n] = 1;
	            for (i = n - 1; i >= 0; i--) {
	                w = H[i][i] - p;
	                r = 0;
	                for (j = l; j <= n; j++) {
	                    r = r + H[i][j] * H[j][n];
	                }

	                if (e[i] < 0) {
	                    z = w;
	                    s = r;
	                } else {
	                    l = i;
	                    if (e[i] === 0) {
	                        H[i][n] = (w !== 0) ? (-r / w) : (-r / (eps * norm));
	                    } else {
	                        x = H[i][i + 1];
	                        y = H[i + 1][i];
	                        q = (d[i] - p) * (d[i] - p) + e[i] * e[i];
	                        t = (x * s - z * r) / q;
	                        H[i][n] = t;
	                        H[i + 1][n] = (Math.abs(x) > Math.abs(z)) ? ((-r - w * t) / x) : ((-s - y * t) / z);
	                    }

	                    t = Math.abs(H[i][n]);
	                    if ((eps * t) * t > 1) {
	                        for (j = i; j <= n; j++) {
	                            H[j][n] = H[j][n] / t;
	                        }
	                    }
	                }
	            }
	        } else if (q < 0) {
	            l = n - 1;

	            if (Math.abs(H[n][n - 1]) > Math.abs(H[n - 1][n])) {
	                H[n - 1][n - 1] = q / H[n][n - 1];
	                H[n - 1][n] = -(H[n][n] - p) / H[n][n - 1];
	            } else {
	                cdivres = cdiv(0, -H[n - 1][n], H[n - 1][n - 1] - p, q);
	                H[n - 1][n - 1] = cdivres[0];
	                H[n - 1][n] = cdivres[1];
	            }

	            H[n][n - 1] = 0;
	            H[n][n] = 1;
	            for (i = n - 2; i >= 0; i--) {
	                ra = 0;
	                sa = 0;
	                for (j = l; j <= n; j++) {
	                    ra = ra + H[i][j] * H[j][n - 1];
	                    sa = sa + H[i][j] * H[j][n];
	                }

	                w = H[i][i] - p;

	                if (e[i] < 0) {
	                    z = w;
	                    r = ra;
	                    s = sa;
	                } else {
	                    l = i;
	                    if (e[i] === 0) {
	                        cdivres = cdiv(-ra, -sa, w, q);
	                        H[i][n - 1] = cdivres[0];
	                        H[i][n] = cdivres[1];
	                    } else {
	                        x = H[i][i + 1];
	                        y = H[i + 1][i];
	                        vr = (d[i] - p) * (d[i] - p) + e[i] * e[i] - q * q;
	                        vi = (d[i] - p) * 2 * q;
	                        if (vr === 0 && vi === 0) {
	                            vr = eps * norm * (Math.abs(w) + Math.abs(q) + Math.abs(x) + Math.abs(y) + Math.abs(z));
	                        }
	                        cdivres = cdiv(x * r - z * ra + q * sa, x * s - z * sa - q * ra, vr, vi);
	                        H[i][n - 1] = cdivres[0];
	                        H[i][n] = cdivres[1];
	                        if (Math.abs(x) > (Math.abs(z) + Math.abs(q))) {
	                            H[i + 1][n - 1] = (-ra - w * H[i][n - 1] + q * H[i][n]) / x;
	                            H[i + 1][n] = (-sa - w * H[i][n] - q * H[i][n - 1]) / x;
	                        } else {
	                            cdivres = cdiv(-r - y * H[i][n - 1], -s - y * H[i][n], z, q);
	                            H[i + 1][n - 1] = cdivres[0];
	                            H[i + 1][n] = cdivres[1];
	                        }
	                    }

	                    t = Math.max(Math.abs(H[i][n - 1]), Math.abs(H[i][n]));
	                    if ((eps * t) * t > 1) {
	                        for (j = i; j <= n; j++) {
	                            H[j][n - 1] = H[j][n - 1] / t;
	                            H[j][n] = H[j][n] / t;
	                        }
	                    }
	                }
	            }
	        }
	    }

	    for (i = 0; i < nn; i++) {
	        if (i < low || i > high) {
	            for (j = i; j < nn; j++) {
	                V[i][j] = H[i][j];
	            }
	        }
	    }

	    for (j = nn - 1; j >= low; j--) {
	        for (i = low; i <= high; i++) {
	            z = 0;
	            for (k = low; k <= Math.min(j, high); k++) {
	                z = z + V[i][k] * H[k][j];
	            }
	            V[i][j] = z;
	        }
	    }
	}

	function cdiv(xr, xi, yr, yi) {
	    var r, d;
	    if (Math.abs(yr) > Math.abs(yi)) {
	        r = yi / yr;
	        d = yr + r * yi;
	        return [(xr + r * xi) / d, (xi - r * xr) / d];
	    }
	    else {
	        r = yr / yi;
	        d = yi + r * yr;
	        return [(r * xr + xi) / d, (r * xi - xr) / d];
	    }
	}

	module.exports = EigenvalueDecomposition;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Matrix = __webpack_require__(23);

	// https://github.com/lutzroeder/Mapack/blob/master/Source/LuDecomposition.cs
	function LuDecomposition(matrix) {
	    if (!(this instanceof LuDecomposition)) {
	        return new LuDecomposition(matrix);
	    }
	    matrix = Matrix.checkMatrix(matrix);

	    var lu = matrix.clone(),
	        rows = lu.rows,
	        columns = lu.columns,
	        pivotVector = new Array(rows),
	        pivotSign = 1,
	        i, j, k, p, s, t, v,
	        LUrowi, LUcolj, kmax;

	    for (i = 0; i < rows; i++) {
	        pivotVector[i] = i;
	    }

	    LUcolj = new Array(rows);

	    for (j = 0; j < columns; j++) {

	        for (i = 0; i < rows; i++) {
	            LUcolj[i] = lu[i][j];
	        }

	        for (i = 0; i < rows; i++) {
	            LUrowi = lu[i];
	            kmax = Math.min(i, j);
	            s = 0;
	            for (k = 0; k < kmax; k++) {
	                s += LUrowi[k] * LUcolj[k];
	            }
	            LUrowi[j] = LUcolj[i] -= s;
	        }

	        p = j;
	        for (i = j + 1; i < rows; i++) {
	            if (Math.abs(LUcolj[i]) > Math.abs(LUcolj[p])) {
	                p = i;
	            }
	        }

	        if (p !== j) {
	            for (k = 0; k < columns; k++) {
	                t = lu[p][k];
	                lu[p][k] = lu[j][k];
	                lu[j][k] = t;
	            }

	            v = pivotVector[p];
	            pivotVector[p] = pivotVector[j];
	            pivotVector[j] = v;

	            pivotSign = -pivotSign;
	        }

	        if (j < rows && lu[j][j] !== 0) {
	            for (i = j + 1; i < rows; i++) {
	                lu[i][j] /= lu[j][j];
	            }
	        }
	    }

	    this.LU = lu;
	    this.pivotVector = pivotVector;
	    this.pivotSign = pivotSign;
	}

	LuDecomposition.prototype = {
	    isSingular: function () {
	        var data = this.LU,
	            col = data.columns;
	        for (var j = 0; j < col; j++) {
	            if (data[j][j] === 0) {
	                return true;
	            }
	        }
	        return false;
	    },
	    get determinant() {
	        var data = this.LU;
	        if (!data.isSquare())
	            throw new Error('Matrix must be square');
	        var determinant = this.pivotSign, col = data.columns;
	        for (var j = 0; j < col; j++)
	            determinant *= data[j][j];
	        return determinant;
	    },
	    get lowerTriangularFactor() {
	        var data = this.LU,
	            rows = data.rows,
	            columns = data.columns,
	            X = new Matrix(rows, columns);
	        for (var i = 0; i < rows; i++) {
	            for (var j = 0; j < columns; j++) {
	                if (i > j) {
	                    X[i][j] = data[i][j];
	                } else if (i === j) {
	                    X[i][j] = 1;
	                } else {
	                    X[i][j] = 0;
	                }
	            }
	        }
	        return X;
	    },
	    get upperTriangularFactor() {
	        var data = this.LU,
	            rows = data.rows,
	            columns = data.columns,
	            X = new Matrix(rows, columns);
	        for (var i = 0; i < rows; i++) {
	            for (var j = 0; j < columns; j++) {
	                if (i <= j) {
	                    X[i][j] = data[i][j];
	                } else {
	                    X[i][j] = 0;
	                }
	            }
	        }
	        return X;
	    },
	    get pivotPermutationVector() {
	        return this.pivotVector.slice();
	    },
	    solve: function (value) {
	        value = Matrix.checkMatrix(value);

	        var lu = this.LU,
	            rows = lu.rows;

	        if (rows !== value.rows)
	            throw new Error('Invalid matrix dimensions');
	        if (this.isSingular())
	            throw new Error('LU matrix is singular');

	        var count = value.columns,
	            X = value.subMatrixRow(this.pivotVector, 0, count - 1),
	            columns = lu.columns,
	            i, j, k;

	        for (k = 0; k < columns; k++) {
	            for (i = k + 1; i < columns; i++) {
	                for (j = 0; j < count; j++) {
	                    X[i][j] -= X[k][j] * lu[i][k];
	                }
	            }
	        }
	        for (k = columns - 1; k >= 0; k--) {
	            for (j = 0; j < count; j++) {
	                X[k][j] /= lu[k][k];
	            }
	            for (i = 0; i < k; i++) {
	                for (j = 0; j < count; j++) {
	                    X[i][j] -= X[k][j] * lu[i][k];
	                }
	            }
	        }
	        return X;
	    }
	};

	module.exports = LuDecomposition;


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Matrix = __webpack_require__(23);
	var hypotenuse = __webpack_require__(26).hypotenuse;

	//https://github.com/lutzroeder/Mapack/blob/master/Source/QrDecomposition.cs
	function QrDecomposition(value) {
	    if (!(this instanceof QrDecomposition)) {
	        return new QrDecomposition(value);
	    }
	    value = Matrix.checkMatrix(value);

	    var qr = value.clone(),
	        m = value.rows,
	        n = value.columns,
	        rdiag = new Array(n),
	        i, j, k, s;

	    for (k = 0; k < n; k++) {
	        var nrm = 0;
	        for (i = k; i < m; i++) {
	            nrm = hypotenuse(nrm, qr[i][k]);
	        }
	        if (nrm !== 0) {
	            if (qr[k][k] < 0) {
	                nrm = -nrm;
	            }
	            for (i = k; i < m; i++) {
	                qr[i][k] /= nrm;
	            }
	            qr[k][k] += 1;
	            for (j = k + 1; j < n; j++) {
	                s = 0;
	                for (i = k; i < m; i++) {
	                    s += qr[i][k] * qr[i][j];
	                }
	                s = -s / qr[k][k];
	                for (i = k; i < m; i++) {
	                    qr[i][j] += s * qr[i][k];
	                }
	            }
	        }
	        rdiag[k] = -nrm;
	    }

	    this.QR = qr;
	    this.Rdiag = rdiag;
	}

	QrDecomposition.prototype = {
	    solve: function (value) {
	        value = Matrix.checkMatrix(value);

	        var qr = this.QR,
	            m = qr.rows;

	        if (value.rows !== m)
	            throw new Error('Matrix row dimensions must agree');
	        if (!this.isFullRank())
	            throw new Error('Matrix is rank deficient');

	        var count = value.columns,
	            X = value.clone(),
	            n = qr.columns,
	            i, j, k, s;

	        for (k = 0; k < n; k++) {
	            for (j = 0; j < count; j++) {
	                s = 0;
	                for (i = k; i < m; i++) {
	                    s += qr[i][k] * X[i][j];
	                }
	                s = -s / qr[k][k];
	                for (i = k; i < m; i++) {
	                    X[i][j] += s * qr[i][k];
	                }
	            }
	        }
	        for (k = n - 1; k >= 0; k--) {
	            for (j = 0; j < count; j++) {
	                X[k][j] /= this.Rdiag[k];
	            }
	            for (i = 0; i < k; i++) {
	                for (j = 0; j < count; j++) {
	                    X[i][j] -= X[k][j] * qr[i][k];
	                }
	            }
	        }

	        return X.subMatrix(0, n - 1, 0, count - 1);
	    },
	    isFullRank: function () {
	        var columns = this.QR.columns;
	        for (var i = 0; i < columns; i++) {
	            if (this.Rdiag[i] === 0) {
	                return false;
	            }
	        }
	        return true;
	    },
	    get upperTriangularFactor() {
	        var qr = this.QR,
	            n = qr.columns,
	            X = new Matrix(n, n),
	            i, j;
	        for (i = 0; i < n; i++) {
	            for (j = 0; j < n; j++) {
	                if (i < j) {
	                    X[i][j] = qr[i][j];
	                } else if (i === j) {
	                    X[i][j] = this.Rdiag[i];
	                } else {
	                    X[i][j] = 0;
	                }
	            }
	        }
	        return X;
	    },
	    get orthogonalFactor() {
	        var qr = this.QR,
	            rows = qr.rows,
	            columns = qr.columns,
	            X = new Matrix(rows, columns),
	            i, j, k, s;

	        for (k = columns - 1; k >= 0; k--) {
	            for (i = 0; i < rows; i++) {
	                X[i][k] = 0;
	            }
	            X[k][k] = 1;
	            for (j = k; j < columns; j++) {
	                if (qr[k][k] !== 0) {
	                    s = 0;
	                    for (i = k; i < rows; i++) {
	                        s += qr[i][k] * X[i][j];
	                    }

	                    s = -s / qr[k][k];

	                    for (i = k; i < rows; i++) {
	                        X[i][j] += s * qr[i][k];
	                    }
	                }
	            }
	        }
	        return X;
	    }
	};

	module.exports = QrDecomposition;


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Matrix = __webpack_require__(23);

	// https://github.com/lutzroeder/Mapack/blob/master/Source/CholeskyDecomposition.cs
	function CholeskyDecomposition(value) {
	    if (!(this instanceof CholeskyDecomposition)) {
	        return new CholeskyDecomposition(value);
	    }
	    value = Matrix.checkMatrix(value);
	    if (!value.isSymmetric())
	        throw new Error('Matrix is not symmetric');

	    var a = value,
	        dimension = a.rows,
	        l = new Matrix(dimension, dimension),
	        positiveDefinite = true,
	        i, j, k;

	    for (j = 0; j < dimension; j++) {
	        var Lrowj = l[j];
	        var d = 0;
	        for (k = 0; k < j; k++) {
	            var Lrowk = l[k];
	            var s = 0;
	            for (i = 0; i < k; i++) {
	                s += Lrowk[i] * Lrowj[i];
	            }
	            Lrowj[k] = s = (a[j][k] - s) / l[k][k];
	            d = d + s * s;
	        }

	        d = a[j][j] - d;

	        positiveDefinite &= (d > 0);
	        l[j][j] = Math.sqrt(Math.max(d, 0));
	        for (k = j + 1; k < dimension; k++) {
	            l[j][k] = 0;
	        }
	    }

	    if (!positiveDefinite) {
	        throw new Error('Matrix is not positive definite');
	    }

	    this.L = l;
	}

	CholeskyDecomposition.prototype = {
	    get leftTriangularFactor() {
	        return this.L;
	    },
	    solve: function (value) {
	        value = Matrix.checkMatrix(value);

	        var l = this.L,
	            dimension = l.rows;

	        if (value.rows !== dimension) {
	            throw new Error('Matrix dimensions do not match');
	        }

	        var count = value.columns,
	            B = value.clone(),
	            i, j, k;

	        for (k = 0; k < dimension; k++) {
	            for (j = 0; j < count; j++) {
	                for (i = 0; i < k; i++) {
	                    B[k][j] -= B[i][j] * l[k][i];
	                }
	                B[k][j] /= l[k][k];
	            }
	        }

	        for (k = dimension - 1; k >= 0; k--) {
	            for (j = 0; j < count; j++) {
	                for (i = k + 1; i < dimension; i++) {
	                    B[k][j] -= B[i][j] * l[i][k];
	                }
	                B[k][j] /= l[k][k];
	            }
	        }

	        return B;
	    }
	};

	module.exports = CholeskyDecomposition;


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var Opt = __webpack_require__(9);
	var stats = __webpack_require__(32);
	var extend = __webpack_require__(35);
	var SG = __webpack_require__(36);

	var sgDefOptions = {
	    windowSize: 5,
	    polynomial: 3
	};


	function gsd(x, y, options){
	    //options = extend({}, defaultOptions, options);
	    var options=Object.create(options || {});
	    if (options.minMaxRatio===undefined) options.minMaxRatio=0.00025;
	    if (options.broadRatio===undefined) options.broadRatio=0.00;
	    if (options.noiseLevel===undefined) options.noiseLevel=0;
	    if (options.maxCriteria===undefined) options.maxCriteria=true;
	    if (options.smoothY===undefined) options.smoothY=true;
	    if (options.realTopDetection===undefined) options.realTopDetection=false;

	    var sgOptions = extend({}, sgDefOptions, options.sgOptions);

	    //Transform y to use the standard algorithm.
	    var yCorrection = {m:1, b:0};
	    if(!options.maxCriteria||options.noiseLevel>0){
	        y=[].concat(y);
	        if(!options.maxCriteria){
	            yCorrection = {m:-1, b:stats.array.max(y)};
	            for (var i=0; i<y.length; i++){
	                y[i]=-y[i]+yCorrection.b;
	            }
	            options.noiseLevel=-options.noiseLevel+yCorrection.b;
	        }
	        if (options.noiseLevel>0) {
	            for (var i=0; i<y.length; i++){
	                if(Math.abs(y[i])<options.noiseLevel) {
	                    y[i]=0;
	                }
	            }
	        }
	    }

	    //We have to know if x is equally spaced
	    var maxDx=0, minDx=Number.MAX_VALUE,tmp;
	    for(var i=0;i< x.length-1;i++){
	        var tmp = Math.abs(x[i+1]-x[i]);
	        if(tmp<minDx){
	            minDx = tmp;
	        }
	        if(tmp>maxDx){
	            maxDx = tmp;
	        }
	    }
	    //If the max difference between delta x is less than 5%, then, we can assume it to be equally spaced variable
	    if((maxDx-minDx)/maxDx<0.05){
	        var Y = SG(y, x[1]-x[0], {windowSize:sgOptions.windowSize, polynomial:sgOptions.polynomial,derivative:0});
	        var dY = SG(y, x[1]-x[0], {windowSize:sgOptions.windowSize, polynomial:sgOptions.polynomial,derivative:1});
	        var ddY = SG(y, x[1]-x[0], {windowSize:sgOptions.windowSize, polynomial:sgOptions.polynomial,derivative:2});
	    }
	    else{
	        var Y = SG(y, x, {windowSize:sgOptions.windowSize, polynomial:sgOptions.polynomial,derivative:0});
	        var dY = SG(y, x, {windowSize:sgOptions.windowSize, polynomial:sgOptions.polynomial,derivative:1});
	        var ddY = SG(y, x, {windowSize:sgOptions.windowSize, polynomial:sgOptions.polynomial,derivative:2});
	    }
	    
	    var X = x;
	    var dx = x[1]-x[0];
	    var maxDdy=0;
	    var maxY = 0;
	    //console.log(Y.length);
	    for (var i = 0; i < Y.length ; i++){
	        if(Math.abs(ddY[i])>maxDdy){
	            maxDdy = Math.abs(ddY[i]);
	        }
	        if(Math.abs(Y[i])>maxY){
	            maxY = Math.abs(Y[i]);
	        }
	    }
	    //console.log(maxY+"x"+maxDy+"x"+maxDdy);

	    var minddY = [];
	    var intervalL = [];
	    var intervalR = [];
	    var lastMax = null;
	    var lastMin = null;
	    var broadMask = new Array();
	    //console.log(dx);
	    //By the intermediate value theorem We cannot find 2 consecutive maxima or minima
	    for (var i = 1; i < Y.length -1 ; i++){
	        //console.log(dY[i]);
	        if ((dY[i] < dY[i-1]) && (dY[i] <= dY[i+1])||
	            (dY[i] <= dY[i-1]) && (dY[i] < dY[i+1])) {
	            lastMin = X[i];
	            //console.log("min "+lastMin);
	            if(dx>0&&lastMax!=null){
	                intervalL.push(lastMax);
	                intervalR.push(lastMin);

	            }
	        }

	        if ((dY[i] >= dY[i-1]) && (dY[i] > dY[i+1])||
	            (dY[i] > dY[i-1]) && (dY[i] >= dY[i+1])) {
	            lastMax = X[i];
	            //console.log("max "+lastMax);
	            if(dx<0&&lastMin!=null){
	                intervalL.push(lastMax);
	                intervalR.push(lastMin);
	            }
	        }
	        if ((ddY[i] < ddY[i-1]) && (ddY[i] < ddY[i+1])) {
	            minddY.push(i);//( [X[i], Y[i], i] );  // TODO should we change this to have 3 arrays ? Huge overhead creating arrays
	            if(Math.abs(ddY[i])>options.broadRatio*maxDdy){ // TODO should this be a parameter =
	                broadMask.push(false);
	            }
	            else{
	                broadMask.push(true);
	            }
	        }
	    }
	    if(options.realTopDetection){
	        realTopDetection(minddY,X,Y);
	    }
	    //
	    //console.log(intervalL.length+" "+minddY.length+" "+broadMask.length);
	    var signals = [];
	    var lastK = 0,possible, k, f,frequency, distanceJ, minDistance, gettingCloser;
	    for (var j = 0; j < minddY.length; j++){
	        frequency = X[minddY[j]];//minddY[j][0];
	        possible = -1;
	        k=lastK+1;
	        minDistance = Number.MAX_VALUE;
	        distanceJ = 0;
	        gettingCloser=true;
	        while(possible==-1&&k<intervalL.length&&gettingCloser){
	            distanceJ = Math.abs(frequency-(intervalL[k]+intervalR[k])/2);
	            //Still getting closer?
	            if(distanceJ<minDistance){
	                minDistance = distanceJ;
	            }
	            else{
	                gettingCloser = false;
	            }
	            if( distanceJ <Math.abs(intervalL[k]-intervalR[k])/2){
	                possible=k;
	                lastK = k;
	            }
	            k++;
	        }
	        //console.log(lastK+" "+intervalL.length+" possible "+k);
	        if (possible!=-1){
	            //console.log(height);
	            if (Math.abs(Y[minddY[j]]) > options.minMaxRatio*maxY) {
	                signals.push({
	                    x: frequency,
	                    y: (Y[minddY[j]]-yCorrection.b)/yCorrection.m,
	                    width:Math.abs(intervalR[possible] - intervalL[possible]),//widthCorrection
	                    soft:broadMask[j]
	                })
	            }
	        }
	    }

	    signals.sort(function (a, b) {
	        return a.x - b.x;
	    });

	    return signals;

	}

	function realTopDetection(peakList, x, y){
	    var listP = [];
	    var alpha, beta, gamma, p,currentPoint;
	    for(var j=0;j<peakList.length;j++){
	        currentPoint = peakList[j];//peakList[j][2];
	        //The detected peak could be moved 1 or 2 unit to left or right.
	        if(y[currentPoint-1]>=y[currentPoint-2]
	            &&y[currentPoint-1]>=y[currentPoint]) {
	            currentPoint--;
	        }
	        else{
	            if(y[currentPoint+1]>=y[currentPoint]
	                &&y[currentPoint+1]>=y[currentPoint+2]) {
	                currentPoint++;
	            }
	            else{
	                if(y[currentPoint-2]>=y[currentPoint-3]
	                    &&y[currentPoint-2]>=y[currentPoint-1]) {
	                    currentPoint-=2;
	                }
	                else{
	                    if(y[currentPoint+2]>=y[currentPoint+1]
	                        &&y[currentPoint+2]>=y[currentPoint+3]) {
	                        currentPoint+=2;
	                    }
	                }
	            }
	        }
	        if(y[currentPoint-1]>0&&y[currentPoint+1]>0
	            &&y[currentPoint]>=y[currentPoint-1]
	            &&y[currentPoint]>=y[currentPoint+1]) {
	            alpha = 20 * Math.log10(y[currentPoint - 1]);
	            beta = 20 * Math.log10(y[currentPoint]);
	            gamma = 20 * Math.log10(y[currentPoint + 1]);
	            p = 0.5 * (alpha - gamma) / (alpha - 2 * beta + gamma);

	            x[peakList[j]] = x[currentPoint] + (x[currentPoint]-x[currentPoint-1])*p;
	            y[peakList[j]] = y[currentPoint] - 0.25 * (y[currentPoint - 1]
	                - [currentPoint + 1]) * p;//signal.peaks[j].intensity);
	        }
	    }
	}

	module.exports=gsd;


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.array = __webpack_require__(33);
	exports.matrix = __webpack_require__(34);


/***/ },
/* 33 */
/***/ function(module, exports) {

	'use strict';

	function compareNumbers(a, b) {
	    return a - b;
	}

	/**
	 * Computes the sum of the given values
	 * @param {Array} values
	 * @returns {number}
	 */
	exports.sum = function sum(values) {
	    var sum = 0;
	    for (var i = 0; i < values.length; i++) {
	        sum += values[i];
	    }
	    return sum;
	};

	/**
	 * Computes the maximum of the given values
	 * @param {Array} values
	 * @returns {number}
	 */
	exports.max = function max(values) {
	    var max = -Infinity;
	    var l = values.length;
	    for (var i = 0; i < l; i++) {
	        if (values[i] > max) max = values[i];
	    }
	    return max;
	};

	/**
	 * Computes the minimum of the given values
	 * @param {Array} values
	 * @returns {number}
	 */
	exports.min = function min(values) {
	    var min = Infinity;
	    var l = values.length;
	    for (var i = 0; i < l; i++) {
	        if (values[i] < min) min = values[i];
	    }
	    return min;
	};

	/**
	 * Computes the min and max of the given values
	 * @param {Array} values
	 * @returns {{min: number, max: number}}
	 */
	exports.minMax = function minMax(values) {
	    var min = Infinity;
	    var max = -Infinity;
	    var l = values.length;
	    for (var i = 0; i < l; i++) {
	        if (values[i] < min) min = values[i];
	        if (values[i] > max) max = values[i];
	    }
	    return {
	        min: min,
	        max: max
	    };
	};

	/**
	 * Computes the arithmetic mean of the given values
	 * @param {Array} values
	 * @returns {number}
	 */
	exports.arithmeticMean = function arithmeticMean(values) {
	    var sum = 0;
	    var l = values.length;
	    for (var i = 0; i < l; i++) {
	        sum += values[i];
	    }
	    return sum / l;
	};

	/**
	 * {@link arithmeticMean}
	 */
	exports.mean = exports.arithmeticMean;

	/**
	 * Computes the geometric mean of the given values
	 * @param {Array} values
	 * @returns {number}
	 */
	exports.geometricMean = function geometricMean(values) {
	    var mul = 1;
	    var l = values.length;
	    for (var i = 0; i < l; i++) {
	        mul *= values[i];
	    }
	    return Math.pow(mul, 1 / l);
	};

	/**
	 * Computes the mean of the log of the given values
	 * If the return value is exponentiated, it gives the same result as the
	 * geometric mean.
	 * @param {Array} values
	 * @returns {number}
	 */
	exports.logMean = function logMean(values) {
	    var lnsum = 0;
	    var l = values.length;
	    for (var i = 0; i < l; i++) {
	        lnsum += Math.log(values[i]);
	    }
	    return lnsum / l;
	};

	/**
	 * Computes the weighted grand mean for a list of means and sample sizes
	 * @param {Array} means - Mean values for each set of samples
	 * @param {Array} samples - Number of original values for each set of samples
	 * @returns {number}
	 */
	exports.grandMean = function grandMean(means, samples) {
	    var sum = 0;
	    var n = 0;
	    var l = means.length;
	    for (var i = 0; i < l; i++) {
	        sum += samples[i] * means[i];
	        n += samples[i];
	    }
	    return sum / n;
	};

	/**
	 * Computes the truncated mean of the given values using a given percentage
	 * @param {Array} values
	 * @param {number} percent - The percentage of values to keep (range: [0,1])
	 * @param {boolean} [alreadySorted=false]
	 * @returns {number}
	 */
	exports.truncatedMean = function truncatedMean(values, percent, alreadySorted) {
	    if (alreadySorted === undefined) alreadySorted = false;
	    if (!alreadySorted) {
	        values = values.slice().sort(compareNumbers);
	    }
	    var l = values.length;
	    var k = Math.floor(l * percent);
	    var sum = 0;
	    for (var i = k; i < (l - k); i++) {
	        sum += values[i];
	    }
	    return sum / (l - 2 * k);
	};

	/**
	 * Computes the harmonic mean of the given values
	 * @param {Array} values
	 * @returns {number}
	 */
	exports.harmonicMean = function harmonicMean(values) {
	    var sum = 0;
	    var l = values.length;
	    for (var i = 0; i < l; i++) {
	        if (values[i] === 0) {
	            throw new RangeError('value at index ' + i + 'is zero');
	        }
	        sum += 1 / values[i];
	    }
	    return l / sum;
	};

	/**
	 * Computes the contraharmonic mean of the given values
	 * @param {Array} values
	 * @returns {number}
	 */
	exports.contraHarmonicMean = function contraHarmonicMean(values) {
	    var r1 = 0;
	    var r2 = 0;
	    var l = values.length;
	    for (var i = 0; i < l; i++) {
	        r1 += values[i] * values[i];
	        r2 += values[i];
	    }
	    if (r2 < 0) {
	        throw new RangeError('sum of values is negative');
	    }
	    return r1 / r2;
	};

	/**
	 * Computes the median of the given values
	 * @param {Array} values
	 * @param {boolean} [alreadySorted=false]
	 * @returns {number}
	 */
	exports.median = function median(values, alreadySorted) {
	    if (alreadySorted === undefined) alreadySorted = false;
	    if (!alreadySorted) {
	        values = values.slice().sort(compareNumbers);
	    }
	    var l = values.length;
	    var half = Math.floor(l / 2);
	    if (l % 2 === 0) {
	        return (values[half - 1] + values[half]) * 0.5;
	    } else {
	        return values[half];
	    }
	};

	/**
	 * Computes the variance of the given values
	 * @param {Array} values
	 * @param {boolean} [unbiased=true] - if true, divide by (n-1); if false, divide by n.
	 * @returns {number}
	 */
	exports.variance = function variance(values, unbiased) {
	    if (unbiased === undefined) unbiased = true;
	    var theMean = exports.mean(values);
	    var theVariance = 0;
	    var l = values.length;

	    for (var i = 0; i < l; i++) {
	        var x = values[i] - theMean;
	        theVariance += x * x;
	    }

	    if (unbiased) {
	        return theVariance / (l - 1);
	    } else {
	        return theVariance / l;
	    }
	};

	/**
	 * Computes the standard deviation of the given values
	 * @param {Array} values
	 * @param {boolean} [unbiased=true] - if true, divide by (n-1); if false, divide by n.
	 * @returns {number}
	 */
	exports.standardDeviation = function standardDeviation(values, unbiased) {
	    return Math.sqrt(exports.variance(values, unbiased));
	};

	exports.standardError = function standardError(values) {
	    return exports.standardDeviation(values) / Math.sqrt(values.length);
	};

	exports.quartiles = function quartiles(values, alreadySorted) {
	    if (typeof(alreadySorted) === 'undefined') alreadySorted = false;
	    if (!alreadySorted) {
	        values = values.slice();
	        values.sort(compareNumbers);
	    }

	    var quart = values.length / 4;
	    var q1 = values[Math.ceil(quart) - 1];
	    var q2 = exports.median(values, true);
	    var q3 = values[Math.ceil(quart * 3) - 1];

	    return {q1: q1, q2: q2, q3: q3};
	};

	exports.pooledStandardDeviation = function pooledStandardDeviation(samples, unbiased) {
	    return Math.sqrt(exports.pooledVariance(samples, unbiased));
	};

	exports.pooledVariance = function pooledVariance(samples, unbiased) {
	    if (typeof(unbiased) === 'undefined') unbiased = true;
	    var sum = 0;
	    var length = 0, l = samples.length;
	    for (var i = 0; i < l; i++) {
	        var values = samples[i];
	        var vari = exports.variance(values);

	        sum += (values.length - 1) * vari;

	        if (unbiased)
	            length += values.length - 1;
	        else
	            length += values.length;
	    }
	    return sum / length;
	};

	exports.mode = function mode(values) {
	    var l = values.length,
	        itemCount = new Array(l),
	        i;
	    for (i = 0; i < l; i++) {
	        itemCount[i] = 0;
	    }
	    var itemArray = new Array(l);
	    var count = 0;

	    for (i = 0; i < l; i++) {
	        var index = itemArray.indexOf(values[i]);
	        if (index >= 0)
	            itemCount[index]++;
	        else {
	            itemArray[count] = values[i];
	            itemCount[count] = 1;
	            count++;
	        }
	    }

	    var maxValue = 0, maxIndex = 0;
	    for (i = 0; i < count; i++) {
	        if (itemCount[i] > maxValue) {
	            maxValue = itemCount[i];
	            maxIndex = i;
	        }
	    }

	    return itemArray[maxIndex];
	};

	exports.covariance = function covariance(vector1, vector2, unbiased) {
	    if (typeof(unbiased) === 'undefined') unbiased = true;
	    var mean1 = exports.mean(vector1);
	    var mean2 = exports.mean(vector2);

	    if (vector1.length !== vector2.length)
	        throw "Vectors do not have the same dimensions";

	    var cov = 0, l = vector1.length;
	    for (var i = 0; i < l; i++) {
	        var x = vector1[i] - mean1;
	        var y = vector2[i] - mean2;
	        cov += x * y;
	    }

	    if (unbiased)
	        return cov / (l - 1);
	    else
	        return cov / l;
	};

	exports.skewness = function skewness(values, unbiased) {
	    if (typeof(unbiased) === 'undefined') unbiased = true;
	    var theMean = exports.mean(values);

	    var s2 = 0, s3 = 0, l = values.length;
	    for (var i = 0; i < l; i++) {
	        var dev = values[i] - theMean;
	        s2 += dev * dev;
	        s3 += dev * dev * dev;
	    }
	    var m2 = s2 / l;
	    var m3 = s3 / l;

	    var g = m3 / (Math.pow(m2, 3 / 2.0));
	    if (unbiased) {
	        var a = Math.sqrt(l * (l - 1));
	        var b = l - 2;
	        return (a / b) * g;
	    }
	    else {
	        return g;
	    }
	};

	exports.kurtosis = function kurtosis(values, unbiased) {
	    if (typeof(unbiased) === 'undefined') unbiased = true;
	    var theMean = exports.mean(values);
	    var n = values.length, s2 = 0, s4 = 0;

	    for (var i = 0; i < n; i++) {
	        var dev = values[i] - theMean;
	        s2 += dev * dev;
	        s4 += dev * dev * dev * dev;
	    }
	    var m2 = s2 / n;
	    var m4 = s4 / n;

	    if (unbiased) {
	        var v = s2 / (n - 1);
	        var a = (n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3));
	        var b = s4 / (v * v);
	        var c = ((n - 1) * (n - 1)) / ((n - 2) * (n - 3));

	        return a * b - 3 * c;
	    }
	    else {
	        return m4 / (m2 * m2) - 3;
	    }
	};

	exports.entropy = function entropy(values, eps) {
	    if (typeof(eps) === 'undefined') eps = 0;
	    var sum = 0, l = values.length;
	    for (var i = 0; i < l; i++)
	        sum += values[i] * Math.log(values[i] + eps);
	    return -sum;
	};

	exports.weightedMean = function weightedMean(values, weights) {
	    var sum = 0, l = values.length;
	    for (var i = 0; i < l; i++)
	        sum += values[i] * weights[i];
	    return sum;
	};

	exports.weightedStandardDeviation = function weightedStandardDeviation(values, weights) {
	    return Math.sqrt(exports.weightedVariance(values, weights));
	};

	exports.weightedVariance = function weightedVariance(values, weights) {
	    var theMean = exports.weightedMean(values, weights);
	    var vari = 0, l = values.length;
	    var a = 0, b = 0;

	    for (var i = 0; i < l; i++) {
	        var z = values[i] - theMean;
	        var w = weights[i];

	        vari += w * (z * z);
	        b += w;
	        a += w * w;
	    }

	    return vari * (b / (b * b - a));
	};

	exports.center = function center(values, inPlace) {
	    if (typeof(inPlace) === 'undefined') inPlace = false;

	    var result = values;
	    if (!inPlace)
	        result = values.slice();

	    var theMean = exports.mean(result), l = result.length;
	    for (var i = 0; i < l; i++)
	        result[i] -= theMean;
	};

	exports.standardize = function standardize(values, standardDev, inPlace) {
	    if (typeof(standardDev) === 'undefined') standardDev = exports.standardDeviation(values);
	    if (typeof(inPlace) === 'undefined') inPlace = false;
	    var l = values.length;
	    var result = inPlace ? values : new Array(l);
	    for (var i = 0; i < l; i++)
	        result[i] = values[i] / standardDev;
	    return result;
	};

	exports.cumulativeSum = function cumulativeSum(array) {
	    var l = array.length;
	    var result = new Array(l);
	    result[0] = array[0];
	    for (var i = 1; i < l; i++)
	        result[i] = result[i - 1] + array[i];
	    return result;
	};


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var arrayStat = __webpack_require__(33);

	// https://github.com/accord-net/framework/blob/development/Sources/Accord.Statistics/Tools.cs

	function entropy(matrix, eps) {
	    if (typeof(eps) === 'undefined') {
	        eps = 0;
	    }
	    var sum = 0,
	        l1 = matrix.length,
	        l2 = matrix[0].length;
	    for (var i = 0; i < l1; i++) {
	        for (var j = 0; j < l2; j++) {
	            sum += matrix[i][j] * Math.log(matrix[i][j] + eps);
	        }
	    }
	    return -sum;
	}

	function mean(matrix, dimension) {
	    if (typeof(dimension) === 'undefined') {
	        dimension = 0;
	    }
	    var rows = matrix.length,
	        cols = matrix[0].length,
	        theMean, N, i, j;

	    if (dimension === -1) {
	        theMean = [0];
	        N = rows * cols;
	        for (i = 0; i < rows; i++) {
	            for (j = 0; j < cols; j++) {
	                theMean[0] += matrix[i][j];
	            }
	        }
	        theMean[0] /= N;
	    } else if (dimension === 0) {
	        theMean = new Array(cols);
	        N = rows;
	        for (j = 0; j < cols; j++) {
	            theMean[j] = 0;
	            for (i = 0; i < rows; i++) {
	                theMean[j] += matrix[i][j];
	            }
	            theMean[j] /= N;
	        }
	    } else if (dimension === 1) {
	        theMean = new Array(rows);
	        N = cols;
	        for (j = 0; j < rows; j++) {
	            theMean[j] = 0;
	            for (i = 0; i < cols; i++) {
	                theMean[j] += matrix[j][i];
	            }
	            theMean[j] /= N;
	        }
	    } else {
	        throw new Error('Invalid dimension');
	    }
	    return theMean;
	}

	function standardDeviation(matrix, means, unbiased) {
	    var vari = variance(matrix, means, unbiased), l = vari.length;
	    for (var i = 0; i < l; i++) {
	        vari[i] = Math.sqrt(vari[i]);
	    }
	    return vari;
	}

	function variance(matrix, means, unbiased) {
	    if (typeof(unbiased) === 'undefined') {
	        unbiased = true;
	    }
	    means = means || mean(matrix);
	    var rows = matrix.length;
	    if (rows === 0) return [];
	    var cols = matrix[0].length;
	    var vari = new Array(cols);

	    for (var j = 0; j < cols; j++) {
	        var sum1 = 0, sum2 = 0, x = 0;
	        for (var i = 0; i < rows; i++) {
	            x = matrix[i][j] - means[j];
	            sum1 += x;
	            sum2 += x * x;
	        }
	        if (unbiased) {
	            vari[j] = (sum2 - ((sum1 * sum1) / rows)) / (rows - 1);
	        } else {
	            vari[j] = (sum2 - ((sum1 * sum1) / rows)) / rows;
	        }
	    }
	    return vari;
	}

	function median(matrix) {
	    var rows = matrix.length, cols = matrix[0].length;
	    var medians = new Array(cols);

	    for (var i = 0; i < cols; i++) {
	        var data = new Array(rows);
	        for (var j = 0; j < rows; j++) {
	            data[j] = matrix[j][i];
	        }
	        data.sort();
	        var N = data.length;
	        if (N % 2 === 0) {
	            medians[i] = (data[N / 2] + data[(N / 2) - 1]) * 0.5;
	        } else {
	            medians[i] = data[Math.floor(N / 2)];
	        }
	    }
	    return medians;
	}

	function mode(matrix) {
	    var rows = matrix.length,
	        cols = matrix[0].length,
	        modes = new Array(cols),
	        i, j;
	    for (i = 0; i < cols; i++) {
	        var itemCount = new Array(rows);
	        for (var k = 0; k < rows; k++) {
	            itemCount[k] = 0;
	        }
	        var itemArray = new Array(rows);
	        var count = 0;

	        for (j = 0; j < rows; j++) {
	            var index = itemArray.indexOf(matrix[j][i]);
	            if (index >= 0) {
	                itemCount[index]++;
	            } else {
	                itemArray[count] = matrix[j][i];
	                itemCount[count] = 1;
	                count++;
	            }
	        }

	        var maxValue = 0, maxIndex = 0;
	        for (j = 0; j < count; j++) {
	            if (itemCount[j] > maxValue) {
	                maxValue = itemCount[j];
	                maxIndex = j;
	            }
	        }

	        modes[i] = itemArray[maxIndex];
	    }
	    return modes;
	}

	function skewness(matrix, unbiased) {
	    if (typeof(unbiased) === 'undefined') unbiased = true;
	    var means = mean(matrix);
	    var n = matrix.length, l = means.length;
	    var skew = new Array(l);

	    for (var j = 0; j < l; j++) {
	        var s2 = 0, s3 = 0;
	        for (var i = 0; i < n; i++) {
	            var dev = matrix[i][j] - means[j];
	            s2 += dev * dev;
	            s3 += dev * dev * dev;
	        }

	        var m2 = s2 / n;
	        var m3 = s3 / n;
	        var g = m3 / Math.pow(m2, 3 / 2);

	        if (unbiased) {
	            var a = Math.sqrt(n * (n - 1));
	            var b = n - 2;
	            skew[j] = (a / b) * g;
	        } else {
	            skew[j] = g;
	        }
	    }
	    return skew;
	}

	function kurtosis(matrix, unbiased) {
	    if (typeof(unbiased) === 'undefined') unbiased = true;
	    var means = mean(matrix);
	    var n = matrix.length, m = matrix[0].length;
	    var kurt = new Array(m);

	    for (var j = 0; j < m; j++) {
	        var s2 = 0, s4 = 0;
	        for (var i = 0; i < n; i++) {
	            var dev = matrix[i][j] - means[j];
	            s2 += dev * dev;
	            s4 += dev * dev * dev * dev;
	        }
	        var m2 = s2 / n;
	        var m4 = s4 / n;

	        if (unbiased) {
	            var v = s2 / (n - 1);
	            var a = (n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3));
	            var b = s4 / (v * v);
	            var c = ((n - 1) * (n - 1)) / ((n - 2) * (n - 3));
	            kurt[j] = a * b - 3 * c;
	        } else {
	            kurt[j] = m4 / (m2 * m2) - 3;
	        }
	    }
	    return kurt;
	}

	function standardError(matrix) {
	    var samples = matrix.length;
	    var standardDeviations = standardDeviation(matrix), l = standardDeviations.length;
	    var standardErrors = new Array(l);
	    var sqrtN = Math.sqrt(samples);

	    for (var i = 0; i < l; i++) {
	        standardErrors[i] = standardDeviations[i] / sqrtN;
	    }
	    return standardErrors;
	}

	function covariance(matrix, dimension) {
	    return scatter(matrix, undefined, dimension);
	}

	function scatter(matrix, divisor, dimension) {
	    if (typeof(dimension) === 'undefined') {
	        dimension = 0;
	    }
	    if (typeof(divisor) === 'undefined') {
	        if (dimension === 0) {
	            divisor = matrix.length - 1;
	        } else if (dimension === 1) {
	            divisor = matrix[0].length - 1;
	        }
	    }
	    var means = mean(matrix, dimension),
	        rows = matrix.length;
	    if (rows === 0) {
	        return [[]];
	    }
	    var cols = matrix[0].length,
	        cov, i, j, s, k;

	    if (dimension === 0) {
	        cov = new Array(cols);
	        for (i = 0; i < cols; i++) {
	            cov[i] = new Array(cols);
	        }
	        for (i = 0; i < cols; i++) {
	            for (j = i; j < cols; j++) {
	                s = 0;
	                for (k = 0; k < rows; k++) {
	                    s += (matrix[k][j] - means[j]) * (matrix[k][i] - means[i]);
	                }
	                s /= divisor;
	                cov[i][j] = s;
	                cov[j][i] = s;
	            }
	        }
	    } else if (dimension === 1) {
	        cov = new Array(rows);
	        for (i = 0; i < rows; i++) {
	            cov[i] = new Array(rows);
	        }
	        for (i = 0; i < rows; i++) {
	            for (j = i; j < rows; j++) {
	                s = 0;
	                for (k = 0; k < cols; k++) {
	                    s += (matrix[j][k] - means[j]) * (matrix[i][k] - means[i]);
	                }
	                s /= divisor;
	                cov[i][j] = s;
	                cov[j][i] = s;
	            }
	        }
	    } else {
	        throw new Error('Invalid dimension');
	    }

	    return cov;
	}

	function correlation(matrix) {
	    var means = mean(matrix),
	        standardDeviations = standardDeviation(matrix, true, means),
	        scores = zScores(matrix, means, standardDeviations),
	        rows = matrix.length,
	        cols = matrix[0].length,
	        i, j;

	    var cor = new Array(cols);
	    for (i = 0; i < cols; i++) {
	        cor[i] = new Array(cols);
	    }
	    for (i = 0; i < cols; i++) {
	        for (j = i; j < cols; j++) {
	            var c = 0;
	            for (var k = 0, l = scores.length; k < l; k++) {
	                c += scores[k][j] * scores[k][i];
	            }
	            c /= rows - 1;
	            cor[i][j] = c;
	            cor[j][i] = c;
	        }
	    }
	    return cor;
	}

	function zScores(matrix, means, standardDeviations) {
	    means = means || mean(matrix);
	    if (typeof(standardDeviations) === 'undefined') standardDeviations = standardDeviation(matrix, true, means);
	    return standardize(center(matrix, means, false), standardDeviations, true);
	}

	function center(matrix, means, inPlace) {
	    means = means || mean(matrix);
	    var result = matrix,
	        l = matrix.length,
	        i, j, jj;

	    if (!inPlace) {
	        result = new Array(l);
	        for (i = 0; i < l; i++) {
	            result[i] = new Array(matrix[i].length);
	        }
	    }

	    for (i = 0; i < l; i++) {
	        var row = result[i];
	        for (j = 0, jj = row.length; j < jj; j++) {
	            row[j] = matrix[i][j] - means[j];
	        }
	    }
	    return result;
	}

	function standardize(matrix, standardDeviations, inPlace) {
	    if (typeof(standardDeviations) === 'undefined') standardDeviations = standardDeviation(matrix);
	    var result = matrix,
	        l = matrix.length,
	        i, j, jj;

	    if (!inPlace) {
	        result = new Array(l);
	        for (i = 0; i < l; i++) {
	            result[i] = new Array(matrix[i].length);
	        }
	    }

	    for (i = 0; i < l; i++) {
	        var resultRow = result[i];
	        var sourceRow = matrix[i];
	        for (j = 0, jj = resultRow.length; j < jj; j++) {
	            if (standardDeviations[j] !== 0 && !isNaN(standardDeviations[j])) {
	                resultRow[j] = sourceRow[j] / standardDeviations[j];
	            }
	        }
	    }
	    return result;
	}

	function weightedVariance(matrix, weights) {
	    var means = mean(matrix);
	    var rows = matrix.length;
	    if (rows === 0) return [];
	    var cols = matrix[0].length;
	    var vari = new Array(cols);

	    for (var j = 0; j < cols; j++) {
	        var sum = 0;
	        var a = 0, b = 0;

	        for (var i = 0; i < rows; i++) {
	            var z = matrix[i][j] - means[j];
	            var w = weights[i];

	            sum += w * (z * z);
	            b += w;
	            a += w * w;
	        }

	        vari[j] = sum * (b / (b * b - a));
	    }

	    return vari;
	}

	function weightedMean(matrix, weights, dimension) {
	    if (typeof(dimension) === 'undefined') {
	        dimension = 0;
	    }
	    var rows = matrix.length;
	    if (rows === 0) return [];
	    var cols = matrix[0].length,
	        means, i, ii, j, w, row;

	    if (dimension === 0) {
	        means = new Array(cols);
	        for (i = 0; i < cols; i++) {
	            means[i] = 0;
	        }
	        for (i = 0; i < rows; i++) {
	            row = matrix[i];
	            w = weights[i];
	            for (j = 0; j < cols; j++) {
	                means[j] += row[j] * w;
	            }
	        }
	    } else if (dimension === 1) {
	        means = new Array(rows);
	        for (i = 0; i < rows; i++) {
	            means[i] = 0;
	        }
	        for (j = 0; j < rows; j++) {
	            row = matrix[j];
	            w = weights[j];
	            for (i = 0; i < cols; i++) {
	                means[j] += row[i] * w;
	            }
	        }
	    } else {
	        throw new Error('Invalid dimension');
	    }

	    var weightSum = arrayStat.sum(weights);
	    if (weightSum !== 0) {
	        for (i = 0, ii = means.length; i < ii; i++) {
	            means[i] /= weightSum;
	        }
	    }
	    return means;
	}

	function weightedCovariance(matrix, weights, means, dimension) {
	    dimension = dimension || 0;
	    means = means || weightedMean(matrix, weights, dimension);
	    var s1 = 0, s2 = 0;
	    for (var i = 0, ii = weights.length; i < ii; i++) {
	        s1 += weights[i];
	        s2 += weights[i] * weights[i];
	    }
	    var factor = s1 / (s1 * s1 - s2);
	    return weightedScatter(matrix, weights, means, factor, dimension);
	}

	function weightedScatter(matrix, weights, means, factor, dimension) {
	    dimension = dimension || 0;
	    means = means || weightedMean(matrix, weights, dimension);
	    if (typeof(factor) === 'undefined') {
	        factor = 1;
	    }
	    var rows = matrix.length;
	    if (rows === 0) {
	        return [[]];
	    }
	    var cols = matrix[0].length,
	        cov, i, j, k, s;

	    if (dimension === 0) {
	        cov = new Array(cols);
	        for (i = 0; i < cols; i++) {
	            cov[i] = new Array(cols);
	        }
	        for (i = 0; i < cols; i++) {
	            for (j = i; j < cols; j++) {
	                s = 0;
	                for (k = 0; k < rows; k++) {
	                    s += weights[k] * (matrix[k][j] - means[j]) * (matrix[k][i] - means[i]);
	                }
	                cov[i][j] = s * factor;
	                cov[j][i] = s * factor;
	            }
	        }
	    } else if (dimension === 1) {
	        cov = new Array(rows);
	        for (i = 0; i < rows; i++) {
	            cov[i] = new Array(rows);
	        }
	        for (i = 0; i < rows; i++) {
	            for (j = i; j < rows; j++) {
	                s = 0;
	                for (k = 0; k < cols; k++) {
	                    s += weights[k] * (matrix[j][k] - means[j]) * (matrix[i][k] - means[i]);
	                }
	                cov[i][j] = s * factor;
	                cov[j][i] = s * factor;
	            }
	        }
	    } else {
	        throw new Error('Invalid dimension');
	    }

	    return cov;
	}

	module.exports = {
	    entropy: entropy,
	    mean: mean,
	    standardDeviation: standardDeviation,
	    variance: variance,
	    median: median,
	    mode: mode,
	    skewness: skewness,
	    kurtosis: kurtosis,
	    standardError: standardError,
	    covariance: covariance,
	    scatter: scatter,
	    correlation: correlation,
	    zScores: zScores,
	    center: center,
	    standardize: standardize,
	    weightedVariance: weightedVariance,
	    weightedMean: weightedMean,
	    weightedCovariance: weightedCovariance,
	    weightedScatter: weightedScatter
	};


/***/ },
/* 35 */
/***/ function(module, exports) {

	'use strict';

	var hasOwn = Object.prototype.hasOwnProperty;
	var toStr = Object.prototype.toString;

	var isArray = function isArray(arr) {
		if (typeof Array.isArray === 'function') {
			return Array.isArray(arr);
		}

		return toStr.call(arr) === '[object Array]';
	};

	var isPlainObject = function isPlainObject(obj) {
		if (!obj || toStr.call(obj) !== '[object Object]') {
			return false;
		}

		var hasOwnConstructor = hasOwn.call(obj, 'constructor');
		var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
		// Not own constructor property must be Object
		if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		var key;
		for (key in obj) {/**/}

		return typeof key === 'undefined' || hasOwn.call(obj, key);
	};

	module.exports = function extend() {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0],
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if (typeof target === 'boolean') {
			deep = target;
			target = arguments[1] || {};
			// skip the boolean and the target
			i = 2;
		} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
			target = {};
		}

		for (; i < length; ++i) {
			options = arguments[i];
			// Only deal with non-null/undefined values
			if (options != null) {
				// Extend the base object
				for (name in options) {
					src = target[name];
					copy = options[name];

					// Prevent never-ending loop
					if (target !== copy) {
						// Recurse if we're merging plain objects or arrays
						if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
							if (copyIsArray) {
								copyIsArray = false;
								clone = src && isArray(src) ? src : [];
							} else {
								clone = src && isPlainObject(src) ? src : {};
							}

							// Never move original objects, clone them
							target[name] = extend(deep, clone, copy);

						// Don't bring in undefined values
						} else if (typeof copy !== 'undefined') {
							target[name] = copy;
						}
					}
				}
			}
		}

		// Return the modified object
		return target;
	};



/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	//Code translate from Pascal source in http://pubs.acs.org/doi/pdf/10.1021/ac00205a007
	var extend = __webpack_require__(35);
	var stat = __webpack_require__(37);

	var defaultOptions = {
	    windowSize: 11,
	    derivative: 0,
	    polynomial: 2,
	};


	function SavitzkyGolay(data, h, options) {
	    options = extend({}, defaultOptions, options);

	    if ((options.windowSize % 2 === 0) || (options.windowSize < 5) || !(Number.isInteger(options.windowSize)))
	            throw new RangeError('Invalid window size (should be odd and at least 5 integer number)')


	    if (options.windowSize>data.length)
	        throw new RangeError('Window size is higher than the data length '+options.windowSize+">"+data.length);
	    if ((options.derivative < 0) || !(Number.isInteger(options.derivative)))
	        throw new RangeError('Derivative should be a positive integer');
	    if ((options.polynomial < 1) || !(Number.isInteger(options.polynomial)))
	        throw new RangeError('Polynomial should be a positive integer');
	    if (options.polynomial >= 6)
	        console.warn('You should not use polynomial grade higher than 5 if you are' +
	            ' not sure that your data arises from such a model. Possible polynomial oscillation problems');

	    var windowSize = options.windowSize;

	    var half = Math.floor(windowSize/2);
	    var np = data.length;
	    var ans = new Array(np);
	    var weights = fullWeights(windowSize,options.polynomial,options.derivative);
	    var hs = 0;
	    var constantH = true;
	    if( Object.prototype.toString.call( h ) === '[object Array]' ) {
	        constantH = false;
	    }
	    else{
	        hs = Math.pow(h, options.derivative);
	    }
	    //console.log("Constant h: "+constantH);
	    //For the borders
	    for(var i=0;i<half;i++){
	        var wg1=weights[half-i-1];
	        var wg2=weights[half+i+1];
	        var d1 = 0,d2=0;
	        for (var l = 0; l < windowSize; l++){
	            d1 += wg1[l] * data[l];
	            d2 += wg2[l] * data[np-windowSize+l-1];
	        }
	        if(constantH){
	            ans[half-i-1] = d1/hs;
	            ans[np-half+i] = d2/hs;
	        }
	        else{
	            hs = getHs(h,half-i-1,half, options.derivative);
	            ans[half-i-1] = d1/hs;
	            hs = getHs(h,np-half+i,half, options.derivative);
	            ans[np-half+i] = d2/hs;
	        }
	    }
	    //For the internal points
	    var wg = weights[half];
	    for(var i=windowSize;i<np+1;i++){
	        var d = 0;
	        for (var l = 0; l < windowSize; l++)
	            d += wg[l] * data[l+i-windowSize];
	        if(!constantH)
	            hs = getHs(h,i-half-1,half, options.derivative);
	        ans[i-half-1] = d/hs;
	    }
	    return ans;
	}

	function getHs(h,center,half,derivative){
	    var hs = 0;
	    var count = 0;
	    for(var i=center-half;i<center+half;i++){
	        if(i>=0 && i < h.length-1){
	            hs+= (h[i+1]-h[i]);
	            count++;
	        }
	    }
	    return Math.pow(hs/count,derivative);
	}

	function GramPoly(i,m,k,s){
	    var Grampoly = 0;
	    if(k>0){
	        Grampoly = (4*k-2)/(k*(2*m-k+1))*(i*GramPoly(i,m,k-1,s) +
	            s*GramPoly(i,m,k-1,s-1)) - ((k-1)*(2*m+k))/(k*(2*m-k+1))*GramPoly(i,m,k-2,s);
	    }
	    else{
	        if(k==0&&s==0){
	            Grampoly=1;
	        }
	        else{
	            Grampoly=0;
	        }
	    }
	    //console.log(Grampoly);
	    return Grampoly;
	}

	function GenFact(a,b){
	    var gf=1;
	    if(a>=b){
	        for(var j=a-b+1;j<=a;j++){
	            gf*=j;
	        }
	    }
	    return gf;
	}

	function Weight(i,t,m,n,s){
	    var sum=0;
	    for(var k=0;k<=n;k++){
	        //console.log(k);
	        sum+=(2*k+1)*(GenFact(2*m,k)/GenFact(2*m+k+1,k+1))*GramPoly(i,m,k,0)*GramPoly(t,m,k,s)
	    }
	    return sum;
	}

	/**
	 *
	 * @param m  Number of points
	 * @param n  Polynomial grade
	 * @param s  Derivative
	 */
	function fullWeights(m,n,s){
	    var weights = new Array(m);
	    var np = Math.floor(m/2);
	    for(var t=-np;t<=np;t++){
	        weights[t+np] = new Array(m);
	        for(var j=-np;j<=np;j++){
	            weights[t+np][j+np]=Weight(j,t,np,n,s);
	        }
	    }
	    return weights;
	}

	/*function entropy(data,h,options){
	    var trend = SavitzkyGolay(data,h,trendOptions);
	    var copy = new Array(data.length);
	    var sum = 0;
	    var max = 0;
	    for(var i=0;i<data.length;i++){
	        copy[i] = data[i]-trend[i];
	    }

	    sum/=data.length;
	    console.log(sum+" "+max);
	    console.log(stat.array.standardDeviation(copy));
	    console.log(Math.abs(stat.array.mean(copy))/stat.array.standardDeviation(copy));
	    return sum;

	}



	function guessWindowSize(data, h){
	    console.log("entropy "+entropy(data,h,trendOptions));
	    return 5;
	}
	*/
	module.exports = SavitzkyGolay;
	 


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.array = __webpack_require__(38);
	exports.matrix = __webpack_require__(39);


/***/ },
/* 38 */
/***/ function(module, exports) {

	'use strict';

	function compareNumbers(a, b) {
	    return a - b;
	}

	/**
	 * Computes the sum of the given values
	 * @param {Array} values
	 * @returns {number}
	 */
	exports.sum = function sum(values) {
	    var sum = 0;
	    for (var i = 0; i < values.length; i++) {
	        sum += values[i];
	    }
	    return sum;
	};

	/**
	 * Computes the maximum of the given values
	 * @param {Array} values
	 * @returns {number}
	 */
	exports.max = function max(values) {
	    var max = -Infinity;
	    var l = values.length;
	    for (var i = 0; i < l; i++) {
	        if (values[i] > max) max = values[i];
	    }
	    return max;
	};

	/**
	 * Computes the minimum of the given values
	 * @param {Array} values
	 * @returns {number}
	 */
	exports.min = function min(values) {
	    var min = Infinity;
	    var l = values.length;
	    for (var i = 0; i < l; i++) {
	        if (values[i] < min) min = values[i];
	    }
	    return min;
	};

	/**
	 * Computes the min and max of the given values
	 * @param {Array} values
	 * @returns {{min: number, max: number}}
	 */
	exports.minMax = function minMax(values) {
	    var min = Infinity;
	    var max = -Infinity;
	    var l = values.length;
	    for (var i = 0; i < l; i++) {
	        if (values[i] < min) min = values[i];
	        if (values[i] > max) max = values[i];
	    }
	    return {
	        min: min,
	        max: max
	    };
	};

	/**
	 * Computes the arithmetic mean of the given values
	 * @param {Array} values
	 * @returns {number}
	 */
	exports.arithmeticMean = function arithmeticMean(values) {
	    var sum = 0;
	    var l = values.length;
	    for (var i = 0; i < l; i++) {
	        sum += values[i];
	    }
	    return sum / l;
	};

	/**
	 * {@link arithmeticMean}
	 */
	exports.mean = exports.arithmeticMean;

	/**
	 * Computes the geometric mean of the given values
	 * @param {Array} values
	 * @returns {number}
	 */
	exports.geometricMean = function geometricMean(values) {
	    var mul = 1;
	    var l = values.length;
	    for (var i = 0; i < l; i++) {
	        mul *= values[i];
	    }
	    return Math.pow(mul, 1 / l);
	};

	/**
	 * Computes the mean of the log of the given values
	 * If the return value is exponentiated, it gives the same result as the
	 * geometric mean.
	 * @param {Array} values
	 * @returns {number}
	 */
	exports.logMean = function logMean(values) {
	    var lnsum = 0;
	    var l = values.length;
	    for (var i = 0; i < l; i++) {
	        lnsum += Math.log(values[i]);
	    }
	    return lnsum / l;
	};

	/**
	 * Computes the weighted grand mean for a list of means and sample sizes
	 * @param {Array} means - Mean values for each set of samples
	 * @param {Array} samples - Number of original values for each set of samples
	 * @returns {number}
	 */
	exports.grandMean = function grandMean(means, samples) {
	    var sum = 0;
	    var n = 0;
	    var l = means.length;
	    for (var i = 0; i < l; i++) {
	        sum += samples[i] * means[i];
	        n += samples[i];
	    }
	    return sum / n;
	};

	/**
	 * Computes the truncated mean of the given values using a given percentage
	 * @param {Array} values
	 * @param {number} percent - The percentage of values to keep (range: [0,1])
	 * @param {boolean} [alreadySorted=false]
	 * @returns {number}
	 */
	exports.truncatedMean = function truncatedMean(values, percent, alreadySorted) {
	    if (alreadySorted === undefined) alreadySorted = false;
	    if (!alreadySorted) {
	        values = values.slice().sort(compareNumbers);
	    }
	    var l = values.length;
	    var k = Math.floor(l * percent);
	    var sum = 0;
	    for (var i = k; i < (l - k); i++) {
	        sum += values[i];
	    }
	    return sum / (l - 2 * k);
	};

	/**
	 * Computes the harmonic mean of the given values
	 * @param {Array} values
	 * @returns {number}
	 */
	exports.harmonicMean = function harmonicMean(values) {
	    var sum = 0;
	    var l = values.length;
	    for (var i = 0; i < l; i++) {
	        if (values[i] === 0) {
	            throw new RangeError('value at index ' + i + 'is zero');
	        }
	        sum += 1 / values[i];
	    }
	    return l / sum;
	};

	/**
	 * Computes the contraharmonic mean of the given values
	 * @param {Array} values
	 * @returns {number}
	 */
	exports.contraHarmonicMean = function contraHarmonicMean(values) {
	    var r1 = 0;
	    var r2 = 0;
	    var l = values.length;
	    for (var i = 0; i < l; i++) {
	        r1 += values[i] * values[i];
	        r2 += values[i];
	    }
	    if (r2 < 0) {
	        throw new RangeError('sum of values is negative');
	    }
	    return r1 / r2;
	};

	/**
	 * Computes the median of the given values
	 * @param {Array} values
	 * @param {boolean} [alreadySorted=false]
	 * @returns {number}
	 */
	exports.median = function median(values, alreadySorted) {
	    if (alreadySorted === undefined) alreadySorted = false;
	    if (!alreadySorted) {
	        values = values.slice().sort(compareNumbers);
	    }
	    var l = values.length;
	    var half = Math.floor(l / 2);
	    if (l % 2 === 0) {
	        return (values[half - 1] + values[half]) * 0.5;
	    } else {
	        return values[half];
	    }
	};

	/**
	 * Computes the variance of the given values
	 * @param {Array} values
	 * @param {boolean} [unbiased=true] - if true, divide by (n-1); if false, divide by n.
	 * @returns {number}
	 */
	exports.variance = function variance(values, unbiased) {
	    if (unbiased === undefined) unbiased = true;
	    var theMean = exports.mean(values);
	    var theVariance = 0;
	    var l = values.length;

	    for (var i = 0; i < l; i++) {
	        var x = values[i] - theMean;
	        theVariance += x * x;
	    }

	    if (unbiased) {
	        return theVariance / (l - 1);
	    } else {
	        return theVariance / l;
	    }
	};

	/**
	 * Computes the standard deviation of the given values
	 * @param {Array} values
	 * @param {boolean} [unbiased=true] - if true, divide by (n-1); if false, divide by n.
	 * @returns {number}
	 */
	exports.standardDeviation = function standardDeviation(values, unbiased) {
	    return Math.sqrt(exports.variance(values, unbiased));
	};

	exports.standardError = function standardError(values) {
	    return exports.standardDeviation(values) / Math.sqrt(values.length);
	};

	exports.quartiles = function quartiles(values, alreadySorted) {
	    if (typeof(alreadySorted) === 'undefined') alreadySorted = false;
	    if (!alreadySorted) {
	        values = values.slice();
	        values.sort(compareNumbers);
	    }

	    var quart = values.length / 4;
	    var q1 = values[Math.ceil(quart) - 1];
	    var q2 = exports.median(values, true);
	    var q3 = values[Math.ceil(quart * 3) - 1];

	    return {q1: q1, q2: q2, q3: q3};
	};

	exports.pooledStandardDeviation = function pooledStandardDeviation(samples, unbiased) {
	    return Math.sqrt(exports.pooledVariance(samples, unbiased));
	};

	exports.pooledVariance = function pooledVariance(samples, unbiased) {
	    if (typeof(unbiased) === 'undefined') unbiased = true;
	    var sum = 0;
	    var length = 0, l = samples.length;
	    for (var i = 0; i < l; i++) {
	        var values = samples[i];
	        var vari = exports.variance(values);

	        sum += (values.length - 1) * vari;

	        if (unbiased)
	            length += values.length - 1;
	        else
	            length += values.length;
	    }
	    return sum / length;
	};

	exports.mode = function mode(values) {
	    var l = values.length,
	        itemCount = new Array(l),
	        i;
	    for (i = 0; i < l; i++) {
	        itemCount[i] = 0;
	    }
	    var itemArray = new Array(l);
	    var count = 0;

	    for (i = 0; i < l; i++) {
	        var index = itemArray.indexOf(values[i]);
	        if (index >= 0)
	            itemCount[index]++;
	        else {
	            itemArray[count] = values[i];
	            itemCount[count] = 1;
	            count++;
	        }
	    }

	    var maxValue = 0, maxIndex = 0;
	    for (i = 0; i < count; i++) {
	        if (itemCount[i] > maxValue) {
	            maxValue = itemCount[i];
	            maxIndex = i;
	        }
	    }

	    return itemArray[maxIndex];
	};

	exports.covariance = function covariance(vector1, vector2, unbiased) {
	    if (typeof(unbiased) === 'undefined') unbiased = true;
	    var mean1 = exports.mean(vector1);
	    var mean2 = exports.mean(vector2);

	    if (vector1.length !== vector2.length)
	        throw "Vectors do not have the same dimensions";

	    var cov = 0, l = vector1.length;
	    for (var i = 0; i < l; i++) {
	        var x = vector1[i] - mean1;
	        var y = vector2[i] - mean2;
	        cov += x * y;
	    }

	    if (unbiased)
	        return cov / (l - 1);
	    else
	        return cov / l;
	};

	exports.skewness = function skewness(values, unbiased) {
	    if (typeof(unbiased) === 'undefined') unbiased = true;
	    var theMean = exports.mean(values);

	    var s2 = 0, s3 = 0, l = values.length;
	    for (var i = 0; i < l; i++) {
	        var dev = values[i] - theMean;
	        s2 += dev * dev;
	        s3 += dev * dev * dev;
	    }
	    var m2 = s2 / l;
	    var m3 = s3 / l;

	    var g = m3 / (Math.pow(m2, 3 / 2.0));
	    if (unbiased) {
	        var a = Math.sqrt(l * (l - 1));
	        var b = l - 2;
	        return (a / b) * g;
	    }
	    else {
	        return g;
	    }
	};

	exports.kurtosis = function kurtosis(values, unbiased) {
	    if (typeof(unbiased) === 'undefined') unbiased = true;
	    var theMean = exports.mean(values);
	    var n = values.length, s2 = 0, s4 = 0;

	    for (var i = 0; i < n; i++) {
	        var dev = values[i] - theMean;
	        s2 += dev * dev;
	        s4 += dev * dev * dev * dev;
	    }
	    var m2 = s2 / n;
	    var m4 = s4 / n;

	    if (unbiased) {
	        var v = s2 / (n - 1);
	        var a = (n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3));
	        var b = s4 / (v * v);
	        var c = ((n - 1) * (n - 1)) / ((n - 2) * (n - 3));

	        return a * b - 3 * c;
	    }
	    else {
	        return m4 / (m2 * m2) - 3;
	    }
	};

	exports.entropy = function entropy(values, eps) {
	    if (typeof(eps) === 'undefined') eps = 0;
	    var sum = 0, l = values.length;
	    for (var i = 0; i < l; i++)
	        sum += values[i] * Math.log(values[i] + eps);
	    return -sum;
	};

	exports.weightedMean = function weightedMean(values, weights) {
	    var sum = 0, l = values.length;
	    for (var i = 0; i < l; i++)
	        sum += values[i] * weights[i];
	    return sum;
	};

	exports.weightedStandardDeviation = function weightedStandardDeviation(values, weights) {
	    return Math.sqrt(exports.weightedVariance(values, weights));
	};

	exports.weightedVariance = function weightedVariance(values, weights) {
	    var theMean = exports.weightedMean(values, weights);
	    var vari = 0, l = values.length;
	    var a = 0, b = 0;

	    for (var i = 0; i < l; i++) {
	        var z = values[i] - theMean;
	        var w = weights[i];

	        vari += w * (z * z);
	        b += w;
	        a += w * w;
	    }

	    return vari * (b / (b * b - a));
	};

	exports.center = function center(values, inPlace) {
	    if (typeof(inPlace) === 'undefined') inPlace = false;

	    var result = values;
	    if (!inPlace)
	        result = values.slice();

	    var theMean = exports.mean(result), l = result.length;
	    for (var i = 0; i < l; i++)
	        result[i] -= theMean;
	};

	exports.standardize = function standardize(values, standardDev, inPlace) {
	    if (typeof(standardDev) === 'undefined') standardDev = exports.standardDeviation(values);
	    if (typeof(inPlace) === 'undefined') inPlace = false;
	    var l = values.length;
	    var result = inPlace ? values : new Array(l);
	    for (var i = 0; i < l; i++)
	        result[i] = values[i] / standardDev;
	    return result;
	};

	exports.cumulativeSum = function cumulativeSum(array) {
	    var l = array.length;
	    var result = new Array(l);
	    result[0] = array[0];
	    for (var i = 1; i < l; i++)
	        result[i] = result[i - 1] + array[i];
	    return result;
	};


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var arrayStat = __webpack_require__(38);

	// https://github.com/accord-net/framework/blob/development/Sources/Accord.Statistics/Tools.cs

	function entropy(matrix, eps) {
	    if (typeof(eps) === 'undefined') {
	        eps = 0;
	    }
	    var sum = 0,
	        l1 = matrix.length,
	        l2 = matrix[0].length;
	    for (var i = 0; i < l1; i++) {
	        for (var j = 0; j < l2; j++) {
	            sum += matrix[i][j] * Math.log(matrix[i][j] + eps);
	        }
	    }
	    return -sum;
	}

	function mean(matrix, dimension) {
	    if (typeof(dimension) === 'undefined') {
	        dimension = 0;
	    }
	    var rows = matrix.length,
	        cols = matrix[0].length,
	        theMean, N, i, j;

	    if (dimension === -1) {
	        theMean = [0];
	        N = rows * cols;
	        for (i = 0; i < rows; i++) {
	            for (j = 0; j < cols; j++) {
	                theMean[0] += matrix[i][j];
	            }
	        }
	        theMean[0] /= N;
	    } else if (dimension === 0) {
	        theMean = new Array(cols);
	        N = rows;
	        for (j = 0; j < cols; j++) {
	            theMean[j] = 0;
	            for (i = 0; i < rows; i++) {
	                theMean[j] += matrix[i][j];
	            }
	            theMean[j] /= N;
	        }
	    } else if (dimension === 1) {
	        theMean = new Array(rows);
	        N = cols;
	        for (j = 0; j < rows; j++) {
	            theMean[j] = 0;
	            for (i = 0; i < cols; i++) {
	                theMean[j] += matrix[j][i];
	            }
	            theMean[j] /= N;
	        }
	    } else {
	        throw new Error('Invalid dimension');
	    }
	    return theMean;
	}

	function standardDeviation(matrix, means, unbiased) {
	    var vari = variance(matrix, means, unbiased), l = vari.length;
	    for (var i = 0; i < l; i++) {
	        vari[i] = Math.sqrt(vari[i]);
	    }
	    return vari;
	}

	function variance(matrix, means, unbiased) {
	    if (typeof(unbiased) === 'undefined') {
	        unbiased = true;
	    }
	    means = means || mean(matrix);
	    var rows = matrix.length;
	    if (rows === 0) return [];
	    var cols = matrix[0].length;
	    var vari = new Array(cols);

	    for (var j = 0; j < cols; j++) {
	        var sum1 = 0, sum2 = 0, x = 0;
	        for (var i = 0; i < rows; i++) {
	            x = matrix[i][j] - means[j];
	            sum1 += x;
	            sum2 += x * x;
	        }
	        if (unbiased) {
	            vari[j] = (sum2 - ((sum1 * sum1) / rows)) / (rows - 1);
	        } else {
	            vari[j] = (sum2 - ((sum1 * sum1) / rows)) / rows;
	        }
	    }
	    return vari;
	}

	function median(matrix) {
	    var rows = matrix.length, cols = matrix[0].length;
	    var medians = new Array(cols);

	    for (var i = 0; i < cols; i++) {
	        var data = new Array(rows);
	        for (var j = 0; j < rows; j++) {
	            data[j] = matrix[j][i];
	        }
	        data.sort();
	        var N = data.length;
	        if (N % 2 === 0) {
	            medians[i] = (data[N / 2] + data[(N / 2) - 1]) * 0.5;
	        } else {
	            medians[i] = data[Math.floor(N / 2)];
	        }
	    }
	    return medians;
	}

	function mode(matrix) {
	    var rows = matrix.length,
	        cols = matrix[0].length,
	        modes = new Array(cols),
	        i, j;
	    for (i = 0; i < cols; i++) {
	        var itemCount = new Array(rows);
	        for (var k = 0; k < rows; k++) {
	            itemCount[k] = 0;
	        }
	        var itemArray = new Array(rows);
	        var count = 0;

	        for (j = 0; j < rows; j++) {
	            var index = itemArray.indexOf(matrix[j][i]);
	            if (index >= 0) {
	                itemCount[index]++;
	            } else {
	                itemArray[count] = matrix[j][i];
	                itemCount[count] = 1;
	                count++;
	            }
	        }

	        var maxValue = 0, maxIndex = 0;
	        for (j = 0; j < count; j++) {
	            if (itemCount[j] > maxValue) {
	                maxValue = itemCount[j];
	                maxIndex = j;
	            }
	        }

	        modes[i] = itemArray[maxIndex];
	    }
	    return modes;
	}

	function skewness(matrix, unbiased) {
	    if (typeof(unbiased) === 'undefined') unbiased = true;
	    var means = mean(matrix);
	    var n = matrix.length, l = means.length;
	    var skew = new Array(l);

	    for (var j = 0; j < l; j++) {
	        var s2 = 0, s3 = 0;
	        for (var i = 0; i < n; i++) {
	            var dev = matrix[i][j] - means[j];
	            s2 += dev * dev;
	            s3 += dev * dev * dev;
	        }

	        var m2 = s2 / n;
	        var m3 = s3 / n;
	        var g = m3 / Math.pow(m2, 3 / 2);

	        if (unbiased) {
	            var a = Math.sqrt(n * (n - 1));
	            var b = n - 2;
	            skew[j] = (a / b) * g;
	        } else {
	            skew[j] = g;
	        }
	    }
	    return skew;
	}

	function kurtosis(matrix, unbiased) {
	    if (typeof(unbiased) === 'undefined') unbiased = true;
	    var means = mean(matrix);
	    var n = matrix.length, m = matrix[0].length;
	    var kurt = new Array(m);

	    for (var j = 0; j < m; j++) {
	        var s2 = 0, s4 = 0;
	        for (var i = 0; i < n; i++) {
	            var dev = matrix[i][j] - means[j];
	            s2 += dev * dev;
	            s4 += dev * dev * dev * dev;
	        }
	        var m2 = s2 / n;
	        var m4 = s4 / n;

	        if (unbiased) {
	            var v = s2 / (n - 1);
	            var a = (n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3));
	            var b = s4 / (v * v);
	            var c = ((n - 1) * (n - 1)) / ((n - 2) * (n - 3));
	            kurt[j] = a * b - 3 * c;
	        } else {
	            kurt[j] = m4 / (m2 * m2) - 3;
	        }
	    }
	    return kurt;
	}

	function standardError(matrix) {
	    var samples = matrix.length;
	    var standardDeviations = standardDeviation(matrix), l = standardDeviations.length;
	    var standardErrors = new Array(l);
	    var sqrtN = Math.sqrt(samples);

	    for (var i = 0; i < l; i++) {
	        standardErrors[i] = standardDeviations[i] / sqrtN;
	    }
	    return standardErrors;
	}

	function covariance(matrix, dimension) {
	    return scatter(matrix, undefined, dimension);
	}

	function scatter(matrix, divisor, dimension) {
	    if (typeof(dimension) === 'undefined') {
	        dimension = 0;
	    }
	    if (typeof(divisor) === 'undefined') {
	        if (dimension === 0) {
	            divisor = matrix.length - 1;
	        } else if (dimension === 1) {
	            divisor = matrix[0].length - 1;
	        }
	    }
	    var means = mean(matrix, dimension),
	        rows = matrix.length;
	    if (rows === 0) {
	        return [[]];
	    }
	    var cols = matrix[0].length,
	        cov, i, j, s, k;

	    if (dimension === 0) {
	        cov = new Array(cols);
	        for (i = 0; i < cols; i++) {
	            cov[i] = new Array(cols);
	        }
	        for (i = 0; i < cols; i++) {
	            for (j = i; j < cols; j++) {
	                s = 0;
	                for (k = 0; k < rows; k++) {
	                    s += (matrix[k][j] - means[j]) * (matrix[k][i] - means[i]);
	                }
	                s /= divisor;
	                cov[i][j] = s;
	                cov[j][i] = s;
	            }
	        }
	    } else if (dimension === 1) {
	        cov = new Array(rows);
	        for (i = 0; i < rows; i++) {
	            cov[i] = new Array(rows);
	        }
	        for (i = 0; i < rows; i++) {
	            for (j = i; j < rows; j++) {
	                s = 0;
	                for (k = 0; k < cols; k++) {
	                    s += (matrix[j][k] - means[j]) * (matrix[i][k] - means[i]);
	                }
	                s /= divisor;
	                cov[i][j] = s;
	                cov[j][i] = s;
	            }
	        }
	    } else {
	        throw new Error('Invalid dimension');
	    }

	    return cov;
	}

	function correlation(matrix) {
	    var means = mean(matrix),
	        standardDeviations = standardDeviation(matrix, true, means),
	        scores = zScores(matrix, means, standardDeviations),
	        rows = matrix.length,
	        cols = matrix[0].length,
	        i, j;

	    var cor = new Array(cols);
	    for (i = 0; i < cols; i++) {
	        cor[i] = new Array(cols);
	    }
	    for (i = 0; i < cols; i++) {
	        for (j = i; j < cols; j++) {
	            var c = 0;
	            for (var k = 0, l = scores.length; k < l; k++) {
	                c += scores[k][j] * scores[k][i];
	            }
	            c /= rows - 1;
	            cor[i][j] = c;
	            cor[j][i] = c;
	        }
	    }
	    return cor;
	}

	function zScores(matrix, means, standardDeviations) {
	    means = means || mean(matrix);
	    if (typeof(standardDeviations) === 'undefined') standardDeviations = standardDeviation(matrix, true, means);
	    return standardize(center(matrix, means, false), standardDeviations, true);
	}

	function center(matrix, means, inPlace) {
	    means = means || mean(matrix);
	    var result = matrix,
	        l = matrix.length,
	        i, j, jj;

	    if (!inPlace) {
	        result = new Array(l);
	        for (i = 0; i < l; i++) {
	            result[i] = new Array(matrix[i].length);
	        }
	    }

	    for (i = 0; i < l; i++) {
	        var row = result[i];
	        for (j = 0, jj = row.length; j < jj; j++) {
	            row[j] = matrix[i][j] - means[j];
	        }
	    }
	    return result;
	}

	function standardize(matrix, standardDeviations, inPlace) {
	    if (typeof(standardDeviations) === 'undefined') standardDeviations = standardDeviation(matrix);
	    var result = matrix,
	        l = matrix.length,
	        i, j, jj;

	    if (!inPlace) {
	        result = new Array(l);
	        for (i = 0; i < l; i++) {
	            result[i] = new Array(matrix[i].length);
	        }
	    }

	    for (i = 0; i < l; i++) {
	        var resultRow = result[i];
	        var sourceRow = matrix[i];
	        for (j = 0, jj = resultRow.length; j < jj; j++) {
	            if (standardDeviations[j] !== 0 && !isNaN(standardDeviations[j])) {
	                resultRow[j] = sourceRow[j] / standardDeviations[j];
	            }
	        }
	    }
	    return result;
	}

	function weightedVariance(matrix, weights) {
	    var means = mean(matrix);
	    var rows = matrix.length;
	    if (rows === 0) return [];
	    var cols = matrix[0].length;
	    var vari = new Array(cols);

	    for (var j = 0; j < cols; j++) {
	        var sum = 0;
	        var a = 0, b = 0;

	        for (var i = 0; i < rows; i++) {
	            var z = matrix[i][j] - means[j];
	            var w = weights[i];

	            sum += w * (z * z);
	            b += w;
	            a += w * w;
	        }

	        vari[j] = sum * (b / (b * b - a));
	    }

	    return vari;
	}

	function weightedMean(matrix, weights, dimension) {
	    if (typeof(dimension) === 'undefined') {
	        dimension = 0;
	    }
	    var rows = matrix.length;
	    if (rows === 0) return [];
	    var cols = matrix[0].length,
	        means, i, ii, j, w, row;

	    if (dimension === 0) {
	        means = new Array(cols);
	        for (i = 0; i < cols; i++) {
	            means[i] = 0;
	        }
	        for (i = 0; i < rows; i++) {
	            row = matrix[i];
	            w = weights[i];
	            for (j = 0; j < cols; j++) {
	                means[j] += row[j] * w;
	            }
	        }
	    } else if (dimension === 1) {
	        means = new Array(rows);
	        for (i = 0; i < rows; i++) {
	            means[i] = 0;
	        }
	        for (j = 0; j < rows; j++) {
	            row = matrix[j];
	            w = weights[j];
	            for (i = 0; i < cols; i++) {
	                means[j] += row[i] * w;
	            }
	        }
	    } else {
	        throw new Error('Invalid dimension');
	    }

	    var weightSum = arrayStat.sum(weights);
	    if (weightSum !== 0) {
	        for (i = 0, ii = means.length; i < ii; i++) {
	            means[i] /= weightSum;
	        }
	    }
	    return means;
	}

	function weightedCovariance(matrix, weights, means, dimension) {
	    dimension = dimension || 0;
	    means = means || weightedMean(matrix, weights, dimension);
	    var s1 = 0, s2 = 0;
	    for (var i = 0, ii = weights.length; i < ii; i++) {
	        s1 += weights[i];
	        s2 += weights[i] * weights[i];
	    }
	    var factor = s1 / (s1 * s1 - s2);
	    return weightedScatter(matrix, weights, means, factor, dimension);
	}

	function weightedScatter(matrix, weights, means, factor, dimension) {
	    dimension = dimension || 0;
	    means = means || weightedMean(matrix, weights, dimension);
	    if (typeof(factor) === 'undefined') {
	        factor = 1;
	    }
	    var rows = matrix.length;
	    if (rows === 0) {
	        return [[]];
	    }
	    var cols = matrix[0].length,
	        cov, i, j, k, s;

	    if (dimension === 0) {
	        cov = new Array(cols);
	        for (i = 0; i < cols; i++) {
	            cov[i] = new Array(cols);
	        }
	        for (i = 0; i < cols; i++) {
	            for (j = i; j < cols; j++) {
	                s = 0;
	                for (k = 0; k < rows; k++) {
	                    s += weights[k] * (matrix[k][j] - means[j]) * (matrix[k][i] - means[i]);
	                }
	                cov[i][j] = s * factor;
	                cov[j][i] = s * factor;
	            }
	        }
	    } else if (dimension === 1) {
	        cov = new Array(rows);
	        for (i = 0; i < rows; i++) {
	            cov[i] = new Array(rows);
	        }
	        for (i = 0; i < rows; i++) {
	            for (j = i; j < rows; j++) {
	                s = 0;
	                for (k = 0; k < cols; k++) {
	                    s += weights[k] * (matrix[j][k] - means[j]) * (matrix[i][k] - means[i]);
	                }
	                cov[i][j] = s * factor;
	                cov[j][i] = s * factor;
	            }
	        }
	    } else {
	        throw new Error('Invalid dimension');
	    }

	    return cov;
	}

	module.exports = {
	    entropy: entropy,
	    mean: mean,
	    standardDeviation: standardDeviation,
	    variance: variance,
	    median: median,
	    mode: mode,
	    skewness: skewness,
	    kurtosis: kurtosis,
	    standardError: standardError,
	    covariance: covariance,
	    scatter: scatter,
	    correlation: correlation,
	    zScores: zScores,
	    center: center,
	    standardize: standardize,
	    weightedVariance: weightedVariance,
	    weightedMean: weightedMean,
	    weightedCovariance: weightedCovariance,
	    weightedScatter: weightedScatter
	};


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var SD = __webpack_require__(1);
	var PeakPicking2D = __webpack_require__(41);
	var PeakOptimizer = __webpack_require__(45);
	var JcampConverter=__webpack_require__(3);

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
	    if(!options.id){
	        id=options.id;
	    }
	    var peakList = PeakPicking2D.findPeaks2D(this, options.thresholdFactor);

	    //lets add an unique ID for each peak.
	    for(var i=0;i<peakList.length;i++){
	        peakList[i]._highlight=[id+"_"+i];
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


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var lib = __webpack_require__(42);
	var PeakOptimizer = __webpack_require__(45);
	var SimpleClustering =  __webpack_require__(46);
	var StatArray = __webpack_require__(2);
	var FFTUtils = lib.FFTUtils;

	var PeakPicking2D= {
	    DEBUG : false,
	    smallFilter : [
	        [0, 0, 1, 2, 2, 2, 1, 0, 0],
	        [0, 1, 4, 7, 7, 7, 4, 1, 0],
	        [1, 4, 5, 3, 0, 3, 5, 4, 1],
	        [2, 7, 3, -12, -23, -12, 3, 7, 2],
	        [2, 7, 0, -23, -40, -23, 0, 7, 2],
	        [2, 7, 3, -12, -23, -12, 3, 7, 2],
	        [1, 4, 5, 3, 0, 3, 5, 4, 1],
	        [0, 1, 3, 7, 7, 7, 3, 1, 0],
	        [0, 0, 1, 2, 2, 2, 1, 0, 0]],


	    //How noisy is the spectrum depending on the kind of experiment.
	    getLoGnStdDevNMR : function(spectraData) {
	    if (spectraData.isHomoNuclear())
	        return 1.5
	    else
	        return 3;
	    },

	    findPeaks2D : function(spectraData, thresholdFactor){
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

	        var nStdDev = this.getLoGnStdDevNMR(spectraData);
	        if(isHomonuclear){
	            var convolutedSpectrum = this.convoluteWithLoG(data, nbSubSpectra, nbPoints);
	            var peaksMC1 = this.findPeaks2DLoG(data, convolutedSpectrum, nbSubSpectra, nbPoints, nStdDev*thresholdFactor);//)1.5);
	            var peaksMax1 = this.findPeaks2DMax(data, convolutedSpectrum, nbSubSpectra, nbPoints, (nStdDev+0.5)*thresholdFactor);//2.0);
	            for(var i=0;i<peaksMC1.length;i++)
	                peaksMax1.push(peaksMC1[i]);
	            //console.log(peaksMax1);
	            return PeakOptimizer.enhanceSymmetry(this.createSignals2D(peaksMax1,spectraData,24));

	        }
	        else{
	            var convolutedSpectrum = this.convoluteWithLoG(data, nbSubSpectra, nbPoints);
	            var peaksMC1 = this.findPeaks2DLoG(data, convolutedSpectrum, nbSubSpectra, nbPoints, nStdDev*thresholdFactor);
	            //Peak2D[] peaksMC1 = PeakPicking2D.findPeaks2DMax(data, nbSubSpectra, nbPoints, (nStdDev+0.5)*thresholdFactor);
	            //Remove peaks with less than 3% of the intensity of the highest peak
	            return this.createSignals2D(PeakOptimizer.clean(peaksMC1, 0.05), spectraData,24);
	        }

	    },
	    /**
	     Calculates the 1st derivative of the 2D matrix, using the LoG kernel approximation
	     */
	    convoluteWithLoG : function(inputSpectrum, nRows, nCols){
	        var ftSpectrum = new Array(nCols * nRows);
	        for (var i = nRows * nCols-1; i >=0; i--){
	            ftSpectrum[i] = inputSpectrum[i];
	        }

	        ftSpectrum = FFTUtils.fft2DArray(ftSpectrum, nRows, nCols);

	        var dim = this.smallFilter.length;
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
	                ftFilterData[iRow * nCols + iCol] = this.smallFilter[ir][ic];
	            }
	        }

	        ftFilterData = FFTUtils.fft2DArray(ftFilterData, nRows, nCols);

	        var ftRows = nRows * 2;
	        var ftCols = nCols / 2 + 1;
	        FFTUtils.convolute2DI(ftSpectrum, ftFilterData, ftRows, ftCols);

	        return  FFTUtils.ifft2DArray(ftSpectrum, ftRows, ftCols);
	    },
	    /**
	     Detects all the 2D-peaks in the given spectrum based on center of mass logic.
	     */
	    findPeaks2DLoG : function(inputSpectrum, convolutedSpectrum, nRows, nCols, nStdDev) {
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

	            nbDetectedPoints -= this.extractArea(inputSpectrum, convolutedSpectrum,
	                bitmask, iStart, nRows, nCols, peakList, threshold);
	        }

	        if (peakList.length > 0&&this.DEBUG) {
	            console.log("No peak found");
	        }
	        return peakList;
	    },
	    /**
	     Detects all the 2D-peaks in the given spectrum based on the Max logic.
	     */
	    findPeaks2DMax : function(inputSpectrum, cs, nRows, nCols, nStdDev) {
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
	    },
	    /*
	     This function detects the peaks
	     */
	    extractArea : function(spectrum, convolutedSpectrum, bitmask, iStart,
	                                                   nRows, nCols, peakList, threshold) {
	        var iRow = Math.floor(iStart / nCols);
	        var iCol = iStart % nCols;
	        var peakPoints =[];
	        //console.log(iStart+" "+iRow+" "+iCol);
	        // scanBitmask(bitmask, convolutedSpectrum, nRows, nCols, iRow, iCol,
	        // peakPoints);
	        this.scanBitmask(bitmask, nRows, nCols, iRow, iCol, peakPoints);
	        //console.log("extractArea.lng "+peakPoints.length);
	        var x = new Array(peakPoints.length);
	        var y = new Array(peakPoints.length);
	        var z = new Array(peakPoints.length);
	        var nValues = peakPoints.length;
	        var xAverage = 0.0;
	        var yAverage = 0.0;
	        var zSum = 0.0;
	        if (nValues >= 9) {
	            if (this.DEBUG)
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
	    },
	    /*
	     Return all the peaks(x,y points) that composes a signal.
	     */
	    scanBitmask : function(bitmask, nRows, nCols, iRow, iCol, peakPoints) {
	        //console.log(nRows+" "+iRow+" "+nCols+" "+iCol);
	        if (iRow < 0 || iCol < 0 || iCol == nCols || iRow == nRows)
	            return;
	        if (bitmask[iRow * nCols + iCol]) {
	            bitmask[iRow * nCols + iCol] = 0;
	            peakPoints.push([iCol, iRow]);
	            this.scanBitmask(bitmask, nRows, nCols, iRow + 1, iCol, peakPoints);
	            this.scanBitmask(bitmask, nRows, nCols, iRow - 1, iCol, peakPoints);
	            this.scanBitmask(bitmask, nRows, nCols, iRow, iCol + 1, peakPoints);
	            this.scanBitmask(bitmask, nRows, nCols, iRow, iCol - 1, peakPoints);
	        }
	    },
	    /**
	     This function converts a set of 2D-peaks in 2D-signals. Each signal could be composed
	     of many 2D-peaks, and it has some additional information related to the NMR spectrum.
	     */
	    createSignals2D : function(peaks, spectraData, tolerance){
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
	                var sumZ = 0;
	                for(var jPeak = clusters[iCluster].length-1;jPeak>=0;jPeak--){
	                    if(clusters[iCluster][jPeak]==1){
	                        peaks2D.push(peaks[jPeak]);
	                        signal.shiftX+=peaks[jPeak].x*peaks[jPeak].z;
	                        signal.shiftY+=peaks[jPeak].y*peaks[jPeak].z;
	                        sumZ+=peaks[jPeak].z;
	                    }
	                }
	                signal.shiftX/=sumZ;
	                signal.shiftY/=sumZ;
	                signal.peaks = peaks2D;
	                signals.push(signal);
	            }
	        }
	        //console.log(signals);
	        return signals;
	    }
	}

	module.exports = PeakPicking2D;

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.FFTUtils = __webpack_require__(43);
	exports.FFT = __webpack_require__(44);


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var FFT = __webpack_require__(44);

	var FFTUtils= {
	    DEBUG : false,

	    /**
	     * Calculates the inverse of a 2D Fourier transform
	     *
	     * @param ft
	     * @param ftRows
	     * @param ftCols
	     * @return
	     */
	    ifft2DArray : function(ft, ftRows, ftCols){
	        var tempTransform = new Array(ftRows * ftCols);
	        var nRows = ftRows / 2;
	        var nCols = (ftCols - 1) * 2;
	        // reverse transform columns
	        FFT.init(nRows);
	        var tmpCols = {re: new Array(nRows), im: new Array(nRows)};
	        for (var iCol = 0; iCol < ftCols; iCol++) {
	            for (var iRow = nRows - 1; iRow >= 0; iRow--) {
	                tmpCols.re[iRow] = ft[(iRow * 2) * ftCols + iCol];
	                tmpCols.im[iRow] = ft[(iRow * 2 + 1) * ftCols + iCol];
	            }
	            //Unnormalized inverse transform
	            FFT.bt(tmpCols.re, tmpCols.im);
	            for (var iRow = nRows - 1; iRow >= 0; iRow--) {
	                tempTransform[(iRow * 2) * ftCols + iCol] = tmpCols.re[iRow];
	                tempTransform[(iRow * 2 + 1) * ftCols + iCol] = tmpCols.im[iRow];
	            }
	        }

	        // reverse row transform
	        var finalTransform = new Array(nRows * nCols);
	        FFT.init(nCols);
	        var tmpRows = {re: new Array(nCols), im: new Array(nCols)};
	        var scale = nCols * nRows;
	        for (var iRow = 0; iRow < ftRows; iRow += 2) {
	            tmpRows.re[0] = tempTransform[iRow * ftCols];
	            tmpRows.im[0] = tempTransform[(iRow + 1) * ftCols];
	            for (var iCol = 1; iCol < ftCols; iCol++) {
	                tmpRows.re[iCol] = tempTransform[iRow * ftCols + iCol];
	                tmpRows.im[iCol] = tempTransform[(iRow + 1) * ftCols + iCol];
	                tmpRows.re[nCols - iCol] = tempTransform[iRow * ftCols + iCol];
	                tmpRows.im[nCols - iCol] = -tempTransform[(iRow + 1) * ftCols + iCol];
	            }
	            //Unnormalized inverse transform
	            FFT.bt(tmpRows.re, tmpRows.im);

	            var indexB = (iRow / 2) * nCols;
	            for (var iCol = nCols - 1; iCol >= 0; iCol--) {
	                finalTransform[indexB + iCol] = tmpRows.re[iCol] / scale;
	            }
	        }
	        return finalTransform;
	    },
	    /**
	     * Calculates the fourier transform of a matrix of size (nRows,nCols) It is
	     * assumed that both nRows and nCols are a power of two
	     *
	     * On exit the matrix has dimensions (nRows * 2, nCols / 2 + 1) where the
	     * even rows contain the real part and the odd rows the imaginary part of the
	     * transform
	     * @param data
	     * @param nRows
	     * @param nCols
	     * @return
	     */
	    fft2DArray:function(data, nRows, nCols) {
	        var ftCols = (nCols / 2 + 1);
	        var ftRows = nRows * 2;
	        var tempTransform = new Array(ftRows * ftCols);
	        FFT.init(nCols);
	        // transform rows
	        var tmpRows = {re: new Array(nCols), im: new Array(nCols)};
	        var row1 = {re: new Array(nCols), im: new Array(nCols)}
	        var row2 = {re: new Array(nCols), im: new Array(nCols)}
	        var index, iRow0, iRow1, iRow2, iRow3;
	        for (var iRow = 0; iRow < nRows / 2; iRow++) {
	            index = (iRow * 2) * nCols;
	            tmpRows.re = data.slice(index, index + nCols);

	            index = (iRow * 2 + 1) * nCols;
	            tmpRows.im = data.slice(index, index + nCols);

	            FFT.fft1d(tmpRows.re, tmpRows.im);

	            this.reconstructTwoRealFFT(tmpRows, row1, row2);
	            //Now lets put back the result into the output array
	            iRow0 = (iRow * 4) * ftCols;
	            iRow1 = (iRow * 4 + 1) * ftCols;
	            iRow2 = (iRow * 4 + 2) * ftCols;
	            iRow3 = (iRow * 4 + 3) * ftCols;
	            for (var k = ftCols - 1; k >= 0; k--) {
	                tempTransform[iRow0 + k] = row1.re[k];
	                tempTransform[iRow1 + k] = row1.im[k];
	                tempTransform[iRow2 + k] = row2.re[k];
	                tempTransform[iRow3 + k] = row2.im[k];
	            }
	        }

	        //console.log(tempTransform);
	        row1 = null;
	        row2 = null;
	        // transform columns
	        var finalTransform = new Array(ftRows * ftCols);
	        FFT.init(nRows);
	        var tmpCols = {re: new Array(nRows), im: new Array(nRows)};
	        for (var iCol = ftCols - 1; iCol >= 0; iCol--) {
	            for (var iRow = nRows - 1; iRow >= 0; iRow--) {
	                tmpCols.re[iRow] = tempTransform[(iRow * 2) * ftCols + iCol];
	                tmpCols.im[iRow] = tempTransform[(iRow * 2 + 1) * ftCols + iCol];
	            }
	            FFT.fft1d(tmpCols.re, tmpCols.im);
	            for (var iRow = nRows - 1; iRow >= 0; iRow--) {
	                finalTransform[(iRow * 2) * ftCols + iCol] = tmpCols.re[iRow];
	                finalTransform[(iRow * 2 + 1) * ftCols + iCol] = tmpCols.im[iRow];
	            }
	        }

	        //console.log(finalTransform);
	        return finalTransform;

	    },
	    /**
	     *
	     * @param fourierTransform
	     * @param realTransform1
	     * @param realTransform2
	     *
	     * Reconstructs the individual Fourier transforms of two simultaneously
	     * transformed series. Based on the Symmetry relationships (the asterisk
	     * denotes the complex conjugate)
	     *
	     * F_{N-n} = F_n^{*} for a purely real f transformed to F
	     *
	     * G_{N-n} = G_n^{*} for a purely imaginary g transformed to G
	     *
	     */
	    reconstructTwoRealFFT:function(fourierTransform, realTransform1, realTransform2) {
	        var length = fourierTransform.re.length;

	        // the components n=0 are trivial
	        realTransform1.re[0] = fourierTransform.re[0];
	        realTransform1.im[0] = 0.0;
	        realTransform2.re[0] = fourierTransform.im[0];
	        realTransform2.im[0] = 0.0;
	        var rm, rp, im, ip, j;
	        for (var i = length / 2; i > 0; i--) {
	            j = length - i;
	            rm = 0.5 * (fourierTransform.re[i] - fourierTransform.re[j]);
	            rp = 0.5 * (fourierTransform.re[i] + fourierTransform.re[j]);
	            im = 0.5 * (fourierTransform.im[i] - fourierTransform.im[j]);
	            ip = 0.5 * (fourierTransform.im[i] + fourierTransform.im[j]);
	            realTransform1.re[i] = rp;
	            realTransform1.im[i] = im;
	            realTransform1.re[j] = rp;
	            realTransform1.im[j] = -im;
	            realTransform2.re[i] = ip;
	            realTransform2.im[i] = -rm;
	            realTransform2.re[j] = ip;
	            realTransform2.im[j] = rm;
	        }
	    },

	    /**
	     * In place version of convolute 2D
	     *
	     * @param ftSignal
	     * @param ftFilter
	     * @param ftRows
	     * @param ftCols
	     * @return
	     */
	    convolute2DI:function(ftSignal, ftFilter, ftRows, ftCols) {
	        var re, im;
	        for (var iRow = 0; iRow < ftRows / 2; iRow++) {
	            for (var iCol = 0; iCol < ftCols; iCol++) {
	                //
	                re = ftSignal[(iRow * 2) * ftCols + iCol]
	                * ftFilter[(iRow * 2) * ftCols + iCol]
	                - ftSignal[(iRow * 2 + 1) * ftCols + iCol]
	                * ftFilter[(iRow * 2 + 1) * ftCols + iCol];
	                im = ftSignal[(iRow * 2) * ftCols + iCol]
	                * ftFilter[(iRow * 2 + 1) * ftCols + iCol]
	                + ftSignal[(iRow * 2 + 1) * ftCols + iCol]
	                * ftFilter[(iRow * 2) * ftCols + iCol];
	                //
	                ftSignal[(iRow * 2) * ftCols + iCol] = re;
	                ftSignal[(iRow * 2 + 1) * ftCols + iCol] = im;
	            }
	        }
	    },
	    /**
	     *
	     * @param data
	     * @param kernel
	     * @param nRows
	     * @param nCols
	     * @returns {*}
	     */
	    convolute:function(data, kernel, nRows, nCols){
	        var ftSpectrum = new Array(nCols * nRows);
	        for (var i = 0; i<nRows * nCols; i++){
	            ftSpectrum[i] = data[i];
	        }

	        ftSpectrum = this.fft2DArray(ftSpectrum, nRows, nCols);

	        var dim = kernel.length;
	        var ftFilterData = new Array(nCols * nRows);
	        for(var i=0;i<nCols * nRows;i++){
	            ftFilterData[i]=0;
	        }

	        var iRow, iCol;
	        var shift = (dim - 1) / 2;
	        //console.log(dim);
	        for (var ir = 0; ir < dim; ir++) {
	            iRow = (ir - shift + nRows) % nRows;
	            for (var ic = 0; ic < dim; ic++) {
	                iCol = (ic - shift + nCols) % nCols;
	                ftFilterData[iRow * nCols + iCol] = kernel[ir][ic];
	            }
	        }

	        ftFilterData = this.fft2DArray(ftFilterData, nRows, nCols);

	        var ftRows = nRows * 2;
	        var ftCols = nCols / 2 + 1;
	        this.convolute2DI(ftSpectrum, ftFilterData, ftRows, ftCols);

	        return  this.ifft2DArray(ftSpectrum, ftRows, ftCols);
	    }
	}

	module.exports = FFTUtils;


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Fast Fourier Transform module
	 * 1D-FFT/IFFT, 2D-FFT/IFFT (radix-2)
	 */
	var FFT = (function(){
	  var FFT;  
	  
	  if(true) {
	    FFT = exports;   // for CommonJS
	  } else {
	    FFT = {};
	  }
	  
	  var version = {
	    release: '0.3.0',
	    date: '2013-03'
	  };
	  FFT.toString = function() {
	    return "version " + version.release + ", released " + version.date;
	  };

	  // core operations
	  var _n = 0,          // order
	      _bitrev = null,  // bit reversal table
	      _cstb = null;    // sin/cos table

	  var core = {
	    init : function(n) {
	      if(n !== 0 && (n & (n - 1)) === 0) {
	        _n = n;
	        core._initArray();
	        core._makeBitReversalTable();
	        core._makeCosSinTable();
	      } else {
	        throw new Error("init: radix-2 required");
	      }
	    },
	    // 1D-FFT
	    fft1d : function(re, im) {
	      core.fft(re, im, 1);
	    },
	    // 1D-IFFT
	    ifft1d : function(re, im) {
	      var n = 1/_n;
	      core.fft(re, im, -1);
	      for(var i=0; i<_n; i++) {
	        re[i] *= n;
	        im[i] *= n;
	      }
	    },
	     // 1D-IFFT
	    bt1d : function(re, im) {
	      core.fft(re, im, -1);
	    },
	    // 2D-FFT Not very useful if the number of rows have to be equal to cols
	    fft2d : function(re, im) {
	      var tre = [],
	          tim = [],
	          i = 0;
	      // x-axis
	      for(var y=0; y<_n; y++) {
	        i = y*_n;
	        for(var x1=0; x1<_n; x1++) {
	          tre[x1] = re[x1 + i];
	          tim[x1] = im[x1 + i];
	        }
	        core.fft1d(tre, tim);
	        for(var x2=0; x2<_n; x2++) {
	          re[x2 + i] = tre[x2];
	          im[x2 + i] = tim[x2];
	        }
	      }
	      // y-axis
	      for(var x=0; x<_n; x++) {
	        for(var y1=0; y1<_n; y1++) {
	          i = x + y1*_n;
	          tre[y1] = re[i];
	          tim[y1] = im[i];
	        }
	        core.fft1d(tre, tim);
	        for(var y2=0; y2<_n; y2++) {
	          i = x + y2*_n;
	          re[i] = tre[y2];
	          im[i] = tim[y2];
	        }
	      }
	    },
	    // 2D-IFFT
	    ifft2d : function(re, im) {
	      var tre = [],
	          tim = [],
	          i = 0;
	      // x-axis
	      for(var y=0; y<_n; y++) {
	        i = y*_n;
	        for(var x1=0; x1<_n; x1++) {
	          tre[x1] = re[x1 + i];
	          tim[x1] = im[x1 + i];
	        }
	        core.ifft1d(tre, tim);
	        for(var x2=0; x2<_n; x2++) {
	          re[x2 + i] = tre[x2];
	          im[x2 + i] = tim[x2];
	        }
	      }
	      // y-axis
	      for(var x=0; x<_n; x++) {
	        for(var y1=0; y1<_n; y1++) {
	          i = x + y1*_n;
	          tre[y1] = re[i];
	          tim[y1] = im[i];
	        }
	        core.ifft1d(tre, tim);
	        for(var y2=0; y2<_n; y2++) {
	          i = x + y2*_n;
	          re[i] = tre[y2];
	          im[i] = tim[y2];
	        }
	      }
	    },
	    // core operation of FFT
	    fft : function(re, im, inv) {
	      var d, h, ik, m, tmp, wr, wi, xr, xi,
	          n4 = _n >> 2;
	      // bit reversal
	      for(var l=0; l<_n; l++) {
	        m = _bitrev[l];
	        if(l < m) {
	          tmp = re[l];
	          re[l] = re[m];
	          re[m] = tmp;
	          tmp = im[l];
	          im[l] = im[m];
	          im[m] = tmp;
	        }
	      }
	      // butterfly operation
	      for(var k=1; k<_n; k<<=1) {
	        h = 0;
	        d = _n/(k << 1);
	        for(var j=0; j<k; j++) {
	          wr = _cstb[h + n4];
	          wi = inv*_cstb[h];
	          for(var i=j; i<_n; i+=(k<<1)) {
	            ik = i + k;
	            xr = wr*re[ik] + wi*im[ik];
	            xi = wr*im[ik] - wi*re[ik];
	            re[ik] = re[i] - xr;
	            re[i] += xr;
	            im[ik] = im[i] - xi;
	            im[i] += xi;
	          }
	          h += d;
	        }
	      }
	    },
	    // initialize the array (supports TypedArray)
	    _initArray : function() {
	      if(typeof Uint32Array !== 'undefined') {
	        _bitrev = new Uint32Array(_n);
	      } else {
	        _bitrev = [];
	      }
	      if(typeof Float64Array !== 'undefined') {
	        _cstb = new Float64Array(_n*1.25);
	      } else {
	        _cstb = [];
	      }
	    },
	    // zero padding
	    _paddingZero : function() {
	      // TODO
	    },
	    // makes bit reversal table
	    _makeBitReversalTable : function() {
	      var i = 0,
	          j = 0,
	          k = 0;
	      _bitrev[0] = 0;
	      while(++i < _n) {
	        k = _n >> 1;
	        while(k <= j) {
	          j -= k;
	          k >>= 1;
	        }
	        j += k;
	        _bitrev[i] = j;
	      }
	    },
	    // makes trigonometiric function table
	    _makeCosSinTable : function() {
	      var n2 = _n >> 1,
	          n4 = _n >> 2,
	          n8 = _n >> 3,
	          n2p4 = n2 + n4,
	          t = Math.sin(Math.PI/_n),
	          dc = 2*t*t,
	          ds = Math.sqrt(dc*(2 - dc)),
	          c = _cstb[n4] = 1,
	          s = _cstb[0] = 0;
	      t = 2*dc;
	      for(var i=1; i<n8; i++) {
	        c -= dc;
	        dc += t*c;
	        s += ds;
	        ds -= t*s;
	        _cstb[i] = s;
	        _cstb[n4 - i] = c;
	      }
	      if(n8 !== 0) {
	        _cstb[n8] = Math.sqrt(0.5);
	      }
	      for(var j=0; j<n4; j++) {
	        _cstb[n2 - j]  = _cstb[j];
	      }
	      for(var k=0; k<n2p4; k++) {
	        _cstb[k + n2] = -_cstb[k];
	      }
	    }
	  };
	  // aliases (public APIs)
	  var apis = ['init', 'fft1d', 'ifft1d', 'fft2d', 'ifft2d'];
	  for(var i=0; i<apis.length; i++) {
	    FFT[apis[i]] = core[apis[i]];
	  }
	  FFT.bt = core.bt1d;
	  FFT.fft = core.fft1d;
	  FFT.ifft = core.ifft1d;
	  
	  return FFT;
	}).call(this);


/***/ },
/* 45 */
/***/ function(module, exports) {

	var PeakOptimizer={
		diagonalError:0.05,
		tolerance:0.05,
		DEBUG:false,
	    toleranceX : 0.025,
	    toleranceY : 0.5,

	    clean: function(peaks, threshold){
	        var max = Number.NEGATIVE_INFINITY;
	        var i,peak;
	        //double min = Double.MAX_VALUE;
	        for(i=peaks.length-1;i>=0;i--){
	            if(Math.abs(peaks[i].z)>max)
	                max=Math.abs(peaks[i].z);
	        }
	        max*=threshold;
	        for(i=peaks.length-1;i>=0;i--){
	            if(Math.abs(peaks[i].z)<max)
	                peaks.splice(i,1);
	        }
	        return peaks;
	    },
		
		enhanceSymmetry: function(signals){
			
			var properties = this.initializeProperties(signals);
			var output = signals;

			if(this.DEBUG)
				console.log("Before optimization size: "+output.size());
			
			//First step of the optimization: Symmetry validation
			var i,hits,index;
			var signal;
			for(i=output.length-1;i>=0;i--){
				signal = output[i];
				if(signal.peaks.length>1)
					properties[i][1]++;
				if(properties[i][0]==1){
					index = this.exist(output, properties, signal,-1,true);
					if(index>=0){
						properties[i][1]+=2;
						properties[index][1]+=2;
					}
				}
			}
			//Second step of the optimization: Diagonal image existence
			for(i=output.length-1;i>=0;i--){
				signal = output[i];
				if(properties[i][0]==0){
					hits = this.checkCrossPeaks(output, properties, signal, true);
					properties[i][1]+=hits;
					//checkCrossPeaks(output, properties, signal, false);
				}
			}
			
			//Now, each peak have a score between 0 and 4, we can complete the patterns which
			//contains peaks with high scores, and finally, we can remove peaks with scores 0 and 1
			var count = 0;
			for(i=output.length-1;i>=0;i--){
				if(properties[i][0]!==0&&properties[i][1]>2){
					count++;
					count+=this.completeMissingIfNeeded(output,properties,output[i],properties[i]);
				}
				if(properties[i][1]>=2&&properties[i][0]===0)
					count++;
			}
			
			if(this.DEBUG)
				console.log("After optimization size: "+count);
			var  toReturn = new Array(count);
			count--;
			for(i=output.length-1;i>=0;i--){
				if(properties[i][0]!==0&&properties[i][1]>2
						||properties[i][0]===0&&properties[i][1]>1){
					toReturn[count--]=output[i];
				}
				else{
					console.log("Removed "+i+" "+output[i].peaks.length);
				}
				//if(properties.get(i)[1]>=2)
				//	toReturn[count--]=output.get(i);
			}
			return toReturn;
		},
		
		completeMissingIfNeeded: function(output, properties, thisSignal, thisProp) {
			//Check for symmetry
			var index = this.exist(output, properties, thisSignal,-thisProp[0],true);
			var addedPeaks=0;
			var newSignal = null, tmpProp=null;
			if(index<0){//If this signal have no a symmetry image, we have to include it
				newSignal = {nucleusX:thisSignal.nucleusX,nucleusY:thisSignal.nucleusY};
				newSignal.resolutionX=thisSignal.resolutionX;
				newSignal.resolutionY=thisSignal.resolutionY;
				newSignal.shiftX=thisSignal.shiftY;
				newSignal.shiftY=thisSignal.shiftX;
				newSignal.peaks = [{x:thisSignal.shiftY,y:thisSignal.shiftX,z:1}];
				output.push(newSignal);
				tmpProp = [-thisProp[0],thisProp[1]];
				properties.push(tmpProp);
				addedPeaks++;
			}
			//Check for diagonal peaks
			var j=0;
			var diagX=false, diagY=false;
			var signal;
			for(j=output.length-1;j>=0;j--){
				signal = output[j];
				if(properties[j][0]===0){
					if(Math.abs(signal.shiftX-thisSignal.shiftX)<this.diagonalError)
						diagX=true;
					if(Math.abs(signal.shiftY-thisSignal.shiftY)<this.diagonalError)
						diagY=true;
				}
			}
			if(diagX===false){
				newSignal = {nucleusX:thisSignal.nucleusX,nucleusY:thisSignal.nucleusY};
				newSignal.resolutionX=thisSignal.resolutionX;
				newSignal.resolutionY=thisSignal.resolutionY;
				newSignal.shiftX=thisSignal.shiftX;
				newSignal.shiftY=thisSignal.shiftX;
				newSignal.peaks = [{x:thisSignal.shiftX,y:thisSignal.shiftX,z:1}];
				output.push(newSignal);
				tmpProp = [0,thisProp[1]];
				properties.push(tmpProp);
				addedPeaks++;
			}
			if(diagY===false){
				newSignal = {nucleusX:thisSignal.nucleusX,nucleusY:thisSignal.nucleusY};
				newSignal.resolutionX=thisSignal.resolutionX;
				newSignal.resolutionY=thisSignal.resolutionY;
				newSignal.shiftX=thisSignal.shiftY;
				newSignal.shiftY=thisSignal.shiftY;
				newSignal.peaks = [{x:thisSignal.shiftY,y:thisSignal.shiftY,z:1}];
				output.push(newSignal);
				tmpProp = [0,thisProp[1]];
				properties.push(tmpProp);
				addedPeaks++;
			}
			return addedPeaks;
			
		},
		
		//Check for any diagonal peak that match this cross peak
		checkCrossPeaks: function(output, properties, signal, updateProperties) {
			var hits = 0, i=0, shift=signal.shiftX*4;
			var crossPeaksX = [],crossPeaksY = [];
			var cross;
			for(i=output.length-1;i>=0;i--){
				cross = output[i];
				if(properties[i][0]!==0){
					if(Math.abs(cross.shiftX-signal.shiftX)<this.diagonalError){
						hits++;
						if(updateProperties)
							properties[i][1]++;
						crossPeaksX.push(i);
						shift+=cross.shiftX;
					}
					else{
						if(Math.abs(cross.shiftY-signal.shiftY)<this.diagonalError){
							hits++;
							if(updateProperties)
								properties[i][1]++;
							crossPeaksY.push(i);
							shift+=cross.shiftY;
						}
					}
				}
			}
			//Update found crossPeaks and diagonal peak
			shift/=(crossPeaksX.length+crossPeaksY.length+4);
			if(crossPeaksX.length>0){
				for( i=crossPeaksX.length-1;i>=0;i--){
					output[crossPeaksX[i]].shiftX=shift;
				}
			}
			if(crossPeaksY.length>0){
				for( i=crossPeaksY.length-1;i>=0;i--){
					output[crossPeaksY[i]].shiftY=shift;
				}
			}
			signal.shiftX=shift;
			signal.shiftY=shift;
			return hits;
		},

		exist: function(output, properties, signal, type, symmetricSearch) {
			for(var i=output.length-1;i>=0;i--){
				if(properties[i][0]==type){
					if(this.distanceTo(signal, output[i], symmetricSearch)<this.tolerance){
						if(!symmetricSearch){
							var shiftX=(output[i].shiftX+signal.shiftX)/2.0;
							var shiftY=(output[i].shiftY+signal.shiftY)/2.0;
							output[i].shiftX=shiftX;
							output[i].shiftY=shiftY;
							signal.shiftX=shiftX;
							signal.shiftY=shiftY;
						}
						else{
							var shiftX=signal.shiftX;
							var shiftY=output[i].shiftX;
							output[i].shiftY=shiftX;
							signal.shiftY=shiftY;
						}
						return i;
					}
				}
			}
			return -1;
		},
		/**
		 * We try to determine the position of each signal within the spectrum matrix.
		 * Peaks could be of 3 types: upper diagonal, diagonal or under diagonal 1,0,-1
		 * respectively.
		 * @param Signals
		 * @return A matrix containing the properties of each signal
		 */
		initializeProperties: function(signals){
			var signalsProperties = new Array(signals.length);
			for(var i=signals.length-1;i>=0;i--){
				signalsProperties[i]=[0,0];
				//We check if it is a diagonal peak
				if(Math.abs(signals[i].shiftX-signals[i].shiftY)<=this.diagonalError){
					signalsProperties[i][1]=1;
					//We adjust the x and y value to be symmetric.
					//In general chemical shift in the direct dimension is better than in the other one,
					//so, we believe more to the shiftX than to the shiftY.
					var shift = (signals[i].shiftX*2+signals[i].shiftY)/3.0;
					signals[i].shiftX=shift;
					signals[i].shiftY=shift;
				}
				else{
					if(signals[i].shiftX-signals[i].shiftY>0)
						signalsProperties[i][0]=1;
					else
						signalsProperties[i][0]=-1;
				}
			}
			return signalsProperties;
		},
		
		/**
		 * This function calculates the distance between 2 nmr signals . If toImage is true, 
		 * it will interchange x by y in the distance calculation for the second signal.
		 */
		distanceTo: function(a, b, toImage){
			if(!toImage){
				return Math.sqrt(Math.pow(a.shiftX-b.shiftX, 2)
						+Math.pow(a.shiftY-b.shiftY, 2));
			}
			else{
				return Math.sqrt(Math.pow(a.shiftX-b.shiftY, 2)
						+Math.pow(a.shiftY-b.shiftX, 2));
			}
		},

		/**
		 * This function maps the corresponding 2D signals to the given set of 1D signals
		 */
		alignDimensions:function(signals2D,references){
			//For each reference dimension
			for(var i=0;i<references.length;i++){
				var ref = references[i];
				_alignSingleDimension(signals2D,ref);
			}
		},

		_alignSingleDimension: function(signals2D, references){
			//For each 2D signal
			var center = 0, width = 0, i, j;
			for(i=0;i<signals2D.length;i++){
				var signal2D = signals2D[i];
				//For each reference 1D signal
				for(j=0;j<references.length;j++){
					center = (references[j].startX+references[j].stopX)/2;
					width = Math.abs(references[j].startX-references[j].stopX)/2;
					if(signal2D.nucleusX==references[j].nucleus){
						//The 2D peak overlaps with the 1D signal
						if(Math.abs(signal2D.shiftX-center)<=width){
							signal2D._highlight.push(references[j]._highlight[0]);
						}

					}
					if(signal2D.nucleusY==references[j].nucleus){
						if(Math.abs(signal2D.shiftY-center)<=width){
							signal2D._highlight.push(references[j]._highlight[0]);
						}
					}
				}

			}
		}

	};

	module.exports = PeakOptimizer;

/***/ },
/* 46 */
/***/ function(module, exports) {

	var SimpleClustering={

		/*This function returns the cluster list for a given connectivity matrix.
		*To improve the performance, the connectivity(square and symmetric) matrix 
		*is given as a single vector containing  the upper diagonal of the matrix
		*Note: This algorithm is O(n*n) complexity. I wonder if there is something better. 
		*acastillo
		*/
		fullClusterGenerator:function(conn){
			var nRows = Math.sqrt(conn.length*2+0.25)-0.5;
			//console.log("nRows: "+nRows+" - "+conn.length);
			var clusterList = [];
			var available = new Array(nRows);
			var remaining = nRows, i=0;
			var cluster = [];
			//Mark all the elements as available
			for(i=nRows-1;i>=0;i--){
				available[i]=1;
			}
			var nextAv=-1;
			var toInclude = [];
			while(remaining>0){
				if(toInclude.length===0){
					//If there is no more elements to include. Start a new cluster
					cluster = new Array(nRows);
					for(i=nRows-1;i>=0;i--)
						cluster[i]=0;
					clusterList.push(cluster);
			    	for(nextAv = nRows-1;available[nextAv]==0;nextAv--){};
			    }
			    else{
			    	nextAv=toInclude.splice(0,1);
			    }
			    //console.log("row: "+nextAv);
			    cluster[nextAv]=1;
			    available[nextAv]=0;
			    remaining--;
			    //Copy the next available row
			    var row = new Array(nRows);
				for(i=nRows-1;i>=0;i--){
					var c=Math.max(nextAv,i);
					var r=Math.min(nextAv,i);
					//The element in the conn matrix
					//console.log("index: "+r*(2*nRows-r-1)/2+c)
					row[i]=conn[r*(2*nRows-r-1)/2+c];
					//console.log("col: "+i+":"+row[i]);
					//There is new elements to include in this row?
					//Then, include it to the current cluster
					if(row[i]==1&&available[i]==1&&cluster[i]==0){
						toInclude.push(i);
						cluster[i]=1;
					}
				}
			}
			return clusterList;
		}
	}

	module.exports = SimpleClustering;

/***/ },
/* 47 */
/***/ function(module, exports) {

	/**
	 * This library formats a set of nmr1D signals to the ACS format.
	 * Created by acastillo on 3/11/15. p
	 */
	var ACS=ACS || {};
	ACS.formater =(function() {
	    var acsString="";
	    var parenthesis="";
	    var spectro="";
	    rangeForMultiplet=false;

	    function fromNMRSignal1D2ACS(spectrum, options){
	        acsString="";
	        parenthesis="";
	        spectro="";
	        var solvent = null;
	        if(options&&options.solvent)
	            solvent = options.solvent;
	        //options.rangeForMultiplet=false;
	        if(options&&options.rangeForMultiplet!=undefined)
	            rangeForMultiplet = options.rangeForMultiplet;

	        if(options&&options.ascending){
	            spectrum.sort(function(a,b){
	                return b.delta1- a.delta1
	            });
	        }
	        else{
	            spectrum.sort(function(a,b){
	                return a.delta1- b.delta1
	            });
	        }

	        //console.log("Range1: "+options.rangeForMultiplet);

	        spectrum.type="NMR SPEC";
	        if (spectrum[0]["nucleus"]=="1H") {
	            formatAcs_default(spectrum, false, 2, 1, solvent);
	        } else if (spectrum[0]["nucleus"]=="13C") {
	            formatAcs_default(spectrum, false, 1, 0, solvent);
	        }

	        if (acsString.length>0) acsString+=".";

	        return acsString;
	    }

	    /*function formatAcs_default_IR(spectra, ascending, decimalValue, smw) {
	     appendSeparator();
	     appendSpectroInformation(spectra);
	     if (spectra["peakLabels"]) {
	     var numberPeakLabels=spectra["peakLabels"].length;
	     var minIntensity= 9999999;
	     var maxIntensity=-9999999;
	     for (var i=0; i<numberPeakLabels; i++) {
	     if (spectra["peakLabels"][i].intensity<minIntensity) minIntensity=spectra["peakLabels"][i].intensity;
	     if (spectra["peakLabels"][i].intensity>maxIntensity) maxIntensity=spectra["peakLabels"][i].intensity;
	     }
	     for (var i=0; i<numberPeakLabels; i++) {
	     if (ascending) {
	     var peakLabel=spectra["peakLabels"][i];
	     } else {
	     var peakLabel=spectra["peakLabels"][numberPeakLabels-i-1];
	     }
	     if (peakLabel) {
	     appendSeparator();
	     appendValue(peakLabel,decimalValue);
	     if (smw) { // we need to add small / medium / strong
	     if (peakLabel.intensity<((maxIntensity-minIntensity)/3+minIntensity)) acsString+=" (s)";
	     else if (peakLabel.intensity>(maxIntensity-(maxIntensity-minIntensity)/3)) acsString+=" (w)";
	     else acsString+=" (m)";
	     }
	     }
	     }
	     }
	     }*/

	    function formatAcs_default(spectra, ascending, decimalValue, decimalJ, solvent) {
	        appendSeparator();
	        appendSpectroInformation(spectra, solvent);
	        var numberSmartPeakLabels=spectra.length;
	        //console.log("SP "+spectra);
	        //console.log("# "+numberSmartPeakLabels);
	        for (var i=0; i<numberSmartPeakLabels; i++) {
	            if (ascending) {
	                var signal=spectra[i];
	            } else {
	                var signal=spectra[numberSmartPeakLabels-i-1];
	            }
	            if (signal) {
	                //console.log("X2X"+i+JSON.stringify(signal));
	                appendSeparator();
	                appendDelta(signal,decimalValue);
	                appendParenthesis(signal,decimalJ);
	                //console.log("S2S"+i);
	            }
	        }
	    }

	    function appendSpectroInformation(spectrum, solvent) {
	        if (spectrum.type=="NMR SPEC") {
	            if (spectrum[0].nucleus) {
	                acsString+=formatNucleus(spectrum[0].nucleus);
	            }
	            acsString+=" NMR";
	            if ((solvent) || (spectrum[0].observe)) {
	                acsString+=" (";
	                if (spectrum[0].observe) {
	                    acsString+=(spectrum[0].observe*1).toFixed(0)+" MHz";
	                    if (solvent) acsString+=", ";
	                }
	                if (solvent) {
	                    acsString+=formatMF(solvent);
	                }
	                acsString+=")";
	            }
	            acsString+=" δ ";
	        } else if (spectrum.type=="IR") {
	            acsString+=" IR ";
	        } else if (spectrum.type=="MASS") {
	            acsString+=" MASS ";
	        }
	    }

	    function appendDelta(line, nbDecimal) {
	        //console.log("appendDelta1");
	        var startX = 0,stopX=0,delta1=0;
	        if(line.startX){
	            if((typeof line.startX)=="string"){
	                startX=parseFloat(line.startX);
	            }
	            else
	                startX=line.startX;
	        }
	        if(line.stopX){
	            if((typeof line.stopX)=="string"){
	                stopX=parseFloat(line.stopX);
	            }
	            else
	                stopX=line.stopX;
	        }
	        if(line.delta1){
	            if((typeof line.delta1)=="string"){
	                delta1=parseFloat(line.delta1);
	            }
	            else
	                delta1=line.delta1;

	        }
	        //console.log("Range2: "+rangeForMultiplet+" "+line.multiplicity);
	        if (line.asymmetric===true||(line.multiplicity=="m"&&rangeForMultiplet===true)) {//Is it massive??
	            if (line.startX&&line.stopX) {
	                if (startX<stopX) {
	                    acsString+=startX.toFixed(nbDecimal)+"-"+stopX.toFixed(nbDecimal);
	                } else {
	                    acsString+=stopX.toFixed(nbDecimal)+"-"+startX.toFixed(nbDecimal);
	                }
	            } else {
	                if(line.delta1)
	                    acsString+=delta1.toFixed(nbDecimal);
	            }
	        }
	        else{
	            if(line.delta1)
	                acsString+=delta1.toFixed(nbDecimal);
	            else{
	                if(line.startX&&line.stopX){
	                    acsString+=((startX+stopX)/2).toFixed(nbDecimal);
	                }
	            }
	        }
	    }

	    function appendValue(line, nbDecimal) {
	        if (line.xPosition) {
	            acsString+=line.xPosition.toFixed(nbDecimal);
	        }
	    }

	    function appendParenthesis(line, nbDecimal) {
	        //console.log("appendParenthesis1");
	        // need to add assignment - coupling - integration
	        parenthesis="";
	        appendMultiplicity(line);
	        appendIntegration(line);
	        appendCoupling(line,nbDecimal);
	        appendAssignment(line);


	        if (parenthesis.length>0) {
	            acsString+=" ("+parenthesis+")";
	        }
	        //console.log("appendParenthesis2");
	    }

	    function appendIntegration(line) {
	        if (line.pubIntegration) {
	            appendParenthesisSeparator();
	            parenthesis+=line.pubIntegration;
	        } else if (line.integralData) {
	            appendParenthesisSeparator();
	            parenthesis+=line.integralData.value.toFixed(0)+" H";
	        }
	    }

	    function appendAssignment(line) {
	        if (line.pubAssignment) {
	            appendParenthesisSeparator();
	            parenthesis+=formatAssignment(line.pubAssignment);
	        }
	        else{
	            if (line.assignment) {
	                appendParenthesisSeparator();
	                parenthesis+=formatAssignment(line.assignment);
	            }
	        }
	    }

	    function appendMultiplicity(line) {
	        if (line.pubMultiplicity) {
	            appendParenthesisSeparator();
	            parenthesis+=line.pubMultiplicity;
	        } else if (line.multiplicity) {
	            appendParenthesisSeparator();
	            parenthesis+=line.multiplicity;
	        }
	    }

	    function appendCoupling(line, nbDecimal) {
	        if (line.nmrJs) {
	            var j="<i>J</i> = ";
	            for (var i=0; i<line.nmrJs.length; i++) {
	                var coupling=line.nmrJs[i].coupling;
	                if (j.length>11) j+=", ";
	                j+=coupling.toFixed(nbDecimal);
	            }
	            appendParenthesisSeparator();
	            parenthesis+=j+" Hz";
	        }

	    }

	    function formatAssignment(assignment) {
	        assignment=assignment.replace(/([0-9])/g,"<sub>$1</sub>");
	        assignment=assignment.replace(/\"([^\"]*)\"/g,"<i>$1</i>");
	        return assignment;
	    }

	    function formatMF(mf) {
	        mf=mf.replace(/([0-9])/g,"<sub>$1</sub>");
	        return mf;
	    }

	    function formatNucleus(nucleus) {
	        nucleus=nucleus.replace(/([0-9])/g,"<sup>$1</sup>");
	        return nucleus;
	    }

	    function appendSeparator() {
	        if ((acsString.length>0) && (! acsString.match(/ $/))) {
	            acsString+=", ";
	        }
	    }

	    function appendParenthesisSeparator() {
	        if ((parenthesis.length>0) && (! parenthesis.match(", $"))) parenthesis+=", ";
	    }

	    function fromACS2NMRSignal1D(acsString){
	        return JSON.parse(SDAPI.AcsParserAsJSONString(acsString));
	    }

	    return {
	        toACS:fromNMRSignal1D2ACS,
	        toNMRSignal:fromACS2NMRSignal1D
	    }
	})();

	module.exports=ACS;

/***/ }
/******/ ])
});
;