'use strict';

const SD = require('./SD');
const peakPicking2D = require('./peakPicking/peakPicking2D');
const PeakOptimizer = require('./peakPicking/peakOptimizer');
const Brukerconverter = require('brukerconverter');
const Filters = require('./filters/Filters.js');
const StatArray = require('ml-stat').array;
const simule2DNmrSpectrum = require('nmr-simulation').simulate2D;

class NMR2D extends SD {

    constructor(sd) {
        super(sd);
    }

    /**
     * This function creates a SD instance from the given 2D prediction
     * @param {Array} prediction
     * @param {object} options
     * @return {SD}
     */
    static fromPrediction(prediction, options) {
        var data = simule2DNmrSpectrum(prediction, options);
        var spectrum = NMR2D.fromMatrix(data, options);
        var jcamp = spectrum.toJcamp({type: 'NTUPLES'});
        return NMR2D.fromJcamp(jcamp);
    }

    /**
     * This function return a NMR instance from Array of folders or zip file with folders
     * @param {Array} brukerFile - spectra data in two possible input
     * @param {object} options - the options dependent on brukerFile input, but some parameter are permanents like:
     * @option {boolean} xy - The spectraData should not be a oneD array but an object with x and y
     * @option {boolean} keepSpectra - keep the spectra in 2D NMR instance
     * @option {boolean} noContours - option to generate not generate countour plot for 2Dnmr spectra
     * @option {string} keepRecordsRegExp - regular expressions to parse data
     * @return {*}
     */
    static fromBruker(brukerFile, options) {
        options = Object.assign({}, {xy: true, keepSpectra: true, keepRecordsRegExp: /^.+$/}, options);
        var brukerSpectra = null;
        if (Array.isArray(brukerFile)) {
            //It is a folder
            brukerSpectra = Brukerconverter.converFolder(brukerFile, options);
        } else {
            //It is a zip
            brukerSpectra = Brukerconverter.convertZip(brukerFile, options);
        }
        if (brukerSpectra) {
            return brukerSpectra.map(function (spectrum) {
                return new NMR2D(spectrum);
            });
        }
        return null;
    }

    /**
     * This function creates a 2D spectrum from a matrix containing the independent values of the spectrum and a set
     * of options...
     * @param {Array} data
     * @param {object} options
     * @return {*}
     */
    static fromMatrix(data, options) {
        var result = {};
        result.profiling = [];
        result.logs = [];
        var spectra = [];
        let nbPoints = data[0].length;
        result.spectra = spectra;
        result.info = {};
        let firstY = options.firstY || 0;
        let lastY = options.lastY || data.length - 1;
        let deltaY = (lastY - firstY) / (data.length - 1);

        let firstX = options.firstX || 0;
        let lastX = options.lastX || nbPoints - 1;
        let deltaX = (lastY - firstY) / (nbPoints - 1);
        let x = options.x;
        if (!x) {
            x = new Array(nbPoints);
            for (let i = 0; i < nbPoints; i++) {
                x[i] = firstX + deltaX * i;
            }
        }

        let observeFrequency = options.frequencyX || 400;
        let minZ = Number.MAX_SAFE_INTEGER;
        let maxZ = Number.MIN_SAFE_INTEGER;

        data.forEach((y, index) => {
            var spectrum = {};
            spectrum.isXYdata = true;
            spectrum.nbPoints = nbPoints;
            spectrum.firstX = firstX;
            spectrum.firstY = y[0];
            spectrum.lastX = lastX;
            spectrum.lastY = y[spectrum.nbPoints - 1];
            spectrum.xFactor = 1;
            spectrum.yFactor = 1;
            spectrum.deltaX = (spectrum.lastX - spectrum.firstX) / (spectrum.nbPoints - 1);
            spectrum.title = options.title || 'spectra-data from matrix';
            spectrum.dataType = options.dataType || 'nD NMR SPECTRUM';
            spectrum.observeFrequency = observeFrequency;
            spectrum.data = [{x: x, y: y}];
            spectrum.page = firstY + index * deltaY;
            result.xType = options.xType || options.nucleusX || '1H';
            spectra.push(spectrum);

            let minMax = StatArray.minMax(y);
            minZ = Math.min(minZ, minMax.min);
            maxZ = Math.max(maxZ, minMax.max);

        });

        result.ntuples = [{units: options.xUnit || 'PPM'}, {units: options.yUnit || 'PPM'}, {units: options.zUnit || 'Intensity'}];
        result.info['2D_Y_FREQUENCY'] = options.frequencyY || 400;
        result.info['2D_X_FREQUENCY'] = options.frequencyX || 400;
        result.info.observefrequency = result.info['2D_X_FREQUENCY'];
        result.info.$BF1 = result.info.observefrequency;
        result.info['.SOLVENTNAME'] = options.solvent || 'none';
        // eslint-disable-next-line camelcase
        result.info.$SW_h = Math.abs(lastX - firstX) * observeFrequency;
        result.info.$SW = Math.abs(lastX - firstX);
        result.info.$TD = nbPoints;
        result.info.firstY = firstY;
        result.info.lastY = lastY;
        result.minMax = {
            minY: firstY,
            maxY: lastY,
            minX: firstX,
            maxX: lastX,
            minZ: minZ,
            maxZ: maxZ
        };

        result.yType = options.yType || options.nucleusY || '1H';
        result.twoD = true;
        return new NMR2D(result);
    }
    /**
     * Return true if the it is an homo-nuclear experiment
     * @return {boolean}
     */
    isHomoNuclear() {
        return this.sd.xType === this.sd.yType;
    }

