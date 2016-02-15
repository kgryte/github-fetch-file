'use strict';

// MODULES //

var tape = require( 'tape' );
var proxyquire = require( 'proxyquire' );
var copy = require( 'utils-copy' );
var defaults = require( './../lib/defaults.json' );
var request = require( './../lib/request.js' );


// FIXTURES //

var http = require( './fixtures/http.js' );


// TESTS //

tape( 'file exports a function', function test( t ) {
	t.equal( typeof request, 'function', 'main export is a function' );
	t.end();
});

tape( 'if unable to query an endpoint, an error is returned to a provided callback', function test( t ) {
	var request;
	var mock;
	var opts;

	opts = copy( defaults );
	opts.protocol = 'http:';

	mock = http( new Error( 'beep' ) );

	request = proxyquire( './../lib/request.js', {
		'http': mock
	});

	request( opts, clbk );

	function clbk( error ) {
		t.equal( typeof error, 'object', 'error is an object' );
		t.equal( error.status, 500, '500 status' );
		t.equal( error.message, 'Request error: beep', 'message contains error message' );
		t.end();
	}
});

tape( 'if an endpoint returns a status code other than 200, an error containing the status code, the HTTP response object, and the response body are returned to a provided callback', function test( t ) {
	var request;
	var mock;
	var opts;

	opts = copy( defaults );
	opts.protocol = 'http:';

	mock = http( null, 404 );

	request = proxyquire( './../lib/request.js', {
		'http': mock
	});

	request( opts, clbk );

	function clbk( error, response, body ) {
		t.equal( error.status, 404, 'equal status codes' );
		t.equal( error.message, 'bad request', 'equal messages' );

		t.equal( typeof response, 'object', 'second argument is an object' );

		t.equal( typeof body, 'string', 'third argument is a string' );

		t.end();
	}
});

tape( 'if a query is successful, the response body is returned to a provided callback', function test( t ) {
	var request;
	var mock;
	var opts;

	opts = copy( defaults );
	opts.protocol = 'http:';

	mock = http( null, 200 );

	request = proxyquire( './../lib/request.js', {
		'http': mock
	});

	request( opts, clbk );

	function clbk( error, response, body ) {
		if ( error ) {
			t.ok( false, error.message );
			t.end();
			return;
		}
		t.equal( typeof response, 'object', 'second argument is an object' );

		t.equal( typeof body, 'string', 'body is a string' );

		t.equal( body, 'beep', 'body equals beep' );

		t.end();
	}
});

tape( 'HTTPS is supported', function test( t ) {
	var request;
	var mock;
	var opts;

	opts = copy( defaults );
	opts.protocol = 'https:';

	mock = http( null, 200 );

	request = proxyquire( './../lib/request.js', {
		'https': mock
	});

	request( opts, clbk );

	function clbk( error, response, body ) {
		if ( error ) {
			t.ok( false, error.message );
			t.end();
			return;
		}
		t.equal( typeof response, 'object', 'second argument is an object' );

		t.equal( typeof body, 'string', 'body is a string' );

		t.equal( body, 'beep', 'body equals beep' );

		t.end();
	}
});
