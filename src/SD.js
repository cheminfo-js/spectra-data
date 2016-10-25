'use strict';
// small note on the best way to define array
// http://jsperf.com/lp-array-and-loops/2

var StatArray = require('ml-stat').array;
var ArrayUtils = require('ml-array-utils');
var JcampConverter = require("jcampconverter");
var JcampCreator = require("./jcampEncoder/JcampCreator");
var extend = require("extend");

class SD{
    /**
     * Construct the object from the given sd object(output of the jcampconverter or brukerconverter filter)
     * @param sd
     * @constructor
     */
    constructor(sd) {
        this.DATACLASS_XY=1;
        this.DATACLASS_PEAK=2;

        this.sd=sd;
        this.activeElement= 0;
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
    fromJcamp(jcamp, options) {
        options = Object.assign({}, {xy:true,keepSpectra:true,keepRecordsRegExp:/^.+$/}, options);
        var spectrum = JcampConverter.convert(jcamp, options);
        return new SD(spectrum);
    }

    /**
     * @function setActiveElement(nactiveSpectrum);
     * This function sets the nactiveSpectrum sub-spectrum as active
     * @param index of the sub-spectrum to set as active
     */
    setActiveElement(nactiveSpectrum) {
        this.activeElement=nactiveSpectrum;
    }

    /**
     * @function getActiveElement();
     * This function returns the index of the active sub-spectrum.
     * @returns {number|*}
     */
    getActiveElement() {
        return this.activeElement;
    }

    /**
     * @function getXUnits()
     * This function returns the units of the independent dimension.
     * @returns {xUnit|*|M.xUnit}
     */
    getXUnits() {
        return this.getSpectrum().xUnit;
    }

    /**
     * @function setXUnits()
     * This function returns the units of the independent dimension.
     * @returns {xUnit|*|M.xUnit}
     */
    setXUnits(units) {
        this.getSpectrum().xUnit=units;
    }
    /**
     * @function getYUnits()
     * * This function returns the units of the dependent variable.
     * @returns {yUnit|*|M.yUnit}
     */
    getYUnits(){
        return this.getSpectrum().yUnit;
    }

    /**
     * @function getSpectraVariable()
     * This function returns the information about the dimensions
     * @returns {*}
     */
    getSpectraVariable(dim){
        return this.sd.ntuples[dim];
    }

    /**
     * @function getNbPoints()
     * Return the number of points in the current spectrum
     * @param i sub-spectrum
     * @returns {*}
     */
    getNbPoints(i){
        return this.getSpectrumData(i).y.length;
    }

    /**
     * @function getFirstX()
     * Return the first value of the direct dimension
     * @param i sub-spectrum
     * @returns {number}
     */
    getFirstX(i) {
        i = i || this.activeElement;
        return this.sd.spectra[i].firstX;
    }

    /**
     * @function setFirstX()
     * Set the firstX for this spectrum. You have to force and update of the xAxis after!!!
     * @param x
     * @param i sub-spectrum
     */
    setFirstX(x, i) {
        i = i || this.activeElement;
        this.sd.spectra[i].firstX = x;
    }

    /**
     * @function getLastX()
     * Return the last value of the direct dimension
     * @param i sub-spectrum
     * @returns {number}
     */
    getLastX(i) {
        i = i||this.activeElement;
        return this.sd.spectra[i].lastX;
    }


    /**
     * @function setLastX()
     * Set the last value of the direct dimension. You have to force and update of the xAxis after!!!
     * @param x
     * @param i sub-spectrum
     */
    setLastX(x, i) {
        i = i||this.activeElement;
        this.sd.spectra[i].lastX=x;
    }

    /**
     */
    /**
     * Return the first value of the direct dimension
     * @param i sub-spectrum
     * @returns {number}
     */
    getFirstY(i) {
        i = i||this.activeElement;
        return this.sd.spectra[i].firstY;
    }

    /**
     * @function setFirstY()
     * Set the first value of the indirect dimension. Only valid for 2D spectra.
     * @param y
     * @param i sub-spectrum
     */
    setFirstY(y, i) {
        i =i||this.activeElement;
        this.sd.spectra[i].firstY = y;
    }

    /**
     * @function getLastY
     * Return the first value of the indirect dimension. Only valid for 2D spectra.
     * @returns {number}
     */
    getLastY(i) {
        i = i || this.activeElement;
        return this.sd.spectra[i].lastY;
    }

    /**
     * @function setLastY()
     * Return the first value of the indirect dimension
     * @param y
     * @param i sub-spectrum
     */
    setLastY(y, i){
        i = i || this.activeElement;
        this.sd.spectra[i].lastY = y;
    }

    /**
     * @function setDataClass()
     * Set the spectrum data_class. It could be DATACLASS_PEAK=1 or DATACLASS_XY=2
     * @param dataClass
     */
    setDataClass(dataClass) {
        if(dataClass == this.DATACLASS_PEAK) {
            this.getSpectrum().isPeaktable = true;
            this.getSpectrum().isXYdata = false;
        }
        if(dataClass == this.DATACLASS_XY) {
            this.getSpectrum().isXYdata = true;
            this.getSpectrum().isPeaktable = false;
        }
    }

    /**
     * @function isDataClassPeak();
     * Is this a PEAKTABLE spectrum?
     * @returns {*}
     */
    isDataClassPeak() {
        if(this.getSpectrum().isPeaktable)
            return  this.getSpectrum().isPeaktable;
        return false;
    }

    /**
     * @function isDataClassXY();
     * Is this a XY spectrum?
     * @returns {*}
     */
    isDataClassXY() {
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
    setDataType(dataType) {
        this.getSpectrum().dataType = dataType;
    }

    /**
     * @function getDataType()
     * Return the dataType(see: setDataType )
     * @returns {string|string|*|string}
     */
    getDataType() {
        return this.getSpectrum().dataType;
    }

    /**
     * @function getSpectrumData()
     * Return the i-th sub-spectrum data in the current spectrum
     * @param i
     * @returns {this.sd.spectra[i].data[0]}
     */
    getSpectrumData(i) {
        i = i || this.activeElement;
        return this.sd.spectra[i].data[0];
    }

    /**
     * @function getSpectrum()
     * Return the i-th sub-spectra in the current spectrum
     * @param i
     * @returns {this.sd.spectra[i]}
     */
    getSpectrum(i) {
        i = i || this.activeElement;
        return this.sd.spectra[i];
    }

    /**
     * @function getNbSubSpectra()
     * Return the amount of sub-spectra in this object
     * @returns {*}
     */
    getNbSubSpectra() {
        return this.sd.spectra.length;
    }

    /**
     * @function getXData()
     *  Returns an array containing the x values of the spectrum
     * @param i sub-spectrum Default:activeSpectrum
     * @returns {Array}
     */
    getXData(i) {
        return this.getSpectrumData(i).x;
    }

    /**
     * @function getYData()
     * This function returns a double array containing the values with the intensities for the current sub-spectrum.
     * @param i sub-spectrum Default:activeSpectrum
     * @returns {Array}
     */
    getYData(i) {
        return this.getSpectrumData(i).y;
    }

    /**
     * @function getX()
     * Returns the x value at the specified index for the active sub-spectrum.
     * @param i array index between 0 and spectrum.getNbPoints()-1
     * @returns {number}
     */
    getX(i) {
        return this.getXData()[i];
    }

    /**
     * @function getY()
     * Returns the y value at the specified index for the active sub-spectrum.
     * @param i array index between 0 and spectrum.getNbPoints()-1
     * @returns {number}
     */
    getY(i) {
        return this.getYData()[i];
    }

    /**
     * @function getXYData();
     * Returns a double[2][nbPoints] where the first row contains the x values and the second row the y values.
     * @param i sub-spectrum Default:activeSpectrum
     * @returns {*[]}
     */
    getXYData(i) {
        return [this.getXData(i),this.getYData(i)];
    }

    /**
     * @function getTitle
     * Return the title of the current spectrum.
     * @param i sub-spectrum Default:activeSpectrum
     * @returns {*}
     */
    getTitle(i) {
        return this.getSpectrum(i).title;
    }

    /**
     * @function setTitle(newTitle);
     * Set the title of this spectrum.
     * @param newTitle The new title
     * @param i sub-spectrum Default:activeSpectrum
     */
    setTitle(newTitle,i) {
        this.getSpectrum(i).title = newTitle;
    }

    /**
     * @function getMinY(i)
     * This function returns the minimal value of Y
     * @param i sub-spectrum Default:activeSpectrum
     * @returns {number}
     */
    getMinY(i) {
        return  StatArray.min(this.getYData(i));
    }

    /**
     * @function getMaxY(i)
     * This function returns the maximal value of Y
     * @param i sub-spectrum Default:activeSpectrum
     * @returns {number}
     */
    getMaxY(i) {
        return  StatArray.max(this.getYData(i));
    }

    /**
     * @function getMinMax(i)
     * Return the min and max value of Y
     * @param i sub-spectrum Default:activeSpectrum
     * @returns {{min, max}|*}
     */
    getMinMaxY(i) {
        return  StatArray.minMax(this.getYData(i));
    }


    /**
     * @function getNoiseLevel()
     * Get the noise threshold level of the current spectrum. It uses median instead of the mean
     * @returns {number}
     */
    getNoiseLevel() {
        var stddev = StatArray.robustMeanAndStdev(this.getYData()).stdev;
        return stddev*this.getNMRPeakThreshold(this.getNucleus(1));
    }

    /**
     * @function arrayPointToUnits(doublePoint)
     * Return the xValue for the given index.
     * @param doublePoint
     * @returns {number}
     */
    arrayPointToUnits(doublePoint) {
        return (this.getFirstX() - (doublePoint * (this.getFirstX() - this.getLastX()) / (this.getNbPoints()-1)));
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
    unitsToArrayPoint(inValue) {
        if (this.isDataClassXY()) {
            return Math.round((this.getFirstX() - inValue) * (-1.0 / this.getDeltaX()));
        } else if (this.isDataClassPeak())
        {
            var currentArrayPoint = 0,upperLimit=this.getNbPoints()-1, lowerLimit= 0, midPoint;
            //If inverted scale
            if(this.getFirstX() > this.getLastX()) {
                upperLimit = 0;
                lowerLimit = this.getNbPoints()-1;

                if(inValue > this.getFirstX())
                    return this.getNbPoints();
                if(inValue < this.getLastX())
                    return -1;
            }
            else{
                if(inValue < this.getFirstX())
                    return -1;
                if(inValue > this.getLastX())
                    return this.getNbPoints();
            }

            while (Math.abs(upperLimit-lowerLimit) > 1)
            {
                midPoint = Math.round(Math.floor((upperLimit+lowerLimit)/2));
                //x=this.getX(midPoint);
                if(this.getX(midPoint) == inValue)
                    return midPoint;
                if(this.getX(midPoint) > inValue)
                    upperLimit = midPoint;
                else
                    lowerLimit = midPoint;
            }
            currentArrayPoint = lowerLimit;
            if(Math.abs(this.getX(lowerLimit)-inValue) > Math.abs(this.getX(upperLimit)-inValue))
                currentArrayPoint = upperLimit;
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
    getDeltaX() {
        return (this.getLastX()-this.getFirstX()) / (this.getNbPoints()-1);
    }

    /**
     * @function setMinMax(min,max)
     * This function scales the values of Y between the min and max parameters
     * @param min   Minimum desired value for Y
     * @param max   Maximum desired value for Y
     */
    setMinMax(min,max) {
        ArrayUtils.scale(this.getYData(),{min:min,max:max,inplace:true});
    }

    /**
     * @function setMin(min)
     * This function scales the values of Y to fit the min parameter
     * @param min   Minimum desired value for Y
     */
    setMin(min) {
        ArrayUtils.scale(this.getYData(),{min:min,inplace:true});
    }

    /**
     * @function setMax(max)
     * This function scales the values of Y to fit the max parameter
     * @param max   Maximum desired value for Y
     */
    setMax(max) {
        ArrayUtils.scale(this.getYData(),{max:max,inplace:true});
    }

    /**
     * @function YShift(value)
     * This function shifts the values of Y
     * @param value Distance of the shift
     */
    YShift(value) {
        var y = this.getSpectrumData().y;
        var length = this.getNbPoints(),i = 0;
        for(i = 0; i<length; i++) {
            y[i] += value;
        }
        this.getSpectrum().firstY += value;
        this.getSpectrum().lastY += value;
    }

    /**
     * @function shift(globalShift)
     * This function shift the given spectraData. After this function is applied, all the peaks in the
     * spectraData will be found at xi+globalShift
     * @param globalShift
     */
    shift(globalShift) {
        for(var i = 0; i < this.getNbSubSpectra(); i++) {
            this.setActiveElement(i);
            var x = this.getSpectrumData().x;
            var length = this.getNbPoints(), i = 0;
            for(i = 0; i < length; i++) {
                x[i] += globalShift;
            }

            this.getSpectrum().firstX += globalShift;
            this.getSpectrum().lastX += globalShift;
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
    fillWith(from, to, value) {
        var tmp, start, end, x, y;
        if(from > to) {
            var tmp = from;
            from = to;
            to = tmp;
        }

        for(var i = 0; i < this.getNbSubSpectra(); i++) {
            this.setActiveElement(i);
            x = this.getXData();
            y = this.getYData();
            start = this.unitsToArrayPoint(from);
            end = this.unitsToArrayPoint(to);
            if(start > end) {
                tmp = start;
                start = end;
                end = tmp;
            }
            if(start < 0)
                start = 0;
            if(end >= this.getNbPoints)
                end = this.getNbPoints-1;

            if(typeof value !== "number") {
                y.splice(start,end-start);
                x.splice(start,end-start);
            }
            else{
                for(i = start; i <= end; i++) {
                    y[i] = value;
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
    suppressZone(from, to) {
        this.fillWith(from, to);
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
    simplePeakPicking(parameters) {
        //@TODO implements this filter
    }

    /**
     * @function getMaxPeak()
     * Get the maximum peak
     * @returns {[x, y]}
     */
    getMaxPeak() {
        var y = this.getSpectraDataY();
        var max = y[0], index = 0;
        for(var i = 0; i < y.length; i++) {
            if(max < y[i]) {
                max = y[i];
                index = i;
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
    getParamDouble(name, defvalue) {
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
    getParamString(name, defvalue) {
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
    getParamInt(name, defvalue) {
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
    getParam(name, defvalue) {
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
    containsParam(name) {
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
    getSpectraDataY() {
        return this.getYData();
    }

    /**
     * @function getSpectraDataX()
     * Return the x elements of the current spectrum. Same as getXData. Kept for backward compatibility.
     * @returns {Array}
     */
    getSpectraDataX() {
        return this.getXData();
    }

    /**
     * @function resetMinMax()
     * Update min max values of X and Yaxis.
     */
    resetMinMax() {
        //TODO Impelement this function
    }

    /**
     * @function putParam(name, value)
     * Set a new parameter to this spectrum
     * @param name
     * @param value
     */
    putParam(name, value) {
        this.sd.info[name] = value;
    }

    /**
     * @function getArea(from, to)
     * This function returns the area under the spectrum in the given window
     * @param from in spectrum units
     * @param to in spectrum units
     * @returns {number}
     */
    getArea(from, to) {
        var i0 = this.unitsToArrayPoint(from);
        var ie = this.unitsToArrayPoint(to);
        var area = 0;
        if(i0 > ie) {
            var tmp = i0;
            i0 = ie;
            ie = tmp;
        }
        i0 = i0 < 0?0:i0;
        ie = ie >= this.getNbPoints()?this.getNbPoints()-1:ie;
        for(var i = i0; i < ie; i++) {
            area += this.getY(i);
        }
        return area * Math.abs(this.getDeltaX());
    }

    updateIntegrals(ranges, options){
        var sum = 0;
        var that = this;
        ranges.forEach(function (range, index) {
            range.integral = that.getArea(range.from, range.to);
            sum += range.integral;
        });
        if(options.nH){
            var factor = options.nH / sum;
            ranges.forEach(function (range, index) {
                range.integral *= factor;
            });
        }
    }

    /**
     * @function getVector(from, to, nPoints)
     * Returns a equally spaced vector within the given window.
     * @param from in spectrum units
     * @param to in spectrum units
     * @param nPoints number of points to return(!!!sometimes it is not possible to return exactly the required nbPoints)
     * @returns [x,y]
     */
    getVector(from, to, nPoints) {
        return ArrayUtils.getEquallySpacedData(this.getSpectraDataX(), this.getSpectraDataY(),
            {from: from, to:to, numberOfPoints:nPoints});
    }

    /**
     * @function is2D()
     * Is it a 2D spectrum?
     * @returns {boolean}
     */
    is2D() {
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
    toJcamp(options) {
        var defaultOptions = {"encode":"DIFDUP","yFactor":1,"type":"SIMPLE","keep":[]};
        options = extend({}, defaultOptions, options);
        return JcampCreator.convert(this, options.encode, options.yFactor, options.type, options.keep);
    }
}

module.exports = SD;