'use strict';

/**
* class encodes a integer vector as a String in order to store it in a text file.
* The algorithms used to encode the data are describe in:
*            http://www.iupac.org/publications/pac/pdf/2001/pdf/7311x1765.pdf
* Created by acastillo on 3/2/16.
*/
const newLine = '\r\n';

const pseudoDigits = [['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              ['@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
              ['@', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'],
              ['%', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'],
              ['%', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r'],
              [' ', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 's']];

const SQZ_P = 1;
const SQZ_N = 2;
const DIF_P = 3;
const DIF_N = 4;
const DUP = 5;
const MaxLinelength = 100;

/**
 * This function encodes the given vector. The encoding format is specified by the
 * encoding option
 * @param {Array} data
 * @param {number} firstX
 * @param {number} intervalX
 * @param {string} encoding: ('FIX','SQZ','DIF','DIFDUP','CVS','PAC') Default 'DIFDUP'
 * @return {string}
 */
function encode(data, firstX, intervalX, encoding) {
    switch (encoding) {
        case 'FIX':
            return fixEncoding(data, firstX, intervalX);
        case 'SQZ':
            return squeezedEncoding(data, firstX, intervalX);
        case 'DIF':
            return differenceEncoding(data, firstX, intervalX);
        case 'DIFDUP':
            return differenceDuplicateEncoding(data, firstX, intervalX);
        case 'CSV':
            return commaSeparatedValuesEncoding(data, firstX, intervalX);
        case 'PAC':
            return packedEncoding(data, firstX, intervalX);
        default:
            return differenceEncoding(data, firstX, intervalX);
    }
}

/**
 * @private
 * No data compression used. The data is separated by a comma(',').
 * @param {Array} data
 * @param {number} firstX
 * @param {number} intervalX
 * @return {string}
 */
function commaSeparatedValuesEncoding(data, firstX, intervalX) {
    return fixEncoding(data, firstX, intervalX, ',');
}

/**
 * @private
 * No data compression used. The data is separated by the specified separator.
 * @param {Array} data
 * @param {number} firstX
 * @param {number} intervalX
 * @param {string} separator, The separator character
 * @return {string}
 */
function fixEncoding(data, firstX, intervalX, separator) {
    if (!separator) {
        separator = ' ';
    }
    var outputData = '';
    var j = 0;
    var TD = data.length;
    var i;
    while (j < TD - 7) {
        outputData += Math.ceil(firstX + j * intervalX);
        for (i = 0; i < 8; i++) {
            outputData += separator + data[j++];
        }
        outputData += newLine;
    }
    if (j < TD) {
        //We add last numbers
        outputData += Math.ceil(firstX + j * intervalX);
        for (i = j; i < TD; i++) {
            outputData += separator + data[i];
        }
    }
    return outputData;
}
/**
 * @private
 * No data compression used. The data is separated by the sign of the number.
 * @param {Array} data
 * @param {number} firstX
 * @param {number} intervalX
 * @return {string}
 */
function packedEncoding(data, firstX, intervalX) {
    var outputData = '';
    var j = 0;
    var TD = data.length;
    var i;

    while (j < TD - 7) {
        outputData += Math.ceil(firstX + j * intervalX);
        for (i = 0; i < 8; i++) {
            if (data[j] < 0) {
                outputData += '-' + data[j++];
            } else {
                outputData += '+' + data[j++];
            }
        }
        outputData += newLine;
    }
    if (j < TD) {
        //We add last numbers
        outputData += Math.ceil(firstX + j * intervalX);
        for (i = j; i < TD; i++) {
            if (data[i] < 0) {
                outputData += '-' + data[i];
            } else {
                outputData += '+' + data[i];
            }
        }
    }
    return outputData;
}
/**
 * @private
 * Data compression is possible using the squeezed form (SQZ) in which the delimiter, the leading digit,
 * and sign are replaced by a pseudo-digit from Table 1. For example, the Y-values 30, 32 would be
 * represented as C0C2.
 * @param {Array} data
 * @param {number} firstX
 * @param {number} intervalX
 * @return {string}
 */
function squeezedEncoding(data, firstX, intervalX) {
    var outputData = '';
    //String outputData = new String();
    var j = 0;
    var TD = data.length;
    var i;

    while (j < TD - 10) {
        outputData += Math.ceil(firstX + j * intervalX);
        for (i = 0; i < 10; i++) {
            outputData += squeezedDigit(data[j++].toString());
        }
        outputData += newLine;
    }
    if (j < TD) {
        //We add last numbers
        outputData += Math.ceil(firstX + j * intervalX);
        for (i = j; i < TD; i++) {
            outputData += squeezedDigit(data[i].toString());
        }
    }

    return outputData;
}

/**
 * @private
 * Duplicate suppression encoding
 * @param {Array} data
 * @param {number} firstX
 * @param {number} intervalX
 * @return {string}
 */
function differenceDuplicateEncoding(data, firstX, intervalX) {
    var mult = 0;
    var index = 0;
    var charCount = 0;
    var i;
    //We built a string where we store the encoded data.
    var encodData = '';
    var encodNumber = '';
    var temp = '';

    //We calculate the differences vector
    var diffData = new Array(data.length - 1);
    for (i = 0; i < diffData.length; i++) {
        diffData[i] = data[i + 1] - data[i];
    }

    //We simulate a line carry
    var numDiff = diffData.length;
    while (index < numDiff) {
        if (charCount === 0) {//Start line
            encodNumber = Math.ceil(firstX + index * intervalX) + squeezedDigit(data[index].toString()) + differenceDigit(diffData[index].toString());
            encodData += encodNumber;
            charCount += encodNumber.length;
        } else {
            //Try to insert next difference
            if (diffData[index - 1] === diffData[index]) {
                mult++;
            } else {
                if (mult > 0) {//Now we know that it can be in line
                    mult++;
                    encodNumber = duplicateDigit(mult.toString());
                    encodData += encodNumber;
                    charCount += encodNumber.length;
                    mult = 0;
                    index--;
                } else {
                    //Mirar si cabe, en caso contrario iniciar una nueva linea
                    encodNumber = differenceDigit(diffData[index].toString());
                    if (encodNumber.length + charCount < MaxLinelength) {
                        encodData += encodNumber;
                        charCount += encodNumber.length;
                    } else {//Iniciar nueva linea
                        encodData += newLine;
                        temp = Math.ceil(firstX + index * intervalX) + squeezedDigit(data[index].toString()) + encodNumber;
                        encodData += temp;//Each line start with first index number.
                        charCount = temp.length;
                    }
                }
            }
        }
        index++;
    }
    if (mult > 0) {
        encodData += duplicateDigit((mult + 1).toString());
    }
    //We insert the last data from fid. It is done to control of data
    //The last line start with the number of datas in the fid.
    encodData += newLine + Math.ceil(firstX + index * intervalX) + squeezedDigit(data[index].toString());

    return encodData;
}

/**
 * @private
 * Differential encoding
 * @param {Array} data
 * @param {number} firstX
 * @param {number} intervalX
 * @return {string}
 */
function differenceEncoding(data, firstX, intervalX) {
    var index = 0;
    var charCount = 0;
    var i;

    var encodData = '';
    var encodNumber = '';
    var temp = '';

    //We calculate the differences vector
    var diffData = new Array(data.length - 1);
    for (i = 0; i < diffData.length; i++) {
        diffData[i] = data[i + 1] - data[i];
    }

    var numDiff = diffData.length;
    while (index < numDiff) {
        if (charCount === 0) {
            //We convert the first number.
            encodNumber = Math.ceil(firstX + index * intervalX) + squeezedDigit(data[index].toString()) + differenceDigit(diffData[index].toString());
            encodData += encodNumber;
            charCount += encodNumber.length;
        } else {
            encodNumber = differenceDigit(diffData[index].toString());
            if (encodNumber.length + charCount < MaxLinelength) {
                encodData += encodNumber;
                charCount += encodNumber.length;
            } else {
                encodData += newLine;
                temp = Math.ceil(firstX + index * intervalX) + squeezedDigit(data[index].toString()) + encodNumber;
                encodData += temp;//Each line start with first index number.
                charCount = temp.length;
            }
        }
        index++;
    }
    //We insert the last number from data. It is done to control of data
    encodData += newLine + Math.ceil(firstX + index * intervalX) + squeezedDigit(data[index].toString());

    return encodData;
}

/**
 * @private
 * Convert number to the ZQZ format, using pseudo digits.
 * @param {number} num
 * @return {string}
 */
function squeezedDigit(num) {
    var SQZdigit = '';
    if (num.charAt(0) === '-') {
        SQZdigit += pseudoDigits[SQZ_N][num.charAt(1)];
        if (num.length > 2) {
            SQZdigit += num.substring(2);
        }
    } else {
        SQZdigit += pseudoDigits[SQZ_P][num.charAt(0)];
        if (num.length > 1) {
            SQZdigit += num.substring(1);
        }
    }

    return SQZdigit;
}
/**
 * @private
 * Convert number to the DIF format, using pseudo digits.
 * @param {number} num
 * @return {string}
 */
function differenceDigit(num) {
    var DIFFdigit = '';

    if (num.charAt(0) === '-') {
        DIFFdigit += pseudoDigits[DIF_N][num.charAt(1)];
        if (num.length > 2) {
            DIFFdigit += num.substring(2);
        }

    } else {
        DIFFdigit += pseudoDigits[DIF_P][num.charAt(0)];
        if (num.length > 1) {
            DIFFdigit += num.substring(1);
        }

    }

    return DIFFdigit;
}
/**
 * @private
 * Convert number to the DUP format, using pseudo digits.
 * @param {number} num
 * @return {string}
 */
function duplicateDigit(num) {
    var DUPdigit = '';
    DUPdigit += pseudoDigits[DUP][num.charAt(0)];
    if (num.length > 1) {
        DUPdigit += num.substring(1);
    }

    return DUPdigit;
}

module.exports = {
    encode,
    fixEncoding,
    commaSeparatedValuesEncoding,
    packedEncoding,
    squeezedEncoding,
    differenceDuplicateEncoding,
    differenceEncoding
};
