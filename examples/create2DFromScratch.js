/**
 * Created by acastillo on 2/16/17.
 */

const FS = require('fs');
const Data = require('../src/index.js');

let nPoints = 1024;
var data = new Array(nPoints);
for(var i = 0; i < nPoints; i++ ) {
    data[i] = new Array(nPoints);
    for(var j = 0; j < nPoints; j++ ) {
        data[i][j] = 0;
    }
}

for(var i = 412; i < 612; i++ ) {
    for(var j = 412; j < 612; j++ ) {
        data[i][j] = 10* Math.exp(-(Math.pow(i-512, 2)/4000 + Math.pow(j-512, 2)/(4000)));//Math.pow(-Math.abs(- i + 512) + 200 - Math.abs(- j + 512), 2);
    }
}

var spectrum = Data.NMR2D.fromMatrix(data, {
    firsY: 0,
    lastY: 150,
    firstX: 0,
    lastX: 15,
    xType: '1H',
    yType: '13C',
    xUnit: 'PPM',
    yUnit: 'PPM',
    zUnit: 'Intensity',
    frequencyX: 400,
    frequencyY: 100
});

FS.writeFileSync('daSpectrum.jdx', spectrum.toJcamp({type: 'NTUPLES'}));
