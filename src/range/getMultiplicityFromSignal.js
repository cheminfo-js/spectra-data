function getMultiplicityFromSignal(signal) {
    if (signal.pubMultiplicity) {
        return signal.pubMultiplicity;
    } else if (signal.multiplicity) {
        return signal.multiplicity;
    }

    if (! Array.isArray(signal.j) || signal.j.length===0) {
        return 's';
    }

    let couplings = signal.j;
    let multiplicity = '';
    let addSpace=false;
    for (let coupling of couplings) {
        if (coupling.multiplicity.length>1) {
            multiplicity+=' ';
            addSpace=true;
        } else {
            if (addSpace) {
                multiplicity+=' ';
                addSpace=false;
            }
        }
        multiplicity += coupling.multiplicity;
    }
    return multiplicity;
}


module.exports=getMultiplicityFromSignal;
