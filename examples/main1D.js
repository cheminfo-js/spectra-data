'use strict';

var Data = require('..');
var FS = require('fs');
function createSpectraData(filename, label, data) {
    var spectrum = Data.NMR.fromJcamp(
        FS.readFileSync(__dirname + filename).toString()
    );
    return spectrum;
}

//var spectrum=createSpectraData("/data/ethylbenzene/h1_0.jdx");
//var spectrum=createSpectraData("/data/ethylvinylether/1h.jdx");
//var spectrum=createSpectraData("/data/h1_119.jdx");
var spectrum = createSpectraData('/data/broadPeak.jdx');

var ranges = spectrum.getRanges({nH: 10, realTop: true, thresholdFactor: 1, clean: 0.5, compile: true,
    gsdOptions: {minMaxRatio: 0.03, broadRatio: 0.0025, smoothY: true, nL: 4}
});

