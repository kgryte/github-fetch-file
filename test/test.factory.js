'use strict';

// MODULES //

var tape = require( 'tape' );
var assert = require( 'chai' ).assert;
var proxyquire = require( 'proxyquire' );
var noop = require( '@kgryte/noop' );
var factory = require( './../lib/factory.js' );


// FIXTURES //

var results = require( './fixtures/results.json' );
var repos = require( './fixtures/repos.json' );


// TESTS //

tape( 'file exports a function', function test( t ) {
	t.equal( typeof factory, 'function', 'export is a function' );
	t.end();
});

tape( 'function throws if provided a filepath argument which is not a string primitive', function test( t ) {
	var values;
	var i;

	values = [
		5,
		NaN,
		null,
		undefined,
		true,
		[],
		{},
		function(){}
	];

	for ( i = 0; i < values.length; i++ ) {
		t.throws( badValue( values[i] ), TypeError, 'throws a type error when provided ' + values[i] );
	}
	t.end();

	function badValue( value ) {
		return function badValue() {
			factory( value, repos, noop );
		};
	}
});

tape( 'function throws if provided a repos argument which is not a string array', function test( t ) {
	var values;
	var i;

	values = [
		'5',
		5,
		NaN,
		null,
		undefined,
		true,
		[],
		['1',5],
		['1',null],
		{},
		function(){}
	];

	for ( i = 0; i < values.length; i++ ) {
		t.throws( badValue( values[i] ), TypeError, 'throws a type error when provided ' + values[i] );
	}
	t.end();

	function badValue( value ) {
		return function badValue() {
			factory( 'README.md', value, noop );
		};
	}
});

tape( 'function throws if provided a callback argument which is not a function', function test( t ) {
	var values;
	var i;

	values = [
		'5',
		5,
		NaN,
		null,
		undefined,
		true,
		[],
		{}
	];

	for ( i = 0; i < values.length; i++ ) {
		t.throws( badValue( values[i] ), TypeError, 'throws a type error when provided ' + values[i] );
	}
	t.end();

	function badValue( value ) {
		return function badValue() {
			factory( 'README.md', repos, value );
		};
	}
});

tape( 'function returns a function', function test( t ) {
	t.equal( typeof factory( 'README.md', repos, noop ), 'function', 'returns a function' );
	t.end();
});

tape( 'function returns a function which returns an error to a provided callback if an error is encountered when fetching a file', function test( t ) {
	var factory;
	var fcn;

	factory = proxyquire( './../lib/factory.js', {
		'./resolve.js': resolve
	});

	fcn = factory( 'README.md', repos, done );
	fcn();

	function resolve( filepath, repos, opts, clbk ) {
		setTimeout( onTimeout, 0 );
		function onTimeout() {
			clbk({
				'status': 404,
				'message': 'beep'
			});
		}
	}

	function done( error ) {
		t.equal( error.status, 404, 'equal status' );
		t.equal( error.message, 'beep', 'equal message' );
		t.end();
	}
});

tape( 'function returns a function which returns a repo hash containing file contents to a provided callback', function test( t ) {
	var expected;
	var factory;
	var fcn;

	factory = proxyquire( './../lib/factory.js', {
		'./resolve.js': resolve
	});

	expected = results;

	fcn = factory( 'README.md', repos, done );
	fcn();

	function resolve( filepath, repos, opts, clbk ) {
		setTimeout( onTimeout, 0 );
		function onTimeout() {
			clbk( null, results );
		}
	}

	function done( error, results ) {
		assert.deepEqual( results, expected );
		t.ok( true, 'deep equal' );
		t.end();
	}
});
