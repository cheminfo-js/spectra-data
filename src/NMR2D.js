'use strict';

var SD = require('./SD');
var peakPicking2D = require('./peakPicking/PeakPicking2D');
var PeakOptimizer = require('./peakPicking/PeakOptimizer');
var JcampConverter = require('jcampconverter');
var Brukerconverter = require('brukerconverter');


class NMR2D extends SD {
    /**
     * Construct the object from the given sd object(output of the jcampconverter or brukerconverter filter)
     * @param sd
     * @constructor
     */
    constructor(sd) {
        super(sd);
    }


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
    static fromJcamp(jcamp, options) {
        options = Object.assign({}, {xy: true, keepSpectra: true, keepRecordsRegExp: /^.+$/}, options);
        var spectrum = JcampConverter.convert(jcamp, options);
        return new NMR2D(spectrum);
    }

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
     * @function isHomoNuclear()
     * Returns true if the it is an homo-nuclear experiment
     * @returns {boolean}
     */
    isHomoNuclear() {
        return this.sd.xType == this.sd.yType;
    }

    /**
     * @function observeFrequencyX()
     * Returns the observe frequency in the direct dimension
     * @returns {*}
     */
    observeFrequencyX() {
        return this.sd.spectra[0].observeFrequency;
    }
    /**
     * @function observeFrequencyY()
     * Returns the observe frequency in the indirect dimension
     * @returns {*}
     */
    observeFrequencyY() {
        return this.sd.indirectFrequency;
    }

    /**
     * @function getSolventName()
     * Returns the solvent name.
     * @returns {string|XML}
     */
    getSolventName() {
        return (this.sd.info['.SOLVENTNAME'] || this.sd.info.$SOLVENT).replace('<', '').replace('>', '');
    }

    /**
     * @function getXUnits()
     * This function returns the units of the direct dimension. It overrides the SD getXUnits function
     * @returns {ntuples.units|*|b.units}
     */
    getXUnits() {
        return this.sd.ntuples[1].units;
    }
    /**
     * @function getYUnits()
     * This function returns the units of the indirect dimension. It overrides the SD getYUnits function
     * @returns {ntuples.units|*|b.units}
     */
    getYUnits() {
        return this.sd.ntuples[0].units;
    }
    /**
     * @function getZUnits()
     * Returns the units of the dependent variable
     * @returns {ntuples.units|*|b.units}
     */
    getZUnits() {
        return this.sd.ntuples[2].units;
    }
    /**
     * @function getLastY()
     * Returns the min value in the indirect dimension.
     * @returns {sd.minMax.maxY}
     */
    getLastY() {
        return this.sd.minMax.maxY;
    }
    /**
     * @function getFirstY()
     * Returns the min value in the indirect dimension.
     * @returns {sd.minMax.minY}
     */
    getFirstY() {
        return this.sd.minMax.minY;
    }
    /**
     * @function getDeltaY()
     * Returns the separation between 2 consecutive points in the indirect domain
     * @returns {number}
     */
    getDeltaY() {
        return (this.getLastY() - this.getFirstY()) / (this.getNbSubSpectra() - 1);
    }

    /**
     * @function getZones(options)
     * This function process the given spectraData and tries to determine the NMR signals.
     + Returns an NMRSignal2D array containing all the detected 2D-NMR Signals
     * @param	options:+Object			Object containing the options
     * @option	thresholdFactor:number	A factor to scale the automatically determined noise threshold.
     * @returns [*]	set of NMRSignal2D
     */
    getZones(options) {
        options = options || {};
        if (!options.thresholdFactor)            {
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
        if (options.references)            {
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
     * @function getNMRPeakThreshold(nucleus)
     * Returns the noise factor depending on the nucleus.
     * @param nucleus
     * @returns {number}
     */
    getNMRPeakThreshold(nucleus) {
        if (nucleus == '1H')            {
            return 3.0;
        }
        if (nucleus == '13C')            {
            return 5.0;
        }
        return 1.0;
    }

    /**
     * @function getNucleus(dim)
     * Returns the observed nucleus in the specified dimension
     * @param dim
     * @returns {string}
     */
    getNucleus(dim) {
        if (dim == 1)            {
            return this.sd.xType;
        }
        if (dim == 2)            {
            return this.sd.yType;
        }
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
    zeroFilling(nPointsX, nPointsY) {
        return Filters.zeroFilling(this, nPointsX, nPointsY);
    }

    /**
     * @function brukerFilter()
     * This filter applies a circular shift(phase 1 correction in the time domain) to an NMR FID spectrum that
     * have been obtained on spectrometers using the Bruker digital filters. The amount of shift depends on the
     * parameters DECIM and DSPFVS. This spectraData have to be of type NMR_FID
     * @returns this object
     */
    brukerFilter() {
        return Filters.digitalFilter(this, {'brukerFilter': true});
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
    digitalFilter(options) {
        return Filters.digitalFilter(this, options);
    }


    /**
     * @function fourierTransform()
     * Fourier transforms the given spectraData (Note. no 2D handling yet) this spectraData have to be of type NMR_FID or 2DNMR_FID
     * @returns this object
     */
    fourierTransform() {
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
    postFourierTransform(ph1corr) {
        return Filters.phaseCorrection(0, ph1corr);
    }
}


module.exports = NMR2D;
