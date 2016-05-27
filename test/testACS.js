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



describe('spectra-data test peak picking in ACS format', function () {
    //var spectrum=createSpectraData("/data/ethylvinylether/1h.jdx");
    var spectrum=createSpectraData("/data/ethylbenzene/h1_0.jdx");
    var peakPicking = spectrum.nmrPeakDetection({"nH":10, realTop:true, thresholdFactor:0.8,clean:true,compile:true});
    it('format ACS', function () {
        var acs = Data.ACS.formater.toACS(peakPicking,{rangeForMultiplet:true});
        acs.should.equal("<sup>1</sup>H NMR (400 MHz) δ 7.26-7.31 (m, 2 H), 7.15-7.22 (m, 3 H), 2.60 (q, 2 H, <i>J</i> = 7.6 Hz), 1.19 (t, 3 H, <i>J</i> = 7.6 Hz).");
    });
});

