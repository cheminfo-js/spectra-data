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
	exports.NMR = __webpack_require__(15);
	exports.NMR2D = __webpack_require__(58);
	exports.formatter = __webpack_require__(69);
	//exports.ACS2 = require('./AcsParserNew');
	exports.JAnalyzer = __webpack_require__(17);
	//exports.SD2 = require('/SD2');

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// small note on the best way to define array
	// http://jsperf.com/lp-array-and-loops/2

	var StatArray = __webpack_require__(2).array;
	var ArrayUtils = __webpack_require__(5);
	var JcampConverter = __webpack_require__(10);
	var JcampCreator = __webpack_require__(12);
	var extend = __webpack_require__(14);

	/**
	 * Construct the object from the given sd object(output of the jcampconverter or brukerconverter filter)
	 * @param sd
	 * @constructor
	 */
	function SD(sd) {
	    this.DATACLASS_XY=1;
	    this.DATACLASS_PEAK=2;

	    this.sd=sd;
	    this.activeElement=0;
	}

	/**
	 * @function fromJcamp(jcamp,options)
	 * Construct the object from the given jcamp.
	 * @param jcamp
	 * @param options
	 * @option xy
	 * @option keepSpectra
	 * @option keepRecordsRegExp
	 * @returns {SD}
	 */
	SD.fromJcamp = function(jcamp, options) {
	    options = Object.assign({}, {xy:true,keepSpectra:true,keepRecordsRegExp:/^.+$/}, options);
	    var spectrum= JcampConverter.convert(jcamp,options);
	    return new SD(spectrum);
	}


	/**
	 * @function setActiveElement(nactiveSpectrum);
	 * This function sets the nactiveSpectrum sub-spectrum as active
	 * @param index of the sub-spectrum to set as active
	 */
	SD.prototype.setActiveElement = function(nactiveSpectrum){
	    this.activeElement=nactiveSpectrum;
	}

	/**
	 * @function getActiveElement();
	 * This function returns the index of the active sub-spectrum.
	 * @returns {number|*}
	 */
	SD.prototype.getActiveElement = function(){
	    return this.activeElement;
	}

	/**
	 * @function getXUnits()
	 * This function returns the units of the independent dimension.
	 * @returns {xUnit|*|M.xUnit}
	 */
	SD.prototype.getXUnits = function(){
	    return this.getSpectrum().xUnit;
	}

	/**
	 * @function setXUnits()
	 * This function returns the units of the independent dimension.
	 * @returns {xUnit|*|M.xUnit}
	 */
	SD.prototype.setXUnits = function(units){
	    this.getSpectrum().xUnit=units;
	}

	/**
	 * @function getYUnits()
	 * * This function returns the units of the dependent variable.
	 * @returns {yUnit|*|M.yUnit}
	 */
	SD.prototype.getYUnits = function(){
	    return this.getSpectrum().yUnit;
	}

	/**
	 * @function getSpectraVariable()
	 * This function returns the information about the dimensions
	 * @returns {*}
	 */
	SD.prototype.getSpectraVariable = function(dim){
	    return this.sd.ntuples[dim];
	}

	/**
	 * @function getNbPoints()
	 * Return the number of points in the current spectrum
	 * @param i sub-spectrum
	 * @returns {*}
	 */
	SD.prototype.getNbPoints=function(i){
	    return this.getSpectrumData(i).y.length;
	}

	/**
	 * @function getFirstX()
	 * Return the first value of the direct dimension
	 * @param i sub-spectrum
	 * @returns {number}
	 */
	SD.prototype.getFirstX=function(i) {
	    i=i||this.activeElement;
	    return this.sd.spectra[i].firstX;
	}

	/**
	 * @function setFirstX()
	 * Set the firstX for this spectrum. You have to force and update of the xAxis after!!!
	 * @param x
	 * @param i sub-spectrum
	 */
	SD.prototype.setFirstX=function(x, i) {
	    i=i||this.activeElement;
	    this.sd.spectra[i].firstX=x;
	}

	/**
	 * @function getLastX()
	 * Return the last value of the direct dimension
	 * @param i sub-spectrum
	 * @returns {number}
	 */
	SD.prototype.getLastX=function(i) {
	    i=i||this.activeElement;
	    return this.sd.spectra[i].lastX;
	}

	/**
	 * @function setLastX()
	 * Set the last value of the direct dimension. You have to force and update of the xAxis after!!!
	 * @param x
	 * @param i sub-spectrum
	 */
	SD.prototype.setLastX=function(x, i) {
	    i=i||this.activeElement;
	    this.sd.spectra[i].lastX=x;
	}

	/**
	 */
	/**
	 * Return the first value of the direct dimension
	 * @param i sub-spectrum
	 * @returns {number}
	 */
	SD.prototype.getFirstY=function(i) {
	    i=i||this.activeElement;
	    return this.sd.spectra[i].firstY;
	}

	/**
	 * @function setFirstY()
	 * Set the first value of the indirect dimension. Only valid for 2D spectra.
	 * @param y
	 * @param i sub-spectrum
	 */
	SD.prototype.setFirstY=function(y, i) {
	    i=i||this.activeElement;
	    this.sd.spectra[i].firstY = y;
	}

	/**
	 * @function getLastY
	 * Return the first value of the indirect dimension. Only valid for 2D spectra.
	 * @returns {number}
	 */
	SD.prototype.getLastY = function(i){
	    i=i||this.activeElement;
	    return this.sd.spectra[i].lastY;
	}

	/**
	 * @function setLastY()
	 * Return the first value of the indirect dimension
	 * @param y
	 * @param i sub-spectrum
	 */
	SD.prototype.setLastY = function(y, i){
	    i=i||this.activeElement;
	    this.sd.spectra[i].lastY = y;
	}

	/**
	 * @function setDataClass()
	 * Set the spectrum data_class. It could be DATACLASS_PEAK=1 or DATACLASS_XY=2
	 * @param dataClass
	 */
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
	 * @returns {*}
	 */
	SD.prototype.isDataClassPeak = function(){
	    if(this.getSpectrum().isPeaktable)
	        return  this.getSpectrum().isPeaktable;
	    return false;
	}

	/**
	 * @function isDataClassXY();
	 * Is this a XY spectrum?
	 * @returns {*}
	 */
	SD.prototype.isDataClassXY = function(){
	    if(this.getSpectrum().isXYdata)
	        return  this.getSpectrum().isXYdata;
	    return false
	}

	/**
	 * @function setDataType()
	 * Set the data type for this spectrum. It could be one of the following:
	 ["INFRARED"||"IR","IV","NDNMRSPEC","NDNMRFID","NMRSPEC","NMRFID","HPLC","MASS"
	 * "UV", "RAMAN" "GC"|| "GASCHROMATOGRAPH","CD"|| "DICHRO","XY","DEC"]
	 * @param dataType
	 */
	SD.prototype.setDataType = function(dataType){
	    this.getSpectrum().dataType=dataType;
	}

	/**
	 * @function getDataType()
	 * Return the dataType(see: setDataType )
	 * @returns {string|string|*|string}
	 */
	SD.prototype.getDataType = function(){
	    return this.getSpectrum().dataType;
	}

	/**
	 * @function getSpectrumData()
	 * Return the i-th sub-spectrum data in the current spectrum
	 * @param i
	 * @returns {this.sd.spectra[i].data[0]}
	 */
	SD.prototype.getSpectrumData=function(i) {
	    i=i||this.activeElement;
	    return this.sd.spectra[i].data[0];
	}

	/**
	 * @function getSpectrum()
	 * Return the i-th sub-spectra in the current spectrum
	 * @param i
	 * @returns {this.sd.spectra[i]}
	 */
	SD.prototype.getSpectrum=function(i) {
	    i=i||this.activeElement;
	    return this.sd.spectra[i];
	}

	/**
	 * @function getNbSubSpectra()
	 * Return the amount of sub-spectra in this object
	 * @returns {*}
	 */
	SD.prototype.getNbSubSpectra=function(){
	    return this.sd.spectra.length;
	}

	/**
	 * @function getXData()
	 *  Returns an array containing the x values of the spectrum
	 * @param i sub-spectrum Default:activeSpectrum
	 * @returns {Array}
	 */
	SD.prototype.getXData=function(i){
	    return this.getSpectrumData(i).x;
	}

	/**
	 * @function getYData()
	 * This function returns a double array containing the values with the intensities for the current sub-spectrum.
	 * @param i sub-spectrum Default:activeSpectrum
	 * @returns {Array}
	 */
	SD.prototype.getYData=function(i){
	    return this.getSpectrumData(i).y;
	}

	/**
	 * @function getX()
	 * Returns the x value at the specified index for the active sub-spectrum.
	 * @param i array index between 0 and spectrum.getNbPoints()-1
	 * @returns {number}
	 */
	SD.prototype.getX=function(i){
	    return this.getXData()[i];
	}

	/**
	 * @function getY()
	 * Returns the y value at the specified index for the active sub-spectrum.
	 * @param i array index between 0 and spectrum.getNbPoints()-1
	 * @returns {number}
	 */
	SD.prototype.getY=function(i){
	    return this.getYData()[i];
	}

	/**
	 * @function getXYData();
	 * Returns a double[2][nbPoints] where the first row contains the x values and the second row the y values.
	 * @param i sub-spectrum Default:activeSpectrum
	 * @returns {*[]}
	 */
	SD.prototype.getXYData=function(i){
	    return [this.getXData(i),this.getYData(i)];
	}

	/**
	 * @function getTitle
	 * Return the title of the current spectrum.
	 * @param i sub-spectrum Default:activeSpectrum
	 * @returns {*}
	 */
	SD.prototype.getTitle=function(i) {
	    return this.getSpectrum(i).title;
	}

	/**
	 * @function setTitle(newTitle);
	 * Set the title of this spectrum.
	 * @param newTitle The new title
	 * @param i sub-spectrum Default:activeSpectrum
	 */
	SD.prototype.setTitle=function(newTitle,i) {
	    this.getSpectrum(i).title=newTitle;
	}

	/**
	 * @function getMinY(i)
	 * This function returns the minimal value of Y
	 * @param i sub-spectrum Default:activeSpectrum
	 * @returns {number}
	 */
	SD.prototype.getMinY=function(i) {
	    return  StatArray.min(this.getYData(i));
	}

	/**
	 * @function getMaxY(i)
	 * This function returns the maximal value of Y
	 * @param i sub-spectrum Default:activeSpectrum
	 * @returns {number}
	 */
	SD.prototype.getMaxY=function(i) {
	    return  StatArray.max(this.getYData(i));
	}

	/**
	 * @function getMinMax(i)
	 * Return the min and max value of Y
	 * @param i sub-spectrum Default:activeSpectrum
	 * @returns {{min, max}|*}
	 */
	SD.prototype.getMinMaxY=function(i) {
	    return  StatArray.minMax(this.getYData(i));
	}


	/**
	 * @function getNoiseLevel()
	 * Get the noise threshold level of the current spectrum. It uses median instead of the mean
	 * @returns {number}
	 */
	SD.prototype.getNoiseLevel=function(){
	    var stddev = StatArray.robustMeanAndStdev(this.getYData()).stdev;
	    return stddev*this.getNMRPeakThreshold(this.getNucleus(1));
	}

	/**
	 * @function arrayPointToUnits(doublePoint)
	 * Return the xValue for the given index.
	 * @param doublePoint
	 * @returns {number}
	 */
	SD.prototype.arrayPointToUnits=function(doublePoint){
	    return (this.getFirstX() - (doublePoint* (this.getFirstX() - this.getLastX()) / (this.getNbPoints()-1)));
	}

	/**
	 * @function unitsToArrayPoint(inValue)
	 * Returns the index-value for the data array corresponding to a X-value in
	 * units for the element of spectraData to which it is linked (spectraNb).
	 * This method makes use of spectraData.getFirstX(), spectraData.getLastX()
	 * and spectraData.getNbPoints() to derive the return value if it of data class XY
	 * It performs a binary search if the spectrum is a peak table
	 * @param inValue
	 *            (value in Units to be converted)
	 * @return {number} An integer representing the index value of the inValue
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
	 * @function getDeltaX()
	 * Returns the separation between 2 consecutive points in the spectrum domain
	 * @returns {number}
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
	    ArrayUtils.scale(this.getYData(),{min:min,max:max,inplace:true});
	}

	/**
	 * @function setMin(min)
	 * This function scales the values of Y to fit the min parameter
	 * @param min   Minimum desired value for Y
	 */
	SD.prototype.setMin=function(min) {
	    ArrayUtils.scale(this.getYData(),{min:min,inplace:true});
	}

	/**
	 * @function setMax(max)
	 * This function scales the values of Y to fit the max parameter
	 * @param max   Maximum desired value for Y
	 */
	SD.prototype.setMax=function(max) {
	    ArrayUtils.scale(this.getYData(),{max:max,inplace:true});
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
	 * If value is undefined it will suppress the elements
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

	        if(typeof value !== "number"){
	            y.splice(start,end-start);
	            x.splice(start,end-start);
	        }
	        else{
	            for(i=start;i<=end;i++){
	                y[i]=value;
	            }
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
	    this.fillWith(from,to);
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
	 * @function getMaxPeak()
	 * Get the maximum peak
	 * @returns {[x, y]}
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
	    return [this.getX(index),max];
	}

	/**
	 * @function getParamDouble(name, defvalue);
	 * Get the value of the parameter
	 * @param  name The parameter name
	 * @param  defvalue The default value
	 * @returns {number}
	 */

	/**
	 *
	 * @param name
	 * @param defvalue
	 * @returns {*}
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
	 * @returns {string}
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
	 * @returns {number}
	 */
	SD.prototype.getParamInt = function(name, defvalue){
	    var value = this.sd.info[name];
	    if(!value)
	        value = defvalue;
	    return value;
	}

	/**
	 * @function getParam(name, defvalue);
	 * Get the value of the parameter
	 * @param  name The parameter name
	 * @param  defvalue The default value
	 * @returns {*}
	 */
	SD.prototype.getParam = function(name, defvalue){
	    var value = this.sd.info[name];
	    if(!value)
	        value = defvalue;
	    return value;
	}

	/**
	 * @function containsParam(name)
	 *True if the spectrum.info contains the given parameter
	 * @param name
	 * @returns {boolean}
	 */
	SD.prototype.containsParam = function(name){
	    if(this.sd.info[name]){
	        return true;
	    }
	    return false;
	}

	/**
	 * @function getSpectraDataY()
	 * Return the y elements of the current spectrum. Same as getYData. Kept for backward compatibility.
	 * @returns {Array}
	 */
	SD.prototype.getSpectraDataY = function(){
	    return this.getYData();
	}

	/**
	 * @function getSpectraDataX()
	 * Return the x elements of the current spectrum. Same as getXData. Kept for backward compatibility.
	 * @returns {Array}
	 */
	SD.prototype.getSpectraDataX = function(){
	    return this.getXData();
	}

	/**
	 * @function resetMinMax()
	 * Update min max values of X and Yaxis.
	 */
	SD.prototype.resetMinMax = function(){
	    //TODO Impelement this function
	}

	/**
	 * @function putParam(name, value)
	 * Set a new parameter to this spectrum
	 * @param name
	 * @param value
	 */
	SD.prototype.putParam = function(name, value){
	    this.sd.info[name]=value;
	}

	/**
	 * @function getArea(from, to)
	 * This function returns the area under the spectrum in the given window
	 * @param from in spectrum units
	 * @param to in spectrum units
	 * @returns {number}
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
	 * @function getVector(from, to, nPoints)
	 * Returns a equally spaced vector within the given window.
	 * @param from in spectrum units
	 * @param to in spectrum units
	 * @param nPoints number of points to return(!!!sometimes it is not possible to return exactly the required nbPoints)
	 * @returns [x,y]
	 */
	SD.prototype.getVector = function(from, to, nPoints){
	    return ArrayUtils.getEquallySpacedData(this.getSpectraDataX(), this.getSpectraDataY(), {from: from, to:to, numberOfPoints:nPoints});
	}

	/**
	 * @function is2D()
	 * Is it a 2D spectrum?
	 * @returns {boolean}
	 */
	SD.prototype.is2D = function(){
	    if(typeof this.sd.twoD == "undefined")
	        return false;
	    return this.sd.twoD;
	}

	/**
	 * @function toJcamp(options)
	 * This function creates a String that represents the given spectraData in the format JCAM-DX 5.0
	 * The X,Y data can be compressed using one of the methods described in:
	 * "JCAMP-DX. A STANDARD FORMAT FOR THE EXCHANGE OF ION MOBILITY SPECTROMETRY DATA",
	 *  http://www.iupac.org/publications/pac/pdf/2001/pdf/7311x1765.pdf
	 * @option encode: ['FIX','SQZ','DIF','DIFDUP','CVS','PAC'] (Default: 'DIFDUP')
	 * @option yfactor: The YFACTOR. It allows to compress the data by removing digits from the ordinate. (Default: 1)
	 * @option type: ["NTUPLES", "SIMPLE"] (Default: "SIMPLE")
	 * @option keep: A set of user defined parameters of the given SpectraData to be stored in the jcamp.
	 * @returns a string containing the jcamp-DX file
	 * @example SD.toJcamp(spectraData,{encode:'DIFDUP',yfactor:0.01,type:"SIMPLE",keep:['#batchID','#url']});
	 */
	SD.prototype.toJcamp=function(options) {
	    var defaultOptions = {"encode":"DIFDUP","yFactor":1,"type":"SIMPLE","keep":[]};
	    options = extend({}, defaultOptions, options);
	    return JcampCreator.convert(this, options.encode, options.yFactor, options.type, options.keep);
	}


	module.exports = SD;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.array = __webpack_require__(3);
	exports.matrix = __webpack_require__(4);


/***/ },
/* 3 */
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
	    var max = values[0];
	    var l = values.length;
	    for (var i = 1; i < l; i++) {
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
	    var min = values[0];
	    var l = values.length;
	    for (var i = 1; i < l; i++) {
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
	    var min = values[0];
	    var max = values[0];
	    var l = values.length;
	    for (var i = 1; i < l; i++) {
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
	        values = [].concat(values).sort(compareNumbers);
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
	        values = [].concat(values).sort(compareNumbers);
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

	/**
	 * IEEE Transactions on biomedical engineering, vol. 52, no. 1, january 2005, p. 76-
	 * Calculate the standard deviation via the Median of the absolute deviation
	 *  The formula for the standard deviation only holds for Gaussian random variables.
	 * @returns {{mean: number, stdev: number}}
	 */
	exports.robustMeanAndStdev = function robustMeanAndStdev(y) {
	    var mean = 0, stdev = 0;
	    var length = y.length, i = 0;
	    for (i = 0; i < length; i++) {
	        mean += y[i];
	    }
	    mean /= length;
	    var averageDeviations = new Array(length);
	    for (i = 0; i < length; i++)
	        averageDeviations[i] = Math.abs(y[i] - mean);
	    averageDeviations.sort(compareNumbers);
	    if (length % 2 === 1) {
	        stdev = averageDeviations[(length - 1) / 2] / 0.6745;
	    } else {
	        stdev = 0.5 * (averageDeviations[length / 2] + averageDeviations[length / 2 - 1]) / 0.6745;
	    }

	    return {
	        mean: mean,
	        stdev: stdev
	    };
	};

	exports.quartiles = function quartiles(values, alreadySorted) {
	    if (typeof (alreadySorted) === 'undefined') alreadySorted = false;
	    if (!alreadySorted) {
	        values = [].concat(values).sort(compareNumbers);
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
	    if (typeof (unbiased) === 'undefined') unbiased = true;
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
	    if (typeof (unbiased) === 'undefined') unbiased = true;
	    var mean1 = exports.mean(vector1);
	    var mean2 = exports.mean(vector2);

	    if (vector1.length !== vector2.length)
	        throw 'Vectors do not have the same dimensions';

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
	    if (typeof (unbiased) === 'undefined') unbiased = true;
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
	    } else {
	        return g;
	    }
	};

	exports.kurtosis = function kurtosis(values, unbiased) {
	    if (typeof (unbiased) === 'undefined') unbiased = true;
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
	    } else {
	        return m4 / (m2 * m2) - 3;
	    }
	};

	exports.entropy = function entropy(values, eps) {
	    if (typeof (eps) === 'undefined') eps = 0;
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
	    if (typeof (inPlace) === 'undefined') inPlace = false;

	    var result = values;
	    if (!inPlace)
	        result = [].concat(values);

	    var theMean = exports.mean(result), l = result.length;
	    for (var i = 0; i < l; i++)
	        result[i] -= theMean;
	};

	exports.standardize = function standardize(values, standardDev, inPlace) {
	    if (typeof (standardDev) === 'undefined') standardDev = exports.standardDeviation(values);
	    if (typeof (inPlace) === 'undefined') inPlace = false;
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
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var arrayStat = __webpack_require__(3);

	function compareNumbers(a, b) {
	    return a - b;
	}

	exports.max = function max(matrix) {
	    var max = -Infinity;
	    for (var i = 0; i < matrix.length; i++) {
	        for (var j = 0; j < matrix[i].length; j++) {
	            if (matrix[i][j] > max) max = matrix[i][j];
	        }
	    }
	    return max;
	};

	exports.min = function min(matrix) {
	    var min = Infinity;
	    for (var i = 0; i < matrix.length; i++) {
	        for (var j = 0; j < matrix[i].length; j++) {
	            if (matrix[i][j] < min) min = matrix[i][j];
	        }
	    }
	    return min;
	};

	exports.minMax = function minMax(matrix) {
	    var min = Infinity;
	    var max = -Infinity;
	    for (var i = 0; i < matrix.length; i++) {
	        for (var j = 0; j < matrix[i].length; j++) {
	            if (matrix[i][j] < min) min = matrix[i][j];
	            if (matrix[i][j] > max) max = matrix[i][j];
	        }
	    }
	    return {
	        min:min,
	        max:max
	    };
	};

	exports.entropy = function entropy(matrix, eps) {
	    if (typeof (eps) === 'undefined') {
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
	};

	exports.mean = function mean(matrix, dimension) {
	    if (typeof (dimension) === 'undefined') {
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
	};

	exports.sum = function sum(matrix, dimension) {
	    if (typeof (dimension) === 'undefined') {
	        dimension = 0;
	    }
	    var rows = matrix.length,
	        cols = matrix[0].length,
	        theSum, i, j;

	    if (dimension === -1) {
	        theSum = [0];
	        for (i = 0; i < rows; i++) {
	            for (j = 0; j < cols; j++) {
	                theSum[0] += matrix[i][j];
	            }
	        }
	    } else if (dimension === 0) {
	        theSum = new Array(cols);
	        for (j = 0; j < cols; j++) {
	            theSum[j] = 0;
	            for (i = 0; i < rows; i++) {
	                theSum[j] += matrix[i][j];
	            }
	        }
	    } else if (dimension === 1) {
	        theSum = new Array(rows);
	        for (j = 0; j < rows; j++) {
	            theSum[j] = 0;
	            for (i = 0; i < cols; i++) {
	                theSum[j] += matrix[j][i];
	            }
	        }
	    } else {
	        throw new Error('Invalid dimension');
	    }
	    return theSum;
	};

	exports.product = function product(matrix, dimension) {
	    if (typeof (dimension) === 'undefined') {
	        dimension = 0;
	    }
	    var rows = matrix.length,
	        cols = matrix[0].length,
	        theProduct, i, j;

	    if (dimension === -1) {
	        theProduct = [1];
	        for (i = 0; i < rows; i++) {
	            for (j = 0; j < cols; j++) {
	                theProduct[0] *= matrix[i][j];
	            }
	        }
	    } else if (dimension === 0) {
	        theProduct = new Array(cols);
	        for (j = 0; j < cols; j++) {
	            theProduct[j] = 1;
	            for (i = 0; i < rows; i++) {
	                theProduct[j] *= matrix[i][j];
	            }
	        }
	    } else if (dimension === 1) {
	        theProduct = new Array(rows);
	        for (j = 0; j < rows; j++) {
	            theProduct[j] = 1;
	            for (i = 0; i < cols; i++) {
	                theProduct[j] *= matrix[j][i];
	            }
	        }
	    } else {
	        throw new Error('Invalid dimension');
	    }
	    return theProduct;
	};

	exports.standardDeviation = function standardDeviation(matrix, means, unbiased) {
	    var vari = exports.variance(matrix, means, unbiased), l = vari.length;
	    for (var i = 0; i < l; i++) {
	        vari[i] = Math.sqrt(vari[i]);
	    }
	    return vari;
	};

	exports.variance = function variance(matrix, means, unbiased) {
	    if (typeof (unbiased) === 'undefined') {
	        unbiased = true;
	    }
	    means = means || exports.mean(matrix);
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
	};

	exports.median = function median(matrix) {
	    var rows = matrix.length, cols = matrix[0].length;
	    var medians = new Array(cols);

	    for (var i = 0; i < cols; i++) {
	        var data = new Array(rows);
	        for (var j = 0; j < rows; j++) {
	            data[j] = matrix[j][i];
	        }
	        data.sort(compareNumbers);
	        var N = data.length;
	        if (N % 2 === 0) {
	            medians[i] = (data[N / 2] + data[(N / 2) - 1]) * 0.5;
	        } else {
	            medians[i] = data[Math.floor(N / 2)];
	        }
	    }
	    return medians;
	};

	exports.mode = function mode(matrix) {
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
	};

	exports.skewness = function skewness(matrix, unbiased) {
	    if (typeof (unbiased) === 'undefined') unbiased = true;
	    var means = exports.mean(matrix);
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
	};

	exports.kurtosis = function kurtosis(matrix, unbiased) {
	    if (typeof (unbiased) === 'undefined') unbiased = true;
	    var means = exports.mean(matrix);
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
	};

	exports.standardError = function standardError(matrix) {
	    var samples = matrix.length;
	    var standardDeviations = exports.standardDeviation(matrix);
	    var l = standardDeviations.length;
	    var standardErrors = new Array(l);
	    var sqrtN = Math.sqrt(samples);

	    for (var i = 0; i < l; i++) {
	        standardErrors[i] = standardDeviations[i] / sqrtN;
	    }
	    return standardErrors;
	};

	exports.covariance = function covariance(matrix, dimension) {
	    return exports.scatter(matrix, undefined, dimension);
	};

	exports.scatter = function scatter(matrix, divisor, dimension) {
	    if (typeof (dimension) === 'undefined') {
	        dimension = 0;
	    }
	    if (typeof (divisor) === 'undefined') {
	        if (dimension === 0) {
	            divisor = matrix.length - 1;
	        } else if (dimension === 1) {
	            divisor = matrix[0].length - 1;
	        }
	    }
	    var means = exports.mean(matrix, dimension);
	    var rows = matrix.length;
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
	};

	exports.correlation = function correlation(matrix) {
	    var means = exports.mean(matrix),
	        standardDeviations = exports.standardDeviation(matrix, true, means),
	        scores = exports.zScores(matrix, means, standardDeviations),
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
	};

	exports.zScores = function zScores(matrix, means, standardDeviations) {
	    means = means || exports.mean(matrix);
	    if (typeof (standardDeviations) === 'undefined') standardDeviations = exports.standardDeviation(matrix, true, means);
	    return exports.standardize(exports.center(matrix, means, false), standardDeviations, true);
	};

	exports.center = function center(matrix, means, inPlace) {
	    means = means || exports.mean(matrix);
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
	};

	exports.standardize = function standardize(matrix, standardDeviations, inPlace) {
	    if (typeof (standardDeviations) === 'undefined') standardDeviations = exports.standardDeviation(matrix);
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
	};

	exports.weightedVariance = function weightedVariance(matrix, weights) {
	    var means = exports.mean(matrix);
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
	};

	exports.weightedMean = function weightedMean(matrix, weights, dimension) {
	    if (typeof (dimension) === 'undefined') {
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
	};

	exports.weightedCovariance = function weightedCovariance(matrix, weights, means, dimension) {
	    dimension = dimension || 0;
	    means = means || exports.weightedMean(matrix, weights, dimension);
	    var s1 = 0, s2 = 0;
	    for (var i = 0, ii = weights.length; i < ii; i++) {
	        s1 += weights[i];
	        s2 += weights[i] * weights[i];
	    }
	    var factor = s1 / (s1 * s1 - s2);
	    return exports.weightedScatter(matrix, weights, means, factor, dimension);
	};

	exports.weightedScatter = function weightedScatter(matrix, weights, means, factor, dimension) {
	    dimension = dimension || 0;
	    means = means || exports.weightedMean(matrix, weights, dimension);
	    if (typeof (factor) === 'undefined') {
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
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = exports = __webpack_require__(6);
	exports.getEquallySpacedData = __webpack_require__(7).getEquallySpacedData;
	exports.SNV = __webpack_require__(8).SNV;
	exports.binarySearch = __webpack_require__(9);


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	const Stat = __webpack_require__(2).array;
	/**
	 * Function that returns an array of points given 1D array as follows:
	 *
	 * [x1, y1, .. , x2, y2, ..]
	 *
	 * And receive the number of dimensions of each point.
	 * @param array
	 * @param dimensions
	 * @returns {Array} - Array of points.
	 */
	function coordArrayToPoints(array, dimensions) {
	    if(array.length % dimensions !== 0) {
	        throw new RangeError('Dimensions number must be accordance with the size of the array.');
	    }

	    var length = array.length / dimensions;
	    var pointsArr = new Array(length);

	    var k = 0;
	    for(var i = 0; i < array.length; i += dimensions) {
	        var point = new Array(dimensions);
	        for(var j = 0; j < dimensions; ++j) {
	            point[j] = array[i + j];
	        }

	        pointsArr[k] = point;
	        k++;
	    }

	    return pointsArr;
	}


	/**
	 * Function that given an array as follows:
	 * [x1, y1, .. , x2, y2, ..]
	 *
	 * Returns an array as follows:
	 * [[x1, x2, ..], [y1, y2, ..], [ .. ]]
	 *
	 * And receives the number of dimensions of each coordinate.
	 * @param array
	 * @param dimensions
	 * @returns {Array} - Matrix of coordinates
	 */
	function coordArrayToCoordMatrix(array, dimensions) {
	    if(array.length % dimensions !== 0) {
	        throw new RangeError('Dimensions number must be accordance with the size of the array.');
	    }

	    var coordinatesArray = new Array(dimensions);
	    var points = array.length / dimensions;
	    for (var i = 0; i < coordinatesArray.length; i++) {
	        coordinatesArray[i] = new Array(points);
	    }

	    for(i = 0; i < array.length; i += dimensions) {
	        for(var j = 0; j < dimensions; ++j) {
	            var currentPoint = Math.floor(i / dimensions);
	            coordinatesArray[j][currentPoint] = array[i + j];
	        }
	    }

	    return coordinatesArray;
	}

	/**
	 * Function that receives a coordinate matrix as follows:
	 * [[x1, x2, ..], [y1, y2, ..], [ .. ]]
	 *
	 * Returns an array of coordinates as follows:
	 * [x1, y1, .. , x2, y2, ..]
	 *
	 * @param coordMatrix
	 * @returns {Array}
	 */
	function coordMatrixToCoordArray(coordMatrix) {
	    var coodinatesArray = new Array(coordMatrix.length * coordMatrix[0].length);
	    var k = 0;
	    for(var i = 0; i < coordMatrix[0].length; ++i) {
	        for(var j = 0; j < coordMatrix.length; ++j) {
	            coodinatesArray[k] = coordMatrix[j][i];
	            ++k;
	        }
	    }

	    return coodinatesArray;
	}

	/**
	 * Tranpose a matrix, this method is for coordMatrixToPoints and
	 * pointsToCoordMatrix, that because only transposing the matrix
	 * you can change your representation.
	 *
	 * @param matrix
	 * @returns {Array}
	 */
	function transpose(matrix) {
	    var resultMatrix = new Array(matrix[0].length);
	    for(var i = 0; i < resultMatrix.length; ++i) {
	        resultMatrix[i] = new Array(matrix.length);
	    }

	    for (i = 0; i < matrix.length; ++i) {
	        for(var j = 0; j < matrix[0].length; ++j) {
	            resultMatrix[j][i] = matrix[i][j];
	        }
	    }

	    return resultMatrix;
	}

	/**
	 * Function that transform an array of points into a coordinates array
	 * as follows:
	 * [x1, y1, .. , x2, y2, ..]
	 *
	 * @param points
	 * @returns {Array}
	 */
	function pointsToCoordArray(points) {
	    var coodinatesArray = new Array(points.length * points[0].length);
	    var k = 0;
	    for(var i = 0; i < points.length; ++i) {
	        for(var j = 0; j < points[0].length; ++j) {
	            coodinatesArray[k] = points[i][j];
	            ++k;
	        }
	    }

	    return coodinatesArray;
	}

	/**
	 * Apply the dot product between the smaller vector and a subsets of the
	 * largest one.
	 *
	 * @param firstVector
	 * @param secondVector
	 * @returns {Array} each dot product of size of the difference between the
	 *                  larger and the smallest one.
	 */
	function applyDotProduct(firstVector, secondVector) {
	    var largestVector, smallestVector;
	    if(firstVector.length <= secondVector.length) {
	        smallestVector = firstVector;
	        largestVector = secondVector;
	    } else {
	        smallestVector = secondVector;
	        largestVector = firstVector;
	    }

	    var difference = largestVector.length - smallestVector.length + 1;
	    var dotProductApplied = new Array(difference);

	    for (var i = 0; i < difference; ++i) {
	        var sum = 0;
	        for (var j = 0; j < smallestVector.length; ++j) {
	            sum += smallestVector[j] * largestVector[i + j];
	        }
	        dotProductApplied[i] = sum;
	    }

	    return dotProductApplied;
	}
	/**
	 * To scale the input array between the specified min and max values. The operation is performed inplace
	 * if the options.inplace is specified. If only one of the min or max parameters is specified, then the scaling
	 * will multiply the input array by min/min(input) or max/max(input)
	 * @param input
	 * @param options
	 * @returns {*}
	 */
	function scale(input, options){
	    var y;
	    if(options.inPlace){
	        y = input;
	    }
	    else{
	        y = new Array(input.length);
	    }
	    const max = options.max;
	    const min = options.min;
	    if(typeof max === "number"){
	        if(typeof min === "number"){
	            var minMax = Stat.minMax(input);
	            var factor = (max - min)/(minMax.max-minMax.min);
	            for(var i=0;i< y.length;i++){
	                y[i]=(input[i]-minMax.min)*factor+min;
	            }
	        }
	        else{
	            var currentMin = Stat.max(input);
	            var factor = max/currentMin;
	            for(var i=0;i< y.length;i++){
	                y[i] = input[i]*factor;
	            }
	        }
	    }
	    else{
	        if(typeof min === "number"){
	            var currentMin = Stat.min(input);
	            var factor = min/currentMin;
	            for(var i=0;i< y.length;i++){
	                y[i] = input[i]*factor;
	            }
	        }
	    }
	    return y;
	}

	module.exports = {
	    coordArrayToPoints: coordArrayToPoints,
	    coordArrayToCoordMatrix: coordArrayToCoordMatrix,
	    coordMatrixToCoordArray: coordMatrixToCoordArray,
	    coordMatrixToPoints: transpose,
	    pointsToCoordArray: pointsToCoordArray,
	    pointsToCoordMatrix: transpose,
	    applyDotProduct: applyDotProduct,
	    scale:scale
	};



/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	/**
	 *
	 * Function that returns a Number array of equally spaced numberOfPoints
	 * containing a representation of intensities of the spectra arguments x
	 * and y.
	 *
	 * The options parameter contains an object in the following form:
	 * from: starting point
	 * to: last point
	 * numberOfPoints: number of points between from and to
	 * variant: "slot" or "smooth" - smooth is the default option
	 *
	 * The slot variant consist that each point in the new array is calculated
	 * averaging the existing points between the slot that belongs to the current
	 * value. The smooth variant is the same but takes the integral of the range
	 * of the slot and divide by the step size between two points in the new array.
	 *
	 * @param x - sorted increasing x values
	 * @param y
	 * @param options
	 * @returns {Array} new array with the equally spaced data.
	 *
	 */
	function getEquallySpacedData(x, y, options) {
	    if (x.length>1 && x[0]>x[1]) {
	        x=x.slice().reverse();
	        y=y.slice().reverse();
	    }

	    var xLength = x.length;
	    if(xLength !== y.length)
	        throw new RangeError("the x and y vector doesn't have the same size.");

	    if (options === undefined) options = {};

	    var from = options.from === undefined ? x[0] : options.from
	    if (isNaN(from) || !isFinite(from)) {
	        throw new RangeError("'From' value must be a number");
	    }
	    var to = options.to === undefined ? x[x.length - 1] : options.to;
	    if (isNaN(to) || !isFinite(to)) {
	        throw new RangeError("'To' value must be a number");
	    }

	    var reverse = from > to;
	    if(reverse) {
	        var temp = from;
	        from = to;
	        to = temp;
	    }

	    var numberOfPoints = options.numberOfPoints === undefined ? 100 : options.numberOfPoints;
	    if (isNaN(numberOfPoints) || !isFinite(numberOfPoints)) {
	        throw new RangeError("'Number of points' value must be a number");
	    }
	    if(numberOfPoints < 1)
	        throw new RangeError("the number of point must be higher than 1");

	    var algorithm = options.variant === "slot" ? "slot" : "smooth"; // default value: smooth

	    var output = algorithm === "slot" ? getEquallySpacedSlot(x, y, from, to, numberOfPoints) : getEquallySpacedSmooth(x, y, from, to, numberOfPoints);

	    return reverse ? output.reverse() : output;
	}

	/**
	 * function that retrieves the getEquallySpacedData with the variant "smooth"
	 *
	 * @param x
	 * @param y
	 * @param from - Initial point
	 * @param to - Final point
	 * @param numberOfPoints
	 * @returns {Array} - Array of y's equally spaced with the variant "smooth"
	 */
	function getEquallySpacedSmooth(x, y, from, to, numberOfPoints) {
	    var xLength = x.length;

	    var step = (to - from) / (numberOfPoints - 1);
	    var halfStep = step / 2;

	    var start = from - halfStep;
	    var output = new Array(numberOfPoints);

	    var initialOriginalStep = x[1] - x[0];
	    var lastOriginalStep = x[x.length - 1] - x[x.length - 2];

	    // Init main variables
	    var min = start;
	    var max = start + step;

	    var previousX = Number.MIN_VALUE;
	    var previousY = 0;
	    var nextX = x[0] - initialOriginalStep;
	    var nextY = 0;

	    var currentValue = 0;
	    var slope = 0;
	    var intercept = 0;
	    var sumAtMin = 0;
	    var sumAtMax = 0;

	    var i = 0; // index of input
	    var j = 0; // index of output

	    function getSlope(x0, y0, x1, y1) {
	        return (y1 - y0) / (x1 - x0);
	    }

	    main: while(true) {
	        while (nextX - max >= 0) {
	            // no overlap with original point, just consume current value
	            var add = integral(0, max - previousX, slope, previousY);
	            sumAtMax = currentValue + add;

	            output[j] = (sumAtMax - sumAtMin) / step;
	            j++;

	            if (j === numberOfPoints)
	                break main;

	            min = max;
	            max += step;
	            sumAtMin = sumAtMax;
	        }

	        if(previousX <= min && min <= nextX) {
	            add = integral(0, min - previousX, slope, previousY);
	            sumAtMin = currentValue + add;
	        }

	        currentValue += integral(previousX, nextX, slope, intercept);

	        previousX = nextX;
	        previousY = nextY;

	        if (i < xLength) {
	            nextX = x[i];
	            nextY = y[i];
	            i++;
	        } else if (i === xLength) {
	            nextX += lastOriginalStep;
	            nextY = 0;
	        }
	        // updating parameters
	        slope = getSlope(previousX, previousY, nextX, nextY);
	        intercept = -slope*previousX + previousY;
	    }

	    return output;
	}

	/**
	 * function that retrieves the getEquallySpacedData with the variant "slot"
	 *
	 * @param x
	 * @param y
	 * @param from - Initial point
	 * @param to - Final point
	 * @param numberOfPoints
	 * @returns {Array} - Array of y's equally spaced with the variant "slot"
	 */
	function getEquallySpacedSlot(x, y, from, to, numberOfPoints) {
	    var xLength = x.length;

	    var step = (to - from) / (numberOfPoints - 1);
	    var halfStep = step / 2;
	    var lastStep = x[x.length - 1] - x[x.length - 2];

	    var start = from - halfStep;
	    var output = new Array(numberOfPoints);

	    // Init main variables
	    var min = start;
	    var max = start + step;

	    var previousX = -Number.MAX_VALUE;
	    var previousY = 0;
	    var nextX = x[0];
	    var nextY = y[0];
	    var frontOutsideSpectra = 0;
	    var backOutsideSpectra = true;

	    var currentValue = 0;

	    // for slot algorithm
	    var currentPoints = 0;

	    var i = 1; // index of input
	    var j = 0; // index of output

	    main: while(true) {
	        if (previousX>=nextX) throw (new Error('x must be an increasing serie'));
	        while (previousX - max > 0) {
	            // no overlap with original point, just consume current value
	            if(backOutsideSpectra) {
	                currentPoints++;
	                backOutsideSpectra = false;
	            }

	            output[j] = currentPoints <= 0 ? 0 : currentValue / currentPoints;
	            j++;

	            if (j === numberOfPoints)
	                break main;

	            min = max;
	            max += step;
	            currentValue = 0;
	            currentPoints = 0;
	        }

	        if(previousX > min) {
	            currentValue += previousY;
	            currentPoints++;
	        }

	        if(previousX === -Number.MAX_VALUE || frontOutsideSpectra > 1)
	            currentPoints--;

	        previousX = nextX;
	        previousY = nextY;

	        if (i < xLength) {
	            nextX = x[i];
	            nextY = y[i];
	            i++;
	        } else {
	            nextX += lastStep;
	            nextY = 0;
	            frontOutsideSpectra++;
	        }
	    }

	    return output;
	}
	/**
	 * Function that calculates the integral of the line between two
	 * x-coordinates, given the slope and intercept of the line.
	 *
	 * @param x0
	 * @param x1
	 * @param slope
	 * @param intercept
	 * @returns {number} integral value.
	 */
	function integral(x0, x1, slope, intercept) {
	    return (0.5 * slope * x1 * x1 + intercept * x1) - (0.5 * slope * x0 * x0 + intercept * x0);
	}

	exports.getEquallySpacedData = getEquallySpacedData;
	exports.integral = integral;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.SNV = SNV;
	var Stat = __webpack_require__(2).array;

	/**
	 * Function that applies the standard normal variate (SNV) to an array of values.
	 *
	 * @param data - Array of values.
	 * @returns {Array} - applied the SNV.
	 */
	function SNV(data) {
	    var mean = Stat.mean(data);
	    var std = Stat.standardDeviation(data);
	    var result = data.slice();
	    for (var i = 0; i < data.length; i++) {
	        result[i] = (result[i] - mean) / std;
	    }
	    return result;
	}


/***/ },
/* 9 */
/***/ function(module, exports) {

	/**
	 * Performs a binary search of value in array
	 * @param array - Array in which value will be searched. It must be sorted.
	 * @param value - Value to search in array
	 * @return {number} If value is found, returns its index in array. Otherwise, returns a negative number indicating where the value should be inserted: -(index + 1)
	 */
	function binarySearch(array, value) {
	    var low = 0;
	    var high = array.length - 1;

	    while (low <= high) {
	        var mid = (low + high) >>> 1;
	        var midValue = array[mid];
	        if (midValue < value) {
	            low = mid + 1;
	        } else if (midValue > value) {
	            high = mid - 1;
	        } else {
	            return mid;
	        }
	    }

	    return -(low + 1);
	}

	module.exports = binarySearch;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var parseXYDataRegExp = __webpack_require__(11);


	function getConverter() {

	    // the following RegExp can only be used for XYdata, some peakTables have values with a "E-5" ...
	    var ntuplesSeparator = /[, \t]{1,}/;

	    var GC_MS_FIELDS = ['TIC', '.RIC', 'SCANNUMBER'];

	    function convertToFloatArray(stringArray) {
	        var l = stringArray.length;
	        var floatArray = new Array(l);
	        for (var i = 0; i < l; i++) {
	            floatArray[i] = parseFloat(stringArray[i]);
	        }
	        return floatArray;
	    }
	    
	    function Spectrum() {
	        
	    }

	    function convert(jcamp, options) {
	        options = options || {};

	        var keepRecordsRegExp = /^$/;
	        if (options.keepRecordsRegExp) keepRecordsRegExp = options.keepRecordsRegExp;
	        var wantXY = !options.withoutXY;

	        var start = Date.now();

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
	        var spectrum = new Spectrum();

	        if (!(typeof jcamp === 'string')) return result;
	        // console.time('start');

	        if (result.profiling) result.profiling.push({
	            action: 'Before split to LDRS',
	            time: Date.now() - start
	        });

	        ldrs = jcamp.split(/[\r\n]+##/);

	        if (result.profiling) result.profiling.push({
	            action: 'Split to LDRS',
	            time: Date.now() - start
	        });

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

	            if (dataLabel === 'XYDATA') {
	                if (wantXY) {
	                    prepareSpectrum(result, spectrum);
	                    // well apparently we should still consider it is a PEAK TABLE if there are no '++' after
	                    if (dataValue.match(/.*\+\+.*/)) {
	                        if (options.fastParse === false) {
	                            parseXYDataRegExp(spectrum, dataValue, result);
	                        } else {
	                            if (!spectrum.deltaX) {
	                                spectrum.deltaX = (spectrum.lastX - spectrum.firstX) / (spectrum.nbPoints - 1);
	                            }
	                            fastParseXYData(spectrum, dataValue, result);
	                        }
	                    } else {
	                        parsePeakTable(spectrum, dataValue, result);
	                    }
	                    spectra.push(spectrum);
	                    spectrum = new Spectrum();
	                }
	                continue;
	            } else if (dataLabel === 'PEAKTABLE') {
	                if (wantXY) {
	                    prepareSpectrum(result, spectrum);
	                    parsePeakTable(spectrum, dataValue, result);
	                    spectra.push(spectrum);
	                    spectrum = new Spectrum();
	                }
	                continue;
	            }


	            if (dataLabel === 'TITLE') {
	                spectrum.title = dataValue;
	            } else if (dataLabel === 'DATATYPE') {
	                spectrum.dataType = dataValue;
	                if (dataValue.indexOf('nD') > -1) {
	                    result.twoD = true;
	                }
	            } else if (dataLabel === 'NTUPLES') {
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
	            } else if (dataLabel === 'LASTY') {
	                spectrum.lastY = parseFloat(dataValue);
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
	                ntuples.varname = dataValue.split(ntuplesSeparator);
	            } else if (dataLabel === 'SYMBOL') {
	                ntuples.symbol = dataValue.split(ntuplesSeparator);
	            } else if (dataLabel === 'VARTYPE') {
	                ntuples.vartype = dataValue.split(ntuplesSeparator);
	            } else if (dataLabel === 'VARFORM') {
	                ntuples.varform = dataValue.split(ntuplesSeparator);
	            } else if (dataLabel === 'VARDIM') {
	                ntuples.vardim = convertToFloatArray(dataValue.split(ntuplesSeparator));
	            } else if (dataLabel === 'UNITS') {
	                ntuples.units = dataValue.split(ntuplesSeparator);
	            } else if (dataLabel === 'FACTOR') {
	                ntuples.factor = convertToFloatArray(dataValue.split(ntuplesSeparator));
	            } else if (dataLabel === 'FIRST') {
	                ntuples.first = convertToFloatArray(dataValue.split(ntuplesSeparator));
	            } else if (dataLabel === 'LAST') {
	                ntuples.last = convertToFloatArray(dataValue.split(ntuplesSeparator));
	            } else if (dataLabel === 'MIN') {
	                ntuples.min = convertToFloatArray(dataValue.split(ntuplesSeparator));
	            } else if (dataLabel === 'MAX') {
	                ntuples.max = convertToFloatArray(dataValue.split(ntuplesSeparator));
	            } else if (dataLabel === '.NUCLEUS') {
	                if (result.twoD) {
	                    result.yType = dataValue.split(ntuplesSeparator)[0];
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
	            } else if (isMSField(dataLabel)) {
	                spectrum[convertMSFieldToLabel(dataLabel)] = dataValue;
	            }
	            if (dataLabel.match(keepRecordsRegExp)) {
	                result.info[dataLabel] = dataValue.trim();
	            }
	        }

	        if (result.profiling) result.profiling.push({
	            action: 'Finished parsing',
	            time: Date.now() - start
	        });

	        if (Object.keys(ntuples).length > 0) {
	            var newNtuples = [];
	            var keys = Object.keys(ntuples);
	            for (var i = 0; i < keys.length; i++) {
	                var key = keys[i];
	                var values = ntuples[key];
	                for (var j = 0; j < values.length; j++) {
	                    if (!newNtuples[j]) newNtuples[j] = {};
	                    newNtuples[j][key] = values[j];
	                }
	            }
	            result.ntuples = newNtuples;
	        }

	        if (result.twoD && wantXY) {
	            add2D(result, options);
	            if (result.profiling) result.profiling.push({
	                action: 'Finished countour plot calculation',
	                time: Date.now() - start
	            });
	            if (!options.keepSpectra) {
	                delete result.spectra;
	            }
	        }

	        var isGCMS = (spectra.length > 1 && (!spectra[0].dataType || spectra[0].dataType.match(/.*mass.*/i)));
	        if (isGCMS && options.newGCMS) {
	            options.xy = true;
	        }

	        if (options.xy && wantXY) { // the spectraData should not be a oneD array but an object with x and y
	            if (spectra.length > 0) {
	                for (var i = 0; i < spectra.length; i++) {
	                    var spectrum = spectra[i];
	                    if (spectrum.data.length > 0) {
	                        for (var j = 0; j < spectrum.data.length; j++) {
	                            var data = spectrum.data[j];
	                            var newData = {
	                                x: new Array(data.length / 2),
	                                y: new Array(data.length / 2)
	                            };
	                            for (var k = 0; k < data.length; k = k + 2) {
	                                newData.x[k / 2] = data[k];
	                                newData.y[k / 2] = data[k + 1];
	                            }
	                            spectrum.data[j] = newData;
	                        }

	                    }

	                }
	            }
	        }

	        // maybe it is a GC (HPLC) / MS. In this case we add a new format
	        if (isGCMS && wantXY) {
	            if (options.newGCMS) {
	                addNewGCMS(result);
	            } else {
	                addGCMS(result);
	            }
	            if (result.profiling) result.profiling.push({
	                action: 'Finished GCMS calculation',
	                time: Date.now() - start
	            });
	        }

	        if (result.profiling) {
	            result.profiling.push({
	                action: 'Total time',
	                time: Date.now() - start
	            });
	        }

	        return result;
	    }


	    function convertMSFieldToLabel(value) {
	        return value.toLowerCase().replace(/[^a-z0-9]/g, '');
	    }

	    function isMSField(dataLabel) {
	        return GC_MS_FIELDS.indexOf(dataLabel) !== -1;
	    }

	    function addNewGCMS(result) {
	        var spectra = result.spectra;
	        var length = spectra.length;
	        var gcms = {
	            times: new Array(length),
	            series: [{
	                name: 'ms',
	                dimension: 2,
	                data: new Array(length)
	            }]
	        };

	        var i;
	        var existingGCMSFields = [];
	        for (i = 0; i < GC_MS_FIELDS.length; i++) {
	            var label = convertMSFieldToLabel(GC_MS_FIELDS[i]);
	            if (spectra[0][label]) {
	                existingGCMSFields.push(label);
	                gcms.series.push({
	                    name: label,
	                    dimension: 1,
	                    data: new Array(length)
	                });
	            }
	        }

	        for (i = 0; i < length; i++) {
	            var spectrum = spectra[i];
	            gcms.times[i] = spectrum.pageValue;
	            for (var j = 0; j < existingGCMSFields.length; j++) {
	                gcms.series[j + 1].data[i] = parseFloat(spectrum[existingGCMSFields[j]]);
	            }
	            if (spectrum.data) {
	                gcms.series[0].data[i] = [spectrum.data[0].x, spectrum.data[0].y];
	            }

	        }
	        result.gcms = gcms;
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
	        if (existingGCMSFields.length === 0) return;
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

	    function getMedian(data) {
	        data = data.sort(compareNumbers);
	        var l = data.length;
	        return data[Math.floor(l / 2)];
	    }

	    function compareNumbers(a, b) {
	        return a - b;
	    }

	    function convertTo3DZ(spectra) {
	        var minZ = spectra[0].data[0][0];
	        var maxZ = minZ;
	        var ySize = spectra.length;
	        var xSize = spectra[0].data[0].length / 2;
	        var z = new Array(ySize);
	        for (var i = 0; i < ySize; i++) {
	            z[i] = new Array(xSize);
	            var xVector = spectra[i].data[0];
	            for (var j = 0; j < xSize; j++) {
	                var value = xVector[j * 2 + 1];
	                z[i][j] = value;
	                if (value < minZ) minZ = value;
	                if (value > maxZ) maxZ = value;
	            }
	        }
	        return {
	            z: z,
	            minX: spectra[0].data[0][0],
	            maxX: spectra[0].data[0][spectra[0].data[0].length - 2], // has to be -2 because it is a 1D array [x,y,x,y,...]
	            minY: spectra[0].pageValue,
	            maxY: spectra[ySize - 1].pageValue,
	            minZ: minZ,
	            maxZ: maxZ,
	            noise: getMedian(z[0].map(Math.abs))
	        };

	    }

	    function add2D(result, options) {
	        var zData = convertTo3DZ(result.spectra);
	        if (!options.noContour) {
	            result.contourLines = generateContourLines(zData, options);
	            delete zData.z;
	        }
	        result.minMax = zData;
	    }


	    function generateContourLines(zData, options) {
	        var noise = zData.noise;
	        var z = zData.z;
	        var nbLevels = options.nbContourLevels || 7;
	        var noiseMultiplier = options.noiseMultiplier === undefined ? 5 : options.noiseMultiplier;
	        var povarHeight0, povarHeight1, povarHeight2, povarHeight3;
	        var isOver0, isOver1, isOver2, isOver3;
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

	        var iter = nbLevels * 2;
	        var contourLevels = new Array(iter);
	        var lineZValue;
	        for (var level = 0; level < iter; level++) { // multiply by 2 for positif and negatif
	            var contourLevel = {};
	            contourLevels[level] = contourLevel;
	            var side = level % 2;
	            var factor = (maxZ - noiseMultiplier * noise) * Math.exp((level >> 1) - nbLevels);
	            if (side === 0) {
	                lineZValue = factor + noiseMultiplier * noise;
	            } else {
	                lineZValue = (0 - factor) - noiseMultiplier * noise;
	            }
	            var lines = [];
	            contourLevel.zValue = lineZValue;
	            contourLevel.lines = lines;

	            if (lineZValue <= minZ || lineZValue >= maxZ) continue;

	            for (var iSubSpectra = 0; iSubSpectra < nbSubSpectra - 1; iSubSpectra++) {
	                var subSpectra = z[iSubSpectra];
	                var subSpectraAfter = z[iSubSpectra + 1];
	                for (var povar = 0; povar < nbPovars - 1; povar++) {
	                    povarHeight0 = subSpectra[povar];
	                    povarHeight1 = subSpectra[povar + 1];
	                    povarHeight2 = subSpectraAfter[povar];
	                    povarHeight3 = subSpectraAfter[povar + 1];

	                    isOver0 = (povarHeight0 > lineZValue);
	                    isOver1 = (povarHeight1 > lineZValue);
	                    isOver2 = (povarHeight2 > lineZValue);
	                    isOver3 = (povarHeight3 > lineZValue);

	                    // Example povar0 is over the plane and povar1 and
	                    // povar2 are below, we find the varersections and add
	                    // the segment
	                    if (isOver0 !== isOver1 && isOver0 !== isOver2) {
	                        pAx = povar + (lineZValue - povarHeight0) / (povarHeight1 - povarHeight0);
	                        pAy = iSubSpectra;
	                        pBx = povar;
	                        pBy = iSubSpectra + (lineZValue - povarHeight0) / (povarHeight2 - povarHeight0);
	                        lines.push(pAx * dx + x0);
	                        lines.push(pAy * dy + y0);
	                        lines.push(pBx * dx + x0);
	                        lines.push(pBy * dy + y0);
	                    }
	                    // remove push does not help !!!!
	                    if (isOver3 !== isOver1 && isOver3 !== isOver2) {
	                        pAx = povar + 1;
	                        pAy = iSubSpectra + 1 - (lineZValue - povarHeight3) / (povarHeight1 - povarHeight3);
	                        pBx = povar + 1 - (lineZValue - povarHeight3) / (povarHeight2 - povarHeight3);
	                        pBy = iSubSpectra + 1;
	                        lines.push(pAx * dx + x0);
	                        lines.push(pAy * dy + y0);
	                        lines.push(pBx * dx + x0);
	                        lines.push(pBy * dy + y0);
	                    }
	                    // test around the diagonal
	                    if (isOver1 !== isOver2) {
	                        pAx = (povar + 1 - (lineZValue - povarHeight1) / (povarHeight2 - povarHeight1)) * dx + x0;
	                        pAy = (iSubSpectra + (lineZValue - povarHeight1) / (povarHeight2 - povarHeight1)) * dy + y0;
	                        if (isOver1 !== isOver0) {
	                            pBx = povar + 1 - (lineZValue - povarHeight1) / (povarHeight0 - povarHeight1);
	                            pBy = iSubSpectra;
	                            lines.push(pAx);
	                            lines.push(pAy);
	                            lines.push(pBx * dx + x0);
	                            lines.push(pBy * dy + y0);
	                        }
	                        if (isOver2 !== isOver0) {
	                            pBx = povar;
	                            pBy = iSubSpectra + 1 - (lineZValue - povarHeight2) / (povarHeight0 - povarHeight2);
	                            lines.push(pAx);
	                            lines.push(pAy);
	                            lines.push(pBx * dx + x0);
	                            lines.push(pBy * dy + y0);
	                        }
	                        if (isOver1 !== isOver3) {
	                            pBx = povar + 1;
	                            pBy = iSubSpectra + (lineZValue - povarHeight1) / (povarHeight3 - povarHeight1);
	                            lines.push(pAx);
	                            lines.push(pAy);
	                            lines.push(pBx * dx + x0);
	                            lines.push(pBy * dy + y0);
	                        }
	                        if (isOver2 !== isOver3) {
	                            pBx = povar + (lineZValue - povarHeight2) / (povarHeight3 - povarHeight2);
	                            pBy = iSubSpectra + 1;
	                            lines.push(pAx);
	                            lines.push(pAy);
	                            lines.push(pBx * dx + x0);
	                            lines.push(pBy * dy + y0);
	                        }
	                    }
	                }
	            }
	        }

	        return {
	            minX: zData.minX,
	            maxX: zData.maxX,
	            minY: zData.minY,
	            maxY: zData.maxY,
	            segments: contourLevels
	        };
	    }

	    function fastParseXYData(spectrum, value) {
	        // TODO need to deal with result
	        //  console.log(value);
	        // we check if deltaX is defined otherwise we calculate it

	        var yFactor = spectrum.yFactor;
	        var deltaX = spectrum.deltaX;


	        spectrum.isXYdata = true;
	        // TODO to be improved using 2 array {x:[], y:[]}
	        var currentData = [];
	        spectrum.data = [currentData];


	        var currentX = spectrum.firstX;
	        var currentY = spectrum.firstY;

	        // we skip the first line
	        //
	        var endLine = false;
	        for (var i = 0; i < value.length; i++) {
	            var ascii = value.charCodeAt(i);
	            if (ascii === 13 || ascii === 10) {
	                endLine = true;
	            } else {
	                if (endLine) break;
	            }
	        }

	        // we proceed taking the i after the first line
	        var newLine = true;
	        var isDifference = false;
	        var isLastDifference = false;
	        var lastDifference = 0;
	        var isDuplicate = false;
	        var inComment = false;
	        var currentValue = 0;
	        var isNegative = false;
	        var inValue = false;
	        var skipFirstValue = false;
	        var decimalPosition = 0;
	        var ascii;
	        for (; i <= value.length; i++) {
	            if (i === value.length) ascii = 13;
	            else ascii = value.charCodeAt(i);
	            if (inComment) {
	                // we should ignore the text if we are after $$
	                if (ascii === 13 || ascii === 10) {
	                    newLine = true;
	                    inComment = false;
	                }
	            } else {
	                // when is it a new value ?
	                // when it is not a digit, . or comma
	                // it is a number that is either new or we continue
	                if (ascii <= 57 && ascii >= 48) { // a number
	                    inValue = true;
	                    if (decimalPosition > 0) {
	                        currentValue += (ascii - 48) / Math.pow(10, decimalPosition++);
	                    } else {
	                        currentValue *= 10;
	                        currentValue += ascii - 48;
	                    }
	                } else if (ascii === 44 || ascii === 46) { // a "," or "."
	                    inValue = true;
	                    decimalPosition++;
	                } else {
	                    if (inValue) {
	                        // need to process the previous value
	                        if (newLine) {
	                            newLine = false; // we don't check the X value
	                            // console.log("NEW LINE",isDifference, lastDifference);
	                            // if new line and lastDifference, the first value is just a check !
	                            // that we don't check ...
	                            if (isLastDifference) skipFirstValue = true;
	                        } else {
	                            // need to deal with duplicate and differences
	                            if (skipFirstValue) {
	                                skipFirstValue = false;
	                            } else {
	                                if (isDifference) {
	                                    lastDifference = isNegative ? (0 - currentValue) : currentValue;
	                                    isLastDifference = true;
	                                    isDifference = false;
	                                }
	                                var duplicate = isDuplicate ? currentValue - 1 : 1;
	                                for (var j = 0; j < duplicate; j++) {
	                                    if (isLastDifference) {
	                                        currentY += lastDifference;
	                                    } else {
	                                        currentY = isNegative ? (0 - currentValue) : currentValue;
	                                    }
	                                    currentData.push(currentX);
	                                    currentData.push(currentY * yFactor);
	                                    currentX += deltaX;
	                                }
	                            }
	                        }
	                        isNegative = false;
	                        currentValue = 0;
	                        decimalPosition = 0;
	                        inValue = false;
	                        isDuplicate = false;
	                    }

	                    // positive SQZ digits @ A B C D E F G H I (ascii 64-73)
	                    if ((ascii < 74) && (ascii > 63)) {
	                        inValue = true;
	                        isLastDifference = false;
	                        currentValue = ascii - 64;
	                    } else
	                    // negative SQZ digits a b c d e f g h i (ascii 97-105)
	                    if ((ascii > 96) && (ascii < 106)) {
	                        inValue = true;
	                        isLastDifference = false;
	                        currentValue = ascii - 96;
	                        isNegative = true;
	                    } else
	                    // DUP digits S T U V W X Y Z s (ascii 83-90, 115)
	                    if (ascii === 115) {
	                        inValue = true;
	                        isDuplicate = true;
	                        currentValue = 9;
	                    } else if ((ascii > 82) && (ascii < 91)) {
	                        inValue = true;
	                        isDuplicate = true;
	                        currentValue = ascii - 82;
	                    } else
	                    // positive DIF digits % J K L M N O P Q R (ascii 37, 74-82)
	                    if ((ascii > 73) && (ascii < 83)) {
	                        inValue = true;
	                        isDifference = true;
	                        currentValue = ascii - 73;
	                    } else
	                    // negative DIF digits j k l m n o p q r (ascii 106-114)
	                    if ((ascii > 105) && (ascii < 115)) {
	                        inValue = true;
	                        isDifference = true;
	                        currentValue = ascii - 105;
	                        isNegative = true;
	                    } else
	                    // $ sign, we need to check the next one
	                    if (ascii === 36 && value.charCodeAt(i + 1) === 36) {
	                        inValue = true;
	                        inComment = true;
	                    } else
	                    // positive DIF digits % J K L M N O P Q R (ascii 37, 74-82)
	                    if (ascii === 37) {
	                        inValue = true;
	                        isDifference = true;
	                        currentValue = 0;
	                        isNegative = false;
	                    } else if (ascii === 45) { // a "-"
	                        // check if after there is a number, decimal or comma
	                        var ascii2 = value.charCodeAt(i + 1);
	                        if ((ascii2 >= 48 && ascii2 <= 57) || ascii2 === 44 || ascii2 === 46) {
	                            inValue = true;
	                            isLastDifference = false;
	                            isNegative = true;
	                        }
	                    } else if (ascii === 13 || ascii === 10) {
	                        newLine = true;
	                        inComment = false;
	                    }
	                    // and now analyse the details ... space or tabulation
	                    // if "+" we just don't care
	                }
	            }
	        }
	    }

	    function parsePeakTable(spectrum, value, result) {
	        var removeCommentRegExp = /\$\$.*/;
	        var peakTableSplitRegExp = /[,\t ]+/;

	        spectrum.isPeaktable = true;
	        var i, ii, j, jj, values;
	        var currentData = [];
	        spectrum.data = [currentData];

	        // counts for around 20% of the time
	        var lines = value.split(/,? *,?[;\r\n]+ */);

	        for (i = 1, ii = lines.length; i < ii; i++) {
	            values = lines[i].trim().replace(removeCommentRegExp, '').split(peakTableSplitRegExp);
	            if (values.length % 2 === 0) {
	                for (j = 0, jj = values.length; j < jj; j = j + 2) {
	                    // takes around 40% of the time to add and parse the 2 values nearly exclusively because of parseFloat
	                    currentData.push(parseFloat(values[j]) * spectrum.xFactor);
	                    currentData.push(parseFloat(values[j + 1]) * spectrum.yFactor);
	                }
	            } else {
	                result.logs.push('Format error: ' + values);
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
	        worker.postMessage(JSON.stringify({
	            stamp: stamp,
	            input: input,
	            options: options
	        }));
	    });
	}

	function createWorker() {
	    var workerURL = URL.createObjectURL(new Blob([
	        'var getConverter =' + getConverter.toString() + ';var convert = getConverter(); onmessage = function (event) { var data = JSON.parse(event.data); postMessage(JSON.stringify({stamp: data.stamp, output: convert(data.input, data.options)})); };'
	    ], {type: 'application/javascript'}));
	    worker = new Worker(workerURL);
	    URL.revokeObjectURL(workerURL);
	    worker.addEventListener('message', function (event) {
	        var data = JSON.parse(event.data);
	        var stamp = data.stamp;
	        if (stamps[stamp]) {
	            stamps[stamp](data.output);
	        }
	    });
	}

	module.exports = {
	    convert: JcampConverter
	};


/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';


	var xyDataSplitRegExp = /[,\t \+-]*(?=[^\d,\t \.])|[ \t]+(?=[\d+\.-])/;
	var removeCommentRegExp = /\$\$.*/;
	var DEBUG=false;

	module.exports=function(spectrum, value, result) {
	    // we check if deltaX is defined otherwise we calculate it
	    if (!spectrum.deltaX) {
	        spectrum.deltaX = (spectrum.lastX - spectrum.firstX) / (spectrum.nbPoints - 1);
	    }

	    spectrum.isXYdata=true;

	    var currentData = [];
	    var currentPosition=0;
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
	                    spectrum.firstPoint = +values[0];
	                }
	                var expectedCurrentX = (values[0] - spectrum.firstPoint) * spectrum.xFactor + spectrum.firstX;
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
	                            expectedY = +values[j];
	                        } else
	                        // positive SQZ digits @ A B C D E F G H I (ascii 64-73)
	                        if ((ascii > 63) && (ascii < 74)) {
	                            expectedY = +(String.fromCharCode(ascii - 16) + values[j].substring(1));
	                        } else
	                        // negative SQZ digits a b c d e f g h i (ascii 97-105)
	                        if ((ascii > 96) && (ascii < 106)) {
	                            expectedY = -(String.fromCharCode(ascii - 48) + values[j].substring(1));
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
	                            currentY = +values[j];
	                            // currentData.push(currentX, currentY * spectrum.yFactor);
	                            currentData[currentPosition++]=currentX;
	                            currentData[currentPosition++]=currentY * spectrum.yFactor;
	                            currentX += spectrum.deltaX;
	                        } else
	                        // positive SQZ digits @ A B C D E F G H I (ascii 64-73)
	                        if ((ascii > 63) && (ascii < 74)) {
	                            lastDif = null;
	                            currentY = +(String.fromCharCode(ascii - 16) + values[j].substring(1));
	                            // currentData.push(currentX, currentY * spectrum.yFactor);
	                            currentData[currentPosition++] = currentX;
	                            currentData[currentPosition++] = currentY * spectrum.yFactor;
	                            currentX += spectrum.deltaX;
	                        } else
	                        // negative SQZ digits a b c d e f g h i (ascii 97-105)
	                        if ((ascii > 96) && (ascii < 106)) {
	                            lastDif = null;
	                            // we can multiply the string by 1 because if may not contain decimal (is this correct ????)
	                            currentY = -(String.fromCharCode(ascii - 48) + values[j].substring(1))*1;
	                            //currentData.push(currentX, currentY * spectrum.yFactor);
	                            currentData[currentPosition++]=currentX;
	                            currentData[currentPosition++]=currentY * spectrum.yFactor;
	                            currentX += spectrum.deltaX;
	                        } else



	                        // DUP digits S T U V W X Y Z s (ascii 83-90, 115)
	                        if (((ascii > 82) && (ascii < 91)) || (ascii === 115)) {
	                            var dup = (String.fromCharCode(ascii - 34) + values[j].substring(1)) - 1;
	                            if (ascii === 115) {
	                                dup = ('9' + values[j].substring(1)) - 1;
	                            }
	                            for (var l = 0; l < dup; l++) {
	                                if (lastDif) {
	                                    currentY = currentY + lastDif;
	                                }
	                                // currentData.push(currentX, currentY * spectrum.yFactor);
	                                currentData[currentPosition++]=currentX;
	                                currentData[currentPosition++]=currentY * spectrum.yFactor;
	                                currentX += spectrum.deltaX;
	                            }
	                        } else
	                        // positive DIF digits % J K L M N O P Q R (ascii 37, 74-82)
	                        if (ascii === 37) {
	                            lastDif = +('0' + values[j].substring(1));
	                            currentY += lastDif;
	                            // currentData.push(currentX, currentY * spectrum.yFactor);
	                            currentData[currentPosition++]=currentX;
	                            currentData[currentPosition++]=currentY * spectrum.yFactor;
	                            currentX += spectrum.deltaX;
	                        } else if ((ascii > 73) && (ascii < 83)) {
	                            lastDif = (String.fromCharCode(ascii - 25) + values[j].substring(1))*1;
	                            currentY += lastDif;
	                            // currentData.push(currentX, currentY * spectrum.yFactor);
	                            currentData[currentPosition++]=currentX;
	                            currentData[currentPosition++]=currentY * spectrum.yFactor;
	                            currentX += spectrum.deltaX;
	                        } else
	                        // negative DIF digits j k l m n o p q r (ascii 106-114)
	                        if ((ascii > 105) && (ascii < 115)) {
	                            lastDif = -(String.fromCharCode(ascii - 57) + values[j].substring(1))*1;
	                            currentY += lastDif;
	                            // currentData.push(currentX, currentY * spectrum.yFactor);
	                            currentData[currentPosition++]=currentX;
	                            currentData[currentPosition++]=currentY * spectrum.yFactor;
	                            currentX += spectrum.deltaX;
	                        }
	                    }
	                }
	            }
	        }
	    }
	}


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * Created by acastillo on 3/2/16.
	 */
	/**
	 * This class converts a SpectraData object into a String that can be stored as a jcamp file.
	 * The string reflects the current state of the object and not the raw data from where this
	 * spectrum was initially loaded.
	 * @author acastillo
	 *
	 */

	var Encoder = __webpack_require__(13);

	var JcampCreator = (function(){

	    const Integer = {MAX_VALUE:2e31-1,MIN_VALUE:-2e31};
	    const CRLF = "\r\n";
	    const version = "Cheminfo tools, March 2016"

	    /**
	     * This function creates a String that represents the given spectraData, in the format JCAM-DX 5.0
	     * The X,Y data can be compressed using one of the methods described in:
	     * "JCAMP-DX. A STANDARD FORMAT FOR THE EXCHANGE OF ION MOBILITY SPECTROMETRY DATA",
	     *  http://www.iupac.org/publications/pac/pdf/2001/pdf/7311x1765.pdf
	     * @param spectraData
	     * @param encodeFormat: ('FIX','SQZ','DIF','DIFDUP','CVS','PAC')
	     * @return
	     */
	    var convert = function(spectraData, encodeFormat, factorY, type, userDefinedParams){
	        encodeFormat = encodeFormat.toUpperCase().trim();

	        if(type===null||type.length==0)
	            type="SIMPLE";

	        var outString = "";
	        spectraData.setActiveElement(0);

	        var scale=factorY/spectraData.getParamDouble("YFACTOR", 1);
	        if(spectraData.getMaxY()*scale>=Integer.MAX_VALUE/2){
	            scale=Integer.MAX_VALUE/(spectraData.getMaxY()*2);
	        }
	        if(Math.abs(spectraData.getMaxY()-spectraData.getMinY())*scale<16)
	            scale=16/(Math.abs(spectraData.getMaxY()-spectraData.getMinY()));

	        var scaleX=Math.abs(1.0/spectraData.getDeltaX());

	        outString+=("##TITLE= " + spectraData.getTitle() + CRLF);
	        outString+=("##JCAMP-DX= 5.00\t$$"+version+ CRLF);
	        outString+=("##OWNER= " + spectraData.getParamString("##OWNER=", "")+ CRLF);
	        outString+=("##DATA TYPE= " +spectraData.getDataType()+ CRLF);

	        if(type=="NTUPLES") {
	            outString+=ntuplesHead(spectraData, scale, scaleX, encodeFormat, userDefinedParams);
	        }

	        if(type=="SIMPLE"){
	            outString+=simpleHead(spectraData, scale, scaleX, encodeFormat, userDefinedParams);
	        }
	        return outString;
	    }

	    var ntuplesHead = function(spectraData, scale, scaleX, encodeFormat, userDefinedParams){
	        var outString="";
	        var variableX = spectraData.getSpectraVariable(0);
	        var variableY = spectraData.getSpectraVariable(1);
	        var variableZ = spectraData.getSpectraVariable(2);

	        outString+="##DATA CLASS= NTUPLES" + CRLF;
	        outString+="##NUM DIM= 2" + CRLF;
	        var nTuplesName=spectraData.getDataType().trim();
	        // we set the VarName parameter to the most common ones.
	        // These tables contain the number of occurences of each one
	        var abscVar = {};
	        var sub;
	        for ( sub = 0; sub < spectraData.getNbSubSpectra(); sub++) {
	            spectraData.setActiveElement(sub);
	            if (abscVar[spectraData.getXUnits()]) {
	                abscVar[spectraData.getXUnits()].value++;
	            } else {
	                abscVar[spectraData.getXUnits()]={value:1, index:sub};
	            }
	        }

	        var keys = Object.keys(abscVar);
	        var mostCommon =keys[0], defaultSub = 0;

	        for(sub=1;sub<keys.length;sub++){
	            if(abscVar[keys[sub]].value>abscVar[mostCommon].value){
	                mostCommon = keys[sub];
	                defaultSub=abscVar[keys[sub]].index;
	            }
	        }
	        var isComplex=false;
	        spectraData.setActiveElement(defaultSub);
	        var isNMR = spectraData.getDataType().indexOf("NMR")>=0;
	        //If it is a NMR spectrum
	        if(isNMR){
	            outString+=("##.OBSERVE FREQUENCY= " + spectraData.getParamDouble("observefrequency", 0) + CRLF);
	            outString+=("##.OBSERVE NUCLEUS= ^" + spectraData.getNucleus()+ CRLF);
	            outString+=("##$DECIM= " + (spectraData.getParamDouble("$DECIM",0))+ CRLF);
	            outString+=("##$DSPFVS= " + (spectraData.getParamDouble("$DSPFVS",0))+ CRLF);
	            outString+=("##$FCOR= " + (Math.floor(spectraData.getParamDouble("$FCOR",0)))+ CRLF);
	            if(spectraData.containsParam("$SW_h"))
	                outString+=("##$SW_h= " + (spectraData.getParamDouble("$SW_h",0))+ CRLF);
	            else
	            if(spectraData.containsParam("$SW_p"))
	                outString+=("##$SW_p= " + (spectraData.getParamDouble("$SW_p",0))+ CRLF);
	            outString+=("##$SW= " + (spectraData.getParamDouble("$SW",0))+ CRLF);
	            outString+=("##$TD= " + (Math.floor(spectraData.getParamDouble("$TD",0)))+ CRLF);
	            outString+=("##$BF1= " + (spectraData.getParamDouble("$BF1",0))+ CRLF);
	            outString+=("##$GRPDLY= " + (spectraData.getParamDouble("$GRPDLY",0))+ CRLF);
	            outString+=("##.DIGITISER RES= " + (spectraData.getParamInt(".DIGITISER RES",0))+ CRLF);
	            outString+=("##.PULSE SEQUENCE= " + (spectraData.getParamString(".PULSE SEQUENCE", ""))+ CRLF);
	            outString+=("##.SOLVENT NAME= " + (spectraData.getSolventName())+ CRLF);
	            outString+=("##$NUC1= <" +spectraData.getNucleus()+">"+ CRLF);
	            if(spectraData.containsParam("2D_X_FREQUENCY"))
	                outString+=("##$SFO1= " + (spectraData.getParamDouble("2D_X_FREQUENCY",0))+ CRLF);
	            else
	                outString+=("##$SFO1= " + (spectraData.getParamDouble("$SFO1",0))+ CRLF);

	            if(spectraData.containsParam("2D_X_OFFSET"))
	                outString+=("##$OFFSET= " +spectraData.getParamDouble("2D_X_OFFSET", 0)+ CRLF);

	            if(spectraData.is2D()){
	                outString+=("$$Parameters for 2D NMR Spectrum"+ CRLF);
	                outString+=("##$NUC1= <" +spectraData.getNucleus(2)+">"+ CRLF);
	                if(spectraData.containsParam("2D_Y_FREQUENCY")){
	                    outString+=("##$SFO1= " + spectraData.getParamDouble("2D_Y_FREQUENCY", 0)+ CRLF);
	                    outString+=("##$SFO2= " + spectraData.getParamDouble("2D_Y_FREQUENCY", 0)+ CRLF);
	                    outString+=("##$BF2= " +spectraData.getParamDouble("2D_Y_FREQUENCY", 0)+ CRLF);
	                }
	                if(spectraData.containsParam("2D_Y_OFFSET"))
	                    outString+=("##$OFFSET= " +spectraData.getParamDouble("2D_Y_OFFSET", 0)+ CRLF);

	                outString+=("$$End of Parameters for 2D NMR Spectrum"+ CRLF);
	            }
	        }
	        outString+=("##NTUPLES=\t" + nTuplesName + CRLF);
	        var freq1 = 1,freq2=1;//spectraData.getParamDouble("2D_Y_FREQUENCY", 0);
	        if(!spectraData.is2D()&&spectraData.getNbSubSpectra()>1&& isNMR)
	            isComplex=true;
	        if(isComplex){
	            outString+=("##VAR_NAME=\t" + spectraData.getXUnits() + ",\t"+ nTuplesName.substring(4) +"/REAL,\t"+ nTuplesName.substring(4) +"/IMAG"+CRLF);
	            outString+=("##SYMBOL=\tX,\tR,\tI" + CRLF);
	            outString+=("##VAR_TYPE=\tINDEPENDENT,\tDEPENDENT,\tDEPENDENT" + CRLF);
	            if(encodeFormat!="CSV"||encodeFormat!="PAC")
	                outString+=("##VAR_FORM=\tAFFN,\tASDF,\tASDF" + CRLF);
	            else
	                outString+=("##VAR_FORM=\tAFFN,\tAFFN,\tAFFN" + CRLF);
	            outString+=("##VAR_DIM=\t" + spectraData.getNbPoints() + ",\t" + spectraData.getNbPoints()+",\t" + spectraData.getNbPoints()+CRLF);
	            outString+=("##UNITS=\tHZ"+ ",\t"+ spectraData.getYUnits() +",\t"+ variableZ.units + CRLF);
	            outString+=("##FACTOR=\t" + 1.0/scaleX + ",\t"+1.0/scale+",\t"+1.0/scale+ CRLF);

	            if(spectraData.getXUnits()=="PPM")
	                freq1 = spectraData.observeFrequencyX();

	            outString+=("##FIRST=\t" + spectraData.getFirstX()*freq1 + ",\t"+spectraData.getY(0)+",\t0" + CRLF);
	            outString+=("##LAST=\t" + spectraData.getLastX()*freq1 + ",\t"+spectraData.getLastY()+",\t0" + CRLF);
	        }
	        else{
	            freq1 = 1;
	            if(spectraData.is2D()) {
	                outString += ("##VAR_NAME=\tFREQUENCY1,\tFREQUENCY2,\tSPECTRUM" + CRLF);
	                outString += ("##SYMBOL=\tF1,\tF2,\tY" + CRLF);
	                outString += ("##.NUCLEUS=\t" + spectraData.getNucleus(2) + ",\t" + spectraData.getNucleus(1) + CRLF);
	                outString += ("##VAR_TYPE=\tINDEPENDENT,\tINDEPENDENT,\tDEPENDENT" + CRLF);
	                if (encodeFormat != "CSV" || encodeFormat != "PAC")
	                    outString += ("##VAR_FORM=\tAFFN,\tAFFN,\tASDF" + CRLF);
	                else
	                    outString+=("##VAR_FORM=\tAFFN,\tAFFN,\tASDF" + CRLF);
	                outString+=("##VAR_DIM=\t" + spectraData.getNbSubSpectra() + ",\t" + spectraData.getNbPoints()+ ",\t" + spectraData.getNbPoints() + CRLF);
	                //We had to change this, for Mestre compatibility
	                //outString+=("##UNITS=\tHZ,\t"+ spectraData.getXUnits() + ",\t" + spectraData.getYUnits()+CRLF);
	                outString+=("##UNITS=\tHZ,\tHZ,\t" + spectraData.getYUnits()+CRLF);
	                if(spectraData.getXUnits()=="PPM")
	                    freq1 = spectraData.getParamDouble("2D_Y_FREQUENCY", 1);
	                if(spectraData.getYUnits()=="PPM"){
	                    freq2 = spectraData.getParamDouble("2D_X_FREQUENCY", 1);
	                }
	                outString+=("##FACTOR=\t1,\t"+freq2/scaleX + ",\t"+1.0/scale+ CRLF);
	                outString+=("##FIRST=\t"+spectraData.getParamDouble("firstY", 0)*freq1+",\t"+ spectraData.getFirstX()*freq2 + ",\t"+spectraData.getY(0) + CRLF);
	                outString+=("##LAST=\t" +spectraData.getParamDouble("lastY", 0)*freq1+",\t"+ spectraData.getLastX() *freq2
	                + ",\t"+ spectraData.getY(spectraData.getNbPoints()-1)+ CRLF);
	            }else{
	                outString+=("##VAR_NAME=\t" + variableX.varname + ",\t"+ variableY.varname + ",\t"+ variableX.varname + CRLF);
	                outString+=("##SYMBOL=\t" + variableX.symbol + ",\t"+ variableY.symbol + ",\t"+ variableZ.symbol + CRLF);
	                outString+=("##VAR_TYPE=\t" + variableX.vartype + ",\t"+ variableY.vartype + ",\t"+ variableZ.vartype + CRLF);
	                if(encodeFormat!="CSV"||encodeFormat!="PAC")
	                    outString+=("##VAR_FORM=\tAFFN,\tASDF,\tASDF" + CRLF);
	                else
	                    outString+=("##VAR_FORM=\tAFFN,\tAFFN,\tAFFN" + CRLF);
	                outString+=("##VAR_DIM=\t" + variableX.vardim + ",\t"+ variableY.vardim + ",\t"+ variableZ.vardim + CRLF);
	                outString+=("##UNITS=\tHZ" + ",\t"+ spectraData.getYUnits() + ",\t"+ variableZ.units + CRLF);
	                if(spectraData.getXUnits()=="PPM")
	                    freq1 = spectraData.observeFrequencyX();
	                outString+=("##FACTOR=\t" + 1.0/scaleX + ",\t"+1.0/scale + CRLF);
	                outString+=("##FIRST=\t" + variableX.first*freq1 + ",\t"+ variableY.first + ",\t"+ variableZ.first + CRLF);
	                outString+=("##LAST=\t" + variableX.last*freq1 + ",\t"+ variableY.last + ",\t"+ variableZ.last + CRLF);

	            }
	        }

	        //Set the user defined parameters
	        if(userDefinedParams!=null){
	            for(var i=userDefinedParams.length-1;i>=0;i--){
	                if(spectraData.containsParam(userDefinedParams[i])){
	                    outString+=("##"+userDefinedParams[i]+"= "
	                    + spectraData.getParam(userDefinedParams[i], "")+ CRLF);
	                }
	            }
	        }
	        //Ordinate of the second dimension in case of 2D NMR spectra
	        var yUnits = 0, lastY = 0, dy = 0;

	        if(spectraData.is2D()&& isNMR){
	            yUnits = spectraData.getParamDouble("firstY", 0)*freq1;
	            lastY = spectraData.getParamDouble("lastY", 0)*freq1;
	            dy = (lastY-yUnits)/(spectraData.getNbSubSpectra()-1);
	        }

	        for ( sub = 0; sub < spectraData.getNbSubSpectra(); sub++) {
	            spectraData.setActiveElement(sub);
	            outString+=("##PAGE= " + spectraData.page + CRLF);
	            yUnits+=dy;

	            if(spectraData.is2D()&&isNMR)
	                outString+=("##FIRST=\t"+spectraData.getParamDouble("firstY", 0)*freq1+",\t"
	                + spectraData.getFirstX()*freq2 + ",\t"+spectraData.getY(0) + CRLF);


	            outString+=("##DATA TABLE= ");
	            if (spectraData.isDataClassPeak()) {
	                outString+=("(XY..XY), PEAKS" + CRLF);
	                for (var point = 0; point < spectraData.getNbPoints(); point++)
	                    outString+=(spectraData.getX(point) + ", " + spectraData.getY(point)+ CRLF);

	            } else if (spectraData.isDataClassXY()) {
	                if(isNMR){
	                    if(spectraData.is2D()){
	                        outString+=("(F2++(Y..Y)), PROFILE" + CRLF);
	                    }
	                    else{
	                        if(sub%2==0)
	                            outString+=("(X++(R..R)), XYDATA" + CRLF);
	                        else
	                            outString+=("(X++(I..I)), XYDATA" + CRLF);
	                    }
	                }
	                else
	                    outString+=("(X++(Y..Y)), XYDATA" + CRLF);

	                var tempString = "";
	                var data = new Array(spectraData.getNbPoints());
	                for (var point = data.length-1; point >=0; point--) {
	                    data[point]=Math.round((spectraData.getY(point)*scale));
	                }

	                tempString+=Encoder.encode(data,
	                    spectraData.getFirstX()*scaleX,spectraData.getDeltaX()*scaleX,encodeFormat);

	                outString+=(tempString+CRLF);
	            }
	        }
	        outString+=("##END NTUPLES= " + nTuplesName + CRLF);
	        outString+=("##END= ");

	        spectraData.setActiveElement(0);

	        return outString;
	    }

	    var simpleHead = function(spectraData, scale, scaleX, encodeFormat, userDefinedParams){
	        var variableX = spectraData.getSpectraVariable(0);
	        var variableY = spectraData.getSpectraVariable(1);
	        var outString="";
	        if(spectraData.isDataClassPeak())
	            outString+=("##DATA CLASS= PEAK TABLE"+ CRLF);
	        if(spectraData.isDataClassXY())
	            outString+=("##DATA CLASS= XYDATA"+ CRLF);

	        spectraData.setActiveElement(0);
	        //If it is a NMR spectrum
	        if(spectraData.getDataType().indexOf("NMR")>=0){
	            outString+=("##.OBSERVE FREQUENCY= " + spectraData.getParamDouble("observefrequency", 0) + CRLF);
	            outString+=("##.OBSERVE NUCLEUS= ^" + spectraData.getNucleus()+ CRLF);
	            outString+=("##$DECIM= " + (Math.round(spectraData.getParamDouble("$DECIM",0)))+ CRLF);
	            outString+=("##$DSPFVS= " + (Math.round(spectraData.getParamDouble("$DSPFVS",0)))+ CRLF);
	            outString+=("##$FCOR= " + (Math.round(spectraData.getParamDouble("$FCOR",0)))+ CRLF);
	            outString+=("##$SW_h= " + (spectraData.getParamDouble("$SW_h",0))+ CRLF);
	            outString+=("##$SW= " + (spectraData.getParamDouble("$SW",0))+ CRLF);
	            outString+=("##$TD= " + (Math.round(spectraData.getParamDouble("$TD",0)))+ CRLF);
	            outString+=("##$GRPDLY= " + (spectraData.getParamDouble("$GRPDLY",0))+ CRLF);
	            outString+=("##$BF1= " + (spectraData.getParamDouble("$BF1",0))+ CRLF);
	            outString+=("##$SFO1= " + (spectraData.getParamDouble("$SFO1",0))+ CRLF);
	            outString+=("##$NUC1= <" +spectraData.getNucleus()+">"+ CRLF);
	            outString+=("##.SOLVENT NAME= " + (spectraData.getSolventName())+ CRLF);

	        }
	        outString+=("##XUNITS=\t" + spectraData.getXUnits() + CRLF);
	        outString+=("##YUNITS=\t" + spectraData.getYUnits() + CRLF);
	        outString+=("##NPOINTS=\t" + spectraData.getNbPoints() + CRLF);
	        outString+=("##FIRSTX=\t" + spectraData.getFirstX() + CRLF);
	        outString+=("##LASTX=\t" + spectraData.getLastX() + CRLF);
	        outString+=("##FIRSTY=\t" + spectraData.getFirstY() + CRLF);
	        outString+=("##LASTY=\t" + spectraData.getLastY() + CRLF);
	        if (spectraData.isDataClassPeak()) {
	            outString+=("##XFACTOR=1"+ CRLF);
	            outString+=("##YFACTOR=1"+ CRLF);
	        } else if (spectraData.isDataClassXY()) {
	            outString+=("##XFACTOR= "+ 1.0/scaleX+ CRLF);
	            outString+=("##YFACTOR= "+1.0/scale + CRLF);
	        }
	        outString+=("##MAXY= "+ spectraData.getMaxY()+ CRLF);
	        outString+=("##MINY= "+ spectraData.getMinY()+ CRLF);

	        //Set the user defined parameters
	        if(userDefinedParams!=null){
	            for(var i=userDefinedParams.length-1;i>=0;i--){
	                if(spectraData.containsParam(userDefinedParams[i])){
	                    outString+=("##"+userDefinedParams[i]+"= "
	                    + spectraData.getParam(userDefinedParams[i], "")+ CRLF);
	                }
	            }
	        }


	        if (spectraData.isDataClassPeak()) {
	            outString+=("##PEAK TABLE= (XY..XY)" + CRLF);
	            for (var point = 0; point < spectraData.getNbPoints(); point++)
	                outString+=(spectraData.getX(point) + ", " + spectraData.getY(point)+ CRLF);
	            outString+=("##END ");

	        } else if (spectraData.isDataClassXY()) {
	            outString+=("##DELTAX= "+spectraData.getDeltaX()+CRLF);
	            outString+=("##XYDATA=(X++(Y..Y))" + CRLF);
	            var tempString = "";
	            var data = new Array(spectraData.getNbPoints());
	            for (var point = data.length-1; point >=0; point--) {
	                data[point]=Math.round(spectraData.getY(point)*scale);
	            }

	            tempString+=Encoder.encode(data, spectraData.getFirstX()*scaleX,spectraData.getDeltaX()*scaleX, encodeFormat);

	            outString+=(tempString+CRLF);
	            outString+=("##END= ");
	        }

	        spectraData.setActiveElement(0);
	        return outString;
	    }

	    return {"convert":convert};
	})();

	module.exports = JcampCreator;



/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';
	/**
	* class encodes a integer vector as a String in order to store it in a text file.
	* The algorithms used to encode the data are describe in:
	*            http://www.iupac.org/publications/pac/pdf/2001/pdf/7311x1765.pdf
	* Created by acastillo on 3/2/16.
	*/
	var newLine="\r\n";

	var pseudoDigits=[['0','1','2','3','4','5','6','7','8','9'],
	              ['@','A','B','C','D','E','F','G','H','I'],
	              ['@','a','b','c','d','e','f','g','h','i'],
	              ['%','J','K','L','M','N','O','P','Q','R'],
	              ['%','j','k','l','m','n','o','p','q','r'],
	              [' ','S','T','U','V','W','X','Y','Z','s']];

	var SQZ_P= 1, SQZ_N= 2, DIF_P=3, DIF_N=4, DUP=5, MaxLinelength=100;

	/**
	 * This function encodes the given vector. The encoding format is specified by the
	 * encoding option
	 * @param data
	 * @param firstX
	 * @param intervalX
	 * @param encoding: ('FIX','SQZ','DIF','DIFDUP','CVS','PAC') Default 'DIFDUP'
	 * @returns {String}
	 */
	var encode = function(data, firstX, intervalX, encoding){
	    if(encoding==("FIX"))
	        return FIXencod(data, firstX,intervalX);
	    if(encoding==("SQZ"))
	        return SQZencod(data, firstX,intervalX);
	    if(encoding==("DIF"))
	        return DIFencod(data, firstX,intervalX);
	    if(encoding==("DIFDUP"))
	        return DIFDUPencod(data, firstX,intervalX);
	    if(encoding==("CSV"))
	        return CSVencod(data, firstX,intervalX);
	    if(encoding==("PAC"))
	        return PACencod(data, firstX,intervalX);
	    //Default
	    return DIFencod(data, firstX,intervalX);
	}

	/**
	 * No data compression used. The data is separated by a comma(',').
	 * @param data
	 * @return
	 */
	var CSVencod =  function(data, firstX, intervalX){
	    return FIXencod(data, firstX, intervalX, ",");
	};

	/**
	 * No data compression used. The data is separated by the specified separator.
	 * @param data
	 * @param separator, The separator character
	 * @return
	 */
	var FIXencod =  function(data, firstX, intervalX, separator){
	    if(!separator)
	        separator = " ";
	    var outputData = "";
	    var j=0, TD = data.length, i;
	    while(j<TD-7){
	        outputData+=Math.ceil(firstX+j*intervalX);
	        for(i = 0;i<8;i++)
	            outputData+=separator+data[j++];
	        outputData+=newLine;
	    }
	    if(j<TD){
	        //We add last numbers
	        outputData+=Math.ceil(firstX+j*intervalX);
	        for(i=j;i<TD;i++)
	            outputData+=separator + data[i];
	    }
	    return outputData;
	};
	/**
	 * No data compression used. The data is separated by the sign of the number.
	 * @param data
	 * @return
	 */
	var PACencod = function(data, firstX, intervalX){
	    var outputData = "";
	    var j=0, TD = data.length, i;

	    while(j<TD-7){
	        outputData+=Math.ceil(firstX+j*intervalX);
	        for(i = 0;i<8;i++){
	            if(data[j]<0)
	                outputData+="-"+data[j++];
	            else
	                outputData+="+"+data[j++];
	        }
	        outputData+=newLine;
	    }
	    if(j<TD){
	        //We add last numbers
	        outputData+=Math.ceil(firstX+j*intervalX);
	        for(i=j;i<TD;i++){
	            if(data[i]<0)
	                outputData+="-"+data[i];
	            else
	                outputData+="+"+data[i];
	        }
	    }
	    return outputData;
	};
	/**
	 * Data compression is possible using the squeezed form (SQZ) in which the delimiter, the leading digit,
	 * and sign are replaced by a pseudo-digit from Table 1. For example, the Y-values 30, 32 would be
	 * represented as C0C2.
	 * @param data
	 * @return String
	 */
	var SQZencod = function(data, firstX, intervalX){
	    var outputData = "";
	    //String outputData = new String();
	    var j=0, TD = data.length, i;

	    while(j<TD-10){
	        outputData+=Math.ceil(firstX+j*intervalX);
	        for(i = 0;i<10;i++)
	            outputData+=SQZDigit(data[j++].toString());
	        outputData+=newLine;
	    }
	    if(j<TD){
	        //We add last numbers
	        outputData+=Math.ceil(firstX+j*intervalX);
	        for(i = j;i<TD;i++)
	            outputData+=SQZDigit(data[i].toString());
	    }

	    return outputData;
	};

	/**
	 * Duplicate suppression encoding
	 * @param data
	 * @return
	 */
	var DIFDUPencod = function(data, firstX, intervalX){
	    var mult=0, index=0, charCount= 0, i;
	    //We built a string where we store the encoded data.
	    var encodData = "",encodNumber = "",temp = "";

	    //We calculate the differences vector
	    var diffData = new Array(data.length-1);
	    for(i=0;i<diffData.length;i++){
	        diffData[i]= data[i+1]-data[i];
	    }

	    //We simulate a line carry
	    var numDiff = diffData.length;
	    while(index<numDiff){
	        if(charCount==0){//Start line
	            encodNumber = Math.ceil(firstX+index*intervalX)+SQZDigit(data[index].toString())+DIFDigit(diffData[index].toString());
	            encodData+=encodNumber;
	            charCount+=encodNumber.length;
	        }
	        else{
	            //Try to insert next difference
	            if(diffData[index-1]==diffData[index]){
	                mult++;
	            }
	            else{
	                if(mult>0){//Now we know that it can be in line
	                    mult++;
	                    encodNumber=DUPDigit(mult.toString());
	                    encodData+=encodNumber;
	                    charCount+=encodNumber.length;
	                    mult=0;
	                    index--;
	                }
	                else{
	                    //Mirar si cabe, en caso contrario iniciar una nueva linea
	                    encodNumber=DIFDigit(diffData[index].toString());
	                    if(encodNumber.length+charCount<MaxLinelength){
	                        encodData+=encodNumber;
	                        charCount+=encodNumber.length;
	                    }
	                    else{//Iniciar nueva linea
	                        encodData+=newLine;
	                        temp=Math.ceil(firstX+index*intervalX)+SQZDigit(data[index].toString())+encodNumber;
	                        encodData+=temp;//Each line start with first index number.
	                        charCount=temp.length;
	                    }
	                }
	            }
	        }
	        index++;
	    }
	    if(mult>0)
	        encodData+=DUPDigit((mult+1).toString());
	    //We insert the last data from fid. It is done to control of data
	    //The last line start with the number of datas in the fid.
	    encodData+=newLine+Math.ceil(firstX+index*intervalX)+SQZDigit(data[index].toString());

	    return encodData;
	};

	/**
	 * Differential encoding
	 * @param data
	 * @return
	 */
	var DIFencod = function(data, firstX, intervalX){
	    var index=0, charCount= 0,i;

	    var encodData = "";
	    //String encodData = new String();
	    var encodNumber = "", temp = "";

	    //We calculate the differences vector
	    var diffData = new Array(data.length-1);
	    for(i=0;i<diffData.length;i++){
	        diffData[i]= data[i+1]-data[i];
	    }

	    index=0;
	    var numDiff = diffData.length;
	    while(index<numDiff){
	        if(charCount==0){//Iniciar linea
	            //We convert the first number.
	            encodNumber = Math.ceil(firstX+index*intervalX)+SQZDigit(data[index].toString())+DIFDigit(diffData[index].toString());
	            encodData+=encodNumber;
	            charCount+=encodNumber.length;
	        }
	        else{
	            //Mirar si cabe, en caso contrario iniciar una nueva linea
	            encodNumber=DIFDigit(diffData[index].toString());
	            if(encodNumber.length+charCount<MaxLinelength){
	                encodData+=encodNumber;
	                charCount+=encodNumber.length;
	            }
	            else{//Iniciar nueva linea
	                encodData+=newLine;
	                temp=Math.ceil(firstX+index*intervalX)+SQZDigit(data[index].toString())+encodNumber;
	                encodData+=temp;//Each line start with first index number.
	                charCount=temp.length;
	            }
	        }
	        index++;
	    }
	    //We insert the last number from data. It is done to control of data
	    encodData+=newLine+Math.ceil(firstX+index*intervalX)+SQZDigit(data[index].toString());

	    return encodData;
	};

	/**
	 * Convert number to the ZQZ format, using pseudo digits.
	 * @param num
	 * @return
	 */
	var SQZDigit = function(num){
	    //console.log(num+" "+num.length);
	    var SQZdigit = "";
	    if(num.charAt(0)=='-'){
	        SQZdigit+=pseudoDigits[SQZ_N][Number(num.charAt(1))];
	        if(num.length>2)
	            SQZdigit+=num.substring(2);
	    }
	    else{
	        SQZdigit+=pseudoDigits[SQZ_P][Number(num.charAt(0))];
	        if(num.length>1)
	            SQZdigit+=num.substring(1);
	    }

	    return SQZdigit;
	};
	/**
	 * Convert number to the DIF format, using pseudo digits.
	 * @param num
	 * @return
	 */
	var DIFDigit = function(num){
	    var DIFFdigit = "";

	    if(num.charAt(0)=='-'){
	        DIFFdigit+=pseudoDigits[DIF_N][Number(num.charAt(1))];
	        if(num.length>2)
	            DIFFdigit+=num.substring(2);

	    }
	    else{
	        DIFFdigit+=pseudoDigits[DIF_P][Number(num.charAt(0))];
	        if(num.length>1)
	            DIFFdigit+=num.substring(1);

	    }

	    return DIFFdigit;
	};
	/**
	 * Convert number to the DUP format, using pseudo digits.
	 * @param num
	 * @return
	 */
	function DUPDigit(num){
	    var DUPdigit = "";
	    DUPdigit+=pseudoDigits[DUP][Number(num.charAt(0))];
	    if(num.length>1)
	        DUPdigit+=num.substring(1);

	    return DUPdigit;
	}

	module.exports = {
	    encode,
	    FIXencod,
	    CSVencod,
	    PACencod,
	    SQZencod,
	    DIFDUPencod,
	    DIFencod
	};

	'mode strict';






/***/ },
/* 14 */
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
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var SD = __webpack_require__(1);
	var peakPicking = __webpack_require__(16);
	var JcampConverter=__webpack_require__(10);
	var fft = __webpack_require__(48);
	var Filters = __webpack_require__(51);

	/**
	 * Construct the object from the given sd object(output of the jcampconverter or brukerconverter filter)
	 * @param sd
	 * @constructor
	 */
	function NMR(sd) {
	    SD.call(this, sd); // Héritage
	}

	NMR.prototype = Object.create(SD.prototype);
	NMR.prototype.constructor = NMR;

	/**
	 * @function fromJcamp(jcamp,options)
	 * Construct the object from the given jcamp.
	 * @param jcamp
	 * @param options
	 * @option xy
	 * @option keepSpectra
	 * @option keepRecordsRegExp
	 * @returns {NMR}
	 */
	NMR.fromJcamp = function(jcamp,options) {
	    options = Object.assign({}, {xy:true,keepSpectra:true,keepRecordsRegExp:/^.+$/}, options);
	    var spectrum= JcampConverter.convert(jcamp,options);
	    return new NMR(spectrum);
	}

	/**
	 * @function getNucleus(dim)
	 * Returns the observed nucleus. A dimension parameter is accepted for compatibility with 2DNMR
	 * @param dim
	 * @returns {*}
	 */
	NMR.prototype.getNucleus=function(dim){
	    if(!dim||dim==0||dim==1)
	        return this.sd.xType;
	    else{
	        return "";
	    }
	}

	/**
	 * @function getSolventName()
	 * Returns the solvent name.
	 * @returns {string|XML}
	 */
	NMR.prototype.getSolventName=function(){
	    return (this.sd.info[".SOLVENTNAME"]||this.sd.info["$SOLVENT"]||"").replace("<","").replace(">","");
	}

	/**
	 * @function observeFrequencyX()
	 * Returns the observe frequency in the direct dimension
	 * @returns {number}
	 */
	NMR.prototype.observeFrequencyX=function(){
	    return this.sd.spectra[0].observeFrequency;
	}

	/**
	 * @function getNMRPeakThreshold(nucleus)
	 * Returns the noise factor depending on the nucleus.
	 * @param nucleus
	 * @returns {number}
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
	 * @returns this object
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
	 * @returns this object
	 * @example spec1 = addSpectraDatas(spec1,spec2,1,-1, false) This subtract spec2 from spec1
	*/
	NMR.prototype.addSpectraDatas=function(spec2,factor1,factor2,autoscale ) {
	    //@TODO Implement addSpectraDatas filter

	}

	/**
	 * @function autoBaseline()
	 * Automatically corrects the base line of a given spectraData. After this process the spectraData
	 * should have meaningful integrals.
	 * @returns this object
	 */
	NMR.prototype.autoBaseline=function( ) {
	    //@TODO Implement autoBaseline filter
	}

	/**
	 * @function fourierTransform()
	 * Fourier transforms the given spectraData (Note. no 2D handling yet) this spectraData have to be of type NMR_FID or 2DNMR_FID
	 * @returns this object
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
	 * @returns this object
	 */
	NMR.prototype.postFourierTransform=function(ph1corr) {
	    return Filters.phaseCorrection(0,ph1corr);
	}

	/**
	 * @function zeroFilling(nPointsX [,nPointsY])
	 * This function increase the size of the spectrum, filling the new positions with zero values. Doing it one 
	 * could increase artificially the spectral resolution.
	 * @param nPointsX Number of new zero points in the direct dimension
	 * @param nPointsY Number of new zero points in the indirect dimension
	 * @returns this object
	 */
	NMR.prototype.zeroFilling=function(nPointsX, nPointsY) {
	    return Filters.zeroFilling(this,nPointsX, nPointsY);
	}

	/**
	 * @function  haarWhittakerBaselineCorrection(waveletScale,whittakerLambda)
	 * Applies a baseline correction as described in J Magn Resonance 183 (2006) 145-151 10.1016/j.jmr.2006.07.013
	 * The needed parameters are the wavelet scale and the lambda used in the whittaker smoother.
	 * @param waveletScale To be described
	 * @param whittakerLambda To be described
	 * @returns this object
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
	 * @returns this object
	 */
	NMR.prototype.whittakerBaselineCorrection=function(whittakerLambda,ranges) {
	    //@TODO Implement whittakerBaselineCorrection filter
	}

	/**
	 * @function brukerFilter()
	 * This filter applies a circular shift(phase 1 correction in the time domain) to an NMR FID spectrum that 
	 * have been obtained on spectrometers using the Bruker digital filters. The amount of shift depends on the 
	 * parameters DECIM and DSPFVS. This spectraData have to be of type NMR_FID
	 * @returns this object
	 */
	NMR.prototype.brukerFilter=function() {
	    return Filters.digitalFilter(this, {"brukerFilter":true});
	}

	/**
	 * @function digitalFilter(options)
	 * This filter applies a circular shift(phase 1 correction in the time domain) to an NMR FID spectrum that
	 * have been obtained on spectrometers using the Bruker digital filters. The amount of shift depends on the
	 * parameters DECIM and DSPFVS. This spectraData have to be of type NMR_FID
	 * @option nbPoints: The number of points to shift. Positive values will shift the values to the rigth
	 * and negative values will do to the left.
	 * @option brukerSpectra
	 * @returns this object
	 */
	NMR.prototype.digitalFilter=function(options) {
	    return Filters.digitalFilter(this, options);
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
	 * @returns this object
	 * @example SD.apodization("exp", lineBroadening)
	 */
	NMR.prototype.apodization=function(functionName, lineBroadening) {
	    return Filters.apodization(this,{"functionName":functionName,
	                            "lineBroadening":lineBroadening});

	}

	/**
	 * @function echoAntiechoFilter();
	 * That decodes an Echo-Antiecho 2D spectrum.
	 * @returns this object
	 */
	NMR.prototype.echoAntiechoFilter=function() {
	    //@TODO Implement echoAntiechoFilter filter
	}

	/**
	 * @function SNVFilter()
	 * This function apply a Standard Normal Variate Transformation over the given spectraData. Mainly used for IR spectra.
	 * @returns this object
	 */
	NMR.prototype.SNVFilter=function() {
	    //@TODO Implement SNVFilter
	}

	/**
	 * @function powerFilter(power)
	 * This function applies a power to all the Y values.<br>If the power is less than 1 and the spectrum has negative values, it will be shifted so that the lowest value is zero 
	 * @param   power   The power to apply
	 * @returns this object
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
	 * @returns this object
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
	 * @returns this object
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
	 * @returns this object
	*/
	NMR.prototype.phaseCorrection=function(phi0, phi1) {
	    return Filters.phaseCorrection(this, phi0, phi1);
	}

	/**
	 * @function automaticPhase() 
	 * This function determines automatically the correct parameters phi0 and phi1 for a phaseCorrection
	 * function and applies it.
	 * @returns this object
	 */ 
	NMR.prototype.automaticPhase=function() {
	    //@TODO Implement automaticPhase filter
	}


	/**
	 * @function nmrPeakDetection(parameters);
	 * This function process the given spectraData and tries to determine the NMR signals. Returns an NMRSignal1D array containing all the detected 1D-NMR Signals
	 * @param parameters A JSONObject containing the optional parameters:
	 * @option fromX:   Lower limit.
	 * @option toX:     Upper limit.
	 * @option threshold: The minimum intensity to consider a peak as a signal, expressed as a percentage of the highest peak. 
	 * @option stdev: Number of standard deviation of the noise for the threshold calculation if a threshold is not specified.
	 * @returns {*}
	 */
	NMR.prototype.nmrPeakDetection=function(parameters) {
	    return peakPicking(this, parameters);
	}



	module.exports = NMR;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * Implementation of the peak pickig method described by Cobas in:
	 * A new approach to improving automated analysis of proton NMR spectra
	 * through Global Spectral Deconvolution (GSD)
	 * http://www.spectroscopyeurope.com/images/stories/ColumnPDFs/TD_23_1.pdf
	 */
	var JAnalyzer = __webpack_require__(17);
	var GSD = __webpack_require__(18);
	//var extend = require("extend");
	var removeImpurities = __webpack_require__(47);

	const defaultOptions = {
	    nH:99,
	    clean:true,
	    realTop:false,
	    thresholdFactor:1,
	    compile:true,
	    integralFn:0,
	    optimize:true,
	    idPrefix:"",
	    format:"old",
	    frequencyCluster:16
	};


	module.exports = function(spectrum, optionsEx){
	    var options = Object.assign({}, defaultOptions, optionsEx);
	    var i, j, nHi, sum;

	    var noiseLevel = Math.abs(spectrum.getNoiseLevel())*(options.thresholdFactor);

	    //console.log("noiseLevel "+noiseLevel);
	    var gsdOptions = Object.assign({},
	        {noiseLevel: noiseLevel,
	            minMaxRatio:0.01,
	            broadRatio:0.0025,
	            smoothY:true,
	            nL:4,
	            functionType:"gaussian",
	            broadWidth:0.25,
	            sgOptions:{windowSize: 9, polynomial: 3}
	        },
	        options.gsdOptions);

	    var data = spectrum.getXYData();
	    var peakList = GSD.gsd(data[0],data[1], gsdOptions);
	    if(gsdOptions.broadWidth)
	        peakList = GSD.post.joinBroadPeaks(peakList,{width:gsdOptions.broadWidth});
	    if(options.optimize)
	        peakList = GSD.post.optimizePeaks(peakList,data[0],data[1],gsdOptions.nL,gsdOptions.functionType);

	    peakList = clearList(peakList, noiseLevel);
	    var signals = detectSignals(peakList, spectrum, options.nH, options.integralFn, options.frequencyCluster);

	    //Remove all the signals with small integral
	    if(options.clean||false){
	        for(var i=signals.length-1;i>=0;i--){
	            if(signals[i].integralData.value<0.5) {
	                signals.splice(i, 1);
	            }
	        }
	    }

	    //console.log(signals);
	    if(options.compile||false){
	        for(i=0;i<signals.length;i++){
	            //console.log("Sum "+signals[i].integralData.value);
	            JAnalyzer.compilePattern(signals[i]);

	            if(signals[i].maskPattern&&signals[i].multiplicity!="m"
	                && signals[i].multiplicity!=""){
	                //Create a new signal with the removed peaks
	                nHi = 0;
	                sum=0;
	                var peaksO = [];
	                for(j=signals[i].maskPattern.length-1;j>=0;j--){
	                    sum+=area(signals[i].peaks[j]);

	                    if(signals[i].maskPattern[j]===false) {
	                        var peakR = signals[i].peaks.splice(j,1)[0];
	                        peaksO.push({x:peakR.x, y:peakR.intensity, width:peakR.width});
	                        //peaksO.push(peakR);
	                        signals[i].mask.splice(j,1);
	                        signals[i].mask2.splice(j,1);
	                        signals[i].maskPattern.splice(j,1);
	                        signals[i].nbPeaks--;
	                        nHi+=area(peakR);
	                    }
	                }
	                if(peaksO.length>0){
	                    nHi=nHi*signals[i].integralData.value/sum;
	                    signals[i].integralData.value-=nHi;
	                    var peaks1 = [];
	                    for(var j=peaksO.length-1;j>=0;j--)
	                        peaks1.push(peaksO[j]);
	                    var newSignals = detectSignals(peaks1, spectrum, nHi, options.integralFn, options.frequencyCluster);

	                    for(j=0;j<newSignals.length;j++)
	                        signals.push(newSignals[j]);
	                }
	            }
	        }
	        //console.log(signals);
	        updateIntegrals(signals, options.nH);
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
	        if(options.idPrefix&&options.idPrefix.length>0)
	            signals[i].signalID = options.idPrefix+"_"+(i+1);
	        else
	            signals[i].signalID = (i+1)+"";
	        signals[i]._highlight=[signals[i].signalID];
	    }

	    //removeImpurities(signals, spectrum.getSolventName(),options.nH);

	    if(options.format==="new"){
	        var newSignals = new Array(signals.length);
	        for(var i=0;i<signals.length;i++){
	            var signal = signals[i];
	            newSignals[i] = {
	                from : signal.integralData.from,
	                to : signal.integralData.to,
	                integral : signal.integralData.value,
	                signal:[{
	                    nbAtoms:0,
	                    diaID:[],
	                    multiplicity:signal.multiplicity,
	                    peak:signal.peaks,
	                    kind:"",
	                    remark:""
	                }],
	                signalID:signal.signalID,
	                _highlight:signal._highlight

	            };
	            if(signal.nmrJs){
	                newSignals[i].signal[0].j = signal.nmrJs;
	            }
	            if(!signal.asymmetric||signal.multiplicity=="m"){
	                newSignals[i].signal[0].delta = signal.delta1;
	            }
	        }
	        signals = newSignals;
	    }

	    return signals;


	    /*var frequency = spectrum.observeFrequencyX();//getParamDouble("$BF1",400);
	     var imp = labelPeaks(peakList, solvent, frequency);
	     return [peakList,imp];
	     */
	    //return createSignals(peakList,nH);
	};

	function clearList(peakList, threshold){
	    for(var i=peakList.length-1;i>=0;i--){
	        if(Math.abs(peakList[i].y)<threshold){
	            peakList.splice(i,1);
	        }
	    }
	    return peakList;
	}


	/**
	 * This method implements a non linear sampling of the spectrum. The point close to
	 * the critic points are more sampled than the other ones.
	 * @param spectrum
	 * @param peaks
	 * @param rowWise
	 */
	function sampling(spectrum, peaks, rowWise){
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

	}

	function getVector(spectrum, from, to, rowWise){
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
	}



	function updateLimits(signal){
	    if(signal.multiplicity!="m" && signal.multiplicity!=""){
	        //Remove the integral of the removed peaks
	        var peaksO = signal.peaks;
	        var nbPeaks0 = peaksO.length, index = 0, factor = 0, toRemove = 0;

	        for(var i=0;i<nbPeaks0;i++){
	            if(signal.maskPattern[i]===false)
	                toRemove+=area(peaksO[i]);
	            factor+= area(peaksO[i]);
	        }
	        factor=signal.integralData.value/factor;
	        signal.integralData.value-=toRemove*factor;
	    }
	    return signal.integralData.value;
	}

	function updateIntegrals(signals, nH){
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
	}

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
	function detectSignals(peakList, spectrum, nH, integralType, frequencyCluster){

	    var frequency = spectrum.observeFrequencyX();
	    var signals = [];
	    var signal1D = {};
	    var prevPeak = {x:100000,y:0,width:0};
	    var peaks=null;
	    var rangeX = frequencyCluster / frequency; //Peaks withing this range are considered to belongs to the same signal1D
	    var spectrumIntegral = 0;
	    var cs,sum, i,j;
	    var dx = (spectrum.getX(1)-spectrum.getX(0))>0?1:-1;
	    for(i=0;i<peakList.length;i++){
	        if(Math.abs(peakList[i].x-prevPeak.x)>rangeX){
	            signal1D = {nbPeaks:1,units:"PPM",
	                "startX":peakList[i].x-peakList[i].width,
	                "stopX":peakList[i].x+peakList[i].width,
	                "multiplicity":"","pattern":"",
	                "observe":frequency,"nucleus":"1H",
	                "integralData":{"from":peakList[i].x-peakList[i].width*3,
	                    "to":peakList[i].x+peakList[i].width*3
	                    //"value":area(peakList[i])
	                },
	                "peaks":[]};
	            signal1D.peaks.push({x:peakList[i].x,"intensity":peakList[i].y, width:peakList[i].width});
	            signals.push(signal1D);
	            //spectrumIntegral+=area(peakList[i]);
	        }
	        else{
	            var tmp = peakList[i].x+peakList[i].width;
	            signal1D.stopX = Math.max(signal1D.stopX,tmp);
	            tmp = peakList[i].x-peakList[i].width;
	            signal1D.startX = Math.min(signal1D.startX,tmp);
	            signal1D.nbPeaks++;
	            signal1D.peaks.push({x:peakList[i].x,"intensity":peakList[i].y, width:peakList[i].width});
	            //signal1D.integralData.value+=area(peakList[i]);
	            signal1D.integralData.from = Math.min(signal1D.integralData.from, peakList[i].x-peakList[i].width*3);
	            signal1D.integralData.to = Math.max(signal1D.integralData.to,peakList[i].x+peakList[i].width*3);
	            //spectrumIntegral+=area(peakList[i]);
	        }
	        prevPeak = peakList[i];
	    }
	    //console.log(signals);
	    //Normalize the integral to the normalization parameter and calculate cs
	    for(i=0;i<signals.length;i++){
	        peaks = signals[i].peaks;
	        var integral = signals[i].integralData;
	        cs = 0;
	        sum = 0;

	        for(var j=0;j<peaks.length;j++){
	            cs+=peaks[j].x*area(peaks[j]);//.intensity;
	            sum+=area(peaks[j]);
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
	}

	/**
	 Updates the score that a given impurity is present in the current spectrum. In this part I would expect
	 to have into account the multiplicity of the signal. Also the relative intensity of the signals.
	 THIS IS the KEY part of the algorithm!!!!!!!!!
	 */
	function updateScore(candidates, peakList, maxIntensity, frequency){
	    //You may do it to avoid this part.
	    //Check the multiplicity
	    var mul, index, k;
	    var j = 0;
	    var min = 0;
	    var indexMin = 0;
	    var score = 0;
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
	}

	function area(peak){
	    return Math.abs(peak.intensity*peak.width*1.57)//1.772453851);
	}


/***/ },
/* 17 */
/***/ function(module, exports) {

	'use strict';
	/**
	 * This library implements the J analyser described by Cobas et al in the paper:
	 * A two-stage approach to automatic determination of 1H NMR coupling constants
	 * Created by acastillo on 4/5/15.
	 */

	const pascalTriangle  =  [[0],[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1],[1,5,10,10,5,1],[1,6,15,20,15,6,1]];
	const patterns = ["s","d","t","q","quint","h","sept","o","n"];
	var symRatio = 1.5;
	var maxErrorIter1 = 2.5;//Hz
	var maxErrorIter2 = 1;//Hz
	var DEBUG = false;

	module.exports = {
	    /**
	     * The compilation process implements at the first stage a normalization procedure described by Golotvin et al.
	     * embedding in peak-component-counting method described by Hoyes et al.
	     * @param signal
	     */
	    compilePattern : function(signal){
	        if(DEBUG)console.log("Debugin...");

	        signal.multiplicity="m";//By default the multiplicity is massive
	        // 1.1 symmetrize
	        // It will add a set of peaks(signal.peaksComp) to the signal that will be used during
	        // the compilation process. The unit of those peaks will be in Hz
	        signal.symRank = symmetrizeChoiseBest(signal,maxErrorIter1,1);
	        signal.asymmetric = true;
	       // console.log(signal.delta1+" "+signal.symRank);
	        //Is the signal symmetric?
	        if(signal.symRank>=0.95&&signal.peaksComp.length<32){
	            if(DEBUG)console.log(signal.delta1+ " nbPeaks "+signal.peaksComp.length);
	            signal.asymmetric = false;
	            var i,j,n,k=1,P1,Jc=[],n2,maxFlagged;
	            //Loop over the possible number of coupling contributing to the multiplet
	            for(n=0;n<9;n++){
	                if(DEBUG)console.log("Trying "+n+" couplings");
	                //1.2 Normalize. It makes a deep copy of the peaks before to modify them.
	                var peaks = normalize(signal,n);
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
	                var ranges = getRanges(peaks);
	                n2 = Math.pow(2,n);

	                if(DEBUG){
	                    console.log("ranges: "+JSON.stringify(ranges));
	                    console.log("Target sum: "+n2);
	                }

	                // 1.4 Find a combination of integer heights Hi, one from each Si, that sums to 2^n.
	                var heights = null;
	                while(!validPattern&&(heights = getNextCombination(ranges, n2))!==null){

	                    if(DEBUG){
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
	                    if(DEBUG){
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
	                        if(DEBUG){
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
	                    var pattern = idealPattern(Jc);
	                    //Compare the ideal pattern with the proposed intensities.
	                    // All the intensities have to match to accept the multiplet
	                    validPattern = true;
	                    for(i=0;i<pattern.length;i++){
	                        if(pattern[i].intensity != heights[i])
	                            validPattern = false;
	                    }
	                    //More verbosity of the process
	                    if(DEBUG){
	                        console.log("Jc "+JSON.stringify(Jc));
	                        console.log("Heights "+JSON.stringify(heights));
	                        console.log("pattern "+JSON.stringify(pattern));
	                        console.log("Valid? "+validPattern);
	                    }
	                }
	                //If we found a valid pattern we should inform about the pattern.
	                if(validPattern){
	                    updateSignal(signal,Jc);
	                }
	            }
	        }

	        //Before to return, change the units of peaksComp from Hz to PPM again
	        for(i=0;i<signal.peaksComp.length;i++){
	            signal.peaksComp[i].x/=signal.observe;
	        }
	    }
	}

	function updateSignal(signal, Jc){
	    //Update the limits of the signal
	    var peaks = signal.peaksComp;//Always in Hz
	    var nbPeaks = peaks.length;
	    signal.startX=peaks[0].x/signal.observe-peaks[0].width;
	    signal.stopX=peaks[nbPeaks-1].x/signal.observe+peaks[nbPeaks-1].width;

	    signal.integralData.from=peaks[0].x/signal.observe-peaks[0].width*3;
	    signal.integralData.to=peaks[nbPeaks-1].x/signal.observe+peaks[nbPeaks-1].width*3;

	    //Compile the pattern and format the constant couplings
	    signal.maskPattern = signal.mask2;
	    signal.multiplicity = abstractPattern(signal,Jc);
	    signal.pattern=signal.multiplicity;//Our library depends on this parameter, but it is old
	    //console.log(signal);
	    if(DEBUG)
	        console.log("Final j-couplings: "+JSON.stringify(Jc));
	}

	/**
	 * Returns the multiplet in the compact format
	 */
	function  abstractPattern(signal,Jc){
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
	                newNmrJs.push({"coupling":Math.abs(Jc[i]),"multiplicity":patterns[cont]});
	                pattern+=patterns[cont];
	                cont=1;
	            }
	        }
	        newNmrJs.push({"coupling":Math.abs(Jc[i]),"multiplicity":patterns[cont]});
	        pattern+=patterns[cont];
	        signal.nmrJs =  newNmrJs;
	    }
	    else{
	        pattern="s";
	        if(Math.abs(signal.startX-signal.stopX)*signal.observe>16){
	            pattern="br s"
	        }
	    }
	    return pattern;
	}

	/**
	 *This function creates an ideal pattern from the given J-couplings
	 */
	function idealPattern(Jc){
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
	}

	/**
	 * Find a combination of integer heights Hi, one from each Si, that sums to 2n.
	 */
	function getNextCombination(ranges, value){
	    var half = Math.ceil(ranges.values.length/2), lng = ranges.values.length;
	    var sum = 0,i,ok;
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
	        if(DEBUG){
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
	}

	/**
	 * This function generates the possible values that each peak can contribute
	 * to the multiplet.
	 * @param peaks
	 * @returns {{values: Array, currentIndex: Array, active: number}}
	 */
	function getRanges(peaks){
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
	}
	/**
	 * Performs a symmetrization of the signal by using different aproximations to the center.
	 * It will return the result of the symmetrization that removes less peaks from the signal
	 * @param signal
	 * @param maxError
	 * @param iteration
	 * @returns {*}
	 */
	function symmetrizeChoiseBest(signal,maxError,iteration){
	    var symRank1 = symmetrize(signal,maxError,iteration);
	    var tmpPeaks = signal.peaksComp;
	    var tmpMask = signal.mask;
	    var cs = signal.delta1;
	    signal.delta1 = (signal.peaks[0].x+signal.peaks[signal.peaks.length-1].x)/2;
	    var symRank2 = symmetrize(signal,maxError,iteration);
	    if(signal.peaksComp.length>tmpPeaks.length)
	        return symRank2;
	    else{
	        signal.delta1 = cs;
	        signal.peaksComp = tmpPeaks;
	        signal.mask = tmpMask;
	        return symRank1;
	    }

	}
	/**
	 * This function will return a set of symmetric peaks that will
	 * be the enter point for the patter compilation process.
	 */
	function symmetrize(signal, maxError, iteration){
	    //Before to symmetrize we need to keep only the peaks that possibly conforms the multiplete
	    var max, min, avg, ratio, avgWidth, j;
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
	    maxError = error(Math.abs(cs-middle[0]));
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
	            if(ratio>symRatio){
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
	                if(DEBUG){
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
	            cs = chemicalShift(peaks, mask);
	            //There is not more available peaks
	            if(isNaN(cs)){ return 0;}
	        }
	        maxError = error(Math.abs(cs-middle[0]/middle[1]));
	    }
	    //To remove the weak peaks and recalculate the cs
	    for(i=nbPeaks-1;i>=0;i--){
	        if(mask[i]===false){
	            peaks.splice(i,1);
	        }
	    }
	    cs = chemicalShift(peaks);
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
	    if(DEBUG){
	        console.log("Penalty "+(heightSum-newSumHeights)/heightSum*0.12);
	        console.log("cs: "+(cs/signal.observe)+" symFactor: "+symFactor);
	    }
	    //Sometimes we need a second opinion after the first symmetrization.
	    if(symFactor>0.8&&symFactor<0.97&&iteration<2){
	        return symmetrize(signal, maxErrorIter2, 2);
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
	}

	function error(value){
	    var maxError = value*2.5;
	    if(maxError<0.75)
	        maxError = 0.75;
	    if(maxError > 3)
	        maxError = 3;
	    return maxError;
	}
	/**
	 * 2 stages normalizarion of the peaks heights to Math.pow(2,n).
	 * Creates a new mask with the peaks that could contribute to the multiplete
	 * @param signal
	 * @param n
	 * @returns {*}
	 */
	function normalize(signal, n){
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
	            if(DEBUG)
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
	    if(DEBUG) console.log(JSON.stringify(peaks));
	    return peaks;
	}

	/**
	 * Calculates the chemical shift as the weighted sum of the peaks
	 * @param peaks
	 * @param mask
	 * @returns {number}
	 */
	function chemicalShift(peaks, mask){
	    var sum=0,cs= 0, i, area;
	    if(mask){
	        for(i=0;i<peaks.length;i++){
	            //console.log(mask[i]);
	            if(mask[i]===true){
	                area = getArea(peaks[i]);
	                sum+=area;
	                cs+=area*peaks[i].x;
	            }
	        }
	    }
	    else{
	        for(i=0;i<peaks.length;i++){
	            area = getArea(peaks[i]);
	            sum+=area;
	            cs+=area*peaks[i].x;
	        }
	    }
	    return cs/sum;
	}

	function getArea(peak){
	    return Math.abs(peak.intensity*peak.width*1.57)//1.772453851);
	}

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	
	module.exports.post = __webpack_require__(19);
	module.exports.gsd = __webpack_require__(42);


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by acastillo on 9/6/15.
	 */
	var Opt = __webpack_require__(20);

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
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var LM = __webpack_require__(21);
	var math = LM.Matrix.algebra;
	var Matrix = __webpack_require__(33);

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
	    opts = opts || {};
	    var xy2 = parseData(xy, opts.percentage||0);

	    if(xy2===null||xy2[0].rows<3){
	        return null; //Cannot run an optimization with less than 3 points
	    }

	    var t = xy2[0];
	    var y_data = xy2[1];
	    var maxY = xy2[2];
	    var nbPoints = t.rows, i;

	    var weight = [nbPoints / Math.sqrt(y_data.dot(y_data))];

	    var opts=Object.create(opts.LMOptions || [  3,    100, 1e-3, 1e-3, 1e-3, 1e-2, 1e-2,    11,    9,        1 ]);
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
	    opts = opts || {};
	    var xy2 = parseData(xy, opts.percentage||0);

	    if(xy2===null||xy2[0].rows<3){
	        return null; //Cannot run an optimization with less than 3 points
	    }

	    var t = xy2[0];
	    var y_data = xy2[1];
	    var maxY = xy2[2];

	    var nbPoints = t.rows, i;



	    var weight = [nbPoints / Math.sqrt(y_data.dot(y_data))];

	    var opts=Object.create(opts.LMOptions || [  3,    100, 1e-3, 1e-3, 1e-3, 1e-2, 1e-2,    11,    9,        1 ]);
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

	/*
	 peaks on group should sorted
	 */
	function optimizeLorentzianTrain(xy, group, opts){
	    var xy2 = parseData(xy);
	    //console.log(xy2[0].rows);
	    if(xy2===null||xy2[0].rows<3){
	        return null; //Cannot run an optimization with less than 3 points
	    }

	    var t = xy2[0];
	    var y_data = xy2[1];
	    var maxY = xy2[2];
	    var currentIndex = 0;
	    var nbPoints = t.length;
	    var nextX;
	    var tI, yI, maxY;
	    var result=[], current;
	    for(var i=0; i<group.length;i++){
	        nextX = group[i].x-group[i].width*4;
	        //console.log(group[i]);
	        while(t[currentIndex++]<nextX&&currentIndex<nbPoints);
	        nextX = group[i].x+group[i].width*4;
	        tI = [];
	        yI = [];
	        while(t[currentIndex]<=nextX&&currentIndex<nbPoints){
	            tI.push(t[currentIndex][0]);
	            yI.push(y_data[currentIndex][0]*maxY);
	            currentIndex++;
	        }

	        current=optimizeSingleLorentzian([tI, yI], group[i], opts);
	        if(current){
	            result.push({"x":current[0][0],"y":current[1][0],"width":current[2][0],"opt":true});
	        }
	        else{
	            result.push({"x":group[i].x,"y":group[i].y,"width":group[i].width,"opt":false});
	        }
	    }

	    return result;

	}

	function optimizeGaussianTrain(xy, group, opts){
	    var xy2 = parseData(xy);
	    //console.log(xy2[0].rows);
	    if(xy2===null||xy2[0].rows<3){
	        return null; //Cannot run an optimization with less than 3 points
	    }

	    var t = xy2[0];
	    var y_data = xy2[1];
	    var maxY = xy2[2];
	    var currentIndex = 0;
	    var nbPoints = t.length;
	    var nextX;
	    var tI, yI, maxY;
	    var result=[], current;
	    for(var i=0; i<group.length;i++){
	        nextX = group[i].x-group[i].width*4;
	        //console.log(group[i]);
	        while(t[currentIndex++]<nextX&&currentIndex<nbPoints);
	        nextX = group[i].x+group[i].width*4;
	        tI = [];
	        yI = [];
	        while(t[currentIndex]<=nextX&&currentIndex<nbPoints){
	            tI.push(t[currentIndex][0]);
	            yI.push(y_data[currentIndex][0]*maxY);
	            currentIndex++;
	        }

	        current=optimizeSingleGaussian([tI, yI], group[i], opts);
	        if(current){
	            result.push({"x":current[0][0],"y":current[1][0],"width":current[2][0],"opt":true});
	        }
	        else{
	            result.push({"x":group[i].x,"y":group[i].y,"width":group[i].width,"opt":false});
	        }
	    }

	    return result;
	}



	/**
	 *
	 * @param xy A two column matrix containing the x and y data to be fitted
	 * @param group A set of initial lorentzian parameters to be optimized [center, heigth, half_width_at_half_height]
	 * @returns {Array} A set of final lorentzian parameters [center, heigth, hwhh*2]
	 */
	function optimizeLorentzianSum(xy, group, opts){
	    var xy2 = parseData(xy);

	    if(xy2===null||xy2[0].rows<3){
	        return null; //Cannot run an optimization with less than 3 points
	    }

	    var t = xy2[0];
	    var y_data = xy2[1];
	    var maxY = xy2[2];
	    var nbPoints = t.rows, i;

	    var weight = [nbPoints / math.sqrt(y_data.dot(y_data))];
	    var opts=Object.create(opts || [  3,    100, 1e-3, 1e-3, 1e-3, 1e-2, 1e-2, 11, 9, 1 ]);
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

	    if(xy2===null||xy2[0].rows<3){
	        return null; //Cannot run an optimization with less than 3 points
	    }

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
	function parseData(xy, threshold){
	    var nbSeries = xy.length;
	    var t = null;
	    var y_data = null, x,y;
	    var maxY = 0, i,j;

	    if(nbSeries==2){
	        //Looks like row wise matrix [x,y]
	        var nbPoints = xy[0].length;
	        //if(nbPoints<3)
	        //    throw new Exception(nbPoints);
	        //else{
	        t = new Array(nbPoints);//new Matrix(nbPoints,1);
	        y_data = new Array(nbPoints);//new Matrix(nbPoints,1);
	        x = xy[0];
	        y = xy[1];
	        if(typeof x[0] === "number"){
	            for(i=0;i<nbPoints;i++){
	                t[i]=x[i];
	                y_data[i]=y[i];
	                if(y[i]>maxY)
	                    maxY = y[i];
	            }
	        }
	        else{
	            //It is a colum matrix
	            if(typeof x[0] === "object"){
	                for(i=0;i<nbPoints;i++){
	                    t[i]=x[i][0];
	                    y_data[i]=y[i][0];
	                    if(y[i][0]>maxY)
	                        maxY = y[i][0];
	                }
	            }

	        }

	        //}
	    }
	    else{
	        //Looks like a column wise matrix [[x],[y]]
	        var nbPoints = nbSeries;
	        //if(nbPoints<3)
	        //    throw new SizeException(nbPoints);
	        //else {
	        t = new Array(nbPoints);//new Matrix(nbPoints, 1);
	        y_data = new Array(nbPoints);//new Matrix(nbPoints, 1);
	        for (i = 0; i < nbPoints; i++) {
	            t[i] = xy[i][0];
	            y_data[i] = xy[i][1];
	            if(y_data[i]>maxY)
	                maxY = y_data[i];
	        }
	        //}
	    }
	    for (i = 0; i < nbPoints; i++) {
	        y_data[i]/=maxY;
	    }
	    if(threshold){
	        for (i = nbPoints-1; i >=0; i--) {
	            if(y_data[i]<threshold) {
	                y_data.splice(i,1);
	                t.splice(i,1);
	            }
	        }
	    }
	    if(t.length>0)
	        return [(new Matrix([t])).transpose(),(new Matrix([y_data])).transpose(),maxY];
	    return null;
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
	module.exports.optimizeGaussianTrain = optimizeGaussianTrain;
	module.exports.optimizeLorentzianTrain = optimizeLorentzianTrain;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(22);
	module.exports.Matrix = __webpack_require__(23);
	module.exports.Matrix.algebra = __webpack_require__(32);


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by acastillo on 8/5/15.
	 */
	var Matrix = __webpack_require__(23);
	var math = __webpack_require__(32);

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
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(24);
	module.exports.Decompositions = module.exports.DC = __webpack_require__(25);


/***/ },
/* 24 */
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
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Matrix = __webpack_require__(24);

	var SingularValueDecomposition = __webpack_require__(26);
	var EigenvalueDecomposition = __webpack_require__(28);
	var LuDecomposition = __webpack_require__(29);
	var QrDecomposition = __webpack_require__(30);
	var CholeskyDecomposition = __webpack_require__(31);

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
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Matrix = __webpack_require__(24);
	var hypotenuse = __webpack_require__(27).hypotenuse;

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
/* 27 */
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
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Matrix = __webpack_require__(24);
	var hypotenuse = __webpack_require__(27).hypotenuse;

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
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Matrix = __webpack_require__(24);

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
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Matrix = __webpack_require__(24);
	var hypotenuse = __webpack_require__(27).hypotenuse;

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
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Matrix = __webpack_require__(24);

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
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by acastillo on 8/24/15.
	 */
	/**
	 * Non in-place function definitions, compatible with mathjs code *
	 */

	'use strict';

	var Matrix = __webpack_require__(23);

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
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(34);
	module.exports.Decompositions = module.exports.DC = __webpack_require__(35);


/***/ },
/* 34 */
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
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Matrix = __webpack_require__(34);

	var SingularValueDecomposition = __webpack_require__(36);
	var EigenvalueDecomposition = __webpack_require__(38);
	var LuDecomposition = __webpack_require__(39);
	var QrDecomposition = __webpack_require__(40);
	var CholeskyDecomposition = __webpack_require__(41);

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
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Matrix = __webpack_require__(34);
	var hypotenuse = __webpack_require__(37).hypotenuse;

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
/* 37 */
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
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Matrix = __webpack_require__(34);
	var hypotenuse = __webpack_require__(37).hypotenuse;

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
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Matrix = __webpack_require__(34);

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
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Matrix = __webpack_require__(34);
	var hypotenuse = __webpack_require__(37).hypotenuse;

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
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Matrix = __webpack_require__(34);

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
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var Opt = __webpack_require__(20);
	var stats = __webpack_require__(2);
	var extend = __webpack_require__(14);
	var SG = __webpack_require__(43);

	var sgDefOptions = {
	    windowSize: 9,
	    polynomial: 3
	};


	function gsd(x, y, options){
	    //options = extend({}, defaultOptions, options);
	    var options=Object.create(options || {});
	    if (options.minMaxRatio===undefined) options.minMaxRatio=0.00025;
	    if (options.broadRatio===undefined) options.broadRatio=0.00;
	    if (options.noiseLevel===undefined) options.noiseLevel=undefined;
	    if (options.noiseFactor===undefined) options.noiseFactor=3;
	    if (options.maxCriteria===undefined) options.maxCriteria=true;
	    if (options.smoothY===undefined) options.smoothY=true;
	    if (options.realTopDetection===undefined) options.realTopDetection=false;

	    var sgOptions = extend({}, sgDefOptions, options.sgOptions);

	    //console.log(JSON.stringify(stats.array.minMax(y)));
	    if(options.noiseLevel===undefined){
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

	        if((maxDx-minDx)/maxDx<0.05){

	            options.noiseLevel = getNoiseLevel(y);
	            //console.log(options.noiseLevel+" "+stats.array.median(y));
	        }
	        else{
	            options.noiseLevel = 0;
	        }
	    }
	    //console.log("options.noiseLevel "+options.noiseLevel);
	    y=[].concat(y);
	    var yCorrection = {m:1, b:options.noiseLevel};
	    if(!options.maxCriteria){
	        yCorrection.m =-1;
	        yCorrection.b*=-1;
	    }

	    for (var i=0; i<y.length; i++){
	        y[i]=yCorrection.m*y[i]-yCorrection.b;
	    }

	    for (var i=0; i<y.length; i++) {
	        if (y[i] < 0) {
	            y[i] = 0;
	        }
	    }

	    //If the max difference between delta x is less than 5%, then, we can assume it to be equally spaced variable
	    var Y = y;
	    if((maxDx-minDx)/maxDx<0.05){
	        if(options.smoothY)
	            Y = SG(y, x[1]-x[0], {windowSize:sgOptions.windowSize, polynomial:sgOptions.polynomial,derivative:0});
	        var dY = SG(y, x[1]-x[0], {windowSize:sgOptions.windowSize, polynomial:sgOptions.polynomial,derivative:1});
	        var ddY = SG(y, x[1]-x[0], {windowSize:sgOptions.windowSize, polynomial:sgOptions.polynomial,derivative:2});
	    }
	    else{
	        if(options.smoothY)
	            Y = SG(y, x, {windowSize:sgOptions.windowSize, polynomial:sgOptions.polynomial,derivative:0});
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
	                    i:minddY[j],
	                    x: frequency,
	                    y: (Y[minddY[j]]-yCorrection.b)/yCorrection.m,
	                    width:Math.abs(intervalR[possible] - intervalL[possible]),//widthCorrection
	                    soft:broadMask[j]
	                })
	            }
	        }
	    }


	    if(options.realTopDetection){
	        realTopDetection(signals,X,Y);
	    }

	    //Correct the values to fit the original spectra data
	    for(var j=0;j<signals.length;j++){
	        signals[j].base=options.noiseLevel;
	    }

	    signals.sort(function (a, b) {
	        return a.x - b.x;
	    });

	    return signals;

	}

	function getNoiseLevel(y){
	    var mean = 0,stddev=0;
	    var length = y.length,i=0;
	    for(i = 0; i < length; i++){
	        mean+=y[i];
	    }
	    mean/=length;
	    var averageDeviations = new Array(length);
	    for (i = 0; i < length; i++)
	        averageDeviations[i] = Math.abs(y[i] - mean);
	    averageDeviations.sort();
	    if (length % 2 == 1) {
	        stddev = averageDeviations[(length-1)/2] / 0.6745;
	    } else {
	        stddev = 0.5*(averageDeviations[length/2]+averageDeviations[length/2-1]) / 0.6745;
	    }

	    return stddev;
	}

	function realTopDetection(peakList, x, y){
	    //console.log(peakList);
	    //console.log(x);
	    //console.log(y);
	    var listP = [];
	    var alpha, beta, gamma, p,currentPoint;
	    for(var j=0;j<peakList.length;j++){
	        currentPoint = peakList[j].i;//peakList[j][2];
	        var tmp = currentPoint;
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
	            //console.log("p: "+p);
	            //console.log(x[currentPoint]+" "+tmp+" "+currentPoint);
	            peakList[j].x = x[currentPoint] + (x[currentPoint]-x[currentPoint-1])*p;
	            peakList[j].y = y[currentPoint] - 0.25 * (y[currentPoint - 1]
	                - y[currentPoint + 1]) * p;//signal.peaks[j].intensity);
	            //console.log(y[tmp]+" "+peakList[j].y);
	        }
	    }
	}

	module.exports=gsd;


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	//Code translate from Pascal source in http://pubs.acs.org/doi/pdf/10.1021/ac00205a007
	var extend = __webpack_require__(14);
	var stat = __webpack_require__(44);

	var defaultOptions = {
	    windowSize: 9,
	    derivative: 0,
	    polynomial: 3,
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
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.array = __webpack_require__(45);
	exports.matrix = __webpack_require__(46);


/***/ },
/* 45 */
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
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var arrayStat = __webpack_require__(45);

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
/* 47 */
/***/ function(module, exports) {

	'use strict';

	const impuritiesList = [
	    {"solvent":"CDCl3","impurities":[{"shifts":[{"proton":"X","coupling":0,"multiplicity":"ds","shift":7.26}],"name":"solvent_residual_peak"},{"shifts":[{"proton":"H2O","coupling":0,"multiplicity":"bs","shift":1.56}],"name":"H2O"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.1}],"name":"acetic_acid"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.17}],"name":"acetone"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.1}],"name":"acetonitrile"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.36}],"name":"benzene"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.28}],"name":"tert-butyl_alcohol"},{"shifts":[{"proton":"CCH3","coupling":0,"multiplicity":"s","shift":1.19},{"proton":"OCH3","coupling":0,"multiplicity":"s","shift":3.22}],"name":"tert-butyl_methyl_ether"},{"shifts":[{"proton":"ArH","coupling":0,"multiplicity":"s","shift":6.98},{"proton":"OHc","coupling":0,"multiplicity":"s","shift":5.01},{"proton":"ArCH3","coupling":0,"multiplicity":"s","shift":2.27},{"proton":"ArC(CH3)3","coupling":0,"multiplicity":"s","shift":1.43}],"name":"BHTb"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.26}],"name":"chloroform"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":1.43}],"name":"cyclohexane"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.73}],"name":"1,2-dichloroethane"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":5.3}],"name":"dichloromethane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.21},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":3.48}],"name":"diethyl_ether"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"m","shift":3.65},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":3.57},{"proton":"OCH3","coupling":0,"multiplicity":"s","shift":3.39}],"name":"diglyme"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.4},{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.55}],"name":"1,2-dimethoxyethane"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":2.09},{"proton":"NCH3","coupling":0,"multiplicity":"s","shift":3.02},{"proton":"NCH3","coupling":0,"multiplicity":"s","shift":2.94}],"name":"dimethylacetamide"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":8.02},{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.96},{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.88}],"name":"dimethylformamide"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.62}],"name":"dimethyl_sulfoxide"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.71}],"name":"dioxane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.25},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":3.72},{"proton":"OH","coupling":5,"multiplicity":"s,t","shift":1.32}],"name":"ethanol"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":2.05},{"proton":"CH2CH3","coupling":7,"multiplicity":"q","shift":4.12},{"proton":"CH2CH3","coupling":7,"multiplicity":"t","shift":1.26}],"name":"ethyl_acetate"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":2.14},{"proton":"CH2CH3","coupling":7,"multiplicity":"q","shift":2.46},{"proton":"CH2CH3","coupling":7,"multiplicity":"t","shift":1.06}],"name":"ethyl_methyl_ketone"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":3.76}],"name":"ethylene_glycol"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"m","shift":0.86},{"proton":"CH2","coupling":0,"multiplicity":"br_s","shift":1.26}],"name":"grease^f"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"t","shift":0.88},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.26}],"name":"n-hexane"},{"shifts":[{"proton":"CH3","coupling":9.5,"multiplicity":"d","shift":2.65}],"name":"HMPAg"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.49},{"proton":"OH","coupling":0,"multiplicity":"s","shift":1.09}],"name":"methanol"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":4.33}],"name":"nitromethane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":7},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.27}],"name":"n-pentane"},{"shifts":[{"proton":"CH3","coupling":6,"multiplicity":"d","shift":1.22},{"proton":"CH","coupling":6,"multiplicity":"sep","shift":4.04}],"name":"2-propanol"},{"shifts":[{"proton":"CH(2)","coupling":0,"multiplicity":"m","shift":8.62},{"proton":"CH(3)","coupling":0,"multiplicity":"m","shift":7.29},{"proton":"CH(4)","coupling":0,"multiplicity":"m","shift":7.68}],"name":"pyridine"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":0.07}],"name":"silicone_greasei"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.85},{"proton":"CH2O","coupling":0,"multiplicity":"m","shift":3.76}],"name":"tetrahydrofuran"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.36},{"proton":"CH(o/p)","coupling":0,"multiplicity":"m","shift":7.17},{"proton":"CH(m)","coupling":0,"multiplicity":"m","shift":7.25}],"name":"toluene"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.03},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":2.53}],"name":"triethylamine"}]},
	    {"solvent":"(CD3)2CO","impurities":[{"shifts":[{"proton":"X","coupling":0,"multiplicity":"","shift":2.05}],"name":"solvent_residual_peak"},{"shifts":[{"proton":"H2O","coupling":0,"multiplicity":"s","shift":2.84}],"name":"H2O"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.96}],"name":"acetic_acid"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.09}],"name":"acetone"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.05}],"name":"acetonitrile"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.36}],"name":"benzene"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.18}],"name":"tert-butyl_alcohol"},{"shifts":[{"proton":"CCH3","coupling":0,"multiplicity":"s","shift":1.13},{"proton":"OCH3","coupling":0,"multiplicity":"s","shift":3.13}],"name":"tert-butyl_methyl_ether"},{"shifts":[{"proton":"ArH","coupling":0,"multiplicity":"s","shift":6.96},{"proton":"ArCH3","coupling":0,"multiplicity":"s","shift":2.22},{"proton":"ArC(CH3)3","coupling":0,"multiplicity":"s","shift":1.41}],"name":"BHTb"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":8.02}],"name":"chloroform"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":1.43}],"name":"cyclohexane"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.87}],"name":"1,2-dichloroethane"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":5.63}],"name":"dichloromethane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.11},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":3.41}],"name":"diethyl_ether"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"m","shift":3.56},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":3.47},{"proton":"OCH3","coupling":0,"multiplicity":"s","shift":3.28}],"name":"diglyme"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.28},{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.46}],"name":"1,2-dimethoxyethane"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":1.97},{"proton":"NCH3","coupling":0,"multiplicity":"s","shift":3},{"proton":"NCH3","coupling":0,"multiplicity":"s","shift":2.83}],"name":"dimethylacetamide"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.96},{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.94},{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.78}],"name":"dimethylformamide"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.52}],"name":"dimethyl_sulfoxide"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.59}],"name":"dioxane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.12},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":3.57},{"proton":"OH","coupling":5,"multiplicity":"s,t","shift":3.39}],"name":"ethanol"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":1.97},{"proton":"CH2CH3","coupling":7,"multiplicity":"q","shift":4.05},{"proton":"CH2CH3","coupling":7,"multiplicity":"t","shift":1.2}],"name":"ethyl_acetate"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":2.07},{"proton":"CH2CH3","coupling":7,"multiplicity":"q","shift":2.45},{"proton":"CH2CH3","coupling":7,"multiplicity":"t","shift":0.96}],"name":"ethyl_methyl_ketone"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":3.28}],"name":"ethylene_glycol"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"m","shift":0.87},{"proton":"CH2","coupling":0,"multiplicity":"br_s","shift":1.29}],"name":"grease^f"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"t","shift":0.88},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.28}],"name":"n-hexane"},{"shifts":[{"proton":"CH3","coupling":9.5,"multiplicity":"d","shift":2.59}],"name":"HMPAg"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.31},{"proton":"OH","coupling":0,"multiplicity":"s","shift":3.12}],"name":"methanol"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":4.43}],"name":"nitromethane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":0.88},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.27}],"name":"n-pentane"},{"shifts":[{"proton":"CH3","coupling":6,"multiplicity":"d","shift":1.1},{"proton":"CH","coupling":6,"multiplicity":"sep","shift":3.9}],"name":"2-propanol"},{"shifts":[{"proton":"CH(2)","coupling":0,"multiplicity":"m","shift":8.58},{"proton":"CH(3)","coupling":0,"multiplicity":"m","shift":7.35},{"proton":"CH(4)","coupling":0,"multiplicity":"m","shift":7.76}],"name":"pyridine"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":0.13}],"name":"silicone_greasei"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.79},{"proton":"CH2O","coupling":0,"multiplicity":"m","shift":3.63}],"name":"tetrahydrofuran"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.32},{"proton":"CH(o/p)","coupling":0,"multiplicity":"m","shift":7.5},{"proton":"CH(m)","coupling":0,"multiplicity":"m","shift":7.5}],"name":"toluene"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":0.96},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":2.45}],"name":"triethylamine"}]},
	    {"solvent":"(CD3)2SO/DMSO","impurities":[{"shifts":[{"proton":"X","coupling":0,"multiplicity":"quint","shift":2.5}],"name":"solvent_residual_peak"},{"shifts":[{"proton":"H2O","coupling":0,"multiplicity":"s","shift":3.33}],"name":"H2O"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.91}],"name":"acetic_acid"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.09}],"name":"acetone"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.07}],"name":"acetonitrile"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.37}],"name":"benzene"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.11},{"proton":"OHc","coupling":0,"multiplicity":"s","shift":4.19}],"name":"tert-butyl_alcohol"},{"shifts":[{"proton":"CCH3","coupling":0,"multiplicity":"s","shift":1.11},{"proton":"OCH3","coupling":0,"multiplicity":"s","shift":3.08}],"name":"tert-butyl_methyl_ether"},{"shifts":[{"proton":"ArH","coupling":0,"multiplicity":"s","shift":6.87},{"proton":"OHc","coupling":0,"multiplicity":"s","shift":6.65},{"proton":"ArCH3","coupling":0,"multiplicity":"s","shift":2.18},{"proton":"ArC(CH3)3","coupling":0,"multiplicity":"s","shift":1.36}],"name":"BHTb"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":8.32}],"name":"chloroform"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":1.4}],"name":"cyclohexane"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.9}],"name":"1,2-dichloroethane"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":5.76}],"name":"dichloromethane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.09},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":3.38}],"name":"diethyl_ether"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"m","shift":3.51},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":3.38},{"proton":"OCH3","coupling":0,"multiplicity":"s","shift":3.24}],"name":"diglyme"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.24},{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.43}],"name":"1,2-dimethoxyethane"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":1.96},{"proton":"NCH3","coupling":0,"multiplicity":"s","shift":2.94},{"proton":"NCH3","coupling":0,"multiplicity":"s","shift":2.78}],"name":"dimethylacetamide"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.95},{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.89},{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.73}],"name":"dimethylformamide"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.54}],"name":"dimethyl_sulfoxide"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.57}],"name":"dioxane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.06},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":3.44},{"proton":"OH","coupling":5,"multiplicity":"s,t","shift":4.63}],"name":"ethanol"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":1.99},{"proton":"CH2CH3","coupling":7,"multiplicity":"q","shift":4.03},{"proton":"CH2CH3","coupling":7,"multiplicity":"t","shift":1.17}],"name":"ethyl_acetate"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":2.07},{"proton":"CH2CH3","coupling":7,"multiplicity":"q","shift":2.43},{"proton":"CH2CH3","coupling":7,"multiplicity":"t","shift":0.91}],"name":"ethyl_methyl_ketone"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":3.34}],"name":"ethylene_glycol"},{"shifts":[],"name":"grease^f"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"t","shift":0.86},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.25}],"name":"n-hexane"},{"shifts":[{"proton":"CH3","coupling":9.5,"multiplicity":"d","shift":2.53}],"name":"HMPAg"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.16},{"proton":"OH","coupling":0,"multiplicity":"s","shift":4.01}],"name":"methanol"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":4.42}],"name":"nitromethane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":0.88},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.27}],"name":"n-pentane"},{"shifts":[{"proton":"CH3","coupling":6,"multiplicity":"d","shift":1.04},{"proton":"CH","coupling":6,"multiplicity":"sep","shift":3.78}],"name":"2-propanol"},{"shifts":[{"proton":"CH(2)","coupling":0,"multiplicity":"m","shift":8.58},{"proton":"CH(3)","coupling":0,"multiplicity":"m","shift":7.39},{"proton":"CH(4)","coupling":0,"multiplicity":"m","shift":7.79}],"name":"pyridine"},{"shifts":[],"name":"silicone_greasei"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.76},{"proton":"CH2O","coupling":0,"multiplicity":"m","shift":3.6}],"name":"tetrahydrofuran"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.3},{"proton":"CH(o/p)","coupling":0,"multiplicity":"m","shift":7.18},{"proton":"CH(m)","coupling":0,"multiplicity":"m","shift":7.25}],"name":"toluene"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":0.93},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":2.43}],"name":"triethylamine"}]},
	    {"solvent":"C6D6","impurities":[{"shifts":[{"proton":"X","coupling":0,"multiplicity":"","shift":7.16}],"name":"solvent_residual_peak"},{"shifts":[{"proton":"H2O","coupling":0,"multiplicity":"s","shift":0.4}],"name":"H2O"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.55}],"name":"acetic_acid"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.55}],"name":"acetone"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.55}],"name":"acetonitrile"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.15}],"name":"benzene"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.05},{"proton":"OHc","coupling":0,"multiplicity":"s","shift":1.55}],"name":"tert-butyl_alcohol"},{"shifts":[{"proton":"CCH3","coupling":0,"multiplicity":"s","shift":1.07},{"proton":"OCH3","coupling":0,"multiplicity":"s","shift":3.04}],"name":"tert-butyl_methyl_ether"},{"shifts":[{"proton":"ArH","coupling":0,"multiplicity":"s","shift":7.05},{"proton":"OHc","coupling":0,"multiplicity":"s","shift":4.79},{"proton":"ArCH3","coupling":0,"multiplicity":"s","shift":2.24},{"proton":"ArC(CH3)3","coupling":0,"multiplicity":"s","shift":1.38}],"name":"BHTb"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":6.15}],"name":"chloroform"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":1.4}],"name":"cyclohexane"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":2.9}],"name":"1,2-dichloroethane"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":4.27}],"name":"dichloromethane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.11},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":3.26}],"name":"diethyl_ether"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"m","shift":3.46},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":3.34},{"proton":"OCH3","coupling":0,"multiplicity":"s","shift":3.11}],"name":"diglyme"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.12},{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.33}],"name":"1,2-dimethoxyethane"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":1.6},{"proton":"NCH3","coupling":0,"multiplicity":"s","shift":2.57},{"proton":"NCH3","coupling":0,"multiplicity":"s","shift":2.05}],"name":"dimethylacetamide"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.63},{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.36},{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.86}],"name":"dimethylformamide"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.68}],"name":"dimethyl_sulfoxide"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.35}],"name":"dioxane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":0.96},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":3.34}],"name":"ethanol"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":1.65},{"proton":"CH2CH3","coupling":7,"multiplicity":"q","shift":3.89},{"proton":"CH2CH3","coupling":7,"multiplicity":"t","shift":0.92}],"name":"ethyl_acetate"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":1.58},{"proton":"CH2CH3","coupling":7,"multiplicity":"q","shift":1.81},{"proton":"CH2CH3","coupling":7,"multiplicity":"t","shift":0.85}],"name":"ethyl_methyl_ketone"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":3.41}],"name":"ethylene_glycol"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"m","shift":0.92},{"proton":"CH2","coupling":0,"multiplicity":"br_s","shift":1.36}],"name":"grease^f"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"t","shift":0.89},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.24}],"name":"n-hexane"},{"shifts":[{"proton":"CH3","coupling":9.5,"multiplicity":"d","shift":2.4}],"name":"HMPAg"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.07}],"name":"methanol"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.94}],"name":"nitromethane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":0.86},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.23}],"name":"n-pentane"},{"shifts":[{"proton":"CH3","coupling":6,"multiplicity":"d","shift":0.95},{"proton":"CH","coupling":6,"multiplicity":"sep","shift":3.67}],"name":"2-propanol"},{"shifts":[{"proton":"CH(2)","coupling":0,"multiplicity":"m","shift":8.53},{"proton":"CH(3)","coupling":0,"multiplicity":"m","shift":6.66},{"proton":"CH(4)","coupling":0,"multiplicity":"m","shift":6.98}],"name":"pyridine"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":0.29}],"name":"silicone_greasei"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.4},{"proton":"CH2O","coupling":0,"multiplicity":"m","shift":3.57}],"name":"tetrahydrofuran"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.11},{"proton":"CH(o/p)","coupling":0,"multiplicity":"m","shift":7.02},{"proton":"CH(m)","coupling":0,"multiplicity":"m","shift":7.13}],"name":"toluene"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":0.96},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":2.4}],"name":"triethylamine"}]},
	    {"solvent":"CD3CN","impurities":[{"shifts":[{"proton":"X","coupling":0,"multiplicity":"","shift":1.94}],"name":"solvent_residual_peak"},{"shifts":[{"proton":"H2O","coupling":0,"multiplicity":"s","shift":2.13}],"name":"H2O"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.96}],"name":"acetic_acid"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.08}],"name":"acetone"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.96}],"name":"acetonitrile"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.37}],"name":"benzene"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.16},{"proton":"OHc","coupling":0,"multiplicity":"s","shift":2.18}],"name":"tert-butyl_alcohol"},{"shifts":[{"proton":"CCH3","coupling":0,"multiplicity":"s","shift":1.14},{"proton":"OCH3","coupling":0,"multiplicity":"s","shift":3.13}],"name":"tert-butyl_methyl_ether"},{"shifts":[{"proton":"ArH","coupling":0,"multiplicity":"s","shift":6.97},{"proton":"OHc","coupling":0,"multiplicity":"s","shift":5.2},{"proton":"ArCH3","coupling":0,"multiplicity":"s","shift":2.22},{"proton":"ArC(CH3)3","coupling":0,"multiplicity":"s","shift":1.39}],"name":"BHTb"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.58}],"name":"chloroform"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":1.44}],"name":"cyclohexane"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.81}],"name":"1,2-dichloroethane"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":5.44}],"name":"dichloromethane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.12},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":3.42}],"name":"diethyl_ether"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"m","shift":3.53},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":3.45},{"proton":"OCH3","coupling":0,"multiplicity":"s","shift":3.29}],"name":"diglyme"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.28},{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.45}],"name":"1,2-dimethoxyethane"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":1.97},{"proton":"NCH3","coupling":0,"multiplicity":"s","shift":2.96},{"proton":"NCH3","coupling":0,"multiplicity":"s","shift":2.83}],"name":"dimethylacetamide"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.92},{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.89},{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.77}],"name":"dimethylformamide"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.5}],"name":"dimethyl_sulfoxide"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.6}],"name":"dioxane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.12},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":3.54},{"proton":"OH","coupling":5,"multiplicity":"s,t","shift":2.47}],"name":"ethanol"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":1.97},{"proton":"CH2CH3","coupling":7,"multiplicity":"q","shift":4.06},{"proton":"CH2CH3","coupling":7,"multiplicity":"t","shift":1.2}],"name":"ethyl_acetate"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":2.06},{"proton":"CH2CH3","coupling":7,"multiplicity":"q","shift":2.43},{"proton":"CH2CH3","coupling":7,"multiplicity":"t","shift":0.96}],"name":"ethyl_methyl_ketone"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":3.51}],"name":"ethylene_glycol"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"m","shift":0.86},{"proton":"CH2","coupling":0,"multiplicity":"br_s","shift":1.27}],"name":"grease^f"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"t","shift":0.89},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.28}],"name":"n-hexane"},{"shifts":[{"proton":"CH3","coupling":9.5,"multiplicity":"d","shift":2.57}],"name":"HMPAg"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.28},{"proton":"OH","coupling":0,"multiplicity":"s","shift":2.16}],"name":"methanol"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":4.31}],"name":"nitromethane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":0.87},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.29}],"name":"n-pentane"},{"shifts":[{"proton":"CH3","coupling":6,"multiplicity":"d","shift":1.09},{"proton":"CH","coupling":6,"multiplicity":"sep","shift":3.87}],"name":"2-propanol"},{"shifts":[{"proton":"CH(2)","coupling":0,"multiplicity":"m","shift":8.57},{"proton":"CH(3)","coupling":0,"multiplicity":"m","shift":7.33},{"proton":"CH(4)","coupling":0,"multiplicity":"m","shift":7.73}],"name":"pyridine"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":0.08}],"name":"silicone_greasei"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.8},{"proton":"CH2O","coupling":0,"multiplicity":"m","shift":3.64}],"name":"tetrahydrofuran"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.33},{"proton":"CH(o/p)","coupling":0,"multiplicity":"m","shift":7.2},{"proton":"CH(m)","coupling":0,"multiplicity":"m","shift":7.2}],"name":"toluene"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":0.96},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":2.45}],"name":"triethylamine"}]},
	    {"solvent":"CD3OD","impurities":[{"shifts":[{"proton":"X","coupling":0,"multiplicity":"","shift":3.31}],"name":"solvent_residual_peak"},{"shifts":[{"proton":"H2O","coupling":0,"multiplicity":"s","shift":4.87}],"name":"H2O"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.99}],"name":"acetic_acid"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.15}],"name":"acetone"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.03}],"name":"acetonitrile"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.33}],"name":"benzene"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.4}],"name":"tert-butyl_alcohol"},{"shifts":[{"proton":"CCH3","coupling":0,"multiplicity":"s","shift":1.15},{"proton":"OCH3","coupling":0,"multiplicity":"s","shift":3.2}],"name":"tert-butyl_methyl_ether"},{"shifts":[{"proton":"ArH","coupling":0,"multiplicity":"s","shift":6.92},{"proton":"ArCH3","coupling":0,"multiplicity":"s","shift":2.21},{"proton":"ArC(CH3)3","coupling":0,"multiplicity":"s","shift":1.4}],"name":"BHTb"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.9}],"name":"chloroform"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":1.45}],"name":"cyclohexane"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.78}],"name":"1,2-dichloroethane"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":5.49}],"name":"dichloromethane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.18},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":3.49}],"name":"diethyl_ether"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"m","shift":3.61},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":3.58},{"proton":"OCH3","coupling":0,"multiplicity":"s","shift":3.35}],"name":"diglyme"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.35},{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.52}],"name":"1,2-dimethoxyethane"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":2.07},{"proton":"NCH3","coupling":0,"multiplicity":"s","shift":3.31},{"proton":"NCH3","coupling":0,"multiplicity":"s","shift":2.92}],"name":"dimethylacetamide"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.97},{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.99},{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.86}],"name":"dimethylformamide"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.65}],"name":"dimethyl_sulfoxide"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.66}],"name":"dioxane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.19},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":3.6}],"name":"ethanol"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":2.01},{"proton":"CH2CH3","coupling":7,"multiplicity":"q","shift":4.09},{"proton":"CH2CH3","coupling":7,"multiplicity":"t","shift":1.24}],"name":"ethyl_acetate"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":2.12},{"proton":"CH2CH3","coupling":7,"multiplicity":"q","shift":2.5},{"proton":"CH2CH3","coupling":7,"multiplicity":"t","shift":1.01}],"name":"ethyl_methyl_ketone"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":3.59}],"name":"ethylene_glycol"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"m","shift":0.88},{"proton":"CH2","coupling":0,"multiplicity":"br_s","shift":1.29}],"name":"grease^f"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"t","shift":0.9},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.29}],"name":"n-hexane"},{"shifts":[{"proton":"CH3","coupling":9.5,"multiplicity":"d","shift":2.64}],"name":"HMPAg"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.34}],"name":"methanol"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":4.34}],"name":"nitromethane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":0.89},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.29}],"name":"n-pentane"},{"shifts":[{"proton":"CH3","coupling":6,"multiplicity":"d","shift":1.5},{"proton":"CH","coupling":6,"multiplicity":"sep","shift":3.92}],"name":"2-propanol"},{"shifts":[{"proton":"CH(2)","coupling":0,"multiplicity":"m","shift":8.53},{"proton":"CH(3)","coupling":0,"multiplicity":"m","shift":7.44},{"proton":"CH(4)","coupling":0,"multiplicity":"m","shift":7.85}],"name":"pyridine"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":0.1}],"name":"silicone_greasei"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.87},{"proton":"CH2O","coupling":0,"multiplicity":"m","shift":3.71}],"name":"tetrahydrofuran"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.32},{"proton":"CH(o/p)","coupling":0,"multiplicity":"m","shift":7.16},{"proton":"CH(m)","coupling":0,"multiplicity":"m","shift":7.16}],"name":"toluene"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.05},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":2.58}],"name":"triethylamine"}]},
	    {"solvent":"D2O","impurities":[{"shifts":[{"proton":"X","coupling":0,"multiplicity":"","shift":4.79}],"name":"solvent_residual_peak"},{"shifts":[],"name":"H2O"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.08}],"name":"acetic_acid"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.22}],"name":"acetone"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.06}],"name":"acetonitrile"},{"shifts":[],"name":"benzene"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.24}],"name":"tert-butyl_alcohol"},{"shifts":[{"proton":"CCH3","coupling":0,"multiplicity":"s","shift":1.21},{"proton":"OCH3","coupling":0,"multiplicity":"s","shift":3.22}],"name":"tert-butyl_methyl_ether"},{"shifts":[],"name":"BHTb"},{"shifts":[],"name":"chloroform"},{"shifts":[],"name":"cyclohexane"},{"shifts":[],"name":"1,2-dichloroethane"},{"shifts":[],"name":"dichloromethane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.17},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":3.56}],"name":"diethyl_ether"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"m","shift":3.67},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":3.61},{"proton":"OCH3","coupling":0,"multiplicity":"s","shift":3.37}],"name":"diglyme"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.37},{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.6}],"name":"1,2-dimethoxyethane"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":2.08},{"proton":"NCH3","coupling":0,"multiplicity":"s","shift":3.06},{"proton":"NCH3","coupling":0,"multiplicity":"s","shift":2.9}],"name":"dimethylacetamide"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.92},{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.01},{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.85}],"name":"dimethylformamide"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.71}],"name":"dimethyl_sulfoxide"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.75}],"name":"dioxane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.17},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":3.65}],"name":"ethanol"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":2.07},{"proton":"CH2CH3","coupling":7,"multiplicity":"q","shift":4.14},{"proton":"CH2CH3","coupling":7,"multiplicity":"t","shift":1.24}],"name":"ethyl_acetate"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":2.19},{"proton":"CH2CH3","coupling":7,"multiplicity":"q","shift":3.18},{"proton":"CH2CH3","coupling":7,"multiplicity":"t","shift":1.26}],"name":"ethyl_methyl_ketone"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":3.65}],"name":"ethylene_glycol"},{"shifts":[],"name":"grease^f"},{"shifts":[],"name":"n-hexane"},{"shifts":[{"proton":"CH3","coupling":9.5,"multiplicity":"d","shift":2.61}],"name":"HMPAg"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.34}],"name":"methanol"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":4.4}],"name":"nitromethane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":0.9}],"name":"n-pentane"},{"shifts":[{"proton":"CH3","coupling":6,"multiplicity":"d","shift":1.17},{"proton":"CH","coupling":6,"multiplicity":"sep","shift":4.02}],"name":"2-propanol"},{"shifts":[{"proton":"CH(2)","coupling":0,"multiplicity":"m","shift":8.52},{"proton":"CH(3)","coupling":0,"multiplicity":"m","shift":7.45},{"proton":"CH(4)","coupling":0,"multiplicity":"m","shift":7.87}],"name":"pyridine"},{"shifts":[],"name":"silicone_greasei"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.88},{"proton":"CH2O","coupling":0,"multiplicity":"m","shift":3.74}],"name":"tetrahydrofuran"},{"shifts":[],"name":"toluene"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":0.99},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":2.57}],"name":"triethylamine"}]}];

	var look4 = "solvent_residual_peak"+"H2O"+"TMS";
	//var pascalTriangle = [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1],[1,5,10,10,5,1],[1,6,15,20,15,6,1]];
	//var patterns = ["s","d","t","q","quint","h","sept","o","n"];

	function removeSignal(peak, noiseSignal){

	}

	function checkImpurity(peakList, impurity){
	    var error = 0.025,i;
	    var found = false;
	    var indexes = new Array(impurity.length);
	    for(i=0;i<impurity.length;i++){
	        found=false;
	        for(var j=0;j<peakList.length;j++){
	            if(Math.abs(impurity[i].shift-peakList[j].delta1)<
	                (error+Math.abs(peakList[j].startX-peakList[j].stopX)/2)&&
	                (impurity[i].multiplicity===""||
	                (impurity[i].multiplicity.indexOf(peakList[j].multiplicity)>=0&&!peakList[j].asymmetric))){
	                found = true;
	                indexes[i]=j;
	                break;
	            }
	        }
	        if(!found)
	            break;
	    }

	    var toRemove = [];
	    if(found){
	        for(i=0;i<impurity.length;i++){
	            toRemove.push(indexes[i]);
	        }
	    }
	    else
	        return 0;
	    for(i=0;i<toRemove.length;i++){
	        peakList[toRemove[i]].integralData.value = 0;
	    }
	    return 1;
	}

	function removeImpurities(peakList, solvent, nH){
	    var impurities = null, i;
	    for(i=0;i<impuritiesList.length;i++){
	        if(impuritiesList[i].solvent.indexOf(solvent)>=0){
	            impurities = impuritiesList[i].impurities;
	            break;
	        }
	    }
	    impurities.push({"shifts":[{"proton":"X","coupling":0,"multiplicity":"","shift":0.0}],"name":"TMS"});
	    var nCols = peakList.length;
	    var nRows = impurities.length;
	    var scores = new Array(nRows);
	    for(i=0;i<nRows;i++){
	        if( look4.indexOf(impurities[i].name)>=0){
	            scores[i]=checkImpurity(peakList, impurities[i].shifts);
	        }
	    }
	    //Recompute the integrals
	    var sumObserved=0;
	    for(i=0;i<peakList.length;i++){
	        sumObserved+=peakList[i].integralData.value;
	    }
	    if(sumObserved!=nH){
	        sumObserved=nH/sumObserved;
	        for(i=0;i<peakList.length;i++){
	            peakList[i].integralData.value*=sumObserved;
	        }
	    }
	}

	module.exports = removeImpurities;

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.FFTUtils = __webpack_require__(49);
	exports.FFT = __webpack_require__(50);


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	var FFT = __webpack_require__(50);

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
/* 50 */
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
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * Created by abol on 4/20/16.
	 */
	module.exports.fourierTransform = __webpack_require__(52);
	module.exports.zeroFilling = __webpack_require__(53);
	module.exports.apodization = __webpack_require__(54);
	module.exports.phaseCorrection = __webpack_require__(55);
	module.exports.digitalFilter = __webpack_require__(56);


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * Created by abol on 4/20/16.
	 */
	var fft = __webpack_require__(48);

	function fourierTransform(spectraData){
	    //console.log(spectraData);

	    var nbPoints = spectraData.getNbPoints();
	    var nSubSpectra = spectraData.getNbSubSpectra() / 2;
	    var spectraType = "NMR SPECTRUM";//spectraData.TYPE_NMR_SPECTRUM;
	    var FFT = fft.FFT;
	    if (nSubSpectra > 1)
	        spectraType = "nD NMR SPECTRUM";//spectraData.TYPE_2DNMR_SPECTRUM;

	    FFT.init(nbPoints);


	    var fcor = spectraData.getParamDouble("$FCOR", 0.0);
	    //var tempArray = new Array(nbPoints / 2);
	    for (var iSubSpectra = 0; iSubSpectra < nSubSpectra; iSubSpectra++)
	    {
	        var re = spectraData.getYData(2 * iSubSpectra);
	        var im = spectraData.getYData(2 * iSubSpectra + 1);
	        if (false) {
	            console.log("firstPoint: (" + re[0] + "," + im[0] + ")");
	            console.log("fcor: " + fcor);
	        }
	        re[0] *= fcor;
	        im[0] *= fcor;

	        FFT.fft(re, im);
	        re = re.concat(re.slice(0,(nbPoints+1)/2));
	        re.splice(0, (nbPoints+1)/2);
	        im = im.concat(im.slice(0,(nbPoints+1)/2));
	        im.splice(0, (nbPoints+1)/2);

	        spectraData.setActiveElement(2 * iSubSpectra);
	        updateSpectra(spectraData, spectraType);

	        spectraData.setActiveElement(2 * iSubSpectra + 1);
	        updateSpectra(spectraData, spectraType);
	    }
	    //TODO For Alejandro
	    //Now we can try to apply the FFt on the second dimension
	    if(spectraData.is2D()){
	        var mode = spectraData.getParam(".ACQUISITION SCHEME");
	        switch(mode){
	            case 1://"State-TPP"
	                break;
	            case 2://State
	                break;
	            case 3://Echo-Antiecho
	                break;
	            defaut:
	                //QF
	                //Does not transform in the indirect dimension
	            break;

	        }
	    }
	    spectraData.setActiveElement(0);
	    return spectraData;
	}

	function updateSpectra(spectraData, spectraType){
	    var baseFrequency = spectraData.getParamDouble("$BF1", NaN);
	    var spectralFrequency = spectraData.getParamDouble("$SFO1", NaN);
	    var spectralWidth = spectraData.getParamDouble("$SW", NaN);
	    var xMiddle = ((spectralFrequency - baseFrequency) / baseFrequency )* 1e6;
	    var dx = 0.5 * spectralWidth * spectralFrequency / baseFrequency;

	    spectraData.setDataType(spectraType);
	    spectraData.setFirstX(xMiddle + dx);
	    spectraData.setLastX(xMiddle - dx);
	    spectraData.setXUnits("PPM");

	    var x = spectraData.getXData();
	    var tmp = xMiddle + dx;
	    dx = -2*dx/(x.length-1);
	    for(var i=0;i< x.length;i++){
	        x[i]= tmp;
	        tmp+=dx;
	    }

	    //TODO update minmax in Y axis
	}

	module.exports = fourierTransform;

