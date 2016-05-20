/**
 * Created by abol on 5/20/16.
 */


var convertZip = require("/home/abol/git/brukerconverter/src/brukerconverter").convertZip;
var fs = require('fs');


//var zipFile = get("zipFile");

var zip = fs.readFileSync("../../test/21-BOMA-new.zip");
var result = convertZip(zip, {xy:true,keepSpectra:true,keepRecordsRegExp:/^.+$/, base64: true});
console.log(result);
/*
for(var i=0;i<result.length;i++){
    result[i].value={type:"jcamp",value:result[i].value}
}

console.log(result);

var NbSlice = 11;
var NbScans = 88/NbSlice;

var vector = new Array(NbSlice);
var SpectraDATA = result;
var phaseSer = [0,-0.5*Math.PI,-1.0*Math.PI,0.5*Math.PI,0.0,-0.5*Math.PI,-1.0*Math.PI,0.5*Math.PI];
for(i=0;i<result.length;++i){
    var currSer = result[i].value.value;
    for(var j=0;j<NbSlice;++j){
        var x =0;
        var y =0;
        for(var k=0;k<NbScans;++k){
            if(k===0){
                var tempData= currSer.spectra[j+k*NbScans].data[0].y;
            }else{
                for(var l=0;l<currSer.spectra[j+k*NbScans].data[0].x.length;){
                    var cosTheta = Math.cos(phaseSer[k]);
                    var sinTheta = Math.sin(phaseSer[k]);
                    var ReData = currSer.spectra[j+k*NbScans].data[0].y[l];
                    var ImData = currSer.spectra[j+k*NbScans].data[0].y[l+1];
                    tempData[l] += ReData*cosTheta-ImData*sinTheta;
                    tempData[l+1] += ReData*sinTheta + ImData*cosTheta;
                    l = l+2;
                }
            }
        }
        SpectraDATA[i].value.value.spectra[j].data[0].y = tempData;
    }
}
//set("plot",currSer.spectra[0].data[0].y);
console.log(tempData.y);

//set("brukerList",SpectraDATA);
*/