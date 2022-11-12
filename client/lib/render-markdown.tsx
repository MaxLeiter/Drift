import { marked } from "marked"
import Highlight, { defaultProps, Language } from "prism-react-renderer"
import Image from "next/image"

// // image sizes. DDoS Safe?
// const imageSizeLink = /^!?\[((?:\[[^\[\]]*\]|\\[\[\]]?|`[^`]*`|[^\[\]\\])*?)\]\(\s*(<(?:\\[<>]?|[^\s<>\\])*>|(?:\\[()]?|\([^\s\x00-\x1f()\\]*\)|[^\s\x00-\x1f()\\])*?(?:\s+=(?:[\w%]+)?x(?:[\w%]+)?)?)(?:\s+("(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)))?\s*\)/;
// //@ts-ignore
// Lexer.rules.inline.normal.link = imageSizeLink;
// //@ts-ignore
// Lexer.rules.inline.gfm.link = imageSizeLink;
// //@ts-ignore
// Lexer.rules.inline.breaks.link = imageSizeLink;

//@ts-ignore
delete defaultProps.theme
// import linkStyles from '../components/link/link.module.css'

const renderer = new marked.Renderer()

// @ts-ignore
// renderer.heading = (text, level, raw, slugger) => {
// 	const id = slugger.slug(text)
// 	const Component = `h${level}`

// 	return (
// 		<Component>
// 			<Link href={`#${id}`} id={id}>
// 				{text}
// 			</Link>
// 		</Component>
// 	)
// }

renderer.link = (href, _, text) => {
    const isHrefLocal = href?.startsWith('/') || href?.startsWith('#')
    if (isHrefLocal) {
        return <a href={href || ''}>
                {text}
            </a>
    }

    // dirty hack
    // if text contains elements, render as html
    return <a href={href || ""} target="_blank" rel="noopener noreferrer" dangerouslySetInnerHTML={{ __html: convertHtmlEntities(text) }} ></a>
}

// @ts-ignore
renderer.image = function (href, _, text) {
	return <Image loading="lazy" src="${href}" alt="${text}" layout="fill" />
}

renderer.checkbox = () => ""
// @ts-ignore
renderer.listitem = (text, task, checked) => {
	if (task) {
		return (
			<li className="reset">
				<span className="check">
					&#8203;
					<input type="checkbox" disabled checked={checked} />
				</span>
				<span>${text}</span>
			</li>
		)
	}

	return <li>{text}</li>
}

// //@ts-ignore
// renderer.code = (code: string, language: string) => {
// 	return (<pre>
// 			{/* {title && <code>{title} </code>} */}
// 			{/* {language && title && <code style={{}}> {language} </code>} */}
// 			<Code
// 				language={language}
// 				// title={title}
// 				code={code}
// 				// highlight={highlight}
// 			/>
// 		</pre>
// 	)
// }

marked.setOptions({
	gfm: true,
	breaks: true,
	headerIds: true,
	renderer
})

const markdown = (markdown: string) => marked(markdown)

export default markdown

const Code = ({
	code,
	language,
	highlight,
	title,
	...props
}: {
	code: string
	language: string
	highlight?: string
	title?: string
}) => {
	if (!language)
		return (
			<>
				<code {...props} dangerouslySetInnerHTML={{ __html: code }} />
			</>
		)

	const highlightedLines = highlight
		? //@ts-ignore
		  highlight.split(",").reduce((lines, h) => {
				if (h.includes("-")) {
					// Expand ranges like 3-5 into [3,4,5]
					const [start, end] = h.split("-").map(Number)
					const x = Array(end - start + 1)
						.fill(undefined)
						.map((_, i) => i + start)
					return [...lines, ...x]
				}

				return [...lines, Number(h)]
		  }, [])
		: ""

	// https://mdxjs.com/guides/syntax-harkedighlighting#all-together
	return (
		<>
			<Highlight
				{...defaultProps}
				code={code.trim()}
				language={language as Language}
			>
				{({
					className,
					style,
					tokens,
					getLineProps,
					getTokenProps
				}: {
					className: string
					style: any
					tokens: any
					getLineProps: any
					getTokenProps: any
				}) => (
					<code className={className} style={{ ...style }}>
						{tokens.map((line: string[], i: number) => (
							<div
								key={i}
								{...getLineProps({ line, key: i })}
								style={
									//@ts-ignore
									highlightedLines.includes((i + 1).toString())
										? {
												background: "var(--highlight)",
												margin: "0 -1rem",
												padding: "0 1rem"
										  }
										: undefined
								}
							>
								{line.map((token: string, key: number) => (
									<span key={key} {...getTokenProps({ token, key })} />
								))}
							</div>
						))}
					</code>
				)}
			</Highlight>
			<>
				<code {...props} dangerouslySetInnerHTML={{ __html: code }} />
			</>
		</>
	)
}
