'use strict';


const NMR = require('../../NMR.js');

var NbPoints = 101;
var cs1 = 2,
    intensity = 1,
    w = 0.1,
    cs2 = 8,
    intensity2 = intensity * 2,
    w2 = w,
    totalIntegral = 0;

var line = new Array(NbPoints);
var x = xRange(0, 10, NbPoints);

for (var i = 0; i < NbPoints; i++) {
    line[i] = 2 * intensity / Math.PI * w / (4 * Math.pow(cs1 - x[i], 2) + Math.pow(w, 2))
        + 2 * intensity2 / Math.PI * w2 / (4 * Math.pow(cs2 - x[i], 2) + Math.pow(w2, 2));
}

var spectrum = NMR.fromXY(x, line, {});
var options = {noiseLevel: 0.1,
    thresholdFactor: 1,
    clean: false,
    compile: true,
    optimize: true,
    integralType: 'sum',
    nH: 3,
    frequencyCluster: 16,
    gsdOptions: {nL: 4, smoothY: false, minMaxRatio: 0.05, broadWidth: 0.2,
        noiseLevel: 0.1,
        functionType: 'lorentzian',
        broadRatio: 0,
        sgOptions: {windowSize: 9, polynomial: 3}
    },
    format: 'new'
};

var peakPicking = spectrum.getRanges(options);
i = 0;
while (i < peakPicking.length) {
    totalIntegral += peakPicking[i].integral;
    i += 1;
}

function xRange(start, end, NbPoints) {
    var a = new Array(NbPoints).fill(start);
    var jump = (end - start) / (NbPoints - 1);
    for (let i = 0; i < NbPoints; i++) {
        a[i] += jump * i;
    }
    return a;
}

describe('getRanges test with two gaussians', function () {
    it('sum of integral is correct', function () {
        totalIntegral.should.equal(options.nH);
    });
});
