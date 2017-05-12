'use strict';

var Data = require('../../..');
var FS = require('fs');

function createSpectraData(filename) {
    var spectrum = Data.NMR.fromJcamp(
        FS.readFileSync(__dirname + filename).toString()
    );
    return spectrum;
}

var spectrum = createSpectraData('/../../../data-test/ethylvinylether/1h.jdx');

var createdJcamp0 = spectrum.toJcamp({type: 'SIMPLE'});
var createdJcamp1 = spectrum.toJcamp({type: 'NTUPLES'});


describe('toJcamp spectra-data examples', function () {
    var spectrum0 = Data.NMR.fromJcamp(createdJcamp0, {fastParse: false});
   // console.log(createdJcamp0);
    var spectrum1 = Data.NMR.fromJcamp(createdJcamp1, {fastParse: false});
    //console.log(spectrum.sd.spectra[0].data[0].y);

    it('getVector', function () {
        spectrum0.getVector(0.0, 10, 4 * 1024).length.should.equal(4 * 1024);
        spectrum1.getVector(0.0, 10, 4 * 1024).length.should.equal(4 * 1024);
    });

    it('getNucleus', function () {
        spectrum0.getNucleus().should.equal('1H');
        spectrum1.getNucleus().should.equal('1H');
    });
    it('getSolventName', function () {
        spectrum0.getSolventName().should.equal('DMSO');
        spectrum1.getSolventName().should.equal('DMSO');
    });
    it('getFirstX', function () {
        spectrum0.getFirstX().should.equal(11.00659);
        spectrum1.getFirstX().should.equal(11.00659);
    });

    it('getLastX', function () {
        spectrum0.getLastX().should.equal(-1.009276326659311);
        spectrum1.getLastX().should.equal(-1.009276326659311);
    });

    it('getFirstY', function () {
        spectrum0.getFirstY().should.equal(-119886);
        spectrum1.getFirstY().should.equal(-119886);
    });

    it('getLastY', function () {
        //console.log(spectrum.getLastY());
        spectrum0.getLastY().should.equal(-109159);
        spectrum1.getLastY().should.equal(-109159);
    });

    it('getTitle', function () {
        spectrum0.getTitle().should.equal('109-92-2');
        spectrum1.getTitle().should.equal('109-92-2');
    });

    it('Checking X array', function () {
        var x = spectrum0.getXData();
        x.should.be.instanceof(Array).and.have.lengthOf(16384);
        x[0].should.equal(11.00659);
        x = spectrum1.getXData();
        x.should.be.instanceof(Array).and.have.lengthOf(16384);
        x[0].should.equal(11.00659);
    });

    it('Checking Y array', function () {
        var y = spectrum0.getYData();
        y.should.be.instanceof(Array).and.have.lengthOf(16384);
        y[0].should.equal(-119886);
        y = spectrum1.getYData();
        y.should.be.instanceof(Array).and.have.lengthOf(16384);
        y[0].should.equal(-119886);
    });

    it('Checking XY array', function () {
        var xy = spectrum0.getXYData();
        xy.should.be.instanceof(Array).and.have.lengthOf(2);
        xy[0].should.be.instanceof(Array).and.have.lengthOf(16384);
        xy[1].should.be.instanceof(Array).and.have.lengthOf(16384);
        xy[0][0].should.equal(11.00659);
        xy[1][0].should.equal(-119886);
        xy = spectrum1.getXYData();
        xy.should.be.instanceof(Array).and.have.lengthOf(2);
        xy[0].should.be.instanceof(Array).and.have.lengthOf(16384);
        xy[1].should.be.instanceof(Array).and.have.lengthOf(16384);
        xy[0][0].should.equal(11.00659);
        xy[1][0].should.equal(-119886);
    });

    it('Checking if is2D is false', function () {
        spectrum0.is2D().should.equal(false);
        spectrum1.is2D().should.equal(false);
    });
});

