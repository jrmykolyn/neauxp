// --------------------------------------------------
// IMPORT MODULES
// --------------------------------------------------
// Node
const fs = require( 'fs' );

// Vendor
const globToRegExp = require( 'glob-to-regexp' );

// --------------------------------------------------
// DEFINE CLASS
// --------------------------------------------------
class Neauxp {
	static get MESSAGES() {
		return {
			ERROR: {
				INVALID_FILES: 'Whoops, please ensure that the `run()` method is invoked with an array of file paths.',
				INVALID_OPTS: 'Whoops, please ensure that Neauxp is invoked with a valid options object.',
				INVALID_PATTERNS: 'Whoops, please ensure that Neauxp includes a valid `patterns` object.',
			},
			RESPONSE: {
				HAS_MATCHES: 'Whoops, please review and address the following violations.',
				NO_MATCHES: 'Yay, no violations found!',
			},
		};
	}

	constructor( options ) {
		if ( !options || typeof options !== 'object' ) {
			throw new Error( Neauxp.MESSAGES.ERROR.INVALID_OPTS );
		}

		this.settings = Object.assign( {}, options );
	}

	run( files = [] ) {
		let output = {};

		return new Promise( ( resolve, reject ) => {
			if ( !this.settings.patterns || typeof this.settings.patterns !== 'object' || !Object.keys( this.settings.patterns ).length ) {
				reject( Neauxp.MESSAGES.ERROR.INVALID_PATTERNS );
				return;
			}

			if ( !Array.isArray( files ) || !files.length ) {
				reject( Neauxp.MESSAGES.ERROR.INVALID_FILES );
				return;
			}

			files
				.filter( fileName => fs.lstatSync( fileName ).isFile() )
				.forEach( ( fileName ) => {
					const patterns = Object.keys( this.settings.patterns )
						.map( key => [ key, globToRegExp( key ) ] )
						.filter( tuple => tuple[ 1 ].test( fileName ) )
						.map( tuple => this.settings.patterns[ tuple[ 0 ] ] )
						.reduce( ( acc, arr ) => [ ...acc, ...arr ], [] );

					const content = fs.readFileSync( `${process.cwd()}/${fileName}`, { encoding: 'utf-8' } );

					const matches = patterns
						.map( pattern => content.match( pattern ) )
						.filter( match => !!match )
						.reduce( ( acc, arr ) => [ ...acc, ...arr ], [] );

					output = { ...output, ...( matches && matches.length ? { [ fileName ]: matches } : {} ) };
				} );

			Object.keys( output ).length
				? resolve( { matches: output, msg: Neauxp.MESSAGES.RESPONSE.HAS_MATCHES } )
				: resolve( { matches: null, msg: Neauxp.MESSAGES.RESPONSE.NO_MATCHES } );
		} );
	}
}

// --------------------------------------------------
// PUBLIC API
// --------------------------------------------------
module.exports = Neauxp;
