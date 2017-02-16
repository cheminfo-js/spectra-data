'use strict';

var simule2D = require('../simule2DNmrSpectrum');

var table = [
    { fromDiaID: 'did@`@fTeYWaj@@@GzP`HeT',
    toDiaID: 'did@`@fTf[Waj@@bJ@_iB@bUP',
    fromAtoms: [ 15, 16, 17 ],
    toAtoms: [ 11, 12 ],
    fromLabel: 'H',
    toLabel: 'H',
    pathLength: 3,
    fromChemicalShift: 1.27130002,
    toChemicalShift: 4,
    fromAtomLabel: 'H',
    toAtomLabel: 'H',
    j: 0.11 },
    { fromDiaID: 'did@`@fTeYWaj@@@GzP`HeT',
        toDiaID: 'did@`@fTeYWaj@@@GzP`HeT',
        fromAtoms: [ 15, 16, 17 ],
        toAtoms: [ 16, 17, 15 ],
        fromLabel: 'H',
        toLabel: 'H',
        pathLength: 2,
        fromChemicalShift: 1.27130002,
        toChemicalShift: 1.27130002,
        fromAtomLabel: 'H',
        toAtomLabel: 'H',
        j: 0.11 }
];

var spectrum = simule2D(table, {});
// console.log(spectrum)