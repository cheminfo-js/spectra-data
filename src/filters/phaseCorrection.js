'use strict';

/**
 * Phase correction filter
 * @param {SD} spectraData - SD instance
 * @param {number} [phi0 = 0] - value
 * @param {number} [phi1 = 0] - value
 * @return {SD} returns the modified spectraData
 */
function phaseCorrection(spectraData, phi0, phi1) {

    phi0 = Number.isFinite(phi0) ? phi0 : 0;
    phi1 = Number.isFinite(phi1) ? phi1 : 0;

    var nbPoints = spectraData.getNbPoints();
    var reData = spectraData.getYData(0);
    var imData = spectraData.getYData(1);
    //var corrections = spectraData.getParam("corrections");

    //for(var k=0;k<corrections.length;k++){
    //    Point2D phi = corrections.elementAt(k);

        //double phi0 = phi.getX();
        //double phi1 = phi.getY();

    var delta = phi1 / nbPoints;
    var alpha = 2 * Math.pow(Math.sin(delta / 2), 2);
    var beta = Math.sin(delta);
    var cosTheta = Math.cos(phi0);
    var sinTheta = Math.sin(phi0);
    var cosThetaNew, sinThetaNew;

    var reTmp, imTmp;
    var index;
    for (var i = 0; i < nbPoints; i++) {
        index = nbPoints - i - 1;
        index = i;
        reTmp = reData[index] * cosTheta - imData[index] * sinTheta;
        imTmp = reData[index] * sinTheta + imData[index] * cosTheta;
        reData[index] = reTmp;
        imData[index] = imTmp;
            // calculate angles i+1 from i
        cosThetaNew = cosTheta - (alpha * cosTheta + beta * sinTheta);
        sinThetaNew = sinTheta - (alpha * sinTheta - beta * cosTheta);
        cosTheta = cosThetaNew;
        sinTheta = sinThetaNew;
    }
        //toApply--;
    //}

    spectraData.resetMinMax();
    //spectraData.updateDefaults();
    //spectraData.updateY();
    spectraData.putParam('PHC0', phi0);
    spectraData.putParam('PHC1', phi1);

    return spectraData;
}

module.exports = phaseCorrection;
