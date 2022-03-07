# cldr.js - Simple CLDR traverser

[CLDR (unicode.org)](http://cldr.unicode.org/) provides locale content for i18n software. The data is provided in two formats: LDML (XML format) and JSON. Our goal is to provide a simple layer to facilitate i18n software to access and use the [official CLDR JSON data](http://cldr.unicode.org/index/cldr-spec/json).

| File | Minified + gzipped size | Summary |
|---|--:|---|
| cldr.js | 2.1KB | Core library |
| cldr/event.js | +1.4KB | Provides methods to allow listening to events, eg. `get` |
| cldr/supplemental.js | +0.5KB | Provides supplemental helper methods |
| cldr/unresolved.js | +0.7KB | Provides inheritance support for unresolved data |

Quick jump:
- [About cldr.js?](#about-cldrjs)
- [Getting Started](#getting-started)
  - [Usage and installation](#usage-and-installation)
  - [How to get CLDR JSON data?](#how-to-get-cldr-json-data)
  - [How do I load CLDR data into Cldrjs?](#how-do-i-load-cldr-data-into-cldrjs)
- [API](#api)
- [Error reference](#error)
- [Development / Contributing](#development--contributing)


## About cldr.js?

### Who uses cldr.js?

| Organization | Project |
|---|---|
| ![jQuery](doc/asset/jquery.png) | https://github.com/globalize/globalize |
| ![Angular](https://angular.io/assets/images/logos/angular/angular.png) | https://github.com/angular/angular |

### Where to use it?

It's designed to work both in the [browser](#usage-and-installation) and in [Node.js](#commonjs--nodejs). It supports [AMD](#usage-and-installation) and [CommonJs](#usage-and-installation);

See [Usage and installation](#usage-and-installation).

### What changed from 0.3.x to 0.4.x?

See our [changelogs](./CHANGELOG.md).

### Load only the CLDR portion you need

```javascript
// Load the appropriate portion of CLDR JSON data
Cldr.load(
  likelySubtagsData,
  enData,
  ptBrData
);
```

See [How to get CLDR JSON data?](#how-to-get-cldr-json-data) below for more information on how to get that data.

### Instantiate a locale and get it normalized

```javascript
var en = new Cldr( "en" );
en.attributes;
// > {
//   "bundle": "en",
//   "minLanguageId": "en",
//   "maxLanguageId": "en-Latn-US",
//   "language": "en",
//   "script": "Latn",
//   "territory": "US",
//   "region": "US"
// }

var zh = new Cldr( "zh-u-nu-finance-cu-cny" );
zh.attributes;
// > {
//   "bundle": "zh-Hant",
//   "minLanguageId": "zh",
//   "maxLanguageId": "zh-Hans-CN",
//   "language": "zh",
//   "script": "Hans",
//   "territory": "CN",
//   "region": "CN",
//   "u-nu": "finance",
//   "u-cu": "cny"
// }

```

- `language`, `script`, `territory` (also aliased as `region`), `maxLanguageId` (computed by [adding likely subtags](./src/core/likely_subtags.js)) and `minLanguageId` (computed by [removing likely subtags](./src/core/remove_likely_subtags.js)) according to the [specification](http://www.unicode.org/reports/tr35/#Likely_Subtags).
- `bundle` holds the bundle lookup match based on the available loaded CLDR data, obtained by following [Bundle Lookup Matcher][].
- [Unicode locale extensions](http://www.unicode.org/reports/tr35/#u_Extension).

Comparison between different locales.

| locale | minLanguageId | maxLanguageId | language | script | region |
| --- | --- | --- | --- | --- | --- |
| **en** |  `"en"` |  `"en-Latn-US"`  |  `"en"` |  `"Latn"` |  `"US"` |
| **en-US** |  `"en"` |  `"en-Latn-US"`  |  `"en"` |  `"Latn"` |  `"US"` |
| **de** |  `"de"` |  `"de-Latn-DE"`  |  `"de"` |  `"Latn"` |  `"DE"` |
| **zh** |  `"zh"` |  `"zh-Hans-CN"`  |  `"zh"` |  `"Hans"` |  `"CN"` |
| **zh-TW** |  `"zh-TW"` |  `"zh-Hant-TW"`  |  `"zh"` |  `"Hant"` | `"TW"` |
| **ar** |  `"ar"` |  `"ar-Arab-EG"` |  `"ar"` |  `"Arab"` | `"EG"` |
| **pt** | `"pt"` | `"pt-Latn-BR"` | `"pt"` | `"Latn"` | `"BR"` |
| **pt-BR** | `"pt"` | `"pt-Latn-BR"` | `"pt"` | `"Latn"` | `"BR"` |
| **pt-PT** | `"pt-PT"` | `"pt-Latn-PT"` | `"pt"` | `"Latn"` | `"PT"` |
| **es** | `"es"` | `"es-Latn-ES"` | `"es"` | `"Latn"` | `"ES"` |
| **es-AR** | `"es-AR"` | `"es-Latn-AR"` | `"es"` | `"Latn"` | `"AR"` |

### Get item given its path

```javascript
// Equivalent to:
// .get( "main/{bundle}/numbers/symbols-numberSystem-latn/decimal" );
en.main( "numbers/symbols-numberSystem-latn/decimal" );
// > "."

// Equivalent to:
// .get( "main/{bundle}/numbers/symbols-numberSystem-latn/decimal" );
ptBr.main( "numbers/symbols-numberSystem-latn/decimal" );
// > ","
```

Have any [locale attributes](#cldrattributes) replaced with their corresponding values by embracing it with `{}`. In the example below, `{language}` is replaced with `"en"` and `{territory}` with `"US"`.

```javascript
// Notice the more complete way to get this data is:
// cldr.get( "supplemental/gender/personList/{language}" ) ||
// cldr.get( "supplemental/gender/personList/001" );
var enGender = en.get( "supplemental/gender/personList/{language}" );
// > "neutral"

var USCurrencies = en.get( "supplemental/currencyData/region/{territory}" );
// > [
//   { USD: { _from: "1792-01-01" } },
//   { USN: { _tender: "false" } },
//   { USS: { _tender: "false" } }
// ]

// Notice the more complete way to get this data is:
// cldr.get( "supplemental/measurementData/measurementSystem/{territory}" ) ||
// cldr.get( "supplemental/measurementData/measurementSystem/001" );
var enMeasurementSystem = en.get( "supplemental/measurementData/measurementSystem/{territory}" );
// > "US"
```

Get `undefined` for non-existent data.

```javascript
en.get( "/crazy/invalid/path" );
// ➡ undefined

// Avoid this
enData && enData.crazy && enData.crazy.invalid && enData.crazy.invalid.path;
```

### Resolve CLDR inheritances

If you are using unresolved JSON data, you can resolve them dynamically during runtime by loading the `cldr/unresolved.js` extension module. Currently, we support bundle inheritance.

```javascript
Cldr.load(
  unresolvedEnData
  unresolvedEnGbData,
  unresolvedEnInData,
  parentLocalesData, // supplemental
  likelySubtagsData  // supplemental
);

var enIn = new Cldr( "en-IN" );

// 1st time retrieved by resolving: en-IN ➡ en-GB (parent locale lookup).
// Further times retrieved straight from the resolved cache.
enIn.main( "dates/calendars/gregorian/dateTimeFormats/availableFormats/yMd" );
// > "dd/MM/y"

// 1st time retrieved by resolving: en-IN ➡ en-GB (parent locale lookup) ➡ en (truncate lookup)
// Further times retrieved straight from the resolved cache.
enIn.main( "numbers/symbols-numberSystem-latn/decimal" );
// > "."
```

### Helpers

We offer some convenient helpers.

```javascript
var usFirstDay = en.supplemental.weekData.firstDay();
// ➡ sun
// Equivalent to:
// en.get( "supplemental/weekData/firstDay/{territory}" ) ||
// en.get( "supplemental/weekData/firstDay/001" );

var brFirstDay = ptBr.supplemental.weekData.firstDay();
// ➡ mon
// Equivalent to:
// ptBr.get( "supplemental/weekData/firstDay/{territory}" ) ||
// ptBr.get( "supplemental/weekData/firstDay/001" );
```

### Browser support

We officially support:
- Firefox (latest - 2)+
- Chrome (latest - 2)+
- Safari 5.1+
- IE 8+
- Opera (latest - 2)+

Sniff tests show cldr.js also works on the following browsers:
- Firefox 4+
- Safari 5+
- Chrome 14+
- IE 6+
- Opera 11.1+

If you find any bugs, please just let us know. We'll be glad to fix them for the officially supported browsers, or at least update the documentation for the unsupported ones.


## Getting Started

### Usage and installation

cldr.js has no external dependencies. You can include it in the script tag of your page and you're ready to go. [Download it by clicking here](https://github.com/rxaviers/cldr/releases).

```html
<script src="cldr.js"></script>
```


```javascript
// Load the appropriate portion of CLDR JSON data.
// See "How to get CLDR JSON data?" below for more information on how to get that data.
Cldr.load( cldrJsonData );

// Instantiate it by passing a locale.
var ptBr = new Cldr( "pt-BR" );

// Get CLDR item data given its path.
// Equivalent to:
// .get( "main/{bundle}/numbers/symbols-numberSystem-latn/decimal" );
ptBr.main( "numbers/symbols-numberSystem-latn/decimal" );
// > ","
```

We are UMD wrapped. So, it supports AMD, CommonJS, or global variables (in case neither AMD nor CommonJS have been detected).

Example of usage on AMD:

```bash
bower install cldrjs
```

```javascript
require.config({
  paths: {
    "cldr": "bower_components/cldrjs/dist/cldr"
  }
});

require( [ "cldr", "cldr/supplemental", "cldr/unresolved" ], function( Cldr ) {
  ...
});
```

Example of usage with Node.js:

```bash
npm install cldrjs
```

```javascript
var Cldr = require( "cldrjs" );
```

### How to get CLDR JSON data?

*By downloading the JSON packages individually...*

Unicode CLDR is available as JSON at https://github.com/unicode-cldr/ (after this [json-packaging proposal][] took place). Please, read https://github.com/unicode-cldr/cldr-json for more information about package organization.

[json-packaging proposal]: http://cldr.unicode.org/development/development-process/design-proposals/json-packaging

*By using a package manager...*

`cldr-data` can be used for convenience. It always downloads from the correct source.

Use bower `bower install cldr-data` ([detailed instructions][]) or npm `npm install cldr-data`. For more information, see:

- https://github.com/rxaviers/cldr-data-npm
- https://github.com/rxaviers/cldr-data-bower

[detailed instructions]: https://github.com/rxaviers/cldr-data-bower

*By generating the JSON mappings yourself...*

You can generate the JSON representation of the languages not available in the ZIP file by using the official conversion tool ([`tools.zip`](http://www.unicode.org/Public/cldr/latest/)). This ZIP contains a README with instructions on how to build the data.

You can choose to generate unresolved data to save space or bandwidth (`-r false` option of the conversion tool) and instead have it resolve at runtime.

### How do I load CLDR data into Cldrjs?

The short answer is by using `Cldr.load()` and passing the JSON data as the first argument. Below, follow several examples on how this could be accomplished.

For the examples below, first fetch CLDR JSON data:

```bash
wget http://www.unicode.org/Public/cldr/latest/json.zip
unzip json.zip -d cldr
```

Example of embedding CLDR JSON data:  

```html
<script>
// Embedded (hard-coded) CLDR JSON data.
Cldr.load({
  supplemental: {
    likelySubtags: {
      ...
    }
  }
});
</script>
```

Example of loading it dynamically:

```html
<script src="jquery.js"></script>
<script>
$.get( "cldr/supplemental/likelySubtags.json", Cldr.load );
</script>
```

Example using AMD (also see our [functional tests](test/functional.js)):
```javascript
define([
  "cldr",
  "json!cldr/supplemental/likelySubtags.json"
], function( Cldr, likelySubtags ) {

  Cldr.load( likelySubtags );

});
```

Example using Node.js:

```javascript
var Cldr = require( "cldrjs" );
Cldr.load( require( "./cldr/supplemental/likelySubtags.json" ) );
```

#### Attention: library owners, do not embed data

It's NOT recommended that libraries embed data into their code logic for several reasons: avoid forcing a certain data version on users, avoid maintaining locale changes, avoid duplicating data among different i18n libraries.

We recommend loading CLDR data must be performed by end user code.

#### Which CLDR portion to load?

It depends on the used modules.

| File | Required CLDR JSON data |
|---|---|
| cldr.js | `cldr/supplemental/likelySubtags.json` |
| cldr/unresolved.js |  `cldr/supplemental/parentLocales.json` |
| cldr/supplemental.js | `cldr/supplemental/{timeData, weekData}.json` |

You must also load any portion of the CLDR data you plan to use in your library or your end-application.

## API

### Core

- **`Cldr.load( json, ... )`**

 Load resolved or unresolved [1] JSON data.

 [Read more...](doc/api/core/load.md)

 1: Unresolved processing is **only available** after loading `cldr/unresolved.js` extension module.

- **`new Cldr( locale )`**

 Create a new instance of Cldr.

 [Read more...](doc/api/core/constructor.md)

- **`.attributes`**

 Attributes is an Object created during instance initialization (construction) and are used internally by `.get()` to replace dynamic parts of an item path.

 [Read more...](doc/api/core/attributes.md)

- **`.get( path )`**

 Get the item data given its path, or `undefined` if missing.

 [Read more...](doc/api/core/get.md)

- **`.main( path )`**

 It's an alias for `.get([ "main/{bundle}", ... ])`.

 [Read more...](doc/api/core/main.md)

### cldr/event.js

- **`Cldr.on( event, listener )`**

 Add a listener function to the specified event globally (for all instances).

 [Read more...](doc/api/event/global_on.md)

- **`Cldr.once( event, listener )`**

 Add a listener function to the specified event globally (for all instances). It will be automatically removed after it's first execution.

 [Read more...](doc/api/event/global_once.md)

- **`Cldr.off( event, listener )`**

 Remove a listener function from the specified event globally (for all instances).

 [Read more...](doc/api/event/global_off.md)

- **`.on( event, listener )`**

 Add a listener function to the specified event for this instance.

 [Read more...](doc/api/event/on.md)

- **`.once( event, listener )`**

 Add a listener function to the specified event for this instance. It will be automatically removed after it's first execution.

 [Read more...](doc/api/event/once.md)

- **`.off( event, listener )`**

 Remove a listener function from the specified event for this instance.

 [Read more...](doc/api/event/off.md)

#### Events

- `get` ➡ `( path, value )`

 Triggered before a `.get()` (or any alias) return. The triggered listener receives the normalized *path* and the *value* found.

 [Read more...](doc/api/event/event_get.md)

### cldr/supplemental.js

- **`.supplemental( path )`**

 It's an alias for `.get([ "supplemental", ... ])`.

 [Read more...](doc/api/supplemental.md)

- **`.supplemental.timeData.allowed()`**

 Helper function. Return the supplemental timeData allowed of locale's territory.

 [Read more...](doc/api/supplemental/time_data_allowed.md)

- **`.supplemental.timeData.preferred()`**

 Helper function. Return the supplemental timeData preferred of locale's territory.

 [Read more...](doc/api/supplemental/time_data_preferred.md)

- **`.supplemental.weekData.firstDay()`**

 Helper function. Return the supplemental weekData firstDay of locale's territory. 

 [Read more...](doc/api/supplemental/week_data_first_day.md)

- **`.supplemental.weekData.minDays()`**

 Helper function. Return the supplemental weekData minDays of locale's territory as a Number.

 [Read more...](doc/api/supplemental/week_data_min_days.md)

### cldr/unresolved.js

- **`.get( path )`**

 Overload (extend) `.get()` to get the item data or lookup by following [locale inheritance](http://www.unicode.org/reports/tr35/#Locale_Inheritance), set a local resolved cache if it's found (for subsequent faster access), or return `undefined`.

 [Read more...](doc/api/unresolved/get.md)

## Error reference

### CLDR Errors

#### `E_MISSING_BUNDLE`

Thrown when none of the loaded CLDR data can be used as a bundle for the corresponding locale. See more information on [Bundle Lookup Matcher][].

Error object:

| Attribute | Value |
| --- | --- |
| code | `E_MISSING_BUNDLE` |
| locale | Locale whose bundle could not be found |

### Parameter Errors

#### `E_MISSING_PARAMETER`

Thrown when a required parameter is missing on any static or instance methods.

Error object:

| Attribute | Value |
| --- | --- |
| code | `E_MISSING_PARAMETER` |
| name | Name of the missing parameter |

#### `E_INVALID_PAR_TYPE`

Thrown when a parameter has an invalid type on any static or instance methods.

Error object:

| Attribute | Value |
| --- | --- |
| code | `E_INVALID_PAR_TYPE` |
| name | Name of the invalid parameter |
| value | Invalid value |
| expected | Expected type |


### Development / Contributing

Install grunt and tests external dependencies. First, install the [grunt-cli](http://gruntjs.com/getting-started#installing-the-cli) and [bower](http://bower.io/) packages if you haven't before. These should be done as global installs. Then:

```bash
npm install && bower install
```
Run tests
```bash
grunt test
```
Build distribution file.
```bash
grunt
```

#### Release

On MacOS, use gnu-sed (`brew install gnu-sed`)

```bash
./chore/release <version> # where version is for example 0.5.2
```

[Bundle Lookup Matcher]: ./doc/bundle_lookup_matcher.md

## License

MIT © [Rafael Xavier de Souza](http://rafael.xavier.blog.br)
