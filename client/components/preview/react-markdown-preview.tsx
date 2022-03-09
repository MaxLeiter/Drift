import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

// @ts-ignore because of no types in remark-a11y-emoji
import a11yEmoji from '@fec/remark-a11y-emoji';
import styles from './preview.module.css'

type Props = {
    content: string | undefined
    height: number | string
}

const ReactMarkdownPreview = ({ content, height }: Props) => {
    return (<div style={{ height }}><ReactMarkdown className={styles.markdownPreview} remarkPlugins={[remarkGfm, a11yEmoji]} >
        {content || ""}
    </ReactMarkdown></div>)
}

export default ReactMarkdownPreview
