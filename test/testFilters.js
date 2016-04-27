var Data = require('..');
var FS = require('fs');
var lib = require("ml-fft");
var FFT = lib.FFT;



function createSpectraData(filename, label, data) {
    var spectrum = Data.NMR.fromJcamp(
        FS.readFileSync(__dirname + filename).toString()
    );
    return spectrum;
};


describe('spectra-data test Filters', function () {
    var nH = 8;

    //console.log(Data.ACS.formater.toACS(peakPicking,{solvent:spectrum.getSolventName()}));
    //console.log(peakPicking);
    it('fourier Tranformation', function () {
        var spectrum=createSpectraData("/data/FID.dx");
        //console.log(spectrum.spectra);
        spectrum.fourierTransform().getXUnits().should.equal("PPM");
        console.log(spectrum.getFirstX()+" "+spectrum.getLastX());
        console.log(spectrum.getX(0)+" "+spectrum.getX(spectrum.getNbPoints()-1));
    });
    it('zeroFilling nbPoints', function () {
        var spectrum=createSpectraData("/data/FID.dx");
        spectrum.zeroFilling(10).getNbPoints().should.equal(10);
        spectrum.zeroFilling(20).getNbPoints().should.equal(20);
    });
});





















