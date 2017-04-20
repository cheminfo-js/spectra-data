'use strict';

function xRange(start, end, nbPoints) {
    var vector = new Array(nbPoints).fill(start);
    var jump = (end - start) / (nbPoints - 1);
    for (let i = 0; i < nbPoints; i++) {
        vector[i] += jump * i;
    }
    return vector;
}

function getDataFromText(text) {
    var x = [];
    var y = [];
    var lines=text.split(/[\r\n]+/);
    for (var line of lines) {
        if (line.match(/^[0-9.,\t;eE-]+$/)) {
            var fields=line.split(/[\t,;]+/); // empty space may be would added...
            if (fields.length === 2) {
                x.push(Number(fields[0]));
                y.push(Number(fields[1]));
            }
        }
    }
    return {x: x, y: y};
}

module.exports = {
    xRange: xRange,
    getDataFromText: getDataFromText
};
