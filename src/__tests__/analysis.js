
const FS = require('fs');
const Data = require('..');
const analysis = require("../analysis/analysis.js")
const statArray = require("ml-stat").array;
// const Analysis = require('../analysis');

function createData(filename) {
    var spectra = Data.NMR.fromBruker(
        FS.readFileSync(__dirname + filename),{}
    );
    return spectra;
}

describe('spectra-data analysis module - profile', function () {
    console.log(analysis)
    var spectra = createData('/../../data-test/dataSetAnalysis.zip')
    var pdata = new Array(spectra.length / 2);
    var i,
        j = 0;

    for (i = 1; i < spectra.length; i += 2) {

        pdata[j] = spectra[i].sd;
        var temp = spectra[i - 1].sd.value.info.$SPOFFS.split("\n");
        temp = temp[1].split(" ");
        pdata[j].value.info.$SPOFFS = temp;
        pdata[j].spoffs = temp[0];

        var spectrum = new Data.NMR(pdata[j].value, {});

        var noiseLevel = statArray.robustMeanAndStdev(spectrum.getVector(6.6,6.8,100)).stdev;

        pdata[j].optionsNMRPeakDetection = {noiseLevel:noiseLevel,
            thresholdFactor:1,
            clean:false,
            compile:false,
            optimize:true,
            integralType:"sum",
            nH:0,
            gsdOptions:{nL:5, smoothY:false, minMaxRatio: 0.05, broadWidth:0.5,
                noiseLevel:noiseLevel,
                functionType:"lorentzian",
                broadRatio:0,
                sgOptions:{windowSize:9, polynomial:3}
            },
            frequencyCluster: 200,
            format:"new"
        };
        pdata[j].peakPicking = spectrum.createRanges(pdata[j].optionsNmrPeakDetection);
        j += 1;
    }
    console.log(pdata[0].peakPicking[0])
    // var signals = analysis.filters.getSignals(pdata, 0.9)
    // console.log(signals)
    // var profile = analysis.profile(pdata, signals, 0.9)

    it('spectra exist', function() {
        spectra.length.should.equal(42)
    })

    it('spoffs values are correct', function() {
        pdata[0].value.info.$SPOFFS[0].should.equal('8000')
    })
});