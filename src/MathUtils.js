var MathUtils={
	/**
	 * Returns the minimum and maximum values of the given vector
	 * @param data
	 * @return double array containing [min,max]
	 */
	getMinMax: function( data) {
		var result = [Number.POSITIVE_INFINITY,Number.NEGATIVE_INFINITY];

		for (var i = data.length-1; i >=0 ; i--) {
			if (data[i] < result[0])
				result[0] = data[i];
			if (data[i] > result[1])
				result[1] = data[i];
		}
		return result;
	}
};