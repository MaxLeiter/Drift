## Cldr.on( event, listener )

Add a listener function to the specified event globally (for all instances).

| Parameter | Type | Example |
| --- | --- | --- |
| *event* | String | `"get"` |
| *listener* | Function | |

```javascript
Cldr.load({
  foo: "bar" 
});

function log( path, value ) {
  console.log( "Got", path, value );
}

Cldr.on( "get", log );

en = new Cldr( "en" );
en.get( "foo" );
// Got foo bar (logged)
// ➡ bar

zh = new Cldr( "zh" );
zh.get( "foo" );
// Got foo bar (logged)
// ➡ bar

Cldr.off( "get", log );
```
