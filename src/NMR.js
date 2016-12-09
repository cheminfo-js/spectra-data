'use strict';

const SD = require('./SD');
const Filters = require('./filters/Filters.js');
const Brukerconverter = require('brukerconverter');
const peaks2Ranges = require('./peakPicking/peaks2Ranges');
const NmrPredictor = require('nmr-predictor');
const simulator = require('nmr-simulation');

/**
 * @class NMR
 * @extends SD
 */
class NMR extends SD {

    constructor(sd) {
        super(sd);
        // TODO: add stuff specific to NMR
    }

    /**
     * This function return a SD instante computed with nmr chemical shift predictor "spinus" from molfile.
     * @param {string} molfile - molfile to generate the spin system and compute the spectrum
     * @param {object} options - parameters for simulation of spectrum
     * @return {NMR} SD instante.
     */

    static fromMolfile(molfile, options) {
        let opt = Object.assign({}, {output: 'xy', title: 'Simulated spectrum'}, options);
        const predictor = new NmrPredictor('spinus');
        return predictor.predict(molfile, {group: true}).then(prediction => {
            const spinSystem = simulator.SpinSystem.fromPrediction(prediction);
            var simulation = simulator.simulate1D(spinSystem, opt);
            return SD.fromXY(simulation.x, simulation.y, opt);
        });
    }


    /**
     * This function create a SD instance from xy data
     * @param {Array} x - X data.
     * @param {Array} y - Y data.
     * @param {object} options - Optional parameters
     * @return {NMR} SD instance from x and y data
     */
    static fromXY(x, y, options) {
        var result = {};
        result.profiling = [];
        result.logs = [];
        var spectra = [];
        result.spectra = spectra;
        result.info = {};
        var spectrum = {};
        spectrum.nbPoints = x.length;
        spectrum.firstX = x[0];
        spectrum.lastX = x[spectrum.nbPoints - 1];
        spectrum.xFactor = 1;
        spectrum.yFactor = 1;
        spectrum.xUnit = options.xUnit || 'PPM';
        spectrum.yUnit = options.yUnit || 'Intensity';
        spectrum.deltaX = (spectrum.lastX - spectrum.firstX) / (spectrum.nbPoints - 1);
        spectrum.title = options.title || 'spectra-data from xy';
        spectrum.dataType = options.dataType || 'XY';
        spectrum.observeFrequency = options.frequency || 400;
        spectrum.data = [{x: x, y: y}];
        result.twoD = false;
        spectra.push(spectrum);
        return new SD({spectra: [{}]});
    }

    /**
     * This function returns a NMR instance from Array of folders or zip file with folders
     * @param {Array | zipFile} brukerFile - spectra data in two possible input
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
                return new NMR(spectrum);
            });
        }
        return null;
    }

    /**
     * Returns the observed nucleus. A dimension parameter is accepted for compatibility with 2DNMR
     * @param {number} dim
     * @return {string}
     */
    getNucleus(dim) {
        if (!dim || dim === 0 || dim === 1) {
            return this.sd.xType;
        } else {
            return '';
        }
    }

    /**
     * Returns the solvent name.
     * @return {string|XML}
     */
    getSolventName() {
        return (this.sd.info['.SOLVENTNAME'] || this.sd.info.$SOLVENT || '').replace('<', '').replace('>', '');
    }

    /**
     * Returns the observe frequency in the direct dimension
     * @return {number}
     */
    observeFrequencyX() {
        return this.sd.spectra[0].observeFrequency;
    }

    /**
     * Returns the noise factor depending on the nucleus.
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
     * This function adds white noise to the the given spectraData. The intensity of the noise is
     * calculated from the given signal to noise ratio.
     * @param SNR Signal to noise ratio
     * @return {NMR} this object
     */
    /*addNoise(SNR) {
        //@TODO Implement addNoise filter
    }*/


    /**
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
     * @return {NMR} this object
     * @example spec1 = addSpectraDatas(spec1,spec2,1,-1, false) This subtract spec2 from spec1
     */
    /*addSpectraDatas(spec2, factor1, factor2, autoscale) {
        //@TODO Implement addSpectraDatas filter

    }*/

