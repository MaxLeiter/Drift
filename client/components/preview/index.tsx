import { memo } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import styles from './preview.module.css'

const MarkdownPreview = ({ content, height }: { content?: string, height?: number | string }) => {
    {/* remarkGfm is github flavored markdown support */ }
    return (<div style={{ height }}><ReactMarkdown className={styles.markdownPreview} remarkPlugins={[remarkGfm]} >
        {content || ""}
    </ReactMarkdown></div>)
}

export default memo(MarkdownPreview)
