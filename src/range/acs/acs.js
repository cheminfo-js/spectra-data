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
    nbDecimalCs: 2,
    nbDecimalJ: 1,
    frequencyObserved: 400,
    ascending: false,

};

function toAcs(ranges, options) {

    options = Object.assign(defaultOptions, options);

    ranges = ranges.clone();  // define it in Ranges file

    if (options.ascending) {
        ranges.sort(function (a, b) {
            let fromA = Math.min(a.from, a.to);
            let fromB = Math.min(b.from, b.to);
            return fromB - fromA;
        });
    } else {
        ranges.sort(function (a, b) {
            let fromA = Math.min(a.from, a.to);
            let fromB = Math.min(b.from, b.to);
            return fromA - fromB;
        });
    }

    var acsString = formatAcs(ranges, options);

    if (acsString.length > 0) acsString += '.';

    return acsString;
}

function formatAcs(ranges, options) {
    // I will include the sampleName in the begining
    var acs = appendSpectroInformation(options);
    if(acs.length === 0) acs = 'δ ';
    var acsRanges = [];
    for (let range of ranges) {
        acsRanges.push(appendDelta(range, options));
    }
    if (acsRanges.length > 0) {
        return acs + acsRanges.join(', ');
    } else {
        return '';
    }
}


// It is ok, included the private functions
function appendSpectroInformation(options) {
    let strings = '';
    let parenthesis = '';
    if (options.nucleus) {
        strings += formatNucleus(options.nucleus) + ' NMR';
    }
    if (options.solvent || options.frequencyObserved) {
        if (options.solvent) {
            parenthesis += formatMF(options.solvent);
        } if (options.frequencyObserved) {
            parenthesis = appendSeparator(parenthesis);
            parenthesis += (options.frequencyObserved * 1).toFixed(0) + ' MHz';
        } if(parenthesis.length > 0) {
            strings += ' (' + parenthesis + ')';
            strings += ' δ '
        }
    }
    return strings;
}

function appendDelta(range, options) {
    if(Array.isArray(range.signal) && range.signal.length > 0) {
        var strings = '';
        var parenthesis = '';
        var signals = range.signal;
        if(signals.length > 1) {
            let fromTo = [range.from, range.to];
            strings += ' ' + Math.min(...fromTo).toFixed(options.nbDecimalCs) + '-' + Math.max(...fromTo).toFixed(options.nbDecimalCs);
            strings += ' (' + getIntegral(range);
            for(let signal of  signals) {
                var parenthesis = '';
                if(signal.delta) {
                    strings = appendSeparator(strings);
                    strings += signal.delta.toFixed(options.nbDecimalCs);
                    parenthesis += getMultiplicityFromSignal(signal);
                    parenthesis = appendCoupling(signal, parenthesis, options);
                    parenthesis = appendAssignment(signal, parenthesis);
                    strings += ' ('+ parenthesis + ')';
                }
            }
            strings +=  ')';
        } else {
            var signal = signals[0];
            if(signal.delta) {
                strings += signal.delta.toFixed(options.nbDecimalCs);
                parenthesis += getIntegral(range);
                parenthesis = appendSeparator(parenthesis);
                parenthesis += getMultiplicityFromSignal(signal);
                parenthesis = appendCoupling(signal, parenthesis, options);
                parenthesis = appendAssignment(signal, parenthesis);
                strings += ' ('+ parenthesis + ')'
            } else {
                let fromTo = [range.from, range.to];
                strings += ' ' + Math.min(...fromTo).toFixed(options.nbDecimalCs) + '-' + Math.max(...fromTo).toFixed(options.nbDecimalCs);
                parenthesis += getIntegral(range);
                parenthesis = appendSeparator(parenthesis);
                parenthesis += getMultiplicityFromSignal(signal);
                parenthesis = appendCoupling(signal, parenthesis, options);
                parenthesis = appendAssignment(signal, parenthesis);
                strings += ' ('+ parenthesis + ')'
            }
        }
    } else {
        var strings = '';
        let fromTo = [range.from, range.to];
        strings += ' ' + Math.min(...fromTo).toFixed(options.nbDecimalCs) + '-' + Math.max(...fromTo).toFixed(options.nbDecimalCs) + ' ';
        if(range.pubAssigment || range.assigment) {
            let assignment = range.pubAssigment || range.assigment;
            strings += ' (' + getIntegral(range);
            strings = appendSeparator(strings);
            strings += 'm, ' + assignment + ')'; // here is where is necessary an pubAssigment when a range doesn't have a signal otherwise always is necessary a signal[0].pubAssignment/signal[0].assignnment
        } else {
            strings += ' (' + getIntegral(range);
            strings = appendSeparator(strings);
            strings += 'm)';
        }
    }
    return strings;
}


module.exports = toAcs;


// it is ok
function getIntegral(range) {
    if (range.pubIntegral) {
        return range.pubIntegral;
    } else if (range.integral) {
        return range.integral.toFixed(0) + 'H';
    }
}

// this function needs a object as signal argument
function appendCoupling(signal, parenthesis, options) {
    if (Array.isArray(signal.j) && signal.j.length > 0) {
        parenthesis = appendSeparator(parenthesis);
        var Js = signal.j;
        var j = '<i>J</i> = ';
        for (var i = 0; i < Js.length; i++) {
            var coupling = Js[i].coupling || 0;
            j = appendSeparator(j);
            j += coupling.toFixed(options.nbDecimalJ);
        }
        parenthesis += j + ' Hz';
    }
    return parenthesis;
}

function appendAssignment(signal, strings) {
    if (signal.pubAssignment) {
        strings = appendSeparator(strings);
        strings += formatAssignment(signal.pubAssignment);
        return strings;
    } else if (signal.assignment) {
        strings = appendSeparator(strings);
        strings += formatAssignment(signal.assignment);
        return strings;
    } else {
        return strings;
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

function appendSeparator(asdf) {
    if ((asdf.length > 0) && (!asdf.match(/ $/)) && (!asdf.match(/\($/))) {
        return asdf + ', ';
    } else {
        return asdf;
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