'use strict';
/**
 * Created by acastillo on 11/21/16.
 */
const old = require('./acsOld');

var acsString = '';
var parenthesis = '';
var rangeForMultiplet = false;


function toAcs(rangesIn, opt) {
    let options = Object.assign({}, {nucleus: '1H'}, opt);

    var ranges = JSON.parse(JSON.stringify(rangesIn));

    if (ranges[0].delta1) {//Old signals format
        return old.toACS(ranges, options);
    }
    if (ranges.updateMultiplicity)        {
        ranges = ranges.updateMultiplicity();
    }

    acsString = '';
    parenthesis = '';
    var solvent = null;
    if (options && options.solvent)        {
        solvent = options.solvent;
    }
    if (options && options.rangeForMultiplet !== undefined)        {
        rangeForMultiplet = options.rangeForMultiplet;
    }

    if (options && options.ascending) {
        ranges.sort(function (a, b) {
            return b.from - a.from;
        });
    }    else {
        ranges.sort(function (a, b) {
            return a.from - b.from;
        });
    }

    ranges.type = 'NMR SPEC';
    if (options && options.nucleus === '1H') {
        formatAcsDefault(ranges, false, 2, 1, solvent, options);
    }
    if (options && options.nucleus === '13C') {
        formatAcsDefault(ranges, false, 1, 0, solvent, options);
    }

    if (acsString.length > 0) acsString += '.';

    return acsString;
}

function formatAcsDefault(ranges, ascending, decimalValue, decimalJ, solvent, options) {
    appendSeparator();
    appendSpectroInformation(ranges, solvent, options);
    var numberSmartPeakLabels = ranges.length;
    var signal;
    for (var i = 0; i < numberSmartPeakLabels; i++) {
        if (ascending) {
            signal = ranges[i];
        } else {
            signal = ranges[numberSmartPeakLabels - i - 1];
        }
        if (signal) {
            appendSeparator();
            appendDelta(signal, decimalValue);
            appendParenthesis(signal, decimalJ);
        }
    }
}

function appendSpectroInformation(range, solvent, options) {
    if (range.type === 'NMR SPEC') {
        if (options.nucleus) {
            acsString += formatNucleus(options.nucleus);
        }
        acsString += ' NMR';
        if ((solvent) || (options.observe)) {
            acsString += ' (';
            if (options.observe) {
                acsString += (options.observe * 1).toFixed(0) + ' MHz';
                if (solvent) acsString += ', ';
            }
            if (solvent) {
                acsString += formatMF(solvent);
            }
            acsString += ')';
        }
        acsString += ' δ ';
    } else if (range.type === 'IR') {
        acsString += ' IR ';
    } else if (range.type === 'MASS') {
        acsString += ' MASS ';
    }
}

function appendDelta(line, nbDecimal) {
    var startX = 0, stopX = 0, delta1 = 0, asymmetric;
    if (line.from) {
        if ((typeof line.from) === 'string') {
            startX = parseFloat(line.from);
        } else            {
            startX = line.from;
        }
    }
    if (line.to) {
        if ((typeof line.to) === 'string') {
            stopX = parseFloat(line.to);
        } else            {
            stopX = line.to;
        }
    }
    if (line.signal[0].delta) {
        if ((typeof line.signal[0].delta) === 'string') {
            delta1 = parseFloat(line.signal[0].delta);
        } else            {
            delta1 = line.signal[0].delta;
        }
    }    else {
        asymmetric = true;
    }

    if (asymmetric === true || (line.signal[0].multiplicity === 'm' && rangeForMultiplet === true)) {//Is it massive??
        if (line.from && line.to) {
            if (startX < stopX) {
                acsString += startX.toFixed(nbDecimal) + '-' + stopX.toFixed(nbDecimal);
            } else {
                acsString += stopX.toFixed(nbDecimal) + '-' + startX.toFixed(nbDecimal);
            }
        } else if (line.signal[0].delta)                {
            acsString += '?';
        }
    }    else if (line.signal[0].delta)            {
        acsString += delta1.toFixed(nbDecimal);
    }    else if (line.from && line.to) {
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
    } else if (line.integral) {
        appendParenthesisSeparator();
        parenthesis += line.integral.toFixed(0) + ' H';
    }
}

function appendAssignment(line) {
    if (line.signal[0].pubAssignment) {
        appendParenthesisSeparator();
        parenthesis += formatAssignment(line.signal[0].pubAssignment);
    }    else if (line.signal[0].assignment) {
        appendParenthesisSeparator();
        parenthesis += formatAssignment(line.signal[0].assignment);
    }
}

function appendMultiplicity(line) {
    if (line.signal[0].pubMultiplicity) {
        appendParenthesisSeparator();
        parenthesis += line.pubMultiplicity;
    } else if (line.signal[0].multiplicity) {
        appendParenthesisSeparator();
        parenthesis += line.signal[0].multiplicity;
    }
}

function appendCoupling(line, nbDecimal) {
    if ('sm'.indexOf(line.signal[0].multiplicity) < 0
        && line.signal[0].j && line.signal[0].j.length > 0) {
        var Js = line.signal[0].j;
        var j = '<i>J</i> = ';
        for (var i = 0; i < Js.length; i++) {
            var coupling = Js[i].coupling || 0;
            if (j.length > 11)                {
                j += ', ';
            }
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

module.exports = toAcs;
