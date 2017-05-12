'use strict';

const FS = require('fs');
const Data = require('../../');

function createSpectraData(filename) {
    var spectrum = Data.NMR.fromJcamp(
        FS.readFileSync(__dirname + filename).toString()
    );
    return spectrum;
}


describe('spectra-data examples peak picking in ACS format', function () {
    var spectrum = createSpectraData('/../../../data-test/ethylbenzene/h1_0.jdx');

    it('format ACS new input format', function () {
        var peakPicking2 = spectrum.createRanges({'nH': 10, realTopDetection: true, thresholdFactor: 0.8, clean: 0.5, compile: true, optimize: true});
        var acs = peakPicking2.getACS({nucleus: spectrum.getNucleus(), frequencyObserved: spectrum.observeFrequencyX(), ascending: false});
        acs.should.equal('<sup>1</sup>H NMR (400 MHz): δ 7.28 (2H, m), 7.20 (3H, m), 2.60 (2H, q, <i>J</i> = 7.6 Hz), 1.19 (3H, t, <i>J</i> = 7.6 Hz).');
    });
});
