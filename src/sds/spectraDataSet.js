'use strict';

const utils = require('./utils');
const SD = require('../SD');

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
     * @return {SpectraDataSet}
     */
    static fromText(arrayData) {
        // console.log(arrayData)
        var output = new Array(arrayData.length);
        for (let i = 0; i < arrayData.length; i++) {
            let parameters = arrayData[i].parameters || {};
            let text = arrayData[i].data || '';
            output[i] = parameters;
            output[i].data = utils.getDataFromText(text);
        }
        return new this(output);
    }


    /**
     * Return an SpectraDataSet instance from an Array of text that contain the information
     * @param {array} arrayData - array of objects with parameters as a object and data as jcamp
     * @param {object} options - options for jcampconverter function.
     * @return {SpectraDataSet}
     */
    static fromJcamp(arrayData, options) {
        options = Object.assign({}, {keepSpectra: true, keepRecordsRegExp: /^.+$/}, options, {xy: true});
        var output = new Array(arrayData.length);
        for (let i = 0; i < arrayData.length; i++) {
            var parameters = arrayData[i].parameters || {};
            var jcamp = arrayData[i].data || '';
            var spectrum = SD.fromJcamp(jcamp, options);
            console.log(spectrum.sd)
            output[i] = parameters;
            let xyData = spectrum.sd.spectra[0].data[0];
            output[i].data = {x: xyData.x, y: xyData.y};
        }
        return new this(output);
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
            let element = this[index];
            element[category] = value;
        }
    }

    /**
     * return a property of the element requiered
     * @param {string} category - name of the property
     * @param {number} index - index of the element where the property will be set
     * @returns {*}
     */
    getParameter(category, index) {
        index = index || 0;
        let element = this[index];
        return element[category];
    }

    /**
     * add a element to spectraDataSet instance
     * @param {string} jcamp - jcamp with the data
     * @param {object} parameters - parameters that will be set for the new element
     * @param {object} options - options to jcampconverter
     * @returns {SpectraDataSet}
     */
    pushJcamp(jcamp, parameters, options) {
        jcamp = jcamp || '';
        parameters = parameters || {};
        options = Object.assign({}, {keepSpectra: true, keepRecordsRegExp: /^.+$/}, options, {xy: true});
        let spectrum = SD.fromJcamp(jcamp, options);
        let xyData = spectrum.sd.spectra[0].data[0];
        parameters.data = {x: xyData.x, y: xyData.y};
        this.push(parameters);
        return this;
    }

    /**
     * add a element to spectraDataSet instance
     * @param {string} text - string with the data
     * @param {object} parameters - parameters that will be set for the new element
     * @returns {SpectraDataSet}
     */
    pushText(text, parameters) {
        text = text || '';
        parameters = parameters || {};
        parameters.data = utils.getDataFromText(text);
        this.push(parameters);
        return this;
    }
}

module.exports = SpectraDataSet;
