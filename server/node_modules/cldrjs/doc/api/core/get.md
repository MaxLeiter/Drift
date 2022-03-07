## .get( path )

Get the item data given its path, or `undefined` if missing.

| Parameter | Type | Example |
| --- | --- | --- |
| *path* | String or<br>Array | `"/cldr/main/{languageId}/numbers/symbols-numberSystem-latn/decimal"`<br>`[ "cldr", "main", "{languageId}", "numbers", "symbols-numberSystem-latn", "decimal" ]` |

On *path* parameter, note the leading "/cldr" can be ommited. Also, note that its Array form accepts subpaths, eg. `[ "cldr/main", "{languageId}", "numbers/symbols-numberSystem-latn/"decimal" ]`.

The [locale attributes](#cldrattributes), eg. `{languageId}`, are replaced with their appropriate values.

If extended with the `cldr/unresolved.js` module, get the item data or lookup by following [locale inheritance](http://www.unicode.org/reports/tr35/#Locale_Inheritance), set a local resolved cache if it's found (for subsequent faster access), or return `undefined`.

```javascript
ptBr.get( "main/{languageId}/numbers/symbols-numberSystem-latn/decimal" );
// ➡ ","
```
