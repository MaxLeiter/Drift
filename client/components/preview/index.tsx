import { memo, useEffect, useState } from "react"
import ReactMarkdownPreview from "./react-markdown-preview"

type Props = {
    content?: string
    height?: number | string
    //  file extensions we can highlight 
    type?: string
}

const MarkdownPreview = ({ content = '', height = 500, type = 'markdown' }: Props) => {
    const [contentToRender, setContent] = useState(content)
    useEffect(() => {
        // 'm' so it doesn't flash code when you change the type to md
        const renderAsMarkdown = ['m', 'markdown', 'md', 'mdown', 'mkdn', 'mkd', 'mdwn', 'mdtxt', 'mdtext', 'text', '']
        if (!renderAsMarkdown.includes(type)) {
            setContent(`~~~${type}
${content}
~~~
`)
        } else {
            setContent(content)
        }
    }, [type, content])
    return (<ReactMarkdownPreview height={height} content={contentToRender} />)
}

export default memo(MarkdownPreview)
