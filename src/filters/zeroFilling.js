'use strict';
/**
 * This function make a zero filling to each Active element in a SD instance.
 * @param {SD} spectra-data instance.
 * @param {number} zeroFillingX - number of points that FID will have, if is it lower
 * than initial number of points, the FID will be spliced
 */


function zeroFilling(spectraData, zeroFillingX) {
    var nbSubSpectra = spectraData.getNbSubSpectra();
    //var zeroPadding = spectraData.getParamDouble("$$ZEROPADDING", 0);
    var nbXPoints, lastX, deltaX, k, x, y;
    if (zeroFillingX !== 0) {
        for (var iSubSpectra = 0; iSubSpectra < nbSubSpectra; iSubSpectra++) {
            spectraData.setActiveElement(iSubSpectra);
            nbXPoints = spectraData.getNbPoints();
            y = spectraData.getYData();
            x = spectraData.getXData();
            lastX = spectraData.getLastX();
            deltaX = (lastX - x[0]) / (nbXPoints - 1);
            for (k = nbXPoints; k < zeroFillingX; k++) {
                y.push(0);
                x.push(lastX + deltaX);
            }
            if (zeroFillingX < nbXPoints) {
                y.splice(zeroFillingX, y.length - 1);
                x.splice(zeroFillingX, x.length - 1);
            }
            spectraData.setFirstX(x[0]);
            spectraData.setLastX(x[x.length - 1]);
        }
    }

    spectraData.setActiveElement(0);
    return spectraData;
    // @TODO implement zeroFillingY for 2D spectra
}
module.exports = zeroFilling;
