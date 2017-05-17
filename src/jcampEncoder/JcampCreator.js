'use strict';

const Encoder = require('./VectorEncoder');
const Integer = {MAX_VALUE: Number.MAX_SAFE_INTEGER, MIN_VALUE: Number.MIN_SAFE_INTEGER};
const CRLF = '\r\n';
const version = 'Cheminfo tools ' + require('../../package.json').version;
const defaultParameters = {encode: 'DIFDUP', yFactor: 1, type: 'SIMPLE', keep: []};
/**
 * This class converts a SpectraData object into a String that can be stored as a jcamp file.
 * The string reflects the current state of the object and not the raw data from where this
 * spectrum was initially loaded.
 * @author acastillo
 *
 */
class JcampCreator {

    /**
     * This function creates a String that represents the given spectraData, in the format JCAM-DX 5.0
     * The X,Y data can be compressed using one of the methods described in:
     * "JCAMP-DX. A STANDARD FORMAT FOR THE EXCHANGE OF ION MOBILITY SPECTROMETRY DATA",
     *  http://www.iupac.org/publications/pac/pdf/2001/pdf/7311x1765.pdf
     * @param {SD} spectraData
     * @param {object} options - Optional paramteres
     * @param {string} [options.encode = 'DIFDUP']
     * @param {number} [options.yFactor = 1]
     * @param {string} [options.type = 'SIMPLE']
     * @param {Array} [options.keep = [] ]
     * @return {string}
     */
    convert(spectraData, options) {
        // encodeFormat: ('FIX','SQZ','DIF','DIFDUP','CVS','PAC')
        options = Object.assign({}, defaultParameters, options);
        const encodeFormat = options.encode.toUpperCase().trim();
        const factorY = options.yFactor || 1;
        let type = options.type;
        const userDefinedParams = options.keep;

        if (type === null || type.length === 0) {
            type = 'SIMPLE';
        }

        var outString = '';
        spectraData.setActiveElement(0);

        var scale = factorY / spectraData.getParamDouble('YFACTOR', 1);
        let minMax = {};

        if (!spectraData.is2D()) {
            minMax = spectraData.getMinMaxY();
        } else {
            minMax = {min: spectraData.getMinZ(), max: spectraData.getMaxZ()};
        }

        if (minMax.max * scale >= Integer.MAX_VALUE / 2) {
            scale = Integer.MAX_VALUE / (minMax.max * 2);
        }
        if (Math.abs(minMax.max - minMax.min) * scale < 16) {
            scale = 16 / (Math.abs(minMax.max - minMax.min));
        }

        var scaleX = Math.abs(1.0 / spectraData.getDeltaX());

        outString += '##TITLE= ' + spectraData.getTitle() + CRLF;
        outString += '##JCAMP-DX= 5.00\t$$' + version + CRLF;
        outString += '##OWNER= ' + spectraData.getParamString('##OWNER=', '') + CRLF;
        outString += '##DATA TYPE= ' + spectraData.getDataType() + CRLF;

        if (type === 'NTUPLES') {
            outString += ntuplesHead(spectraData, scale, scaleX, encodeFormat, userDefinedParams);
        }

        if (type === 'SIMPLE') {
            outString += simpleHead(spectraData, scale, scaleX, encodeFormat, userDefinedParams);
        }

        return outString;
    }
}

