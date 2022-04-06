import getHtmlFromFile from "@lib/get-html-from-drift-file"

describe("get-html-from-drift-file", () => {
	it("should not wrap markdown in code blocks", () => {
		const markdown = `## My Markdown`
		const html = getHtmlFromFile({ content: markdown, title: "my-markdown.md" })
		// the string is <h2><a href=\"#my-markdown\" id=\"my-markdown\" style=\"color:inherit\">My Markdown</a></h2>,
		// but we dont wan't to be too strict in case markup changes
		expect(html).toMatch(/<h2><a.*<\/a><\/h2>/)
	})

	it("should wrap code in code blocks", () => {
		const code = `const foo = "bar"`
		const html = getHtmlFromFile({ content: code, title: "my-code.js" })
		expect(html).toMatch(/<pre><code class="prism-code language-js">/)
	})
})
