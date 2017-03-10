'use strict';

const ML = require('ml-curve-fitting');
const LM = ML.LM;
const math = ML.algebra;

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
//// Old version of profile, this funtion use objecto to store the information and the use of object is always slow
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


module.exports = profile;
