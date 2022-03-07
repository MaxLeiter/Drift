## .supplemental( path )

It's an alias for `.get([ "supplemental", ... ])`.

| Parameter | Type | Example |
| --- | --- | --- |
| *path* | String or<br>Array | See `cldr.get()` for more information |

```javascript
en.supplemental( "gender/personList/{language}" );
// ➡ "neutral"
```
