'use strict';

// MODULES //

var factory = require( './factory.js' );


// FETCH //

/**
* FUNCTION: fetch( filepath, repos, clbk )
*	Fetches a file from one or more repositories.
*
* @param {String} filepath - relative filepath of the file to fetch
* @param {String[]} repos - array of repo slugs indicating the repositories from which to fetch a file
* @param {Function} clbk - callback to invoke upon query completion
* @returns {Void}
*/
function fetch( filepath, repos, clbk ) {
	factory( filepath, repos, clbk )();
} // end FUNCTION fetch()


// EXPORTS //

module.exports = fetch;
