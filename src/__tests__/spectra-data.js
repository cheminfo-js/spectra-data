'use strict';

const spectraData = require('..');

describe('spectra-data examples library name', function () {
    it('should return true', function () {
        var type = typeof spectraData.SD;
        type.should.eql('function');
    });
});

var x = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var y = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

describe('reduceData', function () {
    it('ascending data', function () {
        var ans = spectraData.NMR.fromXY(x, y, {});
        ans.reduceData(1, 3, 3);
        ans.getYData()[0].should.be.equal(1);
        ans.getYData()[1].should.be.equal(2);
        ans.getYData()[2].should.be.equal(3);

        ans = spectraData.NMR.fromXY(x, y, {});
        ans.reduceData(1, 5, 3);
        ans.getYData()[0].should.be.equal(1);
        ans.getYData()[1].should.be.equal(3);
        ans.getYData()[2].should.be.equal(5);
    });

    it('descending data', function () {
        x.reverse();
        y.reverse();

        var ans = spectraData.NMR.fromXY(x, y, {});
        ans.reduceData(1, 3, 3);
        ans.getYData()[0].should.be.equal(3);
        ans.getYData()[1].should.be.equal(2);
        ans.getYData()[2].should.be.equal(1);

        ans = spectraData.NMR.fromXY(x, y, {});
        ans.reduceData(1, 5, 3);
        ans.getYData()[0].should.be.equal(5);
        ans.getYData()[1].should.be.equal(3);
        ans.getYData()[2].should.be.equal(1);
    });

    it('reduce window', function () {
        var x = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        var y = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        var ans = spectraData.NMR.fromXY(x, y, {});
        ans.reduceData(1, 5);
        ans.getYData()[0].should.be.equal(1);
        ans.getYData()[4].should.be.equal(5);
    });

});
