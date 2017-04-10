'use strict';

var getMultiplicityFromSignal = require('../getMultiplicityFromSignal');

/**
 * nbDecimalsDelta : default depends nucleus H, F: 2 otherwise 1
 * nbDecimalsJ : default depends nucleus H, F: 1, otherwise 0
 * ascending : true / false
 * format : default "AIMJ" or when 2D data is collected the default format may be "IMJA"
 * deltaSeparator : ', '
 * detailSeparator : ', '
 */


/**
 * some test case, with and without ascending option
 *
 */
const defaultOptions = {
    nucleus: '1H',
};

function toAcs(ranges, options) {
    options = Object.assign(defaultOptions, options);

    ranges = ranges.clone();  // define it in Ranges file
    ranges.updateMultiplicity();

    if (options.ascending) {
        ranges.sort(function (a, b) {
            return b.from - a.from;
        });
    } else {
        ranges.sort(function (a, b) {
            return a.from - b.from;
        });
    }

    var acsString = formatAcs(ranges, options);

    if (acsString.length > 0) acsString += '.';

    return acsString;
}

function formatAcs(ranges, options) {
    var acsString = '';
    // I will include the sampleName in the begining
    var acs = appendSpectroInformation(acsString, options);
    var acsRanges = [];
    for (let range of ranges) {
        appendDelta(range, acs, options);
    }
    return acs + acsRanges.join(', ');
}


// It is ok, included the private functions
function appendSpectroInformation(acsString, options) {
    if (options.nucleus) {
        acsString += formatNucleus(options.nucleus);
    }
    acsString += ' (';
    if (options.solvent || options.frequencyObserved) {
        if (options.solvent) {
            acsString += formatMF(options.solvent);
            if (options.frequencyObserved) {
                acsString += ', ' + (options.frequencyObserved * 1).toFixed(0) + ' MHz';
            } else if (options.frequencyObserved) {
                acsString += (options.frequencyObserved * 1).toFixed(0) + ' MHz';
            }
            acsString += ')';
        }
        acsString += ' δ ';
    }
    return acsString;
}


// function appendSpectroInformation(range, solvent, options) {
//     if (range.type === 'NMR SPEC') {
//         if (options.nucleus) {
//             acsString += formatNucleus(options.nucleus);
//         }
//         acsString += ' NMR';
//         if ((solvent) || (options.observe)) {
//             acsString += ' (';
//             if (options.observe) {
//                 acsString += (options.observe * 1).toFixed(0) + ' MHz';
//                 if (solvent) acsString += ', ';
//             }
//             if (solvent) {
//                 acsString += formatMF(solvent);
//             }
//             acsString += ')';
//         }
//         acsString += ' δ ';
//     }
// }

function appendDelta(range, acsRanges, nbDecimal) {
    let startX = 0;
    let stopX = 0;
    let delta1 = 0;
    let asymmetric;

    if (range.from) {
        if ((typeof range.from) === 'string') {
            startX = parseFloat(range.from);
        } else {
            startX = range.from;
        } // is it really necessary?
    }
    if (range.to) {
        if ((typeof range.to) === 'string') {
            stopX = parseFloat(range.to);
        } else {
            stopX = range.to;
        } // Is it really necesarry?
    }
    if (Array.isArray(range.signal) && range.signal.length > 0) {
        for (let signal of range) {

        }
    } else {
        let fromTo = [range.from, range.to];
        acsString += fromTo.min.fixed(options.nbDecimal) + fromTo.max.fixed(options.nbDecimal) + '';
    }
}

function appendParenthesis(signal, options) {
    parenthesis = '';
    appendMultiplicity(signal);
    appendIntegration(signal);
    appendCoupling(signal, options);
    appendAssignment(signal);

    if (parenthesis.length > 0) {
        acsString += ' (' + parenthesis + ')';
    }
}


module.exports = toAcs;


// it is ok
function appendIntegration(signal) {
    if (signal.pubIntegral) {
        parenthesis = appendSeparator(parenthesis);
        parenthesis += signal.pubIntegral;
    } else if (signal.integral) {
        parenthesis = appendSeparator(parenthesis);
        parenthesis += signal.integral.toFixed(0) + ' H';
    }
}

function appendMultiplicity(signal) {
    if (!Array.isArray(signal) {
        parenthesis = appendSeparator(parenthesis);
        parenthesis += 'm';
    })
    var multiplicity = getMultiplicityFromSignal(signal);
    if (multiplicity) {
        parenthesis = appendSeparator(parenthesis);
        parenthesis += multiplicity;
    }
}

// this function needs a object as signal argument
function appendCoupling(signal, options) {
    if (signal.j && signal.j.length > 0) {
        var Js = signal.j;
        var j = '<i>J</i> = ';
        var coupling = Js[0].coupling || 0;
        j += coupling.toFixed(options.nbDecimal);
        for (var i = 1; i < Js.length; i++) {
            var coupling = Js[i].coupling || 0;
            j = appendSeparator(j);
            j += coupling.toFixed(options.nbDecimal);
        }
        parenthesis += j + ' Hz';
    }
}

function appendAssignment(signal) {
    if (signal.pubAssignment) {
        parenthesis = appendSeparator(parenthesis);
        parenthesis += formatAssignment(signal.signal[0].pubAssignment);
    } else if (signal.assignment) {
        parenthesis = appendSeparator(parenthesis);
        parenthesis += formatAssignment(signal.assignment);
    }
}

// more private functions

function formatMF(mf) {
    mf = mf.replace(/([0-9]+)/g, '<sub>$1</sub>');
    return mf;
}

function formatNucleus(nucleus) {
    nucleus = nucleus.replace(/([0-9]+)/g, '<sup>$1</sup>');
    return nucleus;
}

function appendSeparator(acsString) {
    if ((acsString.length > 0) && (!acsString.match(/ $/))) {
        return acsString + ', ';
    }
}

function formatAssignment(assignment) {
    assignment = assignment.replace(/([0-9]+)/g, '<sub>$1</sub>');
    assignment = assignment.replace(/\"([^\"]*)\"/g, '<i>$1</i>');
    return assignment;
}

function getMultiplicityFromSignal(signal, options) {
    for (var coupling of signal.j) {

    }
    return index;
}