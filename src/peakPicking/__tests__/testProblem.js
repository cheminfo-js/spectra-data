'use strict';
const Data = require('../../..');
const FS = require('fs');

function createSpectraData(filename) {
    var spectrum = Data.NMR.fromJcamp(
        FS.readFileSync(__dirname + filename).toString()
    );
    return spectrum;
}

var spectrum = createSpectraData('/test.jdx');
var peakPicking = spectrum.getRanges({});

console.log(peakPicking);
console.log(peakPicking.length);
