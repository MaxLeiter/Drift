## Bundle Lookup Matcher

Bundle Lookup is the process of selecting the right dataset for the requested locale. We run this process during instance creation and set it on `instance.attributes.bundle`, which is further used when traversing items of the **main** dataset.

User must load likelySubtags and any wanted main datasets prior to creating an instance. For example:

```javascript
Cldr.load(
  require( "cldr-data/supplemental/likelySubtags" ),   // JSON data from supplemental/likelySubtags.json
  require( "cldr-data/main/en-US/ca-gregorian" ),      // JSON data from main/en-US/ca-gregorian.json
  require( "cldr-data/main/en-GB/ca-gregorian" )       // JSON data from main/en-GB/ca-gregorian.json
);

var enUs = new Cldr( "en-US" );
console.log( enUs.attributes.bundle ); // "en-US"
console.log( enUs.main( "dates/calendars/gregorian/dateFormats/short" ) ); // "M/d/yy"

var enGb = new Cldr( "en-GB" );
console.log( enGb.attributes.bundle ); // "en-GB"
console.log( enGb.main( "dates/calendars/gregorian/dateFormats/short" ) ); // "dd/MM/y"
```

When instances are created, its `.attributes.bundle` reveals the matched bundle. The `.main` method uses this information to traverse the correct main item.

What happens if we include `main/en/ca-gregorian` to the above example? 

```javascript
Cldr.load(
  require( "cldr-data/supplemental/likelySubtags" ),   // JSON data from supplemental/likelySubtags.json
  require( "cldr-data/main/en/ca-gregorian" ),         // JSON data from main/en/ca-gregorian.json
  require( "cldr-data/main/en-US/ca-gregorian" ),      // JSON data from main/en-US/ca-gregorian.json
  require( "cldr-data/main/en-GB/ca-gregorian" )       // JSON data from main/en-GB/ca-gregorian.json
);

var enUs = new Cldr( "en-US" ); // English as spoken in United States.
console.log( enUs.attributes.bundle ); // "en"
console.log( enUs.main( "dates/calendars/gregorian/dateFormats/short" ) ); // "M/d/yy"

var enGb = new Cldr( "en-GB" ); // English as spoken in Great Britain.
console.log( enGb.attributes.bundle ); // "en-GB"
console.log( enGb.main( "dates/calendars/gregorian/dateFormats/short" ) ); // "dd/MM/y"
```

Now, the `en-US` requested locale uses the `en` bundle (not the `en-US` bundle as used in the first example) and `en-GB` still uses the `en-GB` bundle. Why? Because, `en` is the default content for `en-US` (deduced from likelySubtags data). Default content means that the child content is all in the parent. Therefore, both `en` and `en-US` are identical. Our bundle lookup matching algorithm always picks the grandest available parent. Note the retrieved main item is still the correct one (as it should be).

A good observer may notice that loading both `main/en/ca-gregorian` and `main/en-US/ca-gregorian` is redundant. Although loading both is not a problem, loading either the `en` or the `en-US` bundle alone is enough.

Let's add a bit of sugar to the requested locales.

```javascript
var en = new Cldr( "en" ); // English.
console.log( en.attributes.bundle ); // "en"

var enUs = new Cldr( "en-US" ); // English as spoken in United States.
console.log( enUs.attributes.bundle ); // "en"

var enLatnUs = new Cldr( "en-Latn-US" ); // English in Latin script as spoken in the United States.
console.log( enLatnUs.attributes.bundle ); // "en"
```

All instances above obviously matches the same `en` bundle. Because, (a) `en` is the default content for `en-US` and (b) `en-US` is the default content for `en-Latn-US`.

What happens if the requested locale includes [Unicode extensions][]?

```javascript
var en = new Cldr( "en-US-u-cu-USD" );
console.log( en.attributes.bundle ); // "en"
console.log( en.main( "numbers/currencies/{u-cu}/displayName" ) ); // "US Dollar"
```

[Unicode extensions][] are obviously ignored on bundle lookup. Note they are accessible via variable replacements.

Below are other non-obvious lookups.

