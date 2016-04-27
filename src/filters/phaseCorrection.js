/**
 * Created by acastillo on 4/26/16.
 */
function phaseCorrection(spectraData, ph0, ph1){
    //System.out.println(spectraData.toString());
    // int nbPoints = spectraData.getNbPoints();
    double[] reData = spectraData.getSubSpectraDataY(0);
    double[] imData = spectraData.getSubSpectraDataY(1);

    for(int k=this.corrections.size()-toApply;k<this.corrections.size();k++){
        Point2D phi = this.corrections.elementAt(k);

        double phi0 = phi.getX();
        double phi1 = phi.getY();

        if(DEBUG) System.out.println(" ph0 = "+phi0);
        if(DEBUG) System.out.println(" ph1 = "+phi1);

        double delta = phi1 / nbPoints;
        double alpha = 2 * Math.pow(Math.sin(delta / 2), 2);
        double beta = Math.sin(delta);
        double cosTheta = Math.cos(phi0);
        double sinTheta = Math.sin(phi0);
        double cosThetaNew, sinThetaNew;

        double reTmp, imTmp;
        int index;
        for (int i = 0; i < nbPoints; i++) {
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
        toApply--;
    }

    spectraData.resetMinMax();
    spectraData.updateDefaults();
    spectraData.updateY();
    spectraData.putParam("PHC0", getPhi0());
    spectraData.putParam("PHC1", getPhi1());
    if (this.jsonResult!=null) {
        JSONObject jsonObject=new JSONObject();
        try {
            jsonObject.put("filter", this.getScriptingCommand());
            jsonObject.put("status", "OK");
            jsonObject.put("value", 0);
            jsonResult.put(jsonResult.length(),jsonObject);
        } catch (JSONException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }}
}

module.exports = phaseCorrection;