    /**
     * Automatically corrects the base line of a given spectraData. After this process the spectraData
     * should have meaningful integrals.
     * @return {NMR} this object
     */
    /*autoBaseline() {
        //@TODO Implement autoBaseline filter
    }*/

    /**
     * Fourier transforms the given spectraData (Note. no 2D handling yet) this spectraData have to be
     * of type NMR_FID or 2DNMR_FID
     * @return {NMR} this object
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
     * @return {NMR} this object
     */
    postFourierTransform(ph1corr) {
        return Filters.phaseCorrection(0, ph1corr);
    }

    /**
     * This function increase the size of the spectrum, filling the new positions with zero values. Doing it one
     * could increase artificially the spectral resolution.
     * @param {number} nPointsX - Number of new zero points in the direct dimension
     * @param {number} nPointsY - Number of new zero points in the indirect dimension
     * @return {NMR} this object
     */
    zeroFilling(nPointsX, nPointsY) {
        return Filters.zeroFilling(this, nPointsX, nPointsY);
    }

    /**
     * Applies a baseline correction as described in J Magn Resonance 183 (2006) 145-151 10.1016/j.jmr.2006.07.013
     * The needed parameters are the wavelet scale and the lambda used in the whittaker smoother.
     * @param waveletScale To be described
     * @param whittakerLambda To be described
     * @return {NMR} this object
     */
    /*haarWhittakerBaselineCorrection(waveletScale, whittakerLambda) {
        //@TODO Implement haarWhittakerBaselineCorrection filter
    }*/

    /**
     * Applies a baseline correction as described in J Magn Resonance 183 (2006) 145-151 10.1016/j.jmr.2006.07.013
     * The needed parameters are the Wavelet scale and the lambda used in the Whittaker smoother.
     * @param waveletScale To be described
     * @param whittakerLambda To be described
     * @param ranges A string containing the ranges of no signal.
     * @return {NMR} this object
     */
    /*whittakerBaselineCorrection(whittakerLambda, ranges) {
        //@TODO Implement whittakerBaselineCorrection filter
    }*/

    /**
     * This filter applies a circular shift(phase 1 correction in the time domain) to an NMR FID spectrum that
     * have been obtained on spectrometers using the Bruker digital filters. The amount of shift depends on the
     * parameters DECIM and DSPFVS. This spectraData have to be of type NMR_FID
     * @return {NMR} this object
     */
    brukerFilter() {
        return Filters.digitalFilter(this, {'brukerFilter': true});
    }

    /**
     * This filter applies a circular shift(phase 1 correction in the time domain) to an NMR FID spectrum that
     * have been obtained on spectrometers using the Bruker digital filters. The amount of shift depends on the
     * parameters DECIM and DSPFVS. This spectraData have to be of type NMR_FID
     * @param {object} options ->
     * nbPoints: The number of points to shift. Positive values will shift the values to the rigth
     * and negative values will do to the left.
     * @return {NMR} this object
     */
    digitalFilter(options) {
        return Filters.digitalFilter(this, options);
    }

    /**
     * Apodization of a spectraData object that should be of type NMR_FID.
     * @param {string} functionName - Valid values for functionsName are
     *  Exponential, exp
     *  Hamming, hamming
     *  Gaussian, gauss
     *  TRAF, traf
     *  Sine Bell, sb
     *  Sine Bell Squared, sb2
     * @param {number} lineBroadening - The parameter LB should either be a line broadening factor in Hz
     * or alternatively an angle given by degrees for sine bell functions and the like.
     * @example SD.apodization('exp', lineBroadening)
     * @return {NMR} this object
     */
    apodization(functionName, lineBroadening) {
        return Filters.apodization(this, {'functionName': functionName,
            'lineBroadening': lineBroadening});

    }

    /**
     * That decodes an Echo-Antiecho 2D spectrum.
     * @return {NMR} this object
     */
    echoAntiechoFilter() {
        //@TODO Implement echoAntiechoFilter filter
        return this;
    }

