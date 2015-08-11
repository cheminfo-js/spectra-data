/**
 * Created by acastillo on 4/8/15.
 */
'use strict';

var Data = require('..');
var FS = require('fs');

function createSpectraData(filename, label, data) {
    var spectrum = Data.NMR.fromJcamp(
        FS.readFileSync(__dirname + filename).toString()
    );
    return spectrum;
};


describe('spectra-data test', function () {
    var nH = 8;
    var spectrum=createSpectraData("/data/ethylvinylether/1h.jdx");
    var peakPicking = spectrum.nmrPeakDetection({"nH":nH, realTop:true, thresholdFactor:1,clean:true,compile:true});

    //console.log(peakPicking);
    it('Known patterns', function () {
        for(var i=0;i<peakPicking.length;i++){
            var signal = peakPicking[i];
            if(Math.abs(signal.delta1-1.308)<0.01){
                signal.multiplicity.should.equal("t");
            }
            if(Math.abs(signal.delta1-3.77)<0.01){
                signal.multiplicity.should.equal("q");
            }
            if(Math.abs(signal.delta1-3.99)<0.01){
                signal.multiplicity.should.equal("dd");
            }
            if(Math.abs(signal.delta1-4.2)<0.01){
                signal.multiplicity.should.equal("dd");
            }
            if(Math.abs(signal.delta1-6.47)<0.01){
                signal.multiplicity.should.equal("dd");
            }
        }
        //console.log(Data.ACS.formater.toACS(peakPicking,{solvent:spectrum.getSolventName()}));
    });

    it('Number of patterns', function(){
        peakPicking.length.should.equal(5);
    });


});


