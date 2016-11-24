'use strict';

const spectraData = require('..');

describe('spectra-data examples library name', function () {
    it('should return true', function () {
        var type = typeof spectraData.SD;
        type.should.eql('function');
    });
});
