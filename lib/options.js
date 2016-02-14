'use strict';

// MODULES //

var debug = require( 'debug' )( 'github-fetch-file:options' );


// OPTIONS //

/**
* FUNCTION: options( opts )
*	Returns request options based on provided options.
*
* @param {Object} opts - provided options
* @param {String} opts.method - request method
* @param {String} opts.protocol - request protocol
* @param {String} opts.hostname - endpoint hostname
* @param {Number} opts.port - endpoint port
* @returns {Object} request options
*/
function options( opts ) {
	var out = {};

	out.method = opts.method;
	debug( 'Method: %s', opts.method );
	
	out.protocol = opts.protocol+':';
	debug( 'Protocol: %s', opts.protocol );
	
	out.hostname = opts.hostname;
	debug( 'Hostname: %s', opts.hostname );
	
	out.port = opts.port;
	debug( 'Port: %d', opts.port );

	return out;
} // end FUNCTION options()


// EXPORTS //

module.exports = options;