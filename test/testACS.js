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
    //var spectrum=createSpectraData("/data/ethylvinylether/1h.jdx");
    var spectrum=createSpectraData("/data/ethylbenzene/h1_0.jdx");
    var peakPicking = spectrum.nmrPeakDetection({"nH":10, realTop:true, thresholdFactor:0.8,clean:true,compile:true});
    it('format ACS', function () {
        //console.log(Data.ACS.formater.toACS(peakPicking,{rangeForMultiplet:true}));
        Data.ACS.formater.toACS(peakPicking,{rangeForMultiplet:true}).should.be.string;
    });
});

