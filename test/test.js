'use strict';
var converter = require('jcampconverter');

var spectraData = require('..');
describe('spectra-data test library name', function () {
    it('should return true', function () {
        spectraData.SD.should.be.object;
    });
});
