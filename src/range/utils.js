'use strict';
/**
 * This library formats a set of nmr1D signals to the ACS format.
 * Created by acastillo on 3/11/15. p
 */
const acs = require('./acs/acs');

module.exports.nmrJ = function (Js, options) {
    var Jstring = '';
    var opt = Object.assign({}, {separator: ', ', nbDecimal: 2}, options);
    let j, i;
    for (i = 0; i < Js.length; i++) {
        j = Js[i];
        if (j.length > 11)            {
            j += opt.separator;
        }
        Jstring += j.multiplicity + ' ' + j.coupling.toFixed(opt.nbDecimal);
    }
    return Jstring;
};

/**
 * This function converts an array of peaks [{x, y, width}] in a vector equally x,y vector
 * TODO This function is very general and should be placed somewhere else
 * @param peaks
 * @param opt
 * @returns {{x: Array, y: Array}}
 */
module.exports.peak2Vector = require('./peak2Vector');


module.exports.toACS = function (ranges, opt) {
    return acs(ranges, opt);
};
