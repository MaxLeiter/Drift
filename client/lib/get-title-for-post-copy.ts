const replaceLastInString = (
	string: string,
	search: string,
	replace: string
): string => {
	const index = string.lastIndexOf(search)
	if (index === -1) {
		return string
	}
	return (
		string.substring(0, index) +
		replace +
		string.substring(index + search.length)
	)
}

const getTitleForPostCopy = (title: string) => {
	const numberAtEndOfTitle = title.split(" ").pop()
	if (numberAtEndOfTitle) {
		const number = parseInt(numberAtEndOfTitle)
		if (number) {
			return replaceLastInString(
				title,
				numberAtEndOfTitle,
				(number + 1).toString()
			)
		} else {
			return title + " 1"
		}
	} else {
		return title + " 1"
	}
}

export default getTitleForPostCopy