```javascript
Cldr.load(
  require( "cldr-data/supplemental/likelySubtags" ),   // JSON data from supplemental/likelySubtags.json
  require( "cldr-data/main/sr-Cyrl/numbers" ),         // JSON data from main/sr-Cyrl/numbers.json
  require( "cldr-data/main/sr-Latn/numbers" ),         // JSON data from main/sr-Latn/numbers.json
  require( "cldr-data/main/zh-Hant/numbers" )          // JSON data from main/zh-Hant/numbers.json
);

var srCyrl = new Cldr( "sr-Cyrl" );
console.log( srCyrl.attributes.bundle ); // "sr-Cyrl"
console.log( srCyrl.main( "numbers/decimalFormats-numberSystem-latn/short/decimalFormat/1000-count-one" ) );
// ➜ "0 хиљ'.'"

var srRS = new Cldr( "sr-RS" );
console.log( srRs.attributes.bundle ); // "sr-Cyrl"
console.log( srRs.main( "numbers/decimalFormats-numberSystem-latn/short/decimalFormat/1000-count-one" ) );
// ➜ "0 хиљ'.'"

var srLatnRS = new Cldr( "sr-Latn-RS" );
console.log( srLatnRS.attributes.bundle ); // "sr-Latn"
console.log( srLatnRS.main( "numbers/decimalFormats-numberSystem-latn/short/decimalFormat/1000-count-one" ) );
// ➜ "0 hilj'.'"

var zhTW = new Cldr( "zh-TW" );
console.log( zhTW.attributes.bundle ); // "zh-Hant"
console.log( zhTW.main( "numbers/symbols-numberSystem-hanidec/nan" ) ); // "非數值"
```

Finally, if an instance is created whose bundle hasn't been loaded yet, its `.attributes.bundle` is set as `null`. If this instance is used to traverse a main dataset, an error is thrown. If this instance is used to traverse any non-main dataset (e.g., supplemental/postalCodeData.json) it can be used just fine.

```javascript
var zhCN = new Cldr( "zh-CN" );
console.log( zhCN.attributes.bundle ); // null
console.log( zhCN.main( /* something */ ) ); // Error: E_MISSING_BUNDLE
```

### Implementation details

[UTS#35][] doesn't specify how bundle lookup matcher should be implemented. [RFC 4647][] section 3.4 "Lookup" has an algorithm for that, although it fails in various cases listed above. Mark Davis, the co-founder and president of the Unicode Consortium, said (via CLDR mailing list and via [Fixing Inheritance doc][]) that bundle lookup should happen via [LanguageMatching](http://www.unicode.org/reports/tr35/#LanguageMatching).

Our belief is that LanguageMatching is a great algorithm for Best Fit Matcher. Although, it's an overkill for Lookup Matcher.

ICU (a known CLDR implementation) doesn't use LanguageMatching for Bundle Lookup Matcher either. But, it has its own implementation, which has its own flaws as Mark Davis says in the Fixing Inheritance doc "ICU uses the %%ALIAS element to counteract some of these problems... It doesn’t fix all of them, and the data is not derivable from CLDR."

We also believe ICU's aliases approach is not the best solution. Instead we believe in the following approach, whose result matches LanguageMatching with a score threshold of 100%.

`BundleLookupMatcher( requestedLocale, availableBundles )` is used for bundle lookup given an arbitrary `requestedLocale`.

  1. Create a Hash (aka Dictionary or Key-Value-Pair) object, named `availableBundlesMap`, that maps each `availableBundle` (value) to its respective [Remove Likely Subtags][] result (key).
    1. In case of a duplicate key, keep the smaller value, i.e., keep the available bundle locale whose length is the smallest; e.g., keep { "en": "en" } instead of { "en": "en-US" }.
  1. [Remove Likely Subtags][] from `requestedLocale` and let `minRequestedLocale` keep its result.
  1. Return `availableBundlesMap[ minRequestedLocale ]`.

This algorithm is faster than LanguageMatching and needs no extra CLDR to be created and maintained (likelySubtags is sufficient). Note the `availableBundlesMap` can be cached for improved performance on repeated calls.

[Fixing Inheritance doc]: https://docs.google.com/document/d/1qZwEVb4kfODi2TK5f4x15FYWj5rJRijXmSIg5m6OH8s/edit
[Remove Likely Subtags]: http://www.unicode.org/reports/tr35/tr35.html#Likely_Subtags
[RFC 4647]: http://www.ietf.org/rfc/rfc4647.txt
[Unicode extensions]: http://Www.unicode.org/reports/tr35/#u_Extension
[UTS#35]: http://www.unicode.org/reports/tr35
