import { memo, useEffect, useState } from "react"
import styles from './preview.module.css'

type Props = {
    height?: number | string
    fileId?: string
    content?: string
    title?: string
    //  file extensions we can highlight 
}

const MarkdownPreview = ({ height = 500, fileId, content, title }: Props) => {
    const [preview, setPreview] = useState<string>(content || "")
    const [isLoading, setIsLoading] = useState<boolean>(true)
    useEffect(() => {
        async function fetchPost() {
            if (fileId) {
                const resp = await fetch(`/server-api/files/html/${fileId}`, {
                    method: "GET",
                })
                if (resp.ok) {
                    const res = await resp.text()
                    setPreview(res)
                    setIsLoading(false)
                }
            } else if (content) {
                const resp = await fetch(`/api/render-markdown`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        title,
                        content,
                    }),
                })
                if (resp.ok) {
                    const res = await resp.text()
                    setPreview(res)
                    setIsLoading(false)
                }
            }
            setIsLoading(false)
        }
        fetchPost()
    }, [content, fileId, title])
    return (<>
        {isLoading ? <div>Loading...</div> : <article className={styles.markdownPreview} dangerouslySetInnerHTML={{ __html: preview }} style={{
            height
        }} />}
    </>)

}

export default memo(MarkdownPreview)
