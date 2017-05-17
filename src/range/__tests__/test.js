'use strict';

const Ranges = require('../Ranges');
const spectraData = require('../..');

const peakPicking2 = [{from: 7.259567221753428, to: 7.318545497368789, integral: 1.9354480567186667, signal: [{nbAtoms: 0, diaID: [], multiplicity: 'm', peak: [{x: 7.264130150992702, intensity: 10230595.662001802, width: 0.0010795192414810183}, {x: 7.267313269758635, intensity: 33830239.744481005, width: 0.002582016001735651}, {x: 7.26915887487899, intensity: 82842584.92520925, width: 0.002831119711738281}, {x: 7.273582340794764, intensity: 29798402.62598269, width: 0.00197833093929646}, {x: 7.284598930303681, intensity: 30099807.38175221, width: 0.0031866232630691554}, {x: 7.286958822678864, intensity: 66104668.47609334, width: 0.0035257997357362627}, {x: 7.289039920055485, intensity: 58519280.47353261, width: 0.003000134376496613}, {x: 7.291170191411284, intensity: 14480250.493152825, width: 0.0025091519251745353}, {x: 7.293641097230771, intensity: 8278900.5697652325, width: 0.0031820690118580454}, {x: 7.30152839351497, intensity: 15145910.483957706, width: 0.0019963935165487135}, {x: 7.305576289271226, intensity: 38131210.12845494, width: 0.0023476840828383755}, {x: 7.307908197807933, intensity: 25620798.16253616, width: 0.003545766520285404}, {x: 7.309979324097105, intensity: 4639884.618023942, width: 0.0012545759625872677}], kind: '', remark: '', delta: 7.281479631718677}], signalID: '1', _highlight: ['1']}, {from: 7.149356845570731, to: 7.2314606693769035, integral: 2.8240965777687363, signal: [{nbAtoms: 0, diaID: [], multiplicity: 'm', peak: [{x: 7.1557887955935335, intensity: 5591680.186319249, width: 0.002143983340934377}, {x: 7.159469858143075, intensity: 18194664.865576517, width: 0.003206621599091567}, {x: 7.163074680296583, intensity: 8734475.204383057, width: 0.0022902243740416527}, {x: 7.1719298367846065, intensity: 5867700.939903316, width: 0.0010622327426390327}, {x: 7.177658370833152, intensity: 49708018.7511056, width: 0.004497924513508678}, {x: 7.182381741636994, intensity: 12907733.461250288, width: 0.002611763777352804}, {x: 7.190781909815829, intensity: 14013841.007286621, width: 0.001211836685952854}, {x: 7.192430352894496, intensity: 40047672.01104146, width: 0.0022742805669493994}, {x: 7.1942017788834685, intensity: 40387216.06066982, width: 0.0013146284156119487}, {x: 7.195902878552174, intensity: 61011461.64297504, width: 0.0030458533265566236}, {x: 7.198894055941731, intensity: 59031580.620660655, width: 0.0038901614350218302}, {x: 7.207277187409929, intensity: 14661986.778724607, width: 0.0002352329929851127}, {x: 7.213523088729353, intensity: 104871095.16688126, width: 0.005979193549183313}, {x: 7.217091276272375, intensity: 42365900.12659337, width: 0.002180679813589456}, {x: 7.218789923237918, intensity: 31214482.933312647, width: 0.001983192406815838}], kind: '', remark: '', delta: 7.211614113016371}], signalID: '2', _highlight: ['2']}, {from: 2.564358774124853, to: 2.6431905494415817, integral: 2.0493177070712, signal: [{nbAtoms: 0, diaID: [], multiplicity: 'q', peak: [{x: 2.5750490227771476, intensity: 40619298.65746296, width: 0.0036159870976937266}, {x: 2.59429216955914, intensity: 112490198.10727261, width: 0.004077989137599807}, {x: 2.61335814788463, intensity: 114474308.45558706, width: 0.004165081710460176}, {x: 2.632184875507714, intensity: 41588694.77344821, width: 0.0039023019038913003}], kind: '', remark: '', j: [{coupling: 7.615544704807007, multiplicity: 'q'}], delta: 2.6037746617832176}], signalID: '3', _highlight: ['3']}, {from: 1.1657135299531254, to: 1.2155098993618774, integral: 2.7832580799857283, signal: [{nbAtoms: 0, diaID: [], multiplicity: 't', peak: [{x: 1.1714037638969903, intensity: 197967954.85361427, width: 0.0019407860113447894}, {x: 1.1907356875556923, intensity: 331323347.4982505, width: 0.0025208458640416805}, {x: 1.2095554172376735, intensity: 219470527.98865104, width: 0.0021462827409901896}], kind: '', remark: '', j: [{coupling: 7.631903864109688, multiplicity: 't'}], delta: 1.1906117146575015}], signalID: '4', _highlight: ['4']}];
const prediction = [{atomIDs: ['8'], diaIDs: ['did@`@fTfYea`H`@GzP`HeT'], integral: 1, delta: 6.853, atomLabel: 'H', multiplicity: 't', j: [{assignment: '9', diaID: 'did@`@f\\bbbQ[hBB@A~dHBIU@', coupling: 1.564, multiplicity: 'd'},
    {assignment: '10', diaID: 'did@`@fTfUff`@h@GzP`HeT', coupling: 0.519, multiplicity: 't'}, {assignment: '11', diaID: 'did@`@f\\bbbQ[hBB@A~dHBIU@', coupling: 1.564, multiplicity: 'd'}]}, {atomIDs: ['9'], diaIDs: ['did@`@f\\bbbQ[hBB@A~dHBIU@'], integral: 1, delta: 6.962, atomLabel: 'H',
        multiplicity: 'd', j: [{assignment: '8', diaID: 'did@`@fTfYea`H`@GzP`HeT', coupling: 1.564, multiplicity: 't'}, {assignment: '10', diaID: 'did@`@fTfUff`@h@GzP`HeT', coupling: 7.869, multiplicity: 't'}]}, {atomIDs: ['10'], diaIDs: ['did@`@fTfUff`@h@GzP`HeT'], integral: 1, delta: 7.173,
            atomLabel: 'H', multiplicity: 't', j: [{assignment: '8', diaID: 'did@`@fTfYea`H`@GzP`HeT', coupling: 0.519, multiplicity: 't'}, {assignment: '9', diaID: 'did@`@f\\bbbQ[hBB@A~dHBIU@', coupling: 7.869, multiplicity: 'd'}, {assignment: '11', diaID: 'did@`@f\\bbbQ[hBB@A~dHBIU@', coupling: 7.869,
                multiplicity: 'd'}]}, {atomIDs: ['11'], diaIDs: ['did@`@f\\bbbQ[hBB@A~dHBIU@'], integral: 1, delta: 6.962, atomLabel: 'H', multiplicity: 'd', j: [{assignment: '8', diaID: 'did@`@fTfYea`H`@GzP`HeT', coupling: 1.564, multiplicity: 't'}, {assignment: '10', diaID: 'did@`@fTfUff`@h@GzP`HeT',
                    coupling: 7.869, multiplicity: 't'}]}, {atomIDs: ['12'], diaIDs: ['did@`@fTeeYnh@H@GzP`HeT'], integral: 1, delta: 2.237, atomLabel: 'H', multiplicity: 'm', j: []}, {atomIDs: ['13'], diaIDs: ['did@`@fTeeYnh@H@GzP`HeT'], integral: 1, delta: 2.237, atomLabel: 'H', multiplicity: 'm', j: []},
    {atomIDs: ['14'], diaIDs: ['did@`@fTeeYnh@H@GzP`HeT'], integral: 1, delta: 2.237, atomLabel: 'H', multiplicity: 'm', j: []}, {atomIDs: ['15'], diaIDs: ['did@`@fTeeYnh@H@GzP`HeT'], integral: 1, delta: 2.237, atomLabel: 'H', multiplicity: 'm', j: []}, {atomIDs: ['16'], diaIDs: ['did@`@fTeeYnh@H@GzP`HeT'],
        integral: 1, delta: 2.237, atomLabel: 'H', multiplicity: 'm', j: []}, {atomIDs: ['17'], diaIDs: ['did@`@fTeeYnh@H@GzP`HeT'], integral: 1, delta: 2.237, atomLabel: 'H', multiplicity: 'm', j: []}];

