## Cldr.once( event, listener )

Add a listener function to the specified event globally (for all instances). It will be automatically removed after it's first execution.

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

Cldr.once( "get", log );

cldr = new Cldr( "en" );
cldr.get( "foo" );
// Got foo bar (logged)
// ➡ bar

cldr.get( "foo" );
// ➡ bar
```
