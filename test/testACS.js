/**
 * Created by acastillo on 3/11/15.
 */
'use strict';

var Data = require('..');
var FS = require('fs');

function createSpectraData(filename, label, data) {
    var spectrum = Data.NMR.fromJcamp(
        FS.readFileSync(__dirname + filename).toString()
    );
    return spectrum;
};



describe('spectra-data test', function () {
    var spectrum=createSpectraData("/data/ethylvinylether/1h.jdx");
    var peakPicking = spectrum.nmrPeakDetection({nH:10});
    it('format ACS', function () {
        Data.ACS.formater.toACS(peakPicking).should.be.string;
    });
});

