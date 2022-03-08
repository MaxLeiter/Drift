import { memo } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import a11yEmoji from '@fec/remark-a11y-emoji';
import styles from './preview.module.css'

const MarkdownPreview = ({ content, height }: { content?: string, height?: number | string }) => {
    {/* remarkGfm is github flavored markdown support */ }
    return (<div style={{ height }}><ReactMarkdown className={styles.markdownPreview} remarkPlugins={[remarkGfm, a11yEmoji]} >
        {content || ""}
    </ReactMarkdown></div>)
}

export default memo(MarkdownPreview)
