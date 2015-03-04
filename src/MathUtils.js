/*
Not needed. A lot of math/stat utils can be found in the ml-stat package.
 https://github.com/mljs/stat

 to access the array utils:
*/
 var StatArray = require('ml-stat/array');
 var minMax = StatArray.minMax([1,2,3,4]);
 /*
 	{min: 1, max: 4}
 */



//var MathUtils={
//	/**
//	 * Returns the minimum and maximum values of the given vector
//	 * @param data
//	 * @return double array containing [min,max]
//	 */
//	getMinMax: function( data) {
//		var result = [Number.POSITIVE_INFINITY,Number.NEGATIVE_INFINITY];
//
//		for (var i = data.length-1; i >=0 ; i--) {
//			if (data[i] < result[0])
//				result[0] = data[i];
//			if (data[i] > result[1])
//				result[1] = data[i];
//		}
//		return result;
//	}
//};