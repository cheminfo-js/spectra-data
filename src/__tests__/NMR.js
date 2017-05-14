'use strict';

const Data = require('..');
const FS = require('fs');

function createSpectraData(filename) {
    var spectrum = Data.NMR.fromJcamp(
        FS.readFileSync(__dirname + filename).toString()
    );
    return spectrum;
}

describe('spectra-data examples ethylvinylether/1h.jdx', function () {
    var spectrum = createSpectraData('/../../data-test/ethylvinylether/1h.jdx');

    it('getNucleus', function () {
        spectrum.getNucleus().should.equal('1H');
    });

    it('getSolventName', function () {
        spectrum.getSolventName().should.equal('DMSO');
    });

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
        var x = spectrum.getXData();
        x.should.be.instanceof(Array).and.have.lengthOf(16384);
        x[0].should.equal(11.00659);
    });

    it('Checking Y array', function () {
        var y = spectrum.getYData();
        y.should.be.instanceof(Array).and.have.lengthOf(16384);
        y[0].should.equal(-119886);
    });

    it('Checking XY array', function () {
        var xy = spectrum.getXYData();
        xy.should.be.instanceof(Array).and.have.lengthOf(2);
        xy[0].should.be.instanceof(Array).and.have.lengthOf(16384);
        xy[1].should.be.instanceof(Array).and.have.lengthOf(16384);
        xy[0][0].should.equal(11.00659);
        xy[1][0].should.equal(-119886);
    });

    it('Checking if is2D is false', function () {
        spectrum.is2D().should.equal(false);
    });

    it('Check peak-picking in the new format', function () {
        var peakPicking = spectrum.getRanges({nH: 8, realTop: true, thresholdFactor: 1, clean: 0.5, compile: true, idPrefix: '1H', format: 'new'});
        //console.log(peakPicking[0]);
        peakPicking[0].signal[0].peak.length.should.equal(4);
    });

    it('Check peak-picking in zone', function () {
        var peakPicking = spectrum.getRanges({nH: 8, realTop: true, thresholdFactor: 1, clean: 0.5, compile: true, idPrefix: '1H', format: 'new', from: 1, to: 2});
        //console.log(peakPicking[0]);
        peakPicking.length.should.eql(1);
        peakPicking[0].signal[0].multiplicity.should.eql('t');
    });

    it('getVector', function () {
        spectrum.getVector(0.0, 10, 4 * 1024).length.should.equal(4 * 1024);
    });

    it('updateIntegrals', function () {
        var nH = 8;
        var ranges = spectrum.getRanges({nH: nH, realTop: true, thresholdFactor: 1, clean: 0.5, compile: true, idPrefix: '1H', format: 'new'});
        ranges[0].to = 6.47;
        var integral0 = ranges[0].integral;
        spectrum.updateIntegrals(ranges, {nH: nH});
        ranges[0].integral.should.approximately(integral0 / 2, integral0 / nH);
    });
});

