'use strict';
/**
 * This library formats a set of nmr1D signals to the ACS format.
 * Created by acastillo on 3/11/15. p
 */
var old = require("./oldFormater");

var acsString="";
var parenthesis="";
var spectro="";
var rangeForMultiplet=false;

module.exports = require("./prediction2Range");

module.exports.update = function(ranges){
    for (var i=0; i<ranges.length; i++){
        var range = ranges[i];
        for (var j=0; j<range.signal.length; j++){
            var signal = range.signal[j];
            if (signal.j && ! signal.multiplicity) {
                signal.multiplicity = "";
                for (var k=0; k<signal.j.length;k++){
                    signal.multiplicity+=signal.j[k].multiplicity;
                }
            }
        }
    }

    return ranges;
}

module.exports.updateIntegrals = function(signals, options) {
    var  factor = options.factor || 1 ;
    var i;
    if(options.sum) {
        var nH = options.sum || 1;
        var sumObserved=0;
        for(i = 0; i < signals.length; i++) {
            sumObserved += Math.round(signals[i].integral);
        }
        factor = nH/sumObserved;
    }
    for(i = 0; i < signals.length; i++) {
        signals[i].integral *= factor;
    }

    return signals;
}

module.exports.nmrJ = function(Js, options){
    var Jstring = "";
    var opt = Object.assign({},{separator:", ", nbDecimal:2}, options);
    var j;
    for(var i=0;i<Js.length;i++){
        j = Js[i];
        if (j.length>11) j+=opt.separator;
        Jstring+=j.multiplicity+" "+j.coupling.toFixed(opt.nbDecimal);
    }
    return Jstring;
}
/**
 * This function converts an array of peaks [{x, y, width}] in a vector equally x,y vector
 * TODO This function is very general and should be placed somewhere else
 * @param peaks
 * @param opt
 * @returns {{x: Array, y: Array}}
 */
module.exports.peak2Vector=function(peaks, opt){
    var options = opt||{};
    var from = options.from;
    var to = options.to;
    var nbPoints = options.nbPoints||16*1024;
    var fnName = options.fnName||"gaussian";
    var nWidth = options.nWidth || 4;

    if(!from){
        from = Number.MAX_VALUE;
        for(var i=0;i<peaks.length;i++){
            if(peaks[i].x-peaks[i].width*nWidth<from){
                from = peaks[i].x-peaks[i].width*nWidth;
            }
        }
    }

    if(!to){
        to = Number.MIN_VALUE;
        for(var i=0;i<peaks.length;i++){
            if(peaks[i].x+peaks[i].width*nWidth>to){
                to = peaks[i].x+peaks[i].width*nWidth;
            }
        }
    }


    var x = new Array(nbPoints);
    var y = new Array(nbPoints);
    var dx = (to-from)/(nbPoints-1);
    for(var i=0;i<nbPoints;i++){
        x[i] = from+i*dx;
        y[i] = 0;
    }

    var intensity = "intensity";
    if(peaks[0].y){
        intensity="y";
    }

    for(var i=0;i<peaks.length;i++){
        var peak = peaks[i];
        if(peak.x>from && peak.x<to){
            var index = Math.round((peak.x-from)/dx);
            var w = Math.round(peak.width*nWidth/dx);
            if(fnName=="gaussian"){
                for(var j=index-w;j<index+w;j++){
                    if(j>=0&&j<nbPoints){
                        y[j]+=peak[intensity]*Math.exp(-0.5*Math.pow((peak.x-x[j])/(peak.width/2),2));
                    }
                }
            }else{
                var factor = peak[intensity]*Math.pow(peak.width,2)/4;
                for(var j=index-w;j<index+w;j++){
                    if(j>=0&&j<nbPoints){
                        y[j]+=factor/(Math.pow(peak.x-x[j],2)+Math.pow(peak.width/2,2));

                    }
                }
            }

        }
    }

    return {x:x,y:y};
}

module.exports.range2Vector=function(ranges, opt){
    return module.exports.peak2Vector(module.exports.range2Peaks(ranges), opt);
}

module.exports.range2Peaks = function(ranges){
    var peaks = [];
    for(var i=0;i<ranges.length;i++){
        var range = ranges[i];
        for(var j=0;j<range.signal.length;j++){
            peaks=peaks.concat(range.signal[j].peak);
        }
    }
    return peaks;
}

