## .once( event, listener )

Add a listener function to the specified event for this instance. It will be automatically removed after it's first execution.

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
cldr.once( "get", log );
cldr.get( "foo" );
// Got foo bar (logged)
// ➡ bar

cldr.get( "foo" );
// ➡ bar
```
