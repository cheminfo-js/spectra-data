'use strict';

var Data = require('../../..');
var FS = require('fs');


function createSpectraData(filename) {
    var spectrum = Data.NMR.fromJcamp(
        FS.readFileSync(__dirname + filename).toString()
    );
    return spectrum;
}


describe('spectra-data examples Filters', function () {
    it('fourier Tranformation', function () {
        var spectrum = createSpectraData('/../../../data-test/fftTest/FID.dx');
        spectrum.zeroFilling(spectrum.getNbPoints() * 2).digitalFilter({nbPoints: 67}).fourierTransform();
        spectrum.phaseCorrection(-Math.PI / 2, 0);
        spectrum.getXUnits().should.equal('PPM');

    });
    it('zeroFilling nbPoints', function () {
        var spectrum = createSpectraData('/../../../data-test/fftTest/FID.dx');
        spectrum.zeroFilling(10).getNbPoints().should.equal(10);
        spectrum.zeroFilling(20).getNbPoints().should.equal(20);
    });
});

