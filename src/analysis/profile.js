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

function getProfile(pdata, signals, maxShiftDiference) {

    var peaks = pdata[0].peakPicking;

    var data = new Array(signals.length);

    // @TODO Is needed to modified something to obtain spoffs information by default.
    for (var i = 0; i < signals.length; i++) {
        var profileDataX = [];
        var profileDataY = [];
        var shiftDataX = [];
        var shiftDataY = [];
        var newPeak = true;
        for (var k = 0; k < peaks.length; k++) {
            if (Math.abs(peaks[k].signal[0].delta - signals[i]) <= maxShiftDiference) {
                profileDataX.push(pdata[0].value.info.$SPOFFS);
                profileDataY.push(peaks[k].integral);
                shiftDataX.push(peaks[k].signal[0].delta);
                shiftDataY.push(pdata[0].value.info.$SPOFFS);
                data[i] = [profileDataX, profileDataY, shiftDataX, shiftDataY];
                k = peaks.length;
                newPeak = false;
            }
        }
        if (newPeak) data[i] = [profileDataX, profileDataY, shiftDataX, shiftDataY];
    }

    for (i = 1; i < pdata.length; i++) {
        peaks = pdata[i].peakPicking;
        for (var j = 0; j < signals.length; j++) {
            for (k = 0; k < peaks.length; k++) {
                if (Math.abs(peaks[k].signal[0].delta - signals[j]) <= maxShiftDiference) {
                    var temp = data[j];
                    profileDataX = temp[0];
                    profileDataY = temp[1];
                    shiftDataX = temp[2];
                    shiftDataY = temp[3];
                    profileDataX.push(Number(pdata[i].value.info.$SPOFFS));
                    profileDataY.push(peaks[k].integral);
                    shiftDataX.push(peaks[k].signal[0].delta);
                    shiftDataY.push(Number(pdata[i].value.info.$SPOFFS));
                    signals[j] = peaks[k].signal[0].delta;
                    k = peaks.length;
                }
            }
        }
    }
    var dataExport = new Array(pdata.length);
    for (i = 0; i < signals.length; i++) {
        dataExport[i] = {'delta': signals[i], 'profile': {x: data[i][0], y: data[i][1]}, 'shift': {x: data[i][2], y: data[i][3]}};
    }
    return dataExport;
}
//// Old version of profile, this funtion use object to store the information and the use of object is always slow
// function profile(pdata, signals, maxShiftDiference) {
//
//     var peaks = pdata[0].peakPicking;
//
//     var Data = new Array(signals.length);
//
//     var dataShift = {}, dataProfile = {};
//
//     for (var i = 0; i < signals.length; i++) {
//         var ini = true;
//         for (var k = 0; k < peaks.length; k++) {
//             if (Math.abs(peaks[k].signal[0].delta - signals[i]) <= maxShiftDiference) {
//                 dataShift = {x: [peaks[k].signal[0].delta], y: [Number(pdata[0].filename)]};
//                 dataProfile = {x: [Number(pdata[0].filename)], y: [peaks[k].integral]};
//                 Data[i] = {title: signals[i].toString(), shift: {data: dataShift}, profile: {data: dataProfile}};
//                 k = peaks.length;
//                 ini = false;
//             }
//         }
//         if (ini) {
//             dataShift = {x: [], y: []};
//             dataProfile = {x: [], y: []};
//             Data[i] = {title: signals[i].toString(), shift: {data: dataShift}, profile: {data: dataProfile}};
//         }
//     }
//
//     for (i = 1; i < pdata.length; i++) {
//         peaks = pdata[i].peakPicking;
//         for (var j = 0; j < signals.length; j++) {
//             for (k = 0; k < peaks.length; k++) {
//                 if (Math.abs(peaks[k].signal[0].delta - signals[j]) <= maxShiftDiference) {
//                     var temp = Data[j];
//                     temp.profile.data.y.push(peaks[k].integral);
//                     temp.profile.data.x.push(Number(pdata[i].filename));
//                     temp.shift.data.y.push(Number(pdata[i].filename));
//                     temp.shift.data.x.push(peaks[k].signal[0].delta);
//                     signals[j] = peaks[k].signal[0].delta;
//                     k = peaks.length;
//                 }
//             }
//         }
//     }
//     return Data;
// }
module.exports = getProfile;