    /**
     * This function apply a Standard Normal Variate Transformation over the given spectraData. Mainly used for IR spectra.
     * @return {NMR} this object
     */
    SNVFilter() {
        //@TODO Implement SNVFilter
        return this;
    }

    /**
     * This function applies a power to all the Y values. If the power is less than 1 and the spectrum has negative values,
     * it will be shifted so that the lowest value is zero
     * @param {number} power - The power value to apply
     * @return {NMR} this object
     */
    powerFilter(power) {
        var minY = this.getMinY();
        if (power < 1 && minY < 0) {
            this.YShift(-1 * minY);
            //console.warn('SD.powerFilter: The spectrum had negative values and was automatically shifted before applying the function.');
        }
        //@TODO Implement powerFilter
        return this;
    }

    /**
     * This function applies a log to all the Y values.<br>If the spectrum has negative or zero values, it will be shifted so that the lowest value is 1
     * @param   base    The base to use
     * @return this object
     */
    /*logarithmFilter(base) {
        var minY = this.getMinY();
        if (minY <= 0) {
            this.yShift((-1 * minY) + 1);
            //console.warn('SD.logarithmFilter: The spectrum had negative values and was automatically shifted before applying the function.');
        }
        //@TODO Implement logarithmFilter filter
    }*/


    /**
     * This function correlates the given spectraData with the given vector func. The correlation
     * operation (*) is defined as:
     *
     *                    __ inf
     *  c(x)=f(x)(*)g(x)= \        f(x)*g(x+i)
     *                   ./
     *                    -- i=-inf
     * @param func A double array containing the function to correlates the spectraData
     * @return this object
     * @example var smoothedSP = SD.correlationFilter(spectraData,[1,1]) returns a smoothed version of the
     * given spectraData.
     */
    /*correlationFilter(func) {
        //@TODO Implement correlationFilter filter
    }*/

    /**
     * Applies the phase correction (phi0,phi1) to a Fourier transformed spectraData. The angles must be given in radians.
     * @param {number} phi0 - the value of Zero order phase correction
     * @param {number} phi1 - the value of first order phase correction
     * @return {NMR}
     */
    phaseCorrection(phi0, phi1) {
        return Filters.phaseCorrection(this, phi0, phi1);
    }

    /**
     * This function determines automatically the correct parameters phi0 and phi1 for a phaseCorrection
     * function and applies it.
     * @return {NMR}
     */
    /*automaticPhase() {
        //@TODO Implement automaticPhase filter
    }*/


    /**
     * This function process the given spectraData and tries to determine the NMR signals. Returns an NMRSignal1D array
     * containing all the detected 1D-NMR Signals
     * @param {object} parameters - A JSONObject containing the optional parameters:
     * @option fromX:   Lower limit.
     * @option toX:     Upper limit.
     * @option threshold: The minimum intensity to consider a peak as a signal, expressed as a percentage of the highest peak.
     * @option stdev: Number of standard deviation of the noise for the threshold calculation if a threshold is not specified.
     * @return {*}
     */
    getRanges(parameters) {
        if (this.ranges) {
            return this.ranges;
        } else {
            var peaks = this.getPeaks(parameters);
            var params = Object.assign({}, {nH: this.totalIntegral}, parameters);
            return peaks2Ranges(this, peaks, params);
        }
    }

    /**
     * This function compute again the process of the given spectraData and tries to determine the NMR signals.
     * Returns an NMRSignal1D array containing all the detected 1D-NMR Signals
     * @param {object} parameters - A JSONObject containing the optional parameters:
     * @option fromX:   Lower limit.
     * @option toX:     Upper limit.
     * @option threshold: The minimum intensity to consider a peak as a signal, expressed as a percentage of the highest peak.
     * @option stdev: Number of standard deviation of the noise for the threshold calculation if a threshold is not specified.
     * @return {null|*}
     */
    createRanges(parameters) {
        this.ranges = null;
        this.peaks = null;
        this.ranges = this.getRanges(parameters);
        return this.ranges;
    }

    /*autoAssignment(options) {

    }*/
}

module.exports = NMR;
