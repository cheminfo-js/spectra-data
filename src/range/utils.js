'use strict';

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


module.exports.peak2Vector = require('./peak2Vector');


module.exports.toACS = function (ranges, opt) {
    return acs(ranges, opt);
};