function ntuplesHead(spectraData, scale, scaleX, encodeFormat, userDefinedParams) {
    var outString = '';
    var variableX = spectraData.getSpectraVariable(0);
    var variableY = spectraData.getSpectraVariable(1);
    var variableZ = spectraData.getSpectraVariable(2);

    outString += '##DATA CLASS= NTUPLES' + CRLF;
    outString += '##NUM DIM= 2' + CRLF;
    var nTuplesName = spectraData.getDataType().trim();
    // we set the VarName parameter to the most common ones.
    // These tables contain the number of occurences of each one
    var abscVar = {};
    var sub;
    for (sub = 0; sub < spectraData.getNbSubSpectra(); sub++) {
        spectraData.setActiveElement(sub);
        if (abscVar[spectraData.getXUnits()]) {
            abscVar[spectraData.getXUnits()].value++;
        } else {
            abscVar[spectraData.getXUnits()] = {value: 1, index: sub};
        }
    }

    var keys = Object.keys(abscVar);
    var mostCommon = keys[0];
    var defaultSub = 0;

    for (sub = 1; sub < keys.length; sub++) {
        if (abscVar[keys[sub]].value > abscVar[mostCommon].value) {
            mostCommon = keys[sub];
            defaultSub = abscVar[keys[sub]].index;
        }
    }
    var isComplex = false;
    spectraData.setActiveElement(defaultSub);
    var isNMR = spectraData.getDataType().indexOf('NMR') >= 0;

    if (isNMR) {
        outString += '##.OBSERVE FREQUENCY= ' + spectraData.getParamDouble('observefrequency', 0) + CRLF;
        outString += '##.OBSERVE NUCLEUS= ^' + spectraData.getNucleus() + CRLF;
        outString += '##$DECIM= ' + spectraData.getParamDouble('$DECIM', 0) + CRLF;
        outString += '##$DSPFVS= ' + spectraData.getParamDouble('$DSPFVS', 0) + CRLF;
        outString += '##$FCOR= ' + (Math.floor(spectraData.getParamDouble('$FCOR', 0))) + CRLF;
        if (spectraData.containsParam('$SW_h')) {
            outString += '##$SW_h= ' + spectraData.getParamDouble('$SW_h', 0) + CRLF;
        } else if (spectraData.containsParam('$SW_p')) {
            outString += '##$SW_p= ' + spectraData.getParamDouble('$SW_p', 0) + CRLF;
        }
        outString += '##$SW= ' + spectraData.getParamDouble('$SW', 0) + CRLF;
        outString += '##$TD= ' + (Math.floor(spectraData.getParamDouble('$TD', 0))) + CRLF;
        outString += '##$BF1= ' + spectraData.getParamDouble('$BF1', 0) + CRLF;
        outString += '##$GRPDLY= ' + spectraData.getParamDouble('$GRPDLY', 0) + CRLF;
        outString += '##.DIGITISER RES= ' + spectraData.getParamInt('.DIGITISER RES', 0) + CRLF;
        outString += '##.PULSE SEQUENCE= ' + spectraData.getParamString('.PULSE SEQUENCE', '') + CRLF;
        outString += '##.SOLVENT NAME= ' + spectraData.getSolventName() + CRLF;
        outString += '##$NUC1= <' + spectraData.getNucleus() + '>' + CRLF;
        if (spectraData.containsParam('2D_X_FREQUENCY')) {
            outString += '##$SFO1= ' + spectraData.getParamDouble('2D_X_FREQUENCY', 0) + CRLF;
        } else {
            outString += '##$SFO1= ' + spectraData.getParamDouble('$SFO1', 0) + CRLF;
        }

        if (spectraData.containsParam('2D_X_OFFSET')) {
            outString += '##$OFFSET= ' + spectraData.getParamDouble('2D_X_OFFSET', 0) + CRLF;
        }

        if (spectraData.is2D()) {
            outString += '$$Parameters for 2D NMR Spectrum' + CRLF;
            outString += '##$NUC1= <' + spectraData.getNucleus(2) + '>' + CRLF;
            if (spectraData.containsParam('2D_Y_FREQUENCY')) {
                outString += '##$SFO1= ' + spectraData.getParamDouble('2D_Y_FREQUENCY', 0) + CRLF;
                outString += '##$SFO2= ' + spectraData.getParamDouble('2D_Y_FREQUENCY', 0) + CRLF;
                outString += '##$BF2= ' + spectraData.getParamDouble('2D_Y_FREQUENCY', 0) + CRLF;
            }
            if (spectraData.containsParam('2D_Y_OFFSET')) {
                outString += '##$OFFSET= ' + spectraData.getParamDouble('2D_Y_OFFSET', 0) + CRLF;
            }

            outString += '$$End of Parameters for 2D NMR Spectrum' + CRLF;
        }
    }
    outString += '##NTUPLES=\t' + nTuplesName + CRLF;
    var freq1 = 1;
    var freq2 = 1;
    if (!spectraData.is2D() && spectraData.getNbSubSpectra() > 1 && isNMR) {
        isComplex = true;
    }
    if (isComplex) {
        outString += '##VAR_NAME=\t' + spectraData.getXUnits() + ',\t' + nTuplesName.substring(4) + '/REAL,\t' + nTuplesName.substring(4) + '/IMAG' + CRLF;
        outString += '##SYMBOL=\tX,\tR,\tI' + CRLF;
        outString += '##VAR_TYPE=\tINDEPENDENT,\tDEPENDENT,\tDEPENDENT' + CRLF;
        if (encodeFormat !== 'CSV' || encodeFormat !== 'PAC') {
            outString += '##VAR_FORM=\tAFFN,\tASDF,\tASDF' + CRLF;
        } else {
            outString += '##VAR_FORM=\tAFFN,\tAFFN,\tAFFN' + CRLF;
        }
        outString += '##VAR_DIM=\t' + spectraData.getNbPoints() + ',\t' + spectraData.getNbPoints() + ',\t' + spectraData.getNbPoints() + CRLF;
        outString += '##UNITS=\tHZ' + ',\t' + spectraData.getYUnits() + ',\t' + variableZ.units + CRLF;
        outString += '##FACTOR=\t' + 1.0 / scaleX + ',\t' + 1.0 / scale + ',\t' + 1.0 / scale + CRLF;

        if (spectraData.getXUnits() === 'PPM') {
            freq1 = spectraData.observeFrequencyX();
        }

        outString += '##FIRST=\t' + spectraData.getFirstX() * freq1 + ',\t' + spectraData.getY(0) + ',\t0' + CRLF;
        outString += '##LAST=\t' + spectraData.getLastX() * freq1 + ',\t' + spectraData.getLastY() + ',\t0' + CRLF;
    } else {
        freq1 = 1;
        if (spectraData.is2D()) {
            outString += '##VAR_NAME=\tFREQUENCY1,\tFREQUENCY2,\tSPECTRUM' + CRLF;
            outString += '##SYMBOL=\tF1,\tF2,\tY' + CRLF;
            outString += '##.NUCLEUS=\t' + spectraData.getNucleus(2) + ',\t' + spectraData.getNucleus(1) + CRLF;
            outString += '##VAR_TYPE=\tINDEPENDENT,\tINDEPENDENT,\tDEPENDENT' + CRLF;
            if (encodeFormat !== 'CSV' || encodeFormat !== 'PAC') {
                outString += '##VAR_FORM=\tAFFN,\tAFFN,\tASDF' + CRLF;
            } else {
                outString += '##VAR_FORM=\tAFFN,\tAFFN,\tASDF' + CRLF;
            }
            outString += '##VAR_DIM=\t' + spectraData.getNbSubSpectra() + ',\t' + spectraData.getNbPoints() + ',\t' + spectraData.getNbPoints() + CRLF;
            //We had to change this, for Mestre compatibility
            //outString+=("##UNITS=\tHZ,\t"+ spectraData.getXUnits() + ",\t" + spectraData.getYUnits()+CRLF);
            outString += '##UNITS=\tHZ,\tHZ,\t' + spectraData.getZUnits() + CRLF;
            if (spectraData.getXUnits() === 'PPM') {
                freq1 = spectraData.getParamDouble('2D_Y_FREQUENCY', 1);
            }
            if (spectraData.getYUnits() === 'PPM') {
                freq2 = spectraData.getParamDouble('2D_X_FREQUENCY', 1);
            }
            outString += '##FACTOR=\t1,\t' + freq2 / scaleX + ',\t' + 1.0 / scale + CRLF;
            outString += '##FIRST=\t' + spectraData.getParamDouble('firstY', 0) * freq1 + ',\t' + spectraData.getFirstX() * freq2 + ',\t' + spectraData.getY(0) + CRLF;
            outString += '##LAST=\t' + spectraData.getParamDouble('lastY', 0) * freq1 + ',\t' + spectraData.getLastX() * freq2
            + ',\t' + spectraData.getY(spectraData.getNbPoints() - 1) + CRLF;
        } else {
            outString += '##VAR_NAME=\t' + variableX.varname + ',\t' + variableY.varname + ',\t' + variableX.varname + CRLF;
            outString += '##SYMBOL=\t' + variableX.symbol + ',\t' + variableY.symbol + ',\t' + variableZ.symbol + CRLF;
            outString += '##VAR_TYPE=\t' + variableX.vartype + ',\t' + variableY.vartype + ',\t' + variableZ.vartype + CRLF;
            if (encodeFormat !== 'CSV' || encodeFormat !== 'PAC') {
                outString += '##VAR_FORM=\tAFFN,\tASDF,\tASDF' + CRLF;
            } else {
                outString += '##VAR_FORM=\tAFFN,\tAFFN,\tAFFN' + CRLF;
            }
            outString += '##VAR_DIM=\t' + variableX.vardim + ',\t' + variableY.vardim + ',\t' + variableZ.vardim + CRLF;
            outString += '##UNITS=\tHZ' + ',\t' + spectraData.getYUnits() + ',\t' + variableZ.units + CRLF;
            if (spectraData.getXUnits() === 'PPM') {
                freq1 = spectraData.observeFrequencyX();
            }
            outString += '##FACTOR=\t' + 1.0 / scaleX + ',\t' + 1.0 / scale + CRLF;
            outString += '##FIRST=\t' + variableX.first * freq1 + ',\t' + variableY.first + ',\t' + variableZ.first + CRLF;
            outString += '##LAST=\t' + variableX.last * freq1 + ',\t' + variableY.last + ',\t' + variableZ.last + CRLF;

        }
    }

    //Set the user defined parameters
    if (userDefinedParams !== null) {
        for (var i = userDefinedParams.length - 1; i >= 0; i--) {
            if (spectraData.containsParam(userDefinedParams[i])) {
                outString += '##' + userDefinedParams[i] + '= '
                + spectraData.getParam(userDefinedParams[i], '') + CRLF;
            }
        }
    }
    //Ordinate of the second dimension in case of 2D NMR spectra
    var yUnits = 0;
    var lastY = 0;
    var dy = 1;

    if (spectraData.is2D() && isNMR) {
        yUnits = spectraData.getParamDouble('firstY', 0) * freq1;
        lastY = spectraData.getParamDouble('lastY', 0) * freq1;
        dy = (lastY - yUnits) / (spectraData.getNbSubSpectra() - 1);
    }

    for (sub = 0; sub < spectraData.getNbSubSpectra(); sub++) {
        spectraData.setActiveElement(sub);
        yUnits = spectraData.getParamDouble('firstY', 0) * freq1 + dy * sub;
        outString += '##PAGE= ' + yUnits + CRLF;

        if (spectraData.is2D() && isNMR) {
            outString += '##FIRST=\t' + spectraData.getParamDouble('firstY', 0) * freq1 + ',\t'
            + spectraData.getFirstX() * freq2 + ',\t' + spectraData.getY(0) + CRLF;
        }

        outString += '##DATA TABLE= ';
        if (spectraData.isDataClassPeak()) {
            outString += '(XY..XY), PEAKS' + CRLF;
            for (let point = 0; point < spectraData.getNbPoints(); point++) {
                outString += spectraData.getX(point) + ', ' + spectraData.getY(point) + CRLF;
            }

        } else if (spectraData.isDataClassXY()) {
            if (isNMR) {
                if (spectraData.is2D()) {
                    outString += '(F2++(Y..Y)), PROFILE' + CRLF;
                } else {
                    if (sub % 2 === 0) {
                        outString += '(X++(R..R)), XYDATA' + CRLF;
                    } else {
                        outString += '(X++(I..I)), XYDATA' + CRLF;
                    }
                }
            } else {
                outString += '(X++(Y..Y)), XYDATA' + CRLF;
            }

            var tempString = '';
            var data = new Array(spectraData.getNbPoints());
            for (let point = data.length - 1; point >= 0; point--) {
                data[point] = Math.round((spectraData.getY(point) * scale));
            }

            tempString += Encoder.encode(data,
                spectraData.getFirstX() * scaleX, spectraData.getDeltaX() * scaleX, encodeFormat);
            outString += tempString + CRLF;
        }
    }
    outString += '##END NTUPLES= ' + nTuplesName + CRLF;
    outString += '##END= ';

    spectraData.setActiveElement(0);

    return outString;
}

