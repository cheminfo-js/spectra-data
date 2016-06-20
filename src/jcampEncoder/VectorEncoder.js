'use strict';
/**
* class encodes a integer vector as a String in order to store it in a text file.
* The algorithms used to encode the data are describe in:
*            http://www.iupac.org/publications/pac/pdf/2001/pdf/7311x1765.pdf
* Created by acastillo on 3/2/16.
*/
var newLine="\r\n";

var pseudoDigits=[['0','1','2','3','4','5','6','7','8','9'],
              ['@','A','B','C','D','E','F','G','H','I'],
              ['@','a','b','c','d','e','f','g','h','i'],
              ['%','J','K','L','M','N','O','P','Q','R'],
              ['%','j','k','l','m','n','o','p','q','r'],
              [' ','S','T','U','V','W','X','Y','Z','s']];

var SQZ_P= 1, SQZ_N= 2, DIF_P=3, DIF_N=4, DUP=5, MaxLinelength=100;

/**
 * This function encodes the given vector. The encoding format is specified by the
 * encoding option
 * @param data
 * @param firstX
 * @param intervalX
 * @param encoding: ('FIX','SQZ','DIF','DIFDUP','CVS','PAC') Default 'DIFDUP'
 * @returns {String}
 */
var encode = function(data, firstX, intervalX, encoding){
    if(encoding==("FIX"))
        return FIXencod(data, firstX,intervalX);
    if(encoding==("SQZ"))
        return SQZencod(data, firstX,intervalX);
    if(encoding==("DIF"))
        return DIFencod(data, firstX,intervalX);
    if(encoding==("DIFDUP"))
        return DIFDUPencod(data, firstX,intervalX);
    if(encoding==("CSV"))
        return CSVencod(data, firstX,intervalX);
    if(encoding==("PAC"))
        return PACencod(data, firstX,intervalX);
    //Default
    return DIFencod(data, firstX,intervalX);
}

/**
 * No data compression used. The data is separated by a comma(',').
 * @param data
 * @return
 */
var CSVencod =  function(data, firstX, intervalX){
    return FIXencod(data, firstX, intervalX, ",");
};

/**
 * No data compression used. The data is separated by the specified separator.
 * @param data
 * @param separator, The separator character
 * @return
 */
var FIXencod =  function(data, firstX, intervalX, separator){
    if(!separator)
        separator = " ";
    var outputData = "";
    var j=0, TD = data.length, i;
    while(j<TD-7){
        outputData+=Math.ceil(firstX+j*intervalX);
        for(i = 0;i<8;i++)
            outputData+=separator+data[j++];
        outputData+=newLine;
    }
    if(j<TD){
        //We add last numbers
        outputData+=Math.ceil(firstX+j*intervalX);
        for(i=j;i<TD;i++)
            outputData+=separator + data[i];
    }
    return outputData;
};
/**
 * No data compression used. The data is separated by the sign of the number.
 * @param data
 * @return
 */
var PACencod = function(data, firstX, intervalX){
    var outputData = "";
    var j=0, TD = data.length, i;

    while(j<TD-7){
        outputData+=Math.ceil(firstX+j*intervalX);
        for(i = 0;i<8;i++){
            if(data[j]<0)
                outputData+="-"+data[j++];
            else
                outputData+="+"+data[j++];
        }
        outputData+=newLine;
    }
    if(j<TD){
        //We add last numbers
        outputData+=Math.ceil(firstX+j*intervalX);
        for(i=j;i<TD;i++){
            if(data[i]<0)
                outputData+="-"+data[i];
            else
                outputData+="+"+data[i];
        }
    }
    return outputData;
};
/**
 * Data compression is possible using the squeezed form (SQZ) in which the delimiter, the leading digit,
 * and sign are replaced by a pseudo-digit from Table 1. For example, the Y-values 30, 32 would be
 * represented as C0C2.
 * @param data
 * @return String
 */
var SQZencod = function(data, firstX, intervalX){
    var outputData = "";
    //String outputData = new String();
    var j=0, TD = data.length, i;

    while(j<TD-10){
        outputData+=Math.ceil(firstX+j*intervalX);
        for(i = 0;i<10;i++)
            outputData+=SQZDigit(data[j++].toString());
        outputData+=newLine;
    }
    if(j<TD){
        //We add last numbers
        outputData+=Math.ceil(firstX+j*intervalX);
        for(i = j;i<TD;i++)
            outputData+=SQZDigit(data[i].toString());
    }

    return outputData;
};

/**
 * Duplicate suppression encoding
 * @param data
 * @return
 */
