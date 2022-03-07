## .attributes

Attributes is an Object created during instance initialization (construction), and are used internally by `.get()` to replace dynamic parts of an item path.

| Attribute | Field | 
| --- | --- |
| `language` | Language Subtag ([spec](http://www.unicode.org/reports/tr35/#Language_Locale_Field_Definitions)) | 
| `script` | Script Subtag ([spec](http://www.unicode.org/reports/tr35/#Language_Locale_Field_Definitions)) | 
| `region` or `territory` | Region Subtag ([spec](http://www.unicode.org/reports/tr35/#Language_Locale_Field_Definitions)) | 
| `languageId` | Language Id ([spec](http://www.unicode.org/reports/tr35/#Unicode_language_identifier)) | 
| `maxLanguageId` | Maximized Language Id ([spec](http://www.unicode.org/reports/tr35/#Likely_Subtags)) | 

- `language`, `script`, `territory` (also aliased as `region`), and `maxLanguageId` are computed by [adding likely subtags](./src/likely-subtags.js) according to the [specification](http://www.unicode.org/reports/tr35/#Likely_Subtags).
- `languageId` is always in the succint form, obtained by [removing the likely subtags from `maxLanguageId`](./src/remove-likely-subtags.js) according to the [specification](http://www.unicode.org/reports/tr35/#Likely_Subtags).

