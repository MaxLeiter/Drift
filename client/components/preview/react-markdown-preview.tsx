import remarkGfm from "remark-gfm"
import SyntaxHighlighter from 'react-syntax-highlighter/dist/cjs/prism-async-light';
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

// @ts-ignore because of no types in remark-a11y-emoji
// import a11yEmoji from '@fec/remark-a11y-emoji';

import styles from './preview.module.css'
import dark from 'react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus'
import light from 'react-syntax-highlighter/dist/cjs/styles/prism/vs'
import useSharedState from "@lib/hooks/use-shared-state";
import ReactMarkdown from "react-markdown";


type Props = {
    content: string | undefined
    height: number | string
}

const ReactMarkdownPreview = ({ content, height }: Props) => {
    const [themeType] = useSharedState<string>('theme')

    return (<div style={{ height }}>
        <ReactMarkdown className={styles.markdownPreview}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]]}
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
                                style: { background: 'transparent', color: 'inherit' }
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
