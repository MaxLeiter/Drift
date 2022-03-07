## Cldr.load( json, ... )

Load resolved or unresolved [1] JSON data.

| Parameter | Type | Description |
| --- | --- | --- |
| *json* | Object | Resolved or unresolved [1] CLDR JSON data |

```javascript
Cldr.load({
	"main": {
		"pt-BR": {
			"numbers": {
				"symbols-numberSystem-latn": {
					"decimal": ","
				}
			}
		}
	}
});
```

1: Unresolved processing is **only available** after loading `cldr/unresolved.js` extension module.
