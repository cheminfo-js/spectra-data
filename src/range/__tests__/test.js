/**
 * Created by acastillo on 6/14/16.
 */
'use strict';

const Ranges = require('../Ranges');

const peakPicking2 = [{'from': 7.259567221753428, 'to': 7.318545497368789, 'integral': 1.9354480567186667, 'signal': [{'nbAtoms': 0, 'diaID': [], 'multiplicity': 'm', 'peak': [{'x': 7.264130150992702, 'intensity': 10230595.662001802, 'width': 0.0010795192414810183}, {'x': 7.267313269758635, 'intensity': 33830239.744481005, 'width': 0.002582016001735651}, {'x': 7.26915887487899, 'intensity': 82842584.92520925, 'width': 0.002831119711738281}, {'x': 7.273582340794764, 'intensity': 29798402.62598269, 'width': 0.00197833093929646}, {'x': 7.284598930303681, 'intensity': 30099807.38175221, 'width': 0.0031866232630691554}, {'x': 7.286958822678864, 'intensity': 66104668.47609334, 'width': 0.0035257997357362627}, {'x': 7.289039920055485, 'intensity': 58519280.47353261, 'width': 0.003000134376496613}, {'x': 7.291170191411284, 'intensity': 14480250.493152825, 'width': 0.0025091519251745353}, {'x': 7.293641097230771, 'intensity': 8278900.5697652325, 'width': 0.0031820690118580454}, {'x': 7.30152839351497, 'intensity': 15145910.483957706, 'width': 0.0019963935165487135}, {'x': 7.305576289271226, 'intensity': 38131210.12845494, 'width': 0.0023476840828383755}, {'x': 7.307908197807933, 'intensity': 25620798.16253616, 'width': 0.003545766520285404}, {'x': 7.309979324097105, 'intensity': 4639884.618023942, 'width': 0.0012545759625872677}], 'kind': '', 'remark': '', 'delta': 7.281479631718677}], 'signalID': '1', '_highlight': ['1']}, {'from': 7.149356845570731, 'to': 7.2314606693769035, 'integral': 2.8240965777687363, 'signal': [{'nbAtoms': 0, 'diaID': [], 'multiplicity': 'm', 'peak': [{'x': 7.1557887955935335, 'intensity': 5591680.186319249, 'width': 0.002143983340934377}, {'x': 7.159469858143075, 'intensity': 18194664.865576517, 'width': 0.003206621599091567}, {'x': 7.163074680296583, 'intensity': 8734475.204383057, 'width': 0.0022902243740416527}, {'x': 7.1719298367846065, 'intensity': 5867700.939903316, 'width': 0.0010622327426390327}, {'x': 7.177658370833152, 'intensity': 49708018.7511056, 'width': 0.004497924513508678}, {'x': 7.182381741636994, 'intensity': 12907733.461250288, 'width': 0.002611763777352804}, {'x': 7.190781909815829, 'intensity': 14013841.007286621, 'width': 0.001211836685952854}, {'x': 7.192430352894496, 'intensity': 40047672.01104146, 'width': 0.0022742805669493994}, {'x': 7.1942017788834685, 'intensity': 40387216.06066982, 'width': 0.0013146284156119487}, {'x': 7.195902878552174, 'intensity': 61011461.64297504, 'width': 0.0030458533265566236}, {'x': 7.198894055941731, 'intensity': 59031580.620660655, 'width': 0.0038901614350218302}, {'x': 7.207277187409929, 'intensity': 14661986.778724607, 'width': 0.0002352329929851127}, {'x': 7.213523088729353, 'intensity': 104871095.16688126, 'width': 0.005979193549183313}, {'x': 7.217091276272375, 'intensity': 42365900.12659337, 'width': 0.002180679813589456}, {'x': 7.218789923237918, 'intensity': 31214482.933312647, 'width': 0.001983192406815838}], 'kind': '', 'remark': '', 'delta': 7.211614113016371}], 'signalID': '2', '_highlight': ['2']}, {'from': 2.564358774124853, 'to': 2.6431905494415817, 'integral': 2.0493177070712, 'signal': [{'nbAtoms': 0, 'diaID': [], 'multiplicity': 'q', 'peak': [{'x': 2.5750490227771476, 'intensity': 40619298.65746296, 'width': 0.0036159870976937266}, {'x': 2.59429216955914, 'intensity': 112490198.10727261, 'width': 0.004077989137599807}, {'x': 2.61335814788463, 'intensity': 114474308.45558706, 'width': 0.004165081710460176}, {'x': 2.632184875507714, 'intensity': 41588694.77344821, 'width': 0.0039023019038913003}], 'kind': '', 'remark': '', 'j': [{'coupling': 7.615544704807007, 'multiplicity': 'q'}], 'delta': 2.6037746617832176}], 'signalID': '3', '_highlight': ['3']}, {'from': 1.1657135299531254, 'to': 1.2155098993618774, 'integral': 2.7832580799857283, 'signal': [{'nbAtoms': 0, 'diaID': [], 'multiplicity': 't', 'peak': [{'x': 1.1714037638969903, 'intensity': 197967954.85361427, 'width': 0.0019407860113447894}, {'x': 1.1907356875556923, 'intensity': 331323347.4982505, 'width': 0.0025208458640416805}, {'x': 1.2095554172376735, 'intensity': 219470527.98865104, 'width': 0.0021462827409901896}], 'kind': '', 'remark': '', 'j': [{'coupling': 7.631903864109688, 'multiplicity': 't'}], 'delta': 1.1906117146575015}], 'signalID': '4', '_highlight': ['4']}];
var ranges = new Ranges(peakPicking2);

