'use strict';

const SDS = require('../spectraDataSet');
var FS = require('fs');
const jcamp = FS.readFileSync(__dirname + '/../../../data-test/ethylvinylether/1h.jdx').toString();
const text = `1,1
            2,2
            3,3
            4,4
            5,5
            6,6`;
describe('spectraDataSet', function () {
    it('fromText', function () {

        let arrayData = [{data: text},
                         {parameters: {'key1': 2, 'key2': 'Case'}, data: text}];
        let sdsFromText = SDS.fromText(arrayData);
        let data = sdsFromText[0];
        data.data.x[0].should.equal(1);
        (typeof data.key1 === 'undefined').should.equal(true);
        data = sdsFromText[1];
        data.data.x[0].should.equal(1);
        data.key2.should.equal('Case');
    });
    it.only('fromJcamp', function () {
        let arrayData = [{data: jcamp},
                         {parameters: {'key1': 2, 'key2': 'testCase'}, data: jcamp}];
        let sdsFromJcamp = SDS.fromJcamp(arrayData, {});
        sdsFromJcamp.length.should.equal(2);
        (typeof sdsFromJcamp[0].key1 === 'undefined').should.equal(true);
        sdsFromJcamp[1].key2.should.equal('testCase');
        sdsFromJcamp[1].data.x.length.should.greaterThan(2);
    });
    it('prototype functions', function () {
        let arrayData = [{data: text},
            {parameters: {'key1': 2, 'key2': 'Case'}, data: text}];
        let sdsFromText = SDS.fromText(arrayData);
        sdsFromText.pushJcamp(jcamp, {'key1': 'newJcamp', 'key2': 'Case'}, {});
        sdsFromText.setParameter('face', 'ungry', 0);
        (sdsFromText.getParameter('face')).should.equal('ungry');
        sdsFromText.length.should.equal(3);
        sdsFromText[2].key1.should.equal('newJcamp');
    });
});
