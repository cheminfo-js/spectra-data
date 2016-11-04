'use strict';

const impuritiesList = require('./impurities.json');

var look4 = 'solvent_residual_peak' + 'H2O' + 'TMS';
//var pascalTriangle = [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1],[1,5,10,10,5,1],[1,6,15,20,15,6,1]];
//var patterns = ["s","d","t","q","quint","h","sept","o","n"];

function removeSignal(peak, noiseSignal) {

}

function checkImpurity(peakList, impurity) {
    var error = 0.025, i;
    var found = false;
    var indexes = new Array(impurity.length);
    for (i = 0; i < impurity.length; i++) {
        found = false;
        for (var j = 0; j < peakList.length; j++) {
            if (Math.abs(impurity[i].shift - peakList[j].delta1) <
                (error + Math.abs(peakList[j].startX - peakList[j].stopX) / 2) &&
                (impurity[i].multiplicity === '' ||
                (impurity[i].multiplicity.indexOf(peakList[j].multiplicity) >= 0 && !peakList[j].asymmetric))) {
                found = true;
                indexes[i] = j;
                break;
            }
        }
        if (!found)            {
            break;
        }
    }

    var toRemove = [];
    if (found) {
        for (i = 0; i < impurity.length; i++) {
            toRemove.push(indexes[i]);
        }
    }    else        {
        return 0;
    }
    for (i = 0; i < toRemove.length; i++) {
        peakList[toRemove[i]].integralData.value = 0;
    }
    return 1;
}

function removeImpurities(peakList, solvent, nH) {
    var impurities = null, i;
    for (i = 0; i < impuritiesList.length; i++) {
        if (impuritiesList[i].solvent.indexOf(solvent) >= 0) {
            impurities = impuritiesList[i].impurities;
            break;
        }
    }
    impurities.push({'shifts': [{'proton': 'X', 'coupling': 0, 'multiplicity': '', 'shift': 0.0}], 'name': 'TMS'});
    var nCols = peakList.length;
    var nRows = impurities.length;
    var scores = new Array(nRows);
    for (i = 0; i < nRows; i++) {
        if (look4.indexOf(impurities[i].name) >= 0) {
            scores[i] = checkImpurity(peakList, impurities[i].shifts);
        }
    }
    //Recompute the integrals
    var sumObserved = 0;
    for (i = 0; i < peakList.length; i++) {
        sumObserved += peakList[i].integralData.value;
    }
    if (sumObserved != nH) {
        sumObserved = nH / sumObserved;
        for (i = 0; i < peakList.length; i++) {
            peakList[i].integralData.value *= sumObserved;
        }
    }
}

module.exports = removeImpurities;
