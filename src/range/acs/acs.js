'use strict';
/**
 * nbDecimalsDelta : default depends nucleus H, F: 2 otherwise 1
 * nbDecimalsJ : default depends nucleus H, F: 1, otherwise 0
 * ascending : true / false
 * format : default "AIMJ" or when 2D data is collected the default format may be "IMJA"
 * deltaSeparator : ', '
 * detailSeparator : ', '
 */

const joinCoupling = require('../utils').joinCoupling;
var globalOptions = {
    h: {
        nucleus: '1H',
        nbDecimalDelta: 2,
        nbDecimalJ: 1,
        observedFrequency: 400
    },
    c: {
        nucleus: '13C',
        nbDecimalDelta: 1,
        nbDecimalJ: 1,
        observedFrequency: 100
    },
    f: {
        nucleus: '19F',
        nbDecimalDelta: 2,
        nbDecimalJ: 1,
        observedFrequency: 400
    }
};

function toAcs(ranges, options = {}) {
    var nucleus = (options.nucleus || '1H').toLowerCase().replace(/[0-9]/g, '');
    var defaultOptions = globalOptions[nucleus];
    options = Object.assign({}, defaultOptions, {ascending: false, format: 'IMJA'}, options);

    ranges = ranges.clone();
    if (options.ascending === true) {
        ranges.sort((a, b) => {
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
    var acs = spectroInformation(options);
    if (acs.length === 0) acs = 'δ ';
    var acsRanges = [];
    for (let range of ranges) {
        pushDelta(range, acsRanges, options);
    }
    if (acsRanges.length > 0) {
        return acs + acsRanges.join(', ');
    } else {
        return '';
    }
}

function spectroInformation(options) {
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
        strings += ': δ ';
    }
    return strings;
}

function pushDelta(range, acsRanges, options) {
    var strings = '';
    var parenthesis = [];
    let fromTo = [range.from, range.to];
    if (Array.isArray(range.signal) && range.signal.length > 0) {
        var signals = range.signal;
        if (signals.length > 1) {
            if (options.ascending === true) {
                signals.sort((a, b) => {
                    return a.delta - b.delta;
                });
            }
            strings += Math.min(...fromTo).toFixed(options.nbDecimalDelta) + '-'
                     + Math.max(...fromTo).toFixed(options.nbDecimalDelta);
            strings += ' (' + getIntegral(range, options);
            for (let signal of signals) {
                parenthesis = [];
                if (signal.delta !== undefined) {
                    strings = appendSeparator(strings);
                    strings += signal.delta.toFixed(options.nbDecimalDelta);
                }
                switchFormat({}, signal, parenthesis, options);
                if (parenthesis.length > 0) strings += ' (' + parenthesis.join(', ') + ')';
            }
            strings += ')';
        } else {
            parenthesis = [];
            if (signals[0].delta !== undefined) {
                strings += signals[0].delta.toFixed(options.nbDecimalDelta);
                switchFormat(range, signals[0], parenthesis, options);
                if (parenthesis.length > 0) strings += ' (' + parenthesis.join(', ') + ')';
            } else {
                strings += Math.min(...fromTo).toFixed(options.nbDecimalDelta) + '-' + Math.max(...fromTo).toFixed(options.nbDecimalDelta);
                switchFormat(range, signals[0], parenthesis, options);
                if (parenthesis.length > 0) strings += ' (' + parenthesis + ')';
            }
        }
    } else {
        strings += Math.min(...fromTo).toFixed(options.nbDecimalDelta) + '-' + Math.max(...fromTo).toFixed(options.nbDecimalDelta);
        switchFormat(range, [], parenthesis, options);
        if (parenthesis.length > 0) strings += ' (' + parenthesis.join(', ') + ')';
    }
    acsRanges.push(strings);
}

function getIntegral(range, options) {
    let integral = '';
    if (range.pubIntegral) {
        integral = range.pubIntegral;
    } else if (range.integral) {
        integral = range.integral.toFixed(0) + options.nucleus[options.nucleus.length - 1];
    }
    return integral;
}

function pushIntegral(range, parenthesis, options) {
    let integral = getIntegral(range, options);
    if (integral.length > 0) parenthesis.push(integral);
}

function pushMultiplicityFromSignal(signal, parenthesis) {
    let multiplicity = signal.multiplicity || joinCoupling(signal, 0.05);
    if (multiplicity.length > 0) parenthesis.push(multiplicity);
}

function switchFormat(range, signal, parenthesis, options) {
    for (const char of options.format) {
        switch (char.toUpperCase()) {
            case 'I':
                pushIntegral(range, parenthesis, options);
                break;
            case 'M':
                pushMultiplicityFromSignal(signal, parenthesis);
                break;
            case 'A':
                pushAssignment(signal, parenthesis);
                break;
            case 'J':
                pushCoupling(signal, parenthesis, options);
                break;
            default:
                throw new Error('Unknow format letter: ' + char);
        }
    }
}

function formatMF(mf) {
    return mf.replace(/([0-9]+)/g, '<sub>$1</sub>');
}

function formatNucleus(nucleus) {
    return nucleus.replace(/([0-9]+)/g, '<sup>$1</sup>');
}

function appendSeparator(strings) {
    if ((strings.length > 0) && (!strings.match(/ $/)) && (!strings.match(/\($/))) {
        strings += ', ';
    }
    return strings;
}

function formatAssignment(assignment) {
    assignment = assignment.replace(/([0-9]+)/g, '<sub>$1</sub>');
    assignment = assignment.replace(/\"([^\"]*)\"/g, '<i>$1</i>');
    return assignment;
}

function pushCoupling(signal, parenthesis, options) {
    if (Array.isArray(signal.j) && signal.j.length > 0) {
        signal.j.sort(function (a, b) {
            return b.coupling - a.coupling;
        });

        var values = [];
        for (let j of signal.j) {
            if (j.coupling !== undefined) {
                values.push(j.coupling.toFixed(options.nbDecimalJ));
            }
        }
        if (values.length > 0) parenthesis.push('<i>J</i> = ' + values.join(', ') + ' Hz');
    }
}

function pushAssignment(signal, parenthesis) {
    if (signal.pubAssignment) {
        parenthesis.push(formatAssignment(signal.pubAssignment));
    } else if (signal.assignment) {
        parenthesis.push(formatAssignment(signal.assignment));
    }
}
module.exports = toAcs;