const ethylbenzenePrediction = [{atomIDs: ['15', '16', '17'], diaIDs: ['did@`@fTeYWaj@@@GzP`HeT'], integral: 3, delta: 0.992, atomLabel: 'H', j: [{assignment: '13', diaID: 'did@`@fTf[Waj@@bJ@_iB@bUP', coupling: 7.392, multiplicity: 'd'}, {assignment: '14', diaID: 'did@`@fTf[Waj@@bJ@_iB@bUP', coupling: 7.392, multiplicity: 'd'}], _highlight: ['did@`@fTeYWaj@@@GzP`HeT']}, {atomIDs: ['13', '14'], diaIDs: ['did@`@fTf[Waj@@bJ@_iB@bUP'], integral: 2, delta: 2.653, atomLabel: 'H', j: [{assignment: '15', diaID: 'did@`@fTeYWaj@@@GzP`HeT', coupling: 7.392, multiplicity: 'd'}, {assignment: '16', diaID: 'did@`@fTeYWaj@@@GzP`HeT', coupling: 7.392, multiplicity: 'd'}, {assignment: '17', diaID: 'did@`@fTeYWaj@@@GzP`HeT', coupling: 7.392, multiplicity: 'd'}], _highlight: ['did@`@fTf[Waj@@bJ@_iB@bUP']}, {atomIDs: ['9', '10'], diaIDs: ['did@`@fTfYUn`HH@GzP`HeT'], integral: 2, delta: 7.162, atomLabel: 'H', j: [{assignment: '8', diaID: 'did@`@f\\bbRaih@J@A~dHBIU@', coupling: 7.758, multiplicity: 'd'}, {assignment: '11', diaID: 'did@`@f\\bbRaih@J@A~dHBIU@', coupling: 0.507, multiplicity: 'd'}, {assignment: '12', diaID: 'did@`@fTfUvf`@h@GzP`HeT', coupling: 1.292, multiplicity: 'd'}], _highlight: ['did@`@fTfYUn`HH@GzP`HeT']}, {atomIDs: ['12'], diaIDs: ['did@`@fTfUvf`@h@GzP`HeT'], integral: 1, delta: 7.196, atomLabel: 'H', j: [{assignment: '8', diaID: 'did@`@f\\bbRaih@J@A~dHBIU@', coupling: 7.718, multiplicity: 'd'}, {assignment: '9', diaID: 'did@`@fTfYUn`HH@GzP`HeT', coupling: 1.292, multiplicity: 'd'}, {assignment: '10', diaID: 'did@`@fTfYUn`HH@GzP`HeT', coupling: 1.293, multiplicity: 'd'}, {assignment: '11', diaID: 'did@`@f\\bbRaih@J@A~dHBIU@', coupling: 7.718, multiplicity: 'd'}], _highlight: ['did@`@fTfUvf`@h@GzP`HeT']}, {atomIDs: ['8', '11'], diaIDs: ['did@`@f\\bbRaih@J@A~dHBIU@'], integral: 2, delta: 7.26, atomLabel: 'H', j: [{assignment: '9', diaID: 'did@`@fTfYUn`HH@GzP`HeT', coupling: 7.758, multiplicity: 'd'}, {assignment: '10', diaID: 'did@`@fTfYUn`HH@GzP`HeT', coupling: 0.507, multiplicity: 'd'}, {assignment: '12', diaID: 'did@`@fTfUvf`@h@GzP`HeT', coupling: 7.718, multiplicity: 'd'}], _highlight: ['did@`@f\\bbRaih@J@A~dHBIU@']}];

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
        var fn = ranges.getVector();
        fn.x[0].should.approximately(1.1657135299531254, 0.005);
        fn.x[fn.x.length - 1].should.approximately(7.318545497368789, 0.005);
        fn.y[0].should.greaterThan(0);
        fn.y.length.should.equal(16384);
        fn = ranges.getVector({from: 10, to: 0, functionName: 'Lorentzian', nbPoints: 101});
        fn.x[0].should.equal(10);
        fn.x[fn.x.length - 1].should.equal(0);
        fn.x.length.should.equal(101);
    });

    it('ranges to peaks', function () {
        var fn = ranges.getPeakList();
        fn[0].x.should.greaterThan(0);
        fn[0].intensity.should.greaterThan(0);
        fn[0].width.should.greaterThan(0);
    });
});

