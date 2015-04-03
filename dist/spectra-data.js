/**
 * spectra-data - spectra-data project - manipulate spectra
 * @version v1.0.4
 * @link https://github.com/cheminfo-js/spectra-data
 * @license MIT
 */
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.spectraData=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';


exports.SD = require('./SD');
exports.NMR = require('./NMR');
exports.NMR2D = require('./NMR2D');
exports.ACS = require('./AcsParser');

//exports.SD2 = require('/SD2');
},{"./AcsParser":4,"./NMR":6,"./NMR2D":7,"./SD":11}],2:[function(require,module,exports){
'use strict';

function getConverter() {

    // the following RegExp can only be used for XYdata, some peakTables have values with a "E-5" ...
    var xyDataSplitRegExp = /[,\t \+-]*(?=[^\d,\t \.])|[ \t]+(?=[\d+\.-])/;
    var removeCommentRegExp = /\$\$.*/;
    var peakTableSplitRegExp = /[,\t ]+/;
    var DEBUG = false;

    var GC_MS_FIELDS = ['TIC', '.RIC', 'SCANNUMBER'];

    function convertToFloatArray(stringArray) {
        var l = stringArray.length;
        var floatArray = new Array(l);
        for (var i = 0; i < l; i++) {
            floatArray[i] = parseFloat(stringArray[i]);
        }
        return floatArray;
    }

    /*
     options.keepSpectra: keep the original spectra for a 2D
     options.xy: true // create x / y array instead of a 1D array
     options.keepRecordsRegExp: which fields do we keep
     */

    function convert(jcamp, options) {
        options = options || {};

        var keepRecordsRegExp=/^[A-Z]+$/;
        if (options.keepRecordsRegExp) keepRecordsRegExp=options.keepRecordsRegExp;

        var start = new Date();

        var ntuples = {},
            ldr,
            dataLabel,
            dataValue,
            ldrs,
            i, ii, position, endLine, infos;

        var result = {};
        result.profiling = [];
        result.logs = [];
        var spectra = [];
        result.spectra = spectra;
        result.info = {};
        var spectrum = {};

        if (!(typeof jcamp == 'string')) return result;
        // console.time('start');

        if (result.profiling) result.profiling.push({action: 'Before split to LDRS', time: new Date() - start});

        ldrs = jcamp.split(/[\r\n]+##/);

        if (result.profiling) result.profiling.push({action: 'Split to LDRS', time: new Date() - start});

        if (ldrs[0]) ldrs[0] = ldrs[0].replace(/^[\r\n ]*##/, '');

        for (i = 0, ii = ldrs.length; i < ii; i++) {
            ldr = ldrs[i];
            // This is a new LDR
            position = ldr.indexOf('=');
            if (position > 0) {
                dataLabel = ldr.substring(0, position);
                dataValue = ldr.substring(position + 1).trim();
            } else {
                dataLabel = ldr;
                dataValue = '';
            }
            dataLabel = dataLabel.replace(/[_ -]/g, '').toUpperCase();

            if (dataLabel == 'DATATABLE') {

                endLine = dataValue.indexOf('\n');
                if (endLine == -1) endLine = dataValue.indexOf('\r');
                if (endLine > 0) {
                    var xIndex = -1;
                    var yIndex = -1;
                    // ##DATA TABLE= (X++(I..I)), XYDATA
                    // We need to find the variables

                    infos = dataValue.substring(0, endLine).split(/[ ,;\t]+/);

                    if (infos[0].indexOf('++') > 0) {
                        var firstVariable = infos[0].replace(/.*\(([a-zA-Z0-9]+)\+\+.*/, '$1');
                        var secondVariable = infos[0].replace(/.*\.\.([a-zA-Z0-9]+).*/, '$1');
                        xIndex = ntuples.symbol.indexOf(firstVariable);
                        yIndex = ntuples.symbol.indexOf(secondVariable);
                    }

                    if (xIndex == -1) xIndex = 0;
                    if (yIndex == -1) yIndex = 0;

                    if (ntuples.first) {
                        if (ntuples.first.length > xIndex) spectrum.firstX = ntuples.first[xIndex];
                        if (ntuples.first.length > yIndex) spectrum.firstY = ntuples.first[yIndex];
                    }
                    if (ntuples.last) {
                        if (ntuples.last.length > xIndex) spectrum.lastX = ntuples.last[xIndex];
                        if (ntuples.last.length > yIndex) spectrum.lastY = ntuples.last[yIndex];
                    }
                    if (ntuples.vardim && ntuples.vardim.length > xIndex) {
                        spectrum.nbPoints = ntuples.vardim[xIndex];
                    }
                    if (ntuples.factor) {
                        if (ntuples.factor.length > xIndex) spectrum.xFactor = ntuples.factor[xIndex];
                        if (ntuples.factor.length > yIndex) spectrum.yFactor = ntuples.factor[yIndex];
                    }
                    if (ntuples.units) {
                        if (ntuples.units.length > xIndex) spectrum.xUnit = ntuples.units[xIndex];
                        if (ntuples.units.length > yIndex) spectrum.yUnit = ntuples.units[yIndex];
                    }
                    spectrum.datatable = infos[0];
                    if (infos[1] && infos[1].indexOf('PEAKS') > -1) {
                        dataLabel = 'PEAKTABLE';
                    } else if (infos[1] && (infos[1].indexOf('XYDATA') || infos[0].indexOf('++') > 0)) {
                        dataLabel = 'XYDATA';
                        spectrum.deltaX = (spectrum.lastX - spectrum.firstX) / (spectrum.nbPoints - 1);
                    }
                }
            }


            if (dataLabel == 'TITLE') {
                spectrum.title = dataValue;
            } else if (dataLabel == 'DATATYPE') {
                spectrum.dataType = dataValue;
                if (dataValue.indexOf('nD') > -1) {
                    result.twoD = true;
                }
            } else if (dataLabel == 'XUNITS') {
                spectrum.xUnit = dataValue;
            } else if (dataLabel == 'YUNITS') {
                spectrum.yUnit = dataValue;
            } else if (dataLabel == 'FIRSTX') {
                spectrum.firstX = parseFloat(dataValue);
            } else if (dataLabel == 'LASTX') {
                spectrum.lastX = parseFloat(dataValue);
            } else if (dataLabel == 'FIRSTY') {
                spectrum.firstY = parseFloat(dataValue);
            } else if (dataLabel == 'NPOINTS') {
                spectrum.nbPoints = parseFloat(dataValue);
            } else if (dataLabel == 'XFACTOR') {
                spectrum.xFactor = parseFloat(dataValue);
            } else if (dataLabel == 'YFACTOR') {
                spectrum.yFactor = parseFloat(dataValue);
            } else if (dataLabel == 'DELTAX') {
                spectrum.deltaX = parseFloat(dataValue);
            } else if (dataLabel == '.OBSERVEFREQUENCY' || dataLabel == '$SFO1') {
                if (!spectrum.observeFrequency) spectrum.observeFrequency = parseFloat(dataValue);
            } else if (dataLabel == '.OBSERVENUCLEUS') {
                if (!spectrum.xType) result.xType = dataValue.replace(/[^a-zA-Z0-9]/g, '');
            } else if (dataLabel == '$SFO2') {
                if (!result.indirectFrequency) result.indirectFrequency = parseFloat(dataValue);

            } else if (dataLabel == '$OFFSET') {   // OFFSET for Bruker spectra
                result.shiftOffsetNum = 0;
                if (!result.shiftOffsetVal)  result.shiftOffsetVal = parseFloat(dataValue);
            } else if (dataLabel == '$REFERENCEPOINT') {   // OFFSET for Varian spectra


                // if we activate this part it does not work for ACD specmanager
                //         } else if (dataLabel=='.SHIFTREFERENCE') {   // OFFSET FOR Bruker Spectra
                //                 var parts = dataValue.split(/ *, */);
                //                 result.shiftOffsetNum = parseInt(parts[2].trim());
                //                 result.shiftOffsetVal = parseFloat(parts[3].trim());
            } else if (dataLabel == 'VARNAME') {
                ntuples.varname = dataValue.split(/[, \t]+/);
            } else if (dataLabel == 'SYMBOL') {
                ntuples.symbol = dataValue.split(/[, \t]+/);
            } else if (dataLabel == 'VARTYPE') {
                ntuples.vartype = dataValue.split(/[, \t]+/);
            } else if (dataLabel == 'VARFORM') {
                ntuples.varform = dataValue.split(/[, \t]+/);
            } else if (dataLabel == 'VARDIM') {
                ntuples.vardim = convertToFloatArray(dataValue.split(/[, \t]+/));
            } else if (dataLabel == 'UNITS') {
                ntuples.units = dataValue.split(/[, \t]+/);
            } else if (dataLabel == 'FACTOR') {
                ntuples.factor = convertToFloatArray(dataValue.split(/[, \t]+/));
            } else if (dataLabel == 'FIRST') {
                ntuples.first = convertToFloatArray(dataValue.split(/[, \t]+/));
            } else if (dataLabel == 'LAST') {
                ntuples.last = convertToFloatArray(dataValue.split(/[, \t]+/));
            } else if (dataLabel == 'MIN') {
                ntuples.min = convertToFloatArray(dataValue.split(/[, \t]+/));
            } else if (dataLabel == 'MAX') {
                ntuples.max = convertToFloatArray(dataValue.split(/[, \t]+/));
            } else if (dataLabel == '.NUCLEUS') {
                if (result.twoD) {
                    result.yType = dataValue.split(/[, \t]+/)[0];
                }
            } else if (dataLabel == 'PAGE') {
                spectrum.page = dataValue.trim();
                spectrum.pageValue = parseFloat(dataValue.replace(/^.*=/, ''));
                spectrum.pageSymbol = spectrum.page.replace(/=.*/, '');
                var pageSymbolIndex = ntuples.symbol.indexOf(spectrum.pageSymbol);
                var unit = '';
                if (ntuples.units && ntuples.units[pageSymbolIndex]) {
                    unit = ntuples.units[pageSymbolIndex];
                }
                if (result.indirectFrequency && unit != 'PPM') {
                    spectrum.pageValue /= result.indirectFrequency;
                }
            } else if (dataLabel == 'RETENTIONTIME') {
                spectrum.pageValue = parseFloat(dataValue);
            } else if (dataLabel == 'XYDATA') {
                prepareSpectrum(result, spectrum);
                // well apparently we should still consider it is a PEAK TABLE if there are no '++' after
                if (dataValue.match(/.*\+\+.*/)) {
                    parseXYData(spectrum, dataValue, result);
                } else {
                    parsePeakTable(spectrum, dataValue, result);
                }
                spectra.push(spectrum);
                spectrum = {};
            } else if (dataLabel == 'PEAKTABLE') {
                prepareSpectrum(result, spectrum);
                parsePeakTable(spectrum, dataValue, result);
                spectra.push(spectrum);
                spectrum = {};
            } else if (isMSField(dataLabel)) {
                spectrum[convertMSFieldToLabel(dataLabel)] = dataValue;
            } else if (dataLabel.match(keepRecordsRegExp)) {
                result.info[dataLabel] = dataValue.trim();
            }
        }

        // Currently disabled
        //    if (options && options.lowRes) addLowRes(spectra,options);

        if (result.profiling) result.profiling.push({action: 'Finished parsing', time: new Date() - start});

        if (result.twoD) {
            add2D(result);
            if (result.profiling) result.profiling.push({
                action: 'Finished countour plot calculation',
                time: new Date() - start
            });
            if (!options.keepSpectra) {
                delete result.spectra;
            }
        }


        // maybe it is a GC (HPLC) / MS. In this case we add a new format
        if (spectra.length > 1 && spectra[0].dataType.toLowerCase().match(/.*mass./)) {
            addGCMS(result);
            if (result.profiling) result.profiling.push({
                action: 'Finished GCMS calculation',
                time: new Date() - start
            });
        }


        if (options.xy) { // the spectraData should not be a oneD array but an object with x and y
            if (spectra.length > 0) {
                for (var i=0; i<spectra.length; i++) {
                    var spectrum=spectra[i];
                    if (spectrum.data.length>0) {
                        for (var j=0; j<spectrum.data.length; j++) {
                            var data=spectrum.data[j];
                            var newData={x:Array(data.length/2), y:Array(data.length/2)};
                            for (var k=0; k<data.length; k=k+2) {
                                newData.x[k/2]=data[k];
                                newData.y[k/2]=data[k+1];
                            }
                            spectrum.data[j]=newData;
                        }

                    }

                }
            }
        }

        if (result.profiling) {
            result.profiling.push({action: 'Total time', time: new Date() - start});
        }

        //   console.log(result);
        //    console.log(JSON.stringify(spectra));
        return result;

    }


    function convertMSFieldToLabel(value) {
        return value.toLowerCase().replace(/[^a-z0-9]/g, '');
    }

    function isMSField(dataLabel) {
        for (var i = 0; i < GC_MS_FIELDS.length; i++) {
            if (dataLabel == GC_MS_FIELDS[i]) return true;
        }
        return false;
    }

    function addGCMS(result) {
        var spectra = result.spectra;
        var existingGCMSFields = [];
        var i;
        for (i = 0; i < GC_MS_FIELDS.length; i++) {
            var label = convertMSFieldToLabel(GC_MS_FIELDS[i]);
            if (spectra[0][label]) {
                existingGCMSFields.push(label);
            }
        }
        var gcms = {};
        gcms.gc = {};
        gcms.ms = [];
        for (i = 0; i < existingGCMSFields.length; i++) {
            gcms.gc[existingGCMSFields[i]] = [];
        }
        for (i = 0; i < spectra.length; i++) {
            var spectrum = spectra[i];
            for (var j = 0; j < existingGCMSFields.length; j++) {
                gcms.gc[existingGCMSFields[j]].push(spectrum.pageValue);
                gcms.gc[existingGCMSFields[j]].push(parseFloat(spectrum[existingGCMSFields[j]]));
            }
            if (spectrum.data) gcms.ms[i] = spectrum.data[0];

        }
        result.gcms = gcms;
    }

    function prepareSpectrum(result, spectrum) {
        if (!spectrum.xFactor) spectrum.xFactor = 1;
        if (!spectrum.yFactor) spectrum.yFactor = 1;
        if (spectrum.observeFrequency) {
            if (spectrum.xUnit && spectrum.xUnit.toUpperCase() == 'HZ') {
                spectrum.xUnit = 'PPM';
                spectrum.xFactor = spectrum.xFactor / spectrum.observeFrequency;
                spectrum.firstX = spectrum.firstX / spectrum.observeFrequency;
                spectrum.lastX = spectrum.lastX / spectrum.observeFrequency;
                spectrum.deltaX = spectrum.deltaX / spectrum.observeFrequency;
            }
        }
        if (result.shiftOffsetVal) {
            var shift = spectrum.firstX - result.shiftOffsetVal;
            spectrum.firstX = spectrum.firstX - shift;
            spectrum.lastX = spectrum.lastX - shift;
        }
    }

    function parsePeakTable(spectrum, value, result) {
        spectrum.isPeaktable=true;
        var i, ii, j, jj, values;
        var currentData = [];
        spectrum.data = [currentData];

        // counts for around 20% of the time
        var lines = value.split(/,? *,?[;\r\n]+ */);

        var k = 0;
        for (i = 1, ii = lines.length; i < ii; i++) {
            values = lines[i].trim().replace(removeCommentRegExp, '').split(peakTableSplitRegExp);
            if (values.length % 2 == 0) {
                for (j = 0, jj = values.length; j < jj; j = j + 2) {
                    // takes around 40% of the time to add and parse the 2 values nearly exclusively because of parseFloat
                    currentData[k++] = (parseFloat(values[j]) * spectrum.xFactor);
                    currentData[k++] = (parseFloat(values[j + 1]) * spectrum.yFactor);
                }
            } else {
                result.logs.push('Format error: ' + values);
            }
        }
    }

    function parseXYData(spectrum, value, result) {
        // we check if deltaX is defined otherwise we calculate it
        if (!spectrum.deltaX) {
            spectrum.deltaX = (spectrum.lastX - spectrum.firstX) / (spectrum.nbPoints - 1);
        }

        spectrum.isXYdata=true;

        var currentData = [];
        spectrum.data = [currentData];

        var currentX = spectrum.firstX;
        var currentY = spectrum.firstY;
        var lines = value.split(/[\r\n]+/);
        var lastDif, values, ascii, expectedY;
        values = [];
        for (var i = 1, ii = lines.length; i < ii; i++) {
            //var previousValues=JSON.parse(JSON.stringify(values));
            values = lines[i].trim().replace(removeCommentRegExp, '').split(xyDataSplitRegExp);
            if (values.length > 0) {
                if (DEBUG) {
                    if (!spectrum.firstPoint) {
                        spectrum.firstPoint = parseFloat(values[0]);
                    }
                    var expectedCurrentX = parseFloat(values[0] - spectrum.firstPoint) * spectrum.xFactor + spectrum.firstX;
                    if ((lastDif || lastDif == 0)) {
                        expectedCurrentX += spectrum.deltaX;
                    }
                    result.logs.push('Checking X value: currentX: ' + currentX + ' - expectedCurrentX: ' + expectedCurrentX);
                }
                for (var j = 1, jj = values.length; j < jj; j++) {
                    if (j == 1 && (lastDif || lastDif == 0)) {
                        lastDif = null; // at the beginning of each line there should be the full value X / Y so the diff is always undefined
                        // we could check if we have the expected Y value
                        ascii = values[j].charCodeAt(0);

                        if (false) { // this code is just to check the jcamp DIFDUP and the next line repeat of Y value
                            // + - . 0 1 2 3 4 5 6 7 8 9
                            if ((ascii == 43) || (ascii == 45) || (ascii == 46) || ((ascii > 47) && (ascii < 58))) {
                                expectedY = parseFloat(values[j]);
                            } else
                            // positive SQZ digits @ A B C D E F G H I (ascii 64-73)
                            if ((ascii > 63) && (ascii < 74)) {
                                // we could use parseInt but parseFloat is faster at least in Chrome
                                expectedY = parseFloat(String.fromCharCode(ascii - 16) + values[j].substring(1));
                            } else
                            // negative SQZ digits a b c d e f g h i (ascii 97-105)
                            if ((ascii > 96) && (ascii < 106)) {
                                // we could use parseInt but parseFloat is faster at least in Chrome
                                expectedY = -parseFloat(String.fromCharCode(ascii - 48) + values[j].substring(1));
                            }
                            if (expectedY != currentY) {
                                result.logs.push('Y value check error: Found: ' + expectedY + ' - Current: ' + currentY);
                                result.logs.push('Previous values: ' + previousValues.length);
                                result.logs.push(previousValues);
                            }
                        }
                    } else {
                        if (values[j].length > 0) {
                            ascii = values[j].charCodeAt(0);
                            // + - . 0 1 2 3 4 5 6 7 8 9
                            if ((ascii == 43) || (ascii == 45) || (ascii == 46) || ((ascii > 47) && (ascii < 58))) {
                                lastDif = null;
                                currentY = parseFloat(values[j]);
                                currentData.push(currentX, currentY * spectrum.yFactor);;
                                currentX += spectrum.deltaX;
                            } else
                            // positive SQZ digits @ A B C D E F G H I (ascii 64-73)
                            if ((ascii > 63) && (ascii < 74)) {
                                lastDif = null;
                                currentY = parseFloat(String.fromCharCode(ascii - 16) + values[j].substring(1));
                                currentData.push(currentX, currentY * spectrum.yFactor);;
                                currentX += spectrum.deltaX;
                            } else
                            // negative SQZ digits a b c d e f g h i (ascii 97-105)
                            if ((ascii > 96) && (ascii < 106)) {
                                lastDif = null;
                                currentY = -parseFloat(String.fromCharCode(ascii - 48) + values[j].substring(1));
                                currentData.push(currentX, currentY * spectrum.yFactor);;
                                currentX += spectrum.deltaX;
                            } else



                            // DUP digits S T U V W X Y Z s (ascii 83-90, 115)
                            if (((ascii > 82) && (ascii < 91)) || (ascii == 115)) {
                                var dup = parseFloat(String.fromCharCode(ascii - 34) + values[j].substring(1)) - 1;
                                if (ascii == 115) {
                                    dup = parseFloat('9' + values[j].substring(1)) - 1;
                                }
                                for (var l = 0; l < dup; l++) {
                                    if (lastDif) {
                                        currentY = currentY + lastDif;
                                    }
                                    currentData.push(currentX, currentY * spectrum.yFactor);;
                                    currentX += spectrum.deltaX;
                                }
                            } else
                            // positive DIF digits % J K L M N O P Q R (ascii 37, 74-82)
                            if (ascii == 37) {
                                lastDif = parseFloat('0' + values[j].substring(1));
                                currentY += lastDif;
                                currentData.push(currentX, currentY * spectrum.yFactor);;
                                currentX += spectrum.deltaX;
                            } else if ((ascii > 73) && (ascii < 83)) {
                                lastDif = parseFloat(String.fromCharCode(ascii - 25) + values[j].substring(1));
                                currentY += lastDif;
                                currentData.push(currentX, currentY * spectrum.yFactor);;
                                currentX += spectrum.deltaX;
                            } else
                            // negative DIF digits j k l m n o p q r (ascii 106-114)
                            if ((ascii > 105) && (ascii < 115)) {
                                lastDif = -parseFloat(String.fromCharCode(ascii - 57) + values[j].substring(1));
                                currentY += lastDif;
                                currentData.push(currentX, currentY * spectrum.yFactor);;
                                currentX += spectrum.deltaX;
                            }
                        }
                    }
                }
            }
        }

    }

    function convertTo3DZ(spectra) {
        var noise = 0;
        var minZ = spectra[0].data[0][0];
        var maxZ = minZ;
        var ySize = spectra.length;
        var xSize = spectra[0].data[0].length / 2;
        var z = new Array(ySize);
        for (var i = 0; i < ySize; i++) {
            z[i] = new Array(xSize);
            for (var j = 0; j < xSize; j++) {
                z[i][j] = spectra[i].data[0][j * 2 + 1];
                if (z[i][j] < minZ) minZ = spectra[i].data[0][j * 2 + 1];
                if (z[i][j] > maxZ) maxZ = spectra[i].data[0][j * 2 + 1];
                if (i != 0 && j != 0) {
                    noise += Math.abs(z[i][j] - z[i][j - 1]) + Math.abs(z[i][j] - z[i - 1][j]);
                }
            }
        }
        return {
            z: z,
            minX: spectra[0].data[0][0],
            maxX: spectra[0].data[0][spectra[0].data[0].length - 2],
            minY: spectra[0].pageValue,
            maxY: spectra[ySize - 1].pageValue,
            minZ: minZ,
            maxZ: maxZ,
            noise: noise / ((ySize - 1) * (xSize - 1) * 2)
        };

    }

    function add2D(result) {
        var zData = convertTo3DZ(result.spectra);
        result.contourLines = generateContourLines(zData);
        delete zData.z;
        result.minMax = zData;
    }


    function generateContourLines(zData, options) {
        //console.time('generateContourLines');
        var noise = zData.noise;
        var z = zData.z;
        var contourLevels = [];
        var nbLevels = 7;
        var povarHeight = new Float32Array(4);
        var isOver = [];
        var nbSubSpectra = z.length;
        var nbPovars = z[0].length;
        var pAx, pAy, pBx, pBy;

        var x0 = zData.minX;
        var xN = zData.maxX;
        var dx = (xN - x0) / (nbPovars - 1);
        var y0 = zData.minY;
        var yN = zData.maxY;
        var dy = (yN - y0) / (nbSubSpectra - 1);
        var minZ = zData.minZ;
        var maxZ = zData.maxZ;

        //System.out.prvarln('y0 '+y0+' yN '+yN);
        // -------------------------
        // Povars attribution
        //
        // 0----1
        // |  / |
        // | /  |
        // 2----3
        //
        // ---------------------d------

        var lineZValue;
        for (var level = 0; level < nbLevels * 2; level++) { // multiply by 2 for positif and negatif
            var contourLevel = {};
            contourLevels.push(contourLevel);
            var side = level % 2;
            if (side == 0) {
                lineZValue = (maxZ - 5 * noise) * Math.exp(level / 2 - nbLevels) + 5 * noise;
            } else {
                lineZValue = -(maxZ - 5 * noise) * Math.exp(level / 2 - nbLevels) - 5 * noise;
            }
            var lines = [];
            contourLevel.zValue = lineZValue;
            contourLevel.lines = lines;

            if (lineZValue <= minZ || lineZValue >= maxZ) continue;

            for (var iSubSpectra = 0; iSubSpectra < nbSubSpectra - 1; iSubSpectra++) {
                for (var povar = 0; povar < nbPovars - 1; povar++) {
                    povarHeight[0] = z[iSubSpectra][povar];
                    povarHeight[1] = z[iSubSpectra][povar + 1];
                    povarHeight[2] = z[(iSubSpectra + 1)][povar];
                    povarHeight[3] = z[(iSubSpectra + 1)][(povar + 1)];

                    for (var i = 0; i < 4; i++) {
                        isOver[i] = (povarHeight[i] > lineZValue);
                    }

                    // Example povar0 is over the plane and povar1 and
                    // povar2 are below, we find the varersections and add
                    // the segment
                    if (isOver[0] != isOver[1] && isOver[0] != isOver[2]) {
                        pAx = povar + (lineZValue - povarHeight[0]) / (povarHeight[1] - povarHeight[0]);
                        pAy = iSubSpectra;
                        pBx = povar;
                        pBy = iSubSpectra + (lineZValue - povarHeight[0]) / (povarHeight[2] - povarHeight[0]);
                        lines.push(pAx * dx + x0, pAy * dy + y0, pBx * dx + x0, pBy * dy + y0);
                    }
                    if (isOver[3] != isOver[1] && isOver[3] != isOver[2]) {
                        pAx = povar + 1;
                        pAy = iSubSpectra + 1 - (lineZValue - povarHeight[3]) / (povarHeight[1] - povarHeight[3]);
                        pBx = povar + 1 - (lineZValue - povarHeight[3]) / (povarHeight[2] - povarHeight[3]);
                        pBy = iSubSpectra + 1;
                        lines.push(pAx * dx + x0, pAy * dy + y0, pBx * dx + x0, pBy * dy + y0);
                    }
                    // test around the diagonal
                    if (isOver[1] != isOver[2]) {
                        pAx = povar + 1 - (lineZValue - povarHeight[1]) / (povarHeight[2] - povarHeight[1]);
                        pAy = iSubSpectra + (lineZValue - povarHeight[1]) / (povarHeight[2] - povarHeight[1]);
                        if (isOver[1] != isOver[0]) {
                            pBx = povar + 1 - (lineZValue - povarHeight[1]) / (povarHeight[0] - povarHeight[1]);
                            pBy = iSubSpectra;
                            lines.push(pAx * dx + x0, pAy * dy + y0, pBx * dx + x0, pBy * dy + y0);
                        }
                        if (isOver[2] != isOver[0]) {
                            pBx = povar;
                            pBy = iSubSpectra + 1 - (lineZValue - povarHeight[2]) / (povarHeight[0] - povarHeight[2]);
                            lines.push(pAx * dx + x0, pAy * dy + y0, pBx * dx + x0, pBy * dy + y0);
                        }
                        if (isOver[1] != isOver[3]) {
                            pBx = povar + 1;
                            pBy = iSubSpectra + (lineZValue - povarHeight[1]) / (povarHeight[3] - povarHeight[1]);
                            lines.push(pAx * dx + x0, pAy * dy + y0, pBx * dx + x0, pBy * dy + y0);
                        }
                        if (isOver[2] != isOver[3]) {
                            pBx = povar + (lineZValue - povarHeight[2]) / (povarHeight[3] - povarHeight[2]);
                            pBy = iSubSpectra + 1;
                            lines.push(pAx * dx + x0, pAy * dy + y0, pBx * dx + x0, pBy * dy + y0);
                        }
                    }
                }
            }
        }
        // console.timeEnd('generateContourLines');
        return {
            minX: zData.minX,
            maxX: zData.maxX,
            minY: zData.minY,
            maxY: zData.maxY,
            segments: contourLevels
        };
        //return contourLevels;
    }


    function addLowRes(spectra, options) {
        var spectrum;
        var averageX, averageY;
        var targetNbPoints = options.lowRes;
        var highResData;
        for (var i = 0; i < spectra.length; i++) {
            spectrum = spectra[i];
            // we need to find the current higher resolution
            if (spectrum.data.length > 0) {
                highResData = spectrum.data[0];
                for (var j = 1; j < spectrum.data.length; j++) {
                    if (spectrum.data[j].length > highResData.length) {
                        highResData = spectrum.data[j];
                    }
                }

                if (targetNbPoints > (highResData.length / 2)) return;
                var i, ii;
                var lowResData = [];
                var modulo = Math.ceil(highResData.length / (targetNbPoints * 2));
                for (i = 0, ii = highResData.length; i < ii; i = i + 2) {
                    if (i % modulo == 0) {
                        lowResData.push(highResData[i], highResData[i + 1])
                    }
                }
                spectrum.data.push(lowResData);
            }
        }
    }

    return convert;

}

var convert = getConverter();

function JcampConverter(input, options, useWorker) {
    if (typeof options === 'boolean') {
        useWorker = options;
        options = {};
    }
    if (useWorker) {
        return postToWorker(input, options);
    } else {
        return convert(input, options);
    }
}

var stamps = {},
    worker;

function postToWorker(input, options) {
    if (!worker) {
        createWorker();
    }
    return new Promise(function (resolve) {
        var stamp = Date.now() + '' + Math.random();
        stamps[stamp] = resolve;
        worker.postMessage({stamp: stamp, input: input, options: options});
    });
}

function createWorker() {
    var workerURL = URL.createObjectURL(new Blob([
        'var getConverter =' + getConverter.toString() + ';var convert = getConverter(); onmessage = function (event) { postMessage({stamp: event.data.stamp, output: convert(event.data.input, event.data.options)}); };'
    ], {type: 'application/javascript'}));
    worker = new Worker(workerURL);
    URL.revokeObjectURL(workerURL);
    worker.addEventListener('message', function (event) {
        var stamp = event.data.stamp;
        if (stamps[stamp]) {
            stamps[stamp](event.data.output);
        }
    });
}

module.exports = {
    convert: JcampConverter
};
},{}],3:[function(require,module,exports){
'use strict';
// https://github.com/accord-net/framework/blob/development/Sources/Accord.Statistics/Tools.cs

function max(values) {
    var max = -Infinity, l = values.length;
    for (var i = 0; i < l; i++) {
        if (values[i] > max) max = values[i];
    }
    return max;
}

function min(values) {
    var min = Infinity, l = values.length;
    for (var i = 0; i < l; i++) {
        if (values[i] < min) min = values[i];
    }
    return min;
}

function minMax(values) {
    var min = Infinity,
        max = -Infinity,
        l = values.length;
    for (var i = 0; i < l; i++) {
        if (values[i] < min) min = values[i];
        if (values[i] > max) max = values[i];
    }
    return {
        min: min,
        max: max
    };
}

function mean(values) {
    var sum = 0, l = values.length;
    for (var i = 0; i < l; i++)
        sum += values[i];
    return sum / l;
}

function geometricMean(values) {
    var sum = 0, l = values.length;
    for (var i = 0; i < l; i++)
        sum *= values[i];
    return Math.pow(sum, 1 / l);
}

function logGeometricMean(values) {
    var lnsum = 0, l = values.length;
    for (var i = 0; i < l; i++)
        lnsum += Math.log(values[i]);
    return lnsum / l;
}

function grandMean(means, samples) {
    var sum = 0, n = 0, l = means.length;
    for (var i = 0; i < l; i++) {
        sum += samples[i] * means[i];
        n += samples[i];
    }
    return sum / n;
}

function truncatedMean(values, percent, inPlace) {
    if (typeof(inPlace) === 'undefined') inPlace = false;

    values = inPlace ? values : values.slice();
    values.sort();

    var l = values.length;
    var k = Math.floor(l * percent);

    var sum = 0;
    for (var i = k; i < l - k; i++)
        sum += values[i];

    return sum / (l - 2 * k);
}

function contraHarmonicMean(values, order) {
    if (typeof(order) === 'undefined') order = 1;
    var r1 = 0, r2 = 0, l = values.length;
    for (var i = 0; i < l; i++) {
        r1 += Math.pow(values[i], order + 1);
        r2 += Math.pow(values[i], order);
    }
    return r1 / r2;
}

function standardDeviation(values, unbiased) {
    return Math.sqrt(variance(values, unbiased));
}

function standardError(values) {
    return standardDeviation(values) / Math.sqrt(values.length);
}

function median(values, alreadySorted) {
    if (typeof(alreadySorted) === 'undefined') alreadySorted = false;
    if (!alreadySorted) {
        values = values.slice();
        values.sort();
    }

    var l = values.length;
    var half = Math.floor(l / 2);
    if (l % 2 === 0)
        return (values[half - 1] + values[half]) * 0.5;
    return values[half];
}

function quartiles(values, alreadySorted) {
    if (typeof(alreadySorted) === 'undefined') alreadySorted = false;
    if (!alreadySorted) {
        values = values.slice();
        values.sort();
    }

    var quart = values.length / 4;
    var q1 = values[Math.ceil(quart) - 1];
    var q2 = median(values, true);
    var q3 = values[Math.ceil(quart * 3) - 1];

    return {q1: q1, q2: q2, q3: q3};
}

function variance(values, unbiased) {
    if (typeof(unbiased) === 'undefined') unbiased = true;
    var theMean = mean(values);
    var theVariance = 0, l = values.length;

    for (var i = 0; i < l; i++) {
        var x = values[i] - theMean;
        theVariance += x * x;
    }

    if (unbiased)
        return theVariance / (l - 1);
    else
        return theVariance / l;
}

function pooledStandardDeviation(samples, unbiased) {
    return Math.sqrt(pooledVariance(samples, unbiased));
}

function pooledVariance(samples, unbiased) {
    if (typeof(unbiased) === 'undefined') unbiased = true;
    var sum = 0;
    var length = 0, l = samples.length;
    for (var i = 0; i < l; i++) {
        var values = samples[i];
        var vari = variance(values);

        sum += (values.length - 1) * vari;

        if (unbiased)
            length += values.length - 1;
        else
            length += values.length;
    }
    return sum / length;
}

function mode(values) {
    var l = values.length,
        itemCount = new Array(l),
        i;
    for (i = 0; i < l; i++) {
        itemCount[i] = 0;
    }
    var itemArray = new Array(l);
    var count = 0;

    for (i = 0; i < l; i++) {
        var index = itemArray.indexOf(values[i]);
        if (index >= 0)
            itemCount[index]++;
        else {
            itemArray[count] = values[i];
            itemCount[count] = 1;
            count++;
        }
    }

    var maxValue = 0, maxIndex = 0;
    for (i = 0; i < count; i++) {
        if (itemCount[i] > maxValue) {
            maxValue = itemCount[i];
            maxIndex = i;
        }
    }

    return itemArray[maxIndex];
}

function covariance(vector1, vector2, unbiased) {
    if (typeof(unbiased) === 'undefined') unbiased = true;
    var mean1 = mean(vector1);
    var mean2 = mean(vector2);

    if (vector1.length !== vector2.length)
        throw "Vectors do not have the same dimensions";

    var cov = 0, l = vector1.length;
    for (var i = 0; i < l; i++) {
        var x = vector1[i] - mean1;
        var y = vector2[i] - mean2;
        cov += x * y;
    }

    if (unbiased)
        return cov / (l - 1);
    else
        return cov / l;
}

function skewness(values, unbiased) {
    if (typeof(unbiased) === 'undefined') unbiased = true;
    var theMean = mean(values);

    var s2 = 0, s3 = 0, l = values.length;
    for (var i = 0; i < l; i++) {
        var dev = values[i] - theMean;
        s2 += dev * dev;
        s3 += dev * dev * dev;
    }
    var m2 = s2 / l;
    var m3 = s3 / l;

    var g = m3 / (Math.pow(m2, 3 / 2.0));
    if (unbiased) {
        var a = Math.sqrt(l * (l - 1));
        var b = l - 2;
        return (a / b) * g;
    }
    else {
        return g;
    }
}

function kurtosis(values, unbiased) {
    if (typeof(unbiased) === 'undefined') unbiased = true;
    var theMean = mean(values);
    var n = values.length, s2 = 0, s4 = 0;

    for (var i = 0; i < n; i++) {
        var dev = values[i] - theMean;
        s2 += dev * dev;
        s4 += dev * dev * dev * dev;
    }
    var m2 = s2 / n;
    var m4 = s4 / n;

    if (unbiased) {
        var v = s2 / (n - 1);
        var a = (n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3));
        var b = s4 / (v * v);
        var c = ((n - 1) * (n - 1)) / ((n - 2) * (n - 3));

        return a * b - 3 * c;
    }
    else {
        return m4 / (m2 * m2) - 3;
    }
}

function entropy(values, eps) {
    if (typeof(eps) === 'undefined') eps = 0;
    var sum = 0, l = values.length;
    for (var i = 0; i < l; i++)
        sum += values[i] * Math.log(values[i] + eps);
    return -sum;
}

function weightedMean(values, weights) {
    var sum = 0, l = values.length;
    for (var i = 0; i < l; i++)
        sum += values[i] * weights[i];
    return sum;
}

function weightedStandardDeviation(values, weights) {
    return Math.sqrt(weightedVariance(values, weights));
}

function weightedVariance(values, weights) {
    var theMean = weightedMean(values, weights);
    var vari = 0, l = values.length;
    var a = 0, b = 0;

    for (var i = 0; i < l; i++) {
        var z = values[i] - theMean;
        var w = weights[i];

        vari += w * (z * z);
        b += w;
        a += w * w;
    }

    return vari * (b / (b * b - a));
}

function center(values, inPlace) {
    if (typeof(inPlace) === 'undefined') inPlace = false;

    var result = values;
    if (!inPlace)
        result = values.slice();

    var theMean = mean(result), l = result.length;
    for (var i = 0; i < l; i++)
        result[i] -= theMean;
}

function standardize(values, standardDev, inPlace) {
    if (typeof(standardDev) === 'undefined') standardDev = standardDeviation(values);
    if (typeof(inPlace) === 'undefined') inPlace = false;
    var l = values.length;
    var result = inPlace ? values : new Array(l);
    for (var i = 0; i < l; i++)
        result[i] = values[i] / standardDev;
    return result;
}

function cumulativeSum(array) {
    var l = array.length;
    var result = new Array(l);
    result[0] = array[0];
    for (var i = 1; i < l; i++)
        result[i] = result[i - 1] + array[i];
    return result;
}

module.exports = {
    min: min,
    max: max,
    minMax: minMax,
    mean: mean,
    geometricMean: geometricMean,
    logGeometricMean: logGeometricMean,
    grandMean: grandMean,
    truncatedMean: truncatedMean,
    contraHarmonicMean: contraHarmonicMean,
    standardDeviation: standardDeviation,
    standardError: standardError,
    median: median,
    quartiles: quartiles,
    variance: variance,
    pooledStandardDeviation: pooledStandardDeviation,
    pooledVariance: pooledVariance,
    mode: mode,
    covariance: covariance,
    skewness: skewness,
    kurtosis: kurtosis,
    entropy: entropy,
    weightedMean: weightedMean,
    weightedStandardDeviation: weightedStandardDeviation,
    weightedVariance: weightedVariance,
    center: center,
    standardize: standardize,
    cumulativeSum: cumulativeSum
};

},{}],4:[function(require,module,exports){
/**
 * This library formats a set of nmr1D signals to the ACS format.
 * Created by acastillo on 3/11/15. p
 */
var ACS=ACS || {};
ACS.formater =(function() {
    var acsString="";
    var parenthesis="";
    var spectro="";
    rangeForMultiplet=true;

    function fromNMRSignal1D2ACS(spectrum, options){
        acsString="";
        parenthesis="";
        spectro="";
        var solvent = null;
        if(options&&options.solvent)
            solvent = options.solvent;
        //options.rangeForMultiplet=false;
        if(options&&options.rangeForMultiplet!=undefined)
            rangeForMultiplet = options.rangeForMultiplet;

        //console.log("Range1: "+options.rangeForMultiplet);

        spectrum.type="NMR SPEC";
        if (spectrum[0]["nucleus"]=="1H") {
            formatAcs_default(spectrum, false, 2, 1, solvent);
        } else if (spectrum[0]["nucleus"]=="13C") {
            formatAcs_default(spectrum, false, 1, 0, solvent);
        }

        if (acsString.length>0) acsString+=".";

        return acsString;
    }

    /*function formatAcs_default_IR(spectra, ascending, decimalValue, smw) {
     appendSeparator();
     appendSpectroInformation(spectra);
     if (spectra["peakLabels"]) {
     var numberPeakLabels=spectra["peakLabels"].length;
     var minIntensity= 9999999;
     var maxIntensity=-9999999;
     for (var i=0; i<numberPeakLabels; i++) {
     if (spectra["peakLabels"][i].intensity<minIntensity) minIntensity=spectra["peakLabels"][i].intensity;
     if (spectra["peakLabels"][i].intensity>maxIntensity) maxIntensity=spectra["peakLabels"][i].intensity;
     }
     for (var i=0; i<numberPeakLabels; i++) {
     if (ascending) {
     var peakLabel=spectra["peakLabels"][i];
     } else {
     var peakLabel=spectra["peakLabels"][numberPeakLabels-i-1];
     }
     if (peakLabel) {
     appendSeparator();
     appendValue(peakLabel,decimalValue);
     if (smw) { // we need to add small / medium / strong
     if (peakLabel.intensity<((maxIntensity-minIntensity)/3+minIntensity)) acsString+=" (s)";
     else if (peakLabel.intensity>(maxIntensity-(maxIntensity-minIntensity)/3)) acsString+=" (w)";
     else acsString+=" (m)";
     }
     }
     }
     }
     }*/

    function formatAcs_default(spectra, ascending, decimalValue, decimalJ, solvent) {
        appendSeparator();
        appendSpectroInformation(spectra, solvent);
        var numberSmartPeakLabels=spectra.length;
        //console.log("SP "+spectra);
        //console.log("# "+numberSmartPeakLabels);
        for (var i=0; i<numberSmartPeakLabels; i++) {
            if (ascending) {
                var signal=spectra[i];
            } else {
                var signal=spectra[numberSmartPeakLabels-i-1];
            }
            if (signal) {
                //console.log("X2X"+i+JSON.stringify(signal));
                appendSeparator();
                appendDelta(signal,decimalValue);
                appendParenthesis(signal,decimalJ);
                //console.log("S2S"+i);
            }
        }
    }

    function appendSpectroInformation(spectrum, solvent) {
        if (spectrum.type=="NMR SPEC") {
            if (spectrum[0].nucleus) {
                acsString+=formatNucleus(spectrum[0].nucleus);
            }
            acsString+=" NMR";
            if ((solvent) || (spectrum[0].observe)) {
                acsString+=" (";
                if (spectrum.observe) {
                    acsString+=(spectrum[0].observe*1).toFixed(0)+" MHz";
                    if (solvent) acsString+=", ";
                }
                if (solvent) {
                    acsString+=formatMF(solvent);
                }
                acsString+=")";
            }
            acsString+=" δ ";
        } else if (spectrum.type=="IR") {
            acsString+=" IR ";
        } else if (spectrum.type=="MASS") {
            acsString+=" MASS ";
        }
    }

    function appendDelta(line, nbDecimal) {
        //console.log("appendDelta1");
        var startX = 0,stopX=0,delta1=0;
        if(line.startX){
            if((typeof line.startX)=="string"){
                startX=parseFloat(line.startX);
            }
            else
                startX=line.startX;
        }
        if(line.stopX){
            if((typeof line.stopX)=="string"){
                stopX=parseFloat(line.stopX);
            }
            else
                stopX=line.stopX;
        }
        if(line.delta1){
            if((typeof line.delta1)=="string"){
                delta1=parseFloat(line.delta1);
            }
            else
                delta1=line.delta1;

        }
        //console.log("Range2: "+rangeForMultiplet);
        if (line.pattern=="massive"||(line.pattern=="m"&&rangeForMultiplet==true)) {//Is it massive??
            if (line.startX&&line.stopX) {
                if (startX<stopX) {
                    acsString+=startX.toFixed(nbDecimal)+"-"+stopX.toFixed(nbDecimal);
                } else {
                    acsString+=stopX.toFixed(nbDecimal)+"-"+startX.toFixed(nbDecimal);
                }
            } else {
                if(line.delta1)
                    acsString+=delta1.toFixed(nbDecimal);
            }
        }
        else{
            if(line.delta1)
                acsString+=delta1.toFixed(nbDecimal);
            else{
                if(line.startX&&line.stopX){
                    acsString+=((startX+stopX)/2).toFixed(nbDecimal);
                }
            }
        }
    }

    function appendValue(line, nbDecimal) {
        if (line.xPosition) {
            acsString+=line.xPosition.toFixed(nbDecimal);
        }
    }

    function appendParenthesis(line, nbDecimal) {
        //console.log("appendParenthesis1");
        // need to add assignment - coupling - integration
        parenthesis="";
        appendMultiplicity(line);
        appendIntegration(line);
        appendCoupling(line,nbDecimal);
        appendAssignment(line);


        if (parenthesis.length>0) {
            acsString+=" ("+parenthesis+")";
        }
        //console.log("appendParenthesis2");
    }

    function appendIntegration(line) {
        if (line.pubIntegration) {
            appendParenthesisSeparator();
            parenthesis+=line.pubIntegration;
        } else if (line.integralData) {
            appendParenthesisSeparator();
            parenthesis+=line.integralData.value.toFixed(0)+" H";
        }
    }

    function appendAssignment(line) {
        if (line.pubAssignment) {
            appendParenthesisSeparator();
            parenthesis+=formatAssignment(line.pubAssignment);
        }
        else{
            if (line.assignment) {
                appendParenthesisSeparator();
                parenthesis+=formatAssignment(line.assignment);
            }
        }
    }

    function appendMultiplicity(line) {
        if (line.pubMultiplicity) {
            appendParenthesisSeparator();
            parenthesis+=line.pubMultiplicity;
        } else if (line.multiplicity) {
            appendParenthesisSeparator();
            parenthesis+=line.multiplicity;
        }
    }

    function appendCoupling(line, nbDecimal) {
        if (line.nmrJs) {
            var j="<i>J</i> = ";
            for (var i=0; i<line.nmrJs.length; i++) {
                var coupling=line.nmrJs[i].coupling;
                if (j.length>11) j+=", ";
                j+=coupling.toFixed(nbDecimal);
            }
            appendParenthesisSeparator();
            parenthesis+=j+" Hz";
        }

    }

    function formatAssignment(assignment) {
        assignment=assignment.replace(/([0-9])/g,"<sub>$1</sub>");
        assignment=assignment.replace(/\"([^\"]*)\"/g,"<i>$1</i>");
        return assignment;
    }

    function formatMF(mf) {
        mf=mf.replace(/([0-9])/g,"<sub>$1</sub>");
        return mf;
    }

    function formatNucleus(nucleus) {
        nucleus=nucleus.replace(/([0-9])/g,"<sup>$1</sup>");
        return nucleus;
    }

    function appendSeparator() {
        if ((acsString.length>0) && (! acsString.match(/ $/))) {
            acsString+=", ";
        }
    }

    function appendParenthesisSeparator() {
        if ((parenthesis.length>0) && (! parenthesis.match(", $"))) parenthesis+=", ";
    }

    function fromACS2NMRSignal1D(acsString){
        return JSON.parse(SDAPI.AcsParserAsJSONString(acsString));
    }

    return {
        toACS:fromNMRSignal1D2ACS,
        toNMRSignal:fromACS2NMRSignal1D
    }
})();

module.exports=ACS;
},{}],5:[function(require,module,exports){
var FFT = require('./fftlib');

var FFTUtils= {
    DEBUG : false,

    /**
     * Calculates the inverse of a 2D Fourier transform
     *
     * @param ft
     * @param ftRows
     * @param ftCols
     * @return
     */
    ifft2DArray : function(ft, ftRows, ftCols){
        var tempTransform = new Array(ftRows * ftCols);
        var nRows = ftRows / 2;
        var nCols = (ftCols - 1) * 2;
        // reverse transform columns
        FFT.init(nRows);
        var tmpCols = {re: new Array(nRows), im: new Array(nRows)};
        for (var iCol = 0; iCol < ftCols; iCol++) {
            for (var iRow = nRows - 1; iRow >= 0; iRow--) {
                tmpCols.re[iRow] = ft[(iRow * 2) * ftCols + iCol];
                tmpCols.im[iRow] = ft[(iRow * 2 + 1) * ftCols + iCol];
            }
            //Unnormalized inverse transform
            FFT.bt(tmpCols.re, tmpCols.im);
            for (var iRow = nRows - 1; iRow >= 0; iRow--) {
                tempTransform[(iRow * 2) * ftCols + iCol] = tmpCols.re[iRow];
                tempTransform[(iRow * 2 + 1) * ftCols + iCol] = tmpCols.im[iRow];
            }
        }

        // reverse row transform
        var finalTransform = new Array(nRows * nCols);
        FFT.init(nCols);
        var tmpRows = {re: new Array(nCols), im: new Array(nCols)};
        var scale = nCols * nRows;
        for (var iRow = 0; iRow < ftRows; iRow += 2) {
            tmpRows.re[0] = tempTransform[iRow * ftCols];
            tmpRows.im[0] = tempTransform[(iRow + 1) * ftCols];
            for (var iCol = 1; iCol < ftCols; iCol++) {
                tmpRows.re[iCol] = tempTransform[iRow * ftCols + iCol];
                tmpRows.im[iCol] = tempTransform[(iRow + 1) * ftCols + iCol];
                tmpRows.re[nCols - iCol] = tempTransform[iRow * ftCols + iCol];
                tmpRows.im[nCols - iCol] = -tempTransform[(iRow + 1) * ftCols + iCol];
            }
            //Unnormalized inverse transform
            FFT.bt(tmpRows.re, tmpRows.im);

            var indexB = (iRow / 2) * nCols;
            for (var iCol = nCols - 1; iCol >= 0; iCol--) {
                finalTransform[indexB + iCol] = tmpRows.re[iCol] / scale;
            }
        }
        return finalTransform;
    },
    /**
     * Calculates the fourier transform of a matrix of size (nRows,nCols) It is
     * assumed that both nRows and nCols are a power of two
     *
     * On exit the matrix has dimensions (nRows * 2, nCols / 2 + 1) where the
     * even rows contain the real part and the odd rows the imaginary part of the
     * transform
     * @param data
     * @param nRows
     * @param nCols
     * @return
     */
    fft2DArray:function(data, nRows, nCols) {
        var ftCols = (nCols / 2 + 1);
        var ftRows = nRows * 2;
        var tempTransform = new Array(ftRows * ftCols);
        FFT.init(nCols);
        // transform rows
        var tmpRows = {re: new Array(nCols), im: new Array(nCols)};
        var row1 = {re: new Array(nCols), im: new Array(nCols)}
        var row2 = {re: new Array(nCols), im: new Array(nCols)}
        var index, iRow0, iRow1, iRow2, iRow3;
        for (var iRow = 0; iRow < nRows / 2; iRow++) {
            index = (iRow * 2) * nCols;
            tmpRows.re = data.slice(index, index + nCols);

            index = (iRow * 2 + 1) * nCols;
            tmpRows.im = data.slice(index, index + nCols);

            FFT.fft1d(tmpRows.re, tmpRows.im);

            this.reconstructTwoRealFFT(tmpRows, row1, row2);
            //Now lets put back the result into the output array
            iRow0 = (iRow * 4) * ftCols;
            iRow1 = (iRow * 4 + 1) * ftCols;
            iRow2 = (iRow * 4 + 2) * ftCols;
            iRow3 = (iRow * 4 + 3) * ftCols;
            for (var k = ftCols - 1; k >= 0; k--) {
                tempTransform[iRow0 + k] = row1.re[k];
                tempTransform[iRow1 + k] = row1.im[k];
                tempTransform[iRow2 + k] = row2.re[k];
                tempTransform[iRow3 + k] = row2.im[k];
            }
        }

        //console.log(tempTransform);
        row1 = null;
        row2 = null;
        // transform columns
        var finalTransform = new Array(ftRows * ftCols);
        FFT.init(nRows);
        var tmpCols = {re: new Array(nRows), im: new Array(nRows)};
        for (var iCol = ftCols - 1; iCol >= 0; iCol--) {
            for (var iRow = nRows - 1; iRow >= 0; iRow--) {
                tmpCols.re[iRow] = tempTransform[(iRow * 2) * ftCols + iCol];
                tmpCols.im[iRow] = tempTransform[(iRow * 2 + 1) * ftCols + iCol];
            }
            FFT.fft1d(tmpCols.re, tmpCols.im);
            for (var iRow = nRows - 1; iRow >= 0; iRow--) {
                finalTransform[(iRow * 2) * ftCols + iCol] = tmpCols.re[iRow];
                finalTransform[(iRow * 2 + 1) * ftCols + iCol] = tmpCols.im[iRow];
            }
        }

        //console.log(finalTransform);
        return finalTransform;

    },
    /**
     *
     * @param fourierTransform
     * @param realTransform1
     * @param realTransform2
     *
     * Reconstructs the individual Fourier transforms of two simultaneously
     * transformed series. Based on the Symmetry relationships (the asterisk
     * denotes the complex conjugate)
     *
     * F_{N-n} = F_n^{*} for a purely real f transformed to F
     *
     * G_{N-n} = G_n^{*} for a purely imaginary g transformed to G
     *
     */
    reconstructTwoRealFFT:function(fourierTransform, realTransform1, realTransform2) {
        var length = fourierTransform.re.length;

        // the components n=0 are trivial
        realTransform1.re[0] = fourierTransform.re[0];
        realTransform1.im[0] = 0.0;
        realTransform2.re[0] = fourierTransform.im[0];
        realTransform2.im[0] = 0.0;
        var rm, rp, im, ip, j;
        for (var i = length / 2; i > 0; i--) {
            j = length - i;
            rm = 0.5 * (fourierTransform.re[i] - fourierTransform.re[j]);
            rp = 0.5 * (fourierTransform.re[i] + fourierTransform.re[j]);
            im = 0.5 * (fourierTransform.im[i] - fourierTransform.im[j]);
            ip = 0.5 * (fourierTransform.im[i] + fourierTransform.im[j]);
            realTransform1.re[i] = rp;
            realTransform1.im[i] = im;
            realTransform1.re[j] = rp;
            realTransform1.im[j] = -im;
            realTransform2.re[i] = ip;
            realTransform2.im[i] = -rm;
            realTransform2.re[j] = ip;
            realTransform2.im[j] = rm;
        }
    },

    /**
     * In place version of convolute 2D
     *
     * @param ftSignal
     * @param ftFilter
     * @param ftRows
     * @param ftCols
     * @return
     */
    convolute2DI:function(ftSignal, ftFilter, ftRows, ftCols) {
        var re, im;
        for (var iRow = 0; iRow < ftRows / 2; iRow++) {
            for (var iCol = 0; iCol < ftCols; iCol++) {
                //
                re = ftSignal[(iRow * 2) * ftCols + iCol]
                * ftFilter[(iRow * 2) * ftCols + iCol]
                - ftSignal[(iRow * 2 + 1) * ftCols + iCol]
                * ftFilter[(iRow * 2 + 1) * ftCols + iCol];
                im = ftSignal[(iRow * 2) * ftCols + iCol]
                * ftFilter[(iRow * 2 + 1) * ftCols + iCol]
                + ftSignal[(iRow * 2 + 1) * ftCols + iCol]
                * ftFilter[(iRow * 2) * ftCols + iCol];
                //
                ftSignal[(iRow * 2) * ftCols + iCol] = re;
                ftSignal[(iRow * 2 + 1) * ftCols + iCol] = im;
            }
        }
    }
}

module.exports = FFTUtils;

},{"./fftlib":13}],6:[function(require,module,exports){
var SD = require('./SD');
var PeakPicking = require('./PeakPicking');
var JcampConverter=require("jcampconverter");

function NMR(sd) {
    SD.call(this, sd); // Héritage
}

NMR.prototype = Object.create(SD.prototype);
NMR.prototype.constructor = NMR;

NMR.fromJcamp = function(jcamp) {
    var spectrum= JcampConverter.convert(jcamp,{xy:true,keepSpectra:true,keepRecordsRegExp:/^.+$/});
    return new NMR(spectrum);
}

/**
* Return the observed nucleus 
*/
NMR.prototype.getNucleus=function(){
    return this.sd.xType;
}

/**
* Returns the solvent name
*/
NMR.prototype.getSolventName=function(){
    return (this.sd.info[".SOLVENTNAME"]||this.sd.info["$SOLVENT"]).replace("<","").replace(">","");
}

//Returns the observe frequency in the direct dimension
NMR.prototype.observeFrequencyX=function(){
    return this.sd.spectra[0].observeFrequency;
}

/**
* Returns the noise factor depending on the nucleus.
*/
NMR.prototype.getNMRPeakThreshold=function(nucleus) {
    if (nucleus == "1H")
        return 3.0;
    if (nucleus =="13C")
        return 5.0;
    return 1.0;
}


    
/**
 * @function addNoise(SNR)
 * This function adds white noise to the the given spectraData. The intensity of the noise is 
 * calculated from the given signal to noise ratio.
 * @param SNR Signal to noise ratio
 */
 NMR.prototype.addNoise=function(SNR) {
     //@TODO Implement addNoise filter
}


/**
 * @function addSpectraDatas(spec2,factor1,factor2,autoscale )   
 *  This filter performs a linear combination of two spectraDatas.
 * A=spec1
 * B=spec2
 * After to apply this filter you will get:
 *      A=A*factor1+B*factor2
 * if autoscale is set to 'true' then you will obtain:
 *  A=A*factor1+B*k*factor2
 * Where the k is a factor such that the maximum peak in A is equal to the maximum peak in spectraData2 
 * @param spec2 spectraData2
 * @param factor1 linear factor for spec1
 * @param factor2 linear factor for spec2
 * @param autoscale Auto-adjust scales before combine the spectraDatas
 * @example spec1 = addSpectraDatas(spec1,spec2,1,-1, false) This subtract spec2 from spec1
*/
NMR.prototype.addSpectraDatas=function(spec2,factor1,factor2,autoscale ) {
    //@TODO Implement addSpectraDatas filter
}

/**
 * @function autoBaseline()
 * Automatically corrects the base line of a given spectraData. After this process the spectraData
 * should have meaningful integrals.
 */
NMR.prototype.autoBaseline=function( ) {
    //@TODO Implement autoBaseline filter
}

/**
 * @function fourierTransform()
 * Fourier transforms the given spectraData (Note. no 2D handling yet) this spectraData have to be of type NMR_FID or 2DNMR_FID
 */
NMR.prototype.fourierTransform=function( ) {
    //@TODO Implement fourierTransform filter
}

/**
 * @function postFourierTransform(ph1corr)
 * This filter makes an phase 1 correction that corrects the problem of the spectra that has been obtained 
 * on spectrometers using the Bruker digital filters. This method is used in cases when the BrukerSpectra 
 * filter could not find the correct number of points to perform a circular shift.
 * The actual problem is that not all of the spectra has the necessary parameters for use only one method for 
 * correcting the problem of the Bruker digital filters.
 * @param spectraData A fourier transformed spectraData.
 * @param ph1corr Phase 1 correction value in radians.
 */
NMR.prototype.postFourierTransform=function(ph1corr) {
    //@TODO Implement postFourierTransform filter
}

/**
 * @function zeroFilling(nPointsX [,nPointsY])
 * This function increase the size of the spectrum, filling the new positions with zero values. Doing it one 
 * could increase artificially the spectral resolution.
 * @param nPointsX Number of new zero points in the direct dimension
 * @param nPointsY Number of new zero points in the indirect dimension
 */
NMR.prototype.zeroFilling=function(nPointsX, nPointsY) {
    //@TODO Implement zeroFilling filter
}

/**
 * @function  haarWhittakerBaselineCorrection(waveletScale,whittakerLambda)
 * Applies a baseline correction as described in J Magn Resonance 183 (2006) 145-151 10.1016/j.jmr.2006.07.013
 * The needed parameters are the wavelet scale and the lambda used in the whittaker smoother.
 * @param waveletScale To be described
 * @param whittakerLambda To be described
 */
NMR.prototype.haarWhittakerBaselineCorrection=function(waveletScale,whittakerLambda) {
    //@TODO Implement haarWhittakerBaselineCorrection filter
}

/**
 * @function whittakerBaselineCorrection(whittakerLambda,ranges)
 * Applies a baseline correction as described in J Magn Resonance 183 (2006) 145-151 10.1016/j.jmr.2006.07.013
 * The needed parameters are the Wavelet scale and the lambda used in the Whittaker smoother.
 * @param waveletScale To be described
 * @param whittakerLambda To be described
 * @param ranges A string containing the ranges of no signal.
 */
NMR.prototype.whittakerBaselineCorrection=function(whittakerLambda,ranges) {
    //@TODO Implement whittakerBaselineCorrection filter
}

/**
 * @function brukerSpectra(options)
 * This filter applies a circular shift(phase 1 correction in the time domain) to an NMR FID spectrum that 
 * have been obtained on spectrometers using the Bruker digital filters. The amount of shift depends on the 
 * parameters DECIM and DSPFVS. This spectraData have to be of type NMR_FID
 * @option DECIM: Acquisition parameter
 * @option DSPFVS: Acquisition parameter
 */
NMR.prototype.brukerSpectra=function(options) {
    //@TODO Implement brukerSpectra filter
}

/**
 * @function apodization(functionName, lineBroadening)
 * Apodization of a spectraData object.
 * @param spectraData An spectraData of type NMR_FID
 * @param functionName Valid values for functionsName are
 *  Exponential, exp
 *  Hamming, hamming
 *  Gaussian, gauss
 *  TRAF, traf
 *  Sine Bell, sb
 *  Sine Bell Squared, sb2
 * @param lineBroadening The parameter LB should either be a line broadening factor in Hz 
 * or alternatively an angle given by degrees for sine bell functions and the like.
 * @example SD.apodization(, lineBroadening)
 */
NMR.prototype.apodization=function(functionName, lineBroadening) {
    //@TODO Implement apodization filter
}

/**
 * @function echoAntiechoFilter();
 * That decodes an Echo-Antiecho 2D spectrum.
 */
NMR.prototype.echoAntiechoFilter=function() {
    //@TODO Implement echoAntiechoFilter filter
}

/**
 * @function SNVFilter()
 * This function apply a Standard Normal Variate Transformation over the given spectraData. Mainly used for IR spectra.
 */
NMR.prototype.SNVFilter=function() {
    //@TODO Implement SNVFilter
}

/**
 * @function powerFilter(power)
 * This function applies a power to all the Y values.<br>If the power is less than 1 and the spectrum has negative values, it will be shifted so that the lowest value is zero 
 * @param   power   The power to apply
 */
NMR.prototype.powerFilter=function(power) {
    var minY=this.getMinY();
    if(power<1 && minY<0){
        this.YShift(-1*minY);
        console.warn("SD.powerFilter: The spectrum had negative values and was automatically shifted before applying the function.");
    }
    //@TODO Implement powerFilter
}

/**
 * @function logarithmFilter(base)
 * This function applies a log to all the Y values.<br>If the spectrum has negative or zero values, it will be shifted so that the lowest value is 1 
 * @param   base    The base to use
 */
NMR.prototype.logarithmFilter=function(base) {
    var minY=this.getMinY();
    if(minY<=0){
        this.YShift((-1*minY)+1);
        console.warn("SD.logarithmFilter: The spectrum had negative values and was automatically shifted before applying the function.");
    }
   //@TODO Implement logarithmFilter filter
}


/**
 * @function correlationFilter(func) 
 * This function correlates the given spectraData with the given vector func. The correlation
 * operation (*) is defined as:
 * 
 *                    __ inf
 *  c(x)=f(x)(*)g(x)= \        f(x)*g(x+i)
 *                   ./    
 *                    -- i=-inf
 * @param func A double array containing the function to correlates the spectraData
 * @example var smoothedSP = SD.correlationFilter(spectraData,[1,1]) returns a smoothed version of the
 * given spectraData. 
 */
NMR.prototype.correlationFilter=function(func) {
    //@TODO Implement correlationFilter filter
}

/**
 * @function  phaseCorrection(phi0, phi1)
 * Applies the phase correction (phi0,phi1) to a Fourier transformed spectraData. The angles must be given in radians.
 * @param phi0 Zero order phase correction
 * @param phi1 One order phase correction
*/
NMR.prototype.phaseCorrection=function(phi0, phi1) {
    //@TODO Implement phaseCorrection filter
}

/**
 * @function automaticPhase() 
 * This function determines automatically the correct parameters phi0 and phi1 for a phaseCorrection
 * function and applies it.
 */ 
NMR.prototype.automaticPhase=function() {
    //@TODO Implement automaticPhase filter
}

/**
 *  @function useBrukerPhase()
 *  This function extract the parameters of the phaseCorrection from the jcamp-dx parameters
 *  if the spectrum was acquired in Bruker spectrometers . Basically it will look for the parameters
 *  $PHC0 and $PHC1, and will use it to call the phaseCorrection function.
 */
NMR.prototype.useBrukerPhase=function() {
   //@TODO Implement useBrukerPhase filter
}

/**
 * @function nmrPeakDetection(parameters);
 * This function process the given spectraData and tries to determine the NMR signals. Returns an NMRSignal1D array containing all the detected 1D-NMR Signals
 * @param parameters A JSONObject containing the optional parameters:
 * @option fromX:   Lower limit.
 * @option toX:     Upper limit.
 * @option threshold: The minimum intensity to consider a peak as a signal, expressed as a percentage of the highest peak. 
 * @option stdev: Number of standard deviation of the noise for the threshold calculation if a threshold is not specified.
 */
NMR.prototype.nmrPeakDetection=function(parameters) {
    parameters=parameters||{};
    if(!parameters.nH)
        parameters.nH=10;
    return PeakPicking.peakPicking(this, parameters.nH, this.getSolventName());
}

/**
 * @function toJcamp(options)
 * This function creates a String that represents the given spectraData in the format JCAM-DX 5.0
 * The X,Y data can be compressed using one of the methods described in: 
 * "JCAMP-DX. A STANDARD FORMAT FOR THE EXCHANGE OF ION MOBILITY SPECTROMETRY DATA", 
 *  http://www.iupac.org/publications/pac/pdf/2001/pdf/7311x1765.pdf
 * @option encode: ['FIX','SQZ','DIF','DIFDUP','CVS','PAC'] (Default: 'FIX')
 * @option yfactor: The YFACTOR. It allows to compress the data by removing digits from the ordinate. (Default: 1)
 * @option type: ["NTUPLES", "SIMPLE"] (Default: "SIMPLE")
 * @option keep: A set of user defined parameters of the given SpectraData to be stored in the jcamp.
 * @example SD.toJcamp(spectraData,{encode:'DIFDUP',yfactor:0.01,type:"SIMPLE",keep:['#batchID','#url']});
 */ 
NMR.prototype.toJcamp=function(options) {
     //@TODO Implement toJcamp filter
     return "NOT ImplementED"
}


module.exports = NMR;

},{"./PeakPicking":9,"./SD":11,"jcampconverter":2}],7:[function(require,module,exports){
var SD = require('./SD');
var PeakPicking2D = require('./PeakPicking2D');
var JcampConverter=require("jcampconverter");

function NMR2D(sd) {
    SD.call(this, sd); // Héritage
}

NMR2D.prototype = Object.create(SD.prototype);
NMR2D.prototype.constructor = NMR2D;

NMR2D.fromJcamp = function(jcamp) {
    var spectrum= JcampConverter.convert(jcamp,{xy:true,keepSpectra:true});
    return new NMR2D(spectrum);
}

NMR2D.prototype.isHomoNuclear=function(){
    return this.sd.xType==this.sd.yType;
}

//Returns the observe frequency in the direct dimension
NMR2D.prototype.observeFrequencyX=function(){
    return this.sd.spectra[0].observeFrequency;
}

//Returns the observe frequency in the indirect dimension
NMR2D.prototype.observeFrequencyY=function(){
    return this.sd.indirectFrequency;
}

/**
 * Returns the solvent name
 */
NMR2D.prototype.getSolventName=function(){
    return (this.sd.info[".SOLVENTNAME"]||this.sd.info["$SOLVENT"]).replace("<","").replace(">","");
}

/**
 * This function returns the units of the direct dimension. It overrides the SD getXUnits function
 * @returns {ntuples.units|*|b.units}
 */
NMR2D.prototype.getXUnits = function(){
    return this.sd.ntuples[1].units;
}
/**
 * This function returns the units of the indirect dimension. It overrides the SD getYUnits function
 * @returns {ntuples.units|*|b.units}
 */
NMR2D.prototype.getYUnits = function(){
    return this.sd.ntuples[0].units;
}
/**
 * Returns the units of the dependent variable
 * @returns {ntuples.units|*|b.units}
 */
NMR2D.prototype.getZUnits = function(){
    return this.sd.ntuples[2].units;
}
/**
 * Overwrite this function. Now, the Y axe refers to the indirect dimension
 * @returns {sd.minMax.maxY}
 */
NMR2D.prototype.getLastY = function(){
    return this.sd.minMax.maxY;
}
/**
 * * Overwrite this function. Now, the Y axe refers to the indirect dimension
 * @returns {sd.minMax.minY}
 */
NMR2D.prototype.getFirstY = function(){
    return this.sd.minMax.minY;
}

//Returns the separation between 2 consecutive points in the indirect domain
NMR2D.prototype.getDeltaY=function(){
    return ( this.getLastY()-this.getFirstY()) / (this.getNbSubSpectra()-1);
}

/**
 * @function nmrPeakDetection2D(options)
 * This function process the given spectraData and tries to determine the NMR signals. 
 + Returns an NMRSignal2D array containing all the detected 2D-NMR Signals
 * @param	options:+Object			Object containing the options
 * @option	thresholdFactor:number	A factor to scale the automatically determined noise threshold.
 * @returns	+Object	set of NMRSignal2D
 */
NMR2D.prototype.nmrPeakDetection2D=function(options){
    options = options||{};
    if(!options.thresholdFactor)
        options.thresholdFactor=1;
    var id = Math.round(Math.random()*255);
    if(!options.id){
        id=options.id;
    }
    var peakList = PeakPicking2D.findPeaks2D(this, options.thresholdFactor);

    //lets add an unique ID for each peak.
    for(var i=0;i<peakList.length;i++){
        peakList[i]._highlight=[id+"_"+i];
    }
    return peakList;
}

/**
* Returns the noise factor depending on the nucleus.
*/
NMR2D.prototype.getNMRPeakThreshold=function(nucleus) {
    if (nucleus == "1H")
        return 3.0;
    if (nucleus =="13C")
        return 5.0;
    return 1.0;
}

/**
* Returns the nucleus in the specified dimension
*/
NMR2D.prototype.getNucleus=function(dim){
    if(dim==1)
        return this.sd.xType;
    if(dim==2)
        return this.sd.yType;
    return this.sd.xType;
}

module.exports = NMR2D;

},{"./PeakPicking2D":10,"./SD":11,"jcampconverter":2}],8:[function(require,module,exports){
var PeakOptimizer={
	diagonalError:0.05,
	tolerance:0.05,
	DEBUG:false,
    toleranceX : 0.025,
    toleranceY : 0.5,

    clean: function(peaks, threshold){
        var max = Number.NEGATIVE_INFINITY;
        var i,peak;
        //double min = Double.MAX_VALUE;
        for(i=peaks.length-1;i>=0;i--){
            if(Math.abs(peaks[i].z)>max)
                max=Math.abs(peaks[i].z);
        }
        max*=threshold;
        for(i=peaks.length-1;i>=0;i--){
            if(Math.abs(peaks[i].z)<max)
                peaks.splice(i,1);
        }
        return peaks;
    },
	
	enhanceSymmetry: function(signals){
		
		var properties = this.initializeProperties(signals);
		var output = signals;

		if(this.DEBUG)
			console.log("Before optimization size: "+output.size());
		
		//First step of the optimization: Symmetry validation
		var i,hits,index;
		var signal;
		for(i=output.length-1;i>=0;i--){
			signal = output[i];
			if(signal.peaks.length>1)
				properties[i][1]++;
			if(properties[i][0]==1){
				index = this.exist(output, properties, signal,-1,true);
				if(index>=0){
					properties[i][1]+=2;
					properties[index][1]+=2;
				}
			}
		}
		//Second step of the optimization: Diagonal image existence
		for(i=output.length-1;i>=0;i--){
			signal = output[i];
			if(properties[i][0]==0){
				hits = this.checkCrossPeaks(output, properties, signal, true);
				properties[i][1]+=hits;
				//checkCrossPeaks(output, properties, signal, false);
			}
		}
		
		//Now, each peak have a score between 0 and 4, we can complete the patterns which
		//contains peaks with high scores, and finally, we can remove peaks with scores 0 and 1
		var count = 0;
		for(i=output.length-1;i>=0;i--){
			if(properties[i][0]!==0&&properties[i][1]>2){
				count++;
				count+=this.completeMissingIfNeeded(output,properties,output[i],properties[i]);
			}
			if(properties[i][1]>=2&&properties[i][0]===0)
				count++;
		}
		
		if(this.DEBUG)
			console.log("After optimization size: "+count);
		var  toReturn = new Array(count);
		count--;
		for(i=output.length-1;i>=0;i--){
			if(properties[i][0]!==0&&properties[i][1]>2
					||properties[i][0]===0&&properties[i][1]>1){
				toReturn[count--]=output[i];
			}
			else{
				console.log("Removed "+i+" "+output[i].peaks.length);
			}
			//if(properties.get(i)[1]>=2)
			//	toReturn[count--]=output.get(i);
		}
		return toReturn;
	},
	
	completeMissingIfNeeded: function(output, properties, thisSignal, thisProp) {
		//Check for symmetry
		var index = this.exist(output, properties, thisSignal,-thisProp[0],true);
		var addedPeaks=0;
		var newSignal = null, tmpProp=null;
		if(index<0){//If this signal have no a symmetry image, we have to include it
			newSignal = {nucleusX:thisSignal.nucleusX,nucleusY:thisSignal.nucleusY};
			newSignal.resolutionX=thisSignal.resolutionX;
			newSignal.resolutionY=thisSignal.resolutionY;
			newSignal.shiftX=thisSignal.shiftY;
			newSignal.shiftY=thisSignal.shiftX;
			newSignal.peaks = [{x:thisSignal.shiftY,y:thisSignal.shiftX,z:1}];
			output.push(newSignal);
			tmpProp = [-thisProp[0],thisProp[1]];
			properties.push(tmpProp);
			addedPeaks++;
		}
		//Check for diagonal peaks
		var j=0;
		var diagX=false, diagY=false;
		var signal;
		for(j=output.length-1;j>=0;j--){
			signal = output[j];
			if(properties[j][0]===0){
				if(Math.abs(signal.shiftX-thisSignal.shiftX)<this.diagonalError)
					diagX=true;
				if(Math.abs(signal.shiftY-thisSignal.shiftY)<this.diagonalError)
					diagY=true;
			}
		}
		if(diagX===false){
			newSignal = {nucleusX:thisSignal.nucleusX,nucleusY:thisSignal.nucleusY};
			newSignal.resolutionX=thisSignal.resolutionX;
			newSignal.resolutionY=thisSignal.resolutionY;
			newSignal.shiftX=thisSignal.shiftX;
			newSignal.shiftY=thisSignal.shiftX;
			newSignal.peaks = [{x:thisSignal.shiftX,y:thisSignal.shiftX,z:1}];
			output.push(newSignal);
			tmpProp = [0,thisProp[1]];
			properties.push(tmpProp);
			addedPeaks++;
		}
		if(diagY===false){
			newSignal = {nucleusX:thisSignal.nucleusX,nucleusY:thisSignal.nucleusY};
			newSignal.resolutionX=thisSignal.resolutionX;
			newSignal.resolutionY=thisSignal.resolutionY;
			newSignal.shiftX=thisSignal.shiftY;
			newSignal.shiftY=thisSignal.shiftY;
			newSignal.peaks = [{x:thisSignal.shiftY,y:thisSignal.shiftY,z:1}];
			output.push(newSignal);
			tmpProp = [0,thisProp[1]];
			properties.push(tmpProp);
			addedPeaks++;
		}
		return addedPeaks;
		
	},
	
	//Check for any diagonal peak that match this cross peak
	checkCrossPeaks: function(output, properties, signal, updateProperties) {
		var hits = 0, i=0, shift=signal.shiftX*4;
		var crossPeaksX = [],crossPeaksY = [];
		var cross;
		for(i=output.length-1;i>=0;i--){
			cross = output[i];
			if(properties[i][0]!==0){
				if(Math.abs(cross.shiftX-signal.shiftX)<this.diagonalError){
					hits++;
					if(updateProperties)
						properties[i][1]++;
					crossPeaksX.push(i);
					shift+=cross.shiftX;
				}
				else{
					if(Math.abs(cross.shiftY-signal.shiftY)<this.diagonalError){
						hits++;
						if(updateProperties)
							properties[i][1]++;
						crossPeaksY.push(i);
						shift+=cross.shiftY;
					}
				}
			}
		}
		//Update found crossPeaks and diagonal peak
		shift/=(crossPeaksX.length+crossPeaksY.length+4);
		if(crossPeaksX.length>0){
			for( i=crossPeaksX.length-1;i>=0;i--){
				output[crossPeaksX[i]].shiftX=shift;
			}
		}
		if(crossPeaksY.length>0){
			for( i=crossPeaksY.length-1;i>=0;i--){
				output[crossPeaksY[i]].shiftY=shift;
			}
		}
		signal.shiftX=shift;
		signal.shiftY=shift;
		return hits;
	},

	exist: function(output, properties, signal, type, symmetricSearch) {
		for(var i=output.length-1;i>=0;i--){
			if(properties[i][0]==type){
				if(this.distanceTo(signal, output[i], symmetricSearch)<this.tolerance){
					if(!symmetricSearch){
						var shiftX=(output[i].shiftX+signal.shiftX)/2.0;
						var shiftY=(output[i].shiftY+signal.shiftY)/2.0;
						output[i].shiftX=shiftX;
						output[i].shiftY=shiftY;
						signal.shiftX=shiftX;
						signal.shiftY=shiftY;
					}
					else{
						var shiftX=signal.shiftX;
						var shiftY=output[i].shiftX;
						output[i].shiftY=shiftX;
						signal.shiftY=shiftY;
					}
					return i;
				}
			}
		}
		return -1;
	},
	/**
	 * We try to determine the position of each signal within the spectrum matrix.
	 * Peaks could be of 3 types: upper diagonal, diagonal or under diagonal 1,0,-1
	 * respectively.
	 * @param Signals
	 * @return A matrix containing the properties of each signal
	 */
	initializeProperties: function(signals){
		var signalsProperties = new Array(signals.length);
		for(var i=signals.length-1;i>=0;i--){
			signalsProperties[i]=[0,0];
			//We check if it is a diagonal peak
			if(Math.abs(signals[i].shiftX-signals[i].shiftY)<=this.diagonalError){
				signalsProperties[i][1]=1;
				//We adjust the x and y value to be symmetric.
				//In general chemical shift in the direct dimension is better than in the other one,
				//so, we believe more to the shiftX than to the shiftY.
				var shift = (signals[i].shiftX*2+signals[i].shiftY)/3.0;
				signals[i].shiftX=shift;
				signals[i].shiftY=shift;
			}
			else{
				if(signals[i].shiftX-signals[i].shiftY>0)
					signalsProperties[i][0]=1;
				else
					signalsProperties[i][0]=-1;
			}
		}
		return signalsProperties;
	},
	
	/**
	 * This function calculates the distance between 2 nmr signals . If toImage is true, 
	 * it will interchange x by y in the distance calculation for the second signal.
	 */
	distanceTo: function(a, b, toImage){
		if(!toImage){
			return Math.sqrt(Math.pow(a.shiftX-b.shiftX, 2)
					+Math.pow(a.shiftY-b.shiftY, 2));
		}
		else{
			return Math.sqrt(Math.pow(a.shiftX-b.shiftY, 2)
					+Math.pow(a.shiftY-b.shiftX, 2));
		}
	}
};

module.exports = PeakOptimizer;
},{}],9:[function(require,module,exports){
/**
 * Implementation of the peak pickig method described by Cobas in:
 * A new approach to improving automated analysis of proton NMR spectra
 * through Global Spectral Deconvolution (GSD)
 * http://www.spectroscopyeurope.com/images/stories/ColumnPDFs/TD_23_1.pdf
 */
var PeakPicking={
    impurities:[],
    maxJ:20,

    peakPicking:function(spectrum, solvent, options){
        options = options||{nH:10,clean:true}

        var nH=options.nH||10;

        var peakList = this.GSD(spectrum);
        //console.log(peakList);
        this.realTopDetection(peakList,spectrum);
        //console.log(peakList);
        var signals = this.detectSignals(peakList, spectrum.observeFrequencyX(), nH);
        //For now just return the peak List
        //@TODO work in the peakPicking
        return signals;

        /*var frequency = spectrum.observeFrequencyX();//getParamDouble("$BF1",400);
        var imp = this.labelPeaks(peakList, solvent, frequency);
        return [peakList,imp];
        */
        //return createSignals(peakList,nH);
    },

    realTopDetection: function(peakList, spectrum){
        var listP = [];
        var alpha, beta, gamma, p,currentPoint;
        for(j=0;j<peakList.length;j++){
            currentPoint = spectrum.unitsToArrayPoint(peakList[j][0]);
            if(spectrum.getY(currentPoint-1)>0&&spectrum.getY(currentPoint+1)>0
                &&spectrum.getY(currentPoint)>=spectrum.getY(currentPoint-1)
                &&spectrum.getY(currentPoint)>=spectrum.getY(currentPoint+1)) {
                alpha = 20 * Math.log10(spectrum.getY(currentPoint - 1));
                beta = 20 * Math.log10(spectrum.getY(currentPoint));
                gamma = 20 * Math.log10(spectrum.getY(currentPoint + 1));
                p = 0.5 * (alpha - gamma) / (alpha - 2 * beta + gamma);

                peakList[j][0] = spectrum.arrayPointToUnits(currentPoint + p);
                peakList[j][1] = spectrum.getY(currentPoint) - 0.25 * (spectrum.getY(currentPoint - 1) - spectrum.getY(currentPoint + 1)) * p;//signal.peaks[j].intensity);

            }
        }
    },

    /**
     * Should we read the impurities table from somewhere else?
     */
    init:function(){
        this.impurities = [{"impurities":[{"shifts":[{"proton":"X","coupling":0,"multiplicity":"","shift":7.26}],"name":"solvent_residual_peak"},{"shifts":[{"proton":"H2O","coupling":0,"multiplicity":"s","shift":1.56}],"name":"H2O"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.1}],"name":"acetic_acid"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.17}],"name":"acetone"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.1}],"name":"acetonitrile"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.36}],"name":"benzene"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.28}],"name":"tert-butyl_alcohol"},{"shifts":[{"proton":"CCH3","coupling":0,"multiplicity":"s","shift":1.19},{"proton":"OCH3","coupling":0,"multiplicity":"s","shift":3.22}],"name":"tert-butyl_methyl_ether"},{"shifts":[{"proton":"ArH","coupling":0,"multiplicity":"s","shift":6.98},{"proton":"OHc","coupling":0,"multiplicity":"s","shift":5.01},{"proton":"ArCH3","coupling":0,"multiplicity":"s","shift":2.27},{"proton":"ArC(CH3)3","coupling":0,"multiplicity":"s","shift":1.43}],"name":"BHTb"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.26}],"name":"chloroform"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":1.43}],"name":"cyclohexane"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.73}],"name":"1,2-dichloroethane"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":5.3}],"name":"dichloromethane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.21},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":3.48}],"name":"diethyl_ether"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"m","shift":3.65},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":3.57},{"proton":"OCH3","coupling":0,"multiplicity":"s","shift":3.39}],"name":"diglyme"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.4},{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.55}],"name":"1,2-dimethoxyethane"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":2.09},{"proton":"NCH3","coupling":0,"multiplicity":"s","shift":3.02},{"proton":"NCH3","coupling":0,"multiplicity":"s","shift":2.94}],"name":"dimethylacetamide"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":8.02},{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.96},{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.88}],"name":"dimethylformamide"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.62}],"name":"dimethyl_sulfoxide"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.71}],"name":"dioxane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.25},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":3.72},{"proton":"OH","coupling":5,"multiplicity":"s,t","shift":1.32}],"name":"ethanol"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":2.05},{"proton":"CH2CH3","coupling":7,"multiplicity":"q","shift":4.12},{"proton":"CH2CH3","coupling":7,"multiplicity":"t","shift":1.26}],"name":"ethyl_acetate"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":2.14},{"proton":"CH2CH3","coupling":7,"multiplicity":"q","shift":2.46},{"proton":"CH2CH3","coupling":7,"multiplicity":"t","shift":1.06}],"name":"ethyl_methyl_ketone"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":3.76}],"name":"ethylene_glycol"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"m","shift":0.86},{"proton":"CH2","coupling":0,"multiplicity":"br_s","shift":1.26}],"name":"grease^f"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"t","shift":0.88},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.26}],"name":"n-hexane"},{"shifts":[{"proton":"CH3","coupling":9.5,"multiplicity":"d","shift":2.65}],"name":"HMPAg"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.49},{"proton":"OH","coupling":0,"multiplicity":"s","shift":1.09}],"name":"methanol"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":4.33}],"name":"nitromethane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":7},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.27}],"name":"n-pentane"},{"shifts":[{"proton":"CH3","coupling":6,"multiplicity":"d","shift":1.22},{"proton":"CH","coupling":6,"multiplicity":"sep","shift":4.04}],"name":"2-propanol"},{"shifts":[{"proton":"CH(2)","coupling":0,"multiplicity":"m","shift":8.62},{"proton":"CH(3)","coupling":0,"multiplicity":"m","shift":7.29},{"proton":"CH(4)","coupling":0,"multiplicity":"m","shift":7.68}],"name":"pyridine"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":0.07}],"name":"silicone_greasei"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.85},{"proton":"CH2O","coupling":0,"multiplicity":"m","shift":3.76}],"name":"tetrahydrofuran"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.36},{"proton":"CH(o/p)","coupling":0,"multiplicity":"m","shift":7.17},{"proton":"CH(m)","coupling":0,"multiplicity":"m","shift":7.25}],"name":"toluene"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.03},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":2.53}],"name":"triethylamine"}],"solvent":"CDCl3"},{"impurities":[{"shifts":[{"proton":"X","coupling":0,"multiplicity":"","shift":2.05}],"name":"solvent_residual_peak"},{"shifts":[{"proton":"H2O","coupling":0,"multiplicity":"s","shift":2.84}],"name":"H2O"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.96}],"name":"acetic_acid"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.09}],"name":"acetone"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.05}],"name":"acetonitrile"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.36}],"name":"benzene"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.18}],"name":"tert-butyl_alcohol"},{"shifts":[{"proton":"CCH3","coupling":0,"multiplicity":"s","shift":1.13},{"proton":"OCH3","coupling":0,"multiplicity":"s","shift":3.13}],"name":"tert-butyl_methyl_ether"},{"shifts":[{"proton":"ArH","coupling":0,"multiplicity":"s","shift":6.96},{"proton":"ArCH3","coupling":0,"multiplicity":"s","shift":2.22},{"proton":"ArC(CH3)3","coupling":0,"multiplicity":"s","shift":1.41}],"name":"BHTb"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":8.02}],"name":"chloroform"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":1.43}],"name":"cyclohexane"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.87}],"name":"1,2-dichloroethane"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":5.63}],"name":"dichloromethane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.11},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":3.41}],"name":"diethyl_ether"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"m","shift":3.56},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":3.47},{"proton":"OCH3","coupling":0,"multiplicity":"s","shift":3.28}],"name":"diglyme"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.28},{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.46}],"name":"1,2-dimethoxyethane"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":1.97},{"proton":"NCH3","coupling":0,"multiplicity":"s","shift":3},{"proton":"NCH3","coupling":0,"multiplicity":"s","shift":2.83}],"name":"dimethylacetamide"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.96},{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.94},{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.78}],"name":"dimethylformamide"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.52}],"name":"dimethyl_sulfoxide"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.59}],"name":"dioxane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.12},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":3.57},{"proton":"OH","coupling":5,"multiplicity":"s,t","shift":3.39}],"name":"ethanol"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":1.97},{"proton":"CH2CH3","coupling":7,"multiplicity":"q","shift":4.05},{"proton":"CH2CH3","coupling":7,"multiplicity":"t","shift":1.2}],"name":"ethyl_acetate"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":2.07},{"proton":"CH2CH3","coupling":7,"multiplicity":"q","shift":2.45},{"proton":"CH2CH3","coupling":7,"multiplicity":"t","shift":0.96}],"name":"ethyl_methyl_ketone"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":3.28}],"name":"ethylene_glycol"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"m","shift":0.87},{"proton":"CH2","coupling":0,"multiplicity":"br_s","shift":1.29}],"name":"grease^f"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"t","shift":0.88},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.28}],"name":"n-hexane"},{"shifts":[{"proton":"CH3","coupling":9.5,"multiplicity":"d","shift":2.59}],"name":"HMPAg"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.31},{"proton":"OH","coupling":0,"multiplicity":"s","shift":3.12}],"name":"methanol"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":4.43}],"name":"nitromethane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":0.88},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.27}],"name":"n-pentane"},{"shifts":[{"proton":"CH3","coupling":6,"multiplicity":"d","shift":1.1},{"proton":"CH","coupling":6,"multiplicity":"sep","shift":3.9}],"name":"2-propanol"},{"shifts":[{"proton":"CH(2)","coupling":0,"multiplicity":"m","shift":8.58},{"proton":"CH(3)","coupling":0,"multiplicity":"m","shift":7.35},{"proton":"CH(4)","coupling":0,"multiplicity":"m","shift":7.76}],"name":"pyridine"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":0.13}],"name":"silicone_greasei"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.79},{"proton":"CH2O","coupling":0,"multiplicity":"m","shift":3.63}],"name":"tetrahydrofuran"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.32},{"proton":"CH(o/p)","coupling":0,"multiplicity":"m","shift":7.5},{"proton":"CH(m)","coupling":0,"multiplicity":"m","shift":7.5}],"name":"toluene"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":0.96},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":2.45}],"name":"triethylamine"}],"solvent":"(CD3)2CO"},{"impurities":[{"shifts":[{"proton":"X","coupling":0,"multiplicity":"","shift":2.5}],"name":"solvent_residual_peak"},{"shifts":[{"proton":"H2O","coupling":0,"multiplicity":"s","shift":3.33}],"name":"H2O"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.91}],"name":"acetic_acid"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.09}],"name":"acetone"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.07}],"name":"acetonitrile"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.37}],"name":"benzene"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.11},{"proton":"OHc","coupling":0,"multiplicity":"s","shift":4.19}],"name":"tert-butyl_alcohol"},{"shifts":[{"proton":"CCH3","coupling":0,"multiplicity":"s","shift":1.11},{"proton":"OCH3","coupling":0,"multiplicity":"s","shift":3.08}],"name":"tert-butyl_methyl_ether"},{"shifts":[{"proton":"ArH","coupling":0,"multiplicity":"s","shift":6.87},{"proton":"OHc","coupling":0,"multiplicity":"s","shift":6.65},{"proton":"ArCH3","coupling":0,"multiplicity":"s","shift":2.18},{"proton":"ArC(CH3)3","coupling":0,"multiplicity":"s","shift":1.36}],"name":"BHTb"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":8.32}],"name":"chloroform"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":1.4}],"name":"cyclohexane"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.9}],"name":"1,2-dichloroethane"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":5.76}],"name":"dichloromethane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.09},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":3.38}],"name":"diethyl_ether"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"m","shift":3.51},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":3.38},{"proton":"OCH3","coupling":0,"multiplicity":"s","shift":3.24}],"name":"diglyme"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.24},{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.43}],"name":"1,2-dimethoxyethane"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":1.96},{"proton":"NCH3","coupling":0,"multiplicity":"s","shift":2.94},{"proton":"NCH3","coupling":0,"multiplicity":"s","shift":2.78}],"name":"dimethylacetamide"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.95},{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.89},{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.73}],"name":"dimethylformamide"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.54}],"name":"dimethyl_sulfoxide"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.57}],"name":"dioxane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.06},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":3.44},{"proton":"OH","coupling":5,"multiplicity":"s,t","shift":4.63}],"name":"ethanol"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":1.99},{"proton":"CH2CH3","coupling":7,"multiplicity":"q","shift":4.03},{"proton":"CH2CH3","coupling":7,"multiplicity":"t","shift":1.17}],"name":"ethyl_acetate"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":2.07},{"proton":"CH2CH3","coupling":7,"multiplicity":"q","shift":2.43},{"proton":"CH2CH3","coupling":7,"multiplicity":"t","shift":0.91}],"name":"ethyl_methyl_ketone"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":3.34}],"name":"ethylene_glycol"},{"shifts":[],"name":"grease^f"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"t","shift":0.86},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.25}],"name":"n-hexane"},{"shifts":[{"proton":"CH3","coupling":9.5,"multiplicity":"d","shift":2.53}],"name":"HMPAg"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.16},{"proton":"OH","coupling":0,"multiplicity":"s","shift":4.01}],"name":"methanol"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":4.42}],"name":"nitromethane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":0.88},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.27}],"name":"n-pentane"},{"shifts":[{"proton":"CH3","coupling":6,"multiplicity":"d","shift":1.04},{"proton":"CH","coupling":6,"multiplicity":"sep","shift":3.78}],"name":"2-propanol"},{"shifts":[{"proton":"CH(2)","coupling":0,"multiplicity":"m","shift":8.58},{"proton":"CH(3)","coupling":0,"multiplicity":"m","shift":7.39},{"proton":"CH(4)","coupling":0,"multiplicity":"m","shift":7.79}],"name":"pyridine"},{"shifts":[],"name":"silicone_greasei"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.76},{"proton":"CH2O","coupling":0,"multiplicity":"m","shift":3.6}],"name":"tetrahydrofuran"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.3},{"proton":"CH(o/p)","coupling":0,"multiplicity":"m","shift":7.18},{"proton":"CH(m)","coupling":0,"multiplicity":"m","shift":7.25}],"name":"toluene"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":0.93},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":2.43}],"name":"triethylamine"}],"solvent":"(CD3)2SO/DMSO"},{"impurities":[{"shifts":[{"proton":"X","coupling":0,"multiplicity":"","shift":7.16}],"name":"solvent_residual_peak"},{"shifts":[{"proton":"H2O","coupling":0,"multiplicity":"s","shift":0.4}],"name":"H2O"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.55}],"name":"acetic_acid"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.55}],"name":"acetone"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.55}],"name":"acetonitrile"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.15}],"name":"benzene"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.05},{"proton":"OHc","coupling":0,"multiplicity":"s","shift":1.55}],"name":"tert-butyl_alcohol"},{"shifts":[{"proton":"CCH3","coupling":0,"multiplicity":"s","shift":1.07},{"proton":"OCH3","coupling":0,"multiplicity":"s","shift":3.04}],"name":"tert-butyl_methyl_ether"},{"shifts":[{"proton":"ArH","coupling":0,"multiplicity":"s","shift":7.05},{"proton":"OHc","coupling":0,"multiplicity":"s","shift":4.79},{"proton":"ArCH3","coupling":0,"multiplicity":"s","shift":2.24},{"proton":"ArC(CH3)3","coupling":0,"multiplicity":"s","shift":1.38}],"name":"BHTb"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":6.15}],"name":"chloroform"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":1.4}],"name":"cyclohexane"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":2.9}],"name":"1,2-dichloroethane"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":4.27}],"name":"dichloromethane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.11},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":3.26}],"name":"diethyl_ether"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"m","shift":3.46},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":3.34},{"proton":"OCH3","coupling":0,"multiplicity":"s","shift":3.11}],"name":"diglyme"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.12},{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.33}],"name":"1,2-dimethoxyethane"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":1.6},{"proton":"NCH3","coupling":0,"multiplicity":"s","shift":2.57},{"proton":"NCH3","coupling":0,"multiplicity":"s","shift":2.05}],"name":"dimethylacetamide"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.63},{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.36},{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.86}],"name":"dimethylformamide"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.68}],"name":"dimethyl_sulfoxide"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.35}],"name":"dioxane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":0.96},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":3.34}],"name":"ethanol"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":1.65},{"proton":"CH2CH3","coupling":7,"multiplicity":"q","shift":3.89},{"proton":"CH2CH3","coupling":7,"multiplicity":"t","shift":0.92}],"name":"ethyl_acetate"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":1.58},{"proton":"CH2CH3","coupling":7,"multiplicity":"q","shift":1.81},{"proton":"CH2CH3","coupling":7,"multiplicity":"t","shift":0.85}],"name":"ethyl_methyl_ketone"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":3.41}],"name":"ethylene_glycol"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"m","shift":0.92},{"proton":"CH2","coupling":0,"multiplicity":"br_s","shift":1.36}],"name":"grease^f"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"t","shift":0.89},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.24}],"name":"n-hexane"},{"shifts":[{"proton":"CH3","coupling":9.5,"multiplicity":"d","shift":2.4}],"name":"HMPAg"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.07}],"name":"methanol"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.94}],"name":"nitromethane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":0.86},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.23}],"name":"n-pentane"},{"shifts":[{"proton":"CH3","coupling":6,"multiplicity":"d","shift":0.95},{"proton":"CH","coupling":6,"multiplicity":"sep","shift":3.67}],"name":"2-propanol"},{"shifts":[{"proton":"CH(2)","coupling":0,"multiplicity":"m","shift":8.53},{"proton":"CH(3)","coupling":0,"multiplicity":"m","shift":6.66},{"proton":"CH(4)","coupling":0,"multiplicity":"m","shift":6.98}],"name":"pyridine"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":0.29}],"name":"silicone_greasei"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.4},{"proton":"CH2O","coupling":0,"multiplicity":"m","shift":3.57}],"name":"tetrahydrofuran"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.11},{"proton":"CH(o/p)","coupling":0,"multiplicity":"m","shift":7.02},{"proton":"CH(m)","coupling":0,"multiplicity":"m","shift":7.13}],"name":"toluene"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":0.96},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":2.4}],"name":"triethylamine"}],"solvent":"C6D6"},{"impurities":[{"shifts":[{"proton":"X","coupling":0,"multiplicity":"","shift":1.94}],"name":"solvent_residual_peak"},{"shifts":[{"proton":"H2O","coupling":0,"multiplicity":"s","shift":2.13}],"name":"H2O"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.96}],"name":"acetic_acid"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.08}],"name":"acetone"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.96}],"name":"acetonitrile"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.37}],"name":"benzene"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.16},{"proton":"OHc","coupling":0,"multiplicity":"s","shift":2.18}],"name":"tert-butyl_alcohol"},{"shifts":[{"proton":"CCH3","coupling":0,"multiplicity":"s","shift":1.14},{"proton":"OCH3","coupling":0,"multiplicity":"s","shift":3.13}],"name":"tert-butyl_methyl_ether"},{"shifts":[{"proton":"ArH","coupling":0,"multiplicity":"s","shift":6.97},{"proton":"OHc","coupling":0,"multiplicity":"s","shift":5.2},{"proton":"ArCH3","coupling":0,"multiplicity":"s","shift":2.22},{"proton":"ArC(CH3)3","coupling":0,"multiplicity":"s","shift":1.39}],"name":"BHTb"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.58}],"name":"chloroform"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":1.44}],"name":"cyclohexane"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.81}],"name":"1,2-dichloroethane"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":5.44}],"name":"dichloromethane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.12},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":3.42}],"name":"diethyl_ether"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"m","shift":3.53},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":3.45},{"proton":"OCH3","coupling":0,"multiplicity":"s","shift":3.29}],"name":"diglyme"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.28},{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.45}],"name":"1,2-dimethoxyethane"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":1.97},{"proton":"NCH3","coupling":0,"multiplicity":"s","shift":2.96},{"proton":"NCH3","coupling":0,"multiplicity":"s","shift":2.83}],"name":"dimethylacetamide"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.92},{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.89},{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.77}],"name":"dimethylformamide"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.5}],"name":"dimethyl_sulfoxide"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.6}],"name":"dioxane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.12},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":3.54},{"proton":"OH","coupling":5,"multiplicity":"s,t","shift":2.47}],"name":"ethanol"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":1.97},{"proton":"CH2CH3","coupling":7,"multiplicity":"q","shift":4.06},{"proton":"CH2CH3","coupling":7,"multiplicity":"t","shift":1.2}],"name":"ethyl_acetate"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":2.06},{"proton":"CH2CH3","coupling":7,"multiplicity":"q","shift":2.43},{"proton":"CH2CH3","coupling":7,"multiplicity":"t","shift":0.96}],"name":"ethyl_methyl_ketone"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":3.51}],"name":"ethylene_glycol"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"m","shift":0.86},{"proton":"CH2","coupling":0,"multiplicity":"br_s","shift":1.27}],"name":"grease^f"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"t","shift":0.89},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.28}],"name":"n-hexane"},{"shifts":[{"proton":"CH3","coupling":9.5,"multiplicity":"d","shift":2.57}],"name":"HMPAg"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.28},{"proton":"OH","coupling":0,"multiplicity":"s","shift":2.16}],"name":"methanol"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":4.31}],"name":"nitromethane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":0.87},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.29}],"name":"n-pentane"},{"shifts":[{"proton":"CH3","coupling":6,"multiplicity":"d","shift":1.09},{"proton":"CH","coupling":6,"multiplicity":"sep","shift":3.87}],"name":"2-propanol"},{"shifts":[{"proton":"CH(2)","coupling":0,"multiplicity":"m","shift":8.57},{"proton":"CH(3)","coupling":0,"multiplicity":"m","shift":7.33},{"proton":"CH(4)","coupling":0,"multiplicity":"m","shift":7.73}],"name":"pyridine"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":0.08}],"name":"silicone_greasei"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.8},{"proton":"CH2O","coupling":0,"multiplicity":"m","shift":3.64}],"name":"tetrahydrofuran"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.33},{"proton":"CH(o/p)","coupling":0,"multiplicity":"m","shift":7.2},{"proton":"CH(m)","coupling":0,"multiplicity":"m","shift":7.2}],"name":"toluene"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":0.96},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":2.45}],"name":"triethylamine"}],"solvent":"CD3CN"},{"impurities":[{"shifts":[{"proton":"X","coupling":0,"multiplicity":"","shift":3.31}],"name":"solvent_residual_peak"},{"shifts":[{"proton":"H2O","coupling":0,"multiplicity":"s","shift":4.87}],"name":"H2O"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.99}],"name":"acetic_acid"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.15}],"name":"acetone"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.03}],"name":"acetonitrile"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.33}],"name":"benzene"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.4}],"name":"tert-butyl_alcohol"},{"shifts":[{"proton":"CCH3","coupling":0,"multiplicity":"s","shift":1.15},{"proton":"OCH3","coupling":0,"multiplicity":"s","shift":3.2}],"name":"tert-butyl_methyl_ether"},{"shifts":[{"proton":"ArH","coupling":0,"multiplicity":"s","shift":6.92},{"proton":"ArCH3","coupling":0,"multiplicity":"s","shift":2.21},{"proton":"ArC(CH3)3","coupling":0,"multiplicity":"s","shift":1.4}],"name":"BHTb"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.9}],"name":"chloroform"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":1.45}],"name":"cyclohexane"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.78}],"name":"1,2-dichloroethane"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":5.49}],"name":"dichloromethane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.18},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":3.49}],"name":"diethyl_ether"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"m","shift":3.61},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":3.58},{"proton":"OCH3","coupling":0,"multiplicity":"s","shift":3.35}],"name":"diglyme"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.35},{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.52}],"name":"1,2-dimethoxyethane"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":2.07},{"proton":"NCH3","coupling":0,"multiplicity":"s","shift":3.31},{"proton":"NCH3","coupling":0,"multiplicity":"s","shift":2.92}],"name":"dimethylacetamide"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.97},{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.99},{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.86}],"name":"dimethylformamide"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.65}],"name":"dimethyl_sulfoxide"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.66}],"name":"dioxane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.19},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":3.6}],"name":"ethanol"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":2.01},{"proton":"CH2CH3","coupling":7,"multiplicity":"q","shift":4.09},{"proton":"CH2CH3","coupling":7,"multiplicity":"t","shift":1.24}],"name":"ethyl_acetate"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":2.12},{"proton":"CH2CH3","coupling":7,"multiplicity":"q","shift":2.5},{"proton":"CH2CH3","coupling":7,"multiplicity":"t","shift":1.01}],"name":"ethyl_methyl_ketone"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":3.59}],"name":"ethylene_glycol"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"m","shift":0.88},{"proton":"CH2","coupling":0,"multiplicity":"br_s","shift":1.29}],"name":"grease^f"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"t","shift":0.9},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.29}],"name":"n-hexane"},{"shifts":[{"proton":"CH3","coupling":9.5,"multiplicity":"d","shift":2.64}],"name":"HMPAg"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.34}],"name":"methanol"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":4.34}],"name":"nitromethane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":0.89},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.29}],"name":"n-pentane"},{"shifts":[{"proton":"CH3","coupling":6,"multiplicity":"d","shift":1.5},{"proton":"CH","coupling":6,"multiplicity":"sep","shift":3.92}],"name":"2-propanol"},{"shifts":[{"proton":"CH(2)","coupling":0,"multiplicity":"m","shift":8.53},{"proton":"CH(3)","coupling":0,"multiplicity":"m","shift":7.44},{"proton":"CH(4)","coupling":0,"multiplicity":"m","shift":7.85}],"name":"pyridine"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":0.1}],"name":"silicone_greasei"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.87},{"proton":"CH2O","coupling":0,"multiplicity":"m","shift":3.71}],"name":"tetrahydrofuran"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.32},{"proton":"CH(o/p)","coupling":0,"multiplicity":"m","shift":7.16},{"proton":"CH(m)","coupling":0,"multiplicity":"m","shift":7.16}],"name":"toluene"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.05},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":2.58}],"name":"triethylamine"}],"solvent":"CD3OD"},{"impurities":[{"shifts":[{"proton":"X","coupling":0,"multiplicity":"","shift":4.79}],"name":"solvent_residual_peak"},{"shifts":[],"name":"H2O"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.08}],"name":"acetic_acid"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.22}],"name":"acetone"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.06}],"name":"acetonitrile"},{"shifts":[],"name":"benzene"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":1.24}],"name":"tert-butyl_alcohol"},{"shifts":[{"proton":"CCH3","coupling":0,"multiplicity":"s","shift":1.21},{"proton":"OCH3","coupling":0,"multiplicity":"s","shift":3.22}],"name":"tert-butyl_methyl_ether"},{"shifts":[],"name":"BHTb"},{"shifts":[],"name":"chloroform"},{"shifts":[],"name":"cyclohexane"},{"shifts":[],"name":"1,2-dichloroethane"},{"shifts":[],"name":"dichloromethane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.17},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":3.56}],"name":"diethyl_ether"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"m","shift":3.67},{"proton":"CH2","coupling":0,"multiplicity":"m","shift":3.61},{"proton":"OCH3","coupling":0,"multiplicity":"s","shift":3.37}],"name":"diglyme"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.37},{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.6}],"name":"1,2-dimethoxyethane"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":2.08},{"proton":"NCH3","coupling":0,"multiplicity":"s","shift":3.06},{"proton":"NCH3","coupling":0,"multiplicity":"s","shift":2.9}],"name":"dimethylacetamide"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":7.92},{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.01},{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.85}],"name":"dimethylformamide"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":2.71}],"name":"dimethyl_sulfoxide"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"s","shift":3.75}],"name":"dioxane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":1.17},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":3.65}],"name":"ethanol"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":2.07},{"proton":"CH2CH3","coupling":7,"multiplicity":"q","shift":4.14},{"proton":"CH2CH3","coupling":7,"multiplicity":"t","shift":1.24}],"name":"ethyl_acetate"},{"shifts":[{"proton":"CH3CO","coupling":0,"multiplicity":"s","shift":2.19},{"proton":"CH2CH3","coupling":7,"multiplicity":"q","shift":3.18},{"proton":"CH2CH3","coupling":7,"multiplicity":"t","shift":1.26}],"name":"ethyl_methyl_ketone"},{"shifts":[{"proton":"CH","coupling":0,"multiplicity":"s","shift":3.65}],"name":"ethylene_glycol"},{"shifts":[],"name":"grease^f"},{"shifts":[],"name":"n-hexane"},{"shifts":[{"proton":"CH3","coupling":9.5,"multiplicity":"d","shift":2.61}],"name":"HMPAg"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":3.34}],"name":"methanol"},{"shifts":[{"proton":"CH3","coupling":0,"multiplicity":"s","shift":4.4}],"name":"nitromethane"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":0.9}],"name":"n-pentane"},{"shifts":[{"proton":"CH3","coupling":6,"multiplicity":"d","shift":1.17},{"proton":"CH","coupling":6,"multiplicity":"sep","shift":4.02}],"name":"2-propanol"},{"shifts":[{"proton":"CH(2)","coupling":0,"multiplicity":"m","shift":8.52},{"proton":"CH(3)","coupling":0,"multiplicity":"m","shift":7.45},{"proton":"CH(4)","coupling":0,"multiplicity":"m","shift":7.87}],"name":"pyridine"},{"shifts":[],"name":"silicone_greasei"},{"shifts":[{"proton":"CH2","coupling":0,"multiplicity":"m","shift":1.88},{"proton":"CH2O","coupling":0,"multiplicity":"m","shift":3.74}],"name":"tetrahydrofuran"},{"shifts":[],"name":"toluene"},{"shifts":[{"proton":"CH3","coupling":7,"multiplicity":"t","shift":0.99},{"proton":"CH2","coupling":7,"multiplicity":"q","shift":2.57}],"name":"triethylamine"}],"solvent":"D2O"}];
        //this.impurities = API.getVar("impurities").getValue();
        //File.parse("solvent1H.txt", {header:false});
        //console.log(this.impurities[0]);
    },
    /*
     {
     "nbPeaks":1,"multiplicity":"","units":"PPM","startX":3.43505,"assignment":"",
     "pattern":"s","stopX":3.42282,"observe":400.08,"asymmetric":false,
     "delta1":3.42752,
     "integralData":{"to":3.43505,"value":590586504,"from":3.42282},
     "nucleus":"1H",
     "peaks":[{"intensity":60066147,"x":3.42752}]
     }
     */
    detectSignals: function(peakList, frequency, nH){
        var signals = [];
        var index = 0;
        var signal1D = {};
        var prevPeak = [100000,0];
        var rangeX = 16/frequency;//Peaks withing this range are considered to belongs to the same signal1D
        var spectrumIntegral = 0;
        for(var i=0;i<peakList.length;i++){
            if(Math.abs(peakList[i][0]-prevPeak[0])>rangeX){
                signal1D = {"nbPeaks":1,"units":"PPM",
                    "startX":peakList[i][0]+peakList[i][2],
                    "stopX":peakList[i][0]-peakList[i][2],
                    "multiplicity":"","pattern":"",
                    "observe":frequency,"nucleus":"1H",
                    "integralData":{"from":peakList[i][0]-peakList[i][2]*2,
                                    "to":peakList[i][0]+peakList[i][2]*2,
                                    "value":this.area(peakList[i])
                    },
                    "peaks":[]};
                signal1D.peaks.push({x:peakList[i][0],"intensity":peakList[i][1], width:peakList[i][2]});
                signals.push(signal1D);
                spectrumIntegral+=this.area(peakList[i]);
            }
            else{
                signal1D.stopX=peakList[i][0]-peakList[i][2];
                signal1D.nbPeaks++;
                signal1D.peaks.push({x:peakList[i][0],"intensity":peakList[i][1]});
                signal1D.integralData.value+=this.area(peakList[i]);
                signal1D.integralData.from=peakList[i][0]-peakList[i][2]*2;
                spectrumIntegral+=this.area(peakList[i]);
            }
            prevPeak=peakList[i];
        }
        //Normalize the integral to the normalization parameter and calculate cs
        for(var i=0;i<signals.length;i++){
            signals[i].integralData.value*=nH/spectrumIntegral;
            var peaks = signals[i].peaks;
            var cs = 0, sum=0;
            for(var j=0;j<peaks.length;j++){
                cs+=peaks[j].x*peaks[j].intensity;
                sum+=peaks[j].intensity;
            }
            signals[i].delta1 = cs/sum;
        }

        return signals;
    },

    area: function(peak){
        return Math.abs(peak[1]*peak[2]*1.772453851);
    },

    /**
     This function tries to determine which peaks belongs to common laboratory solvents
     as trace impurities from DOI:10.1021/jo971176v. The only parameter of the table is
     the solvent name.
     */
    labelPeaks:function(peakList, solvent, frequency){
        var column = 0;
        //console.log(this.impurities[0]);
        for(column=4;column<this.impurities.length;column++){
            //console.log("sss".contains);
            if(this.impurities[0][column].indexOf(solvent)>=0){
                break;
            }
        }
        //console.log("labelPeaks "+column);
        var nImpurities = this.impurities.length-1;
        var nPeaks = peakList.length;
        //Scores matrix
        console.log(nImpurities);
        var scores = new Array(nImpurities);
        var max = 0, diff=0, score=0;
        var gamma = 0.2;//ppm
        var impurityID=-1;
        var prevImp = "";
        var maxIntensity = 0,i;
        for(var j=nPeaks-1;j>=0;j--){
            if(peakList[j][1]>maxIntensity)
                maxIntensity = peakList[j][1];
        }

        for(i=nImpurities-1;i>=0;i--){
            if(this.impurities[i+1][0]!=prevImp){
                impurityID++;
                prevImp=this.impurities[i+1][0];
            }

            //impID, max, maxIndex, average
            scores[i]=[impurityID,this.impurities[i+1][2],
                this.impurities[i+1][3],0,[],0];
            max = 0;
            for(var j=nPeaks-1;j>=0;j--){
                diff = 10000;//Big numnber
                if(this.impurities[i+1][column]>0)
                    diff = Math.abs(peakList[j][0]-this.impurities[i+1][column]);
                if(diff<gamma*3){
                    score=this.score(diff,gamma);
                    if(score>max){
                        max=score;
                        scores[i][3]=max;
                        scores[i][4]=[j];
                    }
                }
            }
        }
        //Calculate the average score for each impurity set of signals
        var prevIndex = -1, sum=0, count = 0;
        var candidates=[];
        var impuritiesPeaks = [];
        var i=nImpurities-1;
        while(i>=-1){
            if(i==-1||scores[i][0]!=prevIndex&&prevIndex!=-1){
                if(prevIndex!=-1){
                    scores[i+1][5]=sum/count;
                    //Now, lets chech the multiplicities
                    if(scores[i+1][5]>0.9){
                        //console.log(scores[i+1][0]+" SS ");
                        score=this.updateScore(candidates, peakList, maxIntensity, frequency);
                        if(score>0.9){
                            //console.log(candidates);
                            //TODO: Remove peaks and add it do impuritiesPeaks
                            for(var j=0;j<candidates.length;j++){
                                for(var k=candidates[j][4].length-1;k>=0;k--){
                                    impuritiesPeaks.push(peakList[candidates[j][4][k]]);
                                }
                            }
                        }
                    }
                }
                if(i>=0){
                    prevIndex=scores[i][0];
                    sum=scores[i][3];
                    count=1;
                    candidates=[scores[i]];
                }

            }else{
                prevIndex=scores[i][0];
                candidates.push(scores[i]);
                sum+=scores[i][3];
                count++;
            }
            i--;
        }
        //console.log(impuritiesPeaks.length);

        return impuritiesPeaks;
    },
    /**
     Updates the score that a given impurity is present in the current spectrum. In this part I would expect
     to have into account the multiplicity of the signal. Also the relative intensity of the signals.
     THIS IS the KEY part of the algorithm!!!!!!!!!
     */
    updateScore:function(candidates, peakList, maxIntensity, frequency){
        //You may do it to avoid this part.
        //return 1;

        //Check the multiplicity
        var mul = "";
        var j = 0,index, k, maxJppm=this.maxJ/frequency;
        var min=0, indexMin=0, score=0;
        for(var i=candidates.length-1;i>=0;i--){
            mul = candidates[i][1];
            j = candidates[i][2];
            //console.log(candidates[i][4]);
            index = candidates[i][4][0];
            //console.log(peakList[index][0]+" "+mul+" "+j+" "+index);
            //I guess we should try to identify the pattern in the nearby.
            if(mul.indexOf("sep")>=0){
                if(peakList[index][1]>maxIntensity*0.33){
                    candidates.splice(i,1);//Not a candidate anymore.
                }
            }else{
                if(mul.indexOf("s")>=0||mul.indexOf("X")>=0){
                    k=index-1;
                    min=peakList[index][1];
                    indexMin=index;
                    while(k>=0&&Math.abs(peakList[index][0]-peakList[k][0])<0.025){
                        if(peakList[k][1]<min){
                            min=peakList[k][1];
                            indexMin=k;
                        }
                        k--;
                    }
                    k=index+1;
                    while(k<peakList.length&&Math.abs(peakList[index][0]-peakList[k][0])<0.025){
                        if(peakList[k][1]<min){
                            min=peakList[k][1];
                            indexMin=k;
                        }
                        k++;
                    }
                    candidates[i][4][0]=indexMin;
                    score+=1;
                }
            }
            if(mul.indexOf("d")>=0){
                if(index>0&&index<peakList.length-1){
                    var thisJ1 = Math.abs(Math.abs(peakList[index-1][0]-peakList[index][0])*frequency-j);
                    var thisJ2 = Math.abs(Math.abs(peakList[index+1][0]-peakList[index][0])*frequency-j);
                    var thisJ3 = Math.abs(Math.abs(peakList[index+1][0]-peakList[index-1][0])*frequency-j);
                    if(thisJ1<2||thisJ2<2||thisJ3<2){
                        if(thisJ1<thisJ2){
                            if(thisJ1<thisJ3){
                                candidates[i][4]=[index-1,index];
                                score+=1;
                            }
                            else{
                                candidates[i][4]=[index-1,index+1];
                                score+=1;
                            }
                        }
                        else{
                            if(thisJ2<thisJ3){
                                candidates[i][4]=[index,index+1];
                                score+=1;
                            }
                            else{
                                candidates[i][4]=[index-1,index+1];
                                score+=1;
                            }
                        }
                    }
                }
            }
            if(mul.indexOf("t")>=0){
                //console.log("here");
                if(index>0&&index<peakList.length-1){
                    var thisJ1 = Math.abs(Math.abs(peakList[index-1][0]-peakList[index][0])*frequency-j);
                    var thisJ2 = Math.abs(Math.abs(peakList[index+1][0]-peakList[index][0])*frequency-j);
                    var thisJ4 = Math.abs(Math.abs(peakList[index+1][0]-peakList[index+2][0])*frequency-j);
                    //console.log("XX "+thisJ1+" "+thisJ2);
                    if(thisJ1<2){
                        candidates[i][4]=[index-1, index];
                        score+=0.5;
                    }
                    if(thisJ2<2){
                        candidates[i][4].push(index+1);
                        score+=0.5;
                    }
                    if(thisJ3<2){
                        candidates[i][4].push(index+2);
                        score+=0.5;
                    }

                }
            }
            if(mul.indexOf("q")>=0){
                if(index>1&&index<peakList.length-2){
                    var thisJ1 = Math.abs(Math.abs(peakList[index-2][0]-peakList[index-1][0])*frequency-j);
                    var thisJ2 = Math.abs(Math.abs(peakList[index-1][0]-peakList[index][0])*frequency-j);
                    var thisJ3 = Math.abs(Math.abs(peakList[index+1][0]-peakList[index][0])*frequency-j);
                    var thisJ4= Math.abs(Math.abs(peakList[index+2][0]-peakList[index+1][0])*frequency-j);
                    if(thisJ1<2){
                        candidates[i][4].push(index-2);
                        score+=0.25;
                    }
                    if(thisJ2<2){
                        candidates[i][4].push(index-1);
                        score+=0.25;
                    }
                    if(thisJ3<2){
                        candidates[i][4].push(index+1);
                        score+=0.25;
                    }
                    if(thisJ4<2){
                        candidates[i][4].push(index+2);
                        score+=0.25;
                    }
                }
            }


        }

        //console.log(score/candidates.length+ " -> "+candidates);
        //Lets remove the candidates to be impurities.
        //It would be equivalent to mark the peaks as valid again
        if(score/candidates.length < 0.5){
            for(var i=candidates.length-1;i>=0;i--){
                candidates.splice(i,1);
            }
            return 0;
        }
        //Check the relative intensity
        return 1;
    },

    score:function(value, gamma){
        return Math.exp(-Math.pow(value/gamma,2)/2.0);
    },
    /**
     This function joint all the nearby peaks into single signals. We may try to
     determine the J-couplings and the multiplicity here.
     */
    createSignals:function(){

    },
    /**
     Determine the peaks of the spectrum by applying a global spectrum deconvolution.
     */
    GSD:function(spectrum){
        var data= spectrum.getXYData();
        var y = data[1];
        var x = data[0];

        //Lets remove the noise for better performance
        var noiseLevel = Math.abs(spectrum.getNoiseLevel());

        //console.log("noise level "+noiseLevel);
        for(var i=y.length-1;i>=0;i--)
            if(Math.abs(y[i])<noiseLevel)
                y[i]=0;

        var dx = x[1]-x[0];
        // fill convolution frecuency axis
        var X = [];//x[2:(x.length-2)];

        // fill Savitzky-Golay polynomes
        var Y = new Array();
        var dY = new Array();
        var ddY = new Array();
        for (var j = 2; j < x.length -2; j++){
            Y.push((1/35.0)*(-3*y[j-2] + 12*y[j-1] + 17*y[j] + 12*y[j+1] - 3*y[j+2]));
            X.push(x[j]);
            dY.push((1/(12*dx))*(y[j-2] - 8*y[j-1] + 8*y[j+1] - y[j+2]));
            ddY.push((1/(7*dx*dx))*(2*y[j-2] - y[j-1] - 2*y[j] - y[j+1] + 2*y[j+2]));
        }
        // pushs max and min points in convolution functions
        var maxY = new Array();
        var stackInt = new Array();
        var intervals = new Array();
        var minddY = new Array();
        //console.log(Y.length);
        for (var i = 1; i < Y.length -1 ; i++)
        {
            if ((Y[i] > Y[i-1]) && (Y[i] > Y[i+1]))
            {
                maxY.push(X[i]);
            }
            if ((dY[i] < dY[i-1]) && (dY[i] < dY[i+1]))
            {
                stackInt.push(X[i]);
            }
            if ((dY[i] > dY[i-1]) && (dY[i] > dY[i+1]))
            {
                try{
                    intervals.push( [X[i] , stackInt.pop()] );
                }
                catch(e){
                    console.log("Error I don't know why");
                }
            }
            if ((ddY[i] < ddY[i-1]) && (ddY[i] < ddY[i+1]))
            {
                minddY.push( [X[i], Y[i]] );
            }
        }
        // creates a list with (frecuency, linewith, height)
        var signalsS = new Array();
        var signals = new Array();
        for (var j = 0; j < minddY.length; j++)
        {
            var f = minddY[j];
            var frecuency = f[0];
            var possible = new Array();
            for (var k=0;k<intervals.length;k++){
                var i = intervals[k];
                if (frecuency > i[0] && frecuency < i[1])
                    possible.push(i);
            }
            //console.log("possible "+possible.length);
            if (possible.length > 0)
                if (possible.length == 1)
                {
                    var inter = possible[0];
                    var linewith = inter[1] - inter[0];
                    var height = f[1];
                    var points = Y;
                    //console.log(frecuency);
                    points.sort(function(a, b){return a-b});
                    if ((linewith > 2*dx) && (height > 0.0001*points[0])){
                        signals.push( [frecuency, height, linewith] );
                        signalsS.push([frecuency,height]);

                    }
                }
                else
                {
                    //TODO: nested peaks
                    console.log("Nested "+possible);
                }
        }
        return signals;
        //jexport("peakPicking",signalsS);
    }
}

