// --------------------------------------------------
// IMPORT MODULES
// --------------------------------------------------
// Vendor
const chai = require( 'chai' );
const { it } = require( 'mocha' );
const sinon = require( 'sinon' );
const sinonChai = require( 'sinon-chai' );
const chaiAsPromised = require( 'chai-as-promised' );
const { expect } = chai;

// Project
const Neauxp = require( '../dist' );

// --------------------------------------------------
// DECLARE VARS
// --------------------------------------------------
chai.use( sinonChai ).use( chaiAsPromised );

const MOCK_OPTS = {
    patterns: {
        'foo': [
            'foo',
            'bar',
            'baz',
            'quux',
        ],
    },
};

// --------------------------------------------------
// DEFINE TESTS
// --------------------------------------------------
describe( 'Neauxp', () => {
    describe( 'General', () => {
        it( 'should be importable', () => {

        } );

        it( 'should be instantiable', () => {

        } );
    } );

    describe( 'Instance methods', () => {
        describe( 'API', () => {
            const methods = [
                'run',
            ];

            methods.forEach(( method ) => {
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

        describe( 'run()', () => {
            it( 'should return a Promise', () => {
                const instance = new Neauxp( MOCK_OPTS );

                const result = instance.run().then( sinon.stub(), sinon.stub() );

                expect(result).to.be.an.instanceof( Promise );
            } );

            it( 'should resolve with 0x matches if the current commit does not include any violations', ( done ) => {
                const OPTS = {
                    patterns : {
                        bar: [ 'hello', 'world!' ],
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
                        foo: [
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
    } );
} );
