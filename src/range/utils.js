'use strict';

const acs = require('./acs/acs');
const patterns = ['s', 'd', 't', 'q', 'quint', 'h', 'sept', 'o', 'n'];

function nmrJ(Js, options) {
    var Jstring = '';
    var opt = Object.assign({}, {separator: ', ', nbDecimal: 2}, options);
    let j, i;
    for (i = 0; i < Js.length; i++) {
        j = Js[i];
        if (j.length > 11) {
            j += opt.separator;
        }
        Jstring += j.multiplicity + ' ' + j.coupling.toFixed(opt.nbDecimal);
    }
    return Jstring;
}

function toACS(ranges, options) {
    return acs(ranges, options);
}

function joinCoupling(signal, tolerance) {
    var jc = signal.j;
    var cont = 1;
    var pattern = '';
    var newNmrJs = [];
    var diaIDs = [];
    var atoms = [];
    if (jc && jc.length > 0) {
        jc.sort(function (a, b) {
            return b.coupling - a.coupling;
        });
        if (jc[0].diaID) {
            diaIDs = [jc[0].diaID];
        }
        if (jc[0].assignment) {
            atoms = [jc[0].assignment];
        }
        for (var i = 0; i < jc.length - 1; i++) {
            if (Math.abs(jc[i].coupling - jc[i + 1].coupling) < tolerance) {
                cont++;
                diaIDs.push(jc[i].diaID);
                atoms.push(jc[i].assignment);
            } else {
                let jTemp = {
                    coupling: Math.abs(jc[i].coupling),
                    multiplicity: patterns[cont]
                };
                if (diaIDs.length > 0) {
                    jTemp.diaID = diaIDs;
                }
                if (atoms.length > 0) {
                    jTemp.assignment = atoms;
                }
                newNmrJs.push(jTemp);

                pattern += patterns[cont];
                cont = 1;
                if (jc[0].diaID) {
                    diaIDs = [jc[i].diaID];
                }
                if (jc[0].assignment) {
                    atoms = [jc[i].assignment];
                }
            }
        }
        let jTemp = {
            coupling: Math.abs(jc[i].coupling),
            multiplicity: patterns[cont]
        };
        if (diaIDs.length > 0) {
            jTemp.diaID = diaIDs;
        }
        if (atoms.length > 0) {
            jTemp.assignment = atoms;
        }
        newNmrJs.push(jTemp);

        pattern += patterns[cont];
        signal.j = newNmrJs;

    } else if (signal.delta) {
        pattern = 's';
    } else {
        pattern = 'm';
    }
    return pattern;
}

module.exports = {toACS, nmrJ, joinCoupling};
module.exports.peak2Vector = require('./peak2Vector');
