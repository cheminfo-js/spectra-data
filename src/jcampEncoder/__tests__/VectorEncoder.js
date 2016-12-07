'use strict';

var Encoder = require('../VectorEncoder');

var raw = [0, 0, 0, 0, 2, 4, 4, 4, 7, 5, 4, 4, 5, 5, 7, 10, 11, 11, 6, 5, 7, 6, 9, 9, 7, 10, 10, 9, 10, 11, 12, 15, 16, 16, 14, 17, 38, 38, 35, 38, 42, 47, 54, 59, 66, 75, 78, 88, 96, 104, 110, 121, 128];
var zeros = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
describe('Text encoders examples', function () {
    it('DIFDUP should give the rigth string', function () {
        var DIFDUP = Encoder.differenceDuplicateEncoding(raw, 0, 1);
        DIFDUP.should.be.equal('0@%UKT%TLkj%J%KLJ%njKjL%kL%jJULJ%kLK1%lLMNPNPRLJ0QTOJ1P\r\n52A28');
    });
    it('DIFDUP should give the rigth zeros string', function () {
        var DIFDUP = Encoder.differenceDuplicateEncoding(zeros, 0, 1);
        DIFDUP.should.be.equal('0@%S1\r\n11@');
    });
});
