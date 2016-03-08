'use strict';

// MODULES //

var tape = require( 'tape' );
var assert = require( 'chai' ).assert;
var copy = require( 'utils-copy' );
var proxyquire = require( 'proxyquire' );
var defaults = require( './../lib/defaults.json' );
var resolve = require( './../lib/resolve.js' );


// FIXTURES //

var results = require( './fixtures/results.json' );
var repos = require( './fixtures/repos.json' );


// TESTS //

tape( 'file exports a function', function test( t ) {
	t.equal( typeof resolve, 'function', 'export is a function' );
	t.end();
});

tape( 'function returns an error to a provided callback if an error is encountered when fetching a file', function test( t ) {
	var resolve;
	var opts;

	resolve = proxyquire( './../lib/resolve.js', {
		'./request.js': request
	});

	opts = copy( defaults );
	resolve( 'README.md', [repos[0]], opts, done );

	function request( opts, clbk ) {
		setTimeout( onTimeout, 0 );
		function onTimeout() {
			clbk({
				'status': 500,
				'message': 'bad request'
			});
		}
	}

	function done( error ) {
		t.equal( error.status, 500, 'equal status' );
		t.equal( error.message, 'bad request', 'equal message' );
		t.end();
	}
});

tape( 'function returns an error to a provided callback if an error is encountered when fetching a file (callback only called once)', function test( t ) {
	var resolve;
	var opts;

	resolve = proxyquire( './../lib/resolve.js', {
		'./request.js': request
	});

	opts = copy( defaults );
	resolve( 'README.md', repos, opts, done );

	function request( opts, clbk ) {
		setTimeout( onTimeout, 0 );
		function onTimeout() {
			clbk({
				'status': 500,
				'message': 'bad request'
			});
		}
	}

	function done( error ) {
		t.equal( error.status, 500, 'equal status' );
		t.equal( error.message, 'bad request', 'equal message' );
		t.end();
	}
});

tape( 'the function returns a JSON object upon attempting to resolve a file from one or more repositories', function test( t ) {
	var resolve;
	var opts;

	resolve = proxyquire( './../lib/resolve.js', {
		'./request.js': request
	});

	opts = copy( defaults );
	resolve( 'README.md', repos, opts, done );

	function request( opts, clbk ) {
		setTimeout( onTimeout, 0 );
		function onTimeout() {
			clbk( null, {}, 'beep' );
		}
	}

	function done( error, results ) {
		if ( error ) {
			t.ok( false, error.message );
		} else {
			t.equal( typeof results, 'object', 'returns an object' );
		}
		t.end();
	}
});

tape( 'the returned JSON object has a `meta` field which contains meta data documenting how many files were successfully resolved', function test( t ) {
	var expected;
	var resolve;
	var opts;

	resolve = proxyquire( './../lib/resolve.js', {
		'./request.js': request
	});

	expected = {
		'meta': {
			'total': 3,
			'success': 3,
			'failure': 0
		},
		'data': {
			'kgryte/beep': 'beep',
			'kgryte/boop': 'beep',
			'kgryte/bop': 'beep'
		},
		'failures': {}
	};

	opts = copy( defaults );
	resolve( 'README.md', repos, opts, done );

	function request( opts, clbk ) {
		setTimeout( onTimeout, 0 );
		function onTimeout() {
			clbk( null, {}, 'beep' );
		}
	}

	function done( error, results ) {
		if ( error ) {
			t.ok( false, error.message );
		} else {
			t.equal( results.meta.total, 3, 'returns total' );
			t.equal( results.meta.success, 3, 'returns number of successes' );
			t.equal( results.meta.failure, 0, 'returns number of failures' );
		}
		t.end();
	}
});

tape( 'the returned JSON object has a `data` field which contains a repo hash with file content', function test( t ) {
	var expected;
	var resolve;
	var opts;

	resolve = proxyquire( './../lib/resolve.js', {
		'./request.js': request
	});

	expected = {
		'meta': {
			'total': 3,
			'success': 3,
			'failure': 0
		},
		'data': {
			'kgryte/beep': 'beep',
			'kgryte/boop': 'beep',
			'kgryte/bop': 'beep'
		},
		'failures': {}
	};

	opts = copy( defaults );
	resolve( 'README.md', repos, opts, done );

	function request( opts, clbk ) {
		setTimeout( onTimeout, 0 );
		function onTimeout() {
			clbk( null, {}, 'beep' );
		}
	}

	function done( error, results ) {
		if ( error ) {
			t.ok( false, error.message );
		} else {
			assert.deepEqual( results, expected );
			t.ok( true, 'deep equal' );
		}
		t.end();
	}
});

tape( 'when unable to resolve a file, the returned JSON object has a `failures` field which contains a repo hash with error messages', function test( t ) {
	var expected;
	var resolve;
	var opts;

	resolve = proxyquire( './../lib/resolve.js', {
		'./request.js': request
	});

	expected = {
		'meta': {
			'total': 3,
			'success': 0,
			'failure': 3
		},
		'data': {},
		'failures': {
			'kgryte/beep': 'Not Found',
			'kgryte/boop': 'Not Found',
			'kgryte/bop': 'Not Found'
		}
	};

	opts = copy( defaults );
	resolve( 'README.md', repos, opts, done );

	function request( opts, clbk ) {
		setTimeout( onTimeout, 0 );
		function onTimeout() {
			var err = {
				'status': 404,
				'message': 'Not Found'
			};
			clbk( err, {}, '' );
		}
	}

	function done( error, results ) {
		if ( error ) {
			t.ok( false, error.message );
		} else {
			assert.deepEqual( results, expected );
			t.ok( true, 'deep equal' );
		}
		t.end();
	}
});

tape( 'the function resolves files in multiple repositories', function test( t ) {
	var expected;
	var resolve;
	var count;
	var data;
	var opts;

	resolve = proxyquire( './../lib/resolve.js', {
		'./request.js': request
	});

	opts = copy( defaults );
	count = -1;

	expected = results;
	data = [
		'boop',
		'beep',
		'Not Found'
	];

	resolve( 'README.md', repos, opts, done );

	function request( opts, clbk ) {
		setTimeout( onTimeout, 0 );
		function onTimeout() {
			var err;
			count += 1;
			if ( count < 2 ) {
				return clbk( null, {}, data[ count ] );
			}
			if ( count === 2 ) {
				err = {
					'status': 404,
					'message': 'Not Found'
				};
				return clbk( err, {}, '' );
			}
		}
	}

	function done( error, results ) {
		if ( error ) {
			t.ok( false, error.message );
		} else {
			assert.deepEqual( results, expected );
			t.ok( true, 'deep equal' );
		}
		t.end();
	}
});
