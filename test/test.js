'use strict';

var converter = require("jcampconverter");

var spectraData = require('..');

describe('spectra-data test', function () {
    it('should return true', function () {
        spectraData().should.be.true;
    });
});