var DIFDUPencod = function(data, firstX, intervalX){
    var mult=0, index=0, charCount= 0, i;
    //We built a string where we store the encoded data.
    var encodData = "",encodNumber = "",temp = "";

    //We calculate the differences vector
    var diffData = new Array(data.length-1);
    for(i=0;i<diffData.length;i++){
        diffData[i]= data[i+1]-data[i];
    }

    //We simulate a line carry
    var numDiff = diffData.length;
    while(index<numDiff){
        if(charCount==0){//Start line
            encodNumber = Math.ceil(firstX+index*intervalX)+SQZDigit(data[index].toString())+DIFDigit(diffData[index].toString());
            encodData+=encodNumber;
            charCount+=encodNumber.length;
        }
        else{
            //Try to insert next difference
            if(diffData[index-1]==diffData[index]){
                mult++;
            }
            else{
                if(mult>0){//Now we know that it can be in line
                    mult++;
                    encodNumber=DUPDigit(mult.toString());
                    encodData+=encodNumber;
                    charCount+=encodNumber.length;
                    mult=0;
                    index--;
                }
                else{
                    //Mirar si cabe, en caso contrario iniciar una nueva linea
                    encodNumber=DIFDigit(diffData[index].toString());
                    if(encodNumber.length+charCount<MaxLinelength){
                        encodData+=encodNumber;
                        charCount+=encodNumber.length;
                    }
                    else{//Iniciar nueva linea
                        encodData+=newLine;
                        temp=Math.ceil(firstX+index*intervalX)+SQZDigit(data[index].toString())+encodNumber;
                        encodData+=temp;//Each line start with first index number.
                        charCount=temp.length;
                    }
                }
            }
        }
        index++;
    }
    if(mult>0)
        encodData+=DUPDigit((mult+1).toString());
    //We insert the last data from fid. It is done to control of data
    //The last line start with the number of datas in the fid.
    encodData+=newLine+Math.ceil(firstX+index*intervalX)+SQZDigit(data[index].toString());

    return encodData;
};

/**
 * Differential encoding
 * @param data
 * @return
 */
var DIFencod = function(data, firstX, intervalX){
    var index=0, charCount= 0,i;

    var encodData = "";
    //String encodData = new String();
    var encodNumber = "", temp = "";

    //We calculate the differences vector
    var diffData = new Array(data.length-1);
    for(i=0;i<diffData.length;i++){
        diffData[i]= data[i+1]-data[i];
    }

    index=0;
    var numDiff = diffData.length;
    while(index<numDiff){
        if(charCount==0){//Iniciar linea
            //We convert the first number.
            encodNumber = Math.ceil(firstX+index*intervalX)+SQZDigit(data[index].toString())+DIFDigit(diffData[index].toString());
            encodData+=encodNumber;
            charCount+=encodNumber.length;
        }
        else{
            //Mirar si cabe, en caso contrario iniciar una nueva linea
            encodNumber=DIFDigit(diffData[index].toString());
            if(encodNumber.length+charCount<MaxLinelength){
                encodData+=encodNumber;
                charCount+=encodNumber.length;
            }
            else{//Iniciar nueva linea
                encodData+=newLine;
                temp=Math.ceil(firstX+index*intervalX)+SQZDigit(data[index].toString())+encodNumber;
                encodData+=temp;//Each line start with first index number.
                charCount=temp.length;
            }
        }
        index++;
    }
    //We insert the last number from data. It is done to control of data
    encodData+=newLine+Math.ceil(firstX+index*intervalX)+SQZDigit(data[index].toString());

    return encodData;
};

/**
 * Convert number to the ZQZ format, using pseudo digits.
 * @param num
 * @return
 */
var SQZDigit = function(num){
    //console.log(num+" "+num.length);
    var SQZdigit = "";
    if(num.charAt(0)=='-'){
        SQZdigit+=pseudoDigits[SQZ_N][Number(num.charAt(1))];
        if(num.length>2)
            SQZdigit+=num.substring(2);
    }
    else{
        SQZdigit+=pseudoDigits[SQZ_P][Number(num.charAt(0))];
        if(num.length>1)
            SQZdigit+=num.substring(1);
    }

    return SQZdigit;
};
/**
 * Convert number to the DIF format, using pseudo digits.
 * @param num
 * @return
 */
var DIFDigit = function(num){
    var DIFFdigit = "";

    if(num.charAt(0)=='-'){
        DIFFdigit+=pseudoDigits[DIF_N][Number(num.charAt(1))];
        if(num.length>2)
            DIFFdigit+=num.substring(2);

    }
    else{
        DIFFdigit+=pseudoDigits[DIF_P][Number(num.charAt(0))];
        if(num.length>1)
            DIFFdigit+=num.substring(1);

    }

    return DIFFdigit;
};
/**
 * Convert number to the DUP format, using pseudo digits.
 * @param num
 * @return
 */
function DUPDigit(num){
    var DUPdigit = "";
    DUPdigit+=pseudoDigits[DUP][Number(num.charAt(0))];
    if(num.length>1)
        DUPdigit+=num.substring(1);

    return DUPdigit;
}

module.exports = {
    encode,
    FIXencod,
    CSVencod,
    PACencod,
    SQZencod,
    DIFDUPencod,
    DIFencod
};

'mode strict';




