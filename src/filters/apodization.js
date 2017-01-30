'use strict';

function apodization(spectraData, parameters) {
    let params = Object.assign({}, parameters);
    if (!params) {
        return spectraData;
    }
    return spectraData;
    //org.cheminfo.hook.nemo.filters.ApodizationFilter

    /*public String toString() {
     switch (this) {
     case NONE:
     return "None";
     case EXPONENTIAL:
     return "Exponential";
     case GAUSSIAN:
     return "Gaussian";
     case TRAF:
     return "TRAF";
     case SINE_BELL:
     return "Sine Bell";
     case SINE_BELL_SQUARED:
     return "Sine Bell Squared";
     default:
     return "";
     }
     }*/
}

module.exports = apodization;
