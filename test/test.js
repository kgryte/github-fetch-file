'use strict';

// MODULES //

var tape = require( 'tape' );
var fetch = require( './../lib' );


// TESTS //

tape( 'main export is a function', function test( t ) {
	t.equal( typeof fetch, 'function', 'main export is a function' );
	t.end();
});

tape( 'module exports a factory method', function test( t ) {
	t.equal( typeof fetch.factory, 'function', 'export includes a factory method' );
	t.end();
});