describe('Prediction to ranges', function () {
    it('10 spines with 4 ranges', function () {
        var ranges = Ranges.fromSignals(prediction, {lineWidth: 1});
        ranges.length.should.eql(4);
    });
});

describe('Update ranges', function () {
    var sum = 3;
    it('change sum', function () {
        var ranges = new Ranges([{integral: 1}, {integral: 2}]);
        ranges = ranges.updateIntegrals({sum: sum * 2});
        ranges.should.eql(new Ranges([{integral: 2}, {integral: 4}]));
    });
    it('add an integral', function () {
        var ranges = new Ranges([{integral: 1}, {integral: 2}]);
        ranges.push({integral: 3});
        ranges = ranges.updateIntegrals({sum: sum});
        ranges.should.eql(new Ranges([{integral: 0.5}, {integral: 1}, {integral: 1.5}]));
    });
    it('delete an integral', function () {
        var ranges = new Ranges([{integral: 1}]);
        ranges = ranges.updateIntegrals({sum: sum});
        ranges.should.eql(new Ranges([{integral: 3}]));
    });
    it('change an integral', function () {
        var ranges = new Ranges([{integral: 1}, {integral: 2}]);
        ranges = ranges.updateIntegrals({factor: 2});
        ranges.should.eql(new Ranges([{integral: 2}, {integral: 4}]));
    });
});

