'use strict';

var FS = require('fs');
var getMultiplicityFromSignal = require('../getMultiplicityFromSignal');


describe('get multiplicity from signal ', function () {

    var ranges = JSON.parse(FS.readFileSync(__dirname + '/simpleRanges.json'));

    it('test signals', function () {
        getMultiplicityFromSignal(ranges[0].signal[0]).should.equal('dd quint hex d hex');
        getMultiplicityFromSignal(ranges[1].signal[0]).should.equal('s');
        getMultiplicityFromSignal(ranges[2].signal[0]).should.equal('m');
        getMultiplicityFromSignal(ranges[4].signal[0]).should.equal('s br');
        getMultiplicityFromSignal(ranges[4].signal[1]).should.equal('dt');
    });
});

