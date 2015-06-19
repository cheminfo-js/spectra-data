/**
 * Created by acastillo on 3/5/15.
 */
'use strict';

var Data = require('..');
var FS = require('fs');
//console.log(Data)
function createSpectraData(filename, label, data) {
    var spectrum = Data.NMR.fromJcamp(
        FS.readFileSync(__dirname + filename).toString()
    );
    return spectrum;
};

//var spectrum=createSpectraData("/data/ethylbenzene/h1_0.jdx");
//var spectrum=createSpectraData("/data/ethylvinylether/1h.jdx");
var spectrum=createSpectraData("/data/generated.jdx");
//console.log(spectrum);
//console.log(spectrum.getParamString(".PULSE SEQUENCE"));
//var spectrum=createSpectraData("/data/h1_31.jdx");
//var spectrum=createSpectraData("/data/h1_14.jdx");

//console.log(spectrum);
var peakPicking = spectrum.nmrPeakDetection({nH:10,realTop:true,thresholdFactor:0.9, clean:true, compile:true});
//console.log(peakPicking);
/*for(var i=0;i<peakPicking.length;i++){
    console.log(JSON.stringify(peakPicking[i].peaks));
}*/
//console.log(Data.ACS.formater.toACS(peakPicking,{solvent:spectrum.getSolventName()}));
//console.log(peakPicking);
//console.log(peakPicking);
//console.log(spectrum.getNucleus(0));
/*console.log(spectrum.getDataType()==spectrum.TYPE_NMR_SPECTRUM);
console.log(spectrum.getDataType()==spectrum.TYPE_NMR_FID);
console.log("This dataclass");
console.log("Is peak? "+spectrum.isDataClassPeak());
console.log("Is XY? "+spectrum.isDataClassXY());
console.log("Changing data class");
spectrum.setDataClass(spectrum.DATACLASS_PEAK)
console.log("Is peak? "+spectrum.isDataClassPeak());
console.log("Is XY? "+spectrum.isDataClassXY());
*/
