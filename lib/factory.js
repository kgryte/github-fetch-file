'use strict';

// MODULES //

var isFunction = require( 'validate.io-function' );
var isString = require( 'validate.io-string-primitive' );
var isStringArray = require( 'validate.io-string-primitive-array' );
var copy = require( 'utils-copy' );
var defaults = require( './defaults.json' );
var resolve = require( './resolve.js' );


// FACTORY //

/**
* FUNCTION: factory( filepath, repos, clbk )
*	Returns a function to fetch a file from one or more repositories.
*
* @param {String} filepath - relative filepath of the file to fetch
* @param {String[]} repos - array of repo slugs indicating the repositories from which to fetch a file
* @param {Function} clbk - callback to invoke upon query completion
* @returns {Function} function for fetching a file from one or more repositories
*/
function factory( filepath, repos, clbk ) {
	var opts;
	if ( !isString( filepath ) ) {
		throw new TypeError( 'invalid input argument. First argument must be a string primitive. Value: `' + filepath + '`.' );
	}
	if ( !isStringArray( repos ) ) {
		throw new TypeError( 'invalid input argument. Second argument must be a string array. Value: `' + repos + '`.' );
	}
	if ( !isFunction( clbk ) ) {
		throw new TypeError( 'invalid input argument. Callback argument must be a function. Value: `' + clbk + '`.' );
	}
	opts = copy( defaults );
	/**
	* FUNCTION: fetch()
	*	Fetches a file from one or more repositories.
	*
	* @returns {Void}
	*/
	return function fetch() {
		resolve( filepath, repos, opts, done );
		/**
		* FUNCTION: done( error, results )
		*	Callback invoked after query completion.
		*
		* @private
		* @param {Error|Null} error - error object
		* @param {Object} results - query results
		* @returns {Void}
		*/
		function done( error, results ) {
			if ( error ) {
				return clbk( error );
			}
			clbk( null, results );
		} // end FUNCTION done()
	}; // end FUNCTION fetch()
} // end FUNCTION factory()


// EXPORTS //

module.exports = factory;
