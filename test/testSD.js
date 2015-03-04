'use strict';

var Data = require('..');

var fs = require('fs');

function createSpectraData(filename, label, data) {
    var spectrum = Data.SD.fromJcamp(
        fs.readFileSync(__dirname + filename).toString()
    );

    return spectrum;
};




describe('spectra-data test', function () {
    var spectrum=createSpectraData("/data/ethylvinylether/1h.jdx");

    console.log(spectrum);

    it('getFirstX', function () {
        spectrum.getFirstX().should.equal(123);
    });

    it('getLastX', function () {
        spectrum.getLastX().should.equal(123);
    });

    it('getFirstY', function () {
        spectrum.getLastY().should.equal(123);
    });

    it('getLastY', function () {
        spectrum.getLastY().should.equal(123);
    });
});