    /**
     * Return the observe frequency in the direct dimension
     * @return {number}
     */
    observeFrequencyX() {
        return this.sd.spectra[0].observeFrequency;
    }
    /**
     * Return the observe frequency in the indirect dimension
     * @return {number}
     */
    observeFrequencyY() {
        return this.sd.indirectFrequency;
    }

    /**
     * Return the solvent name.
     * @return {string|XML}
     */
    getSolventName() {
        return (this.sd.info['.SOLVENTNAME'] || this.sd.info.$SOLVENT).replace('<', '').replace('>', '');
    }

    /**
     * This function Return the units of the direct dimension. It overrides the SD getXUnits function
     * @return {ntuples.units|*|b.units}
     */
    getXUnits() {
        return this.sd.ntuples[1].units;
    }
    /**
     * This function Return the units of the indirect dimension. It overrides the SD getYUnits function
     * @return {ntuples.units|*|b.units}
     */
    getYUnits() {
        return this.sd.ntuples[0].units;
    }
    /**
     * Return the units of the dependent variable
     * @return {ntuples.units|*|b.units}
     */
    getZUnits() {
        return this.sd.ntuples[2].units;
    }
    /**
     * Return the min value in the indirect dimension.
     * @return {sd.minMax.maxY}
     */
    getLastY() {
        return this.sd.minMax.maxY;
    }


    /**
     * Return the min value in the indirect dimension.
     * @return {sd.minMax.minY}
     */
    getFirstY() {
        return this.sd.minMax.minY;
    }
    /**
     * Return the separation between 2 consecutive points in the indirect domain
     * @return {number}
     */
    getDeltaY() {
        return (this.getLastY() - this.getFirstY()) / (this.getNbSubSpectra() - 1);
    }

    /**
     * Return the minimum value of the independent variable
     * @return {number}
     */
    getMinZ() {
        return this.sd.minMax.minZ;
    }

    /**
     * Return the maximum value of the independent variable
     * @return {number}
     */
    getMaxZ() {
        return this.sd.minMax.maxZ;
    }

