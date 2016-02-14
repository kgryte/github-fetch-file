'use strict';

// MODULES //

var tape = require( 'tape' );
var options = require( './../lib/options.js' );


// FUNCTIONS //

function setup() {
	return {
		'method': 'GET',
		'protocol': 'http',
		'hostname': 'beep.com',
		'path': '/',
		'port': 80
	};
}


// TESTS //

tape( 'main export is a function', function test( t ) {
	t.equal( typeof options, 'function', 'main export is a function' );
	t.end();
});

tape( 'the function returns an object', function test( t ) {
	t.equal( typeof options( setup() ), 'object', 'returns an object' );
	t.end();
});

tape( 'the function sets the HTTP request method to `GET`', function test( t ) {
	var opts = setup();
	var out = options( opts );
	t.equal( out.method, 'GET', 'method set to `GET`' );
	t.end();
});

tape( 'the function sets the HTTP request protocol', function test( t ) {
	var opts = setup();
	var out = options( opts );
	t.equal( out.protocol, opts.protocol+':', 'request protocol set protocol option' );
	t.end();
});

tape( 'the function sets the endpoint hostname', function test( t ) {
	var opts = setup();
	var out = options( opts );
	t.equal( out.hostname, opts.hostname, 'sets the endpoint hostname' );
	t.end();
});

tape( 'the function sets the endpoint port', function test( t ) {
	var opts = setup();
	var out = options( opts );
	t.equal( out.port, opts.port, 'sets the endpoint port' );
	t.end();
});
