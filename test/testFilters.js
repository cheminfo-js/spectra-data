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
        var spectrum=createSpectraData("/data/fftTest/FID.dx");
        //console.log(spectrum.spectra);
        //spectrum.fourierTransform();
        console.log(spectrum.getNbPoints());
        spectrum.digitalFilter({nbPoints:-67}).fourierTransform();
        //spectrum.zeroFilling(spectrum.getNbPoints()*2).digitalFilter({nPoints:67}).fourierTransform();
        spectrum.phaseCorrection(Math.PI/2, 0);
        spectrum.setActiveElement(1);
        //console.log(JSON.stringify(spectrum.getXData()));
        //console.log(JSON.stringify(spectrum.getYData()));
        for(var i=0;i<15;i++){
            console.log(spectrum.getX(i));
        }
        for(var i=0;i<15;i++){
            //console.log(spectrum.getY(i));
        }
        console.log(" ");
        spectrum.setActiveElement(0);
        //console.log(JSON.stringify(spectrum.getXData()));
        //console.log(JSON.stringify(spectrum.getYData()));
        for(var i=0;i<15;i++){
            console.log(spectrum.getX(i));
        }
        for(var i=0;i<15;i++){
           // console.log(spectrum.getY(i));
        }
        console.log(JSON.stringify((spectrum.getVector(spectrum.getFirstX(),spectrum.getLastY(),1024))[0]));
        //console.log(spectrum.getNbPoints());
        //spectrum.zeroFilling(spectrum.getNbPoints()*2).digitalFilter({nPoints:67}).fourierTransform();
        //
        spectrum.getXUnits().should.equal("PPM");
        console.log(spectrum.getFirstX()+" "+spectrum.getLastX());
        console.log(spectrum.getX(0)+" "+spectrum.getX(spectrum.getNbPoints()-1));

    });
    it('zeroFilling nbPoints', function () {
        var spectrum=createSpectraData("/data/fftTest/FID.dx");
        spectrum.zeroFilling(10).getNbPoints().should.equal(10);
        spectrum.zeroFilling(20).getNbPoints().should.equal(20);
        console.log(spectrum.getFirstX()+" "+spectrum.getLastX());
        console.log(spectrum.getX(0)+" "+spectrum.getX(spectrum.getNbPoints()-1));
    });
});





















