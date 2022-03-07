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
(function( root, factory ) {

	if ( typeof define === "function" && define.amd ) {
		// AMD.
		
		// Node. CommonJS.
		module.exports = factory();
	} else {
		// Global
		root.Cldr = factory();
	}

}( this, function() {
