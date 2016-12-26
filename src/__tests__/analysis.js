/**
 * Created by Abol on 12/25/2016.
 */

const FS = require('fs');
const Data = require('..');
// const Analysis = require('../analysis');

function createData(filename) {
    var spectra = Data.NMR.fromBruker(
        FS.readFileSync(__dirname + filename).toString(),{}
    );
    console.log(spectra)
    return spectra;
}

describe('spectra-data analysis module - profile', function () {
    var spectra = createData('/../../data-test/dataSetAnalysis.zip');
});