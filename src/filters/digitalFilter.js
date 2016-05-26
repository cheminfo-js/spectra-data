'use strict';
/**
 * Created by acastillo on 4/26/16.
 */
var rotate = require("./rotate");

function digitalFilter(spectraData, options){
    var nbPoints = 0;
    if(options.nbPoints){
        nbPoints = options.nbPoints;
    }
    else{
        if(options.brukerFilter){
            //TODO Determine the number of points to shift, or the ph1 correction
            //based on DECIM and DSPSVF parameters
            nbPoints = 0;
        }
    }

    var nbSubSpectra = spectraData.getNbSubSpectra();
    if (nbPoints != 0){
        for (var iSubSpectra = 0 ; iSubSpectra < nbSubSpectra; iSubSpectra++){
            spectraData.setActiveElement(iSubSpectra);
            rotate(spectraData.getYData(),nbPoints);
            if(options.rotateX){
                rotate(spectraData.getXData(),nbPoints);
                spectraData.setFirstX(spectraData.getX(0));
                spectraData.setLastX(spectraData.getX(spectraData.getNbPoints()-1));
            }
        }
    }
    spectraData.setActiveElement(0);
    return spectraData;
}

module.exports = digitalFilter;