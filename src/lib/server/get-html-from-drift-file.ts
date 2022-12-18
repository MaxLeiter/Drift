import markdown from "@wcj/markdown-to-html"
/**
 * returns rendered HTML from a  Drift file
 */
export async function getHtmlFromFile({
	content,
	title
}: {
	content: string
	title: string
}) {
	const renderAsMarkdown = [
		"markdown",
		"md",
		"mdown",
		"mkdn",
		"mkd",
		"mdwn",
		"mdtxt",
		"mdtext",
		"text",
		""
	]
	const fileType = () => {
		const pathParts = title.split(".")
		const language = pathParts.length > 1 ? pathParts[pathParts.length - 1] : ""
		return language
	}
	const type = fileType()
	let contentToRender: string = content || ""
	if (!renderAsMarkdown.includes(type)) {
		contentToRender = `
~~~${type}
${content}
~~~
`
	} else {
		contentToRender = "\n" + content
	}

	const html = markdown(contentToRender, {
		showLineNumbers: false
	})
	return html
}
