

	/**
	 * new Cldr()
	 */
	var Cldr = function( locale ) {
		this.init( locale );
	};

	// Build optimization hack to avoid duplicating functions across modules.
	Cldr._alwaysArray = alwaysArray;
	Cldr._coreLoad = coreLoad;
	Cldr._createError = createError;
	Cldr._itemGetResolved = itemGetResolved;
	Cldr._jsonMerge = jsonMerge;
	Cldr._pathNormalize = pathNormalize;
	Cldr._resourceGet = resourceGet;
	Cldr._validatePresence = validatePresence;
	Cldr._validateType = validateType;
	Cldr._validateTypePath = validateTypePath;
	Cldr._validateTypePlainObject = validateTypePlainObject;

	Cldr._availableBundleMap = {};
	Cldr._availableBundleMapQueue = [];
	Cldr._resolved = {};

	// Allow user to override locale separator "-" (default) | "_". According to http://www.unicode.org/reports/tr35/#Unicode_language_identifier, both "-" and "_" are valid locale separators (eg. "en_GB", "en-GB"). According to http://unicode.org/cldr/trac/ticket/6786 its usage must be consistent throughout the data set.
	Cldr.localeSep = "-";

	/**
	 * Cldr.load( json [, json, ...] )
	 *
	 * @json [JSON] CLDR data or [Array] Array of @json's.
	 *
	 * Load resolved cldr data.
	 */
	Cldr.load = function() {
		Cldr._resolved = coreLoad( Cldr, Cldr._resolved, arguments );
	};

	/**
	 * .init() automatically run on instantiation/construction.
	 */
	Cldr.prototype.init = function( locale ) {
		var attributes, language, maxLanguageId, minLanguageId, script, subtags, territory, unicodeLocaleExtensions, variant,
			sep = Cldr.localeSep,
			unicodeLocaleExtensionsRaw = "";

		validatePresence( locale, "locale" );
		validateTypeString( locale, "locale" );

		subtags = coreSubtags( locale );

		if ( subtags.length === 5 ) {
			unicodeLocaleExtensions = subtags.pop();
			unicodeLocaleExtensionsRaw = sep + "u" + sep + unicodeLocaleExtensions;
			// Remove trailing null when there is unicodeLocaleExtensions but no variants.
			if ( !subtags[ 3 ] ) {
				subtags.pop();
			}
		}
		variant = subtags[ 3 ];

		// Normalize locale code.
		// Get (or deduce) the "triple subtags": language, territory (also aliased as region), and script subtags.
		// Get the variant subtags (calendar, collation, currency, etc).
		// refs:
		// - http://www.unicode.org/reports/tr35/#Field_Definitions
		// - http://www.unicode.org/reports/tr35/#Language_and_Locale_IDs
		// - http://www.unicode.org/reports/tr35/#Unicode_locale_identifier

		// When a locale id does not specify a language, or territory (region), or script, they are obtained by Likely Subtags.
		maxLanguageId = coreLikelySubtags( Cldr, this, subtags, { force: true } ) || subtags;
		language = maxLanguageId[ 0 ];
		script = maxLanguageId[ 1 ];
		territory = maxLanguageId[ 2 ];

		minLanguageId = coreRemoveLikelySubtags( Cldr, this, maxLanguageId ).join( sep );

		// Set attributes
		this.attributes = attributes = {
			bundle: bundleLookup( Cldr, this, minLanguageId ),

			// Unicode Language Id
			minLanguageId: minLanguageId + unicodeLocaleExtensionsRaw,
			maxLanguageId: maxLanguageId.join( sep ) + unicodeLocaleExtensionsRaw,

			// Unicode Language Id Subtabs
			language: language,
			script: script,
			territory: territory,
			region: territory, /* alias */
			variant: variant
		};

		// Unicode locale extensions.
		unicodeLocaleExtensions && ( "-" + unicodeLocaleExtensions ).replace( /-[a-z]{3,8}|(-[a-z]{2})-([a-z]{3,8})/g, function( attribute, key, type ) {

			if ( key ) {

				// Extension is in the `keyword` form.
				attributes[ "u" + key ] = type;
			} else {

				// Extension is in the `attribute` form.
				attributes[ "u" + attribute ] = true;
			}
		});

		this.locale = locale;
	};

	/**
	 * .get()
	 */
	Cldr.prototype.get = function( path ) {

		validatePresence( path, "path" );
		validateTypePath( path, "path" );

		return itemGetResolved( Cldr, path, this.attributes );
	};

	/**
	 * .main()
	 */
	Cldr.prototype.main = function( path ) {
		validatePresence( path, "path" );
		validateTypePath( path, "path" );

		validate( "E_MISSING_BUNDLE", this.attributes.bundle !== null, {
			locale: this.locale
		});

		path = alwaysArray( path );
		return this.get( [ "main/{bundle}" ].concat( path ) );
	};

	return Cldr;

