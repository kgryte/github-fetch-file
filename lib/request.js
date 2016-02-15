'use strict';

// MODULES //

var debug = require( 'debug' )( 'github-fetch-file:request' );
var http = require( 'http' );
var https = require( 'https' );


// VARIABLES //

var RE = /^https/;


// REQUEST //

/**
* FUNCTION: request( opts, clbk )
*	Queries an endpoint.
*
* @param {Object} opts - request options
* @param {Function} clbk - callback to invoke upon querying an endpoint
*/
function request( opts, clbk ) {
	var body;
	var req;
	var res;
	var get;
	var err;

	// debug( 'Query options: %s', JSON.stringify( opts ) );

	if ( RE.test( opts.protocol ) ) {
		get = https.request;
	} else {
		get = http.request;
	}
	body = '';
	req = get( opts, onResponse );
	req.on( 'error', onError );
	req.end();

	/**
	* FUNCTION: onError( error )
	*	Event listener invoked after encountering an error.
	*
	* @private
	* @param {Error} error - error object
	* @returns {Void}
	*/
	function onError( error ) {
		debug( 'Error encountered while querying endpoint: %s', error.message );
		if ( error instanceof Error ) {
			err = {
				'status': 500,
				'message': 'Request error: ' + error.message
			};
			return clbk( err );
		}
		return clbk( error, res, body );
	} // end FUNCTION onError()

	/**
	* FUNCTION: onResponse( response )
	*	Callback invoked after receiving an HTTP response.
	*
	* @private
	* @param {Object} response - HTTP response object
	* @returns {Void}
	*/
	function onResponse( response ) {
		res = response;
		if ( res.statusCode !== 200 ) {
			err = {
				'status': res.statusCode,
				'message': ''
			};
		}
		debug( 'Received a response from query endpoint.' );
		debug( 'Response status: %s.', res.statusCode );

		debug( 'Response headers: %s', JSON.stringify( res.headers ) );

		res.setEncoding( 'utf8' );
		res.on( 'data', onData );
		res.on( 'end', onEnd );
	} // end FUNCTION onResponse()

	/**
	* FUNCTION: onData( chunk )
	*	Event listener invoked upon receiving response data.
	*
	* @private
	* @param {String} chunk - data chunk
	* @returns {Void}
	*/
	function onData( chunk ) {
		body += chunk;
	} // end FUNCTION onData()

	/**
	* FUNCTION: onEnd()
	*	Event listener invoked upon a response end.
	*
	* @private
	* @returns {Void}
	*/
	function onEnd() {
		if ( err ) {
			err.message = body;
			return onError( err );
		}
		// debug( 'Response body: %s', body );
		
		clbk( null, res, body );
	} // end FUNCTION onEnd()
} // end FUNCTION request()


// EXPORTS //

module.exports = request;