/***/ },
/* 53 */
/***/ function(module, exports) {

	'use strict';
	/**
	 * Created by abol on 4/20/16.
	 */

	function zeroFilling(spectraData, zeroFillingX, zeroFillingY){
	    var nbSubSpectra = spectraData.getNbSubSpectra();
	    //var zeroPadding = spectraData.getParamDouble("$$ZEROPADDING", 0);
	    var nbXPoints, lastX, deltaX, k, x, y;
	    if (zeroFillingX != 0){
	        for (var iSubSpectra = 0 ; iSubSpectra < nbSubSpectra; iSubSpectra++){
	            spectraData.setActiveElement(iSubSpectra);
	            nbXPoints = spectraData.getNbPoints();
	            y = spectraData.getYData();
	            x = spectraData.getXData();
	            lastX = spectraData.getLastX();
	            deltaX = (lastX-x[0])/(nbXPoints-1);
	            for (k = nbXPoints; k < zeroFillingX; k++){
	                y.push(0);
	                x.push(lastX+deltaX);
	            }
	            if (zeroFillingX < nbXPoints){
	                y.splice(zeroFillingX, y.length-1);
	                x.splice(zeroFillingX, x.length-1);
	            }
	            spectraData.setFirstX(x[0]);
	            spectraData.setLastX(x[x.length-1]);
	        }
	    }
	    spectraData.setActiveElement(0);
	    return spectraData;
	    // @TODO implement zeroFillingY
	}
	module.exports = zeroFilling;

/***/ },
/* 54 */
/***/ function(module, exports) {

	'use strict';
	/**
	 * Created by acastillo on 4/26/16.
	 */

	function apodization(spectraData, parameters){
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

	module.exports = apodization;

/***/ },
/* 55 */
/***/ function(module, exports) {

	'use strict';
	/**
	 * Created by acastillo on 4/26/16.
	 */
	function phaseCorrection(spectraData, phi0, phi1){
	    //System.out.println(spectraData.toString());
	    var nbPoints = spectraData.getNbPoints();
	    var reData = spectraData.getYData(0);
	    var imData = spectraData.getYData(1);
	    //var corrections = spectraData.getParam("corrections");

	    //for(var k=0;k<corrections.length;k++){
	    //    Point2D phi = corrections.elementAt(k);

	        //double phi0 = phi.getX();
	        //double phi1 = phi.getY();

	    if(false) System.out.println(" ph0 = "+phi0);
	    if(false) System.out.println(" ph1 = "+phi1);

	    var delta = phi1 / nbPoints;
	    var alpha = 2 * Math.pow(Math.sin(delta / 2), 2);
	    var beta = Math.sin(delta);
	    var cosTheta = Math.cos(phi0);
	    var sinTheta = Math.sin(phi0);
	    var cosThetaNew, sinThetaNew;

	    var reTmp, imTmp;
	    var index;
	        for (var i = 0; i < nbPoints; i++) {
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
	        //toApply--;
	    //}

	    spectraData.resetMinMax();
	    //spectraData.updateDefaults();
	    //spectraData.updateY();
	    spectraData.putParam("PHC0", phi0);
	    spectraData.putParam("PHC1", phi1);
	}

	module.exports = phaseCorrection;

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * Created by acastillo on 4/26/16.
	 */
	var rotate = __webpack_require__(57);

	function digitalFilter(spectraData, options){
	    var nbPoints = 0;
	    if(options.nbPoints){
	        nbPoints = options.nbPoints;
	    }
	    else{
	        if(options.brukerFilter){
	            //TODO Determine the number of points to shift, or the ph1 correction
	            //based on DECIM and DSPSVF parameters
	            nbPoints = 0;
	        }
	    }

	    var nbSubSpectra = spectraData.getNbSubSpectra();
	    if (nbPoints != 0){
	        for (var iSubSpectra = 0 ; iSubSpectra < nbSubSpectra; iSubSpectra++){
	            spectraData.setActiveElement(iSubSpectra);
	            rotate(spectraData.getYData(),nbPoints);
	            if(options.rotateX){
	                rotate(spectraData.getXData(),nbPoints);
	                spectraData.setFirstX(spectraData.getX(0));
	                spectraData.setLastX(spectraData.getX(spectraData.getNbPoints()-1));
	            }
	        }
	    }
	    spectraData.setActiveElement(0);
	    return spectraData;
	}

	module.exports = digitalFilter;

/***/ },
/* 57 */
/***/ function(module, exports) {

	'use strict';
	/**
	 * Created by acastillo on 4/26/16.
	 */
	/**
	 * This function performs a circular shift of the input object without realocating memory.
	 * Positive values of shifts will shift to the right and negative values will do to the left
	 * @example rotate([1,2,3,4],1) -> [4,1,2,3]
	 * @example rotate([1,2,3,4],-1) -> [2,3,4,1]
	 * @param array
	 */
	function rotate(array,shift){
	    var nbPoints = array.length;
	    //Lets calculate the lest amount of points to shift.
	    //It decreases the amount of validations in the loop
	    shift = shift%nbPoints;

	    if(Math.abs(shift)>nbPoints/2){
	        shift = shift>0?shift-nbPoints:shift+nbPoints;
	    }

	    if(shift!=0){
	        var currentIndex=0, nextIndex=shift;
	        var toMove = nbPoints;
	        var current = array[currentIndex], next;
	        var lastFirstIndex = shift;
	        var direction = shift>0?1:-1;

	        while(toMove>0){
	            nextIndex = putInRange(nextIndex,nbPoints);
	            next = array[nextIndex];
	            array[nextIndex] = current;
	            nextIndex+=shift;
	            current = next;
	            toMove--;

	            if(nextIndex==lastFirstIndex){
	                nextIndex = putInRange(nextIndex+direction,nbPoints);
	                lastFirstIndex = nextIndex;
	                currentIndex = putInRange(nextIndex-shift,nbPoints);
	                current = array[currentIndex];
	            }
	        }
	    }
	}

	function putInRange(value, nbPoints){
	    if(value<0)
	        value+=nbPoints;
	    if(value>=nbPoints)
	        value-=nbPoints;
	    return value;
	}

	module.exports = rotate;


	/*var foo = [1,2,3,4,5,6];
	rotate(foo,-4);
	console.log(foo);*/

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var SD = __webpack_require__(1);
	var peakPicking2D = __webpack_require__(59);
	var PeakOptimizer = __webpack_require__(60);
	var JcampConverter=__webpack_require__(10);
	//var stat = require("ml-stat");

	/**
	 * Construct the object from the given sd object(output of the jcampconverter or brukerconverter filter)
	 * @param sd
	 * @constructor
	 */
	function NMR2D(sd) {
	    SD.call(this, sd); // Héritage
	}

	NMR2D.prototype = Object.create(SD.prototype);
	NMR2D.prototype.constructor = NMR2D;

	/**
	 * @function fromJcamp(jcamp,options)
	 * Construct the object from the given jcamp.
	 * @param jcamp
	 * @param options
	 * @option xy
	 * @option keepSpectra
	 * @option keepRecordsRegExp
	 * @returns {NMR2D}
	 */
	NMR2D.fromJcamp = function(jcamp,options) {
	    options = Object.assign({}, {xy:true,keepSpectra:true,keepRecordsRegExp:/^.+$/}, options);
	    var spectrum= JcampConverter.convert(jcamp,options);
	    return new NMR2D(spectrum);
	}

	/**
	 * @function isHomoNuclear()
	 * Returns true if the it is an homo-nuclear experiment
	 * @returns {boolean}
	 */
	NMR2D.prototype.isHomoNuclear=function(){
	    return this.sd.xType==this.sd.yType;
	}

	/**
	 * @function observeFrequencyX()
	 * Returns the observe frequency in the direct dimension
	 * @returns {*}
	 */
	NMR2D.prototype.observeFrequencyX=function(){
	    return this.sd.spectra[0].observeFrequency;
	}
	/**
	 * @function observeFrequencyY()
	 * Returns the observe frequency in the indirect dimension
	 * @returns {*}
	 */
	NMR2D.prototype.observeFrequencyY=function(){
	    return this.sd.indirectFrequency;
	}

	/**
	 * @function getSolventName()
	 * Returns the solvent name.
	 * @returns {string|XML}
	 */
	NMR2D.prototype.getSolventName=function(){
	    return (this.sd.info[".SOLVENTNAME"]||this.sd.info["$SOLVENT"]).replace("<","").replace(">","");
	}

	/**
	 * @function getXUnits()
	 * This function returns the units of the direct dimension. It overrides the SD getXUnits function
	 * @returns {ntuples.units|*|b.units}
	 */
	NMR2D.prototype.getXUnits = function(){
	    return this.sd.ntuples[1].units;
	}
	/**
	 * @function getYUnits()
	 * This function returns the units of the indirect dimension. It overrides the SD getYUnits function
	 * @returns {ntuples.units|*|b.units}
	 */
	NMR2D.prototype.getYUnits = function(){
	    return this.sd.ntuples[0].units;
	}
	/**
	 * @function getZUnits()
	 * Returns the units of the dependent variable
	 * @returns {ntuples.units|*|b.units}
	 */
	NMR2D.prototype.getZUnits = function(){
	    return this.sd.ntuples[2].units;
	}
	/**
	 * @function getLastY()
	 * Returns the min value in the indirect dimension.
	 * @returns {sd.minMax.maxY}
	 */
	NMR2D.prototype.getLastY = function(){
	    return this.sd.minMax.maxY;
	}
	/**
	 * @function getFirstY()
	 * Returns the min value in the indirect dimension.
	 * @returns {sd.minMax.minY}
	 */
	NMR2D.prototype.getFirstY = function(){
	    return this.sd.minMax.minY;
	}
	/**
	 * @function getDeltaY()
	 * Returns the separation between 2 consecutive points in the indirect domain
	 * @returns {number}
	 */
	NMR2D.prototype.getDeltaY=function(){
	    return ( this.getLastY()-this.getFirstY()) / (this.getNbSubSpectra()-1);
	}

	/**
	 * @function nmrPeakDetection2D(options)
	 * This function process the given spectraData and tries to determine the NMR signals. 
	 + Returns an NMRSignal2D array containing all the detected 2D-NMR Signals
	 * @param	options:+Object			Object containing the options
	 * @option	thresholdFactor:number	A factor to scale the automatically determined noise threshold.
	 * @returns [*]	set of NMRSignal2D
	 */
	NMR2D.prototype.nmrPeakDetection2D=function(options){
	    options = options||{};
	    if(!options.thresholdFactor)
	        options.thresholdFactor=1;
	    var id = Math.round(Math.random()*255);
	    if(options.idPrefix){
	        id=options.idPrefix;
	    }
	    var peakList = peakPicking2D(this, options.thresholdFactor);

	    //lets add an unique ID for each peak.
	    for(var i=0;i<peakList.length;i++){
	        peakList[i]._highlight=[id+"_"+i];
	        peakList[i].signalID = id+"_"+i;
	    }
	    if(options.references)
	        PeakOptimizer.alignDimensions(peakList,options.references);

	    if(options.format==="new"){
	        var newSignals = new Array(peakList.length);
	        var minMax1, minMax2;
	        for(var k=peakList.length-1;k>=0;k--){
	            var signal = peakList[k];
	            newSignals[k]={
	                fromTo:signal.fromTo,
	                integral:signal.intensity||1,
	                remark:"",
	                signal:[{
	                    peak:signal.peaks,
	                    delta:[signal.shiftX, signal.shiftY]
	                }],
	                _highlight:signal._highlight,
	                signalID:signal.signalID,
	            };
	        }
	        peakList = newSignals;
	    }


	    return peakList;
	}

	/**
	 * @function getNMRPeakThreshold(nucleus)
	 * Returns the noise factor depending on the nucleus.
	 * @param nucleus
	 * @returns {number}
	 */
	NMR2D.prototype.getNMRPeakThreshold=function(nucleus) {
	    if (nucleus == "1H")
	        return 3.0;
	    if (nucleus =="13C")
	        return 5.0;
	    return 1.0;
	}

	/**
	 * @function getNucleus(dim)
	 * Returns the observed nucleus in the specified dimension
	 * @param dim
	 * @returns {string}
	 */
	NMR2D.prototype.getNucleus=function(dim){
	    if(dim==1)
	        return this.sd.xType;
	    if(dim==2)
	        return this.sd.yType;
	    return this.sd.xType;
	}


	/**
	 * @function zeroFilling(nPointsX [,nPointsY])
	 * This function increase the size of the spectrum, filling the new positions with zero values. Doing it one
	 * could increase artificially the spectral resolution.
	 * @param nPointsX Number of new zero points in the direct dimension
	 * @param nPointsY Number of new zero points in the indirect dimension
	 * @returns this object
	 */
	NMR2D.prototype.zeroFilling=function(nPointsX, nPointsY) {
	    return Filters.zeroFilling(this,nPointsX, nPointsY);
	}

	/**
	 * @function brukerFilter()
	 * This filter applies a circular shift(phase 1 correction in the time domain) to an NMR FID spectrum that
	 * have been obtained on spectrometers using the Bruker digital filters. The amount of shift depends on the
	 * parameters DECIM and DSPFVS. This spectraData have to be of type NMR_FID
	 * @returns this object
	 */
	NMR2D.prototype.brukerFilter=function() {
	    return Filters.digitalFilter(this, {"brukerFilter":true});
	}

	/**
	 * @function digitalFilter(options)
	 * This filter applies a circular shift(phase 1 correction in the time domain) to an NMR FID spectrum that
	 * have been obtained on spectrometers using the Bruker digital filters. The amount of shift depends on the
	 * parameters DECIM and DSPFVS. This spectraData have to be of type NMR_FID
	 * @option nbPoints: The number of points to shift. Positive values will shift the values to the rigth
	 * and negative values will do to the left.
	 * @option brukerSpectra
	 * @returns this object
	 */
	NMR2D.prototype.digitalFilter=function(options) {
	    return Filters.digitalFilter(this, options);
	}


	/**
	 * @function fourierTransform()
	 * Fourier transforms the given spectraData (Note. no 2D handling yet) this spectraData have to be of type NMR_FID or 2DNMR_FID
	 * @returns this object
	 */
	NMR2D.prototype.fourierTransform=function( ) {
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
	 * @returns this object
	 */
	NMR2D.prototype.postFourierTransform=function(ph1corr) {
	    return Filters.phaseCorrection(0,ph1corr);
	}

	module.exports = NMR2D;


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var PeakOptimizer = __webpack_require__(60);
	var simpleClustering =  __webpack_require__(61);
	var matrixPeakFinders =  __webpack_require__(62);
	var FFTUtils = __webpack_require__(48).FFTUtils;

	const DEBUG = false;
	const smallFilter = [
	    [0, 0, 1, 2, 2, 2, 1, 0, 0],
	    [0, 1, 4, 7, 7, 7, 4, 1, 0],
	    [1, 4, 5, 3, 0, 3, 5, 4, 1],
	    [2, 7, 3, -12, -23, -12, 3, 7, 2],
	    [2, 7, 0, -23, -40, -23, 0, 7, 2],
	    [2, 7, 3, -12, -23, -12, 3, 7, 2],
	    [1, 4, 5, 3, 0, 3, 5, 4, 1],
	    [0, 1, 3, 7, 7, 7, 3, 1, 0],
	    [0, 0, 1, 2, 2, 2, 1, 0, 0]];

	module.exports  = function(spectraData, thresholdFactor){
	    if(thresholdFactor==0)
	        thresholdFactor=1;
	    if(thresholdFactor<0)
	        thresholdFactor=-thresholdFactor;
	    var nbPoints = spectraData.getNbPoints();
	    var nbSubSpectra = spectraData.getNbSubSpectra();

	    var data = new Array(nbPoints * nbSubSpectra);
	    var isHomonuclear = spectraData.isHomoNuclear();

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

	    var nStdDev = getLoGnStdDevNMR(spectraData);
	    if(isHomonuclear){
	        var convolutedSpectrum = FFTUtils.convolute(data, smallFilter, nbSubSpectra, nbPoints);
	        var peaksMC1 = matrixPeakFinders.findPeaks2DRegion(data, {filteredData:convolutedSpectrum, rows:nbSubSpectra, cols: nbPoints, nStdDev:nStdDev*thresholdFactor});//)1.5);
	        var peaksMax1 = matrixPeakFinders.findPeaks2DMax(data, {filteredData:convolutedSpectrum, rows:nbSubSpectra, cols: nbPoints, nStdDev:(nStdDev+0.5)*thresholdFactor});//2.0);
	        for(var i=0;i<peaksMC1.length;i++)
	            peaksMax1.push(peaksMC1[i]);
	        return PeakOptimizer.enhanceSymmetry(createSignals2D(peaksMax1,spectraData,24));

	    }
	    else{
	        var convolutedSpectrum = FFTUtils.convolute(data, smallFilter, nbSubSpectra, nbPoints);
	        var peaksMC1 = matrixPeakFinders.findPeaks2DRegion(data, {filteredData: convolutedSpectrum, rows: nbSubSpectra, cols: nbPoints, nStdDev: nStdDev*thresholdFactor});
	        //Peak2D[] peaksMC1 = matrixPeakFinders.findPeaks2DMax(data, nbSubSpectra, nbPoints, (nStdDev+0.5)*thresholdFactor);
	        //Remove peaks with less than 3% of the intensity of the highest peak
	        return createSignals2D(PeakOptimizer.clean(peaksMC1, 0.05), spectraData,24);
	    }

	}


	//How noisy is the spectrum depending on the kind of experiment.
	function getLoGnStdDevNMR(spectraData) {
	    if (spectraData.isHomoNuclear())
	        return 1.5
	    else
	        return 3;
	}

	/**
	 This function converts a set of 2D-peaks in 2D-signals. Each signal could be composed
	 of many 2D-peaks, and it has some additional information related to the NMR spectrum.
	 */
	function createSignals2D(peaks, spectraData, tolerance){

	    var bf1=spectraData.observeFrequencyX();
	    var bf2=spectraData.observeFrequencyY();

	    var firstY = spectraData.getFirstY();
	    var dy = spectraData.getDeltaY();

	    for (var i = peaks.length-1; i >=0 ; i--) {
	        peaks[i].x=(spectraData.arrayPointToUnits(peaks[i].x));
	        peaks[i].y=(firstY + dy * (peaks[i].y));

	        //Still having problems to correctly detect peaks on those areas. So I'm removing everything there.
	        if(peaks[i].y<-1||peaks[i].y>=210){
	            peaks.splice(i,1);
	        }
	    }
	    //The connectivity matrix is an square and symmetric matrix, so we'll only store the upper diagonal in an
	    //array like form
	    var connectivity = [];
	    var tmp=0;
	    tolerance*=tolerance;
	    //console.log(tolerance);
	    for (var i = 0; i < peaks.length; i++) {
	        for (var j = i; j < peaks.length; j++) {
	            tmp=Math.pow((peaks[i].x-peaks[j].x)*bf1,2)+Math.pow((peaks[i].y-peaks[j].y)*bf2,2);
	            if(tmp<tolerance){//30*30Hz We cannot distinguish peaks with less than 20 Hz of separation
	                connectivity.push(1);
	            }
	            else{
	                connectivity.push(0);
	            }
	        }
	    }

	    var clusters = simpleClustering(connectivity);

	    var signals = [];
	    if (peaks != null) {
	        for (var iCluster = 0; iCluster < clusters.length; iCluster++) {
	            var signal={nucleusX:spectraData.getNucleus(1),nucleusY:spectraData.getNucleus(2)};
	            signal.resolutionX=( spectraData.getLastX()-spectraData.getFirstX()) / spectraData.getNbPoints();
	            signal.resolutionY=dy;
	            var peaks2D = [];
	            signal.shiftX = 0;
	            signal.shiftY = 0;
	            var minMax1 = [Number.MAX_VALUE,0];
	            var minMax2 = [Number.MAX_VALUE,0];
	            var sumZ = 0;
	            for(var jPeak = clusters[iCluster].length-1;jPeak>=0;jPeak--){
	                if(clusters[iCluster][jPeak]==1){
	                    peaks2D.push({
	                        x: peaks[jPeak].x,
	                        y: peaks[jPeak].y,
	                        z: peaks[jPeak].z

	                    }  );
	                    signal.shiftX+=peaks[jPeak].x*peaks[jPeak].z;
	                    signal.shiftY+=peaks[jPeak].y*peaks[jPeak].z;
	                    sumZ+=peaks[jPeak].z;
	                    if(peaks[jPeak].x<minMax1[0]){
	                        minMax1[0]=peaks[jPeak].x;
	                    }
	                    if(peaks[jPeak].x>minMax1[1]){
	                        minMax1[1]=peaks[jPeak].x;
	                    }
	                    if(peaks[jPeak].y<minMax2[0]){
	                        minMax2[0]=peaks[jPeak].y
	                    }
	                    if(peaks[jPeak].y>minMax2[1]){
	                        minMax2[1]=peaks[jPeak].y;
	                    }

	                }
	            }
	            signal.fromTo = [{from:minMax1[0],to:minMax1[1]},
	                {from:minMax2[0],to:minMax2[1]}];
	            signal.shiftX/=sumZ;
	            signal.shiftY/=sumZ;
	            signal.peaks = peaks2D;
	            signals.push(signal);
	        }
	    }
	    return signals;
	}

/***/ },
/* 60 */
/***/ function(module, exports) {

	'use strict';


	var diagonalError=0.05;
	var	tolerance=0.05;
	const	DEBUG=false;

	module.exports={

	    clean: function(peaks, threshold){
	        var max = Number.NEGATIVE_INFINITY;
	        var i;
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
			
			var properties = initializeProperties(signals);
			var output = signals;

			if(DEBUG)
				console.log("Before optimization size: "+output.size());
			
			//First step of the optimization: Symmetry validation
			var i,hits,index;
			var signal;
			for(i=output.length-1;i>=0;i--){
				signal = output[i];
				if(signal.peaks.length>1)
					properties[i][1]++;
				if(properties[i][0]==1){
					index = exist(output, properties, signal,-1,true);
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
					hits = checkCrossPeaks(output, properties, signal, true);
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
					count+=completeMissingIfNeeded(output,properties,output[i],properties[i]);
				}
				if(properties[i][1]>=2&&properties[i][0]===0)
					count++;
			}
			
			if(DEBUG)
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

		/**
		 * This function maps the corresponding 2D signals to the given set of 1D signals
		 */
		alignDimensions: function(signals2D,references){
			//For each reference dimension
			for(var i=0;i<references.length;i++){
				var ref = references[i];
				if(ref)
					alignSingleDimension(signals2D,ref);
			}
		}
	};

	function completeMissingIfNeeded(output, properties, thisSignal, thisProp) {
		//Check for symmetry
		var index = exist(output, properties, thisSignal,-thisProp[0],true);
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
				if(Math.abs(signal.shiftX-thisSignal.shiftX)<diagonalError)
					diagX=true;
				if(Math.abs(signal.shiftY-thisSignal.shiftY)<diagonalError)
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

	}

	//Check for any diagonal peak that match this cross peak
	function checkCrossPeaks(output, properties, signal, updateProperties) {
		var hits = 0, i=0, shift=signal.shiftX*4;
		var crossPeaksX = [],crossPeaksY = [];
		var cross;
		for(i=output.length-1;i>=0;i--){
			cross = output[i];
			if(properties[i][0]!==0){
				if(Math.abs(cross.shiftX-signal.shiftX)<diagonalError){
					hits++;
					if(updateProperties)
						properties[i][1]++;
					crossPeaksX.push(i);
					shift+=cross.shiftX;
				}
				else{
					if(Math.abs(cross.shiftY-signal.shiftY)<diagonalError){
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
	}

	function exist(output, properties, signal, type, symmetricSearch) {
		for(var i=output.length-1;i>=0;i--){
			if(properties[i][0]==type){
				if(distanceTo(signal, output[i], symmetricSearch)<tolerance){
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
	}
	/**
	 * We try to determine the position of each signal within the spectrum matrix.
	 * Peaks could be of 3 types: upper diagonal, diagonal or under diagonal 1,0,-1
	 * respectively.
	 * @param Signals
	 * @return A matrix containing the properties of each signal
	 */
	function initializeProperties(signals){
		var signalsProperties = new Array(signals.length);
		for(var i=signals.length-1;i>=0;i--){
			signalsProperties[i]=[0,0];
			//We check if it is a diagonal peak
			if(Math.abs(signals[i].shiftX-signals[i].shiftY)<=diagonalError){
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
	}

	/**
	 * This function calculates the distance between 2 nmr signals . If toImage is true,
	 * it will interchange x by y in the distance calculation for the second signal.
	 */
	function distanceTo(a, b, toImage){
		if(!toImage){
			return Math.sqrt(Math.pow(a.shiftX-b.shiftX, 2)
				+Math.pow(a.shiftY-b.shiftY, 2));
		}
		else{
			return Math.sqrt(Math.pow(a.shiftX-b.shiftY, 2)
				+Math.pow(a.shiftY-b.shiftX, 2));
		}
	}

	function alignSingleDimension(signals2D, references){
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

/***/ },
/* 61 */
/***/ function(module, exports) {

	/**
	 * Created by acastillo on 8/8/16.
	 */
	'use strict';

	const defOptions = {
	    threshold:0,
	    out:"assignment"
	};
	//TODO Consider a matrix of distances too
	module.exports = function fullClusterGenerator(conMat, opt) {
	    const options = Object.assign({}, defOptions, opt);
	    var clList, i, j, k;
	    if(typeof conMat[0] === "number"){
	        clList = fullClusterGeneratorVector(conMat);
	    }
	    else{
	        if(typeof conMat[0] === "object"){
	            var nRows = conMat.length;
	            var conn = new Array(nRows*(nRows+1)/2);
	            var index = 0;
	            for(var i=0;i<nRows;i++){
	                for(var j=i;j<nRows;j++){
	                    if(conMat[i][j]>options.threshold)
	                        conn[index++]= 1;
	                    else
	                        conn[index++]= 0;
	                }
	            }
	            clList = fullClusterGeneratorVector(conn);
	        }
	    }
	    if (options.out === "indexes" || options.out === "values") {
	        var result = new Array(clList.length);
	        for(i=0;i<clList.length;i++){
	            result[i] = [];
	            for(j=0;j<clList[i].length;j++){
	                if(clList[i][j] != 0){
	                    result[i].push(j);
	                }
	            }
	        }
	        if (options.out === "values") {
	            var resultAsMatrix = new Array(result.length);
	            for (i = 0; i<result.length;i++){
	                resultAsMatrix[i]=new Array(result[i].length);
	                for(j = 0; j < result[i].length; j++){
	                    resultAsMatrix[i][j]=new Array(result[i].length);
	                    for(k = 0; k < result[i].length; k++){
	                        resultAsMatrix[i][j][k]=conMat[result[i][j]][result[i][k]];
	                    }
	                }
	            }
	            return resultAsMatrix;
	        }
	        else{
	            return result;
	        }
	    }

	    return clList;

	}

	function fullClusterGeneratorVector(conn){
	    var nRows = Math.sqrt(conn.length*2+0.25)-0.5;
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
	            for(i = 0;i < nRows ;i++)
	                cluster[i]=0;
	            clusterList.push(cluster);
	            for(nextAv = 0;available[nextAv]==0;nextAv++){};
	        }
	        else{
	            nextAv=toInclude.splice(0,1);
	        }
	        cluster[nextAv]=1;
	        available[nextAv]=0;
	        remaining--;
	        //Copy the next available row
	        var row = new Array(nRows);
	        for( i = 0;i < nRows;i++){
	            var c=Math.max(nextAv,i);
	            var r=Math.min(nextAv,i);
	            //The element in the conn matrix
	            //console.log("index: "+r*(2*nRows-r-1)/2+c)
	            row[i]=conn[r*(2*nRows-r-1)/2+c];
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

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	/**
	 * Created by acastillo on 7/7/16.
	 */
	var StatArray = __webpack_require__(2).array;
	var convolution = __webpack_require__(63);
	var labeling = __webpack_require__(67);


	const smallFilter = [
	    [0, 0, 1, 2, 2, 2, 1, 0, 0],
	    [0, 1, 4, 7, 7, 7, 4, 1, 0],
	    [1, 4, 5, 3, 0, 3, 5, 4, 1],
	    [2, 7, 3, -12, -23, -12, 3, 7, 2],
	    [2, 7, 0, -23, -40, -23, 0, 7, 2],
	    [2, 7, 3, -12, -23, -12, 3, 7, 2],
	    [1, 4, 5, 3, 0, 3, 5, 4, 1],
	    [0, 1, 3, 7, 7, 7, 3, 1, 0],
	    [0, 0, 1, 2, 2, 2, 1, 0, 0]];

	const DEBUG = false;

	/**
	 Detects all the 2D-peaks in the given spectrum based on center of mass logic.
	 */
	function findPeaks2DRegion(input, opt) {
	    var options = Object.assign({},{nStdev:3, kernel:smallFilter}, opt);
	    var tmp = convolution.matrix2Array(input);
	    var inputData = tmp.data;
	    var i;
	    if(tmp.rows&&tmp.cols){
	        options.rows = tmp.rows;
	        options.cols = tmp.cols;
	    }
	    var nRows = options.rows;
	    var nCols = options.cols;
	    if(!nRows||!nCols){
	        throw new Error("Invalid number of rows or columns "+nRows+" "+nCols);
	    }

	    var customFilter = options.kernel;
	    var cs = options.filteredData;
	    if(!cs)
	        cs = convolution.fft(inputData, customFilter, options);

	    var nStdDev = options.nStdev;

	    var threshold = 0;
	    for( i=nCols*nRows-2;i>=0;i--)
	        threshold+=Math.pow(cs[i]-cs[i+1],2);
	    threshold=-Math.sqrt(threshold);
	    threshold*=nStdDev/nRows;

	    var bitmask = new Array(nCols * nRows);
	    for( i=nCols * nRows-1;i>=0;i--){
	        bitmask[i]=0;
	    }
	    var nbDetectedPoints = 0;
	    for ( i = cs.length-1; i >=0 ; i--) {
	        if (cs[i] < threshold) {
	            bitmask[i] = 1;
	            nbDetectedPoints++;
	        }
	    }

	    var pixels = labeling(bitmask, nCols, nRows, {neighbours:8});
	    var peakList  = extractPeaks(pixels, inputData, nRows, nCols);

	    if (peakList.length > 0&&DEBUG) {
	        console.log("No peak found");
	    }
	    return peakList;
	}
	/**
	 Detects all the 2D-peaks in the given spectrum based on the Max logic.
	 amc
	 */
	function findPeaks2DMax(input, opt) {
	    var options = Object.assign({},{nStdev:3, kernel:smallFilter}, opt);
	    var tmp = convolution.matrix2Array(input);
	    var inputData = tmp.data;

	    if(tmp.rows&&tmp.cols){
	        options.rows = tmp.rows;
	        options.cols = tmp.cols;
	    }
	    var nRows = options.rows;
	    var nCols = options.cols;
	    if(!nRows||!nCols){
	        throw new Error("Invalid number of rows or columns "+nRows+" "+nCols);
	    }

	    var customFilter = options.kernel;
	    var cs = options.filteredData;
	    if(!cs)
	        cs = convolution.fft(inputData, customFilter, options);


	    var nStdDev = options.nStdev;
	    var threshold = 0;
	    for( var i=nCols*nRows-2;i>=0;i--)
	        threshold+=Math.pow(cs[i]-cs[i+1],2);
	    threshold=-Math.sqrt(threshold);
	    threshold*=nStdDev/nRows;

	    var rowI,colI;
	    var peakListMax = [];
	    var tmpIndex = 0;
	    for ( var i = 0; i < cs.length; i++) {
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
	                            peakListMax.push({x:colI,y:rowI,z:inputData[i]});
	                        }
	                    }
	                }
	            }
	        }
	    }
	    return peakListMax;
	}

	function extractPeaks(pixels, data, nRow, nCols){
	    //console.log(JSON.stringify(pixels));
	    //How many different groups we have?
	    var labels = {};
	    var row, col, tmp, i;
	    for( i = 0; i < pixels.length; i++){
	        if(pixels[i]!=0){
	            col = i%nCols;
	            row = (i-col) / nCols;
	            if(labels[pixels[i]]){
	                tmp = labels[pixels[i]];
	                tmp.x+=col*data[i];
	                tmp.y+=row*data[i];
	                tmp.z+=data[i];
	                if( col < tmp.minX)
	                    tmp.minX = col;
	                if( col > tmp.maxX)
	                    tmp.maxX = col;
	                if( row < tmp.minY)
	                    tmp.minY = row;
	                if( row > tmp.maxY)
	                    tmp.maxY = row;
	            }
	            else{
	                labels[pixels[i]]={
	                    x:col*data[i],
	                    y:row*data[i],
	                    z:data[i],
	                    minX:col,
	                    maxX:col,
	                    minY:row,
	                    maxY:row
	                };
	            }
	        }
	    }
	    var keys = Object.keys(labels);
	    var peakList = new Array(keys.length);
	    for( i = 0; i < keys.length; i++ ){
	        peakList[i] = labels[keys[i]];
	        peakList[i].x/=peakList[i].z;
	        peakList[i].y/=peakList[i].z;
	    }
	    return peakList;
	}

	module.exports={
	    findPeaks2DRegion:findPeaks2DRegion,
	    findPeaks2DMax:findPeaks2DMax
	};


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict;'
	/**
	 * Created by acastillo on 7/7/16.
	 */
	var FFTUtils = __webpack_require__(64).FFTUtils;

	function convolutionFFT(input, kernel, opt) {
	    var tmp = matrix2Array(input);
	    var inputData = tmp.data;
	    var options = Object.assign({normalize : false, divisor : 1, rows:tmp.rows, cols:tmp.cols}, opt);

	    var nRows, nCols;
	    if (options.rows&&options.cols) {
	        nRows = options.rows;
	        nCols = options.cols;
	    }
	    else {
	        throw new Error("Invalid number of rows or columns " + nRows + " " + nCols)
	    }

	    var divisor = options.divisor;
	    var i,j;
	    var kHeight =  kernel.length;
	    var kWidth =  kernel[0].length;
	    if (options.normalize) {
	        divisor = 0;
	        for (i = 0; i < kHeight; i++)
	            for (j = 0; j < kWidth; j++)
	                divisor += kernel[i][j];
	    }
	    if (divisor === 0) {
	        throw new RangeError('convolution: The divisor is equal to zero');
	    }

	    var radix2Sized = FFTUtils.toRadix2(inputData, nRows, nCols);
	    var conv = FFTUtils.convolute(radix2Sized.data, kernel, radix2Sized.rows, radix2Sized.cols);
	    conv = FFTUtils.crop(conv, radix2Sized.rows, radix2Sized.cols, nRows, nCols);

	    if(divisor!=0){
	        for(i=0;i<conv.length;i++){
	            conv[i]/divisor;
	        }
	    }

	    return conv;
	}

	function convolutionDirect(input, kernel, opt) {
	    var tmp = matrix2Array(input);
	    var inputData = tmp.data;
	    var options = Object.assign({normalize : false, divisor : 1, rows:tmp.rows, cols:tmp.cols}, opt);

	    var nRows, nCols;
	    if (options.rows&&options.cols) {
	        nRows = options.rows;
	        nCols = options.cols;
	    }
	    else {
	        throw new Error("Invalid number of rows or columns " + nRows + " " + nCols)
	    }

	    var divisor = options.divisor;
	    var kHeight =  kernel.length;
	    var kWidth =  kernel[0].length;
	    var i, j, x, y, index, sum, kVal, row, col;
	    if (options.normalize) {
	        divisor = 0;
	        for (i = 0; i < kHeight; i++)
	            for (j = 0; j < kWidth; j++)
	                divisor += kernel[i][j];
	    }
	    if (divisor === 0) {
	        throw new RangeError('convolution: The divisor is equal to zero');
	    }

	    var output = new Array(nRows*nCols);

	    var hHeight = Math.floor(kHeight/2);
	    var hWidth = Math.floor(kWidth/2);

	    for (y = 0; y < nRows; y++) {
	        for (x = 0; x < nCols; x++) {
	            sum = 0;
	            for ( j = 0; j < kHeight; j++) {
	                for ( i = 0; i < kWidth; i++) {
	                    kVal = kernel[kHeight - j - 1][kWidth - i - 1];
	                    row = (y + j -hHeight + nRows) % nRows;
	                    col = (x + i - hWidth + nCols) % nCols;
	                    index = (row * nCols + col);
	                    sum += inputData[index] * kVal;
	                }
	            }
	            index = (y * nCols + x);
	            output[index]= sum / divisor;
	        }
	    }
	    return output;
	}



	function LoG(sigma, nPoints, options){
	    var factor = 1000;
	    if(options&&options.factor){
	        factor = options.factor;
	    }

	    var kernel = new Array(nPoints);
	    var i,j,tmp,y2,tmp2;

	    factor*=-1;//-1/(Math.PI*Math.pow(sigma,4));
	    var center = (nPoints-1)/2;
	    var sigma2 = 2*sigma*sigma;
	    for( i=0;i<nPoints;i++){
	        kernel[i]=new Array(nPoints);
	        y2 = (i-center)*(i-center);
	        for( j=0;j<nPoints;j++){
	            tmp = -((j-center)*(j-center)+y2)/sigma2;
	            kernel[i][j]=Math.round(factor*(1+tmp)*Math.exp(tmp));
	        }
	    }

	    return kernel;
	}

	function matrix2Array(input){
	    var inputData=input;
	    var nRows, nCols;
	    if(typeof input[0]!="number"){
	        nRows = input.length;
	        nCols = input[0].length;
	        inputData = new Array(nRows*nCols);
	        for(var i=0;i<nRows;i++){
	            for(var j=0;j<nCols;j++){
	                inputData[i*nCols+j]=input[i][j];
	            }
	        }
	    }
	    else{
	        var tmp = Math.sqrt(input.length);
	        if(Number.isInteger(tmp)){
	            nRows=tmp;
	            nCols=tmp;
	        }
	    }

	    return {data:inputData,rows:nRows,cols:nCols};
	}


	module.exports = {
	    fft:convolutionFFT,
	    direct:convolutionDirect,
	    kernelFactory:{LoG:LoG},
	    matrix2Array:matrix2Array
	};

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.FFTUtils = __webpack_require__(65);
	exports.FFT = __webpack_require__(66);


/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var FFT = __webpack_require__(66);

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
	    fft2DArray:function(data, nRows, nCols, opt) {
	        var options = Object.assign({},{inplace:true})
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
	                //TODO Chech why this happens
	                if(isNaN(tmpCols.re[iRow])){
	                    tmpCols.re[iRow]=0;
	                }
	                if(isNaN(tmpCols.im[iRow])){
	                    tmpCols.im[iRow]=0;
	                }
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
	    convolute:function(data, kernel, nRows, nCols, opt){
	        var ftSpectrum = new Array(nCols * nRows);
	        for (var i = 0; i<nRows * nCols; i++){
	            ftSpectrum[i] = data[i];
	        }

	        ftSpectrum = this.fft2DArray(ftSpectrum, nRows, nCols);


	        var dimR = kernel.length;
	        var dimC = kernel[0].length;
	        var ftFilterData = new Array(nCols * nRows);
	        for(var i=0;i<nCols * nRows;i++){
	            ftFilterData[i]=0;
	        }

	        var iRow, iCol;
	        var shiftR = Math.floor((dimR - 1) / 2);
	        var shiftC = Math.floor((dimC - 1) / 2);
	        for (var ir = 0; ir < dimR; ir++) {
	            iRow = (ir - shiftR + nRows) % nRows;
	            for (var ic = 0; ic < dimC; ic++) {
	                iCol = (ic - shiftC + nCols) % nCols;
	                ftFilterData[iRow * nCols + iCol] = kernel[ir][ic];
	            }
	        }
	        ftFilterData = this.fft2DArray(ftFilterData, nRows, nCols);

	        var ftRows = nRows * 2;
	        var ftCols = nCols / 2 + 1;
	        this.convolute2DI(ftSpectrum, ftFilterData, ftRows, ftCols);

	        return this.ifft2DArray(ftSpectrum, ftRows, ftCols);
	    },


	    toRadix2:function(data, nRows, nCols){
	        var i,j,irow, icol;
	        var cols = nCols, rows = nRows, prows=0, pcols=0;
	        if(!(nCols !== 0 && (nCols & (nCols - 1)) === 0)) {
	            //Then we have to make a pading to next radix2
	            cols = 0;
	            while((nCols>>++cols)!=0);
	            cols=1<<cols;
	            pcols = cols-nCols;
	        }
	        if(!(nRows !== 0 && (nRows & (nRows - 1)) === 0)) {
	            //Then we have to make a pading to next radix2
	            rows = 0;
	            while((nRows>>++rows)!=0);
	            rows=1<<rows;
	            prows = (rows-nRows)*cols;
	        }
	        if(rows==nRows&&cols==nCols)//Do nothing. Returns the same input!!! Be careful
	            return {data:data, rows:nRows, cols:nCols};

	        var output = new Array(rows*cols);
	        var shiftR = Math.floor((rows-nRows)/2)-nRows;
	        var shiftC = Math.floor((cols-nCols)/2)-nCols;

	        for( i=0;i<rows;i++){
	            irow = i*cols;
	            icol = ((i-shiftR) % nRows) * nCols;
	            for( j = 0;j<cols;j++){
	                output[irow+j]=data[(icol+(j-shiftC) % nCols) ];
	            }
	        }
	        return {data:output, rows:rows, cols:cols};
	    },

	    /**
	     * Crop the given matrix to fit the corresponding number of rows and columns
	     */
	    crop:function(data, rows, cols, nRows, nCols, opt){

	        if(rows == nRows && cols == nCols)//Do nothing. Returns the same input!!! Be careful
	            return data;

	        var options = Object.assign({}, opt);

	        var output = new Array(nCols*nRows);

	        var shiftR = Math.floor((rows-nRows)/2);
	        var shiftC = Math.floor((cols-nCols)/2);
	        var irow, icol, i, j;

	        for( i=0;i<nRows;i++){
	            irow = i*nRows;
	            icol = (i+shiftR)*cols;
	            for( j = 0;j<nCols;j++){
	                output[irow+j]=data[icol+(j+shiftC)];
	            }
	        }

	        return output;
	    }
	}

	module.exports = FFTUtils;


/***/ },
/* 66 */
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
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	const DisjointSet = __webpack_require__(68);

	const direction4X = [-1, 0];
	const direction4Y = [0, -1];
	const neighbours4 = [null, null];

	const direction8X = [-1, -1, 0, 1];
	const direction8Y = [0, -1, -1, -1];
	const neighbours8 = [null, null, null, null];

	function ccLabeling(mask, width, height, options) {
	    options = options || {};
	    const neighbours = options.neighbours || 8;

	    var directionX;
	    var directionY;
	    var neighboursList;
	    if (neighbours === 8) {
	        directionX = direction8X;
	        directionY = direction8Y;
	        neighboursList = neighbours8;
	    } else if (neighbours === 4) {
	        directionX = direction4X;
	        directionY = direction4Y;
	        neighboursList = neighbours4;
	    } else {
	        throw new RangeError('unsupported neighbours count: ' + neighbours);
	    }

	    const size = mask.length;
	    const labels = new Array(size);
	    const pixels = new Int16Array(size);
	    const linked = new DisjointSet();
	    var index;
	    var currentLabel = 1;
	    for (var j = 0; j < height; j++) {
	        for (var i = 0; i < width; i++) {
	            // true means out of background
	            var smallestNeighbor = null;
	            index = i + j * width;

	            if (mask[index]) {
	                for (var k = 0; k < neighboursList.length; k++) {
	                    var ii = i + directionX[k];
	                    var jj = j + directionY[k];
	                    if (ii >= 0 && jj >= 0 && ii < width && jj < height) {
	                        var neighbor = labels[ii + jj * width];
	                        if (!neighbor) {
	                            neighboursList[k] = null;
	                        } else {
	                            neighboursList[k] = neighbor;
	                            if (!smallestNeighbor || neighboursList[k].value < smallestNeighbor.value) {
	                                smallestNeighbor = neighboursList[k];
	                            }
	                        }
	                    }
	                }
	                if (!smallestNeighbor) {
	                    labels[index] = linked.add(currentLabel++);
	                } else {
	                    labels[index] = smallestNeighbor;
	                    for (var k = 0; k < neighboursList.length; k++) {
	                        if (neighboursList[k] && neighboursList[k] !== smallestNeighbor) {
	                            linked.union(smallestNeighbor, neighboursList[k]);
	                        }
	                    }
	                }
	            }
	        }
	    }

	    for (var j = 0; j < height; j++) {
	        for (var i = 0; i < width; i++) {
	            index = i + j * width;
	            if (mask[index]) {
	                pixels[index] = linked.find(labels[index]).value;
	            }
	        }
	    }
	    return pixels;

	}

	module.exports = ccLabeling;


/***/ },
/* 68 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * @class DisjointSet
	 */
	class DisjointSet {
	    constructor() {
	        this.nodes = new Map();
	    }

	    /**
	     * Adds an element as a new set
	     * @param {*} value
	     * @return {DisjointSetNode} Object holding the element
	     */
	    add(value) {
	        var node = this.nodes.get(value);
	        if (!node) {
	            node = new DisjointSetNode(value);
	            this.nodes.set(value, node);
	        }
	        return node;
	    }

	    /**
	     * Merges the sets that contain x and y
	     * @param {DisjointSetNode} x
	     * @param {DisjointSetNode} y
	     */
	    union(x, y) {
	        const rootX = this.find(x);
	        const rootY = this.find(y);
	        if (rootX === rootY) {
	            return;
	        }
	        if (rootX.rank < rootY.rank) {
	            rootX.parent = rootY;
	        } else if (rootX.rank > rootY.rank) {
	            rootY.parent = rootX;
	        } else {
	            rootY.parent = rootX;
	            rootX.rank++;
	        }
	    }

	    /**
	     * Finds and returns the root node of the set that contains node
	     * @param {DisjointSetNode} node
	     * @return {DisjointSetNode}
	     */
	    find(node) {
	        var rootX = node;
	        while (rootX.parent !== null) {
	            rootX = rootX.parent;
	        }
	        var toUpdateX = node;
	        while (toUpdateX.parent !== null) {
	            var toUpdateParent = toUpdateX;
	            toUpdateX = toUpdateX.parent;
	            toUpdateParent.parent = rootX;
	        }
	        return rootX;
	    }

	    /**
	     * Returns true if x and y belong to the same set
	     * @param {DisjointSetNode} x
	     * @param {DisjointSetNode} y
	     */
	    connected(x, y) {
	        return this.find(x) === this.find(y);
	    }
	}

	module.exports = DisjointSet;

	function DisjointSetNode(value) {
	    this.value = value;
	    this.parent = null;
	    this.rank = 0;
	}


/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * This library formats a set of nmr1D signals to the ACS format.
	 * Created by acastillo on 3/11/15. p
	 */
	var old = __webpack_require__(70);

	var acsString="";
	var parenthesis="";
	var spectro="";
	var rangeForMultiplet=false;

	module.exports = __webpack_require__(71);

	module.exports.update = function(ranges){
	    for (var i=0; i<ranges.length; i++){
	        var range = ranges[i];
	        for (var j=0; j<range.signal.length; j++){
	            var signal = range.signal[j];
	            if (signal.j && ! signal.multiplicity) {
	                signal.multiplicity = "";
	                for (var k=0; k<signal.j.length;k++){
	                    signal.multiplicity+=signal.j[k].multiplicity;
	                }
	            }
	        }
	    }

	    return ranges;
	}

	module.exports.nmrJ = function(Js, options){
	    var Jstring = "";
	    var opt = Object.assign({},{separator:", ", nbDecimal:2}, options);
	    var j;
	    for(var i=0;i<Js.length;i++){
	        j = Js[i];
	        if (j.length>11) j+=opt.separator;
	        Jstring+=j.multiplicity+" "+j.coupling.toFixed(opt.nbDecimal);
	    }
	    return Jstring;
	}
	/**
	 * This function converts an array of peaks [{x, y, width}] in a vector equally x,y vector
	 * TODO This function is very general and should be placed somewhere else
	 * @param peaks
	 * @param opt
	 * @returns {{x: Array, y: Array}}
	 */
	module.exports.peak2Vector=function(peaks, opt){
	    var options = opt||{};
	    var from = options.from;
	    var to = options.to;
	    var nbPoints = options.nbPoints||16*1024;
	    var fnName = options.fnName||"gaussian";
	    var nWidth = options.nWidth || 4;

	    if(!from){
	        from = Number.MAX_VALUE;
	        for(var i=0;i<peaks.length;i++){
	            if(peaks[i].x-peaks[i].width*nWidth<from){
	                from = peaks[i].x-peaks[i].width*nWidth;
	            }
	        }
	    }

	    if(!to){
	        to = Number.MIN_VALUE;
	        for(var i=0;i<peaks.length;i++){
	            if(peaks[i].x+peaks[i].width*nWidth>to){
	                to = peaks[i].x+peaks[i].width*nWidth;
	            }
	        }
	    }


	    var x = new Array(nbPoints);
	    var y = new Array(nbPoints);
	    var dx = (to-from)/(nbPoints-1);
	    for(var i=0;i<nbPoints;i++){
	        x[i] = from+i*dx;
	        y[i] = 0;
	    }

	    var intensity = "intensity";
	    if(peaks[0].y){
	        intensity="y";
	    }

	    for(var i=0;i<peaks.length;i++){
	        var peak = peaks[i];
	        if(peak.x>from && peak.x<to){
	            var index = Math.round((peak.x-from)/dx);
	            var w = Math.round(peak.width*nWidth/dx);
	            if(fnName=="gaussian"){
	                for(var j=index-w;j<index+w;j++){
	                    if(j>=0&&j<nbPoints){
	                        y[j]+=peak[intensity]*Math.exp(-0.5*Math.pow((peak.x-x[j])/(peak.width/2),2));
	                    }
	                }
	            }else{
	                var factor = peak[intensity]*Math.pow(peak.width,2)/4;
	                for(var j=index-w;j<index+w;j++){
	                    if(j>=0&&j<nbPoints){
	                        y[j]+=factor/(Math.pow(peak.x-x[j],2)+Math.pow(peak.width/2,2));

	                    }
	                }
	            }

	        }
	    }

	    return {x:x,y:y};
	}

	module.exports.range2Vector=function(ranges, opt){
	    return module.exports.peak2Vector(module.exports.range2Peaks(ranges), opt);
	}

	module.exports.range2Peaks = function(ranges){
	    var peaks = [];
	    for(var i=0;i<ranges.length;i++){
	        var range = ranges[i];
	        for(var j=0;j<range.signal.length;j++){
	            peaks=peaks.concat(range.signal[j].peak);
	        }
	    }
	    return peaks;
	}

	module.exports.toACS = function(spectrumIn, options){

	    var spectrum = JSON.parse(JSON.stringify(spectrumIn));

	    if(spectrum[0].delta1){//Old signals format
	        return old.toACS(spectrum, options);
	    }

	    acsString="";
	    parenthesis="";
	    spectro="";
	    var solvent = null;
	    if(options&&options.solvent)
	        solvent = options.solvent;
	    if(options&&options.rangeForMultiplet!=undefined)
	        rangeForMultiplet = options.rangeForMultiplet;

	    if(options&&options.ascending){
	        spectrum.sort(function(a,b){
	            return b.from- a.from
	        });
	    }
	    else{
	        spectrum.sort(function(a,b){
	            return a.from- b.from
	        });
	    }

	    spectrum.type="NMR SPEC";
	    if (options&&options.nucleus=="1H") {
	        formatAcs_default(spectrum, false, 2, 1, solvent, options);
	    }
	    if (options&&options.nucleus=="13C") {
	        formatAcs_default(spectrum, false, 1, 0, solvent,options);
	    }

	    if (acsString.length>0) acsString+=".";

	    return acsString;
	}

	module.exports.toNMRSignal = function(acsString){
	    //TODO Create the function that reconstructs the signals from the ACS string
	    return null;
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

	function formatAcs_default(spectra, ascending, decimalValue, decimalJ, solvent, options) {
	    appendSeparator();
	    appendSpectroInformation(spectra, solvent, options);
	    var numberSmartPeakLabels=spectra.length;
	    for (var i=0; i<numberSmartPeakLabels; i++) {
	        if (ascending) {
	            var signal=spectra[i];
	        } else {
	            var signal=spectra[numberSmartPeakLabels-i-1];
	        }
	        if (signal) {
	            appendSeparator();
	            appendDelta(signal,decimalValue);
	            appendParenthesis(signal,decimalJ);
	        }
	    }
	}

	function appendSpectroInformation(spectrum, solvent, options) {
	    if (spectrum.type=="NMR SPEC") {
	        if (options.nucleus) {
	            acsString+=formatNucleus(options.nucleus);
	        }
	        acsString+=" NMR";
	        if ((solvent) || (options.observe)) {
	            acsString+=" (";
	            if (options.observe) {
	                acsString+=(options.observe*1).toFixed(0)+" MHz";
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
	    var startX = 0,stopX=0,delta1=0, asymmetric;
	    if(line.from){
	        if((typeof line.from)=="string"){
	            startX=parseFloat(line.from);
	        }
	        else
	            startX=line.from;
	    }
	    if(line.to){
	        if((typeof line.to)=="string"){
	            stopX=parseFloat(line.to);
	        }
	        else
	            stopX=line.to;
	    }
	    if(line.signal[0].delta){
	        if((typeof line.signal[0].delta)=="string"){
	            delta1=parseFloat(line.signal[0].delta);
	        }
	        else
	            delta1=line.signal[0].delta;
	    }
	    else{
	        asymmetric = true;
	    }
	    //console.log("Range2: "+rangeForMultiplet+" "+line.multiplicity);
	    if (asymmetric===true||(line.signal[0].multiplicity=="m"&&rangeForMultiplet===true)) {//Is it massive??
	        if (line.from&&line.to) {
	            if (startX<stopX) {
	                acsString+=startX.toFixed(nbDecimal)+"-"+stopX.toFixed(nbDecimal);
	            } else {
	                acsString+=stopX.toFixed(nbDecimal)+"-"+startX.toFixed(nbDecimal);
	            }
	        } else {
	            if(line.signal[0].delta)
	                acsString+="?";
	        }
	    }
	    else{
	        if(line.signal[0].delta)
	            acsString+=delta1.toFixed(nbDecimal);
	        else{
	            if(line.from&&line.to){
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
	    } else if (line.integral) {
	        appendParenthesisSeparator();
	        parenthesis+=line.integral.toFixed(0)+" H";
	    }
	}

	function appendAssignment(line) {
	    if (line.signal[0].pubAssignment) {
	        appendParenthesisSeparator();
	        parenthesis+=formatAssignment(line.signal[0].pubAssignment);
	    }
	    else{
	        if (line.signal[0].assignment) {
	            appendParenthesisSeparator();
	            parenthesis+=formatAssignment(line.signal[0].assignment);
	        }
	    }
	}

	function appendMultiplicity(line) {
	    if (line.signal[0].pubMultiplicity) {
	        appendParenthesisSeparator();
	        parenthesis+=line.pubMultiplicity;
	    } else if (line.signal[0].multiplicity) {
	        appendParenthesisSeparator();
	        parenthesis+=line.signal[0].multiplicity;
	    }
	}

	function appendCoupling(line, nbDecimal) {
	    if (line.signal[0].j) {
	        var Js = line.signal[0].j;
	        var j="<i>J</i> = ";
	        for (var i=0; i<Js.length; i++) {
	            var coupling=Js[i].coupling;
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


/***/ },
/* 70 */
/***/ function(module, exports) {

	'use strict';
	/**
	 * This library formats a set of nmr1D signals to the ACS format.
	 * Created by acastillo on 3/11/15. p
	 */

	var acsString="";
	var parenthesis="";
	var spectro="";
	var rangeForMultiplet=false;

	module.exports.toACS = function(spectrum, options){
	    acsString="";
	    parenthesis="";
	    spectro="";
	    var solvent = null;
	    if(options&&options.solvent)
	        solvent = options.solvent;
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

	function formatAcs_default(spectra, ascending, decimalValue, decimalJ, solvent) {
	    appendSeparator();
	    appendSpectroInformation(spectra, solvent);
	    var numberSmartPeakLabels=spectra.length;
	    for (var i=0; i<numberSmartPeakLabels; i++) {
	        if (ascending) {
	            var signal=spectra[i];
	        } else {
	            var signal=spectra[numberSmartPeakLabels-i-1];
	        }
	        if (signal) {
	            appendSeparator();
	            appendDelta(signal,decimalValue);
	            appendParenthesis(signal,decimalJ);
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
	    //console.log(line);
	    var startX = 0,stopX=0,delta1=0;
	    if(line.integralData.from) {
	        if ((typeof line.integralData.from) == "string") {
	            startX = parseFloat(line.integralData.from);
	        }
	        else
	            startX = line.integralData.from;
	    }
	    if(line.integralData.to){
	        if((typeof line.integralData.to)=="string"){
	            stopX=parseFloat(line.integralData.to);
	        }
	        else
	            stopX=line.integralData.to;
	    }
	    if(line.delta1){
	        if((typeof line.delta1)=="string"){
	            delta1=parseFloat(line.delta1);
	        }
	        else
	            delta1=line.delta1;

	    }
	    if (line.asymmetric===true||(line.multiplicity=="m"&&rangeForMultiplet===true)) {//Is it massive??
	        if (line.integralData.from&&line.integralData.to) {
	            if (startX<stopX) {
	                acsString+=startX.toFixed(nbDecimal)+"-"+stopX.toFixed(nbDecimal);
	            } else {
	                acsString+=stopX.toFixed(nbDecimal)+"-"+sttotoFixed(nbDecimal);
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
	            if(line.integralData.from&&line.integralData.to){
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
	    // need to add assignment - coupling - integration
	    parenthesis="";
	    appendMultiplicity(line);
	    appendIntegration(line);
	    appendCoupling(line,nbDecimal);
	    appendAssignment(line);


	    if (parenthesis.length>0) {
	        acsString+=" ("+parenthesis+")";
	    }
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


/***/ },
/* 71 */
/***/ function(module, exports) {

	/**
	 * Created by acastillo on 8/17/16.
	 */
	'use strict';

	//lineWidth in Hz frequency in MHz
	const defaultOptions = {lineWidth:1, frequency: 400};

	module.exports.prediction2Ranges = function(predictions, opt){
	    const options = Object.assign({}, defaultOptions, opt);
	    //1. Collapse all the equivalent predictions
	    const nPredictions = predictions.length;
	    const ids = new Array(nPredictions);
	    var i, j, diaIDs, prediction, width, center, jc;
	    for(i = 0 ; i < nPredictions; i++) {
	        if(!ids[predictions[i].diaIDs[0]]) {
	            ids[predictions[i].diaIDs[0]] = [i]
	        }
	        else{
	            ids[predictions[i].diaIDs[0]].push(i);
	        }
	    }
	    const idsKeys = Object.keys(ids);
	    const result = new Array(idsKeys.length);

	    for(i = 0; i < idsKeys.length; i++) {
	        diaIDs = ids[idsKeys[i]];
	        prediction = predictions[diaIDs[0]];
	        width = 0;
	        jc = prediction.j;
	        if(jc){
	            for(j = 0; j < jc.length; j++) {
	                width+=jc[j].coupling;
	            }
	        }

	        width+= 2*options.lineWidth;//Add 2 times the spectral lineWidth

	        width/=options.frequency;

	        result[i] = {from: prediction.delta-width,
	                    to:prediction.delta+width,
	                    integral:1,
	                    signal:[ predictions[diaIDs[0]] ]};
	        for(j = 1; j < diaIDs.length; j++) {
	            result[i].signal.push(predictions[diaIDs[j]]);
	            result[i].integral++;
	        }
	    }
	    //2. Merge the overlaping ranges
	    for(i  =  0; i < result.length; i++) {
	        result[i]._highlight = result[i].signal[0].diaIDs;
	        center = (result[i].from + result[i].to)/2;
	        width = Math.abs(result[i].from - result[i].to);
	        for(j  = result.length - 1; j > i; j--) {
	            //Does it overlap?
	            if(Math.abs(center - (result[j].from + result[j].to)/2)
	                <= Math.abs(width + Math.abs(result[j].from - result[j].to))/2){
	                result[i].from = Math.min(result[i].from, result[j].from);
	                result[i].to = Math.max(result[i].to, result[j].to);
	                result[i].integral = result[i].integral + result[j].integral;
	                result[i]._highlight.push(result[j].signal[0].diaIDs[0]);
	                result.splice(j,1);
	                j = result.length - 1;
	                center = (result[i].from + result[i].to)/2;
	                width = Math.abs(result[i].from - result[i].to);
	            }
	        }
	    }

	    return result;
	}

/***/ }
/******/ ])
});
;