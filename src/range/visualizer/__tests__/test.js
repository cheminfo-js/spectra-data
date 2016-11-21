/**
 * Created by acastillo on 3/11/15.
 */
'use strict';

var Ranges = require('../../Ranges');
var utils = require('../../utils');
var FS = require('fs');
var Data = require('../../../');

function createSpectraData(filename, label, data) {
    var spectrum = Data.NMR.fromJcamp(
        FS.readFileSync(__dirname + filename).toString()
    );
    return spectrum;
}


describe('Annotations 1D from ranges', function () {
    var spectrum = createSpectraData('/../../../../data-test/ethylbenzene/h1_0.jdx');
    var peakPicking1 = spectrum.autoPeakPicking({'nH': 10, realTop: true, thresholdFactor: 0.8, clean: true, compile: true, format: 'new'});

    it('Default options', function () {
        var annotations = peakPicking1.toAnnotations();
        annotations.length.should.eql(peakPicking1.length);
        annotations.forEach(annotation => {
            annotation._highlight.length.should.eql(1);
        });
    });
});

