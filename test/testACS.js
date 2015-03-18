/**
 * Created by acastillo on 3/11/15.
 */
'use strict';

var Data = require('..');
var FS = require('fs');

function createSpectraData(filename, label, data) {
    var spectrum = Data.SD.fromJcamp(
        FS.readFileSync(__dirname + filename).toString()
    );
    return spectrum;
};




describe('spectra-data test', function () {
    var spectrum=createSpectraData("/data/ethylvinylether/1h.jdx");

    it('getNucleus', function () {
        spectrum.getNucleus().should.equal("1H");
    });
}
