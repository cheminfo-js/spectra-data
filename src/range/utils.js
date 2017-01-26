'use strict';

const acs = require('./acs/acs');

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

module.exports.peak2Vector = require('./peak2Vector');

module.exports = {toACS, nmrJ};
