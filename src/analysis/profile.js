'use strict';

/**
 * This function extract the grandient of concentration from a spatial (z) profile acquired with successives
 * experiments of spatially selective NMR. More information with descriptive pictures are found here: 10.1002/mrc.4561
 *
 * @param {array} pdata - array of SD instances with peakPicking done.
 * @param {array} signals - list of chemical shift of signals.
 * @param {number} maxShiftDiference - maximal difference between two signals from subsequent slices.
 * @returns {Array}
 */

function profile(pdata, signals, maxShiftDiference) {

    var peaks = pdata[0].peakPicking;

    var Data = new Array(signals.length);

    // @TODO Is needed to modified something to obtain spoffs information by default.
    for (var i = 0; i < signals.length; i++) {
        var profileData = [];
        var shiftData = [];
        var ini = true;
        for (var k = 0; k < peaks.length; k++) {
            if (Math.abs(peaks[k].signal[0].delta - signals[i]) <= maxShiftDiference) {
                profileData.push(Number(pdata[0].value.info.$SPOFFS));
                profileData.push(peaks[k].integral);
                shiftData.push(peaks[k].signal[0].delta);
                shiftData.push(Number(pdata[0].value.info.$SPOFFS));
                Data[i] = [profileData, shiftData];
                k = peaks.length;
                ini = false;
            }
        }
        if (ini) Data[i] = [profileData, shiftData];
    }

    for (i = 1; i < pdata.length; i++) {
        peaks = pdata[i].peakPicking;
        for (var j = 0; j < signals.length; j++) {
            for (k = 0; k < peaks.length; k++) {
                if (Math.abs(peaks[k].signal[0].delta - signals[j]) <= maxShiftDiference) {
                    var temp = Data[j];
                    profileData = temp[0];
                    shiftData = temp[1];
                    profileData.push(Number(pdata[i].value.info.$SPOFFS));
                    profileData.push(peaks[k].integral);
                    shiftData.push(peaks[k].signal[0].delta);
                    shiftData.push(Number(pdata[i].value.info.$SPOFFS));
                    signals[j] = peaks[k].signal[0].delta;
                    k = peaks.length;
                }
            }
        }
    }
    return Data;
}

module.exports = profile;
