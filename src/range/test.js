'use strict';

const fs = require('fs');
const Ranges = require('./Ranges');
const spectraData = require('../..');
const prediction = JSON.parse(fs.readFileSync(__dirname + '/__tests__/prediction.json', 'utf8'));
var ranges = Ranges.fromPrediction(prediction, {});
for (var i = 0; i < ranges.length; i++) {
    console.log(JSON.stringify(ranges[i]))
    console.log("\n")
}

// var index = ranges.toIndex();
// console.log(JSON.stringify(index));




