/**
 * Created by acastillo on 4/26/16.
 */
var rotate = require("./rotate");

function digitalFilter(spectraData, options){
    var nPoints = 0;
    if(options.nbPoints){
        nPoints = options.nbPoints;
    }
    else{
        if(options.brukerFilter){
            //TODO Determine the number of points to shift, or the ph1 correction
            nPoints = 0;
        }
    }

    var nbSubSpectra = spectraData.getNbSubSpectra();
    if (nPoints != 0){
        for (var iSubSpectra = 0 ; iSubSpectra < nbSubSpectra; iSubSpectra++){
            spectraData.setActiveElement(iSubSpectra);
            rotate(spectraData.getYData(),nPoints);
            if(options.rotateX){
                rotate(spectraData.getXData(),nPoints);
                spectraData.setFirstX(spectraData.getX(0));
                spectraData.setLastX(spectraData.getX(spectraData.getNbPoints()-1));
            }
        }
    }
    return spectraData;
}

module.exports = digitalFilter;