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

function toAcs(ranges, options) {

    if(options && options.nucleus) {
        if(options.nucleus === '1H' || options.nucleus === 'H' ||
            options.nucleus === '19F' || options.nucleus === 'F' ||
            options.nucleus === '1h' || options.nucleus === 'h' ||
            options.nucleus === 'f' || options.nucleus === '19f') {

            if(options.nucleus === '1h' || options.nucleus === 'h') {
                options.nucleus = '1H';
            }else if(options.nucleus === 'f' || options.nucleus === '19f') {
                options.nucleus = '19F';
            };
            var defaultOptions =  {
                nbDecimalDelta: 2,
                nbDecimalJ: 1,
                observedFrequency: 400
            };
        } else if (options.nucleus === '13C' || options.nucleus === 'C' ||
                options.nucleus === '13c' || options.nucleus === 'c') {
            var defaultOptions = {
                nbDecimalDelta: 1,
                nbDecimalJ: 1,
                observedFrequency: 100
            };
            options.nucleus = '13C';
        }
    } else {
        return;
    }

    options = Object.assign({}, defaultOptions, {ascending: false, format: 'IMJA'}, options);

    ranges = ranges.clone();

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
    var acs = appendSpectroInformation(options);
    if(acs.length === 0) acs = 'δ ';
    var acsRanges = [];
    for (let range of ranges) {
        appendDelta(range, acsRanges, options);
    }
    if (acsRanges.length > 0) {
        return acs + acsRanges.join(', ');
    } else {
        return '';
    }
}

function appendSpectroInformation(options) {
    let parenthesis = [];
    let strings = formatNucleus(options.nucleus) + ' NMR';
    if (options.solvent) {
        parenthesis.push(formatMF(options.solvent));
    }
    if (options.frequencyObserved) {
        parenthesis.push((options.frequencyObserved * 1).toFixed(0) + ' MHz');
    }
    if (parenthesis.length > 0) {
        strings += ' (' + parenthesis.join(', ') + '): δ ';
    } else {
        strings += ' : δ '
    }
    return strings;
}

function appendDelta(range, acsRanges, options) {
    var strings = '';
    var parenthesis = [];
    var format = options.format;
    if(Array.isArray(range.signal) && range.signal.length > 0) {
        var signals = range.signal;
        if(signals.length > 1) {
            let fromTo = [range.from, range.to];
            strings += Math.min(...fromTo).toFixed(options.nbDecimalDelta) + '-' + Math.max(...fromTo).toFixed(options.nbDecimalDelta);
            strings +=  ' (' + getIntegral(range, options);
            options.format += '-IntegralLess'
            for(let signal of  signals) {
                var parenthesis = [];
                if(signal.delta) {
                    strings = appendSeparator(strings);
                    strings += signal.delta.toFixed(options.nbDecimalDelta);
                    switchFormat(range, signal, parenthesis, options);
                    if (parenthesis.length > 0) {
                        strings+=' ('+parenthesis.join(', ')+')';
                    }
                }
            }
            strings +=  ')';
        } else {
            var signal = signals[0];
            var parenthesis = [];
            if(signal.delta) {
                strings += signal.delta.toFixed(options.nbDecimalDelta);
                switchFormat(range, signal, parenthesis, options);
                strings+=' ('+parenthesis.join(', ')+')';
            } else {
                let fromTo = [range.from, range.to];
                strings += Math.min(...fromTo).toFixed(options.nbDecimalDelta) + '-' + Math.max(...fromTo).toFixed(options.nbDecimalDelta);
                switchFormat(range, signal, parenthesis, options);
                strings += ' ('+ parenthesis + ')'
            }
        }
    } else {
        let fromTo = [range.from, range.to];
        strings += Math.min(...fromTo).toFixed(options.nbDecimalDelta) + '-' + Math.max(...fromTo).toFixed(options.nbDecimalDelta);
        options.format += '-massive';
        switchFormat(range, [], parenthesis, options);
        strings += ' (' + parenthesis.join(', ') + ')'
    }
    options.format = format;
    acsRanges.push(strings);
}

module.exports = toAcs;

function getIntegral(range, options) {
    if (range.pubIntegral) {
        return range.pubIntegral;
    } else if (range.integral) {
        return range.integral.toFixed(0) + options.nucleus[options.nucleus.length - 1];
    }
}

function pushIntegral(range, parenthesis, options) {
    parenthesis.push(getIntegral(range, options));
};

function pushMultiplicityFromSignal(signal, parenthesis) {
    parenthesis.push(getMultiplicityFromSignal(signal));
}

// this function needs a object as signal argument
function pushCoupling(signal, parenthesis, options) {
    if (Array.isArray(signal.j) && signal.j.length > 0) {
        var Js = signal.j;
        var values = []
        var j = '<i>J</i> = ';
        for (var i = 0; i < Js.length; i++) {
            var coupling = Js[i].coupling || 0;
            values.push(coupling.toFixed(options.nbDecimalJ));
        }
        parenthesis.push(j + values.join(', ') + ' Hz');
    }
}

function pushAssignment(signal, parenthesis) {
    if (signal.pubAssignment) {
        parenthesis.push(formatAssignment(signal.pubAssignment));
    } else if (signal.assignment) {
        parenthesis.push(formatAssignment(signal.assignment));
    }
}

// more private functions
function formatMF(mf) {
    return mf.replace(/([0-9]+)/g, '<sub>$1</sub>');
}

function formatNucleus(nucleus) {
    return nucleus.replace(/([0-9]+)/g, '<sup>$1</sup>');
}

function appendSeparator(strings) {
    if ((strings.length > 0) && (!strings.match(/ $/)) && (!strings.match(/\($/))) {
        return strings + ', ';
    } else {
        return strings;
    }
}

function formatAssignment(assignment) {
    assignment = assignment.replace(/([0-9]+)/g, '<sub>$1</sub>');
    assignment = assignment.replace(/\"([^\"]*)\"/g, '<i>$1</i>');
    return assignment;
}

function switchFormat(range, signal, parenthesis, options) {
    switch (options.format) {
        case 'IMJA':
            pushIntegral(range, parenthesis, options);
            pushMultiplicityFromSignal(signal, parenthesis);
            pushCoupling(signal, parenthesis, options);
            pushAssignment(signal, parenthesis);
            break;
        case 'AIMJ':
            pushAssignment(signal, parenthesis);
            pushIntegral(range, parenthesis, options);
            pushMultiplicityFromSignal(signal, parenthesis);
            pushCoupling(signal, parenthesis, options);
            break;
        case 'IMJA-IntegralLess':
            pushMultiplicityFromSignal(signal, parenthesis);
            pushCoupling(signal, parenthesis, options);
            pushAssignment(signal, parenthesis);
            break;
        case 'AIMJ-IntegralLess':
            pushAssignment(signal, parenthesis);
            pushMultiplicityFromSignal(signal, parenthesis);
            pushCoupling(signal, parenthesis, options);
            break;
        case 'AIMJ-massive':
            if(range.pubAssignment !== undefined) {
                parenthesis.push(range.pubAssignment);
            } else if(range.assignment !== undefined) {
                parenthesis.push(range.assignment);
            }
            pushIntegral(range, parenthesis, options);
            parenthesis.push('m');
            break;
        case 'IMJA-massive':
            pushIntegral(range, parenthesis, options);
            parenthesis.push('m');
            if(range.pubAssignment !== undefined) {
                parenthesis.push(range.pubAssignment);
            } else if(range.assignment !== undefined) {
                parenthesis.push(range.assignment);
            }
            break
    }
}