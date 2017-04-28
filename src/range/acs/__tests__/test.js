'use strict';


// `<sup>1</sup>H NMR (CDCl3, 400MHz) δ: 1.50 (CH<sub>3CO, 2H, dd quint hex d hex, <i>J</i>= 7.0,6.0,5.0,4.0,3.0,2.0), 3.50 (1'H, s), 4.00-5.00 (1H, m), 6.00-7.00 (3H, m), 8.00-9.00 (m, 3H, 8.1 (s br), 8.4 (dt, <i>J</i> 7.0,3.0)).`
/**
 *
 * `$sampleName: <sup>1</sup>H NMR ($solvent, $frequencyObserved MHz) δ: 1.50 (s, 1H), 0.72 (d, 1H, J = 4.0 Hz), `  It is a example when 2D data is not collected
 * `$options.sampleName : <sup>1</sup>H NMR ($options.solvent, $options.frequencyObserved MHz) δ: 1.50 (1H, <i>s</i>, H1"), 0.72 (1H, d, J = 4.0 Hz, H4"), 2.90 (3H, s, OCH<sub>3</sub>).`  It is a example when 2D data is collected
 *
 */
var FS = require('fs');
var ACS = require('../acs');
const Ranges = require('../../Ranges');

var ranges = JSON.parse(FS.readFileSync(__dirname + '/ranges.json'));
//
describe('ACS tests: formating and parsing', function () {
    it('format ACS', function () {
        var inputRange = new Ranges(ranges);
        var acs = ACS(inputRange, {nbDecimal: 2, nucleus: '1H', frequencyObserved: 400, solvent: 'C6D6', format: 'IMJA', ascending: true});
        acs.should.equal('<sup>1</sup>H NMR (C<sub>6</sub>D<sub>6</sub>, 400 MHz): δ 1.29 (1H, t, <i>J</i> = 4.5 Hz), 2.96 (3H, dd, <i>J</i> = 9.2, 2.7 Hz, COCH<sub>3</sub>), 3.35 (3H, d, <i>J</i> = 5.2 Hz, CH<sub>3</sub>OH),' +
            ' 4.09-4.34 (3H, 4.15 (t, <i>J</i> = 5.5, 5.2 Hz), 4.23 (d, <i>J</i> = 5.2 Hz)), 4.80 (3H, d, <i>J</i> = 5.2 Hz, D<sub>2</sub>O), 5.42-5.64 (3H, 5.46 (d, <i>J</i> = 5.2 Hz), 5.55 (dd, <i>J</i> = 5.5, 5.2 Hz)), 6.26-7.27 (8H, m).');
        acs = ACS(inputRange, {nbDecimal: 2, nucleus: '1H', format: 'IMJA'});
        acs.should.equal('<sup>1</sup>H NMR: δ 2.96 (3H, dd, <i>J</i> = 9.2, 2.7 Hz, COCH<sub>3</sub>), 1.29 (1H, t, <i>J</i> = 4.5 Hz), 3.35 (3H, d, <i>J</i> = 5.2 Hz, CH<sub>3</sub>OH), 4.09-4.34 (3H, 4.23 (d, <i>J</i> = 5.2 Hz),' +
            ' 4.15 (t, <i>J</i> = 5.5, 5.2 Hz)), 4.80 (3H, d, <i>J</i> = 5.2 Hz, D<sub>2</sub>O), 5.42-5.64 (3H, 5.46 (d, <i>J</i> = 5.2 Hz), 5.55 (dd, <i>J</i> = 5.5, 5.2 Hz)), 6.26-7.27 (8H, m).');
    });
});
