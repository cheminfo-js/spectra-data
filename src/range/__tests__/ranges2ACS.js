/**
 * Created by acastillo on 3/11/15.
 */
'use strict';

var Ranges = require('../Ranges');
var utils = require('../utils');
var FS = require('fs');
var Data = require('../../');

function createSpectraData(filename, label, data) {
    var spectrum = Data.NMR.fromJcamp(
        FS.readFileSync(__dirname + filename).toString()
    );
    return spectrum;
}


describe('spectra-data examples peak picking in ACS format', function () {
    var spectrum = createSpectraData('/../../../data-test/ethylbenzene/h1_0.jdx');
    var peakPicking = spectrum.autoPeakPicking({'nH': 10, realTop: true, thresholdFactor: 0.8, clean: true, compile: true});
    var peakPicking2 = spectrum.autoPeakPicking({'nH': 10, realTop: true, thresholdFactor: 0.8, clean: true, compile: true, format: 'new'});
    it('format ACS', function () {
        var acs = utils.toACS(peakPicking, {rangeForMultiplet: true});
        acs.should.equal('<sup>1</sup>H NMR (400 MHz) δ 7.26-7.32 (m, 2 H), 7.15-7.23 (m, 3 H), 2.60 (q, 2 H, <i>J</i> = 7.6 Hz), 1.19 (t, 3 H, <i>J</i> = 7.6 Hz).');
    });

    it('format ACS new input format', function () {
        var acs = peakPicking2.toACS({rangeForMultiplet: true, nucleus: spectrum.getNucleus(), observe: spectrum.observeFrequencyX()});
        acs.should.equal('<sup>1</sup>H NMR (400 MHz) δ 7.26-7.32 (m, 2 H), 7.15-7.23 (m, 3 H), 2.60 (q, 2 H, <i>J</i> = 7.6 Hz), 1.19 (t, 3 H, <i>J</i> = 7.6 Hz).');
    });
});

