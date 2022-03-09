import { memo } from "react"
import ReactMarkdownPreview from "./react-markdown-preview"

const MarkdownPreview = ({ content = '', height = 500 }: { content?: string, height?: number | string }) => {
    return (<ReactMarkdownPreview height={height} content={content} />)
}

export default memo(MarkdownPreview)
