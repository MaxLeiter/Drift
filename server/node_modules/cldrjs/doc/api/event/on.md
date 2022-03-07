## .on( event, listener )

Add a listener function to the specified event for this instance.

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

cldr = new Cldr( "en" );
cldr.on( "get", log );
cldr.get( "foo" );
// Got foo bar (logged)
// ➡ bar

cldr.off( "get", log );
```
