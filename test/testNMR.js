'use strict';

var Data = require('..');

var fs = require('fs');

function createSpectraData(filename, label, data) {
    var nmr = Data.NMR.fromJcamp(
        fs.readFileSync(__dirname + filename).toString()
    );

};





describe('spectra-data test', function () {

    var sd=createSpectraData("/data/ethylvinylether/1h.jdx");
    console.log(sd.getFirstX());

    it('should return true', function () {
        spectraData().should.be.true;
    });
});

