'use strict';

const impuritiesList = require('./impurities.json');
const look4 = 'solvent_residual_peak' + 'H2O' + 'TMS';

function checkImpurity(peakList, impurity) {
    var j, tolerance, diference;
    var i = impurity.length;
    while (i--) {
        j = peakList.length;
        while (j--) {
            if (!peakList[j].asymmetric) {
                tolerance = 0.025 + Math.abs(peakList[j].from - peakList[j].to) / 2;
                diference = Math.abs(impurity[i].shift - Math.abs(peakList[j].from + peakList[j].to) / 2);
                if (diference < tolerance) { // && (impurity[i].multiplicity === '' || (impurity[i].multiplicity.indexOf(peakList[j].multiplicity)) { // some impurities has multiplicities like 'bs' but at presents it is unsupported
                    peakList.splice(j, 1);
                    break;
                }
            }
        }
    }
}

function removeImpurities(peakList, solvent, nH) {
    var impurities = null, i;
    for (i = 0; i < impuritiesList.length; i++) {
        if (impuritiesList[i].solvent.indexOf(solvent) >= 0) {
            impurities = impuritiesList[i].impurities;
            break;
        }
    }

    for (i = 0; i < impurities.length; i++) {
        if (look4.indexOf(impurities[i].name) >= 0) {
            // console.log('pasa')
            checkImpurity(peakList, impurities[i].shifts);
        }
    }

    var sumObserved = 0;
    for (i = 0; i < peakList.length; i++) {
        sumObserved += peakList[i].integral;
    }

    if (sumObserved !== nH) {
        sumObserved = nH / sumObserved;
        for (i = 0; i < peakList.length; i++) {
            peakList[i].integral *= sumObserved;
        }
    }
    return peakList;
}

module.exports = removeImpurities;
