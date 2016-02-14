'use strict';

var fetch = require( './../lib' );

var repos = [
	'kgryte/utils-copy',
	'math-io/gamma',
	'dstructs/matrix'
];

fetch( 'README.md', repos, clbk );

function clbk( error, results ) {
	if ( error ) {
		throw new Error( error.message );
	}
	console.dir( results );
}