module.exports.toACS = function(spectrumIn, opt) {
    let options = Object.assign({}, {nucleus: "1H"}, opt);

    var spectrum = JSON.parse(JSON.stringify(spectrumIn));

    if(spectrum[0].delta1) {//Old signals format
        return old.toACS(spectrum, options);
    }

    spectrum = module.exports.update(spectrum);

    acsString = "";
    parenthesis = "";
    spectro = "";
    var solvent = null;
    if(options && options.solvent)
        solvent = options.solvent;
    if(options && options.rangeForMultiplet != undefined)
        rangeForMultiplet = options.rangeForMultiplet;

    if(options && options.ascending){
        spectrum.sort(function(a,b){
            return b.from- a.from
        });
    }
    else{
        spectrum.sort(function(a,b){
            return a.from- b.from
        });
    }

    spectrum.type="NMR SPEC";
    if (options && options.nucleus == "1H") {
        formatAcs_default(spectrum, false, 2, 1, solvent, options);
    }
    if (options && options.nucleus == "13C") {
        formatAcs_default(spectrum, false, 1, 0, solvent,options);
    }

    if (acsString.length>0) acsString+=".";

    return acsString;
}

module.exports.toNMRSignal = function(acsString){
    //TODO Create the function that reconstructs the signals from the ACS string
    return null;
}

/*function formatAcs_default_IR(spectra, ascending, decimalValue, smw) {
 appendSeparator();
 appendSpectroInformation(spectra);
 if (spectra["peakLabels"]) {
 var numberPeakLabels=spectra["peakLabels"].length;
 var minIntensity= 9999999;
 var maxIntensity=-9999999;
 for (var i=0; i<numberPeakLabels; i++) {
 if (spectra["peakLabels"][i].intensity<minIntensity) minIntensity=spectra["peakLabels"][i].intensity;
 if (spectra["peakLabels"][i].intensity>maxIntensity) maxIntensity=spectra["peakLabels"][i].intensity;
 }
 for (var i=0; i<numberPeakLabels; i++) {
 if (ascending) {
 var peakLabel=spectra["peakLabels"][i];
 } else {
 var peakLabel=spectra["peakLabels"][numberPeakLabels-i-1];
 }
 if (peakLabel) {
 appendSeparator();
 appendValue(peakLabel,decimalValue);
 if (smw) { // we need to add small / medium / strong
 if (peakLabel.intensity<((maxIntensity-minIntensity)/3+minIntensity)) acsString+=" (s)";
 else if (peakLabel.intensity>(maxIntensity-(maxIntensity-minIntensity)/3)) acsString+=" (w)";
 else acsString+=" (m)";
 }
 }
 }
 }
 }*/

function formatAcs_default(spectra, ascending, decimalValue, decimalJ, solvent, options) {
    appendSeparator();
    appendSpectroInformation(spectra, solvent, options);
    var numberSmartPeakLabels=spectra.length;
    for (var i=0; i<numberSmartPeakLabels; i++) {
        if (ascending) {
            var signal=spectra[i];
        } else {
            var signal=spectra[numberSmartPeakLabels-i-1];
        }
        if (signal) {
            appendSeparator();
            appendDelta(signal,decimalValue);
            appendParenthesis(signal,decimalJ);
        }
    }
}

function appendSpectroInformation(spectrum, solvent, options) {
    if (spectrum.type=="NMR SPEC") {
        if (options.nucleus) {
            acsString+=formatNucleus(options.nucleus);
        }
        acsString+=" NMR";
        if ((solvent) || (options.observe)) {
            acsString+=" (";
            if (options.observe) {
                acsString+=(options.observe*1).toFixed(0)+" MHz";
                if (solvent) acsString+=", ";
            }
            if (solvent) {
                acsString+=formatMF(solvent);
            }
            acsString+=")";
        }
        acsString+=" δ ";
    } else if (spectrum.type=="IR") {
        acsString+=" IR ";
    } else if (spectrum.type=="MASS") {
        acsString+=" MASS ";
    }
}

