Fetch File
===
[![NPM version][npm-image]][npm-url] [![Build Status][build-image]][build-url] [![Coverage Status][coverage-image]][coverage-url] [![Dependencies][dependencies-image]][dependencies-url]

> Fetch a file from one or more public Gitub repositories.


## Installation

``` bash
$ npm install github-fetch-file
```


## Usage

``` javascript
var fetch = require( 'github-fetch-file' );
```

<a name="fetch"></a>
#### fetch( filepath, repos, clbk )

Fetches a `file` from one or more __public__ Github repositories.

``` javascript
// List of repository slugs (username|org/repo):
var repos = [
	'kgryte/utils-copy',
	'dstructs/matrix',
	'math-io/gamma',
	'unknown_user/repo'
];

// Fetch a top-level `README.md` file from each repo:
fetch( 'README.md', repos, clbk );

function clbk( error, results ) {
	if ( error ) {
		throw new Error( error.message );
	}
	console.dir( results );
	/*
		{
			"meta": {
				"total": 4,
				"success": 3,
				"failure": 1
			},
			"data": {
				"kgryte/utils-copy": "...",
				"dstructs/matrix": "...",
				"math-io/gamma": "..."
			},
			"failures": {
				"unknown_user/repo": "Not Found"
			}
		}
	*/
}
```


#### fetch.factory( filepath, repos, clbk )

Creates a reusable `function`.

``` javascript
var repos = [
	'kgryte/utils-copy',
	'dstructs/matrix',
	'math-io/gamma',
	'unknown_user/repo'
];

var get = fetch.factory( 'README.md', repos, clbk );

get();
get();
get();
// ...
```

The factory method accepts the same `arguments` as [`fetch()`](#fetch).


## Notes

*	If the module encounters an application-level `error` (e.g., no network connection, etc), the `error` is returned immediately to the provided `callback`.
*	If the module encounters a downstream `error` (e.g., timeout, reset connection, etc), the `error` is included in the returned results under the `failures` field.


---
## Examples

``` javascript
var fetch = require( 'github-fetch-file' );

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
```

To run the example code from the top-level application directory,

``` bash
$ DEBUG=* node ./examples/index.js
```


---
## CLI

### Installation

To use the module as a general utility, install the module globally

``` bash
$ npm install -g github-fetch-file
```


### Usage

``` bash
Usage: ghfetchfile [options] file --repo slug1 --repo slug2 ...

Options:

  -h,  --help               Print this message.
  -V,  --version            Print the package version.
       --repo slug          Repository slug; e.g., kgryte/github-fetch-file.
```


### Notes

*	If a repository file is successfully resolved, the file content is written to `stdout`.
*	If a repository file cannot be resolved due to a downstream `error` (failure), the repo `slug` (and its associated `error`) is written to `sterr`.
*	Output order is __not__ guaranteed to match input order.


### Examples

``` bash
$ DEBUG=* ghfetchfile README.md --repo 'kgryte/utils-copy' --repo 'dstructs/matrix' --repo 'math-io/gamma'
# => {...}
```

For local installations, modify the command to point to the local installation directory; e.g., 

``` bash
$ DEBUG=* ./node_modules/.bin/ghfetchfile README.md --repo 'kgryte/utils-copy' --repo 'dstructs/matrix' --repo 'math-io/gamma'
# => {...}
```

Or, if you have cloned this repository and run `npm install`, modify the command to point to the executable; e.g., 

``` bash
$ DEBUG=* node ./bin/cli README.md --repo 'kgryte/utils-copy' --repo 'dstructs/matrix' --repo 'math-io/gamma'
# => {...}
```


---
## Tests

### Unit

This repository uses [tape][tape] for unit tests. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul][istanbul] as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


### Browser Support

This repository uses [Testling][testling] for browser testing. To run the tests in a (headless) local web browser, execute the following command in the top-level application directory:

``` bash
$ make test-browsers
```

To view the tests in a local web browser,

``` bash
$ make view-browser-tests
```

<!-- [![browser support][browsers-image]][browsers-url] -->


---
## License

[MIT license](http://opensource.org/licenses/MIT).


## Copyright

Copyright &copy; 2016. Athan Reines.


[npm-image]: http://img.shields.io/npm/v/github-fetch-file.svg
[npm-url]: https://npmjs.org/package/github-fetch-file

[build-image]: http://img.shields.io/travis/kgryte/github-fetch-file/master.svg
[build-url]: https://travis-ci.org/kgryte/github-fetch-file

[coverage-image]: https://img.shields.io/codecov/c/github/kgryte/github-fetch-file/master.svg
[coverage-url]: https://codecov.io/github/kgryte/github-fetch-file?branch=master

[dependencies-image]: http://img.shields.io/david/kgryte/github-fetch-file.svg
[dependencies-url]: https://david-dm.org/kgryte/github-fetch-file

[dev-dependencies-image]: http://img.shields.io/david/dev/kgryte/github-fetch-file.svg
[dev-dependencies-url]: https://david-dm.org/dev/kgryte/github-fetch-file

[github-issues-image]: http://img.shields.io/github/issues/kgryte/github-fetch-file.svg
[github-issues-url]: https://github.com/kgryte/github-fetch-file/issues

[tape]: https://github.com/substack/tape
[istanbul]: https://github.com/gotwarlost/istanbul
[testling]: https://ci.testling.com