var singleRange = [{from: 0.9, to: 1.1, integral: 1}];
singleRange[0].signal = [{nbAtoms: 0,
    diaID: '',
    multiplicity: '',
    peak: [{x: 1, intensity: 0, width: 0}],
    delta: 1,
    remark: '',
    j: []},
];

describe('Range tests: formating and parsing', function () {

    it('ranges to vector', function () {
        var fn = ranges.toVector(); //Data.range2Vector(peakPicking2);
        fn.x.length.should.equal(16 * 1024);
        fn.y.length.should.equal(16 * 1024);
        fn.x[0].should.approximately(1.1657135299531254, 0.005);
        fn.x[fn.x.length - 1].should.approximately(7.318545497368789, 0.005);
        fn.y[0].should.greaterThan(0);
    });

    it('ranges to peaks', function () {
        var fn = ranges.toPeakList();//Data.range2Peaks(peakPicking2);
        fn[0].x.should.greaterThan(0);
        fn[0].intensity.should.greaterThan(0);
        fn[0].width.should.greaterThan(0);
    });
});

describe('Prediction to ranges', function () {
    const prediction = [{'atomIDs': ['8'], 'diaIDs': ['did@`@f\\bbRaih@J@A~dHBIU@'], 'integral': 1, 'delta': 7.26, 'j': [{'assignment': '9', 'coupling': 3.859, 'multiplicity': 2}, {'assignment': '10', 'coupling': 3.879, 'multiplicity': 2}, {'assignment': '13', 'coupling': 1.7535, 'multiplicity': 2}]},
        {'atomIDs': ['9'], 'diaIDs': ['did@`@fTfUvf`@h@GzP`HeT'], 'integral': 1, 'delta': 7.196, 'j': [{'assignment': '8', 'coupling': 3.859, 'multiplicity': 2}, {'assignment': '10', 'coupling': 0.646, 'multiplicity': 2}, {'assignment': '13', 'coupling': 0.6465, 'multiplicity': 2}, {'assignment': '14', 'coupling': 3.859, 'multiplicity': 2}]},
        {'atomIDs': ['10'], 'diaIDs': ['did@`@fTfYUn`HH@GzP`HeT'], 'integral': 1, 'delta': 7.162, 'j': [{'assignment': '8', 'coupling': 3.879, 'multiplicity': 2}, {'assignment': '9', 'coupling': 0.646, 'multiplicity': 2}, {'assignment': '14', 'coupling': 1.762, 'multiplicity': 2}]},
        {'atomIDs': ['11'], 'diaIDs': ['did@`@fTf[Waj@@bJ@_iB@bUP'], 'integral': 1, 'delta': 2.653, 'j': [{'assignment': '15', 'coupling': 3.696, 'multiplicity': 2}, {'assignment': '16', 'coupling': 3.696, 'multiplicity': 2}, {'assignment': '17', 'coupling': 3.696, 'multiplicity': 2}]},
        {'atomIDs': ['12'], 'diaIDs': ['did@`@fTf[Waj@@bJ@_iB@bUP'], 'integral': 1, 'delta': 2.653, 'j': [{'assignment': '15', 'coupling': 3.696, 'multiplicity': 2}, {'assignment': '16', 'coupling': 3.696, 'multiplicity': 2}, {'assignment': '17', 'coupling': 3.696, 'multiplicity': 2}]},
        {'atomIDs': ['13'], 'diaIDs': ['did@`@fTfYUn`HH@GzP`HeT'], 'integral': 1, 'delta': 7.162, 'j': [{'assignment': '8', 'coupling': 1.7535, 'multiplicity': 2}, {'assignment': '9', 'coupling': 0.6465, 'multiplicity': 2}, {'assignment': '14', 'coupling': 3.879, 'multiplicity': 2}]},
        {'atomIDs': ['14'], 'diaIDs': ['did@`@f\\bbRaih@J@A~dHBIU@'], 'integral': 1, 'delta': 7.26, 'j': [{'assignment': '9', 'coupling': 3.859, 'multiplicity': 2}, {'assignment': '10', 'coupling': 1.762, 'multiplicity': 2}, {'assignment': '13', 'coupling': 3.879, 'multiplicity': 2}]},
        {'atomIDs': ['15'], 'diaIDs': ['did@`@fTeYWaj@@@GzP`HeT'], 'integral': 1, 'delta': 0.992, 'j': [{'assignment': '11', 'coupling': 3.696, 'multiplicity': 2}, {'assignment': '12', 'coupling': 3.696, 'multiplicity': 2}]},
        {'atomIDs': ['16'], 'diaIDs': ['did@`@fTeYWaj@@@GzP`HeT'], 'integral': 1, 'delta': 0.992, 'j': [{'assignment': '11', 'coupling': 3.696, 'multiplicity': 2}, {'assignment': '12', 'coupling': 3.696, 'multiplicity': 2}]},
        {'atomIDs': ['17'], 'diaIDs': ['did@`@fTeYWaj@@@GzP`HeT'], 'integral': 1, 'delta': 0.992, 'j': [{'assignment': '11', 'coupling': 3.696, 'multiplicity': 2}, {'assignment': '12', 'coupling': 3.696, 'multiplicity': 2}]}];


    it.only('10 spines should yield 4 ranges', function () {
        var ranges = Ranges.fromPrediction(prediction, {lineWidth: 1});
        ranges.length.should.eql(4);
    });
});

describe('Update ranges', function () {
    var sum = 3;
    it('change sum', function () {
        var ranges = new Ranges([{integral: 1}, {integral: 2}]);
        ranges = ranges.updateIntegrals({sum: sum * 2});
        ranges.should.eql([{integral: 2}, {integral: 4}]);
    });
    it('add an integral', function () {
        var ranges = [{integral: 1}, {integral: 2}];
        ranges.push({integral: 3});
        ranges = Data.updateIntegrals(ranges, {sum: sum});
        ranges.should.eql([{integral: 0.5}, {integral: 1}, {integral: 1.5}]);
    });
    it('delete an integral', function () {
        var ranges = [{integral: 1}];
        ranges = Data.updateIntegrals(ranges, {sum: sum});
        ranges.should.eql([{integral: 3}]);
    });
    it('change an integral', function () {
        var ranges = [{integral: 1}, {integral: 2}];
        ranges = Data.updateIntegrals(ranges, {factor: 2});
        ranges.should.eql([{integral: 2}, {integral: 4}]);
    });
});