function simpleHead(spectraData, scale, scaleX, encodeFormat, userDefinedParams) {
    //var variableX = spectraData.getSpectraVariable(0);
    //var variableY = spectraData.getSpectraVariable(1);
    var outString = '';
    if (spectraData.isDataClassPeak()) {
        outString += '##DATA CLASS= PEAK TABLE' + CRLF;
    }
    if (spectraData.isDataClassXY()) {
        outString += '##DATA CLASS= XYDATA' + CRLF;
    }

    spectraData.setActiveElement(0);
    //If it is a NMR spectrum
    if (spectraData.getDataType().indexOf('NMR') >= 0) {
        outString += '##.OBSERVE FREQUENCY= ' + spectraData.getParamDouble('observefrequency', 0) + CRLF;
        outString += '##.OBSERVE NUCLEUS= ^' + spectraData.getNucleus() + CRLF;
        outString += '##$DECIM= ' + (Math.round(spectraData.getParamDouble('$DECIM', 0))) + CRLF;
        outString += '##$DSPFVS= ' + (Math.round(spectraData.getParamDouble('$DSPFVS', 0))) + CRLF;
        outString += '##$FCOR= ' + (Math.round(spectraData.getParamDouble('$FCOR', 0))) + CRLF;
        outString += '##$SW_h= ' + spectraData.getParamDouble('$SW_h', 0) + CRLF;
        outString += '##$SW= ' + spectraData.getParamDouble('$SW', 0) + CRLF;
        outString += '##$TD= ' + (Math.round(spectraData.getParamDouble('$TD', 0))) + CRLF;
        outString += '##$GRPDLY= ' + spectraData.getParamDouble('$GRPDLY', 0) + CRLF;
        outString += '##$BF1= ' + spectraData.getParamDouble('$BF1', 0) + CRLF;
        outString += '##$SFO1= ' + spectraData.getParamDouble('$SFO1', 0) + CRLF;
        outString += '##$NUC1= <' + spectraData.getNucleus() + '>' + CRLF;
        outString += '##.SOLVENT NAME= ' + spectraData.getSolventName() + CRLF;

    }
    outString += '##XUNITS=\t' + spectraData.getXUnits() + CRLF;
    outString += '##YUNITS=\t' + spectraData.getYUnits() + CRLF;
    outString += '##NPOINTS=\t' + spectraData.getNbPoints() + CRLF;
    outString += '##FIRSTX=\t' + spectraData.getFirstX() + CRLF;
    outString += '##LASTX=\t' + spectraData.getLastX() + CRLF;
    outString += '##FIRSTY=\t' + spectraData.getFirstY() + CRLF;
    outString += '##LASTY=\t' + spectraData.getLastY() + CRLF;
    if (spectraData.isDataClassPeak()) {
        outString += '##XFACTOR=1' + CRLF;
        outString += '##YFACTOR=1' + CRLF;
    } else if (spectraData.isDataClassXY()) {
        outString += '##XFACTOR= ' + 1.0 / scaleX + CRLF;
        outString += '##YFACTOR= ' + 1.0 / scale + CRLF;
    }
    outString += '##MAXY= ' + spectraData.getMaxY() + CRLF;
    outString += '##MINY= ' + spectraData.getMinY() + CRLF;

    //Set the user defined parameters
    if (userDefinedParams !== null) {
        for (var i = userDefinedParams.length - 1; i >= 0; i--) {
            if (spectraData.containsParam(userDefinedParams[i])) {
                outString += '##' + userDefinedParams[i] + '= '
                + spectraData.getParam(userDefinedParams[i], '') + CRLF;
            }
        }
    }


    if (spectraData.isDataClassPeak()) {
        outString += '##PEAK TABLE= (XY..XY)' + CRLF;
        for (var point = 0; point < spectraData.getNbPoints(); point++) {
            outString += spectraData.getX(point) + ', ' + spectraData.getY(point) + CRLF;
        }
        outString += '##END ';

    } else if (spectraData.isDataClassXY()) {
        outString += '##DELTAX= ' + spectraData.getDeltaX() + CRLF;
        outString += '##XYDATA=(X++(Y..Y))' + CRLF;
        var tempString = '';
        var data = new Array(spectraData.getNbPoints());
        for (let point = data.length - 1; point >= 0; point--) {
            data[point] = Math.round(spectraData.getY(point) * scale);
        }

        tempString += Encoder.encode(data, spectraData.getFirstX() * scaleX, spectraData.getDeltaX() * scaleX, encodeFormat);

        outString += tempString + CRLF;
        outString += '##END= ';
    }

    spectraData.setActiveElement(0);
    return outString;
}

module.exports = JcampCreator;

