/**
 * This library formats a set of nmr1D signals to the ACS format.
 * Created by acastillo on 3/11/15. p
 */
var ACS=ACS || {};
ACS.formater =(function() {
    var acsString="";
    var parenthesis="";
    var spectro="";
    rangeForMultiplet=false;

    function fromNMRSignal1D2ACS(spectrum, options){
        acsString="";
        parenthesis="";
        spectro="";
        var solvent = null;
        if(options&&options.solvent)
            solvent = options.solvent;
        //options.rangeForMultiplet=false;
        if(options&&options.rangeForMultiplet!=undefined)
            rangeForMultiplet = options.rangeForMultiplet;

        //console.log("Range1: "+options.rangeForMultiplet);

        spectrum.type="NMR SPEC";
        if (spectrum[0]["nucleus"]=="1H") {
            formatAcs_default(spectrum, false, 2, 1, solvent);
        } else if (spectrum[0]["nucleus"]=="13C") {
            formatAcs_default(spectrum, false, 1, 0, solvent);
        }

        if (acsString.length>0) acsString+=".";

        return acsString;
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

    function formatAcs_default(spectra, ascending, decimalValue, decimalJ, solvent) {
        appendSeparator();
        appendSpectroInformation(spectra, solvent);
        var numberSmartPeakLabels=spectra.length;
        //console.log("SP "+spectra);
        //console.log("# "+numberSmartPeakLabels);
        for (var i=0; i<numberSmartPeakLabels; i++) {
            if (ascending) {
                var signal=spectra[i];
            } else {
                var signal=spectra[numberSmartPeakLabels-i-1];
            }
            if (signal) {
                //console.log("X2X"+i+JSON.stringify(signal));
                appendSeparator();
                appendDelta(signal,decimalValue);
                appendParenthesis(signal,decimalJ);
                //console.log("S2S"+i);
            }
        }
    }

    function appendSpectroInformation(spectrum, solvent) {
        if (spectrum.type=="NMR SPEC") {
            if (spectrum[0].nucleus) {
                acsString+=formatNucleus(spectrum[0].nucleus);
            }
            acsString+=" NMR";
            if ((solvent) || (spectrum[0].observe)) {
                acsString+=" (";
                if (spectrum.observe) {
                    acsString+=(spectrum[0].observe*1).toFixed(0)+" MHz";
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
        //console.log("appendDelta1");
        var startX = 0,stopX=0,delta1=0;
        if(line.startX){
            if((typeof line.startX)=="string"){
                startX=parseFloat(line.startX);
            }
            else
                startX=line.startX;
        }
        if(line.stopX){
            if((typeof line.stopX)=="string"){
                stopX=parseFloat(line.stopX);
            }
            else
                stopX=line.stopX;
        }
        if(line.delta1){
            if((typeof line.delta1)=="string"){
                delta1=parseFloat(line.delta1);
            }
            else
                delta1=line.delta1;

        }
        //console.log("Range2: "+rangeForMultiplet+" "+line.multiplicity);
        if (line.asymmetric===true||(line.multiplicity=="m"&&rangeForMultiplet===true)) {//Is it massive??
            if (line.startX&&line.stopX) {
                if (startX<stopX) {
                    acsString+=startX.toFixed(nbDecimal)+"-"+stopX.toFixed(nbDecimal);
                } else {
                    acsString+=stopX.toFixed(nbDecimal)+"-"+startX.toFixed(nbDecimal);
                }
            } else {
                if(line.delta1)
                    acsString+=delta1.toFixed(nbDecimal);
            }
        }
        else{
            if(line.delta1)
                acsString+=delta1.toFixed(nbDecimal);
            else{
                if(line.startX&&line.stopX){
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
        } else if (line.integralData) {
            appendParenthesisSeparator();
            parenthesis+=line.integralData.value.toFixed(0)+" H";
        }
    }

    function appendAssignment(line) {
        if (line.pubAssignment) {
            appendParenthesisSeparator();
            parenthesis+=formatAssignment(line.pubAssignment);
        }
        else{
            if (line.assignment) {
                appendParenthesisSeparator();
                parenthesis+=formatAssignment(line.assignment);
            }
        }
    }

    function appendMultiplicity(line) {
        if (line.pubMultiplicity) {
            appendParenthesisSeparator();
            parenthesis+=line.pubMultiplicity;
        } else if (line.multiplicity) {
            appendParenthesisSeparator();
            parenthesis+=line.multiplicity;
        }
    }

    function appendCoupling(line, nbDecimal) {
        if (line.nmrJs) {
            var j="<i>J</i> = ";
            for (var i=0; i<line.nmrJs.length; i++) {
                var coupling=line.nmrJs[i].coupling;
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

    function fromACS2NMRSignal1D(acsString){
        return JSON.parse(SDAPI.AcsParserAsJSONString(acsString));
    }

    return {
        toACS:fromNMRSignal1D2ACS,
        toNMRSignal:fromACS2NMRSignal1D
    }
})();

module.exports=ACS;