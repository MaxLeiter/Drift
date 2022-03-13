import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';

// @ts-ignore because of no types in remark-a11y-emoji
import a11yEmoji from '@fec/remark-a11y-emoji';
import styles from './preview.module.css'
import { vscDarkPlus as dark, vs as light } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import useSharedState from "@lib/hooks/use-shared-state";

type Props = {
    content: string | undefined
    height: number | string
}

const ReactMarkdownPreview = ({ content, height }: Props) => {
    const [themeType] = useSharedState<string>('theme')
    return (<div style={{ height }}>
        <ReactMarkdown className={styles.markdownPreview} remarkPlugins={[remarkGfm, a11yEmoji]}
            components={{
                code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                        <SyntaxHighlighter
                            lineNumberStyle={{
                                minWidth: "2.25rem"
                            }}
                            customStyle={{
                                padding: 0,
                                margin: 0,
                                background: 'transparent'
                            }}
                            codeTagProps={{
                                style: { background: 'transparent' }
                            }}
                            style={themeType === 'dark' ? dark : light}
                            showLineNumbers={true}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                        >{String(children).replace(/\n$/, '')}</SyntaxHighlighter>
                    ) : (
                        <code className={className} {...props}>
                            {children}
                        </code>
                    )
                }
            }}>
            {content || ""}
        </ReactMarkdown></div>)
}

export default ReactMarkdownPreview