describe('toIndex Test Case from differents sources', function () {

    it('from ranges', function () {
        var range = new Ranges(peakPicking2);
        var index = range.toIndex({tolerance: 0.05});
        index[0].delta.should.greaterThan(7.2);
        index[0].multiplicity.should.equal('m');
    });

    it('from Spectrum', function () {
        var NbPoints = 101;
        var cs1 = 2;
        var intensity = 1;
        var w = 0.1;
        var cs2 = 8;
        var intensity2 = intensity * 2;
        var w2 = w;

        var line = new Array(NbPoints);
        var x = xRange(0, 10, NbPoints);

        for (var i = 0; i < NbPoints; i++) {
            line[i] = 2 * intensity / Math.PI * w / (4 * Math.pow(cs1 - x[i], 2) + Math.pow(w, 2))
                + 2 * intensity2 / Math.PI * w2 / (4 * Math.pow(cs2 - x[i], 2) + Math.pow(w2, 2));
        }
        var spectrum = spectraData.NMR.fromXY(x, line, {});

        var range = Ranges.fromSpectrum(spectrum, {});
        var index = range.toIndex({tolerance: 0.05, compactPattern: false});
        index[0].delta.should.greaterThan(7.5);
        index[0].multiplicity.should.eql('br s');
        // var index = range.toIndex({tolerance: 0.05, joinCoupling: true});
        // index[0].multiplicity.should.equal('s'); // because inside of peakPicking information don't exist a j array for this signal. It shows us that joinCoupling function need to be modified
    });

    it('from Prediction', function () {
        var range = Ranges.fromSignals(prediction, {lineWidth: 1});
        var index = range.toIndex({});
        index.length.should.eql(10);
        index[1].delta.should.eql(2.237);
        index[0].multiplicity.should.eql('m');
    });

    it('joinCouplings', function () {
        var range = Ranges.fromSignals(ethylbenzenePrediction, {lineWidth: 1});

        range.length.should.eql(4);
        range.joinCouplings({tolerance: 0.05, compactPattern: true});
        range.forEach(a => {
            if (a.multiplicity !== 'm') {
                a.multiplicity = a.signal[0].multiplicity;
            }
        });
        range[0].multiplicity.should.eql('t');
        range[0].integral.should.eql(3);
        range[0].signal.length.should.eql(1);
        range[1].multiplicity.should.eql('q');
        range[1].integral.should.eql(2);
        range[1].signal.length.should.eql(1);
        range[2].multiplicity.should.eql('m');
        range[2].integral.should.eql(3);
        range[2].signal.length.should.eql(2);
        range[3].multiplicity.should.eql('td');
        range[3].integral.should.eql(2);
        range[3].signal.length.should.eql(1);
    });
});

function xRange(start, end, nbPoints) {
    var a = new Array(nbPoints);
    var jump = (end - start) / (nbPoints - 1);
    for (var i = 0; i < nbPoints; i++) {
        a[i] = start + jump * i;
    }
    return a;
}
