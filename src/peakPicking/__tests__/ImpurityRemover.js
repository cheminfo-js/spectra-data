'use strict';
var Data = require('../../..');
var FS = require('fs');

function createSpectraData(filename, label, data) {
    var spectrum = Data.SD.fromJcamp(
        FS.readFileSync(__dirname + filename).toString()
    );
    return spectrum;
}


describe('spectra-data examples getRanges', function () {
    it.skip('number of peaks', function () {
        var spectrum = createSpectraData('/../../../data-test/indometacin/1h.dx');
        //console.log(spectrum.getRanges);
        var peakPicking = spectrum.getRanges({
            'nH': 16,
            realTop: true,
            thresholdFactor: 1,
            clean: true,
            compile: true,
            idPrefix: '1H'
        });


        //console.log(peakPicking);
        peakPicking.length.should.equal(8);
    });


});

