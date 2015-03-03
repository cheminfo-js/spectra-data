'use strict';

var Data = require('..');

var fs = require('fs');

function createSpectraData(filename, label, data) {

    var nmr = Data.NMR.fromJcamp(
        fs.readFileSync(__dirname + filename).toString()
    );

    console.log(nmr.getFirstX());
};


createSpectraData("/data/ethylvinylether/1h.jdx");
