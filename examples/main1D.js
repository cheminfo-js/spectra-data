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
}

//var spectrum=createSpectraData("/data/ethylbenzene/h1_0.jdx");
//var spectrum=createSpectraData("/data/ethylvinylether/1h.jdx");
//var spectrum=createSpectraData("/data/h1_119.jdx");
var spectrum = createSpectraData('/data/broadPeak.jdx');
var xy = spectrum.getXYData();
var x = [], y = [];
for (var i = 0; i < xy[0].length; i++) {
    if (xy[0][i] > 3 && xy[0][i] < 5) {
        x.push(xy[0][i]);
        y.push(xy[1][i]);
    }
}
//console.log(JSON.stringify([x,y]));

//console.log(spectrum.getParamString(".PULSE SEQUENCE"));
//var spectrum=createSpectraData("/data/h1_31.jdx");
//var spectrum=createSpectraData("/data/h1_14.jdx");

//console.log(JSON.stringify(spectrum.getXYData()));
if (true) {
    var d = new Date();
    var n = d.getTime();
    var peakPicking = spectrum.autoPeakPicking({nH: 10, realTop: true, thresholdFactor: 1, clean: true, compile: true,
        gsdOptions: {minMaxRatio: 0.03, broadRatio: 0.0025, smoothY: true, nL: 4}
    });
    d = new Date();

    //var list = spectrum.getVector(0.0,10);

    //console.log(d.getTime()-n);
    //console.log(peakPicking);
    /*for(var i=0;i<peakPicking.length;i++){
         console.log(JSON.stringify(peakPicking[i].peaks));
    }*/
    //console.log(Data.ACS.formater.getACS(peakPicking,{solvent:spectrum.getSolventName(),ascending:false}));
}

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
