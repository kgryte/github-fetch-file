'use strict';

// MODULES //

var tape = require( 'tape' );
var assert = require( 'chai' ).assert;
var proxyquire = require( 'proxyquire' );
var fetch = require( './../lib/fetch.js' );


// FIXTURES //

var results = require( './fixtures/results.json' );
var repos = require( './fixtures/repos.json' );


// TESTS //

tape( 'file exports a function', function test( t ) {
	t.equal( typeof fetch, 'function', 'export is a function' );
	t.end();
});

tape( 'function returns an error to a provided callback if an error is encountered when fetching a file', function test( t ) {
	var fetch;

	fetch = proxyquire( './../lib/fetch.js', {
		'./factory.js': factory
	});

	fetch( 'README.md', repos, done );

	function factory( filepath, repos, clbk ) {
		return function fetch() {
			setTimeout( onTimeout, 0 );
			function onTimeout() {
				clbk({
					'status': 404,
					'message': 'beep'
				});
			}
		};
	}

	function done( error ) {
		t.equal( error.status, 404, 'equal status' );
		t.equal( error.message, 'beep', 'equal message' );
		t.end();
	}
});

tape( 'functions returns a repo hash containing file contents to a provided callback', function test( t ) {
	var expected;
	var fetch;

	fetch = proxyquire( './../lib/fetch.js', {
		'./factory.js': factory
	});

	expected = results;

	fetch( 'README.md', repos, done );

	function factory( filepath, repos, clbk ) {
		return function fetch() {
			setTimeout( onTimeout, 0 );
			function onTimeout() {
				clbk( null, results );
			}
		};
	}

	function done( error, results ) {
		assert.deepEqual( results, expected );
		t.ok( true, 'deep equal' );
		t.end();
	}
});
