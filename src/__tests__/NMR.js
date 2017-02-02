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
        var peakPicking = spectrum.getRanges({'nH': 8, realTop: true, thresholdFactor: 1, clean: true, compile: true, idPrefix: '1H', format: 'new'});
        //console.log(peakPicking[0]);
        peakPicking[0].signal[0].peak.length.should.equal(4);
    });

    it('Check peak-picking in zone', function () {
        var peakPicking = spectrum.getRanges({'nH': 8, realTop: true, thresholdFactor: 1, clean: true, compile: true, idPrefix: '1H', format: 'new', from: 1, to: 2});
        //console.log(peakPicking[0]);
        peakPicking.length.should.eql(1);
        peakPicking[0].signal[0].multiplicity.should.eql('t');
    });

    it('getVector', function () {
        spectrum.getVector(0.0, 10, 4 * 1024).length.should.equal(4 * 1024);
    });

    it('getIntegrals', function () {
        var nH = 8;
        var ranges = spectrum.getRanges({'nH': nH, realTop: true, thresholdFactor: 1, clean: true, compile: true, idPrefix: '1H', format: 'new'});
        ranges[0].to = 6.47;
        var integral0 = ranges[0].integral;
        spectrum.getIntegrals(ranges, {nH: nH});
        ranges[0].integral.should.approximately(integral0 / 2, integral0 / nH);
    });

});

var molfile = `Benzene, ethyl-, ID: C100414
  NIST    16081116462D 1   1.00000     0.00000
Copyright by the U.S. Sec. Commerce on behalf of U.S.A. All rights reserved.
  8  8  0     0  0              1 V2000
    0.5015    0.0000    0.0000 C   0  0  0  0  0  0           0  0  0
    0.0000    0.8526    0.0000 C   0  0  0  0  0  0           0  0  0
    1.5046    0.0000    0.0000 C   0  0  0  0  0  0           0  0  0
    2.0062    0.8526    0.0000 C   0  0  0  0  0  0           0  0  0
    3.0092    0.8526    0.0000 C   0  0  0  0  0  0           0  0  0
    1.5046    1.7554    0.0000 C   0  0  0  0  0  0           0  0  0
    0.5015    1.7052    0.0000 C   0  0  0  0  0  0           0  0  0
    3.5108    0.0000    0.0000 C   0  0  0  0  0  0           0  0  0
  1  2  2  0     0  0
  3  1  1  0     0  0
  2  7  1  0     0  0
  4  3  2  0     0  0
  4  5  1  0     0  0
  6  4  1  0     0  0
  5  8  1  0     0  0
  7  6  2  0     0  0
M  END
`;

// describe('spectra-data from molfile', function () {
//
//     it('get parameters', function (done) {
//         this.timeout(3000);
//         Data.NMR.fromMolfile(molfile, {frequency: 400, from: 0.5, to: 9.5, lineWidth: 2, nbPoints: 1024 * 32}).then(spectrum => {
//             spectrum.getNucleus().should.equal('1H');
//             spectrum.getSolventName().should.equal('none');
//             spectrum.getFirstX().should.equal(0.5);
//             spectrum.getLastX().should.equal(9.5);
//             spectrum.getFirstY().should.equal(0);
//             spectrum.getLastY().should.equal(0);
//             spectrum.getTitle().should.equal('Simulated spectrum');
//             var x = spectrum.getXData();
//             x.should.be.instanceof(Array).and.have.lengthOf(1024 * 32);
//             x[0].should.equal(0.5);
//
//             var y = spectrum.getYData();
//             y.should.be.instanceof(Array).and.have.lengthOf(1024 * 32);
//             y[0].should.equal(0);
//
//             var xy = spectrum.getXYData();
//             xy.should.be.instanceof(Array).and.have.lengthOf(2);
//             xy[0].should.be.instanceof(Array).and.have.lengthOf(1024 * 32);
//             xy[1].should.be.instanceof(Array).and.have.lengthOf(1024 * 32);
//             xy[0][0].should.equal(0.5);
//             xy[1][0].should.equal(0);
//             spectrum.is2D().should.equal(false);
//             var peakPicking = spectrum.getRanges({'nH': 10, realTop: true, thresholdFactor: 0.1, clean: true, compile: true, idPrefix: '1H', format: 'new'});
//             peakPicking.length.should.eql(3);
//             peakPicking[2].signal[0].peak.length.should.equal(3);
//             peakPicking[2].signal[0].multiplicity.should.eql('t');
//             peakPicking[1].signal[0].peak.length.should.equal(4);
//             peakPicking[1].signal[0].multiplicity.should.eql('q');
//             done();
//         });
//     });
// });



