'use strict';

const Data = require('..');
const FS = require('fs');

function createSpectraData(filename) {
    var spectrum = Data.NMR2D.fromJcamp(
        FS.readFileSync(__dirname + filename).toString()
    );
    return spectrum;
}


describe('spectra-data examples indometacin/hmbc.dx', function () {
    var spectrum = createSpectraData('/../../data-test/indometacin/hmbc.dx');

    it('getNucleus', function () {
        spectrum.getNucleus(1).should.equal('1H');
        spectrum.getNucleus(2).should.equal('13C');
    });

    it('Check observeFrequencyX SFO1', function () {
        spectrum.observeFrequencyX().should.equal(399.682956295637);
    });

    it('Check observeFrequencyY SFO2', function () {
        spectrum.observeFrequencyY().should.equal(100.509649895251);
    });

    it('Checking if is2D is true', function () {
        spectrum.is2D().should.equal(true);
    });

    it('getFirstX', function () {
        spectrum.getFirstX().should.be.approximately(13.351190, 10e-6);
    });

    it('getLastX', function () {
        spectrum.getLastX().should.be.approximately(1.436984, 10e-6);
    });

    it('getFirstY', function () {
        spectrum.getFirstY().should.be.approximately(210.871341, 10e-6);
    });

    it('getLastY', function () {
        spectrum.getLastY().should.be.approximately(-11.211101, 10e-6);
    });

    it('getTitle', function () {
        spectrum.getTitle().should.equal('B1284/010/ucb80031  RED5179');
    });

    it('Checking first X array', function () {
        var x = spectrum.getXData();
        x.should.be.instanceof(Array).and.have.lengthOf(1024);
        x[0].should.be.approximately(13.351190, 10e-6);
    });

    it('Checking first Y array', function () {
        var y = spectrum.getYData();
        y.should.be.instanceof(Array).and.have.lengthOf(1024);
        y[0].should.equal(5108);
    });

    it('Checking number of sub-spectra', function () {
        spectrum.getNbSubSpectra().should.equal(1024);
    });

    it('Checking first XY array', function () {
        var xy = spectrum.getXYData();
        xy.should.be.instanceof(Array).and.have.lengthOf(2);
        xy[0].should.be.instanceof(Array).and.have.lengthOf(1024);
        xy[1].should.be.instanceof(Array).and.have.lengthOf(1024);
        xy[0][0].should.be.approximately(13.351190, 10e-6);
        xy[1][0].should.equal(5108);
    });

    it('Peak picking 2D', function () {
        var signals2D = spectrum.getZones(
            {thresholdFactor: 1,
                idPrefix: 'hmbc_',
                format: 'new'
            });
        signals2D.length.should.greaterThan(1);
        //console.log(signals2D[1].signal[0].peak);
    });

});

describe('spectra-data examples indometacin/hmbc.dx', function () {
    let nPoints = 1024;
    var data = new Array(nPoints);
    for (let i = 0; i < nPoints; i++) {
        data[i] = new Array(nPoints);
        for (let j = 0; j < nPoints; j++) {
            data[i][j] = 0;
        }
    }

    for (let i = 412; i < 612; i++) {
        for (let j = 412; j < 612; j++) {
            data[i][j] = -Math.abs(-i + 512) + 200 - Math.abs(-j + 512);
        }
    }

    var spectrum = Data.NMR2D.fromMatrix(data, {firsY: 0,
        lastY: 150,
        firstX: 0,
        lastX: 15,
        xType: '1H',
        yType: '13C',
        xUnit: 'PPM',
        yUnit: 'PPM',
        zUnit: 'Intensity',
        frequencyX: 400,
        frequencyY: 100
    });

    it('getNucleus', function () {
        spectrum.getNucleus(1).should.equal('1H');
        spectrum.getNucleus(2).should.equal('13C');
    });
});

