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
     * @param {object} texts - contain parameters as a object and data as a Array of text.
     * @return {SpectraDataSet}
     */
    static fromText(texts) {
        var parameters;
        var data;

        if (!this.isDataClassXY()) {
            throw Error('reduceData can only apply on equidistant data');
        } else if (typeof texts.parameters === 'undefined') {
            parameters = {};
        } else {
            parameters = texts.parameters;
        }

        if (typeof texts.data === 'undefined') {
            data = [];
        } else if (!Array.isArray(texts.data)) {
            data = [texts.data];
        }

        for (let i = 0; i < data.length; i++) {
            var text = data[i];
            data[i] = parameters;
            data[i].data = utils.getDataFromText(text);
        }
        return this(data);
    }


    /**
     * Return an SpectraDataSet instance from an Array of text that contain the information
     * @param {object} spectraDataSet - contain parameters as a object and data as a text file or array of text files.
     * @param {object} options - options for jcampconverter function.
     * @return {SpectraDataSet}
     */
    static fromJcamp(spectraDataSet, options) {
        var parameters;
        var data;
        if (!spectraDataSet.parameters) {
            parameters = {};
        } else {
            parameters = spectraDataSet.parameters;
        }

        if (!spectraDataSet.data) {
            data = [];
        } else if (!Array.isArray(spectraDataSet.data)) {
            data = [spectraDataSet.data];
        }

        for (let i = 0; i < data.length; i++) {
            var spectrum = SD.fromJcamp(data[i], options);
            data[i] = parameters;
            for (let j = 0; j < spectrum.sd.spectra.length;) {
                let xyData = spectrum.sd.spectra[j].data[0];
                data[i].data = {x: xyData.x, y: xyData.y};
                j += 2;
            }
        }
        return this(data);
    }

    setParameter(category, value) {
        if (typeof category === 'string') {
            this[category] = value;
        }
    }

    getParameter(category) {
        return this[category];
    }
}