    /**
     * This function process the given spectraData and tries to determine the NMR signals.
     * Return an NMRSignal2D array containing all the detected 2D-NMR Signals
     * @param	{object} options - Object containing the options.
     * @option	{number} thresholdFactor - A factor to scale the automatically determined noise threshold.
     * @return  {*}	set of NMRSignal2D.
     */
    getZones(options) {
        options = options || {};
        if (!options.thresholdFactor) {
            options.thresholdFactor = 1;
        }
        var id = Math.round(Math.random() * 255);
        if (options.idPrefix) {
            id = options.idPrefix;
        }
        var peakList = peakPicking2D(this, options.thresholdFactor);

        //lets add an unique ID for each peak.
        for (var i = 0; i < peakList.length; i++) {
            peakList[i]._highlight = [id + '_' + i];
            peakList[i].signalID = id + '_' + i;
        }
        if (options.references) {
            PeakOptimizer.alignDimensions(peakList, options.references);
        }

        if (options.format === 'new') {
            var zones = new Array(peakList.length);
            for (var k = peakList.length - 1; k >= 0; k--) {
                var signal = peakList[k];
                zones[k] = {
                    fromTo: signal.fromTo,
                    integral: signal.intensity || 1,
                    remark: '',
                    signal: [{
                        peak: signal.peaks,
                        delta: [signal.shiftX, signal.shiftY]
                    }],
                    _highlight: signal._highlight,
                    signalID: signal.signalID,
                };
            }
            peakList = zones;
        }

        this.zones = peakList;

        return this.zones;
    }

    /**
     * Return the noise factor depending on the nucleus.
     * @param {string} nucleus
     * @return {number}
     */
    getNMRPeakThreshold(nucleus) {
        if (nucleus === '1H') {
            return 3.0;
        }
        if (nucleus === '13C') {
            return 5.0;
        }
        return 1.0;
    }

    /**
     * Return the observed nucleus in the specified dimension
     * @param {number} dim
     * @return {string}
     */
    getNucleus(dim) {
        if (dim === 1) {
            return this.sd.xType;
        }
        if (dim === 2) {
            return this.sd.yType;
        }
        return this.sd.xType;
    }


    /**
     * This function increase the size of the spectrum, filling the new positions with zero values. Doing it one
     * could increase artificially the spectral resolution.
     * @param {number} nPointsX Number of new zero points in the direct dimension
     * @param {number} nPointsY Number of new zero points in the indirect dimension
     * @return {NMR2D} this object
     */
    zeroFilling(nPointsX, nPointsY) {
        return Filters.zeroFilling(this, nPointsX, nPointsY);
    }

    /**
     * This filter applies a circular shift(phase 1 correction in the time domain) to an NMR FID spectrum that
     * have been obtained on spectrometers using the Bruker digital filters. The amount of shift depends on the
     * parameters DECIM and DSPFVS. This spectraData have to be of type NMR_FID
     * @return {NMR2D} this object
     */
    brukerFilter() {
        return Filters.digitalFilter(this, {brukerFilter: true});
    }

    /**
     * This filter applies a circular shift(phase 1 correction in the time domain) to an NMR FID spectrum that
     * have been obtained on spectrometers using the Bruker digital filters. The amount of shift depends on the
     * parameters DECIM and DSPFVS. This spectraData have to be of type NMR_FID
     * @param {object} options - some options are availables:
     * @option nbPoints: The number of points to shift. Positive values will shift the values to the rigth
     * and negative values will do to the left.
     * @option brukerSpectra
     * @return {NMR2D} this object
     */
    digitalFilter(options) {
        return Filters.digitalFilter(this, options);
    }


    /**
     * Fourier transforms the given spectraData (Note. no 2D handling yet) this spectraData have to be of type NMR_FID or 2DNMR_FID
     * @return {NMR2D} this object
     */
    fourierTransform() {
        return Filters.fourierTransform(this);
    }

    /**
     * This filter makes an phase 1 correction that corrects the problem of the spectra that has been obtained
     * on spectrometers using the Bruker digital filters. This method is used in cases when the BrukerSpectra
     * filter could not find the correct number of points to perform a circular shift.
     * The actual problem is that not all of the spectra has the necessary parameters for use only one method for
     * correcting the problem of the Bruker digital filters.
     * @param {number} ph1corr - Phase 1 correction value in radians.
     * @return {NMR2D} this object
     */
    postFourierTransform(ph1corr) {
        return Filters.phaseCorrection(0, ph1corr);
    }
}


module.exports = NMR2D;
