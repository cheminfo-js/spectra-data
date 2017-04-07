'use strict';

// var getMultiplicityFromSignal = require('../getMultiplicityFromSignal');

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
    if(Array.isArray(range.signal) && range.signal.length > 0) {
        for(let signal of range) {

        }
    } else {
        let fromTo = [range.from, range.to];
        acsString += fromTo.min.fixed(options.nbDecimal) + fromTo.max.fixed(options.nbDecimal) + '';
    }
}

// function appendDelta(line, nbDecimal) {
//     var startX = 0, stopX = 0, delta1 = 0, asymmetric;
//     if (line.from) {
//         if ((typeof line.from) === 'string') {
//             startX = parseFloat(line.from);
//         } else {
//             startX = line.from;
//         }
//     }
//     if (line.to) {
//         if ((typeof line.to) === 'string') {
//             stopX = parseFloat(line.to);
//         } else {
//             stopX = line.to;
//         }
//     }
//     if (line.signal[0].delta) {
//         if ((typeof line.signal[0].delta) === 'string') {
//             delta1 = parseFloat(line.signal[0].delta);
//         } else {
//             delta1 = line.signal[0].delta;
//         }
//     } else {
//         asymmetric = true;
//     }
//
//     if (asymmetric === true || (line.signal[0].multiplicity === 'm' && rangeForMultiplet === true)) {//Is it massive??
//         if (line.from && line.to) {
//             if (startX < stopX) {
//                 acsString += startX.toFixed(nbDecimal) + '-' + stopX.toFixed(nbDecimal);
//             } else {
//                 acsString += stopX.toFixed(nbDecimal) + '-' + startX.toFixed(nbDecimal);
//             }
//         } else if (line.signal[0].delta) {
//             acsString += '?';
//         }
//     } else if (line.signal[0].delta) {
//         acsString += delta1.toFixed(nbDecimal);
//     } else if (line.from && line.to) {
//         acsString += ((startX + stopX) / 2).toFixed(nbDecimal);
//     }
// }

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
    if (line.pubIntegral) {
        appendParenthesisSeparator();
        parenthesis += line.pubIntegral;
    } else if (line.integral) {
        appendParenthesisSeparator();
        parenthesis += line.integral.toFixed(0) + ' H';
    }
}

function appendAssignment(line) {
    if (line.signal[0].pubAssignment) {
        appendParenthesisSeparator();
        parenthesis += formatAssignment(line.signal[0].pubAssignment);
    } else if (line.signal[0].assignment) {
        appendParenthesisSeparator();
        parenthesis += formatAssignment(line.signal[0].assignment);
    }
}

function appendMultiplicity(range) {
    if (!Array.isArray(range.signal) {
        appendParenthesisSeparator();
        parenthesis += 'm';
    })
    var multiplicity = getMultiplicityFromSignal(range.signal[0]);
    if (multiplicity) 8
        appendParenthesisSeparator();
        parenthesis += multiplicity;
    }
}

function appendCoupling(range, nbDecimal) {
    if ('sm'.indexOf(range.signal[0].multiplicity) < 0
        && range.signal[0].j && range.signal[0].j.length > 0) {
        var Js = range.signal[0].j;
        var j = '<i>J</i> = ';
        for (var i = 0; i < Js.length; i++) {
            var coupling = Js[i].coupling || 0;
            if (j.length > 11) {
                j += ', ';
            }
            j += coupling.toFixed(nbDecimal);
        }
        appendParenthesisSeparator();
        parenthesis += j + ' Hz';
    }
}

function formatAssignment(assignment) {
    assignment = assignment.replace(/([0-9]+)/g, '<sub>$1</sub>');
    assignment = assignment.replace(/\"([^\"]*)\"/g, '<i>$1</i>');
    return assignment;
}

function formatMF(mf) {
    mf = mf.replace(/([0-9]+)/g, '<sub>$1</sub>');
    return mf;
}

function formatNucleus(nucleus) {
    nucleus = nucleus.replace(/([0-9]+)/g, '<sup>$1</sup>');
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
