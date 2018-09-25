// --------------------------------------------------
// IMPORT MODULES
// --------------------------------------------------
// Node
const fs = require( 'fs' );

// Vendor
const chai = require( 'chai' );
const { it } = require( 'mocha' );
const sinon = require( 'sinon' );
const sinonChai = require( 'sinon-chai' );
const chaiAsPromised = require( 'chai-as-promised' );
const { expect } = chai;

// Project
const Neauxp = require( '../src' );

// --------------------------------------------------
// DECLARE VARS
// --------------------------------------------------
chai.use( sinonChai ).use( chaiAsPromised );

const FOO_KEY = '*foo*';
const FOO_PATTERNS = [
	'foo',
	'bar',
	'baz',
	'quux',
];
const HELLO_KEY = '*hello*';
const HELLO_PATTERNS = [ 'a' ];
const WORLD_KEY = '*world*';
const WORLD_PATTERNS = [ 'b' ];
const MOCK_OPTS = {
	patterns: {
		[ FOO_KEY ]: FOO_PATTERNS,
		[ HELLO_KEY ]: HELLO_PATTERNS,
		[ WORLD_KEY ]: WORLD_PATTERNS,
	},
};

// --------------------------------------------------
// DEFINE TESTS
// --------------------------------------------------
describe( 'Neauxp', () => {
	describe( 'General', () => {
		it( 'should be importable', () => {
			expect( Neauxp ).to.be.a( 'function' );
		} );

		it( 'should be instantiable', () => {
			expect( new Neauxp( MOCK_OPTS ) ).to.be.an.instanceof( Neauxp );
		} );
	} );

	describe( 'Instance methods', () => {
		describe( 'API', () => {
			const methods = [
				'getContent',
				'getMatches',
				'getPatterns',
				'isFile',
				'run',
				'toOutput',
				'toTuple',
			];

			methods.forEach( ( method ) => {
				it( `should expose: ${method}()`, () => {
					expect( new Neauxp( MOCK_OPTS )[ method ] ).to.be.a( 'function' );
				} );
			} );
		} );

		describe( 'constructor()', () => {
			it( 'should throw an error when invoked without an `options` object', () => {
				expect( () => new Neauxp() ).to.throw();
			} );
		} );

		describe( 'getContent()', () => {
			it( 'should call `readFileSync` with the `fileName` provided', () => {
				const instance = new Neauxp( MOCK_OPTS );
				const fileName = 'foo/bar/baz';
				const readStub = sinon.stub( fs, 'readFileSync' );

				const result = instance.getContent( fileName );

				expect( readStub ).to.have.been.called;

				readStub.restore();
			} );

			it( 'should prefix the `fileName` with the current working directory', () => {
				const instance = new Neauxp( MOCK_OPTS );
				const fileName = 'foo/bar/baz';
				const readStub = sinon.stub( fs, 'readFileSync' );

				const result = instance.getContent( fileName );

				expect( readStub.args[ 0 ][ 0 ] ).to.equal( `${process.cwd()}/${fileName}` );

				readStub.restore();
			} );

			it( 'should not throw an error if the file does not exist', () => {
				const instance = new Neauxp( MOCK_OPTS );
				const fileName = 'foo/bar/baz';

				expect( () => instance.getContent( fileName ) ).to.not.throw();
			} );
		} );

		describe( 'getMatches()', () => {
			it( 'should return an empty array when invoked without args', () => {
				const instance = new Neauxp( MOCK_OPTS );

				const result = instance.getMatches();

				expect( result ).to.eql( [] );
			} );

			it( 'should return an array of matches', () => {
				const instance = new Neauxp( MOCK_OPTS );
				const input = 'Foo hello there, you must bar wondering baz about my quux?';
				const expected = FOO_PATTERNS;

				const result = instance.getPatterns( 'foo/bar/baz' );

				expect( result ).to.eql( expected );
			} );
		} );

		describe( 'getPatterns()', () => {
			it( 'should return an array of patterns', () => {
				const instance = new Neauxp( MOCK_OPTS );
				const expected = [
					'foo',
					'bar',
					'baz',
					'quux',
				];

				const result = instance.getPatterns( 'foo' );

				expect( result ).to.eql( expected );
			} );

			it( 'should merge pattern arrays', () => {
				const instance = new Neauxp( MOCK_OPTS );
				const expected = [
					'a',
					'b',
				];

				const result = instance.getPatterns( 'hello-world' );

				expect( result ).to.eql( expected );
			} );

			it( 'should return an empty array if no patterns exist', () => {
				const instance = new Neauxp( MOCK_OPTS );

				const result = instance.getPatterns( '__NOTHING_MATCHES_THIS_BAD_BOY__' );

				expect( result ).to.eql( [] );
			} );
		} );

		describe( 'isFile()', () => {
			it( 'should call `lstatSync()` with the `fileName` provided', () => {
				const instance = new Neauxp( MOCK_OPTS );
				const fileName = 'foo/bar/baz';
				const lstatStub = sinon.stub( fs, 'lstatSync' ).returns( { isFile: sinon.stub() } );

				const result = instance.isFile( fileName );

				expect( lstatStub ).to.have.been.calledWith( fileName );

				lstatStub.restore();
			} );
		} );

		describe( 'run()', () => {
			it( 'should return a Promise', () => {
				const instance = new Neauxp( MOCK_OPTS );

				const result = instance.run().then( sinon.stub(), sinon.stub() );

				expect( result ).to.be.an.instanceof( Promise );
			} );

			it( 'should throw an error if the instance was created without the required options', ( done ) => {
				const instance = new Neauxp( { badOpt: {} } );

				const result = instance.run( [ './test/data/foo.txt' ] );

				expect( result ).to.be.eventually.rejected.notify( done );
			} );

			it( 'should throw an error if the instance was created without at least 1x `pattern`', ( done ) => {
				const instance = new Neauxp( { patterns: {} } );

				const result = instance.run( [ './test/data/foo.txt' ] );

				expect( result ).to.be.eventually.rejected.notify( done );
			} );

			it( 'should resolve with 0x matches if the file set does not include any violations', ( done ) => {
				const OPTS = {
					patterns : {
						'*bar*': [ 'hello', 'world!' ],
					},
				};

				const instance = new Neauxp( OPTS );
				const resolveStub = sinon.stub();

				const result = instance.run( [ './test/data/foo.txt', './test/data/bar.txt' ] );

				expect( result ).to.be.eventually.become( {
					msg: Neauxp.MESSAGES.RESPONSE.NO_MATCHES,
					matches: null,
				} ).notify( done );
			} );

			it( 'should resolve with >= 1 matches if the current commit includes one or more violations', ( done ) => {
				const OPTS = {
					patterns: {
						'*foo*': [
							'bar',
							'baz',
							'quux',
						],
					},
				};

				const instance = new Neauxp( OPTS );
				const rejectStub = sinon.stub();

				const result = instance.run( [ './test/data/foo.txt', './test/data/bar.txt' ] );

				expect( result ).to.be.eventually.become( {
					msg: Neauxp.MESSAGES.RESPONSE.HAS_MATCHES,
					matches: { './test/data/foo.txt': [ 'bar', 'baz', 'quux' ] },
				} ).notify( done );
			} );
		} );

		describe( 'toTuple', () => {
			it( 'should return an array of length 2', () => {
				const instance = new Neauxp( MOCK_OPTS );
				sinon.stub( instance, 'getPatterns' );
				sinon.stub( instance, 'getContent' );
				sinon.stub( instance, 'getMatches' );

				const result = instance.toTuple( 'foo/bar/baz' );

				expect( result.length ).to.equal( 2 );
			} );

			it( 'should return the `fileName` as the first item in the array', () => {
				const instance = new Neauxp( MOCK_OPTS );
				const fileName = './test/data/foo.txt';
				sinon.stub( instance, 'getPatterns' );
				sinon.stub( instance, 'getContent' );
				sinon.stub( instance, 'getMatches' );

				const result = instance.toTuple( fileName );

				expect( result[ 0 ] ).to.equal( fileName );
			} );

			it( 'should return an array of matches as the second item', () => {
				const instance = new Neauxp( MOCK_OPTS );
				const fileName = './test/data/foo.txt';
				const expected = FOO_PATTERNS;

				const result = instance.toTuple( fileName );

				expect( result[ 1 ] ).to.eql( FOO_PATTERNS );
			} );
		} );
	} );
} );
