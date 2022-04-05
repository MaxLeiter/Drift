import markdown from "./render-markdown"
import { File } from "@lib/models/File"

/**
 * returns rendered HTML from a  Drift file
 */
function getHtmlFromFile({ content, title }: Pick<File, "content" | "title">) {
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
		contentToRender = `~~~${type}
${content}
~~~`
	} else {
		contentToRender = "\n" + content
	}
	const html = markdown(contentToRender)
	return html
}

export default getHtmlFromFile
