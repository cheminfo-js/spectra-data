'use strict';

const utils = require('./utils');
const SD = require('../SD');
const NMR = require('../NMR');

class SpectraDataSet extends Array {
    constructor(sds) {
        if (Array.isArray(sds)) {
            super(sds.length);
            for (let i = 0; i < sds.length; i++) {
                this[i] = sds[i];
            }
        } else if (typeof sds === 'number') {
            super(sds);
        } else {
            super();
        }
    }

    /**
     * Return an SpectraDataSet instance from an Array of text that contain the information
     * @param {array} arrayData - array of objects with parameters as a object and data as text.
     * @param {object} options - object with units and another options of NMR.fromXY function.
     * @return {SpectraDataSet}
     */
    static fromText(arrayData, options) {
        let output = new Array(arrayData.length);
        for (let i = 0; i < arrayData.length; i++) {
            let parameters = arrayData[i].parameters || {};
            let text = arrayData[i].data || '';
            let xyData = utils.getDataFromText(text);
            let spectrum = NMR.fromXY(xyData.x, xyData.y, options);
            for (let key in parameters) {
                spectrum.setParameter(key, parameters[key]);
            }
            output[i] = spectrum;
        }
        return new SpectraDataSet(output);
    }


    /**
     * Return an SpectraDataSet instance from an Array of text that contain the information
     * @param {array} arrayData - array of objects with parameters as a object and data as jcamp
     * @param {object} options - options for jcampconverter function.
     * @return {SpectraDataSet}
     */
    static fromJcamp(arrayData, options) {
        options = Object.assign({}, {keepSpectra: true, keepRecordsRegExp: /^.+$/, keepImaginary: false}, options, {xy: true});
        var output = new Array(arrayData.length);
        for (let i = 0, len = arrayData.length; i < len; i++) {
            let parameters = arrayData[i].parameters || {};
            let jcamp = arrayData[i].data || '';
            let spectrum = SD.fromJcamp(jcamp, options);
            for (let key in parameters) {
                spectrum.setParameter(key, parameters[key]);
            }
            if (!options.keepImaginary) {
                spectrum.sd.spectra.splice(1);
            }
            output[i] = spectrum;
        }
        return new SpectraDataSet(output);
    }

    /**
     * set a property in the index element, default index is zero
     * @param {string} category - name of the property
     * @param {*} value - value of the property
     * @param {number} index - index of the element where the property will be set
     */
    setParameter(category, value, index) {
        if (typeof category === 'string') {
            index = index || 0;
            this[index].setParameter(category, value);
        }
    }

    /**
     * return a property of the element requiered
     * @param {string} category - name of the property
     * @param {number} index - index of the element where the property will be set
     * @return {*}
     */
    getParameter(category, index) {
        index = index || 0;
        let element = this[index].getParameter(category);
        return element;
    }

    /**
     * add a element to spectraDataSet instance
     * @param {string} jcamp - jcamp with the data
     * @param {object} parameters - parameters that will be set for the new element
     * @param {object} options - options to jcampconverter
     * @return {SpectraDataSet}
     */
    pushJcamp(jcamp, options) {
        jcamp = jcamp || '';
        let parameters = options.parameters || {};
        options = Object.assign({}, {keepSpectra: true, keepRecordsRegExp: /^.+$/, keepImaginary: false}, options, {xy: true});
        let spectrum = SD.fromJcamp(jcamp, options);
        for (let key in parameters) {
            spectrum.setParameter(key, parameters[key]);
        }
        if (!options.keepImaginary) {
            spectrum.sd.spectra.splice(1);
        }
        this.push(spectrum);
        return this;
    }

    /**
     * add a element to spectraDataSet instance
     * @param {string} text - string with the data
     * @param {object} parameters - parameters that will be set for the new element
     * @return {SpectraDataSet}
     */
    pushText(text, options) {
        text = text || '';
        let parameters = options.parameters || {};
        let xyData = utils.getDataFromText(text);
        let spectrum = NMR.fromXY(xyData.x, xyData.y, options);
        for (let key in parameters) {
            spectrum.setParameter(key, parameters[key]);
        }
        this.push(spectrum);
        return this;
    }

    clone() {
        var sdsCopy = new Array(this.length);
        let copy = JSON.parse(JSON.stringify(this));
        for (let i = sdsCopy.length - 1; i >= 0; i--) {
            sdsCopy[i] = new SD(copy[i].sd);
        }
        return new SpectraDataSet(sdsCopy);
    }
}

module.exports = SpectraDataSet;
