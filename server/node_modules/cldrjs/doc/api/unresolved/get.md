## .get( path )

Overload (extend) `.get()` to get the item data or lookup by following [locale inheritance](http://www.unicode.org/reports/tr35/#Locale_Inheritance), set a local resolved cache if it's found (for subsequent faster access), or return `undefined`.

| Parameter | Type | Example |
| --- | --- | --- |
| *path* | String or<br>Array | See `cldr.get()` above for more information |

```javascript
ptBr.get( "main/{languageId}/numbers/symbols-numberSystem-latn/decimal" );
// ➡ ","
```
