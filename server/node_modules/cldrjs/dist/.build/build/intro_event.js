/**
 * CLDR JavaScript Library v@VERSION
 * http://jquery.com/
 *
 * Copyright 2013 Rafael Xavier de Souza
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: @DATE
 */
/*!
 * CLDR JavaScript Library v@VERSION @DATE MIT license © Rafael Xavier
 * http://git.io/h4lmVg
 */
(function( factory ) {

	if ( typeof define === "function" && define.amd ) {
		// AMD.
		
		// Node. CommonJS.
		module.exports = factory( require( "../cldr" ) );
	} else {
		// Global
		factory( Cldr );
	}

}(function( Cldr ) {

	// Build optimization hack to avoid duplicating functions across modules.
	var pathNormalize = Cldr._pathNormalize,
		validatePresence = Cldr._validatePresence,
		validateType = Cldr._validateType;

