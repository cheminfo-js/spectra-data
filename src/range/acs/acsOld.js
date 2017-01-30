'use strict';
/**
 * This library formats a set of nmr1D signals to the ACS format.
 * Created by acastillo on 3/11/15.
 */

var acsString = '';
var parenthesis = '';
var rangeForMultiplet = false;

function toAcs(signals1D, options) {
    acsString = '';
    parenthesis = '';
    var solvent = null;
    if (options && options.solvent) {
        solvent = options.solvent;
    }
    if (options && options.rangeForMultiplet !== undefined) {
        rangeForMultiplet = options.rangeForMultiplet;
    }

    if (options && options.ascending) {
        signals1D.sort(function (a, b) {
            return b.delta1 - a.delta1;
        });
    } else {
        signals1D.sort(function (a, b) {
            return a.delta1 - b.delta1;
        });
    }

    //console.log("Range1: " +options.rangeForMultiplet);

    signals1D.type = 'NMR SPEC';
    if (signals1D[0].nucleus === '1H') {
        formatAcsDefault(signals1D, false, 2, 1, solvent);
    } else if (signals1D[0].nucleus === '13C') {
        formatAcsDefault(signals1D, false, 1, 0, solvent);
    }

    if (acsString.length > 0) acsString += '.';

    return acsString;
}

function formatAcsDefault(signals1D, ascending, decimalValue, decimalJ, solvent) {
    appendSeparator();
    appendSpectroInformation(signals1D, solvent);
    var numberSmartPeakLabels = signals1D.length;
    var signal;
    for (var i = 0; i < numberSmartPeakLabels; i++) {
        if (ascending) {
            signal = signals1D[i];
        } else {
            signal = signals1D[numberSmartPeakLabels - i - 1];
        }
        if (signal) {
            appendSeparator();
            appendDelta(signal, decimalValue);
            appendParenthesis(signal, decimalJ);
        }
    }
}

function appendSpectroInformation(signal1D, solvent) {
    if (signal1D.type === 'NMR SPEC') {
        if (signal1D[0].nucleus) {
            acsString += formatNucleus(signal1D[0].nucleus);
        }
        acsString += ' NMR';
        if ((solvent) || (signal1D[0].observe)) {
            acsString += ' (';
            if (signal1D[0].observe) {
                acsString += (signal1D[0].observe * 1).toFixed(0) + ' MHz';
                if (solvent) acsString += ', ';
            }
            if (solvent) {
                acsString += formatMF(solvent);
            }
            acsString += ')';
        }
        acsString += ' δ ';
    } else if (signal1D.type === 'IR') {
        acsString += ' IR ';
    } else if (signal1D.type === 'MASS') {
        acsString += ' MASS ';
    }
}

function appendDelta(line, nbDecimal) {
    //console.log(line);
    var startX = 0, stopX = 0, delta1 = 0;
    if (line.integralData.from) {
        if ((typeof line.integralData.from) === 'string') {
            startX = parseFloat(line.integralData.from);
        } else {
            startX = line.integralData.from;
        }
    }
    if (line.integralData.to) {
        if ((typeof line.integralData.to) === 'string') {
            stopX = parseFloat(line.integralData.to);
        } else {
            stopX = line.integralData.to;
        }
    }
    if (line.delta1) {
        if ((typeof line.delta1) === 'string') {
            delta1 = parseFloat(line.delta1);
        } else {
            delta1 = line.delta1;
        }

    }
    if (line.asymmetric === true || (line.multiplicity === 'm' && rangeForMultiplet === true)) {//Is it massive??
        if (line.integralData.from && line.integralData.to) {
            if (startX < stopX) {
                acsString += startX.toFixed(nbDecimal) + '-' + stopX.toFixed(nbDecimal);
            } else {
                acsString += stopX.toFixed(nbDecimal) + '-' + startX.toFixed(nbDecimal);
            }
        } else if (line.delta1) {
            acsString += delta1.toFixed(nbDecimal);
        }
    } else if (line.delta1) {
        acsString += delta1.toFixed(nbDecimal);
    } else if (line.integralData.from && line.integralData.to) {
        acsString += ((startX + stopX) / 2).toFixed(nbDecimal);
    }
}
/*
function appendValue(line, nbDecimal) {
    if (line.xPosition) {
        acsString += line.xPosition.toFixed(nbDecimal);
    }
}
*/

function appendParenthesis(line, nbDecimal) {
    // need to add assignment - coupling - integration
    parenthesis = '';
    appendMultiplicity(line);
    appendIntegration(line);
    appendCoupling(line, nbDecimal);
    appendAssignment(line);


    if (parenthesis.length > 0) {
        acsString += ' (' + parenthesis + ')';
    }
}

function appendIntegration(line) {
    if (line.pubIntegration) {
        appendParenthesisSeparator();
        parenthesis += line.pubIntegration;
    } else if (line.integralData) {
        appendParenthesisSeparator();
        parenthesis += line.integralData.value.toFixed(0) + ' H';
    }
}

function appendAssignment(line) {
    if (line.pubAssignment) {
        appendParenthesisSeparator();
        parenthesis += formatAssignment(line.pubAssignment);
    } else {
        if (line.assignment) {
            appendParenthesisSeparator();
            parenthesis += formatAssignment(line.assignment);
        }
    }
}

function appendMultiplicity(line) {
    if (line.pubMultiplicity) {
        appendParenthesisSeparator();
        parenthesis += line.pubMultiplicity;
    } else if (line.multiplicity) {
        appendParenthesisSeparator();
        parenthesis += line.multiplicity;
    }
}

function appendCoupling(line, nbDecimal) {
    if (line.nmrJs) {
        var j = '<i>J</i> = ';
        for (var i = 0; i < line.nmrJs.length; i++) {
            var coupling = line.nmrJs[i].coupling;
            if (j.length > 11) j += ', ';
            j += coupling.toFixed(nbDecimal);
        }
        appendParenthesisSeparator();
        parenthesis += j + ' Hz';
    }

}

function formatAssignment(assignment) {
    assignment = assignment.replace(/([0-9])/g, '<sub>$1</sub>');
    assignment = assignment.replace(/\"([^\"]*)\"/g, '<i>$1</i>');
    return assignment;
}

function formatMF(mf) {
    mf = mf.replace(/([0-9])/g, '<sub>$1</sub>');
    return mf;
}

function formatNucleus(nucleus) {
    nucleus = nucleus.replace(/([0-9])/g, '<sup>$1</sup>');
    return nucleus;
}

function appendSeparator() {
    if ((acsString.length > 0) && (!acsString.match(/ $/))) {
        acsString += ', ';
    }
}

function appendParenthesisSeparator() {
    if ((parenthesis.length > 0) && (!parenthesis.match(', $'))) parenthesis += ', ';
}

module.exports.toACS = toAcs;
