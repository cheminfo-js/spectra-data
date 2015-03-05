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

    it('getTitle', function () {
        spectrum.getTitle().should.equal('109-92-2');
    });

    it('Checking X array', function () {
        var x=spectrum.getXData();
        x.should.be.instanceof(Array).and.have.lengthOf(16384);
        x[0].should.equal(11.00659);
    });

    it('Checking Y array', function () {
        var y=spectrum.getYData();
        y.should.be.instanceof(Array).and.have.lengthOf(16384);
        y[0].should.equal(-119886);
    });

    it('Checking XY array', function () {
        var xy=spectrum.getXYData();
        xy.should.be.instanceof(Array).and.have.lengthOf(2);
        xy[0].should.be.instanceof(Array).and.have.lengthOf(16384);
        xy[1].should.be.instanceof(Array).and.have.lengthOf(16384);
        xy[0][0].should.equal(11.00659);
        xy[1][0].should.equal(-119886);
    });


});


