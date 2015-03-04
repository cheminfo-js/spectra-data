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

    it('getFirstX', function () {
        spectrum.getFirstX().should.equal(11.00659);
    });

    it('getLastX', function () {
        spectrum.getLastX().should.equal(-1.009276326659311);
    });

    it('getFirstY', function () {
        spectrum.getFirstY().should.equal(-119886);
    });

    it('getLastY', function () {
        spectrum.getLastY().should.equal(-109159);
    });

    it('getLastY', function () {
        spectrum.getLastY().should.equal(-109159);
    });

    it('getLastY', function () {
        spectrum.getLastY().should.equal(-109159);
    });
});


