

	var pathNormalize = function( path, attributes ) {
		if ( arrayIsArray( path ) ) {
			path = path.join( "/" );
		}
		if ( typeof path !== "string" ) {
			throw new Error( "invalid path \"" + path + "\"" );
		}
		// 1: Ignore leading slash `/`
		// 2: Ignore leading `cldr/`
		path = path
			.replace( /^\// , "" ) /* 1 */
			.replace( /^cldr\// , "" ); /* 2 */

		// Replace {attribute}'s
		path = path.replace( /{[a-zA-Z]+}/g, function( name ) {
			name = name.replace( /^{([^}]*)}$/, "$1" );
			return attributes[ name ];
		});

		return path.split( "/" );
	};

