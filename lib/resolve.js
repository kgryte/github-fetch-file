'use strict';

// MODULES //

var debug = require( 'debug' )( 'github-fetch-file:resolve' );
var getOptions = require( './options.js' );
var request = require( './request.js' );


// VARIABLES //

var NUM_CONCURRENT_REQUESTS = 1; // FIXME: heuristic


// RESOLVE //

/**
* FUNCTION: resolve( filepath, repos, opts, clbk )
*	Fetches a file from one or more repositories.
*
* @param {String} filepath - relative filepath of the file to fetch
* @param {String[]} repos - array of repo slugs indicating the repositories from which to fetch a file
* @param {Object} opts - request options
* @param {Function} clbk - callback to invoke after query completion
* @returns {Void}
*/
function resolve( filepath, repos, opts, clbk ) {
	var options;
	var scount;
	var fcount;
	var count;
	var out;
	var idx;
	var len;
	var i;

	// Output data store:
	out = {};
	out.meta = {};
	out.data = {};
	out.failures = {};

	// Number of completed requests:
	count = 0;
	scount = 0; // success
	fcount = 0; // failures

	// Request id:
	idx = 0;

	// Request options:
	options = getOptions( opts );

	len = repos.length;

	debug( 'Number of repositories: %d.', len );
	out.meta.total = len;

	debug( 'Beginning queries...' );
	for ( i = 0; i < NUM_CONCURRENT_REQUESTS; i++ ) {
		next();
	}
	/**
	* FUNCTION: next()
	*	Requests a file from the next repository in the queue. Once requests for all desired repos have completed, invokes the provided callback.
	*
	* @private
	* @returns {Void}
	*/
	function next() {
		var repo;
		if ( count === len ) {
			debug( 'Finished all queries.' );
			out.meta.success = scount;
			out.meta.failure = fcount;
			return clbk( null, out );
		}
		if ( idx < len ) {
			repo = repos[ idx ];
			debug( 'Querying repository `%s` (%d).', repo, idx );

			options.path = '/'+repo+'/'+opts.branch+'/'+filepath;
			debug( 'Path: %s', options.path );

			request( options, onResponse( repo, idx ) );
			idx += 1;
		}
	} // end FUNCTION next()

	/**
	* FUNCTION: onResponse( repo, idx )
	*	Returns a response callback.
	*
	* @private
	* @param {String} repo - repository
	* @param {Number} idx - request index
	* @returns {Function} response callback
	*/
	function onResponse( repo, idx ) {
		/**
		* FUNCTION: onResponse( error, response, body )
		*	Callback invoked upon receiving a request response.
		*
		* @private
		* @param {Error|Null} error - error object
		* @param {Object} response - HTTP response object
		* @param {String} body - response body
		* @returns {Void}
		*/
		return function onResponse( error, response, body ) {
			debug( 'Response received for repository `%s` (%d).', repo, idx );
			if ( arguments.length === 1 ) {
				debug( 'Encountered an application-level error for repository `%s` (%d): %s', repo, idx, error.message );
				return clbk( error );
			}
			if ( error ) {
				debug( 'Failed to resolve file for repository `%s` (%d): %s', repo, idx, error.message );
				out.failures[ repo ] = error.message;
				fcount += 1;
			} else {
				debug( 'Successfully resolved file for repository `%s` (%d).', repo, idx );
				out.data[ repo ] = body;
				scount += 1;
			}
			count += 1;
			debug( 'Request %d of %d complete.', count, len );
			next();
		}; // end FUNCTION onResponse()
	} // end FUNCTION onResponse()
} // end FUNCTION resolve()


// EXPORTS //

module.exports = resolve;
