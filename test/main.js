/**
 * Created by acastillo on 3/5/15.
 */
'use strict';

var Data = require('..');
var FS = require('fs');
//console.log(Data)
function createSpectraData(filename, label, data) {
    var spectrum = Data.SD.fromJcamp(
        FS.readFileSync(__dirname + filename).toString()
    );
    return spectrum;
};

var spectrum=createSpectraData("/data/ethylvinylether/1h.jdx");
console.log(spectrum.getSpectrum());
console.log(spectrum.getDataType()==spectrum.TYPE_NMR_SPECTRUM);
console.log(spectrum.getDataType()==spectrum.TYPE_NMR_FID);
console.log(spectrum.isDataClassPeak());
console.log(spectrum.isDataClassXY());
spectrum.setDataClass(spectrum.DATACLASS_PEAK)
console.log(spectrum.isDataClassPeak());
console.log(spectrum.isDataClassXY());