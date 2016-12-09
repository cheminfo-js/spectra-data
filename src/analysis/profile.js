'use strict';
/**
 * Created by abol on 12/9/16.
 */

/**
 *  This function extract the grandient concentration for a spatial (z) profile acquired with a spatially selective NMR experiment.
 * @param {array} pdata
 * @param {array} signals
 * @param {number} threshold
 * @returns {Array}
 */

function profile(pdata, signals, threshold) {

    var peaks = pdata[0].peakPicking;

    var Data = new Array(signals.length);

    var dataShift = {}, dataProfile = {};

    for (var i = 0; i < signals.length; i++) {
        var ini = true;
        for (var k = 0; k < peaks.length; k++) {
            if (Math.abs(peaks[k].signal[0].delta - signals[i]) <= threshold) {
                dataShift = {x: [peaks[k].signal[0].delta], y: [Number(pdata[0].filename)]};
                dataProfile = {x: [Number(pdata[0].filename)], y: [peaks[k].integral]};
                Data[i] = {title: signals[i].toString(), shift: {data: dataShift}, profile: {data: dataProfile}};
                k = peaks.length;
                ini = false;
            }
        }
        if (ini) {
            dataShift = {x: [], y: []};
            dataProfile = {x: [], y: []};
            Data[i] = {title: signals[i].toString(), shift: {data: dataShift}, profile: {data: dataProfile}};
        }
    }

    for (i = 1; i < pdata.length; i++) {
        peaks = pdata[i].peakPicking;
        for (var j = 0; j < signals.length; j++) {
            for (k = 0; k < peaks.length; k++) {
                if (Math.abs(peaks[k].signal[0].delta - signals[j]) <= threshold) {
                    var temp = Data[j];
                    temp.profile.data.y.push(peaks[k].integral);
                    temp.profile.data.x.push(Number(pdata[i].filename));
                    temp.shift.data.y.push(Number(pdata[i].filename));
                    temp.shift.data.x.push(peaks[k].signal[0].delta);
                    signals[j] = peaks[k].signal[0].delta;
                    k = peaks.length;
                }
            }
        }
    }
    return Data;
}

module.exports = profile;

// function singleFitting(data, p_init, opts) {
//     var y = Boolean(data.y === undefined) ? data.data.y : data.data[0].y;
//     var x = Boolean(data.x === undefined) ? data.data.x : data.data[0].x;
//
//     //Get the max for normalize
//     var max = y[0];
//     for(var i =1; i<y.length; i++) {
//         if(y[i]> max) max = y[i];
//     }
//
//     // prepare of the data for fitting
//     var x_dat = math.matrix(y.length,1);
//     var y_dat = math.matrix(y.length,1);
//
//     for(i = 0; i<x_dat.length;i++){
//         x_dat[i][0] = x[i];
//         y_dat[i][0] = y[i]/max;
//     }
//     //calcule z position
//     x_dat = z_generator(x_dat,6.811384250474384,4258);
//
//     x= [],y =[];
//
//     for(i = 0;i<x_dat.length;i++){
//         x.push(x_dat[i][0]);
//         y.push(y_dat[i][0]);
//     }
//
//     var weight = [x_dat.length / math.sqrt(math.multiply(math.transpose(y_dat),y_dat))];
//
//     var p_min = math.multiply(math.abs(p_init),-10);
//     var p_max = math.multiply(math.abs(p_init),10);
//
//     var consts = [ ];// optional vector of constants
//
//     var p_fit = LM.optimize(err_func,p_init,x_dat,y_dat,weight,-0.01,p_min,p_max,consts,opts);
//
//     p_fit = p_fit.p;
//
//     var rango = [x_dat[0][0],x_dat[x_dat.length - 1][0]];
//     var t = math.matrix(100,1);
//     var ini = math.min(rango[0],rango[1]);
//     var jump = math.abs(rango[0]-rango[1])/100;
//
//     for(i=0; i<100; i++)
//         t[i][0]=ini+jump*i;
//
//     var y_fit = err_func(t,p_fit);
//
//     var yFit = [],xFit = [];
//
//     for(i=0; i<100; i++) {
//         xFit.push(t[i][0])
//         yFit.push(y_fit[i][0])
//     }
//     return {dataProfile:{title:"",data:{x:x,y:y}},fittingProfile:{title:"",data:{x:xFit,y:yFit}},pFit:p_fit};
// }

// const SD = require('../SD');
// const Brukerconverter = require('brukerconverter');
// const statArray = require('ml-stat');
