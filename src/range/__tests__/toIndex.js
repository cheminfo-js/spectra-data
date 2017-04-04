'use strict';

const Ranges = require('../Ranges.js');
const fs = require('fs');
const spectraData = require('../..');
const rangesForTest = JSON.parse(fs.readFileSync(__dirname + '/ranges.json', 'utf8'));
const prediction = JSON.parse(fs.readFileSync(__dirname + '/prediction.json', 'utf8'));


describe('toIndex Test Case from differents sources', function () {

    it('from ranges', function () {
        var range = new Ranges(rangesForTest);
        var index = range.toIndex();
        index[0].delta.should.greaterThan(2.95);
    });

    it('from Spectrum', function () {
        var NbPoints = 101;
        var cs1 = 2,
            intensity = 1,
            w = 0.1,
            cs2 = 8,
            intensity2 = intensity * 2,
            w2 = w;

        var line = new Array(NbPoints);
        var x = Xrange(0, 10, NbPoints);

        for (var i = 0; i < NbPoints; i++) {
            line[i] = 2 * intensity / Math.PI * w / (4 * Math.pow(cs1 - x[i], 2) + Math.pow(w, 2))
                + 2 * intensity2 / Math.PI * w2 / (4 * Math.pow(cs2 - x[i], 2) + Math.pow(w2, 2));
        }
        var spectrum = spectraData.NMR.fromXY(x, line, {});

        var range = Ranges.fromSpectrum(spectrum, {});
        var index = range.toIndex();

        index[0].delta.should.greaterThan(7.5);
    });

    it('from Prediction', function () {
        var range = Ranges.fromPrediction(prediction, {});

        prediction.length.should.equal(10);
    })
});

function Xrange(start, end, NbPoints) {
    var a = new Array(NbPoints);
    var jump = (end - start) / (NbPoints - 1);
    for (var i = 0; i < NbPoints; i++) {
        a[i] = start + jump * i;
    }
    return a;
}
