'use strict';

var Data = require('..');

var fs = require('fs');

function createSpectraData(filename, label, data) {

    var result = Data.SD.fromJcamp(
        fs.readFileSync(__dirname + filename).toString()
    );

    console.log(result.getFirstX());
};


createSpectraData("/data/ethylvinylether/1h.jdx");
