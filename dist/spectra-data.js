(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["spectraData"] = factory();
	else
		root["spectraData"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 111);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var support = __webpack_require__(3);
var compressions = __webpack_require__(8);
var nodeBuffer = __webpack_require__(9);
/**
 * Convert a string to a "binary string" : a string containing only char codes between 0 and 255.
 * @param {string} str the string to transform.
 * @return {String} the binary string.
 */
exports.string2binary = function(str) {
    var result = "";
    for (var i = 0; i < str.length; i++) {
        result += String.fromCharCode(str.charCodeAt(i) & 0xff);
    }
    return result;
};
exports.arrayBuffer2Blob = function(buffer, mimeType) {
    exports.checkSupport("blob");
	mimeType = mimeType || 'application/zip';

    try {
        // Blob constructor
        return new Blob([buffer], {
            type: mimeType
        });
    }
    catch (e) {

        try {
            // deprecated, browser only, old way
            var Builder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
            var builder = new Builder();
            builder.append(buffer);
            return builder.getBlob(mimeType);
        }
        catch (e) {

            // well, fuck ?!
            throw new Error("Bug : can't construct the Blob.");
        }
    }


};
/**
 * The identity function.
 * @param {Object} input the input.
 * @return {Object} the same input.
 */
function identity(input) {
    return input;
}

/**
 * Fill in an array with a string.
 * @param {String} str the string to use.
 * @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to fill in (will be mutated).
 * @return {Array|ArrayBuffer|Uint8Array|Buffer} the updated array.
 */
function stringToArrayLike(str, array) {
    for (var i = 0; i < str.length; ++i) {
        array[i] = str.charCodeAt(i) & 0xFF;
    }
    return array;
}

/**
 * Transform an array-like object to a string.
 * @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to transform.
 * @return {String} the result.
 */
function arrayLikeToString(array) {
    // Performances notes :
    // --------------------
    // String.fromCharCode.apply(null, array) is the fastest, see
    // see http://jsperf.com/converting-a-uint8array-to-a-string/2
    // but the stack is limited (and we can get huge arrays !).
    //
    // result += String.fromCharCode(array[i]); generate too many strings !
    //
    // This code is inspired by http://jsperf.com/arraybuffer-to-string-apply-performance/2
    var chunk = 65536;
    var result = [],
        len = array.length,
        type = exports.getTypeOf(array),
        k = 0,
        canUseApply = true;
      try {
         switch(type) {
            case "uint8array":
               String.fromCharCode.apply(null, new Uint8Array(0));
               break;
            case "nodebuffer":
               String.fromCharCode.apply(null, nodeBuffer(0));
               break;
         }
      } catch(e) {
         canUseApply = false;
      }

      // no apply : slow and painful algorithm
      // default browser on android 4.*
      if (!canUseApply) {
         var resultStr = "";
         for(var i = 0; i < array.length;i++) {
            resultStr += String.fromCharCode(array[i]);
         }
    return resultStr;
    }
    while (k < len && chunk > 1) {
        try {
            if (type === "array" || type === "nodebuffer") {
                result.push(String.fromCharCode.apply(null, array.slice(k, Math.min(k + chunk, len))));
            }
            else {
                result.push(String.fromCharCode.apply(null, array.subarray(k, Math.min(k + chunk, len))));
            }
            k += chunk;
        }
        catch (e) {
            chunk = Math.floor(chunk / 2);
        }
    }
    return result.join("");
}

exports.applyFromCharCode = arrayLikeToString;


/**
 * Copy the data from an array-like to an other array-like.
 * @param {Array|ArrayBuffer|Uint8Array|Buffer} arrayFrom the origin array.
 * @param {Array|ArrayBuffer|Uint8Array|Buffer} arrayTo the destination array which will be mutated.
 * @return {Array|ArrayBuffer|Uint8Array|Buffer} the updated destination array.
 */
function arrayLikeToArrayLike(arrayFrom, arrayTo) {
    for (var i = 0; i < arrayFrom.length; i++) {
        arrayTo[i] = arrayFrom[i];
    }
    return arrayTo;
}

// a matrix containing functions to transform everything into everything.
var transform = {};

// string to ?
transform["string"] = {
    "string": identity,
    "array": function(input) {
        return stringToArrayLike(input, new Array(input.length));
    },
    "arraybuffer": function(input) {
        return transform["string"]["uint8array"](input).buffer;
    },
    "uint8array": function(input) {
        return stringToArrayLike(input, new Uint8Array(input.length));
    },
    "nodebuffer": function(input) {
        return stringToArrayLike(input, nodeBuffer(input.length));
    }
};

// array to ?
transform["array"] = {
    "string": arrayLikeToString,
    "array": identity,
    "arraybuffer": function(input) {
        return (new Uint8Array(input)).buffer;
    },
    "uint8array": function(input) {
        return new Uint8Array(input);
    },
    "nodebuffer": function(input) {
        return nodeBuffer(input);
    }
};

// arraybuffer to ?
transform["arraybuffer"] = {
    "string": function(input) {
        return arrayLikeToString(new Uint8Array(input));
    },
    "array": function(input) {
        return arrayLikeToArrayLike(new Uint8Array(input), new Array(input.byteLength));
    },
    "arraybuffer": identity,
    "uint8array": function(input) {
        return new Uint8Array(input);
    },
    "nodebuffer": function(input) {
        return nodeBuffer(new Uint8Array(input));
    }
};

// uint8array to ?
transform["uint8array"] = {
    "string": arrayLikeToString,
    "array": function(input) {
        return arrayLikeToArrayLike(input, new Array(input.length));
    },
    "arraybuffer": function(input) {
        return input.buffer;
    },
    "uint8array": identity,
    "nodebuffer": function(input) {
        return nodeBuffer(input);
    }
};

// nodebuffer to ?
transform["nodebuffer"] = {
    "string": arrayLikeToString,
    "array": function(input) {
        return arrayLikeToArrayLike(input, new Array(input.length));
    },
    "arraybuffer": function(input) {
        return transform["nodebuffer"]["uint8array"](input).buffer;
    },
    "uint8array": function(input) {
        return arrayLikeToArrayLike(input, new Uint8Array(input.length));
    },
    "nodebuffer": identity
};

/**
 * Transform an input into any type.
 * The supported output type are : string, array, uint8array, arraybuffer, nodebuffer.
 * If no output type is specified, the unmodified input will be returned.
 * @param {String} outputType the output type.
 * @param {String|Array|ArrayBuffer|Uint8Array|Buffer} input the input to convert.
 * @throws {Error} an Error if the browser doesn't support the requested output type.
 */
exports.transformTo = function(outputType, input) {
    if (!input) {
        // undefined, null, etc
        // an empty string won't harm.
        input = "";
    }
    if (!outputType) {
        return input;
    }
    exports.checkSupport(outputType);
    var inputType = exports.getTypeOf(input);
    var result = transform[inputType][outputType](input);
    return result;
};

/**
 * Return the type of the input.
 * The type will be in a format valid for JSZip.utils.transformTo : string, array, uint8array, arraybuffer.
 * @param {Object} input the input to identify.
 * @return {String} the (lowercase) type of the input.
 */
exports.getTypeOf = function(input) {
    if (typeof input === "string") {
        return "string";
    }
    if (Object.prototype.toString.call(input) === "[object Array]") {
        return "array";
    }
    if (support.nodebuffer && nodeBuffer.test(input)) {
        return "nodebuffer";
    }
    if (support.uint8array && input instanceof Uint8Array) {
        return "uint8array";
    }
    if (support.arraybuffer && input instanceof ArrayBuffer) {
        return "arraybuffer";
    }
};

/**
 * Throw an exception if the type is not supported.
 * @param {String} type the type to check.
 * @throws {Error} an Error if the browser doesn't support the requested type.
 */
exports.checkSupport = function(type) {
    var supported = support[type.toLowerCase()];
    if (!supported) {
        throw new Error(type + " is not supported by this browser");
    }
};
exports.MAX_VALUE_16BITS = 65535;
exports.MAX_VALUE_32BITS = -1; // well, "\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF" is parsed as -1

/**
 * Prettify a string read as binary.
 * @param {string} str the string to prettify.
 * @return {string} a pretty string.
 */
exports.pretty = function(str) {
    var res = '',
        code, i;
    for (i = 0; i < (str || "").length; i++) {
        code = str.charCodeAt(i);
        res += '\\x' + (code < 16 ? "0" : "") + code.toString(16).toUpperCase();
    }
    return res;
};

/**
 * Find a compression registered in JSZip.
 * @param {string} compressionMethod the method magic to find.
 * @return {Object|null} the JSZip compression object, null if none found.
 */
exports.findCompression = function(compressionMethod) {
    for (var method in compressions) {
        if (!compressions.hasOwnProperty(method)) {
            continue;
        }
        if (compressions[method].magic === compressionMethod) {
            return compressions[method];
        }
    }
    return null;
};
/**
* Cross-window, cross-Node-context regular expression detection
* @param  {Object}  object Anything
* @return {Boolean}        true if the object is a regular expression,
* false otherwise
*/
exports.isRegExp = function (object) {
    return Object.prototype.toString.call(object) === "[object RegExp]";
};

/**
 * Merge the objects passed as parameters into a new one.
 * @private
 * @param {...Object} var_args All objects to merge.
 * @return {Object} a new object with the data of the others.
 */
exports.extend = function() {
    var result = {}, i, attr;
    for (i = 0; i < arguments.length; i++) { // arguments is not enumerable in some browsers
        for (attr in arguments[i]) {
            if (arguments[i].hasOwnProperty(attr) && typeof result[attr] === "undefined") {
                result[attr] = arguments[i][attr];
            }
        }
    }
    return result;
};



/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



var TYPED_OK =  (typeof Uint8Array !== 'undefined') &&
                (typeof Uint16Array !== 'undefined') &&
                (typeof Int32Array !== 'undefined');


exports.assign = function (obj /*from1, from2, from3, ...*/) {
  var sources = Array.prototype.slice.call(arguments, 1);
  while (sources.length) {
    var source = sources.shift();
    if (!source) { continue; }

    if (typeof source !== 'object') {
      throw new TypeError(source + 'must be non-object');
    }

    for (var p in source) {
      if (source.hasOwnProperty(p)) {
        obj[p] = source[p];
      }
    }
  }

  return obj;
};


// reduce buffer size, avoiding mem copy
exports.shrinkBuf = function (buf, size) {
  if (buf.length === size) { return buf; }
  if (buf.subarray) { return buf.subarray(0, size); }
  buf.length = size;
  return buf;
};


var fnTyped = {
  arraySet: function (dest, src, src_offs, len, dest_offs) {
    if (src.subarray && dest.subarray) {
      dest.set(src.subarray(src_offs, src_offs + len), dest_offs);
      return;
    }
    // Fallback to ordinary array
    for (var i = 0; i < len; i++) {
      dest[dest_offs + i] = src[src_offs + i];
    }
  },
  // Join array of chunks to single array.
  flattenChunks: function (chunks) {
    var i, l, len, pos, chunk, result;

    // calculate data length
    len = 0;
    for (i = 0, l = chunks.length; i < l; i++) {
      len += chunks[i].length;
    }

    // join chunks
    result = new Uint8Array(len);
    pos = 0;
    for (i = 0, l = chunks.length; i < l; i++) {
      chunk = chunks[i];
      result.set(chunk, pos);
      pos += chunk.length;
    }

    return result;
  }
};

var fnUntyped = {
  arraySet: function (dest, src, src_offs, len, dest_offs) {
    for (var i = 0; i < len; i++) {
      dest[dest_offs + i] = src[src_offs + i];
    }
  },
  // Join array of chunks to single array.
  flattenChunks: function (chunks) {
    return [].concat.apply([], chunks);
  }
};


// Enable/Disable typed arrays use, for testing
//
exports.setTyped = function (on) {
  if (on) {
    exports.Buf8  = Uint8Array;
    exports.Buf16 = Uint16Array;
    exports.Buf32 = Int32Array;
    exports.assign(exports, fnTyped);
  } else {
    exports.Buf8  = Array;
    exports.Buf16 = Array;
    exports.Buf32 = Array;
    exports.assign(exports, fnUntyped);
  }
};

exports.setTyped(TYPED_OK);


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Asplice = Array.prototype.splice,
    Aconcat = Array.prototype.concat;

// For performance : http://jsperf.com/clone-array-slice-vs-while-vs-for
function slice(arr) {
    var i = 0,
        ii = arr.length,
        result = new Array(ii);
    for (; i < ii; i++) {
        result[i] = arr[i];
    }
    return result;
}

/**
 * Real matrix.
 * @constructor
 * @param {number|Array} nRows - Number of rows of the new matrix or a 2D array containing the data.
 * @param {number|boolean} [nColumns] - Number of columns of the new matrix or a boolean specifying if the input array should be cloned
 */
function Matrix(nRows, nColumns) {
    var i = 0, rows, columns, matrix, newInstance;
    if (Array.isArray(nRows)) {
        newInstance = nColumns;
        matrix = newInstance ? slice(nRows) : nRows;
        nRows = matrix.length;
        nColumns = matrix[0].length;
        if (typeof nColumns === 'undefined') {
            throw new TypeError('Data must be a 2D array');
        }
        if (nRows > 0 && nColumns > 0) {
            for (; i < nRows; i++) {
                if (matrix[i].length !== nColumns) {
                    throw new RangeError('Inconsistent array dimensions');
                } else if (newInstance) {
                    matrix[i] = slice(matrix[i]);
                }
            }
        } else {
            throw new RangeError('Invalid dimensions: ' + nRows + 'x' + nColumns);
        }
    } else if (typeof nRows === 'number') { // Create empty matrix
        if (nRows > 0 && nColumns > 0) {
            matrix = new Array(nRows);
            for (; i < nRows; i++) {
                matrix[i] = new Array(nColumns);
            }
        } else {
            throw new RangeError('Invalid dimensions: ' + nRows + 'x' + nColumns);
        }
    } else {
        throw new TypeError('Invalid arguments');
    }

    Object.defineProperty(matrix, 'rows', {writable: true, value: nRows});
    Object.defineProperty(matrix, 'columns', {writable: true, value: nColumns});

    matrix.__proto__ = Matrix.prototype;

    return matrix;
}

/**
 * Constructs a Matrix with the chosen dimensions from a 1D array.
 * @param {number} newRows - Number of rows
 * @param {number} newColumns - Number of columns
 * @param {Array} newData - A 1D array containing data for the matrix
 * @returns {Matrix} - The new matrix
 */
Matrix.from1DArray = function from1DArray(newRows, newColumns, newData) {
    var length, data, i = 0;

    length = newRows * newColumns;
    if (length !== newData.length)
        throw new RangeError('Data length does not match given dimensions');

    data = new Array(newRows);
    for (; i < newRows; i++) {
        data[i] = newData.slice(i * newColumns, (i + 1) * newColumns);
    }
    return new Matrix(data);
};

/**
 * Creates a row vector, a matrix with only one row.
 * @param {Array} newData - A 1D array containing data for the vector
 * @returns {Matrix} - The new matrix
 */
Matrix.rowVector = function rowVector(newData) {
    return new Matrix([newData]);
};

/**
 * Creates a column vector, a matrix with only one column.
 * @param {Array} newData - A 1D array containing data for the vector
 * @returns {Matrix} - The new matrix
 */
Matrix.columnVector = function columnVector(newData) {
    var l = newData.length, vector = new Array(l);
    for (var i = 0; i < l; i++)
        vector[i] = [newData[i]];
    return new Matrix(vector);
};

/**
 * Creates an empty matrix with the given dimensions. Values will be undefined. Same as using new Matrix(rows, columns).
 * @param {number} rows - Number of rows
 * @param {number} columns - Number of columns
 * @returns {Matrix} - The new matrix
 */
Matrix.empty = function empty(rows, columns) {
    return new Matrix(rows, columns);
};

/**
 * Creates a matrix with the given dimensions. Values will be set to zero.
 * @param {number} rows - Number of rows
 * @param {number} columns - Number of columns
 * @returns {Matrix} - The new matrix
 */
Matrix.zeros = function zeros(rows, columns) {
    return Matrix.empty(rows, columns).fill(0);
};

/**
 * Creates a matrix with the given dimensions. Values will be set to one.
 * @param {number} rows - Number of rows
 * @param {number} columns - Number of columns
 * @returns {Matrix} - The new matrix
 */
Matrix.ones = function ones(rows, columns) {
    return Matrix.empty(rows, columns).fill(1);
};

/**
 * Creates a matrix with the given dimensions. Values will be randomly set using Math.random().
 * @param {number} rows - Number of rows
 * @param {number} columns - Number of columns
 * @returns {Matrix} The new matrix
 */
Matrix.rand = function rand(rows, columns) {
    var matrix = Matrix.empty(rows, columns);
    for (var i = 0, ii = matrix.rows; i < ii; i++) {
        for (var j = 0, jj = matrix.columns; j < jj; j++) {
            matrix[i][j] = Math.random();
        }
    }
    return matrix;
};

/**
 * Creates an identity matrix with the given dimension. Values of the diagonal will be 1 and other will be 0.
 * @param {number} n - Number of rows and columns
 * @returns {Matrix} - The new matrix
 */
Matrix.eye = function eye(n) {
    var matrix = Matrix.zeros(n, n), l = matrix.rows;
    for (var i = 0; i < l; i++) {
        matrix[i][i] = 1;
    }
    return matrix;
};

/**
 * Creates a diagonal matrix based on the given array.
 * @param {Array} data - Array containing the data for the diagonal
 * @returns {Matrix} - The new matrix
 */
Matrix.diag = function diag(data) {
    var l = data.length, matrix = Matrix.zeros(l, l);
    for (var i = 0; i < l; i++) {
        matrix[i][i] = data[i];
    }
    return matrix;
};

/**
 * Creates an array of indices between two values
 * @param {number} from
 * @param {number} to
 * @returns {Array}
 */
Matrix.indices = function indices(from, to) {
    var vector = new Array(to - from);
    for (var i = 0; i < vector.length; i++)
        vector[i] = from++;
    return vector;
};

// TODO DOC
Matrix.stack = function stack(arg1) {
    var i, j, k;
    if (Matrix.isMatrix(arg1)) {
        var rows = 0,
            cols = 0;
        for (i = 0; i < arguments.length; i++) {
            rows += arguments[i].rows;
            if (arguments[i].columns > cols)
                cols = arguments[i].columns;
        }

        var r = Matrix.zeros(rows, cols);
        var c = 0;
        for (i = 0; i < arguments.length; i++) {
            var current = arguments[i];
            for (j = 0; j < current.rows; j++) {
                for (k = 0; k < current.columns; k++)
                    r[c][k] = current[j][k];
                c++;
            }
        }
        return r;
    }
    else if (Array.isArray(arg1)) {
        var matrix = Matrix.empty(arguments.length, arg1.length);
        for (i = 0; i < arguments.length; i++)
            matrix.setRow(i, arguments[i]);
        return matrix;
    }
};

// TODO DOC
Matrix.expand = function expand(base, count) {
    var expansion = [];
    for (var i = 0; i < count.length; i++)
        for (var j = 0; j < count[i]; j++)
            expansion.push(base[i]);
    return new Matrix(expansion);
};

/**
 * Check that the provided value is a Matrix and tries to instantiate one if not
 * @param value - The value to check
 * @returns {Matrix}
 * @throws {TypeError}
 */
Matrix.checkMatrix = function checkMatrix(value) {
    if (!value) {
        throw new TypeError('Argument has to be a matrix');
    }
    if (value.klass !== 'Matrix') {
        value = new Matrix(value);
    }
    return value;
};

/**
 * Returns true if the argument is a Matrix, false otherwise
 * @param value - The value to check
 * @returns {boolean}
 */
Matrix.isMatrix = function isMatrix(value) {
    return value ? value.klass === 'Matrix' : false;
};

/**
 * @property {string} - The name of this class.
 */
Object.defineProperty(Matrix.prototype, 'klass', {
    get: function klass() {
        return 'Matrix';
    }
});

/**
 * @property {number} - The number of elements in the matrix.
 */
Object.defineProperty(Matrix.prototype, 'size', {
    get: function size() {
        return this.rows * this.columns;
    }
});

/**
 * @private
 * Internal check that a row index is not out of bounds
 * @param {number} index
 */
Matrix.prototype.checkRowIndex = function checkRowIndex(index) {
    if (index < 0 || index > this.rows - 1)
        throw new RangeError('Row index out of range.');
};

/**
 * @private
 * Internal check that a column index is not out of bounds
 * @param {number} index
 */
Matrix.prototype.checkColumnIndex = function checkColumnIndex(index) {
    if (index < 0 || index > this.columns - 1)
        throw new RangeError('Column index out of range.');
};

/**
 * @private
 * Internal check that two matrices have the same dimensions
 * @param {Matrix} otherMatrix
 */
Matrix.prototype.checkDimensions = function checkDimensions(otherMatrix) {
    if ((this.rows !== otherMatrix.rows) || (this.columns !== otherMatrix.columns))
        throw new RangeError('Matrices dimensions must be equal.');
};

/**
 * Applies a callback for each element of the matrix. The function is called in the matrix (this) context.
 * @param {function} callback - Function that will be called with two parameters : i (row) and j (column)
 * @returns {Matrix} this
 */
Matrix.prototype.apply = function apply(callback) {
    var ii = this.rows, jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            callback.call(this, i, j);
        }
    }
    return this;
};

/**
 * Creates an exact and independent copy of the matrix
 * @returns {Matrix}
 */
Matrix.prototype.clone = function clone() {
    return new Matrix(this.to2DArray());
};

/**
 * Returns a new 1D array filled row by row with the matrix values
 * @returns {Array}
 */
Matrix.prototype.to1DArray = function to1DArray() {
    return Aconcat.apply([], this);
};

/**
 * Returns a 2D array containing a copy of the data
 * @returns {Array}
 */
Matrix.prototype.to2DArray = function to2DArray() {
    var l = this.rows, copy = new Array(l);
    for (var i = 0; i < l; i++) {
        copy[i] = slice(this[i]);
    }
    return copy;
};

/**
 * @returns {boolean} true if the matrix has one row
 */
Matrix.prototype.isRowVector = function isRowVector() {
    return this.rows === 1;
};

/**
 * @returns {boolean} true if the matrix has one column
 */
Matrix.prototype.isColumnVector = function isColumnVector() {
    return this.columns === 1;
};

/**
 * @returns {boolean} true if the matrix has one row or one column
 */
Matrix.prototype.isVector = function isVector() {
    return (this.rows === 1) || (this.columns === 1);
};

/**
 * @returns {boolean} true if the matrix has the same number of rows and columns
 */
Matrix.prototype.isSquare = function isSquare() {
    return this.rows === this.columns;
};

/**
 * @returns {boolean} true if the matrix is square and has the same values on both sides of the diagonal
 */
Matrix.prototype.isSymmetric = function isSymmetric() {
    if (this.isSquare()) {
        var l = this.rows;
        for (var i = 0; i < l; i++) {
            for (var j = 0; j <= i; j++) {
                if (this[i][j] !== this[j][i]) {
                    return false;
                }
            }
        }
        return true;
    }
    return false;
};

/**
 * Sets a given element of the matrix. mat.set(3,4,1) is equivalent to mat[3][4]=1
 * @param {number} rowIndex - Index of the row
 * @param {number} columnIndex - Index of the column
 * @param {number} value - The new value for the element
 * @returns {Matrix} this
 */
Matrix.prototype.set = function set(rowIndex, columnIndex, value) {
    this[rowIndex][columnIndex] = value;
    return this;
};

/**
 * Returns the given element of the matrix. mat.get(3,4) is equivalent to matrix[3][4]
 * @param {number} rowIndex - Index of the row
 * @param {number} columnIndex - Index of the column
 * @returns {number}
 */
Matrix.prototype.get = function get(rowIndex, columnIndex) {
    return this[rowIndex][columnIndex];
};

/**
 * Fills the matrix with a given value. All elements will be set to this value.
 * @param {number} value - New value
 * @returns {Matrix} this
 */
Matrix.prototype.fill = function fill(value) {
    var ii = this.rows, jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            this[i][j] = value;
        }
    }
    return this;
};

/**
 * Negates the matrix. All elements will be multiplied by (-1)
 * @returns {Matrix} this
 */
Matrix.prototype.neg = function neg() {
    return this.mulS(-1);
};

/**
 * Adds a scalar or values from another matrix (in place)
 * @param {number|Matrix} value
 * @returns {Matrix} this
 */
Matrix.prototype.add = function add(value) {
    if (typeof value === 'number')
        return this.addS(value);
    value = Matrix.checkMatrix(value);
        return this.addM(value);
};

/**
 * Adds a scalar to each element of the matrix
 * @param {number} value
 * @returns {Matrix} this
 */
Matrix.prototype.addS = function addS(value) {
    var ii = this.rows, jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            this[i][j] += value;
        }
    }
    return this;
};

/**
 * Adds the value of each element of matrix to the corresponding element of this
 * @param {Matrix} matrix
 * @returns {Matrix} this
 */
Matrix.prototype.addM = function addM(matrix) {
    this.checkDimensions(matrix);
    var ii = this.rows, jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            this[i][j] += matrix[i][j];
        }
    }
    return this;
};

/**
 * Subtracts a scalar or values from another matrix (in place)
 * @param {number|Matrix} value
 * @returns {Matrix} this
 */
Matrix.prototype.sub = function sub(value) {
    if (typeof value === 'number')
        return this.subS(value);
    value = Matrix.checkMatrix(value);
        return this.subM(value);
};

/**
 * Subtracts a scalar from each element of the matrix
 * @param {number} value
 * @returns {Matrix} this
 */
Matrix.prototype.subS = function subS(value) {
    var ii = this.rows, jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            this[i][j] -= value;
        }
    }
    return this;
};

/**
 * Subtracts the value of each element of matrix from the corresponding element of this
 * @param {Matrix} matrix
 * @returns {Matrix} this
 */
Matrix.prototype.subM = function subM(matrix) {
    this.checkDimensions(matrix);
    var ii = this.rows, jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            this[i][j] -= matrix[i][j];
        }
    }
    return this;
};

/**
 * Multiplies a scalar or values from another matrix (in place)
 * @param {number|Matrix} value
 * @returns {Matrix} this
 */
Matrix.prototype.mul = function mul(value) {
    if (typeof value === 'number')
        return this.mulS(value);
    value = Matrix.checkMatrix(value);
        return this.mulM(value);
};

/**
 * Multiplies a scalar with each element of the matrix
 * @param {number} value
 * @returns {Matrix} this
 */
Matrix.prototype.mulS = function mulS(value) {
    var ii = this.rows, jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            this[i][j] *= value;
        }
    }
    return this;
};

/**
 * Multiplies the value of each element of matrix with the corresponding element of this
 * @param {Matrix} matrix
 * @returns {Matrix} this
 */
Matrix.prototype.mulM = function mulM(matrix) {
    this.checkDimensions(matrix);
    var ii = this.rows, jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            this[i][j] *= matrix[i][j];
        }
    }
    return this;
};

/**
 * Divides by a scalar or values from another matrix (in place)
 * @param {number|Matrix} value
 * @returns {Matrix} this
 */
Matrix.prototype.div = function div(value) {
    if (typeof value === 'number')
        return this.divS(value);
    value = Matrix.checkMatrix(value);
        return this.divM(value);
};

/**
 * Divides each element of the matrix by a scalar
 * @param {number} value
 * @returns {Matrix} this
 */
Matrix.prototype.divS = function divS(value) {
    var ii = this.rows, jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            this[i][j] /= value;
        }
    }
    return this;
};

/**
 * Divides each element of this by the corresponding element of matrix
 * @param {Matrix} matrix
 * @returns {Matrix} this
 */
Matrix.prototype.divM = function divM(matrix) {
    this.checkDimensions(matrix);
    var ii = this.rows, jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            this[i][j] /= matrix[i][j];
        }
    }
    return this;
};

/**
 * Returns a new array from the given row index
 * @param {number} index - Row index
 * @returns {Array}
 */
Matrix.prototype.getRow = function getRow(index) {
    this.checkRowIndex(index);
    return slice(this[index]);
};

/**
 * Returns a new row vector from the given row index
 * @param {number} index - Row index
 * @returns {Matrix}
 */
Matrix.prototype.getRowVector = function getRowVector(index) {
    return Matrix.rowVector(this.getRow(index));
};

/**
 * Sets a row at the given index
 * @param {number} index - Row index
 * @param {Array|Matrix} array - Array or vector
 * @returns {Matrix} this
 */
Matrix.prototype.setRow = function setRow(index, array) {
    this.checkRowIndex(index);
    if (Matrix.isMatrix(array)) array = array.to1DArray();
    if (array.length !== this.columns)
        throw new RangeError('Invalid row size');
    this[index] = slice(array);
    return this;
};

/**
 * Removes a row from the given index
 * @param {number} index - Row index
 * @returns {Matrix} this
 */
Matrix.prototype.removeRow = function removeRow(index) {
    this.checkRowIndex(index);
    if (this.rows === 1)
        throw new RangeError('A matrix cannot have less than one row');
    Asplice.call(this, index, 1);
    this.rows -= 1;
    return this;
};

/**
 * Adds a row at the given index
 * @param {number} [index = this.rows] - Row index
 * @param {Array|Matrix} array - Array or vector
 * @returns {Matrix} this
 */
Matrix.prototype.addRow = function addRow(index, array) {
    if (typeof array === 'undefined') {
        array = index;
        index = this.rows;
    }
    if (index < 0 || index > this.rows)
        throw new RangeError('Row index out of range.');
    if (Matrix.isMatrix(array)) array = array.to1DArray();
    if (array.length !== this.columns)
        throw new RangeError('Invalid row size');
    Asplice.call(this, index, 0, slice(array));
    this.rows += 1;
    return this;
};

/**
 * Swaps two rows
 * @param {number} row1 - First row index
 * @param {number} row2 - Second row index
 * @returns {Matrix} this
 */
Matrix.prototype.swapRows = function swapRows(row1, row2) {
    this.checkRowIndex(row1);
    this.checkRowIndex(row2);
    var temp = this[row1];
    this[row1] = this[row2];
    this[row2] = temp;
    return this;
};

/**
 * Returns a new array from the given column index
 * @param {number} index - Column index
 * @returns {Array}
 */
Matrix.prototype.getColumn = function getColumn(index) {
    this.checkColumnIndex(index);
    var l = this.rows, column = new Array(l);
    for (var i = 0; i < l; i++) {
        column[i] = this[i][index];
    }
    return column;
};

/**
 * Returns a new column vector from the given column index
 * @param {number} index - Column index
 * @returns {Matrix}
 */
Matrix.prototype.getColumnVector = function getColumnVector(index) {
    return Matrix.columnVector(this.getColumn(index));
};

/**
 * Sets a column at the given index
 * @param {number} index - Column index
 * @param {Array|Matrix} array - Array or vector
 * @returns {Matrix} this
 */
Matrix.prototype.setColumn = function setColumn(index, array) {
    this.checkColumnIndex(index);
    if (Matrix.isMatrix(array)) array = array.to1DArray();
    var l = this.rows;
    if (array.length !== l)
        throw new RangeError('Invalid column size');
    for (var i = 0; i < l; i++) {
        this[i][index] = array[i];
    }
    return this;
};

/**
 * Removes a column from the given index
 * @param {number} index - Column index
 * @returns {Matrix} this
 */
Matrix.prototype.removeColumn = function removeColumn(index) {
    this.checkColumnIndex(index);
    if (this.columns === 1)
        throw new RangeError('A matrix cannot have less than one column');
    for (var i = 0, ii = this.rows; i < ii; i++) {
        this[i].splice(index, 1);
    }
    this.columns -= 1;
    return this;
};

/**
 * Adds a column at the given index
 * @param {number} [index = this.columns] - Column index
 * @param {Array|Matrix} array - Array or vector
 * @returns {Matrix} this
 */
Matrix.prototype.addColumn = function addColumn(index, array) {
    if (typeof array === 'undefined') {
        array = index;
        index = this.columns;
    }
    if (index < 0 || index > this.columns)
        throw new RangeError('Column index out of range.');
    if (Matrix.isMatrix(array)) array = array.to1DArray();
    var l = this.rows;
    if (array.length !== l)
        throw new RangeError('Invalid column size');
    for (var i = 0; i < l; i++) {
        this[i].splice(index, 0, array[i]);
    }
    this.columns += 1;
    return this;
};

/**
 * Swaps two columns
 * @param {number} column1 - First column index
 * @param {number} column2 - Second column index
 * @returns {Matrix} this
 */
Matrix.prototype.swapColumns = function swapColumns(column1, column2) {
    this.checkRowIndex(column1);
    this.checkRowIndex(column2);
    var l = this.rows, temp, row;
    for (var i = 0; i < l; i++) {
        row = this[i];
        temp = row[column1];
        row[column1] = row[column2];
        row[column2] = temp;
    }
    return this;
};

/**
 * @private
 * Internal check that the provided vector is an array with the right length
 * @param {Array|Matrix} vector
 * @returns {Array}
 * @throws {RangeError}
 */
Matrix.prototype.checkRowVector = function checkRowVector(vector) {
    if (Matrix.isMatrix(vector))
        vector = vector.to1DArray();
    if (vector.length !== this.columns)
        throw new RangeError('vector size must be the same as the number of columns');
    return vector;
};

/**
 * @private
 * Internal check that the provided vector is an array with the right length
 * @param {Array|Matrix} vector
 * @returns {Array}
 * @throws {RangeError}
 */
Matrix.prototype.checkColumnVector = function checkColumnVector(vector) {
    if (Matrix.isMatrix(vector))
        vector = vector.to1DArray();
    if (vector.length !== this.rows)
        throw new RangeError('vector size must be the same as the number of rows');
    return vector;
};

/**
 * Adds the values of a vector to each row
 * @param {Array|Matrix} vector - Array or vector
 * @returns {Matrix} this
 */
Matrix.prototype.addRowVector = function addRowVector(vector) {
    vector = this.checkRowVector(vector);
    var ii = this.rows, jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            this[i][j] += vector[j];
        }
    }
    return this;
};

/**
 * Subtracts the values of a vector from each row
 * @param {Array|Matrix} vector - Array or vector
 * @returns {Matrix} this
 */
Matrix.prototype.subRowVector = function subRowVector(vector) {
    vector = this.checkRowVector(vector);
    var ii = this.rows, jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            this[i][j] -= vector[j];
        }
    }
    return this;
};

/**
 * Multiplies the values of a vector with each row
 * @param {Array|Matrix} vector - Array or vector
 * @returns {Matrix} this
 */
Matrix.prototype.mulRowVector = function mulRowVector(vector) {
    vector = this.checkRowVector(vector);
    var ii = this.rows, jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            this[i][j] *= vector[j];
        }
    }
    return this;
};

/**
 * Divides the values of each row by those of a vector
 * @param {Array|Matrix} vector - Array or vector
 * @returns {Matrix} this
 */
Matrix.prototype.divRowVector = function divRowVector(vector) {
    vector = this.checkRowVector(vector);
    var ii = this.rows, jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            this[i][j] /= vector[j];
        }
    }
    return this;
};

/**
 * Adds the values of a vector to each column
 * @param {Array|Matrix} vector - Array or vector
 * @returns {Matrix} this
 */
Matrix.prototype.addColumnVector = function addColumnVector(vector) {
    vector = this.checkColumnVector(vector);
    var ii = this.rows, jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            this[i][j] += vector[i];
        }
    }
    return this;
};

/**
 * Subtracts the values of a vector from each column
 * @param {Array|Matrix} vector - Array or vector
 * @returns {Matrix} this
 */
Matrix.prototype.subColumnVector = function subColumnVector(vector) {
    vector = this.checkColumnVector(vector);
    var ii = this.rows, jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            this[i][j] -= vector[i];
        }
    }
    return this;
};

/**
 * Multiplies the values of a vector with each column
 * @param {Array|Matrix} vector - Array or vector
 * @returns {Matrix} this
 */
Matrix.prototype.mulColumnVector = function mulColumnVector(vector) {
    vector = this.checkColumnVector(vector);
    var ii = this.rows, jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            this[i][j] *= vector[i];
        }
    }
    return this;
};

/**
 * Divides the values of each column by those of a vector
 * @param {Array|Matrix} vector - Array or vector
 * @returns {Matrix} this
 */
Matrix.prototype.divColumnVector = function divColumnVector(vector) {
    vector = this.checkColumnVector(vector);
    var ii = this.rows, jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            this[i][j] /= vector[i];
        }
    }
    return this;
};

/**
 * Multiplies the values of a row with a scalar
 * @param {number} index - Row index
 * @param {number} value
 * @returns {Matrix} this
 */
Matrix.prototype.mulRow = function mulRow(index, value) {
    this.checkRowIndex(index);
    var i = 0, l = this.columns;
    for (; i < l; i++) {
        this[index][i] *= value;
    }
    return this;
};

/**
 * Multiplies the values of a column with a scalar
 * @param {number} index - Column index
 * @param {number} value
 * @returns {Matrix} this
 */
Matrix.prototype.mulColumn = function mulColumn(index, value) {
    this.checkColumnIndex(index);
    var i = 0, l = this.rows;
    for (; i < l; i++) {
        this[i][index] *= value;
    }
};

/**
 * A matrix index
 * @typedef {Object} MatrixIndex
 * @property {number} row
 * @property {number} column
 */

/**
 * Returns the maximum value of the matrix
 * @returns {number}
 */
Matrix.prototype.max = function max() {
    var v = -Infinity;
    var ii = this.rows, jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            if (this[i][j] > v) {
                v = this[i][j];
            }
        }
    }
    return v;
};

/**
 * Returns the index of the maximum value
 * @returns {MatrixIndex}
 */
Matrix.prototype.maxIndex = function maxIndex() {
    var v = -Infinity;
    var idx = {};
    var ii = this.rows, jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            if (this[i][j] > v) {
                v = this[i][j];
                idx.row = i;
                idx.column = j;
            }
        }
    }
    return idx;
};

/**
 * Returns the minimum value of the matrix
 * @returns {number}
 */
Matrix.prototype.min = function min() {
    var v = Infinity;
    var ii = this.rows, jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            if (this[i][j] < v) {
                v = this[i][j];
            }
        }
    }
    return v;
};

/**
 * Returns the index of the minimum value
 * @returns {MatrixIndex}
 */
Matrix.prototype.minIndex = function minIndex() {
    var v = Infinity;
    var idx = {};
    var ii = this.rows, jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            if (this[i][j] < v) {
                v = this[i][j];
                idx.row = i;
                idx.column = j;
            }
        }
    }
    return idx;
};

/**
 * Returns the maximum value of one row
 * @param {number} index - Row index
 * @returns {number}
 */
Matrix.prototype.maxRow = function maxRow(index) {
    this.checkRowIndex(index);
    var v = -Infinity;
    for (var i = 0, ii = this.columns; i < ii; i++) {
        if (this[index][i] > v) {
            v = this[index][i];
        }
    }
    return v;
};

/**
 * Returns the index of the maximum value of one row
 * @param {number} index - Row index
 * @returns {MatrixIndex}
 */
Matrix.prototype.maxRowIndex = function maxRowIndex(index) {
    this.checkRowIndex(index);
    var v = -Infinity;
    var idx = {
            row: index
        };
    for (var i = 0, ii = this.columns; i < ii; i++) {
        if (this[index][i] > v) {
            v = this[index][i];
            idx.column = i;
        }
    }
    return idx;
};

/**
 * Returns the minimum value of one row
 * @param {number} index - Row index
 * @returns {number}
 */
Matrix.prototype.minRow = function minRow(index) {
    this.checkRowIndex(index);
    var v = Infinity;
    for (var i = 0, ii = this.columns; i < ii; i++) {
        if (this[index][i] < v) {
            v = this[index][i];
        }
    }
    return v;
};

/**
 * Returns the index of the maximum value of one row
 * @param {number} index - Row index
 * @returns {MatrixIndex}
 */
Matrix.prototype.minRowIndex = function minRowIndex(index) {
    this.checkRowIndex(index);
    var v = Infinity;
    var idx = {
        row: index,
        column: 0
    };
    for (var i = 0, ii = this.columns; i < ii; i++) {
        if (this[index][i] < v) {
            v = this[index][i];
            idx.column = i;
        }
    }
    return idx;
};

/**
 * Returns the maximum value of one column
 * @param {number} index - Column index
 * @returns {number}
 */
Matrix.prototype.maxColumn = function maxColumn(index) {
    this.checkColumnIndex(index);
    var v = -Infinity;
    for (var i = 0, ii = this.rows; i < ii; i++) {
        if (this[i][index] > v) {
            v = this[i][index];
        }
    }
    return v;
};

/**
 * Returns the index of the maximum value of one column
 * @param {number} index - Column index
 * @returns {MatrixIndex}
 */
Matrix.prototype.maxColumnIndex = function maxColumnIndex(index) {
    this.checkColumnIndex(index);
    var v = -Infinity;
    var idx = {
        row: 0,
        column: index
    };
    for (var i = 0, ii = this.rows; i < ii; i++) {
        if (this[i][index] > v) {
            v = this[i][index];
            idx.row = i;
        }
    }
    return idx;
};

/**
 * Returns the minimum value of one column
 * @param {number} index - Column index
 * @returns {number}
 */
Matrix.prototype.minColumn = function minColumn(index) {
    this.checkColumnIndex(index);
    var v = Infinity;
    for (var i = 0, ii = this.rows; i < ii; i++) {
        if (this[i][index] < v) {
            v = this[i][index];
        }
    }
    return v;
};

/**
 * Returns the index of the minimum value of one column
 * @param {number} index - Column index
 * @returns {MatrixIndex}
 */
Matrix.prototype.minColumnIndex = function minColumnIndex(index) {
    this.checkColumnIndex(index);
    var v = Infinity;
    var idx = {
        row: 0,
        column: index
    };
    for (var i = 0, ii = this.rows; i < ii; i++) {
        if (this[i][index] < v) {
            v = this[i][index];
            idx.row = i;
        }
    }
    return idx;
};

/**
 * Returns an array containing the diagonal values of the matrix
 * @returns {Array}
 */
Matrix.prototype.diag = function diag() {
    if (!this.isSquare())
        throw new TypeError('Only square matrices have a diagonal.');
    var diag = new Array(this.rows);
    for (var i = 0, ii = this.rows; i < ii; i++) {
        diag[i] = this[i][i];
    }
    return diag;
};

/**
 * Returns the sum of all elements of the matrix
 * @returns {number}
 */
Matrix.prototype.sum = function sum() {
    var v = 0;
    var ii = this.rows, jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            v += this[i][j];
        }
    }
    return v;
};

/**
 * Returns the mean of all elements of the matrix
 * @returns {number}
 */
Matrix.prototype.mean = function mean() {
    return this.sum() / this.size;
};

/**
 * Returns the product of all elements of the matrix
 * @returns {number}
 */
Matrix.prototype.prod = function prod() {
    var prod = 1;
    var ii = this.rows, jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            prod *= this[i][j];
        }
    }
    return prod;
};

/**
 * Computes the cumulative sum of the matrix elements (in place, row by row)
 * @returns {Matrix} this
 */
Matrix.prototype.cumulativeSum = function cumulativeSum() {
    var sum = 0;
    var ii = this.rows, jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            sum += this[i][j];
            this[i][j] = sum;
        }
    }
    return this;
};

/**
 * Computes the dot (scalar) product between the matrix and another
 * @param {Matrix} other vector
 * @returns {number}
 */
Matrix.prototype.dot = function dot(other) {
    if (this.size !== other.size)
        throw new RangeError('vectors do not have the same size');
    var vector1 = this.to1DArray();
    var vector2 = other.to1DArray();
    var dot = 0, l = vector1.length;
    for (var i = 0; i < l; i++) {
        dot += vector1[i] * vector2[i];
    }
    return dot;
};

/**
 * Returns the matrix product between this and other
 * @returns {Matrix}
 */
Matrix.prototype.mmul = function mmul(other) {
    if (!Matrix.isMatrix(other))
        throw new TypeError('parameter "other" must be a matrix');
    if (this.columns !== other.rows)
        console.warn('Number of columns of left matrix are not equal to number of rows of right matrix.');

    var m = this.rows, n = this.columns, p = other.columns;
    var result = new Matrix(m, p);

    var Bcolj = new Array(n);
    var i, j, k;
    for (j = 0; j < p; j++) {
        for (k = 0; k < n; k++)
            Bcolj[k] = other[k][j];

        for (i = 0; i < m; i++) {
            var Arowi = this[i];

            var s = 0;
            for (k = 0; k < n; k++)
                s += Arowi[k] * Bcolj[k];

            result[i][j] = s;
        }
    }
    return result;
};

/**
 * Sorts the rows (in place)
 * @param {function} compareFunction - usual Array.prototype.sort comparison function
 * @returns {Matrix} this
 */
Matrix.prototype.sortRows = function sortRows(compareFunction) {
    for (var i = 0, ii = this.rows; i < ii; i++) {
        this[i].sort(compareFunction);
    }
    return this;
};

/**
 * Sorts the columns (in place)
 * @param {function} compareFunction - usual Array.prototype.sort comparison function
 * @returns {Matrix} this
 */
Matrix.prototype.sortColumns = function sortColumns(compareFunction) {
    for (var i = 0, ii = this.columns; i < ii; i++) {
        this.setColumn(i, this.getColumn(i).sort(compareFunction));
    }
    return this;
};

/**
 * Transposes the matrix and returns a new one containing the result
 * @returns {Matrix}
 */
Matrix.prototype.transpose = function transpose() {
    var result = new Matrix(this.columns, this.rows);
    var ii = this.rows, jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            result[j][i] = this[i][j];
        }
    }
    return result;
};

/**
 * Returns a subset of the matrix
 * @param {number} startRow - First row index
 * @param {number} endRow - Last row index
 * @param {number} startColumn - First column index
 * @param {number} endColumn - Last column index
 * @returns {Matrix}
 */
Matrix.prototype.subMatrix = function subMatrix(startRow, endRow, startColumn, endColumn) {
    if ((startRow > endRow) || (startColumn > endColumn) || (startRow < 0) || (startRow >= this.rows) || (endRow < 0) || (endRow >= this.rows) || (startColumn < 0) || (startColumn >= this.columns) || (endColumn < 0) || (endColumn >= this.columns))
        throw new RangeError('Argument out of range');
    var newMatrix = new Matrix(endRow - startRow + 1, endColumn - startColumn + 1);
    for (var i = startRow; i <= endRow; i++) {
        for (var j = startColumn; j <= endColumn; j++) {
            newMatrix[i - startRow][j - startColumn] = this[i][j];
        }
    }
    return newMatrix;
};

/**
 * Returns a subset of the matrix based on an array of row indices
 * @param {Array} indices - Array containing the row indices
 * @param {number} [startColumn = 0] - First column index
 * @param {number} [endColumn = this.columns-1] - Last column index
 * @returns {Matrix}
 */
Matrix.prototype.subMatrixRow = function subMatrixRow(indices, startColumn, endColumn) {
    if (typeof startColumn === 'undefined') {
        startColumn = 0;
        endColumn = this.columns - 1;
    } else if (typeof endColumn === 'undefined') {
        endColumn = this.columns - 1;
    }
    if ((startColumn > endColumn) || (startColumn < 0) || (startColumn >= this.columns) || (endColumn < 0) || (endColumn >= this.columns))
        throw new RangeError('Argument out of range.');
    var l = indices.length, rows = this.rows,
        X = new Matrix(l, endColumn - startColumn + 1);
    for (var i = 0; i < l; i++) {
        for (var j = startColumn; j <= endColumn; j++) {
            if ((indices[i] < 0) || (indices[i] >= rows))
                throw new RangeError('Argument out of range.');
            X[i][j - startColumn] = this[indices[i]][j];
        }
    }
    return X;
};

/**
 * Returns a subset of the matrix based on an array of column indices
 * @param {Array} indices - Array containing the column indices
 * @param {number} [startRow = 0] - First row index
 * @param {number} [endRow = this.rows-1] - Last row index
 * @returns {Matrix}
 */
Matrix.prototype.subMatrixColumn = function subMatrixColumn(indices, startRow, endRow) {
    if (typeof startRow === 'undefined') {
        startRow = 0;
        endRow = this.rows - 1;
    } else if (typeof endRow === 'undefined') {
        endRow = this.rows - 1;
    }
    if ((startRow > endRow) || (startRow < 0) || (startRow >= this.rows) || (endRow < 0) || (endRow >= this.rows))
        throw new RangeError('Argument out of range.');
    var l = indices.length, columns = this.columns,
        X = new Matrix(endRow - startRow + 1, l);
    for (var i = 0; i < l; i++) {
        for (var j = startRow; j <= endRow; j++) {
            if ((indices[i] < 0) || (indices[i] >= columns))
                throw new RangeError('Argument out of range.');
            X[j - startRow][i] = this[j][indices[i]];
        }
    }
    return X;
};

/**
 * Returns the trace of the matrix (sum of the diagonal elements)
 * @returns {number}
 */
Matrix.prototype.trace = function trace() {
    if (!this.isSquare())
        throw new TypeError('The matrix is not square');
    var trace = 0, i = 0, l = this.rows;
    for (; i < l; i++) {
        trace += this[i][i];
    }
    return trace;
};

/**
 * Sets each element of the matrix to its absolute value
 * @returns {Matrix} this
 */
Matrix.prototype.abs = function abs() {
    var ii = this.rows, jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            this[i][j] = Math.abs(this[i][j]);
        }
    }
};

module.exports = Matrix;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {
exports.base64 = true;
exports.array = true;
exports.string = true;
exports.arraybuffer = typeof ArrayBuffer !== "undefined" && typeof Uint8Array !== "undefined";
// contains true if JSZip can read/generate nodejs Buffer, false otherwise.
// Browserify will provide a Buffer implementation for browsers, which is
// an augmented Uint8Array (i.e., can be used as either Buffer or U8).
exports.nodebuffer = typeof Buffer !== "undefined";
// contains true if JSZip can read/generate Uint8Array, false otherwise.
exports.uint8array = typeof Uint8Array !== "undefined";

if (typeof ArrayBuffer === "undefined") {
    exports.blob = false;
}
else {
    var buffer = new ArrayBuffer(0);
    try {
        exports.blob = new Blob([buffer], {
            type: "application/zip"
        }).size === 0;
    }
    catch (e) {
        try {
            var Builder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
            var builder = new Builder();
            builder.append(buffer);
            exports.blob = builder.getBlob('application/zip').size === 0;
        }
        catch (e) {
            exports.blob = false;
        }
    }
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15).Buffer))

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(2);
module.exports.Decompositions = module.exports.DC = __webpack_require__(78);


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.array = __webpack_require__(31);
exports.matrix = __webpack_require__(84);


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// small note on the best way to define array
// http://jsperf.com/lp-array-and-loops/2

const StatArray = __webpack_require__(5).array;
const ArrayUtils = __webpack_require__(59);
const JcampConverter = __webpack_require__(17);
const JcampCreator = __webpack_require__(102);
const peakPicking = __webpack_require__(39);

const DATACLASS_XY = 1;
const DATACLASS_PEAK = 2;

/**
 * Construct the object from the given sd object(output of the jcampconverter or brukerconverter filter)
 * @class SD
 * @param {SD} sd
 * @constructor
 */
class SD {
    constructor(sd) {
        this.sd = sd;
        this.activeElement = 0;
    }

    /**
     * Creates a SD instance from the given jcamp.
     * @param {string} jcamp - The jcamp string to parse from
     * @param {object} options - Jcamp parsing options
     * @param {boolean} [options.keepSpectra=true] - If set to false the spectra data points will not be stored in the instance
     * @param {RegExp} [options.keepRecordsRegExp=/^.+$/] A regular expression for metadata fields to extract from the jcamp
     * @return {SD} Return the constructed SD instance
     */
    static fromJcamp(jcamp, options) {
        options = Object.assign({}, {keepSpectra: true, keepRecordsRegExp: /^.+$/}, options, {xy: true});
        var spectrum = JcampConverter.convert(jcamp, options);
        return new this(spectrum);
    }

    /**
     * This function sets the nactiveSpectrum sub-spectrum as active
     * @param {number} nactiveSpectrum index of the sub-spectrum to set as active
     */
    setActiveElement(nactiveSpectrum) {
        this.activeElement = nactiveSpectrum;
    }

    /**
     * This function returns the index of the active sub-spectrum.
     * @return {number|*}
     */
    getActiveElement() {
        return this.activeElement;
    }

    /**
     * This function returns the units of the independent dimension.
     * @return {xUnit|*|M.xUnit}
     */
    getXUnits() {
        return this.getSpectrum().xUnit;
    }

    /**
     * This function set the units of the independent dimension.
     * @param {string} units of the independent dimension.
     */
    setXUnits(units) {
        this.getSpectrum().xUnit = units;
    }
    /**
     * * This function returns the units of the dependent variable.
     * @return {yUnit|*|M.yUnit}
     */
    getYUnits() {
        return this.getSpectrum().yUnit;
    }

    /**
     * This function returns the information about the dimensions
     * @param {number} index of the tuple
     * @return {number|*}
     */
    getSpectraVariable(index) {
        return this.sd.ntuples[index];
    }

    /**
     * Return the current page
     */
    getPage(index) {
        return this.sd.spectra[index].page;
    }

    /**
     * Return the number of points in the current spectrum
     * @param {number} i of sub-spectrum
     * @return {number | *}
     */
    getNbPoints(i) {
        return this.getSpectrumData(i).y.length;
    }

    /**
     * Return the first value of the independent dimension
     * @param {i} i of sub-spectrum
     * @return {number | *}
     */
    getFirstX(i) {
        i = i || this.activeElement;
        return this.sd.spectra[i].firstX;
    }

    /**
     * Set the firstX for this spectrum. You have to force and update of the xAxis after!!!
     * @param {number} x - The value for firstX
     * @param {number} i sub-spectrum Default:activeSpectrum
     */
    setFirstX(x, i) {
        i = i || this.activeElement;
        this.sd.spectra[i].firstX = x;
    }

    /**
     * Return the last value of the direct dimension
     * @param {number} i - sub-spectrum Default:activeSpectrum
     * @return {number}
     */
    getLastX(i) {
        i = i || this.activeElement;
        return this.sd.spectra[i].lastX;
    }


    /**
     * Set the last value of the direct dimension. You have to force and update of the xAxis after!!!
     * @param {number} x - The value for lastX
     * @param {number} i - sub-spectrum Default:activeSpectrum
     */
    setLastX(x, i) {
        i = i || this.activeElement;
        this.sd.spectra[i].lastX = x;
    }

    /**
     */
    /**
     * Return the first value of the direct dimension
     * @param {number} i - sub-spectrum Default:activeSpectrum
     * @return {number}
     */
    getFirstY(i) {
        i = i || this.activeElement;
        return this.sd.spectra[i].firstY;
    }

    /**
     * Set the first value of the indirect dimension. Only valid for 2D spectra.
     * @param {number} y - the value of firstY
     * @param {number} i - sub-spectrum Default: activeSpectrum
     */
    setFirstY(y, i) {
        i = i || this.activeElement;
        this.sd.spectra[i].firstY = y;
    }

    /**
     * Return the first value of the indirect dimension. Only valid for 2D spectra.
     * @param {number} i - sub-spectrum Default: activeSpectrum
     * @return {number}
     */
    getLastY(i) {
        i = i || this.activeElement;
        return this.sd.spectra[i].lastY;
    }

    /**
     * Return the first value of the indirect dimension
     * @param {number} y - the value of firstY
     * @param {number} i - sub-spectrum Default:activeSpectrum
     */
    setLastY(y, i) {
        i = i || this.activeElement;
        this.sd.spectra[i].lastY = y;
    }

    /**
     * Set the spectrum data_class. It could be DATACLASS_PEAK=1 or DATACLASS_XY=2
     * @param {string} dataClass - data_class of the current spectra data
     */
    setDataClass(dataClass) {
        if (dataClass === DATACLASS_PEAK) {
            this.getSpectrum().isPeaktable = true;
            this.getSpectrum().isXYdata = false;
        }
        if (dataClass === DATACLASS_XY) {
            this.getSpectrum().isXYdata = true;
            this.getSpectrum().isPeaktable = false;
        }
    }

    /**
     * Is this a PEAKTABLE spectrum?
     * @return {boolean}
     */
    isDataClassPeak() {
        if (this.getSpectrum().isPeaktable) {
            return this.getSpectrum().isPeaktable;
        }
        return false;
    }

    /**
     * Is this a XY spectrum?
     * @return {*}
     */
    isDataClassXY() {
        if (this.getSpectrum().isXYdata) {
            return this.getSpectrum().isXYdata;
        }
        return false;
    }

    /**
     * Set the data type for this spectrum. It could be one of the following:
     ["INFRARED"||"IR","IV","NDNMRSPEC","NDNMRFID","NMRSPEC","NMRFID","HPLC","MASS"
     * "UV", "RAMAN" "GC"|| "GASCHROMATOGRAPH","CD"|| "DICHRO","XY","DEC"]
     * @param {string} dataType
     */
    setDataType(dataType) {
        this.getSpectrum().dataType = dataType;
    }

    /**
     * Return the dataType(see: setDataType )
     * @return {string|string|*|string}
     */
    getDataType() {
        return this.getSpectrum().dataType;
    }

    /**
     * Return the i-th sub-spectrum data in the current spectrum
     * @param {number} i - sub-spectrum Default:activeSpectrum
     * @return {object}
     */
    getSpectrumData(i) {
        i = i || this.activeElement;
        return this.sd.spectra[i].data[0];
    }

    /**
     * Return the i-th sub-spectra in the current spectrum
     * @param {number} i - sub-spectrum Default:activeSpectrum
     * @return {object}
     */
    getSpectrum(i) {
        i = i || this.activeElement;
        return this.sd.spectra[i];
    }

    /**
     * Return the amount of sub-spectra in this object
     * @return {*}
     */
    getNbSubSpectra() {
        return this.sd.spectra.length;
    }

    /**
     *  Returns an array containing the x values of the spectrum
     * @param {number} i sub-spectrum Default:activeSpectrum
     * @return {Array}
     */
    getXData(i) {
        return this.getSpectrumData(i).x;
    }

    /**
     * This function returns a double array containing the values with the intensities for the current sub-spectrum.
     * @param {number} i sub-spectrum Default:activeSpectrum
     * @return {Array}
     */
    getYData(i) {
        return this.getSpectrumData(i).y;
    }

    /**
     * Returns the x value at the specified index for the active sub-spectrum.
     * @param {number} i array index between 0 and spectrum.getNbPoints()-1
     * @return {number}
     */
    getX(i) {
        return this.getXData()[i];
    }

    /**
     * Returns the y value at the specified index for the active sub-spectrum.
     * @param {number} i array index between 0 and spectrum.getNbPoints()-1
     * @return {number}
     */
    getY(i) {
        return this.getYData()[i];
    }

    /**
     * Returns a double[2][nbPoints] where the first row contains the x values and the second row the y values.
     * @param {number} i sub-spectrum Default:activeSpectrum
     * @return {*[]}
     */
    getXYData(i) {
        return [this.getXData(i), this.getYData(i)];
    }

    /**
     * Return the title of the current spectrum.
     * @param {number} i sub-spectrum Default:activeSpectrum
     * @return {*}
     */
    getTitle(i) {
        return this.getSpectrum(i).title;
    }

    /**
     * Set the title of this spectrum.
     * @param {string} newTitle The new title
     * @param {number} i sub-spectrum Default:activeSpectrum
     */
    setTitle(newTitle, i) {
        this.getSpectrum(i).title = newTitle;
    }

    /**
     * This function returns the minimal value of Y
     * @param {number} i sub-spectrum Default:activeSpectrum
     * @return {number}
     */
    getMinY(i) {
        return StatArray.min(this.getYData(i));
    }

    /**
     * This function returns the maximal value of Y
     * @param {number} i sub-spectrum Default:activeSpectrum
     * @return {number}
     */
    getMaxY(i) {
        return StatArray.max(this.getYData(i));
    }

    /**
     * Return the min and max value of Y
     * @param {number} i sub-spectrum Default:activeSpectrum
     * @return {{min, max}|*}
     */
    getMinMaxY(i) {
        return StatArray.minMax(this.getYData(i));
    }


    /**
     * Get the noise threshold level of the current spectrum. It uses median instead of the mean
     * @return {number}
     */
    getNoiseLevel() {
        var stddev = StatArray.robustMeanAndStdev(this.getYData()).stdev;
        return stddev * this.getNMRPeakThreshold(this.getNucleus(1));
    }

    /**
     * Return the xValue for the given index.
     * @param {number} doublePoint
     * @return {number}
     */
    arrayPointToUnits(doublePoint) {
        return (this.getFirstX() - (doublePoint * (this.getFirstX() - this.getLastX()) / (this.getNbPoints() - 1)));
    }

    /**
     * Returns the index-value for the data array corresponding to a X-value in
     * units for the element of spectraData to which it is linked (spectraNb).
     * This method makes use of spectraData.getFirstX(), spectraData.getLastX()
     * and spectraData.getNbPoints() to derive the return value if it of data class XY
     * It performs a binary search if the spectrum is a peak table
     * @param {number} inValue - value in Units to be converted
     * @return {number} An integer representing the index value of the inValue
     */
    unitsToArrayPoint(inValue) {
        if (this.isDataClassXY()) {
            return Math.round((this.getFirstX() - inValue) * (-1.0 / this.getDeltaX()));
        } else if (this.isDataClassPeak()) {
            var currentArrayPoint = 0, upperLimit = this.getNbPoints() - 1, lowerLimit = 0, midPoint;
            //If inverted scale
            if (this.getFirstX() > this.getLastX()) {
                upperLimit = 0;
                lowerLimit = this.getNbPoints() - 1;

                if (inValue > this.getFirstX()) {
                    return this.getNbPoints();
                }
                if (inValue < this.getLastX()) {
                    return -1;
                }
            } else {
                if (inValue < this.getFirstX()) {
                    return -1;
                }
                if (inValue > this.getLastX()) {
                    return this.getNbPoints();
                }
            }

            while (Math.abs(upperLimit - lowerLimit) > 1) {
                midPoint = Math.round(Math.floor((upperLimit + lowerLimit) / 2));
                //x=this.getX(midPoint);
                if (this.getX(midPoint) === inValue) {
                    return midPoint;
                }
                if (this.getX(midPoint) > inValue) {
                    upperLimit = midPoint;
                } else {
                    lowerLimit = midPoint;
                }
            }
            currentArrayPoint = lowerLimit;
            if (Math.abs(this.getX(lowerLimit) - inValue) > Math.abs(this.getX(upperLimit) - inValue)) {
                currentArrayPoint = upperLimit;
            }
            return currentArrayPoint;
        } else {
            return 0;
        }
    }

    /**
     * Returns the separation between 2 consecutive points in the frequency domain
     * @return {number}
     */
    getDeltaX() {
        return (this.getLastX() - this.getFirstX()) / (this.getNbPoints() - 1);
    }

    /**
     * This function scales the values of Y between the min and max parameters
     * @param {number} min - Minimum desired value for Y
     * @param {number} max - Maximum desired value for Y
     */
    setMinMax(min, max) {
        ArrayUtils.scale(this.getYData(), {min: min, max: max, inplace: true});
    }

    /**
     * This function scales the values of Y to fit the min parameter
     * @param {number} min - Minimum desired value for Y
     */
    setMin(min) {
        ArrayUtils.scale(this.getYData(), {min: min, inplace: true});
    }

    /**
     * This function scales the values of Y to fit the max parameter
     * @param {number} max - Maximum desired value for Y
     */
    setMax(max) {
        ArrayUtils.scale(this.getYData(), {max: max, inplace: true});
    }

    /**
     * This function shifts the values of Y
     * @param {number} value - Distance of the shift
     */
    yShift(value) {
        var y = this.getSpectrumData().y;
        var length = this.getNbPoints(), i = 0;
        for (i = 0; i < length; i++) {
            y[i] += value;
        }
        this.getSpectrum().firstY += value;
        this.getSpectrum().lastY += value;
    }

    /**
     * This function shift the given spectraData. After this function is applied, all the peaks in the
     * spectraData will be found at xi+globalShift
     * @param {number} globalShift - Distance of the shift for direct dimension.
     */
    shift(globalShift) {
        for (let i = 0; i < this.getNbSubSpectra(); i++) {
            this.setActiveElement(i);
            var x = this.getSpectrumData().x;
            var length = this.getNbPoints(), j = 0;
            for (j = 0; j < length; j++) {
                x[j] += globalShift;
            }

            this.getSpectrum().firstX += globalShift;
            this.getSpectrum().lastX += globalShift;
        }
    }

    /**
     * This function fills a zone of the spectrum with the given value.
     * If value is undefined it will suppress the elements
     * @param {number} from - one limit the spectrum to fill
     * @param {number} to - one limit the spectrum to fill
     * @param {number} value - value with which to fill
     */
    fillWith(from, to, value) {
        var tmp, start, end, x, y;
        if (from > to) {
            tmp = from;
            from = to;
            to = tmp;
        }

        for (var i = 0; i < this.getNbSubSpectra(); i++) {
            this.setActiveElement(i);
            x = this.getXData();
            y = this.getYData();
            start = this.unitsToArrayPoint(from);
            end = this.unitsToArrayPoint(to);
            if (start > end) {
                tmp = start;
                start = end;
                end = tmp;
            }
            if (start < 0) {
                start = 0;
            }
            if (end >= this.getNbPoints) {
                end = this.getNbPoints - 1;
            }

            if (typeof value !== 'number') {
                y.splice(start, end - start);
                x.splice(start, end - start);
            } else {
                for (i = start; i <= end; i++) {
                    y[i] = value;
                }
            }
        }
    }

    /**
     * This function suppress a zone from the given spectraData within the given x range.
     * Returns a spectraData of type PEAKDATA without peaks in the given region
     * @param {number} from - one limit the spectrum to suppress
     * @param {number} to - one limit the spectrum to suppress
     */
    suppressZone(from, to) {
        this.fillWith(from, to);
        this.setDataClass(DATACLASS_PEAK);
    }


    /**
     * This function performs a simple peak detection in a spectraData. The parameters that can be specified are:
     * Returns a two dimensional array of double specifying [x,y] of the detected peaks.
     * @option from:    Lower limit.
     * @option to:      Upper limit.
     * @option threshold: The minimum intensity to consider a peak as a signal, expressed as a percentage of the highest peak.
     * @option stdev: Number of standard deviation of the noise for the threshold calculation if a threshold is not specified.
     * @option resolution: The maximum resolution of the spectrum for considering peaks.
     * @option yInverted: Is it a Y inverted spectrum?(like an IR spectrum)
     * @option smooth: A function for smoothing the spectraData before the detection. If your are dealing with
     * experimental spectra, smoothing will make the algorithm less prune to false positives.
     */
    /*
    simplePeakPicking(parameters) {
        //@TODO implements this filter
    }
    */

    /**
     * Get the maximum peak the spectrum
     * @return {[x, y]}
     */
    getMaxPeak() {
        var y = this.getSpectraDataY();
        var max = y[0], index = 0;
        for (var i = 0; i < y.length; i++) {
            if (max < y[i]) {
                max = y[i];
                index = i;
            }
        }
        return [this.getX(index), max];
    }

    /** TODO: should be modifed, this is same that getParamInt and getParam
     * Get the value of the parameter. If it is null, will set up a default value
     * @param {string} name - The parameter name
     * @param {*} defvalue - The default value
     * @return {number}
     */

    getParamDouble(name, defvalue) {
        var value = this.sd.info[name];
        if (!value) {
            value = defvalue;
        }
        return value;
    }

    /**
     * Get the string of the value of the parameter. If it is null, will set up a default value
     * @param {string} name - The parameter name
     * @param {*} defvalue - The default value
     * @return {string}
     */
    getParamString(name, defvalue) {
        var value = this.sd.info[name];
        if (!value) {
            value = defvalue;
        }
        return value + '';
    }

    /**
     * Get the value of the parameter
     * @param {string} name - The parameter name
     * @param {*} defvalue - The default value
     * @return {number}
     */
    getParamInt(name, defvalue) {
        var value = this.sd.info[name];
        if (!value) {
            value = defvalue;
        }
        return value;
    }

    /**
     * Get the value of the parameter
     * @param {string} name - The parameter name
     * @param {*} defvalue - The default value
     * @return {*}
     */
    getParam(name, defvalue) {
        var value = this.sd.info[name];
        if (!value) {
            value = defvalue;
        }
        return value;
    }

    /**
     * True if the spectrum.info contains the given parameter
     * @param {string} name - The parameter name
     * @return {boolean}
     */
    containsParam(name) {
        if (this.sd.info[name]) {
            return true;
        }
        return false;
    }

    /**
     * Return the y elements of the current spectrum. Same as getYData. Kept for backward compatibility.
     * @return {Array}
     */
    getSpectraDataY() {
        return this.getYData();
    }

    /**
     * Return the x elements of the current spectrum. Same as getXData. Kept for backward compatibility.
     * @return {Array}
     */
    getSpectraDataX() {
        return this.getXData();
    }

    /**
     * Update min max values of X and Y axis.
     */
    resetMinMax() {
        //TODO: Implement this function
    }

    /**
     * Set a new parameter to this spectrum
     * @param {string} name - the parameter name
     * @param {number | *} value - the parameter value
     */
    putParam(name, value) {
        this.sd.info[name] = value;
    }

    /**
     * This function returns the area under the spectrum in the given window (spectrum units)
     * @param {number} from - one limit in spectrum units
     * @param {number} to - one limit in spectrum units
     * @return {number}
     */
    getArea(from, to) {
        var i0 = this.unitsToArrayPoint(from);
        var ie = this.unitsToArrayPoint(to);
        var area = 0;
        if (i0 > ie) {
            var tmp = i0;
            i0 = ie;
            ie = tmp;
        }
        i0 = i0 < 0 ? 0 : i0;
        ie = ie >= this.getNbPoints() ? this.getNbPoints() - 1 : ie;
        for (var i = i0; i < ie; i++) {
            area += this.getY(i);
        }
        return area * Math.abs(this.getDeltaX());
    }

    /**
     * This function return the integral values for certains ranges at specific SD instance .
     * @param {array} ranges - array of objects ranges
     * @param {object} options - option such as nH for normalization, if it is nH is zero the integral value returned 
     * is absolute value
     */
    updateIntegrals(ranges, options) {
        var sum = 0;
        ranges.forEach(range => {
            range.integral = this.getArea(range.from, range.to);
            sum += range.integral;
        });
        if (options.nH !== 0) {
            var factor = options.nH / sum;
            ranges.forEach(range => {
                range.integral *= factor;
            });
        }
    }

    /**
     * Returns a equally spaced vector within the given window.
     * @param {number} from - one limit in spectrum units
     * @param {number} to - one limit in spectrum units
     * @param {number} nPoints - number of points to return(!!!sometimes it is not possible to return exactly the required nbPoints)
     * @return {Array}
     */
    getVector(from, to, nPoints) {
        if (nPoints) {
            return ArrayUtils.getEquallySpacedData(this.getSpectraDataX(), this.getSpectraDataY(),
                {from: from, to: to, numberOfPoints: nPoints});
        } else {
            return this.getPointsInWindow(from, to);
        }
    }

    /**
     * Returns all the point in a given window.
     * Not tested, you have to know what you are doing
     * @param {number} from - index of a limit of the desired window.
     * @param {number} to - index of a limit of the desired window
     * @param {number} nPoints - number of points in the desired window.
     * @return {Array} XYarray data of the desired window.
     */
    getPointsInWindow(from, to, nPoints) {
        var x = this.getSpectraDataX();
        var y = this.getSpectraDataY();
        var start = 0, end = x.length - 1, direction = 1;

        if (x[0] > x[1]) {
            direction = -1;
            start = x.length - 1;
            end = 0;
        }

        if (from > to) {
            var tmp = from;
            from = to;
            to = tmp;
        }
        //console.log(x[end]+" "+from+" "+x[start]+" "+to);
        if (x[start] > to || x[end] < from) {
            return [];
        }

        while (x[start] < from) {
            start += direction;
        }
        while (x[end] > to) {
            end -= direction;
        }

        var winPoints = Math.abs(end - start) + 1;
        if (!nPoints) {
            nPoints = winPoints;
        }
        var xwin = new Array(nPoints);
        var ywin = new Array(nPoints);
        var index = 0;

        if (direction === -1) {
            index = nPoints - 1;
        }

        var di = winPoints / nPoints;
        var i = start - direction;
        for (var k = 0; k < nPoints; k++) {
            i += Math.round(di * direction);
            xwin[index] = x[i];
            ywin[index] = y[i];
            index += direction;
        }
        return [xwin, ywin];
    }

    /**
     * Is it a 2D spectrum?
     * @return {boolean}
     */
    is2D() {
        if (typeof this.sd.twoD === 'undefined') {
            return false;
        }
        return this.sd.twoD;
    }

    /**
     * Set the normalization value for this spectrum
     * @param {number} value - integral value to set up
     */
    setTotalIntegral(value) {
        this.totalIntegralValue = value;
    }

    /**
     * Return the normalization value. It is not set check the molfile and guess it from the number of atoms.
     * @return {number}
     */
    get totalIntegral() {
        if (this.totalIntegralValue) {
            return this.totalIntegralValue;
        } else if (this.molecule) {
            if (this.getNucleus(0).indexOf('H')) {
                return this.mf.replace(/.*H([0-9]+).*/, '$1') * 1;
            }
            if (this.getNucleus(0).indexOf('C')) {
                return this.mf.replace(/.*C([0-9]+).*/, '$1') * 1;
            }
        } else {
                //throw "Could not determine the totalIntegral";
            return 100;
        }

        return 1;
    }

    /**
     * this function set a molfile, molecule and molecular formula.
     * @param {string} molfile - The molfile that correspond to current spectra data
     */
    setMolfile(molfile) {
        this.molfile = molfile;
    }

    setMF(mf) {
        this.mf = mf;
    }

    /**
     * this function create a new peakPicking
     * @param {object} parameters - parameters to calculation of peakPicking
     * @return {*}
     */
    createPeaks(parameters) {
        this.peaks = null;
        this.peaks = this.getPeaks(parameters);
        return this.peaks;
    }

    /**
     * this function return the peak table or extract the peak of the spectrum.
     * @param {object} parameters - parameters to calculation of peakPicking
     * @return {*}
     */
    getPeaks(parameters) {
        if (this.peaks) {
            return this.peaks;
        } else {
            return peakPicking(this, parameters);
        }
    }

    /*autoAssignment(options) {

    }*/

    /**
     * This function creates a String that represents the given spectraData in the format JCAMP-DX 5.0
     * The X,Y data can be compressed using one of the methods described in:
     * "JCAMP-DX. A STANDARD FORMAT FOR THE EXCHANGE OF ION MOBILITY SPECTROMETRY DATA",
     *  http://www.iupac.org/publications/pac/pdf/2001/pdf/7311x1765.pdf
     * @param {object} options - some options are availables:
     * @option {string} encode  - ['FIX','SQZ','DIF','DIFDUP','CVS','PAC'] (Default: 'DIFDUP')
     * @option {number} yfactor - The YFACTOR. It allows to compress the data by removing digits from the ordinate. (Default: 1)
     * @option {string} type - ["NTUPLES", "SIMPLE"] (Default: "SIMPLE")
     * @option {object} keep - A set of user defined parameters of the given SpectraData to be stored in the jcamp.
     * @example SD.toJcamp(spectraData,{encode:'DIFDUP',yfactor:0.01,type:"SIMPLE",keep:['#batchID','#url']});
     * @return {*} a string containing the jcamp-DX file
     */
    toJcamp(options) {
        var creator = new JcampCreator();
        return creator.convert(this, Object.assign({}, {yFactor: 1, encode: 'DIFDUP', type: 'SIMPLE'}, options));
    }
}

module.exports = SD;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// private property
var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";


// public method for encoding
exports.encode = function(input, utf8) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    while (i < input.length) {

        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        }
        else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4);

    }

    return output;
};

// public method for decoding
exports.decode = function(input, utf8) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {

        enc1 = _keyStr.indexOf(input.charAt(i++));
        enc2 = _keyStr.indexOf(input.charAt(i++));
        enc3 = _keyStr.indexOf(input.charAt(i++));
        enc4 = _keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }

    }

    return output;

};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.STORE = {
    magic: "\x00\x00",
    compress: function(content, compressionOptions) {
        return content; // no compression
    },
    uncompress: function(content) {
        return content; // no compression
    },
    compressInputType: null,
    uncompressInputType: null
};
exports.DEFLATE = __webpack_require__(49);


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {
module.exports = function(data, encoding){
    return new Buffer(data, encoding);
};
module.exports.test = function(b){
    return Buffer.isBuffer(b);
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15).Buffer))

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var support = __webpack_require__(3);
var utils = __webpack_require__(0);
var crc32 = __webpack_require__(47);
var signature = __webpack_require__(22);
var defaults = __webpack_require__(21);
var base64 = __webpack_require__(7);
var compressions = __webpack_require__(8);
var CompressedObject = __webpack_require__(19);
var nodeBuffer = __webpack_require__(9);
var utf8 = __webpack_require__(25);
var StringWriter = __webpack_require__(53);
var Uint8ArrayWriter = __webpack_require__(54);

/**
 * Returns the raw data of a ZipObject, decompress the content if necessary.
 * @param {ZipObject} file the file to use.
 * @return {String|ArrayBuffer|Uint8Array|Buffer} the data.
 */
var getRawData = function(file) {
    if (file._data instanceof CompressedObject) {
        file._data = file._data.getContent();
        file.options.binary = true;
        file.options.base64 = false;

        if (utils.getTypeOf(file._data) === "uint8array") {
            var copy = file._data;
            // when reading an arraybuffer, the CompressedObject mechanism will keep it and subarray() a Uint8Array.
            // if we request a file in the same format, we might get the same Uint8Array or its ArrayBuffer (the original zip file).
            file._data = new Uint8Array(copy.length);
            // with an empty Uint8Array, Opera fails with a "Offset larger than array size"
            if (copy.length !== 0) {
                file._data.set(copy, 0);
            }
        }
    }
    return file._data;
};

/**
 * Returns the data of a ZipObject in a binary form. If the content is an unicode string, encode it.
 * @param {ZipObject} file the file to use.
 * @return {String|ArrayBuffer|Uint8Array|Buffer} the data.
 */
var getBinaryData = function(file) {
    var result = getRawData(file),
        type = utils.getTypeOf(result);
    if (type === "string") {
        if (!file.options.binary) {
            // unicode text !
            // unicode string => binary string is a painful process, check if we can avoid it.
            if (support.nodebuffer) {
                return nodeBuffer(result, "utf-8");
            }
        }
        return file.asBinary();
    }
    return result;
};

/**
 * Transform this._data into a string.
 * @param {function} filter a function String -> String, applied if not null on the result.
 * @return {String} the string representing this._data.
 */
var dataToString = function(asUTF8) {
    var result = getRawData(this);
    if (result === null || typeof result === "undefined") {
        return "";
    }
    // if the data is a base64 string, we decode it before checking the encoding !
    if (this.options.base64) {
        result = base64.decode(result);
    }
    if (asUTF8 && this.options.binary) {
        // JSZip.prototype.utf8decode supports arrays as input
        // skip to array => string step, utf8decode will do it.
        result = out.utf8decode(result);
    }
    else {
        // no utf8 transformation, do the array => string step.
        result = utils.transformTo("string", result);
    }

    if (!asUTF8 && !this.options.binary) {
        result = utils.transformTo("string", out.utf8encode(result));
    }
    return result;
};
/**
 * A simple object representing a file in the zip file.
 * @constructor
 * @param {string} name the name of the file
 * @param {String|ArrayBuffer|Uint8Array|Buffer} data the data
 * @param {Object} options the options of the file
 */
var ZipObject = function(name, data, options) {
    this.name = name;
    this.dir = options.dir;
    this.date = options.date;
    this.comment = options.comment;
    this.unixPermissions = options.unixPermissions;
    this.dosPermissions = options.dosPermissions;

    this._data = data;
    this.options = options;

    /*
     * This object contains initial values for dir and date.
     * With them, we can check if the user changed the deprecated metadata in
     * `ZipObject#options` or not.
     */
    this._initialMetadata = {
      dir : options.dir,
      date : options.date
    };
};

ZipObject.prototype = {
    /**
     * Return the content as UTF8 string.
     * @return {string} the UTF8 string.
     */
    asText: function() {
        return dataToString.call(this, true);
    },
    /**
     * Returns the binary content.
     * @return {string} the content as binary.
     */
    asBinary: function() {
        return dataToString.call(this, false);
    },
    /**
     * Returns the content as a nodejs Buffer.
     * @return {Buffer} the content as a Buffer.
     */
    asNodeBuffer: function() {
        var result = getBinaryData(this);
        return utils.transformTo("nodebuffer", result);
    },
    /**
     * Returns the content as an Uint8Array.
     * @return {Uint8Array} the content as an Uint8Array.
     */
    asUint8Array: function() {
        var result = getBinaryData(this);
        return utils.transformTo("uint8array", result);
    },
    /**
     * Returns the content as an ArrayBuffer.
     * @return {ArrayBuffer} the content as an ArrayBufer.
     */
    asArrayBuffer: function() {
        return this.asUint8Array().buffer;
    }
};

/**
 * Transform an integer into a string in hexadecimal.
 * @private
 * @param {number} dec the number to convert.
 * @param {number} bytes the number of bytes to generate.
 * @returns {string} the result.
 */
var decToHex = function(dec, bytes) {
    var hex = "",
        i;
    for (i = 0; i < bytes; i++) {
        hex += String.fromCharCode(dec & 0xff);
        dec = dec >>> 8;
    }
    return hex;
};

/**
 * Transforms the (incomplete) options from the user into the complete
 * set of options to create a file.
 * @private
 * @param {Object} o the options from the user.
 * @return {Object} the complete set of options.
 */
var prepareFileAttrs = function(o) {
    o = o || {};
    if (o.base64 === true && (o.binary === null || o.binary === undefined)) {
        o.binary = true;
    }
    o = utils.extend(o, defaults);
    o.date = o.date || new Date();
    if (o.compression !== null) o.compression = o.compression.toUpperCase();

    return o;
};

/**
 * Add a file in the current folder.
 * @private
 * @param {string} name the name of the file
 * @param {String|ArrayBuffer|Uint8Array|Buffer} data the data of the file
 * @param {Object} o the options of the file
 * @return {Object} the new file.
 */
var fileAdd = function(name, data, o) {
    // be sure sub folders exist
    var dataType = utils.getTypeOf(data),
        parent;

    o = prepareFileAttrs(o);

    if (typeof o.unixPermissions === "string") {
        o.unixPermissions = parseInt(o.unixPermissions, 8);
    }

    // UNX_IFDIR  0040000 see zipinfo.c
    if (o.unixPermissions && (o.unixPermissions & 0x4000)) {
        o.dir = true;
    }
    // Bit 4    Directory
    if (o.dosPermissions && (o.dosPermissions & 0x0010)) {
        o.dir = true;
    }

    if (o.dir) {
        name = forceTrailingSlash(name);
    }

    if (o.createFolders && (parent = parentFolder(name))) {
        folderAdd.call(this, parent, true);
    }

    if (o.dir || data === null || typeof data === "undefined") {
        o.base64 = false;
        o.binary = false;
        data = null;
        dataType = null;
    }
    else if (dataType === "string") {
        if (o.binary && !o.base64) {
            // optimizedBinaryString == true means that the file has already been filtered with a 0xFF mask
            if (o.optimizedBinaryString !== true) {
                // this is a string, not in a base64 format.
                // Be sure that this is a correct "binary string"
                data = utils.string2binary(data);
            }
        }
    }
    else { // arraybuffer, uint8array, ...
        o.base64 = false;
        o.binary = true;

        if (!dataType && !(data instanceof CompressedObject)) {
            throw new Error("The data of '" + name + "' is in an unsupported format !");
        }

        // special case : it's way easier to work with Uint8Array than with ArrayBuffer
        if (dataType === "arraybuffer") {
            data = utils.transformTo("uint8array", data);
        }
    }

    var object = new ZipObject(name, data, o);
    this.files[name] = object;
    return object;
};

/**
 * Find the parent folder of the path.
 * @private
 * @param {string} path the path to use
 * @return {string} the parent folder, or ""
 */
var parentFolder = function (path) {
    if (path.slice(-1) == '/') {
        path = path.substring(0, path.length - 1);
    }
    var lastSlash = path.lastIndexOf('/');
    return (lastSlash > 0) ? path.substring(0, lastSlash) : "";
};


/**
 * Returns the path with a slash at the end.
 * @private
 * @param {String} path the path to check.
 * @return {String} the path with a trailing slash.
 */
var forceTrailingSlash = function(path) {
    // Check the name ends with a /
    if (path.slice(-1) != "/") {
        path += "/"; // IE doesn't like substr(-1)
    }
    return path;
};
/**
 * Add a (sub) folder in the current folder.
 * @private
 * @param {string} name the folder's name
 * @param {boolean=} [createFolders] If true, automatically create sub
 *  folders. Defaults to false.
 * @return {Object} the new folder.
 */
var folderAdd = function(name, createFolders) {
    createFolders = (typeof createFolders !== 'undefined') ? createFolders : false;

    name = forceTrailingSlash(name);

    // Does this folder already exist?
    if (!this.files[name]) {
        fileAdd.call(this, name, null, {
            dir: true,
            createFolders: createFolders
        });
    }
    return this.files[name];
};

/**
 * Generate a JSZip.CompressedObject for a given zipOject.
 * @param {ZipObject} file the object to read.
 * @param {JSZip.compression} compression the compression to use.
 * @param {Object} compressionOptions the options to use when compressing.
 * @return {JSZip.CompressedObject} the compressed result.
 */
var generateCompressedObjectFrom = function(file, compression, compressionOptions) {
    var result = new CompressedObject(),
        content;

    // the data has not been decompressed, we might reuse things !
    if (file._data instanceof CompressedObject) {
        result.uncompressedSize = file._data.uncompressedSize;
        result.crc32 = file._data.crc32;

        if (result.uncompressedSize === 0 || file.dir) {
            compression = compressions['STORE'];
            result.compressedContent = "";
            result.crc32 = 0;
        }
        else if (file._data.compressionMethod === compression.magic) {
            result.compressedContent = file._data.getCompressedContent();
        }
        else {
            content = file._data.getContent();
            // need to decompress / recompress
            result.compressedContent = compression.compress(utils.transformTo(compression.compressInputType, content), compressionOptions);
        }
    }
    else {
        // have uncompressed data
        content = getBinaryData(file);
        if (!content || content.length === 0 || file.dir) {
            compression = compressions['STORE'];
            content = "";
        }
        result.uncompressedSize = content.length;
        result.crc32 = crc32(content);
        result.compressedContent = compression.compress(utils.transformTo(compression.compressInputType, content), compressionOptions);
    }

    result.compressedSize = result.compressedContent.length;
    result.compressionMethod = compression.magic;

    return result;
};




/**
 * Generate the UNIX part of the external file attributes.
 * @param {Object} unixPermissions the unix permissions or null.
 * @param {Boolean} isDir true if the entry is a directory, false otherwise.
 * @return {Number} a 32 bit integer.
 *
 * adapted from http://unix.stackexchange.com/questions/14705/the-zip-formats-external-file-attribute :
 *
 * TTTTsstrwxrwxrwx0000000000ADVSHR
 * ^^^^____________________________ file type, see zipinfo.c (UNX_*)
 *     ^^^_________________________ setuid, setgid, sticky
 *        ^^^^^^^^^________________ permissions
 *                 ^^^^^^^^^^______ not used ?
 *                           ^^^^^^ DOS attribute bits : Archive, Directory, Volume label, System file, Hidden, Read only
 */
var generateUnixExternalFileAttr = function (unixPermissions, isDir) {

    var result = unixPermissions;
    if (!unixPermissions) {
        // I can't use octal values in strict mode, hence the hexa.
        //  040775 => 0x41fd
        // 0100664 => 0x81b4
        result = isDir ? 0x41fd : 0x81b4;
    }

    return (result & 0xFFFF) << 16;
};

/**
 * Generate the DOS part of the external file attributes.
 * @param {Object} dosPermissions the dos permissions or null.
 * @param {Boolean} isDir true if the entry is a directory, false otherwise.
 * @return {Number} a 32 bit integer.
 *
 * Bit 0     Read-Only
 * Bit 1     Hidden
 * Bit 2     System
 * Bit 3     Volume Label
 * Bit 4     Directory
 * Bit 5     Archive
 */
var generateDosExternalFileAttr = function (dosPermissions, isDir) {

    // the dir flag is already set for compatibility

    return (dosPermissions || 0)  & 0x3F;
};

/**
 * Generate the various parts used in the construction of the final zip file.
 * @param {string} name the file name.
 * @param {ZipObject} file the file content.
 * @param {JSZip.CompressedObject} compressedObject the compressed object.
 * @param {number} offset the current offset from the start of the zip file.
 * @param {String} platform let's pretend we are this platform (change platform dependents fields)
 * @param {Function} encodeFileName the function to encode the file name / comment.
 * @return {object} the zip parts.
 */
var generateZipParts = function(name, file, compressedObject, offset, platform, encodeFileName) {
    var data = compressedObject.compressedContent,
        useCustomEncoding = encodeFileName !== utf8.utf8encode,
        encodedFileName = utils.transformTo("string", encodeFileName(file.name)),
        utfEncodedFileName = utils.transformTo("string", utf8.utf8encode(file.name)),
        comment = file.comment || "",
        encodedComment = utils.transformTo("string", encodeFileName(comment)),
        utfEncodedComment = utils.transformTo("string", utf8.utf8encode(comment)),
        useUTF8ForFileName = utfEncodedFileName.length !== file.name.length,
        useUTF8ForComment = utfEncodedComment.length !== comment.length,
        o = file.options,
        dosTime,
        dosDate,
        extraFields = "",
        unicodePathExtraField = "",
        unicodeCommentExtraField = "",
        dir, date;


    // handle the deprecated options.dir
    if (file._initialMetadata.dir !== file.dir) {
        dir = file.dir;
    } else {
        dir = o.dir;
    }

    // handle the deprecated options.date
    if(file._initialMetadata.date !== file.date) {
        date = file.date;
    } else {
        date = o.date;
    }

    var extFileAttr = 0;
    var versionMadeBy = 0;
    if (dir) {
        // dos or unix, we set the dos dir flag
        extFileAttr |= 0x00010;
    }
    if(platform === "UNIX") {
        versionMadeBy = 0x031E; // UNIX, version 3.0
        extFileAttr |= generateUnixExternalFileAttr(file.unixPermissions, dir);
    } else { // DOS or other, fallback to DOS
        versionMadeBy = 0x0014; // DOS, version 2.0
        extFileAttr |= generateDosExternalFileAttr(file.dosPermissions, dir);
    }

    // date
    // @see http://www.delorie.com/djgpp/doc/rbinter/it/52/13.html
    // @see http://www.delorie.com/djgpp/doc/rbinter/it/65/16.html
    // @see http://www.delorie.com/djgpp/doc/rbinter/it/66/16.html

    dosTime = date.getHours();
    dosTime = dosTime << 6;
    dosTime = dosTime | date.getMinutes();
    dosTime = dosTime << 5;
    dosTime = dosTime | date.getSeconds() / 2;

    dosDate = date.getFullYear() - 1980;
    dosDate = dosDate << 4;
    dosDate = dosDate | (date.getMonth() + 1);
    dosDate = dosDate << 5;
    dosDate = dosDate | date.getDate();

    if (useUTF8ForFileName) {
        // set the unicode path extra field. unzip needs at least one extra
        // field to correctly handle unicode path, so using the path is as good
        // as any other information. This could improve the situation with
        // other archive managers too.
        // This field is usually used without the utf8 flag, with a non
        // unicode path in the header (winrar, winzip). This helps (a bit)
        // with the messy Windows' default compressed folders feature but
        // breaks on p7zip which doesn't seek the unicode path extra field.
        // So for now, UTF-8 everywhere !
        unicodePathExtraField =
            // Version
            decToHex(1, 1) +
            // NameCRC32
            decToHex(crc32(encodedFileName), 4) +
            // UnicodeName
            utfEncodedFileName;

        extraFields +=
            // Info-ZIP Unicode Path Extra Field
            "\x75\x70" +
            // size
            decToHex(unicodePathExtraField.length, 2) +
            // content
            unicodePathExtraField;
    }

    if(useUTF8ForComment) {

        unicodeCommentExtraField =
            // Version
            decToHex(1, 1) +
            // CommentCRC32
            decToHex(this.crc32(encodedComment), 4) +
            // UnicodeName
            utfEncodedComment;

        extraFields +=
            // Info-ZIP Unicode Path Extra Field
            "\x75\x63" +
            // size
            decToHex(unicodeCommentExtraField.length, 2) +
            // content
            unicodeCommentExtraField;
    }

    var header = "";

    // version needed to extract
    header += "\x0A\x00";
    // general purpose bit flag
    // set bit 11 if utf8
    header += !useCustomEncoding && (useUTF8ForFileName || useUTF8ForComment) ? "\x00\x08" : "\x00\x00";
    // compression method
    header += compressedObject.compressionMethod;
    // last mod file time
    header += decToHex(dosTime, 2);
    // last mod file date
    header += decToHex(dosDate, 2);
    // crc-32
    header += decToHex(compressedObject.crc32, 4);
    // compressed size
    header += decToHex(compressedObject.compressedSize, 4);
    // uncompressed size
    header += decToHex(compressedObject.uncompressedSize, 4);
    // file name length
    header += decToHex(encodedFileName.length, 2);
    // extra field length
    header += decToHex(extraFields.length, 2);


    var fileRecord = signature.LOCAL_FILE_HEADER + header + encodedFileName + extraFields;

    var dirRecord = signature.CENTRAL_FILE_HEADER +
    // version made by (00: DOS)
    decToHex(versionMadeBy, 2) +
    // file header (common to file and central directory)
    header +
    // file comment length
    decToHex(encodedComment.length, 2) +
    // disk number start
    "\x00\x00" +
    // internal file attributes TODO
    "\x00\x00" +
    // external file attributes
    decToHex(extFileAttr, 4) +
    // relative offset of local header
    decToHex(offset, 4) +
    // file name
    encodedFileName +
    // extra field
    extraFields +
    // file comment
    encodedComment;

    return {
        fileRecord: fileRecord,
        dirRecord: dirRecord,
        compressedObject: compressedObject
    };
};


// return the actual prototype of JSZip
var out = {
    /**
     * Read an existing zip and merge the data in the current JSZip object.
     * The implementation is in jszip-load.js, don't forget to include it.
     * @param {String|ArrayBuffer|Uint8Array|Buffer} stream  The stream to load
     * @param {Object} options Options for loading the stream.
     *  options.base64 : is the stream in base64 ? default : false
     * @return {JSZip} the current JSZip object
     */
    load: function(stream, options) {
        throw new Error("Load method is not defined. Is the file jszip-load.js included ?");
    },

    /**
     * Filter nested files/folders with the specified function.
     * @param {Function} search the predicate to use :
     * function (relativePath, file) {...}
     * It takes 2 arguments : the relative path and the file.
     * @return {Array} An array of matching elements.
     */
    filter: function(search) {
        var result = [],
            filename, relativePath, file, fileClone;
        for (filename in this.files) {
            if (!this.files.hasOwnProperty(filename)) {
                continue;
            }
            file = this.files[filename];
            // return a new object, don't let the user mess with our internal objects :)
            fileClone = new ZipObject(file.name, file._data, utils.extend(file.options));
            relativePath = filename.slice(this.root.length, filename.length);
            if (filename.slice(0, this.root.length) === this.root && // the file is in the current root
            search(relativePath, fileClone)) { // and the file matches the function
                result.push(fileClone);
            }
        }
        return result;
    },

    /**
     * Add a file to the zip file, or search a file.
     * @param   {string|RegExp} name The name of the file to add (if data is defined),
     * the name of the file to find (if no data) or a regex to match files.
     * @param   {String|ArrayBuffer|Uint8Array|Buffer} data  The file data, either raw or base64 encoded
     * @param   {Object} o     File options
     * @return  {JSZip|Object|Array} this JSZip object (when adding a file),
     * a file (when searching by string) or an array of files (when searching by regex).
     */
    file: function(name, data, o) {
        if (arguments.length === 1) {
            if (utils.isRegExp(name)) {
                var regexp = name;
                return this.filter(function(relativePath, file) {
                    return !file.dir && regexp.test(relativePath);
                });
            }
            else { // text
                return this.filter(function(relativePath, file) {
                    return !file.dir && relativePath === name;
                })[0] || null;
            }
        }
        else { // more than one argument : we have data !
            name = this.root + name;
            fileAdd.call(this, name, data, o);
        }
        return this;
    },

    /**
     * Add a directory to the zip file, or search.
     * @param   {String|RegExp} arg The name of the directory to add, or a regex to search folders.
     * @return  {JSZip} an object with the new directory as the root, or an array containing matching folders.
     */
    folder: function(arg) {
        if (!arg) {
            return this;
        }

        if (utils.isRegExp(arg)) {
            return this.filter(function(relativePath, file) {
                return file.dir && arg.test(relativePath);
            });
        }

        // else, name is a new folder
        var name = this.root + arg;
        var newFolder = folderAdd.call(this, name);

        // Allow chaining by returning a new object with this folder as the root
        var ret = this.clone();
        ret.root = newFolder.name;
        return ret;
    },

    /**
     * Delete a file, or a directory and all sub-files, from the zip
     * @param {string} name the name of the file to delete
     * @return {JSZip} this JSZip object
     */
    remove: function(name) {
        name = this.root + name;
        var file = this.files[name];
        if (!file) {
            // Look for any folders
            if (name.slice(-1) != "/") {
                name += "/";
            }
            file = this.files[name];
        }

        if (file && !file.dir) {
            // file
            delete this.files[name];
        } else {
            // maybe a folder, delete recursively
            var kids = this.filter(function(relativePath, file) {
                return file.name.slice(0, name.length) === name;
            });
            for (var i = 0; i < kids.length; i++) {
                delete this.files[kids[i].name];
            }
        }

        return this;
    },

    /**
     * Generate the complete zip file
     * @param {Object} options the options to generate the zip file :
     * - base64, (deprecated, use type instead) true to generate base64.
     * - compression, "STORE" by default.
     * - type, "base64" by default. Values are : string, base64, uint8array, arraybuffer, blob.
     * @return {String|Uint8Array|ArrayBuffer|Buffer|Blob} the zip file
     */
    generate: function(options) {
        options = utils.extend(options || {}, {
            base64: true,
            compression: "STORE",
            compressionOptions : null,
            type: "base64",
            platform: "DOS",
            comment: null,
            mimeType: 'application/zip',
            encodeFileName: utf8.utf8encode
        });

        utils.checkSupport(options.type);

        // accept nodejs `process.platform`
        if(
          options.platform === 'darwin' ||
          options.platform === 'freebsd' ||
          options.platform === 'linux' ||
          options.platform === 'sunos'
        ) {
          options.platform = "UNIX";
        }
        if (options.platform === 'win32') {
          options.platform = "DOS";
        }

        var zipData = [],
            localDirLength = 0,
            centralDirLength = 0,
            writer, i,
            encodedComment = utils.transformTo("string", options.encodeFileName(options.comment || this.comment || ""));

        // first, generate all the zip parts.
        for (var name in this.files) {
            if (!this.files.hasOwnProperty(name)) {
                continue;
            }
            var file = this.files[name];

            var compressionName = file.options.compression || options.compression.toUpperCase();
            var compression = compressions[compressionName];
            if (!compression) {
                throw new Error(compressionName + " is not a valid compression method !");
            }
            var compressionOptions = file.options.compressionOptions || options.compressionOptions || {};

            var compressedObject = generateCompressedObjectFrom.call(this, file, compression, compressionOptions);

            var zipPart = generateZipParts.call(this, name, file, compressedObject, localDirLength, options.platform, options.encodeFileName);
            localDirLength += zipPart.fileRecord.length + compressedObject.compressedSize;
            centralDirLength += zipPart.dirRecord.length;
            zipData.push(zipPart);
        }

        var dirEnd = "";

        // end of central dir signature
        dirEnd = signature.CENTRAL_DIRECTORY_END +
        // number of this disk
        "\x00\x00" +
        // number of the disk with the start of the central directory
        "\x00\x00" +
        // total number of entries in the central directory on this disk
        decToHex(zipData.length, 2) +
        // total number of entries in the central directory
        decToHex(zipData.length, 2) +
        // size of the central directory   4 bytes
        decToHex(centralDirLength, 4) +
        // offset of start of central directory with respect to the starting disk number
        decToHex(localDirLength, 4) +
        // .ZIP file comment length
        decToHex(encodedComment.length, 2) +
        // .ZIP file comment
        encodedComment;


        // we have all the parts (and the total length)
        // time to create a writer !
        var typeName = options.type.toLowerCase();
        if(typeName==="uint8array"||typeName==="arraybuffer"||typeName==="blob"||typeName==="nodebuffer") {
            writer = new Uint8ArrayWriter(localDirLength + centralDirLength + dirEnd.length);
        }else{
            writer = new StringWriter(localDirLength + centralDirLength + dirEnd.length);
        }

        for (i = 0; i < zipData.length; i++) {
            writer.append(zipData[i].fileRecord);
            writer.append(zipData[i].compressedObject.compressedContent);
        }
        for (i = 0; i < zipData.length; i++) {
            writer.append(zipData[i].dirRecord);
        }

        writer.append(dirEnd);

        var zip = writer.finalize();



        switch(options.type.toLowerCase()) {
            // case "zip is an Uint8Array"
            case "uint8array" :
            case "arraybuffer" :
            case "nodebuffer" :
               return utils.transformTo(options.type.toLowerCase(), zip);
            case "blob" :
               return utils.arrayBuffer2Blob(utils.transformTo("arraybuffer", zip), options.mimeType);
            // case "zip is a string"
            case "base64" :
               return (options.base64) ? base64.encode(zip) : zip;
            default : // case "string" :
               return zip;
         }

    },

    /**
     * @deprecated
     * This method will be removed in a future version without replacement.
     */
    crc32: function (input, crc) {
        return crc32(input, crc);
    },

    /**
     * @deprecated
     * This method will be removed in a future version without replacement.
     */
    utf8encode: function (string) {
        return utils.transformTo("string", utf8.utf8encode(string));
    },

    /**
     * @deprecated
     * This method will be removed in a future version without replacement.
     */
    utf8decode: function (input) {
        return utf8.utf8decode(input);
    }
};
module.exports = out;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.hypotenuse = function hypotenuse(a, b) {
    var r;
    if (Math.abs(a) > Math.abs(b)) {
        r = b / a;
        return Math.abs(a) * Math.sqrt(1 + r * r);
    }
    if (b !== 0) {
        r = a / b;
        return Math.abs(b) * Math.sqrt(1 + r * r);
    }
    return 0;
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  2:      'need dictionary',     /* Z_NEED_DICT       2  */
  1:      'stream end',          /* Z_STREAM_END      1  */
  0:      '',                    /* Z_OK              0  */
  '-1':   'file error',          /* Z_ERRNO         (-1) */
  '-2':   'stream error',        /* Z_STREAM_ERROR  (-2) */
  '-3':   'data error',          /* Z_DATA_ERROR    (-3) */
  '-4':   'insufficient memory', /* Z_MEM_ERROR     (-4) */
  '-5':   'buffer error',        /* Z_BUF_ERROR     (-5) */
  '-6':   'incompatible version' /* Z_VERSION_ERROR (-6) */
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//const JAnalyzer = require('./../peakPicking/JAnalyzer');
const peakPicking = __webpack_require__(39);
const acs = __webpack_require__(107);
const peak2Vector = __webpack_require__(109);
const GUI = __webpack_require__(110);

class Ranges extends Array {

    constructor(ranges) {
        if (Array.isArray(ranges)) {
            super(ranges.length);
            for (let i = 0; i < ranges.length; i++) {
                this[i] = ranges[i];
            }
        } else if (typeof ranges === 'number') {
            super(ranges);
        } else {
            super();
        }
    }

    /**
     * This function return a Range instance from predictions
     * @param {Object} predictions - predictions of a spin system
     * @param {Object} options - options object
     * @param {number} [options.lineWidth] - spectral line width
     * @param {number} [options.frequency] - frequency to determine the [from, to] of a range
     * @returns {Ranges}
     */
    static fromPrediction(predictions, options) {
        options = Object.assign({}, {lineWidth: 1, frequency: 400, nucleus: '1H'}, options);
        //1. Collapse all the equivalent predictions
        const nPredictions = predictions.length;
        const ids = new Array(nPredictions);
        var i,
            j,
            diaIDs,
            prediction,
            width,
            center,
            jc;
        for (i = 0; i < nPredictions; i++) {
            if (!ids[predictions[i].diaIDs[0]]) {
                ids[predictions[i].diaIDs[0]] = [i];
            } else {
                ids[predictions[i].diaIDs[0]].push(i);
            }
        }
        const idsKeys = Object.keys(ids);
        const result = new Array(idsKeys.length);

        for (i = 0; i < idsKeys.length; i++) {
            diaIDs = ids[idsKeys[i]];
            prediction = predictions[diaIDs[0]];
            width = 0;
            jc = prediction.j;
            if (jc) {
                for (j = 0; j < jc.length; j++) {
                    width += jc[j].coupling;
                }
            }

            width += 2 * options.lineWidth;//Add 2 times the spectral lineWidth

            width /= options.frequency;

            result[i] = {from: prediction.delta - width,
                to: prediction.delta + width,
                integral: 1,
                signal: [predictions[diaIDs[0]]]};
            for (j = 1; j < diaIDs.length; j++) {
                result[i].signal.push(predictions[diaIDs[j]]);
                result[i].integral++;
            }
        }
        //2. Merge the overlaping ranges
        for (i = 0; i < result.length; i++) {
            result[i]._highlight = result[i].signal[0].diaIDs;
            center = (result[i].from + result[i].to) / 2;
            width = Math.abs(result[i].from - result[i].to);
            for (j = result.length - 1; j > i; j--) {
                //Does it overlap?
                if (Math.abs(center - (result[j].from + result[j].to) / 2)
                    <= Math.abs(width + Math.abs(result[j].from - result[j].to)) / 2) {
                    result[i].from = Math.min(result[i].from, result[j].from);
                    result[i].to = Math.max(result[i].to, result[j].to);
                    result[i].integral = result[i].integral + result[j].integral;
                    result[i]._highlight.push(result[j].signal[0].diaIDs[0]);
                    result.splice(j, 1);
                    j = result.length - 1;
                    center = (result[i].from + result[i].to) / 2;
                    width = Math.abs(result[i].from - result[i].to);
                }
            }
        }

        return new Ranges(result);
    }

    /**
     * This function return Ranges instance from a SD instance
     * @param {SD} spectrum - SD instance
     * @param {object} opt - options object to extractPeaks function
     * @returns {Ranges}
     */
    static fromSpectrum(spectrum, opt) {
        this.options = Object.assign({}, {
            nH: 99,
            clean: true,
            realTop: false,
            thresholdFactor: 1,
            compile: true,
            integralType: 'sum',
            optimize: true,
            idPrefix: '',
            format: 'new',
            frequencyCluster: 16,
        }, opt);

        return new Ranges(peakPicking(spectrum, this.options));
    }

    /**
     * This function put signal.multiplicity with respect to
     * @returns {Ranges}
     */
    updateMultiplicity() {
        for (let i = 0; i < this.length; i++) {
            var range = this[i];
            for (let j = 0; j < range.signal.length; j++) {
                var signal = range.signal[j];
                if (signal.j && !signal.multiplicity) {
                    signal.multiplicity = '';
                    for (let k = 0; k < signal.j.length; k++) {
                        signal.multiplicity += signal.j[k].multiplicity;
                    }
                }
            }
        }
        return this;
    }

    /**
     * This function normalize or scale the integral data
     * @param {Object} options - object with the options
     * @param {Boolean} [options.sum] - anything factor to normalize the integrals, Similar to the number of proton in the molecule for a nmr spectrum
     * @param {number} [options.factor] - Factor that multiply the intensities, if [options.sum] is defined it is override
     * @returns {Ranges}
     */
    updateIntegrals(options) {
        var factor = options.factor || 1;
        var i;
        if (options.sum) {
            var nH = options.sum || 1;
            var sumObserved = 0;
            for (i = 0; i < this.length; i++) {
                sumObserved += this[i].integral;
            }
            factor = nH / sumObserved;
        }
        for (i = 0; i < this.length; i++) {
            this[i].integral *= factor;
        }
        return this;
    }

    /**
     * This function return the peak list as a object with x and y arrays
     * @param {Object} options - See the options parameter in {@link #peak2vector} function documentation
     * @returns {Object} - {x: Array, y: Array}
     */
    getVector(options) {
        return peak2Vector(this.getPeakList(), options);
    }

    /**
     * This function return the peaks of a Ranges instance into an array
     * @returns {Array}
     */
    getPeakList() {
        var peaks = [];
        var i,
            j;
        for (i = 0; i < this.length; i++) {
            var range = this[i];
            for (j = 0; j < range.signal.length; j++) {
                peaks = peaks.concat(range.signal[j].peak);
            }
        }
        return peaks;
    }

    /**
     * This function return format for each range
     * @param {Object} options - options object for toAcs function
     * @returns {*}
     */
    getACS(options) {
        return acs(this, options);
    }

    getAnnotations(options) {
        return GUI.annotations1D(this, options);
    }
}

module.exports = Ranges;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Converter = __webpack_require__(17);
const IOBuffer = __webpack_require__(44);
const JSZip = __webpack_require__(50);

// constants
var BINARY = 1;
var TEXT = 2;


function readZIP(zipFile, options) {
    options = options || {};

    var zip = new JSZip();
    zip.load(zipFile, options);

    var files = {
        'ser': BINARY,
        'fid': BINARY,
        'acqus': TEXT,
        'acqu2s': TEXT,
        'procs': TEXT,
        'proc2s': TEXT,
        '1r': BINARY,
        '1i': BINARY,
        '2rr': BINARY
    };
    var folders = zip.filter(function (relativePath, file) {
        if(relativePath.indexOf("ser")>=0||relativePath.indexOf("fid")>=0
            ||relativePath.indexOf("1r")>=0||relativePath.indexOf("2rr")>=0){
            return true;
        }

        return false;

    });

    var spectra = new Array(folders.length);

    for(var i = 0; i < folders.length; ++i) {
        var len = folders[i].name.length;
        var name = folders[i].name;
        name = name.substr(0,name.lastIndexOf("/")+1);
        var currFolder = zip.folder(name);
        var currFiles = currFolder.filter(function (relativePath, file) {
            return files[relativePath] ? true : false;
        });
        var brukerFiles = {};
        if(name.indexOf("pdata")>=0){
            brukerFiles['acqus'] = zip.file(name.replace(/pdata\/[0-9]\//,"acqus")).asText();
        }
        for(var j = 0; j < currFiles.length; ++j) {
            var idx = currFiles[j].name.lastIndexOf('/');
            var name = currFiles[j].name.substr(idx + 1);
            if(files[name] === BINARY) {
                brukerFiles[name] = new IOBuffer(currFiles[j].asArrayBuffer());
            } else {
                brukerFiles[name] = currFiles[j].asText();
            }
        }
        //console.log(folders[i].name);
        spectra[i] = {"filename":folders[i].name,value:convert(brukerFiles,options)};
    }

    return spectra;
}

function convert(brukerFiles, options) {
    options = options || {};
    var start = new Date();
    var result;
    if(brukerFiles['ser'] || brukerFiles['2rr']) {
        result =  convert2D(brukerFiles, options);
    } else if(brukerFiles['1r'] || brukerFiles['1i'] || brukerFiles['fid']) {
        result =   convert1D(brukerFiles, options);
    } else {
        throw new RangeError('The current files are invalid');
    }

    if (result.twoD && !options.noContours) {
        //console.log("Countours");
        add2D(result);
        if (result.profiling) result.profiling.push({
            action: 'Finished countour plot calculation',
            time: new Date() - start
        });
        if (!options.keepSpectra) {
            delete result.spectra;
        }
    }

    var spectra = result.spectra;
    if (options.xy) { // the spectraData should not be a oneD array but an object with x and y
        if (spectra.length > 0) {
            for (var i=0; i<spectra.length; i++) {
                var spectrum=spectra[i];
                if (spectrum.data.length>0) {
                    for (var j=0; j<spectrum.data.length; j++) {
                        var data=spectrum.data[j];
                        var newData={x: new Array(data.length/2), y:new Array(data.length/2)};
                        for (var k=0; k<data.length; k=k+2) {
                            newData.x[k/2]=data[k];
                            newData.y[k/2]=data[k+1];
                        }
                        spectrum.data[j]=newData;
                    }

                }
            }
        }
    }

    return result;
}

function convert1D(files, options) {
    var result = parseData(files["procs"], options);
    var temp = parseData(files['acqus'], options);

    var keys = Object.keys(temp.info);
    for (var i = 0; i < keys.length; i++) {
        var currKey = keys[i];
        if(result.info[currKey] === undefined) {
            result.info[currKey] = temp.info[currKey];
        }
    }

    if(files['1r'] || files['1i']) {
        if(files['1r']) {
            setXYSpectrumData(files['1r'], result, '1r', true);
        }
        if(files['1i']) {
            setXYSpectrumData(files['1i'], result, '1i', false);
        }
    } else if(files['fid']) {
        setFIDSpectrumData(files['fid'], result)
    }
    
    return result;
}

function convert2D(files, options) {
    var SF,SW_p,SW,offset;
    if(files['2rr']) {
        var result = parseData(files['procs'], options);
        var temp = parseData(files['acqus'], options);

        var keys = Object.keys(temp.info);
        for (var i = 0; i < keys.length; i++) {
            var currKey = keys[i];
            if(result.info[currKey] === undefined) {
                result.info[currKey] = temp.info[currKey];
            }
        }
        
        temp = parseData(files['proc2s'], options);
        result.info.nbSubSpectra = temp.info['$SI'] = parseInt(temp.info['$SI']);
        SF = temp.info['$SF'] = parseFloat(temp.info['$SF']);
        SW_p = temp.info['$SWP'] = parseFloat(temp.info['$SWP']);
        offset = temp.info['$OFFSET'] = parseFloat(temp.info['$OFFSET']);

    } else if(files['ser']) {
        result = parseData(files['acqus'], options);
        temp = parseData(files['acqu2s'], options);
        result.info.nbSubSpectra = temp.info['$SI'] = parseInt(temp.info['$TD']);
        result.info['$SI'] = parseInt(result.info['$TD']);
        //SW_p = temp.info['$SWH'] = parseFloat(temp.info['$SWH']);

        SW_p = temp.info["$SW"];

        result.info["$SWP"]=result.info["$SWH"];
        result.info["$SF"]=parseFloat(temp.info['$SFO1']);
        result.info['$OFFSET']=0;
        SF = temp.info['$SFO1'] = parseFloat(temp.info['$SFO1']);
        SF = 1;
        offset=0;
        result.info['$AXNUC']=result.info['$NUC1'];
        temp.info['$AXNUC']=temp.info['$NUC1'];
    }

    result.info.firstY = offset;
    result.info.lastY = offset - SW_p / SF;
    result.info['$BF2'] = SF;
    result.info['$SFO1'] = SF;

    var nbSubSpectra = result.info.nbSubSpectra;
    var pageValue = result.info.firstY;
    var deltaY = (result.info.lastY-result.info.firstY)/(nbSubSpectra-1);

    if(files['2rr']) {
        setXYSpectrumData(files['2rr'], result, '2rr', true);
    } else if(files['ser']) {
        setFIDSpectrumData(files['ser'], result, 'ser', true);
    }

    for(var i = 0; i < nbSubSpectra; i++) {
        pageValue+=deltaY;
        result.spectra[i].pageValue=pageValue;
    }

    var dataType = files['ser'] ? 'TYPE_2DNMR_FID' : 'TYPE_2DNMR_SPECTRUM';

    result.info['2D_Y_NUCLEUS'] = temp.info['$AXNUC'];
    result.info['2D_X_NUCLEUS'] = result.info['$AXNUC'];
    result.info['2D_Y_FRECUENCY'] = SF;
    result.info['2D_Y_OFFSET'] = offset;
    result.info['2D_X_FRECUENCY'] = result.info['$SF'];
    result.info['2D_X_OFFSET'] = result.info['$OFFSET'];

    result.twoD = true;

    return result;
}

function setXYSpectrumData(file, spectra, store, real) {
    var td = spectra.info['$SI'] = parseInt(spectra.info['$SI']);

    var SW_p = parseFloat(spectra.info["$SWP"]);
    var SF = parseFloat(spectra.info["$SF"]);
    var BF = SF;
    //var BF = parseFloat(spectra.info["$BF1"]);
    var offset = spectra.shiftOffsetVal;//parseFloat(spectra.info["$OFFSET"]);

    spectra.info["observeFrequency"] = SF;
    spectra.info["$BF1"] = BF;
    spectra.info["$SFO1"] = SF;
    spectra.info.brukerReference = BF;

    var endian = parseInt(spectra.info["$BYTORDP"]);
    endian = endian ? 0 : 1;

    // number of spectras
    var nbSubSpectra = spectra.info.nbSubSpectra ? spectra.info.nbSubSpectra : 1;

    if(endian)
        file.setLittleEndian();
    else
        file.setBigEndian();

    for(var i = 0; i < nbSubSpectra; i++) {
        var toSave = {
            dataType : "NMR Spectrum",
            dataTable : "(X++(R..R))",
            nbPoints : td,
            firstX : offset,
            lastX : offset - SW_p / SF,
            xUnit : "PPM",
            yUnit : "Arbitrary",
            data:[new Array(td*2)],//[{x:new Array(td),y:new Array(td)}],
            isXYdata:true,
            observeFrequency:SF,
            title:spectra.info['TITLE'],
            deltaX:-(SW_p / SF)/(td-1)

        };

        var x = offset;
        var deltaX = toSave.deltaX;
        if(real) {
            for(var k = 0; k < td; ++k) {
                toSave.data[0][2*k] = x;
                toSave.data[0][2*k+1] = file.readInt32();
                if(toSave.data[0][2*k+1]===null||isNaN(toSave.data[0][2*k+1])){
                    toSave.data[0][2*k+1] = 0;
                }
                x += deltaX;
            }
        } else {
            for(k = td - 1; k >= 0; --k) {
                toSave.data[0][2*k] = x;
                toSave.data[0][2*k+1] = file.readInt32();
                if(toSave.data[0][2*k+1]===null||isNaN(toSave.data[0][2*k+1])) {
                    toSave.data[0][2*k+1] = 0;
                }
                x += deltaX;
            }
        }

        spectra.spectra.push(toSave);
    }
}

function parseData(file, options) {
    var keepRecordsRegExp=/.*/;
    if (options.keepRecordsRegExp) keepRecordsRegExp=options.keepRecordsRegExp;
    return Converter.convert(file, {
        keepRecordsRegExp:keepRecordsRegExp
    });
}

function setFIDSpectrumData(file, spectra) {
    var td = spectra.info['$TD'] = parseInt(spectra.info['$TD']);

    var SW_h = spectra.info['$SWH'] = parseFloat(spectra.info['$SWH']);
    var SW = spectra.info['$SW'] = parseFloat(spectra.info['$SW']);

    var SF = spectra.info['$SFO1'] = parseFloat(spectra.info['$SFO1']);
    var BF =  parseFloat(spectra.info['$BF1']);
    spectra.info['$BF1'] = BF;

    //var DW = 1 / (2 * SW_h);
    //var AQ = td * DW;
    var AQ = SW;
    var DW = AQ/(td-1);

    //console.log(DW+" "+SW+" "+td);
    var endian = parseInt(spectra.info["$BYTORDP"]);
    endian = endian ? 0 : 1;

    if(endian)
        file.setLittleEndian();
    else
        file.setBigEndian();

    var nbSubSpectra = spectra.info.nbSubSpectra ? spectra.info.nbSubSpectra : 1;
    spectra.spectra = new Array(nbSubSpectra);
    
    for(var j = 0; j < nbSubSpectra/2; j++) {
        var toSave = {
            dataType : "NMR FID",
            dataTable : "(X++(R..R))",
            nbPoints : td,
            firstX : 0,
            lastX : AQ,
            nucleus : spectra.info["$NUC1"] ? spectra.info["$NUC1"] : undefined,
            xUnit : "Sec",
            yUnit : "Arbitrary",
            data:[new Array(2*td)],//[{x:new Array(td),y:new Array(td)}],
            isXYdata:true,
            observeFrequency:SF,
            title:spectra.info['TITLE'],
            deltaX:DW
        };
        spectra.spectra[j*2] = toSave;

        toSave = {
            dataType : "NMR FID",
            dataTable : "(X++(I..I))",
            nbPoints : td,
            firstX : 0,
            lastX : AQ,
            nucleus : spectra.info["$NUC1"] ? spectra.info["$NUC1"] : undefined,
            xUnit : "Sec",
            yUnit : "Arbitrary",
            data:[new Array(2*td)],//[{x:new Array(td),y:new Array(td)}],
            isXYdata:true,
            observeFrequency:SF,
            title:spectra.info['TITLE'],
            deltaX:DW
        };
        spectra.spectra[j*2+1] = toSave;
        
        var x = 0;
        var y;
        for(var i = 0; file.available(8)&&i<td; i++, x = i*DW) {
            y = file.readInt32();
            if(y===null || isNaN(y)){
                y=0;
            }
            spectra.spectra[j*2].data[0][2*i+1] = y;
            spectra.spectra[j*2].data[0][2*i] = x;
            y = file.readInt32();
            if(y===null || isNaN(y)){
                y=0;
            }
            spectra.spectra[j*2+1].data[0][2*i+1] = y;
            spectra.spectra[j*2+1].data[0][2*i] = x;

        }

        for(; i < td; i++, x = i*DW) {
            spectra.spectra[j*2].data[0][2*i+1] = 0;
            spectra.spectra[j*2].data[0][2*i] = x;
            spectra.spectra[j*2+1].data[0][2*i+1] = 0;
            spectra.spectra[j*2+1].data[0][2*i] = x;
        }
    }
}

/**
 * Those functions should disappear if add2D becomes accessible in jcampconvert
 * @param spectra
 * @returns {{z: Array, minX: *, maxX: *, minY: *, maxY: *, minZ: *, maxZ: *, noise: number}}
 */

function convertTo3DZ(spectra) {
    var noise = 0;
    var minZ = spectra[0].data[0][0];
    var maxZ = minZ;
    var ySize = spectra.length;
    var xSize = spectra[0].data[0].length / 2;
    var z = new Array(ySize);
    for (var i = 0; i < ySize; i++) {
        z[i] = new Array(xSize);
        for (var j = 0; j < xSize; j++) {
            z[i][j] = spectra[i].data[0][j * 2 + 1];
            if (z[i][j] < minZ) minZ = spectra[i].data[0][j * 2 + 1];
            if (z[i][j] > maxZ) maxZ = spectra[i].data[0][j * 2 + 1];
            if (i !== 0 && j !== 0) {
                noise += Math.abs(z[i][j] - z[i][j - 1]) + Math.abs(z[i][j] - z[i - 1][j]);
            }
        }
    }
    return {
        z: z,
        minX: spectra[0].data[0][0],
        maxX: spectra[0].data[0][spectra[0].data[0].length - 2],
        minY: spectra[0].pageValue,
        maxY: spectra[ySize - 1].pageValue,
        minZ: minZ,
        maxZ: maxZ,
        noise: noise / ((ySize - 1) * (xSize - 1) * 2)
    };

}

function add2D(result) {
    var zData = convertTo3DZ(result.spectra);
    result.contourLines = generateContourLines(zData);
    delete zData.z;
    result.minMax = zData;
}


function generateContourLines(zData, options) {
    //console.time('generateContourLines');
    var noise = zData.noise;
    var z = zData.z;
    var contourLevels = [];
    var nbLevels = 7;
    var povarHeight = new Float32Array(4);
    var isOver = [];
    var nbSubSpectra = z.length;
    var nbPovars = z[0].length;
    var pAx, pAy, pBx, pBy;

    var x0 = zData.minX;
    var xN = zData.maxX;
    var dx = (xN - x0) / (nbPovars - 1);
    var y0 = zData.minY;
    var yN = zData.maxY;
    var dy = (yN - y0) / (nbSubSpectra - 1);
    var minZ = zData.minZ;
    var maxZ = zData.maxZ;

    //System.out.prvarln('y0 '+y0+' yN '+yN);
    // -------------------------
    // Povars attribution
    //
    // 0----1
    // |  / |
    // | /  |
    // 2----3
    //
    // ---------------------d------

    var lineZValue;
    for (var level = 0; level < nbLevels * 2; level++) { // multiply by 2 for positif and negatif
        var contourLevel = {};
        contourLevels.push(contourLevel);
        var side = level % 2;
        if (side === 0) {
            lineZValue = (maxZ - 5 * noise) * Math.exp(level / 2 - nbLevels) + 5 * noise;
        } else {
            lineZValue = -(maxZ - 5 * noise) * Math.exp(level / 2 - nbLevels) - 5 * noise;
        }
        var lines = [];
        contourLevel.zValue = lineZValue;
        contourLevel.lines = lines;

        if (lineZValue <= minZ || lineZValue >= maxZ) continue;

        for (var iSubSpectra = 0; iSubSpectra < nbSubSpectra - 1; iSubSpectra++) {
            for (var povar = 0; povar < nbPovars - 1; povar++) {
                povarHeight[0] = z[iSubSpectra][povar];
                povarHeight[1] = z[iSubSpectra][povar + 1];
                povarHeight[2] = z[(iSubSpectra + 1)][povar];
                povarHeight[3] = z[(iSubSpectra + 1)][(povar + 1)];

                for (var i = 0; i < 4; i++) {
                    isOver[i] = (povarHeight[i] > lineZValue);
                }

                // Example povar0 is over the plane and povar1 and
                // povar2 are below, we find the varersections and add
                // the segment
                if (isOver[0] !== isOver[1] && isOver[0] !== isOver[2]) {
                    pAx = povar + (lineZValue - povarHeight[0]) / (povarHeight[1] - povarHeight[0]);
                    pAy = iSubSpectra;
                    pBx = povar;
                    pBy = iSubSpectra + (lineZValue - povarHeight[0]) / (povarHeight[2] - povarHeight[0]);
                    lines.push(pAx * dx + x0, pAy * dy + y0, pBx * dx + x0, pBy * dy + y0);
                }
                if (isOver[3] !== isOver[1] && isOver[3] !== isOver[2]) {
                    pAx = povar + 1;
                    pAy = iSubSpectra + 1 - (lineZValue - povarHeight[3]) / (povarHeight[1] - povarHeight[3]);
                    pBx = povar + 1 - (lineZValue - povarHeight[3]) / (povarHeight[2] - povarHeight[3]);
                    pBy = iSubSpectra + 1;
                    lines.push(pAx * dx + x0, pAy * dy + y0, pBx * dx + x0, pBy * dy + y0);
                }
                // test around the diagonal
                if (isOver[1] !== isOver[2]) {
                    pAx = povar + 1 - (lineZValue - povarHeight[1]) / (povarHeight[2] - povarHeight[1]);
                    pAy = iSubSpectra + (lineZValue - povarHeight[1]) / (povarHeight[2] - povarHeight[1]);
                    if (isOver[1] !== isOver[0]) {
                        pBx = povar + 1 - (lineZValue - povarHeight[1]) / (povarHeight[0] - povarHeight[1]);
                        pBy = iSubSpectra;
                        lines.push(pAx * dx + x0, pAy * dy + y0, pBx * dx + x0, pBy * dy + y0);
                    }
                    if (isOver[2] !== isOver[0]) {
                        pBx = povar;
                        pBy = iSubSpectra + 1 - (lineZValue - povarHeight[2]) / (povarHeight[0] - povarHeight[2]);
                        lines.push(pAx * dx + x0, pAy * dy + y0, pBx * dx + x0, pBy * dy + y0);
                    }
                    if (isOver[1] !== isOver[3]) {
                        pBx = povar + 1;
                        pBy = iSubSpectra + (lineZValue - povarHeight[1]) / (povarHeight[3] - povarHeight[1]);
                        lines.push(pAx * dx + x0, pAy * dy + y0, pBx * dx + x0, pBy * dy + y0);
                    }
                    if (isOver[2] !== isOver[3]) {
                        pBx = povar + (lineZValue - povarHeight[2]) / (povarHeight[3] - povarHeight[2]);
                        pBy = iSubSpectra + 1;
                        lines.push(pAx * dx + x0, pAy * dy + y0, pBx * dx + x0, pBy * dy + y0);
                    }
                }
            }
        }
    }
    // console.timeEnd('generateContourLines');
    return {
        minX: zData.minX,
        maxX: zData.maxX,
        minY: zData.minY,
        maxY: zData.maxY,
        segments: contourLevels
    };
    //return contourLevels;
}


module.exports =  {
    convertZip: readZIP,
    converFolder: convert
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(42)
var ieee754 = __webpack_require__(43)
var isArray = __webpack_require__(45)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(94)))

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) {/**/}

	return typeof key === 'undefined' || hasOwn.call(obj, key);
};

module.exports = function extend() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0],
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target !== copy) {
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = extend(deep, clone, copy);

					// Don't bring in undefined values
					} else if (typeof copy !== 'undefined') {
						target[name] = copy;
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
};



/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var parseXYDataRegExp = __webpack_require__(46);


function getConverter() {

    // the following RegExp can only be used for XYdata, some peakTables have values with a "E-5" ...
    var ntuplesSeparator = /[, \t]{1,}/;

    var GC_MS_FIELDS = ['TIC', '.RIC', 'SCANNUMBER'];

    function convertToFloatArray(stringArray) {
        var l = stringArray.length;
        var floatArray = new Array(l);
        for (var i = 0; i < l; i++) {
            floatArray[i] = parseFloat(stringArray[i]);
        }
        return floatArray;
    }
    
    function Spectrum() {
        
    }

    function convert(jcamp, options) {
        options = options || {};

        var keepRecordsRegExp = /^$/;
        if (options.keepRecordsRegExp) keepRecordsRegExp = options.keepRecordsRegExp;
        var wantXY = !options.withoutXY;

        var start = Date.now();

        var ntuples = {},
            ldr,
            dataLabel,
            dataValue,
            ldrs,
            i, ii, position, endLine, infos;

        var result = {};
        result.profiling = [];
        result.logs = [];
        var spectra = [];
        result.spectra = spectra;
        result.info = {};
        var spectrum = new Spectrum();

        if (!(typeof jcamp === 'string')) return result;
        // console.time('start');

        if (result.profiling) result.profiling.push({
            action: 'Before split to LDRS',
            time: Date.now() - start
        });

        ldrs = jcamp.split(/[\r\n]+##/);

        if (result.profiling) result.profiling.push({
            action: 'Split to LDRS',
            time: Date.now() - start
        });

        if (ldrs[0]) ldrs[0] = ldrs[0].replace(/^[\r\n ]*##/, '');

        for (i = 0, ii = ldrs.length; i < ii; i++) {
            ldr = ldrs[i];
            // This is a new LDR
            position = ldr.indexOf('=');
            if (position > 0) {
                dataLabel = ldr.substring(0, position);
                dataValue = ldr.substring(position + 1).trim();
            } else {
                dataLabel = ldr;
                dataValue = '';
            }
            dataLabel = dataLabel.replace(/[_ -]/g, '').toUpperCase();

            if (dataLabel === 'DATATABLE') {
                endLine = dataValue.indexOf('\n');
                if (endLine === -1) endLine = dataValue.indexOf('\r');
                if (endLine > 0) {
                    var xIndex = -1;
                    var yIndex = -1;
                    // ##DATA TABLE= (X++(I..I)), XYDATA
                    // We need to find the variables

                    infos = dataValue.substring(0, endLine).split(/[ ,;\t]+/);
                    if (infos[0].indexOf('++') > 0) {
                        var firstVariable = infos[0].replace(/.*\(([a-zA-Z0-9]+)\+\+.*/, '$1');
                        var secondVariable = infos[0].replace(/.*\.\.([a-zA-Z0-9]+).*/, '$1');
                        xIndex = ntuples.symbol.indexOf(firstVariable);
                        yIndex = ntuples.symbol.indexOf(secondVariable);
                    }

                    if (xIndex === -1) xIndex = 0;
                    if (yIndex === -1) yIndex = 0;

                    if (ntuples.first) {
                        if (ntuples.first.length > xIndex) spectrum.firstX = ntuples.first[xIndex];
                        if (ntuples.first.length > yIndex) spectrum.firstY = ntuples.first[yIndex];
                    }
                    if (ntuples.last) {
                        if (ntuples.last.length > xIndex) spectrum.lastX = ntuples.last[xIndex];
                        if (ntuples.last.length > yIndex) spectrum.lastY = ntuples.last[yIndex];
                    }
                    if (ntuples.vardim && ntuples.vardim.length > xIndex) {
                        spectrum.nbPoints = ntuples.vardim[xIndex];
                    }
                    if (ntuples.factor) {
                        if (ntuples.factor.length > xIndex) spectrum.xFactor = ntuples.factor[xIndex];
                        if (ntuples.factor.length > yIndex) spectrum.yFactor = ntuples.factor[yIndex];
                    }
                    if (ntuples.units) {
                        if (ntuples.units.length > xIndex) spectrum.xUnit = ntuples.units[xIndex];
                        if (ntuples.units.length > yIndex) spectrum.yUnit = ntuples.units[yIndex];
                    }
                    spectrum.datatable = infos[0];
                    if (infos[1] && infos[1].indexOf('PEAKS') > -1) {
                        dataLabel = 'PEAKTABLE';
                    } else if (infos[1] && (infos[1].indexOf('XYDATA') || infos[0].indexOf('++') > 0)) {
                        dataLabel = 'XYDATA';
                        spectrum.deltaX = (spectrum.lastX - spectrum.firstX) / (spectrum.nbPoints - 1);
                    }
                }
            }

            if (dataLabel === 'XYDATA') {
                if (wantXY) {
                    prepareSpectrum(result, spectrum);
                    // well apparently we should still consider it is a PEAK TABLE if there are no '++' after
                    if (dataValue.match(/.*\+\+.*/)) {
                        if (options.fastParse === false) {
                            parseXYDataRegExp(spectrum, dataValue, result);
                        } else {
                            if (!spectrum.deltaX) {
                                spectrum.deltaX = (spectrum.lastX - spectrum.firstX) / (spectrum.nbPoints - 1);
                            }
                            fastParseXYData(spectrum, dataValue, result);
                        }
                    } else {
                        parsePeakTable(spectrum, dataValue, result);
                    }
                    spectra.push(spectrum);
                    spectrum = new Spectrum();
                }
                continue;
            } else if (dataLabel === 'PEAKTABLE') {
                if (wantXY) {
                    prepareSpectrum(result, spectrum);
                    parsePeakTable(spectrum, dataValue, result);
                    spectra.push(spectrum);
                    spectrum = new Spectrum();
                }
                continue;
            }


            if (dataLabel === 'TITLE') {
                spectrum.title = dataValue;
            } else if (dataLabel === 'DATATYPE') {
                spectrum.dataType = dataValue;
                if (dataValue.indexOf('nD') > -1) {
                    result.twoD = true;
                }
            } else if (dataLabel === 'NTUPLES') {
                if (dataValue.indexOf('nD') > -1) {
                    result.twoD = true;
                }
            } else if (dataLabel === 'XUNITS') {
                spectrum.xUnit = dataValue;
            } else if (dataLabel === 'YUNITS') {
                spectrum.yUnit = dataValue;
            } else if (dataLabel === 'FIRSTX') {
                spectrum.firstX = parseFloat(dataValue);
            } else if (dataLabel === 'LASTX') {
                spectrum.lastX = parseFloat(dataValue);
            } else if (dataLabel === 'FIRSTY') {
                spectrum.firstY = parseFloat(dataValue);
            } else if (dataLabel === 'LASTY') {
                spectrum.lastY = parseFloat(dataValue);
            } else if (dataLabel === 'NPOINTS') {
                spectrum.nbPoints = parseFloat(dataValue);
            } else if (dataLabel === 'XFACTOR') {
                spectrum.xFactor = parseFloat(dataValue);
            } else if (dataLabel === 'YFACTOR') {
                spectrum.yFactor = parseFloat(dataValue);
            } else if (dataLabel === 'DELTAX') {
                spectrum.deltaX = parseFloat(dataValue);
            } else if (dataLabel === '.OBSERVEFREQUENCY' || dataLabel === '$SFO1') {
                if (!spectrum.observeFrequency) spectrum.observeFrequency = parseFloat(dataValue);
            } else if (dataLabel === '.OBSERVENUCLEUS') {
                if (!spectrum.xType) result.xType = dataValue.replace(/[^a-zA-Z0-9]/g, '');
            } else if (dataLabel === '$SFO2') {
                if (!result.indirectFrequency) result.indirectFrequency = parseFloat(dataValue);

            } else if (dataLabel === '$OFFSET') {   // OFFSET for Bruker spectra
                result.shiftOffsetNum = 0;
                if (!result.shiftOffsetVal)  result.shiftOffsetVal = parseFloat(dataValue);
            } else if (dataLabel === '$REFERENCEPOINT') {   // OFFSET for Varian spectra


                // if we activate this part it does not work for ACD specmanager
                //         } else if (dataLabel=='.SHIFTREFERENCE') {   // OFFSET FOR Bruker Spectra
                //                 var parts = dataValue.split(/ *, */);
                //                 result.shiftOffsetNum = parseInt(parts[2].trim());
                //                 result.shiftOffsetVal = parseFloat(parts[3].trim());
            } else if (dataLabel === 'VARNAME') {
                ntuples.varname = dataValue.split(ntuplesSeparator);
            } else if (dataLabel === 'SYMBOL') {
                ntuples.symbol = dataValue.split(ntuplesSeparator);
            } else if (dataLabel === 'VARTYPE') {
                ntuples.vartype = dataValue.split(ntuplesSeparator);
            } else if (dataLabel === 'VARFORM') {
                ntuples.varform = dataValue.split(ntuplesSeparator);
            } else if (dataLabel === 'VARDIM') {
                ntuples.vardim = convertToFloatArray(dataValue.split(ntuplesSeparator));
            } else if (dataLabel === 'UNITS') {
                ntuples.units = dataValue.split(ntuplesSeparator);
            } else if (dataLabel === 'FACTOR') {
                ntuples.factor = convertToFloatArray(dataValue.split(ntuplesSeparator));
            } else if (dataLabel === 'FIRST') {
                ntuples.first = convertToFloatArray(dataValue.split(ntuplesSeparator));
            } else if (dataLabel === 'LAST') {
                ntuples.last = convertToFloatArray(dataValue.split(ntuplesSeparator));
            } else if (dataLabel === 'MIN') {
                ntuples.min = convertToFloatArray(dataValue.split(ntuplesSeparator));
            } else if (dataLabel === 'MAX') {
                ntuples.max = convertToFloatArray(dataValue.split(ntuplesSeparator));
            } else if (dataLabel === '.NUCLEUS') {
                if (result.twoD) {
                    result.yType = dataValue.split(ntuplesSeparator)[0];
                }
            } else if (dataLabel === 'PAGE') {
                spectrum.page = dataValue.trim();
                spectrum.pageValue = parseFloat(dataValue.replace(/^.*=/, ''));
                spectrum.pageSymbol = spectrum.page.replace(/=.*/, '');
                var pageSymbolIndex = ntuples.symbol.indexOf(spectrum.pageSymbol);
                var unit = '';
                if (ntuples.units && ntuples.units[pageSymbolIndex]) {
                    unit = ntuples.units[pageSymbolIndex];
                }
                if (result.indirectFrequency && unit !== 'PPM') {
                    spectrum.pageValue /= result.indirectFrequency;
                }
            } else if (dataLabel === 'RETENTIONTIME') {
                spectrum.pageValue = parseFloat(dataValue);
            } else if (isMSField(dataLabel)) {
                spectrum[convertMSFieldToLabel(dataLabel)] = dataValue;
            }
            if (dataLabel.match(keepRecordsRegExp)) {
                result.info[dataLabel] = dataValue.trim();
            }
        }

        if (result.profiling) result.profiling.push({
            action: 'Finished parsing',
            time: Date.now() - start
        });

        if (Object.keys(ntuples).length > 0) {
            var newNtuples = [];
            var keys = Object.keys(ntuples);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var values = ntuples[key];
                for (var j = 0; j < values.length; j++) {
                    if (!newNtuples[j]) newNtuples[j] = {};
                    newNtuples[j][key] = values[j];
                }
            }
            result.ntuples = newNtuples;
        }

        if (result.twoD && wantXY) {
            add2D(result, options);
            if (result.profiling) result.profiling.push({
                action: 'Finished countour plot calculation',
                time: Date.now() - start
            });
            if (!options.keepSpectra) {
                delete result.spectra;
            }
        }

        var isGCMS = (spectra.length > 1 && (!spectra[0].dataType || spectra[0].dataType.match(/.*mass.*/i)));
        if (isGCMS && options.newGCMS) {
            options.xy = true;
        }

        if (options.xy && wantXY) { // the spectraData should not be a oneD array but an object with x and y
            if (spectra.length > 0) {
                for (var i = 0; i < spectra.length; i++) {
                    var spectrum = spectra[i];
                    if (spectrum.data.length > 0) {
                        for (var j = 0; j < spectrum.data.length; j++) {
                            var data = spectrum.data[j];
                            var newData = {
                                x: new Array(data.length / 2),
                                y: new Array(data.length / 2)
                            };
                            for (var k = 0; k < data.length; k = k + 2) {
                                newData.x[k / 2] = data[k];
                                newData.y[k / 2] = data[k + 1];
                            }
                            spectrum.data[j] = newData;
                        }

                    }

                }
            }
        }

        // maybe it is a GC (HPLC) / MS. In this case we add a new format
        if (isGCMS && wantXY) {
            if (options.newGCMS) {
                addNewGCMS(result);
            } else {
                addGCMS(result);
            }
            if (result.profiling) result.profiling.push({
                action: 'Finished GCMS calculation',
                time: Date.now() - start
            });
        }

        if (result.profiling) {
            result.profiling.push({
                action: 'Total time',
                time: Date.now() - start
            });
        }

        return result;
    }


    function convertMSFieldToLabel(value) {
        return value.toLowerCase().replace(/[^a-z0-9]/g, '');
    }

    function isMSField(dataLabel) {
        return GC_MS_FIELDS.indexOf(dataLabel) !== -1;
    }

    function addNewGCMS(result) {
        var spectra = result.spectra;
        var length = spectra.length;
        var gcms = {
            times: new Array(length),
            series: [{
                name: 'ms',
                dimension: 2,
                data: new Array(length)
            }]
        };

        var i;
        var existingGCMSFields = [];
        for (i = 0; i < GC_MS_FIELDS.length; i++) {
            var label = convertMSFieldToLabel(GC_MS_FIELDS[i]);
            if (spectra[0][label]) {
                existingGCMSFields.push(label);
                gcms.series.push({
                    name: label,
                    dimension: 1,
                    data: new Array(length)
                });
            }
        }

        for (i = 0; i < length; i++) {
            var spectrum = spectra[i];
            gcms.times[i] = spectrum.pageValue;
            for (var j = 0; j < existingGCMSFields.length; j++) {
                gcms.series[j + 1].data[i] = parseFloat(spectrum[existingGCMSFields[j]]);
            }
            if (spectrum.data) {
                gcms.series[0].data[i] = [spectrum.data[0].x, spectrum.data[0].y];
            }

        }
        result.gcms = gcms;
    }

    function addGCMS(result) {
        var spectra = result.spectra;
        var existingGCMSFields = [];
        var i;
        for (i = 0; i < GC_MS_FIELDS.length; i++) {
            var label = convertMSFieldToLabel(GC_MS_FIELDS[i]);
            if (spectra[0][label]) {
                existingGCMSFields.push(label);
            }
        }
        if (existingGCMSFields.length === 0) return;
        var gcms = {};
        gcms.gc = {};
        gcms.ms = [];
        for (i = 0; i < existingGCMSFields.length; i++) {
            gcms.gc[existingGCMSFields[i]] = [];
        }
        for (i = 0; i < spectra.length; i++) {
            var spectrum = spectra[i];
            for (var j = 0; j < existingGCMSFields.length; j++) {
                gcms.gc[existingGCMSFields[j]].push(spectrum.pageValue);
                gcms.gc[existingGCMSFields[j]].push(parseFloat(spectrum[existingGCMSFields[j]]));
            }
            if (spectrum.data) gcms.ms[i] = spectrum.data[0];

        }
        result.gcms = gcms;
    }

    function prepareSpectrum(result, spectrum) {
        if (!spectrum.xFactor) spectrum.xFactor = 1;
        if (!spectrum.yFactor) spectrum.yFactor = 1;
        if (spectrum.observeFrequency) {
            if (spectrum.xUnit && spectrum.xUnit.toUpperCase() === 'HZ') {
                spectrum.xUnit = 'PPM';
                spectrum.xFactor = spectrum.xFactor / spectrum.observeFrequency;
                spectrum.firstX = spectrum.firstX / spectrum.observeFrequency;
                spectrum.lastX = spectrum.lastX / spectrum.observeFrequency;
                spectrum.deltaX = spectrum.deltaX / spectrum.observeFrequency;
            }
        }
        if (result.shiftOffsetVal) {
            var shift = spectrum.firstX - result.shiftOffsetVal;
            spectrum.firstX = spectrum.firstX - shift;
            spectrum.lastX = spectrum.lastX - shift;
        }
    }

    function getMedian(data) {
        data = data.sort(compareNumbers);
        var l = data.length;
        return data[Math.floor(l / 2)];
    }

    function compareNumbers(a, b) {
        return a - b;
    }

    function convertTo3DZ(spectra) {
        var minZ = spectra[0].data[0][0];
        var maxZ = minZ;
        var ySize = spectra.length;
        var xSize = spectra[0].data[0].length / 2;
        var z = new Array(ySize);
        for (var i = 0; i < ySize; i++) {
            z[i] = new Array(xSize);
            var xVector = spectra[i].data[0];
            for (var j = 0; j < xSize; j++) {
                var value = xVector[j * 2 + 1];
                z[i][j] = value;
                if (value < minZ) minZ = value;
                if (value > maxZ) maxZ = value;
            }
        }
        return {
            z: z,
            minX: spectra[0].data[0][0],
            maxX: spectra[0].data[0][spectra[0].data[0].length - 2], // has to be -2 because it is a 1D array [x,y,x,y,...]
            minY: spectra[0].pageValue,
            maxY: spectra[ySize - 1].pageValue,
            minZ: minZ,
            maxZ: maxZ,
            noise: getMedian(z[0].map(Math.abs))
        };

    }

    function add2D(result, options) {
        var zData = convertTo3DZ(result.spectra);
        if (!options.noContour) {
            result.contourLines = generateContourLines(zData, options);
            delete zData.z;
        }
        result.minMax = zData;
    }


    function generateContourLines(zData, options) {
        var noise = zData.noise;
        var z = zData.z;
        var nbLevels = options.nbContourLevels || 7;
        var noiseMultiplier = options.noiseMultiplier === undefined ? 5 : options.noiseMultiplier;
        var povarHeight0, povarHeight1, povarHeight2, povarHeight3;
        var isOver0, isOver1, isOver2, isOver3;
        var nbSubSpectra = z.length;
        var nbPovars = z[0].length;
        var pAx, pAy, pBx, pBy;

        var x0 = zData.minX;
        var xN = zData.maxX;
        var dx = (xN - x0) / (nbPovars - 1);
        var y0 = zData.minY;
        var yN = zData.maxY;
        var dy = (yN - y0) / (nbSubSpectra - 1);
        var minZ = zData.minZ;
        var maxZ = zData.maxZ;

        //System.out.prvarln('y0 '+y0+' yN '+yN);
        // -------------------------
        // Povars attribution
        //
        // 0----1
        // |  / |
        // | /  |
        // 2----3
        //
        // ---------------------d------

        var iter = nbLevels * 2;
        var contourLevels = new Array(iter);
        var lineZValue;
        for (var level = 0; level < iter; level++) { // multiply by 2 for positif and negatif
            var contourLevel = {};
            contourLevels[level] = contourLevel;
            var side = level % 2;
            var factor = (maxZ - noiseMultiplier * noise) * Math.exp((level >> 1) - nbLevels);
            if (side === 0) {
                lineZValue = factor + noiseMultiplier * noise;
            } else {
                lineZValue = (0 - factor) - noiseMultiplier * noise;
            }
            var lines = [];
            contourLevel.zValue = lineZValue;
            contourLevel.lines = lines;

            if (lineZValue <= minZ || lineZValue >= maxZ) continue;

            for (var iSubSpectra = 0; iSubSpectra < nbSubSpectra - 1; iSubSpectra++) {
                var subSpectra = z[iSubSpectra];
                var subSpectraAfter = z[iSubSpectra + 1];
                for (var povar = 0; povar < nbPovars - 1; povar++) {
                    povarHeight0 = subSpectra[povar];
                    povarHeight1 = subSpectra[povar + 1];
                    povarHeight2 = subSpectraAfter[povar];
                    povarHeight3 = subSpectraAfter[povar + 1];

                    isOver0 = (povarHeight0 > lineZValue);
                    isOver1 = (povarHeight1 > lineZValue);
                    isOver2 = (povarHeight2 > lineZValue);
                    isOver3 = (povarHeight3 > lineZValue);

                    // Example povar0 is over the plane and povar1 and
                    // povar2 are below, we find the varersections and add
                    // the segment
                    if (isOver0 !== isOver1 && isOver0 !== isOver2) {
                        pAx = povar + (lineZValue - povarHeight0) / (povarHeight1 - povarHeight0);
                        pAy = iSubSpectra;
                        pBx = povar;
                        pBy = iSubSpectra + (lineZValue - povarHeight0) / (povarHeight2 - povarHeight0);
                        lines.push(pAx * dx + x0);
                        lines.push(pAy * dy + y0);
                        lines.push(pBx * dx + x0);
                        lines.push(pBy * dy + y0);
                    }
                    // remove push does not help !!!!
                    if (isOver3 !== isOver1 && isOver3 !== isOver2) {
                        pAx = povar + 1;
                        pAy = iSubSpectra + 1 - (lineZValue - povarHeight3) / (povarHeight1 - povarHeight3);
                        pBx = povar + 1 - (lineZValue - povarHeight3) / (povarHeight2 - povarHeight3);
                        pBy = iSubSpectra + 1;
                        lines.push(pAx * dx + x0);
                        lines.push(pAy * dy + y0);
                        lines.push(pBx * dx + x0);
                        lines.push(pBy * dy + y0);
                    }
                    // test around the diagonal
                    if (isOver1 !== isOver2) {
                        pAx = (povar + 1 - (lineZValue - povarHeight1) / (povarHeight2 - povarHeight1)) * dx + x0;
                        pAy = (iSubSpectra + (lineZValue - povarHeight1) / (povarHeight2 - povarHeight1)) * dy + y0;
                        if (isOver1 !== isOver0) {
                            pBx = povar + 1 - (lineZValue - povarHeight1) / (povarHeight0 - povarHeight1);
                            pBy = iSubSpectra;
                            lines.push(pAx);
                            lines.push(pAy);
                            lines.push(pBx * dx + x0);
                            lines.push(pBy * dy + y0);
                        }
                        if (isOver2 !== isOver0) {
                            pBx = povar;
                            pBy = iSubSpectra + 1 - (lineZValue - povarHeight2) / (povarHeight0 - povarHeight2);
                            lines.push(pAx);
                            lines.push(pAy);
                            lines.push(pBx * dx + x0);
                            lines.push(pBy * dy + y0);
                        }
                        if (isOver1 !== isOver3) {
                            pBx = povar + 1;
                            pBy = iSubSpectra + (lineZValue - povarHeight1) / (povarHeight3 - povarHeight1);
                            lines.push(pAx);
                            lines.push(pAy);
                            lines.push(pBx * dx + x0);
                            lines.push(pBy * dy + y0);
                        }
                        if (isOver2 !== isOver3) {
                            pBx = povar + (lineZValue - povarHeight2) / (povarHeight3 - povarHeight2);
                            pBy = iSubSpectra + 1;
                            lines.push(pAx);
                            lines.push(pAy);
                            lines.push(pBx * dx + x0);
                            lines.push(pBy * dy + y0);
                        }
                    }
                }
            }
        }

        return {
            minX: zData.minX,
            maxX: zData.maxX,
            minY: zData.minY,
            maxY: zData.maxY,
            segments: contourLevels
        };
    }

    function fastParseXYData(spectrum, value) {
        // TODO need to deal with result
        //  console.log(value);
        // we check if deltaX is defined otherwise we calculate it

        var yFactor = spectrum.yFactor;
        var deltaX = spectrum.deltaX;


        spectrum.isXYdata = true;
        // TODO to be improved using 2 array {x:[], y:[]}
        var currentData = [];
        spectrum.data = [currentData];


        var currentX = spectrum.firstX;
        var currentY = spectrum.firstY;

        // we skip the first line
        //
        var endLine = false;
        for (var i = 0; i < value.length; i++) {
            var ascii = value.charCodeAt(i);
            if (ascii === 13 || ascii === 10) {
                endLine = true;
            } else {
                if (endLine) break;
            }
        }

        // we proceed taking the i after the first line
        var newLine = true;
        var isDifference = false;
        var isLastDifference = false;
        var lastDifference = 0;
        var isDuplicate = false;
        var inComment = false;
        var currentValue = 0;
        var isNegative = false;
        var inValue = false;
        var skipFirstValue = false;
        var decimalPosition = 0;
        var ascii;
        for (; i <= value.length; i++) {
            if (i === value.length) ascii = 13;
            else ascii = value.charCodeAt(i);
            if (inComment) {
                // we should ignore the text if we are after $$
                if (ascii === 13 || ascii === 10) {
                    newLine = true;
                    inComment = false;
                }
            } else {
                // when is it a new value ?
                // when it is not a digit, . or comma
                // it is a number that is either new or we continue
                if (ascii <= 57 && ascii >= 48) { // a number
                    inValue = true;
                    if (decimalPosition > 0) {
                        currentValue += (ascii - 48) / Math.pow(10, decimalPosition++);
                    } else {
                        currentValue *= 10;
                        currentValue += ascii - 48;
                    }
                } else if (ascii === 44 || ascii === 46) { // a "," or "."
                    inValue = true;
                    decimalPosition++;
                } else {
                    if (inValue) {
                        // need to process the previous value
                        if (newLine) {
                            newLine = false; // we don't check the X value
                            // console.log("NEW LINE",isDifference, lastDifference);
                            // if new line and lastDifference, the first value is just a check !
                            // that we don't check ...
                            if (isLastDifference) skipFirstValue = true;
                        } else {
                            // need to deal with duplicate and differences
                            if (skipFirstValue) {
                                skipFirstValue = false;
                            } else {
                                if (isDifference) {
                                    lastDifference = isNegative ? (0 - currentValue) : currentValue;
                                    isLastDifference = true;
                                    isDifference = false;
                                }
                                var duplicate = isDuplicate ? currentValue - 1 : 1;
                                for (var j = 0; j < duplicate; j++) {
                                    if (isLastDifference) {
                                        currentY += lastDifference;
                                    } else {
                                        currentY = isNegative ? (0 - currentValue) : currentValue;
                                    }
                                    currentData.push(currentX);
                                    currentData.push(currentY * yFactor);
                                    currentX += deltaX;
                                }
                            }
                        }
                        isNegative = false;
                        currentValue = 0;
                        decimalPosition = 0;
                        inValue = false;
                        isDuplicate = false;
                    }

                    // positive SQZ digits @ A B C D E F G H I (ascii 64-73)
                    if ((ascii < 74) && (ascii > 63)) {
                        inValue = true;
                        isLastDifference = false;
                        currentValue = ascii - 64;
                    } else
                    // negative SQZ digits a b c d e f g h i (ascii 97-105)
                    if ((ascii > 96) && (ascii < 106)) {
                        inValue = true;
                        isLastDifference = false;
                        currentValue = ascii - 96;
                        isNegative = true;
                    } else
                    // DUP digits S T U V W X Y Z s (ascii 83-90, 115)
                    if (ascii === 115) {
                        inValue = true;
                        isDuplicate = true;
                        currentValue = 9;
                    } else if ((ascii > 82) && (ascii < 91)) {
                        inValue = true;
                        isDuplicate = true;
                        currentValue = ascii - 82;
                    } else
                    // positive DIF digits % J K L M N O P Q R (ascii 37, 74-82)
                    if ((ascii > 73) && (ascii < 83)) {
                        inValue = true;
                        isDifference = true;
                        currentValue = ascii - 73;
                    } else
                    // negative DIF digits j k l m n o p q r (ascii 106-114)
                    if ((ascii > 105) && (ascii < 115)) {
                        inValue = true;
                        isDifference = true;
                        currentValue = ascii - 105;
                        isNegative = true;
                    } else
                    // $ sign, we need to check the next one
                    if (ascii === 36 && value.charCodeAt(i + 1) === 36) {
                        inValue = true;
                        inComment = true;
                    } else
                    // positive DIF digits % J K L M N O P Q R (ascii 37, 74-82)
                    if (ascii === 37) {
                        inValue = true;
                        isDifference = true;
                        currentValue = 0;
                        isNegative = false;
                    } else if (ascii === 45) { // a "-"
                        // check if after there is a number, decimal or comma
                        var ascii2 = value.charCodeAt(i + 1);
                        if ((ascii2 >= 48 && ascii2 <= 57) || ascii2 === 44 || ascii2 === 46) {
                            inValue = true;
                            isLastDifference = false;
                            isNegative = true;
                        }
                    } else if (ascii === 13 || ascii === 10) {
                        newLine = true;
                        inComment = false;
                    }
                    // and now analyse the details ... space or tabulation
                    // if "+" we just don't care
                }
            }
        }
    }

    function parsePeakTable(spectrum, value, result) {
        var removeCommentRegExp = /\$\$.*/;
        var peakTableSplitRegExp = /[,\t ]+/;

        spectrum.isPeaktable = true;
        var i, ii, j, jj, values;
        var currentData = [];
        spectrum.data = [currentData];

        // counts for around 20% of the time
        var lines = value.split(/,? *,?[;\r\n]+ */);

        for (i = 1, ii = lines.length; i < ii; i++) {
            values = lines[i].trim().replace(removeCommentRegExp, '').split(peakTableSplitRegExp);
            if (values.length % 2 === 0) {
                for (j = 0, jj = values.length; j < jj; j = j + 2) {
                    // takes around 40% of the time to add and parse the 2 values nearly exclusively because of parseFloat
                    currentData.push(parseFloat(values[j]) * spectrum.xFactor);
                    currentData.push(parseFloat(values[j + 1]) * spectrum.yFactor);
                }
            } else {
                result.logs.push('Format error: ' + values);
            }
        }
    }


    return convert;

}

var convert = getConverter();

function JcampConverter(input, options, useWorker) {
    if (typeof options === 'boolean') {
        useWorker = options;
        options = {};
    }
    if (useWorker) {
        return postToWorker(input, options);
    } else {
        return convert(input, options);
    }
}

var stamps = {},
    worker;

function postToWorker(input, options) {
    if (!worker) {
        createWorker();
    }
    return new Promise(function (resolve) {
        var stamp = Date.now() + '' + Math.random();
        stamps[stamp] = resolve;
        worker.postMessage(JSON.stringify({
            stamp: stamp,
            input: input,
            options: options
        }));
    });
}

function createWorker() {
    var workerURL = URL.createObjectURL(new Blob([
        'var getConverter =' + getConverter.toString() + ';var convert = getConverter(); onmessage = function (event) { var data = JSON.parse(event.data); postMessage(JSON.stringify({stamp: data.stamp, output: convert(data.input, data.options)})); };'
    ], {type: 'application/javascript'}));
    worker = new Worker(workerURL);
    URL.revokeObjectURL(workerURL);
    worker.addEventListener('message', function (event) {
        var data = JSON.parse(event.data);
        var stamp = data.stamp;
        if (stamps[stamp]) {
            stamps[stamp](data.output);
        }
    });
}

module.exports = {
    convert: JcampConverter
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var DataReader = __webpack_require__(20);

function ArrayReader(data) {
    if (data) {
        this.data = data;
        this.length = this.data.length;
        this.index = 0;
        this.zero = 0;

        for(var i = 0; i < this.data.length; i++) {
            data[i] = data[i] & 0xFF;
        }
    }
}
ArrayReader.prototype = new DataReader();
/**
 * @see DataReader.byteAt
 */
ArrayReader.prototype.byteAt = function(i) {
    return this.data[this.zero + i];
};
/**
 * @see DataReader.lastIndexOfSignature
 */
ArrayReader.prototype.lastIndexOfSignature = function(sig) {
    var sig0 = sig.charCodeAt(0),
        sig1 = sig.charCodeAt(1),
        sig2 = sig.charCodeAt(2),
        sig3 = sig.charCodeAt(3);
    for (var i = this.length - 4; i >= 0; --i) {
        if (this.data[i] === sig0 && this.data[i + 1] === sig1 && this.data[i + 2] === sig2 && this.data[i + 3] === sig3) {
            return i - this.zero;
        }
    }

    return -1;
};
/**
 * @see DataReader.readData
 */
ArrayReader.prototype.readData = function(size) {
    this.checkOffset(size);
    if(size === 0) {
        return [];
    }
    var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
    this.index += size;
    return result;
};
module.exports = ArrayReader;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function CompressedObject() {
    this.compressedSize = 0;
    this.uncompressedSize = 0;
    this.crc32 = 0;
    this.compressionMethod = null;
    this.compressedContent = null;
}

CompressedObject.prototype = {
    /**
     * Return the decompressed content in an unspecified format.
     * The format will depend on the decompressor.
     * @return {Object} the decompressed content.
     */
    getContent: function() {
        return null; // see implementation
    },
    /**
     * Return the compressed content in an unspecified format.
     * The format will depend on the compressed conten source.
     * @return {Object} the compressed content.
     */
    getCompressedContent: function() {
        return null; // see implementation
    }
};
module.exports = CompressedObject;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var utils = __webpack_require__(0);

function DataReader(data) {
    this.data = null; // type : see implementation
    this.length = 0;
    this.index = 0;
    this.zero = 0;
}
DataReader.prototype = {
    /**
     * Check that the offset will not go too far.
     * @param {string} offset the additional offset to check.
     * @throws {Error} an Error if the offset is out of bounds.
     */
    checkOffset: function(offset) {
        this.checkIndex(this.index + offset);
    },
    /**
     * Check that the specifed index will not be too far.
     * @param {string} newIndex the index to check.
     * @throws {Error} an Error if the index is out of bounds.
     */
    checkIndex: function(newIndex) {
        if (this.length < this.zero + newIndex || newIndex < 0) {
            throw new Error("End of data reached (data length = " + this.length + ", asked index = " + (newIndex) + "). Corrupted zip ?");
        }
    },
    /**
     * Change the index.
     * @param {number} newIndex The new index.
     * @throws {Error} if the new index is out of the data.
     */
    setIndex: function(newIndex) {
        this.checkIndex(newIndex);
        this.index = newIndex;
    },
    /**
     * Skip the next n bytes.
     * @param {number} n the number of bytes to skip.
     * @throws {Error} if the new index is out of the data.
     */
    skip: function(n) {
        this.setIndex(this.index + n);
    },
    /**
     * Get the byte at the specified index.
     * @param {number} i the index to use.
     * @return {number} a byte.
     */
    byteAt: function(i) {
        // see implementations
    },
    /**
     * Get the next number with a given byte size.
     * @param {number} size the number of bytes to read.
     * @return {number} the corresponding number.
     */
    readInt: function(size) {
        var result = 0,
            i;
        this.checkOffset(size);
        for (i = this.index + size - 1; i >= this.index; i--) {
            result = (result << 8) + this.byteAt(i);
        }
        this.index += size;
        return result;
    },
    /**
     * Get the next string with a given byte size.
     * @param {number} size the number of bytes to read.
     * @return {string} the corresponding string.
     */
    readString: function(size) {
        return utils.transformTo("string", this.readData(size));
    },
    /**
     * Get raw data without conversion, <size> bytes.
     * @param {number} size the number of bytes to read.
     * @return {Object} the raw data, implementation specific.
     */
    readData: function(size) {
        // see implementations
    },
    /**
     * Find the last occurence of a zip signature (4 bytes).
     * @param {string} sig the signature to find.
     * @return {number} the index of the last occurence, -1 if not found.
     */
    lastIndexOfSignature: function(sig) {
        // see implementations
    },
    /**
     * Get the next date.
     * @return {Date} the date.
     */
    readDate: function() {
        var dostime = this.readInt(4);
        return new Date(
        ((dostime >> 25) & 0x7f) + 1980, // year
        ((dostime >> 21) & 0x0f) - 1, // month
        (dostime >> 16) & 0x1f, // day
        (dostime >> 11) & 0x1f, // hour
        (dostime >> 5) & 0x3f, // minute
        (dostime & 0x1f) << 1); // second
    }
};
module.exports = DataReader;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.base64 = false;
exports.binary = false;
exports.dir = false;
exports.createFolders = false;
exports.date = null;
exports.compression = null;
exports.compressionOptions = null;
exports.comment = null;
exports.unixPermissions = null;
exports.dosPermissions = null;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.LOCAL_FILE_HEADER = "PK\x03\x04";
exports.CENTRAL_FILE_HEADER = "PK\x01\x02";
exports.CENTRAL_DIRECTORY_END = "PK\x05\x06";
exports.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x06\x07";
exports.ZIP64_CENTRAL_DIRECTORY_END = "PK\x06\x06";
exports.DATA_DESCRIPTOR = "PK\x07\x08";


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var DataReader = __webpack_require__(20);
var utils = __webpack_require__(0);

function StringReader(data, optimizedBinaryString) {
    this.data = data;
    if (!optimizedBinaryString) {
        this.data = utils.string2binary(this.data);
    }
    this.length = this.data.length;
    this.index = 0;
    this.zero = 0;
}
StringReader.prototype = new DataReader();
/**
 * @see DataReader.byteAt
 */
StringReader.prototype.byteAt = function(i) {
    return this.data.charCodeAt(this.zero + i);
};
/**
 * @see DataReader.lastIndexOfSignature
 */
StringReader.prototype.lastIndexOfSignature = function(sig) {
    return this.data.lastIndexOf(sig) - this.zero;
};
/**
 * @see DataReader.readData
 */
StringReader.prototype.readData = function(size) {
    this.checkOffset(size);
    // this will work because the constructor applied the "& 0xff" mask.
    var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
    this.index += size;
    return result;
};
module.exports = StringReader;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ArrayReader = __webpack_require__(18);

function Uint8ArrayReader(data) {
    if (data) {
        this.data = data;
        this.length = this.data.length;
        this.index = 0;
        this.zero = 0;
    }
}
Uint8ArrayReader.prototype = new ArrayReader();
/**
 * @see DataReader.readData
 */
Uint8ArrayReader.prototype.readData = function(size) {
    this.checkOffset(size);
    if(size === 0) {
        // in IE10, when using subarray(idx, idx), we get the array [0x00] instead of [].
        return new Uint8Array(0);
    }
    var result = this.data.subarray(this.zero + this.index, this.zero + this.index + size);
    this.index += size;
    return result;
};
module.exports = Uint8ArrayReader;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);
var support = __webpack_require__(3);
var nodeBuffer = __webpack_require__(9);

/**
 * The following functions come from pako, from pako/lib/utils/strings
 * released under the MIT license, see pako https://github.com/nodeca/pako/
 */

// Table with utf8 lengths (calculated by first byte of sequence)
// Note, that 5 & 6-byte values and some 4-byte values can not be represented in JS,
// because max possible codepoint is 0x10ffff
var _utf8len = new Array(256);
for (var i=0; i<256; i++) {
  _utf8len[i] = (i >= 252 ? 6 : i >= 248 ? 5 : i >= 240 ? 4 : i >= 224 ? 3 : i >= 192 ? 2 : 1);
}
_utf8len[254]=_utf8len[254]=1; // Invalid sequence start

// convert string to array (typed, when possible)
var string2buf = function (str) {
    var buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;

    // count binary size
    for (m_pos = 0; m_pos < str_len; m_pos++) {
        c = str.charCodeAt(m_pos);
        if ((c & 0xfc00) === 0xd800 && (m_pos+1 < str_len)) {
            c2 = str.charCodeAt(m_pos+1);
            if ((c2 & 0xfc00) === 0xdc00) {
                c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
                m_pos++;
            }
        }
        buf_len += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
    }

    // allocate buffer
    if (support.uint8array) {
        buf = new Uint8Array(buf_len);
    } else {
        buf = new Array(buf_len);
    }

    // convert
    for (i=0, m_pos = 0; i < buf_len; m_pos++) {
        c = str.charCodeAt(m_pos);
        if ((c & 0xfc00) === 0xd800 && (m_pos+1 < str_len)) {
            c2 = str.charCodeAt(m_pos+1);
            if ((c2 & 0xfc00) === 0xdc00) {
                c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
                m_pos++;
            }
        }
        if (c < 0x80) {
            /* one byte */
            buf[i++] = c;
        } else if (c < 0x800) {
            /* two bytes */
            buf[i++] = 0xC0 | (c >>> 6);
            buf[i++] = 0x80 | (c & 0x3f);
        } else if (c < 0x10000) {
            /* three bytes */
            buf[i++] = 0xE0 | (c >>> 12);
            buf[i++] = 0x80 | (c >>> 6 & 0x3f);
            buf[i++] = 0x80 | (c & 0x3f);
        } else {
            /* four bytes */
            buf[i++] = 0xf0 | (c >>> 18);
            buf[i++] = 0x80 | (c >>> 12 & 0x3f);
            buf[i++] = 0x80 | (c >>> 6 & 0x3f);
            buf[i++] = 0x80 | (c & 0x3f);
        }
    }

    return buf;
};

// Calculate max possible position in utf8 buffer,
// that will not break sequence. If that's not possible
// - (very small limits) return max size as is.
//
// buf[] - utf8 bytes array
// max   - length limit (mandatory);
var utf8border = function(buf, max) {
    var pos;

    max = max || buf.length;
    if (max > buf.length) { max = buf.length; }

    // go back from last position, until start of sequence found
    pos = max-1;
    while (pos >= 0 && (buf[pos] & 0xC0) === 0x80) { pos--; }

    // Fuckup - very small and broken sequence,
    // return max, because we should return something anyway.
    if (pos < 0) { return max; }

    // If we came to start of buffer - that means vuffer is too small,
    // return max too.
    if (pos === 0) { return max; }

    return (pos + _utf8len[buf[pos]] > max) ? pos : max;
};

// convert array to string
var buf2string = function (buf) {
    var str, i, out, c, c_len;
    var len = buf.length;

    // Reserve max possible length (2 words per char)
    // NB: by unknown reasons, Array is significantly faster for
    //     String.fromCharCode.apply than Uint16Array.
    var utf16buf = new Array(len*2);

    for (out=0, i=0; i<len;) {
        c = buf[i++];
        // quick process ascii
        if (c < 0x80) { utf16buf[out++] = c; continue; }

        c_len = _utf8len[c];
        // skip 5 & 6 byte codes
        if (c_len > 4) { utf16buf[out++] = 0xfffd; i += c_len-1; continue; }

        // apply mask on first byte
        c &= c_len === 2 ? 0x1f : c_len === 3 ? 0x0f : 0x07;
        // join the rest
        while (c_len > 1 && i < len) {
            c = (c << 6) | (buf[i++] & 0x3f);
            c_len--;
        }

        // terminated by end of string?
        if (c_len > 1) { utf16buf[out++] = 0xfffd; continue; }

        if (c < 0x10000) {
            utf16buf[out++] = c;
        } else {
            c -= 0x10000;
            utf16buf[out++] = 0xd800 | ((c >> 10) & 0x3ff);
            utf16buf[out++] = 0xdc00 | (c & 0x3ff);
        }
    }

    // shrinkBuf(utf16buf, out)
    if (utf16buf.length !== out) {
        if(utf16buf.subarray) {
            utf16buf = utf16buf.subarray(0, out);
        } else {
            utf16buf.length = out;
        }
    }

    // return String.fromCharCode.apply(null, utf16buf);
    return utils.applyFromCharCode(utf16buf);
};


// That's all for the pako functions.


/**
 * Transform a javascript string into an array (typed if possible) of bytes,
 * UTF-8 encoded.
 * @param {String} str the string to encode
 * @return {Array|Uint8Array|Buffer} the UTF-8 encoded string.
 */
exports.utf8encode = function utf8encode(str) {
    if (support.nodebuffer) {
        return nodeBuffer(str, "utf-8");
    }

    return string2buf(str);
};


/**
 * Transform a bytes array (or a representation) representing an UTF-8 encoded
 * string into a javascript string.
 * @param {Array|Uint8Array|Buffer} buf the data de decode
 * @return {String} the decoded string.
 */
exports.utf8decode = function utf8decode(buf) {
    if (support.nodebuffer) {
        return utils.transformTo("nodebuffer", buf).toString("utf-8");
    }

    buf = utils.transformTo(support.uint8array ? "uint8array" : "array", buf);

    // return buf2string(buf);
    // Chrome prefers to work with "small" chunks of data
    // for the method buf2string.
    // Firefox and Chrome has their own shortcut, IE doesn't seem to really care.
    var result = [], k = 0, len = buf.length, chunk = 65536;
    while (k < len) {
        var nextBoundary = utf8border(buf, Math.min(k + chunk, len));
        if (support.uint8array) {
            result.push(buf2string(buf.subarray(k, nextBoundary)));
        } else {
            result.push(buf2string(buf.slice(k, nextBoundary)));
        }
        k = nextBoundary;
    }
    return result.join("");

};
// vim: set shiftwidth=4 softtabstop=4:


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Fast Fourier Transform module
 * 1D-FFT/IFFT, 2D-FFT/IFFT (radix-2)
 */
var FFT = (function(){
  var FFT;  
  
  if(true) {
    FFT = exports;   // for CommonJS
  } else {
    FFT = {};
  }
  
  var version = {
    release: '0.3.0',
    date: '2013-03'
  };
  FFT.toString = function() {
    return "version " + version.release + ", released " + version.date;
  };

  // core operations
  var _n = 0,          // order
      _bitrev = null,  // bit reversal table
      _cstb = null;    // sin/cos table

  var core = {
    init : function(n) {
      if(n !== 0 && (n & (n - 1)) === 0) {
        _n = n;
        core._initArray();
        core._makeBitReversalTable();
        core._makeCosSinTable();
      } else {
        throw new Error("init: radix-2 required");
      }
    },
    // 1D-FFT
    fft1d : function(re, im) {
      core.fft(re, im, 1);
    },
    // 1D-IFFT
    ifft1d : function(re, im) {
      var n = 1/_n;
      core.fft(re, im, -1);
      for(var i=0; i<_n; i++) {
        re[i] *= n;
        im[i] *= n;
      }
    },
     // 1D-IFFT
    bt1d : function(re, im) {
      core.fft(re, im, -1);
    },
    // 2D-FFT Not very useful if the number of rows have to be equal to cols
    fft2d : function(re, im) {
      var tre = [],
          tim = [],
          i = 0;
      // x-axis
      for(var y=0; y<_n; y++) {
        i = y*_n;
        for(var x1=0; x1<_n; x1++) {
          tre[x1] = re[x1 + i];
          tim[x1] = im[x1 + i];
        }
        core.fft1d(tre, tim);
        for(var x2=0; x2<_n; x2++) {
          re[x2 + i] = tre[x2];
          im[x2 + i] = tim[x2];
        }
      }
      // y-axis
      for(var x=0; x<_n; x++) {
        for(var y1=0; y1<_n; y1++) {
          i = x + y1*_n;
          tre[y1] = re[i];
          tim[y1] = im[i];
        }
        core.fft1d(tre, tim);
        for(var y2=0; y2<_n; y2++) {
          i = x + y2*_n;
          re[i] = tre[y2];
          im[i] = tim[y2];
        }
      }
    },
    // 2D-IFFT
    ifft2d : function(re, im) {
      var tre = [],
          tim = [],
          i = 0;
      // x-axis
      for(var y=0; y<_n; y++) {
        i = y*_n;
        for(var x1=0; x1<_n; x1++) {
          tre[x1] = re[x1 + i];
          tim[x1] = im[x1 + i];
        }
        core.ifft1d(tre, tim);
        for(var x2=0; x2<_n; x2++) {
          re[x2 + i] = tre[x2];
          im[x2 + i] = tim[x2];
        }
      }
      // y-axis
      for(var x=0; x<_n; x++) {
        for(var y1=0; y1<_n; y1++) {
          i = x + y1*_n;
          tre[y1] = re[i];
          tim[y1] = im[i];
        }
        core.ifft1d(tre, tim);
        for(var y2=0; y2<_n; y2++) {
          i = x + y2*_n;
          re[i] = tre[y2];
          im[i] = tim[y2];
        }
      }
    },
    // core operation of FFT
    fft : function(re, im, inv) {
      var d, h, ik, m, tmp, wr, wi, xr, xi,
          n4 = _n >> 2;
      // bit reversal
      for(var l=0; l<_n; l++) {
        m = _bitrev[l];
        if(l < m) {
          tmp = re[l];
          re[l] = re[m];
          re[m] = tmp;
          tmp = im[l];
          im[l] = im[m];
          im[m] = tmp;
        }
      }
      // butterfly operation
      for(var k=1; k<_n; k<<=1) {
        h = 0;
        d = _n/(k << 1);
        for(var j=0; j<k; j++) {
          wr = _cstb[h + n4];
          wi = inv*_cstb[h];
          for(var i=j; i<_n; i+=(k<<1)) {
            ik = i + k;
            xr = wr*re[ik] + wi*im[ik];
            xi = wr*im[ik] - wi*re[ik];
            re[ik] = re[i] - xr;
            re[i] += xr;
            im[ik] = im[i] - xi;
            im[i] += xi;
          }
          h += d;
        }
      }
    },
    // initialize the array (supports TypedArray)
    _initArray : function() {
      if(typeof Uint32Array !== 'undefined') {
        _bitrev = new Uint32Array(_n);
      } else {
        _bitrev = [];
      }
      if(typeof Float64Array !== 'undefined') {
        _cstb = new Float64Array(_n*1.25);
      } else {
        _cstb = [];
      }
    },
    // zero padding
    _paddingZero : function() {
      // TODO
    },
    // makes bit reversal table
    _makeBitReversalTable : function() {
      var i = 0,
          j = 0,
          k = 0;
      _bitrev[0] = 0;
      while(++i < _n) {
        k = _n >> 1;
        while(k <= j) {
          j -= k;
          k >>= 1;
        }
        j += k;
        _bitrev[i] = j;
      }
    },
    // makes trigonometiric function table
    _makeCosSinTable : function() {
      var n2 = _n >> 1,
          n4 = _n >> 2,
          n8 = _n >> 3,
          n2p4 = n2 + n4,
          t = Math.sin(Math.PI/_n),
          dc = 2*t*t,
          ds = Math.sqrt(dc*(2 - dc)),
          c = _cstb[n4] = 1,
          s = _cstb[0] = 0;
      t = 2*dc;
      for(var i=1; i<n8; i++) {
        c -= dc;
        dc += t*c;
        s += ds;
        ds -= t*s;
        _cstb[i] = s;
        _cstb[n4 - i] = c;
      }
      if(n8 !== 0) {
        _cstb[n8] = Math.sqrt(0.5);
      }
      for(var j=0; j<n4; j++) {
        _cstb[n2 - j]  = _cstb[j];
      }
      for(var k=0; k<n2p4; k++) {
        _cstb[k + n2] = -_cstb[k];
      }
    }
  };
  // aliases (public APIs)
  var apis = ['init', 'fft1d', 'ifft1d', 'fft2d', 'ifft2d'];
  for(var i=0; i<apis.length; i++) {
    FFT[apis[i]] = core[apis[i]];
  }
  FFT.bt = core.bt1d;
  FFT.fft = core.fft1d;
  FFT.ifft = core.ifft1d;
  
  return FFT;
}).call(this);


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.FFTUtils = __webpack_require__(62);
exports.FFT = __webpack_require__(26);


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Fast Fourier Transform module
 * 1D-FFT/IFFT, 2D-FFT/IFFT (radix-2)
 */
var FFT = (function(){
  var FFT;  
  
  if(true) {
    FFT = exports;   // for CommonJS
  } else {
    FFT = {};
  }
  
  var version = {
    release: '0.3.0',
    date: '2013-03'
  };
  FFT.toString = function() {
    return "version " + version.release + ", released " + version.date;
  };

  // core operations
  var _n = 0,          // order
      _bitrev = null,  // bit reversal table
      _cstb = null;    // sin/cos table

  var core = {
    init : function(n) {
      if(n !== 0 && (n & (n - 1)) === 0) {
        _n = n;
        core._initArray();
        core._makeBitReversalTable();
        core._makeCosSinTable();
      } else {
        throw new Error("init: radix-2 required");
      }
    },
    // 1D-FFT
    fft1d : function(re, im) {
      core.fft(re, im, 1);
    },
    // 1D-IFFT
    ifft1d : function(re, im) {
      var n = 1/_n;
      core.fft(re, im, -1);
      for(var i=0; i<_n; i++) {
        re[i] *= n;
        im[i] *= n;
      }
    },
     // 1D-IFFT
    bt1d : function(re, im) {
      core.fft(re, im, -1);
    },
    // 2D-FFT Not very useful if the number of rows have to be equal to cols
    fft2d : function(re, im) {
      var tre = [],
          tim = [],
          i = 0;
      // x-axis
      for(var y=0; y<_n; y++) {
        i = y*_n;
        for(var x1=0; x1<_n; x1++) {
          tre[x1] = re[x1 + i];
          tim[x1] = im[x1 + i];
        }
        core.fft1d(tre, tim);
        for(var x2=0; x2<_n; x2++) {
          re[x2 + i] = tre[x2];
          im[x2 + i] = tim[x2];
        }
      }
      // y-axis
      for(var x=0; x<_n; x++) {
        for(var y1=0; y1<_n; y1++) {
          i = x + y1*_n;
          tre[y1] = re[i];
          tim[y1] = im[i];
        }
        core.fft1d(tre, tim);
        for(var y2=0; y2<_n; y2++) {
          i = x + y2*_n;
          re[i] = tre[y2];
          im[i] = tim[y2];
        }
      }
    },
    // 2D-IFFT
    ifft2d : function(re, im) {
      var tre = [],
          tim = [],
          i = 0;
      // x-axis
      for(var y=0; y<_n; y++) {
        i = y*_n;
        for(var x1=0; x1<_n; x1++) {
          tre[x1] = re[x1 + i];
          tim[x1] = im[x1 + i];
        }
        core.ifft1d(tre, tim);
        for(var x2=0; x2<_n; x2++) {
          re[x2 + i] = tre[x2];
          im[x2 + i] = tim[x2];
        }
      }
      // y-axis
      for(var x=0; x<_n; x++) {
        for(var y1=0; y1<_n; y1++) {
          i = x + y1*_n;
          tre[y1] = re[i];
          tim[y1] = im[i];
        }
        core.ifft1d(tre, tim);
        for(var y2=0; y2<_n; y2++) {
          i = x + y2*_n;
          re[i] = tre[y2];
          im[i] = tim[y2];
        }
      }
    },
    // core operation of FFT
    fft : function(re, im, inv) {
      var d, h, ik, m, tmp, wr, wi, xr, xi,
          n4 = _n >> 2;
      // bit reversal
      for(var l=0; l<_n; l++) {
        m = _bitrev[l];
        if(l < m) {
          tmp = re[l];
          re[l] = re[m];
          re[m] = tmp;
          tmp = im[l];
          im[l] = im[m];
          im[m] = tmp;
        }
      }
      // butterfly operation
      for(var k=1; k<_n; k<<=1) {
        h = 0;
        d = _n/(k << 1);
        for(var j=0; j<k; j++) {
          wr = _cstb[h + n4];
          wi = inv*_cstb[h];
          for(var i=j; i<_n; i+=(k<<1)) {
            ik = i + k;
            xr = wr*re[ik] + wi*im[ik];
            xi = wr*im[ik] - wi*re[ik];
            re[ik] = re[i] - xr;
            re[i] += xr;
            im[ik] = im[i] - xi;
            im[i] += xi;
          }
          h += d;
        }
      }
    },
    // initialize the array (supports TypedArray)
    _initArray : function() {
      if(typeof Uint32Array !== 'undefined') {
        _bitrev = new Uint32Array(_n);
      } else {
        _bitrev = [];
      }
      if(typeof Float64Array !== 'undefined') {
        _cstb = new Float64Array(_n*1.25);
      } else {
        _cstb = [];
      }
    },
    // zero padding
    _paddingZero : function() {
      // TODO
    },
    // makes bit reversal table
    _makeBitReversalTable : function() {
      var i = 0,
          j = 0,
          k = 0;
      _bitrev[0] = 0;
      while(++i < _n) {
        k = _n >> 1;
        while(k <= j) {
          j -= k;
          k >>= 1;
        }
        j += k;
        _bitrev[i] = j;
      }
    },
    // makes trigonometiric function table
    _makeCosSinTable : function() {
      var n2 = _n >> 1,
          n4 = _n >> 2,
          n8 = _n >> 3,
          n2p4 = n2 + n4,
          t = Math.sin(Math.PI/_n),
          dc = 2*t*t,
          ds = Math.sqrt(dc*(2 - dc)),
          c = _cstb[n4] = 1,
          s = _cstb[0] = 0;
      t = 2*dc;
      for(var i=1; i<n8; i++) {
        c -= dc;
        dc += t*c;
        s += ds;
        ds -= t*s;
        _cstb[i] = s;
        _cstb[n4 - i] = c;
      }
      if(n8 !== 0) {
        _cstb[n8] = Math.sqrt(0.5);
      }
      for(var j=0; j<n4; j++) {
        _cstb[n2 - j]  = _cstb[j];
      }
      for(var k=0; k<n2p4; k++) {
        _cstb[k + n2] = -_cstb[k];
      }
    }
  };
  // aliases (public APIs)
  var apis = ['init', 'fft1d', 'ifft1d', 'fft2d', 'ifft2d'];
  for(var i=0; i<apis.length; i++) {
    FFT[apis[i]] = core[apis[i]];
  }
  FFT.bt = core.bt1d;
  FFT.fft = core.fft1d;
  FFT.ifft = core.ifft1d;
  
  return FFT;
}).call(this);


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by acastillo on 8/24/15.
 */
/**
 * Non in-place function definitions, compatible with mathjs code *
 */



var Matrix = __webpack_require__(4);

function matrix(A,B){
    return new Matrix(A,B);
}

function ones(rows, cols){
    return Matrix.ones(rows,cols);
}

function eye(rows, cols){
    return Matrix.eye(rows, cols);
}

function zeros(rows, cols){
    return Matrix.zeros(rows, cols);
}

function random(rows, cols){
    return Matrix.rand(rows,cols);
}

function transpose(A){
    if(typeof A == 'number')
        return A;
    var result = A.clone();
    return result.transpose();
}

function add(A, B){
    if(typeof A == 'number'&&typeof B === 'number')
        return A+B;
    if(typeof A == 'number')
        return this.add(B,A);

    var result = A.clone();
    return result.add(B);

}

function subtract(A, B){
    if(typeof A == 'number'&&typeof B === 'number')
        return A-B;
    if(typeof A == 'number')
        return this.subtract(B,A);
    var result = A.clone();
    return result.sub(B);
}

function multiply(A, B){
    if(typeof A == 'number'&&typeof B === 'number')
        return A*B;
    if(typeof A == 'number')
        return this.multiply(B,A);

    var result = A.clone();

    if(typeof B === 'number')
        result.mul(B);
    else
        result = result.mmul(B);

    if(result.rows==1&&result.columns==1)
        return result[0][0];
    else
        return result;

}

function dotMultiply(A, B){
    var result = A.clone();
    return result.mul(B);
}

function dotDivide(A, B){
    var result = A.clone();
    return result.div(B);
}

function diag(A){
    var diag = null;
    var rows = A.rows, cols = A.columns, j, r;
    //It is an array
    if(typeof cols === "undefined" && (typeof A)=='object'){
        if(A[0]&&A[0].length){
            rows = A.length;
            cols = A[0].length;
            r = Math.min(rows,cols);
            diag = Matrix.zeros(cols, cols);
            for (j = 0; j < cols; j++) {
                diag[j][j]=A[j][j];
            }
        }
        else{
            cols = A.length;
            diag = Matrix.zeros(cols, cols);
            for (j = 0; j < cols; j++) {
                diag[j][j]=A[j];
            }
        }

    }
    if(rows == 1){
        diag = Matrix.zeros(cols, cols);
        for (j = 0; j < cols; j++) {
            diag[j][j]=A[0][j];
        }
    }
    else{
        if(rows>0 && cols > 0){
            r = Math.min(rows,cols);
            diag = new Array(r);
            for (j = 0; j < r; j++) {
                diag[j] = A[j][j];
            }
        }
    }
    return diag;
}

function min(A, B){
    if(typeof A==='number' && typeof B ==='number')
        return Math.min(A,B);
    var ii = A.rows, jj = A.columns;
    var result = new Matrix(ii,jj);
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            if (A[i][j] < B[i][j]) {
                result[i][j] = A[i][j];
            }
            else{
                result[i][j] = B[i][j];
            }
        }
    }
    return result;
}

function max(A, B){
    if(typeof A==='number' && typeof B ==='number')
        return Math.max(A,B);
    var ii = A.rows, jj = A.columns;
    var result = new Matrix(ii,jj);
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            if (A[i][j] > B[i][j]) {
                result[i][j] = A[i][j];
            }
            else{
                result[i][j] = B[i][j];
            }
        }
    }
    return result;
}

function sqrt(A){
    if(typeof A==='number' )
        return Math.sqrt(A);
    var ii = A.rows, jj = A.columns;
    var result = new Matrix(ii,jj);
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            result[i][j] = Math.sqrt(A[i][j]);

        }
    }
    return result;
}

function abs(A){
    if(typeof A==='number' )
        return Math.abs(A);
    var ii = A.rows, jj = A.columns;
    var result = new Matrix(ii,jj);
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            result[i][j] = Math.abs(A[i][j]);

        }
    }
    return result;
}

function exp(A){
    if(typeof A==='number' )
        return Math.sqrt(A);
    var ii = A.rows, jj = A.columns;
    var result = new Matrix(ii,jj);
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            result[i][j] = Math.exp(A[i][j]);
        }
    }
    return result;
}

function dotPow(A, b){
    if(typeof A==='number' )
        return Math.pow(A,b);
    //console.log(A);
    var ii = A.rows, jj = A.columns;
    var result = new Matrix(ii,jj);
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            result[i][j] = Math.pow(A[i][j],b);
        }
    }
    return result;
}

function solve(A, B){
    return A.solve(B);
}

function inv(A){
    if(typeof A ==="number")
        return 1/A;
    return A.inverse();
}

module.exports = {
    transpose:transpose,
    add:add,
    subtract:subtract,
    multiply:multiply,
    dotMultiply:dotMultiply,
    dotDivide:dotDivide,
    diag:diag,
    min:min,
    max:max,
    solve:solve,
    inv:inv,
    sqrt:sqrt,
    exp:exp,
    dotPow:dotPow,
    abs:abs,
    matrix:matrix,
    ones:ones,
    zeros:zeros,
    random:random,
    eye:eye
};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function compareNumbers(a, b) {
    return a - b;
}

/**
 * Computes the sum of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.sum = function sum(values) {
    var sum = 0;
    for (var i = 0; i < values.length; i++) {
        sum += values[i];
    }
    return sum;
};

/**
 * Computes the maximum of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.max = function max(values) {
    var max = -Infinity;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        if (values[i] > max) max = values[i];
    }
    return max;
};

/**
 * Computes the minimum of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.min = function min(values) {
    var min = Infinity;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        if (values[i] < min) min = values[i];
    }
    return min;
};

/**
 * Computes the min and max of the given values
 * @param {Array} values
 * @returns {{min: number, max: number}}
 */
exports.minMax = function minMax(values) {
    var min = Infinity;
    var max = -Infinity;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        if (values[i] < min) min = values[i];
        if (values[i] > max) max = values[i];
    }
    return {
        min: min,
        max: max
    };
};

/**
 * Computes the arithmetic mean of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.arithmeticMean = function arithmeticMean(values) {
    var sum = 0;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        sum += values[i];
    }
    return sum / l;
};

/**
 * {@link arithmeticMean}
 */
exports.mean = exports.arithmeticMean;

/**
 * Computes the geometric mean of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.geometricMean = function geometricMean(values) {
    var mul = 1;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        mul *= values[i];
    }
    return Math.pow(mul, 1 / l);
};

/**
 * Computes the mean of the log of the given values
 * If the return value is exponentiated, it gives the same result as the
 * geometric mean.
 * @param {Array} values
 * @returns {number}
 */
exports.logMean = function logMean(values) {
    var lnsum = 0;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        lnsum += Math.log(values[i]);
    }
    return lnsum / l;
};

/**
 * Computes the weighted grand mean for a list of means and sample sizes
 * @param {Array} means - Mean values for each set of samples
 * @param {Array} samples - Number of original values for each set of samples
 * @returns {number}
 */
exports.grandMean = function grandMean(means, samples) {
    var sum = 0;
    var n = 0;
    var l = means.length;
    for (var i = 0; i < l; i++) {
        sum += samples[i] * means[i];
        n += samples[i];
    }
    return sum / n;
};

/**
 * Computes the truncated mean of the given values using a given percentage
 * @param {Array} values
 * @param {number} percent - The percentage of values to keep (range: [0,1])
 * @param {boolean} [alreadySorted=false]
 * @returns {number}
 */
exports.truncatedMean = function truncatedMean(values, percent, alreadySorted) {
    if (alreadySorted === undefined) alreadySorted = false;
    if (!alreadySorted) {
        values = values.slice().sort(compareNumbers);
    }
    var l = values.length;
    var k = Math.floor(l * percent);
    var sum = 0;
    for (var i = k; i < (l - k); i++) {
        sum += values[i];
    }
    return sum / (l - 2 * k);
};

/**
 * Computes the harmonic mean of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.harmonicMean = function harmonicMean(values) {
    var sum = 0;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        if (values[i] === 0) {
            throw new RangeError('value at index ' + i + 'is zero');
        }
        sum += 1 / values[i];
    }
    return l / sum;
};

/**
 * Computes the contraharmonic mean of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.contraHarmonicMean = function contraHarmonicMean(values) {
    var r1 = 0;
    var r2 = 0;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        r1 += values[i] * values[i];
        r2 += values[i];
    }
    if (r2 < 0) {
        throw new RangeError('sum of values is negative');
    }
    return r1 / r2;
};

/**
 * Computes the median of the given values
 * @param {Array} values
 * @param {boolean} [alreadySorted=false]
 * @returns {number}
 */
exports.median = function median(values, alreadySorted) {
    if (alreadySorted === undefined) alreadySorted = false;
    if (!alreadySorted) {
        values = values.slice().sort(compareNumbers);
    }
    var l = values.length;
    var half = Math.floor(l / 2);
    if (l % 2 === 0) {
        return (values[half - 1] + values[half]) * 0.5;
    } else {
        return values[half];
    }
};

/**
 * Computes the variance of the given values
 * @param {Array} values
 * @param {boolean} [unbiased=true] - if true, divide by (n-1); if false, divide by n.
 * @returns {number}
 */
exports.variance = function variance(values, unbiased) {
    if (unbiased === undefined) unbiased = true;
    var theMean = exports.mean(values);
    var theVariance = 0;
    var l = values.length;

    for (var i = 0; i < l; i++) {
        var x = values[i] - theMean;
        theVariance += x * x;
    }

    if (unbiased) {
        return theVariance / (l - 1);
    } else {
        return theVariance / l;
    }
};

/**
 * Computes the standard deviation of the given values
 * @param {Array} values
 * @param {boolean} [unbiased=true] - if true, divide by (n-1); if false, divide by n.
 * @returns {number}
 */
exports.standardDeviation = function standardDeviation(values, unbiased) {
    return Math.sqrt(exports.variance(values, unbiased));
};

exports.standardError = function standardError(values) {
    return exports.standardDeviation(values) / Math.sqrt(values.length);
};

exports.quartiles = function quartiles(values, alreadySorted) {
    if (typeof(alreadySorted) === 'undefined') alreadySorted = false;
    if (!alreadySorted) {
        values = values.slice();
        values.sort(compareNumbers);
    }

    var quart = values.length / 4;
    var q1 = values[Math.ceil(quart) - 1];
    var q2 = exports.median(values, true);
    var q3 = values[Math.ceil(quart * 3) - 1];

    return {q1: q1, q2: q2, q3: q3};
};

exports.pooledStandardDeviation = function pooledStandardDeviation(samples, unbiased) {
    return Math.sqrt(exports.pooledVariance(samples, unbiased));
};

exports.pooledVariance = function pooledVariance(samples, unbiased) {
    if (typeof(unbiased) === 'undefined') unbiased = true;
    var sum = 0;
    var length = 0, l = samples.length;
    for (var i = 0; i < l; i++) {
        var values = samples[i];
        var vari = exports.variance(values);

        sum += (values.length - 1) * vari;

        if (unbiased)
            length += values.length - 1;
        else
            length += values.length;
    }
    return sum / length;
};

exports.mode = function mode(values) {
    var l = values.length,
        itemCount = new Array(l),
        i;
    for (i = 0; i < l; i++) {
        itemCount[i] = 0;
    }
    var itemArray = new Array(l);
    var count = 0;

    for (i = 0; i < l; i++) {
        var index = itemArray.indexOf(values[i]);
        if (index >= 0)
            itemCount[index]++;
        else {
            itemArray[count] = values[i];
            itemCount[count] = 1;
            count++;
        }
    }

    var maxValue = 0, maxIndex = 0;
    for (i = 0; i < count; i++) {
        if (itemCount[i] > maxValue) {
            maxValue = itemCount[i];
            maxIndex = i;
        }
    }

    return itemArray[maxIndex];
};

exports.covariance = function covariance(vector1, vector2, unbiased) {
    if (typeof(unbiased) === 'undefined') unbiased = true;
    var mean1 = exports.mean(vector1);
    var mean2 = exports.mean(vector2);

    if (vector1.length !== vector2.length)
        throw "Vectors do not have the same dimensions";

    var cov = 0, l = vector1.length;
    for (var i = 0; i < l; i++) {
        var x = vector1[i] - mean1;
        var y = vector2[i] - mean2;
        cov += x * y;
    }

    if (unbiased)
        return cov / (l - 1);
    else
        return cov / l;
};

exports.skewness = function skewness(values, unbiased) {
    if (typeof(unbiased) === 'undefined') unbiased = true;
    var theMean = exports.mean(values);

    var s2 = 0, s3 = 0, l = values.length;
    for (var i = 0; i < l; i++) {
        var dev = values[i] - theMean;
        s2 += dev * dev;
        s3 += dev * dev * dev;
    }
    var m2 = s2 / l;
    var m3 = s3 / l;

    var g = m3 / (Math.pow(m2, 3 / 2.0));
    if (unbiased) {
        var a = Math.sqrt(l * (l - 1));
        var b = l - 2;
        return (a / b) * g;
    }
    else {
        return g;
    }
};

exports.kurtosis = function kurtosis(values, unbiased) {
    if (typeof(unbiased) === 'undefined') unbiased = true;
    var theMean = exports.mean(values);
    var n = values.length, s2 = 0, s4 = 0;

    for (var i = 0; i < n; i++) {
        var dev = values[i] - theMean;
        s2 += dev * dev;
        s4 += dev * dev * dev * dev;
    }
    var m2 = s2 / n;
    var m4 = s4 / n;

    if (unbiased) {
        var v = s2 / (n - 1);
        var a = (n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3));
        var b = s4 / (v * v);
        var c = ((n - 1) * (n - 1)) / ((n - 2) * (n - 3));

        return a * b - 3 * c;
    }
    else {
        return m4 / (m2 * m2) - 3;
    }
};

exports.entropy = function entropy(values, eps) {
    if (typeof(eps) === 'undefined') eps = 0;
    var sum = 0, l = values.length;
    for (var i = 0; i < l; i++)
        sum += values[i] * Math.log(values[i] + eps);
    return -sum;
};

exports.weightedMean = function weightedMean(values, weights) {
    var sum = 0, l = values.length;
    for (var i = 0; i < l; i++)
        sum += values[i] * weights[i];
    return sum;
};

exports.weightedStandardDeviation = function weightedStandardDeviation(values, weights) {
    return Math.sqrt(exports.weightedVariance(values, weights));
};

exports.weightedVariance = function weightedVariance(values, weights) {
    var theMean = exports.weightedMean(values, weights);
    var vari = 0, l = values.length;
    var a = 0, b = 0;

    for (var i = 0; i < l; i++) {
        var z = values[i] - theMean;
        var w = weights[i];

        vari += w * (z * z);
        b += w;
        a += w * w;
    }

    return vari * (b / (b * b - a));
};

exports.center = function center(values, inPlace) {
    if (typeof(inPlace) === 'undefined') inPlace = false;

    var result = values;
    if (!inPlace)
        result = values.slice();

    var theMean = exports.mean(result), l = result.length;
    for (var i = 0; i < l; i++)
        result[i] -= theMean;
};

exports.standardize = function standardize(values, standardDev, inPlace) {
    if (typeof(standardDev) === 'undefined') standardDev = exports.standardDeviation(values);
    if (typeof(inPlace) === 'undefined') inPlace = false;
    var l = values.length;
    var result = inPlace ? values : new Array(l);
    for (var i = 0; i < l; i++)
        result[i] = values[i] / standardDev;
    return result;
};

exports.cumulativeSum = function cumulativeSum(array) {
    var l = array.length;
    var result = new Array(l);
    result[0] = array[0];
    for (var i = 1; i < l; i++)
        result[i] = result[i - 1] + array[i];
    return result;
};


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function compareNumbers(a, b) {
    return a - b;
}

/**
 * Computes the sum of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.sum = function sum(values) {
    var sum = 0;
    for (var i = 0; i < values.length; i++) {
        sum += values[i];
    }
    return sum;
};

/**
 * Computes the maximum of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.max = function max(values) {
    var max = values[0];
    var l = values.length;
    for (var i = 1; i < l; i++) {
        if (values[i] > max) max = values[i];
    }
    return max;
};

/**
 * Computes the minimum of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.min = function min(values) {
    var min = values[0];
    var l = values.length;
    for (var i = 1; i < l; i++) {
        if (values[i] < min) min = values[i];
    }
    return min;
};

/**
 * Computes the min and max of the given values
 * @param {Array} values
 * @returns {{min: number, max: number}}
 */
exports.minMax = function minMax(values) {
    var min = values[0];
    var max = values[0];
    var l = values.length;
    for (var i = 1; i < l; i++) {
        if (values[i] < min) min = values[i];
        if (values[i] > max) max = values[i];
    }
    return {
        min: min,
        max: max
    };
};

/**
 * Computes the arithmetic mean of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.arithmeticMean = function arithmeticMean(values) {
    var sum = 0;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        sum += values[i];
    }
    return sum / l;
};

/**
 * {@link arithmeticMean}
 */
exports.mean = exports.arithmeticMean;

/**
 * Computes the geometric mean of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.geometricMean = function geometricMean(values) {
    var mul = 1;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        mul *= values[i];
    }
    return Math.pow(mul, 1 / l);
};

/**
 * Computes the mean of the log of the given values
 * If the return value is exponentiated, it gives the same result as the
 * geometric mean.
 * @param {Array} values
 * @returns {number}
 */
exports.logMean = function logMean(values) {
    var lnsum = 0;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        lnsum += Math.log(values[i]);
    }
    return lnsum / l;
};

/**
 * Computes the weighted grand mean for a list of means and sample sizes
 * @param {Array} means - Mean values for each set of samples
 * @param {Array} samples - Number of original values for each set of samples
 * @returns {number}
 */
exports.grandMean = function grandMean(means, samples) {
    var sum = 0;
    var n = 0;
    var l = means.length;
    for (var i = 0; i < l; i++) {
        sum += samples[i] * means[i];
        n += samples[i];
    }
    return sum / n;
};

/**
 * Computes the truncated mean of the given values using a given percentage
 * @param {Array} values
 * @param {number} percent - The percentage of values to keep (range: [0,1])
 * @param {boolean} [alreadySorted=false]
 * @returns {number}
 */
exports.truncatedMean = function truncatedMean(values, percent, alreadySorted) {
    if (alreadySorted === undefined) alreadySorted = false;
    if (!alreadySorted) {
        values = [].concat(values).sort(compareNumbers);
    }
    var l = values.length;
    var k = Math.floor(l * percent);
    var sum = 0;
    for (var i = k; i < (l - k); i++) {
        sum += values[i];
    }
    return sum / (l - 2 * k);
};

/**
 * Computes the harmonic mean of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.harmonicMean = function harmonicMean(values) {
    var sum = 0;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        if (values[i] === 0) {
            throw new RangeError('value at index ' + i + 'is zero');
        }
        sum += 1 / values[i];
    }
    return l / sum;
};

/**
 * Computes the contraharmonic mean of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.contraHarmonicMean = function contraHarmonicMean(values) {
    var r1 = 0;
    var r2 = 0;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        r1 += values[i] * values[i];
        r2 += values[i];
    }
    if (r2 < 0) {
        throw new RangeError('sum of values is negative');
    }
    return r1 / r2;
};

/**
 * Computes the median of the given values
 * @param {Array} values
 * @param {boolean} [alreadySorted=false]
 * @returns {number}
 */
exports.median = function median(values, alreadySorted) {
    if (alreadySorted === undefined) alreadySorted = false;
    if (!alreadySorted) {
        values = [].concat(values).sort(compareNumbers);
    }
    var l = values.length;
    var half = Math.floor(l / 2);
    if (l % 2 === 0) {
        return (values[half - 1] + values[half]) * 0.5;
    } else {
        return values[half];
    }
};

/**
 * Computes the variance of the given values
 * @param {Array} values
 * @param {boolean} [unbiased=true] - if true, divide by (n-1); if false, divide by n.
 * @returns {number}
 */
exports.variance = function variance(values, unbiased) {
    if (unbiased === undefined) unbiased = true;
    var theMean = exports.mean(values);
    var theVariance = 0;
    var l = values.length;

    for (var i = 0; i < l; i++) {
        var x = values[i] - theMean;
        theVariance += x * x;
    }

    if (unbiased) {
        return theVariance / (l - 1);
    } else {
        return theVariance / l;
    }
};

/**
 * Computes the standard deviation of the given values
 * @param {Array} values
 * @param {boolean} [unbiased=true] - if true, divide by (n-1); if false, divide by n.
 * @returns {number}
 */
exports.standardDeviation = function standardDeviation(values, unbiased) {
    return Math.sqrt(exports.variance(values, unbiased));
};

exports.standardError = function standardError(values) {
    return exports.standardDeviation(values) / Math.sqrt(values.length);
};

/**
 * IEEE Transactions on biomedical engineering, vol. 52, no. 1, january 2005, p. 76-
 * Calculate the standard deviation via the Median of the absolute deviation
 *  The formula for the standard deviation only holds for Gaussian random variables.
 * @returns {{mean: number, stdev: number}}
 */
exports.robustMeanAndStdev = function robustMeanAndStdev(y) {
    var mean = 0, stdev = 0;
    var length = y.length, i = 0;
    for (i = 0; i < length; i++) {
        mean += y[i];
    }
    mean /= length;
    var averageDeviations = new Array(length);
    for (i = 0; i < length; i++)
        averageDeviations[i] = Math.abs(y[i] - mean);
    averageDeviations.sort(compareNumbers);
    if (length % 2 === 1) {
        stdev = averageDeviations[(length - 1) / 2] / 0.6745;
    } else {
        stdev = 0.5 * (averageDeviations[length / 2] + averageDeviations[length / 2 - 1]) / 0.6745;
    }

    return {
        mean: mean,
        stdev: stdev
    };
};

exports.quartiles = function quartiles(values, alreadySorted) {
    if (typeof (alreadySorted) === 'undefined') alreadySorted = false;
    if (!alreadySorted) {
        values = [].concat(values).sort(compareNumbers);
    }

    var quart = values.length / 4;
    var q1 = values[Math.ceil(quart) - 1];
    var q2 = exports.median(values, true);
    var q3 = values[Math.ceil(quart * 3) - 1];

    return {q1: q1, q2: q2, q3: q3};
};

exports.pooledStandardDeviation = function pooledStandardDeviation(samples, unbiased) {
    return Math.sqrt(exports.pooledVariance(samples, unbiased));
};

exports.pooledVariance = function pooledVariance(samples, unbiased) {
    if (typeof (unbiased) === 'undefined') unbiased = true;
    var sum = 0;
    var length = 0, l = samples.length;
    for (var i = 0; i < l; i++) {
        var values = samples[i];
        var vari = exports.variance(values);

        sum += (values.length - 1) * vari;

        if (unbiased)
            length += values.length - 1;
        else
            length += values.length;
    }
    return sum / length;
};

exports.mode = function mode(values) {
    var l = values.length,
        itemCount = new Array(l),
        i;
    for (i = 0; i < l; i++) {
        itemCount[i] = 0;
    }
    var itemArray = new Array(l);
    var count = 0;

    for (i = 0; i < l; i++) {
        var index = itemArray.indexOf(values[i]);
        if (index >= 0)
            itemCount[index]++;
        else {
            itemArray[count] = values[i];
            itemCount[count] = 1;
            count++;
        }
    }

    var maxValue = 0, maxIndex = 0;
    for (i = 0; i < count; i++) {
        if (itemCount[i] > maxValue) {
            maxValue = itemCount[i];
            maxIndex = i;
        }
    }

    return itemArray[maxIndex];
};

exports.covariance = function covariance(vector1, vector2, unbiased) {
    if (typeof (unbiased) === 'undefined') unbiased = true;
    var mean1 = exports.mean(vector1);
    var mean2 = exports.mean(vector2);

    if (vector1.length !== vector2.length)
        throw 'Vectors do not have the same dimensions';

    var cov = 0, l = vector1.length;
    for (var i = 0; i < l; i++) {
        var x = vector1[i] - mean1;
        var y = vector2[i] - mean2;
        cov += x * y;
    }

    if (unbiased)
        return cov / (l - 1);
    else
        return cov / l;
};

exports.skewness = function skewness(values, unbiased) {
    if (typeof (unbiased) === 'undefined') unbiased = true;
    var theMean = exports.mean(values);

    var s2 = 0, s3 = 0, l = values.length;
    for (var i = 0; i < l; i++) {
        var dev = values[i] - theMean;
        s2 += dev * dev;
        s3 += dev * dev * dev;
    }
    var m2 = s2 / l;
    var m3 = s3 / l;

    var g = m3 / (Math.pow(m2, 3 / 2.0));
    if (unbiased) {
        var a = Math.sqrt(l * (l - 1));
        var b = l - 2;
        return (a / b) * g;
    } else {
        return g;
    }
};

exports.kurtosis = function kurtosis(values, unbiased) {
    if (typeof (unbiased) === 'undefined') unbiased = true;
    var theMean = exports.mean(values);
    var n = values.length, s2 = 0, s4 = 0;

    for (var i = 0; i < n; i++) {
        var dev = values[i] - theMean;
        s2 += dev * dev;
        s4 += dev * dev * dev * dev;
    }
    var m2 = s2 / n;
    var m4 = s4 / n;

    if (unbiased) {
        var v = s2 / (n - 1);
        var a = (n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3));
        var b = s4 / (v * v);
        var c = ((n - 1) * (n - 1)) / ((n - 2) * (n - 3));

        return a * b - 3 * c;
    } else {
        return m4 / (m2 * m2) - 3;
    }
};

exports.entropy = function entropy(values, eps) {
    if (typeof (eps) === 'undefined') eps = 0;
    var sum = 0, l = values.length;
    for (var i = 0; i < l; i++)
        sum += values[i] * Math.log(values[i] + eps);
    return -sum;
};

exports.weightedMean = function weightedMean(values, weights) {
    var sum = 0, l = values.length;
    for (var i = 0; i < l; i++)
        sum += values[i] * weights[i];
    return sum;
};

exports.weightedStandardDeviation = function weightedStandardDeviation(values, weights) {
    return Math.sqrt(exports.weightedVariance(values, weights));
};

exports.weightedVariance = function weightedVariance(values, weights) {
    var theMean = exports.weightedMean(values, weights);
    var vari = 0, l = values.length;
    var a = 0, b = 0;

    for (var i = 0; i < l; i++) {
        var z = values[i] - theMean;
        var w = weights[i];

        vari += w * (z * z);
        b += w;
        a += w * w;
    }

    return vari * (b / (b * b - a));
};

exports.center = function center(values, inPlace) {
    if (typeof (inPlace) === 'undefined') inPlace = false;

    var result = values;
    if (!inPlace)
        result = [].concat(values);

    var theMean = exports.mean(result), l = result.length;
    for (var i = 0; i < l; i++)
        result[i] -= theMean;
};

exports.standardize = function standardize(values, standardDev, inPlace) {
    if (typeof (standardDev) === 'undefined') standardDev = exports.standardDeviation(values);
    if (typeof (inPlace) === 'undefined') inPlace = false;
    var l = values.length;
    var result = inPlace ? values : new Array(l);
    for (var i = 0; i < l; i++)
        result[i] = values[i] / standardDev;
    return result;
};

exports.cumulativeSum = function cumulativeSum(array) {
    var l = array.length;
    var result = new Array(l);
    result[0] = array[0];
    for (var i = 1; i < l; i++)
        result[i] = result[i - 1] + array[i];
    return result;
};


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// String encode/decode helpers



var utils = __webpack_require__(1);


// Quick check if we can use fast array to bin string conversion
//
// - apply(Array) can fail on Android 2.2
// - apply(Uint8Array) can fail on iOS 5.1 Safary
//
var STR_APPLY_OK = true;
var STR_APPLY_UIA_OK = true;

try { String.fromCharCode.apply(null, [ 0 ]); } catch (__) { STR_APPLY_OK = false; }
try { String.fromCharCode.apply(null, new Uint8Array(1)); } catch (__) { STR_APPLY_UIA_OK = false; }


// Table with utf8 lengths (calculated by first byte of sequence)
// Note, that 5 & 6-byte values and some 4-byte values can not be represented in JS,
// because max possible codepoint is 0x10ffff
var _utf8len = new utils.Buf8(256);
for (var q = 0; q < 256; q++) {
  _utf8len[q] = (q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1);
}
_utf8len[254] = _utf8len[254] = 1; // Invalid sequence start


// convert string to array (typed, when possible)
exports.string2buf = function (str) {
  var buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;

  // count binary size
  for (m_pos = 0; m_pos < str_len; m_pos++) {
    c = str.charCodeAt(m_pos);
    if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len)) {
      c2 = str.charCodeAt(m_pos + 1);
      if ((c2 & 0xfc00) === 0xdc00) {
        c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
        m_pos++;
      }
    }
    buf_len += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
  }

  // allocate buffer
  buf = new utils.Buf8(buf_len);

  // convert
  for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
    c = str.charCodeAt(m_pos);
    if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len)) {
      c2 = str.charCodeAt(m_pos + 1);
      if ((c2 & 0xfc00) === 0xdc00) {
        c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
        m_pos++;
      }
    }
    if (c < 0x80) {
      /* one byte */
      buf[i++] = c;
    } else if (c < 0x800) {
      /* two bytes */
      buf[i++] = 0xC0 | (c >>> 6);
      buf[i++] = 0x80 | (c & 0x3f);
    } else if (c < 0x10000) {
      /* three bytes */
      buf[i++] = 0xE0 | (c >>> 12);
      buf[i++] = 0x80 | (c >>> 6 & 0x3f);
      buf[i++] = 0x80 | (c & 0x3f);
    } else {
      /* four bytes */
      buf[i++] = 0xf0 | (c >>> 18);
      buf[i++] = 0x80 | (c >>> 12 & 0x3f);
      buf[i++] = 0x80 | (c >>> 6 & 0x3f);
      buf[i++] = 0x80 | (c & 0x3f);
    }
  }

  return buf;
};

// Helper (used in 2 places)
function buf2binstring(buf, len) {
  // use fallback for big arrays to avoid stack overflow
  if (len < 65537) {
    if ((buf.subarray && STR_APPLY_UIA_OK) || (!buf.subarray && STR_APPLY_OK)) {
      return String.fromCharCode.apply(null, utils.shrinkBuf(buf, len));
    }
  }

  var result = '';
  for (var i = 0; i < len; i++) {
    result += String.fromCharCode(buf[i]);
  }
  return result;
}


// Convert byte array to binary string
exports.buf2binstring = function (buf) {
  return buf2binstring(buf, buf.length);
};


// Convert binary string (typed, when possible)
exports.binstring2buf = function (str) {
  var buf = new utils.Buf8(str.length);
  for (var i = 0, len = buf.length; i < len; i++) {
    buf[i] = str.charCodeAt(i);
  }
  return buf;
};


// convert array to string
exports.buf2string = function (buf, max) {
  var i, out, c, c_len;
  var len = max || buf.length;

  // Reserve max possible length (2 words per char)
  // NB: by unknown reasons, Array is significantly faster for
  //     String.fromCharCode.apply than Uint16Array.
  var utf16buf = new Array(len * 2);

  for (out = 0, i = 0; i < len;) {
    c = buf[i++];
    // quick process ascii
    if (c < 0x80) { utf16buf[out++] = c; continue; }

    c_len = _utf8len[c];
    // skip 5 & 6 byte codes
    if (c_len > 4) { utf16buf[out++] = 0xfffd; i += c_len - 1; continue; }

    // apply mask on first byte
    c &= c_len === 2 ? 0x1f : c_len === 3 ? 0x0f : 0x07;
    // join the rest
    while (c_len > 1 && i < len) {
      c = (c << 6) | (buf[i++] & 0x3f);
      c_len--;
    }

    // terminated by end of string?
    if (c_len > 1) { utf16buf[out++] = 0xfffd; continue; }

    if (c < 0x10000) {
      utf16buf[out++] = c;
    } else {
      c -= 0x10000;
      utf16buf[out++] = 0xd800 | ((c >> 10) & 0x3ff);
      utf16buf[out++] = 0xdc00 | (c & 0x3ff);
    }
  }

  return buf2binstring(utf16buf, out);
};


// Calculate max possible position in utf8 buffer,
// that will not break sequence. If that's not possible
// - (very small limits) return max size as is.
//
// buf[] - utf8 bytes array
// max   - length limit (mandatory);
exports.utf8border = function (buf, max) {
  var pos;

  max = max || buf.length;
  if (max > buf.length) { max = buf.length; }

  // go back from last position, until start of sequence found
  pos = max - 1;
  while (pos >= 0 && (buf[pos] & 0xC0) === 0x80) { pos--; }

  // Fuckup - very small and broken sequence,
  // return max, because we should return something anyway.
  if (pos < 0) { return max; }

  // If we came to start of buffer - that means vuffer is too small,
  // return max too.
  if (pos === 0) { return max; }

  return (pos + _utf8len[buf[pos]] > max) ? pos : max;
};


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Note: adler32 takes 12% for level 0 and 2% for level 6.
// It doesn't worth to make additional optimizationa as in original.
// Small size is preferable.

function adler32(adler, buf, len, pos) {
  var s1 = (adler & 0xffff) |0,
      s2 = ((adler >>> 16) & 0xffff) |0,
      n = 0;

  while (len !== 0) {
    // Set limit ~ twice less than 5552, to keep
    // s2 in 31-bits, because we force signed ints.
    // in other case %= will fail.
    n = len > 2000 ? 2000 : len;
    len -= n;

    do {
      s1 = (s1 + buf[pos++]) |0;
      s2 = (s2 + s1) |0;
    } while (--n);

    s1 %= 65521;
    s2 %= 65521;
  }

  return (s1 | (s2 << 16)) |0;
}


module.exports = adler32;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



module.exports = {

  /* Allowed flush values; see deflate() and inflate() below for details */
  Z_NO_FLUSH:         0,
  Z_PARTIAL_FLUSH:    1,
  Z_SYNC_FLUSH:       2,
  Z_FULL_FLUSH:       3,
  Z_FINISH:           4,
  Z_BLOCK:            5,
  Z_TREES:            6,

  /* Return codes for the compression/decompression functions. Negative values
  * are errors, positive values are used for special but normal events.
  */
  Z_OK:               0,
  Z_STREAM_END:       1,
  Z_NEED_DICT:        2,
  Z_ERRNO:           -1,
  Z_STREAM_ERROR:    -2,
  Z_DATA_ERROR:      -3,
  //Z_MEM_ERROR:     -4,
  Z_BUF_ERROR:       -5,
  //Z_VERSION_ERROR: -6,

  /* compression levels */
  Z_NO_COMPRESSION:         0,
  Z_BEST_SPEED:             1,
  Z_BEST_COMPRESSION:       9,
  Z_DEFAULT_COMPRESSION:   -1,


  Z_FILTERED:               1,
  Z_HUFFMAN_ONLY:           2,
  Z_RLE:                    3,
  Z_FIXED:                  4,
  Z_DEFAULT_STRATEGY:       0,

  /* Possible values of the data_type field (though see inflate()) */
  Z_BINARY:                 0,
  Z_TEXT:                   1,
  //Z_ASCII:                1, // = Z_TEXT (deprecated)
  Z_UNKNOWN:                2,

  /* The deflate compression method */
  Z_DEFLATED:               8
  //Z_NULL:                 null // Use -1 or null inline, depending on var type
};


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Note: we can't get significant speed boost here.
// So write code to minimize size - no pregenerated tables
// and array tools dependencies.


// Use ordinary array, since untyped makes no boost here
function makeTable() {
  var c, table = [];

  for (var n = 0; n < 256; n++) {
    c = n;
    for (var k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    table[n] = c;
  }

  return table;
}

// Create table on load. Just 255 signed longs. Not a problem.
var crcTable = makeTable();


function crc32(crc, buf, len, pos) {
  var t = crcTable,
      end = pos + len;

  crc ^= -1;

  for (var i = pos; i < end; i++) {
    crc = (crc >>> 8) ^ t[(crc ^ buf[i]) & 0xFF];
  }

  return (crc ^ (-1)); // >>> 0;
}


module.exports = crc32;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



function ZStream() {
  /* next input byte */
  this.input = null; // JS specific, because we have no pointers
  this.next_in = 0;
  /* number of bytes available at input */
  this.avail_in = 0;
  /* total number of input bytes read so far */
  this.total_in = 0;
  /* next output byte should be put there */
  this.output = null; // JS specific, because we have no pointers
  this.next_out = 0;
  /* remaining free space at output */
  this.avail_out = 0;
  /* total number of bytes output so far */
  this.total_out = 0;
  /* last error message, NULL if no error */
  this.msg = ''/*Z_NULL*/;
  /* not visible by applications */
  this.state = null;
  /* best guess about the data type: binary or text */
  this.data_type = 2/*Z_UNKNOWN*/;
  /* adler32 value of the uncompressed data */
  this.adler = 0;
}

module.exports = ZStream;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports.fourierTransform = __webpack_require__(98);
module.exports.zeroFilling = __webpack_require__(101);
module.exports.apodization = __webpack_require__(96);
module.exports.phaseCorrection = __webpack_require__(99);
module.exports.digitalFilter = __webpack_require__(97);


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



var diagonalError = 0.05;
var	tolerance = 0.05;

module.exports = {

    clean: function (peaks, threshold) {
        var max = Number.NEGATIVE_INFINITY;
        var i;
        //double min = Double.MAX_VALUE;
        for (i = peaks.length - 1; i >= 0; i--) {
            if (Math.abs(peaks[i].z) > max) {
                max = Math.abs(peaks[i].z);
            }
        }
        max *= threshold;
        for (i = peaks.length - 1; i >= 0; i--) {
            if (Math.abs(peaks[i].z) < max) {
                peaks.splice(i, 1);
            }
        }
        return peaks;
    },

    enhanceSymmetry: function (signals) {

        var properties = initializeProperties(signals);
        var output = signals;

		//First step of the optimization: Symmetry validation
        var i, hits, index;
        var signal;
        for (i = output.length - 1; i >= 0; i--) {
            signal = output[i];
            if (signal.peaks.length > 1)				{
                properties[i][1]++;
            }
            if (properties[i][0] === 1) {
                index = exist(output, properties, signal, -1, true);
                if (index >= 0) {
                    properties[i][1] += 2;
                    properties[index][1] += 2;
                }
            }
        }
		//Second step of the optimization: Diagonal image existence
        for (i = output.length - 1; i >= 0; i--) {
            signal = output[i];
            if (properties[i][0] === 0) {
                hits = checkCrossPeaks(output, properties, signal, true);
                properties[i][1] += hits;
				//checkCrossPeaks(output, properties, signal, false);
            }
        }

		//Now, each peak have a score between 0 and 4, we can complete the patterns which
		//contains peaks with high scores, and finally, we can remove peaks with scores 0 and 1
        var count = 0;
        for (i = output.length - 1; i >= 0; i--) {
            if (properties[i][0] !== 0 && properties[i][1] > 2) {
                count++;
                count += completeMissingIfNeeded(output, properties, output[i], properties[i]);
            }
            if (properties[i][1] >= 2 && properties[i][0] === 0)				{
                count++;
            }
        }

        var toReturn = new Array(count);
        count--;
        for (i = output.length - 1; i >= 0; i--) {
            if (properties[i][0] !== 0 && properties[i][1] > 2
					|| properties[i][0] === 0 && properties[i][1] > 1) {
                toReturn[count--] = output[i];
            }
        }
        return toReturn;
    },

    /**
     * This function maps the corresponding 2D signals to the given set of 1D signals
     * @param {Array} signals2D
     * @param {Array} references
     */
    alignDimensions: function (signals2D, references) {
		//For each reference dimension
        for (var i = 0; i < references.length; i++) {
            var ref = references[i];
            if (ref)				{
                alignSingleDimension(signals2D, ref);
            }
        }
    }
};

function completeMissingIfNeeded(output, properties, thisSignal, thisProp) {
	//Check for symmetry
    var index = exist(output, properties, thisSignal, -thisProp[0], true);
    var addedPeaks = 0;
    var newSignal = null, tmpProp = null;
    if (index < 0) {//If this signal have no a symmetry image, we have to include it
        newSignal = {nucleusX: thisSignal.nucleusX, nucleusY: thisSignal.nucleusY};
        newSignal.resolutionX = thisSignal.resolutionX;
        newSignal.resolutionY = thisSignal.resolutionY;
        newSignal.shiftX = thisSignal.shiftY;
        newSignal.shiftY = thisSignal.shiftX;
        newSignal.peaks = [{x: thisSignal.shiftY, y: thisSignal.shiftX, z: 1}];
        output.push(newSignal);
        tmpProp = [-thisProp[0], thisProp[1]];
        properties.push(tmpProp);
        addedPeaks++;
    }
	//Check for diagonal peaks
    var j = 0;
    var diagX = false, diagY = false;
    var signal;
    for (j = output.length - 1; j >= 0; j--) {
        signal = output[j];
        if (properties[j][0] === 0) {
            if (Math.abs(signal.shiftX - thisSignal.shiftX) < diagonalError)				{
                diagX = true;
            }
            if (Math.abs(signal.shiftY - thisSignal.shiftY) < diagonalError)				{
                diagY = true;
            }
        }
    }
    if (diagX === false) {
        newSignal = {nucleusX: thisSignal.nucleusX, nucleusY: thisSignal.nucleusY};
        newSignal.resolutionX = thisSignal.resolutionX;
        newSignal.resolutionY = thisSignal.resolutionY;
        newSignal.shiftX = thisSignal.shiftX;
        newSignal.shiftY = thisSignal.shiftX;
        newSignal.peaks = [{x: thisSignal.shiftX, y: thisSignal.shiftX, z: 1}];
        output.push(newSignal);
        tmpProp = [0, thisProp[1]];
        properties.push(tmpProp);
        addedPeaks++;
    }
    if (diagY === false) {
        newSignal = {nucleusX: thisSignal.nucleusX, nucleusY: thisSignal.nucleusY};
        newSignal.resolutionX = thisSignal.resolutionX;
        newSignal.resolutionY = thisSignal.resolutionY;
        newSignal.shiftX = thisSignal.shiftY;
        newSignal.shiftY = thisSignal.shiftY;
        newSignal.peaks = [{x: thisSignal.shiftY, y: thisSignal.shiftY, z: 1}];
        output.push(newSignal);
        tmpProp = [0, thisProp[1]];
        properties.push(tmpProp);
        addedPeaks++;
    }
    return addedPeaks;

}

//Check for any diagonal peak that match this cross peak
function checkCrossPeaks(output, properties, signal, updateProperties) {
    var hits = 0, i = 0, shift = signal.shiftX * 4;
    var crossPeaksX = [], crossPeaksY = [];
    var cross;
    for (i = output.length - 1; i >= 0; i--) {
        cross = output[i];
        if (properties[i][0] !== 0) {
            if (Math.abs(cross.shiftX - signal.shiftX) < diagonalError) {
                hits++;
                if (updateProperties)					{
                    properties[i][1]++;
                }
                crossPeaksX.push(i);
                shift += cross.shiftX;
            } else {
                if (Math.abs(cross.shiftY - signal.shiftY) < diagonalError) {
                    hits++;
                    if (updateProperties)						{
                        properties[i][1]++;
                    }
                    crossPeaksY.push(i);
                    shift += cross.shiftY;
                }
            }
        }
    }
	//Update found crossPeaks and diagonal peak
    shift /= (crossPeaksX.length + crossPeaksY.length + 4);
    if (crossPeaksX.length > 0) {
        for (i = crossPeaksX.length - 1; i >= 0; i--) {
            output[crossPeaksX[i]].shiftX = shift;
        }
    }
    if (crossPeaksY.length > 0) {
        for (i = crossPeaksY.length - 1; i >= 0; i--) {
            output[crossPeaksY[i]].shiftY = shift;
        }
    }
    signal.shiftX = shift;
    signal.shiftY = shift;
    return hits;
}

function exist(output, properties, signal, type, symmetricSearch) {
    for (var i = output.length - 1; i >= 0; i--) {
        if (properties[i][0] === type) {
            if (distanceTo(signal, output[i], symmetricSearch) < tolerance) {
                if (!symmetricSearch) {
                    let shiftX = (output[i].shiftX + signal.shiftX) / 2.0;
                    let shiftY = (output[i].shiftY + signal.shiftY) / 2.0;
                    output[i].shiftX = shiftX;
                    output[i].shiftY = shiftY;
                    signal.shiftX = shiftX;
                    signal.shiftY = shiftY;
                } else {
                    let shiftX = signal.shiftX;
                    let shiftY = output[i].shiftX;
                    output[i].shiftY = shiftX;
                    signal.shiftY = shiftY;
                }
                return i;
            }
        }
    }
    return -1;
}
/**
 * We try to determine the position of each signal within the spectrum matrix.
 * Peaks could be of 3 types: upper diagonal, diagonal or under diagonal 1,0,-1
 * respectively.
 * @param {Array} signals
 * @return {*} A matrix containing the properties of each signal
 * @private
 */
function initializeProperties(signals) {
    var signalsProperties = new Array(signals.length);
    for (var i = signals.length - 1; i >= 0; i--) {
        signalsProperties[i] = [0, 0];
		//We check if it is a diagonal peak
        if (Math.abs(signals[i].shiftX - signals[i].shiftY) <= diagonalError) {
            signalsProperties[i][1] = 1;
			//We adjust the x and y value to be symmetric.
			//In general chemical shift in the direct dimension is better than in the other one,
			//so, we believe more to the shiftX than to the shiftY.
            var shift = (signals[i].shiftX * 2 + signals[i].shiftY) / 3.0;
            signals[i].shiftX = shift;
            signals[i].shiftY = shift;
        } else {
            if (signals[i].shiftX - signals[i].shiftY > 0)				{
                signalsProperties[i][0] = 1;
            } else				{
                signalsProperties[i][0] = -1;
            }
        }
    }
    return signalsProperties;
}

/**
 * This function calculates the distance between 2 nmr signals . If toImage is true,
 * it will interchange x by y in the distance calculation for the second signal.
 * @param {object} a
 * @param {object} b
 * @param {boolean} toImage
 * @return {number}
 * @private
 */
function distanceTo(a, b, toImage) {
    if (!toImage) {
        return Math.sqrt(Math.pow(a.shiftX - b.shiftX, 2)
			+ Math.pow(a.shiftY - b.shiftY, 2));
    } else {
        return Math.sqrt(Math.pow(a.shiftX - b.shiftY, 2)
			+ Math.pow(a.shiftY - b.shiftX, 2));
    }
}

function alignSingleDimension(signals2D, references) {
	//For each 2D signal
    var center = 0, width = 0, i, j;
    for (i = 0; i < signals2D.length; i++) {
        var signal2D = signals2D[i];
		//For each reference 1D signal
        for (j = 0; j < references.length; j++) {
            center = (references[j].startX + references[j].stopX) / 2;
            width = Math.abs(references[j].startX - references[j].stopX) / 2;
            if (signal2D.nucleusX === references[j].nucleus) {
				//The 2D peak overlaps with the 1D signal
                if (Math.abs(signal2D.shiftX - center) <= width) {
                    signal2D._highlight.push(references[j]._highlight[0]);
                }

            }
            if (signal2D.nucleusY === references[j].nucleus) {
                if (Math.abs(signal2D.shiftY - center) <= width) {
                    signal2D._highlight.push(references[j]._highlight[0]);
                }
            }
        }

    }
}


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Implementation of the peak picking method described by Cobas in:
 * A new approach to improving automated analysis of proton NMR spectra
 * through Global Spectral Deconvolution (GSD)
 * http://www.spectroscopyeurope.com/images/stories/ColumnPDFs/TD_23_1.pdf
 * @param {SD} spectrum - SD instance
 * @param {Object} peakList - nmr signals
 * @param {Object} options - options object with some parameter for GSD
 * @param {boolean} [options.clean = true] - If true remove all the signals with integral < 0.5
 * @param {number} [options.minMaxRatio = 0.01] - Threshold to determine if a given peak should be considered as a noise, bases on its relative height compared to the highest peak.
 * @param {number} [options.broadRatio = 0.00025] - If broadRatio is higher than 0, then all the peaks which second derivative smaller than broadRatio * maxAbsSecondDerivative will be marked with the soft mask equal to true.
 * @param {boolean} [options.smoothY = true] - Select the peak intensities from a smoothed version of the independent variables?
 * @param {number} [options.nL = 4] - factor to determine the width at the moment to group the peaks in signals in 'GSD.optimizePeaks' function.
 * @param {boolean} [options.optimize = true] - if it's true adjust an train of gaussian or lorentzian shapes to spectrum.
 * @param {string} [options.functionType = 'gaussian'] - This option allows us choose between 'gaussian' or 'lorentzian' function when options.optimize is true.
 * @param {number} [options.broadWidth = 0.25] - Threshold to determine if some peak is candidate to clustering into range.
 * @returns {Array}
 */
const GSD = __webpack_require__(64);
//var extend = require("extend");
//var removeImpurities = require('./ImpurityRemover');

const defaultOptions = {

    thresholdFactor: 1,
    optimize: false,
    minMaxRatio: 0.01,
    broadRatio: 0.00025,
    smoothY: true,
    nL: 4,
    functionType: 'gaussian',
    broadWidth: 0.25,
    sgOptions: {windowSize: 9, polynomial: 3}
};


function extractPeaks(spectrum, optionsEx) {
    var options = Object.assign({}, defaultOptions, optionsEx);
    var noiseLevel = Math.abs(spectrum.getNoiseLevel()) * (options.thresholdFactor);
    var data = spectrum.getXYData();

    if (options.from && options.to) {
        data = spectrum.getVector(options.from, options.to);
    }

    var peakList = GSD.gsd(data[0], data[1], options);

    if (options.broadWidth) {
        peakList = GSD.post.joinBroadPeaks(peakList, {width: options.broadWidth});
    }

    if (options.optimize) {
        peakList = GSD.post.optimizePeaks(peakList, data[0], data[1], options.nL, options.functionType);
    }

    return clearList(peakList, noiseLevel);
}

/**
 * this function remove the peaks with an intensity lower to threshold
 * @param {object} peakList - peaks
 * @param {number} threshold
 * @returns {object} the clean peakList
 * @private
 */
function clearList(peakList, threshold) {
    for (var i = peakList.length - 1; i >= 0; i--) {
        if (Math.abs(peakList[i].y) < threshold) {
            peakList.splice(i, 1);
        }
    }
    return peakList;
}

module.exports = extractPeaks;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const SD = __webpack_require__(6);
const Filters = __webpack_require__(37);
const Brukerconverter = __webpack_require__(14);
const peaks2Ranges = __webpack_require__(106);
// const NmrPredictor = require('nmr-predictor');
// const simulator = require('nmr-simulation');

/**
 * @class NMR
 * @extends SD
 */
class NMR extends SD {

    constructor(sd) {
        super(sd);
        // TODO: add stuff specific to NMR
    }

    /**
     * This function return a SD instance computed with nmr chemical shift predictor "spinus" from molfile.
     * @param {string} molfile - molfile to generate the spin system and compute the spectrum
     * @param {object} options - parameters for simulation of spectrum
     * @return {NMR} SD instante.
     */

    static fromMolfile(molfile, options) {
        // let opt = Object.assign({}, {title: 'Simulated spectrum', nucleus: '1H'}, options);
        // const predictor = new NmrPredictor('spinus');
        // return predictor.predict(molfile, {group: false, atomLabel: opt.nucleus.replace(/[0-9]*/g,'')}).then(prediction => {
        //     const spinSystem = simulator.SpinSystem.fromPrediction(prediction);
        //     opt.output = 'xy';
        //     var simulation = simulator.simulate1D(spinSystem, opt);
        //     return NMR.fromXY(simulation.x, simulation.y, opt);
        // });
    }

    /**
     * This function create a SD instance from xy data
     * @param {Array} x - X data.
     * @param {Array} y - Y data.
     * @param {object} options - Optional parameters
     * @return {NMR} SD instance from x and y data
     */
    static fromXY(x, y, options) {
        var result = {};
        result.profiling = [];
        result.logs = [];
        var spectra = [];
        result.spectra = spectra;
        result.info = {};
        var spectrum = {};
        spectrum.isXYdata = true;
        spectrum.nbPoints = x.length;
        spectrum.firstX = x[0];
        spectrum.firstY = y[0];
        spectrum.lastX = x[spectrum.nbPoints - 1];
        spectrum.lastY = y[spectrum.nbPoints - 1];
        spectrum.xFactor = 1;
        spectrum.yFactor = 1;
        spectrum.xUnit = options.xUnit || 'PPM';
        spectrum.yUnit = options.yUnit || 'Intensity';
        spectrum.deltaX = (spectrum.lastX - spectrum.firstX) / (spectrum.nbPoints - 1);
        spectrum.title = options.title || 'spectra-data from xy';
        spectrum.dataType = options.dataType || 'NMR';
        spectrum.observeFrequency = options.frequency || 400;
        result.info.observefrequency = spectrum.observeFrequency;
        result.info['.SOLVENTNAME'] = options.solvent || 'none';
        result.info['$SW_h'] = Math.abs(spectrum.lastX - spectrum.firstX) * spectrum.observeFrequency;
        result.info['$SW'] = Math.abs(spectrum.lastX - spectrum.firstX);
        result.info['$TD'] = spectrum.nbPoints;
        result.xType = options.nucleus || '1H';
        spectrum.data = [{x: x, y: y}];
        result.twoD = false;
        spectra.push(spectrum);
        return new NMR(result);
    }

    /**
     * This function returns a NMR instance from Array of folders or zip file with folders
     * @param {Array | zipFile} brukerFile - spectra data in two possible input
     * @param {object} options - the options dependent on brukerFile input, but some parameter are permanents like:
     * @option {boolean} xy - The spectraData should not be a oneD array but an object with x and y
     * @option {boolean} keepSpectra - keep the spectra in 2D NMR instance
     * @option {boolean} noContours - option to generate not generate countour plot for 2Dnmr spectra
     * @option {string} keepRecordsRegExp - regular expressions to parse data
     * @return {*}
     */
    static fromBruker(brukerFile, options) {
        options = Object.assign({}, {xy: true, keepSpectra: true, keepRecordsRegExp: /^.+$/}, options);
        var brukerSpectra = null;
        if (Array.isArray(brukerFile)) {
            //It is a folder
            brukerSpectra = Brukerconverter.converFolder(brukerFile, options);
        } else {
            //It is a zip
            brukerSpectra = Brukerconverter.convertZip(brukerFile, options);
        }
        if (brukerSpectra) {
            return brukerSpectra.map(function (spectrum) {
                return new NMR(spectrum);
            });
        }
        return null;
    }

    /**
     * @private
     * Returns the observed nucleus. A dimension parameter is accepted for compatibility with 2DNMR
     * @param {number} dim
     * @return {string}
     */
    getNucleus(dim) {
        if (!dim || dim === 0 || dim === 1) {
            return this.sd.xType;
        } else {
            return '';
        }
    }

    /**
     * @private
     * Returns the solvent name.
     * @return {string|XML}
     */
    getSolventName() {
        return (this.sd.info['.SOLVENTNAME'] || this.sd.info.$SOLVENT || '').replace('<', '').replace('>', '');
    }

    /**
     * @private
     * Returns the observe frequency in the direct dimension
     * @return {number}
     */
    observeFrequencyX() {
        return this.sd.spectra[0].observeFrequency;
    }

    /**
     * @private
     * Returns the noise factor depending on the nucleus.
     * @param {string} nucleus
     * @return {number}
     */
    getNMRPeakThreshold(nucleus) {
        if (nucleus === '1H') {
            return 3.0;
        }
        if (nucleus === '13C') {
            return 5.0;
        }
        return 1.0;
    }


    /**
     * This function adds white noise to the the given spectraData. The intensity of the noise is
     * calculated from the given signal to noise ratio.
     * @param SNR Signal to noise ratio
     * @return {NMR} this object
     */
    /*addNoise(SNR) {
        //@TODO Implement addNoise filter
    }*/


    /**
     *  This filter performs a linear combination of two spectraDatas.
     * A=spec1
     * B=spec2
     * After to apply this filter you will get:
     *      A=A*factor1+B*factor2
     * if autoscale is set to 'true' then you will obtain:
     *  A=A*factor1+B*k*factor2
     * Where the k is a factor such that the maximum peak in A is equal to the maximum peak in spectraData2
     * @param spec2 spectraData2
     * @param factor1 linear factor for spec1
     * @param factor2 linear factor for spec2
     * @param autoscale Auto-adjust scales before combine the spectraDatas
     * @return {NMR} this object
     * @example spec1 = addSpectraDatas(spec1,spec2,1,-1, false) This subtract spec2 from spec1
     */
    /*addSpectraDatas(spec2, factor1, factor2, autoscale) {
        //@TODO Implement addSpectraDatas filter

    }*/

    /**
     * Automatically corrects the base line of a given spectraData. After this process the spectraData
     * should have meaningful integrals.
     * @return {NMR} this object
     */
    /*autoBaseline() {
        //@TODO Implement autoBaseline filter
    }*/

    /**
     * Fourier transforms the given spectraData (Note. no 2D handling yet) this spectraData have to be
     * of type NMR_FID or 2DNMR_FID
     * @return {NMR} this object
     */
    fourierTransform() {
        return Filters.fourierTransform(this);
    }

    /**
     * This filter makes an phase 1 correction that corrects the problem of the spectra that has been obtained
     * on spectrometers using the Bruker digital filters. This method is used in cases when the BrukerSpectra
     * filter could not find the correct number of points to perform a circular shift.
     * The actual problem is that not all of the spectra has the necessary parameters for use only one method for
     * correcting the problem of the Bruker digital filters.
     * @param {number} ph1corr - Phase 1 correction value in radians.
     * @return {NMR} this object
     */
    postFourierTransform(ph1corr) {
        return Filters.phaseCorrection(0, ph1corr);
    }

    /**
     * This function increase the size of the spectrum, filling the new positions with zero values. Doing it one
     * could increase artificially the spectral resolution.
     * @param {number} nPointsX - Number of new zero points in the direct dimension
     * @param {number} nPointsY - Number of new zero points in the indirect dimension
     * @return {NMR} this object
     */
    zeroFilling(nPointsX, nPointsY) {
        return Filters.zeroFilling(this, nPointsX, nPointsY);
    }

    /**
     * Applies a baseline correction as described in J Magn Resonance 183 (2006) 145-151 10.1016/j.jmr.2006.07.013
     * The needed parameters are the wavelet scale and the lambda used in the whittaker smoother.
     * @param waveletScale To be described
     * @param whittakerLambda To be described
     * @return {NMR} this object
     */
    /*haarWhittakerBaselineCorrection(waveletScale, whittakerLambda) {
        //@TODO Implement haarWhittakerBaselineCorrection filter
    }*/

    /**
     * Applies a baseline correction as described in J Magn Resonance 183 (2006) 145-151 10.1016/j.jmr.2006.07.013
     * The needed parameters are the Wavelet scale and the lambda used in the Whittaker smoother.
     * @param waveletScale To be described
     * @param whittakerLambda To be described
     * @param ranges A string containing the ranges of no signal.
     * @return {NMR} this object
     */
    /*whittakerBaselineCorrection(whittakerLambda, ranges) {
        //@TODO Implement whittakerBaselineCorrection filter
    }*/

    /**
     * This filter applies a circular shift(phase 1 correction in the time domain) to an NMR FID spectrum that
     * have been obtained on spectrometers using the Bruker digital filters. The amount of shift depends on the
     * parameters DECIM and DSPFVS. This spectraData have to be of type NMR_FID
     * @return {NMR} this object
     */
    brukerFilter() {
        return Filters.digitalFilter(this, {'brukerFilter': true});
    }

    /**
     * This filter applies a circular shift(phase 1 correction in the time domain) to an NMR FID spectrum that
     * have been obtained on spectrometers using the Bruker digital filters. The amount of shift depends on the
     * parameters DECIM and DSPFVS. This spectraData have to be of type NMR_FID
     * @param {object} options ->
     * nbPoints: The number of points to shift. Positive values will shift the values to the rigth
     * and negative values will do to the left.
     * @return {NMR} this object
     */
    digitalFilter(options) {
        return Filters.digitalFilter(this, options);
    }

    /**
     * Apodization of a spectraData object that should be of type NMR_FID.
     * @param {string} functionName - Valid values for functionsName are
     *  Exponential, exp
     *  Hamming, hamming
     *  Gaussian, gauss
     *  TRAF, traf
     *  Sine Bell, sb
     *  Sine Bell Squared, sb2
     * @param {number} lineBroadening - The parameter LB should either be a line broadening factor in Hz
     * or alternatively an angle given by degrees for sine bell functions and the like.
     * @example SD.apodization('exp', lineBroadening)
     * @return {NMR} this object
     */
    apodization(functionName, lineBroadening) {
        return Filters.apodization(this, {'functionName': functionName,
            'lineBroadening': lineBroadening});

    }

    /**
     * That decodes an Echo-Antiecho 2D spectrum.
     * @return {NMR} this object
     */
    echoAntiechoFilter() {
        //@TODO Implement echoAntiechoFilter filter
        return this;
    }

    /**
     * This function apply a Standard Normal Variate Transformation over the given spectraData. Mainly used for IR spectra.
     * @return {NMR} this object
     */
    SNVFilter() {
        //@TODO Implement SNVFilter
        return this;
    }

    /**
     * This function applies a power to all the Y values. If the power is less than 1 and the spectrum has negative values,
     * it will be shifted so that the lowest value is zero
     * @param {number} power - The power value to apply
     * @return {NMR} this object
     */
    powerFilter(power) {
        var minY = this.getMinY();
        if (power < 1 && minY < 0) {
            this.YShift(-1 * minY);
            //console.warn('SD.powerFilter: The spectrum had negative values and was automatically shifted before applying the function.');
        }
        //@TODO Implement powerFilter
        return this;
    }

    /**
     * This function applies a log to all the Y values.<br>If the spectrum has negative or zero values, it will be shifted so that the lowest value is 1
     * @param   base    The base to use
     * @return this object
     */
    /*logarithmFilter(base) {
        var minY = this.getMinY();
        if (minY <= 0) {
            this.yShift((-1 * minY) + 1);
            //console.warn('SD.logarithmFilter: The spectrum had negative values and was automatically shifted before applying the function.');
        }
        //@TODO Implement logarithmFilter filter
    }*/


    /**
     * This function correlates the given spectraData with the given vector func. The correlation
     * operation (*) is defined as:
     *
     *                    __ inf
     *  c(x)=f(x)(*)g(x)= \        f(x)*g(x+i)
     *                   ./
     *                    -- i=-inf
     * @param func A double array containing the function to correlates the spectraData
     * @return this object
     * @example var smoothedSP = SD.correlationFilter(spectraData,[1,1]) returns a smoothed version of the
     * given spectraData.
     */
    /*correlationFilter(func) {
        //@TODO Implement correlationFilter filter
    }*/

    /**
     * Applies the phase correction (phi0,phi1) to a Fourier transformed spectraData. The angles must be given in radians.
     * @param {number} phi0 - the value of Zero order phase correction
     * @param {number} phi1 - the value of first order phase correction
     * @return {NMR}
     */
    phaseCorrection(phi0, phi1) {
        return Filters.phaseCorrection(this, phi0, phi1);
    }

    /**
     * This function determines automatically the correct parameters phi0 and phi1 for a phaseCorrection
     * function and applies it.
     * @return {NMR}
     */
    /*automaticPhase() {
        //@TODO Implement automaticPhase filter
    }*/


    /**
     * This function process the given spectraData and tries to determine the NMR signals. Returns an NMRSignal1D array
     * containing all the detected 1D-NMR Signals
     * @param {object} parameters - A JSONObject containing the optional parameters:
     * @option fromX:   Lower limit.
     * @option toX:     Upper limit.
     * @option threshold: The minimum intensity to consider a peak as a signal, expressed as a percentage of the highest peak.
     * @option stdev: Number of standard deviation of the noise for the threshold calculation if a threshold is not specified.
     * @return {*}
     */
    getRanges(parameters) {
        if (this.ranges) {
            return this.ranges;
        } else {
            var peaks = this.getPeaks(parameters);
            var params = Object.assign({}, {nH: this.totalIntegral}, parameters);
            return peaks2Ranges(this, peaks, params);
        }
    }

    /**
     * This function compute again the process of the given spectraData and tries to determine the NMR signals.
     * Returns an NMRSignal1D array containing all the detected 1D-NMR Signals
     * @param {object} parameters - A JSONObject containing the optional parameters:
     * @option fromX:   Lower limit.
     * @option toX:     Upper limit.
     * @option threshold: The minimum intensity to consider a peak as a signal, expressed as a percentage of the highest peak.
     * @option stdev: Number of standard deviation of the noise for the threshold calculation if a threshold is not specified.
     * @return {null|*}
     */
    createRanges(parameters) {
        this.ranges = null;
        this.peaks = null;
        this.ranges = this.getRanges(parameters);
        return this.ranges;
    }

    /*autoAssignment(options) {

    }*/
}

module.exports = NMR;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const SD = __webpack_require__(6);
const peakPicking2D = __webpack_require__(105);
const PeakOptimizer = __webpack_require__(38);
const Brukerconverter = __webpack_require__(14);
const Filters = __webpack_require__(37);


class NMR2D extends SD {
    constructor(sd) {
        super(sd);
    }

    /**
     * This function return a NMR instance from Array of folders or zip file with folders
     * @param {Array} brukerFile - spectra data in two possible input
     * @param {object} options - the options dependent on brukerFile input, but some parameter are permanents like:
     * @option {boolean} xy - The spectraData should not be a oneD array but an object with x and y
     * @option {boolean} keepSpectra - keep the spectra in 2D NMR instance
     * @option {boolean} noContours - option to generate not generate countour plot for 2Dnmr spectra
     * @option {string} keepRecordsRegExp - regular expressions to parse data
     * @return {*}
     */
    static fromBruker(brukerFile, options) {
        options = Object.assign({}, {xy: true, keepSpectra: true, keepRecordsRegExp: /^.+$/}, options);
        var brukerSpectra = null;
        if (Array.isArray(brukerFile)) {
            //It is a folder
            brukerSpectra = Brukerconverter.converFolder(brukerFile, options);
        } else {
            //It is a zip
            brukerSpectra = Brukerconverter.convertZip(brukerFile, options);
        }
        if (brukerSpectra) {
            return brukerSpectra.map(function (spectrum) {
                return new NMR2D(spectrum);
            });
        }
        return null;
    }

    /**
     * This function creates a 2D spectrum from a matrix containing the independent values of the spectrum and a set
     * of options...
     * @param data
     * @param options
     */
    static fromMatrix(data, options) {
        var result = {};
        result.profiling = [];
        result.logs = [];
        var spectra = [];
        let nbPoints = data[0].length;
        result.spectra = spectra;
        result.info = {};
        let firstY = options.firstY || 0;
        let lastY = options.lastY || data.length - 1;
        let deltaY = (lastY - firstY) / (data.length - 1);

        let firstX = options.firstX || 0;
        let lastX = options.lastX || nbPoints - 1;
        let deltaX = (lastY - firstY) / (nbPoints - 1);
        let x = options.x;
        if(!x) {
            x = new Array(nbPoints);
            for(let i = 0; i < nbPoints; i++) {
                x[i] = firstX + deltaX * i;
            }
        }

        let observeFrequency = options.frequencyX || 400;

        data.forEach((y, index) => {
            var spectrum = {};
            spectrum.isXYdata = true;
            spectrum.nbPoints = nbPoints;
            spectrum.firstX = firstX;
            spectrum.firstY = y[0];
            spectrum.lastX = lastX;
            spectrum.lastY = y[spectrum.nbPoints - 1];
            spectrum.xFactor = 1;
            spectrum.yFactor = 1;
            spectrum.deltaX = (spectrum.lastX - spectrum.firstX) / (spectrum.nbPoints - 1);
            spectrum.title = options.title || 'spectra-data from xy';
            spectrum.dataType = options.dataType || 'nD NMR SPECTRUM';
            spectrum.observeFrequency = observeFrequency;
            spectrum.data = [{x: x, y: y}];
            spectrum.page = firstY + index * deltaY;
            result.xType = options.xType || options.nucleusX || '1H';
            spectra.push(spectrum);
        });

        result.ntuples = [{units: options.xUnit || 'PPM'}, {units: options.yUnit || 'PPM'}, {units: options.zUnit || 'Intensity'}];
        result.info['2D_Y_FREQUENCY'] = options.frequencyY || 400;
        result.info['2D_X_FREQUENCY'] = options.frequencyX || 400;
        result.info['observefrequency'] = result.info['2D_X_FREQUENCY'];
        result.info['$BF1'] = result.info['observefrequency'];
        result.info['.SOLVENTNAME'] = options.solvent || 'none';
        result.info['$SW_h'] = Math.abs(lastX - firstX) * observeFrequency;
        result.info['$SW'] = Math.abs(lastX - firstX);
        result.info['$TD'] = nbPoints;
        result.info['firstY'] = firstY;
        result.info['lastY'] = lastY;
        result.minMax = {
            minY: firstY,
            maxY: lastY,
            minX: firstX,
            maxX: lastX,
            minZ: 0,
            maxZ: 200
        }

        result.yType = options.yType || options.nucleusY || '1H';
        result.twoD = true;
        return new NMR2D(result);
    }
    /**
     * Return true if the it is an homo-nuclear experiment
     * @return {boolean}
     */
    isHomoNuclear() {
        return this.sd.xType === this.sd.yType;
    }

    /**
     * Return the observe frequency in the direct dimension
     * @return {number}
     */
    observeFrequencyX() {
        return this.sd.spectra[0].observeFrequency;
    }
    /**
     * Return the observe frequency in the indirect dimension
     * @return {number}
     */
    observeFrequencyY() {
        return this.sd.indirectFrequency;
    }

    /**
     * Return the solvent name.
     * @return {string|XML}
     */
    getSolventName() {
        return (this.sd.info['.SOLVENTNAME'] || this.sd.info.$SOLVENT).replace('<', '').replace('>', '');
    }

    /**
     * This function Return the units of the direct dimension. It overrides the SD getXUnits function
     * @return {ntuples.units|*|b.units}
     */
    getXUnits() {
        return this.sd.ntuples[1].units;
    }
    /**
     * This function Return the units of the indirect dimension. It overrides the SD getYUnits function
     * @return {ntuples.units|*|b.units}
     */
    getYUnits() {
        return this.sd.ntuples[0].units;
    }
    /**
     * Return the units of the dependent variable
     * @return {ntuples.units|*|b.units}
     */
    getZUnits() {
        return this.sd.ntuples[2].units;
    }
    /**
     * Return the min value in the indirect dimension.
     * @return {sd.minMax.maxY}
     */
    getLastY() {
        return this.sd.minMax.maxY;
    }
    
    
    /**
     * Return the min value in the indirect dimension.
     * @return {sd.minMax.minY}
     */
    getFirstY() {
        return this.sd.minMax.minY;
    }
    /**
     * Return the separation between 2 consecutive points in the indirect domain
     * @return {number}
     */
    getDeltaY() {
        return (this.getLastY() - this.getFirstY()) / (this.getNbSubSpectra() - 1);
    }

    /**
     * Return the minimum value of the independent variable
     * @return {number}
     */
    getMinZ() {
        return this.sd.minMax.minZ;
    }

    /**
     * Return the maximum value of the independent variable
     * @return {number}
     */
    getMaxZ() {
        return this.sd.minMax.maxZ;
    }

    /**
     * This function process the given spectraData and tries to determine the NMR signals.
     * Return an NMRSignal2D array containing all the detected 2D-NMR Signals
     * @param	{object} options - Object containing the options.
     * @option	{number} thresholdFactor - A factor to scale the automatically determined noise threshold.
     * @return  {*}	set of NMRSignal2D.
     */
    getZones(options) {
        options = options || {};
        if (!options.thresholdFactor) {
            options.thresholdFactor = 1;
        }
        var id = Math.round(Math.random() * 255);
        if (options.idPrefix) {
            id = options.idPrefix;
        }
        var peakList = peakPicking2D(this, options.thresholdFactor);

        //lets add an unique ID for each peak.
        for (var i = 0; i < peakList.length; i++) {
            peakList[i]._highlight = [id + '_' + i];
            peakList[i].signalID = id + '_' + i;
        }
        if (options.references) {
            PeakOptimizer.alignDimensions(peakList, options.references);
        }

        if (options.format === 'new') {
            var zones = new Array(peakList.length);
            for (var k = peakList.length - 1; k >= 0; k--) {
                var signal = peakList[k];
                zones[k] = {
                    fromTo: signal.fromTo,
                    integral: signal.intensity || 1,
                    remark: '',
                    signal: [{
                        peak: signal.peaks,
                        delta: [signal.shiftX, signal.shiftY]
                    }],
                    _highlight: signal._highlight,
                    signalID: signal.signalID,
                };
            }
            peakList = zones;
        }

        this.zones = peakList;

        return this.zones;
    }

    /**
     * Return the noise factor depending on the nucleus.
     * @param {string} nucleus
     * @return {number}
     */
    getNMRPeakThreshold(nucleus) {
        if (nucleus === '1H') {
            return 3.0;
        }
        if (nucleus === '13C') {
            return 5.0;
        }
        return 1.0;
    }

    /**
     * Return the observed nucleus in the specified dimension
     * @param {number} dim
     * @return {string}
     */
    getNucleus(dim) {
        if (dim === 1) {
            return this.sd.xType;
        }
        if (dim === 2) {
            return this.sd.yType;
        }
        return this.sd.xType;
    }


    /**
     * This function increase the size of the spectrum, filling the new positions with zero values. Doing it one
     * could increase artificially the spectral resolution.
     * @param {number} nPointsX Number of new zero points in the direct dimension
     * @param {number} nPointsY Number of new zero points in the indirect dimension
     * @return {NMR2D} this object
     */
    zeroFilling(nPointsX, nPointsY) {
        return Filters.zeroFilling(this, nPointsX, nPointsY);
    }

    /**
     * This filter applies a circular shift(phase 1 correction in the time domain) to an NMR FID spectrum that
     * have been obtained on spectrometers using the Bruker digital filters. The amount of shift depends on the
     * parameters DECIM and DSPFVS. This spectraData have to be of type NMR_FID
     * @return {NMR2D} this object
     */
    brukerFilter() {
        return Filters.digitalFilter(this, {'brukerFilter': true});
    }

    /**
     * This filter applies a circular shift(phase 1 correction in the time domain) to an NMR FID spectrum that
     * have been obtained on spectrometers using the Bruker digital filters. The amount of shift depends on the
     * parameters DECIM and DSPFVS. This spectraData have to be of type NMR_FID
     * @param {object} options - some options are availables:
     * @option nbPoints: The number of points to shift. Positive values will shift the values to the rigth
     * and negative values will do to the left.
     * @option brukerSpectra
     * @return {NMR2D} this object
     */
    digitalFilter(options) {
        return Filters.digitalFilter(this, options);
    }


    /**
     * Fourier transforms the given spectraData (Note. no 2D handling yet) this spectraData have to be of type NMR_FID or 2DNMR_FID
     * @return {NMR2D} this object
     */
    fourierTransform() {
        return Filters.fourierTransform(this);
    }

    /**
     * This filter makes an phase 1 correction that corrects the problem of the spectra that has been obtained
     * on spectrometers using the Bruker digital filters. This method is used in cases when the BrukerSpectra
     * filter could not find the correct number of points to perform a circular shift.
     * The actual problem is that not all of the spectra has the necessary parameters for use only one method for
     * correcting the problem of the Bruker digital filters.
     * @param {number} ph1corr - Phase 1 correction value in radians.
     * @return {NMR2D} this object
     */
    postFourierTransform(ph1corr) {
        return Filters.phaseCorrection(0, ph1corr);
    }
}


module.exports = NMR2D;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}


/***/ }),
/* 43 */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const defaultByteLength = 1024 * 8;
const charArray = [];

class IOBuffer {
    constructor(data, options) {
        options = options || {};
        if (data === undefined) {
            data = defaultByteLength;
        }
        if (typeof data === 'number') {
            data = new ArrayBuffer(data);
        }
        let length = data.byteLength;
        const offset = options.offset ? options.offset>>>0 : 0;
        if (data.buffer) {
            length = data.byteLength - offset;
            if (data.byteLength !== data.buffer.byteLength) { // Node.js buffer from pool
                data = data.buffer.slice(data.byteOffset + offset, data.byteOffset + data.byteLength);
            } else if (offset) {
                data = data.buffer.slice(offset);
            } else {
                data = data.buffer;
            }
        }
        this.buffer = data;
        this.length = length;
        this.byteLength = length;
        this.byteOffset = 0;
        this.offset = 0;
        this.littleEndian = true;
        this._data = new DataView(this.buffer);
        this._increment = length || defaultByteLength;
        this._mark = 0;
    }

    available(byteLength) {
        if (byteLength === undefined) byteLength = 1;
        return (this.offset + byteLength) <= this.length;
    }

    isLittleEndian() {
        return this.littleEndian;
    }

    setLittleEndian() {
        this.littleEndian = true;
    }

    isBigEndian() {
        return !this.littleEndian;
    }

    setBigEndian() {
        this.littleEndian = false;
    }

    skip(n) {
        if (n === undefined) n = 1;
        this.offset += n;
    }

    seek(offset) {
        this.offset = offset;
    }

    mark() {
        this._mark = this.offset;
    }

    reset() {
        this.offset = this._mark;
    }

    rewind() {
        this.offset = 0;
    }

    ensureAvailable(byteLength) {
        if (byteLength === undefined) byteLength = 1;
        if (!this.available(byteLength)) {
            const newIncrement = this._increment + this._increment;
            this._increment = newIncrement;
            const newLength = this.length + newIncrement;
            const newArray = new Uint8Array(newLength);
            newArray.set(new Uint8Array(this.buffer));
            this.buffer = newArray.buffer;
            this.length = newLength;
            this._data = new DataView(this.buffer);
        }
    }

    readBoolean() {
        return this.readUint8() !== 0;
    }

    readInt8() {
        return this._data.getInt8(this.offset++);
    }

    readUint8() {
        return this._data.getUint8(this.offset++);
    }

    readByte() {
        return this.readUint8();
    }

    readBytes(n) {
        if (n === undefined) n = 1;
        var bytes = new Uint8Array(n);
        for (var i = 0; i < n; i++) {
            bytes[i] = this.readByte();
        }
        return bytes;
    }

    readInt16() {
        var value = this._data.getInt16(this.offset, this.littleEndian);
        this.offset += 2;
        return value;
    }

    readUint16() {
        var value = this._data.getUint16(this.offset, this.littleEndian);
        this.offset += 2;
        return value;
    }

    readInt32() {
        var value = this._data.getInt32(this.offset, this.littleEndian);
        this.offset += 4;
        return value;
    }

    readUint32() {
        var value = this._data.getUint32(this.offset, this.littleEndian);
        this.offset += 4;
        return value;
    }

    readFloat32() {
        var value = this._data.getFloat32(this.offset, this.littleEndian);
        this.offset += 4;
        return value;
    }

    readFloat64() {
        var value = this._data.getFloat64(this.offset, this.littleEndian);
        this.offset += 8;
        return value;
    }

    readChar() {
        return String.fromCharCode(this.readInt8());
    }

    readChars(n) {
        if (n === undefined) n = 1;
        charArray.length = n;
        for (var i = 0; i < n; i++) {
            charArray[i] = this.readChar();
        }
        return charArray.join('');
    }

    writeBoolean(bool) {
        this.writeUint8(bool ? 0xff : 0x00);
    }

    writeInt8(value) {
        this.ensureAvailable(1);
        this._data.setInt8(this.offset++, value);
    }

    writeUint8(value) {
        this.ensureAvailable(1);
        this._data.setUint8(this.offset++, value);
    }

    writeByte(value) {
        this.writeUint8(value);
    }

    writeBytes(bytes) {
        this.ensureAvailable(bytes.length);
        for (var i = 0; i < bytes.length; i++) {
            this._data.setUint8(this.offset++, bytes[i]);
        }
    }

    writeInt16(value) {
        this.ensureAvailable(2);
        this._data.setInt16(this.offset, value, this.littleEndian);
        this.offset += 2;
    }

    writeUint16(value) {
        this.ensureAvailable(2);
        this._data.setUint16(this.offset, value, this.littleEndian);
        this.offset += 2;
    }

    writeInt32(value) {
        this.ensureAvailable(4);
        this._data.setInt32(this.offset, value, this.littleEndian);
        this.offset += 4;
    }

    writeUint32(value) {
        this.ensureAvailable(4);
        this._data.setUint32(this.offset, value, this.littleEndian);
        this.offset += 4;
    }

    writeFloat32(value) {
        this.ensureAvailable(4);
        this._data.setFloat32(this.offset, value, this.littleEndian);
        this.offset += 4;
    }

    writeFloat64(value) {
        this.ensureAvailable(8);
        this._data.setFloat64(this.offset, value, this.littleEndian);
        this.offset += 8;
    }

    writeChar(str) {
        this.writeUint8(str.charCodeAt(0));
    }

    writeChars(str) {
        for (var i = 0; i < str.length; i++) {
            this.writeUint8(str.charCodeAt(i));
        }
    }

    toArray() {
        return new Uint8Array(this.buffer, 0, this.offset);
    }
}

module.exports = IOBuffer;


/***/ }),
/* 45 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



var xyDataSplitRegExp = /[,\t \+-]*(?=[^\d,\t \.])|[ \t]+(?=[\d+\.-])/;
var removeCommentRegExp = /\$\$.*/;
var DEBUG=false;

module.exports=function(spectrum, value, result) {
    // we check if deltaX is defined otherwise we calculate it
    if (!spectrum.deltaX) {
        spectrum.deltaX = (spectrum.lastX - spectrum.firstX) / (spectrum.nbPoints - 1);
    }

    spectrum.isXYdata=true;

    var currentData = [];
    var currentPosition=0;
    spectrum.data = [currentData];

    var currentX = spectrum.firstX;
    var currentY = spectrum.firstY;
    var lines = value.split(/[\r\n]+/);
    var lastDif, values, ascii, expectedY;
    values = [];
    for (var i = 1, ii = lines.length; i < ii; i++) {
        //var previousValues=JSON.parse(JSON.stringify(values));
        values = lines[i].trim().replace(removeCommentRegExp, '').split(xyDataSplitRegExp);
        if (values.length > 0) {
            if (DEBUG) {
                if (!spectrum.firstPoint) {
                    spectrum.firstPoint = +values[0];
                }
                var expectedCurrentX = (values[0] - spectrum.firstPoint) * spectrum.xFactor + spectrum.firstX;
                if ((lastDif || lastDif === 0)) {
                    expectedCurrentX += spectrum.deltaX;
                }
                result.logs.push('Checking X value: currentX: ' + currentX + ' - expectedCurrentX: ' + expectedCurrentX);
            }
            for (var j = 1, jj = values.length; j < jj; j++) {
                if (j === 1 && (lastDif || lastDif === 0)) {
                    lastDif = null; // at the beginning of each line there should be the full value X / Y so the diff is always undefined
                    // we could check if we have the expected Y value
                    ascii = values[j].charCodeAt(0);

                    if (false) { // this code is just to check the jcamp DIFDUP and the next line repeat of Y value
                        // + - . 0 1 2 3 4 5 6 7 8 9
                        if ((ascii === 43) || (ascii === 45) || (ascii === 46) || ((ascii > 47) && (ascii < 58))) {
                            expectedY = +values[j];
                        } else
                        // positive SQZ digits @ A B C D E F G H I (ascii 64-73)
                        if ((ascii > 63) && (ascii < 74)) {
                            expectedY = +(String.fromCharCode(ascii - 16) + values[j].substring(1));
                        } else
                        // negative SQZ digits a b c d e f g h i (ascii 97-105)
                        if ((ascii > 96) && (ascii < 106)) {
                            expectedY = -(String.fromCharCode(ascii - 48) + values[j].substring(1));
                        }
                        if (expectedY !== currentY) {
                            result.logs.push('Y value check error: Found: ' + expectedY + ' - Current: ' + currentY);
                            result.logs.push('Previous values: ' + previousValues.length);
                            result.logs.push(previousValues);
                        }
                    }
                } else {
                    if (values[j].length > 0) {
                        ascii = values[j].charCodeAt(0);
                        // + - . 0 1 2 3 4 5 6 7 8 9
                        if ((ascii === 43) || (ascii === 45) || (ascii === 46) || ((ascii > 47) && (ascii < 58))) {
                            lastDif = null;
                            currentY = +values[j];
                            // currentData.push(currentX, currentY * spectrum.yFactor);
                            currentData[currentPosition++]=currentX;
                            currentData[currentPosition++]=currentY * spectrum.yFactor;
                            currentX += spectrum.deltaX;
                        } else
                        // positive SQZ digits @ A B C D E F G H I (ascii 64-73)
                        if ((ascii > 63) && (ascii < 74)) {
                            lastDif = null;
                            currentY = +(String.fromCharCode(ascii - 16) + values[j].substring(1));
                            // currentData.push(currentX, currentY * spectrum.yFactor);
                            currentData[currentPosition++] = currentX;
                            currentData[currentPosition++] = currentY * spectrum.yFactor;
                            currentX += spectrum.deltaX;
                        } else
                        // negative SQZ digits a b c d e f g h i (ascii 97-105)
                        if ((ascii > 96) && (ascii < 106)) {
                            lastDif = null;
                            // we can multiply the string by 1 because if may not contain decimal (is this correct ????)
                            currentY = -(String.fromCharCode(ascii - 48) + values[j].substring(1))*1;
                            //currentData.push(currentX, currentY * spectrum.yFactor);
                            currentData[currentPosition++]=currentX;
                            currentData[currentPosition++]=currentY * spectrum.yFactor;
                            currentX += spectrum.deltaX;
                        } else



                        // DUP digits S T U V W X Y Z s (ascii 83-90, 115)
                        if (((ascii > 82) && (ascii < 91)) || (ascii === 115)) {
                            var dup = (String.fromCharCode(ascii - 34) + values[j].substring(1)) - 1;
                            if (ascii === 115) {
                                dup = ('9' + values[j].substring(1)) - 1;
                            }
                            for (var l = 0; l < dup; l++) {
                                if (lastDif) {
                                    currentY = currentY + lastDif;
                                }
                                // currentData.push(currentX, currentY * spectrum.yFactor);
                                currentData[currentPosition++]=currentX;
                                currentData[currentPosition++]=currentY * spectrum.yFactor;
                                currentX += spectrum.deltaX;
                            }
                        } else
                        // positive DIF digits % J K L M N O P Q R (ascii 37, 74-82)
                        if (ascii === 37) {
                            lastDif = +('0' + values[j].substring(1));
                            currentY += lastDif;
                            // currentData.push(currentX, currentY * spectrum.yFactor);
                            currentData[currentPosition++]=currentX;
                            currentData[currentPosition++]=currentY * spectrum.yFactor;
                            currentX += spectrum.deltaX;
                        } else if ((ascii > 73) && (ascii < 83)) {
                            lastDif = (String.fromCharCode(ascii - 25) + values[j].substring(1))*1;
                            currentY += lastDif;
                            // currentData.push(currentX, currentY * spectrum.yFactor);
                            currentData[currentPosition++]=currentX;
                            currentData[currentPosition++]=currentY * spectrum.yFactor;
                            currentX += spectrum.deltaX;
                        } else
                        // negative DIF digits j k l m n o p q r (ascii 106-114)
                        if ((ascii > 105) && (ascii < 115)) {
                            lastDif = -(String.fromCharCode(ascii - 57) + values[j].substring(1))*1;
                            currentY += lastDif;
                            // currentData.push(currentX, currentY * spectrum.yFactor);
                            currentData[currentPosition++]=currentX;
                            currentData[currentPosition++]=currentY * spectrum.yFactor;
                            currentX += spectrum.deltaX;
                        }
                    }
                }
            }
        }
    }
}


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

var table = [
    0x00000000, 0x77073096, 0xEE0E612C, 0x990951BA,
    0x076DC419, 0x706AF48F, 0xE963A535, 0x9E6495A3,
    0x0EDB8832, 0x79DCB8A4, 0xE0D5E91E, 0x97D2D988,
    0x09B64C2B, 0x7EB17CBD, 0xE7B82D07, 0x90BF1D91,
    0x1DB71064, 0x6AB020F2, 0xF3B97148, 0x84BE41DE,
    0x1ADAD47D, 0x6DDDE4EB, 0xF4D4B551, 0x83D385C7,
    0x136C9856, 0x646BA8C0, 0xFD62F97A, 0x8A65C9EC,
    0x14015C4F, 0x63066CD9, 0xFA0F3D63, 0x8D080DF5,
    0x3B6E20C8, 0x4C69105E, 0xD56041E4, 0xA2677172,
    0x3C03E4D1, 0x4B04D447, 0xD20D85FD, 0xA50AB56B,
    0x35B5A8FA, 0x42B2986C, 0xDBBBC9D6, 0xACBCF940,
    0x32D86CE3, 0x45DF5C75, 0xDCD60DCF, 0xABD13D59,
    0x26D930AC, 0x51DE003A, 0xC8D75180, 0xBFD06116,
    0x21B4F4B5, 0x56B3C423, 0xCFBA9599, 0xB8BDA50F,
    0x2802B89E, 0x5F058808, 0xC60CD9B2, 0xB10BE924,
    0x2F6F7C87, 0x58684C11, 0xC1611DAB, 0xB6662D3D,
    0x76DC4190, 0x01DB7106, 0x98D220BC, 0xEFD5102A,
    0x71B18589, 0x06B6B51F, 0x9FBFE4A5, 0xE8B8D433,
    0x7807C9A2, 0x0F00F934, 0x9609A88E, 0xE10E9818,
    0x7F6A0DBB, 0x086D3D2D, 0x91646C97, 0xE6635C01,
    0x6B6B51F4, 0x1C6C6162, 0x856530D8, 0xF262004E,
    0x6C0695ED, 0x1B01A57B, 0x8208F4C1, 0xF50FC457,
    0x65B0D9C6, 0x12B7E950, 0x8BBEB8EA, 0xFCB9887C,
    0x62DD1DDF, 0x15DA2D49, 0x8CD37CF3, 0xFBD44C65,
    0x4DB26158, 0x3AB551CE, 0xA3BC0074, 0xD4BB30E2,
    0x4ADFA541, 0x3DD895D7, 0xA4D1C46D, 0xD3D6F4FB,
    0x4369E96A, 0x346ED9FC, 0xAD678846, 0xDA60B8D0,
    0x44042D73, 0x33031DE5, 0xAA0A4C5F, 0xDD0D7CC9,
    0x5005713C, 0x270241AA, 0xBE0B1010, 0xC90C2086,
    0x5768B525, 0x206F85B3, 0xB966D409, 0xCE61E49F,
    0x5EDEF90E, 0x29D9C998, 0xB0D09822, 0xC7D7A8B4,
    0x59B33D17, 0x2EB40D81, 0xB7BD5C3B, 0xC0BA6CAD,
    0xEDB88320, 0x9ABFB3B6, 0x03B6E20C, 0x74B1D29A,
    0xEAD54739, 0x9DD277AF, 0x04DB2615, 0x73DC1683,
    0xE3630B12, 0x94643B84, 0x0D6D6A3E, 0x7A6A5AA8,
    0xE40ECF0B, 0x9309FF9D, 0x0A00AE27, 0x7D079EB1,
    0xF00F9344, 0x8708A3D2, 0x1E01F268, 0x6906C2FE,
    0xF762575D, 0x806567CB, 0x196C3671, 0x6E6B06E7,
    0xFED41B76, 0x89D32BE0, 0x10DA7A5A, 0x67DD4ACC,
    0xF9B9DF6F, 0x8EBEEFF9, 0x17B7BE43, 0x60B08ED5,
    0xD6D6A3E8, 0xA1D1937E, 0x38D8C2C4, 0x4FDFF252,
    0xD1BB67F1, 0xA6BC5767, 0x3FB506DD, 0x48B2364B,
    0xD80D2BDA, 0xAF0A1B4C, 0x36034AF6, 0x41047A60,
    0xDF60EFC3, 0xA867DF55, 0x316E8EEF, 0x4669BE79,
    0xCB61B38C, 0xBC66831A, 0x256FD2A0, 0x5268E236,
    0xCC0C7795, 0xBB0B4703, 0x220216B9, 0x5505262F,
    0xC5BA3BBE, 0xB2BD0B28, 0x2BB45A92, 0x5CB36A04,
    0xC2D7FFA7, 0xB5D0CF31, 0x2CD99E8B, 0x5BDEAE1D,
    0x9B64C2B0, 0xEC63F226, 0x756AA39C, 0x026D930A,
    0x9C0906A9, 0xEB0E363F, 0x72076785, 0x05005713,
    0x95BF4A82, 0xE2B87A14, 0x7BB12BAE, 0x0CB61B38,
    0x92D28E9B, 0xE5D5BE0D, 0x7CDCEFB7, 0x0BDBDF21,
    0x86D3D2D4, 0xF1D4E242, 0x68DDB3F8, 0x1FDA836E,
    0x81BE16CD, 0xF6B9265B, 0x6FB077E1, 0x18B74777,
    0x88085AE6, 0xFF0F6A70, 0x66063BCA, 0x11010B5C,
    0x8F659EFF, 0xF862AE69, 0x616BFFD3, 0x166CCF45,
    0xA00AE278, 0xD70DD2EE, 0x4E048354, 0x3903B3C2,
    0xA7672661, 0xD06016F7, 0x4969474D, 0x3E6E77DB,
    0xAED16A4A, 0xD9D65ADC, 0x40DF0B66, 0x37D83BF0,
    0xA9BCAE53, 0xDEBB9EC5, 0x47B2CF7F, 0x30B5FFE9,
    0xBDBDF21C, 0xCABAC28A, 0x53B39330, 0x24B4A3A6,
    0xBAD03605, 0xCDD70693, 0x54DE5729, 0x23D967BF,
    0xB3667A2E, 0xC4614AB8, 0x5D681B02, 0x2A6F2B94,
    0xB40BBE37, 0xC30C8EA1, 0x5A05DF1B, 0x2D02EF8D
];

/**
 *
 *  Javascript crc32
 *  http://www.webtoolkit.info/
 *
 */
module.exports = function crc32(input, crc) {
    if (typeof input === "undefined" || !input.length) {
        return 0;
    }

    var isArray = utils.getTypeOf(input) !== "string";

    if (typeof(crc) == "undefined") {
        crc = 0;
    }
    var x = 0;
    var y = 0;
    var b = 0;

    crc = crc ^ (-1);
    for (var i = 0, iTop = input.length; i < iTop; i++) {
        b = isArray ? input[i] : input.charCodeAt(i);
        y = (crc ^ b) & 0xFF;
        x = table[y];
        crc = (crc >>> 8) ^ x;
    }

    return crc ^ (-1);
};
// vim: set shiftwidth=4 softtabstop=4:


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var utils = __webpack_require__(0);

/**
 * @deprecated
 * This function will be removed in a future version without replacement.
 */
exports.string2binary = function(str) {
    return utils.string2binary(str);
};

/**
 * @deprecated
 * This function will be removed in a future version without replacement.
 */
exports.string2Uint8Array = function(str) {
    return utils.transformTo("uint8array", str);
};

/**
 * @deprecated
 * This function will be removed in a future version without replacement.
 */
exports.uint8Array2String = function(array) {
    return utils.transformTo("string", array);
};

/**
 * @deprecated
 * This function will be removed in a future version without replacement.
 */
exports.string2Blob = function(str) {
    var buffer = utils.transformTo("arraybuffer", str);
    return utils.arrayBuffer2Blob(buffer);
};

/**
 * @deprecated
 * This function will be removed in a future version without replacement.
 */
exports.arrayBuffer2Blob = function(buffer) {
    return utils.arrayBuffer2Blob(buffer);
};

/**
 * @deprecated
 * This function will be removed in a future version without replacement.
 */
exports.transformTo = function(outputType, input) {
    return utils.transformTo(outputType, input);
};

/**
 * @deprecated
 * This function will be removed in a future version without replacement.
 */
exports.getTypeOf = function(input) {
    return utils.getTypeOf(input);
};

/**
 * @deprecated
 * This function will be removed in a future version without replacement.
 */
exports.checkSupport = function(type) {
    return utils.checkSupport(type);
};

/**
 * @deprecated
 * This value will be removed in a future version without replacement.
 */
exports.MAX_VALUE_16BITS = utils.MAX_VALUE_16BITS;

/**
 * @deprecated
 * This value will be removed in a future version without replacement.
 */
exports.MAX_VALUE_32BITS = utils.MAX_VALUE_32BITS;


/**
 * @deprecated
 * This function will be removed in a future version without replacement.
 */
exports.pretty = function(str) {
    return utils.pretty(str);
};

/**
 * @deprecated
 * This function will be removed in a future version without replacement.
 */
exports.findCompression = function(compressionMethod) {
    return utils.findCompression(compressionMethod);
};

/**
 * @deprecated
 * This function will be removed in a future version without replacement.
 */
exports.isRegExp = function (object) {
    return utils.isRegExp(object);
};



/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var USE_TYPEDARRAY = (typeof Uint8Array !== 'undefined') && (typeof Uint16Array !== 'undefined') && (typeof Uint32Array !== 'undefined');

var pako = __webpack_require__(85);
exports.uncompressInputType = USE_TYPEDARRAY ? "uint8array" : "array";
exports.compressInputType = USE_TYPEDARRAY ? "uint8array" : "array";

exports.magic = "\x08\x00";
exports.compress = function(input, compressionOptions) {
    return pako.deflateRaw(input, {
        level : compressionOptions.level || -1 // default compression
    });
};
exports.uncompress =  function(input) {
    return pako.inflateRaw(input);
};


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var base64 = __webpack_require__(7);

/**
Usage:
   zip = new JSZip();
   zip.file("hello.txt", "Hello, World!").file("tempfile", "nothing");
   zip.folder("images").file("smile.gif", base64Data, {base64: true});
   zip.file("Xmas.txt", "Ho ho ho !", {date : new Date("December 25, 2007 00:00:01")});
   zip.remove("tempfile");

   base64zip = zip.generate();

**/

/**
 * Representation a of zip file in js
 * @constructor
 * @param {String=|ArrayBuffer=|Uint8Array=} data the data to load, if any (optional).
 * @param {Object=} options the options for creating this objects (optional).
 */
function JSZip(data, options) {
    // if this constructor is used without `new`, it adds `new` before itself:
    if(!(this instanceof JSZip)) return new JSZip(data, options);

    // object containing the files :
    // {
    //   "folder/" : {...},
    //   "folder/data.txt" : {...}
    // }
    this.files = {};

    this.comment = null;

    // Where we are in the hierarchy
    this.root = "";
    if (data) {
        this.load(data, options);
    }
    this.clone = function() {
        var newObj = new JSZip();
        for (var i in this) {
            if (typeof this[i] !== "function") {
                newObj[i] = this[i];
            }
        }
        return newObj;
    };
}
JSZip.prototype = __webpack_require__(10);
JSZip.prototype.load = __webpack_require__(51);
JSZip.support = __webpack_require__(3);
JSZip.defaults = __webpack_require__(21);

/**
 * @deprecated
 * This namespace will be removed in a future version without replacement.
 */
JSZip.utils = __webpack_require__(48);

JSZip.base64 = {
    /**
     * @deprecated
     * This method will be removed in a future version without replacement.
     */
    encode : function(input) {
        return base64.encode(input);
    },
    /**
     * @deprecated
     * This method will be removed in a future version without replacement.
     */
    decode : function(input) {
        return base64.decode(input);
    }
};
JSZip.compressions = __webpack_require__(8);
module.exports = JSZip;


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var base64 = __webpack_require__(7);
var utf8 = __webpack_require__(25);
var utils = __webpack_require__(0);
var ZipEntries = __webpack_require__(55);
module.exports = function(data, options) {
    var files, zipEntries, i, input;
    options = utils.extend(options || {}, {
        base64: false,
        checkCRC32: false,
        optimizedBinaryString : false,
        createFolders: false,
        decodeFileName: utf8.utf8decode
    });
    if (options.base64) {
        data = base64.decode(data);
    }

    zipEntries = new ZipEntries(data, options);
    files = zipEntries.files;
    for (i = 0; i < files.length; i++) {
        input = files[i];
        this.file(input.fileNameStr, input.decompressed, {
            binary: true,
            optimizedBinaryString: true,
            date: input.date,
            dir: input.dir,
            comment : input.fileCommentStr.length ? input.fileCommentStr : null,
            unixPermissions : input.unixPermissions,
            dosPermissions : input.dosPermissions,
            createFolders: options.createFolders
        });
    }
    if (zipEntries.zipComment.length) {
        this.comment = zipEntries.zipComment;
    }

    return this;
};


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Uint8ArrayReader = __webpack_require__(24);

function NodeBufferReader(data) {
    this.data = data;
    this.length = this.data.length;
    this.index = 0;
    this.zero = 0;
}
NodeBufferReader.prototype = new Uint8ArrayReader();

/**
 * @see DataReader.readData
 */
NodeBufferReader.prototype.readData = function(size) {
    this.checkOffset(size);
    var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
    this.index += size;
    return result;
};
module.exports = NodeBufferReader;


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

/**
 * An object to write any content to a string.
 * @constructor
 */
var StringWriter = function() {
    this.data = [];
};
StringWriter.prototype = {
    /**
     * Append any content to the current string.
     * @param {Object} input the content to add.
     */
    append: function(input) {
        input = utils.transformTo("string", input);
        this.data.push(input);
    },
    /**
     * Finalize the construction an return the result.
     * @return {string} the generated string.
     */
    finalize: function() {
        return this.data.join("");
    }
};

module.exports = StringWriter;


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

/**
 * An object to write any content to an Uint8Array.
 * @constructor
 * @param {number} length The length of the array.
 */
var Uint8ArrayWriter = function(length) {
    this.data = new Uint8Array(length);
    this.index = 0;
};
Uint8ArrayWriter.prototype = {
    /**
     * Append any content to the current array.
     * @param {Object} input the content to add.
     */
    append: function(input) {
        if (input.length !== 0) {
            // with an empty Uint8Array, Opera fails with a "Offset larger than array size"
            input = utils.transformTo("uint8array", input);
            this.data.set(input, this.index);
            this.index += input.length;
        }
    },
    /**
     * Finalize the construction an return the result.
     * @return {Uint8Array} the generated array.
     */
    finalize: function() {
        return this.data;
    }
};

module.exports = Uint8ArrayWriter;


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var StringReader = __webpack_require__(23);
var NodeBufferReader = __webpack_require__(52);
var Uint8ArrayReader = __webpack_require__(24);
var ArrayReader = __webpack_require__(18);
var utils = __webpack_require__(0);
var sig = __webpack_require__(22);
var ZipEntry = __webpack_require__(56);
var support = __webpack_require__(3);
var jszipProto = __webpack_require__(10);
//  class ZipEntries {{{
/**
 * All the entries in the zip file.
 * @constructor
 * @param {String|ArrayBuffer|Uint8Array} data the binary stream to load.
 * @param {Object} loadOptions Options for loading the stream.
 */
function ZipEntries(data, loadOptions) {
    this.files = [];
    this.loadOptions = loadOptions;
    if (data) {
        this.load(data);
    }
}
ZipEntries.prototype = {
    /**
     * Check that the reader is on the speficied signature.
     * @param {string} expectedSignature the expected signature.
     * @throws {Error} if it is an other signature.
     */
    checkSignature: function(expectedSignature) {
        var signature = this.reader.readString(4);
        if (signature !== expectedSignature) {
            throw new Error("Corrupted zip or bug : unexpected signature " + "(" + utils.pretty(signature) + ", expected " + utils.pretty(expectedSignature) + ")");
        }
    },
    /**
     * Check if the given signature is at the given index.
     * @param {number} askedIndex the index to check.
     * @param {string} expectedSignature the signature to expect.
     * @return {boolean} true if the signature is here, false otherwise.
     */
    isSignature: function(askedIndex, expectedSignature) {
        var currentIndex = this.reader.index;
        this.reader.setIndex(askedIndex);
        var signature = this.reader.readString(4);
        var result = signature === expectedSignature;
        this.reader.setIndex(currentIndex);
        return result;
    },
    /**
     * Read the end of the central directory.
     */
    readBlockEndOfCentral: function() {
        this.diskNumber = this.reader.readInt(2);
        this.diskWithCentralDirStart = this.reader.readInt(2);
        this.centralDirRecordsOnThisDisk = this.reader.readInt(2);
        this.centralDirRecords = this.reader.readInt(2);
        this.centralDirSize = this.reader.readInt(4);
        this.centralDirOffset = this.reader.readInt(4);

        this.zipCommentLength = this.reader.readInt(2);
        // warning : the encoding depends of the system locale
        // On a linux machine with LANG=en_US.utf8, this field is utf8 encoded.
        // On a windows machine, this field is encoded with the localized windows code page.
        var zipComment = this.reader.readData(this.zipCommentLength);
        var decodeParamType = support.uint8array ? "uint8array" : "array";
        // To get consistent behavior with the generation part, we will assume that
        // this is utf8 encoded unless specified otherwise.
        var decodeContent = utils.transformTo(decodeParamType, zipComment);
        this.zipComment = this.loadOptions.decodeFileName(decodeContent);
    },
    /**
     * Read the end of the Zip 64 central directory.
     * Not merged with the method readEndOfCentral :
     * The end of central can coexist with its Zip64 brother,
     * I don't want to read the wrong number of bytes !
     */
    readBlockZip64EndOfCentral: function() {
        this.zip64EndOfCentralSize = this.reader.readInt(8);
        this.versionMadeBy = this.reader.readString(2);
        this.versionNeeded = this.reader.readInt(2);
        this.diskNumber = this.reader.readInt(4);
        this.diskWithCentralDirStart = this.reader.readInt(4);
        this.centralDirRecordsOnThisDisk = this.reader.readInt(8);
        this.centralDirRecords = this.reader.readInt(8);
        this.centralDirSize = this.reader.readInt(8);
        this.centralDirOffset = this.reader.readInt(8);

        this.zip64ExtensibleData = {};
        var extraDataSize = this.zip64EndOfCentralSize - 44,
            index = 0,
            extraFieldId,
            extraFieldLength,
            extraFieldValue;
        while (index < extraDataSize) {
            extraFieldId = this.reader.readInt(2);
            extraFieldLength = this.reader.readInt(4);
            extraFieldValue = this.reader.readString(extraFieldLength);
            this.zip64ExtensibleData[extraFieldId] = {
                id: extraFieldId,
                length: extraFieldLength,
                value: extraFieldValue
            };
        }
    },
    /**
     * Read the end of the Zip 64 central directory locator.
     */
    readBlockZip64EndOfCentralLocator: function() {
        this.diskWithZip64CentralDirStart = this.reader.readInt(4);
        this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8);
        this.disksCount = this.reader.readInt(4);
        if (this.disksCount > 1) {
            throw new Error("Multi-volumes zip are not supported");
        }
    },
    /**
     * Read the local files, based on the offset read in the central part.
     */
    readLocalFiles: function() {
        var i, file;
        for (i = 0; i < this.files.length; i++) {
            file = this.files[i];
            this.reader.setIndex(file.localHeaderOffset);
            this.checkSignature(sig.LOCAL_FILE_HEADER);
            file.readLocalPart(this.reader);
            file.handleUTF8();
            file.processAttributes();
        }
    },
    /**
     * Read the central directory.
     */
    readCentralDir: function() {
        var file;

        this.reader.setIndex(this.centralDirOffset);
        while (this.reader.readString(4) === sig.CENTRAL_FILE_HEADER) {
            file = new ZipEntry({
                zip64: this.zip64
            }, this.loadOptions);
            file.readCentralPart(this.reader);
            this.files.push(file);
        }

        if (this.centralDirRecords !== this.files.length) {
            if (this.centralDirRecords !== 0 && this.files.length === 0) {
                // We expected some records but couldn't find ANY.
                // This is really suspicious, as if something went wrong.
                throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
            } else {
                // We found some records but not all.
                // Something is wrong but we got something for the user: no error here.
                // console.warn("expected", this.centralDirRecords, "records in central dir, got", this.files.length);
            }
        }
    },
    /**
     * Read the end of central directory.
     */
    readEndOfCentral: function() {
        var offset = this.reader.lastIndexOfSignature(sig.CENTRAL_DIRECTORY_END);
        if (offset < 0) {
            // Check if the content is a truncated zip or complete garbage.
            // A "LOCAL_FILE_HEADER" is not required at the beginning (auto
            // extractible zip for example) but it can give a good hint.
            // If an ajax request was used without responseType, we will also
            // get unreadable data.
            var isGarbage = !this.isSignature(0, sig.LOCAL_FILE_HEADER);

            if (isGarbage) {
                throw new Error("Can't find end of central directory : is this a zip file ? " +
                                "If it is, see http://stuk.github.io/jszip/documentation/howto/read_zip.html");
            } else {
                throw new Error("Corrupted zip : can't find end of central directory");
            }
        }
        this.reader.setIndex(offset);
        var endOfCentralDirOffset = offset;
        this.checkSignature(sig.CENTRAL_DIRECTORY_END);
        this.readBlockEndOfCentral();


        /* extract from the zip spec :
            4)  If one of the fields in the end of central directory
                record is too small to hold required data, the field
                should be set to -1 (0xFFFF or 0xFFFFFFFF) and the
                ZIP64 format record should be created.
            5)  The end of central directory record and the
                Zip64 end of central directory locator record must
                reside on the same disk when splitting or spanning
                an archive.
         */
        if (this.diskNumber === utils.MAX_VALUE_16BITS || this.diskWithCentralDirStart === utils.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === utils.MAX_VALUE_16BITS || this.centralDirRecords === utils.MAX_VALUE_16BITS || this.centralDirSize === utils.MAX_VALUE_32BITS || this.centralDirOffset === utils.MAX_VALUE_32BITS) {
            this.zip64 = true;

            /*
            Warning : the zip64 extension is supported, but ONLY if the 64bits integer read from
            the zip file can fit into a 32bits integer. This cannot be solved : Javascript represents
            all numbers as 64-bit double precision IEEE 754 floating point numbers.
            So, we have 53bits for integers and bitwise operations treat everything as 32bits.
            see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Operators/Bitwise_Operators
            and http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-262.pdf section 8.5
            */

            // should look for a zip64 EOCD locator
            offset = this.reader.lastIndexOfSignature(sig.ZIP64_CENTRAL_DIRECTORY_LOCATOR);
            if (offset < 0) {
                throw new Error("Corrupted zip : can't find the ZIP64 end of central directory locator");
            }
            this.reader.setIndex(offset);
            this.checkSignature(sig.ZIP64_CENTRAL_DIRECTORY_LOCATOR);
            this.readBlockZip64EndOfCentralLocator();

            // now the zip64 EOCD record
            if (!this.isSignature(this.relativeOffsetEndOfZip64CentralDir, sig.ZIP64_CENTRAL_DIRECTORY_END)) {
                // console.warn("ZIP64 end of central directory not where expected.");
                this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(sig.ZIP64_CENTRAL_DIRECTORY_END);
                if (this.relativeOffsetEndOfZip64CentralDir < 0) {
                    throw new Error("Corrupted zip : can't find the ZIP64 end of central directory");
                }
            }
            this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir);
            this.checkSignature(sig.ZIP64_CENTRAL_DIRECTORY_END);
            this.readBlockZip64EndOfCentral();
        }

        var expectedEndOfCentralDirOffset = this.centralDirOffset + this.centralDirSize;
        if (this.zip64) {
            expectedEndOfCentralDirOffset += 20; // end of central dir 64 locator
            expectedEndOfCentralDirOffset += 12 /* should not include the leading 12 bytes */ + this.zip64EndOfCentralSize;
        }

        var extraBytes = endOfCentralDirOffset - expectedEndOfCentralDirOffset;

        if (extraBytes > 0) {
            // console.warn(extraBytes, "extra bytes at beginning or within zipfile");
            if (this.isSignature(endOfCentralDirOffset, sig.CENTRAL_FILE_HEADER)) {
                // The offsets seem wrong, but we have something at the specified offset.
                // So… we keep it.
            } else {
                // the offset is wrong, update the "zero" of the reader
                // this happens if data has been prepended (crx files for example)
                this.reader.zero = extraBytes;
            }
        } else if (extraBytes < 0) {
            throw new Error("Corrupted zip: missing " + Math.abs(extraBytes) + " bytes.");
        }
    },
    prepareReader: function(data) {
        var type = utils.getTypeOf(data);
        utils.checkSupport(type);
        if (type === "string" && !support.uint8array) {
            this.reader = new StringReader(data, this.loadOptions.optimizedBinaryString);
        }
        else if (type === "nodebuffer") {
            this.reader = new NodeBufferReader(data);
        }
        else if (support.uint8array) {
            this.reader = new Uint8ArrayReader(utils.transformTo("uint8array", data));
        } else if (support.array) {
            this.reader = new ArrayReader(utils.transformTo("array", data));
        } else {
            throw new Error("Unexpected error: unsupported type '" + type + "'");
        }
    },
    /**
     * Read a zip file and create ZipEntries.
     * @param {String|ArrayBuffer|Uint8Array|Buffer} data the binary string representing a zip file.
     */
    load: function(data) {
        this.prepareReader(data);
        this.readEndOfCentral();
        this.readCentralDir();
        this.readLocalFiles();
    }
};
// }}} end of ZipEntries
module.exports = ZipEntries;


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var StringReader = __webpack_require__(23);
var utils = __webpack_require__(0);
var CompressedObject = __webpack_require__(19);
var jszipProto = __webpack_require__(10);
var support = __webpack_require__(3);

var MADE_BY_DOS = 0x00;
var MADE_BY_UNIX = 0x03;

// class ZipEntry {{{
/**
 * An entry in the zip file.
 * @constructor
 * @param {Object} options Options of the current file.
 * @param {Object} loadOptions Options for loading the stream.
 */
function ZipEntry(options, loadOptions) {
    this.options = options;
    this.loadOptions = loadOptions;
}
ZipEntry.prototype = {
    /**
     * say if the file is encrypted.
     * @return {boolean} true if the file is encrypted, false otherwise.
     */
    isEncrypted: function() {
        // bit 1 is set
        return (this.bitFlag & 0x0001) === 0x0001;
    },
    /**
     * say if the file has utf-8 filename/comment.
     * @return {boolean} true if the filename/comment is in utf-8, false otherwise.
     */
    useUTF8: function() {
        // bit 11 is set
        return (this.bitFlag & 0x0800) === 0x0800;
    },
    /**
     * Prepare the function used to generate the compressed content from this ZipFile.
     * @param {DataReader} reader the reader to use.
     * @param {number} from the offset from where we should read the data.
     * @param {number} length the length of the data to read.
     * @return {Function} the callback to get the compressed content (the type depends of the DataReader class).
     */
    prepareCompressedContent: function(reader, from, length) {
        return function() {
            var previousIndex = reader.index;
            reader.setIndex(from);
            var compressedFileData = reader.readData(length);
            reader.setIndex(previousIndex);

            return compressedFileData;
        };
    },
    /**
     * Prepare the function used to generate the uncompressed content from this ZipFile.
     * @param {DataReader} reader the reader to use.
     * @param {number} from the offset from where we should read the data.
     * @param {number} length the length of the data to read.
     * @param {JSZip.compression} compression the compression used on this file.
     * @param {number} uncompressedSize the uncompressed size to expect.
     * @return {Function} the callback to get the uncompressed content (the type depends of the DataReader class).
     */
    prepareContent: function(reader, from, length, compression, uncompressedSize) {
        return function() {

            var compressedFileData = utils.transformTo(compression.uncompressInputType, this.getCompressedContent());
            var uncompressedFileData = compression.uncompress(compressedFileData);

            if (uncompressedFileData.length !== uncompressedSize) {
                throw new Error("Bug : uncompressed data size mismatch");
            }

            return uncompressedFileData;
        };
    },
    /**
     * Read the local part of a zip file and add the info in this object.
     * @param {DataReader} reader the reader to use.
     */
    readLocalPart: function(reader) {
        var compression, localExtraFieldsLength;

        // we already know everything from the central dir !
        // If the central dir data are false, we are doomed.
        // On the bright side, the local part is scary  : zip64, data descriptors, both, etc.
        // The less data we get here, the more reliable this should be.
        // Let's skip the whole header and dash to the data !
        reader.skip(22);
        // in some zip created on windows, the filename stored in the central dir contains \ instead of /.
        // Strangely, the filename here is OK.
        // I would love to treat these zip files as corrupted (see http://www.info-zip.org/FAQ.html#backslashes
        // or APPNOTE#4.4.17.1, "All slashes MUST be forward slashes '/'") but there are a lot of bad zip generators...
        // Search "unzip mismatching "local" filename continuing with "central" filename version" on
        // the internet.
        //
        // I think I see the logic here : the central directory is used to display
        // content and the local directory is used to extract the files. Mixing / and \
        // may be used to display \ to windows users and use / when extracting the files.
        // Unfortunately, this lead also to some issues : http://seclists.org/fulldisclosure/2009/Sep/394
        this.fileNameLength = reader.readInt(2);
        localExtraFieldsLength = reader.readInt(2); // can't be sure this will be the same as the central dir
        this.fileName = reader.readData(this.fileNameLength);
        reader.skip(localExtraFieldsLength);

        if (this.compressedSize == -1 || this.uncompressedSize == -1) {
            throw new Error("Bug or corrupted zip : didn't get enough informations from the central directory " + "(compressedSize == -1 || uncompressedSize == -1)");
        }

        compression = utils.findCompression(this.compressionMethod);
        if (compression === null) { // no compression found
            throw new Error("Corrupted zip : compression " + utils.pretty(this.compressionMethod) + " unknown (inner file : " +  utils.transformTo("string", this.fileName) + ")");
        }
        this.decompressed = new CompressedObject();
        this.decompressed.compressedSize = this.compressedSize;
        this.decompressed.uncompressedSize = this.uncompressedSize;
        this.decompressed.crc32 = this.crc32;
        this.decompressed.compressionMethod = this.compressionMethod;
        this.decompressed.getCompressedContent = this.prepareCompressedContent(reader, reader.index, this.compressedSize, compression);
        this.decompressed.getContent = this.prepareContent(reader, reader.index, this.compressedSize, compression, this.uncompressedSize);

        // we need to compute the crc32...
        if (this.loadOptions.checkCRC32) {
            this.decompressed = utils.transformTo("string", this.decompressed.getContent());
            if (jszipProto.crc32(this.decompressed) !== this.crc32) {
                throw new Error("Corrupted zip : CRC32 mismatch");
            }
        }
    },

    /**
     * Read the central part of a zip file and add the info in this object.
     * @param {DataReader} reader the reader to use.
     */
    readCentralPart: function(reader) {
        this.versionMadeBy = reader.readInt(2);
        this.versionNeeded = reader.readInt(2);
        this.bitFlag = reader.readInt(2);
        this.compressionMethod = reader.readString(2);
        this.date = reader.readDate();
        this.crc32 = reader.readInt(4);
        this.compressedSize = reader.readInt(4);
        this.uncompressedSize = reader.readInt(4);
        this.fileNameLength = reader.readInt(2);
        this.extraFieldsLength = reader.readInt(2);
        this.fileCommentLength = reader.readInt(2);
        this.diskNumberStart = reader.readInt(2);
        this.internalFileAttributes = reader.readInt(2);
        this.externalFileAttributes = reader.readInt(4);
        this.localHeaderOffset = reader.readInt(4);

        if (this.isEncrypted()) {
            throw new Error("Encrypted zip are not supported");
        }

        this.fileName = reader.readData(this.fileNameLength);
        this.readExtraFields(reader);
        this.parseZIP64ExtraField(reader);
        this.fileComment = reader.readData(this.fileCommentLength);
    },

    /**
     * Parse the external file attributes and get the unix/dos permissions.
     */
    processAttributes: function () {
        this.unixPermissions = null;
        this.dosPermissions = null;
        var madeBy = this.versionMadeBy >> 8;

        // Check if we have the DOS directory flag set.
        // We look for it in the DOS and UNIX permissions
        // but some unknown platform could set it as a compatibility flag.
        this.dir = this.externalFileAttributes & 0x0010 ? true : false;

        if(madeBy === MADE_BY_DOS) {
            // first 6 bits (0 to 5)
            this.dosPermissions = this.externalFileAttributes & 0x3F;
        }

        if(madeBy === MADE_BY_UNIX) {
            this.unixPermissions = (this.externalFileAttributes >> 16) & 0xFFFF;
            // the octal permissions are in (this.unixPermissions & 0x01FF).toString(8);
        }

        // fail safe : if the name ends with a / it probably means a folder
        if (!this.dir && this.fileNameStr.slice(-1) === '/') {
            this.dir = true;
        }
    },

    /**
     * Parse the ZIP64 extra field and merge the info in the current ZipEntry.
     * @param {DataReader} reader the reader to use.
     */
    parseZIP64ExtraField: function(reader) {

        if (!this.extraFields[0x0001]) {
            return;
        }

        // should be something, preparing the extra reader
        var extraReader = new StringReader(this.extraFields[0x0001].value);

        // I really hope that these 64bits integer can fit in 32 bits integer, because js
        // won't let us have more.
        if (this.uncompressedSize === utils.MAX_VALUE_32BITS) {
            this.uncompressedSize = extraReader.readInt(8);
        }
        if (this.compressedSize === utils.MAX_VALUE_32BITS) {
            this.compressedSize = extraReader.readInt(8);
        }
        if (this.localHeaderOffset === utils.MAX_VALUE_32BITS) {
            this.localHeaderOffset = extraReader.readInt(8);
        }
        if (this.diskNumberStart === utils.MAX_VALUE_32BITS) {
            this.diskNumberStart = extraReader.readInt(4);
        }
    },
    /**
     * Read the central part of a zip file and add the info in this object.
     * @param {DataReader} reader the reader to use.
     */
    readExtraFields: function(reader) {
        var start = reader.index,
            extraFieldId,
            extraFieldLength,
            extraFieldValue;

        this.extraFields = this.extraFields || {};

        while (reader.index < start + this.extraFieldsLength) {
            extraFieldId = reader.readInt(2);
            extraFieldLength = reader.readInt(2);
            extraFieldValue = reader.readString(extraFieldLength);

            this.extraFields[extraFieldId] = {
                id: extraFieldId,
                length: extraFieldLength,
                value: extraFieldValue
            };
        }
    },
    /**
     * Apply an UTF8 transformation if needed.
     */
    handleUTF8: function() {
        var decodeParamType = support.uint8array ? "uint8array" : "array";
        if (this.useUTF8()) {
            this.fileNameStr = jszipProto.utf8decode(this.fileName);
            this.fileCommentStr = jszipProto.utf8decode(this.fileComment);
        } else {
            var upath = this.findExtraFieldUnicodePath();
            if (upath !== null) {
                this.fileNameStr = upath;
            } else {
                var fileNameByteArray =  utils.transformTo(decodeParamType, this.fileName);
                this.fileNameStr = this.loadOptions.decodeFileName(fileNameByteArray);
            }

            var ucomment = this.findExtraFieldUnicodeComment();
            if (ucomment !== null) {
                this.fileCommentStr = ucomment;
            } else {
                var commentByteArray =  utils.transformTo(decodeParamType, this.fileComment);
                this.fileCommentStr = this.loadOptions.decodeFileName(commentByteArray);
            }
        }
    },

    /**
     * Find the unicode path declared in the extra field, if any.
     * @return {String} the unicode path, null otherwise.
     */
    findExtraFieldUnicodePath: function() {
        var upathField = this.extraFields[0x7075];
        if (upathField) {
            var extraReader = new StringReader(upathField.value);

            // wrong version
            if (extraReader.readInt(1) !== 1) {
                return null;
            }

            // the crc of the filename changed, this field is out of date.
            if (jszipProto.crc32(this.fileName) !== extraReader.readInt(4)) {
                return null;
            }

            return jszipProto.utf8decode(extraReader.readString(upathField.length - 5));
        }
        return null;
    },

    /**
     * Find the unicode comment declared in the extra field, if any.
     * @return {String} the unicode comment, null otherwise.
     */
    findExtraFieldUnicodeComment: function() {
        var ucommentField = this.extraFields[0x6375];
        if (ucommentField) {
            var extraReader = new StringReader(ucommentField.value);

            // wrong version
            if (extraReader.readInt(1) !== 1) {
                return null;
            }

            // the crc of the comment changed, this field is out of date.
            if (jszipProto.crc32(this.fileComment) !== extraReader.readInt(4)) {
                return null;
            }

            return jszipProto.utf8decode(extraReader.readString(ucommentField.length - 5));
        }
        return null;
    }
};
module.exports = ZipEntry;


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Stat = __webpack_require__(5).array;
/**
 * Function that returns an array of points given 1D array as follows:
 *
 * [x1, y1, .. , x2, y2, ..]
 *
 * And receive the number of dimensions of each point.
 * @param array
 * @param dimensions
 * @returns {Array} - Array of points.
 */
function coordArrayToPoints(array, dimensions) {
    if(array.length % dimensions !== 0) {
        throw new RangeError('Dimensions number must be accordance with the size of the array.');
    }

    var length = array.length / dimensions;
    var pointsArr = new Array(length);

    var k = 0;
    for(var i = 0; i < array.length; i += dimensions) {
        var point = new Array(dimensions);
        for(var j = 0; j < dimensions; ++j) {
            point[j] = array[i + j];
        }

        pointsArr[k] = point;
        k++;
    }

    return pointsArr;
}


/**
 * Function that given an array as follows:
 * [x1, y1, .. , x2, y2, ..]
 *
 * Returns an array as follows:
 * [[x1, x2, ..], [y1, y2, ..], [ .. ]]
 *
 * And receives the number of dimensions of each coordinate.
 * @param array
 * @param dimensions
 * @returns {Array} - Matrix of coordinates
 */
function coordArrayToCoordMatrix(array, dimensions) {
    if(array.length % dimensions !== 0) {
        throw new RangeError('Dimensions number must be accordance with the size of the array.');
    }

    var coordinatesArray = new Array(dimensions);
    var points = array.length / dimensions;
    for (var i = 0; i < coordinatesArray.length; i++) {
        coordinatesArray[i] = new Array(points);
    }

    for(i = 0; i < array.length; i += dimensions) {
        for(var j = 0; j < dimensions; ++j) {
            var currentPoint = Math.floor(i / dimensions);
            coordinatesArray[j][currentPoint] = array[i + j];
        }
    }

    return coordinatesArray;
}

/**
 * Function that receives a coordinate matrix as follows:
 * [[x1, x2, ..], [y1, y2, ..], [ .. ]]
 *
 * Returns an array of coordinates as follows:
 * [x1, y1, .. , x2, y2, ..]
 *
 * @param coordMatrix
 * @returns {Array}
 */
function coordMatrixToCoordArray(coordMatrix) {
    var coodinatesArray = new Array(coordMatrix.length * coordMatrix[0].length);
    var k = 0;
    for(var i = 0; i < coordMatrix[0].length; ++i) {
        for(var j = 0; j < coordMatrix.length; ++j) {
            coodinatesArray[k] = coordMatrix[j][i];
            ++k;
        }
    }

    return coodinatesArray;
}

/**
 * Tranpose a matrix, this method is for coordMatrixToPoints and
 * pointsToCoordMatrix, that because only transposing the matrix
 * you can change your representation.
 *
 * @param matrix
 * @returns {Array}
 */
function transpose(matrix) {
    var resultMatrix = new Array(matrix[0].length);
    for(var i = 0; i < resultMatrix.length; ++i) {
        resultMatrix[i] = new Array(matrix.length);
    }

    for (i = 0; i < matrix.length; ++i) {
        for(var j = 0; j < matrix[0].length; ++j) {
            resultMatrix[j][i] = matrix[i][j];
        }
    }

    return resultMatrix;
}

/**
 * Function that transform an array of points into a coordinates array
 * as follows:
 * [x1, y1, .. , x2, y2, ..]
 *
 * @param points
 * @returns {Array}
 */
function pointsToCoordArray(points) {
    var coodinatesArray = new Array(points.length * points[0].length);
    var k = 0;
    for(var i = 0; i < points.length; ++i) {
        for(var j = 0; j < points[0].length; ++j) {
            coodinatesArray[k] = points[i][j];
            ++k;
        }
    }

    return coodinatesArray;
}

/**
 * Apply the dot product between the smaller vector and a subsets of the
 * largest one.
 *
 * @param firstVector
 * @param secondVector
 * @returns {Array} each dot product of size of the difference between the
 *                  larger and the smallest one.
 */
function applyDotProduct(firstVector, secondVector) {
    var largestVector, smallestVector;
    if(firstVector.length <= secondVector.length) {
        smallestVector = firstVector;
        largestVector = secondVector;
    } else {
        smallestVector = secondVector;
        largestVector = firstVector;
    }

    var difference = largestVector.length - smallestVector.length + 1;
    var dotProductApplied = new Array(difference);

    for (var i = 0; i < difference; ++i) {
        var sum = 0;
        for (var j = 0; j < smallestVector.length; ++j) {
            sum += smallestVector[j] * largestVector[i + j];
        }
        dotProductApplied[i] = sum;
    }

    return dotProductApplied;
}
/**
 * To scale the input array between the specified min and max values. The operation is performed inplace
 * if the options.inplace is specified. If only one of the min or max parameters is specified, then the scaling
 * will multiply the input array by min/min(input) or max/max(input)
 * @param input
 * @param options
 * @returns {*}
 */
function scale(input, options){
    var y;
    if(options.inPlace){
        y = input;
    }
    else{
        y = new Array(input.length);
    }
    const max = options.max;
    const min = options.min;
    if(typeof max === "number"){
        if(typeof min === "number"){
            var minMax = Stat.minMax(input);
            var factor = (max - min)/(minMax.max-minMax.min);
            for(var i=0;i< y.length;i++){
                y[i]=(input[i]-minMax.min)*factor+min;
            }
        }
        else{
            var currentMin = Stat.max(input);
            var factor = max/currentMin;
            for(var i=0;i< y.length;i++){
                y[i] = input[i]*factor;
            }
        }
    }
    else{
        if(typeof min === "number"){
            var currentMin = Stat.min(input);
            var factor = min/currentMin;
            for(var i=0;i< y.length;i++){
                y[i] = input[i]*factor;
            }
        }
    }
    return y;
}

module.exports = {
    coordArrayToPoints: coordArrayToPoints,
    coordArrayToCoordMatrix: coordArrayToCoordMatrix,
    coordMatrixToCoordArray: coordMatrixToCoordArray,
    coordMatrixToPoints: transpose,
    pointsToCoordArray: pointsToCoordArray,
    pointsToCoordMatrix: transpose,
    applyDotProduct: applyDotProduct,
    scale:scale
};



/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 *
 * Function that returns a Number array of equally spaced numberOfPoints
 * containing a representation of intensities of the spectra arguments x
 * and y.
 *
 * The options parameter contains an object in the following form:
 * from: starting point
 * to: last point
 * numberOfPoints: number of points between from and to
 * variant: "slot" or "smooth" - smooth is the default option
 *
 * The slot variant consist that each point in the new array is calculated
 * averaging the existing points between the slot that belongs to the current
 * value. The smooth variant is the same but takes the integral of the range
 * of the slot and divide by the step size between two points in the new array.
 *
 * @param x - sorted increasing x values
 * @param y
 * @param options
 * @returns {Array} new array with the equally spaced data.
 *
 */
function getEquallySpacedData(x, y, options) {
    if (x.length>1 && x[0]>x[1]) {
        x=x.slice().reverse();
        y=y.slice().reverse();
    }

    var xLength = x.length;
    if(xLength !== y.length)
        throw new RangeError("the x and y vector doesn't have the same size.");

    if (options === undefined) options = {};

    var from = options.from === undefined ? x[0] : options.from
    if (isNaN(from) || !isFinite(from)) {
        throw new RangeError("'From' value must be a number");
    }
    var to = options.to === undefined ? x[x.length - 1] : options.to;
    if (isNaN(to) || !isFinite(to)) {
        throw new RangeError("'To' value must be a number");
    }

    var reverse = from > to;
    if(reverse) {
        var temp = from;
        from = to;
        to = temp;
    }

    var numberOfPoints = options.numberOfPoints === undefined ? 100 : options.numberOfPoints;
    if (isNaN(numberOfPoints) || !isFinite(numberOfPoints)) {
        throw new RangeError("'Number of points' value must be a number");
    }
    if(numberOfPoints < 1)
        throw new RangeError("the number of point must be higher than 1");

    var algorithm = options.variant === "slot" ? "slot" : "smooth"; // default value: smooth

    var output = algorithm === "slot" ? getEquallySpacedSlot(x, y, from, to, numberOfPoints) : getEquallySpacedSmooth(x, y, from, to, numberOfPoints);

    return reverse ? output.reverse() : output;
}

/**
 * function that retrieves the getEquallySpacedData with the variant "smooth"
 *
 * @param x
 * @param y
 * @param from - Initial point
 * @param to - Final point
 * @param numberOfPoints
 * @returns {Array} - Array of y's equally spaced with the variant "smooth"
 */
function getEquallySpacedSmooth(x, y, from, to, numberOfPoints) {
    var xLength = x.length;

    var step = (to - from) / (numberOfPoints - 1);
    var halfStep = step / 2;

    var start = from - halfStep;
    var output = new Array(numberOfPoints);

    var initialOriginalStep = x[1] - x[0];
    var lastOriginalStep = x[x.length - 1] - x[x.length - 2];

    // Init main variables
    var min = start;
    var max = start + step;

    var previousX = Number.MIN_VALUE;
    var previousY = 0;
    var nextX = x[0] - initialOriginalStep;
    var nextY = 0;

    var currentValue = 0;
    var slope = 0;
    var intercept = 0;
    var sumAtMin = 0;
    var sumAtMax = 0;

    var i = 0; // index of input
    var j = 0; // index of output

    function getSlope(x0, y0, x1, y1) {
        return (y1 - y0) / (x1 - x0);
    }

    main: while(true) {
        while (nextX - max >= 0) {
            // no overlap with original point, just consume current value
            var add = integral(0, max - previousX, slope, previousY);
            sumAtMax = currentValue + add;

            output[j] = (sumAtMax - sumAtMin) / step;
            j++;

            if (j === numberOfPoints)
                break main;

            min = max;
            max += step;
            sumAtMin = sumAtMax;
        }

        if(previousX <= min && min <= nextX) {
            add = integral(0, min - previousX, slope, previousY);
            sumAtMin = currentValue + add;
        }

        currentValue += integral(previousX, nextX, slope, intercept);

        previousX = nextX;
        previousY = nextY;

        if (i < xLength) {
            nextX = x[i];
            nextY = y[i];
            i++;
        } else if (i === xLength) {
            nextX += lastOriginalStep;
            nextY = 0;
        }
        // updating parameters
        slope = getSlope(previousX, previousY, nextX, nextY);
        intercept = -slope*previousX + previousY;
    }

    return output;
}

/**
 * function that retrieves the getEquallySpacedData with the variant "slot"
 *
 * @param x
 * @param y
 * @param from - Initial point
 * @param to - Final point
 * @param numberOfPoints
 * @returns {Array} - Array of y's equally spaced with the variant "slot"
 */
function getEquallySpacedSlot(x, y, from, to, numberOfPoints) {
    var xLength = x.length;

    var step = (to - from) / (numberOfPoints - 1);
    var halfStep = step / 2;
    var lastStep = x[x.length - 1] - x[x.length - 2];

    var start = from - halfStep;
    var output = new Array(numberOfPoints);

    // Init main variables
    var min = start;
    var max = start + step;

    var previousX = -Number.MAX_VALUE;
    var previousY = 0;
    var nextX = x[0];
    var nextY = y[0];
    var frontOutsideSpectra = 0;
    var backOutsideSpectra = true;

    var currentValue = 0;

    // for slot algorithm
    var currentPoints = 0;

    var i = 1; // index of input
    var j = 0; // index of output

    main: while(true) {
        if (previousX>=nextX) throw (new Error('x must be an increasing serie'));
        while (previousX - max > 0) {
            // no overlap with original point, just consume current value
            if(backOutsideSpectra) {
                currentPoints++;
                backOutsideSpectra = false;
            }

            output[j] = currentPoints <= 0 ? 0 : currentValue / currentPoints;
            j++;

            if (j === numberOfPoints)
                break main;

            min = max;
            max += step;
            currentValue = 0;
            currentPoints = 0;
        }

        if(previousX > min) {
            currentValue += previousY;
            currentPoints++;
        }

        if(previousX === -Number.MAX_VALUE || frontOutsideSpectra > 1)
            currentPoints--;

        previousX = nextX;
        previousY = nextY;

        if (i < xLength) {
            nextX = x[i];
            nextY = y[i];
            i++;
        } else {
            nextX += lastStep;
            nextY = 0;
            frontOutsideSpectra++;
        }
    }

    return output;
}
/**
 * Function that calculates the integral of the line between two
 * x-coordinates, given the slope and intercept of the line.
 *
 * @param x0
 * @param x1
 * @param slope
 * @param intercept
 * @returns {number} integral value.
 */
function integral(x0, x1, slope, intercept) {
    return (0.5 * slope * x1 * x1 + intercept * x1) - (0.5 * slope * x0 * x0 + intercept * x0);
}

exports.getEquallySpacedData = getEquallySpacedData;
exports.integral = integral;

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = exports = __webpack_require__(57);


exports.getEquallySpacedData = __webpack_require__(58).getEquallySpacedData;
exports.SNV = __webpack_require__(60).SNV;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.SNV = SNV;
var Stat = __webpack_require__(5).array;

/**
 * Function that applies the standard normal variate (SNV) to an array of values.
 *
 * @param data - Array of values.
 * @returns {Array} - applied the SNV.
 */
function SNV(data) {
    var mean = Stat.mean(data);
    var std = Stat.standardDeviation(data);
    var result = data.slice();
    for (var i = 0; i < data.length; i++) {
        result[i] = (result[i] - mean) / std;
    }
    return result;
}


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @class DisjointSet
 */
class DisjointSet {
    constructor() {
        this.nodes = new Map();
    }

    /**
     * Adds an element as a new set
     * @param {*} value
     * @return {DisjointSetNode} Object holding the element
     */
    add(value) {
        var node = this.nodes.get(value);
        if (!node) {
            node = new DisjointSetNode(value);
            this.nodes.set(value, node);
        }
        return node;
    }

    /**
     * Merges the sets that contain x and y
     * @param {DisjointSetNode} x
     * @param {DisjointSetNode} y
     */
    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);
        if (rootX === rootY) {
            return;
        }
        if (rootX.rank < rootY.rank) {
            rootX.parent = rootY;
        } else if (rootX.rank > rootY.rank) {
            rootY.parent = rootX;
        } else {
            rootY.parent = rootX;
            rootX.rank++;
        }
    }

    /**
     * Finds and returns the root node of the set that contains node
     * @param {DisjointSetNode} node
     * @return {DisjointSetNode}
     */
    find(node) {
        var rootX = node;
        while (rootX.parent !== null) {
            rootX = rootX.parent;
        }
        var toUpdateX = node;
        while (toUpdateX.parent !== null) {
            var toUpdateParent = toUpdateX;
            toUpdateX = toUpdateX.parent;
            toUpdateParent.parent = rootX;
        }
        return rootX;
    }

    /**
     * Returns true if x and y belong to the same set
     * @param {DisjointSetNode} x
     * @param {DisjointSetNode} y
     */
    connected(x, y) {
        return this.find(x) === this.find(y);
    }
}

module.exports = DisjointSet;

function DisjointSetNode(value) {
    this.value = value;
    this.parent = null;
    this.rank = 0;
}


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var FFT = __webpack_require__(26);

var FFTUtils= {
    DEBUG : false,

    /**
     * Calculates the inverse of a 2D Fourier transform
     *
     * @param ft
     * @param ftRows
     * @param ftCols
     * @return
     */
    ifft2DArray : function(ft, ftRows, ftCols){
        var tempTransform = new Array(ftRows * ftCols);
        var nRows = ftRows / 2;
        var nCols = (ftCols - 1) * 2;
        // reverse transform columns
        FFT.init(nRows);
        var tmpCols = {re: new Array(nRows), im: new Array(nRows)};
        for (var iCol = 0; iCol < ftCols; iCol++) {
            for (var iRow = nRows - 1; iRow >= 0; iRow--) {
                tmpCols.re[iRow] = ft[(iRow * 2) * ftCols + iCol];
                tmpCols.im[iRow] = ft[(iRow * 2 + 1) * ftCols + iCol];
            }
            //Unnormalized inverse transform
            FFT.bt(tmpCols.re, tmpCols.im);
            for (var iRow = nRows - 1; iRow >= 0; iRow--) {
                tempTransform[(iRow * 2) * ftCols + iCol] = tmpCols.re[iRow];
                tempTransform[(iRow * 2 + 1) * ftCols + iCol] = tmpCols.im[iRow];
            }
        }

        // reverse row transform
        var finalTransform = new Array(nRows * nCols);
        FFT.init(nCols);
        var tmpRows = {re: new Array(nCols), im: new Array(nCols)};
        var scale = nCols * nRows;
        for (var iRow = 0; iRow < ftRows; iRow += 2) {
            tmpRows.re[0] = tempTransform[iRow * ftCols];
            tmpRows.im[0] = tempTransform[(iRow + 1) * ftCols];
            for (var iCol = 1; iCol < ftCols; iCol++) {
                tmpRows.re[iCol] = tempTransform[iRow * ftCols + iCol];
                tmpRows.im[iCol] = tempTransform[(iRow + 1) * ftCols + iCol];
                tmpRows.re[nCols - iCol] = tempTransform[iRow * ftCols + iCol];
                tmpRows.im[nCols - iCol] = -tempTransform[(iRow + 1) * ftCols + iCol];
            }
            //Unnormalized inverse transform
            FFT.bt(tmpRows.re, tmpRows.im);

            var indexB = (iRow / 2) * nCols;
            for (var iCol = nCols - 1; iCol >= 0; iCol--) {
                finalTransform[indexB + iCol] = tmpRows.re[iCol] / scale;
            }
        }
        return finalTransform;
    },
    /**
     * Calculates the fourier transform of a matrix of size (nRows,nCols) It is
     * assumed that both nRows and nCols are a power of two
     *
     * On exit the matrix has dimensions (nRows * 2, nCols / 2 + 1) where the
     * even rows contain the real part and the odd rows the imaginary part of the
     * transform
     * @param data
     * @param nRows
     * @param nCols
     * @return
     */
    fft2DArray:function(data, nRows, nCols, opt) {
        var options = Object.assign({},{inplace:true})
        var ftCols = (nCols / 2 + 1);
        var ftRows = nRows * 2;
        var tempTransform = new Array(ftRows * ftCols);
        FFT.init(nCols);
        // transform rows
        var tmpRows = {re: new Array(nCols), im: new Array(nCols)};
        var row1 = {re: new Array(nCols), im: new Array(nCols)}
        var row2 = {re: new Array(nCols), im: new Array(nCols)}
        var index, iRow0, iRow1, iRow2, iRow3;
        for (var iRow = 0; iRow < nRows / 2; iRow++) {
            index = (iRow * 2) * nCols;
            tmpRows.re = data.slice(index, index + nCols);

            index = (iRow * 2 + 1) * nCols;
            tmpRows.im = data.slice(index, index + nCols);

            FFT.fft1d(tmpRows.re, tmpRows.im);

            this.reconstructTwoRealFFT(tmpRows, row1, row2);
            //Now lets put back the result into the output array
            iRow0 = (iRow * 4) * ftCols;
            iRow1 = (iRow * 4 + 1) * ftCols;
            iRow2 = (iRow * 4 + 2) * ftCols;
            iRow3 = (iRow * 4 + 3) * ftCols;
            for (var k = ftCols - 1; k >= 0; k--) {
                tempTransform[iRow0 + k] = row1.re[k];
                tempTransform[iRow1 + k] = row1.im[k];
                tempTransform[iRow2 + k] = row2.re[k];
                tempTransform[iRow3 + k] = row2.im[k];
            }
        }

        //console.log(tempTransform);
        row1 = null;
        row2 = null;
        // transform columns
        var finalTransform = new Array(ftRows * ftCols);

        FFT.init(nRows);
        var tmpCols = {re: new Array(nRows), im: new Array(nRows)};
        for (var iCol = ftCols - 1; iCol >= 0; iCol--) {
            for (var iRow = nRows - 1; iRow >= 0; iRow--) {
                tmpCols.re[iRow] = tempTransform[(iRow * 2) * ftCols + iCol];
                tmpCols.im[iRow] = tempTransform[(iRow * 2 + 1) * ftCols + iCol];
                //TODO Chech why this happens
                if(isNaN(tmpCols.re[iRow])){
                    tmpCols.re[iRow]=0;
                }
                if(isNaN(tmpCols.im[iRow])){
                    tmpCols.im[iRow]=0;
                }
            }
            FFT.fft1d(tmpCols.re, tmpCols.im);
            for (var iRow = nRows - 1; iRow >= 0; iRow--) {
                finalTransform[(iRow * 2) * ftCols + iCol] = tmpCols.re[iRow];
                finalTransform[(iRow * 2 + 1) * ftCols + iCol] = tmpCols.im[iRow];
            }
        }

        //console.log(finalTransform);
        return finalTransform;

    },
    /**
     *
     * @param fourierTransform
     * @param realTransform1
     * @param realTransform2
     *
     * Reconstructs the individual Fourier transforms of two simultaneously
     * transformed series. Based on the Symmetry relationships (the asterisk
     * denotes the complex conjugate)
     *
     * F_{N-n} = F_n^{*} for a purely real f transformed to F
     *
     * G_{N-n} = G_n^{*} for a purely imaginary g transformed to G
     *
     */
    reconstructTwoRealFFT:function(fourierTransform, realTransform1, realTransform2) {
        var length = fourierTransform.re.length;

        // the components n=0 are trivial
        realTransform1.re[0] = fourierTransform.re[0];
        realTransform1.im[0] = 0.0;
        realTransform2.re[0] = fourierTransform.im[0];
        realTransform2.im[0] = 0.0;
        var rm, rp, im, ip, j;
        for (var i = length / 2; i > 0; i--) {
            j = length - i;
            rm = 0.5 * (fourierTransform.re[i] - fourierTransform.re[j]);
            rp = 0.5 * (fourierTransform.re[i] + fourierTransform.re[j]);
            im = 0.5 * (fourierTransform.im[i] - fourierTransform.im[j]);
            ip = 0.5 * (fourierTransform.im[i] + fourierTransform.im[j]);
            realTransform1.re[i] = rp;
            realTransform1.im[i] = im;
            realTransform1.re[j] = rp;
            realTransform1.im[j] = -im;
            realTransform2.re[i] = ip;
            realTransform2.im[i] = -rm;
            realTransform2.re[j] = ip;
            realTransform2.im[j] = rm;
        }
    },

    /**
     * In place version of convolute 2D
     *
     * @param ftSignal
     * @param ftFilter
     * @param ftRows
     * @param ftCols
     * @return
     */
    convolute2DI:function(ftSignal, ftFilter, ftRows, ftCols) {
        var re, im;
        for (var iRow = 0; iRow < ftRows / 2; iRow++) {
            for (var iCol = 0; iCol < ftCols; iCol++) {
                //
                re = ftSignal[(iRow * 2) * ftCols + iCol]
                    * ftFilter[(iRow * 2) * ftCols + iCol]
                    - ftSignal[(iRow * 2 + 1) * ftCols + iCol]
                    * ftFilter[(iRow * 2 + 1) * ftCols + iCol];
                im = ftSignal[(iRow * 2) * ftCols + iCol]
                    * ftFilter[(iRow * 2 + 1) * ftCols + iCol]
                    + ftSignal[(iRow * 2 + 1) * ftCols + iCol]
                    * ftFilter[(iRow * 2) * ftCols + iCol];
                //
                ftSignal[(iRow * 2) * ftCols + iCol] = re;
                ftSignal[(iRow * 2 + 1) * ftCols + iCol] = im;
            }
        }
    },
    /**
     *
     * @param data
     * @param kernel
     * @param nRows
     * @param nCols
     * @returns {*}
     */
    convolute:function(data, kernel, nRows, nCols, opt) {
        var ftSpectrum = new Array(nCols * nRows);
        for (var i = 0; i<nRows * nCols; i++) {
            ftSpectrum[i] = data[i];
        }

        ftSpectrum = this.fft2DArray(ftSpectrum, nRows, nCols);


        var dimR = kernel.length;
        var dimC = kernel[0].length;
        var ftFilterData = new Array(nCols * nRows);
        for(var i = 0; i < nCols * nRows; i++) {
            ftFilterData[i] = 0;
        }

        var iRow, iCol;
        var shiftR = Math.floor((dimR - 1) / 2);
        var shiftC = Math.floor((dimC - 1) / 2);
        for (var ir = 0; ir < dimR; ir++) {
            iRow = (ir - shiftR + nRows) % nRows;
            for (var ic = 0; ic < dimC; ic++) {
                iCol = (ic - shiftC + nCols) % nCols;
                ftFilterData[iRow * nCols + iCol] = kernel[ir][ic];
            }
        }
        ftFilterData = this.fft2DArray(ftFilterData, nRows, nCols);

        var ftRows = nRows * 2;
        var ftCols = nCols / 2 + 1;
        this.convolute2DI(ftSpectrum, ftFilterData, ftRows, ftCols);

        return this.ifft2DArray(ftSpectrum, ftRows, ftCols);
    },


    toRadix2:function(data, nRows, nCols) {
        var i, j, irow, icol;
        var cols = nCols, rows = nRows, prows=0, pcols=0;
        if(!(nCols !== 0 && (nCols & (nCols - 1)) === 0)) {
            //Then we have to make a pading to next radix2
            cols = 0;
            while((nCols>>++cols)!=0);
            cols=1<<cols;
            pcols = cols-nCols;
        }
        if(!(nRows !== 0 && (nRows & (nRows - 1)) === 0)) {
            //Then we have to make a pading to next radix2
            rows = 0;
            while((nRows>>++rows)!=0);
            rows=1<<rows;
            prows = (rows-nRows)*cols;
        }
        if(rows==nRows&&cols==nCols)//Do nothing. Returns the same input!!! Be careful
            return {data:data, rows:nRows, cols:nCols};

        var output = new Array(rows*cols);
        var shiftR = Math.floor((rows-nRows)/2)-nRows;
        var shiftC = Math.floor((cols-nCols)/2)-nCols;

        for( i = 0; i < rows; i++) {
            irow = i*cols;
            icol = ((i-shiftR) % nRows) * nCols;
            for( j = 0; j < cols; j++) {
                output[irow+j] = data[(icol+(j-shiftC) % nCols) ];
            }
        }
        return {data:output, rows:rows, cols:cols};
    },

    /**
     * Crop the given matrix to fit the corresponding number of rows and columns
     */
    crop:function(data, rows, cols, nRows, nCols, opt) {

        if(rows == nRows && cols == nCols)//Do nothing. Returns the same input!!! Be careful
            return data;

        var options = Object.assign({}, opt);

        var output = new Array(nCols*nRows);

        var shiftR = Math.floor((rows-nRows)/2);
        var shiftC = Math.floor((cols-nCols)/2);
        var destinyRow, sourceRow, i, j;
        for( i = 0; i < nRows; i++) {
            destinyRow = i*nCols;
            sourceRow = (i+shiftR)*cols;
            for( j = 0;j < nCols; j++) {
                output[destinyRow+j] = data[sourceRow+(j+shiftC)];
            }
        }

        return output;
    }
}

module.exports = FFTUtils;


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const extend = __webpack_require__(16);
const SG = __webpack_require__(82);

const defaultOptions = {
    sgOptions: {
        windowSize: 9,
        polynomial: 3
    },
    minMaxRatio: 0.00025,
    broadRatio: 0.00,
    maxCriteria: true,
    smoothY: true,
    realTopDetection: false,
    heightFactor: 0,
    boundaries: false,
    derivativeThreshold: -1
};

/**
 * Global spectra deconvolution
 * @param {Array<Number>} x - Independent variable
 * @param {Array<Number>} yIn - Dependent variable
 * @param {Object} [options] - Options object
 * @param {Object} [options.sgOptions] - Options object for Savitzky-Golay filter. See https://github.com/mljs/savitzky-golay-generalized#options
 * @param {Number} [options.sgOptions.windowSize = 9] - points to use in the approximations
 * @param {Number} [options.sgOptions.polynomial = 3] - degree of the polynomial to use in the approximations
 * @param {Number} [options.minMaxRatio = 0.00025] - Threshold to determine if a given peak should be considered as a noise
 * @param {Number} [options.broadRatio = 0.00] - If `broadRatio` is higher than 0, then all the peaks which second derivative
 * smaller than `broadRatio * maxAbsSecondDerivative` will be marked with the soft mask equal to true.
 * @param {Number} [options.noiseLevel = 0] - Noise threshold in spectrum units
 * @param {Boolean} [options.maxCriteria = true] - Peaks are local maximum(true) or minimum(false)
 * @param {Boolean} [options.smoothY = true] - Select the peak intensities from a smoothed version of the independent variables
 * @param {Boolean} [options.realTopDetection = false] - Use a quadratic optimizations with the peak and its 3 closest neighbors
 * to determine the true x,y values of the peak?
 * @param {Number} [options.heightFactor = 0] - Factor to multiply the calculated height (usually 2)
 * @param {Boolean} [options.boundaries = false] - Return also the inflection points of the peaks
 * @param {Number} [options.derivativeThreshold = -1] - Filters based on the amplitude of the first derivative
 * @return {Array<Object>}
 */
function gsd(x, yIn, options) {
    options = extend({}, defaultOptions, options);
    let sgOptions = options.sgOptions;
    const y = [].concat(yIn);

    if (!('noiseLevel' in options)) {
        // We have to know if x is equally spaced
        var maxDx = 0,
            minDx = Number.MAX_VALUE,
            tmp;
        for (let i = 0; i < x.length - 1; ++i) {
            tmp = Math.abs(x[i + 1] - x[i]);
            if (tmp < minDx) {
                minDx = tmp;
            }
            if (tmp > maxDx) {
                maxDx = tmp;
            }
        }

        if ((maxDx - minDx) / maxDx < 0.05) {
            options.noiseLevel = getNoiseLevel(y);
        } else {
            options.noiseLevel = 0;
        }
    }
    const yCorrection = {m: 1, b: options.noiseLevel};
    if (!options.maxCriteria) {
        yCorrection.m = -1;
        yCorrection.b *= -1;
    }

    for (let i = 0; i < y.length; i++) {
        y[i] = yCorrection.m * y[i] - yCorrection.b;
    }

    for (let i = 0; i < y.length; i++) {
        if (y[i] < 0) {
            y[i] = 0;
        }
    }
    // If the max difference between delta x is less than 5%, then, we can assume it to be equally spaced variable
    let Y = y;
    let dY, ddY;
    if ((maxDx - minDx) / maxDx < 0.05) {
        if (options.smoothY)
            Y = SG(y, x[1] - x[0], {windowSize: sgOptions.windowSize, polynomial: sgOptions.polynomial, derivative: 0});
        dY = SG(y, x[1] - x[0], {windowSize: sgOptions.windowSize, polynomial: sgOptions.polynomial, derivative: 1});
        ddY = SG(y, x[1] - x[0], {windowSize: sgOptions.windowSize, polynomial: sgOptions.polynomial, derivative: 2});
    } else {
        if (options.smoothY)
            Y = SG(y, x, {windowSize: sgOptions.windowSize, polynomial: sgOptions.polynomial, derivative: 0});
        dY = SG(y, x, {windowSize: sgOptions.windowSize, polynomial: sgOptions.polynomial, derivative: 1});
        ddY = SG(y, x, {windowSize: sgOptions.windowSize, polynomial: sgOptions.polynomial, derivative: 2});
    }

    const X = x;
    const dx = x[1] - x[0];
    var maxDdy = 0;
    var maxY = 0;
    for (let i = 0; i < Y.length; i++) {
        if (Math.abs(ddY[i]) > maxDdy) {
            maxDdy = Math.abs(ddY[i]);
        }
        if (Math.abs(Y[i]) > maxY) {
            maxY = Math.abs(Y[i]);
        }
    }

    var lastMax = null;
    var lastMin = null;
    var minddY = new Array(Y.length - 2);
    var intervalL = new Array(Y.length);
    var intervalR = new Array(Y.length);
    var broadMask = new Array(Y.length - 2);
    var minddYLen = 0;
    var intervalLLen = 0;
    var intervalRLen = 0;
    var broadMaskLen = 0;
    // By the intermediate value theorem We cannot find 2 consecutive maximum or minimum
    for (let i = 1; i < Y.length - 1; ++i) {

        // filter based on derivativeThreshold
        if (Math.abs(dY[i]) > options.derivativeThreshold) {

            // Minimum in first derivative
            if ((dY[i] < dY[i - 1]) && (dY[i] <= dY[i + 1]) ||
                (dY[i] <= dY[i - 1]) && (dY[i] < dY[i + 1])) {
                lastMin = {
                    x: X[i],
                    index: i
                };
                if (dx > 0 && lastMax !== null) {
                    intervalL[intervalLLen++] = lastMax;
                    intervalR[intervalRLen++] = lastMin;
                }
            }

            // Maximum in first derivative
            if ((dY[i] >= dY[i - 1]) && (dY[i] > dY[i + 1]) ||
                (dY[i] > dY[i - 1]) && (dY[i] >= dY[i + 1])) {
                lastMax = {
                    x: X[i],
                    index: i
                };
                if (dx < 0 && lastMin !== null) {
                    intervalL[intervalLLen++] = lastMax;
                    intervalR[intervalRLen++] = lastMin;
                }
            }
        }

        // Minimum in second derivative
        if ((ddY[i] < ddY[i - 1]) && (ddY[i] < ddY[i + 1])) {
            // TODO should we change this to have 3 arrays ? Huge overhead creating arrays
            minddY[minddYLen++] = i; //( [X[i], Y[i], i] );
            broadMask[broadMaskLen++] = Math.abs(ddY[i]) <= options.broadRatio * maxDdy;
        }
    }
    minddY.length = minddYLen;
    intervalL.length = intervalLLen;
    intervalR.length = intervalRLen;
    broadMask.length = broadMaskLen;

    let signals = new Array(minddY.length);
    let signalsLen = 0;
    let lastK = -1;
    let possible, frequency, distanceJ, minDistance, gettingCloser;
    for (let j = 0; j < minddY.length; ++j) {
        frequency = X[minddY[j]];
        possible = -1;
        let k = lastK + 1;
        minDistance = Number.MAX_VALUE;
        distanceJ = 0;
        gettingCloser = true;
        while (possible === -1 && (k < intervalL.length) && gettingCloser) {
            distanceJ = Math.abs(frequency - (intervalL[k].x + intervalR[k].x) / 2);

            //Still getting closer?
            if (distanceJ < minDistance) {
                minDistance = distanceJ;
            } else {
                gettingCloser = false;
            }
            if (distanceJ < Math.abs(intervalL[k].x - intervalR[k].x) / 2) {
                possible = k;
                lastK = k;
            }
            ++k;
        }

        if (possible !== -1) {
            if (Math.abs(Y[minddY[j]]) > options.minMaxRatio * maxY) {
                signals[signalsLen++] = {
                    index: minddY[j],
                    x: frequency,
                    y: (Y[minddY[j]] + yCorrection.b) / yCorrection.m,
                    width: Math.abs(intervalR[possible].x - intervalL[possible].x), //widthCorrection
                    soft: broadMask[j]
                };
                if (options.boundaries) {
                    signals[signalsLen - 1].left = intervalL[possible];
                    signals[signalsLen - 1].right = intervalR[possible];
                }
                if (options.heightFactor) {
                    let yLeft = Y[intervalL[possible].index];
                    let yRight = Y[intervalR[possible].index];
                    signals[signalsLen - 1].height = options.heightFactor * (signals[signalsLen - 1].y - ((yLeft + yRight) / 2));
                }
            }
        }
    }
    signals.length = signalsLen;

    if (options.realTopDetection)
        realTopDetection(signals, X, Y);

    //Correct the values to fit the original spectra data
    for (let j = 0; j < signals.length; j++) {
        signals[j].base = options.noiseLevel;
    }

    signals.sort(function (a, b) {
        return a.x - b.x;
    });

    return signals;

}

function getNoiseLevel(y) {
    var mean = 0, stddev = 0;
    var length = y.length;
    for (let i = 0; i < length; ++i) {
        mean += y[i];
    }
    mean /= length;
    var averageDeviations = new Array(length);
    for (let i = 0; i < length; ++i)
        averageDeviations[i] = Math.abs(y[i] - mean);
    averageDeviations.sort();
    if (length % 2 === 1) {
        stddev = averageDeviations[(length - 1) / 2] / 0.6745;
    } else {
        stddev = 0.5 * (averageDeviations[length / 2] + averageDeviations[length / 2 - 1]) / 0.6745;
    }

    return stddev;
}

function realTopDetection(peakList, x, y) {
    var alpha, beta, gamma, p, currentPoint;
    for (var j = 0; j < peakList.length; j++) {
        currentPoint = peakList[j].i;//peakList[j][2];
        //The detected peak could be moved 1 or 2 unit to left or right.
        if (y[currentPoint - 1] >= y[currentPoint - 2]
            && y[currentPoint - 1] >= y[currentPoint]) {
            currentPoint--;
        } else {
            if (y[currentPoint + 1] >= y[currentPoint]
                && y[currentPoint + 1] >= y[currentPoint + 2]) {
                currentPoint++;
            } else {
                if (y[currentPoint - 2] >= y[currentPoint - 3]
                    && y[currentPoint - 2] >= y[currentPoint - 1]) {
                    currentPoint -= 2;
                } else {
                    if (y[currentPoint + 2] >= y[currentPoint + 1]
                        && y[currentPoint + 2] >= y[currentPoint + 3]) {
                        currentPoint += 2;
                    }
                }
            }
        }
        if (y[currentPoint - 1] > 0 && y[currentPoint + 1] > 0
            && y[currentPoint] >= y[currentPoint - 1]
            && y[currentPoint] >= y[currentPoint + 1]) {
            alpha = 20 * Math.log10(y[currentPoint - 1]);
            beta = 20 * Math.log10(y[currentPoint]);
            gamma = 20 * Math.log10(y[currentPoint + 1]);
            p = 0.5 * (alpha - gamma) / (alpha - 2 * beta + gamma);
            //console.log("p: "+p);
            //console.log(x[currentPoint]+" "+tmp+" "+currentPoint);
            peakList[j].x = x[currentPoint] + (x[currentPoint] - x[currentPoint - 1]) * p;
            peakList[j].y = y[currentPoint] - 0.25 * (y[currentPoint - 1] - y[currentPoint + 1]) * p;
        }
    }
}

module.exports = gsd;


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports.post = __webpack_require__(65);
module.exports.gsd = __webpack_require__(63);


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by acastillo on 9/6/15.
 */


var Opt = __webpack_require__(79);

function sampleFunction(from, to, x, y, lastIndex) {
    var nbPoints = x.length;
    var sampleX = [];
    var sampleY = [];
    var direction = Math.sign(x[1] - x[0]);//Direction of the derivative
    if (direction === -1) {
        lastIndex[0] = x.length - 1;
    }

    var delta = Math.abs(to - from) / 2;
    var mid = (from + to) / 2;
    var stop = false;
    var index = lastIndex[0];
    while (!stop && index < nbPoints && index >= 0) {
        if (Math.abs(x[index] - mid) <= delta) {
            sampleX.push(x[index]);
            sampleY.push(y[index]);
            index += direction;
        } else {
            //It is outside the range.
            if (Math.sign(mid - x[index]) === 1) {
                //We'll reach the mid going in the current direction
                index += direction;
            } else {
                //There is not more peaks in the current range
                stop = true;
            }
        }
        //console.log(sampleX);
    }
    lastIndex[0] = index;
    return [sampleX, sampleY];
}

function optimizePeaks(peakList, x, y, n, fnType) {
    var i, j, lastIndex = [0];
    var groups = groupPeaks(peakList, n);
    var result = [];
    var factor = 1;
    if (fnType === 'gaussian')
        factor = 1.17741;//From https://en.wikipedia.org/wiki/Gaussian_function#Properties
    var sampling, error, opts;
    for (i = 0; i < groups.length; i++) {
        var peaks = groups[i].group;
        if (peaks.length > 1) {
            //Multiple peaks
            //console.log("Pending group of overlaped peaks "+peaks.length);
            //console.log("here1");
            //console.log(groups[i].limits);
            sampling = sampleFunction(groups[i].limits[0] - groups[i].limits[1], groups[i].limits[0] + groups[i].limits[1], x, y, lastIndex);
            //console.log(sampling);
            if (sampling[0].length > 5) {
                error = peaks[0].width / 1000;
                opts = [  3,    100, error, error, error, error * 10, error * 10,    11,    9,        1 ];
                //var gauss = Opt.optimizeSingleGaussian(sampling[0], sampling[1], opts, peaks);
                var optPeaks = [];
                if (fnType === 'gaussian')
                    optPeaks = Opt.optimizeGaussianSum(sampling, peaks, opts);
                else {
                    if (fnType === 'lorentzian') {
                        optPeaks = Opt.optimizeLorentzianSum(sampling, peaks, opts);
                    }
                }
                //console.log(optPeak);
                for (j = 0; j < optPeaks.length; j++) {
                    result.push({x: optPeaks[j][0][0], y: optPeaks[j][1][0], width: optPeaks[j][2][0] * factor});
                }
            }
        } else {
            //Single peak
            peaks = peaks[0];
            sampling = sampleFunction(peaks.x - n * peaks.width,
                peaks.x + n * peaks.width, x, y, lastIndex);
            //console.log("here2");
            //console.log(groups[i].limits);
            if (sampling[0].length > 5) {
                error = peaks.width / 1000;
                opts = [3, 100, error, error, error, error * 10, error * 10, 11, 9, 1];
                //var gauss = Opt.optimizeSingleGaussian(sampling[0], sampling[1], opts, peaks);
                //var gauss = Opt.optimizeSingleGaussian([sampling[0],sampling[1]], peaks, opts);
                var optPeak = [];
                if (fnType === 'gaussian')
                    optPeak = Opt.optimizeSingleGaussian([sampling[0], sampling[1]], peaks,  opts);
                else {
                    if (fnType === 'lorentzian') {
                        optPeak = Opt.optimizeSingleLorentzian([sampling[0], sampling[1]], peaks,  opts);
                    }
                }
                //console.log(optPeak);
                result.push({x: optPeak[0][0], y: optPeak[1][0], width: optPeak[2][0] * factor}); // From https://en.wikipedia.org/wiki/Gaussian_function#Properties}
            }
        }

    }
    return result;
}

function groupPeaks(peakList, nL) {
    var group = [];
    var groups = [];
    var i, j;
    var limits = [peakList[0].x, nL * peakList[0].width];
    var upperLimit, lowerLimit;
    //Merge forward
    for (i = 0; i < peakList.length; i++) {
        //If the 2 things overlaps
        if (Math.abs(peakList[i].x - limits[0]) < (nL * peakList[i].width + limits[1])) {
            //Add the peak to the group
            group.push(peakList[i]);
            //Update the group limits
            upperLimit = limits[0] + limits[1];
            if (peakList[i].x + nL * peakList[i].width > upperLimit) {
                upperLimit = peakList[i].x + nL * peakList[i].width;
            }
            lowerLimit = limits[0] - limits[1];
            if (peakList[i].x - nL * peakList[i].width < lowerLimit) {
                lowerLimit = peakList[i].x - nL * peakList[i].width;
            }
            limits = [(upperLimit + lowerLimit) / 2, Math.abs(upperLimit - lowerLimit) / 2];

        } else {
            groups.push({limits: limits, group: group});
            //var optmimalPeak = fitSpectrum(group,limits,spectrum);
            group = [peakList[i]];
            limits = [peakList[i].x, nL * peakList[i].width];
        }
    }
    groups.push({limits: limits, group: group});
    //Merge backward
    for (i = groups.length - 2; i >= 0; i--) {
        //The groups overlaps
        if (Math.abs(groups[i].limits[0] - groups[i + 1].limits[0]) <
            (groups[i].limits[1] + groups[i + 1].limits[1]) / 2) {
            for (j = 0; j < groups[i + 1].group.length; j++) {
                groups[i].group.push(groups[i + 1].group[j]);
            }
            upperLimit = groups[i].limits[0] + groups[i].limits[1];
            if (groups[i + 1].limits[0] + groups[i + 1].limits[1] > upperLimit) {
                upperLimit = groups[i + 1].limits[0] + groups[i + 1].limits[1];
            }
            lowerLimit = groups[i].limits[0] - groups[i].limits[1];
            if (groups[i + 1].limits[0] - groups[i + 1].limits[1] < lowerLimit) {
                lowerLimit = groups[i + 1].limits[0] - groups[i + 1].limits[1];
            }
            //console.log(limits);
            groups[i].limits = [(upperLimit + lowerLimit) / 2, Math.abs(upperLimit - lowerLimit) / 2];

            groups.splice(i + 1, 1);
        }
    }
    return groups;
}
/**
 * This function try to join the peaks that seems to belong to a broad signal in a single broad peak.
 * @param peakList
 * @param options
 */
function joinBroadPeaks(peakList, options) {
    var width = options.width;
    var broadLines = [];
    //Optimize the possible broad lines
    var max = 0, maxI = 0, count = 1;
    for (let i = peakList.length - 1; i >= 0; i--) {
        if (peakList[i].soft) {
            broadLines.push(peakList.splice(i, 1)[0]);
        }
    }
    //Push a feak peak
    broadLines.push({x: Number.MAX_VALUE});

    var candidates = [[broadLines[0].x,
                        broadLines[0].y]];
    var indexes = [0];

    for (let i = 1; i < broadLines.length; i++) {
        //console.log(broadLines[i-1].x+" "+broadLines[i].x);
        if (Math.abs(broadLines[i - 1].x - broadLines[i].x) < width) {
            candidates.push([broadLines[i].x, broadLines[i].y]);
            if (broadLines[i].y > max) {
                max = broadLines[i].y;
                maxI = i;
            }
            indexes.push(i);
            count++;
        } else {
            if (count > 2) {
                var fitted = Opt.optimizeSingleLorentzian(candidates,
                    {x: broadLines[maxI].x, y: max, width: Math.abs(candidates[0][0] - candidates[candidates.length - 1][0])});
                peakList.push({x: fitted[0][0], y: fitted[1][0], width: fitted[2][0], soft: false});

            } else {
                //Put back the candidates to the signals list
                indexes.map(function (index) {
                    peakList.push(broadLines[index]);
                });
            }
            candidates = [[broadLines[i].x, broadLines[i].y]];
            indexes = [i];
            max = broadLines[i].y;
            maxI = i;
            count = 1;
        }
    }

    peakList.sort(function (a, b) {
        return a.x - b.x;
    });

    return peakList;

}

/*
 var isPartOf = true
if(options.broadRatio>0){
 var broadLines=[[Number.MAX_VALUE,0,0]];
 //Optimize the possible broad lines
 var max=0, maxI=0,count=0;
 var candidates = [],broadLinesS=[];
 var isPartOf = false;

 for(var i=broadLines.length-1;i>0;i--){
 //console.log(broadLines[i][0]+" "+rangeX+" "+Math.abs(broadLines[i-1][0]-broadLines[i][0]));
 if(Math.abs(broadLines[i-1][0]-broadLines[i][0])<rangeX){

 candidates.push(broadLines[i]);
 if(broadLines[i][1]>max){
 max = broadLines[i][1];
 maxI = i;
 }
 count++;
 }
 else{
 isPartOf = true;
 if(count>30){ // TODO, an options ?
 isPartOf = false;
 //for(var j=0;j<signals.length;j++){
 //    if(Math.abs(broadLines[maxI][0]-signals[j][0])<rangeX)
 //       isPartOf = true;
 //    }
 //console.log("Was part of "+isPartOf);
 }
 if(isPartOf){
 for(var j=0;j<candidates.length;j++){
 signals.push([candidates[j][0], candidates[j][1], dx]);
 }
 }
 else{
 var fitted =  Opt.optimizeSingleLorentzian(candidates,{x:candidates[maxI][0],
 width:Math.abs(candidates[0][0]-candidates[candidates.length-1][0])},
 []);
 //console.log(fitted);
 signals.push([fitted[0][0],fitted[0][1],fitted[0][2]]);
 }
 candidates = [];
 max = 0;
 maxI = 0;
 count = 0;
 }
 }
 }*/

module.exports = {optimizePeaks: optimizePeaks, joinBroadPeaks: joinBroadPeaks};



/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var FFT = __webpack_require__(28);

var FFTUtils= {
    DEBUG : false,

    /**
     * Calculates the inverse of a 2D Fourier transform
     *
     * @param ft
     * @param ftRows
     * @param ftCols
     * @return
     */
    ifft2DArray : function(ft, ftRows, ftCols){
        var tempTransform = new Array(ftRows * ftCols);
        var nRows = ftRows / 2;
        var nCols = (ftCols - 1) * 2;
        // reverse transform columns
        FFT.init(nRows);
        var tmpCols = {re: new Array(nRows), im: new Array(nRows)};
        for (var iCol = 0; iCol < ftCols; iCol++) {
            for (var iRow = nRows - 1; iRow >= 0; iRow--) {
                tmpCols.re[iRow] = ft[(iRow * 2) * ftCols + iCol];
                tmpCols.im[iRow] = ft[(iRow * 2 + 1) * ftCols + iCol];
            }
            //Unnormalized inverse transform
            FFT.bt(tmpCols.re, tmpCols.im);
            for (var iRow = nRows - 1; iRow >= 0; iRow--) {
                tempTransform[(iRow * 2) * ftCols + iCol] = tmpCols.re[iRow];
                tempTransform[(iRow * 2 + 1) * ftCols + iCol] = tmpCols.im[iRow];
            }
        }

        // reverse row transform
        var finalTransform = new Array(nRows * nCols);
        FFT.init(nCols);
        var tmpRows = {re: new Array(nCols), im: new Array(nCols)};
        var scale = nCols * nRows;
        for (var iRow = 0; iRow < ftRows; iRow += 2) {
            tmpRows.re[0] = tempTransform[iRow * ftCols];
            tmpRows.im[0] = tempTransform[(iRow + 1) * ftCols];
            for (var iCol = 1; iCol < ftCols; iCol++) {
                tmpRows.re[iCol] = tempTransform[iRow * ftCols + iCol];
                tmpRows.im[iCol] = tempTransform[(iRow + 1) * ftCols + iCol];
                tmpRows.re[nCols - iCol] = tempTransform[iRow * ftCols + iCol];
                tmpRows.im[nCols - iCol] = -tempTransform[(iRow + 1) * ftCols + iCol];
            }
            //Unnormalized inverse transform
            FFT.bt(tmpRows.re, tmpRows.im);

            var indexB = (iRow / 2) * nCols;
            for (var iCol = nCols - 1; iCol >= 0; iCol--) {
                finalTransform[indexB + iCol] = tmpRows.re[iCol] / scale;
            }
        }
        return finalTransform;
    },
    /**
     * Calculates the fourier transform of a matrix of size (nRows,nCols) It is
     * assumed that both nRows and nCols are a power of two
     *
     * On exit the matrix has dimensions (nRows * 2, nCols / 2 + 1) where the
     * even rows contain the real part and the odd rows the imaginary part of the
     * transform
     * @param data
     * @param nRows
     * @param nCols
     * @return
     */
    fft2DArray:function(data, nRows, nCols, opt) {
        var options = Object.assign({},{inplace:true})
        var ftCols = (nCols / 2 + 1);
        var ftRows = nRows * 2;
        var tempTransform = new Array(ftRows * ftCols);
        FFT.init(nCols);
        // transform rows
        var tmpRows = {re: new Array(nCols), im: new Array(nCols)};
        var row1 = {re: new Array(nCols), im: new Array(nCols)}
        var row2 = {re: new Array(nCols), im: new Array(nCols)}
        var index, iRow0, iRow1, iRow2, iRow3;
        for (var iRow = 0; iRow < nRows / 2; iRow++) {
            index = (iRow * 2) * nCols;
            tmpRows.re = data.slice(index, index + nCols);

            index = (iRow * 2 + 1) * nCols;
            tmpRows.im = data.slice(index, index + nCols);

            FFT.fft1d(tmpRows.re, tmpRows.im);

            this.reconstructTwoRealFFT(tmpRows, row1, row2);
            //Now lets put back the result into the output array
            iRow0 = (iRow * 4) * ftCols;
            iRow1 = (iRow * 4 + 1) * ftCols;
            iRow2 = (iRow * 4 + 2) * ftCols;
            iRow3 = (iRow * 4 + 3) * ftCols;
            for (var k = ftCols - 1; k >= 0; k--) {
                tempTransform[iRow0 + k] = row1.re[k];
                tempTransform[iRow1 + k] = row1.im[k];
                tempTransform[iRow2 + k] = row2.re[k];
                tempTransform[iRow3 + k] = row2.im[k];
            }
        }

        //console.log(tempTransform);
        row1 = null;
        row2 = null;
        // transform columns
        var finalTransform = new Array(ftRows * ftCols);

        FFT.init(nRows);
        var tmpCols = {re: new Array(nRows), im: new Array(nRows)};
        for (var iCol = ftCols - 1; iCol >= 0; iCol--) {
            for (var iRow = nRows - 1; iRow >= 0; iRow--) {
                tmpCols.re[iRow] = tempTransform[(iRow * 2) * ftCols + iCol];
                tmpCols.im[iRow] = tempTransform[(iRow * 2 + 1) * ftCols + iCol];
                //TODO Chech why this happens
                if(isNaN(tmpCols.re[iRow])){
                    tmpCols.re[iRow]=0;
                }
                if(isNaN(tmpCols.im[iRow])){
                    tmpCols.im[iRow]=0;
                }
            }
            FFT.fft1d(tmpCols.re, tmpCols.im);
            for (var iRow = nRows - 1; iRow >= 0; iRow--) {
                finalTransform[(iRow * 2) * ftCols + iCol] = tmpCols.re[iRow];
                finalTransform[(iRow * 2 + 1) * ftCols + iCol] = tmpCols.im[iRow];
            }
        }

        //console.log(finalTransform);
        return finalTransform;

    },
    /**
     *
     * @param fourierTransform
     * @param realTransform1
     * @param realTransform2
     *
     * Reconstructs the individual Fourier transforms of two simultaneously
     * transformed series. Based on the Symmetry relationships (the asterisk
     * denotes the complex conjugate)
     *
     * F_{N-n} = F_n^{*} for a purely real f transformed to F
     *
     * G_{N-n} = G_n^{*} for a purely imaginary g transformed to G
     *
     */
    reconstructTwoRealFFT:function(fourierTransform, realTransform1, realTransform2) {
        var length = fourierTransform.re.length;

        // the components n=0 are trivial
        realTransform1.re[0] = fourierTransform.re[0];
        realTransform1.im[0] = 0.0;
        realTransform2.re[0] = fourierTransform.im[0];
        realTransform2.im[0] = 0.0;
        var rm, rp, im, ip, j;
        for (var i = length / 2; i > 0; i--) {
            j = length - i;
            rm = 0.5 * (fourierTransform.re[i] - fourierTransform.re[j]);
            rp = 0.5 * (fourierTransform.re[i] + fourierTransform.re[j]);
            im = 0.5 * (fourierTransform.im[i] - fourierTransform.im[j]);
            ip = 0.5 * (fourierTransform.im[i] + fourierTransform.im[j]);
            realTransform1.re[i] = rp;
            realTransform1.im[i] = im;
            realTransform1.re[j] = rp;
            realTransform1.im[j] = -im;
            realTransform2.re[i] = ip;
            realTransform2.im[i] = -rm;
            realTransform2.re[j] = ip;
            realTransform2.im[j] = rm;
        }
    },

    /**
     * In place version of convolute 2D
     *
     * @param ftSignal
     * @param ftFilter
     * @param ftRows
     * @param ftCols
     * @return
     */
    convolute2DI:function(ftSignal, ftFilter, ftRows, ftCols) {
        var re, im;
        for (var iRow = 0; iRow < ftRows / 2; iRow++) {
            for (var iCol = 0; iCol < ftCols; iCol++) {
                //
                re = ftSignal[(iRow * 2) * ftCols + iCol]
                    * ftFilter[(iRow * 2) * ftCols + iCol]
                    - ftSignal[(iRow * 2 + 1) * ftCols + iCol]
                    * ftFilter[(iRow * 2 + 1) * ftCols + iCol];
                im = ftSignal[(iRow * 2) * ftCols + iCol]
                    * ftFilter[(iRow * 2 + 1) * ftCols + iCol]
                    + ftSignal[(iRow * 2 + 1) * ftCols + iCol]
                    * ftFilter[(iRow * 2) * ftCols + iCol];
                //
                ftSignal[(iRow * 2) * ftCols + iCol] = re;
                ftSignal[(iRow * 2 + 1) * ftCols + iCol] = im;
            }
        }
    },
    /**
     *
     * @param data
     * @param kernel
     * @param nRows
     * @param nCols
     * @returns {*}
     */
    convolute:function(data, kernel, nRows, nCols, opt){
        var ftSpectrum = new Array(nCols * nRows);
        for (var i = 0; i<nRows * nCols; i++){
            ftSpectrum[i] = data[i];
        }

        ftSpectrum = this.fft2DArray(ftSpectrum, nRows, nCols);


        var dimR = kernel.length;
        var dimC = kernel[0].length;
        var ftFilterData = new Array(nCols * nRows);
        for(var i=0;i<nCols * nRows;i++){
            ftFilterData[i]=0;
        }

        var iRow, iCol;
        var shiftR = Math.floor((dimR - 1) / 2);
        var shiftC = Math.floor((dimC - 1) / 2);
        for (var ir = 0; ir < dimR; ir++) {
            iRow = (ir - shiftR + nRows) % nRows;
            for (var ic = 0; ic < dimC; ic++) {
                iCol = (ic - shiftC + nCols) % nCols;
                ftFilterData[iRow * nCols + iCol] = kernel[ir][ic];
            }
        }
        ftFilterData = this.fft2DArray(ftFilterData, nRows, nCols);

        var ftRows = nRows * 2;
        var ftCols = nCols / 2 + 1;
        this.convolute2DI(ftSpectrum, ftFilterData, ftRows, ftCols);

        return this.ifft2DArray(ftSpectrum, ftRows, ftCols);
    },


    toRadix2:function(data, nRows, nCols){
        var i,j,irow, icol;
        var cols = nCols, rows = nRows, prows=0, pcols=0;
        if(!(nCols !== 0 && (nCols & (nCols - 1)) === 0)) {
            //Then we have to make a pading to next radix2
            cols = 0;
            while((nCols>>++cols)!=0);
            cols=1<<cols;
            pcols = cols-nCols;
        }
        if(!(nRows !== 0 && (nRows & (nRows - 1)) === 0)) {
            //Then we have to make a pading to next radix2
            rows = 0;
            while((nRows>>++rows)!=0);
            rows=1<<rows;
            prows = (rows-nRows)*cols;
        }
        if(rows==nRows&&cols==nCols)//Do nothing. Returns the same input!!! Be careful
            return {data:data, rows:nRows, cols:nCols};

        var output = new Array(rows*cols);
        var shiftR = Math.floor((rows-nRows)/2)-nRows;
        var shiftC = Math.floor((cols-nCols)/2)-nCols;

        for( i=0;i<rows;i++){
            irow = i*cols;
            icol = ((i-shiftR) % nRows) * nCols;
            for( j = 0;j<cols;j++){
                output[irow+j]=data[(icol+(j-shiftC) % nCols) ];
            }
        }
        return {data:output, rows:rows, cols:cols};
    },

    /**
     * Crop the given matrix to fit the corresponding number of rows and columns
     */
    crop:function(data, rows, cols, nRows, nCols, opt){

        if(rows == nRows && cols == nCols)//Do nothing. Returns the same input!!! Be careful
            return data;

        var options = Object.assign({}, opt);

        var output = new Array(nCols*nRows);

        var shiftR = Math.floor((rows-nRows)/2);
        var shiftC = Math.floor((cols-nCols)/2);
        var irow, icol, i, j;

        for( i=0;i<nRows;i++){
            irow = i*nRows;
            icol = (i+shiftR)*cols;
            for( j = 0;j<nCols;j++){
                output[irow+j]=data[icol+(j+shiftC)];
            }
        }

        return output;
    }
}

module.exports = FFTUtils;


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.FFTUtils = __webpack_require__(66);
exports.FFT = __webpack_require__(28);


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

'use strict;'
/**
 * Created by acastillo on 7/7/16.
 */
var FFTUtils = __webpack_require__(67).FFTUtils;

function convolutionFFT(input, kernel, opt) {
    var tmp = matrix2Array(input);
    var inputData = tmp.data;
    var options = Object.assign({normalize : false, divisor : 1, rows:tmp.rows, cols:tmp.cols}, opt);

    var nRows, nCols;
    if (options.rows&&options.cols) {
        nRows = options.rows;
        nCols = options.cols;
    }
    else {
        throw new Error("Invalid number of rows or columns " + nRows + " " + nCols)
    }

    var divisor = options.divisor;
    var i,j;
    var kHeight =  kernel.length;
    var kWidth =  kernel[0].length;
    if (options.normalize) {
        divisor = 0;
        for (i = 0; i < kHeight; i++)
            for (j = 0; j < kWidth; j++)
                divisor += kernel[i][j];
    }
    if (divisor === 0) {
        throw new RangeError('convolution: The divisor is equal to zero');
    }

    var radix2Sized = FFTUtils.toRadix2(inputData, nRows, nCols);
    var conv = FFTUtils.convolute(radix2Sized.data, kernel, radix2Sized.rows, radix2Sized.cols);
    conv = FFTUtils.crop(conv, radix2Sized.rows, radix2Sized.cols, nRows, nCols);

    if(divisor!=0){
        for(i=0;i<conv.length;i++){
            conv[i]/divisor;
        }
    }

    return conv;
}

function convolutionDirect(input, kernel, opt) {
    var tmp = matrix2Array(input);
    var inputData = tmp.data;
    var options = Object.assign({normalize : false, divisor : 1, rows:tmp.rows, cols:tmp.cols}, opt);

    var nRows, nCols;
    if (options.rows&&options.cols) {
        nRows = options.rows;
        nCols = options.cols;
    }
    else {
        throw new Error("Invalid number of rows or columns " + nRows + " " + nCols)
    }

    var divisor = options.divisor;
    var kHeight =  kernel.length;
    var kWidth =  kernel[0].length;
    var i, j, x, y, index, sum, kVal, row, col;
    if (options.normalize) {
        divisor = 0;
        for (i = 0; i < kHeight; i++)
            for (j = 0; j < kWidth; j++)
                divisor += kernel[i][j];
    }
    if (divisor === 0) {
        throw new RangeError('convolution: The divisor is equal to zero');
    }

    var output = new Array(nRows*nCols);

    var hHeight = Math.floor(kHeight/2);
    var hWidth = Math.floor(kWidth/2);

    for (y = 0; y < nRows; y++) {
        for (x = 0; x < nCols; x++) {
            sum = 0;
            for ( j = 0; j < kHeight; j++) {
                for ( i = 0; i < kWidth; i++) {
                    kVal = kernel[kHeight - j - 1][kWidth - i - 1];
                    row = (y + j -hHeight + nRows) % nRows;
                    col = (x + i - hWidth + nCols) % nCols;
                    index = (row * nCols + col);
                    sum += inputData[index] * kVal;
                }
            }
            index = (y * nCols + x);
            output[index]= sum / divisor;
        }
    }
    return output;
}



function LoG(sigma, nPoints, options){
    var factor = 1000;
    if(options&&options.factor){
        factor = options.factor;
    }

    var kernel = new Array(nPoints);
    var i,j,tmp,y2,tmp2;

    factor*=-1;//-1/(Math.PI*Math.pow(sigma,4));
    var center = (nPoints-1)/2;
    var sigma2 = 2*sigma*sigma;
    for( i=0;i<nPoints;i++){
        kernel[i]=new Array(nPoints);
        y2 = (i-center)*(i-center);
        for( j=0;j<nPoints;j++){
            tmp = -((j-center)*(j-center)+y2)/sigma2;
            kernel[i][j]=Math.round(factor*(1+tmp)*Math.exp(tmp));
        }
    }

    return kernel;
}

function matrix2Array(input){
    var inputData=input;
    var nRows, nCols;
    if(typeof input[0]!="number"){
        nRows = input.length;
        nCols = input[0].length;
        inputData = new Array(nRows*nCols);
        for(var i=0;i<nRows;i++){
            for(var j=0;j<nCols;j++){
                inputData[i*nCols+j]=input[i][j];
            }
        }
    }
    else{
        var tmp = Math.sqrt(input.length);
        if(Number.isInteger(tmp)){
            nRows=tmp;
            nCols=tmp;
        }
    }

    return {data:inputData,rows:nRows,cols:nCols};
}


module.exports = {
    fft:convolutionFFT,
    direct:convolutionDirect,
    kernelFactory:{LoG:LoG},
    matrix2Array:matrix2Array
};

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const DisjointSet = __webpack_require__(61);

const direction4X = [-1, 0];
const direction4Y = [0, -1];
const neighbours4 = [null, null];

const direction8X = [-1, -1, 0, 1];
const direction8Y = [0, -1, -1, -1];
const neighbours8 = [null, null, null, null];

function ccLabeling(mask, width, height, options) {
    options = options || {};
    const neighbours = options.neighbours || 8;

    var directionX;
    var directionY;
    var neighboursList;
    if (neighbours === 8) {
        directionX = direction8X;
        directionY = direction8Y;
        neighboursList = neighbours8;
    } else if (neighbours === 4) {
        directionX = direction4X;
        directionY = direction4Y;
        neighboursList = neighbours4;
    } else {
        throw new RangeError('unsupported neighbours count: ' + neighbours);
    }

    const size = mask.length;
    const labels = new Array(size);
    const pixels = new Int16Array(size);
    const linked = new DisjointSet();
    var index;
    var currentLabel = 1;
    for (var j = 0; j < height; j++) {
        for (var i = 0; i < width; i++) {
            // true means out of background
            var smallestNeighbor = null;
            index = i + j * width;

            if (mask[index]) {
                for (var k = 0; k < neighboursList.length; k++) {
                    var ii = i + directionX[k];
                    var jj = j + directionY[k];
                    if (ii >= 0 && jj >= 0 && ii < width && jj < height) {
                        var neighbor = labels[ii + jj * width];
                        if (!neighbor) {
                            neighboursList[k] = null;
                        } else {
                            neighboursList[k] = neighbor;
                            if (!smallestNeighbor || neighboursList[k].value < smallestNeighbor.value) {
                                smallestNeighbor = neighboursList[k];
                            }
                        }
                    }
                }
                if (!smallestNeighbor) {
                    labels[index] = linked.add(currentLabel++);
                } else {
                    labels[index] = smallestNeighbor;
                    for (var k = 0; k < neighboursList.length; k++) {
                        if (neighboursList[k] && neighboursList[k] !== smallestNeighbor) {
                            linked.union(smallestNeighbor, neighboursList[k]);
                        }
                    }
                }
            }
        }
    }

    for (var j = 0; j < height; j++) {
        for (var i = 0; i < width; i++) {
            index = i + j * width;
            if (mask[index]) {
                pixels[index] = linked.find(labels[index]).value;
            }
        }
    }
    return pixels;

}

module.exports = ccLabeling;


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Created by acastillo on 7/7/16.
 */
var StatArray = __webpack_require__(5).array;
var convolution = __webpack_require__(68);
var labeling = __webpack_require__(69);


const smallFilter = [
    [0, 0, 1, 2, 2, 2, 1, 0, 0],
    [0, 1, 4, 7, 7, 7, 4, 1, 0],
    [1, 4, 5, 3, 0, 3, 5, 4, 1],
    [2, 7, 3, -12, -23, -12, 3, 7, 2],
    [2, 7, 0, -23, -40, -23, 0, 7, 2],
    [2, 7, 3, -12, -23, -12, 3, 7, 2],
    [1, 4, 5, 3, 0, 3, 5, 4, 1],
    [0, 1, 3, 7, 7, 7, 3, 1, 0],
    [0, 0, 1, 2, 2, 2, 1, 0, 0]];

const DEBUG = false;

/**
 Detects all the 2D-peaks in the given spectrum based on center of mass logic.
 */
function findPeaks2DRegion(input, opt) {
    var options = Object.assign({},{nStdev:3, kernel:smallFilter}, opt);
    var tmp = convolution.matrix2Array(input);
    var inputData = tmp.data;
    var i;
    if(tmp.rows&&tmp.cols){
        options.rows = tmp.rows;
        options.cols = tmp.cols;
    }
    var nRows = options.rows;
    var nCols = options.cols;
    if(!nRows||!nCols){
        throw new Error("Invalid number of rows or columns "+nRows+" "+nCols);
    }

    var customFilter = options.kernel;
    var cs = options.filteredData;
    if(!cs)
        cs = convolution.fft(inputData, customFilter, options);

    var nStdDev = options.nStdev;

    var threshold = 0;
    for( i=nCols*nRows-2;i>=0;i--)
        threshold+=Math.pow(cs[i]-cs[i+1],2);
    threshold=-Math.sqrt(threshold);
    threshold*=nStdDev/nRows;

    var bitmask = new Array(nCols * nRows);
    for( i=nCols * nRows-1;i>=0;i--){
        bitmask[i]=0;
    }
    var nbDetectedPoints = 0;
    for ( i = cs.length-1; i >=0 ; i--) {
        if (cs[i] < threshold) {
            bitmask[i] = 1;
            nbDetectedPoints++;
        }
    }

    var pixels = labeling(bitmask, nCols, nRows, {neighbours:8});
    var peakList  = extractPeaks(pixels, inputData, nRows, nCols);

    if (peakList.length > 0&&DEBUG) {
        console.log("No peak found");
    }
    return peakList;
}
/**
 Detects all the 2D-peaks in the given spectrum based on the Max logic.
 amc
 */
function findPeaks2DMax(input, opt) {
    var options = Object.assign({},{nStdev:3, kernel:smallFilter}, opt);
    var tmp = convolution.matrix2Array(input);
    var inputData = tmp.data;

    if(tmp.rows&&tmp.cols){
        options.rows = tmp.rows;
        options.cols = tmp.cols;
    }
    var nRows = options.rows;
    var nCols = options.cols;
    if(!nRows||!nCols){
        throw new Error("Invalid number of rows or columns "+nRows+" "+nCols);
    }

    var customFilter = options.kernel;
    var cs = options.filteredData;
    if(!cs)
        cs = convolution.fft(inputData, customFilter, options);


    var nStdDev = options.nStdev;
    var threshold = 0;
    for( var i=nCols*nRows-2;i>=0;i--)
        threshold+=Math.pow(cs[i]-cs[i+1],2);
    threshold=-Math.sqrt(threshold);
    threshold*=nStdDev/nRows;

    var rowI,colI;
    var peakListMax = [];
    var tmpIndex = 0;
    for ( var i = 0; i < cs.length; i++) {
        if (cs[i] < threshold) {
            //It is a peak?
            rowI=Math.floor(i/nCols);
            colI=i%nCols;
            //Verifies if this point is a peak;
            if(rowI>0&&rowI+1<nRows&&colI+1<nCols&&colI>0){
                //It is the minimum in the same row
                if(cs[i]<cs[i+1]&&cs[i]<cs[i-1]){
                    //It is the minimum in the previous row
                    tmpIndex=(rowI-1)*nCols+colI;
                    if(cs[i]<cs[tmpIndex-1]&&cs[i]<cs[tmpIndex]&&cs[i]<cs[tmpIndex+1]){
                        //It is the minimum in the next row
                        tmpIndex=(rowI+1)*nCols+colI;
                        if(cs[i]<cs[tmpIndex-1]&&cs[i]<cs[tmpIndex]&&cs[i]<cs[tmpIndex+1]){
                            peakListMax.push({x:colI,y:rowI,z:inputData[i]});
                        }
                    }
                }
            }
        }
    }
    return peakListMax;
}

function extractPeaks(pixels, data, nRow, nCols){
    //console.log(JSON.stringify(pixels));
    //How many different groups we have?
    var labels = {};
    var row, col, tmp, i;
    for( i = 0; i < pixels.length; i++){
        if(pixels[i]!=0){
            col = i%nCols;
            row = (i-col) / nCols;
            if(labels[pixels[i]]){
                tmp = labels[pixels[i]];
                tmp.x+=col*data[i];
                tmp.y+=row*data[i];
                tmp.z+=data[i];
                if( col < tmp.minX)
                    tmp.minX = col;
                if( col > tmp.maxX)
                    tmp.maxX = col;
                if( row < tmp.minY)
                    tmp.minY = row;
                if( row > tmp.maxY)
                    tmp.maxY = row;
            }
            else{
                labels[pixels[i]]={
                    x:col*data[i],
                    y:row*data[i],
                    z:data[i],
                    minX:col,
                    maxX:col,
                    minY:row,
                    maxY:row
                };
            }
        }
    }
    var keys = Object.keys(labels);
    var peakList = new Array(keys.length);
    for( i = 0; i < keys.length; i++ ){
        peakList[i] = labels[keys[i]];
        peakList[i].x/=peakList[i].z;
        peakList[i].y/=peakList[i].z;
    }
    return peakList;
}

module.exports={
    findPeaks2DRegion:findPeaks2DRegion,
    findPeaks2DMax:findPeaks2DMax
};


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by acastillo on 8/5/15.
 */
var Matrix = __webpack_require__(4);
var math = __webpack_require__(29);

var DEBUG = false;
/** Levenberg Marquardt curve-fitting: minimize sum of weighted squared residuals
 ----------  INPUT  VARIABLES  -----------
 func   = function of n independent variables, 't', and m parameters, 'p',
 returning the simulated model: y_hat = func(t,p,c)
 p      = n-vector of initial guess of parameter values
 t      = m-vectors or matrix of independent variables (used as arg to func)
 y_dat  = m-vectors or matrix of data to be fit by func(t,p)
 weight = weighting vector for least squares fit ( weight >= 0 ) ...
 inverse of the standard measurement errors
 Default:  sqrt(d.o.f. / ( y_dat' * y_dat ))
 dp     = fractional increment of 'p' for numerical derivatives
 dp(j)>0 central differences calculated
 dp(j)<0 one sided 'backwards' differences calculated
 dp(j)=0 sets corresponding partials to zero; i.e. holds p(j) fixed
 Default:  0.001;
 p_min  = n-vector of lower bounds for parameter values
 p_max  = n-vector of upper bounds for parameter values
 c      = an optional matrix of values passed to func(t,p,c)
 opts   = vector of algorithmic parameters
 parameter    defaults    meaning
 opts(1)  =  prnt            3        >1 intermediate results; >2 plots
 opts(2)  =  MaxIter      10*Npar     maximum number of iterations
 opts(3)  =  epsilon_1       1e-3     convergence tolerance for gradient
 opts(4)  =  epsilon_2       1e-3     convergence tolerance for parameters
 opts(5)  =  epsilon_3       1e-3     convergence tolerance for Chi-square
 opts(6)  =  epsilon_4       1e-2     determines acceptance of a L-M step
 opts(7)  =  lambda_0        1e-2     initial value of L-M paramter
 opts(8)  =  lambda_UP_fac   11       factor for increasing lambda
 opts(9)  =  lambda_DN_fac    9       factor for decreasing lambda
 opts(10) =  Update_Type      1       1: Levenberg-Marquardt lambda update
 2: Quadratic update
 3: Nielsen's lambda update equations

 ----------  OUTPUT  VARIABLES  -----------
 p       = least-squares optimal estimate of the parameter values
 X2      = Chi squared criteria
 sigma_p = asymptotic standard error of the parameters
 sigma_y = asymptotic standard error of the curve-fit
 corr    = correlation matrix of the parameters
 R_sq    = R-squared cofficient of multiple determination
 cvg_hst = convergence history

 Henri Gavin, Dept. Civil & Environ. Engineering, Duke Univ. 22 Sep 2013
 modified from: http://octave.sourceforge.net/optim/function/leasqr.html
 using references by
 Press, et al., Numerical Recipes, Cambridge Univ. Press, 1992, Chapter 15.
 Sam Roweis       http://www.cs.toronto.edu/~roweis/notes/lm.pdf
 Manolis Lourakis http://www.ics.forth.gr/~lourakis/levmar/levmar.pdf
 Hans Nielson     http://www2.imm.dtu.dk/~hbn/publ/TR9905.ps
 Mathworks        optimization toolbox reference manual
 K. Madsen, H.B., Nielsen, and O. Tingleff
 http://www2.imm.dtu.dk/pubdb/views/edoc_download.php/3215/pdf/imm3215.pdf
 */
var LM = {

    optimize: function(func,p,t,y_dat,weight,dp,p_min,p_max,c,opts){

        var tensor_parameter = 0;			// set to 1 of parameter is a tensor

        var iteration  = 0;			// iteration counter
        //func_calls = 0;			// running count of function evaluations

        if((typeof p[0])!="object"){
            for(var i=0;i< p.length;i++){
                p[i]=[p[i]];
            }

        }
        //p = p(:); y_dat = y_dat(:);		// make column vectors
        var i,k;
        var eps = 2^-52;
        var Npar   = p.length;//length(p); 			// number of parameters
        var Npnt   = y_dat.length;//length(y_dat);		// number of data points
        var p_old  = Matrix.zeros(Npar,1);		// previous set of parameters
        var y_old  = Matrix.zeros(Npnt,1);		// previous model, y_old = y_hat(t;p_old)
        var X2     = 1e-2/eps;			// a really big initial Chi-sq value
        var X2_old = 1e-2/eps;			// a really big initial Chi-sq value
        var J =  Matrix.zeros(Npnt,Npar);


        if (t.length != y_dat.length) {
            console.log('lm.m error: the length of t must equal the length of y_dat');

            length_t = t.length;
            length_y_dat = y_dat.length;
            var X2 = 0, corr = 0, sigma_p = 0, sigma_y = 0, R_sq = 0, cvg_hist = 0;
            if (!tensor_parameter) {
                return;
            }
        }

        weight = weight||Math.sqrt((Npnt-Npar+1)/(math.multiply(math.transpose(y_dat),y_dat)));
        dp = dp || 0.001;
        p_min   = p_min || math.multiply(Math.abs(p),-100);
        p_max   = p_max || math.multiply(Math.abs(p),100);
        c = c || 1;
        // Algorithmic Paramters
        //prnt MaxIter  eps1  eps2  epx3  eps4  lam0  lamUP lamDN UpdateType
        opts = opts ||[  3,10*Npar, 1e-3, 1e-3, 1e-3, 1e-2, 1e-2, 11, 9, 1 ];

        var prnt          = opts[0];	// >1 intermediate results; >2 plots
        var MaxIter       = opts[1];	// maximum number of iterations
        var epsilon_1     = opts[2];	// convergence tolerance for gradient
        var epsilon_2     = opts[3];	// convergence tolerance for parameter
        var epsilon_3     = opts[4];	// convergence tolerance for Chi-square
        var epsilon_4     = opts[5];	// determines acceptance of a L-M step
        var lambda_0      = opts[6];	// initial value of damping paramter, lambda
        var lambda_UP_fac = opts[7];	// factor for increasing lambda
        var lambda_DN_fac = opts[8];	// factor for decreasing lambda
        var Update_Type   = opts[9];	// 1: Levenberg-Marquardt lambda update
        // 2: Quadratic update
        // 3: Nielsen's lambda update equations

        if ( tensor_parameter && prnt == 3 ) prnt = 2;


        if(!dp.length || dp.length == 1){
            var dp_array = new Array(Npar);
            for(var i=0;i<Npar;i++)
                dp_array[i]=[dp];
            dp=dp_array;
        }

        // indices of the parameters to be fit
        var idx   = [];
        for(i=0;i<dp.length;i++){
            if(dp[i][0]!=0){
                idx.push(i);
            }
        }

        var Nfit = idx.length;			// number of parameters to fit
        var stop = false;				// termination flag

        var weight_sq = null;
        //console.log(weight);
        if ( !weight.length || weight.length < Npnt )	{
            // squared weighting vector
            //weight_sq = ( weight(1)*ones(Npnt,1) ).^2;
            //console.log("weight[0] "+typeof weight[0]);
            var tmp = math.multiply(Matrix.ones(Npnt,1),weight[0]);
            weight_sq = math.dotMultiply(tmp,tmp);
        }
        else{
            //weight_sq = (weight(:)).^2;
            weight_sq = math.dotMultiply(weight,weight);
        }


        // initialize Jacobian with finite difference calculation
        //console.log("J "+weight_sq);
        var result = this.lm_matx(func,t,p_old,y_old,1,J,p,y_dat,weight_sq,dp,c);
        var JtWJ = result.JtWJ,JtWdy=result.JtWdy,X2=result.Chi_sq,y_hat=result.y_hat,J=result.J;
        //[JtWJ,JtWdy,X2,y_hat,J] = this.lm_matx(func,t,p_old,y_old,1,J,p,y_dat,weight_sq,dp,c);
        //console.log(JtWJ);

        if ( Math.max(Math.abs(JtWdy)) < epsilon_1 ){
            console.log(' *** Your Initial Guess is Extremely Close to Optimal ***')
            console.log(' *** epsilon_1 = ', epsilon_1);
            stop = true;
        }


        switch(Update_Type){
            case 1: // Marquardt: init'l lambda
                lambda  = lambda_0;
                break;
            default:    // Quadratic and Nielsen
                lambda  = lambda_0 * Math.max(math.diag(JtWJ));
                nu=2;
        }
        //console.log(X2);
        X2_old = X2; // previous value of X2
        //console.log(MaxIter+" "+Npar);
        //var cvg_hst = Matrix.ones(MaxIter,Npar+3);		// initialize convergence history
        var h = null;
        while ( !stop && iteration <= MaxIter ) {		// --- Main Loop
            iteration = iteration + 1;
            // incremental change in parameters
            switch(Update_Type){
                case 1:					// Marquardt
                    //h = ( JtWJ + lambda * math.diag(math.diag(JtWJ)) ) \ JtWdy;
                    //h = math.multiply(math.inv(JtWdy),math.add(JtWJ,math.multiply(lambda,math.diag(math.diag(Npar)))));
                    h = math.solve(math.add(JtWJ,math.multiply(math.diag(math.diag(JtWJ)),lambda)),JtWdy);
                    break;
                default:					// Quadratic and Nielsen
                    //h = ( JtWJ + lambda * math.eye(Npar) ) \ JtWdy;

                    h = math.solve(math.add(JtWJ,math.multiply( Matrix.eye(Npar),lambda)),JtWdy);
            }

            /*for(var k=0;k< h.length;k++){
             h[k]=[h[k]];
             }*/
            //console.log("h "+h);
            //h=math.matrix(h);
            //  big = max(abs(h./p)) > 2;
            //this is a big step
            // --- Are parameters [p+h] much better than [p] ?
            var hidx = new Array(idx.length);
            for(k=0;k<idx.length;k++){
                hidx[k]=h[idx[k]];
            }
            var p_try = math.add(p, hidx);// update the [idx] elements

            for(k=0;k<p_try.length;k++){
                p_try[k][0]=Math.min(Math.max(p_min[k][0],p_try[k][0]),p_max[k][0]);
            }
            // p_try = Math.min(Math.max(p_min,p_try),p_max);           // apply constraints

            var delta_y = math.subtract(y_dat, func(t,p_try,c));       // residual error using p_try
            //func_calls = func_calls + 1;
            //X2_try = delta_y' * ( delta_y .* weight_sq );  // Chi-squared error criteria

            var X2_try = math.multiply(math.transpose(delta_y),math.dotMultiply(delta_y,weight_sq));

            if ( Update_Type == 2 ){  			  // Quadratic
                //    One step of quadratic line update in the h direction for minimum X2
                //var alpha =  JtWdy'*h / ( (X2_try - X2)/2 + 2*JtWdy'*h ) ;
                var JtWdy_th = math.multiply(math.transpose(JtWdy),h);
                var alpha =  math.multiply(JtWdy_th,math.inv(math.add(math.multiply(math.subtract(X2_try - X2),1/2)),math.multiply(JtWdy_th,2)));//JtWdy'*h / ( (X2_try - X2)/2 + 2*JtWdy'*h ) ;

                h = math.multiply(alpha, h);
                for(var k=0;k<idx.length;k++){
                    hidx[k]=h[idx[k]];
                }

                p_try = math.add(p ,hidx);                     // update only [idx] elements
                p_try = math.min(math.max(p_min,p_try),p_max);          // apply constraints

                delta_y = math.subtract(y_dat, func(t,p_try,c));      // residual error using p_try
                // func_calls = func_calls + 1;
                //X2_try = delta_y' * ( delta_y .* weight_sq ); // Chi-squared error criteria
                X2_try = math.multiply(math.transpose(delta_y), mat.dotMultiply(delta_y, weight_sq));
            }

            //rho = (X2 - X2_try) / ( 2*h' * (lambda * h + JtWdy) ); // Nielsen
            var rho = (X2-X2_try)/math.multiply(math.multiply(math.transpose(h),2),math.add(math.multiply(lambda, h),JtWdy));
            //console.log("rho "+rho);
            if ( rho > epsilon_4 ) {		// it IS significantly better
                //console.log("Here");
                dX2 = X2 - X2_old;
                X2_old = X2;
                p_old = p;
                y_old = y_hat;
                p = p_try;			// accept p_try

                result = this.lm_matx(func, t, p_old, y_old, dX2, J, p, y_dat, weight_sq, dp, c);
                JtWJ = result.JtWJ,JtWdy=result.JtWdy,X2=result.Chi_sq,y_hat=result.y_hat,J=result.J;
                // decrease lambda ==> Gauss-Newton method

                switch (Update_Type) {
                    case 1:							// Levenberg
                        lambda = Math.max(lambda / lambda_DN_fac, 1.e-7);
                        break;
                    case 2:							// Quadratic
                        lambda = Math.max(lambda / (1 + alpha), 1.e-7);
                        break;
                    case 3:							// Nielsen
                        lambda = math.multiply(Math.max(1 / 3, 1 - (2 * rho - 1) ^ 3),lambda);
                        nu = 2;
                        break;
                }
            }
            else {					// it IS NOT better
                X2 = X2_old;			// do not accept p_try
                if (iteration%(2 * Npar)==0) {	// rank-1 update of Jacobian
                    result = this.lm_matx(func, t, p_old, y_old, -1, J, p, y_dat, weight_sq, dp, c);
                    JtWJ = result.JtWJ,JtWdy=result.JtWdy,dX2=result.Chi_sq,y_hat=result.y_hat,J=result.J;
                }

                // increase lambda  ==> gradient descent method
                switch (Update_Type) {
                    case 1:							// Levenberg
                        lambda = Math.min(lambda * lambda_UP_fac, 1.e7);
                        break;
                    case 2:							// Quadratic
                        lambda = lambda + Math.abs((X2_try - X2) / 2 / alpha);
                        break;
                    case 3:						// Nielsen
                        lambda = lambda * nu;
                        nu = 2 * nu;
                        break;
                }
            }
        }// --- End of Main Loop

        // --- convergence achieved, find covariance and confidence intervals

        // equal weights for paramter error analysis
        weight_sq = math.multiply(math.multiply(math.transpose(delta_y),delta_y), Matrix.ones(Npnt,1));

        weight_sq.apply(function(i,j){
            weight_sq[i][j] = (Npnt-Nfit+1)/weight_sq[i][j];
        });
        //console.log(weight_sq);
        result = this.lm_matx(func,t,p_old,y_old,-1,J,p,y_dat,weight_sq,dp,c);
        JtWJ = result.JtWJ,JtWdy=result.JtWdy,X2=result.Chi_sq,y_hat=result.y_hat,J=result.J;

        /*if nargout > 2				// standard error of parameters
         covar = inv(JtWJ);
         sigma_p = sqrt(diag(covar));
         end

         if nargout > 3				// standard error of the fit
         //  sigma_y = sqrt(diag(J * covar * J'));	// slower version of below
         sigma_y = zeros(Npnt,1);
         for i=1:Npnt
         sigma_y(i) = J(i,:) * covar * J(i,:)';
         end
         sigma_y = sqrt(sigma_y);
         end

         if nargout > 4				// parameter correlation matrix
         corr = covar ./ [sigma_p*sigma_p'];
         end

         if nargout > 5				// coefficient of multiple determination
         R_sq = corrcoef([y_dat y_hat]);
         R_sq = R_sq(1,2).^2;
         end

         if nargout > 6				// convergence history
         cvg_hst = cvg_hst(1:iteration,:);
         end*/

        // endfunction  # ---------------------------------------------------------- LM

        return { p:p, X2:X2};
    },

    lm_FD_J:function(func,t,p,y,dp,c) {
        // J = lm_FD_J(func,t,p,y,{dp},{c})
        //
        // partial derivatives (Jacobian) dy/dp for use with lm.m
        // computed via Finite Differences
        // Requires n or 2n function evaluations, n = number of nonzero values of dp
        // -------- INPUT VARIABLES ---------
        // func = function of independent variables, 't', and parameters, 'p',
        //        returning the simulated model: y_hat = func(t,p,c)
        // t  = m-vector of independent variables (used as arg to func)
        // p  = n-vector of current parameter values
        // y  = func(t,p,c) n-vector initialised by user before each call to lm_FD_J
        // dp = fractional increment of p for numerical derivatives
        //      dp(j)>0 central differences calculated
        //      dp(j)<0 one sided differences calculated
        //      dp(j)=0 sets corresponding partials to zero; i.e. holds p(j) fixed
        //      Default:  0.001;
        // c  = optional vector of constants passed to y_hat = func(t,p,c)
        //---------- OUTPUT VARIABLES -------
        // J  = Jacobian Matrix J(i,j)=dy(i)/dp(j)	i=1:n; j=1:m

        //   Henri Gavin, Dept. Civil & Environ. Engineering, Duke Univ. November 2005
        //   modified from: ftp://fly.cnuce.cnr.it/pub/software/octave/leasqr/
        //   Press, et al., Numerical Recipes, Cambridge Univ. Press, 1992, Chapter 15.

        var m = y.length;			// number of data points
        var n = p.length;			// number of parameters

        dp = dp || math.multiply( Matrix.ones(n, 1), 0.001);

        var ps = p.clone();//JSON.parse(JSON.stringify(p));
        //var ps = $.extend(true, [], p);
        var J = new Matrix(m,n), del =new Array(n);         // initialize Jacobian to Zero

        for (var j = 0;j < n; j++) {
            //console.log(j+" "+dp[j]+" "+p[j]+" "+ps[j]+" "+del[j]);
            del[j] = dp[j]*(1+Math.abs(p[j][0]));  // parameter perturbation
            p[j] = [ps[j][0]+del[j]];	      // perturb parameter p(j)
            //console.log(j+" "+dp[j]+" "+p[j]+" "+ps[j]+" "+del[j]);

            if (del[j] != 0){
                y1 = func(t, p, c);
                //func_calls = func_calls + 1;
                if (dp[j][0] < 0) {		// backwards difference
                    //J(:,j) = math.dotDivide(math.subtract(y1, y),del[j]);//. / del[j];
                    //console.log(del[j]);
                    //console.log(y);
                    var column = math.dotDivide(math.subtract(y1, y),del[j]);
                    for(var k=0;k< m;k++){
                        J[k][j]=column[k][0];
                    }
                    //console.log(column);
                }
                else{
                    p[j][0] = ps[j][0] - del[j];
                    //J(:,j) = (y1 - feval(func, t, p, c)). / (2. * del[j]);
                    var column = math.dotDivide(math.subtract(y1,func(t,p,c)),2*del[j]);
                    for(var k=0;k< m;k++){
                        J[k][j]=column[k][0];
                    }

                }			// central difference, additional func call
            }

            p[j] = ps[j];		// restore p(j)

        }
        //console.log("lm_FD_J: "+ JSON.stringify(J));
        return J;

    },

    // endfunction # -------------------------------------------------- LM_FD_J
    lm_Broyden_J: function(p_old,y_old,J,p,y){
        // J = lm_Broyden_J(p_old,y_old,J,p,y)
        // carry out a rank-1 update to the Jacobian matrix using Broyden's equation
        //---------- INPUT VARIABLES -------
        // p_old = previous set of parameters
        // y_old = model evaluation at previous set of parameters, y_hat(t;p_old)
        // J  = current version of the Jacobian matrix
        // p     = current  set of parameters
        // y     = model evaluation at current  set of parameters, y_hat(t;p)
        //---------- OUTPUT VARIABLES -------
        // J = rank-1 update to Jacobian Matrix J(i,j)=dy(i)/dp(j)	i=1:n; j=1:m
        //console.log(p+" X "+ p_old)
        var h  = math.subtract(p, p_old);

        //console.log("hhh "+h);
        var h_t = math.transpose(h);
        h_t.div(math.multiply(h_t,h));

        //console.log(h_t);
        //J = J + ( y - y_old - J*h )*h' / (h'*h);	// Broyden rank-1 update eq'n
        J = math.add(J, math.multiply(math.subtract(y, math.add(y_old,math.multiply(J,h))),h_t));
        return J;
        // endfunction # ---------------------------------------------- LM_Broyden_J
    },

    lm_matx : function (func,t,p_old,y_old,dX2,J,p,y_dat,weight_sq,dp,c,iteration){
        // [JtWJ,JtWdy,Chi_sq,y_hat,J] = this.lm_matx(func,t,p_old,y_old,dX2,J,p,y_dat,weight_sq,{da},{c})
        //
        // Evaluate the linearized fitting matrix, JtWJ, and vector JtWdy,
        // and calculate the Chi-squared error function, Chi_sq
        // Used by Levenberg-Marquard algorithm, lm.m
        // -------- INPUT VARIABLES ---------
        // func   = function ofpn independent variables, p, and m parameters, p,
        //         returning the simulated model: y_hat = func(t,p,c)
        // t      = m-vectors or matrix of independent variables (used as arg to func)
        // p_old  = n-vector of previous parameter values
        // y_old  = m-vector of previous model ... y_old = y_hat(t;p_old);
        // dX2    = previous change in Chi-squared criteria
        // J   = m-by-n Jacobian of model, y_hat, with respect to parameters, p
        // p      = n-vector of current  parameter values
        // y_dat  = n-vector of data to be fit by func(t,p,c)
        // weight_sq = square of the weighting vector for least squares fit ...
        //	    inverse of the standard measurement errors
        // dp     = fractional increment of 'p' for numerical derivatives
        //          dp(j)>0 central differences calculated
        //          dp(j)<0 one sided differences calculated
        //          dp(j)=0 sets corresponding partials to zero; i.e. holds p(j) fixed
        //          Default:  0.001;
        // c      = optional vector of constants passed to y_hat = func(t,p,c)
        //---------- OUTPUT VARIABLES -------
        // JtWJ	 = linearized Hessian matrix (inverse of covariance matrix)
        // JtWdy   = linearized fitting vector
        // Chi_sq = Chi-squared criteria: weighted sum of the squared residuals WSSR
        // y_hat  = model evaluated with parameters 'p'
        // J   = m-by-n Jacobian of model, y_hat, with respect to parameters, p

        //   Henri Gavin, Dept. Civil & Environ. Engineering, Duke Univ. November 2005
        //   modified from: ftp://fly.cnuce.cnr.it/pub/software/octave/leasqr/
        //   Press, et al., Numerical Recipes, Cambridge Univ. Press, 1992, Chapter 15.


        var Npnt = y_dat.length;		// number of data points
        var Npar = p.length;		// number of parameters

        dp = dp || 0.001;


        //var JtWJ = new Matrix.zeros(Npar);
        //var JtWdy  = new Matrix.zeros(Npar,1);

        var y_hat = func(t,p,c);	// evaluate model using parameters 'p'
        //func_calls = func_calls + 1;
        //console.log(J);
        if ( (iteration%(2*Npar))==0 || dX2 > 0 ) {
            //console.log("Par");
            J = this.lm_FD_J(func, t, p, y_hat, dp, c);		// finite difference
        }
        else{
            //console.log("ImPar");
            J = this.lm_Broyden_J(p_old, y_old, J, p, y_hat); // rank-1 update
        }
        var delta_y = math.subtract(y_dat, y_hat);	// residual error between model and data
        //console.log(delta_y[0][0]);
        //console.log(delta_y.rows+" "+delta_y.columns+" "+JSON.stringify(weight_sq));
        //var Chi_sq = delta_y' * ( delta_y .* weight_sq ); 	// Chi-squared error criteria
        var Chi_sq = math.multiply(math.transpose(delta_y),math.dotMultiply(delta_y,weight_sq));
        //JtWJ  = J' * ( J .* ( weight_sq * ones(1,Npar) ) );
        var Jt = math.transpose(J);

        //console.log(weight_sq);

        var JtWJ = math.multiply(Jt, math.dotMultiply(J,math.multiply(weight_sq, Matrix.ones(1,Npar))));

        //JtWdy = J' * ( weight_sq .* delta_y );
        var JtWdy = math.multiply(Jt, math.dotMultiply(weight_sq,delta_y));


        return {JtWJ:JtWJ,JtWdy:JtWdy,Chi_sq:Chi_sq,y_hat:y_hat,J:J};
        // endfunction  # ------------------------------------------------------ LM_MATX
    }



};

module.exports = LM;

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(71);
module.exports.Matrix = __webpack_require__(4);
module.exports.Matrix.algebra = __webpack_require__(29);


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Matrix = __webpack_require__(2);

// https://github.com/lutzroeder/Mapack/blob/master/Source/CholeskyDecomposition.cs
function CholeskyDecomposition(value) {
    if (!(this instanceof CholeskyDecomposition)) {
        return new CholeskyDecomposition(value);
    }
    value = Matrix.checkMatrix(value);
    if (!value.isSymmetric())
        throw new Error('Matrix is not symmetric');

    var a = value,
        dimension = a.rows,
        l = new Matrix(dimension, dimension),
        positiveDefinite = true,
        i, j, k;

    for (j = 0; j < dimension; j++) {
        var Lrowj = l[j];
        var d = 0;
        for (k = 0; k < j; k++) {
            var Lrowk = l[k];
            var s = 0;
            for (i = 0; i < k; i++) {
                s += Lrowk[i] * Lrowj[i];
            }
            Lrowj[k] = s = (a[j][k] - s) / l[k][k];
            d = d + s * s;
        }

        d = a[j][j] - d;

        positiveDefinite &= (d > 0);
        l[j][j] = Math.sqrt(Math.max(d, 0));
        for (k = j + 1; k < dimension; k++) {
            l[j][k] = 0;
        }
    }

    if (!positiveDefinite) {
        throw new Error('Matrix is not positive definite');
    }

    this.L = l;
}

CholeskyDecomposition.prototype = {
    get leftTriangularFactor() {
        return this.L;
    },
    solve: function (value) {
        value = Matrix.checkMatrix(value);

        var l = this.L,
            dimension = l.rows;

        if (value.rows !== dimension) {
            throw new Error('Matrix dimensions do not match');
        }

        var count = value.columns,
            B = value.clone(),
            i, j, k;

        for (k = 0; k < dimension; k++) {
            for (j = 0; j < count; j++) {
                for (i = 0; i < k; i++) {
                    B[k][j] -= B[i][j] * l[k][i];
                }
                B[k][j] /= l[k][k];
            }
        }

        for (k = dimension - 1; k >= 0; k--) {
            for (j = 0; j < count; j++) {
                for (i = k + 1; i < dimension; i++) {
                    B[k][j] -= B[i][j] * l[i][k];
                }
                B[k][j] /= l[k][k];
            }
        }

        return B;
    }
};

module.exports = CholeskyDecomposition;


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Matrix = __webpack_require__(2);
var hypotenuse = __webpack_require__(11).hypotenuse;

// https://github.com/lutzroeder/Mapack/blob/master/Source/EigenvalueDecomposition.cs
function EigenvalueDecomposition(matrix) {
    if (!(this instanceof EigenvalueDecomposition)) {
        return new EigenvalueDecomposition(matrix);
    }
    matrix = Matrix.checkMatrix(matrix);
    if (!matrix.isSquare()) {
        throw new Error('Matrix is not a square matrix');
    }

    var n = matrix.columns,
        V = Matrix.zeros(n, n),
        d = new Array(n),
        e = new Array(n),
        value = matrix,
        i, j;

    if (matrix.isSymmetric()) {
        for (i = 0; i < n; i++) {
            for (j = 0; j < n; j++) {
                V[i][j] = value[i][j];
            }
        }
        tred2(n, e, d, V);
        tql2(n, e, d, V);
    }
    else {
        var H = Matrix.zeros(n, n),
            ort = new Array(n);
        for (j = 0; j < n; j++) {
            for (i = 0; i < n; i++) {
                H[i][j] = value[i][j];
            }
        }
        orthes(n, H, ort, V);
        hqr2(n, e, d, V, H);
    }

    this.n = n;
    this.e = e;
    this.d = d;
    this.V = V;
}

EigenvalueDecomposition.prototype = {
    get realEigenvalues() {
        return this.d;
    },
    get imaginaryEigenvalues() {
        return this.e;
    },
    get eigenvectorMatrix() {
        return this.V;
    },
    get diagonalMatrix() {
        var n = this.n,
            e = this.e,
            d = this.d,
            X = new Matrix(n, n),
            i, j;
        for (i = 0; i < n; i++) {
            for (j = 0; j < n; j++) {
                X[i][j] = 0;
            }
            X[i][i] = d[i];
            if (e[i] > 0) {
                X[i][i + 1] = e[i];
            }
            else if (e[i] < 0) {
                X[i][i - 1] = e[i];
            }
        }
        return X;
    }
};

function tred2(n, e, d, V) {

    var f, g, h, i, j, k,
        hh, scale;

    for (j = 0; j < n; j++) {
        d[j] = V[n - 1][j];
    }

    for (i = n - 1; i > 0; i--) {
        scale = 0;
        h = 0;
        for (k = 0; k < i; k++) {
            scale = scale + Math.abs(d[k]);
        }

        if (scale === 0) {
            e[i] = d[i - 1];
            for (j = 0; j < i; j++) {
                d[j] = V[i - 1][j];
                V[i][j] = 0;
                V[j][i] = 0;
            }
        } else {
            for (k = 0; k < i; k++) {
                d[k] /= scale;
                h += d[k] * d[k];
            }

            f = d[i - 1];
            g = Math.sqrt(h);
            if (f > 0) {
                g = -g;
            }

            e[i] = scale * g;
            h = h - f * g;
            d[i - 1] = f - g;
            for (j = 0; j < i; j++) {
                e[j] = 0;
            }

            for (j = 0; j < i; j++) {
                f = d[j];
                V[j][i] = f;
                g = e[j] + V[j][j] * f;
                for (k = j + 1; k <= i - 1; k++) {
                    g += V[k][j] * d[k];
                    e[k] += V[k][j] * f;
                }
                e[j] = g;
            }

            f = 0;
            for (j = 0; j < i; j++) {
                e[j] /= h;
                f += e[j] * d[j];
            }

            hh = f / (h + h);
            for (j = 0; j < i; j++) {
                e[j] -= hh * d[j];
            }

            for (j = 0; j < i; j++) {
                f = d[j];
                g = e[j];
                for (k = j; k <= i - 1; k++) {
                    V[k][j] -= (f * e[k] + g * d[k]);
                }
                d[j] = V[i - 1][j];
                V[i][j] = 0;
            }
        }
        d[i] = h;
    }

    for (i = 0; i < n - 1; i++) {
        V[n - 1][i] = V[i][i];
        V[i][i] = 1;
        h = d[i + 1];
        if (h !== 0) {
            for (k = 0; k <= i; k++) {
                d[k] = V[k][i + 1] / h;
            }

            for (j = 0; j <= i; j++) {
                g = 0;
                for (k = 0; k <= i; k++) {
                    g += V[k][i + 1] * V[k][j];
                }
                for (k = 0; k <= i; k++) {
                    V[k][j] -= g * d[k];
                }
            }
        }

        for (k = 0; k <= i; k++) {
            V[k][i + 1] = 0;
        }
    }

    for (j = 0; j < n; j++) {
        d[j] = V[n - 1][j];
        V[n - 1][j] = 0;
    }

    V[n - 1][n - 1] = 1;
    e[0] = 0;
}

function tql2(n, e, d, V) {

    var g, h, i, j, k, l, m, p, r,
        dl1, c, c2, c3, el1, s, s2,
        iter;

    for (i = 1; i < n; i++) {
        e[i - 1] = e[i];
    }

    e[n - 1] = 0;

    var f = 0,
        tst1 = 0,
        eps = Math.pow(2, -52);

    for (l = 0; l < n; l++) {
        tst1 = Math.max(tst1, Math.abs(d[l]) + Math.abs(e[l]));
        m = l;
        while (m < n) {
            if (Math.abs(e[m]) <= eps * tst1) {
                break;
            }
            m++;
        }

        if (m > l) {
            iter = 0;
            do {
                iter = iter + 1;

                g = d[l];
                p = (d[l + 1] - g) / (2 * e[l]);
                r = hypotenuse(p, 1);
                if (p < 0) {
                    r = -r;
                }

                d[l] = e[l] / (p + r);
                d[l + 1] = e[l] * (p + r);
                dl1 = d[l + 1];
                h = g - d[l];
                for (i = l + 2; i < n; i++) {
                    d[i] -= h;
                }

                f = f + h;

                p = d[m];
                c = 1;
                c2 = c;
                c3 = c;
                el1 = e[l + 1];
                s = 0;
                s2 = 0;
                for (i = m - 1; i >= l; i--) {
                    c3 = c2;
                    c2 = c;
                    s2 = s;
                    g = c * e[i];
                    h = c * p;
                    r = hypotenuse(p, e[i]);
                    e[i + 1] = s * r;
                    s = e[i] / r;
                    c = p / r;
                    p = c * d[i] - s * g;
                    d[i + 1] = h + s * (c * g + s * d[i]);

                    for (k = 0; k < n; k++) {
                        h = V[k][i + 1];
                        V[k][i + 1] = s * V[k][i] + c * h;
                        V[k][i] = c * V[k][i] - s * h;
                    }
                }

                p = -s * s2 * c3 * el1 * e[l] / dl1;
                e[l] = s * p;
                d[l] = c * p;

            }
            while (Math.abs(e[l]) > eps * tst1);
        }
        d[l] = d[l] + f;
        e[l] = 0;
    }

    for (i = 0; i < n - 1; i++) {
        k = i;
        p = d[i];
        for (j = i + 1; j < n; j++) {
            if (d[j] < p) {
                k = j;
                p = d[j];
            }
        }

        if (k !== i) {
            d[k] = d[i];
            d[i] = p;
            for (j = 0; j < n; j++) {
                p = V[j][i];
                V[j][i] = V[j][k];
                V[j][k] = p;
            }
        }
    }
}

function orthes(n, H, ort, V) {

    var low = 0,
        high = n - 1,
        f, g, h, i, j, m,
        scale;

    for (m = low + 1; m <= high - 1; m++) {
        scale = 0;
        for (i = m; i <= high; i++) {
            scale = scale + Math.abs(H[i][m - 1]);
        }

        if (scale !== 0) {
            h = 0;
            for (i = high; i >= m; i--) {
                ort[i] = H[i][m - 1] / scale;
                h += ort[i] * ort[i];
            }

            g = Math.sqrt(h);
            if (ort[m] > 0) {
                g = -g;
            }

            h = h - ort[m] * g;
            ort[m] = ort[m] - g;

            for (j = m; j < n; j++) {
                f = 0;
                for (i = high; i >= m; i--) {
                    f += ort[i] * H[i][j];
                }

                f = f / h;
                for (i = m; i <= high; i++) {
                    H[i][j] -= f * ort[i];
                }
            }

            for (i = 0; i <= high; i++) {
                f = 0;
                for (j = high; j >= m; j--) {
                    f += ort[j] * H[i][j];
                }

                f = f / h;
                for (j = m; j <= high; j++) {
                    H[i][j] -= f * ort[j];
                }
            }

            ort[m] = scale * ort[m];
            H[m][m - 1] = scale * g;
        }
    }

    for (i = 0; i < n; i++) {
        for (j = 0; j < n; j++) {
            V[i][j] = (i === j ? 1 : 0);
        }
    }

    for (m = high - 1; m >= low + 1; m--) {
        if (H[m][m - 1] !== 0) {
            for (i = m + 1; i <= high; i++) {
                ort[i] = H[i][m - 1];
            }

            for (j = m; j <= high; j++) {
                g = 0;
                for (i = m; i <= high; i++) {
                    g += ort[i] * V[i][j];
                }

                g = (g / ort[m]) / H[m][m - 1];
                for (i = m; i <= high; i++) {
                    V[i][j] += g * ort[i];
                }
            }
        }
    }
}

function hqr2(nn, e, d, V, H) {
    var n = nn - 1,
        low = 0,
        high = nn - 1,
        eps = Math.pow(2, -52),
        exshift = 0,
        norm = 0,
        p = 0,
        q = 0,
        r = 0,
        s = 0,
        z = 0,
        iter = 0,
        i, j, k, l, m, t, w, x, y,
        ra, sa, vr, vi,
        notlast, cdivres;

    for (i = 0; i < nn; i++) {
        if (i < low || i > high) {
            d[i] = H[i][i];
            e[i] = 0;
        }

        for (j = Math.max(i - 1, 0); j < nn; j++) {
            norm = norm + Math.abs(H[i][j]);
        }
    }

    while (n >= low) {
        l = n;
        while (l > low) {
            s = Math.abs(H[l - 1][l - 1]) + Math.abs(H[l][l]);
            if (s === 0) {
                s = norm;
            }
            if (Math.abs(H[l][l - 1]) < eps * s) {
                break;
            }
            l--;
        }

        if (l === n) {
            H[n][n] = H[n][n] + exshift;
            d[n] = H[n][n];
            e[n] = 0;
            n--;
            iter = 0;
        } else if (l === n - 1) {
            w = H[n][n - 1] * H[n - 1][n];
            p = (H[n - 1][n - 1] - H[n][n]) / 2;
            q = p * p + w;
            z = Math.sqrt(Math.abs(q));
            H[n][n] = H[n][n] + exshift;
            H[n - 1][n - 1] = H[n - 1][n - 1] + exshift;
            x = H[n][n];

            if (q >= 0) {
                z = (p >= 0) ? (p + z) : (p - z);
                d[n - 1] = x + z;
                d[n] = d[n - 1];
                if (z !== 0) {
                    d[n] = x - w / z;
                }
                e[n - 1] = 0;
                e[n] = 0;
                x = H[n][n - 1];
                s = Math.abs(x) + Math.abs(z);
                p = x / s;
                q = z / s;
                r = Math.sqrt(p * p + q * q);
                p = p / r;
                q = q / r;

                for (j = n - 1; j < nn; j++) {
                    z = H[n - 1][j];
                    H[n - 1][j] = q * z + p * H[n][j];
                    H[n][j] = q * H[n][j] - p * z;
                }

                for (i = 0; i <= n; i++) {
                    z = H[i][n - 1];
                    H[i][n - 1] = q * z + p * H[i][n];
                    H[i][n] = q * H[i][n] - p * z;
                }

                for (i = low; i <= high; i++) {
                    z = V[i][n - 1];
                    V[i][n - 1] = q * z + p * V[i][n];
                    V[i][n] = q * V[i][n] - p * z;
                }
            } else {
                d[n - 1] = x + p;
                d[n] = x + p;
                e[n - 1] = z;
                e[n] = -z;
            }

            n = n - 2;
            iter = 0;
        } else {
            x = H[n][n];
            y = 0;
            w = 0;
            if (l < n) {
                y = H[n - 1][n - 1];
                w = H[n][n - 1] * H[n - 1][n];
            }

            if (iter === 10) {
                exshift += x;
                for (i = low; i <= n; i++) {
                    H[i][i] -= x;
                }
                s = Math.abs(H[n][n - 1]) + Math.abs(H[n - 1][n - 2]);
                x = y = 0.75 * s;
                w = -0.4375 * s * s;
            }

            if (iter === 30) {
                s = (y - x) / 2;
                s = s * s + w;
                if (s > 0) {
                    s = Math.sqrt(s);
                    if (y < x) {
                        s = -s;
                    }
                    s = x - w / ((y - x) / 2 + s);
                    for (i = low; i <= n; i++) {
                        H[i][i] -= s;
                    }
                    exshift += s;
                    x = y = w = 0.964;
                }
            }

            iter = iter + 1;

            m = n - 2;
            while (m >= l) {
                z = H[m][m];
                r = x - z;
                s = y - z;
                p = (r * s - w) / H[m + 1][m] + H[m][m + 1];
                q = H[m + 1][m + 1] - z - r - s;
                r = H[m + 2][m + 1];
                s = Math.abs(p) + Math.abs(q) + Math.abs(r);
                p = p / s;
                q = q / s;
                r = r / s;
                if (m === l) {
                    break;
                }
                if (Math.abs(H[m][m - 1]) * (Math.abs(q) + Math.abs(r)) < eps * (Math.abs(p) * (Math.abs(H[m - 1][m - 1]) + Math.abs(z) + Math.abs(H[m + 1][m + 1])))) {
                    break;
                }
                m--;
            }

            for (i = m + 2; i <= n; i++) {
                H[i][i - 2] = 0;
                if (i > m + 2) {
                    H[i][i - 3] = 0;
                }
            }

            for (k = m; k <= n - 1; k++) {
                notlast = (k !== n - 1);
                if (k !== m) {
                    p = H[k][k - 1];
                    q = H[k + 1][k - 1];
                    r = (notlast ? H[k + 2][k - 1] : 0);
                    x = Math.abs(p) + Math.abs(q) + Math.abs(r);
                    if (x !== 0) {
                        p = p / x;
                        q = q / x;
                        r = r / x;
                    }
                }

                if (x === 0) {
                    break;
                }

                s = Math.sqrt(p * p + q * q + r * r);
                if (p < 0) {
                    s = -s;
                }

                if (s !== 0) {
                    if (k !== m) {
                        H[k][k - 1] = -s * x;
                    } else if (l !== m) {
                        H[k][k - 1] = -H[k][k - 1];
                    }

                    p = p + s;
                    x = p / s;
                    y = q / s;
                    z = r / s;
                    q = q / p;
                    r = r / p;

                    for (j = k; j < nn; j++) {
                        p = H[k][j] + q * H[k + 1][j];
                        if (notlast) {
                            p = p + r * H[k + 2][j];
                            H[k + 2][j] = H[k + 2][j] - p * z;
                        }

                        H[k][j] = H[k][j] - p * x;
                        H[k + 1][j] = H[k + 1][j] - p * y;
                    }

                    for (i = 0; i <= Math.min(n, k + 3); i++) {
                        p = x * H[i][k] + y * H[i][k + 1];
                        if (notlast) {
                            p = p + z * H[i][k + 2];
                            H[i][k + 2] = H[i][k + 2] - p * r;
                        }

                        H[i][k] = H[i][k] - p;
                        H[i][k + 1] = H[i][k + 1] - p * q;
                    }

                    for (i = low; i <= high; i++) {
                        p = x * V[i][k] + y * V[i][k + 1];
                        if (notlast) {
                            p = p + z * V[i][k + 2];
                            V[i][k + 2] = V[i][k + 2] - p * r;
                        }

                        V[i][k] = V[i][k] - p;
                        V[i][k + 1] = V[i][k + 1] - p * q;
                    }
                }
            }
        }
    }

    if (norm === 0) {
        return;
    }

    for (n = nn - 1; n >= 0; n--) {
        p = d[n];
        q = e[n];

        if (q === 0) {
            l = n;
            H[n][n] = 1;
            for (i = n - 1; i >= 0; i--) {
                w = H[i][i] - p;
                r = 0;
                for (j = l; j <= n; j++) {
                    r = r + H[i][j] * H[j][n];
                }

                if (e[i] < 0) {
                    z = w;
                    s = r;
                } else {
                    l = i;
                    if (e[i] === 0) {
                        H[i][n] = (w !== 0) ? (-r / w) : (-r / (eps * norm));
                    } else {
                        x = H[i][i + 1];
                        y = H[i + 1][i];
                        q = (d[i] - p) * (d[i] - p) + e[i] * e[i];
                        t = (x * s - z * r) / q;
                        H[i][n] = t;
                        H[i + 1][n] = (Math.abs(x) > Math.abs(z)) ? ((-r - w * t) / x) : ((-s - y * t) / z);
                    }

                    t = Math.abs(H[i][n]);
                    if ((eps * t) * t > 1) {
                        for (j = i; j <= n; j++) {
                            H[j][n] = H[j][n] / t;
                        }
                    }
                }
            }
        } else if (q < 0) {
            l = n - 1;

            if (Math.abs(H[n][n - 1]) > Math.abs(H[n - 1][n])) {
                H[n - 1][n - 1] = q / H[n][n - 1];
                H[n - 1][n] = -(H[n][n] - p) / H[n][n - 1];
            } else {
                cdivres = cdiv(0, -H[n - 1][n], H[n - 1][n - 1] - p, q);
                H[n - 1][n - 1] = cdivres[0];
                H[n - 1][n] = cdivres[1];
            }

            H[n][n - 1] = 0;
            H[n][n] = 1;
            for (i = n - 2; i >= 0; i--) {
                ra = 0;
                sa = 0;
                for (j = l; j <= n; j++) {
                    ra = ra + H[i][j] * H[j][n - 1];
                    sa = sa + H[i][j] * H[j][n];
                }

                w = H[i][i] - p;

                if (e[i] < 0) {
                    z = w;
                    r = ra;
                    s = sa;
                } else {
                    l = i;
                    if (e[i] === 0) {
                        cdivres = cdiv(-ra, -sa, w, q);
                        H[i][n - 1] = cdivres[0];
                        H[i][n] = cdivres[1];
                    } else {
                        x = H[i][i + 1];
                        y = H[i + 1][i];
                        vr = (d[i] - p) * (d[i] - p) + e[i] * e[i] - q * q;
                        vi = (d[i] - p) * 2 * q;
                        if (vr === 0 && vi === 0) {
                            vr = eps * norm * (Math.abs(w) + Math.abs(q) + Math.abs(x) + Math.abs(y) + Math.abs(z));
                        }
                        cdivres = cdiv(x * r - z * ra + q * sa, x * s - z * sa - q * ra, vr, vi);
                        H[i][n - 1] = cdivres[0];
                        H[i][n] = cdivres[1];
                        if (Math.abs(x) > (Math.abs(z) + Math.abs(q))) {
                            H[i + 1][n - 1] = (-ra - w * H[i][n - 1] + q * H[i][n]) / x;
                            H[i + 1][n] = (-sa - w * H[i][n] - q * H[i][n - 1]) / x;
                        } else {
                            cdivres = cdiv(-r - y * H[i][n - 1], -s - y * H[i][n], z, q);
                            H[i + 1][n - 1] = cdivres[0];
                            H[i + 1][n] = cdivres[1];
                        }
                    }

                    t = Math.max(Math.abs(H[i][n - 1]), Math.abs(H[i][n]));
                    if ((eps * t) * t > 1) {
                        for (j = i; j <= n; j++) {
                            H[j][n - 1] = H[j][n - 1] / t;
                            H[j][n] = H[j][n] / t;
                        }
                    }
                }
            }
        }
    }

    for (i = 0; i < nn; i++) {
        if (i < low || i > high) {
            for (j = i; j < nn; j++) {
                V[i][j] = H[i][j];
            }
        }
    }

    for (j = nn - 1; j >= low; j--) {
        for (i = low; i <= high; i++) {
            z = 0;
            for (k = low; k <= Math.min(j, high); k++) {
                z = z + V[i][k] * H[k][j];
            }
            V[i][j] = z;
        }
    }
}

function cdiv(xr, xi, yr, yi) {
    var r, d;
    if (Math.abs(yr) > Math.abs(yi)) {
        r = yi / yr;
        d = yr + r * yi;
        return [(xr + r * xi) / d, (xi - r * xr) / d];
    }
    else {
        r = yr / yi;
        d = yi + r * yr;
        return [(r * xr + xi) / d, (r * xi - xr) / d];
    }
}

module.exports = EigenvalueDecomposition;


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Matrix = __webpack_require__(2);

// https://github.com/lutzroeder/Mapack/blob/master/Source/LuDecomposition.cs
function LuDecomposition(matrix) {
    if (!(this instanceof LuDecomposition)) {
        return new LuDecomposition(matrix);
    }
    matrix = Matrix.checkMatrix(matrix);

    var lu = matrix.clone(),
        rows = lu.rows,
        columns = lu.columns,
        pivotVector = new Array(rows),
        pivotSign = 1,
        i, j, k, p, s, t, v,
        LUrowi, LUcolj, kmax;

    for (i = 0; i < rows; i++) {
        pivotVector[i] = i;
    }

    LUcolj = new Array(rows);

    for (j = 0; j < columns; j++) {

        for (i = 0; i < rows; i++) {
            LUcolj[i] = lu[i][j];
        }

        for (i = 0; i < rows; i++) {
            LUrowi = lu[i];
            kmax = Math.min(i, j);
            s = 0;
            for (k = 0; k < kmax; k++) {
                s += LUrowi[k] * LUcolj[k];
            }
            LUrowi[j] = LUcolj[i] -= s;
        }

        p = j;
        for (i = j + 1; i < rows; i++) {
            if (Math.abs(LUcolj[i]) > Math.abs(LUcolj[p])) {
                p = i;
            }
        }

        if (p !== j) {
            for (k = 0; k < columns; k++) {
                t = lu[p][k];
                lu[p][k] = lu[j][k];
                lu[j][k] = t;
            }

            v = pivotVector[p];
            pivotVector[p] = pivotVector[j];
            pivotVector[j] = v;

            pivotSign = -pivotSign;
        }

        if (j < rows && lu[j][j] !== 0) {
            for (i = j + 1; i < rows; i++) {
                lu[i][j] /= lu[j][j];
            }
        }
    }

    this.LU = lu;
    this.pivotVector = pivotVector;
    this.pivotSign = pivotSign;
}

LuDecomposition.prototype = {
    isSingular: function () {
        var data = this.LU,
            col = data.columns;
        for (var j = 0; j < col; j++) {
            if (data[j][j] === 0) {
                return true;
            }
        }
        return false;
    },
    get determinant() {
        var data = this.LU;
        if (!data.isSquare())
            throw new Error('Matrix must be square');
        var determinant = this.pivotSign, col = data.columns;
        for (var j = 0; j < col; j++)
            determinant *= data[j][j];
        return determinant;
    },
    get lowerTriangularFactor() {
        var data = this.LU,
            rows = data.rows,
            columns = data.columns,
            X = new Matrix(rows, columns);
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < columns; j++) {
                if (i > j) {
                    X[i][j] = data[i][j];
                } else if (i === j) {
                    X[i][j] = 1;
                } else {
                    X[i][j] = 0;
                }
            }
        }
        return X;
    },
    get upperTriangularFactor() {
        var data = this.LU,
            rows = data.rows,
            columns = data.columns,
            X = new Matrix(rows, columns);
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < columns; j++) {
                if (i <= j) {
                    X[i][j] = data[i][j];
                } else {
                    X[i][j] = 0;
                }
            }
        }
        return X;
    },
    get pivotPermutationVector() {
        return this.pivotVector.slice();
    },
    solve: function (value) {
        value = Matrix.checkMatrix(value);

        var lu = this.LU,
            rows = lu.rows;

        if (rows !== value.rows)
            throw new Error('Invalid matrix dimensions');
        if (this.isSingular())
            throw new Error('LU matrix is singular');

        var count = value.columns,
            X = value.subMatrixRow(this.pivotVector, 0, count - 1),
            columns = lu.columns,
            i, j, k;

        for (k = 0; k < columns; k++) {
            for (i = k + 1; i < columns; i++) {
                for (j = 0; j < count; j++) {
                    X[i][j] -= X[k][j] * lu[i][k];
                }
            }
        }
        for (k = columns - 1; k >= 0; k--) {
            for (j = 0; j < count; j++) {
                X[k][j] /= lu[k][k];
            }
            for (i = 0; i < k; i++) {
                for (j = 0; j < count; j++) {
                    X[i][j] -= X[k][j] * lu[i][k];
                }
            }
        }
        return X;
    }
};

module.exports = LuDecomposition;


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Matrix = __webpack_require__(2);
var hypotenuse = __webpack_require__(11).hypotenuse;

//https://github.com/lutzroeder/Mapack/blob/master/Source/QrDecomposition.cs
function QrDecomposition(value) {
    if (!(this instanceof QrDecomposition)) {
        return new QrDecomposition(value);
    }
    value = Matrix.checkMatrix(value);

    var qr = value.clone(),
        m = value.rows,
        n = value.columns,
        rdiag = new Array(n),
        i, j, k, s;

    for (k = 0; k < n; k++) {
        var nrm = 0;
        for (i = k; i < m; i++) {
            nrm = hypotenuse(nrm, qr[i][k]);
        }
        if (nrm !== 0) {
            if (qr[k][k] < 0) {
                nrm = -nrm;
            }
            for (i = k; i < m; i++) {
                qr[i][k] /= nrm;
            }
            qr[k][k] += 1;
            for (j = k + 1; j < n; j++) {
                s = 0;
                for (i = k; i < m; i++) {
                    s += qr[i][k] * qr[i][j];
                }
                s = -s / qr[k][k];
                for (i = k; i < m; i++) {
                    qr[i][j] += s * qr[i][k];
                }
            }
        }
        rdiag[k] = -nrm;
    }

    this.QR = qr;
    this.Rdiag = rdiag;
}

QrDecomposition.prototype = {
    solve: function (value) {
        value = Matrix.checkMatrix(value);

        var qr = this.QR,
            m = qr.rows;

        if (value.rows !== m)
            throw new Error('Matrix row dimensions must agree');
        if (!this.isFullRank())
            throw new Error('Matrix is rank deficient');

        var count = value.columns,
            X = value.clone(),
            n = qr.columns,
            i, j, k, s;

        for (k = 0; k < n; k++) {
            for (j = 0; j < count; j++) {
                s = 0;
                for (i = k; i < m; i++) {
                    s += qr[i][k] * X[i][j];
                }
                s = -s / qr[k][k];
                for (i = k; i < m; i++) {
                    X[i][j] += s * qr[i][k];
                }
            }
        }
        for (k = n - 1; k >= 0; k--) {
            for (j = 0; j < count; j++) {
                X[k][j] /= this.Rdiag[k];
            }
            for (i = 0; i < k; i++) {
                for (j = 0; j < count; j++) {
                    X[i][j] -= X[k][j] * qr[i][k];
                }
            }
        }

        return X.subMatrix(0, n - 1, 0, count - 1);
    },
    isFullRank: function () {
        var columns = this.QR.columns;
        for (var i = 0; i < columns; i++) {
            if (this.Rdiag[i] === 0) {
                return false;
            }
        }
        return true;
    },
    get upperTriangularFactor() {
        var qr = this.QR,
            n = qr.columns,
            X = new Matrix(n, n),
            i, j;
        for (i = 0; i < n; i++) {
            for (j = 0; j < n; j++) {
                if (i < j) {
                    X[i][j] = qr[i][j];
                } else if (i === j) {
                    X[i][j] = this.Rdiag[i];
                } else {
                    X[i][j] = 0;
                }
            }
        }
        return X;
    },
    get orthogonalFactor() {
        var qr = this.QR,
            rows = qr.rows,
            columns = qr.columns,
            X = new Matrix(rows, columns),
            i, j, k, s;

        for (k = columns - 1; k >= 0; k--) {
            for (i = 0; i < rows; i++) {
                X[i][k] = 0;
            }
            X[k][k] = 1;
            for (j = k; j < columns; j++) {
                if (qr[k][k] !== 0) {
                    s = 0;
                    for (i = k; i < rows; i++) {
                        s += qr[i][k] * X[i][j];
                    }

                    s = -s / qr[k][k];

                    for (i = k; i < rows; i++) {
                        X[i][j] += s * qr[i][k];
                    }
                }
            }
        }
        return X;
    }
};

module.exports = QrDecomposition;


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Matrix = __webpack_require__(2);
var hypotenuse = __webpack_require__(11).hypotenuse;

// https://github.com/lutzroeder/Mapack/blob/master/Source/SingularValueDecomposition.cs
function SingularValueDecomposition(value, options) {
    if (!(this instanceof SingularValueDecomposition)) {
        return new SingularValueDecomposition(value, options);
    }
    value = Matrix.checkMatrix(value);

    options = options || {};

    var a = value.clone(),
        m = value.rows,
        n = value.columns,
        nu = Math.min(m, n);

    var wantu = true, wantv = true;
    if (options.computeLeftSingularVectors === false)
        wantu = false;
    if (options.computeRightSingularVectors === false)
        wantv = false;
    var autoTranspose = options.autoTranspose === true;

    var swapped = false;
    if (m < n) {
        if (!autoTranspose) {
            console.warn('Computing SVD on a matrix with more columns than rows. Consider enabling autoTranspose');
        } else {
            a = a.transpose();
            m = a.rows;
            n = a.columns;
            swapped = true;
            var aux = wantu;
            wantu = wantv;
            wantv = aux;
        }
    }

    var s = new Array(Math.min(m + 1, n)),
        U = Matrix.zeros(m, nu),
        V = Matrix.zeros(n, n),
        e = new Array(n),
        work = new Array(m);

    var nct = Math.min(m - 1, n);
    var nrt = Math.max(0, Math.min(n - 2, m));

    var i, j, k, p, t, ks, f, cs, sn, max, kase,
        scale, sp, spm1, epm1, sk, ek, b, c, shift, g;

    for (k = 0, max = Math.max(nct, nrt); k < max; k++) {
        if (k < nct) {
            s[k] = 0;
            for (i = k; i < m; i++) {
                s[k] = hypotenuse(s[k], a[i][k]);
            }
            if (s[k] !== 0) {
                if (a[k][k] < 0) {
                    s[k] = -s[k];
                }
                for (i = k; i < m; i++) {
                    a[i][k] /= s[k];
                }
                a[k][k] += 1;
            }
            s[k] = -s[k];
        }

        for (j = k + 1; j < n; j++) {
            if ((k < nct) && (s[k] !== 0)) {
                t = 0;
                for (i = k; i < m; i++) {
                    t += a[i][k] * a[i][j];
                }
                t = -t / a[k][k];
                for (i = k; i < m; i++) {
                    a[i][j] += t * a[i][k];
                }
            }
            e[j] = a[k][j];
        }

        if (wantu && (k < nct)) {
            for (i = k; i < m; i++) {
                U[i][k] = a[i][k];
            }
        }

        if (k < nrt) {
            e[k] = 0;
            for (i = k + 1; i < n; i++) {
                e[k] = hypotenuse(e[k], e[i]);
            }
            if (e[k] !== 0) {
                if (e[k + 1] < 0)
                    e[k] = -e[k];
                for (i = k + 1; i < n; i++) {
                    e[i] /= e[k];
                }
                e[k + 1] += 1;
            }
            e[k] = -e[k];
            if ((k + 1 < m) && (e[k] !== 0)) {
                for (i = k + 1; i < m; i++) {
                    work[i] = 0;
                }
                for (j = k + 1; j < n; j++) {
                    for (i = k + 1; i < m; i++) {
                        work[i] += e[j] * a[i][j];
                    }
                }
                for (j = k + 1; j < n; j++) {
                    t = -e[j] / e[k + 1];
                    for (i = k + 1; i < m; i++) {
                        a[i][j] += t * work[i];
                    }
                }
            }
            if (wantv) {
                for (i = k + 1; i < n; i++) {
                    V[i][k] = e[i];
                }
            }
        }
    }

    p = Math.min(n, m + 1);
    if (nct < n) {
        s[nct] = a[nct][nct];
    }
    if (m < p) {
        s[p - 1] = 0;
    }
    if (nrt + 1 < p) {
        e[nrt] = a[nrt][p - 1];
    }
    e[p - 1] = 0;

    if (wantu) {
        for (j = nct; j < nu; j++) {
            for (i = 0; i < m; i++) {
                U[i][j] = 0;
            }
            U[j][j] = 1;
        }
        for (k = nct - 1; k >= 0; k--) {
            if (s[k] !== 0) {
                for (j = k + 1; j < nu; j++) {
                    t = 0;
                    for (i = k; i < m; i++) {
                        t += U[i][k] * U[i][j];
                    }
                    t = -t / U[k][k];
                    for (i = k; i < m; i++) {
                        U[i][j] += t * U[i][k];
                    }
                }
                for (i = k; i < m; i++) {
                    U[i][k] = -U[i][k];
                }
                U[k][k] = 1 + U[k][k];
                for (i = 0; i < k - 1; i++) {
                    U[i][k] = 0;
                }
            } else {
                for (i = 0; i < m; i++) {
                    U[i][k] = 0;
                }
                U[k][k] = 1;
            }
        }
    }

    if (wantv) {
        for (k = n - 1; k >= 0; k--) {
            if ((k < nrt) && (e[k] !== 0)) {
                for (j = k + 1; j < n; j++) {
                    t = 0;
                    for (i = k + 1; i < n; i++) {
                        t += V[i][k] * V[i][j];
                    }
                    t = -t / V[k + 1][k];
                    for (i = k + 1; i < n; i++) {
                        V[i][j] += t * V[i][k];
                    }
                }
            }
            for (i = 0; i < n; i++) {
                V[i][k] = 0;
            }
            V[k][k] = 1;
        }
    }

    var pp = p - 1,
        iter = 0,
        eps = Math.pow(2, -52);
    while (p > 0) {
        for (k = p - 2; k >= -1; k--) {
            if (k === -1) {
                break;
            }
            if (Math.abs(e[k]) <= eps * (Math.abs(s[k]) + Math.abs(s[k + 1]))) {
                e[k] = 0;
                break;
            }
        }
        if (k === p - 2) {
            kase = 4;
        } else {
            for (ks = p - 1; ks >= k; ks--) {
                if (ks === k) {
                    break;
                }
                t = (ks !== p ? Math.abs(e[ks]) : 0) + (ks !== k + 1 ? Math.abs(e[ks - 1]) : 0);
                if (Math.abs(s[ks]) <= eps * t) {
                    s[ks] = 0;
                    break;
                }
            }
            if (ks === k) {
                kase = 3;
            } else if (ks === p - 1) {
                kase = 1;
            } else {
                kase = 2;
                k = ks;
            }
        }

        k++;

        switch (kase) {
            case 1: {
                f = e[p - 2];
                e[p - 2] = 0;
                for (j = p - 2; j >= k; j--) {
                    t = hypotenuse(s[j], f);
                    cs = s[j] / t;
                    sn = f / t;
                    s[j] = t;
                    if (j !== k) {
                        f = -sn * e[j - 1];
                        e[j - 1] = cs * e[j - 1];
                    }
                    if (wantv) {
                        for (i = 0; i < n; i++) {
                            t = cs * V[i][j] + sn * V[i][p - 1];
                            V[i][p - 1] = -sn * V[i][j] + cs * V[i][p - 1];
                            V[i][j] = t;
                        }
                    }
                }
                break;
            }
            case 2 : {
                f = e[k - 1];
                e[k - 1] = 0;
                for (j = k; j < p; j++) {
                    t = hypotenuse(s[j], f);
                    cs = s[j] / t;
                    sn = f / t;
                    s[j] = t;
                    f = -sn * e[j];
                    e[j] = cs * e[j];
                    if (wantu) {
                        for (i = 0; i < m; i++) {
                            t = cs * U[i][j] + sn * U[i][k - 1];
                            U[i][k - 1] = -sn * U[i][j] + cs * U[i][k - 1];
                            U[i][j] = t;
                        }
                    }
                }
                break;
            }
            case 3 : {
                scale = Math.max(Math.max(Math.max(Math.max(Math.abs(s[p - 1]), Math.abs(s[p - 2])), Math.abs(e[p - 2])), Math.abs(s[k])), Math.abs(e[k]));
                sp = s[p - 1] / scale;
                spm1 = s[p - 2] / scale;
                epm1 = e[p - 2] / scale;
                sk = s[k] / scale;
                ek = e[k] / scale;
                b = ((spm1 + sp) * (spm1 - sp) + epm1 * epm1) / 2;
                c = (sp * epm1) * (sp * epm1);
                shift = 0;
                if ((b !== 0) || (c !== 0)) {
                    shift = Math.sqrt(b * b + c);
                    if (b < 0) {
                        shift = -shift;
                    }
                    shift = c / (b + shift);
                }
                f = (sk + sp) * (sk - sp) + shift;
                g = sk * ek;
                for (j = k; j < p - 1; j++) {
                    t = hypotenuse(f, g);
                    cs = f / t;
                    sn = g / t;
                    if (j !== k) {
                        e[j - 1] = t;
                    }
                    f = cs * s[j] + sn * e[j];
                    e[j] = cs * e[j] - sn * s[j];
                    g = sn * s[j + 1];
                    s[j + 1] = cs * s[j + 1];
                    if (wantv) {
                        for (i = 0; i < n; i++) {
                            t = cs * V[i][j] + sn * V[i][j + 1];
                            V[i][j + 1] = -sn * V[i][j] + cs * V[i][j + 1];
                            V[i][j] = t;
                        }
                    }
                    t = hypotenuse(f, g);
                    cs = f / t;
                    sn = g / t;
                    s[j] = t;
                    f = cs * e[j] + sn * s[j + 1];
                    s[j + 1] = -sn * e[j] + cs * s[j + 1];
                    g = sn * e[j + 1];
                    e[j + 1] = cs * e[j + 1];
                    if (wantu && (j < m - 1)) {
                        for (i = 0; i < m; i++) {
                            t = cs * U[i][j] + sn * U[i][j + 1];
                            U[i][j + 1] = -sn * U[i][j] + cs * U[i][j + 1];
                            U[i][j] = t;
                        }
                    }
                }
                e[p - 2] = f;
                iter = iter + 1;
                break;
            }
            case 4: {
                if (s[k] <= 0) {
                    s[k] = (s[k] < 0 ? -s[k] : 0);
                    if (wantv) {
                        for (i = 0; i <= pp; i++) {
                            V[i][k] = -V[i][k];
                        }
                    }
                }
                while (k < pp) {
                    if (s[k] >= s[k + 1]) {
                        break;
                    }
                    t = s[k];
                    s[k] = s[k + 1];
                    s[k + 1] = t;
                    if (wantv && (k < n - 1)) {
                        for (i = 0; i < n; i++) {
                            t = V[i][k + 1];
                            V[i][k + 1] = V[i][k];
                            V[i][k] = t;
                        }
                    }
                    if (wantu && (k < m - 1)) {
                        for (i = 0; i < m; i++) {
                            t = U[i][k + 1];
                            U[i][k + 1] = U[i][k];
                            U[i][k] = t;
                        }
                    }
                    k++;
                }
                iter = 0;
                p--;
                break;
            }
        }
    }

    if (swapped) {
        var tmp = V;
        V = U;
        U = tmp;
    }

    this.m = m;
    this.n = n;
    this.s = s;
    this.U = U;
    this.V = V;
}

SingularValueDecomposition.prototype = {
    get condition() {
        return this.s[0] / this.s[Math.min(this.m, this.n) - 1];
    },
    get norm2() {
        return this.s[0];
    },
    get rank() {
        var eps = Math.pow(2, -52),
            tol = Math.max(this.m, this.n) * this.s[0] * eps,
            r = 0,
            s = this.s;
        for (var i = 0, ii = s.length; i < ii; i++) {
            if (s[i] > tol) {
                r++;
            }
        }
        return r;
    },
    get diagonal() {
        return this.s;
    },
    // https://github.com/accord-net/framework/blob/development/Sources/Accord.Math/Decompositions/SingularValueDecomposition.cs
    get threshold() {
        return (Math.pow(2, -52) / 2) * Math.max(this.m, this.n) * this.s[0];
    },
    get leftSingularVectors() {
        return this.U;
    },
    get rightSingularVectors() {
        return this.V;
    },
    get diagonalMatrix() {
        return Matrix.diag(this.s);
    },
    solve: function (value) {

        var Y = value,
            e = this.threshold,
            scols = this.s.length,
            Ls = Matrix.zeros(scols, scols),
            i;

        for (i = 0; i < scols; i++) {
            if (Math.abs(this.s[i]) <= e) {
                Ls[i][i] = 0;
            } else {
                Ls[i][i] = 1 / this.s[i];
            }
        }


        var VL = this.V.mmul(Ls),
            vrows = this.V.rows,
            urows = this.U.rows,
            VLU = Matrix.zeros(vrows, urows),
            j, k, sum;

        for (i = 0; i < vrows; i++) {
            for (j = 0; j < urows; j++) {
                sum = 0;
                for (k = 0; k < scols; k++) {
                    sum += VL[i][k] * this.U[j][k];
                }
                VLU[i][j] = sum;
            }
        }

        return VLU.mmul(Y);
    },
    solveForDiagonal: function (value) {
        return this.solve(Matrix.diag(value));
    },
    inverse: function () {
        var e = this.threshold,
            vrows = this.V.rows,
            vcols = this.V.columns,
            X = new Matrix(vrows, this.s.length),
            i, j;

        for (i = 0; i < vrows; i++) {
            for (j = 0; j < vcols; j++) {
                if (Math.abs(this.s[j]) > e) {
                    X[i][j] = this.V[i][j] / this.s[j];
                } else {
                    X[i][j] = 0;
                }
            }
        }

        var urows = this.U.rows,
            ucols = this.U.columns,
            Y = new Matrix(vrows, urows),
            k, sum;

        for (i = 0; i < vrows; i++) {
            for (j = 0; j < urows; j++) {
                sum = 0;
                for (k = 0; k < ucols; k++) {
                    sum += X[i][k] * this.U[j][k];
                }
                Y[i][j] = sum;
            }
        }

        return Y;
    }
};

module.exports = SingularValueDecomposition;


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Matrix = __webpack_require__(2);

var SingularValueDecomposition = __webpack_require__(77);
var EigenvalueDecomposition = __webpack_require__(74);
var LuDecomposition = __webpack_require__(75);
var QrDecomposition = __webpack_require__(76);
var CholeskyDecomposition = __webpack_require__(73);

function inverse(matrix) {
    return solve(matrix, Matrix.eye(matrix.rows));
}

Matrix.prototype.inverse = function () {
    return inverse(this);
};

function solve(leftHandSide, rightHandSide) {
    return leftHandSide.isSquare() ? new LuDecomposition(leftHandSide).solve(rightHandSide) : new QrDecomposition(leftHandSide).solve(rightHandSide);
}

Matrix.prototype.solve = function (other) {
    return solve(this, other);
};

module.exports = {
    SingularValueDecomposition: SingularValueDecomposition,
    SVD: SingularValueDecomposition,
    EigenvalueDecomposition: EigenvalueDecomposition,
    EVD: EigenvalueDecomposition,
    LuDecomposition: LuDecomposition,
    LU: LuDecomposition,
    QrDecomposition: QrDecomposition,
    QR: QrDecomposition,
    CholeskyDecomposition: CholeskyDecomposition,
    CHO: CholeskyDecomposition,
    inverse: inverse,
    solve: solve
};


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var LM = __webpack_require__(72);
var math = LM.Matrix.algebra;
var Matrix = __webpack_require__(4);

/**
 * This function calculates the spectrum as a sum of lorentzian functions. The Lorentzian
 * parameters are divided in 3 batches. 1st: centers; 2nd: heights; 3th: widths;
 * @param t Ordinate values
 * @param p Lorentzian parameters
 * @param c Constant parameters(Not used)
 * @returns {*}
 */
function sumOfLorentzians(t,p,c){
    var nL = p.length/3,factor,i, j,p2, cols = t.rows;
    var result = Matrix.zeros(t.length,1);

    for(i=0;i<nL;i++){
        p2 = Math.pow(p[i+nL*2][0]/2,2);
        factor = p[i+nL][0]*p2;
        for(j=0;j<cols;j++){
            result[j][0]+=factor/(Math.pow(t[j][0]-p[i][0],2)+p2);
        }
    }
    return result;
}

/**
 * This function calculates the spectrum as a sum of gaussian functions. The Gaussian
 * parameters are divided in 3 batches. 1st: centers; 2nd: height; 3th: std's;
 * @param t Ordinate values
 * @param p Gaussian parameters
 * @param c Constant parameters(Not used)
 * @returns {*}
 */
function sumOfGaussians(t,p,c){
    var nL = p.length/3,factor,i, j, cols = t.rows;
    var result = Matrix.zeros(t.length,1);

    for(i=0;i<nL;i++){
        factor = p[i+nL*2][0]*p[i+nL*2][0]/2;
        for(j=0;j<cols;j++){
            result[j][0]+=p[i+nL][0]*Math.exp(-(t[i][0]-p[i][0])*(t[i][0]-p[i][0])/factor);
        }
    }
    return result;
}
/**
 * Single 4 parameter lorentzian function
 * @param t Ordinate values
 * @param p Lorentzian parameters
 * @param c Constant parameters(Not used)
 * @returns {*}
 */
function singleLorentzian(t,p,c){
    var factor = p[1][0]*Math.pow(p[2][0]/2,2);
    var rows = t.rows;
    var result = new Matrix(t.rows, t.columns);
    for(var i=0;i<rows;i++){
        result[i][0]=factor/(Math.pow(t[i][0]-p[0][0],2)+Math.pow(p[2][0]/2,2));
    }
    return result;
}

/**
 * Single 3 parameter gaussian function
 * @param t Ordinate values
 * @param p Gaussian parameters [mean, height, std]
 * @param c Constant parameters(Not used)
 * @returns {*}
 */
function singleGaussian(t,p,c){
    var factor2 = p[2][0]*p[2][0]/2;
    var rows = t.rows;
    var result = new Matrix(t.rows, t.columns);
    for(var i=0;i<rows;i++){
        result[i][0]=p[1][0]*Math.exp(-(t[i][0]-p[0][0])*(t[i][0]-p[0][0])/factor2);
    }
    return result;
}

/**
 * * Fits a set of points to a Lorentzian function. Returns the center of the peak, the width at half height, and the height of the signal.
 * @param data,[y]
 * @returns {*[]}
 */
function optimizeSingleLorentzian(xy, peak, opts) {
    opts = opts || {};
    var xy2 = parseData(xy, opts.percentage||0);

    if(xy2===null||xy2[0].rows<3){
        return null; //Cannot run an optimization with less than 3 points
    }

    var t = xy2[0];
    var y_data = xy2[1];
    var maxY = xy2[2];
    var nbPoints = t.rows, i;

    var weight = [nbPoints / Math.sqrt(y_data.dot(y_data))];

    var opts=Object.create(opts.LMOptions || [  3,    100, 1e-3, 1e-3, 1e-3, 1e-2, 1e-2,    11,    9,        1 ]);
    //var opts = [  3,    100, 1e-3, 1e-3, 1e-3, 1e-2, 1e-2,    11,    9,        1 ];
    var consts = [ ];
    var dt = Math.abs(t[0][0]-t[1][0]);// optional vector of constants
    var dx = new Matrix([[-dt/10000],[-1e-3],[-dt/10000]]);//-Math.abs(t[0][0]-t[1][0])/100;
    var p_init = new Matrix([[peak.x],[1],[peak.width]]);
    var p_min = new Matrix([[peak.x-dt],[0.75],[peak.width/4]]);
    var p_max = new Matrix([[peak.x+dt],[1.25],[peak.width*4]]);

    var p_fit = LM.optimize(singleLorentzian,p_init,t,y_data,weight,dx,p_min,p_max,consts,opts);


    p_fit = p_fit.p;
    return [p_fit[0],[p_fit[1][0]*maxY],p_fit[2]];

}

/**
 * Fits a set of points to a gaussian bell. Returns the mean of the peak, the std and the height of the signal.
 * @param data,[y]
 * @returns {*[]}
 */
function optimizeSingleGaussian(xy, peak, opts) {
    opts = opts || {};
    var xy2 = parseData(xy, opts.percentage||0);

    if(xy2===null||xy2[0].rows<3){
        return null; //Cannot run an optimization with less than 3 points
    }

    var t = xy2[0];
    var y_data = xy2[1];
    var maxY = xy2[2];

    var nbPoints = t.rows, i;



    var weight = [nbPoints / Math.sqrt(y_data.dot(y_data))];

    var opts=Object.create(opts.LMOptions || [  3,    100, 1e-3, 1e-3, 1e-3, 1e-2, 1e-2,    11,    9,        1 ]);
    //var opts = [  3,    100, 1e-3, 1e-3, 1e-3, 1e-2, 1e-2,    11,    9,        1 ];
    var consts = [ ];                         // optional vector of constants
    var dt = Math.abs(t[0][0]-t[1][0]);
    var dx = new Matrix([[-dt/10000],[-1e-3],[-dt/10000]]);//-Math.abs(t[0][0]-t[1][0])/100;

    var dx = new Matrix([[-Math.abs(t[0][0]-t[1][0])/1000],[-1e-3],[-peak.width/1000]]);
    var p_init = new Matrix([[peak.x],[1],[peak.width]]);
    var p_min = new Matrix([[peak.x-dt],[0.75],[peak.width/4]]);
    var p_max = new Matrix([[peak.x+dt],[1.25],[peak.width*4]]);
    //var p_min = new Matrix([[peak.x-peak.width/4],[0.75],[peak.width/3]]);
    //var p_max = new Matrix([[peak.x+peak.width/4],[1.25],[peak.width*3]]);

    var p_fit = LM.optimize(singleGaussian,p_init,t,y_data,weight,dx,p_min,p_max,consts,opts);
    p_fit = p_fit.p;
    return [p_fit[0],[p_fit[1][0]*maxY],p_fit[2]];
}

/*
 peaks on group should sorted
 */
function optimizeLorentzianTrain(xy, group, opts){
    var xy2 = parseData(xy);
    //console.log(xy2[0].rows);
    if(xy2===null||xy2[0].rows<3){
        return null; //Cannot run an optimization with less than 3 points
    }

    var t = xy2[0];
    var y_data = xy2[1];
    var maxY = xy2[2];
    var currentIndex = 0;
    var nbPoints = t.length;
    var nextX;
    var tI, yI, maxY;
    var result=[], current;
    for(var i=0; i<group.length;i++){
        nextX = group[i].x-group[i].width*4;
        //console.log(group[i]);
        while(t[currentIndex++]<nextX&&currentIndex<nbPoints);
        nextX = group[i].x+group[i].width*4;
        tI = [];
        yI = [];
        while(t[currentIndex]<=nextX&&currentIndex<nbPoints){
            tI.push(t[currentIndex][0]);
            yI.push(y_data[currentIndex][0]*maxY);
            currentIndex++;
        }

        current=optimizeSingleLorentzian([tI, yI], group[i], opts);
        if(current){
            result.push({"x":current[0][0],"y":current[1][0],"width":current[2][0],"opt":true});
        }
        else{
            result.push({"x":group[i].x,"y":group[i].y,"width":group[i].width,"opt":false});
        }
    }

    return result;

}

function optimizeGaussianTrain(xy, group, opts){
    var xy2 = parseData(xy);
    //console.log(xy2[0].rows);
    if(xy2===null||xy2[0].rows<3){
        return null; //Cannot run an optimization with less than 3 points
    }

    var t = xy2[0];
    var y_data = xy2[1];
    var maxY = xy2[2];
    var currentIndex = 0;
    var nbPoints = t.length;
    var nextX;
    var tI, yI, maxY;
    var result=[], current;
    for(var i=0; i<group.length;i++){
        nextX = group[i].x-group[i].width*4;
        //console.log(group[i]);
        while(t[currentIndex++]<nextX&&currentIndex<nbPoints);
        nextX = group[i].x+group[i].width*4;
        tI = [];
        yI = [];
        while(t[currentIndex]<=nextX&&currentIndex<nbPoints){
            tI.push(t[currentIndex][0]);
            yI.push(y_data[currentIndex][0]*maxY);
            currentIndex++;
        }

        current=optimizeSingleGaussian([tI, yI], group[i], opts);
        if(current){
            result.push({"x":current[0][0],"y":current[1][0],"width":current[2][0],"opt":true});
        }
        else{
            result.push({"x":group[i].x,"y":group[i].y,"width":group[i].width,"opt":false});
        }
    }

    return result;
}



/**
 *
 * @param xy A two column matrix containing the x and y data to be fitted
 * @param group A set of initial lorentzian parameters to be optimized [center, heigth, half_width_at_half_height]
 * @returns {Array} A set of final lorentzian parameters [center, heigth, hwhh*2]
 */
function optimizeLorentzianSum(xy, group, opts){
    var xy2 = parseData(xy);

    if(xy2===null||xy2[0].rows<3){
        return null; //Cannot run an optimization with less than 3 points
    }

    var t = xy2[0];
    var y_data = xy2[1];
    var maxY = xy2[2];
    var nbPoints = t.rows, i;

    var weight = [nbPoints / math.sqrt(y_data.dot(y_data))];
    var opts=Object.create(opts || [  3,    100, 1e-3, 1e-3, 1e-3, 1e-2, 1e-2, 11, 9, 1 ]);
    var consts = [ ];// optional vector of constants

    var nL = group.length;
    var p_init = new Matrix(nL*3,1);
    var p_min =  new Matrix(nL*3,1);
    var p_max =  new Matrix(nL*3,1);
    var dx = new Matrix(nL*3,1);
    var dt = Math.abs(t[0][0]-t[1][0]);
    for( i=0;i<nL;i++){
        p_init[i][0] = group[i].x;
        p_init[i+nL][0] = 1;
        p_init[i+2*nL][0] = group[i].width;

        p_min[i][0] = group[i].x-dt;//-group[i].width/4;
        p_min[i+nL][0] = 0;
        p_min[i+2*nL][0] = group[i].width/4;

        p_max[i][0] = group[i].x+dt;//+group[i].width/4;
        p_max[i+nL][0] = 1.5;
        p_max[i+2*nL][0] = group[i].width*4;

        dx[i][0] = -dt/1000;
        dx[i+nL][0] = -1e-3;
        dx[i+2*nL][0] = -dt/1000;
    }

    var dx = -Math.abs(t[0][0]-t[1][0])/10000;
    var p_fit = LM.optimize(sumOfLorentzians, p_init, t, y_data, weight, dx, p_min, p_max, consts, opts);
    p_fit=p_fit.p;
    //Put back the result in the correct format
    var result = new Array(nL);
    for( i=0;i<nL;i++){
        result[i]=[p_fit[i],[p_fit[i+nL][0]*maxY],p_fit[i+2*nL]];
    }

    return result;

}

/**
 *
 * @param xy A two column matrix containing the x and y data to be fitted
 * @param group A set of initial lorentzian parameters to be optimized [center, heigth, half_width_at_half_height]
 * @returns {Array} A set of final lorentzian parameters [center, heigth, hwhh*2]
 */
function optimizeGaussianSum(xy, group, opts){
    var xy2 = parseData(xy);

    if(xy2===null||xy2[0].rows<3){
        return null; //Cannot run an optimization with less than 3 points
    }

    var t = xy2[0];
    var y_data = xy2[1];
    var maxY = xy2[2];
    var nbPoints = t.rows,i;

    var weight = new Matrix(nbPoints,1);//[nbPoints / math.sqrt(y_data.dot(y_data))];
    var k = nbPoints / math.sqrt(y_data.dot(y_data));
    for(i=0;i<nbPoints;i++){
        weight[i][0]=k;///(y_data[i][0]);
        //weight[i][0]=k*(2-y_data[i][0]);
    }

    var opts=Object.create(opts || [  3,    100, 1e-3, 1e-3, 1e-3, 1e-2, 1e-2,    11,    9,        2 ]);
    //var opts=[  3,    100, 1e-5, 1e-6, 1e-6, 1e-6, 1e-6,    11,    9,        1 ];
    var consts = [ ];// optional vector of constants

    var nL = group.length;
    var p_init = new Matrix(nL*3,1);
    var p_min =  new Matrix(nL*3,1);
    var p_max =  new Matrix(nL*3,1);
    var dx = new Matrix(nL*3,1);
    var dt = Math.abs(t[0][0]-t[1][0]);
    for( i=0;i<nL;i++){
        p_init[i][0] = group[i].x;
        p_init[i+nL][0] = group[i].y/maxY;
        p_init[i+2*nL][0] = group[i].width;

        p_min[i][0] = group[i].x-dt;
        p_min[i+nL][0] = group[i].y*0.8/maxY;
        p_min[i+2*nL][0] = group[i].width/2;

        p_max[i][0] = group[i].x+dt;
        p_max[i+nL][0] = group[i].y*1.2/maxY;
        p_max[i+2*nL][0] = group[i].width*2;

        dx[i][0] = -dt/1000;
        dx[i+nL][0] = -1e-3;
        dx[i+2*nL][0] = -dt/1000;
    }
    //console.log(t);
    var p_fit = LM.optimize(sumOfLorentzians,p_init,t,y_data,weight,dx,p_min,p_max,consts,opts);
    p_fit = p_fit.p;
    //Put back the result in the correct format
    var result = new Array(nL);
    for( i=0;i<nL;i++){
        result[i]=[p_fit[i],[p_fit[i+nL][0]*maxY],p_fit[i+2*nL]];
    }

    return result;

}
/**
 *
 * Converts the given input to the required x, y column matrices. y data is normalized to max(y)=1
 * @param xy
 * @returns {*[]}
 */
function parseData(xy, threshold){
    var nbSeries = xy.length;
    var t = null;
    var y_data = null, x,y;
    var maxY = 0, i,j;

    if(nbSeries==2){
        //Looks like row wise matrix [x,y]
        var nbPoints = xy[0].length;
        //if(nbPoints<3)
        //    throw new Exception(nbPoints);
        //else{
        t = new Array(nbPoints);//new Matrix(nbPoints,1);
        y_data = new Array(nbPoints);//new Matrix(nbPoints,1);
        x = xy[0];
        y = xy[1];
        if(typeof x[0] === "number"){
            for(i=0;i<nbPoints;i++){
                t[i]=x[i];
                y_data[i]=y[i];
                if(y[i]>maxY)
                    maxY = y[i];
            }
        }
        else{
            //It is a colum matrix
            if(typeof x[0] === "object"){
                for(i=0;i<nbPoints;i++){
                    t[i]=x[i][0];
                    y_data[i]=y[i][0];
                    if(y[i][0]>maxY)
                        maxY = y[i][0];
                }
            }

        }

        //}
    }
    else{
        //Looks like a column wise matrix [[x],[y]]
        var nbPoints = nbSeries;
        //if(nbPoints<3)
        //    throw new SizeException(nbPoints);
        //else {
        t = new Array(nbPoints);//new Matrix(nbPoints, 1);
        y_data = new Array(nbPoints);//new Matrix(nbPoints, 1);
        for (i = 0; i < nbPoints; i++) {
            t[i] = xy[i][0];
            y_data[i] = xy[i][1];
            if(y_data[i]>maxY)
                maxY = y_data[i];
        }
        //}
    }
    for (i = 0; i < nbPoints; i++) {
        y_data[i]/=maxY;
    }
    if(threshold){
        for (i = nbPoints-1; i >=0; i--) {
            if(y_data[i]<threshold) {
                y_data.splice(i,1);
                t.splice(i,1);
            }
        }
    }
    if(t.length>0)
        return [(new Matrix([t])).transpose(),(new Matrix([y_data])).transpose(),maxY];
    return null;
}

function sizeException(nbPoints) {
    return new RangeError("Not enough points to perform the optimization: "+nbPoints +"< 3");
}

module.exports.optimizeSingleLorentzian = optimizeSingleLorentzian;
module.exports.optimizeLorentzianSum = optimizeLorentzianSum;
module.exports.optimizeSingleGaussian = optimizeSingleGaussian;
module.exports.optimizeGaussianSum = optimizeGaussianSum;
module.exports.singleGaussian = singleGaussian;
module.exports.singleLorentzian = singleLorentzian;
module.exports.optimizeGaussianTrain = optimizeGaussianTrain;
module.exports.optimizeLorentzianTrain = optimizeLorentzianTrain;

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.array = __webpack_require__(30);
exports.matrix = __webpack_require__(81);


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var arrayStat = __webpack_require__(30);

// https://github.com/accord-net/framework/blob/development/Sources/Accord.Statistics/Tools.cs

function entropy(matrix, eps) {
    if (typeof(eps) === 'undefined') {
        eps = 0;
    }
    var sum = 0,
        l1 = matrix.length,
        l2 = matrix[0].length;
    for (var i = 0; i < l1; i++) {
        for (var j = 0; j < l2; j++) {
            sum += matrix[i][j] * Math.log(matrix[i][j] + eps);
        }
    }
    return -sum;
}

function mean(matrix, dimension) {
    if (typeof(dimension) === 'undefined') {
        dimension = 0;
    }
    var rows = matrix.length,
        cols = matrix[0].length,
        theMean, N, i, j;

    if (dimension === -1) {
        theMean = [0];
        N = rows * cols;
        for (i = 0; i < rows; i++) {
            for (j = 0; j < cols; j++) {
                theMean[0] += matrix[i][j];
            }
        }
        theMean[0] /= N;
    } else if (dimension === 0) {
        theMean = new Array(cols);
        N = rows;
        for (j = 0; j < cols; j++) {
            theMean[j] = 0;
            for (i = 0; i < rows; i++) {
                theMean[j] += matrix[i][j];
            }
            theMean[j] /= N;
        }
    } else if (dimension === 1) {
        theMean = new Array(rows);
        N = cols;
        for (j = 0; j < rows; j++) {
            theMean[j] = 0;
            for (i = 0; i < cols; i++) {
                theMean[j] += matrix[j][i];
            }
            theMean[j] /= N;
        }
    } else {
        throw new Error('Invalid dimension');
    }
    return theMean;
}

function standardDeviation(matrix, means, unbiased) {
    var vari = variance(matrix, means, unbiased), l = vari.length;
    for (var i = 0; i < l; i++) {
        vari[i] = Math.sqrt(vari[i]);
    }
    return vari;
}

function variance(matrix, means, unbiased) {
    if (typeof(unbiased) === 'undefined') {
        unbiased = true;
    }
    means = means || mean(matrix);
    var rows = matrix.length;
    if (rows === 0) return [];
    var cols = matrix[0].length;
    var vari = new Array(cols);

    for (var j = 0; j < cols; j++) {
        var sum1 = 0, sum2 = 0, x = 0;
        for (var i = 0; i < rows; i++) {
            x = matrix[i][j] - means[j];
            sum1 += x;
            sum2 += x * x;
        }
        if (unbiased) {
            vari[j] = (sum2 - ((sum1 * sum1) / rows)) / (rows - 1);
        } else {
            vari[j] = (sum2 - ((sum1 * sum1) / rows)) / rows;
        }
    }
    return vari;
}

function median(matrix) {
    var rows = matrix.length, cols = matrix[0].length;
    var medians = new Array(cols);

    for (var i = 0; i < cols; i++) {
        var data = new Array(rows);
        for (var j = 0; j < rows; j++) {
            data[j] = matrix[j][i];
        }
        data.sort();
        var N = data.length;
        if (N % 2 === 0) {
            medians[i] = (data[N / 2] + data[(N / 2) - 1]) * 0.5;
        } else {
            medians[i] = data[Math.floor(N / 2)];
        }
    }
    return medians;
}

function mode(matrix) {
    var rows = matrix.length,
        cols = matrix[0].length,
        modes = new Array(cols),
        i, j;
    for (i = 0; i < cols; i++) {
        var itemCount = new Array(rows);
        for (var k = 0; k < rows; k++) {
            itemCount[k] = 0;
        }
        var itemArray = new Array(rows);
        var count = 0;

        for (j = 0; j < rows; j++) {
            var index = itemArray.indexOf(matrix[j][i]);
            if (index >= 0) {
                itemCount[index]++;
            } else {
                itemArray[count] = matrix[j][i];
                itemCount[count] = 1;
                count++;
            }
        }

        var maxValue = 0, maxIndex = 0;
        for (j = 0; j < count; j++) {
            if (itemCount[j] > maxValue) {
                maxValue = itemCount[j];
                maxIndex = j;
            }
        }

        modes[i] = itemArray[maxIndex];
    }
    return modes;
}

function skewness(matrix, unbiased) {
    if (typeof(unbiased) === 'undefined') unbiased = true;
    var means = mean(matrix);
    var n = matrix.length, l = means.length;
    var skew = new Array(l);

    for (var j = 0; j < l; j++) {
        var s2 = 0, s3 = 0;
        for (var i = 0; i < n; i++) {
            var dev = matrix[i][j] - means[j];
            s2 += dev * dev;
            s3 += dev * dev * dev;
        }

        var m2 = s2 / n;
        var m3 = s3 / n;
        var g = m3 / Math.pow(m2, 3 / 2);

        if (unbiased) {
            var a = Math.sqrt(n * (n - 1));
            var b = n - 2;
            skew[j] = (a / b) * g;
        } else {
            skew[j] = g;
        }
    }
    return skew;
}

function kurtosis(matrix, unbiased) {
    if (typeof(unbiased) === 'undefined') unbiased = true;
    var means = mean(matrix);
    var n = matrix.length, m = matrix[0].length;
    var kurt = new Array(m);

    for (var j = 0; j < m; j++) {
        var s2 = 0, s4 = 0;
        for (var i = 0; i < n; i++) {
            var dev = matrix[i][j] - means[j];
            s2 += dev * dev;
            s4 += dev * dev * dev * dev;
        }
        var m2 = s2 / n;
        var m4 = s4 / n;

        if (unbiased) {
            var v = s2 / (n - 1);
            var a = (n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3));
            var b = s4 / (v * v);
            var c = ((n - 1) * (n - 1)) / ((n - 2) * (n - 3));
            kurt[j] = a * b - 3 * c;
        } else {
            kurt[j] = m4 / (m2 * m2) - 3;
        }
    }
    return kurt;
}

function standardError(matrix) {
    var samples = matrix.length;
    var standardDeviations = standardDeviation(matrix), l = standardDeviations.length;
    var standardErrors = new Array(l);
    var sqrtN = Math.sqrt(samples);

    for (var i = 0; i < l; i++) {
        standardErrors[i] = standardDeviations[i] / sqrtN;
    }
    return standardErrors;
}

function covariance(matrix, dimension) {
    return scatter(matrix, undefined, dimension);
}

function scatter(matrix, divisor, dimension) {
    if (typeof(dimension) === 'undefined') {
        dimension = 0;
    }
    if (typeof(divisor) === 'undefined') {
        if (dimension === 0) {
            divisor = matrix.length - 1;
        } else if (dimension === 1) {
            divisor = matrix[0].length - 1;
        }
    }
    var means = mean(matrix, dimension),
        rows = matrix.length;
    if (rows === 0) {
        return [[]];
    }
    var cols = matrix[0].length,
        cov, i, j, s, k;

    if (dimension === 0) {
        cov = new Array(cols);
        for (i = 0; i < cols; i++) {
            cov[i] = new Array(cols);
        }
        for (i = 0; i < cols; i++) {
            for (j = i; j < cols; j++) {
                s = 0;
                for (k = 0; k < rows; k++) {
                    s += (matrix[k][j] - means[j]) * (matrix[k][i] - means[i]);
                }
                s /= divisor;
                cov[i][j] = s;
                cov[j][i] = s;
            }
        }
    } else if (dimension === 1) {
        cov = new Array(rows);
        for (i = 0; i < rows; i++) {
            cov[i] = new Array(rows);
        }
        for (i = 0; i < rows; i++) {
            for (j = i; j < rows; j++) {
                s = 0;
                for (k = 0; k < cols; k++) {
                    s += (matrix[j][k] - means[j]) * (matrix[i][k] - means[i]);
                }
                s /= divisor;
                cov[i][j] = s;
                cov[j][i] = s;
            }
        }
    } else {
        throw new Error('Invalid dimension');
    }

    return cov;
}

function correlation(matrix) {
    var means = mean(matrix),
        standardDeviations = standardDeviation(matrix, true, means),
        scores = zScores(matrix, means, standardDeviations),
        rows = matrix.length,
        cols = matrix[0].length,
        i, j;

    var cor = new Array(cols);
    for (i = 0; i < cols; i++) {
        cor[i] = new Array(cols);
    }
    for (i = 0; i < cols; i++) {
        for (j = i; j < cols; j++) {
            var c = 0;
            for (var k = 0, l = scores.length; k < l; k++) {
                c += scores[k][j] * scores[k][i];
            }
            c /= rows - 1;
            cor[i][j] = c;
            cor[j][i] = c;
        }
    }
    return cor;
}

function zScores(matrix, means, standardDeviations) {
    means = means || mean(matrix);
    if (typeof(standardDeviations) === 'undefined') standardDeviations = standardDeviation(matrix, true, means);
    return standardize(center(matrix, means, false), standardDeviations, true);
}

function center(matrix, means, inPlace) {
    means = means || mean(matrix);
    var result = matrix,
        l = matrix.length,
        i, j, jj;

    if (!inPlace) {
        result = new Array(l);
        for (i = 0; i < l; i++) {
            result[i] = new Array(matrix[i].length);
        }
    }

    for (i = 0; i < l; i++) {
        var row = result[i];
        for (j = 0, jj = row.length; j < jj; j++) {
            row[j] = matrix[i][j] - means[j];
        }
    }
    return result;
}

function standardize(matrix, standardDeviations, inPlace) {
    if (typeof(standardDeviations) === 'undefined') standardDeviations = standardDeviation(matrix);
    var result = matrix,
        l = matrix.length,
        i, j, jj;

    if (!inPlace) {
        result = new Array(l);
        for (i = 0; i < l; i++) {
            result[i] = new Array(matrix[i].length);
        }
    }

    for (i = 0; i < l; i++) {
        var resultRow = result[i];
        var sourceRow = matrix[i];
        for (j = 0, jj = resultRow.length; j < jj; j++) {
            if (standardDeviations[j] !== 0 && !isNaN(standardDeviations[j])) {
                resultRow[j] = sourceRow[j] / standardDeviations[j];
            }
        }
    }
    return result;
}

function weightedVariance(matrix, weights) {
    var means = mean(matrix);
    var rows = matrix.length;
    if (rows === 0) return [];
    var cols = matrix[0].length;
    var vari = new Array(cols);

    for (var j = 0; j < cols; j++) {
        var sum = 0;
        var a = 0, b = 0;

        for (var i = 0; i < rows; i++) {
            var z = matrix[i][j] - means[j];
            var w = weights[i];

            sum += w * (z * z);
            b += w;
            a += w * w;
        }

        vari[j] = sum * (b / (b * b - a));
    }

    return vari;
}

function weightedMean(matrix, weights, dimension) {
    if (typeof(dimension) === 'undefined') {
        dimension = 0;
    }
    var rows = matrix.length;
    if (rows === 0) return [];
    var cols = matrix[0].length,
        means, i, ii, j, w, row;

    if (dimension === 0) {
        means = new Array(cols);
        for (i = 0; i < cols; i++) {
            means[i] = 0;
        }
        for (i = 0; i < rows; i++) {
            row = matrix[i];
            w = weights[i];
            for (j = 0; j < cols; j++) {
                means[j] += row[j] * w;
            }
        }
    } else if (dimension === 1) {
        means = new Array(rows);
        for (i = 0; i < rows; i++) {
            means[i] = 0;
        }
        for (j = 0; j < rows; j++) {
            row = matrix[j];
            w = weights[j];
            for (i = 0; i < cols; i++) {
                means[j] += row[i] * w;
            }
        }
    } else {
        throw new Error('Invalid dimension');
    }

    var weightSum = arrayStat.sum(weights);
    if (weightSum !== 0) {
        for (i = 0, ii = means.length; i < ii; i++) {
            means[i] /= weightSum;
        }
    }
    return means;
}

function weightedCovariance(matrix, weights, means, dimension) {
    dimension = dimension || 0;
    means = means || weightedMean(matrix, weights, dimension);
    var s1 = 0, s2 = 0;
    for (var i = 0, ii = weights.length; i < ii; i++) {
        s1 += weights[i];
        s2 += weights[i] * weights[i];
    }
    var factor = s1 / (s1 * s1 - s2);
    return weightedScatter(matrix, weights, means, factor, dimension);
}

function weightedScatter(matrix, weights, means, factor, dimension) {
    dimension = dimension || 0;
    means = means || weightedMean(matrix, weights, dimension);
    if (typeof(factor) === 'undefined') {
        factor = 1;
    }
    var rows = matrix.length;
    if (rows === 0) {
        return [[]];
    }
    var cols = matrix[0].length,
        cov, i, j, k, s;

    if (dimension === 0) {
        cov = new Array(cols);
        for (i = 0; i < cols; i++) {
            cov[i] = new Array(cols);
        }
        for (i = 0; i < cols; i++) {
            for (j = i; j < cols; j++) {
                s = 0;
                for (k = 0; k < rows; k++) {
                    s += weights[k] * (matrix[k][j] - means[j]) * (matrix[k][i] - means[i]);
                }
                cov[i][j] = s * factor;
                cov[j][i] = s * factor;
            }
        }
    } else if (dimension === 1) {
        cov = new Array(rows);
        for (i = 0; i < rows; i++) {
            cov[i] = new Array(rows);
        }
        for (i = 0; i < rows; i++) {
            for (j = i; j < rows; j++) {
                s = 0;
                for (k = 0; k < cols; k++) {
                    s += weights[k] * (matrix[j][k] - means[j]) * (matrix[i][k] - means[i]);
                }
                cov[i][j] = s * factor;
                cov[j][i] = s * factor;
            }
        }
    } else {
        throw new Error('Invalid dimension');
    }

    return cov;
}

module.exports = {
    entropy: entropy,
    mean: mean,
    standardDeviation: standardDeviation,
    variance: variance,
    median: median,
    mode: mode,
    skewness: skewness,
    kurtosis: kurtosis,
    standardError: standardError,
    covariance: covariance,
    scatter: scatter,
    correlation: correlation,
    zScores: zScores,
    center: center,
    standardize: standardize,
    weightedVariance: weightedVariance,
    weightedMean: weightedMean,
    weightedCovariance: weightedCovariance,
    weightedScatter: weightedScatter
};


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

//Code translate from Pascal source in http://pubs.acs.org/doi/pdf/10.1021/ac00205a007
var extend = __webpack_require__(16);
var stat = __webpack_require__(80);

var defaultOptions = {
    windowSize: 9,
    derivative: 0,
    polynomial: 3,
};


function SavitzkyGolay(data, h, options) {
    options = extend({}, defaultOptions, options);

    if ((options.windowSize % 2 === 0) || (options.windowSize < 5) || !(Number.isInteger(options.windowSize)))
            throw new RangeError('Invalid window size (should be odd and at least 5 integer number)')


    if (options.windowSize>data.length)
        throw new RangeError('Window size is higher than the data length '+options.windowSize+">"+data.length);
    if ((options.derivative < 0) || !(Number.isInteger(options.derivative)))
        throw new RangeError('Derivative should be a positive integer');
    if ((options.polynomial < 1) || !(Number.isInteger(options.polynomial)))
        throw new RangeError('Polynomial should be a positive integer');
    if (options.polynomial >= 6)
        console.warn('You should not use polynomial grade higher than 5 if you are' +
            ' not sure that your data arises from such a model. Possible polynomial oscillation problems');

    var windowSize = options.windowSize;

    var half = Math.floor(windowSize/2);
    var np = data.length;
    var ans = new Array(np);
    var weights = fullWeights(windowSize,options.polynomial,options.derivative);
    var hs = 0;
    var constantH = true;
    if( Object.prototype.toString.call( h ) === '[object Array]' ) {
        constantH = false;
    }
    else{
        hs = Math.pow(h, options.derivative);
    }
    //console.log("Constant h: "+constantH);
    //For the borders
    for(var i=0;i<half;i++){
        var wg1=weights[half-i-1];
        var wg2=weights[half+i+1];
        var d1 = 0,d2=0;
        for (var l = 0; l < windowSize; l++){
            d1 += wg1[l] * data[l];
            d2 += wg2[l] * data[np-windowSize+l-1];
        }
        if(constantH){
            ans[half-i-1] = d1/hs;
            ans[np-half+i] = d2/hs;
        }
        else{
            hs = getHs(h,half-i-1,half, options.derivative);
            ans[half-i-1] = d1/hs;
            hs = getHs(h,np-half+i,half, options.derivative);
            ans[np-half+i] = d2/hs;
        }
    }
    //For the internal points
    var wg = weights[half];
    for(var i=windowSize;i<np+1;i++){
        var d = 0;
        for (var l = 0; l < windowSize; l++)
            d += wg[l] * data[l+i-windowSize];
        if(!constantH)
            hs = getHs(h,i-half-1,half, options.derivative);
        ans[i-half-1] = d/hs;
    }
    return ans;
}

function getHs(h,center,half,derivative){
    var hs = 0;
    var count = 0;
    for(var i=center-half;i<center+half;i++){
        if(i>=0 && i < h.length-1){
            hs+= (h[i+1]-h[i]);
            count++;
        }
    }
    return Math.pow(hs/count,derivative);
}

function GramPoly(i,m,k,s){
    var Grampoly = 0;
    if(k>0){
        Grampoly = (4*k-2)/(k*(2*m-k+1))*(i*GramPoly(i,m,k-1,s) +
            s*GramPoly(i,m,k-1,s-1)) - ((k-1)*(2*m+k))/(k*(2*m-k+1))*GramPoly(i,m,k-2,s);
    }
    else{
        if(k==0&&s==0){
            Grampoly=1;
        }
        else{
            Grampoly=0;
        }
    }
    //console.log(Grampoly);
    return Grampoly;
}

function GenFact(a,b){
    var gf=1;
    if(a>=b){
        for(var j=a-b+1;j<=a;j++){
            gf*=j;
        }
    }
    return gf;
}

function Weight(i,t,m,n,s){
    var sum=0;
    for(var k=0;k<=n;k++){
        //console.log(k);
        sum+=(2*k+1)*(GenFact(2*m,k)/GenFact(2*m+k+1,k+1))*GramPoly(i,m,k,0)*GramPoly(t,m,k,s)
    }
    return sum;
}

/**
 *
 * @param m  Number of points
 * @param n  Polynomial grade
 * @param s  Derivative
 */
function fullWeights(m,n,s){
    var weights = new Array(m);
    var np = Math.floor(m/2);
    for(var t=-np;t<=np;t++){
        weights[t+np] = new Array(m);
        for(var j=-np;j<=np;j++){
            weights[t+np][j+np]=Weight(j,t,np,n,s);
        }
    }
    return weights;
}

/*function entropy(data,h,options){
    var trend = SavitzkyGolay(data,h,trendOptions);
    var copy = new Array(data.length);
    var sum = 0;
    var max = 0;
    for(var i=0;i<data.length;i++){
        copy[i] = data[i]-trend[i];
    }

    sum/=data.length;
    console.log(sum+" "+max);
    console.log(stat.array.standardDeviation(copy));
    console.log(Math.abs(stat.array.mean(copy))/stat.array.standardDeviation(copy));
    return sum;

}



function guessWindowSize(data, h){
    console.log("entropy "+entropy(data,h,trendOptions));
    return 5;
}
*/
module.exports = SavitzkyGolay;
 


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by acastillo on 8/8/16.
 */


const defOptions = {
    threshold:0,
    out:"assignment"
};
//TODO Consider a matrix of distances too
module.exports = function fullClusterGenerator(conMat, opt) {
    const options = Object.assign({}, defOptions, opt);
    var clList, i, j, k;
    if(typeof conMat[0] === "number"){
        clList = fullClusterGeneratorVector(conMat);
    }
    else{
        if(typeof conMat[0] === "object"){
            var nRows = conMat.length;
            var conn = new Array(nRows*(nRows+1)/2);
            var index = 0;
            for(var i=0;i<nRows;i++){
                for(var j=i;j<nRows;j++){
                    if(conMat[i][j]>options.threshold)
                        conn[index++]= 1;
                    else
                        conn[index++]= 0;
                }
            }
            clList = fullClusterGeneratorVector(conn);
        }
    }
    if (options.out === "indexes" || options.out === "values") {
        var result = new Array(clList.length);
        for(i=0;i<clList.length;i++){
            result[i] = [];
            for(j=0;j<clList[i].length;j++){
                if(clList[i][j] != 0){
                    result[i].push(j);
                }
            }
        }
        if (options.out === "values") {
            var resultAsMatrix = new Array(result.length);
            for (i = 0; i<result.length;i++){
                resultAsMatrix[i]=new Array(result[i].length);
                for(j = 0; j < result[i].length; j++){
                    resultAsMatrix[i][j]=new Array(result[i].length);
                    for(k = 0; k < result[i].length; k++){
                        resultAsMatrix[i][j][k]=conMat[result[i][j]][result[i][k]];
                    }
                }
            }
            return resultAsMatrix;
        }
        else{
            return result;
        }
    }

    return clList;

}

function fullClusterGeneratorVector(conn){
    var nRows = Math.sqrt(conn.length*2+0.25)-0.5;
    var clusterList = [];
    var available = new Array(nRows);
    var remaining = nRows, i=0;
    var cluster = [];
    //Mark all the elements as available
    for(i=nRows-1;i>=0;i--){
        available[i]=1;
    }
    var nextAv=-1;
    var toInclude = [];
    while(remaining>0){
        if(toInclude.length===0){
            //If there is no more elements to include. Start a new cluster
            cluster = new Array(nRows);
            for(i = 0;i < nRows ;i++)
                cluster[i]=0;
            clusterList.push(cluster);
            for(nextAv = 0;available[nextAv]==0;nextAv++){};
        }
        else{
            nextAv=toInclude.splice(0,1);
        }
        cluster[nextAv]=1;
        available[nextAv]=0;
        remaining--;
        //Copy the next available row
        var row = new Array(nRows);
        for( i = 0;i < nRows;i++){
            var c=Math.max(nextAv,i);
            var r=Math.min(nextAv,i);
            //The element in the conn matrix
            //console.log("index: "+r*(2*nRows-r-1)/2+c)
            row[i]=conn[r*(2*nRows-r-1)/2+c];
            //There is new elements to include in this row?
            //Then, include it to the current cluster
            if(row[i]==1&&available[i]==1&&cluster[i]==0){
                toInclude.push(i);
                cluster[i]=1;
            }
        }
    }
    return clusterList;
}

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var arrayStat = __webpack_require__(31);

function compareNumbers(a, b) {
    return a - b;
}

exports.max = function max(matrix) {
    var max = -Infinity;
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] > max) max = matrix[i][j];
        }
    }
    return max;
};

exports.min = function min(matrix) {
    var min = Infinity;
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] < min) min = matrix[i][j];
        }
    }
    return min;
};

exports.minMax = function minMax(matrix) {
    var min = Infinity;
    var max = -Infinity;
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] < min) min = matrix[i][j];
            if (matrix[i][j] > max) max = matrix[i][j];
        }
    }
    return {
        min:min,
        max:max
    };
};

exports.entropy = function entropy(matrix, eps) {
    if (typeof (eps) === 'undefined') {
        eps = 0;
    }
    var sum = 0,
        l1 = matrix.length,
        l2 = matrix[0].length;
    for (var i = 0; i < l1; i++) {
        for (var j = 0; j < l2; j++) {
            sum += matrix[i][j] * Math.log(matrix[i][j] + eps);
        }
    }
    return -sum;
};

exports.mean = function mean(matrix, dimension) {
    if (typeof (dimension) === 'undefined') {
        dimension = 0;
    }
    var rows = matrix.length,
        cols = matrix[0].length,
        theMean, N, i, j;

    if (dimension === -1) {
        theMean = [0];
        N = rows * cols;
        for (i = 0; i < rows; i++) {
            for (j = 0; j < cols; j++) {
                theMean[0] += matrix[i][j];
            }
        }
        theMean[0] /= N;
    } else if (dimension === 0) {
        theMean = new Array(cols);
        N = rows;
        for (j = 0; j < cols; j++) {
            theMean[j] = 0;
            for (i = 0; i < rows; i++) {
                theMean[j] += matrix[i][j];
            }
            theMean[j] /= N;
        }
    } else if (dimension === 1) {
        theMean = new Array(rows);
        N = cols;
        for (j = 0; j < rows; j++) {
            theMean[j] = 0;
            for (i = 0; i < cols; i++) {
                theMean[j] += matrix[j][i];
            }
            theMean[j] /= N;
        }
    } else {
        throw new Error('Invalid dimension');
    }
    return theMean;
};

exports.sum = function sum(matrix, dimension) {
    if (typeof (dimension) === 'undefined') {
        dimension = 0;
    }
    var rows = matrix.length,
        cols = matrix[0].length,
        theSum, i, j;

    if (dimension === -1) {
        theSum = [0];
        for (i = 0; i < rows; i++) {
            for (j = 0; j < cols; j++) {
                theSum[0] += matrix[i][j];
            }
        }
    } else if (dimension === 0) {
        theSum = new Array(cols);
        for (j = 0; j < cols; j++) {
            theSum[j] = 0;
            for (i = 0; i < rows; i++) {
                theSum[j] += matrix[i][j];
            }
        }
    } else if (dimension === 1) {
        theSum = new Array(rows);
        for (j = 0; j < rows; j++) {
            theSum[j] = 0;
            for (i = 0; i < cols; i++) {
                theSum[j] += matrix[j][i];
            }
        }
    } else {
        throw new Error('Invalid dimension');
    }
    return theSum;
};

exports.product = function product(matrix, dimension) {
    if (typeof (dimension) === 'undefined') {
        dimension = 0;
    }
    var rows = matrix.length,
        cols = matrix[0].length,
        theProduct, i, j;

    if (dimension === -1) {
        theProduct = [1];
        for (i = 0; i < rows; i++) {
            for (j = 0; j < cols; j++) {
                theProduct[0] *= matrix[i][j];
            }
        }
    } else if (dimension === 0) {
        theProduct = new Array(cols);
        for (j = 0; j < cols; j++) {
            theProduct[j] = 1;
            for (i = 0; i < rows; i++) {
                theProduct[j] *= matrix[i][j];
            }
        }
    } else if (dimension === 1) {
        theProduct = new Array(rows);
        for (j = 0; j < rows; j++) {
            theProduct[j] = 1;
            for (i = 0; i < cols; i++) {
                theProduct[j] *= matrix[j][i];
            }
        }
    } else {
        throw new Error('Invalid dimension');
    }
    return theProduct;
};

exports.standardDeviation = function standardDeviation(matrix, means, unbiased) {
    var vari = exports.variance(matrix, means, unbiased), l = vari.length;
    for (var i = 0; i < l; i++) {
        vari[i] = Math.sqrt(vari[i]);
    }
    return vari;
};

exports.variance = function variance(matrix, means, unbiased) {
    if (typeof (unbiased) === 'undefined') {
        unbiased = true;
    }
    means = means || exports.mean(matrix);
    var rows = matrix.length;
    if (rows === 0) return [];
    var cols = matrix[0].length;
    var vari = new Array(cols);

    for (var j = 0; j < cols; j++) {
        var sum1 = 0, sum2 = 0, x = 0;
        for (var i = 0; i < rows; i++) {
            x = matrix[i][j] - means[j];
            sum1 += x;
            sum2 += x * x;
        }
        if (unbiased) {
            vari[j] = (sum2 - ((sum1 * sum1) / rows)) / (rows - 1);
        } else {
            vari[j] = (sum2 - ((sum1 * sum1) / rows)) / rows;
        }
    }
    return vari;
};

exports.median = function median(matrix) {
    var rows = matrix.length, cols = matrix[0].length;
    var medians = new Array(cols);

    for (var i = 0; i < cols; i++) {
        var data = new Array(rows);
        for (var j = 0; j < rows; j++) {
            data[j] = matrix[j][i];
        }
        data.sort(compareNumbers);
        var N = data.length;
        if (N % 2 === 0) {
            medians[i] = (data[N / 2] + data[(N / 2) - 1]) * 0.5;
        } else {
            medians[i] = data[Math.floor(N / 2)];
        }
    }
    return medians;
};

exports.mode = function mode(matrix) {
    var rows = matrix.length,
        cols = matrix[0].length,
        modes = new Array(cols),
        i, j;
    for (i = 0; i < cols; i++) {
        var itemCount = new Array(rows);
        for (var k = 0; k < rows; k++) {
            itemCount[k] = 0;
        }
        var itemArray = new Array(rows);
        var count = 0;

        for (j = 0; j < rows; j++) {
            var index = itemArray.indexOf(matrix[j][i]);
            if (index >= 0) {
                itemCount[index]++;
            } else {
                itemArray[count] = matrix[j][i];
                itemCount[count] = 1;
                count++;
            }
        }

        var maxValue = 0, maxIndex = 0;
        for (j = 0; j < count; j++) {
            if (itemCount[j] > maxValue) {
                maxValue = itemCount[j];
                maxIndex = j;
            }
        }

        modes[i] = itemArray[maxIndex];
    }
    return modes;
};

exports.skewness = function skewness(matrix, unbiased) {
    if (typeof (unbiased) === 'undefined') unbiased = true;
    var means = exports.mean(matrix);
    var n = matrix.length, l = means.length;
    var skew = new Array(l);

    for (var j = 0; j < l; j++) {
        var s2 = 0, s3 = 0;
        for (var i = 0; i < n; i++) {
            var dev = matrix[i][j] - means[j];
            s2 += dev * dev;
            s3 += dev * dev * dev;
        }

        var m2 = s2 / n;
        var m3 = s3 / n;
        var g = m3 / Math.pow(m2, 3 / 2);

        if (unbiased) {
            var a = Math.sqrt(n * (n - 1));
            var b = n - 2;
            skew[j] = (a / b) * g;
        } else {
            skew[j] = g;
        }
    }
    return skew;
};

exports.kurtosis = function kurtosis(matrix, unbiased) {
    if (typeof (unbiased) === 'undefined') unbiased = true;
    var means = exports.mean(matrix);
    var n = matrix.length, m = matrix[0].length;
    var kurt = new Array(m);

    for (var j = 0; j < m; j++) {
        var s2 = 0, s4 = 0;
        for (var i = 0; i < n; i++) {
            var dev = matrix[i][j] - means[j];
            s2 += dev * dev;
            s4 += dev * dev * dev * dev;
        }
        var m2 = s2 / n;
        var m4 = s4 / n;

        if (unbiased) {
            var v = s2 / (n - 1);
            var a = (n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3));
            var b = s4 / (v * v);
            var c = ((n - 1) * (n - 1)) / ((n - 2) * (n - 3));
            kurt[j] = a * b - 3 * c;
        } else {
            kurt[j] = m4 / (m2 * m2) - 3;
        }
    }
    return kurt;
};

exports.standardError = function standardError(matrix) {
    var samples = matrix.length;
    var standardDeviations = exports.standardDeviation(matrix);
    var l = standardDeviations.length;
    var standardErrors = new Array(l);
    var sqrtN = Math.sqrt(samples);

    for (var i = 0; i < l; i++) {
        standardErrors[i] = standardDeviations[i] / sqrtN;
    }
    return standardErrors;
};

exports.covariance = function covariance(matrix, dimension) {
    return exports.scatter(matrix, undefined, dimension);
};

exports.scatter = function scatter(matrix, divisor, dimension) {
    if (typeof (dimension) === 'undefined') {
        dimension = 0;
    }
    if (typeof (divisor) === 'undefined') {
        if (dimension === 0) {
            divisor = matrix.length - 1;
        } else if (dimension === 1) {
            divisor = matrix[0].length - 1;
        }
    }
    var means = exports.mean(matrix, dimension);
    var rows = matrix.length;
    if (rows === 0) {
        return [[]];
    }
    var cols = matrix[0].length,
        cov, i, j, s, k;

    if (dimension === 0) {
        cov = new Array(cols);
        for (i = 0; i < cols; i++) {
            cov[i] = new Array(cols);
        }
        for (i = 0; i < cols; i++) {
            for (j = i; j < cols; j++) {
                s = 0;
                for (k = 0; k < rows; k++) {
                    s += (matrix[k][j] - means[j]) * (matrix[k][i] - means[i]);
                }
                s /= divisor;
                cov[i][j] = s;
                cov[j][i] = s;
            }
        }
    } else if (dimension === 1) {
        cov = new Array(rows);
        for (i = 0; i < rows; i++) {
            cov[i] = new Array(rows);
        }
        for (i = 0; i < rows; i++) {
            for (j = i; j < rows; j++) {
                s = 0;
                for (k = 0; k < cols; k++) {
                    s += (matrix[j][k] - means[j]) * (matrix[i][k] - means[i]);
                }
                s /= divisor;
                cov[i][j] = s;
                cov[j][i] = s;
            }
        }
    } else {
        throw new Error('Invalid dimension');
    }

    return cov;
};

exports.correlation = function correlation(matrix) {
    var means = exports.mean(matrix),
        standardDeviations = exports.standardDeviation(matrix, true, means),
        scores = exports.zScores(matrix, means, standardDeviations),
        rows = matrix.length,
        cols = matrix[0].length,
        i, j;

    var cor = new Array(cols);
    for (i = 0; i < cols; i++) {
        cor[i] = new Array(cols);
    }
    for (i = 0; i < cols; i++) {
        for (j = i; j < cols; j++) {
            var c = 0;
            for (var k = 0, l = scores.length; k < l; k++) {
                c += scores[k][j] * scores[k][i];
            }
            c /= rows - 1;
            cor[i][j] = c;
            cor[j][i] = c;
        }
    }
    return cor;
};

exports.zScores = function zScores(matrix, means, standardDeviations) {
    means = means || exports.mean(matrix);
    if (typeof (standardDeviations) === 'undefined') standardDeviations = exports.standardDeviation(matrix, true, means);
    return exports.standardize(exports.center(matrix, means, false), standardDeviations, true);
};

exports.center = function center(matrix, means, inPlace) {
    means = means || exports.mean(matrix);
    var result = matrix,
        l = matrix.length,
        i, j, jj;

    if (!inPlace) {
        result = new Array(l);
        for (i = 0; i < l; i++) {
            result[i] = new Array(matrix[i].length);
        }
    }

    for (i = 0; i < l; i++) {
        var row = result[i];
        for (j = 0, jj = row.length; j < jj; j++) {
            row[j] = matrix[i][j] - means[j];
        }
    }
    return result;
};

exports.standardize = function standardize(matrix, standardDeviations, inPlace) {
    if (typeof (standardDeviations) === 'undefined') standardDeviations = exports.standardDeviation(matrix);
    var result = matrix,
        l = matrix.length,
        i, j, jj;

    if (!inPlace) {
        result = new Array(l);
        for (i = 0; i < l; i++) {
            result[i] = new Array(matrix[i].length);
        }
    }

    for (i = 0; i < l; i++) {
        var resultRow = result[i];
        var sourceRow = matrix[i];
        for (j = 0, jj = resultRow.length; j < jj; j++) {
            if (standardDeviations[j] !== 0 && !isNaN(standardDeviations[j])) {
                resultRow[j] = sourceRow[j] / standardDeviations[j];
            }
        }
    }
    return result;
};

exports.weightedVariance = function weightedVariance(matrix, weights) {
    var means = exports.mean(matrix);
    var rows = matrix.length;
    if (rows === 0) return [];
    var cols = matrix[0].length;
    var vari = new Array(cols);

    for (var j = 0; j < cols; j++) {
        var sum = 0;
        var a = 0, b = 0;

        for (var i = 0; i < rows; i++) {
            var z = matrix[i][j] - means[j];
            var w = weights[i];

            sum += w * (z * z);
            b += w;
            a += w * w;
        }

        vari[j] = sum * (b / (b * b - a));
    }

    return vari;
};

exports.weightedMean = function weightedMean(matrix, weights, dimension) {
    if (typeof (dimension) === 'undefined') {
        dimension = 0;
    }
    var rows = matrix.length;
    if (rows === 0) return [];
    var cols = matrix[0].length,
        means, i, ii, j, w, row;

    if (dimension === 0) {
        means = new Array(cols);
        for (i = 0; i < cols; i++) {
            means[i] = 0;
        }
        for (i = 0; i < rows; i++) {
            row = matrix[i];
            w = weights[i];
            for (j = 0; j < cols; j++) {
                means[j] += row[j] * w;
            }
        }
    } else if (dimension === 1) {
        means = new Array(rows);
        for (i = 0; i < rows; i++) {
            means[i] = 0;
        }
        for (j = 0; j < rows; j++) {
            row = matrix[j];
            w = weights[j];
            for (i = 0; i < cols; i++) {
                means[j] += row[i] * w;
            }
        }
    } else {
        throw new Error('Invalid dimension');
    }

    var weightSum = arrayStat.sum(weights);
    if (weightSum !== 0) {
        for (i = 0, ii = means.length; i < ii; i++) {
            means[i] /= weightSum;
        }
    }
    return means;
};

exports.weightedCovariance = function weightedCovariance(matrix, weights, means, dimension) {
    dimension = dimension || 0;
    means = means || exports.weightedMean(matrix, weights, dimension);
    var s1 = 0, s2 = 0;
    for (var i = 0, ii = weights.length; i < ii; i++) {
        s1 += weights[i];
        s2 += weights[i] * weights[i];
    }
    var factor = s1 / (s1 * s1 - s2);
    return exports.weightedScatter(matrix, weights, means, factor, dimension);
};

exports.weightedScatter = function weightedScatter(matrix, weights, means, factor, dimension) {
    dimension = dimension || 0;
    means = means || exports.weightedMean(matrix, weights, dimension);
    if (typeof (factor) === 'undefined') {
        factor = 1;
    }
    var rows = matrix.length;
    if (rows === 0) {
        return [[]];
    }
    var cols = matrix[0].length,
        cov, i, j, k, s;

    if (dimension === 0) {
        cov = new Array(cols);
        for (i = 0; i < cols; i++) {
            cov[i] = new Array(cols);
        }
        for (i = 0; i < cols; i++) {
            for (j = i; j < cols; j++) {
                s = 0;
                for (k = 0; k < rows; k++) {
                    s += weights[k] * (matrix[k][j] - means[j]) * (matrix[k][i] - means[i]);
                }
                cov[i][j] = s * factor;
                cov[j][i] = s * factor;
            }
        }
    } else if (dimension === 1) {
        cov = new Array(rows);
        for (i = 0; i < rows; i++) {
            cov[i] = new Array(rows);
        }
        for (i = 0; i < rows; i++) {
            for (j = i; j < rows; j++) {
                s = 0;
                for (k = 0; k < cols; k++) {
                    s += weights[k] * (matrix[j][k] - means[j]) * (matrix[i][k] - means[i]);
                }
                cov[i][j] = s * factor;
                cov[j][i] = s * factor;
            }
        }
    } else {
        throw new Error('Invalid dimension');
    }

    return cov;
};


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Top level file is just a mixin of submodules & constants


var assign    = __webpack_require__(1).assign;

var deflate   = __webpack_require__(86);
var inflate   = __webpack_require__(87);
var constants = __webpack_require__(34);

var pako = {};

assign(pako, deflate, inflate, constants);

module.exports = pako;


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



var zlib_deflate = __webpack_require__(88);
var utils        = __webpack_require__(1);
var strings      = __webpack_require__(32);
var msg          = __webpack_require__(12);
var ZStream      = __webpack_require__(36);

var toString = Object.prototype.toString;

/* Public constants ==========================================================*/
/* ===========================================================================*/

var Z_NO_FLUSH      = 0;
var Z_FINISH        = 4;

var Z_OK            = 0;
var Z_STREAM_END    = 1;
var Z_SYNC_FLUSH    = 2;

var Z_DEFAULT_COMPRESSION = -1;

var Z_DEFAULT_STRATEGY    = 0;

var Z_DEFLATED  = 8;

/* ===========================================================================*/


/**
 * class Deflate
 *
 * Generic JS-style wrapper for zlib calls. If you don't need
 * streaming behaviour - use more simple functions: [[deflate]],
 * [[deflateRaw]] and [[gzip]].
 **/

/* internal
 * Deflate.chunks -> Array
 *
 * Chunks of output data, if [[Deflate#onData]] not overriden.
 **/

/**
 * Deflate.result -> Uint8Array|Array
 *
 * Compressed result, generated by default [[Deflate#onData]]
 * and [[Deflate#onEnd]] handlers. Filled after you push last chunk
 * (call [[Deflate#push]] with `Z_FINISH` / `true` param)  or if you
 * push a chunk with explicit flush (call [[Deflate#push]] with
 * `Z_SYNC_FLUSH` param).
 **/

/**
 * Deflate.err -> Number
 *
 * Error code after deflate finished. 0 (Z_OK) on success.
 * You will not need it in real life, because deflate errors
 * are possible only on wrong options or bad `onData` / `onEnd`
 * custom handlers.
 **/

/**
 * Deflate.msg -> String
 *
 * Error message, if [[Deflate.err]] != 0
 **/


/**
 * new Deflate(options)
 * - options (Object): zlib deflate options.
 *
 * Creates new deflator instance with specified params. Throws exception
 * on bad params. Supported options:
 *
 * - `level`
 * - `windowBits`
 * - `memLevel`
 * - `strategy`
 * - `dictionary`
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Additional options, for internal needs:
 *
 * - `chunkSize` - size of generated data chunks (16K by default)
 * - `raw` (Boolean) - do raw deflate
 * - `gzip` (Boolean) - create gzip wrapper
 * - `to` (String) - if equal to 'string', then result will be "binary string"
 *    (each char code [0..255])
 * - `header` (Object) - custom header for gzip
 *   - `text` (Boolean) - true if compressed data believed to be text
 *   - `time` (Number) - modification time, unix timestamp
 *   - `os` (Number) - operation system code
 *   - `extra` (Array) - array of bytes with extra data (max 65536)
 *   - `name` (String) - file name (binary string)
 *   - `comment` (String) - comment (binary string)
 *   - `hcrc` (Boolean) - true if header crc should be added
 *
 * ##### Example:
 *
 * ```javascript
 * var pako = require('pako')
 *   , chunk1 = Uint8Array([1,2,3,4,5,6,7,8,9])
 *   , chunk2 = Uint8Array([10,11,12,13,14,15,16,17,18,19]);
 *
 * var deflate = new pako.Deflate({ level: 3});
 *
 * deflate.push(chunk1, false);
 * deflate.push(chunk2, true);  // true -> last chunk
 *
 * if (deflate.err) { throw new Error(deflate.err); }
 *
 * console.log(deflate.result);
 * ```
 **/
function Deflate(options) {
  if (!(this instanceof Deflate)) return new Deflate(options);

  this.options = utils.assign({
    level: Z_DEFAULT_COMPRESSION,
    method: Z_DEFLATED,
    chunkSize: 16384,
    windowBits: 15,
    memLevel: 8,
    strategy: Z_DEFAULT_STRATEGY,
    to: ''
  }, options || {});

  var opt = this.options;

  if (opt.raw && (opt.windowBits > 0)) {
    opt.windowBits = -opt.windowBits;
  }

  else if (opt.gzip && (opt.windowBits > 0) && (opt.windowBits < 16)) {
    opt.windowBits += 16;
  }

  this.err    = 0;      // error code, if happens (0 = Z_OK)
  this.msg    = '';     // error message
  this.ended  = false;  // used to avoid multiple onEnd() calls
  this.chunks = [];     // chunks of compressed data

  this.strm = new ZStream();
  this.strm.avail_out = 0;

  var status = zlib_deflate.deflateInit2(
    this.strm,
    opt.level,
    opt.method,
    opt.windowBits,
    opt.memLevel,
    opt.strategy
  );

  if (status !== Z_OK) {
    throw new Error(msg[status]);
  }

  if (opt.header) {
    zlib_deflate.deflateSetHeader(this.strm, opt.header);
  }

  if (opt.dictionary) {
    var dict;
    // Convert data if needed
    if (typeof opt.dictionary === 'string') {
      // If we need to compress text, change encoding to utf8.
      dict = strings.string2buf(opt.dictionary);
    } else if (toString.call(opt.dictionary) === '[object ArrayBuffer]') {
      dict = new Uint8Array(opt.dictionary);
    } else {
      dict = opt.dictionary;
    }

    status = zlib_deflate.deflateSetDictionary(this.strm, dict);

    if (status !== Z_OK) {
      throw new Error(msg[status]);
    }

    this._dict_set = true;
  }
}

/**
 * Deflate#push(data[, mode]) -> Boolean
 * - data (Uint8Array|Array|ArrayBuffer|String): input data. Strings will be
 *   converted to utf8 byte sequence.
 * - mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
 *   See constants. Skipped or `false` means Z_NO_FLUSH, `true` meansh Z_FINISH.
 *
 * Sends input data to deflate pipe, generating [[Deflate#onData]] calls with
 * new compressed chunks. Returns `true` on success. The last data block must have
 * mode Z_FINISH (or `true`). That will flush internal pending buffers and call
 * [[Deflate#onEnd]]. For interim explicit flushes (without ending the stream) you
 * can use mode Z_SYNC_FLUSH, keeping the compression context.
 *
 * On fail call [[Deflate#onEnd]] with error code and return false.
 *
 * We strongly recommend to use `Uint8Array` on input for best speed (output
 * array format is detected automatically). Also, don't skip last param and always
 * use the same type in your code (boolean or number). That will improve JS speed.
 *
 * For regular `Array`-s make sure all elements are [0..255].
 *
 * ##### Example
 *
 * ```javascript
 * push(chunk, false); // push one of data chunks
 * ...
 * push(chunk, true);  // push last chunk
 * ```
 **/
Deflate.prototype.push = function (data, mode) {
  var strm = this.strm;
  var chunkSize = this.options.chunkSize;
  var status, _mode;

  if (this.ended) { return false; }

  _mode = (mode === ~~mode) ? mode : ((mode === true) ? Z_FINISH : Z_NO_FLUSH);

  // Convert data if needed
  if (typeof data === 'string') {
    // If we need to compress text, change encoding to utf8.
    strm.input = strings.string2buf(data);
  } else if (toString.call(data) === '[object ArrayBuffer]') {
    strm.input = new Uint8Array(data);
  } else {
    strm.input = data;
  }

  strm.next_in = 0;
  strm.avail_in = strm.input.length;

  do {
    if (strm.avail_out === 0) {
      strm.output = new utils.Buf8(chunkSize);
      strm.next_out = 0;
      strm.avail_out = chunkSize;
    }
    status = zlib_deflate.deflate(strm, _mode);    /* no bad return value */

    if (status !== Z_STREAM_END && status !== Z_OK) {
      this.onEnd(status);
      this.ended = true;
      return false;
    }
    if (strm.avail_out === 0 || (strm.avail_in === 0 && (_mode === Z_FINISH || _mode === Z_SYNC_FLUSH))) {
      if (this.options.to === 'string') {
        this.onData(strings.buf2binstring(utils.shrinkBuf(strm.output, strm.next_out)));
      } else {
        this.onData(utils.shrinkBuf(strm.output, strm.next_out));
      }
    }
  } while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== Z_STREAM_END);

  // Finalize on the last chunk.
  if (_mode === Z_FINISH) {
    status = zlib_deflate.deflateEnd(this.strm);
    this.onEnd(status);
    this.ended = true;
    return status === Z_OK;
  }

  // callback interim results if Z_SYNC_FLUSH.
  if (_mode === Z_SYNC_FLUSH) {
    this.onEnd(Z_OK);
    strm.avail_out = 0;
    return true;
  }

  return true;
};


/**
 * Deflate#onData(chunk) -> Void
 * - chunk (Uint8Array|Array|String): ouput data. Type of array depends
 *   on js engine support. When string output requested, each chunk
 *   will be string.
 *
 * By default, stores data blocks in `chunks[]` property and glue
 * those in `onEnd`. Override this handler, if you need another behaviour.
 **/
Deflate.prototype.onData = function (chunk) {
  this.chunks.push(chunk);
};


/**
 * Deflate#onEnd(status) -> Void
 * - status (Number): deflate status. 0 (Z_OK) on success,
 *   other if not.
 *
 * Called once after you tell deflate that the input stream is
 * complete (Z_FINISH) or should be flushed (Z_SYNC_FLUSH)
 * or if an error happened. By default - join collected chunks,
 * free memory and fill `results` / `err` properties.
 **/
Deflate.prototype.onEnd = function (status) {
  // On success - join
  if (status === Z_OK) {
    if (this.options.to === 'string') {
      this.result = this.chunks.join('');
    } else {
      this.result = utils.flattenChunks(this.chunks);
    }
  }
  this.chunks = [];
  this.err = status;
  this.msg = this.strm.msg;
};


/**
 * deflate(data[, options]) -> Uint8Array|Array|String
 * - data (Uint8Array|Array|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * Compress `data` with deflate algorithm and `options`.
 *
 * Supported options are:
 *
 * - level
 * - windowBits
 * - memLevel
 * - strategy
 * - dictionary
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Sugar (options):
 *
 * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
 *   negative windowBits implicitly.
 * - `to` (String) - if equal to 'string', then result will be "binary string"
 *    (each char code [0..255])
 *
 * ##### Example:
 *
 * ```javascript
 * var pako = require('pako')
 *   , data = Uint8Array([1,2,3,4,5,6,7,8,9]);
 *
 * console.log(pako.deflate(data));
 * ```
 **/
function deflate(input, options) {
  var deflator = new Deflate(options);

  deflator.push(input, true);

  // That will never happens, if you don't cheat with options :)
  if (deflator.err) { throw deflator.msg || msg[deflator.err]; }

  return deflator.result;
}


/**
 * deflateRaw(data[, options]) -> Uint8Array|Array|String
 * - data (Uint8Array|Array|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * The same as [[deflate]], but creates raw data, without wrapper
 * (header and adler32 crc).
 **/
function deflateRaw(input, options) {
  options = options || {};
  options.raw = true;
  return deflate(input, options);
}


/**
 * gzip(data[, options]) -> Uint8Array|Array|String
 * - data (Uint8Array|Array|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * The same as [[deflate]], but create gzip wrapper instead of
 * deflate one.
 **/
function gzip(input, options) {
  options = options || {};
  options.gzip = true;
  return deflate(input, options);
}


exports.Deflate = Deflate;
exports.deflate = deflate;
exports.deflateRaw = deflateRaw;
exports.gzip = gzip;


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



var zlib_inflate = __webpack_require__(91);
var utils        = __webpack_require__(1);
var strings      = __webpack_require__(32);
var c            = __webpack_require__(34);
var msg          = __webpack_require__(12);
var ZStream      = __webpack_require__(36);
var GZheader     = __webpack_require__(89);

var toString = Object.prototype.toString;

/**
 * class Inflate
 *
 * Generic JS-style wrapper for zlib calls. If you don't need
 * streaming behaviour - use more simple functions: [[inflate]]
 * and [[inflateRaw]].
 **/

/* internal
 * inflate.chunks -> Array
 *
 * Chunks of output data, if [[Inflate#onData]] not overriden.
 **/

/**
 * Inflate.result -> Uint8Array|Array|String
 *
 * Uncompressed result, generated by default [[Inflate#onData]]
 * and [[Inflate#onEnd]] handlers. Filled after you push last chunk
 * (call [[Inflate#push]] with `Z_FINISH` / `true` param) or if you
 * push a chunk with explicit flush (call [[Inflate#push]] with
 * `Z_SYNC_FLUSH` param).
 **/

/**
 * Inflate.err -> Number
 *
 * Error code after inflate finished. 0 (Z_OK) on success.
 * Should be checked if broken data possible.
 **/

/**
 * Inflate.msg -> String
 *
 * Error message, if [[Inflate.err]] != 0
 **/


/**
 * new Inflate(options)
 * - options (Object): zlib inflate options.
 *
 * Creates new inflator instance with specified params. Throws exception
 * on bad params. Supported options:
 *
 * - `windowBits`
 * - `dictionary`
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Additional options, for internal needs:
 *
 * - `chunkSize` - size of generated data chunks (16K by default)
 * - `raw` (Boolean) - do raw inflate
 * - `to` (String) - if equal to 'string', then result will be converted
 *   from utf8 to utf16 (javascript) string. When string output requested,
 *   chunk length can differ from `chunkSize`, depending on content.
 *
 * By default, when no options set, autodetect deflate/gzip data format via
 * wrapper header.
 *
 * ##### Example:
 *
 * ```javascript
 * var pako = require('pako')
 *   , chunk1 = Uint8Array([1,2,3,4,5,6,7,8,9])
 *   , chunk2 = Uint8Array([10,11,12,13,14,15,16,17,18,19]);
 *
 * var inflate = new pako.Inflate({ level: 3});
 *
 * inflate.push(chunk1, false);
 * inflate.push(chunk2, true);  // true -> last chunk
 *
 * if (inflate.err) { throw new Error(inflate.err); }
 *
 * console.log(inflate.result);
 * ```
 **/
function Inflate(options) {
  if (!(this instanceof Inflate)) return new Inflate(options);

  this.options = utils.assign({
    chunkSize: 16384,
    windowBits: 0,
    to: ''
  }, options || {});

  var opt = this.options;

  // Force window size for `raw` data, if not set directly,
  // because we have no header for autodetect.
  if (opt.raw && (opt.windowBits >= 0) && (opt.windowBits < 16)) {
    opt.windowBits = -opt.windowBits;
    if (opt.windowBits === 0) { opt.windowBits = -15; }
  }

  // If `windowBits` not defined (and mode not raw) - set autodetect flag for gzip/deflate
  if ((opt.windowBits >= 0) && (opt.windowBits < 16) &&
      !(options && options.windowBits)) {
    opt.windowBits += 32;
  }

  // Gzip header has no info about windows size, we can do autodetect only
  // for deflate. So, if window size not set, force it to max when gzip possible
  if ((opt.windowBits > 15) && (opt.windowBits < 48)) {
    // bit 3 (16) -> gzipped data
    // bit 4 (32) -> autodetect gzip/deflate
    if ((opt.windowBits & 15) === 0) {
      opt.windowBits |= 15;
    }
  }

  this.err    = 0;      // error code, if happens (0 = Z_OK)
  this.msg    = '';     // error message
  this.ended  = false;  // used to avoid multiple onEnd() calls
  this.chunks = [];     // chunks of compressed data

  this.strm   = new ZStream();
  this.strm.avail_out = 0;

  var status  = zlib_inflate.inflateInit2(
    this.strm,
    opt.windowBits
  );

  if (status !== c.Z_OK) {
    throw new Error(msg[status]);
  }

  this.header = new GZheader();

  zlib_inflate.inflateGetHeader(this.strm, this.header);
}

/**
 * Inflate#push(data[, mode]) -> Boolean
 * - data (Uint8Array|Array|ArrayBuffer|String): input data
 * - mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
 *   See constants. Skipped or `false` means Z_NO_FLUSH, `true` meansh Z_FINISH.
 *
 * Sends input data to inflate pipe, generating [[Inflate#onData]] calls with
 * new output chunks. Returns `true` on success. The last data block must have
 * mode Z_FINISH (or `true`). That will flush internal pending buffers and call
 * [[Inflate#onEnd]]. For interim explicit flushes (without ending the stream) you
 * can use mode Z_SYNC_FLUSH, keeping the decompression context.
 *
 * On fail call [[Inflate#onEnd]] with error code and return false.
 *
 * We strongly recommend to use `Uint8Array` on input for best speed (output
 * format is detected automatically). Also, don't skip last param and always
 * use the same type in your code (boolean or number). That will improve JS speed.
 *
 * For regular `Array`-s make sure all elements are [0..255].
 *
 * ##### Example
 *
 * ```javascript
 * push(chunk, false); // push one of data chunks
 * ...
 * push(chunk, true);  // push last chunk
 * ```
 **/
Inflate.prototype.push = function (data, mode) {
  var strm = this.strm;
  var chunkSize = this.options.chunkSize;
  var dictionary = this.options.dictionary;
  var status, _mode;
  var next_out_utf8, tail, utf8str;
  var dict;

  // Flag to properly process Z_BUF_ERROR on testing inflate call
  // when we check that all output data was flushed.
  var allowBufError = false;

  if (this.ended) { return false; }
  _mode = (mode === ~~mode) ? mode : ((mode === true) ? c.Z_FINISH : c.Z_NO_FLUSH);

  // Convert data if needed
  if (typeof data === 'string') {
    // Only binary strings can be decompressed on practice
    strm.input = strings.binstring2buf(data);
  } else if (toString.call(data) === '[object ArrayBuffer]') {
    strm.input = new Uint8Array(data);
  } else {
    strm.input = data;
  }

  strm.next_in = 0;
  strm.avail_in = strm.input.length;

  do {
    if (strm.avail_out === 0) {
      strm.output = new utils.Buf8(chunkSize);
      strm.next_out = 0;
      strm.avail_out = chunkSize;
    }

    status = zlib_inflate.inflate(strm, c.Z_NO_FLUSH);    /* no bad return value */

    if (status === c.Z_NEED_DICT && dictionary) {
      // Convert data if needed
      if (typeof dictionary === 'string') {
        dict = strings.string2buf(dictionary);
      } else if (toString.call(dictionary) === '[object ArrayBuffer]') {
        dict = new Uint8Array(dictionary);
      } else {
        dict = dictionary;
      }

      status = zlib_inflate.inflateSetDictionary(this.strm, dict);

    }

    if (status === c.Z_BUF_ERROR && allowBufError === true) {
      status = c.Z_OK;
      allowBufError = false;
    }

    if (status !== c.Z_STREAM_END && status !== c.Z_OK) {
      this.onEnd(status);
      this.ended = true;
      return false;
    }

    if (strm.next_out) {
      if (strm.avail_out === 0 || status === c.Z_STREAM_END || (strm.avail_in === 0 && (_mode === c.Z_FINISH || _mode === c.Z_SYNC_FLUSH))) {

        if (this.options.to === 'string') {

          next_out_utf8 = strings.utf8border(strm.output, strm.next_out);

          tail = strm.next_out - next_out_utf8;
          utf8str = strings.buf2string(strm.output, next_out_utf8);

          // move tail
          strm.next_out = tail;
          strm.avail_out = chunkSize - tail;
          if (tail) { utils.arraySet(strm.output, strm.output, next_out_utf8, tail, 0); }

          this.onData(utf8str);

        } else {
          this.onData(utils.shrinkBuf(strm.output, strm.next_out));
        }
      }
    }

    // When no more input data, we should check that internal inflate buffers
    // are flushed. The only way to do it when avail_out = 0 - run one more
    // inflate pass. But if output data not exists, inflate return Z_BUF_ERROR.
    // Here we set flag to process this error properly.
    //
    // NOTE. Deflate does not return error in this case and does not needs such
    // logic.
    if (strm.avail_in === 0 && strm.avail_out === 0) {
      allowBufError = true;
    }

  } while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== c.Z_STREAM_END);

  if (status === c.Z_STREAM_END) {
    _mode = c.Z_FINISH;
  }

  // Finalize on the last chunk.
  if (_mode === c.Z_FINISH) {
    status = zlib_inflate.inflateEnd(this.strm);
    this.onEnd(status);
    this.ended = true;
    return status === c.Z_OK;
  }

  // callback interim results if Z_SYNC_FLUSH.
  if (_mode === c.Z_SYNC_FLUSH) {
    this.onEnd(c.Z_OK);
    strm.avail_out = 0;
    return true;
  }

  return true;
};


/**
 * Inflate#onData(chunk) -> Void
 * - chunk (Uint8Array|Array|String): ouput data. Type of array depends
 *   on js engine support. When string output requested, each chunk
 *   will be string.
 *
 * By default, stores data blocks in `chunks[]` property and glue
 * those in `onEnd`. Override this handler, if you need another behaviour.
 **/
Inflate.prototype.onData = function (chunk) {
  this.chunks.push(chunk);
};


/**
 * Inflate#onEnd(status) -> Void
 * - status (Number): inflate status. 0 (Z_OK) on success,
 *   other if not.
 *
 * Called either after you tell inflate that the input stream is
 * complete (Z_FINISH) or should be flushed (Z_SYNC_FLUSH)
 * or if an error happened. By default - join collected chunks,
 * free memory and fill `results` / `err` properties.
 **/
Inflate.prototype.onEnd = function (status) {
  // On success - join
  if (status === c.Z_OK) {
    if (this.options.to === 'string') {
      // Glue & convert here, until we teach pako to send
      // utf8 alligned strings to onData
      this.result = this.chunks.join('');
    } else {
      this.result = utils.flattenChunks(this.chunks);
    }
  }
  this.chunks = [];
  this.err = status;
  this.msg = this.strm.msg;
};


/**
 * inflate(data[, options]) -> Uint8Array|Array|String
 * - data (Uint8Array|Array|String): input data to decompress.
 * - options (Object): zlib inflate options.
 *
 * Decompress `data` with inflate/ungzip and `options`. Autodetect
 * format via wrapper header by default. That's why we don't provide
 * separate `ungzip` method.
 *
 * Supported options are:
 *
 * - windowBits
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information.
 *
 * Sugar (options):
 *
 * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
 *   negative windowBits implicitly.
 * - `to` (String) - if equal to 'string', then result will be converted
 *   from utf8 to utf16 (javascript) string. When string output requested,
 *   chunk length can differ from `chunkSize`, depending on content.
 *
 *
 * ##### Example:
 *
 * ```javascript
 * var pako = require('pako')
 *   , input = pako.deflate([1,2,3,4,5,6,7,8,9])
 *   , output;
 *
 * try {
 *   output = pako.inflate(input);
 * } catch (err)
 *   console.log(err);
 * }
 * ```
 **/
function inflate(input, options) {
  var inflator = new Inflate(options);

  inflator.push(input, true);

  // That will never happens, if you don't cheat with options :)
  if (inflator.err) { throw inflator.msg || msg[inflator.err]; }

  return inflator.result;
}


/**
 * inflateRaw(data[, options]) -> Uint8Array|Array|String
 * - data (Uint8Array|Array|String): input data to decompress.
 * - options (Object): zlib inflate options.
 *
 * The same as [[inflate]], but creates raw data, without wrapper
 * (header and adler32 crc).
 **/
function inflateRaw(input, options) {
  options = options || {};
  options.raw = true;
  return inflate(input, options);
}


/**
 * ungzip(data[, options]) -> Uint8Array|Array|String
 * - data (Uint8Array|Array|String): input data to decompress.
 * - options (Object): zlib inflate options.
 *
 * Just shortcut to [[inflate]], because it autodetects format
 * by header.content. Done for convenience.
 **/


exports.Inflate = Inflate;
exports.inflate = inflate;
exports.inflateRaw = inflateRaw;
exports.ungzip  = inflate;


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils   = __webpack_require__(1);
var trees   = __webpack_require__(93);
var adler32 = __webpack_require__(33);
var crc32   = __webpack_require__(35);
var msg     = __webpack_require__(12);

/* Public constants ==========================================================*/
/* ===========================================================================*/


/* Allowed flush values; see deflate() and inflate() below for details */
var Z_NO_FLUSH      = 0;
var Z_PARTIAL_FLUSH = 1;
//var Z_SYNC_FLUSH    = 2;
var Z_FULL_FLUSH    = 3;
var Z_FINISH        = 4;
var Z_BLOCK         = 5;
//var Z_TREES         = 6;


/* Return codes for the compression/decompression functions. Negative values
 * are errors, positive values are used for special but normal events.
 */
var Z_OK            = 0;
var Z_STREAM_END    = 1;
//var Z_NEED_DICT     = 2;
//var Z_ERRNO         = -1;
var Z_STREAM_ERROR  = -2;
var Z_DATA_ERROR    = -3;
//var Z_MEM_ERROR     = -4;
var Z_BUF_ERROR     = -5;
//var Z_VERSION_ERROR = -6;


/* compression levels */
//var Z_NO_COMPRESSION      = 0;
//var Z_BEST_SPEED          = 1;
//var Z_BEST_COMPRESSION    = 9;
var Z_DEFAULT_COMPRESSION = -1;


var Z_FILTERED            = 1;
var Z_HUFFMAN_ONLY        = 2;
var Z_RLE                 = 3;
var Z_FIXED               = 4;
var Z_DEFAULT_STRATEGY    = 0;

/* Possible values of the data_type field (though see inflate()) */
//var Z_BINARY              = 0;
//var Z_TEXT                = 1;
//var Z_ASCII               = 1; // = Z_TEXT
var Z_UNKNOWN             = 2;


/* The deflate compression method */
var Z_DEFLATED  = 8;

/*============================================================================*/


var MAX_MEM_LEVEL = 9;
/* Maximum value for memLevel in deflateInit2 */
var MAX_WBITS = 15;
/* 32K LZ77 window */
var DEF_MEM_LEVEL = 8;


var LENGTH_CODES  = 29;
/* number of length codes, not counting the special END_BLOCK code */
var LITERALS      = 256;
/* number of literal bytes 0..255 */
var L_CODES       = LITERALS + 1 + LENGTH_CODES;
/* number of Literal or Length codes, including the END_BLOCK code */
var D_CODES       = 30;
/* number of distance codes */
var BL_CODES      = 19;
/* number of codes used to transfer the bit lengths */
var HEAP_SIZE     = 2 * L_CODES + 1;
/* maximum heap size */
var MAX_BITS  = 15;
/* All codes must not exceed MAX_BITS bits */

var MIN_MATCH = 3;
var MAX_MATCH = 258;
var MIN_LOOKAHEAD = (MAX_MATCH + MIN_MATCH + 1);

var PRESET_DICT = 0x20;

var INIT_STATE = 42;
var EXTRA_STATE = 69;
var NAME_STATE = 73;
var COMMENT_STATE = 91;
var HCRC_STATE = 103;
var BUSY_STATE = 113;
var FINISH_STATE = 666;

var BS_NEED_MORE      = 1; /* block not completed, need more input or more output */
var BS_BLOCK_DONE     = 2; /* block flush performed */
var BS_FINISH_STARTED = 3; /* finish started, need only more output at next deflate */
var BS_FINISH_DONE    = 4; /* finish done, accept no more input or output */

var OS_CODE = 0x03; // Unix :) . Don't detect, use this default.

function err(strm, errorCode) {
  strm.msg = msg[errorCode];
  return errorCode;
}

function rank(f) {
  return ((f) << 1) - ((f) > 4 ? 9 : 0);
}

function zero(buf) { var len = buf.length; while (--len >= 0) { buf[len] = 0; } }


/* =========================================================================
 * Flush as much pending output as possible. All deflate() output goes
 * through this function so some applications may wish to modify it
 * to avoid allocating a large strm->output buffer and copying into it.
 * (See also read_buf()).
 */
function flush_pending(strm) {
  var s = strm.state;

  //_tr_flush_bits(s);
  var len = s.pending;
  if (len > strm.avail_out) {
    len = strm.avail_out;
  }
  if (len === 0) { return; }

  utils.arraySet(strm.output, s.pending_buf, s.pending_out, len, strm.next_out);
  strm.next_out += len;
  s.pending_out += len;
  strm.total_out += len;
  strm.avail_out -= len;
  s.pending -= len;
  if (s.pending === 0) {
    s.pending_out = 0;
  }
}


function flush_block_only(s, last) {
  trees._tr_flush_block(s, (s.block_start >= 0 ? s.block_start : -1), s.strstart - s.block_start, last);
  s.block_start = s.strstart;
  flush_pending(s.strm);
}


function put_byte(s, b) {
  s.pending_buf[s.pending++] = b;
}


/* =========================================================================
 * Put a short in the pending buffer. The 16-bit value is put in MSB order.
 * IN assertion: the stream state is correct and there is enough room in
 * pending_buf.
 */
function putShortMSB(s, b) {
//  put_byte(s, (Byte)(b >> 8));
//  put_byte(s, (Byte)(b & 0xff));
  s.pending_buf[s.pending++] = (b >>> 8) & 0xff;
  s.pending_buf[s.pending++] = b & 0xff;
}


/* ===========================================================================
 * Read a new buffer from the current input stream, update the adler32
 * and total number of bytes read.  All deflate() input goes through
 * this function so some applications may wish to modify it to avoid
 * allocating a large strm->input buffer and copying from it.
 * (See also flush_pending()).
 */
function read_buf(strm, buf, start, size) {
  var len = strm.avail_in;

  if (len > size) { len = size; }
  if (len === 0) { return 0; }

  strm.avail_in -= len;

  // zmemcpy(buf, strm->next_in, len);
  utils.arraySet(buf, strm.input, strm.next_in, len, start);
  if (strm.state.wrap === 1) {
    strm.adler = adler32(strm.adler, buf, len, start);
  }

  else if (strm.state.wrap === 2) {
    strm.adler = crc32(strm.adler, buf, len, start);
  }

  strm.next_in += len;
  strm.total_in += len;

  return len;
}


/* ===========================================================================
 * Set match_start to the longest match starting at the given string and
 * return its length. Matches shorter or equal to prev_length are discarded,
 * in which case the result is equal to prev_length and match_start is
 * garbage.
 * IN assertions: cur_match is the head of the hash chain for the current
 *   string (strstart) and its distance is <= MAX_DIST, and prev_length >= 1
 * OUT assertion: the match length is not greater than s->lookahead.
 */
function longest_match(s, cur_match) {
  var chain_length = s.max_chain_length;      /* max hash chain length */
  var scan = s.strstart; /* current string */
  var match;                       /* matched string */
  var len;                           /* length of current match */
  var best_len = s.prev_length;              /* best match length so far */
  var nice_match = s.nice_match;             /* stop if match long enough */
  var limit = (s.strstart > (s.w_size - MIN_LOOKAHEAD)) ?
      s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0/*NIL*/;

  var _win = s.window; // shortcut

  var wmask = s.w_mask;
  var prev  = s.prev;

  /* Stop when cur_match becomes <= limit. To simplify the code,
   * we prevent matches with the string of window index 0.
   */

  var strend = s.strstart + MAX_MATCH;
  var scan_end1  = _win[scan + best_len - 1];
  var scan_end   = _win[scan + best_len];

  /* The code is optimized for HASH_BITS >= 8 and MAX_MATCH-2 multiple of 16.
   * It is easy to get rid of this optimization if necessary.
   */
  // Assert(s->hash_bits >= 8 && MAX_MATCH == 258, "Code too clever");

  /* Do not waste too much time if we already have a good match: */
  if (s.prev_length >= s.good_match) {
    chain_length >>= 2;
  }
  /* Do not look for matches beyond the end of the input. This is necessary
   * to make deflate deterministic.
   */
  if (nice_match > s.lookahead) { nice_match = s.lookahead; }

  // Assert((ulg)s->strstart <= s->window_size-MIN_LOOKAHEAD, "need lookahead");

  do {
    // Assert(cur_match < s->strstart, "no future");
    match = cur_match;

    /* Skip to next match if the match length cannot increase
     * or if the match length is less than 2.  Note that the checks below
     * for insufficient lookahead only occur occasionally for performance
     * reasons.  Therefore uninitialized memory will be accessed, and
     * conditional jumps will be made that depend on those values.
     * However the length of the match is limited to the lookahead, so
     * the output of deflate is not affected by the uninitialized values.
     */

    if (_win[match + best_len]     !== scan_end  ||
        _win[match + best_len - 1] !== scan_end1 ||
        _win[match]                !== _win[scan] ||
        _win[++match]              !== _win[scan + 1]) {
      continue;
    }

    /* The check at best_len-1 can be removed because it will be made
     * again later. (This heuristic is not always a win.)
     * It is not necessary to compare scan[2] and match[2] since they
     * are always equal when the other bytes match, given that
     * the hash keys are equal and that HASH_BITS >= 8.
     */
    scan += 2;
    match++;
    // Assert(*scan == *match, "match[2]?");

    /* We check for insufficient lookahead only every 8th comparison;
     * the 256th check will be made at strstart+258.
     */
    do {
      /*jshint noempty:false*/
    } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             scan < strend);

    // Assert(scan <= s->window+(unsigned)(s->window_size-1), "wild scan");

    len = MAX_MATCH - (strend - scan);
    scan = strend - MAX_MATCH;

    if (len > best_len) {
      s.match_start = cur_match;
      best_len = len;
      if (len >= nice_match) {
        break;
      }
      scan_end1  = _win[scan + best_len - 1];
      scan_end   = _win[scan + best_len];
    }
  } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);

  if (best_len <= s.lookahead) {
    return best_len;
  }
  return s.lookahead;
}


/* ===========================================================================
 * Fill the window when the lookahead becomes insufficient.
 * Updates strstart and lookahead.
 *
 * IN assertion: lookahead < MIN_LOOKAHEAD
 * OUT assertions: strstart <= window_size-MIN_LOOKAHEAD
 *    At least one byte has been read, or avail_in == 0; reads are
 *    performed for at least two bytes (required for the zip translate_eol
 *    option -- not supported here).
 */
function fill_window(s) {
  var _w_size = s.w_size;
  var p, n, m, more, str;

  //Assert(s->lookahead < MIN_LOOKAHEAD, "already enough lookahead");

  do {
    more = s.window_size - s.lookahead - s.strstart;

    // JS ints have 32 bit, block below not needed
    /* Deal with !@#$% 64K limit: */
    //if (sizeof(int) <= 2) {
    //    if (more == 0 && s->strstart == 0 && s->lookahead == 0) {
    //        more = wsize;
    //
    //  } else if (more == (unsigned)(-1)) {
    //        /* Very unlikely, but possible on 16 bit machine if
    //         * strstart == 0 && lookahead == 1 (input done a byte at time)
    //         */
    //        more--;
    //    }
    //}


    /* If the window is almost full and there is insufficient lookahead,
     * move the upper half to the lower one to make room in the upper half.
     */
    if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {

      utils.arraySet(s.window, s.window, _w_size, _w_size, 0);
      s.match_start -= _w_size;
      s.strstart -= _w_size;
      /* we now have strstart >= MAX_DIST */
      s.block_start -= _w_size;

      /* Slide the hash table (could be avoided with 32 bit values
       at the expense of memory usage). We slide even when level == 0
       to keep the hash table consistent if we switch back to level > 0
       later. (Using level 0 permanently is not an optimal usage of
       zlib, so we don't care about this pathological case.)
       */

      n = s.hash_size;
      p = n;
      do {
        m = s.head[--p];
        s.head[p] = (m >= _w_size ? m - _w_size : 0);
      } while (--n);

      n = _w_size;
      p = n;
      do {
        m = s.prev[--p];
        s.prev[p] = (m >= _w_size ? m - _w_size : 0);
        /* If n is not on any hash chain, prev[n] is garbage but
         * its value will never be used.
         */
      } while (--n);

      more += _w_size;
    }
    if (s.strm.avail_in === 0) {
      break;
    }

    /* If there was no sliding:
     *    strstart <= WSIZE+MAX_DIST-1 && lookahead <= MIN_LOOKAHEAD - 1 &&
     *    more == window_size - lookahead - strstart
     * => more >= window_size - (MIN_LOOKAHEAD-1 + WSIZE + MAX_DIST-1)
     * => more >= window_size - 2*WSIZE + 2
     * In the BIG_MEM or MMAP case (not yet supported),
     *   window_size == input_size + MIN_LOOKAHEAD  &&
     *   strstart + s->lookahead <= input_size => more >= MIN_LOOKAHEAD.
     * Otherwise, window_size == 2*WSIZE so more >= 2.
     * If there was sliding, more >= WSIZE. So in all cases, more >= 2.
     */
    //Assert(more >= 2, "more < 2");
    n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
    s.lookahead += n;

    /* Initialize the hash value now that we have some input: */
    if (s.lookahead + s.insert >= MIN_MATCH) {
      str = s.strstart - s.insert;
      s.ins_h = s.window[str];

      /* UPDATE_HASH(s, s->ins_h, s->window[str + 1]); */
      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + 1]) & s.hash_mask;
//#if MIN_MATCH != 3
//        Call update_hash() MIN_MATCH-3 more times
//#endif
      while (s.insert) {
        /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
        s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;

        s.prev[str & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = str;
        str++;
        s.insert--;
        if (s.lookahead + s.insert < MIN_MATCH) {
          break;
        }
      }
    }
    /* If the whole input has less than MIN_MATCH bytes, ins_h is garbage,
     * but this is not important since only literal bytes will be emitted.
     */

  } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);

  /* If the WIN_INIT bytes after the end of the current data have never been
   * written, then zero those bytes in order to avoid memory check reports of
   * the use of uninitialized (or uninitialised as Julian writes) bytes by
   * the longest match routines.  Update the high water mark for the next
   * time through here.  WIN_INIT is set to MAX_MATCH since the longest match
   * routines allow scanning to strstart + MAX_MATCH, ignoring lookahead.
   */
//  if (s.high_water < s.window_size) {
//    var curr = s.strstart + s.lookahead;
//    var init = 0;
//
//    if (s.high_water < curr) {
//      /* Previous high water mark below current data -- zero WIN_INIT
//       * bytes or up to end of window, whichever is less.
//       */
//      init = s.window_size - curr;
//      if (init > WIN_INIT)
//        init = WIN_INIT;
//      zmemzero(s->window + curr, (unsigned)init);
//      s->high_water = curr + init;
//    }
//    else if (s->high_water < (ulg)curr + WIN_INIT) {
//      /* High water mark at or above current data, but below current data
//       * plus WIN_INIT -- zero out to current data plus WIN_INIT, or up
//       * to end of window, whichever is less.
//       */
//      init = (ulg)curr + WIN_INIT - s->high_water;
//      if (init > s->window_size - s->high_water)
//        init = s->window_size - s->high_water;
//      zmemzero(s->window + s->high_water, (unsigned)init);
//      s->high_water += init;
//    }
//  }
//
//  Assert((ulg)s->strstart <= s->window_size - MIN_LOOKAHEAD,
//    "not enough room for search");
}

/* ===========================================================================
 * Copy without compression as much as possible from the input stream, return
 * the current block state.
 * This function does not insert new strings in the dictionary since
 * uncompressible data is probably not useful. This function is used
 * only for the level=0 compression option.
 * NOTE: this function should be optimized to avoid extra copying from
 * window to pending_buf.
 */
function deflate_stored(s, flush) {
  /* Stored blocks are limited to 0xffff bytes, pending_buf is limited
   * to pending_buf_size, and each stored block has a 5 byte header:
   */
  var max_block_size = 0xffff;

  if (max_block_size > s.pending_buf_size - 5) {
    max_block_size = s.pending_buf_size - 5;
  }

  /* Copy as much as possible from input to output: */
  for (;;) {
    /* Fill the window as much as possible: */
    if (s.lookahead <= 1) {

      //Assert(s->strstart < s->w_size+MAX_DIST(s) ||
      //  s->block_start >= (long)s->w_size, "slide too late");
//      if (!(s.strstart < s.w_size + (s.w_size - MIN_LOOKAHEAD) ||
//        s.block_start >= s.w_size)) {
//        throw  new Error("slide too late");
//      }

      fill_window(s);
      if (s.lookahead === 0 && flush === Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }

      if (s.lookahead === 0) {
        break;
      }
      /* flush the current block */
    }
    //Assert(s->block_start >= 0L, "block gone");
//    if (s.block_start < 0) throw new Error("block gone");

    s.strstart += s.lookahead;
    s.lookahead = 0;

    /* Emit a stored block if pending_buf will be full: */
    var max_start = s.block_start + max_block_size;

    if (s.strstart === 0 || s.strstart >= max_start) {
      /* strstart == 0 is possible when wraparound on 16-bit machine */
      s.lookahead = s.strstart - max_start;
      s.strstart = max_start;
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/


    }
    /* Flush if we may have to slide, otherwise block_start may become
     * negative and the data will be gone:
     */
    if (s.strstart - s.block_start >= (s.w_size - MIN_LOOKAHEAD)) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }

  s.insert = 0;

  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }

  if (s.strstart > s.block_start) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }

  return BS_NEED_MORE;
}

/* ===========================================================================
 * Compress as much as possible from the input stream, return the current
 * block state.
 * This function does not perform lazy evaluation of matches and inserts
 * new strings in the dictionary only for unmatched strings or for short
 * matches. It is used only for the fast compression options.
 */
function deflate_fast(s, flush) {
  var hash_head;        /* head of the hash chain */
  var bflush;           /* set if current block must be flushed */

  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */
    if (s.lookahead < MIN_LOOKAHEAD) {
      fill_window(s);
      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) {
        break; /* flush the current block */
      }
    }

    /* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */
    hash_head = 0/*NIL*/;
    if (s.lookahead >= MIN_MATCH) {
      /*** INSERT_STRING(s, s.strstart, hash_head); ***/
      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
      s.head[s.ins_h] = s.strstart;
      /***/
    }

    /* Find the longest match, discarding those <= prev_length.
     * At this point we have always match_length < MIN_MATCH
     */
    if (hash_head !== 0/*NIL*/ && ((s.strstart - hash_head) <= (s.w_size - MIN_LOOKAHEAD))) {
      /* To simplify the code, we prevent matches with the string
       * of window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */
      s.match_length = longest_match(s, hash_head);
      /* longest_match() sets match_start */
    }
    if (s.match_length >= MIN_MATCH) {
      // check_match(s, s.strstart, s.match_start, s.match_length); // for debug only

      /*** _tr_tally_dist(s, s.strstart - s.match_start,
                     s.match_length - MIN_MATCH, bflush); ***/
      bflush = trees._tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);

      s.lookahead -= s.match_length;

      /* Insert new strings in the hash table only if the match length
       * is not too large. This saves time but degrades compression.
       */
      if (s.match_length <= s.max_lazy_match/*max_insert_length*/ && s.lookahead >= MIN_MATCH) {
        s.match_length--; /* string at strstart already in table */
        do {
          s.strstart++;
          /*** INSERT_STRING(s, s.strstart, hash_head); ***/
          s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
          /***/
          /* strstart never exceeds WSIZE-MAX_MATCH, so there are
           * always MIN_MATCH bytes ahead.
           */
        } while (--s.match_length !== 0);
        s.strstart++;
      } else
      {
        s.strstart += s.match_length;
        s.match_length = 0;
        s.ins_h = s.window[s.strstart];
        /* UPDATE_HASH(s, s.ins_h, s.window[s.strstart+1]); */
        s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + 1]) & s.hash_mask;

//#if MIN_MATCH != 3
//                Call UPDATE_HASH() MIN_MATCH-3 more times
//#endif
        /* If lookahead < MIN_MATCH, ins_h is garbage, but it does not
         * matter since it will be recomputed at next deflate call.
         */
      }
    } else {
      /* No match, output a literal byte */
      //Tracevv((stderr,"%c", s.window[s.strstart]));
      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
      bflush = trees._tr_tally(s, 0, s.window[s.strstart]);

      s.lookahead--;
      s.strstart++;
    }
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = ((s.strstart < (MIN_MATCH - 1)) ? s.strstart : MIN_MATCH - 1);
  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
}

/* ===========================================================================
 * Same as above, but achieves better compression. We use a lazy
 * evaluation for matches: a match is finally adopted only if there is
 * no better match at the next window position.
 */
function deflate_slow(s, flush) {
  var hash_head;          /* head of hash chain */
  var bflush;              /* set if current block must be flushed */

  var max_insert;

  /* Process the input block. */
  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */
    if (s.lookahead < MIN_LOOKAHEAD) {
      fill_window(s);
      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) { break; } /* flush the current block */
    }

    /* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */
    hash_head = 0/*NIL*/;
    if (s.lookahead >= MIN_MATCH) {
      /*** INSERT_STRING(s, s.strstart, hash_head); ***/
      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
      s.head[s.ins_h] = s.strstart;
      /***/
    }

    /* Find the longest match, discarding those <= prev_length.
     */
    s.prev_length = s.match_length;
    s.prev_match = s.match_start;
    s.match_length = MIN_MATCH - 1;

    if (hash_head !== 0/*NIL*/ && s.prev_length < s.max_lazy_match &&
        s.strstart - hash_head <= (s.w_size - MIN_LOOKAHEAD)/*MAX_DIST(s)*/) {
      /* To simplify the code, we prevent matches with the string
       * of window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */
      s.match_length = longest_match(s, hash_head);
      /* longest_match() sets match_start */

      if (s.match_length <= 5 &&
         (s.strategy === Z_FILTERED || (s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096/*TOO_FAR*/))) {

        /* If prev_match is also MIN_MATCH, match_start is garbage
         * but we will ignore the current match anyway.
         */
        s.match_length = MIN_MATCH - 1;
      }
    }
    /* If there was a match at the previous step and the current
     * match is not better, output the previous match:
     */
    if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
      max_insert = s.strstart + s.lookahead - MIN_MATCH;
      /* Do not insert strings in hash table beyond this. */

      //check_match(s, s.strstart-1, s.prev_match, s.prev_length);

      /***_tr_tally_dist(s, s.strstart - 1 - s.prev_match,
                     s.prev_length - MIN_MATCH, bflush);***/
      bflush = trees._tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
      /* Insert in hash table all strings up to the end of the match.
       * strstart-1 and strstart are already inserted. If there is not
       * enough lookahead, the last two strings are not inserted in
       * the hash table.
       */
      s.lookahead -= s.prev_length - 1;
      s.prev_length -= 2;
      do {
        if (++s.strstart <= max_insert) {
          /*** INSERT_STRING(s, s.strstart, hash_head); ***/
          s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
          /***/
        }
      } while (--s.prev_length !== 0);
      s.match_available = 0;
      s.match_length = MIN_MATCH - 1;
      s.strstart++;

      if (bflush) {
        /*** FLUSH_BLOCK(s, 0); ***/
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
        /***/
      }

    } else if (s.match_available) {
      /* If there was no match at the previous position, output a
       * single literal. If there was a match but the current match
       * is longer, truncate the previous match to a single literal.
       */
      //Tracevv((stderr,"%c", s->window[s->strstart-1]));
      /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
      bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);

      if (bflush) {
        /*** FLUSH_BLOCK_ONLY(s, 0) ***/
        flush_block_only(s, false);
        /***/
      }
      s.strstart++;
      s.lookahead--;
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    } else {
      /* There is no previous match to compare with, wait for
       * the next step to decide.
       */
      s.match_available = 1;
      s.strstart++;
      s.lookahead--;
    }
  }
  //Assert (flush != Z_NO_FLUSH, "no flush?");
  if (s.match_available) {
    //Tracevv((stderr,"%c", s->window[s->strstart-1]));
    /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
    bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);

    s.match_available = 0;
  }
  s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }

  return BS_BLOCK_DONE;
}


/* ===========================================================================
 * For Z_RLE, simply look for runs of bytes, generate matches only of distance
 * one.  Do not maintain a hash table.  (It will be regenerated if this run of
 * deflate switches away from Z_RLE.)
 */
function deflate_rle(s, flush) {
  var bflush;            /* set if current block must be flushed */
  var prev;              /* byte at distance one to match */
  var scan, strend;      /* scan goes up to strend for length of run */

  var _win = s.window;

  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the longest run, plus one for the unrolled loop.
     */
    if (s.lookahead <= MAX_MATCH) {
      fill_window(s);
      if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) { break; } /* flush the current block */
    }

    /* See how many times the previous byte repeats */
    s.match_length = 0;
    if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
      scan = s.strstart - 1;
      prev = _win[scan];
      if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
        strend = s.strstart + MAX_MATCH;
        do {
          /*jshint noempty:false*/
        } while (prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 scan < strend);
        s.match_length = MAX_MATCH - (strend - scan);
        if (s.match_length > s.lookahead) {
          s.match_length = s.lookahead;
        }
      }
      //Assert(scan <= s->window+(uInt)(s->window_size-1), "wild scan");
    }

    /* Emit match if have run of MIN_MATCH or longer, else emit literal */
    if (s.match_length >= MIN_MATCH) {
      //check_match(s, s.strstart, s.strstart - 1, s.match_length);

      /*** _tr_tally_dist(s, 1, s.match_length - MIN_MATCH, bflush); ***/
      bflush = trees._tr_tally(s, 1, s.match_length - MIN_MATCH);

      s.lookahead -= s.match_length;
      s.strstart += s.match_length;
      s.match_length = 0;
    } else {
      /* No match, output a literal byte */
      //Tracevv((stderr,"%c", s->window[s->strstart]));
      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
      bflush = trees._tr_tally(s, 0, s.window[s.strstart]);

      s.lookahead--;
      s.strstart++;
    }
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = 0;
  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
}

/* ===========================================================================
 * For Z_HUFFMAN_ONLY, do not look for matches.  Do not maintain a hash table.
 * (It will be regenerated if this run of deflate switches away from Huffman.)
 */
function deflate_huff(s, flush) {
  var bflush;             /* set if current block must be flushed */

  for (;;) {
    /* Make sure that we have a literal to write. */
    if (s.lookahead === 0) {
      fill_window(s);
      if (s.lookahead === 0) {
        if (flush === Z_NO_FLUSH) {
          return BS_NEED_MORE;
        }
        break;      /* flush the current block */
      }
    }

    /* Output a literal byte */
    s.match_length = 0;
    //Tracevv((stderr,"%c", s->window[s->strstart]));
    /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
    bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
    s.lookahead--;
    s.strstart++;
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = 0;
  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
}

/* Values for max_lazy_match, good_match and max_chain_length, depending on
 * the desired pack level (0..9). The values given below have been tuned to
 * exclude worst case performance for pathological files. Better values may be
 * found for specific files.
 */
function Config(good_length, max_lazy, nice_length, max_chain, func) {
  this.good_length = good_length;
  this.max_lazy = max_lazy;
  this.nice_length = nice_length;
  this.max_chain = max_chain;
  this.func = func;
}

var configuration_table;

configuration_table = [
  /*      good lazy nice chain */
  new Config(0, 0, 0, 0, deflate_stored),          /* 0 store only */
  new Config(4, 4, 8, 4, deflate_fast),            /* 1 max speed, no lazy matches */
  new Config(4, 5, 16, 8, deflate_fast),           /* 2 */
  new Config(4, 6, 32, 32, deflate_fast),          /* 3 */

  new Config(4, 4, 16, 16, deflate_slow),          /* 4 lazy matches */
  new Config(8, 16, 32, 32, deflate_slow),         /* 5 */
  new Config(8, 16, 128, 128, deflate_slow),       /* 6 */
  new Config(8, 32, 128, 256, deflate_slow),       /* 7 */
  new Config(32, 128, 258, 1024, deflate_slow),    /* 8 */
  new Config(32, 258, 258, 4096, deflate_slow)     /* 9 max compression */
];


/* ===========================================================================
 * Initialize the "longest match" routines for a new zlib stream
 */
function lm_init(s) {
  s.window_size = 2 * s.w_size;

  /*** CLEAR_HASH(s); ***/
  zero(s.head); // Fill with NIL (= 0);

  /* Set the default configuration parameters:
   */
  s.max_lazy_match = configuration_table[s.level].max_lazy;
  s.good_match = configuration_table[s.level].good_length;
  s.nice_match = configuration_table[s.level].nice_length;
  s.max_chain_length = configuration_table[s.level].max_chain;

  s.strstart = 0;
  s.block_start = 0;
  s.lookahead = 0;
  s.insert = 0;
  s.match_length = s.prev_length = MIN_MATCH - 1;
  s.match_available = 0;
  s.ins_h = 0;
}


function DeflateState() {
  this.strm = null;            /* pointer back to this zlib stream */
  this.status = 0;            /* as the name implies */
  this.pending_buf = null;      /* output still pending */
  this.pending_buf_size = 0;  /* size of pending_buf */
  this.pending_out = 0;       /* next pending byte to output to the stream */
  this.pending = 0;           /* nb of bytes in the pending buffer */
  this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip */
  this.gzhead = null;         /* gzip header information to write */
  this.gzindex = 0;           /* where in extra, name, or comment */
  this.method = Z_DEFLATED; /* can only be DEFLATED */
  this.last_flush = -1;   /* value of flush param for previous deflate call */

  this.w_size = 0;  /* LZ77 window size (32K by default) */
  this.w_bits = 0;  /* log2(w_size)  (8..16) */
  this.w_mask = 0;  /* w_size - 1 */

  this.window = null;
  /* Sliding window. Input bytes are read into the second half of the window,
   * and move to the first half later to keep a dictionary of at least wSize
   * bytes. With this organization, matches are limited to a distance of
   * wSize-MAX_MATCH bytes, but this ensures that IO is always
   * performed with a length multiple of the block size.
   */

  this.window_size = 0;
  /* Actual size of window: 2*wSize, except when the user input buffer
   * is directly used as sliding window.
   */

  this.prev = null;
  /* Link to older string with same hash index. To limit the size of this
   * array to 64K, this link is maintained only for the last 32K strings.
   * An index in this array is thus a window index modulo 32K.
   */

  this.head = null;   /* Heads of the hash chains or NIL. */

  this.ins_h = 0;       /* hash index of string to be inserted */
  this.hash_size = 0;   /* number of elements in hash table */
  this.hash_bits = 0;   /* log2(hash_size) */
  this.hash_mask = 0;   /* hash_size-1 */

  this.hash_shift = 0;
  /* Number of bits by which ins_h must be shifted at each input
   * step. It must be such that after MIN_MATCH steps, the oldest
   * byte no longer takes part in the hash key, that is:
   *   hash_shift * MIN_MATCH >= hash_bits
   */

  this.block_start = 0;
  /* Window position at the beginning of the current output block. Gets
   * negative when the window is moved backwards.
   */

  this.match_length = 0;      /* length of best match */
  this.prev_match = 0;        /* previous match */
  this.match_available = 0;   /* set if previous match exists */
  this.strstart = 0;          /* start of string to insert */
  this.match_start = 0;       /* start of matching string */
  this.lookahead = 0;         /* number of valid bytes ahead in window */

  this.prev_length = 0;
  /* Length of the best match at previous step. Matches not greater than this
   * are discarded. This is used in the lazy match evaluation.
   */

  this.max_chain_length = 0;
  /* To speed up deflation, hash chains are never searched beyond this
   * length.  A higher limit improves compression ratio but degrades the
   * speed.
   */

  this.max_lazy_match = 0;
  /* Attempt to find a better match only when the current match is strictly
   * smaller than this value. This mechanism is used only for compression
   * levels >= 4.
   */
  // That's alias to max_lazy_match, don't use directly
  //this.max_insert_length = 0;
  /* Insert new strings in the hash table only if the match length is not
   * greater than this length. This saves time but degrades compression.
   * max_insert_length is used only for compression levels <= 3.
   */

  this.level = 0;     /* compression level (1..9) */
  this.strategy = 0;  /* favor or force Huffman coding*/

  this.good_match = 0;
  /* Use a faster search when the previous match is longer than this */

  this.nice_match = 0; /* Stop searching when current match exceeds this */

              /* used by trees.c: */

  /* Didn't use ct_data typedef below to suppress compiler warning */

  // struct ct_data_s dyn_ltree[HEAP_SIZE];   /* literal and length tree */
  // struct ct_data_s dyn_dtree[2*D_CODES+1]; /* distance tree */
  // struct ct_data_s bl_tree[2*BL_CODES+1];  /* Huffman tree for bit lengths */

  // Use flat array of DOUBLE size, with interleaved fata,
  // because JS does not support effective
  this.dyn_ltree  = new utils.Buf16(HEAP_SIZE * 2);
  this.dyn_dtree  = new utils.Buf16((2 * D_CODES + 1) * 2);
  this.bl_tree    = new utils.Buf16((2 * BL_CODES + 1) * 2);
  zero(this.dyn_ltree);
  zero(this.dyn_dtree);
  zero(this.bl_tree);

  this.l_desc   = null;         /* desc. for literal tree */
  this.d_desc   = null;         /* desc. for distance tree */
  this.bl_desc  = null;         /* desc. for bit length tree */

  //ush bl_count[MAX_BITS+1];
  this.bl_count = new utils.Buf16(MAX_BITS + 1);
  /* number of codes at each bit length for an optimal tree */

  //int heap[2*L_CODES+1];      /* heap used to build the Huffman trees */
  this.heap = new utils.Buf16(2 * L_CODES + 1);  /* heap used to build the Huffman trees */
  zero(this.heap);

  this.heap_len = 0;               /* number of elements in the heap */
  this.heap_max = 0;               /* element of largest frequency */
  /* The sons of heap[n] are heap[2*n] and heap[2*n+1]. heap[0] is not used.
   * The same heap array is used to build all trees.
   */

  this.depth = new utils.Buf16(2 * L_CODES + 1); //uch depth[2*L_CODES+1];
  zero(this.depth);
  /* Depth of each subtree used as tie breaker for trees of equal frequency
   */

  this.l_buf = 0;          /* buffer index for literals or lengths */

  this.lit_bufsize = 0;
  /* Size of match buffer for literals/lengths.  There are 4 reasons for
   * limiting lit_bufsize to 64K:
   *   - frequencies can be kept in 16 bit counters
   *   - if compression is not successful for the first block, all input
   *     data is still in the window so we can still emit a stored block even
   *     when input comes from standard input.  (This can also be done for
   *     all blocks if lit_bufsize is not greater than 32K.)
   *   - if compression is not successful for a file smaller than 64K, we can
   *     even emit a stored file instead of a stored block (saving 5 bytes).
   *     This is applicable only for zip (not gzip or zlib).
   *   - creating new Huffman trees less frequently may not provide fast
   *     adaptation to changes in the input data statistics. (Take for
   *     example a binary file with poorly compressible code followed by
   *     a highly compressible string table.) Smaller buffer sizes give
   *     fast adaptation but have of course the overhead of transmitting
   *     trees more frequently.
   *   - I can't count above 4
   */

  this.last_lit = 0;      /* running index in l_buf */

  this.d_buf = 0;
  /* Buffer index for distances. To simplify the code, d_buf and l_buf have
   * the same number of elements. To use different lengths, an extra flag
   * array would be necessary.
   */

  this.opt_len = 0;       /* bit length of current block with optimal trees */
  this.static_len = 0;    /* bit length of current block with static trees */
  this.matches = 0;       /* number of string matches in current block */
  this.insert = 0;        /* bytes at end of window left to insert */


  this.bi_buf = 0;
  /* Output buffer. bits are inserted starting at the bottom (least
   * significant bits).
   */
  this.bi_valid = 0;
  /* Number of valid bits in bi_buf.  All bits above the last valid bit
   * are always zero.
   */

  // Used for window memory init. We safely ignore it for JS. That makes
  // sense only for pointers and memory check tools.
  //this.high_water = 0;
  /* High water mark offset in window for initialized bytes -- bytes above
   * this are set to zero in order to avoid memory check warnings when
   * longest match routines access bytes past the input.  This is then
   * updated to the new high water mark.
   */
}


function deflateResetKeep(strm) {
  var s;

  if (!strm || !strm.state) {
    return err(strm, Z_STREAM_ERROR);
  }

  strm.total_in = strm.total_out = 0;
  strm.data_type = Z_UNKNOWN;

  s = strm.state;
  s.pending = 0;
  s.pending_out = 0;

  if (s.wrap < 0) {
    s.wrap = -s.wrap;
    /* was made negative by deflate(..., Z_FINISH); */
  }
  s.status = (s.wrap ? INIT_STATE : BUSY_STATE);
  strm.adler = (s.wrap === 2) ?
    0  // crc32(0, Z_NULL, 0)
  :
    1; // adler32(0, Z_NULL, 0)
  s.last_flush = Z_NO_FLUSH;
  trees._tr_init(s);
  return Z_OK;
}


function deflateReset(strm) {
  var ret = deflateResetKeep(strm);
  if (ret === Z_OK) {
    lm_init(strm.state);
  }
  return ret;
}


function deflateSetHeader(strm, head) {
  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
  if (strm.state.wrap !== 2) { return Z_STREAM_ERROR; }
  strm.state.gzhead = head;
  return Z_OK;
}


function deflateInit2(strm, level, method, windowBits, memLevel, strategy) {
  if (!strm) { // === Z_NULL
    return Z_STREAM_ERROR;
  }
  var wrap = 1;

  if (level === Z_DEFAULT_COMPRESSION) {
    level = 6;
  }

  if (windowBits < 0) { /* suppress zlib wrapper */
    wrap = 0;
    windowBits = -windowBits;
  }

  else if (windowBits > 15) {
    wrap = 2;           /* write gzip wrapper instead */
    windowBits -= 16;
  }


  if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED ||
    windowBits < 8 || windowBits > 15 || level < 0 || level > 9 ||
    strategy < 0 || strategy > Z_FIXED) {
    return err(strm, Z_STREAM_ERROR);
  }


  if (windowBits === 8) {
    windowBits = 9;
  }
  /* until 256-byte window bug fixed */

  var s = new DeflateState();

  strm.state = s;
  s.strm = strm;

  s.wrap = wrap;
  s.gzhead = null;
  s.w_bits = windowBits;
  s.w_size = 1 << s.w_bits;
  s.w_mask = s.w_size - 1;

  s.hash_bits = memLevel + 7;
  s.hash_size = 1 << s.hash_bits;
  s.hash_mask = s.hash_size - 1;
  s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);

  s.window = new utils.Buf8(s.w_size * 2);
  s.head = new utils.Buf16(s.hash_size);
  s.prev = new utils.Buf16(s.w_size);

  // Don't need mem init magic for JS.
  //s.high_water = 0;  /* nothing written to s->window yet */

  s.lit_bufsize = 1 << (memLevel + 6); /* 16K elements by default */

  s.pending_buf_size = s.lit_bufsize * 4;

  //overlay = (ushf *) ZALLOC(strm, s->lit_bufsize, sizeof(ush)+2);
  //s->pending_buf = (uchf *) overlay;
  s.pending_buf = new utils.Buf8(s.pending_buf_size);

  // It is offset from `s.pending_buf` (size is `s.lit_bufsize * 2`)
  //s->d_buf = overlay + s->lit_bufsize/sizeof(ush);
  s.d_buf = 1 * s.lit_bufsize;

  //s->l_buf = s->pending_buf + (1+sizeof(ush))*s->lit_bufsize;
  s.l_buf = (1 + 2) * s.lit_bufsize;

  s.level = level;
  s.strategy = strategy;
  s.method = method;

  return deflateReset(strm);
}

function deflateInit(strm, level) {
  return deflateInit2(strm, level, Z_DEFLATED, MAX_WBITS, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY);
}


function deflate(strm, flush) {
  var old_flush, s;
  var beg, val; // for gzip header write only

  if (!strm || !strm.state ||
    flush > Z_BLOCK || flush < 0) {
    return strm ? err(strm, Z_STREAM_ERROR) : Z_STREAM_ERROR;
  }

  s = strm.state;

  if (!strm.output ||
      (!strm.input && strm.avail_in !== 0) ||
      (s.status === FINISH_STATE && flush !== Z_FINISH)) {
    return err(strm, (strm.avail_out === 0) ? Z_BUF_ERROR : Z_STREAM_ERROR);
  }

  s.strm = strm; /* just in case */
  old_flush = s.last_flush;
  s.last_flush = flush;

  /* Write the header */
  if (s.status === INIT_STATE) {

    if (s.wrap === 2) { // GZIP header
      strm.adler = 0;  //crc32(0L, Z_NULL, 0);
      put_byte(s, 31);
      put_byte(s, 139);
      put_byte(s, 8);
      if (!s.gzhead) { // s->gzhead == Z_NULL
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, s.level === 9 ? 2 :
                    (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ?
                     4 : 0));
        put_byte(s, OS_CODE);
        s.status = BUSY_STATE;
      }
      else {
        put_byte(s, (s.gzhead.text ? 1 : 0) +
                    (s.gzhead.hcrc ? 2 : 0) +
                    (!s.gzhead.extra ? 0 : 4) +
                    (!s.gzhead.name ? 0 : 8) +
                    (!s.gzhead.comment ? 0 : 16)
                );
        put_byte(s, s.gzhead.time & 0xff);
        put_byte(s, (s.gzhead.time >> 8) & 0xff);
        put_byte(s, (s.gzhead.time >> 16) & 0xff);
        put_byte(s, (s.gzhead.time >> 24) & 0xff);
        put_byte(s, s.level === 9 ? 2 :
                    (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ?
                     4 : 0));
        put_byte(s, s.gzhead.os & 0xff);
        if (s.gzhead.extra && s.gzhead.extra.length) {
          put_byte(s, s.gzhead.extra.length & 0xff);
          put_byte(s, (s.gzhead.extra.length >> 8) & 0xff);
        }
        if (s.gzhead.hcrc) {
          strm.adler = crc32(strm.adler, s.pending_buf, s.pending, 0);
        }
        s.gzindex = 0;
        s.status = EXTRA_STATE;
      }
    }
    else // DEFLATE header
    {
      var header = (Z_DEFLATED + ((s.w_bits - 8) << 4)) << 8;
      var level_flags = -1;

      if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
        level_flags = 0;
      } else if (s.level < 6) {
        level_flags = 1;
      } else if (s.level === 6) {
        level_flags = 2;
      } else {
        level_flags = 3;
      }
      header |= (level_flags << 6);
      if (s.strstart !== 0) { header |= PRESET_DICT; }
      header += 31 - (header % 31);

      s.status = BUSY_STATE;
      putShortMSB(s, header);

      /* Save the adler32 of the preset dictionary: */
      if (s.strstart !== 0) {
        putShortMSB(s, strm.adler >>> 16);
        putShortMSB(s, strm.adler & 0xffff);
      }
      strm.adler = 1; // adler32(0L, Z_NULL, 0);
    }
  }

//#ifdef GZIP
  if (s.status === EXTRA_STATE) {
    if (s.gzhead.extra/* != Z_NULL*/) {
      beg = s.pending;  /* start of bytes to update crc */

      while (s.gzindex < (s.gzhead.extra.length & 0xffff)) {
        if (s.pending === s.pending_buf_size) {
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          flush_pending(strm);
          beg = s.pending;
          if (s.pending === s.pending_buf_size) {
            break;
          }
        }
        put_byte(s, s.gzhead.extra[s.gzindex] & 0xff);
        s.gzindex++;
      }
      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      if (s.gzindex === s.gzhead.extra.length) {
        s.gzindex = 0;
        s.status = NAME_STATE;
      }
    }
    else {
      s.status = NAME_STATE;
    }
  }
  if (s.status === NAME_STATE) {
    if (s.gzhead.name/* != Z_NULL*/) {
      beg = s.pending;  /* start of bytes to update crc */
      //int val;

      do {
        if (s.pending === s.pending_buf_size) {
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          flush_pending(strm);
          beg = s.pending;
          if (s.pending === s.pending_buf_size) {
            val = 1;
            break;
          }
        }
        // JS specific: little magic to add zero terminator to end of string
        if (s.gzindex < s.gzhead.name.length) {
          val = s.gzhead.name.charCodeAt(s.gzindex++) & 0xff;
        } else {
          val = 0;
        }
        put_byte(s, val);
      } while (val !== 0);

      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      if (val === 0) {
        s.gzindex = 0;
        s.status = COMMENT_STATE;
      }
    }
    else {
      s.status = COMMENT_STATE;
    }
  }
  if (s.status === COMMENT_STATE) {
    if (s.gzhead.comment/* != Z_NULL*/) {
      beg = s.pending;  /* start of bytes to update crc */
      //int val;

      do {
        if (s.pending === s.pending_buf_size) {
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          flush_pending(strm);
          beg = s.pending;
          if (s.pending === s.pending_buf_size) {
            val = 1;
            break;
          }
        }
        // JS specific: little magic to add zero terminator to end of string
        if (s.gzindex < s.gzhead.comment.length) {
          val = s.gzhead.comment.charCodeAt(s.gzindex++) & 0xff;
        } else {
          val = 0;
        }
        put_byte(s, val);
      } while (val !== 0);

      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      if (val === 0) {
        s.status = HCRC_STATE;
      }
    }
    else {
      s.status = HCRC_STATE;
    }
  }
  if (s.status === HCRC_STATE) {
    if (s.gzhead.hcrc) {
      if (s.pending + 2 > s.pending_buf_size) {
        flush_pending(strm);
      }
      if (s.pending + 2 <= s.pending_buf_size) {
        put_byte(s, strm.adler & 0xff);
        put_byte(s, (strm.adler >> 8) & 0xff);
        strm.adler = 0; //crc32(0L, Z_NULL, 0);
        s.status = BUSY_STATE;
      }
    }
    else {
      s.status = BUSY_STATE;
    }
  }
//#endif

  /* Flush as much pending output as possible */
  if (s.pending !== 0) {
    flush_pending(strm);
    if (strm.avail_out === 0) {
      /* Since avail_out is 0, deflate will be called again with
       * more output space, but possibly with both pending and
       * avail_in equal to zero. There won't be anything to do,
       * but this is not an error situation so make sure we
       * return OK instead of BUF_ERROR at next call of deflate:
       */
      s.last_flush = -1;
      return Z_OK;
    }

    /* Make sure there is something to do and avoid duplicate consecutive
     * flushes. For repeated and useless calls with Z_FINISH, we keep
     * returning Z_STREAM_END instead of Z_BUF_ERROR.
     */
  } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) &&
    flush !== Z_FINISH) {
    return err(strm, Z_BUF_ERROR);
  }

  /* User must not provide more input after the first FINISH: */
  if (s.status === FINISH_STATE && strm.avail_in !== 0) {
    return err(strm, Z_BUF_ERROR);
  }

  /* Start a new block or continue the current one.
   */
  if (strm.avail_in !== 0 || s.lookahead !== 0 ||
    (flush !== Z_NO_FLUSH && s.status !== FINISH_STATE)) {
    var bstate = (s.strategy === Z_HUFFMAN_ONLY) ? deflate_huff(s, flush) :
      (s.strategy === Z_RLE ? deflate_rle(s, flush) :
        configuration_table[s.level].func(s, flush));

    if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
      s.status = FINISH_STATE;
    }
    if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
      if (strm.avail_out === 0) {
        s.last_flush = -1;
        /* avoid BUF_ERROR next call, see above */
      }
      return Z_OK;
      /* If flush != Z_NO_FLUSH && avail_out == 0, the next call
       * of deflate should use the same flush parameter to make sure
       * that the flush is complete. So we don't have to output an
       * empty block here, this will be done at next call. This also
       * ensures that for a very small output buffer, we emit at most
       * one empty block.
       */
    }
    if (bstate === BS_BLOCK_DONE) {
      if (flush === Z_PARTIAL_FLUSH) {
        trees._tr_align(s);
      }
      else if (flush !== Z_BLOCK) { /* FULL_FLUSH or SYNC_FLUSH */

        trees._tr_stored_block(s, 0, 0, false);
        /* For a full flush, this empty block will be recognized
         * as a special marker by inflate_sync().
         */
        if (flush === Z_FULL_FLUSH) {
          /*** CLEAR_HASH(s); ***/             /* forget history */
          zero(s.head); // Fill with NIL (= 0);

          if (s.lookahead === 0) {
            s.strstart = 0;
            s.block_start = 0;
            s.insert = 0;
          }
        }
      }
      flush_pending(strm);
      if (strm.avail_out === 0) {
        s.last_flush = -1; /* avoid BUF_ERROR at next call, see above */
        return Z_OK;
      }
    }
  }
  //Assert(strm->avail_out > 0, "bug2");
  //if (strm.avail_out <= 0) { throw new Error("bug2");}

  if (flush !== Z_FINISH) { return Z_OK; }
  if (s.wrap <= 0) { return Z_STREAM_END; }

  /* Write the trailer */
  if (s.wrap === 2) {
    put_byte(s, strm.adler & 0xff);
    put_byte(s, (strm.adler >> 8) & 0xff);
    put_byte(s, (strm.adler >> 16) & 0xff);
    put_byte(s, (strm.adler >> 24) & 0xff);
    put_byte(s, strm.total_in & 0xff);
    put_byte(s, (strm.total_in >> 8) & 0xff);
    put_byte(s, (strm.total_in >> 16) & 0xff);
    put_byte(s, (strm.total_in >> 24) & 0xff);
  }
  else
  {
    putShortMSB(s, strm.adler >>> 16);
    putShortMSB(s, strm.adler & 0xffff);
  }

  flush_pending(strm);
  /* If avail_out is zero, the application will call deflate again
   * to flush the rest.
   */
  if (s.wrap > 0) { s.wrap = -s.wrap; }
  /* write the trailer only once! */
  return s.pending !== 0 ? Z_OK : Z_STREAM_END;
}

function deflateEnd(strm) {
  var status;

  if (!strm/*== Z_NULL*/ || !strm.state/*== Z_NULL*/) {
    return Z_STREAM_ERROR;
  }

  status = strm.state.status;
  if (status !== INIT_STATE &&
    status !== EXTRA_STATE &&
    status !== NAME_STATE &&
    status !== COMMENT_STATE &&
    status !== HCRC_STATE &&
    status !== BUSY_STATE &&
    status !== FINISH_STATE
  ) {
    return err(strm, Z_STREAM_ERROR);
  }

  strm.state = null;

  return status === BUSY_STATE ? err(strm, Z_DATA_ERROR) : Z_OK;
}


/* =========================================================================
 * Initializes the compression dictionary from the given byte
 * sequence without producing any compressed output.
 */
function deflateSetDictionary(strm, dictionary) {
  var dictLength = dictionary.length;

  var s;
  var str, n;
  var wrap;
  var avail;
  var next;
  var input;
  var tmpDict;

  if (!strm/*== Z_NULL*/ || !strm.state/*== Z_NULL*/) {
    return Z_STREAM_ERROR;
  }

  s = strm.state;
  wrap = s.wrap;

  if (wrap === 2 || (wrap === 1 && s.status !== INIT_STATE) || s.lookahead) {
    return Z_STREAM_ERROR;
  }

  /* when using zlib wrappers, compute Adler-32 for provided dictionary */
  if (wrap === 1) {
    /* adler32(strm->adler, dictionary, dictLength); */
    strm.adler = adler32(strm.adler, dictionary, dictLength, 0);
  }

  s.wrap = 0;   /* avoid computing Adler-32 in read_buf */

  /* if dictionary would fill window, just replace the history */
  if (dictLength >= s.w_size) {
    if (wrap === 0) {            /* already empty otherwise */
      /*** CLEAR_HASH(s); ***/
      zero(s.head); // Fill with NIL (= 0);
      s.strstart = 0;
      s.block_start = 0;
      s.insert = 0;
    }
    /* use the tail */
    // dictionary = dictionary.slice(dictLength - s.w_size);
    tmpDict = new utils.Buf8(s.w_size);
    utils.arraySet(tmpDict, dictionary, dictLength - s.w_size, s.w_size, 0);
    dictionary = tmpDict;
    dictLength = s.w_size;
  }
  /* insert dictionary into window and hash */
  avail = strm.avail_in;
  next = strm.next_in;
  input = strm.input;
  strm.avail_in = dictLength;
  strm.next_in = 0;
  strm.input = dictionary;
  fill_window(s);
  while (s.lookahead >= MIN_MATCH) {
    str = s.strstart;
    n = s.lookahead - (MIN_MATCH - 1);
    do {
      /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;

      s.prev[str & s.w_mask] = s.head[s.ins_h];

      s.head[s.ins_h] = str;
      str++;
    } while (--n);
    s.strstart = str;
    s.lookahead = MIN_MATCH - 1;
    fill_window(s);
  }
  s.strstart += s.lookahead;
  s.block_start = s.strstart;
  s.insert = s.lookahead;
  s.lookahead = 0;
  s.match_length = s.prev_length = MIN_MATCH - 1;
  s.match_available = 0;
  strm.next_in = next;
  strm.input = input;
  strm.avail_in = avail;
  s.wrap = wrap;
  return Z_OK;
}


exports.deflateInit = deflateInit;
exports.deflateInit2 = deflateInit2;
exports.deflateReset = deflateReset;
exports.deflateResetKeep = deflateResetKeep;
exports.deflateSetHeader = deflateSetHeader;
exports.deflate = deflate;
exports.deflateEnd = deflateEnd;
exports.deflateSetDictionary = deflateSetDictionary;
exports.deflateInfo = 'pako deflate (from Nodeca project)';

/* Not implemented
exports.deflateBound = deflateBound;
exports.deflateCopy = deflateCopy;
exports.deflateParams = deflateParams;
exports.deflatePending = deflatePending;
exports.deflatePrime = deflatePrime;
exports.deflateTune = deflateTune;
*/


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



function GZheader() {
  /* true if compressed data believed to be text */
  this.text       = 0;
  /* modification time */
  this.time       = 0;
  /* extra flags (not used when writing a gzip file) */
  this.xflags     = 0;
  /* operating system */
  this.os         = 0;
  /* pointer to extra field or Z_NULL if none */
  this.extra      = null;
  /* extra field length (valid if extra != Z_NULL) */
  this.extra_len  = 0; // Actually, we don't need it in JS,
                       // but leave for few code modifications

  //
  // Setup limits is not necessary because in js we should not preallocate memory
  // for inflate use constant limit in 65536 bytes
  //

  /* space at extra (only when reading header) */
  // this.extra_max  = 0;
  /* pointer to zero-terminated file name or Z_NULL */
  this.name       = '';
  /* space at name (only when reading header) */
  // this.name_max   = 0;
  /* pointer to zero-terminated comment or Z_NULL */
  this.comment    = '';
  /* space at comment (only when reading header) */
  // this.comm_max   = 0;
  /* true if there was or will be a header crc */
  this.hcrc       = 0;
  /* true when done reading gzip header (not used when writing a gzip file) */
  this.done       = false;
}

module.exports = GZheader;


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// See state defs from inflate.js
var BAD = 30;       /* got a data error -- remain here until reset */
var TYPE = 12;      /* i: waiting for type bits, including last-flag bit */

/*
   Decode literal, length, and distance codes and write out the resulting
   literal and match bytes until either not enough input or output is
   available, an end-of-block is encountered, or a data error is encountered.
   When large enough input and output buffers are supplied to inflate(), for
   example, a 16K input buffer and a 64K output buffer, more than 95% of the
   inflate execution time is spent in this routine.

   Entry assumptions:

        state.mode === LEN
        strm.avail_in >= 6
        strm.avail_out >= 258
        start >= strm.avail_out
        state.bits < 8

   On return, state.mode is one of:

        LEN -- ran out of enough output space or enough available input
        TYPE -- reached end of block code, inflate() to interpret next block
        BAD -- error in block data

   Notes:

    - The maximum input bits used by a length/distance pair is 15 bits for the
      length code, 5 bits for the length extra, 15 bits for the distance code,
      and 13 bits for the distance extra.  This totals 48 bits, or six bytes.
      Therefore if strm.avail_in >= 6, then there is enough input to avoid
      checking for available input while decoding.

    - The maximum bytes that a single length/distance pair can output is 258
      bytes, which is the maximum length that can be coded.  inflate_fast()
      requires strm.avail_out >= 258 for each loop to avoid checking for
      output space.
 */
module.exports = function inflate_fast(strm, start) {
  var state;
  var _in;                    /* local strm.input */
  var last;                   /* have enough input while in < last */
  var _out;                   /* local strm.output */
  var beg;                    /* inflate()'s initial strm.output */
  var end;                    /* while out < end, enough space available */
//#ifdef INFLATE_STRICT
  var dmax;                   /* maximum distance from zlib header */
//#endif
  var wsize;                  /* window size or zero if not using window */
  var whave;                  /* valid bytes in the window */
  var wnext;                  /* window write index */
  // Use `s_window` instead `window`, avoid conflict with instrumentation tools
  var s_window;               /* allocated sliding window, if wsize != 0 */
  var hold;                   /* local strm.hold */
  var bits;                   /* local strm.bits */
  var lcode;                  /* local strm.lencode */
  var dcode;                  /* local strm.distcode */
  var lmask;                  /* mask for first level of length codes */
  var dmask;                  /* mask for first level of distance codes */
  var here;                   /* retrieved table entry */
  var op;                     /* code bits, operation, extra bits, or */
                              /*  window position, window bytes to copy */
  var len;                    /* match length, unused bytes */
  var dist;                   /* match distance */
  var from;                   /* where to copy match from */
  var from_source;


  var input, output; // JS specific, because we have no pointers

  /* copy state to local variables */
  state = strm.state;
  //here = state.here;
  _in = strm.next_in;
  input = strm.input;
  last = _in + (strm.avail_in - 5);
  _out = strm.next_out;
  output = strm.output;
  beg = _out - (start - strm.avail_out);
  end = _out + (strm.avail_out - 257);
//#ifdef INFLATE_STRICT
  dmax = state.dmax;
//#endif
  wsize = state.wsize;
  whave = state.whave;
  wnext = state.wnext;
  s_window = state.window;
  hold = state.hold;
  bits = state.bits;
  lcode = state.lencode;
  dcode = state.distcode;
  lmask = (1 << state.lenbits) - 1;
  dmask = (1 << state.distbits) - 1;


  /* decode literals and length/distances until end-of-block or not enough
     input data or output space */

  top:
  do {
    if (bits < 15) {
      hold += input[_in++] << bits;
      bits += 8;
      hold += input[_in++] << bits;
      bits += 8;
    }

    here = lcode[hold & lmask];

    dolen:
    for (;;) { // Goto emulation
      op = here >>> 24/*here.bits*/;
      hold >>>= op;
      bits -= op;
      op = (here >>> 16) & 0xff/*here.op*/;
      if (op === 0) {                          /* literal */
        //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
        //        "inflate:         literal '%c'\n" :
        //        "inflate:         literal 0x%02x\n", here.val));
        output[_out++] = here & 0xffff/*here.val*/;
      }
      else if (op & 16) {                     /* length base */
        len = here & 0xffff/*here.val*/;
        op &= 15;                           /* number of extra bits */
        if (op) {
          if (bits < op) {
            hold += input[_in++] << bits;
            bits += 8;
          }
          len += hold & ((1 << op) - 1);
          hold >>>= op;
          bits -= op;
        }
        //Tracevv((stderr, "inflate:         length %u\n", len));
        if (bits < 15) {
          hold += input[_in++] << bits;
          bits += 8;
          hold += input[_in++] << bits;
          bits += 8;
        }
        here = dcode[hold & dmask];

        dodist:
        for (;;) { // goto emulation
          op = here >>> 24/*here.bits*/;
          hold >>>= op;
          bits -= op;
          op = (here >>> 16) & 0xff/*here.op*/;

          if (op & 16) {                      /* distance base */
            dist = here & 0xffff/*here.val*/;
            op &= 15;                       /* number of extra bits */
            if (bits < op) {
              hold += input[_in++] << bits;
              bits += 8;
              if (bits < op) {
                hold += input[_in++] << bits;
                bits += 8;
              }
            }
            dist += hold & ((1 << op) - 1);
//#ifdef INFLATE_STRICT
            if (dist > dmax) {
              strm.msg = 'invalid distance too far back';
              state.mode = BAD;
              break top;
            }
//#endif
            hold >>>= op;
            bits -= op;
            //Tracevv((stderr, "inflate:         distance %u\n", dist));
            op = _out - beg;                /* max distance in output */
            if (dist > op) {                /* see if copy from window */
              op = dist - op;               /* distance back in window */
              if (op > whave) {
                if (state.sane) {
                  strm.msg = 'invalid distance too far back';
                  state.mode = BAD;
                  break top;
                }

// (!) This block is disabled in zlib defailts,
// don't enable it for binary compatibility
//#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
//                if (len <= op - whave) {
//                  do {
//                    output[_out++] = 0;
//                  } while (--len);
//                  continue top;
//                }
//                len -= op - whave;
//                do {
//                  output[_out++] = 0;
//                } while (--op > whave);
//                if (op === 0) {
//                  from = _out - dist;
//                  do {
//                    output[_out++] = output[from++];
//                  } while (--len);
//                  continue top;
//                }
//#endif
              }
              from = 0; // window index
              from_source = s_window;
              if (wnext === 0) {           /* very common case */
                from += wsize - op;
                if (op < len) {         /* some from window */
                  len -= op;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = _out - dist;  /* rest from output */
                  from_source = output;
                }
              }
              else if (wnext < op) {      /* wrap around window */
                from += wsize + wnext - op;
                op -= wnext;
                if (op < len) {         /* some from end of window */
                  len -= op;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = 0;
                  if (wnext < len) {  /* some from start of window */
                    op = wnext;
                    len -= op;
                    do {
                      output[_out++] = s_window[from++];
                    } while (--op);
                    from = _out - dist;      /* rest from output */
                    from_source = output;
                  }
                }
              }
              else {                      /* contiguous in window */
                from += wnext - op;
                if (op < len) {         /* some from window */
                  len -= op;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = _out - dist;  /* rest from output */
                  from_source = output;
                }
              }
              while (len > 2) {
                output[_out++] = from_source[from++];
                output[_out++] = from_source[from++];
                output[_out++] = from_source[from++];
                len -= 3;
              }
              if (len) {
                output[_out++] = from_source[from++];
                if (len > 1) {
                  output[_out++] = from_source[from++];
                }
              }
            }
            else {
              from = _out - dist;          /* copy direct from output */
              do {                        /* minimum length is three */
                output[_out++] = output[from++];
                output[_out++] = output[from++];
                output[_out++] = output[from++];
                len -= 3;
              } while (len > 2);
              if (len) {
                output[_out++] = output[from++];
                if (len > 1) {
                  output[_out++] = output[from++];
                }
              }
            }
          }
          else if ((op & 64) === 0) {          /* 2nd level distance code */
            here = dcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
            continue dodist;
          }
          else {
            strm.msg = 'invalid distance code';
            state.mode = BAD;
            break top;
          }

          break; // need to emulate goto via "continue"
        }
      }
      else if ((op & 64) === 0) {              /* 2nd level length code */
        here = lcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
        continue dolen;
      }
      else if (op & 32) {                     /* end-of-block */
        //Tracevv((stderr, "inflate:         end of block\n"));
        state.mode = TYPE;
        break top;
      }
      else {
        strm.msg = 'invalid literal/length code';
        state.mode = BAD;
        break top;
      }

      break; // need to emulate goto via "continue"
    }
  } while (_in < last && _out < end);

  /* return unused bytes (on entry, bits < 8, so in won't go too far back) */
  len = bits >> 3;
  _in -= len;
  bits -= len << 3;
  hold &= (1 << bits) - 1;

  /* update state and return */
  strm.next_in = _in;
  strm.next_out = _out;
  strm.avail_in = (_in < last ? 5 + (last - _in) : 5 - (_in - last));
  strm.avail_out = (_out < end ? 257 + (end - _out) : 257 - (_out - end));
  state.hold = hold;
  state.bits = bits;
  return;
};


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



var utils         = __webpack_require__(1);
var adler32       = __webpack_require__(33);
var crc32         = __webpack_require__(35);
var inflate_fast  = __webpack_require__(90);
var inflate_table = __webpack_require__(92);

var CODES = 0;
var LENS = 1;
var DISTS = 2;

/* Public constants ==========================================================*/
/* ===========================================================================*/


/* Allowed flush values; see deflate() and inflate() below for details */
//var Z_NO_FLUSH      = 0;
//var Z_PARTIAL_FLUSH = 1;
//var Z_SYNC_FLUSH    = 2;
//var Z_FULL_FLUSH    = 3;
var Z_FINISH        = 4;
var Z_BLOCK         = 5;
var Z_TREES         = 6;


/* Return codes for the compression/decompression functions. Negative values
 * are errors, positive values are used for special but normal events.
 */
var Z_OK            = 0;
var Z_STREAM_END    = 1;
var Z_NEED_DICT     = 2;
//var Z_ERRNO         = -1;
var Z_STREAM_ERROR  = -2;
var Z_DATA_ERROR    = -3;
var Z_MEM_ERROR     = -4;
var Z_BUF_ERROR     = -5;
//var Z_VERSION_ERROR = -6;

/* The deflate compression method */
var Z_DEFLATED  = 8;


/* STATES ====================================================================*/
/* ===========================================================================*/


var    HEAD = 1;       /* i: waiting for magic header */
var    FLAGS = 2;      /* i: waiting for method and flags (gzip) */
var    TIME = 3;       /* i: waiting for modification time (gzip) */
var    OS = 4;         /* i: waiting for extra flags and operating system (gzip) */
var    EXLEN = 5;      /* i: waiting for extra length (gzip) */
var    EXTRA = 6;      /* i: waiting for extra bytes (gzip) */
var    NAME = 7;       /* i: waiting for end of file name (gzip) */
var    COMMENT = 8;    /* i: waiting for end of comment (gzip) */
var    HCRC = 9;       /* i: waiting for header crc (gzip) */
var    DICTID = 10;    /* i: waiting for dictionary check value */
var    DICT = 11;      /* waiting for inflateSetDictionary() call */
var        TYPE = 12;      /* i: waiting for type bits, including last-flag bit */
var        TYPEDO = 13;    /* i: same, but skip check to exit inflate on new block */
var        STORED = 14;    /* i: waiting for stored size (length and complement) */
var        COPY_ = 15;     /* i/o: same as COPY below, but only first time in */
var        COPY = 16;      /* i/o: waiting for input or output to copy stored block */
var        TABLE = 17;     /* i: waiting for dynamic block table lengths */
var        LENLENS = 18;   /* i: waiting for code length code lengths */
var        CODELENS = 19;  /* i: waiting for length/lit and distance code lengths */
var            LEN_ = 20;      /* i: same as LEN below, but only first time in */
var            LEN = 21;       /* i: waiting for length/lit/eob code */
var            LENEXT = 22;    /* i: waiting for length extra bits */
var            DIST = 23;      /* i: waiting for distance code */
var            DISTEXT = 24;   /* i: waiting for distance extra bits */
var            MATCH = 25;     /* o: waiting for output space to copy string */
var            LIT = 26;       /* o: waiting for output space to write literal */
var    CHECK = 27;     /* i: waiting for 32-bit check value */
var    LENGTH = 28;    /* i: waiting for 32-bit length (gzip) */
var    DONE = 29;      /* finished check, done -- remain here until reset */
var    BAD = 30;       /* got a data error -- remain here until reset */
var    MEM = 31;       /* got an inflate() memory error -- remain here until reset */
var    SYNC = 32;      /* looking for synchronization bytes to restart inflate() */

/* ===========================================================================*/



var ENOUGH_LENS = 852;
var ENOUGH_DISTS = 592;
//var ENOUGH =  (ENOUGH_LENS+ENOUGH_DISTS);

var MAX_WBITS = 15;
/* 32K LZ77 window */
var DEF_WBITS = MAX_WBITS;


function zswap32(q) {
  return  (((q >>> 24) & 0xff) +
          ((q >>> 8) & 0xff00) +
          ((q & 0xff00) << 8) +
          ((q & 0xff) << 24));
}


function InflateState() {
  this.mode = 0;             /* current inflate mode */
  this.last = false;          /* true if processing last block */
  this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip */
  this.havedict = false;      /* true if dictionary provided */
  this.flags = 0;             /* gzip header method and flags (0 if zlib) */
  this.dmax = 0;              /* zlib header max distance (INFLATE_STRICT) */
  this.check = 0;             /* protected copy of check value */
  this.total = 0;             /* protected copy of output count */
  // TODO: may be {}
  this.head = null;           /* where to save gzip header information */

  /* sliding window */
  this.wbits = 0;             /* log base 2 of requested window size */
  this.wsize = 0;             /* window size or zero if not using window */
  this.whave = 0;             /* valid bytes in the window */
  this.wnext = 0;             /* window write index */
  this.window = null;         /* allocated sliding window, if needed */

  /* bit accumulator */
  this.hold = 0;              /* input bit accumulator */
  this.bits = 0;              /* number of bits in "in" */

  /* for string and stored block copying */
  this.length = 0;            /* literal or length of data to copy */
  this.offset = 0;            /* distance back to copy string from */

  /* for table and code decoding */
  this.extra = 0;             /* extra bits needed */

  /* fixed and dynamic code tables */
  this.lencode = null;          /* starting table for length/literal codes */
  this.distcode = null;         /* starting table for distance codes */
  this.lenbits = 0;           /* index bits for lencode */
  this.distbits = 0;          /* index bits for distcode */

  /* dynamic table building */
  this.ncode = 0;             /* number of code length code lengths */
  this.nlen = 0;              /* number of length code lengths */
  this.ndist = 0;             /* number of distance code lengths */
  this.have = 0;              /* number of code lengths in lens[] */
  this.next = null;              /* next available space in codes[] */

  this.lens = new utils.Buf16(320); /* temporary storage for code lengths */
  this.work = new utils.Buf16(288); /* work area for code table building */

  /*
   because we don't have pointers in js, we use lencode and distcode directly
   as buffers so we don't need codes
  */
  //this.codes = new utils.Buf32(ENOUGH);       /* space for code tables */
  this.lendyn = null;              /* dynamic table for length/literal codes (JS specific) */
  this.distdyn = null;             /* dynamic table for distance codes (JS specific) */
  this.sane = 0;                   /* if false, allow invalid distance too far */
  this.back = 0;                   /* bits back of last unprocessed length/lit */
  this.was = 0;                    /* initial length of match */
}

function inflateResetKeep(strm) {
  var state;

  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
  state = strm.state;
  strm.total_in = strm.total_out = state.total = 0;
  strm.msg = ''; /*Z_NULL*/
  if (state.wrap) {       /* to support ill-conceived Java test suite */
    strm.adler = state.wrap & 1;
  }
  state.mode = HEAD;
  state.last = 0;
  state.havedict = 0;
  state.dmax = 32768;
  state.head = null/*Z_NULL*/;
  state.hold = 0;
  state.bits = 0;
  //state.lencode = state.distcode = state.next = state.codes;
  state.lencode = state.lendyn = new utils.Buf32(ENOUGH_LENS);
  state.distcode = state.distdyn = new utils.Buf32(ENOUGH_DISTS);

  state.sane = 1;
  state.back = -1;
  //Tracev((stderr, "inflate: reset\n"));
  return Z_OK;
}

function inflateReset(strm) {
  var state;

  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
  state = strm.state;
  state.wsize = 0;
  state.whave = 0;
  state.wnext = 0;
  return inflateResetKeep(strm);

}

function inflateReset2(strm, windowBits) {
  var wrap;
  var state;

  /* get the state */
  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
  state = strm.state;

  /* extract wrap request from windowBits parameter */
  if (windowBits < 0) {
    wrap = 0;
    windowBits = -windowBits;
  }
  else {
    wrap = (windowBits >> 4) + 1;
    if (windowBits < 48) {
      windowBits &= 15;
    }
  }

  /* set number of window bits, free window if different */
  if (windowBits && (windowBits < 8 || windowBits > 15)) {
    return Z_STREAM_ERROR;
  }
  if (state.window !== null && state.wbits !== windowBits) {
    state.window = null;
  }

  /* update state and reset the rest of it */
  state.wrap = wrap;
  state.wbits = windowBits;
  return inflateReset(strm);
}

function inflateInit2(strm, windowBits) {
  var ret;
  var state;

  if (!strm) { return Z_STREAM_ERROR; }
  //strm.msg = Z_NULL;                 /* in case we return an error */

  state = new InflateState();

  //if (state === Z_NULL) return Z_MEM_ERROR;
  //Tracev((stderr, "inflate: allocated\n"));
  strm.state = state;
  state.window = null/*Z_NULL*/;
  ret = inflateReset2(strm, windowBits);
  if (ret !== Z_OK) {
    strm.state = null/*Z_NULL*/;
  }
  return ret;
}

function inflateInit(strm) {
  return inflateInit2(strm, DEF_WBITS);
}


/*
 Return state with length and distance decoding tables and index sizes set to
 fixed code decoding.  Normally this returns fixed tables from inffixed.h.
 If BUILDFIXED is defined, then instead this routine builds the tables the
 first time it's called, and returns those tables the first time and
 thereafter.  This reduces the size of the code by about 2K bytes, in
 exchange for a little execution time.  However, BUILDFIXED should not be
 used for threaded applications, since the rewriting of the tables and virgin
 may not be thread-safe.
 */
var virgin = true;

var lenfix, distfix; // We have no pointers in JS, so keep tables separate

function fixedtables(state) {
  /* build fixed huffman tables if first call (may not be thread safe) */
  if (virgin) {
    var sym;

    lenfix = new utils.Buf32(512);
    distfix = new utils.Buf32(32);

    /* literal/length table */
    sym = 0;
    while (sym < 144) { state.lens[sym++] = 8; }
    while (sym < 256) { state.lens[sym++] = 9; }
    while (sym < 280) { state.lens[sym++] = 7; }
    while (sym < 288) { state.lens[sym++] = 8; }

    inflate_table(LENS,  state.lens, 0, 288, lenfix,   0, state.work, { bits: 9 });

    /* distance table */
    sym = 0;
    while (sym < 32) { state.lens[sym++] = 5; }

    inflate_table(DISTS, state.lens, 0, 32,   distfix, 0, state.work, { bits: 5 });

    /* do this just once */
    virgin = false;
  }

  state.lencode = lenfix;
  state.lenbits = 9;
  state.distcode = distfix;
  state.distbits = 5;
}


/*
 Update the window with the last wsize (normally 32K) bytes written before
 returning.  If window does not exist yet, create it.  This is only called
 when a window is already in use, or when output has been written during this
 inflate call, but the end of the deflate stream has not been reached yet.
 It is also called to create a window for dictionary data when a dictionary
 is loaded.

 Providing output buffers larger than 32K to inflate() should provide a speed
 advantage, since only the last 32K of output is copied to the sliding window
 upon return from inflate(), and since all distances after the first 32K of
 output will fall in the output data, making match copies simpler and faster.
 The advantage may be dependent on the size of the processor's data caches.
 */
function updatewindow(strm, src, end, copy) {
  var dist;
  var state = strm.state;

  /* if it hasn't been done already, allocate space for the window */
  if (state.window === null) {
    state.wsize = 1 << state.wbits;
    state.wnext = 0;
    state.whave = 0;

    state.window = new utils.Buf8(state.wsize);
  }

  /* copy state->wsize or less output bytes into the circular window */
  if (copy >= state.wsize) {
    utils.arraySet(state.window, src, end - state.wsize, state.wsize, 0);
    state.wnext = 0;
    state.whave = state.wsize;
  }
  else {
    dist = state.wsize - state.wnext;
    if (dist > copy) {
      dist = copy;
    }
    //zmemcpy(state->window + state->wnext, end - copy, dist);
    utils.arraySet(state.window, src, end - copy, dist, state.wnext);
    copy -= dist;
    if (copy) {
      //zmemcpy(state->window, end - copy, copy);
      utils.arraySet(state.window, src, end - copy, copy, 0);
      state.wnext = copy;
      state.whave = state.wsize;
    }
    else {
      state.wnext += dist;
      if (state.wnext === state.wsize) { state.wnext = 0; }
      if (state.whave < state.wsize) { state.whave += dist; }
    }
  }
  return 0;
}

function inflate(strm, flush) {
  var state;
  var input, output;          // input/output buffers
  var next;                   /* next input INDEX */
  var put;                    /* next output INDEX */
  var have, left;             /* available input and output */
  var hold;                   /* bit buffer */
  var bits;                   /* bits in bit buffer */
  var _in, _out;              /* save starting available input and output */
  var copy;                   /* number of stored or match bytes to copy */
  var from;                   /* where to copy match bytes from */
  var from_source;
  var here = 0;               /* current decoding table entry */
  var here_bits, here_op, here_val; // paked "here" denormalized (JS specific)
  //var last;                   /* parent table entry */
  var last_bits, last_op, last_val; // paked "last" denormalized (JS specific)
  var len;                    /* length to copy for repeats, bits to drop */
  var ret;                    /* return code */
  var hbuf = new utils.Buf8(4);    /* buffer for gzip header crc calculation */
  var opts;

  var n; // temporary var for NEED_BITS

  var order = /* permutation of code lengths */
    [ 16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15 ];


  if (!strm || !strm.state || !strm.output ||
      (!strm.input && strm.avail_in !== 0)) {
    return Z_STREAM_ERROR;
  }

  state = strm.state;
  if (state.mode === TYPE) { state.mode = TYPEDO; }    /* skip check */


  //--- LOAD() ---
  put = strm.next_out;
  output = strm.output;
  left = strm.avail_out;
  next = strm.next_in;
  input = strm.input;
  have = strm.avail_in;
  hold = state.hold;
  bits = state.bits;
  //---

  _in = have;
  _out = left;
  ret = Z_OK;

  inf_leave: // goto emulation
  for (;;) {
    switch (state.mode) {
    case HEAD:
      if (state.wrap === 0) {
        state.mode = TYPEDO;
        break;
      }
      //=== NEEDBITS(16);
      while (bits < 16) {
        if (have === 0) { break inf_leave; }
        have--;
        hold += input[next++] << bits;
        bits += 8;
      }
      //===//
      if ((state.wrap & 2) && hold === 0x8b1f) {  /* gzip header */
        state.check = 0/*crc32(0L, Z_NULL, 0)*/;
        //=== CRC2(state.check, hold);
        hbuf[0] = hold & 0xff;
        hbuf[1] = (hold >>> 8) & 0xff;
        state.check = crc32(state.check, hbuf, 2, 0);
        //===//

        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = FLAGS;
        break;
      }
      state.flags = 0;           /* expect zlib header */
      if (state.head) {
        state.head.done = false;
      }
      if (!(state.wrap & 1) ||   /* check if zlib header allowed */
        (((hold & 0xff)/*BITS(8)*/ << 8) + (hold >> 8)) % 31) {
        strm.msg = 'incorrect header check';
        state.mode = BAD;
        break;
      }
      if ((hold & 0x0f)/*BITS(4)*/ !== Z_DEFLATED) {
        strm.msg = 'unknown compression method';
        state.mode = BAD;
        break;
      }
      //--- DROPBITS(4) ---//
      hold >>>= 4;
      bits -= 4;
      //---//
      len = (hold & 0x0f)/*BITS(4)*/ + 8;
      if (state.wbits === 0) {
        state.wbits = len;
      }
      else if (len > state.wbits) {
        strm.msg = 'invalid window size';
        state.mode = BAD;
        break;
      }
      state.dmax = 1 << len;
      //Tracev((stderr, "inflate:   zlib header ok\n"));
      strm.adler = state.check = 1/*adler32(0L, Z_NULL, 0)*/;
      state.mode = hold & 0x200 ? DICTID : TYPE;
      //=== INITBITS();
      hold = 0;
      bits = 0;
      //===//
      break;
    case FLAGS:
      //=== NEEDBITS(16); */
      while (bits < 16) {
        if (have === 0) { break inf_leave; }
        have--;
        hold += input[next++] << bits;
        bits += 8;
      }
      //===//
      state.flags = hold;
      if ((state.flags & 0xff) !== Z_DEFLATED) {
        strm.msg = 'unknown compression method';
        state.mode = BAD;
        break;
      }
      if (state.flags & 0xe000) {
        strm.msg = 'unknown header flags set';
        state.mode = BAD;
        break;
      }
      if (state.head) {
        state.head.text = ((hold >> 8) & 1);
      }
      if (state.flags & 0x0200) {
        //=== CRC2(state.check, hold);
        hbuf[0] = hold & 0xff;
        hbuf[1] = (hold >>> 8) & 0xff;
        state.check = crc32(state.check, hbuf, 2, 0);
        //===//
      }
      //=== INITBITS();
      hold = 0;
      bits = 0;
      //===//
      state.mode = TIME;
      /* falls through */
    case TIME:
      //=== NEEDBITS(32); */
      while (bits < 32) {
        if (have === 0) { break inf_leave; }
        have--;
        hold += input[next++] << bits;
        bits += 8;
      }
      //===//
      if (state.head) {
        state.head.time = hold;
      }
      if (state.flags & 0x0200) {
        //=== CRC4(state.check, hold)
        hbuf[0] = hold & 0xff;
        hbuf[1] = (hold >>> 8) & 0xff;
        hbuf[2] = (hold >>> 16) & 0xff;
        hbuf[3] = (hold >>> 24) & 0xff;
        state.check = crc32(state.check, hbuf, 4, 0);
        //===
      }
      //=== INITBITS();
      hold = 0;
      bits = 0;
      //===//
      state.mode = OS;
      /* falls through */
    case OS:
      //=== NEEDBITS(16); */
      while (bits < 16) {
        if (have === 0) { break inf_leave; }
        have--;
        hold += input[next++] << bits;
        bits += 8;
      }
      //===//
      if (state.head) {
        state.head.xflags = (hold & 0xff);
        state.head.os = (hold >> 8);
      }
      if (state.flags & 0x0200) {
        //=== CRC2(state.check, hold);
        hbuf[0] = hold & 0xff;
        hbuf[1] = (hold >>> 8) & 0xff;
        state.check = crc32(state.check, hbuf, 2, 0);
        //===//
      }
      //=== INITBITS();
      hold = 0;
      bits = 0;
      //===//
      state.mode = EXLEN;
      /* falls through */
    case EXLEN:
      if (state.flags & 0x0400) {
        //=== NEEDBITS(16); */
        while (bits < 16) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.length = hold;
        if (state.head) {
          state.head.extra_len = hold;
        }
        if (state.flags & 0x0200) {
          //=== CRC2(state.check, hold);
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          state.check = crc32(state.check, hbuf, 2, 0);
          //===//
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
      }
      else if (state.head) {
        state.head.extra = null/*Z_NULL*/;
      }
      state.mode = EXTRA;
      /* falls through */
    case EXTRA:
      if (state.flags & 0x0400) {
        copy = state.length;
        if (copy > have) { copy = have; }
        if (copy) {
          if (state.head) {
            len = state.head.extra_len - state.length;
            if (!state.head.extra) {
              // Use untyped array for more conveniend processing later
              state.head.extra = new Array(state.head.extra_len);
            }
            utils.arraySet(
              state.head.extra,
              input,
              next,
              // extra field is limited to 65536 bytes
              // - no need for additional size check
              copy,
              /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
              len
            );
            //zmemcpy(state.head.extra + len, next,
            //        len + copy > state.head.extra_max ?
            //        state.head.extra_max - len : copy);
          }
          if (state.flags & 0x0200) {
            state.check = crc32(state.check, input, copy, next);
          }
          have -= copy;
          next += copy;
          state.length -= copy;
        }
        if (state.length) { break inf_leave; }
      }
      state.length = 0;
      state.mode = NAME;
      /* falls through */
    case NAME:
      if (state.flags & 0x0800) {
        if (have === 0) { break inf_leave; }
        copy = 0;
        do {
          // TODO: 2 or 1 bytes?
          len = input[next + copy++];
          /* use constant limit because in js we should not preallocate memory */
          if (state.head && len &&
              (state.length < 65536 /*state.head.name_max*/)) {
            state.head.name += String.fromCharCode(len);
          }
        } while (len && copy < have);

        if (state.flags & 0x0200) {
          state.check = crc32(state.check, input, copy, next);
        }
        have -= copy;
        next += copy;
        if (len) { break inf_leave; }
      }
      else if (state.head) {
        state.head.name = null;
      }
      state.length = 0;
      state.mode = COMMENT;
      /* falls through */
    case COMMENT:
      if (state.flags & 0x1000) {
        if (have === 0) { break inf_leave; }
        copy = 0;
        do {
          len = input[next + copy++];
          /* use constant limit because in js we should not preallocate memory */
          if (state.head && len &&
              (state.length < 65536 /*state.head.comm_max*/)) {
            state.head.comment += String.fromCharCode(len);
          }
        } while (len && copy < have);
        if (state.flags & 0x0200) {
          state.check = crc32(state.check, input, copy, next);
        }
        have -= copy;
        next += copy;
        if (len) { break inf_leave; }
      }
      else if (state.head) {
        state.head.comment = null;
      }
      state.mode = HCRC;
      /* falls through */
    case HCRC:
      if (state.flags & 0x0200) {
        //=== NEEDBITS(16); */
        while (bits < 16) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if (hold !== (state.check & 0xffff)) {
          strm.msg = 'header crc mismatch';
          state.mode = BAD;
          break;
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
      }
      if (state.head) {
        state.head.hcrc = ((state.flags >> 9) & 1);
        state.head.done = true;
      }
      strm.adler = state.check = 0;
      state.mode = TYPE;
      break;
    case DICTID:
      //=== NEEDBITS(32); */
      while (bits < 32) {
        if (have === 0) { break inf_leave; }
        have--;
        hold += input[next++] << bits;
        bits += 8;
      }
      //===//
      strm.adler = state.check = zswap32(hold);
      //=== INITBITS();
      hold = 0;
      bits = 0;
      //===//
      state.mode = DICT;
      /* falls through */
    case DICT:
      if (state.havedict === 0) {
        //--- RESTORE() ---
        strm.next_out = put;
        strm.avail_out = left;
        strm.next_in = next;
        strm.avail_in = have;
        state.hold = hold;
        state.bits = bits;
        //---
        return Z_NEED_DICT;
      }
      strm.adler = state.check = 1/*adler32(0L, Z_NULL, 0)*/;
      state.mode = TYPE;
      /* falls through */
    case TYPE:
      if (flush === Z_BLOCK || flush === Z_TREES) { break inf_leave; }
      /* falls through */
    case TYPEDO:
      if (state.last) {
        //--- BYTEBITS() ---//
        hold >>>= bits & 7;
        bits -= bits & 7;
        //---//
        state.mode = CHECK;
        break;
      }
      //=== NEEDBITS(3); */
      while (bits < 3) {
        if (have === 0) { break inf_leave; }
        have--;
        hold += input[next++] << bits;
        bits += 8;
      }
      //===//
      state.last = (hold & 0x01)/*BITS(1)*/;
      //--- DROPBITS(1) ---//
      hold >>>= 1;
      bits -= 1;
      //---//

      switch ((hold & 0x03)/*BITS(2)*/) {
      case 0:                             /* stored block */
        //Tracev((stderr, "inflate:     stored block%s\n",
        //        state.last ? " (last)" : ""));
        state.mode = STORED;
        break;
      case 1:                             /* fixed block */
        fixedtables(state);
        //Tracev((stderr, "inflate:     fixed codes block%s\n",
        //        state.last ? " (last)" : ""));
        state.mode = LEN_;             /* decode codes */
        if (flush === Z_TREES) {
          //--- DROPBITS(2) ---//
          hold >>>= 2;
          bits -= 2;
          //---//
          break inf_leave;
        }
        break;
      case 2:                             /* dynamic block */
        //Tracev((stderr, "inflate:     dynamic codes block%s\n",
        //        state.last ? " (last)" : ""));
        state.mode = TABLE;
        break;
      case 3:
        strm.msg = 'invalid block type';
        state.mode = BAD;
      }
      //--- DROPBITS(2) ---//
      hold >>>= 2;
      bits -= 2;
      //---//
      break;
    case STORED:
      //--- BYTEBITS() ---// /* go to byte boundary */
      hold >>>= bits & 7;
      bits -= bits & 7;
      //---//
      //=== NEEDBITS(32); */
      while (bits < 32) {
        if (have === 0) { break inf_leave; }
        have--;
        hold += input[next++] << bits;
        bits += 8;
      }
      //===//
      if ((hold & 0xffff) !== ((hold >>> 16) ^ 0xffff)) {
        strm.msg = 'invalid stored block lengths';
        state.mode = BAD;
        break;
      }
      state.length = hold & 0xffff;
      //Tracev((stderr, "inflate:       stored length %u\n",
      //        state.length));
      //=== INITBITS();
      hold = 0;
      bits = 0;
      //===//
      state.mode = COPY_;
      if (flush === Z_TREES) { break inf_leave; }
      /* falls through */
    case COPY_:
      state.mode = COPY;
      /* falls through */
    case COPY:
      copy = state.length;
      if (copy) {
        if (copy > have) { copy = have; }
        if (copy > left) { copy = left; }
        if (copy === 0) { break inf_leave; }
        //--- zmemcpy(put, next, copy); ---
        utils.arraySet(output, input, next, copy, put);
        //---//
        have -= copy;
        next += copy;
        left -= copy;
        put += copy;
        state.length -= copy;
        break;
      }
      //Tracev((stderr, "inflate:       stored end\n"));
      state.mode = TYPE;
      break;
    case TABLE:
      //=== NEEDBITS(14); */
      while (bits < 14) {
        if (have === 0) { break inf_leave; }
        have--;
        hold += input[next++] << bits;
        bits += 8;
      }
      //===//
      state.nlen = (hold & 0x1f)/*BITS(5)*/ + 257;
      //--- DROPBITS(5) ---//
      hold >>>= 5;
      bits -= 5;
      //---//
      state.ndist = (hold & 0x1f)/*BITS(5)*/ + 1;
      //--- DROPBITS(5) ---//
      hold >>>= 5;
      bits -= 5;
      //---//
      state.ncode = (hold & 0x0f)/*BITS(4)*/ + 4;
      //--- DROPBITS(4) ---//
      hold >>>= 4;
      bits -= 4;
      //---//
//#ifndef PKZIP_BUG_WORKAROUND
      if (state.nlen > 286 || state.ndist > 30) {
        strm.msg = 'too many length or distance symbols';
        state.mode = BAD;
        break;
      }
//#endif
      //Tracev((stderr, "inflate:       table sizes ok\n"));
      state.have = 0;
      state.mode = LENLENS;
      /* falls through */
    case LENLENS:
      while (state.have < state.ncode) {
        //=== NEEDBITS(3);
        while (bits < 3) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.lens[order[state.have++]] = (hold & 0x07);//BITS(3);
        //--- DROPBITS(3) ---//
        hold >>>= 3;
        bits -= 3;
        //---//
      }
      while (state.have < 19) {
        state.lens[order[state.have++]] = 0;
      }
      // We have separate tables & no pointers. 2 commented lines below not needed.
      //state.next = state.codes;
      //state.lencode = state.next;
      // Switch to use dynamic table
      state.lencode = state.lendyn;
      state.lenbits = 7;

      opts = { bits: state.lenbits };
      ret = inflate_table(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
      state.lenbits = opts.bits;

      if (ret) {
        strm.msg = 'invalid code lengths set';
        state.mode = BAD;
        break;
      }
      //Tracev((stderr, "inflate:       code lengths ok\n"));
      state.have = 0;
      state.mode = CODELENS;
      /* falls through */
    case CODELENS:
      while (state.have < state.nlen + state.ndist) {
        for (;;) {
          here = state.lencode[hold & ((1 << state.lenbits) - 1)];/*BITS(state.lenbits)*/
          here_bits = here >>> 24;
          here_op = (here >>> 16) & 0xff;
          here_val = here & 0xffff;

          if ((here_bits) <= bits) { break; }
          //--- PULLBYTE() ---//
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
          //---//
        }
        if (here_val < 16) {
          //--- DROPBITS(here.bits) ---//
          hold >>>= here_bits;
          bits -= here_bits;
          //---//
          state.lens[state.have++] = here_val;
        }
        else {
          if (here_val === 16) {
            //=== NEEDBITS(here.bits + 2);
            n = here_bits + 2;
            while (bits < n) {
              if (have === 0) { break inf_leave; }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            //===//
            //--- DROPBITS(here.bits) ---//
            hold >>>= here_bits;
            bits -= here_bits;
            //---//
            if (state.have === 0) {
              strm.msg = 'invalid bit length repeat';
              state.mode = BAD;
              break;
            }
            len = state.lens[state.have - 1];
            copy = 3 + (hold & 0x03);//BITS(2);
            //--- DROPBITS(2) ---//
            hold >>>= 2;
            bits -= 2;
            //---//
          }
          else if (here_val === 17) {
            //=== NEEDBITS(here.bits + 3);
            n = here_bits + 3;
            while (bits < n) {
              if (have === 0) { break inf_leave; }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            //===//
            //--- DROPBITS(here.bits) ---//
            hold >>>= here_bits;
            bits -= here_bits;
            //---//
            len = 0;
            copy = 3 + (hold & 0x07);//BITS(3);
            //--- DROPBITS(3) ---//
            hold >>>= 3;
            bits -= 3;
            //---//
          }
          else {
            //=== NEEDBITS(here.bits + 7);
            n = here_bits + 7;
            while (bits < n) {
              if (have === 0) { break inf_leave; }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            //===//
            //--- DROPBITS(here.bits) ---//
            hold >>>= here_bits;
            bits -= here_bits;
            //---//
            len = 0;
            copy = 11 + (hold & 0x7f);//BITS(7);
            //--- DROPBITS(7) ---//
            hold >>>= 7;
            bits -= 7;
            //---//
          }
          if (state.have + copy > state.nlen + state.ndist) {
            strm.msg = 'invalid bit length repeat';
            state.mode = BAD;
            break;
          }
          while (copy--) {
            state.lens[state.have++] = len;
          }
        }
      }

      /* handle error breaks in while */
      if (state.mode === BAD) { break; }

      /* check for end-of-block code (better have one) */
      if (state.lens[256] === 0) {
        strm.msg = 'invalid code -- missing end-of-block';
        state.mode = BAD;
        break;
      }

      /* build code tables -- note: do not change the lenbits or distbits
         values here (9 and 6) without reading the comments in inftrees.h
         concerning the ENOUGH constants, which depend on those values */
      state.lenbits = 9;

      opts = { bits: state.lenbits };
      ret = inflate_table(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
      // We have separate tables & no pointers. 2 commented lines below not needed.
      // state.next_index = opts.table_index;
      state.lenbits = opts.bits;
      // state.lencode = state.next;

      if (ret) {
        strm.msg = 'invalid literal/lengths set';
        state.mode = BAD;
        break;
      }

      state.distbits = 6;
      //state.distcode.copy(state.codes);
      // Switch to use dynamic table
      state.distcode = state.distdyn;
      opts = { bits: state.distbits };
      ret = inflate_table(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
      // We have separate tables & no pointers. 2 commented lines below not needed.
      // state.next_index = opts.table_index;
      state.distbits = opts.bits;
      // state.distcode = state.next;

      if (ret) {
        strm.msg = 'invalid distances set';
        state.mode = BAD;
        break;
      }
      //Tracev((stderr, 'inflate:       codes ok\n'));
      state.mode = LEN_;
      if (flush === Z_TREES) { break inf_leave; }
      /* falls through */
    case LEN_:
      state.mode = LEN;
      /* falls through */
    case LEN:
      if (have >= 6 && left >= 258) {
        //--- RESTORE() ---
        strm.next_out = put;
        strm.avail_out = left;
        strm.next_in = next;
        strm.avail_in = have;
        state.hold = hold;
        state.bits = bits;
        //---
        inflate_fast(strm, _out);
        //--- LOAD() ---
        put = strm.next_out;
        output = strm.output;
        left = strm.avail_out;
        next = strm.next_in;
        input = strm.input;
        have = strm.avail_in;
        hold = state.hold;
        bits = state.bits;
        //---

        if (state.mode === TYPE) {
          state.back = -1;
        }
        break;
      }
      state.back = 0;
      for (;;) {
        here = state.lencode[hold & ((1 << state.lenbits) - 1)];  /*BITS(state.lenbits)*/
        here_bits = here >>> 24;
        here_op = (here >>> 16) & 0xff;
        here_val = here & 0xffff;

        if (here_bits <= bits) { break; }
        //--- PULLBYTE() ---//
        if (have === 0) { break inf_leave; }
        have--;
        hold += input[next++] << bits;
        bits += 8;
        //---//
      }
      if (here_op && (here_op & 0xf0) === 0) {
        last_bits = here_bits;
        last_op = here_op;
        last_val = here_val;
        for (;;) {
          here = state.lencode[last_val +
                  ((hold & ((1 << (last_bits + last_op)) - 1))/*BITS(last.bits + last.op)*/ >> last_bits)];
          here_bits = here >>> 24;
          here_op = (here >>> 16) & 0xff;
          here_val = here & 0xffff;

          if ((last_bits + here_bits) <= bits) { break; }
          //--- PULLBYTE() ---//
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
          //---//
        }
        //--- DROPBITS(last.bits) ---//
        hold >>>= last_bits;
        bits -= last_bits;
        //---//
        state.back += last_bits;
      }
      //--- DROPBITS(here.bits) ---//
      hold >>>= here_bits;
      bits -= here_bits;
      //---//
      state.back += here_bits;
      state.length = here_val;
      if (here_op === 0) {
        //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
        //        "inflate:         literal '%c'\n" :
        //        "inflate:         literal 0x%02x\n", here.val));
        state.mode = LIT;
        break;
      }
      if (here_op & 32) {
        //Tracevv((stderr, "inflate:         end of block\n"));
        state.back = -1;
        state.mode = TYPE;
        break;
      }
      if (here_op & 64) {
        strm.msg = 'invalid literal/length code';
        state.mode = BAD;
        break;
      }
      state.extra = here_op & 15;
      state.mode = LENEXT;
      /* falls through */
    case LENEXT:
      if (state.extra) {
        //=== NEEDBITS(state.extra);
        n = state.extra;
        while (bits < n) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.length += hold & ((1 << state.extra) - 1)/*BITS(state.extra)*/;
        //--- DROPBITS(state.extra) ---//
        hold >>>= state.extra;
        bits -= state.extra;
        //---//
        state.back += state.extra;
      }
      //Tracevv((stderr, "inflate:         length %u\n", state.length));
      state.was = state.length;
      state.mode = DIST;
      /* falls through */
    case DIST:
      for (;;) {
        here = state.distcode[hold & ((1 << state.distbits) - 1)];/*BITS(state.distbits)*/
        here_bits = here >>> 24;
        here_op = (here >>> 16) & 0xff;
        here_val = here & 0xffff;

        if ((here_bits) <= bits) { break; }
        //--- PULLBYTE() ---//
        if (have === 0) { break inf_leave; }
        have--;
        hold += input[next++] << bits;
        bits += 8;
        //---//
      }
      if ((here_op & 0xf0) === 0) {
        last_bits = here_bits;
        last_op = here_op;
        last_val = here_val;
        for (;;) {
          here = state.distcode[last_val +
                  ((hold & ((1 << (last_bits + last_op)) - 1))/*BITS(last.bits + last.op)*/ >> last_bits)];
          here_bits = here >>> 24;
          here_op = (here >>> 16) & 0xff;
          here_val = here & 0xffff;

          if ((last_bits + here_bits) <= bits) { break; }
          //--- PULLBYTE() ---//
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
          //---//
        }
        //--- DROPBITS(last.bits) ---//
        hold >>>= last_bits;
        bits -= last_bits;
        //---//
        state.back += last_bits;
      }
      //--- DROPBITS(here.bits) ---//
      hold >>>= here_bits;
      bits -= here_bits;
      //---//
      state.back += here_bits;
      if (here_op & 64) {
        strm.msg = 'invalid distance code';
        state.mode = BAD;
        break;
      }
      state.offset = here_val;
      state.extra = (here_op) & 15;
      state.mode = DISTEXT;
      /* falls through */
    case DISTEXT:
      if (state.extra) {
        //=== NEEDBITS(state.extra);
        n = state.extra;
        while (bits < n) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.offset += hold & ((1 << state.extra) - 1)/*BITS(state.extra)*/;
        //--- DROPBITS(state.extra) ---//
        hold >>>= state.extra;
        bits -= state.extra;
        //---//
        state.back += state.extra;
      }
//#ifdef INFLATE_STRICT
      if (state.offset > state.dmax) {
        strm.msg = 'invalid distance too far back';
        state.mode = BAD;
        break;
      }
//#endif
      //Tracevv((stderr, "inflate:         distance %u\n", state.offset));
      state.mode = MATCH;
      /* falls through */
    case MATCH:
      if (left === 0) { break inf_leave; }
      copy = _out - left;
      if (state.offset > copy) {         /* copy from window */
        copy = state.offset - copy;
        if (copy > state.whave) {
          if (state.sane) {
            strm.msg = 'invalid distance too far back';
            state.mode = BAD;
            break;
          }
// (!) This block is disabled in zlib defailts,
// don't enable it for binary compatibility
//#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
//          Trace((stderr, "inflate.c too far\n"));
//          copy -= state.whave;
//          if (copy > state.length) { copy = state.length; }
//          if (copy > left) { copy = left; }
//          left -= copy;
//          state.length -= copy;
//          do {
//            output[put++] = 0;
//          } while (--copy);
//          if (state.length === 0) { state.mode = LEN; }
//          break;
//#endif
        }
        if (copy > state.wnext) {
          copy -= state.wnext;
          from = state.wsize - copy;
        }
        else {
          from = state.wnext - copy;
        }
        if (copy > state.length) { copy = state.length; }
        from_source = state.window;
      }
      else {                              /* copy from output */
        from_source = output;
        from = put - state.offset;
        copy = state.length;
      }
      if (copy > left) { copy = left; }
      left -= copy;
      state.length -= copy;
      do {
        output[put++] = from_source[from++];
      } while (--copy);
      if (state.length === 0) { state.mode = LEN; }
      break;
    case LIT:
      if (left === 0) { break inf_leave; }
      output[put++] = state.length;
      left--;
      state.mode = LEN;
      break;
    case CHECK:
      if (state.wrap) {
        //=== NEEDBITS(32);
        while (bits < 32) {
          if (have === 0) { break inf_leave; }
          have--;
          // Use '|' insdead of '+' to make sure that result is signed
          hold |= input[next++] << bits;
          bits += 8;
        }
        //===//
        _out -= left;
        strm.total_out += _out;
        state.total += _out;
        if (_out) {
          strm.adler = state.check =
              /*UPDATE(state.check, put - _out, _out);*/
              (state.flags ? crc32(state.check, output, _out, put - _out) : adler32(state.check, output, _out, put - _out));

        }
        _out = left;
        // NB: crc32 stored as signed 32-bit int, zswap32 returns signed too
        if ((state.flags ? hold : zswap32(hold)) !== state.check) {
          strm.msg = 'incorrect data check';
          state.mode = BAD;
          break;
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        //Tracev((stderr, "inflate:   check matches trailer\n"));
      }
      state.mode = LENGTH;
      /* falls through */
    case LENGTH:
      if (state.wrap && state.flags) {
        //=== NEEDBITS(32);
        while (bits < 32) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if (hold !== (state.total & 0xffffffff)) {
          strm.msg = 'incorrect length check';
          state.mode = BAD;
          break;
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        //Tracev((stderr, "inflate:   length matches trailer\n"));
      }
      state.mode = DONE;
      /* falls through */
    case DONE:
      ret = Z_STREAM_END;
      break inf_leave;
    case BAD:
      ret = Z_DATA_ERROR;
      break inf_leave;
    case MEM:
      return Z_MEM_ERROR;
    case SYNC:
      /* falls through */
    default:
      return Z_STREAM_ERROR;
    }
  }

  // inf_leave <- here is real place for "goto inf_leave", emulated via "break inf_leave"

  /*
     Return from inflate(), updating the total counts and the check value.
     If there was no progress during the inflate() call, return a buffer
     error.  Call updatewindow() to create and/or update the window state.
     Note: a memory error from inflate() is non-recoverable.
   */

  //--- RESTORE() ---
  strm.next_out = put;
  strm.avail_out = left;
  strm.next_in = next;
  strm.avail_in = have;
  state.hold = hold;
  state.bits = bits;
  //---

  if (state.wsize || (_out !== strm.avail_out && state.mode < BAD &&
                      (state.mode < CHECK || flush !== Z_FINISH))) {
    if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) {
      state.mode = MEM;
      return Z_MEM_ERROR;
    }
  }
  _in -= strm.avail_in;
  _out -= strm.avail_out;
  strm.total_in += _in;
  strm.total_out += _out;
  state.total += _out;
  if (state.wrap && _out) {
    strm.adler = state.check = /*UPDATE(state.check, strm.next_out - _out, _out);*/
      (state.flags ? crc32(state.check, output, _out, strm.next_out - _out) : adler32(state.check, output, _out, strm.next_out - _out));
  }
  strm.data_type = state.bits + (state.last ? 64 : 0) +
                    (state.mode === TYPE ? 128 : 0) +
                    (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
  if (((_in === 0 && _out === 0) || flush === Z_FINISH) && ret === Z_OK) {
    ret = Z_BUF_ERROR;
  }
  return ret;
}

function inflateEnd(strm) {

  if (!strm || !strm.state /*|| strm->zfree == (free_func)0*/) {
    return Z_STREAM_ERROR;
  }

  var state = strm.state;
  if (state.window) {
    state.window = null;
  }
  strm.state = null;
  return Z_OK;
}

function inflateGetHeader(strm, head) {
  var state;

  /* check state */
  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
  state = strm.state;
  if ((state.wrap & 2) === 0) { return Z_STREAM_ERROR; }

  /* save header structure */
  state.head = head;
  head.done = false;
  return Z_OK;
}

function inflateSetDictionary(strm, dictionary) {
  var dictLength = dictionary.length;

  var state;
  var dictid;
  var ret;

  /* check state */
  if (!strm /* == Z_NULL */ || !strm.state /* == Z_NULL */) { return Z_STREAM_ERROR; }
  state = strm.state;

  if (state.wrap !== 0 && state.mode !== DICT) {
    return Z_STREAM_ERROR;
  }

  /* check for correct dictionary identifier */
  if (state.mode === DICT) {
    dictid = 1; /* adler32(0, null, 0)*/
    /* dictid = adler32(dictid, dictionary, dictLength); */
    dictid = adler32(dictid, dictionary, dictLength, 0);
    if (dictid !== state.check) {
      return Z_DATA_ERROR;
    }
  }
  /* copy dictionary to window using updatewindow(), which will amend the
   existing dictionary if appropriate */
  ret = updatewindow(strm, dictionary, dictLength, dictLength);
  if (ret) {
    state.mode = MEM;
    return Z_MEM_ERROR;
  }
  state.havedict = 1;
  // Tracev((stderr, "inflate:   dictionary set\n"));
  return Z_OK;
}

exports.inflateReset = inflateReset;
exports.inflateReset2 = inflateReset2;
exports.inflateResetKeep = inflateResetKeep;
exports.inflateInit = inflateInit;
exports.inflateInit2 = inflateInit2;
exports.inflate = inflate;
exports.inflateEnd = inflateEnd;
exports.inflateGetHeader = inflateGetHeader;
exports.inflateSetDictionary = inflateSetDictionary;
exports.inflateInfo = 'pako inflate (from Nodeca project)';

/* Not implemented
exports.inflateCopy = inflateCopy;
exports.inflateGetDictionary = inflateGetDictionary;
exports.inflateMark = inflateMark;
exports.inflatePrime = inflatePrime;
exports.inflateSync = inflateSync;
exports.inflateSyncPoint = inflateSyncPoint;
exports.inflateUndermine = inflateUndermine;
*/


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



var utils = __webpack_require__(1);

var MAXBITS = 15;
var ENOUGH_LENS = 852;
var ENOUGH_DISTS = 592;
//var ENOUGH = (ENOUGH_LENS+ENOUGH_DISTS);

var CODES = 0;
var LENS = 1;
var DISTS = 2;

var lbase = [ /* Length codes 257..285 base */
  3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31,
  35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0
];

var lext = [ /* Length codes 257..285 extra */
  16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18,
  19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78
];

var dbase = [ /* Distance codes 0..29 base */
  1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193,
  257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145,
  8193, 12289, 16385, 24577, 0, 0
];

var dext = [ /* Distance codes 0..29 extra */
  16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22,
  23, 23, 24, 24, 25, 25, 26, 26, 27, 27,
  28, 28, 29, 29, 64, 64
];

module.exports = function inflate_table(type, lens, lens_index, codes, table, table_index, work, opts)
{
  var bits = opts.bits;
      //here = opts.here; /* table entry for duplication */

  var len = 0;               /* a code's length in bits */
  var sym = 0;               /* index of code symbols */
  var min = 0, max = 0;          /* minimum and maximum code lengths */
  var root = 0;              /* number of index bits for root table */
  var curr = 0;              /* number of index bits for current table */
  var drop = 0;              /* code bits to drop for sub-table */
  var left = 0;                   /* number of prefix codes available */
  var used = 0;              /* code entries in table used */
  var huff = 0;              /* Huffman code */
  var incr;              /* for incrementing code, index */
  var fill;              /* index for replicating entries */
  var low;               /* low bits for current root entry */
  var mask;              /* mask for low root bits */
  var next;             /* next available space in table */
  var base = null;     /* base value table to use */
  var base_index = 0;
//  var shoextra;    /* extra bits table to use */
  var end;                    /* use base and extra for symbol > end */
  var count = new utils.Buf16(MAXBITS + 1); //[MAXBITS+1];    /* number of codes of each length */
  var offs = new utils.Buf16(MAXBITS + 1); //[MAXBITS+1];     /* offsets in table for each length */
  var extra = null;
  var extra_index = 0;

  var here_bits, here_op, here_val;

  /*
   Process a set of code lengths to create a canonical Huffman code.  The
   code lengths are lens[0..codes-1].  Each length corresponds to the
   symbols 0..codes-1.  The Huffman code is generated by first sorting the
   symbols by length from short to long, and retaining the symbol order
   for codes with equal lengths.  Then the code starts with all zero bits
   for the first code of the shortest length, and the codes are integer
   increments for the same length, and zeros are appended as the length
   increases.  For the deflate format, these bits are stored backwards
   from their more natural integer increment ordering, and so when the
   decoding tables are built in the large loop below, the integer codes
   are incremented backwards.

   This routine assumes, but does not check, that all of the entries in
   lens[] are in the range 0..MAXBITS.  The caller must assure this.
   1..MAXBITS is interpreted as that code length.  zero means that that
   symbol does not occur in this code.

   The codes are sorted by computing a count of codes for each length,
   creating from that a table of starting indices for each length in the
   sorted table, and then entering the symbols in order in the sorted
   table.  The sorted table is work[], with that space being provided by
   the caller.

   The length counts are used for other purposes as well, i.e. finding
   the minimum and maximum length codes, determining if there are any
   codes at all, checking for a valid set of lengths, and looking ahead
   at length counts to determine sub-table sizes when building the
   decoding tables.
   */

  /* accumulate lengths for codes (assumes lens[] all in 0..MAXBITS) */
  for (len = 0; len <= MAXBITS; len++) {
    count[len] = 0;
  }
  for (sym = 0; sym < codes; sym++) {
    count[lens[lens_index + sym]]++;
  }

  /* bound code lengths, force root to be within code lengths */
  root = bits;
  for (max = MAXBITS; max >= 1; max--) {
    if (count[max] !== 0) { break; }
  }
  if (root > max) {
    root = max;
  }
  if (max === 0) {                     /* no symbols to code at all */
    //table.op[opts.table_index] = 64;  //here.op = (var char)64;    /* invalid code marker */
    //table.bits[opts.table_index] = 1;   //here.bits = (var char)1;
    //table.val[opts.table_index++] = 0;   //here.val = (var short)0;
    table[table_index++] = (1 << 24) | (64 << 16) | 0;


    //table.op[opts.table_index] = 64;
    //table.bits[opts.table_index] = 1;
    //table.val[opts.table_index++] = 0;
    table[table_index++] = (1 << 24) | (64 << 16) | 0;

    opts.bits = 1;
    return 0;     /* no symbols, but wait for decoding to report error */
  }
  for (min = 1; min < max; min++) {
    if (count[min] !== 0) { break; }
  }
  if (root < min) {
    root = min;
  }

  /* check for an over-subscribed or incomplete set of lengths */
  left = 1;
  for (len = 1; len <= MAXBITS; len++) {
    left <<= 1;
    left -= count[len];
    if (left < 0) {
      return -1;
    }        /* over-subscribed */
  }
  if (left > 0 && (type === CODES || max !== 1)) {
    return -1;                      /* incomplete set */
  }

  /* generate offsets into symbol table for each length for sorting */
  offs[1] = 0;
  for (len = 1; len < MAXBITS; len++) {
    offs[len + 1] = offs[len] + count[len];
  }

  /* sort symbols by length, by symbol order within each length */
  for (sym = 0; sym < codes; sym++) {
    if (lens[lens_index + sym] !== 0) {
      work[offs[lens[lens_index + sym]]++] = sym;
    }
  }

  /*
   Create and fill in decoding tables.  In this loop, the table being
   filled is at next and has curr index bits.  The code being used is huff
   with length len.  That code is converted to an index by dropping drop
   bits off of the bottom.  For codes where len is less than drop + curr,
   those top drop + curr - len bits are incremented through all values to
   fill the table with replicated entries.

   root is the number of index bits for the root table.  When len exceeds
   root, sub-tables are created pointed to by the root entry with an index
   of the low root bits of huff.  This is saved in low to check for when a
   new sub-table should be started.  drop is zero when the root table is
   being filled, and drop is root when sub-tables are being filled.

   When a new sub-table is needed, it is necessary to look ahead in the
   code lengths to determine what size sub-table is needed.  The length
   counts are used for this, and so count[] is decremented as codes are
   entered in the tables.

   used keeps track of how many table entries have been allocated from the
   provided *table space.  It is checked for LENS and DIST tables against
   the constants ENOUGH_LENS and ENOUGH_DISTS to guard against changes in
   the initial root table size constants.  See the comments in inftrees.h
   for more information.

   sym increments through all symbols, and the loop terminates when
   all codes of length max, i.e. all codes, have been processed.  This
   routine permits incomplete codes, so another loop after this one fills
   in the rest of the decoding tables with invalid code markers.
   */

  /* set up for code type */
  // poor man optimization - use if-else instead of switch,
  // to avoid deopts in old v8
  if (type === CODES) {
    base = extra = work;    /* dummy value--not used */
    end = 19;

  } else if (type === LENS) {
    base = lbase;
    base_index -= 257;
    extra = lext;
    extra_index -= 257;
    end = 256;

  } else {                    /* DISTS */
    base = dbase;
    extra = dext;
    end = -1;
  }

  /* initialize opts for loop */
  huff = 0;                   /* starting code */
  sym = 0;                    /* starting code symbol */
  len = min;                  /* starting code length */
  next = table_index;              /* current table to fill in */
  curr = root;                /* current table index bits */
  drop = 0;                   /* current bits to drop from code for index */
  low = -1;                   /* trigger new sub-table when len > root */
  used = 1 << root;          /* use root table entries */
  mask = used - 1;            /* mask for comparing low */

  /* check available table space */
  if ((type === LENS && used > ENOUGH_LENS) ||
    (type === DISTS && used > ENOUGH_DISTS)) {
    return 1;
  }

  /* process all codes and make table entries */
  for (;;) {
    /* create table entry */
    here_bits = len - drop;
    if (work[sym] < end) {
      here_op = 0;
      here_val = work[sym];
    }
    else if (work[sym] > end) {
      here_op = extra[extra_index + work[sym]];
      here_val = base[base_index + work[sym]];
    }
    else {
      here_op = 32 + 64;         /* end of block */
      here_val = 0;
    }

    /* replicate for those indices with low len bits equal to huff */
    incr = 1 << (len - drop);
    fill = 1 << curr;
    min = fill;                 /* save offset to next table */
    do {
      fill -= incr;
      table[next + (huff >> drop) + fill] = (here_bits << 24) | (here_op << 16) | here_val |0;
    } while (fill !== 0);

    /* backwards increment the len-bit code huff */
    incr = 1 << (len - 1);
    while (huff & incr) {
      incr >>= 1;
    }
    if (incr !== 0) {
      huff &= incr - 1;
      huff += incr;
    } else {
      huff = 0;
    }

    /* go to next symbol, update count, len */
    sym++;
    if (--count[len] === 0) {
      if (len === max) { break; }
      len = lens[lens_index + work[sym]];
    }

    /* create new sub-table if needed */
    if (len > root && (huff & mask) !== low) {
      /* if first time, transition to sub-tables */
      if (drop === 0) {
        drop = root;
      }

      /* increment past last table */
      next += min;            /* here min is 1 << curr */

      /* determine length of next table */
      curr = len - drop;
      left = 1 << curr;
      while (curr + drop < max) {
        left -= count[curr + drop];
        if (left <= 0) { break; }
        curr++;
        left <<= 1;
      }

      /* check for enough space */
      used += 1 << curr;
      if ((type === LENS && used > ENOUGH_LENS) ||
        (type === DISTS && used > ENOUGH_DISTS)) {
        return 1;
      }

      /* point entry in root table to sub-table */
      low = huff & mask;
      /*table.op[low] = curr;
      table.bits[low] = root;
      table.val[low] = next - opts.table_index;*/
      table[low] = (root << 24) | (curr << 16) | (next - table_index) |0;
    }
  }

  /* fill in remaining table entry if code is incomplete (guaranteed to have
   at most one remaining entry, since if the code is incomplete, the
   maximum code length that was allowed to get this far is one bit) */
  if (huff !== 0) {
    //table.op[next + huff] = 64;            /* invalid code marker */
    //table.bits[next + huff] = len - drop;
    //table.val[next + huff] = 0;
    table[next + huff] = ((len - drop) << 24) | (64 << 16) |0;
  }

  /* set return parameters */
  //opts.table_index += used;
  opts.bits = root;
  return 0;
};


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



var utils = __webpack_require__(1);

/* Public constants ==========================================================*/
/* ===========================================================================*/


//var Z_FILTERED          = 1;
//var Z_HUFFMAN_ONLY      = 2;
//var Z_RLE               = 3;
var Z_FIXED               = 4;
//var Z_DEFAULT_STRATEGY  = 0;

/* Possible values of the data_type field (though see inflate()) */
var Z_BINARY              = 0;
var Z_TEXT                = 1;
//var Z_ASCII             = 1; // = Z_TEXT
var Z_UNKNOWN             = 2;

/*============================================================================*/


function zero(buf) { var len = buf.length; while (--len >= 0) { buf[len] = 0; } }

// From zutil.h

var STORED_BLOCK = 0;
var STATIC_TREES = 1;
var DYN_TREES    = 2;
/* The three kinds of block type */

var MIN_MATCH    = 3;
var MAX_MATCH    = 258;
/* The minimum and maximum match lengths */

// From deflate.h
/* ===========================================================================
 * Internal compression state.
 */

var LENGTH_CODES  = 29;
/* number of length codes, not counting the special END_BLOCK code */

var LITERALS      = 256;
/* number of literal bytes 0..255 */

var L_CODES       = LITERALS + 1 + LENGTH_CODES;
/* number of Literal or Length codes, including the END_BLOCK code */

var D_CODES       = 30;
/* number of distance codes */

var BL_CODES      = 19;
/* number of codes used to transfer the bit lengths */

var HEAP_SIZE     = 2 * L_CODES + 1;
/* maximum heap size */

var MAX_BITS      = 15;
/* All codes must not exceed MAX_BITS bits */

var Buf_size      = 16;
/* size of bit buffer in bi_buf */


/* ===========================================================================
 * Constants
 */

var MAX_BL_BITS = 7;
/* Bit length codes must not exceed MAX_BL_BITS bits */

var END_BLOCK   = 256;
/* end of block literal code */

var REP_3_6     = 16;
/* repeat previous bit length 3-6 times (2 bits of repeat count) */

var REPZ_3_10   = 17;
/* repeat a zero length 3-10 times  (3 bits of repeat count) */

var REPZ_11_138 = 18;
/* repeat a zero length 11-138 times  (7 bits of repeat count) */

/* eslint-disable comma-spacing,array-bracket-spacing */
var extra_lbits =   /* extra bits for each length code */
  [0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];

var extra_dbits =   /* extra bits for each distance code */
  [0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];

var extra_blbits =  /* extra bits for each bit length code */
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7];

var bl_order =
  [16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];
/* eslint-enable comma-spacing,array-bracket-spacing */

/* The lengths of the bit length codes are sent in order of decreasing
 * probability, to avoid transmitting the lengths for unused bit length codes.
 */

/* ===========================================================================
 * Local data. These are initialized only once.
 */

// We pre-fill arrays with 0 to avoid uninitialized gaps

var DIST_CODE_LEN = 512; /* see definition of array dist_code below */

// !!!! Use flat array insdead of structure, Freq = i*2, Len = i*2+1
var static_ltree  = new Array((L_CODES + 2) * 2);
zero(static_ltree);
/* The static literal tree. Since the bit lengths are imposed, there is no
 * need for the L_CODES extra codes used during heap construction. However
 * The codes 286 and 287 are needed to build a canonical tree (see _tr_init
 * below).
 */

var static_dtree  = new Array(D_CODES * 2);
zero(static_dtree);
/* The static distance tree. (Actually a trivial tree since all codes use
 * 5 bits.)
 */

var _dist_code    = new Array(DIST_CODE_LEN);
zero(_dist_code);
/* Distance codes. The first 256 values correspond to the distances
 * 3 .. 258, the last 256 values correspond to the top 8 bits of
 * the 15 bit distances.
 */

var _length_code  = new Array(MAX_MATCH - MIN_MATCH + 1);
zero(_length_code);
/* length code for each normalized match length (0 == MIN_MATCH) */

var base_length   = new Array(LENGTH_CODES);
zero(base_length);
/* First normalized length for each code (0 = MIN_MATCH) */

var base_dist     = new Array(D_CODES);
zero(base_dist);
/* First normalized distance for each code (0 = distance of 1) */


function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {

  this.static_tree  = static_tree;  /* static tree or NULL */
  this.extra_bits   = extra_bits;   /* extra bits for each code or NULL */
  this.extra_base   = extra_base;   /* base index for extra_bits */
  this.elems        = elems;        /* max number of elements in the tree */
  this.max_length   = max_length;   /* max bit length for the codes */

  // show if `static_tree` has data or dummy - needed for monomorphic objects
  this.has_stree    = static_tree && static_tree.length;
}


var static_l_desc;
var static_d_desc;
var static_bl_desc;


function TreeDesc(dyn_tree, stat_desc) {
  this.dyn_tree = dyn_tree;     /* the dynamic tree */
  this.max_code = 0;            /* largest code with non zero frequency */
  this.stat_desc = stat_desc;   /* the corresponding static tree */
}



function d_code(dist) {
  return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
}


/* ===========================================================================
 * Output a short LSB first on the stream.
 * IN assertion: there is enough room in pendingBuf.
 */
function put_short(s, w) {
//    put_byte(s, (uch)((w) & 0xff));
//    put_byte(s, (uch)((ush)(w) >> 8));
  s.pending_buf[s.pending++] = (w) & 0xff;
  s.pending_buf[s.pending++] = (w >>> 8) & 0xff;
}


/* ===========================================================================
 * Send a value on a given number of bits.
 * IN assertion: length <= 16 and value fits in length bits.
 */
function send_bits(s, value, length) {
  if (s.bi_valid > (Buf_size - length)) {
    s.bi_buf |= (value << s.bi_valid) & 0xffff;
    put_short(s, s.bi_buf);
    s.bi_buf = value >> (Buf_size - s.bi_valid);
    s.bi_valid += length - Buf_size;
  } else {
    s.bi_buf |= (value << s.bi_valid) & 0xffff;
    s.bi_valid += length;
  }
}


function send_code(s, c, tree) {
  send_bits(s, tree[c * 2]/*.Code*/, tree[c * 2 + 1]/*.Len*/);
}


/* ===========================================================================
 * Reverse the first len bits of a code, using straightforward code (a faster
 * method would use a table)
 * IN assertion: 1 <= len <= 15
 */
function bi_reverse(code, len) {
  var res = 0;
  do {
    res |= code & 1;
    code >>>= 1;
    res <<= 1;
  } while (--len > 0);
  return res >>> 1;
}


/* ===========================================================================
 * Flush the bit buffer, keeping at most 7 bits in it.
 */
function bi_flush(s) {
  if (s.bi_valid === 16) {
    put_short(s, s.bi_buf);
    s.bi_buf = 0;
    s.bi_valid = 0;

  } else if (s.bi_valid >= 8) {
    s.pending_buf[s.pending++] = s.bi_buf & 0xff;
    s.bi_buf >>= 8;
    s.bi_valid -= 8;
  }
}


/* ===========================================================================
 * Compute the optimal bit lengths for a tree and update the total bit length
 * for the current block.
 * IN assertion: the fields freq and dad are set, heap[heap_max] and
 *    above are the tree nodes sorted by increasing frequency.
 * OUT assertions: the field len is set to the optimal bit length, the
 *     array bl_count contains the frequencies for each bit length.
 *     The length opt_len is updated; static_len is also updated if stree is
 *     not null.
 */
function gen_bitlen(s, desc)
//    deflate_state *s;
//    tree_desc *desc;    /* the tree descriptor */
{
  var tree            = desc.dyn_tree;
  var max_code        = desc.max_code;
  var stree           = desc.stat_desc.static_tree;
  var has_stree       = desc.stat_desc.has_stree;
  var extra           = desc.stat_desc.extra_bits;
  var base            = desc.stat_desc.extra_base;
  var max_length      = desc.stat_desc.max_length;
  var h;              /* heap index */
  var n, m;           /* iterate over the tree elements */
  var bits;           /* bit length */
  var xbits;          /* extra bits */
  var f;              /* frequency */
  var overflow = 0;   /* number of elements with bit length too large */

  for (bits = 0; bits <= MAX_BITS; bits++) {
    s.bl_count[bits] = 0;
  }

  /* In a first pass, compute the optimal bit lengths (which may
   * overflow in the case of the bit length tree).
   */
  tree[s.heap[s.heap_max] * 2 + 1]/*.Len*/ = 0; /* root of the heap */

  for (h = s.heap_max + 1; h < HEAP_SIZE; h++) {
    n = s.heap[h];
    bits = tree[tree[n * 2 + 1]/*.Dad*/ * 2 + 1]/*.Len*/ + 1;
    if (bits > max_length) {
      bits = max_length;
      overflow++;
    }
    tree[n * 2 + 1]/*.Len*/ = bits;
    /* We overwrite tree[n].Dad which is no longer needed */

    if (n > max_code) { continue; } /* not a leaf node */

    s.bl_count[bits]++;
    xbits = 0;
    if (n >= base) {
      xbits = extra[n - base];
    }
    f = tree[n * 2]/*.Freq*/;
    s.opt_len += f * (bits + xbits);
    if (has_stree) {
      s.static_len += f * (stree[n * 2 + 1]/*.Len*/ + xbits);
    }
  }
  if (overflow === 0) { return; }

  // Trace((stderr,"\nbit length overflow\n"));
  /* This happens for example on obj2 and pic of the Calgary corpus */

  /* Find the first bit length which could increase: */
  do {
    bits = max_length - 1;
    while (s.bl_count[bits] === 0) { bits--; }
    s.bl_count[bits]--;      /* move one leaf down the tree */
    s.bl_count[bits + 1] += 2; /* move one overflow item as its brother */
    s.bl_count[max_length]--;
    /* The brother of the overflow item also moves one step up,
     * but this does not affect bl_count[max_length]
     */
    overflow -= 2;
  } while (overflow > 0);

  /* Now recompute all bit lengths, scanning in increasing frequency.
   * h is still equal to HEAP_SIZE. (It is simpler to reconstruct all
   * lengths instead of fixing only the wrong ones. This idea is taken
   * from 'ar' written by Haruhiko Okumura.)
   */
  for (bits = max_length; bits !== 0; bits--) {
    n = s.bl_count[bits];
    while (n !== 0) {
      m = s.heap[--h];
      if (m > max_code) { continue; }
      if (tree[m * 2 + 1]/*.Len*/ !== bits) {
        // Trace((stderr,"code %d bits %d->%d\n", m, tree[m].Len, bits));
        s.opt_len += (bits - tree[m * 2 + 1]/*.Len*/) * tree[m * 2]/*.Freq*/;
        tree[m * 2 + 1]/*.Len*/ = bits;
      }
      n--;
    }
  }
}


/* ===========================================================================
 * Generate the codes for a given tree and bit counts (which need not be
 * optimal).
 * IN assertion: the array bl_count contains the bit length statistics for
 * the given tree and the field len is set for all tree elements.
 * OUT assertion: the field code is set for all tree elements of non
 *     zero code length.
 */
function gen_codes(tree, max_code, bl_count)
//    ct_data *tree;             /* the tree to decorate */
//    int max_code;              /* largest code with non zero frequency */
//    ushf *bl_count;            /* number of codes at each bit length */
{
  var next_code = new Array(MAX_BITS + 1); /* next code value for each bit length */
  var code = 0;              /* running code value */
  var bits;                  /* bit index */
  var n;                     /* code index */

  /* The distribution counts are first used to generate the code values
   * without bit reversal.
   */
  for (bits = 1; bits <= MAX_BITS; bits++) {
    next_code[bits] = code = (code + bl_count[bits - 1]) << 1;
  }
  /* Check that the bit counts in bl_count are consistent. The last code
   * must be all ones.
   */
  //Assert (code + bl_count[MAX_BITS]-1 == (1<<MAX_BITS)-1,
  //        "inconsistent bit counts");
  //Tracev((stderr,"\ngen_codes: max_code %d ", max_code));

  for (n = 0;  n <= max_code; n++) {
    var len = tree[n * 2 + 1]/*.Len*/;
    if (len === 0) { continue; }
    /* Now reverse the bits */
    tree[n * 2]/*.Code*/ = bi_reverse(next_code[len]++, len);

    //Tracecv(tree != static_ltree, (stderr,"\nn %3d %c l %2d c %4x (%x) ",
    //     n, (isgraph(n) ? n : ' '), len, tree[n].Code, next_code[len]-1));
  }
}


/* ===========================================================================
 * Initialize the various 'constant' tables.
 */
function tr_static_init() {
  var n;        /* iterates over tree elements */
  var bits;     /* bit counter */
  var length;   /* length value */
  var code;     /* code value */
  var dist;     /* distance index */
  var bl_count = new Array(MAX_BITS + 1);
  /* number of codes at each bit length for an optimal tree */

  // do check in _tr_init()
  //if (static_init_done) return;

  /* For some embedded targets, global variables are not initialized: */
/*#ifdef NO_INIT_GLOBAL_POINTERS
  static_l_desc.static_tree = static_ltree;
  static_l_desc.extra_bits = extra_lbits;
  static_d_desc.static_tree = static_dtree;
  static_d_desc.extra_bits = extra_dbits;
  static_bl_desc.extra_bits = extra_blbits;
#endif*/

  /* Initialize the mapping length (0..255) -> length code (0..28) */
  length = 0;
  for (code = 0; code < LENGTH_CODES - 1; code++) {
    base_length[code] = length;
    for (n = 0; n < (1 << extra_lbits[code]); n++) {
      _length_code[length++] = code;
    }
  }
  //Assert (length == 256, "tr_static_init: length != 256");
  /* Note that the length 255 (match length 258) can be represented
   * in two different ways: code 284 + 5 bits or code 285, so we
   * overwrite length_code[255] to use the best encoding:
   */
  _length_code[length - 1] = code;

  /* Initialize the mapping dist (0..32K) -> dist code (0..29) */
  dist = 0;
  for (code = 0; code < 16; code++) {
    base_dist[code] = dist;
    for (n = 0; n < (1 << extra_dbits[code]); n++) {
      _dist_code[dist++] = code;
    }
  }
  //Assert (dist == 256, "tr_static_init: dist != 256");
  dist >>= 7; /* from now on, all distances are divided by 128 */
  for (; code < D_CODES; code++) {
    base_dist[code] = dist << 7;
    for (n = 0; n < (1 << (extra_dbits[code] - 7)); n++) {
      _dist_code[256 + dist++] = code;
    }
  }
  //Assert (dist == 256, "tr_static_init: 256+dist != 512");

  /* Construct the codes of the static literal tree */
  for (bits = 0; bits <= MAX_BITS; bits++) {
    bl_count[bits] = 0;
  }

  n = 0;
  while (n <= 143) {
    static_ltree[n * 2 + 1]/*.Len*/ = 8;
    n++;
    bl_count[8]++;
  }
  while (n <= 255) {
    static_ltree[n * 2 + 1]/*.Len*/ = 9;
    n++;
    bl_count[9]++;
  }
  while (n <= 279) {
    static_ltree[n * 2 + 1]/*.Len*/ = 7;
    n++;
    bl_count[7]++;
  }
  while (n <= 287) {
    static_ltree[n * 2 + 1]/*.Len*/ = 8;
    n++;
    bl_count[8]++;
  }
  /* Codes 286 and 287 do not exist, but we must include them in the
   * tree construction to get a canonical Huffman tree (longest code
   * all ones)
   */
  gen_codes(static_ltree, L_CODES + 1, bl_count);

  /* The static distance tree is trivial: */
  for (n = 0; n < D_CODES; n++) {
    static_dtree[n * 2 + 1]/*.Len*/ = 5;
    static_dtree[n * 2]/*.Code*/ = bi_reverse(n, 5);
  }

  // Now data ready and we can init static trees
  static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS + 1, L_CODES, MAX_BITS);
  static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0,          D_CODES, MAX_BITS);
  static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0,         BL_CODES, MAX_BL_BITS);

  //static_init_done = true;
}


/* ===========================================================================
 * Initialize a new block.
 */
function init_block(s) {
  var n; /* iterates over tree elements */

  /* Initialize the trees. */
  for (n = 0; n < L_CODES;  n++) { s.dyn_ltree[n * 2]/*.Freq*/ = 0; }
  for (n = 0; n < D_CODES;  n++) { s.dyn_dtree[n * 2]/*.Freq*/ = 0; }
  for (n = 0; n < BL_CODES; n++) { s.bl_tree[n * 2]/*.Freq*/ = 0; }

  s.dyn_ltree[END_BLOCK * 2]/*.Freq*/ = 1;
  s.opt_len = s.static_len = 0;
  s.last_lit = s.matches = 0;
}


/* ===========================================================================
 * Flush the bit buffer and align the output on a byte boundary
 */
function bi_windup(s)
{
  if (s.bi_valid > 8) {
    put_short(s, s.bi_buf);
  } else if (s.bi_valid > 0) {
    //put_byte(s, (Byte)s->bi_buf);
    s.pending_buf[s.pending++] = s.bi_buf;
  }
  s.bi_buf = 0;
  s.bi_valid = 0;
}

/* ===========================================================================
 * Copy a stored block, storing first the length and its
 * one's complement if requested.
 */
function copy_block(s, buf, len, header)
//DeflateState *s;
//charf    *buf;    /* the input data */
//unsigned len;     /* its length */
//int      header;  /* true if block header must be written */
{
  bi_windup(s);        /* align on byte boundary */

  if (header) {
    put_short(s, len);
    put_short(s, ~len);
  }
//  while (len--) {
//    put_byte(s, *buf++);
//  }
  utils.arraySet(s.pending_buf, s.window, buf, len, s.pending);
  s.pending += len;
}

/* ===========================================================================
 * Compares to subtrees, using the tree depth as tie breaker when
 * the subtrees have equal frequency. This minimizes the worst case length.
 */
function smaller(tree, n, m, depth) {
  var _n2 = n * 2;
  var _m2 = m * 2;
  return (tree[_n2]/*.Freq*/ < tree[_m2]/*.Freq*/ ||
         (tree[_n2]/*.Freq*/ === tree[_m2]/*.Freq*/ && depth[n] <= depth[m]));
}

/* ===========================================================================
 * Restore the heap property by moving down the tree starting at node k,
 * exchanging a node with the smallest of its two sons if necessary, stopping
 * when the heap property is re-established (each father smaller than its
 * two sons).
 */
function pqdownheap(s, tree, k)
//    deflate_state *s;
//    ct_data *tree;  /* the tree to restore */
//    int k;               /* node to move down */
{
  var v = s.heap[k];
  var j = k << 1;  /* left son of k */
  while (j <= s.heap_len) {
    /* Set j to the smallest of the two sons: */
    if (j < s.heap_len &&
      smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
      j++;
    }
    /* Exit if v is smaller than both sons */
    if (smaller(tree, v, s.heap[j], s.depth)) { break; }

    /* Exchange v with the smallest son */
    s.heap[k] = s.heap[j];
    k = j;

    /* And continue down the tree, setting j to the left son of k */
    j <<= 1;
  }
  s.heap[k] = v;
}


// inlined manually
// var SMALLEST = 1;

/* ===========================================================================
 * Send the block data compressed using the given Huffman trees
 */
function compress_block(s, ltree, dtree)
//    deflate_state *s;
//    const ct_data *ltree; /* literal tree */
//    const ct_data *dtree; /* distance tree */
{
  var dist;           /* distance of matched string */
  var lc;             /* match length or unmatched char (if dist == 0) */
  var lx = 0;         /* running index in l_buf */
  var code;           /* the code to send */
  var extra;          /* number of extra bits to send */

  if (s.last_lit !== 0) {
    do {
      dist = (s.pending_buf[s.d_buf + lx * 2] << 8) | (s.pending_buf[s.d_buf + lx * 2 + 1]);
      lc = s.pending_buf[s.l_buf + lx];
      lx++;

      if (dist === 0) {
        send_code(s, lc, ltree); /* send a literal byte */
        //Tracecv(isgraph(lc), (stderr," '%c' ", lc));
      } else {
        /* Here, lc is the match length - MIN_MATCH */
        code = _length_code[lc];
        send_code(s, code + LITERALS + 1, ltree); /* send the length code */
        extra = extra_lbits[code];
        if (extra !== 0) {
          lc -= base_length[code];
          send_bits(s, lc, extra);       /* send the extra length bits */
        }
        dist--; /* dist is now the match distance - 1 */
        code = d_code(dist);
        //Assert (code < D_CODES, "bad d_code");

        send_code(s, code, dtree);       /* send the distance code */
        extra = extra_dbits[code];
        if (extra !== 0) {
          dist -= base_dist[code];
          send_bits(s, dist, extra);   /* send the extra distance bits */
        }
      } /* literal or match pair ? */

      /* Check that the overlay between pending_buf and d_buf+l_buf is ok: */
      //Assert((uInt)(s->pending) < s->lit_bufsize + 2*lx,
      //       "pendingBuf overflow");

    } while (lx < s.last_lit);
  }

  send_code(s, END_BLOCK, ltree);
}


/* ===========================================================================
 * Construct one Huffman tree and assigns the code bit strings and lengths.
 * Update the total bit length for the current block.
 * IN assertion: the field freq is set for all tree elements.
 * OUT assertions: the fields len and code are set to the optimal bit length
 *     and corresponding code. The length opt_len is updated; static_len is
 *     also updated if stree is not null. The field max_code is set.
 */
function build_tree(s, desc)
//    deflate_state *s;
//    tree_desc *desc; /* the tree descriptor */
{
  var tree     = desc.dyn_tree;
  var stree    = desc.stat_desc.static_tree;
  var has_stree = desc.stat_desc.has_stree;
  var elems    = desc.stat_desc.elems;
  var n, m;          /* iterate over heap elements */
  var max_code = -1; /* largest code with non zero frequency */
  var node;          /* new node being created */

  /* Construct the initial heap, with least frequent element in
   * heap[SMALLEST]. The sons of heap[n] are heap[2*n] and heap[2*n+1].
   * heap[0] is not used.
   */
  s.heap_len = 0;
  s.heap_max = HEAP_SIZE;

  for (n = 0; n < elems; n++) {
    if (tree[n * 2]/*.Freq*/ !== 0) {
      s.heap[++s.heap_len] = max_code = n;
      s.depth[n] = 0;

    } else {
      tree[n * 2 + 1]/*.Len*/ = 0;
    }
  }

  /* The pkzip format requires that at least one distance code exists,
   * and that at least one bit should be sent even if there is only one
   * possible code. So to avoid special checks later on we force at least
   * two codes of non zero frequency.
   */
  while (s.heap_len < 2) {
    node = s.heap[++s.heap_len] = (max_code < 2 ? ++max_code : 0);
    tree[node * 2]/*.Freq*/ = 1;
    s.depth[node] = 0;
    s.opt_len--;

    if (has_stree) {
      s.static_len -= stree[node * 2 + 1]/*.Len*/;
    }
    /* node is 0 or 1 so it does not have extra bits */
  }
  desc.max_code = max_code;

  /* The elements heap[heap_len/2+1 .. heap_len] are leaves of the tree,
   * establish sub-heaps of increasing lengths:
   */
  for (n = (s.heap_len >> 1/*int /2*/); n >= 1; n--) { pqdownheap(s, tree, n); }

  /* Construct the Huffman tree by repeatedly combining the least two
   * frequent nodes.
   */
  node = elems;              /* next internal node of the tree */
  do {
    //pqremove(s, tree, n);  /* n = node of least frequency */
    /*** pqremove ***/
    n = s.heap[1/*SMALLEST*/];
    s.heap[1/*SMALLEST*/] = s.heap[s.heap_len--];
    pqdownheap(s, tree, 1/*SMALLEST*/);
    /***/

    m = s.heap[1/*SMALLEST*/]; /* m = node of next least frequency */

    s.heap[--s.heap_max] = n; /* keep the nodes sorted by frequency */
    s.heap[--s.heap_max] = m;

    /* Create a new node father of n and m */
    tree[node * 2]/*.Freq*/ = tree[n * 2]/*.Freq*/ + tree[m * 2]/*.Freq*/;
    s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
    tree[n * 2 + 1]/*.Dad*/ = tree[m * 2 + 1]/*.Dad*/ = node;

    /* and insert the new node in the heap */
    s.heap[1/*SMALLEST*/] = node++;
    pqdownheap(s, tree, 1/*SMALLEST*/);

  } while (s.heap_len >= 2);

  s.heap[--s.heap_max] = s.heap[1/*SMALLEST*/];

  /* At this point, the fields freq and dad are set. We can now
   * generate the bit lengths.
   */
  gen_bitlen(s, desc);

  /* The field len is now set, we can generate the bit codes */
  gen_codes(tree, max_code, s.bl_count);
}


/* ===========================================================================
 * Scan a literal or distance tree to determine the frequencies of the codes
 * in the bit length tree.
 */
function scan_tree(s, tree, max_code)
//    deflate_state *s;
//    ct_data *tree;   /* the tree to be scanned */
//    int max_code;    /* and its largest code of non zero frequency */
{
  var n;                     /* iterates over all tree elements */
  var prevlen = -1;          /* last emitted length */
  var curlen;                /* length of current code */

  var nextlen = tree[0 * 2 + 1]/*.Len*/; /* length of next code */

  var count = 0;             /* repeat count of the current code */
  var max_count = 7;         /* max repeat count */
  var min_count = 4;         /* min repeat count */

  if (nextlen === 0) {
    max_count = 138;
    min_count = 3;
  }
  tree[(max_code + 1) * 2 + 1]/*.Len*/ = 0xffff; /* guard */

  for (n = 0; n <= max_code; n++) {
    curlen = nextlen;
    nextlen = tree[(n + 1) * 2 + 1]/*.Len*/;

    if (++count < max_count && curlen === nextlen) {
      continue;

    } else if (count < min_count) {
      s.bl_tree[curlen * 2]/*.Freq*/ += count;

    } else if (curlen !== 0) {

      if (curlen !== prevlen) { s.bl_tree[curlen * 2]/*.Freq*/++; }
      s.bl_tree[REP_3_6 * 2]/*.Freq*/++;

    } else if (count <= 10) {
      s.bl_tree[REPZ_3_10 * 2]/*.Freq*/++;

    } else {
      s.bl_tree[REPZ_11_138 * 2]/*.Freq*/++;
    }

    count = 0;
    prevlen = curlen;

    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;

    } else if (curlen === nextlen) {
      max_count = 6;
      min_count = 3;

    } else {
      max_count = 7;
      min_count = 4;
    }
  }
}


/* ===========================================================================
 * Send a literal or distance tree in compressed form, using the codes in
 * bl_tree.
 */
function send_tree(s, tree, max_code)
//    deflate_state *s;
//    ct_data *tree; /* the tree to be scanned */
//    int max_code;       /* and its largest code of non zero frequency */
{
  var n;                     /* iterates over all tree elements */
  var prevlen = -1;          /* last emitted length */
  var curlen;                /* length of current code */

  var nextlen = tree[0 * 2 + 1]/*.Len*/; /* length of next code */

  var count = 0;             /* repeat count of the current code */
  var max_count = 7;         /* max repeat count */
  var min_count = 4;         /* min repeat count */

  /* tree[max_code+1].Len = -1; */  /* guard already set */
  if (nextlen === 0) {
    max_count = 138;
    min_count = 3;
  }

  for (n = 0; n <= max_code; n++) {
    curlen = nextlen;
    nextlen = tree[(n + 1) * 2 + 1]/*.Len*/;

    if (++count < max_count && curlen === nextlen) {
      continue;

    } else if (count < min_count) {
      do { send_code(s, curlen, s.bl_tree); } while (--count !== 0);

    } else if (curlen !== 0) {
      if (curlen !== prevlen) {
        send_code(s, curlen, s.bl_tree);
        count--;
      }
      //Assert(count >= 3 && count <= 6, " 3_6?");
      send_code(s, REP_3_6, s.bl_tree);
      send_bits(s, count - 3, 2);

    } else if (count <= 10) {
      send_code(s, REPZ_3_10, s.bl_tree);
      send_bits(s, count - 3, 3);

    } else {
      send_code(s, REPZ_11_138, s.bl_tree);
      send_bits(s, count - 11, 7);
    }

    count = 0;
    prevlen = curlen;
    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;

    } else if (curlen === nextlen) {
      max_count = 6;
      min_count = 3;

    } else {
      max_count = 7;
      min_count = 4;
    }
  }
}


/* ===========================================================================
 * Construct the Huffman tree for the bit lengths and return the index in
 * bl_order of the last bit length code to send.
 */
function build_bl_tree(s) {
  var max_blindex;  /* index of last bit length code of non zero freq */

  /* Determine the bit length frequencies for literal and distance trees */
  scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
  scan_tree(s, s.dyn_dtree, s.d_desc.max_code);

  /* Build the bit length tree: */
  build_tree(s, s.bl_desc);
  /* opt_len now includes the length of the tree representations, except
   * the lengths of the bit lengths codes and the 5+5+4 bits for the counts.
   */

  /* Determine the number of bit length codes to send. The pkzip format
   * requires that at least 4 bit length codes be sent. (appnote.txt says
   * 3 but the actual value used is 4.)
   */
  for (max_blindex = BL_CODES - 1; max_blindex >= 3; max_blindex--) {
    if (s.bl_tree[bl_order[max_blindex] * 2 + 1]/*.Len*/ !== 0) {
      break;
    }
  }
  /* Update opt_len to include the bit length tree and counts */
  s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
  //Tracev((stderr, "\ndyn trees: dyn %ld, stat %ld",
  //        s->opt_len, s->static_len));

  return max_blindex;
}


/* ===========================================================================
 * Send the header for a block using dynamic Huffman trees: the counts, the
 * lengths of the bit length codes, the literal tree and the distance tree.
 * IN assertion: lcodes >= 257, dcodes >= 1, blcodes >= 4.
 */
function send_all_trees(s, lcodes, dcodes, blcodes)
//    deflate_state *s;
//    int lcodes, dcodes, blcodes; /* number of codes for each tree */
{
  var rank;                    /* index in bl_order */

  //Assert (lcodes >= 257 && dcodes >= 1 && blcodes >= 4, "not enough codes");
  //Assert (lcodes <= L_CODES && dcodes <= D_CODES && blcodes <= BL_CODES,
  //        "too many codes");
  //Tracev((stderr, "\nbl counts: "));
  send_bits(s, lcodes - 257, 5); /* not +255 as stated in appnote.txt */
  send_bits(s, dcodes - 1,   5);
  send_bits(s, blcodes - 4,  4); /* not -3 as stated in appnote.txt */
  for (rank = 0; rank < blcodes; rank++) {
    //Tracev((stderr, "\nbl code %2d ", bl_order[rank]));
    send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1]/*.Len*/, 3);
  }
  //Tracev((stderr, "\nbl tree: sent %ld", s->bits_sent));

  send_tree(s, s.dyn_ltree, lcodes - 1); /* literal tree */
  //Tracev((stderr, "\nlit tree: sent %ld", s->bits_sent));

  send_tree(s, s.dyn_dtree, dcodes - 1); /* distance tree */
  //Tracev((stderr, "\ndist tree: sent %ld", s->bits_sent));
}


/* ===========================================================================
 * Check if the data type is TEXT or BINARY, using the following algorithm:
 * - TEXT if the two conditions below are satisfied:
 *    a) There are no non-portable control characters belonging to the
 *       "black list" (0..6, 14..25, 28..31).
 *    b) There is at least one printable character belonging to the
 *       "white list" (9 {TAB}, 10 {LF}, 13 {CR}, 32..255).
 * - BINARY otherwise.
 * - The following partially-portable control characters form a
 *   "gray list" that is ignored in this detection algorithm:
 *   (7 {BEL}, 8 {BS}, 11 {VT}, 12 {FF}, 26 {SUB}, 27 {ESC}).
 * IN assertion: the fields Freq of dyn_ltree are set.
 */
function detect_data_type(s) {
  /* black_mask is the bit mask of black-listed bytes
   * set bits 0..6, 14..25, and 28..31
   * 0xf3ffc07f = binary 11110011111111111100000001111111
   */
  var black_mask = 0xf3ffc07f;
  var n;

  /* Check for non-textual ("black-listed") bytes. */
  for (n = 0; n <= 31; n++, black_mask >>>= 1) {
    if ((black_mask & 1) && (s.dyn_ltree[n * 2]/*.Freq*/ !== 0)) {
      return Z_BINARY;
    }
  }

  /* Check for textual ("white-listed") bytes. */
  if (s.dyn_ltree[9 * 2]/*.Freq*/ !== 0 || s.dyn_ltree[10 * 2]/*.Freq*/ !== 0 ||
      s.dyn_ltree[13 * 2]/*.Freq*/ !== 0) {
    return Z_TEXT;
  }
  for (n = 32; n < LITERALS; n++) {
    if (s.dyn_ltree[n * 2]/*.Freq*/ !== 0) {
      return Z_TEXT;
    }
  }

  /* There are no "black-listed" or "white-listed" bytes:
   * this stream either is empty or has tolerated ("gray-listed") bytes only.
   */
  return Z_BINARY;
}


var static_init_done = false;

/* ===========================================================================
 * Initialize the tree data structures for a new zlib stream.
 */
function _tr_init(s)
{

  if (!static_init_done) {
    tr_static_init();
    static_init_done = true;
  }

  s.l_desc  = new TreeDesc(s.dyn_ltree, static_l_desc);
  s.d_desc  = new TreeDesc(s.dyn_dtree, static_d_desc);
  s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);

  s.bi_buf = 0;
  s.bi_valid = 0;

  /* Initialize the first block of the first file: */
  init_block(s);
}


/* ===========================================================================
 * Send a stored block
 */
function _tr_stored_block(s, buf, stored_len, last)
//DeflateState *s;
//charf *buf;       /* input block */
//ulg stored_len;   /* length of input block */
//int last;         /* one if this is the last block for a file */
{
  send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);    /* send block type */
  copy_block(s, buf, stored_len, true); /* with header */
}


/* ===========================================================================
 * Send one empty static block to give enough lookahead for inflate.
 * This takes 10 bits, of which 7 may remain in the bit buffer.
 */
function _tr_align(s) {
  send_bits(s, STATIC_TREES << 1, 3);
  send_code(s, END_BLOCK, static_ltree);
  bi_flush(s);
}


/* ===========================================================================
 * Determine the best encoding for the current block: dynamic trees, static
 * trees or store, and output the encoded block to the zip file.
 */
function _tr_flush_block(s, buf, stored_len, last)
//DeflateState *s;
//charf *buf;       /* input block, or NULL if too old */
//ulg stored_len;   /* length of input block */
//int last;         /* one if this is the last block for a file */
{
  var opt_lenb, static_lenb;  /* opt_len and static_len in bytes */
  var max_blindex = 0;        /* index of last bit length code of non zero freq */

  /* Build the Huffman trees unless a stored block is forced */
  if (s.level > 0) {

    /* Check if the file is binary or text */
    if (s.strm.data_type === Z_UNKNOWN) {
      s.strm.data_type = detect_data_type(s);
    }

    /* Construct the literal and distance trees */
    build_tree(s, s.l_desc);
    // Tracev((stderr, "\nlit data: dyn %ld, stat %ld", s->opt_len,
    //        s->static_len));

    build_tree(s, s.d_desc);
    // Tracev((stderr, "\ndist data: dyn %ld, stat %ld", s->opt_len,
    //        s->static_len));
    /* At this point, opt_len and static_len are the total bit lengths of
     * the compressed block data, excluding the tree representations.
     */

    /* Build the bit length tree for the above two trees, and get the index
     * in bl_order of the last bit length code to send.
     */
    max_blindex = build_bl_tree(s);

    /* Determine the best encoding. Compute the block lengths in bytes. */
    opt_lenb = (s.opt_len + 3 + 7) >>> 3;
    static_lenb = (s.static_len + 3 + 7) >>> 3;

    // Tracev((stderr, "\nopt %lu(%lu) stat %lu(%lu) stored %lu lit %u ",
    //        opt_lenb, s->opt_len, static_lenb, s->static_len, stored_len,
    //        s->last_lit));

    if (static_lenb <= opt_lenb) { opt_lenb = static_lenb; }

  } else {
    // Assert(buf != (char*)0, "lost buf");
    opt_lenb = static_lenb = stored_len + 5; /* force a stored block */
  }

  if ((stored_len + 4 <= opt_lenb) && (buf !== -1)) {
    /* 4: two words for the lengths */

    /* The test buf != NULL is only necessary if LIT_BUFSIZE > WSIZE.
     * Otherwise we can't have processed more than WSIZE input bytes since
     * the last block flush, because compression would have been
     * successful. If LIT_BUFSIZE <= WSIZE, it is never too late to
     * transform a block into a stored block.
     */
    _tr_stored_block(s, buf, stored_len, last);

  } else if (s.strategy === Z_FIXED || static_lenb === opt_lenb) {

    send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
    compress_block(s, static_ltree, static_dtree);

  } else {
    send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
    send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
    compress_block(s, s.dyn_ltree, s.dyn_dtree);
  }
  // Assert (s->compressed_len == s->bits_sent, "bad compressed size");
  /* The above check is made mod 2^32, for files larger than 512 MB
   * and uLong implemented on 32 bits.
   */
  init_block(s);

  if (last) {
    bi_windup(s);
  }
  // Tracev((stderr,"\ncomprlen %lu(%lu) ", s->compressed_len>>3,
  //       s->compressed_len-7*last));
}

/* ===========================================================================
 * Save the match info and tally the frequency counts. Return true if
 * the current block must be flushed.
 */
function _tr_tally(s, dist, lc)
//    deflate_state *s;
//    unsigned dist;  /* distance of matched string */
//    unsigned lc;    /* match length-MIN_MATCH or unmatched char (if dist==0) */
{
  //var out_length, in_length, dcode;

  s.pending_buf[s.d_buf + s.last_lit * 2]     = (dist >>> 8) & 0xff;
  s.pending_buf[s.d_buf + s.last_lit * 2 + 1] = dist & 0xff;

  s.pending_buf[s.l_buf + s.last_lit] = lc & 0xff;
  s.last_lit++;

  if (dist === 0) {
    /* lc is the unmatched char */
    s.dyn_ltree[lc * 2]/*.Freq*/++;
  } else {
    s.matches++;
    /* Here, lc is the match length - MIN_MATCH */
    dist--;             /* dist = match distance - 1 */
    //Assert((ush)dist < (ush)MAX_DIST(s) &&
    //       (ush)lc <= (ush)(MAX_MATCH-MIN_MATCH) &&
    //       (ush)d_code(dist) < (ush)D_CODES,  "_tr_tally: bad match");

    s.dyn_ltree[(_length_code[lc] + LITERALS + 1) * 2]/*.Freq*/++;
    s.dyn_dtree[d_code(dist) * 2]/*.Freq*/++;
  }

// (!) This block is disabled in zlib defailts,
// don't enable it for binary compatibility

//#ifdef TRUNCATE_BLOCK
//  /* Try to guess if it is profitable to stop the current block here */
//  if ((s.last_lit & 0x1fff) === 0 && s.level > 2) {
//    /* Compute an upper bound for the compressed length */
//    out_length = s.last_lit*8;
//    in_length = s.strstart - s.block_start;
//
//    for (dcode = 0; dcode < D_CODES; dcode++) {
//      out_length += s.dyn_dtree[dcode*2]/*.Freq*/ * (5 + extra_dbits[dcode]);
//    }
//    out_length >>>= 3;
//    //Tracev((stderr,"\nlast_lit %u, in %ld, out ~%ld(%ld%%) ",
//    //       s->last_lit, in_length, out_length,
//    //       100L - out_length*100L/in_length));
//    if (s.matches < (s.last_lit>>1)/*int /2*/ && out_length < (in_length>>1)/*int /2*/) {
//      return true;
//    }
//  }
//#endif

  return (s.last_lit === s.lit_bufsize - 1);
  /* We avoid equality with lit_bufsize because of wraparound at 64K
   * on 16 bit machines and because stored blocks are restricted to
   * 64K-1 bytes.
   */
}

exports._tr_init  = _tr_init;
exports._tr_stored_block = _tr_stored_block;
exports._tr_flush_block  = _tr_flush_block;
exports._tr_tally = _tr_tally;
exports._tr_align = _tr_align;


/***/ }),
/* 94 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 95 */
/***/ (function(module, exports) {

module.exports = {
	"name": "spectra-data",
	"version": "3.0.1",
	"description": "spectra-data project - manipulate spectra",
	"keywords": [
		"spectra-data",
		"project"
	],
	"author": "Andres Castillo",
	"contributors": [
		"Michaël Zasso",
		"Luc Patiny"
	],
	"repository": "cheminfo-js/spectra-data",
	"bugs": {
		"url": "https://github.com/cheminfo-js/spectra-data/issues"
	},
	"homepage": "https://github.com/cheminfo-js/spectra-data",
	"license": "MIT",
	"main": "./src/index.js",
	"scripts": {
		"eslint": "eslint src test --cache",
		"eslint-fix": "npm run eslint -- --fix",
		"test": "npm run test-mocha",
		"test-mocha": "mocha --compilers js:babel-register --require should --reporter mocha-better-spec-reporter --recursive src/**/__tests__/**/*.js",
		"test-cov": "istanbul cover _mocha -- --compilers js:babel-register --require should --reporter dot --recursive src/**/__tests__/**/*.js",
		"test-travis": "istanbul cover _mocha --report lcovonly -- --compilers js:babel-register --require should --reporter mocha-better-spec-reporter --recursive src/**/__tests__/**/*.js && npm run eslint",
		"build": "cheminfo build"
	},
	"devDependencies": {
		"babel-cli": "^6.2.0",
		"babel-core": "^6.2.1",
		"babel-plugin-transform-es2015-block-scoping": "^6.1.18",
		"babel-preset-es2015-node4": "^2.0.1",
		"babel-register": "^6.2.0",
		"babelify": "^7.2.0",
		"babili": "0.0.8",
		"cheminfo-tools": "^1.13.0",
		"eslint": "^3.9.1",
		"eslint-config-cheminfo": "^1.5.2",
		"eslint-plugin-no-only-tests": "^1.1.0",
		"mocha": "^3.1.2",
		"mocha-better-spec-reporter": "^3.0.1",
		"should": "^11.1.1"
	},
	"dependencies": {
		"brukerconverter": "^1.0.1",
		"extend": "^3.0.0",
		"jcampconverter": "^2.4.5",
		"ml-array-utils": "^0.3.0",
		"ml-curve-fitting": "0.0.7",
		"ml-fft": "^1.3.5",
		"ml-gsd": "^2.0.1",
		"ml-matrix": "^2.1.0",
		"ml-matrix-peaks-finder": "^0.2.1",
		"ml-simple-clustering": "0.1.0",
		"ml-stat": "^1.3.0",
		"nmr-auto-assignment": "0.1.3",
		"nmr-predictor": "0.2.0",
		"nmr-range": "^0.1.10",
		"nmr-simulation": "0.2.0"
	}
};

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function apodization(spectraData, parameters) {
    let params = Object.assign({}, parameters);
    if (!params) {
        return spectraData;
    }
    return spectraData;
    //org.cheminfo.hook.nemo.filters.ApodizationFilter

    /*public String toString() {
     switch (this) {
     case NONE:
     return "None";
     case EXPONENTIAL:
     return "Exponential";
     case GAUSSIAN:
     return "Gaussian";
     case TRAF:
     return "TRAF";
     case SINE_BELL:
     return "Sine Bell";
     case SINE_BELL_SQUARED:
     return "Sine Bell Squared";
     default:
     return "";
     }
     }*/
}

module.exports = apodization;


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var rotate = __webpack_require__(100);

function digitalFilter(spectraData, options) {
    let activeElement = spectraData.activeElement;
    var nbPoints = 0;
    if (options.nbPoints) {
        nbPoints = options.nbPoints;
    } else {
        if (options.brukerFilter) {
            //TODO Determine the number of points to shift, or the ph1 correction
            //based on DECIM and DSPSVF parameters
            nbPoints = 0;
        }
    }

    var nbSubSpectra = spectraData.getNbSubSpectra();
    if (nbPoints !== 0) {
        for (var iSubSpectra = 0; iSubSpectra < nbSubSpectra; iSubSpectra++) {
            spectraData.setActiveElement(iSubSpectra);
            rotate(spectraData.getYData(), nbPoints);
            if (options.rotateX) {
                rotate(spectraData.getXData(), nbPoints);
                spectraData.setFirstX(spectraData.getX(0));
                spectraData.setLastX(spectraData.getX(spectraData.getNbPoints() - 1));
            }
        }
    }
    spectraData.setActiveElement(activeElement);
    return spectraData;
}

module.exports = digitalFilter;


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const fft = __webpack_require__(27);

/**
 * This function make a fourier transformation to each FID withing a SD instance
 * @param {SD} spectraData - SD instance
 * @returns {SD} return SD with spectrum and FID
 */

function fourierTransform(spectraData) {

    var nbPoints = spectraData.getNbPoints();
    var nSubSpectra = spectraData.getNbSubSpectra() / 2;
    var spectraType = 'NMR SPECTRUM';//spectraData.TYPE_NMR_SPECTRUM;
    var FFT = fft.FFT;
    if (nSubSpectra > 1) {
        spectraType = 'nD NMR SPECTRUM';
    }//spectraData.TYPE_2DNMR_SPECTRUM;

    FFT.init(nbPoints);

    var fcor = spectraData.getParamDouble('$FCOR', 0.0);
    //var tempArray = new Array(nbPoints / 2);
    for (var iSubSpectra = 0; iSubSpectra < nSubSpectra; iSubSpectra++) {
        var re = spectraData.getYData(2 * iSubSpectra);
        var im = spectraData.getYData(2 * iSubSpectra + 1);

        re[0] *= fcor;
        im[0] *= fcor;

        FFT.fft(re, im);
        re = re.concat(re.slice(0, (nbPoints + 1) / 2));
        re.splice(0, (nbPoints + 1) / 2);
        im = im.concat(im.slice(0, (nbPoints + 1) / 2));
        im.splice(0, (nbPoints + 1) / 2);

        spectraData.setActiveElement(2 * iSubSpectra);
        updateSpectra(spectraData, spectraType);

        spectraData.setActiveElement(2 * iSubSpectra + 1);
        updateSpectra(spectraData, spectraType);
    }
    //TODO For Alejandro
    //Now we can try to apply the FFt on the second dimension
    if (spectraData.is2D()) {
        //var mode = spectraData.getParam('.ACQUISITION SCHEME');
        /*switch (mode) {
            case 1://"State-TPP"
                break;
            case 2://State
                break;
            case 3://Echo-Antiecho
                break;
                //QF
                //Does not transform in the indirect dimension
        }*/
    }
    spectraData.setActiveElement(0);
    return spectraData;
}

function updateSpectra(spectraData, spectraType) {
    var baseFrequency = spectraData.getParamDouble('$BF1', NaN);
    var spectralFrequency = spectraData.getParamDouble('$SFO1', NaN);
    var spectralWidth = spectraData.getParamDouble('$SW', NaN);
    var xMiddle = ((spectralFrequency - baseFrequency) / baseFrequency) * 1e6;
    var dx = 0.5 * spectralWidth * spectralFrequency / baseFrequency;

    spectraData.setDataType(spectraType);
    spectraData.setFirstX(xMiddle + dx);
    spectraData.setLastX(xMiddle - dx);
    spectraData.setXUnits('PPM');

    var x = spectraData.getXData();
    var tmp = xMiddle + dx;
    dx = -2 * dx / (x.length - 1);

    for (var i = 0; i < x.length; i++) {
        x[i] = tmp;
        tmp += dx;
    }

    //TODO update minmax in Y axis
}

module.exports = fourierTransform;


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Phase correction filter
 * @param {SD} spectraData - SD instance
 * @param {number} [phi0 = 0] - value
 * @param {number} [phi1 = 0] - value
 * @return {SD} returns the modified spectraData
 */
function phaseCorrection(spectraData, phi0, phi1) {

    phi0 = Number.isFinite(phi0) ? phi0 : 0
    phi1 = Number.isFinite(phi1) ? phi1 : 0

    var nbPoints = spectraData.getNbPoints();
    var reData = spectraData.getYData(0);
    var imData = spectraData.getYData(1);
    //var corrections = spectraData.getParam("corrections");

    //for(var k=0;k<corrections.length;k++){
    //    Point2D phi = corrections.elementAt(k);

        //double phi0 = phi.getX();
        //double phi1 = phi.getY();

    var delta = phi1 / nbPoints;
    var alpha = 2 * Math.pow(Math.sin(delta / 2), 2);
    var beta = Math.sin(delta);
    var cosTheta = Math.cos(phi0);
    var sinTheta = Math.sin(phi0);
    var cosThetaNew, sinThetaNew;

    var reTmp, imTmp;
    var index;
    for (var i = 0; i < nbPoints; i++) {
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
        //toApply--;
    //}

    spectraData.resetMinMax();
    //spectraData.updateDefaults();
    //spectraData.updateY();
    spectraData.putParam('PHC0', phi0);
    spectraData.putParam('PHC1', phi1);

    return spectraData;
}

module.exports = phaseCorrection;


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * This function performs a circular shift of the input object without realocating memory.
 * Positive values of shifts will shift to the right and negative values will do to the left
 * @example rotate([1,2,3,4],1) -> [4,1,2,3]
 * @example rotate([1,2,3,4],-1) -> [2,3,4,1]
 * @param {Array} array - the array that will be rotated
 * @param {number} shift
 */
function rotate(array, shift) {
    var nbPoints = array.length;
    //Lets calculate the lest amount of points to shift.
    //It decreases the amount of validations in the loop
    shift = shift % nbPoints;

    if (Math.abs(shift) > nbPoints / 2) {
        shift = shift > 0 ? shift - nbPoints : shift + nbPoints;
    }

    if (shift !== 0) {
        var currentIndex = 0, nextIndex = shift;
        var toMove = nbPoints;
        var current = array[currentIndex], next;
        var lastFirstIndex = shift;
        var direction = shift > 0 ? 1 : -1;

        while (toMove > 0) {
            nextIndex = putInRange(nextIndex, nbPoints);
            next = array[nextIndex];
            array[nextIndex] = current;
            nextIndex += shift;
            current = next;
            toMove--;

            if (nextIndex === lastFirstIndex) {
                nextIndex = putInRange(nextIndex + direction, nbPoints);
                lastFirstIndex = nextIndex;
                currentIndex = putInRange(nextIndex - shift, nbPoints);
                current = array[currentIndex];
            }
        }
    }
}
/**
 * @private
 */
function putInRange(value, nbPoints) {
    if (value < 0) {
        value += nbPoints;
    }
    if (value >= nbPoints) {
        value -= nbPoints;
    }
    return value;
}

module.exports = rotate;


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * This function make a zero filling to each Active element in a SD instance.
 * @param {SD} spectra-data instance.
 * @param {number} zeroFillingX - number of points that FID will have, if is it lower
 * than initial number of points, the FID will be spliced
 */


function zeroFilling(spectraData, zeroFillingX) {
    var nbSubSpectra = spectraData.getNbSubSpectra();
    //var zeroPadding = spectraData.getParamDouble("$$ZEROPADDING", 0);
    var nbXPoints, lastX, deltaX, k, x, y;
    if (zeroFillingX !== 0) {
        for (var iSubSpectra = 0; iSubSpectra < nbSubSpectra; iSubSpectra++) {
            spectraData.setActiveElement(iSubSpectra);
            nbXPoints = spectraData.getNbPoints();
            y = spectraData.getYData();
            x = spectraData.getXData();
            lastX = spectraData.getLastX();
            deltaX = (lastX - x[0]) / (nbXPoints - 1);
            for (k = nbXPoints; k < zeroFillingX; k++) {
                y.push(0);
                x.push(lastX + deltaX);
            }
            if (zeroFillingX < nbXPoints) {
                y.splice(zeroFillingX, y.length - 1);
                x.splice(zeroFillingX, x.length - 1);
            }
            spectraData.setFirstX(x[0]);
            spectraData.setLastX(x[x.length - 1]);
        }
    }

    spectraData.setActiveElement(0);
    return spectraData;
    // @TODO implement zeroFillingY for 2D spectra
}
module.exports = zeroFilling;


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Encoder = __webpack_require__(103);
const Integer = {MAX_VALUE: Number.MAX_SAFE_INTEGER, MIN_VALUE: Number.MIN_SAFE_INTEGER};
const CRLF = '\r\n';
const version = 'Cheminfo tools ' + __webpack_require__(95).version;
const defaultParameters = {'encode': 'DIFDUP', 'yFactor': 1, 'type': 'SIMPLE', 'keep': []};
/**
 * This class converts a SpectraData object into a String that can be stored as a jcamp file.
 * The string reflects the current state of the object and not the raw data from where this
 * spectrum was initially loaded.
 * @author acastillo
 *
 */
class JcampCreator {

    /**
     * This function creates a String that represents the given spectraData, in the format JCAM-DX 5.0
     * The X,Y data can be compressed using one of the methods described in:
     * "JCAMP-DX. A STANDARD FORMAT FOR THE EXCHANGE OF ION MOBILITY SPECTROMETRY DATA",
     *  http://www.iupac.org/publications/pac/pdf/2001/pdf/7311x1765.pdf
     * @param {SD} spectraData
     * @param {object} options - Optional paramteres
     * @param {string} [options.encode = 'DIFDUP']
     * @param {number} [options.yFactor = 1]
     * @param {string} [options.type = 'SIMPLE']
     * @param {array} [options.keep = [] ]
     * @return {string}
     */
    convert(spectraData, options) {
        // encodeFormat: ('FIX','SQZ','DIF','DIFDUP','CVS','PAC')
        options = Object.assign({}, defaultParameters, options);
        const encodeFormat = options.encode.toUpperCase().trim();
        const factorY = options.yFactor || 1;
        let type = options.type;
        const userDefinedParams = options.keep;

        if (type === null || type.length === 0) {
            type = 'SIMPLE';
        }

        var outString = '';
        spectraData.setActiveElement(0);

        var scale = factorY / spectraData.getParamDouble('YFACTOR', 1);
        let minMax = {};

        if(!spectraData.is2D()) {
            minMax = spectraData.getMinMaxY();
        }
        else{
            minMax = {min: spectraData.getMinZ(), max: spectraData.getMaxZ()}
        }

        if (minMax.max * scale >= Integer.MAX_VALUE / 2) {
            scale = Integer.MAX_VALUE / (minMax.max * 2);
        }
        if (Math.abs(minMax.max - minMax.min) * scale < 16) {
            scale = 16 / (Math.abs(minMax.max - minMax.min));
        }

        var scaleX = Math.abs(1.0 / spectraData.getDeltaX());

        outString += '##TITLE= ' + spectraData.getTitle() + CRLF;
        outString += '##JCAMP-DX= 5.00\t$$' + version + CRLF;
        outString += '##OWNER= ' + spectraData.getParamString('##OWNER=', '') + CRLF;
        outString += '##DATA TYPE= ' + spectraData.getDataType() + CRLF;

        if (type === 'NTUPLES') {
            outString += ntuplesHead(spectraData, scale, scaleX, encodeFormat, userDefinedParams);
        }

        if (type === 'SIMPLE') {
            outString += simpleHead(spectraData, scale, scaleX, encodeFormat, userDefinedParams);
        }

        return outString;
    }
}

function ntuplesHead(spectraData, scale, scaleX, encodeFormat, userDefinedParams) {
    var outString = '';
    var variableX = spectraData.getSpectraVariable(0);
    var variableY = spectraData.getSpectraVariable(1);
    var variableZ = spectraData.getSpectraVariable(2);

    outString += '##DATA CLASS= NTUPLES' + CRLF;
    outString += '##NUM DIM= 2' + CRLF;
    var nTuplesName = spectraData.getDataType().trim();
    // we set the VarName parameter to the most common ones.
    // These tables contain the number of occurences of each one
    var abscVar = {};
    var sub;
    for (sub = 0; sub < spectraData.getNbSubSpectra(); sub++) {
        spectraData.setActiveElement(sub);
        if (abscVar[spectraData.getXUnits()]) {
            abscVar[spectraData.getXUnits()].value++;
        } else {
            abscVar[spectraData.getXUnits()] = {value: 1, index: sub};
        }
    }

    var keys = Object.keys(abscVar);
    var mostCommon = keys[0], defaultSub = 0;

    for (sub = 1; sub < keys.length; sub++) {
        if (abscVar[keys[sub]].value > abscVar[mostCommon].value) {
            mostCommon = keys[sub];
            defaultSub = abscVar[keys[sub]].index;
        }
    }
    var isComplex = false;
    spectraData.setActiveElement(defaultSub);
    var isNMR = spectraData.getDataType().indexOf('NMR') >= 0;
    //If it is a NMR spectrum
    if (isNMR) {
        outString += '##.OBSERVE FREQUENCY= ' + spectraData.getParamDouble('observefrequency', 0) + CRLF;
        outString += '##.OBSERVE NUCLEUS= ^' + spectraData.getNucleus() + CRLF;
        outString += '##$DECIM= ' + spectraData.getParamDouble('$DECIM', 0) + CRLF;
        outString += '##$DSPFVS= ' + spectraData.getParamDouble('$DSPFVS', 0) + CRLF;
        outString += '##$FCOR= ' + (Math.floor(spectraData.getParamDouble('$FCOR', 0))) + CRLF;
        if (spectraData.containsParam('$SW_h')) {
            outString += '##$SW_h= ' + spectraData.getParamDouble('$SW_h', 0) + CRLF;
        } else if (spectraData.containsParam('$SW_p')) {
            outString += '##$SW_p= ' + spectraData.getParamDouble('$SW_p', 0) + CRLF;
        }
        outString += '##$SW= ' + spectraData.getParamDouble('$SW', 0) + CRLF;
        outString += '##$TD= ' + (Math.floor(spectraData.getParamDouble('$TD', 0))) + CRLF;
        outString += '##$BF1= ' + spectraData.getParamDouble('$BF1', 0) + CRLF;
        outString += '##$GRPDLY= ' + spectraData.getParamDouble('$GRPDLY', 0) + CRLF;
        outString += '##.DIGITISER RES= ' + spectraData.getParamInt('.DIGITISER RES', 0) + CRLF;
        outString += '##.PULSE SEQUENCE= ' + spectraData.getParamString('.PULSE SEQUENCE', '') + CRLF;
        outString += '##.SOLVENT NAME= ' + spectraData.getSolventName() + CRLF;
        outString += '##$NUC1= <' + spectraData.getNucleus() + '>' + CRLF;
        if (spectraData.containsParam('2D_X_FREQUENCY')) {
            outString += '##$SFO1= ' + spectraData.getParamDouble('2D_X_FREQUENCY', 0) + CRLF;
        } else {
            outString += '##$SFO1= ' + spectraData.getParamDouble('$SFO1', 0) + CRLF;
        }

        if (spectraData.containsParam('2D_X_OFFSET')) {
            outString += '##$OFFSET= ' + spectraData.getParamDouble('2D_X_OFFSET', 0) + CRLF;
        }

        if (spectraData.is2D()) {
            outString += '$$Parameters for 2D NMR Spectrum' + CRLF;
            outString += '##$NUC1= <' + spectraData.getNucleus(2) + '>' + CRLF;
            if (spectraData.containsParam('2D_Y_FREQUENCY')) {
                outString += '##$SFO1= ' + spectraData.getParamDouble('2D_Y_FREQUENCY', 0) + CRLF;
                outString += '##$SFO2= ' + spectraData.getParamDouble('2D_Y_FREQUENCY', 0) + CRLF;
                outString += '##$BF2= ' + spectraData.getParamDouble('2D_Y_FREQUENCY', 0) + CRLF;
            }
            if (spectraData.containsParam('2D_Y_OFFSET')) {
                outString += '##$OFFSET= ' + spectraData.getParamDouble('2D_Y_OFFSET', 0) + CRLF;
            }

            outString += '$$End of Parameters for 2D NMR Spectrum' + CRLF;
        }
    }
    outString += '##NTUPLES=\t' + nTuplesName + CRLF;
    var freq1 = 1, freq2 = 1;//spectraData.getParamDouble("2D_Y_FREQUENCY", 0);
    if (!spectraData.is2D() && spectraData.getNbSubSpectra() > 1 && isNMR) {
        isComplex = true;
    }
    if (isComplex) {
        outString += '##VAR_NAME=\t' + spectraData.getXUnits() + ',\t' + nTuplesName.substring(4) + '/REAL,\t' + nTuplesName.substring(4) + '/IMAG' + CRLF;
        outString += '##SYMBOL=\tX,\tR,\tI' + CRLF;
        outString += '##VAR_TYPE=\tINDEPENDENT,\tDEPENDENT,\tDEPENDENT' + CRLF;
        if (encodeFormat !== 'CSV' || encodeFormat !== 'PAC') {
            outString += '##VAR_FORM=\tAFFN,\tASDF,\tASDF' + CRLF;
        } else {
            outString += '##VAR_FORM=\tAFFN,\tAFFN,\tAFFN' + CRLF;
        }
        outString += '##VAR_DIM=\t' + spectraData.getNbPoints() + ',\t' + spectraData.getNbPoints() + ',\t' + spectraData.getNbPoints() + CRLF;
        outString += '##UNITS=\tHZ' + ',\t' + spectraData.getYUnits() + ',\t' + variableZ.units + CRLF;
        outString += '##FACTOR=\t' + 1.0 / scaleX + ',\t' + 1.0 / scale + ',\t' + 1.0 / scale + CRLF;

        if (spectraData.getXUnits() === 'PPM') {
            freq1 = spectraData.observeFrequencyX();
        }

        outString += '##FIRST=\t' + spectraData.getFirstX() * freq1 + ',\t' + spectraData.getY(0) + ',\t0' + CRLF;
        outString += '##LAST=\t' + spectraData.getLastX() * freq1 + ',\t' + spectraData.getLastY() + ',\t0' + CRLF;
    } else {
        freq1 = 1;
        if (spectraData.is2D()) {
            outString += '##VAR_NAME=\tFREQUENCY1,\tFREQUENCY2,\tSPECTRUM' + CRLF;
            outString += '##SYMBOL=\tF1,\tF2,\tY' + CRLF;
            outString += '##.NUCLEUS=\t' + spectraData.getNucleus(2) + ',\t' + spectraData.getNucleus(1) + CRLF;
            outString += '##VAR_TYPE=\tINDEPENDENT,\tINDEPENDENT,\tDEPENDENT' + CRLF;
            if (encodeFormat !== 'CSV' || encodeFormat !== 'PAC') {
                outString += '##VAR_FORM=\tAFFN,\tAFFN,\tASDF' + CRLF;
            } else {
                outString += '##VAR_FORM=\tAFFN,\tAFFN,\tASDF' + CRLF;
            }
            outString += '##VAR_DIM=\t' + spectraData.getNbSubSpectra() + ',\t' + spectraData.getNbPoints() + ',\t' + spectraData.getNbPoints() + CRLF;
            //We had to change this, for Mestre compatibility
            //outString+=("##UNITS=\tHZ,\t"+ spectraData.getXUnits() + ",\t" + spectraData.getYUnits()+CRLF);
            outString += '##UNITS=\tHZ,\tHZ,\t' + spectraData.getZUnits() + CRLF;
            if (spectraData.getXUnits() === 'PPM') {
                freq1 = spectraData.getParamDouble('2D_Y_FREQUENCY', 1);
            }
            if (spectraData.getYUnits() === 'PPM') {
                freq2 = spectraData.getParamDouble('2D_X_FREQUENCY', 1);
            }
            outString += '##FACTOR=\t1,\t' + freq2 / scaleX + ',\t' + 1.0 / scale + CRLF;
            outString += '##FIRST=\t' + spectraData.getParamDouble('firstY', 0) * freq1 + ',\t' + spectraData.getFirstX() * freq2 + ',\t' + spectraData.getY(0) + CRLF;
            outString += '##LAST=\t' + spectraData.getParamDouble('lastY', 0) * freq1 + ',\t' + spectraData.getLastX() * freq2
            + ',\t' + spectraData.getY(spectraData.getNbPoints() - 1) + CRLF;
        } else {
            outString += '##VAR_NAME=\t' + variableX.varname + ',\t' + variableY.varname + ',\t' + variableX.varname + CRLF;
            outString += '##SYMBOL=\t' + variableX.symbol + ',\t' + variableY.symbol + ',\t' + variableZ.symbol + CRLF;
            outString += '##VAR_TYPE=\t' + variableX.vartype + ',\t' + variableY.vartype + ',\t' + variableZ.vartype + CRLF;
            if (encodeFormat !== 'CSV' || encodeFormat !== 'PAC') {
                outString += '##VAR_FORM=\tAFFN,\tASDF,\tASDF' + CRLF;
            } else {
                outString += '##VAR_FORM=\tAFFN,\tAFFN,\tAFFN' + CRLF;
            }
            outString += '##VAR_DIM=\t' + variableX.vardim + ',\t' + variableY.vardim + ',\t' + variableZ.vardim + CRLF;
            outString += '##UNITS=\tHZ' + ',\t' + spectraData.getYUnits() + ',\t' + variableZ.units + CRLF;
            if (spectraData.getXUnits() === 'PPM') {
                freq1 = spectraData.observeFrequencyX();
            }
            outString += '##FACTOR=\t' + 1.0 / scaleX + ',\t' + 1.0 / scale + CRLF;
            outString += '##FIRST=\t' + variableX.first * freq1 + ',\t' + variableY.first + ',\t' + variableZ.first + CRLF;
            outString += '##LAST=\t' + variableX.last * freq1 + ',\t' + variableY.last + ',\t' + variableZ.last + CRLF;

        }
    }

    //Set the user defined parameters
    if (userDefinedParams !== null) {
        for (var i = userDefinedParams.length - 1; i >= 0; i--) {
            if (spectraData.containsParam(userDefinedParams[i])) {
                outString += '##' + userDefinedParams[i] + '= '
                + spectraData.getParam(userDefinedParams[i], '') + CRLF;
            }
        }
    }
    //Ordinate of the second dimension in case of 2D NMR spectra
    var yUnits = 0, lastY = 0, dy = 1;

    if (spectraData.is2D() && isNMR) {
        yUnits = spectraData.getParamDouble('firstY', 0) * freq1;
        lastY = spectraData.getParamDouble('lastY', 0) * freq1;
        dy = (lastY - yUnits) / (spectraData.getNbSubSpectra() - 1);
    }

    for (sub = 0; sub < spectraData.getNbSubSpectra(); sub++) {
        spectraData.setActiveElement(sub);
        yUnits = spectraData.getParamDouble('firstY', 0) * freq1 + dy*sub;
        outString += '##PAGE= ' + yUnits + CRLF;

        if (spectraData.is2D() && isNMR) {
            outString += '##FIRST=\t' + spectraData.getParamDouble('firstY', 0) * freq1 + ',\t'
            + spectraData.getFirstX() * freq2 + ',\t' + spectraData.getY(0) + CRLF;
        }

        outString += '##DATA TABLE= ';
        if (spectraData.isDataClassPeak()) {
            outString += '(XY..XY), PEAKS' + CRLF;
            for (let point = 0; point < spectraData.getNbPoints(); point++) {
                outString += spectraData.getX(point) + ', ' + spectraData.getY(point) + CRLF;
            }

        } else if (spectraData.isDataClassXY()) {
            if (isNMR) {
                if (spectraData.is2D()) {
                    outString += '(F2++(Y..Y)), PROFILE' + CRLF;
                } else {
                    if (sub % 2 === 0) {
                        outString += '(X++(R..R)), XYDATA' + CRLF;
                    } else {
                        outString += '(X++(I..I)), XYDATA' + CRLF;
                    }
                }
            } else {
                outString += '(X++(Y..Y)), XYDATA' + CRLF;
            }

            var tempString = '';
            var data = new Array(spectraData.getNbPoints());
            for (let point = data.length - 1; point >= 0; point--) {
                data[point] = Math.round((spectraData.getY(point) * scale));
            }

            tempString += Encoder.encode(data,
                spectraData.getFirstX() * scaleX, spectraData.getDeltaX() * scaleX, encodeFormat);
            outString += tempString + CRLF;
        }
    }
    outString += '##END NTUPLES= ' + nTuplesName + CRLF;
    outString += '##END= ';

    spectraData.setActiveElement(0);

    return outString;
}

function simpleHead(spectraData, scale, scaleX, encodeFormat, userDefinedParams) {
    //var variableX = spectraData.getSpectraVariable(0);
    //var variableY = spectraData.getSpectraVariable(1);
    var outString = '';
    if (spectraData.isDataClassPeak()) {
        outString += '##DATA CLASS= PEAK TABLE' + CRLF;
    }
    if (spectraData.isDataClassXY()) {
        outString += '##DATA CLASS= XYDATA' + CRLF;
    }

    spectraData.setActiveElement(0);
    //If it is a NMR spectrum
    if (spectraData.getDataType().indexOf('NMR') >= 0) {
        outString += '##.OBSERVE FREQUENCY= ' + spectraData.getParamDouble('observefrequency', 0) + CRLF;
        outString += '##.OBSERVE NUCLEUS= ^' + spectraData.getNucleus() + CRLF;
        outString += '##$DECIM= ' + (Math.round(spectraData.getParamDouble('$DECIM', 0))) + CRLF;
        outString += '##$DSPFVS= ' + (Math.round(spectraData.getParamDouble('$DSPFVS', 0))) + CRLF;
        outString += '##$FCOR= ' + (Math.round(spectraData.getParamDouble('$FCOR', 0))) + CRLF;
        outString += '##$SW_h= ' + spectraData.getParamDouble('$SW_h', 0) + CRLF;
        outString += '##$SW= ' + spectraData.getParamDouble('$SW', 0) + CRLF;
        outString += '##$TD= ' + (Math.round(spectraData.getParamDouble('$TD', 0))) + CRLF;
        outString += '##$GRPDLY= ' + spectraData.getParamDouble('$GRPDLY', 0) + CRLF;
        outString += '##$BF1= ' + spectraData.getParamDouble('$BF1', 0) + CRLF;
        outString += '##$SFO1= ' + spectraData.getParamDouble('$SFO1', 0) + CRLF;
        outString += '##$NUC1= <' + spectraData.getNucleus() + '>' + CRLF;
        outString += '##.SOLVENT NAME= ' + spectraData.getSolventName() + CRLF;

    }
    outString += '##XUNITS=\t' + spectraData.getXUnits() + CRLF;
    outString += '##YUNITS=\t' + spectraData.getYUnits() + CRLF;
    outString += '##NPOINTS=\t' + spectraData.getNbPoints() + CRLF;
    outString += '##FIRSTX=\t' + spectraData.getFirstX() + CRLF;
    outString += '##LASTX=\t' + spectraData.getLastX() + CRLF;
    outString += '##FIRSTY=\t' + spectraData.getFirstY() + CRLF;
    outString += '##LASTY=\t' + spectraData.getLastY() + CRLF;
    if (spectraData.isDataClassPeak()) {
        outString += '##XFACTOR=1' + CRLF;
        outString += '##YFACTOR=1' + CRLF;
    } else if (spectraData.isDataClassXY()) {
        outString += '##XFACTOR= ' + 1.0 / scaleX + CRLF;
        outString += '##YFACTOR= ' + 1.0 / scale + CRLF;
    }
    outString += '##MAXY= ' + spectraData.getMaxY() + CRLF;
    outString += '##MINY= ' + spectraData.getMinY() + CRLF;

    //Set the user defined parameters
    if (userDefinedParams !== null) {
        for (var i = userDefinedParams.length - 1; i >= 0; i--) {
            if (spectraData.containsParam(userDefinedParams[i])) {
                outString += '##' + userDefinedParams[i] + '= '
                + spectraData.getParam(userDefinedParams[i], '') + CRLF;
            }
        }
    }


    if (spectraData.isDataClassPeak()) {
        outString += '##PEAK TABLE= (XY..XY)' + CRLF;
        for (var point = 0; point < spectraData.getNbPoints(); point++) {
            outString += spectraData.getX(point) + ', ' + spectraData.getY(point) + CRLF;
        }
        outString += '##END ';

    } else if (spectraData.isDataClassXY()) {
        outString += '##DELTAX= ' + spectraData.getDeltaX() + CRLF;
        outString += '##XYDATA=(X++(Y..Y))' + CRLF;
        var tempString = '';
        var data = new Array(spectraData.getNbPoints());
        for (let point = data.length - 1; point >= 0; point--) {
            data[point] = Math.round(spectraData.getY(point) * scale);
        }

        tempString += Encoder.encode(data, spectraData.getFirstX() * scaleX, spectraData.getDeltaX() * scaleX, encodeFormat);

        outString += tempString + CRLF;
        outString += '##END= ';
    }

    spectraData.setActiveElement(0);
    return outString;
}

module.exports = JcampCreator;



/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
* class encodes a integer vector as a String in order to store it in a text file.
* The algorithms used to encode the data are describe in:
*            http://www.iupac.org/publications/pac/pdf/2001/pdf/7311x1765.pdf
* Created by acastillo on 3/2/16.
*/
const newLine = '\r\n';

const pseudoDigits = [['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              ['@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
              ['@', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'],
              ['%', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'],
              ['%', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r'],
              [' ', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 's']];

const SQZ_P = 1, SQZ_N = 2, DIF_P = 3, DIF_N = 4, DUP = 5, MaxLinelength = 100;

/**
 * This function encodes the given vector. The encoding format is specified by the
 * encoding option
 * @param {Array} data
 * @param {number} firstX
 * @param {number} intervalX
 * @param {string} encoding: ('FIX','SQZ','DIF','DIFDUP','CVS','PAC') Default 'DIFDUP'
 * @return {string}
 */
function encode(data, firstX, intervalX, encoding) {
    switch (encoding) {
        case 'FIX':
            return fixEncoding(data, firstX, intervalX);
        case 'SQZ':
            return squeezedEncoding(data, firstX, intervalX);
        case 'DIF':
            return differenceEncoding(data, firstX, intervalX);
        case 'DIFDUP':
            return differenceDuplicateEncoding(data, firstX, intervalX);
        case 'CSV':
            return commaSeparatedValuesEncoding(data, firstX, intervalX);
        case 'PAC':
            return packedEncoding(data, firstX, intervalX);
        default:
            return differenceEncoding(data, firstX, intervalX);
    }
}

/**
 * @private
 * No data compression used. The data is separated by a comma(',').
 * @param {Array} data
 * @param {number} firstX
 * @param {number} intervalX
 * @return {string}
 */
function commaSeparatedValuesEncoding(data, firstX, intervalX) {
    return fixEncoding(data, firstX, intervalX, ',');
}

/**
 * @private
 * No data compression used. The data is separated by the specified separator.
 * @param {Array} data
 * @param {number} firstX
 * @param {number} intervalX
 * @param {string} separator, The separator character
 * @return {string}
 */
function fixEncoding(data, firstX, intervalX, separator) {
    if (!separator) {
        separator = ' ';
    }
    var outputData = '';
    var j = 0, TD = data.length, i;
    while (j < TD - 7) {
        outputData += Math.ceil(firstX + j * intervalX);
        for (i = 0; i < 8; i++) {
            outputData += separator + data[j++];
        }
        outputData += newLine;
    }
    if (j < TD) {
        //We add last numbers
        outputData += Math.ceil(firstX + j * intervalX);
        for (i = j; i < TD; i++) {
            outputData += separator + data[i];
        }
    }
    return outputData;
}
/**
 * @private
 * No data compression used. The data is separated by the sign of the number.
 * @param {Array} data
 * @param {number} firstX
 * @param {number} intervalX
 * @return {string}
 */
function packedEncoding(data, firstX, intervalX) {
    var outputData = '';
    var j = 0, TD = data.length, i;

    while (j < TD - 7) {
        outputData += Math.ceil(firstX + j * intervalX);
        for (i = 0; i < 8; i++) {
            if (data[j] < 0) {
                outputData += '-' + data[j++];
            } else {
                outputData += '+' + data[j++];
            }
        }
        outputData += newLine;
    }
    if (j < TD) {
        //We add last numbers
        outputData += Math.ceil(firstX + j * intervalX);
        for (i = j; i < TD; i++) {
            if (data[i] < 0) {
                outputData += '-' + data[i];
            } else {
                outputData += '+' + data[i];
            }
        }
    }
    return outputData;
}
/**
 * @private
 * Data compression is possible using the squeezed form (SQZ) in which the delimiter, the leading digit,
 * and sign are replaced by a pseudo-digit from Table 1. For example, the Y-values 30, 32 would be
 * represented as C0C2.
 * @param {Array} data
 * @param {number} firstX
 * @param {number} intervalX
 * @return {string}
 */
function squeezedEncoding(data, firstX, intervalX) {
    var outputData = '';
    //String outputData = new String();
    var j = 0, TD = data.length, i;

    while (j < TD - 10) {
        outputData += Math.ceil(firstX + j * intervalX);
        for (i = 0; i < 10; i++) {
            outputData += squeezedDigit(data[j++].toString());
        }
        outputData += newLine;
    }
    if (j < TD) {
        //We add last numbers
        outputData += Math.ceil(firstX + j * intervalX);
        for (i = j; i < TD; i++) {
            outputData += squeezedDigit(data[i].toString());
        }
    }

    return outputData;
}

/**
 * @private
 * Duplicate suppression encoding
 * @param {Array} data
 * @param {number} firstX
 * @param {number} intervalX
 * @return {string}
 */
function differenceDuplicateEncoding(data, firstX, intervalX) {
    var mult = 0, index = 0, charCount = 0, i;
    //We built a string where we store the encoded data.
    var encodData = '', encodNumber = '', temp = '';

    //We calculate the differences vector
    var diffData = new Array(data.length - 1);
    for (i = 0; i < diffData.length; i++) {
        diffData[i] = data[i + 1] - data[i];
    }

    //We simulate a line carry
    var numDiff = diffData.length;
    while (index < numDiff) {
        if (charCount === 0) {//Start line
            encodNumber = Math.ceil(firstX + index * intervalX) + squeezedDigit(data[index].toString()) + differenceDigit(diffData[index].toString());
            encodData += encodNumber;
            charCount += encodNumber.length;
        } else {
            //Try to insert next difference
            if (diffData[index - 1] === diffData[index]) {
                mult++;
            } else {
                if (mult > 0) {//Now we know that it can be in line
                    mult++;
                    encodNumber = duplicateDigit(mult.toString());
                    encodData += encodNumber;
                    charCount += encodNumber.length;
                    mult = 0;
                    index--;
                } else {
                    //Mirar si cabe, en caso contrario iniciar una nueva linea
                    encodNumber = differenceDigit(diffData[index].toString());
                    if (encodNumber.length + charCount < MaxLinelength) {
                        encodData += encodNumber;
                        charCount += encodNumber.length;
                    } else {//Iniciar nueva linea
                        encodData += newLine;
                        temp = Math.ceil(firstX + index * intervalX) + squeezedDigit(data[index].toString()) + encodNumber;
                        encodData += temp;//Each line start with first index number.
                        charCount = temp.length;
                    }
                }
            }
        }
        index++;
    }
    if (mult > 0) {
        encodData += duplicateDigit((mult + 1).toString());
    }
    //We insert the last data from fid. It is done to control of data
    //The last line start with the number of datas in the fid.
    encodData += newLine + Math.ceil(firstX + index * intervalX) + squeezedDigit(data[index].toString());

    return encodData;
}

/**
 * @private
 * Differential encoding
 * @param {Array} data
 * @param {number} firstX
 * @param {number} intervalX
 * @return {string}
 */
function differenceEncoding(data, firstX, intervalX) {
    var index = 0, charCount = 0, i;

    var encodData = '';
    //String encodData = new String();
    var encodNumber = '', temp = '';

    //We calculate the differences vector
    var diffData = new Array(data.length - 1);
    for (i = 0; i < diffData.length; i++) {
        diffData[i] = data[i + 1] - data[i];
    }

    index = 0;
    var numDiff = diffData.length;
    while (index < numDiff) {
        if (charCount === 0) {//Iniciar linea
            //We convert the first number.
            encodNumber = Math.ceil(firstX + index * intervalX) + squeezedDigit(data[index].toString()) + differenceDigit(diffData[index].toString());
            encodData += encodNumber;
            charCount += encodNumber.length;
        } else {
            //Mirar si cabe, en caso contrario iniciar una nueva linea
            encodNumber = differenceDigit(diffData[index].toString());
            if (encodNumber.length + charCount < MaxLinelength) {
                encodData += encodNumber;
                charCount += encodNumber.length;
            } else {//Iniciar nueva linea
                encodData += newLine;
                temp = Math.ceil(firstX + index * intervalX) + squeezedDigit(data[index].toString()) + encodNumber;
                encodData += temp;//Each line start with first index number.
                charCount = temp.length;
            }
        }
        index++;
    }
    //We insert the last number from data. It is done to control of data
    encodData += newLine + Math.ceil(firstX + index * intervalX) + squeezedDigit(data[index].toString());

    return encodData;
}

/**
 * @private
 * Convert number to the ZQZ format, using pseudo digits.
 * @param {number} num
 * @return {string}
 */
function squeezedDigit(num) {
    //console.log(num+" "+num.length);
    var SQZdigit = '';
    if (num.charAt(0) === '-') {
        SQZdigit += pseudoDigits[SQZ_N][num.charAt(1)];
        if (num.length > 2) {
            SQZdigit += num.substring(2);
        }
    } else {
        SQZdigit += pseudoDigits[SQZ_P][num.charAt(0)];
        if (num.length > 1) {
            SQZdigit += num.substring(1);
        }
    }

    return SQZdigit;
}
/**
 * @private
 * Convert number to the DIF format, using pseudo digits.
 * @param {number} num
 * @return {string}
 */
function differenceDigit(num) {
    var DIFFdigit = '';

    if (num.charAt(0) === '-') {
        DIFFdigit += pseudoDigits[DIF_N][num.charAt(1)];
        if (num.length > 2) {
            DIFFdigit += num.substring(2);
        }

    } else {
        DIFFdigit += pseudoDigits[DIF_P][num.charAt(0)];
        if (num.length > 1) {
            DIFFdigit += num.substring(1);
        }

    }

    return DIFFdigit;
}
/**
 * @private
 * Convert number to the DUP format, using pseudo digits.
 * @param {number} num
 * @return {string}
 */
    function duplicateDigit(num) {
    var DUPdigit = '';
    DUPdigit += pseudoDigits[DUP][num.charAt(0)];
    if (num.length > 1) {
        DUPdigit += num.substring(1);
    }

    return DUPdigit;
}

module.exports = {
    encode,
    fixEncoding,
    commaSeparatedValuesEncoding,
    packedEncoding,
    squeezedEncoding,
    differenceDuplicateEncoding,
    differenceEncoding
};


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 * This library implements the J analyser described by Cobas et al in the paper:
 * A two-stage approach to automatic determination of 1H NMR coupling constants
 */


const patterns = ['s', 'd', 't', 'q', 'quint', 'h', 'sept', 'o', 'n'];
var symRatio = 1.5;
var maxErrorIter1 = 2.5;//Hz
var maxErrorIter2 = 1;//Hz

module.exports = {
    /**
     * The compilation process implements at the first stage a normalization procedure described by Golotvin et al.
     * embedding in peak-component-counting method described by Hoyes et al.
     * @param {object} signal
     * @private
     */
    compilePattern: function (signal) {
        //if (DEBUG) console.log('Debugin...');

        signal.multiplicity = 'm';//By default the multiplicity is massive
        // 1.1 symmetrize
        // It will add a set of peaks(signal.peaksComp) to the signal that will be used during
        // the compilation process. The unit of those peaks will be in Hz
        signal.symRank = symmetrizeChoiseBest(signal, maxErrorIter1, 1);
        signal.asymmetric = true;
       // console.log(signal.delta1+" "+signal.symRank);
        //Is the signal symmetric?
        if (signal.symRank >= 0.95 && signal.peaksComp.length < 32) {
            //if (DEBUG)console.log(signal.delta1 + ' nbPeaks ' + signal.peaksComp.length);
            signal.asymmetric = false;
            var i, j, n, k = 1, P1, Jc = [], n2, maxFlagged;
            //Loop over the possible number of coupling contributing to the multiplet
            for (n = 0; n < 9; n++) {
                //if (DEBUG)console.log('Trying ' + n + ' couplings');
                //1.2 Normalize. It makes a deep copy of the peaks before to modify them.
                var peaks = normalize(signal, n);
                //signal.peaksCompX = peaks;
                var validPattern = false;//It will change to true, when we find the good patter
                //Lets check if the signal could be a singulet.
                if (peaks.length === 1 && n === 0) {
                    validPattern = true;
                } else {
                    if (peaks.length <= 1) {
                        continue;
                    }
                }
                // 1.3 Establish a range for the Heights Hi [peaks.intensity*0.85,peaks.intensity*1.15];
                var ranges = getRanges(peaks);
                n2 = Math.pow(2, n);

                /*if (DEBUG) {
                    console.log('ranges: ' + JSON.stringify(ranges));
                    console.log('Target sum: ' + n2);
                }*/

                // 1.4 Find a combination of integer heights Hi, one from each Si, that sums to 2^n.
                var heights = null;
                while (!validPattern && (heights = getNextCombination(ranges, n2)) !== null) {

                    /*if (DEBUG) {
                        console.log('Possible pattern found with ' + n + ' couplings!!!');
                        console.log(heights);
                    }*/
                    // 2.1 Number the components of the multiplet consecutively from 1 to 2n,
                    //starting at peak 1
                    var numbering = new Array(heights.length);
                    k = 1;
                    for (i = 0; i < heights.length; i++) {
                        numbering[i] = new Array(heights[i]);
                        for (j = 0; j < heights[i]; j++) {
                            numbering[i][j] = k++;
                        }
                    }

                    //if (DEBUG) console.log('Numbering: ' + JSON.stringify(numbering));

                    Jc = []; //The array to store the detected j-coupling
                    // 2.2 Set j = 1; J1 = P2 - P1. Flag components 1 and 2 as accounted for.
                    j = 1;
                    Jc.push(peaks[1].x - peaks[0].x);
                    P1 = peaks[0].x;
                    numbering[0].splice(0, 1);//Flagged
                    numbering[1].splice(0, 1);//Flagged
                    k = 1;
                    var nFlagged = 2;
                    maxFlagged = Math.pow(2, n) - 1;
                    while (Jc.length < n && nFlagged < maxFlagged && k < peaks.length) {
                        /*if (DEBUG) {
                            console.log('New Jc' + JSON.stringify(Jc));
                            console.log('Aval. numbering ' + JSON.stringify(numbering));
                        }*/
                        // 4.1. Increment j. Set k to the number of the first unflagged component.
                        j++;
                        while (k < peaks.length && numbering[k].length === 0) {
                            k++;
                        }
                        if (k < peaks.length) {
                            // 4.2 Jj = Pk - P1.
                            Jc.push(peaks[k].x - peaks[0].x);
                            //Flag component k and, for each sum of the...
                            numbering[k].splice(0, 1);//Flageed
                            nFlagged++;
                            //Flag the other components of the multiplet
                            for (var u = 2; u <= j; u++) {
                                //TODO improve those loops
                                var jSum = 0;
                                for (i = 0; i < u; i++) {
                                    jSum += Jc[i];
                                }
                                for (i = 1; i < numbering.length; i++) {
                                    //Maybe 0.25 Hz is too much?
                                    if (Math.abs(peaks[i].x - (P1 + jSum)) < 0.25) {
                                        numbering[i].splice(0, 1);//Flageed
                                        nFlagged++;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    //Calculate the ideal patter by using the extracted j-couplings
                    var pattern = idealPattern(Jc);
                    //Compare the ideal pattern with the proposed intensities.
                    // All the intensities have to match to accept the multiplet
                    validPattern = true;
                    for (i = 0; i < pattern.length; i++) {
                        if (pattern[i].intensity !== heights[i]) {
                            validPattern = false;
                        }
                    }
                    //More verbosity of the process
                    /*if (DEBUG) {
                        console.log('Jc ' + JSON.stringify(Jc));
                        console.log('Heights ' + JSON.stringify(heights));
                        console.log('pattern ' + JSON.stringify(pattern));
                        console.log('Valid? ' + validPattern);
                    }*/
                }
                //If we found a valid pattern we should inform about the pattern.
                if (validPattern) {
                    updateSignal(signal, Jc);
                }
            }
        }

        //Before to return, change the units of peaksComp from Hz to PPM again
        for (i = 0; i < signal.peaksComp.length; i++) {
            signal.peaksComp[i].x /= signal.observe;
        }
    }
};

function updateSignal(signal, Jc) {
    //Update the limits of the signal
    var peaks = signal.peaksComp;//Always in Hz
    var nbPeaks = peaks.length;
    signal.startX = peaks[0].x / signal.observe - peaks[0].width;
    signal.stopX = peaks[nbPeaks - 1].x / signal.observe + peaks[nbPeaks - 1].width;

    signal.integralData.from = peaks[0].x / signal.observe - peaks[0].width * 3;
    signal.integralData.to = peaks[nbPeaks - 1].x / signal.observe + peaks[nbPeaks - 1].width * 3;

    //Compile the pattern and format the constant couplings
    signal.maskPattern = signal.mask2;
    signal.multiplicity = abstractPattern(signal, Jc);
    signal.pattern = signal.multiplicity;//Our library depends on this parameter, but it is old
    //console.log(signal);
    /*if (DEBUG)        {
        console.log('Final j-couplings: ' + JSON.stringify(Jc));
    }*/
}

/**
 * Returns the multiplet in the compact format
 * @param {object} signal
 * @param {object} Jc
 * @return {string}
 * @private
 */
function abstractPattern(signal, Jc) {
    var tol = 0.05,
        i,
        pattern = '',
        cont = 1,
        newNmrJs = [];

    if (Jc && Jc.length > 0) {
        Jc.sort(function (a, b) {
            return a - b;
        });

        for (i = 0; i < Jc.length - 1; i++) {

            if (Math.abs(Jc[i] - Jc[i + 1]) < tol) {
                cont++;
            } else {
                newNmrJs.push({'coupling': Math.abs(Jc[i]), 'multiplicity': patterns[cont]});
                pattern += patterns[cont];
                cont = 1;
            }
        }
        newNmrJs.push({'coupling': Math.abs(Jc[i]), 'multiplicity': patterns[cont]});
        pattern += patterns[cont];
        signal.nmrJs = newNmrJs;
    } else {
        pattern = 's';
        if (Math.abs(signal.startX - signal.stopX) * signal.observe > 16) {
            pattern = 'br s';
        }
    }
    return pattern;
}

/**
 * This function creates an ideal pattern from the given J-couplings
 * @private
 * @param {Array} Jc
 * @return {*[]}
 * @private
 */
function idealPattern(Jc) {
    var hsum = Math.pow(2, Jc.length), i, j;
    var pattern = [{x: 0, intensity: hsum}];
    //To split the initial height
    for (i = 0; i < Jc.length; i++) {
        for (j = pattern.length - 1; j >= 0; j--) {
            pattern.push({x: pattern[j].x + Jc[i] / 2,
                intensity: pattern[j].intensity / 2});
            pattern[j].x = pattern[j].x - Jc[i] / 2;
            pattern[j].intensity = pattern[j].intensity / 2;
        }
    }
    //To sum the heights in the same positions
    pattern.sort(function compare(a, b) {
        return a.x - b.x;
    });
    for (j = pattern.length - 2; j >= 0; j--) {
        if (Math.abs(pattern[j].x - pattern[j + 1].x) < 0.1) {
            pattern[j].intensity += pattern[j + 1].intensity;
            pattern.splice(j + 1, 1);
        }
    }
    return pattern;
}

/**
 * Find a combination of integer heights Hi, one from each Si, that sums to 2n.
 * @param {object} ranges
 * @param {number} value
 * @return {*}
 * @private
 */
function getNextCombination(ranges, value) {
    var half = Math.ceil(ranges.values.length / 2), lng = ranges.values.length;
    var sum = 0, i, ok;
    while (sum !== value) {
        //Update the indexes to point at the next possible combination
        ok = false;
        while (!ok) {
            ok = true;
            ranges.currentIndex[ranges.active]++;
            if (ranges.currentIndex[ranges.active] >= ranges.values[ranges.active].length) {
                //In this case, there is no more possible combinations
                if (ranges.active + 1 === half) {
                    return null;
                } else {
                    //If this happens we need to try the next active peak
                    ranges.currentIndex[ranges.active] = 0;
                    ok = false;
                    ranges.active++;
                }
            } else {
                ranges.active = 0;
            }
        }
        // Sum the heights for this combination
        sum = 0;
        for (i = 0; i < half; i++) {
            sum += ranges.values[i][ranges.currentIndex[i]] * 2;
        }
        if (ranges.values.length % 2 !== 0) {
            sum -= ranges.values[half - 1][ranges.currentIndex[half - 1]];
        }
        /*if (DEBUG) {
            console.log(ranges.currentIndex);
            console.log(sum + ' ' + value);
        }*/
    }
    //If the sum is equal to the expected value, fill the array to return
    if (sum === value) {
        var heights = new Array(lng);
        for (i = 0; i < half; i++) {
            heights[i] = ranges.values[i][ranges.currentIndex[i]];
            heights[lng - i - 1] = ranges.values[i][ranges.currentIndex[i]];
        }
        return heights;
    }
    return null;
}

/**
 * This function generates the possible values that each peak can contribute
 * to the multiplet.
 * @param {Array} Array of objects with peaks information {intensity}
 * @return {{values: Array, currentIndex: Array, active: number}}
 */
function getRanges(peaks) {
    var ranges = new Array(peaks.length);
    var currentIndex = new Array(peaks.length);
    var min, max;
    ranges[0] = [1];
    ranges[peaks.length - 1] = [1];
    currentIndex[0] = -1;
    currentIndex[peaks.length - 1] = 0;
    for (var i = 1; i < peaks.length - 1; i++) {
        min = Math.round(peaks[i].intensity * 0.85);
        max = Math.round(peaks[i].intensity * 1.15);
        ranges[i] = [];
        for (var j = min; j <= max; j++) {
            ranges[i].push(j);
        }
        currentIndex[i] = 0;
    }
    return {values: ranges, currentIndex: currentIndex, active: 0};
}
/**
 * Performs a symmetrization of the signal by using different aproximations to the center.
 * It will return the result of the symmetrization that removes less peaks from the signal
 * @param {object} signal
 * @param {number} maxError
 * @param {number} iteration
 * @return {*}
 * @private
 */
function symmetrizeChoiseBest(signal, maxError, iteration) {
    var symRank1 = symmetrize(signal, maxError, iteration);
    var tmpPeaks = signal.peaksComp;
    var tmpMask = signal.mask;
    var cs = signal.delta1;
    signal.delta1 = (signal.peaks[0].x + signal.peaks[signal.peaks.length - 1].x) / 2;
    var symRank2 = symmetrize(signal, maxError, iteration);
    if (signal.peaksComp.length > tmpPeaks.length) {
        return symRank2;
    } else {
        signal.delta1 = cs;
        signal.peaksComp = tmpPeaks;
        signal.mask = tmpMask;
        return symRank1;
    }

}

/**
 * This function will return a set of symmetric peaks that will
 * be the enter point for the patter compilation process.
 * @param {object} signal
 * @param {number} maxError
 * @param {number} iteration
 * @return {number}
 * @private
 */
function symmetrize(signal, maxError, iteration) {
    //Before to symmetrize we need to keep only the peaks that possibly conforms the multiplete
    var max, min, avg, ratio, avgWidth, j;
    var peaks = new Array(signal.peaks.length);
    //Make a deep copy of the peaks and convert PPM ot HZ
    for (j = 0; j < peaks.length; j++) {
        peaks[j] = {x: signal.peaks[j].x * signal.observe,
            intensity: signal.peaks[j].intensity,
            width: signal.peaks[j].width};
    }
    //Join the peaks that are closer than 0.25 Hz
    for (j = peaks.length - 2; j >= 0; j--) {
        if (Math.abs(peaks[j].x - peaks[j + 1].x) < 0.25) {
            peaks[j].x = (peaks[j].x * peaks[j].intensity + peaks[j + 1].x * peaks[j + 1].intensity);
            peaks[j].intensity = peaks[j].intensity + peaks[j + 1].intensity;
            peaks[j].x /= peaks[j].intensity;
            peaks[j].intensity /= 2;
            peaks[j].width += peaks[j + 1].width;
            peaks.splice(j + 1, 1);
        }
    }
    signal.peaksComp = peaks;
    var nbPeaks = peaks.length;
    var mask = new Array(nbPeaks);
    signal.mask = mask;
    var left = 0, right = peaks.length - 1, cs = signal.delta1 * signal.observe, middle = [(peaks[0].x + peaks[nbPeaks - 1].x) / 2, 1];
    maxError = error(Math.abs(cs - middle[0]));
    var heightSum = 0;
    //We try to symmetrize the extreme peaks. We consider as candidates for symmetricing those which have
    //ratio smaller than 3
    for (var i = 0; i < nbPeaks; i++) {
        mask[i] = true;
        heightSum += signal.peaks[i].intensity;
    }

    while (left <= right) {
        mask[left] = true;
        mask[right] = true;
        if (left === right) {
            if (nbPeaks > 2 && Math.abs(peaks[left].x - cs) > maxError) {
                mask[left] = false;
            }
        } else {
            max = Math.max(peaks[left].intensity, peaks[right].intensity);
            min = Math.min(peaks[left].intensity, peaks[right].intensity);
            ratio = max / min;
            if (ratio > symRatio) {
                if (peaks[left].intensity === min) {
                    mask[left] = false;
                    right++;
                } else {
                    mask[right] = false;
                    left--;
                }
            } else {
                var diffL = Math.abs(peaks[left].x - cs);
                var diffR = Math.abs(peaks[right].x - cs);

                if (Math.abs(diffL - diffR) < maxError) {
                    //avg = (peaks[left].intensity+peaks[right].intensity)/2;
                    avg = Math.min(peaks[left].intensity, peaks[right].intensity);
                    avgWidth = Math.min(peaks[left].width, peaks[right].width);
                    peaks[left].intensity = peaks[right].intensity = avg;
                    peaks[left].width = peaks[right].width = avgWidth;
                    middle = [middle[0] + ((peaks[right].x + peaks[left].x) / 2), middle[1] + 1];
                } else {
                    if (Math.max(diffL, diffR) === diffR) {
                        mask[right] = false;
                        left--;
                    } else {
                        mask[left] = false;
                        right++;
                    }
                }
                /*if (DEBUG) {
                    console.log('MaxError: ' + maxError + ' ' + middle[0] + ' ' + middle[1]);
                    console.log(iteration + ' CS: ' + cs + ' Hz ' + cs / signal.observe + ' PPM');
                    console.log('Middle: ' + (middle[0] / middle[1]) + ' Hz ' + (middle[0] / middle[1]) / signal.observe + ' PPM');
                    console.log(diffL + ' ' + diffR);
                    console.log(Math.abs(diffL - diffR));
                    console.log(JSON.stringify(peaks));
                    console.log(JSON.stringify(mask));
                }*/
            }
        }
        left++;
        right--;
        //Only alter cs if it is the first iteration of the sym process.
        if (iteration === 1) {
            cs = chemicalShift(peaks, mask);
            //There is not more available peaks
            if (isNaN(cs)) {
                return 0;
            }
        }
        maxError = error(Math.abs(cs - middle[0] / middle[1]));
    }
    //To remove the weak peaks and recalculate the cs
    for (i = nbPeaks - 1; i >= 0; i--) {
        if (mask[i] === false) {
            peaks.splice(i, 1);
        }
    }
    cs = chemicalShift(peaks);
    if (isNaN(cs)) {
        return 0;
    }
    signal.delta1 = cs / signal.observe;
    //Now, the peak should be symmetric in heights, but we need to know if it is symmetric in x
    let symFactor = 0, weight = 0;
    if (peaks.length > 1) {
        for (i = Math.ceil(peaks.length / 2) - 1; i >= 0; i--) {
            symFactor += (3 + Math.min(Math.abs(peaks[i].x - cs), Math.abs(peaks[peaks.length - 1 - i].x - cs)))
                / (3 + Math.max(Math.abs(peaks[i].x - cs), Math.abs(peaks[peaks.length - 1 - i].x - cs))) * peaks[i].intensity;
            weight += peaks[i].intensity;
        }
        symFactor /= weight;
    } else {
        if (peaks.length === 1) {
            symFactor = 1;
        }
    }
    var newSumHeights = 0;
    for (i = 0; i < peaks.length; i++) {
        newSumHeights += peaks[i].intensity;
    }
    symFactor -= (heightSum - newSumHeights) / heightSum * 0.12; //Removed peaks penalty
    /*if (DEBUG) {
        console.log('Penalty ' + (heightSum - newSumHeights) / heightSum * 0.12);
        console.log('cs: ' + (cs / signal.observe) + ' symFactor: ' + symFactor);
    }*/
    //Sometimes we need a second opinion after the first symmetrization.
    if (symFactor > 0.8 && symFactor < 0.97 && iteration < 2) {
        return symmetrize(signal, maxErrorIter2, 2);
    } else {
        //Center the given pattern at cs and symmetrize x
        if (peaks.length > 1) {
            let dxi;
            for (i = Math.ceil(peaks.length / 2) - 1; i >= 0; i--) {
                dxi = (peaks[i].x - peaks[peaks.length - 1 - i].x) / 2.0;
                peaks[i].x = cs + dxi;
                peaks[peaks.length - 1 - i].x = cs - dxi;
            }
        }
    }
    return symFactor;
}
/**
 * Error validator
 * @param {number} value
 * @return {number}
 * @private
 */
function error(value) {
    var maxError = value * 2.5;
    if (maxError < 0.75) {
        maxError = 0.75;
    }
    if (maxError > 3) {
        maxError = 3;
    }
    return maxError;
}
/**
 * 2 stages normalizarion of the peaks heights to Math.pow(2,n).
 * Creates a new mask with the peaks that could contribute to the multiplete
 * @param {object} signal
 * @param {number} n
 * @return {*}
 */
function normalize(signal, n) {
    //Perhaps this is slow
    var peaks = JSON.parse(JSON.stringify(signal.peaksComp));
    var norm = 0, norm2 = 0, i;//Math.pow(2,n);
    for (i = 0; i < peaks.length; i++) {
        norm += peaks[i].intensity;
    }
    norm = Math.pow(2, n) / norm;
    signal.mask2 = JSON.parse(JSON.stringify(signal.mask));
    //console.log("Mask0 "+JSON.stringify(signal.mask2));
    var index = signal.mask2.length - 1;
    for (i = peaks.length - 1; i >= 0; i--) {
        peaks[i].intensity *= norm;
        while (index >= 0 && signal.mask2[index] === false) {
            index--;
        }
        if (peaks[i].intensity < 0.75) {
            //if (DEBUG) console.log('Peak ' + i + ' does not seem to belong to this multiplet ' + peaks[i].intensity);
            peaks.splice(i, 1);
            signal.mask2[index] = false;
        } else {
            norm2 += peaks[i].intensity;
        }
        index--;
    }
    norm2 = Math.pow(2, n) / norm2;
    for (i = peaks.length - 1; i >= 0; i--) {
        peaks[i].intensity *= norm2;
    }
    //console.log("Mask1 "+JSON.stringify(signal.mask2));
    //if (DEBUG) console.log(JSON.stringify(peaks));
    return peaks;
}

/**
 * Calculates the chemical shift as the weighted sum of the peaks
 * @param {Array} peaks
 * @param {Array} mask
 * @return {number}
 */
function chemicalShift(peaks, mask) {
    var sum = 0, cs = 0, i, area;
    if (mask) {
        for (i = 0; i < peaks.length; i++) {
            //console.log(mask[i]);
            if (mask[i] === true) {
                area = getArea(peaks[i]);
                sum += area;
                cs += area * peaks[i].x;
            }
        }
    } else {
        for (i = 0; i < peaks.length; i++) {
            area = getArea(peaks[i]);
            sum += area;
            cs += area * peaks[i].x;
        }
    }
    return cs / sum;
}

/**
 * Return the area of a Lorentzian function
 * @param {object} peak - object with peak information
 * @return {number}
 * @private
 */
function getArea(peak) {
    return Math.abs(peak.intensity * peak.width * 1.57);//1.772453851);
}


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var PeakOptimizer = __webpack_require__(38);
var simpleClustering = __webpack_require__(83);
var matrixPeakFinders = __webpack_require__(70);
var FFTUtils = __webpack_require__(27).FFTUtils;

const smallFilter = [
    [0, 0, 1, 2, 2, 2, 1, 0, 0],
    [0, 1, 4, 7, 7, 7, 4, 1, 0],
    [1, 4, 5, 3, 0, 3, 5, 4, 1],
    [2, 7, 3, -12, -23, -12, 3, 7, 2],
    [2, 7, 0, -23, -40, -23, 0, 7, 2],
    [2, 7, 3, -12, -23, -12, 3, 7, 2],
    [1, 4, 5, 3, 0, 3, 5, 4, 1],
    [0, 1, 3, 7, 7, 7, 3, 1, 0],
    [0, 0, 1, 2, 2, 2, 1, 0, 0]];

function getZones(spectraData, thresholdFactor) {
    if (thresholdFactor === 0) {
        thresholdFactor = 1;
    }
    if (thresholdFactor < 0) {
        thresholdFactor = -thresholdFactor;
    }
    var nbPoints = spectraData.getNbPoints();
    var nbSubSpectra = spectraData.getNbSubSpectra();

    var data = new Array(nbPoints * nbSubSpectra);
    var isHomonuclear = spectraData.isHomoNuclear();

    for (var iSubSpectra = 0; iSubSpectra < nbSubSpectra; iSubSpectra++) {
        var spectrum = spectraData.getYData(iSubSpectra);
        for (var iCol = 0; iCol < nbPoints; iCol++) {
            if (isHomonuclear) {
                data[iSubSpectra * nbPoints + iCol] = (spectrum[iCol] > 0 ? spectrum[iCol] : 0);
            } else {
                data[iSubSpectra * nbPoints + iCol] = Math.abs(spectrum[iCol]);
            }
        }
    }

    var nStdDev = getLoGnStdDevNMR(spectraData);
    if (isHomonuclear) {
        let convolutedSpectrum = FFTUtils.convolute(data, smallFilter, nbSubSpectra, nbPoints);
        let peaksMC1 = matrixPeakFinders.findPeaks2DRegion(data, {filteredData: convolutedSpectrum, rows: nbSubSpectra, cols: nbPoints, nStdDev: nStdDev * thresholdFactor});//)1.5);
        var peaksMax1 = matrixPeakFinders.findPeaks2DMax(data, {filteredData: convolutedSpectrum, rows: nbSubSpectra, cols: nbPoints, nStdDev: (nStdDev + 0.5) * thresholdFactor});//2.0);
        for (var i = 0; i < peaksMC1.length; i++) {
            peaksMax1.push(peaksMC1[i]);
        }
        return PeakOptimizer.enhanceSymmetry(createSignals2D(peaksMax1, spectraData, 24));

    } else {
        let convolutedSpectrum = FFTUtils.convolute(data, smallFilter, nbSubSpectra, nbPoints);
        let peaksMC1 = matrixPeakFinders.findPeaks2DRegion(data, {filteredData: convolutedSpectrum, rows: nbSubSpectra, cols: nbPoints, nStdDev: nStdDev * thresholdFactor});
        //Peak2D[] peaksMC1 = matrixPeakFinders.findPeaks2DMax(data, nbSubSpectra, nbPoints, (nStdDev+0.5)*thresholdFactor);
        //Remove peaks with less than 3% of the intensity of the highest peak
        return createSignals2D(PeakOptimizer.clean(peaksMC1, 0.05), spectraData, 24);
    }

}


//How noisy is the spectrum depending on the kind of experiment.
function getLoGnStdDevNMR(spectraData) {
    if (spectraData.isHomoNuclear()) {
        return 1.5;
    } else {
        return 3;
    }
}

/**
 * This function converts a set of 2D-peaks in 2D-signals. Each signal could be composed
 * of many 2D-peaks, and it has some additional information related to the NMR spectrum.
 * @param {Array} peaks 
 * @param {NMR} spectraData
 * @param {number} tolerance
 * @return {Array} 
 * @private
 */
function createSignals2D(peaks, spectraData, tolerance) {

    var bf1 = spectraData.observeFrequencyX();
    var bf2 = spectraData.observeFrequencyY();

    var firstY = spectraData.getFirstY();
    var dy = spectraData.getDeltaY();
    var i;
    for (i = peaks.length - 1; i >= 0; i--) {
        peaks[i].x = (spectraData.arrayPointToUnits(peaks[i].x));
        peaks[i].y = (firstY + dy * (peaks[i].y));

        //Still having problems to correctly detect peaks on those areas. So I'm removing everything there.
        if (peaks[i].y < -1 || peaks[i].y >= 210) {
            peaks.splice(i, 1);
        }
    }
    //The connectivity matrix is an square and symmetric matrix, so we'll only store the upper diagonal in an
    //array like form
    var connectivity = [];
    var tmp = 0;
    tolerance *= tolerance;
    //console.log(tolerance);
    for (i = 0; i < peaks.length; i++) {
        for (var j = i; j < peaks.length; j++) {
            tmp = Math.pow((peaks[i].x - peaks[j].x) * bf1, 2) + Math.pow((peaks[i].y - peaks[j].y) * bf2, 2);
            if (tmp < tolerance) {//30*30Hz We cannot distinguish peaks with less than 20 Hz of separation
                connectivity.push(1);
            } else {
                connectivity.push(0);
            }
        }
    }

    var clusters = simpleClustering(connectivity);

    var signals = [];
    if (peaks != null) {
        for (var iCluster = 0; iCluster < clusters.length; iCluster++) {
            var signal = {nucleusX: spectraData.getNucleus(1), nucleusY: spectraData.getNucleus(2)};
            signal.resolutionX = (spectraData.getLastX() - spectraData.getFirstX()) / spectraData.getNbPoints();
            signal.resolutionY = dy;
            var peaks2D = [];
            signal.shiftX = 0;
            signal.shiftY = 0;
            var minMax1 = [Number.MAX_VALUE, 0];
            var minMax2 = [Number.MAX_VALUE, 0];
            var sumZ = 0;
            for (var jPeak = clusters[iCluster].length - 1; jPeak >= 0; jPeak--) {
                if (clusters[iCluster][jPeak] === 1) {
                    peaks2D.push({
                        x: peaks[jPeak].x,
                        y: peaks[jPeak].y,
                        z: peaks[jPeak].z

                    });
                    signal.shiftX += peaks[jPeak].x * peaks[jPeak].z;
                    signal.shiftY += peaks[jPeak].y * peaks[jPeak].z;
                    sumZ += peaks[jPeak].z;
                    if (peaks[jPeak].x < minMax1[0]) {
                        minMax1[0] = peaks[jPeak].x;
                    }
                    if (peaks[jPeak].x > minMax1[1]) {
                        minMax1[1] = peaks[jPeak].x;
                    }
                    if (peaks[jPeak].y < minMax2[0]) {
                        minMax2[0] = peaks[jPeak].y;
                    }
                    if (peaks[jPeak].y > minMax2[1]) {
                        minMax2[1] = peaks[jPeak].y;
                    }

                }
            }
            signal.fromTo = [{from: minMax1[0], to: minMax1[1]},
                {from: minMax2[0], to: minMax2[1]}];
            signal.shiftX /= sumZ;
            signal.shiftY /= sumZ;
            signal.peaks = peaks2D;
            signals.push(signal);
        }
    }
    return signals;
}

module.exports = getZones;


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const JAnalyzer = __webpack_require__(104);
const Ranges = __webpack_require__(13);
//var extend = require("extend");
//var removeImpurities = require('./ImpurityRemover');

const defaultOptions = {
    nH: 99,
    clean: true,
    compile: true,
    integralType: 'sum',
    idPrefix: '',
    format: 'new',         // TODO: remove support for old format
    frequencyCluster: 16
};
/**
 * This function clustering peaks and calculate the integral value for each range from the peak list returned from extractPeaks function.
 * @param {SD} spectrum - SD instance
 * @param {Object} peakList - nmr signals
 * @param {Object} options - options object with some parameter for GSD, detectSignal functions.
 * @param {number} [options.nH = 99] - Number of hydrogens or some number to normalize the integral data. If it's zero return the absolute integral value
 * @param {string} [options.integralType = 'sum'] - option to chose between approx area with peaks or the sum of the points of given range ('sum', 'peaks')
 * @param {number} [options.frequencyCluster = 16] - distance limit to clustering peaks.
 * @param {boolean} [options.clean = true] - If true remove all the signals with integral < 0.5
 * @param {boolean} [options.compile = true] - If true, the Janalyzer function is run over signals to compile the patterns.
 * @param {string} [options.idPrefix = ''] - prefix for signal ID
 * @returns {Array}
 */

function createRanges(spectrum, peakList, options) {
    options = Object.assign({}, defaultOptions, options);
    var i,
        j,
        nHi,
        sum;

    var signals = detectSignals(peakList, spectrum, options.nH, options.integralType, options.frequencyCluster);

    //Remove all the signals with small integral
    if (options.clean || false) {
        for (i = signals.length - 1; i >= 0; i--) {
            if (signals[i].integralData.value < 0.5) {
                signals.splice(i, 1);
            }
        }
    }

    if (options.compile || false) {
        for (i = 0; i < signals.length; i++) {
            //console.log("Sum "+signals[i].integralData.value);
            JAnalyzer.compilePattern(signals[i]);

            if (signals[i].maskPattern && signals[i].multiplicity !== 'm'
                && signals[i].multiplicity !== '') {
                //Create a new signal with the removed peaks
                nHi = 0;
                sum = 0;
                var peaksO = [];
                for (j = signals[i].maskPattern.length - 1; j >= 0; j--) {
                    sum += area(signals[i].peaks[j]);

                    if (signals[i].maskPattern[j] === false) {
                        var peakR = signals[i].peaks.splice(j, 1)[0];
                        peaksO.push({x: peakR.x, y: peakR.intensity, width: peakR.width});
                        //peaksO.push(peakR);
                        signals[i].mask.splice(j, 1);
                        signals[i].mask2.splice(j, 1);
                        signals[i].maskPattern.splice(j, 1);
                        signals[i].nbPeaks--;
                        nHi += area(peakR);
                    }
                }
                if (peaksO.length > 0) {
                    nHi = nHi * signals[i].integralData.value / sum;
                    signals[i].integralData.value -= nHi;
                    var peaks1 = [];
                    for (j = peaksO.length - 1; j >= 0; j--) {
                        peaks1.push(peaksO[j]);
                    }
                    let ranges = detectSignals(peaks1, spectrum, nHi, options.integralType, options.frequencyCluster);

                    for (j = 0; j < ranges.length; j++) {
                        signals.push(ranges[j]);
                    }
                }
            }
        }
        // it was a updateIntegrals function.
        var sumIntegral = 0, sumObserved = 0;
        for (i = 0; i < signals.length; i++) {
            sumObserved += Math.round(signals[i].integralData.value);
        }
        if (sumObserved !== options.nH) {
            sumIntegral = options.nH / sumObserved;
            for (i = 0; i < signals.length; i++) {
                signals[i].integralData.value *= sumIntegral;
            }
        }
    }
    
    signals.sort(function (a, b) {
        return b.delta1 - a.delta1;
    });

    if (options.clean || false) {
        for (i = signals.length - 1; i >= 0; i--) {
            //console.log(signals[i]);
            if (signals[i].integralData.value < 0.5) {
                signals.splice(i, 1);
            }
        }
    }

    for (i = 0; i < signals.length; i++) {
        if (options.idPrefix && options.idPrefix.length > 0) {
            signals[i].signalID = options.idPrefix + '_' + (i + 1);
        } else {
            signals[i].signalID = (i + 1) + '';
        }
        signals[i]._highlight = [signals[i].signalID];
    }

    if (options.format === 'new') {
        let ranges = new Array(signals.length);
        for (i = 0; i < signals.length; i++) {
            var signal = signals[i];
            ranges[i] = {
                from: signal.integralData.from,
                to: signal.integralData.to,
                integral: signal.integralData.value,
                signal: [{
                    nbAtoms: 0,
                    diaID: [],
                    multiplicity: signal.multiplicity,
                    peak: signal.peaks,
                    kind: '',
                    remark: ''
                }],
                signalID: signal.signalID,
                _highlight: signal._highlight

            };
            if (signal.nmrJs) {
                ranges[i].signal[0].j = signal.nmrJs;
            }
            if (!signal.asymmetric || signal.multiplicity === 'm') {
                ranges[i].signal[0].delta = signal.delta1;
            }
        }
        signals = new Ranges(ranges);
    }

    return signals;
}


/**
 * Extract the signals from the peakList and the given spectrum.
 * @param {object} peakList - nmr signals
 * @param {object} spectrum - spectra data
 * @param {number} nH - Number of hydrogens or some number to normalize the integral data, If it's zero return the absolute integral value
 * @param {string} integralType - option to chose between approx area with peaks or the sum of the points of given range
 * @param {number} frequencyCluster - distance limit to clustering the peaks.
 * range = frequencyCluster / observeFrequency -> Peaks withing this range are considered to belongs to the same signal1D
 * @return {Array} nmr signals
 * @private
 */
function detectSignals(peakList, spectrum, nH, integralType, frequencyCluster) {
    const frequency = spectrum.observeFrequencyX();
    var  cs,
        sum,
        i,
        j,
        signals = [],
        signal1D = {},
        peaks = null,
        prevPeak = {x: 100000, y: 0, width: 0},
        spectrumIntegral = 0;

    var frequencyCluster = Number.isFinite(frequencyCluster) ? frequencyCluster : 16;
    var integralType = (integralType === 'sum' || integralType === 'peaks') ? integralType : 'sum';

    const rangeX = frequencyCluster / frequency;

    for (i = 0; i < peakList.length; i++) {
        if (Math.abs(peakList[i].x - prevPeak.x) > rangeX) {
            signal1D = {nbPeaks: 1, units: 'PPM',
                'startX': peakList[i].x - peakList[i].width,
                'stopX': peakList[i].x + peakList[i].width,
                'multiplicity': '', 'pattern': '',
                'observe': frequency, 'nucleus': '1H',
                'integralData': {'from': peakList[i].x - peakList[i].width * 3,
                    'to': peakList[i].x + peakList[i].width * 3
                     //"value":area(peakList[i])
                },
                'peaks': []};
            signal1D.peaks.push({x: peakList[i].x, 'intensity': peakList[i].y, width: peakList[i].width});
            signals.push(signal1D);
            //spectrumIntegral+=area(peakList[i]);
        } else {
            var tmp = peakList[i].x + peakList[i].width;
            signal1D.stopX = Math.max(signal1D.stopX, tmp);
            tmp = peakList[i].x - peakList[i].width;
            signal1D.startX = Math.min(signal1D.startX, tmp);
            signal1D.nbPeaks++;
            signal1D.peaks.push({x: peakList[i].x, 'intensity': peakList[i].y, width: peakList[i].width});
            //signal1D.integralData.value+=area(peakList[i]);
            signal1D.integralData.from = Math.min(signal1D.integralData.from, peakList[i].x - peakList[i].width * 3);
            signal1D.integralData.to = Math.max(signal1D.integralData.to, peakList[i].x + peakList[i].width * 3);
            //spectrumIntegral+=area(peakList[i]);
        }
        prevPeak = peakList[i];
    }
    //Normalize the integral to the normalization parameter and calculate cs
    for (i = 0; i < signals.length; i++) {
        peaks = signals[i].peaks;
        let integral = signals[i].integralData;
        cs = 0;
        sum = 0;

        for (j = 0; j < peaks.length; j++) {
            cs += peaks[j].x * area(peaks[j]);//.intensity;
            sum += area(peaks[j]);
        }
        signals[i].delta1 = cs / sum;

        if (integralType === 'sum') {
            integral.value = spectrum.getArea(integral.from, integral.to);
        } else {
            integral.value = sum;
        }
        spectrumIntegral += integral.value;

    }
    if (nH !== 0) {
        for (i = 0; i < signals.length; i++) {
            //console.log(integral.value);
            let integral = signals[i].integralData;
            integral.value *= nH / spectrumIntegral;
        }
    }

    return signals;
}

/**
 * Updates the score that a given impurity is present in the current spectrum. In this part I would expect
 * to have into account the multiplicity of the signal. Also the relative intensity of the signals.
 * THIS IS the KEY part of the algorithm!!!!!!!!!
 * @param candidates
 * @param peakList
 * @param maxIntensity
 * @param frequency
 * @return {number}
 */
/*function updateScore(candidates, peakList, maxIntensity, frequency) {
 //You may do it to avoid this part.
 //Check the multiplicity
 var mul, index, k;
 var j = 0;
 var min = 0;
 var indexMin = 0;
 var score = 0;
 for (var i = candidates.length - 1; i >= 0; i--) {
 mul = candidates[i][1];
 j = candidates[i][2];
 index = candidates[i][4][0];
 //I guess we should try to identify the pattern in the nearby.
 if (mul.indexOf('sep') >= 0) {
 if (peakList[index][1] > maxIntensity * 0.33) {
 candidates.splice(i, 1);//Not a candidate anymore.
 }
 } else {
 if (mul.indexOf('s') >= 0 || mul.indexOf('X') >= 0) {
 k = index - 1;
 min = peakList[index][1];
 indexMin = index;
 while (k >= 0 && Math.abs(peakList[index][0] - peakList[k][0]) < 0.025) {
 if (peakList[k][1] < min) {
 min = peakList[k][1];
 indexMin = k;
 }
 k--;
 }
 k = index + 1;
 while (k < peakList.length && Math.abs(peakList[index][0] - peakList[k][0]) < 0.025) {
 if (peakList[k][1] < min) {
 min = peakList[k][1];
 indexMin = k;
 }
 k++;
 }
 candidates[i][4][0] = indexMin;
 score += 1;
 }
 }
 if (mul.indexOf('d') >= 0) {
 if (index > 0 && index < peakList.length - 1) {
 let thisJ1 = Math.abs(Math.abs(peakList[index - 1][0] - peakList[index][0]) * frequency - j);
 let thisJ2 = Math.abs(Math.abs(peakList[index + 1][0] - peakList[index][0]) * frequency - j);
 let thisJ3 = Math.abs(Math.abs(peakList[index + 1][0] - peakList[index - 1][0]) * frequency - j);
 if (thisJ1 < 2 || thisJ2 < 2 || thisJ3 < 2) {
 if (thisJ1 < thisJ2) {
 if (thisJ1 < thisJ3) {
 candidates[i][4] = [index - 1, index];
 score += 1;
 }                        else {
 candidates[i][4] = [index - 1, index + 1];
 score += 1;
 }
 }                    else {
 if (thisJ2 < thisJ3) {
 candidates[i][4] = [index, index + 1];
 score += 1;
 }                        else {
 candidates[i][4] = [index - 1, index + 1];
 score += 1;
 }
 }
 }
 }
 }
 if (mul.indexOf('t') >= 0) {
 if (index > 0 && index < peakList.length - 1) {
 let thisJ1 = Math.abs(Math.abs(peakList[index - 1][0] - peakList[index][0]) * frequency - j);
 let thisJ2 = Math.abs(Math.abs(peakList[index + 1][0] - peakList[index][0]) * frequency - j);
 let thisJ3 = Math.abs(Math.abs(peakList[index + 1][0] - peakList[index + 2][0]) * frequency - j);
 //console.log("XX "+thisJ1+" "+thisJ2);
 if (thisJ1 < 2) {
 candidates[i][4] = [index - 1, index];
 score += 0.5;
 }
 if (thisJ2 < 2) {
 candidates[i][4].push(index + 1);
 score += 0.5;
 }
 if (thisJ3 < 2) {
 candidates[i][4].push(index + 2);
 score += 0.5;
 }

 }
 }
 if (mul.indexOf('q') >= 0) {
 if (index > 1 && index < peakList.length - 2) {
 var thisJ1 = Math.abs(Math.abs(peakList[index - 2][0] - peakList[index - 1][0]) * frequency - j);
 var thisJ2 = Math.abs(Math.abs(peakList[index - 1][0] - peakList[index][0]) * frequency - j);
 var thisJ3 = Math.abs(Math.abs(peakList[index + 1][0] - peakList[index][0]) * frequency - j);
 var thisJ4 = Math.abs(Math.abs(peakList[index + 2][0] - peakList[index + 1][0]) * frequency - j);
 if (thisJ1 < 2) {
 candidates[i][4].push(index - 2);
 score += 0.25;
 }
 if (thisJ2 < 2) {
 candidates[i][4].push(index - 1);
 score += 0.25;
 }
 if (thisJ3 < 2) {
 candidates[i][4].push(index + 1);
 score += 0.25;
 }
 if (thisJ4 < 2) {
 candidates[i][4].push(index + 2);
 score += 0.25;
 }
 }
 }
 }
 //Lets remove the candidates to be impurities.
 //It would be equivalent to mark the peaks as valid again
 if (score / candidates.length < 0.5) {
 for (var i = candidates.length - 1; i >= 0; i--) {
 candidates.splice(i, 1);
 }
 return 0;
 }
 //Check the relative intensity
 return 1;
 }
 */
/**
 * Return the area of a Lorentzian function
 * @param {object} peak - object with peak information
 * @return {number}
 * @private
 */
function area(peak) {
    return Math.abs(peak.intensity * peak.width * 1.57);//1.772453851);
}

module.exports = createRanges;


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const old = __webpack_require__(108);

var acsString = '';
var parenthesis = '';
var rangeForMultiplet = false;


function toAcs(rangesIn, opt) {
    let options = Object.assign({}, {nucleus: '1H'}, opt);

    var ranges = JSON.parse(JSON.stringify(rangesIn));

    if (ranges[0].delta1) {//Old signals format
        return old.toACS(ranges, options);
    }
    if (ranges.updateMultiplicity) {
        ranges = ranges.updateMultiplicity();
    }

    acsString = '';
    parenthesis = '';
    var solvent = null;
    if (options && options.solvent) {
        solvent = options.solvent;
    }
    if (options && options.rangeForMultiplet !== undefined) {
        rangeForMultiplet = options.rangeForMultiplet;
    }

    if (options && options.ascending) {
        ranges.sort(function (a, b) {
            return b.from - a.from;
        });
    } else {
        ranges.sort(function (a, b) {
            return a.from - b.from;
        });
    }

    ranges.type = 'NMR SPEC';
    if (options && options.nucleus === '1H') {
        formatAcsDefault(ranges, false, 2, 1, solvent, options);
    }
    if (options && options.nucleus === '13C') {
        formatAcsDefault(ranges, false, 1, 0, solvent, options);
    }

    if (acsString.length > 0) acsString += '.';

    return acsString;
}

function formatAcsDefault(ranges, ascending, decimalValue, decimalJ, solvent, options) {
    appendSeparator();
    appendSpectroInformation(ranges, solvent, options);
    var numberSmartPeakLabels = ranges.length;
    var signal;
    for (var i = 0; i < numberSmartPeakLabels; i++) {
        if (ascending) {
            signal = ranges[i];
        } else {
            signal = ranges[numberSmartPeakLabels - i - 1];
        }
        if (signal) {
            appendSeparator();
            appendDelta(signal, decimalValue);
            appendParenthesis(signal, decimalJ);
        }
    }
}

function appendSpectroInformation(range, solvent, options) {
    if (range.type === 'NMR SPEC') {
        if (options.nucleus) {
            acsString += formatNucleus(options.nucleus);
        }
        acsString += ' NMR';
        if ((solvent) || (options.observe)) {
            acsString += ' (';
            if (options.observe) {
                acsString += (options.observe * 1).toFixed(0) + ' MHz';
                if (solvent) acsString += ', ';
            }
            if (solvent) {
                acsString += formatMF(solvent);
            }
            acsString += ')';
        }
        acsString += ' δ ';
    } else if (range.type === 'IR') {
        acsString += ' IR ';
    } else if (range.type === 'MASS') {
        acsString += ' MASS ';
    }
}

function appendDelta(line, nbDecimal) {
    var startX = 0, stopX = 0, delta1 = 0, asymmetric;
    if (line.from) {
        if ((typeof line.from) === 'string') {
            startX = parseFloat(line.from);
        } else {
            startX = line.from;
        }
    }
    if (line.to) {
        if ((typeof line.to) === 'string') {
            stopX = parseFloat(line.to);
        } else {
            stopX = line.to;
        }
    }
    if (line.signal[0].delta) {
        if ((typeof line.signal[0].delta) === 'string') {
            delta1 = parseFloat(line.signal[0].delta);
        } else {
            delta1 = line.signal[0].delta;
        }
    } else {
        asymmetric = true;
    }

    if (asymmetric === true || (line.signal[0].multiplicity === 'm' && rangeForMultiplet === true)) {//Is it massive??
        if (line.from && line.to) {
            if (startX < stopX) {
                acsString += startX.toFixed(nbDecimal) + '-' + stopX.toFixed(nbDecimal);
            } else {
                acsString += stopX.toFixed(nbDecimal) + '-' + startX.toFixed(nbDecimal);
            }
        } else if (line.signal[0].delta) {
            acsString += '?';
        }
    } else if (line.signal[0].delta) {
        acsString += delta1.toFixed(nbDecimal);
    } else if (line.from && line.to) {
        acsString += ((startX + stopX) / 2).toFixed(nbDecimal);
    }
}

/*
 function appendValue(line, nbDecimal) {
 if (line.xPosition) {
 acsString += line.xPosition.toFixed(nbDecimal);
 }
 }
 */
function appendParenthesis(line, nbDecimal) {
    parenthesis = '';
    appendMultiplicity(line);
    appendIntegration(line);
    appendCoupling(line, nbDecimal);
    appendAssignment(line);

    if (parenthesis.length > 0) {
        acsString += ' (' + parenthesis + ')';
    }
}

function appendIntegration(line) {
    if (line.pubIntegral) {
        appendParenthesisSeparator();
        parenthesis += line.pubIntegral;
    } else if (line.integral) {
        appendParenthesisSeparator();
        parenthesis += line.integral.toFixed(0) + ' H';
    }
}

function appendAssignment(line) {
    if (line.signal[0].pubAssignment) {
        appendParenthesisSeparator();
        parenthesis += formatAssignment(line.signal[0].pubAssignment);
    } else if (line.signal[0].assignment) {
        appendParenthesisSeparator();
        parenthesis += formatAssignment(line.signal[0].assignment);
    }
}

function appendMultiplicity(line) {
    if (line.signal[0].pubMultiplicity) {
        appendParenthesisSeparator();
        parenthesis += line.pubMultiplicity;
    } else if (line.signal[0].multiplicity) {
        appendParenthesisSeparator();
        parenthesis += line.signal[0].multiplicity;
    }
}

function appendCoupling(line, nbDecimal) {
    if ('sm'.indexOf(line.signal[0].multiplicity) < 0
        && line.signal[0].j && line.signal[0].j.length > 0) {
        var Js = line.signal[0].j;
        var j = '<i>J</i> = ';
        for (var i = 0; i < Js.length; i++) {
            var coupling = Js[i].coupling || 0;
            if (j.length > 11) {
                j += ', ';
            }
            j += coupling.toFixed(nbDecimal);
        }
        appendParenthesisSeparator();
        parenthesis += j + ' Hz';
    }
}

function formatAssignment(assignment) {
    assignment = assignment.replace(/([0-9])/g, '<sub>$1</sub>');
    assignment = assignment.replace(/\"([^\"]*)\"/g, '<i>$1</i>');
    return assignment;
}

function formatMF(mf) {
    mf = mf.replace(/([0-9])/g, '<sub>$1</sub>');
    return mf;
}

function formatNucleus(nucleus) {
    nucleus = nucleus.replace(/([0-9])/g, '<sup>$1</sup>');
    return nucleus;
}

function appendSeparator() {
    if ((acsString.length > 0) && (!acsString.match(/ $/))) {
        acsString += ', ';
    }
}

function appendParenthesisSeparator() {
    if ((parenthesis.length > 0) && (!parenthesis.match(', $'))) parenthesis += ', ';
}

module.exports = toAcs;


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * This library formats a set of nmr1D signals to the ACS format.
 * Created by acastillo on 3/11/15.
 */

var acsString = '';
var parenthesis = '';
var rangeForMultiplet = false;

function toAcs(signals1D, options) {
    acsString = '';
    parenthesis = '';
    var solvent = null;
    if (options && options.solvent) {
        solvent = options.solvent;
    }
    if (options && options.rangeForMultiplet !== undefined) {
        rangeForMultiplet = options.rangeForMultiplet;
    }

    if (options && options.ascending) {
        signals1D.sort(function (a, b) {
            return b.delta1 - a.delta1;
        });
    } else {
        signals1D.sort(function (a, b) {
            return a.delta1 - b.delta1;
        });
    }

    //console.log("Range1: " +options.rangeForMultiplet);

    signals1D.type = 'NMR SPEC';
    if (signals1D[0].nucleus === '1H') {
        formatAcsDefault(signals1D, false, 2, 1, solvent);
    } else if (signals1D[0].nucleus === '13C') {
        formatAcsDefault(signals1D, false, 1, 0, solvent);
    }

    if (acsString.length > 0) acsString += '.';

    return acsString;
}

function formatAcsDefault(signals1D, ascending, decimalValue, decimalJ, solvent) {
    appendSeparator();
    appendSpectroInformation(signals1D, solvent);
    var numberSmartPeakLabels = signals1D.length;
    var signal;
    for (var i = 0; i < numberSmartPeakLabels; i++) {
        if (ascending) {
            signal = signals1D[i];
        } else {
            signal = signals1D[numberSmartPeakLabels - i - 1];
        }
        if (signal) {
            appendSeparator();
            appendDelta(signal, decimalValue);
            appendParenthesis(signal, decimalJ);
        }
    }
}

function appendSpectroInformation(signal1D, solvent) {
    if (signal1D.type === 'NMR SPEC') {
        if (signal1D[0].nucleus) {
            acsString += formatNucleus(signal1D[0].nucleus);
        }
        acsString += ' NMR';
        if ((solvent) || (signal1D[0].observe)) {
            acsString += ' (';
            if (signal1D[0].observe) {
                acsString += (signal1D[0].observe * 1).toFixed(0) + ' MHz';
                if (solvent) acsString += ', ';
            }
            if (solvent) {
                acsString += formatMF(solvent);
            }
            acsString += ')';
        }
        acsString += ' δ ';
    } else if (signal1D.type === 'IR') {
        acsString += ' IR ';
    } else if (signal1D.type === 'MASS') {
        acsString += ' MASS ';
    }
}

function appendDelta(line, nbDecimal) {
    //console.log(line);
    var startX = 0, stopX = 0, delta1 = 0;
    if (line.integralData.from) {
        if ((typeof line.integralData.from) === 'string') {
            startX = parseFloat(line.integralData.from);
        } else {
            startX = line.integralData.from;
        }
    }
    if (line.integralData.to) {
        if ((typeof line.integralData.to) === 'string') {
            stopX = parseFloat(line.integralData.to);
        } else {
            stopX = line.integralData.to;
        }
    }
    if (line.delta1) {
        if ((typeof line.delta1) === 'string') {
            delta1 = parseFloat(line.delta1);
        } else {
            delta1 = line.delta1;
        }

    }
    if (line.asymmetric === true || (line.multiplicity === 'm' && rangeForMultiplet === true)) {//Is it massive??
        if (line.integralData.from && line.integralData.to) {
            if (startX < stopX) {
                acsString += startX.toFixed(nbDecimal) + '-' + stopX.toFixed(nbDecimal);
            } else {
                acsString += stopX.toFixed(nbDecimal) + '-' + startX.toFixed(nbDecimal);
            }
        } else if (line.delta1) {
            acsString += delta1.toFixed(nbDecimal);
        }
    } else if (line.delta1) {
        acsString += delta1.toFixed(nbDecimal);
    } else if (line.integralData.from && line.integralData.to) {
        acsString += ((startX + stopX) / 2).toFixed(nbDecimal);
    }
}
/*
function appendValue(line, nbDecimal) {
    if (line.xPosition) {
        acsString += line.xPosition.toFixed(nbDecimal);
    }
}
*/

function appendParenthesis(line, nbDecimal) {
    // need to add assignment - coupling - integration
    parenthesis = '';
    appendMultiplicity(line);
    appendIntegration(line);
    appendCoupling(line, nbDecimal);
    appendAssignment(line);


    if (parenthesis.length > 0) {
        acsString += ' (' + parenthesis + ')';
    }
}

function appendIntegration(line) {
    if (line.pubIntegration) {
        appendParenthesisSeparator();
        parenthesis += line.pubIntegration;
    } else if (line.integralData) {
        appendParenthesisSeparator();
        parenthesis += line.integralData.value.toFixed(0) + ' H';
    }
}

function appendAssignment(line) {
    if (line.pubAssignment) {
        appendParenthesisSeparator();
        parenthesis += formatAssignment(line.pubAssignment);
    } else {
        if (line.assignment) {
            appendParenthesisSeparator();
            parenthesis += formatAssignment(line.assignment);
        }
    }
}

function appendMultiplicity(line) {
    if (line.pubMultiplicity) {
        appendParenthesisSeparator();
        parenthesis += line.pubMultiplicity;
    } else if (line.multiplicity) {
        appendParenthesisSeparator();
        parenthesis += line.multiplicity;
    }
}

function appendCoupling(line, nbDecimal) {
    if (line.nmrJs) {
        var j = '<i>J</i> = ';
        for (var i = 0; i < line.nmrJs.length; i++) {
            var coupling = line.nmrJs[i].coupling;
            if (j.length > 11) j += ', ';
            j += coupling.toFixed(nbDecimal);
        }
        appendParenthesisSeparator();
        parenthesis += j + ' Hz';
    }

}

function formatAssignment(assignment) {
    assignment = assignment.replace(/([0-9])/g, '<sub>$1</sub>');
    assignment = assignment.replace(/\"([^\"]*)\"/g, '<i>$1</i>');
    return assignment;
}

function formatMF(mf) {
    mf = mf.replace(/([0-9])/g, '<sub>$1</sub>');
    return mf;
}

function formatNucleus(nucleus) {
    nucleus = nucleus.replace(/([0-9])/g, '<sup>$1</sup>');
    return nucleus;
}

function appendSeparator() {
    if ((acsString.length > 0) && (!acsString.match(/ $/))) {
        acsString += ', ';
    }
}

function appendParenthesisSeparator() {
    if ((parenthesis.length > 0) && (!parenthesis.match(', $'))) parenthesis += ', ';
}

module.exports.toACS = toAcs;


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * This function converts an array of peaks [{x, y, width}] in a vector equally x,y vector from a given window
 * TODO: This function is very general and should be placed somewhere else
 * @param {Array} peaks - List of the peaks
 * @param {object} options - it has some options to
 * @param {number} [options.from] - one limit of given window
 * @param {number} [options.to] - one limit of given window
 * @param {string} [options.fnName] - function name to generate the signals form
 * @param {number} [options.nWidth] - width factor of signal form
 * @param {number} [options.nbPoints] - number of points that the vector will have
 * @return {{x: Array, y: Array}}
 */
function peak2Vector(peaks, options) {
    var options = options || {};
    var from = options.from;
    var to = options.to;
    var nbPoints = options.nbPoints || 16 * 1024;
    var fnName = options.fnName || 'gaussian';
    var nWidth = options.nWidth || 4;

    if (!from) {
        from = Number.MAX_VALUE;
        for (let i = 0; i < peaks.length; i++) {
            if (peaks[i].x - peaks[i].width * nWidth < from) {
                from = peaks[i].x - peaks[i].width * nWidth;
            }
        }
    }

    if (!to) {
        to = Number.MIN_VALUE;
        for (let i = 0; i < peaks.length; i++) {
            if (peaks[i].x + peaks[i].width * nWidth > to) {
                to = peaks[i].x + peaks[i].width * nWidth;
            }
        }
    }


    var x = new Array(nbPoints);
    var y = new Array(nbPoints);
    var dx = (to - from) / (nbPoints - 1);
    for (let i = 0; i < nbPoints; i++) {
        x[i] = from + i * dx;
        y[i] = 0;
    }

    var intensity = 'intensity';
    if (peaks[0].y) {
        intensity = 'y';
    }

    for (let i = 0; i < peaks.length; i++) {
        var peak = peaks[i];
        if (peak.x > from && peak.x < to) {
            var index = Math.round((peak.x - from) / dx);
            var w = Math.round(peak.width * nWidth / dx);
            if (fnName === 'gaussian') {
                for (var j = index - w; j < index + w; j++) {
                    if (j >= 0 && j < nbPoints) {
                        y[j] += peak[intensity] * Math.exp(-0.5 * Math.pow((peak.x - x[j]) / (peak.width / 2), 2));
                    }
                }
            } else {
                var factor = peak[intensity] * Math.pow(peak.width, 2) / 4;
                for (let j = index - w; j < index + w; j++) {
                    if (j >= 0 && j < nbPoints) {
                        y[j] += factor / (Math.pow(peak.x - x[j], 2) + Math.pow(peak.width / 2, 2));

                    }
                }
            }

        }
    }

    return {x: x, y: y};
}

module.exports = peak2Vector;



/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Created by acastillo on 5/25/16.
 */

var options1D = {type: 'rect', line: 0, lineLabel: 1, labelColor: 'red', strokeColor: 'red', strokeWidth: '1px', fillColor: 'green', width: 0.05, height: 10, toFixed: 1};
var options2D = {type: 'rect', labelColor: 'red', strokeColor: 'red', strokeWidth: '1px', fillColor: 'green', width: '6px', height: '6px'};

function annotations1D(ranges, optionsG) {
    var options = Object.assign({}, options1D, optionsG);
    var height = options.height;
    var annotations = [];
    for (var i = 0; i < ranges.length; i++) {
        var prediction = ranges[i];
        var annotation = {};

        annotations.push(annotation);
        annotation.line = options.line;
        annotation._highlight = prediction._highlight;
        if (!annotation._highlight || annotation._highlight.length === 0) {
            annotation._highlight = [prediction.signalID];
            prediction.signal.forEach(function (signal) {
                for (let j = 0; j < signal.diaID.length; j++) {
                    annotation._highlight.push(signal.diaID[j]);
                }
            });
        }

        prediction._highlight = annotation._highlight;

        annotation.type = options.type;

        if (!prediction.to || !prediction.from || prediction.to === prediction.from) {
            annotation.position = [{x: prediction.signal[0].delta - options.width, y: (options.line * height) + 'px'},
                {x: prediction.signal[0].delta + options.width, y: (options.line * height + 3) + 'px'}];
        } else {
            annotation.position = [{x: prediction.to, y: (options.line * height) + 'px'},
                {x: prediction.from, y: (options.line * height + 3) + 'px'}];
        }

        if (!options.noLabel && prediction.integral) {
            annotation.label = {
                text: prediction.integral.toFixed(options.toFixed),
                size: '11px',
                anchor: 'middle',
                color: options.labelColor,
                position: {x: (annotation.position[0].x + annotation.position[1].x) / 2,
                    y: ((options.line + options.lineLabel) * height) + 'px', dy: '5px'}
            };
        }


        annotation.strokeColor = options.strokeColor;
        annotation.strokeWidth = options.strokeWidth;
        annotation.fillColor = options.fillColor;
        annotation.info = prediction;
    }
    return annotations;
}

function annotations2D(zones, optionsG) {
    var options = Object.assign({}, options2D, optionsG);
    var annotations = [];
    for (var k = zones.length - 1; k >= 0; k--) {
        var signal = zones[k];
        var annotation = {};
        annotation.type = options.type;
        annotation._highlight = signal._highlight;//["cosy"+k];
        if (!annotation._highlight || annotation._highlight.length === 0) {
            annotation._highlight = [signal.signalID];
        }
        signal._highlight = annotation._highlight;

        annotation.position = [{x: signal.fromTo[0].from - 0.01, y: signal.fromTo[1].from - 0.01, dx: options.width, dy: options.height},
            {x: signal.fromTo[0].to + 0.01, y: signal.fromTo[1].to + 0.01}];
        annotation.fillColor = options.fillColor;
        annotation.label = {text: signal.remark,
            'position': {
                'x': signal.signal[0].delta[0],
                'y': signal.signal[0].delta[1] - 0.025}
        };
        if (signal.integral === 1) {
            annotation.strokeColor = options.strokeColor;
        } else {
            annotation.strokeColor = 'rgb(0,128,0)';
        }

        annotation.strokeWidth = options.strokeWidth;
        annotation.width = options.width;
        annotation.height = options.height;
        annotation.info = signal;
        annotations.push(annotation);
    }
    return annotations;
}

module.exports = {annotations2D: annotations2D, annotations1D: annotations1D};



/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.SD = __webpack_require__(6);
exports.NMR = __webpack_require__(40);
exports.NMR2D = __webpack_require__(41);
exports.Ranges = __webpack_require__(13);


/***/ })
/******/ ]);
});