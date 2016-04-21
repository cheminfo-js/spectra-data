/**
 * Created by abol on 4/20/16.
 */

function zeroFilling(spectraData, zeroFillingX, zeroFillingY){
    var nbXPoints = spectraData.getNbPoints();
    var nNewXPoints = nbXPoints + this.zeroFillingX;
    var nbSubSpectra = spectraData.getNbSubSpectra();
    var zeroPadding = spectraData.getParamDouble("$$ZEROPADDING", 0);
    if (zeroFillingX != 0){
        for (iSubSpectra = 0 ; iSubSpectra < nbSubSpectra; iSubSpectra++){
            spectraData.setActiveElement(iSubSpectra);
            var y = spectraData.getYData();
            for (var k = nbXPoints; k < zeroFillingX; k++){
                y.push(0)
            }
            if (zeroFillingX < nbXPoints){
                y.splice(zeroFillingX, y.length-1);
            }
        }
    }
    return spectraData;
    // @TODO implement zeroFillingY
}
module.exports = zeroFilling;