"use strict";
/**
 * Created by abol on 5/31/16.
 */

function whittakerFirstDifferences(data, weights, lambda) {
    var result = jQuery.extend(true,{},data);
    whittakerFirstDifferencesI(result, weights, lambda);
    return result;
}

function whittakerFirstDifferencesI(data, weights, lambda) {
    var nbDataPoints = data.length;
    intW info = new intW(0); // @TODO ver homologo en JS
    var ipiv = new Array(nbDataPoints);

    // construct off diagonal arrays
    var dl = new Array(nbDataPoints - 1).fill(-1 * lambda);
    var du = jQuery.extend(true,{},dl);
    var du2 = new Array(nbDataPoints - 2);

    // diagonal
    var d = new Array(nbDataPoints);

    d[0] = lambda + weights[0];
    d[nbDataPoints - 1] = lambda + weights[nbDataPoints - 1];

    for (var i = 1; i < nbDataPoints - 1; i++){
        d[i] = 2 * lambda + weights[i];
    }

    Dgttrf.dgttrf(nbDataPoints, dl, 0, d, 0, du, 0, du2, 0, ipiv, 0, info);

    var z = data;

    for (var i = 0; i < nbDataPoints; i++){
        z[i] *= weights[i];
    }

    Dgttrs.dgttrs("N", nbDataPoints, 1, dl, 0, d, 0, du, 0, du2, 0, ipiv, 0, z, 0, nbDataPoints, info);
}