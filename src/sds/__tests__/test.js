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
        let sdsFromText = SDS.fromText(arrayData, {});
        let data = sdsFromText[0];
        data.getXData()[0].should.equal(1);
        (typeof data.getParameter('key1') === 'undefined').should.equal(true);
        data = sdsFromText[1];
        data.getXData()[0].should.equal(1);
        data.getXData().length.should.equal(6);
        data.getParameter('key2').should.equal(sdsFromText.getParameter('key2', 1));

    });
    it('fromJcamp', function () {
        let arrayData = [{data: jcamp},
                         {parameters: {'key1': 2, 'key2': 'testCase'}, data: jcamp}];
        let sdsFromJcamp = SDS.fromJcamp(arrayData, {});
        sdsFromJcamp.length.should.equal(2);
        (typeof sdsFromJcamp.getParameter('key1', 0) === 'undefined').should.equal(true);
        sdsFromJcamp[1].sd.info.key2.should.equal(sdsFromJcamp.getParameter('key2', 1));
        sdsFromJcamp[1].getNbPoints().should.greaterThan(2);
    });
    it('prototype functions', function () {
        let arrayData = [{data: text},
            {parameters: {'key1': 2, 'key2': 'Case'}, data: text}];
        let sdsFromText = SDS.fromText(arrayData, {});
        sdsFromText.pushJcamp(jcamp, {parameters:{'key1': 'newJcamp', 'key2': 'Case'}});
        sdsFromText.setParameter('face', 'ungry', 0);
        sdsFromText.getParameter('face', 0).should.equal('ungry');
        sdsFromText.length.should.equal(3);
        sdsFromText.getParameter('key1', 2).should.equal('newJcamp');
        sdsFromText.pushText(text, {});
        let l = sdsFromText[3].getYData(0).length;
        sdsFromText[3].getYData(0)[l - 1].should.equal(6);
    });
});
