'use strict';

function getMultiplicityFromSignal(signal) {
    if (signal.pubMultiplicity) {
        return signal.pubMultiplicity;
    } else if (signal.multiplicity) {
        return signal.multiplicity;
    } else if (Array.isArray(signal.j) && signal.j.length > 0) {
        var couplings = signal.j;
        var multiplicity = '';
        var addSpace = false;
        for (let coupling of couplings) {
            if (coupling.multiplicity.length > 1) {
                multiplicity += ' ';
                addSpace = true;
            } else {
                if (addSpace) {
                    multiplicity += ' ';
                    addSpace = false;
                }
            }
            multiplicity += coupling.multiplicity;
        }
        return multiplicity;
    } else if (signal.delta) {
        return 's';
    } else {
        return 'm';
    }
}


module.exports = getMultiplicityFromSignal;
