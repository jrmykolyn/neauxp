#!/usr/bin/env node

// --------------------------------------------------
// IMPORT MODULES
// --------------------------------------------------
// Vendor
const { execSync } = require( 'child_process' );
const chalk = require( 'chalk' );

// Project
const pkg = require( `${process.cwd()}/package.json` );
const Neauxp = require( '../dist' );

// --------------------------------------------------
// DECLARE VARS
// --------------------------------------------------
const { neauxp: opts = {} } = pkg;
const neauxp = new Neauxp( opts );

// --------------------------------------------------
// INIT
// --------------------------------------------------
const files = execSync( 'git diff --name-only --cached', { encoding: 'utf-8' } ).trim().split( '\n' );

neauxp.run( files )
    .then( ( { matches, msg } ) => {
        if ( matches ) {
            console.log( chalk.red( msg ) );
            console.log( chalk.red( JSON.stringify( matches, null, 2 ) ) );
            process.exit( 1 );
        } else {
            console.log( msg );
            process.exit( 0 );
        }
    } )
    .catch( ( err ) => {
        console.log( chalk.red( err ) );
        process.exit( 1 );
    } );