function appendDelta(line, nbDecimal) {
    var startX = 0,stopX=0,delta1=0, asymmetric;
    if(line.from){
        if((typeof line.from)=="string"){
            startX=parseFloat(line.from);
        }
        else
            startX=line.from;
    }
    if(line.to){
        if((typeof line.to)=="string"){
            stopX=parseFloat(line.to);
        }
        else
            stopX=line.to;
    }
    if(line.signal[0].delta){
        if((typeof line.signal[0].delta)=="string"){
            delta1=parseFloat(line.signal[0].delta);
        }
        else
            delta1=line.signal[0].delta;
    }
    else{
        asymmetric = true;
    }
    //console.log("Range2: "+rangeForMultiplet+" "+line.multiplicity);
    if (asymmetric===true||(line.signal[0].multiplicity=="m"&&rangeForMultiplet===true)) {//Is it massive??
        if (line.from&&line.to) {
            if (startX<stopX) {
                acsString+=startX.toFixed(nbDecimal)+"-"+stopX.toFixed(nbDecimal);
            } else {
                acsString+=stopX.toFixed(nbDecimal)+"-"+startX.toFixed(nbDecimal);
            }
        } else {
            if(line.signal[0].delta)
                acsString+="?";
        }
    }
    else{
        if(line.signal[0].delta)
            acsString+=delta1.toFixed(nbDecimal);
        else{
            if(line.from&&line.to){
                acsString+=((startX+stopX)/2).toFixed(nbDecimal);
            }
        }
    }
}

function appendValue(line, nbDecimal) {
    if (line.xPosition) {
        acsString+=line.xPosition.toFixed(nbDecimal);
    }
}

function appendParenthesis(line, nbDecimal) {
    //console.log("appendParenthesis1");
    // need to add assignment - coupling - integration
    parenthesis="";
    appendMultiplicity(line);
    appendIntegration(line);
    appendCoupling(line,nbDecimal);
    appendAssignment(line);


    if (parenthesis.length>0) {
        acsString+=" ("+parenthesis+")";
    }
    //console.log("appendParenthesis2");
}

function appendIntegration(line) {
    if (line.pubIntegration) {
        appendParenthesisSeparator();
        parenthesis+=line.pubIntegration;
    } else if (line.integral) {
        appendParenthesisSeparator();
        parenthesis+=line.integral.toFixed(0)+" H";
    }
}

function appendAssignment(line) {
    if (line.signal[0].pubAssignment) {
        appendParenthesisSeparator();
        parenthesis+=formatAssignment(line.signal[0].pubAssignment);
    }
    else{
        if (line.signal[0].assignment) {
            appendParenthesisSeparator();
            parenthesis+=formatAssignment(line.signal[0].assignment);
        }
    }
}

function appendMultiplicity(line) {
    if (line.signal[0].pubMultiplicity) {
        appendParenthesisSeparator();
        parenthesis+=line.pubMultiplicity;
    } else if (line.signal[0].multiplicity) {
        appendParenthesisSeparator();
        parenthesis+=line.signal[0].multiplicity;
    }
}

function appendCoupling(line, nbDecimal) {
    if ("sm".indexOf(line.signal[0].multiplicity) < 0
            && line.signal[0].j && line.signal[0].j.length > 0) {
        var Js = line.signal[0].j;
        var j="<i>J</i> = ";
        for (var i=0; i<Js.length; i++) {
            var coupling=Js[i].coupling || 0;
            if (j.length>11) j+=", ";
            j+=coupling.toFixed(nbDecimal);
        }
        appendParenthesisSeparator();
        parenthesis+=j+" Hz";
    }
}

function formatAssignment(assignment) {
    assignment=assignment.replace(/([0-9])/g,"<sub>$1</sub>");
    assignment=assignment.replace(/\"([^\"]*)\"/g,"<i>$1</i>");
    return assignment;
}

function formatMF(mf) {
    mf=mf.replace(/([0-9])/g,"<sub>$1</sub>");
    return mf;
}

function formatNucleus(nucleus) {
    nucleus=nucleus.replace(/([0-9])/g,"<sup>$1</sup>");
    return nucleus;
}

function appendSeparator() {
    if ((acsString.length>0) && (! acsString.match(/ $/))) {
        acsString+=", ";
    }
}

function appendParenthesisSeparator() {
    if ((parenthesis.length>0) && (! parenthesis.match(", $"))) parenthesis+=", ";
}
