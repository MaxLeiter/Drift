/*
 * Parses a URL query string from string | string[] | ...
 * to string | undefined. If it's an array, we return the last item.
 */
export function parseUrlQuery(query: string | string[] | undefined) {
	if (typeof query === "string") {
		return query
	} else if (Array.isArray(query)) {
		return query[query.length - 1]
	} else {
		return undefined
	}
}