module.exports = PeakPicking;
},{}],10:[function(require,module,exports){
var FFTUtils = require("./FFTUtils");
var PeakOptimizer = require("./PeakOptimizer");
var SimpleClustering =  require("./SimpleClustering");
var StatArray = require('ml-stat/array');

var PeakPicking2D= {
    DEBUG : false,
    smallFilter : [
        [0, 0, 1, 2, 2, 2, 1, 0, 0],
        [0, 1, 4, 7, 7, 7, 4, 1, 0],
        [1, 4, 5, 3, 0, 3, 5, 4, 1],
        [2, 7, 3, -12, -23, -12, 3, 7, 2],
        [2, 7, 0, -23, -40, -23, 0, 7, 2],
        [2, 7, 3, -12, -23, -12, 3, 7, 2],
        [1, 4, 5, 3, 0, 3, 5, 4, 1],
        [0, 1, 3, 7, 7, 7, 3, 1, 0],
        [0, 0, 1, 2, 2, 2, 1, 0, 0]],


    //How noisy is the spectrum depending on the kind of experiment.
    getLoGnStdDevNMR : function(spectraData) {
    if (spectraData.isHomoNuclear())
        return 1.5
    else
        return 3;
    },

    findPeaks2D : function(spectraData, thresholdFactor){
        if(thresholdFactor==0)
            thresholdFactor=1;
        if(thresholdFactor<0)
            thresholdFactor=-thresholdFactor;
        var nbPoints = spectraData.getNbPoints();
        var nbSubSpectra = spectraData.getNbSubSpectra();

        var data = new Array(nbPoints * nbSubSpectra);
        //var data = new Array(nbPoints * nbSubSpectra/2);

        var isHomonuclear = spectraData.isHomoNuclear();

        //var sum = new Array(nbPoints);

        for (var iSubSpectra = 0; iSubSpectra < nbSubSpectra; iSubSpectra++) {
            var spectrum = spectraData.getYData(iSubSpectra);
            for (var iCol = 0; iCol < nbPoints; iCol++) {
                if(isHomonuclear){
                    data[iSubSpectra * nbPoints + iCol] =(spectrum[iCol]>0?spectrum[iCol]:0);
                }
                else{
                    data[iSubSpectra * nbPoints + iCol] =Math.abs(spectrum[iCol]);
                }
            }
        }

        var nStdDev = this.getLoGnStdDevNMR(spectraData);
        if(isHomonuclear){
            var convolutedSpectrum = this.convoluteWithLoG(data, nbSubSpectra, nbPoints);
            var peaksMC1 = this.findPeaks2DLoG(data, convolutedSpectrum, nbSubSpectra, nbPoints, nStdDev*thresholdFactor);//)1.5);
            var peaksMax1 = this.findPeaks2DMax(data, convolutedSpectrum, nbSubSpectra, nbPoints, (nStdDev+0.5)*thresholdFactor);//2.0);
            for(var i=0;i<peaksMC1.length;i++)
                peaksMax1.push(peaksMC1[i]);
            //console.log(peaksMax1);
            return PeakOptimizer.enhanceSymmetry(this.createSignals2D(peaksMax1,spectraData,24));

        }
        else{
            var convolutedSpectrum = this.convoluteWithLoG(data, nbSubSpectra, nbPoints);
            var peaksMC1 = this.findPeaks2DLoG(data, convolutedSpectrum, nbSubSpectra, nbPoints, nStdDev*thresholdFactor);
            //Peak2D[] peaksMC1 = PeakPicking2D.findPeaks2DMax(data, nbSubSpectra, nbPoints, (nStdDev+0.5)*thresholdFactor);
            //Remove peaks with less than 3% of the intensity of the highest peak
            return this.createSignals2D(PeakOptimizer.clean(peaksMC1, 0.05), spectraData,24);
        }

    },
    /**
     Calculates the 1st derivative of the 2D matrix, using the LoG kernel approximation
     */
    convoluteWithLoG : function(inputSpectrum, nRows, nCols){
        var ftSpectrum = new Array(nCols * nRows);
        for (var i = nRows * nCols-1; i >=0; i--){
            ftSpectrum[i] = inputSpectrum[i];
        }

        ftSpectrum = FFTUtils.fft2DArray(ftSpectrum, nRows, nCols);

        var dim = this.smallFilter.length;
        var ftFilterData = new Array(nCols * nRows);
        for(var i=nCols * nRows-1;i>=0;i--){
            ftFilterData[i]=0;
        }

        var iRow, iCol;
        var shift = (dim - 1) / 2;
        //console.log(dim);
        for (var ir = 0; ir < dim; ir++) {
            iRow = (ir - shift + nRows) % nRows;
            for (var ic = 0; ic < dim; ic++) {
                iCol = (ic - shift + nCols) % nCols;
                ftFilterData[iRow * nCols + iCol] = this.smallFilter[ir][ic];
            }
        }

        ftFilterData = FFTUtils.fft2DArray(ftFilterData, nRows, nCols);

        var ftRows = nRows * 2;
        var ftCols = nCols / 2 + 1;
        FFTUtils.convolute2DI(ftSpectrum, ftFilterData, ftRows, ftCols);

        return  FFTUtils.ifft2DArray(ftSpectrum, ftRows, ftCols);
    },
    /**
     Detects all the 2D-peaks in the given spectrum based on center of mass logic.
     */
    findPeaks2DLoG : function(inputSpectrum, convolutedSpectrum, nRows, nCols, nStdDev) {
        var threshold = 0;
        for(var i=nCols*nRows-2;i>=0;i--)
            threshold+=Math.pow(convolutedSpectrum[i]-convolutedSpectrum[i+1],2);
        threshold=-Math.sqrt(threshold);
        threshold*=nStdDev/nRows;

        var bitmask = new Array(nCols * nRows);
        for(var i=nCols * nRows-1;i>=0;i--){
            bitmask[i]=0;
        }
        var nbDetectedPoints = 0;
        var lasti=-1;
        for (var i = convolutedSpectrum.length-1; i >=0 ; i--) {
            if (convolutedSpectrum[i] < threshold) {
                bitmask[i] = 1;
                nbDetectedPoints++;
            }
        }
        var iStart = 0;
        //int ranges = 0;
        var peakList = [];

        while (nbDetectedPoints != 0) {
            for (iStart; iStart < bitmask.length && bitmask[iStart]==0; iStart++){};
            //
            if (iStart == bitmask.length)
                break;

            nbDetectedPoints -= this.extractArea(inputSpectrum, convolutedSpectrum,
                bitmask, iStart, nRows, nCols, peakList, threshold);
        }

        if (peakList.length > 0&&this.DEBUG) {
            console.log("No peak found");
        }
        return peakList;
    },
    /**
     Detects all the 2D-peaks in the given spectrum based on the Max logic.
     */
    findPeaks2DMax : function(inputSpectrum, cs, nRows, nCols, nStdDev) {
        var threshold = 0;
        for(var i=nCols*nRows-2;i>=0;i--)
            threshold+=Math.pow(cs[i]-cs[i+1],2);
        threshold=-Math.sqrt(threshold);
        threshold*=nStdDev/nRows;

        var rowI,colI;
        var peakListMax = [];
        var tmpIndex = 0;
        for (var i = 0; i < cs.length; i++) {
            if (cs[i] < threshold) {
                //It is a peak?
                rowI=Math.floor(i/nCols);
                colI=i%nCols;
                //Verifies if this point is a peak;
                if(rowI>0&&rowI+1<nRows&&colI+1<nCols&&colI>0){
                    //It is the minimum in the same row
                    if(cs[i]<cs[i+1]&&cs[i]<cs[i-1]){
                        //It is the minimum in the previous row
                        tmpIndex=(rowI-1)*nCols+colI;
                        if(cs[i]<cs[tmpIndex-1]&&cs[i]<cs[tmpIndex]&&cs[i]<cs[tmpIndex+1]){
                            //It is the minimum in the next row
                            tmpIndex=(rowI+1)*nCols+colI;
                            if(cs[i]<cs[tmpIndex-1]&&cs[i]<cs[tmpIndex]&&cs[i]<cs[tmpIndex+1]){
                                peakListMax.push({x:colI,y:rowI,z:inputSpectrum[i]});
                            }
                        }
                    }
                }
            }
        }
        return peakListMax;
    },
    /*
     This function detects the peaks
     */
    extractArea : function(spectrum, convolutedSpectrum, bitmask, iStart,
                                                   nRows, nCols, peakList, threshold) {
        var iRow = Math.floor(iStart / nCols);
        var iCol = iStart % nCols;
        var peakPoints =[];
        //console.log(iStart+" "+iRow+" "+iCol);
        // scanBitmask(bitmask, convolutedSpectrum, nRows, nCols, iRow, iCol,
        // peakPoints);
        this.scanBitmask(bitmask, nRows, nCols, iRow, iCol, peakPoints);
        //console.log("extractArea.lng "+peakPoints.length);
        var x = new Array(peakPoints.length);
        var y = new Array(peakPoints.length);
        var z = new Array(peakPoints.length);
        var nValues = peakPoints.length;
        var xAverage = 0.0;
        var yAverage = 0.0;
        var zSum = 0.0;
        if (nValues >= 9) {
            if (this.DEBUG)
                console.log("nValues=" + nValues);
            var maxValue = Number.NEGATIVE_INFINITY;
            var maxIndex = -1;
            for (var i = 0; i < nValues; i++) {
                var pt = (peakPoints.splice(0,1))[0];
                x[i] = pt[0];
                y[i] = pt[1];
                z[i] = spectrum[pt[1] * nCols + pt[0]];
                xAverage += x[i] * z[i];
                yAverage += y[i] * z[i];
                zSum += z[i];
                if (z[i] > maxValue) {
                    maxValue = z[i];
                    maxIndex = i;
                }
            }
            if (maxIndex != -1) {
                xAverage /= zSum;
                yAverage /= zSum;
                var newPeak = {x:xAverage, y:yAverage, z:zSum};
                var minmax;
                minmax =StatArray.minMax(x);
                newPeak.minX=minmax.min;
                newPeak.maxX=minmax.max;
                minmax = StatArray.minMax(y);
                newPeak.minY=minmax.min;
                newPeak.maxY=minmax.max;
                peakList.push(newPeak);
            }
        }
        return nValues;
    },
    /*
     Return all the peaks(x,y points) that composes a signal.
     */
    scanBitmask : function(bitmask, nRows, nCols, iRow, iCol, peakPoints) {
        //console.log(nRows+" "+iRow+" "+nCols+" "+iCol);
        if (iRow < 0 || iCol < 0 || iCol == nCols || iRow == nRows)
            return;
        if (bitmask[iRow * nCols + iCol]) {
            bitmask[iRow * nCols + iCol] = 0;
            peakPoints.push([iCol, iRow]);
            this.scanBitmask(bitmask, nRows, nCols, iRow + 1, iCol, peakPoints);
            this.scanBitmask(bitmask, nRows, nCols, iRow - 1, iCol, peakPoints);
            this.scanBitmask(bitmask, nRows, nCols, iRow, iCol + 1, peakPoints);
            this.scanBitmask(bitmask, nRows, nCols, iRow, iCol - 1, peakPoints);
        }
    },
    /**
     This function converts a set of 2D-peaks in 2D-signals. Each signal could be composed
     of many 2D-peaks, and it has some additional information related to the NMR spectrum.
     */
    createSignals2D : function(peaks, spectraData, tolerance){
        //console.log(peaks.length);
        var signals=[];
        var nbSubSpectra = spectraData.getNbSubSpectra();

        var bf1=spectraData.observeFrequencyX();
        var bf2=spectraData.observeFrequencyY();

        var firstY = spectraData.getFirstY();
        var lastY = spectraData.getLastY();
        var dy = spectraData.getDeltaY();

        //console.log(firstY+" "+lastY+" "+dy+" "+nbSubSpectra);
        //spectraData.setActiveElement(0);
        var noValid=0;
        for (var i = peaks.length-1; i >=0 ; i--) {
            //console.log(peaks[i].x+" "+spectraData.arrayPointToUnits(peaks[i].x));
            //console.log(peaks[i].y+" "+(firstY + dy * (peaks[i].y)));
            peaks[i].x=(spectraData.arrayPointToUnits(peaks[i].x));
            peaks[i].y=(firstY + dy * (peaks[i].y));

            //console.log(peaks[i])
            //Still having problems to correctly detect peaks on those areas. So I'm removing everything there.
            if(peaks[i].y<-1||peaks[i].y>=210){
                peaks.splice(i,1);
            }
        }
        //console.log(peaks);
        //The connectivity matrix is an square and symmetric matrix, so we'll only store the upper diagonal in an
        //array like form
        var connectivity = [];
        var tmp=0;
        tolerance*=tolerance;
        //console.log(tolerance);
        for (var i = 0; i < peaks.length; i++) {
            for (var j = i; j < peaks.length; j++) {
                tmp=Math.pow((peaks[i].x-peaks[j].x)*bf1,2)+Math.pow((peaks[i].y-peaks[j].y)*bf2,2);
                //Console.log(peaks[i].getX()+" "+peaks[j].getX()+" "+tmp);
                if(tmp<tolerance){//30*30Hz We cannot distinguish peaks with less than 20 Hz of separation
                    connectivity.push(1);
                }
                else{
                    connectivity.push(0);
                }
            }
        }

        //console.log(connectivity);

        var clusters = SimpleClustering.fullClusterGenerator(connectivity);

        //console.log(clusters)

        var signals = [];
        if (peaks != null) {
            var xValue, yValue;
            for (var iCluster = 0; iCluster < clusters.length; iCluster++) {
                var signal={nucleusX:spectraData.getNucleus(1),nucleusY:spectraData.getNucleus(2)};
                signal.resolutionX=( spectraData.getLastX()-spectraData.getFirstX()) / spectraData.getNbPoints();
                signal.resolutionY=dy;
                var peaks2D = [];
                signal.shiftX = 0;
                signal.shiftY = 0;
                var sumZ = 0;
                for(var jPeak = clusters[iCluster].length-1;jPeak>=0;jPeak--){
                    if(clusters[iCluster][jPeak]==1){
                        peaks2D.push(peaks[jPeak]);
                        signal.shiftX+=peaks[jPeak].x*peaks[jPeak].z;
                        signal.shiftY+=peaks[jPeak].y*peaks[jPeak].z;
                        sumZ+=peaks[jPeak].z;
                    }
                }
                signal.shiftX/=sumZ;
                signal.shiftY/=sumZ;
                signal.peaks = peaks2D;
                signals.push(signal);
            }
        }
        //console.log(signals);
        return signals;
    }
}

module.exports = PeakPicking2D;
},{"./FFTUtils":5,"./PeakOptimizer":8,"./SimpleClustering":12,"ml-stat/array":3}],11:[function(require,module,exports){
// small note on the best way to define array
// http://jsperf.com/lp-array-and-loops/2

var StatArray = require('ml-stat/array');
var JcampConverter=require("jcampconverter");

function SD(sd) {
    this.sd=sd;
    this.activeElement=0;

    this.DATACLASS_XY = 1;
    this.DATACLASS_PEAK = 2;

    this.TYPE_NMR_SPECTRUM = 'NMR Spectrum';
    this.TYPE_NMR_FID = 'NMR FID';
    this.TYPE_IR = 'IR';
    this.TYPE_RAMAN = 'RAMAN';
    this.TYPE_UV = 'UV';
    this.TYPE_MASS = 'MASS';
    this.TYPE_HPLC = 'HPLC';
    this.TYPE_GC = 'GC';
    this.TYPE_CD = 'CD';
    this.TYPE_2DNMR_SPECTRUM = 'nD NMR SPECTRUM';
    this.TYPE_2DNMR_FID = 'nD NMR FID';
    this.TYPE_XY_DEC = 'XY DEC';
    this.TYPE_XY_INC= 'XY INC';
    this.TYPE_IV = 'IV';
}

SD.fromJcamp = function(jcamp) {
    var spectrum= JcampConverter.convert(jcamp,{xy:true});
    return new SD(spectrum);
}


/**
 * @function setActiveElement(nactiveSpectrum);
 * This function sets the nactiveSpectrum sub-spectrum as active
 * 
 */
SD.prototype.setActiveElement = function(nactiveSpectrum){
    this.activeElement=nactiveSpectrum;
}

/**
 * @function getActiveElement();
 * This function returns the index of the active sub-spectrum.
 */
SD.prototype.getActiveElement = function(){
    return this.activeElement;
}
/**
 * This function returns the units of the independent dimension.
 * @returns {xUnit|*|M.xUnit}
 */
SD.prototype.getXUnits = function(){
    return this.getSpectrum().xUnit;
}

/**
 * * This function returns the units of the dependent variable.
 * @returns {yUnit|*|M.yUnit}
 */
SD.prototype.getYUnits = function(){
    return this.getSpectrum().yUnit;
}

/**
*   Returns the number of points in the current spectrum
*/
SD.prototype.getNbPoints=function(i){
    return this.getSpectrumData(i).y.length;
}

/**
 * Return the first value of the direct dimension
 */
SD.prototype.getFirstX=function(i) {
    i=i||this.activeElement;
    return this.sd.spectra[i].firstX;
}

/**
 * Return the last value of the direct dimension
 */
SD.prototype.getLastX=function(i) {
    i=i||this.activeElement;
    return this.sd.spectra[i].lastX;
}

/**
 * Return the first value of the direct dimension
 */
SD.prototype.getFirstY=function(i) {
    i=i||this.activeElement;
    return this.sd.spectra[i].firstY;
}

/**
 * Return the first value of the direct dimension
 */
SD.prototype.getLastY = function(i){
    i=i||this.activeElement;
    return this.sd.spectra[i].lastY;
}

SD.prototype.setDataClass = function(dataClass){
    if(dataClass==this.DATACLASS_PEAK) {
        this.getSpectrum().isPeaktable = true;
        this.getSpectrum().isXYdata = false;
    }
    if(dataClass==this.DATACLASS_XY){
        this.getSpectrum().isXYdata = true;
        this.getSpectrum().isPeaktable = false;
    }
}

/**
 * @function isDataClassPeak();
 * Is this a PEAKTABLE spectrum?
 */
SD.prototype.isDataClassPeak = function(){
    if(this.getSpectrum().isPeaktable)
        return  this.getSpectrum().isPeaktable;
    return false;
}

/**
 * @function isDataClassXY();
 * Is this a XY spectrum?
 */
SD.prototype.isDataClassXY = function(){
    if(this.getSpectrum().isXYdata)
        return  this.getSpectrum().isXYdata;
    return false
}

SD.prototype.setDataType = function(dataType){
    this.getSpectrum().dataType=dataType;
}

SD.prototype.getDataType = function(){
    return this.getSpectrum().dataType;
}

/**
* Return the i-th sub-spectra in the current spectrum
*/
SD.prototype.getSpectrumData=function(i) {
    i=i||this.activeElement;
    return this.sd.spectra[i].data[0];
}

/**
 * Return the i-th sub-spectra in the current spectrum
 */
SD.prototype.getSpectrum=function(i) {
    i=i||this.activeElement;
    return this.sd.spectra[i];
}

/**
 * Returns the number of sub-spectra in this object
 */
SD.prototype.getNbSubSpectra=function(){
    return this.sd.spectra.length;
}


/**
 *   Returns an array containing the x values of the spectrum
 */
SD.prototype.getXData=function(i){
    return this.getSpectrumData(i).x;
}

/**
 * @function getYData();
 * This function returns a double array containing the values of the intensity for the current sub-spectrum.
 */
SD.prototype.getYData=function(i){
    return this.getSpectrumData(i).y;
}

SD.prototype.getX=function(i){
    return this.getXData()[i];
}

SD.prototype.getY=function(i){
    return this.getYData()[i];
}

/**
 * @function getXYData();
 * To get a 2 dimensional array with the x and y of this spectraData( Only for 1D spectra).
 * Returns a double[2][nbPoints] where the first row contains the x values and the second row the y values.
 */
SD.prototype.getXYData=function(i){
    return [this.getXData(i),this.getYData(i)];
}

SD.prototype.getTitle=function(i) {
    return this.getSpectrum(i).title;
}

/**
 * @function setTitle(newTitle);
 * To set the title of this spectraData.
 * @param newTitle The new title
 */
SD.prototype.setTitle=function(newTitle,i) {
    this.getSpectrum(i).title=newTitle;
}

/**
 * @function getMinY(i)
 * This function returns the minimal value of Y
 */
SD.prototype.getMinY=function(i) {
    return  StatArray.min(this.getYData(i));
}

/**
 * @function getMaxY(i)
 * This function returns the maximal value of Y
 */
SD.prototype.getMaxY=function(i) {
    return  StatArray.max(this.getYData(i));
}

/**
 * @function getMinMax(i)
 */
SD.prototype.getMinMaxY=function(i) {
    return  StatArray.minMax(this.getYData(i));
}


/**
* Get the noise threshold level of the current spectrum. It uses median instead of the mean
*/
SD.prototype.getNoiseLevel=function(){
    var mean = 0,stddev=0;
    var y = this.getYData();
    var length = this.getNbPoints(),i=0;
    for(i = 0; i < length; i++){
        mean+=y[i];
    }
    mean/=this.getNbPoints();
    var averageDeviations = new Array(length);
    for (i = 0; i < length; i++)
        averageDeviations[i] = Math.abs(y[i] - mean);
    averageDeviations.sort();
    if (length % 2 == 1) {
        stddev = averageDeviations[(length-1)/2] / 0.6745;
    } else {
        stddev = 0.5*(averageDeviations[length/2]+averageDeviations[length/2-1]) / 0.6745;
    }

    return stddev*this.getNMRPeakThreshold(this.getNucleus(1));
}


/**
* Return the xValue for the given index
*/
SD.prototype.arrayPointToUnits=function(doublePoint){
    return (this.getFirstX() - (doublePoint* (this.getFirstX() - this.getLastX()) / (this.getNbPoints()-1)));
}

/**
 * Returns the index-value for the data array corresponding to a X-value in
 * units for the element of spectraData to which it is linked (spectraNb).
 * This method makes use of spectraData.getFirstX(), spectraData.getLastX()
 * and spectraData.getNbPoints() to derive the return value if it of data class XY
 * It performs a binary search if the spectrum is a peak table
 *
 * @param inValue
 *            (value in Units to be converted)
 * @return an integer representing the index value of the inValue
 */
SD.prototype.unitsToArrayPoint=function(inValue){
    if (this.isDataClassXY()) {
        return Math.round((this.getFirstX() - inValue) * (-1.0 / this.getDeltaX()));
    } else if (this.isDataClassPeak())
    {
        var currentArrayPoint = 0,upperLimit=this.getNbPoints()-1, lowerLimit=0, midPoint;
        //If inverted scale
        if(this.getFirstX()>this.getLastX()){
            upperLimit=0;
            lowerLimit=this.getNbPoints()-1;

            if(inValue>this.getFirstX())
                return this.getNbPoints();
            if(inValue<this.getLastX())
                return -1;
        }
        else{
            if(inValue<this.getFirstX())
                return -1;
            if(inValue>this.getLastX())
                return this.getNbPoints();
        }

        while (Math.abs(upperLimit-lowerLimit) > 1)
        {
            midPoint=Math.round(Math.floor((upperLimit+lowerLimit)/2));
            //x=this.getX(midPoint);
            if(this.getX(midPoint)==inValue)
                return midPoint;
            if(this.getX(midPoint)>inValue)
                upperLimit=midPoint;
            else
                lowerLimit=midPoint;
        }
        currentArrayPoint=lowerLimit;
        if(Math.abs(this.getX(lowerLimit)-inValue)>Math.abs(this.getX(upperLimit)-inValue))
            currentArrayPoint=upperLimit;
        return currentArrayPoint;
    } else {
        return 0;
    }
}



/**
* Returns the separation between 2 consecutive points in the spectra domain
*/
SD.prototype.getDeltaX=function(){
    return (this.getLastX()-this.getFirstX()) / (this.getNbPoints()-1);
}

/**
 * @function setMinMax(min,max)
 * This function scales the values of Y between the min and max parameters
 * @param min   Minimum desired value for Y
 * @param max   Maximum desired value for Y
 */
SD.prototype.setMinMax=function(min,max) {
    var y = this.getYData();
    var minMax = StatArray.minMax(y);
    var factor = (max - min)/(minMax.max-minMax.min);
    for(var i=0;i< y.length;i++){
        y[i]=(y[i]-minMax.min)*factor+min;
    }
}

/**
 * @function setMin(min)
 * This function scales the values of Y to fit the min parameter
 * @param min   Minimum desired value for Y
 */
SD.prototype.setMin=function(min) {
    var y = this.getYData();
    var currentMin = StatArray.min(y);
    var factor = min/currentMin;
    for(var i=0;i< y.length;i++){
        y[i]*=factor;
    }
}

/**
 * @function setMax(max)
 * This function scales the values of Y to fit the max parameter
 * @param max   Maximum desired value for Y
 */
SD.prototype.setMax=function(max) {
    var y = this.getYData();
    var currentMin = StatArray.max(y);
    var factor = max/currentMin;
    for(var i=0;i< y.length;i++){
        y[i]*=factor;
    }
}

/**
 * @function YShift(value)
 * This function shifts the values of Y
 * @param value Distance of the shift
 */
SD.prototype.YShift=function(value) {
    var y = this.getSpectrumData().y;
    var length = this.getNbPoints(),i=0;
    for(i=0;i<length;i++){
        y[i]+=value;
    }
    this.getSpectrum().firstY+=value;
    this.getSpectrum().lastY+=value;
}

/**
 * @function shift(globalShift)
 * This function shift the given spectraData. After this function is applied, all the peaks in the
 * spectraData will be found at xi+globalShift
 * @param globalShift
 */
SD.prototype.shift=function(globalShift) {
    for(var i=0;i<this.getNbSubSpectra();i++){
        this.setActiveElement(i);
        var x = this.getSpectrumData().x;
        var length = this.getNbPoints(),i=0;
        for(i=0;i<length;i++){
            x[i]+=globalShift;
        }

        this.getSpectrum().firstX+=globalShift;
        this.getSpectrum().lastX+=globalShift;
    }

}

/**
 * @function fillWith(from, to, value)
 * This function fills a zone of the spectrum with the given value.
 * @param from
 * @param to
 * @param fillWith
 */
SD.prototype.fillWith=function(from, to, value) {
    var tmp, start, end, x, y;
    if(from > to) {
        var tmp = from;
        from = to;
        to = tmp;
    }

    for(var i=0;i<this.getNbSubSpectra();i++){
        this.setActiveElement(i);
        x = this.getXData();
        y = this.getYData();
        start = this.unitsToArrayPoint(from);
        end = this.unitsToArrayPoint(to);
        if(start > end){
            tmp = start;
            start = end;
            end = tmp;
        }
        if(start<0)
            start=0;
        if(end>=this.getNbPoints)
            end=this.getNbPoints-1;
        for(i=start;i<=end;i++){
                y[i]=value;
        }
    }
}

/**
 * @function suppressZone(from, to)
 * This function suppress a zone from the given spectraData within the given x range.
 * Returns a spectraData of type PEAKDATA without peaks in the given region
 * @param from
 * @param to
 */
SD.prototype.suppressZone=function(from, to) {
    var tmp, start, end, x, y;
    if(from > to) {
        var tmp = from;
        from = to;
        to = tmp;
    }

    for(var i=0;i<this.getNbSubSpectra();i++){
        this.setActiveElement(i);
        x = this.getXData();
        y = this.getYData();
        start = this.unitsToArrayPoint(from);
        end = this.unitsToArrayPoint(to);
        if(start > end){
            tmp = start;
            start = end;
            end = tmp;
        }
        if(start<0)
            start=0;
        if(end>=this.getNbPoints)
            end=this.getNbPoints-1;
        for(i=end;i>=start;i--){
            y.splice(i,1);
            x.splice(i,1);
        }
    }
    this.setDataClass(this.DATACLASS_PEAK);
}


/**
 * @function peakPicking(parameters)
 * This function performs a simple peak detection in a spectraData. The parameters that can be specified are:
 * Returns a two dimensional array of double specifying [x,y] of the detected peaks.
 * @option from:    Lower limit.
 * @option to:      Upper limit.
 * @option threshold: The minimum intensity to consider a peak as a signal, expressed as a percentage of the highest peak. 
 * @option stdev: Number of standard deviation of the noise for the threshold calculation if a threshold is not specified.
 * @option resolution: The maximum resolution of the spectrum for considering peaks.
 * @option yInverted: Is it a Y inverted spectrum?(like an IR spectrum)
 * @option smooth: A function for smoothing the spectraData before the detection. If your are dealing with
 * experimental spectra, smoothing will make the algorithm less prune to false positives.
 */
SD.prototype.simplePeakPicking=function(parameters) {
    //@TODO implements this filter
}

/**
 * @function getMaxPeak();
 * Get the maximum peak
 */
SD.prototype.getMaxPeak = function(){
    var y = this.getSpectraDataY();
    var max=y[0], index=0;
    for(var i=0;i< y.length;i++){
        if(max<y[i]){
            max = y[i];
            index=i;
        }
    }
    return [this.getSpectraDataX()[index],max];
}

/**
 * @function getParamDouble(name, defvalue);
 * Get the value of the parameter
 * @param  name The parameter name
 * @param  defvalue The default value
 */
SD.prototype.getParamDouble = function(name, defvalue){
    var value = this.sd.info[name];
    if(!value)
        value = defvalue;
    return value;
}

/**
 * @function getParamString(name, defvalue);
 * Get the value of the parameter
 * @param  name The parameter name
 * @param  defvalue The default value
 */
SD.prototype.getParamString = function(name, defvalue){
    var value = this.sd.info[name];
    if(!value)
        value = defvalue;
    return value+"";
}

/**
 * @function getParamInt(name, defvalue);
 * Get the value of the parameter
 * @param  name The parameter name
 * @param  defvalue The default value
 */
SD.prototype.getParamInt = function(name, defvalue){
    var value = this.sd.info[name];
    if(!value)
        value = defvalue;
    return value;
}

/**
 * Return the y elements of the current spectrum
 * @returns {*}
 */
SD.prototype.getSpectrumDataY = function(){
    return this.getYData();
}

/**
 * Return the x elements of the current spectrum
 * @returns {*}
 */
SD.prototype.getSpectraDataX = function(){
    return this.getXData();
}

/**
 * Set a new parameter to this spectrum
 * @param name
 * @param value
 */
SD.prototype.putParam = function(name, value){
    this.sd.info[name]=value;
}

/**
 * Returns a equally spaced vector within the given window.
 * @param from
 * @param to
 * @param nPoints
 * @returns {*}
 */
SD.prototype.getVector = function(from, to, nPoints){
    var x = this.getSpectraDataX();
    var y = this.getSpectraDataY();
    var result = [];
    var start = 0, end = x.length- 1,direction=1;
    var reversed = false;

    if(x[0]>x[1]){
        direction = -1;
        start= x.length-1;
        end = 0;
    }

    if(from > to){
        var tmp = from;
        from = to;
        to = tmp;
        reversed = true;
    }

    if(x[end]>from||x[start]>to)
        return [];

    while(x[start]<from){start+=direction;}

    if(x[end]>to){
        var end = start;
        while(x[end]<to){end+=direction;}
    }
    var winPoints = Math.abs(end-start)+1;
    var xwin = new Array(winPoints), ywin = new Array(winPoints);
    var index = 0;
    if(direction==-1)
        index=winPoints-1;
    var i=start-direction;
    do{
        i+=direction;
        xwin[index]=x[i];
        ywin[index]=y[i];
        index+=direction;
    }while(i!=end);

    return [xwin,ywin];
}

/**
 * @function is2D();
 * Is it a 2D spectrum?
 */
SD.prototype.is2D = function(){
    return false;
}


module.exports = SD;


},{"jcampconverter":2,"ml-stat/array":3}],12:[function(require,module,exports){
var SimpleClustering={

	/*This function returns the cluster list for a given connectivity matrix.
	*To improve the performance, the connectivity(square and symmetric) matrix 
	*is given as a single vector containing  the upper diagonal of the matrix
	*Note: This algorithm is O(n*n) complexity. I wonder if there is something better. 
	*acastillo
	*/
	fullClusterGenerator:function(conn){
		var nRows = Math.sqrt(conn.length*2+0.25)-0.5;
		//console.log("nRows: "+nRows+" - "+conn.length);
		var clusterList = [];
		var available = new Array(nRows);
		var remaining = nRows, i=0;
		var cluster = [];
		//Mark all the elements as available
		for(i=nRows-1;i>=0;i--){
			available[i]=1;
		}
		var nextAv=-1;
		var toInclude = [];
		while(remaining>0){
			if(toInclude.length===0){
				//If there is no more elements to include. Start a new cluster
				cluster = new Array(nRows);
				for(i=nRows-1;i>=0;i--)
					cluster[i]=0;
				clusterList.push(cluster);
		    	for(nextAv = nRows-1;available[nextAv]==0;nextAv--){};
		    }
		    else{
		    	nextAv=toInclude.splice(0,1);
		    }
		    //console.log("row: "+nextAv);
		    cluster[nextAv]=1;
		    available[nextAv]=0;
		    remaining--;
		    //Copy the next available row
		    var row = new Array(nRows);
			for(i=nRows-1;i>=0;i--){
				var c=Math.max(nextAv,i);
				var r=Math.min(nextAv,i);
				//The element in the conn matrix
				//console.log("index: "+r*(2*nRows-r-1)/2+c)
				row[i]=conn[r*(2*nRows-r-1)/2+c];
				//console.log("col: "+i+":"+row[i]);
				//There is new elements to include in this row?
				//Then, include it to the current cluster
				if(row[i]==1&&available[i]==1&&cluster[i]==0){
					toInclude.push(i);
					cluster[i]=1;
				}
			}
		}
		return clusterList;
	}
}

module.exports = SimpleClustering;
},{}],13:[function(require,module,exports){
/**
 * Fast Fourier Transform module
 * 1D-FFT/IFFT, 2D-FFT/IFFT (radix-2)
 */
var FFT = (function(){
  var FFT;  
  
  if(typeof exports !== 'undefined') {
    FFT = exports;   // for CommonJS
  } else {
    FFT = {};
  }
  
  var version = {
    release: '0.3.0',
    date: '2013-03'
  };
  FFT.toString = function() {
    return "version " + version.release + ", released " + version.date;
  };

  // core operations
  var _n = 0,          // order
      _bitrev = null,  // bit reversal table
      _cstb = null;    // sin/cos table

  var core = {
    init : function(n) {
      if(n !== 0 && (n & (n - 1)) === 0) {
        _n = n;
        core._initArray();
        core._makeBitReversalTable();
        core._makeCosSinTable();
      } else {
        throw new Error("init: radix-2 required");
      }
    },
    // 1D-FFT
    fft1d : function(re, im) {
      core.fft(re, im, 1);
    },
    // 1D-IFFT
    ifft1d : function(re, im) {
      var n = 1/_n;
      core.fft(re, im, -1);
      for(var i=0; i<_n; i++) {
        re[i] *= n;
        im[i] *= n;
      }
    },
     // 1D-IFFT
    bt1d : function(re, im) {
      core.fft(re, im, -1);
    },
    // 2D-FFT Not very useful if the number of rows have to be equal to cols
    fft2d : function(re, im) {
      var tre = [],
          tim = [],
          i = 0;
      // x-axis
      for(var y=0; y<_n; y++) {
        i = y*_n;
        for(var x1=0; x1<_n; x1++) {
          tre[x1] = re[x1 + i];
          tim[x1] = im[x1 + i];
        }
        core.fft1d(tre, tim);
        for(var x2=0; x2<_n; x2++) {
          re[x2 + i] = tre[x2];
          im[x2 + i] = tim[x2];
        }
      }
      // y-axis
      for(var x=0; x<_n; x++) {
        for(var y1=0; y1<_n; y1++) {
          i = x + y1*_n;
          tre[y1] = re[i];
          tim[y1] = im[i];
        }
        core.fft1d(tre, tim);
        for(var y2=0; y2<_n; y2++) {
          i = x + y2*_n;
          re[i] = tre[y2];
          im[i] = tim[y2];
        }
      }
    },
    // 2D-IFFT
    ifft2d : function(re, im) {
      var tre = [],
          tim = [],
          i = 0;
      // x-axis
      for(var y=0; y<_n; y++) {
        i = y*_n;
        for(var x1=0; x1<_n; x1++) {
          tre[x1] = re[x1 + i];
          tim[x1] = im[x1 + i];
        }
        core.ifft1d(tre, tim);
        for(var x2=0; x2<_n; x2++) {
          re[x2 + i] = tre[x2];
          im[x2 + i] = tim[x2];
        }
      }
      // y-axis
      for(var x=0; x<_n; x++) {
        for(var y1=0; y1<_n; y1++) {
          i = x + y1*_n;
          tre[y1] = re[i];
          tim[y1] = im[i];
        }
        core.ifft1d(tre, tim);
        for(var y2=0; y2<_n; y2++) {
          i = x + y2*_n;
          re[i] = tre[y2];
          im[i] = tim[y2];
        }
      }
    },
    // core operation of FFT
    fft : function(re, im, inv) {
      var d, h, ik, m, tmp, wr, wi, xr, xi,
          n4 = _n >> 2;
      // bit reversal
      for(var l=0; l<_n; l++) {
        m = _bitrev[l];
        if(l < m) {
          tmp = re[l];
          re[l] = re[m];
          re[m] = tmp;
          tmp = im[l];
          im[l] = im[m];
          im[m] = tmp;
        }
      }
      // butterfly operation
      for(var k=1; k<_n; k<<=1) {
        h = 0;
        d = _n/(k << 1);
        for(var j=0; j<k; j++) {
          wr = _cstb[h + n4];
          wi = inv*_cstb[h];
          for(var i=j; i<_n; i+=(k<<1)) {
            ik = i + k;
            xr = wr*re[ik] + wi*im[ik];
            xi = wr*im[ik] - wi*re[ik];
            re[ik] = re[i] - xr;
            re[i] += xr;
            im[ik] = im[i] - xi;
            im[i] += xi;
          }
          h += d;
        }
      }
    },
    // initialize the array (supports TypedArray)
    _initArray : function() {
      if(typeof Uint32Array !== 'undefined') {
        _bitrev = new Uint32Array(_n);
      } else {
        _bitrev = [];
      }
      if(typeof Float64Array !== 'undefined') {
        _cstb = new Float64Array(_n*1.25);
      } else {
        _cstb = [];
      }
    },
    // zero padding
    _paddingZero : function() {
      // TODO
    },
    // makes bit reversal table
    _makeBitReversalTable : function() {
      var i = 0,
          j = 0,
          k = 0;
      _bitrev[0] = 0;
      while(++i < _n) {
        k = _n >> 1;
        while(k <= j) {
          j -= k;
          k >>= 1;
        }
        j += k;
        _bitrev[i] = j;
      }
    },
    // makes trigonometiric function table
    _makeCosSinTable : function() {
      var n2 = _n >> 1,
          n4 = _n >> 2,
          n8 = _n >> 3,
          n2p4 = n2 + n4,
          t = Math.sin(Math.PI/_n),
          dc = 2*t*t,
          ds = Math.sqrt(dc*(2 - dc)),
          c = _cstb[n4] = 1,
          s = _cstb[0] = 0;
      t = 2*dc;
      for(var i=1; i<n8; i++) {
        c -= dc;
        dc += t*c;
        s += ds;
        ds -= t*s;
        _cstb[i] = s;
        _cstb[n4 - i] = c;
      }
      if(n8 !== 0) {
        _cstb[n8] = Math.sqrt(0.5);
      }
      for(var j=0; j<n4; j++) {
        _cstb[n2 - j]  = _cstb[j];
      }
      for(var k=0; k<n2p4; k++) {
        _cstb[k + n2] = -_cstb[k];
      }
    }
  };
  // aliases (public APIs)
  var apis = ['init', 'fft1d', 'ifft1d', 'fft2d', 'ifft2d'];
  for(var i=0; i<apis.length; i++) {
    FFT[apis[i]] = core[apis[i]];
  }
  FFT.bt = core.bt1d;
  FFT.fft = core.fft1d;
  FFT.ifft = core.ifft1d;
  
  return FFT;
}).call(this);

},{}]},{},[1])(1)
});