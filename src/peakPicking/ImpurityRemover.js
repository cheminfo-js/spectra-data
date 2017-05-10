'use strict';

const impurities = require('./impurities.json');
const toCheck = ['solvent_residual_peak', 'H2O', 'TMS'];

function checkImpurity(peakList, impurity, options) {
    var j, tolerance, diference;
    var i = impurity.length;
    while (i--) {
        j = peakList.length;
        while (j--) {
            if (!peakList[j].asymmetric) {
                tolerance = options.error + Math.abs(peakList[j].from - peakList[j].to) / 2;
                diference = Math.abs(impurity[i].shift - Math.abs(peakList[j].from + peakList[j].to) / 2);
                if (diference < tolerance) { // && (impurity[i].multiplicity === '' || (impurity[i].multiplicity.indexOf(peakList[j].multiplicity)) { // some impurities has multiplicities like 'bs' but at presents it is unsupported
                    peakList.splice(j, 1);
                    break;
                }
            }
        }
    }
}

function removeImpurities(peakList, options = {}) {
    var {
        solvent = '',
        nH = 99,
        sumObserved = 0,
        error = 0.025
    } = options;
    solvent = solvent.toLowerCase();
    if (solvent === '(cd3)2so') solvent = 'dmso';
    var solventImpurities = impurities[solvent];
    if (solventImpurities) {
        for (let impurity of toCheck) {
            let impurityShifts = solventImpurities[impurity.toLowerCase()];
            checkImpurity(peakList, impurityShifts, {error: error});
        }

        for (var i = 0; i < peakList.length; i++) {
            sumObserved += peakList[i].integral;
        }

        if (sumObserved !== nH) {
            sumObserved = nH / sumObserved;
            while (i--) {
                peakList[i].integral *= sumObserved;
            }
        }
    }
    return peakList;
}

module.exports = removeImpurities;
