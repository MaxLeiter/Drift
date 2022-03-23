import useTheme from "@lib/hooks/use-theme"
import { memo, useEffect, useState } from "react"

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
    const { theme } = useTheme()
    useEffect(() => {
        async function fetchPost() {
            if (fileId) {
                const resp = await fetch(`/api/markdown/${fileId}`, {
                    method: "GET",
                })
                if (resp.ok) {
                    const res = await resp.text()
                    setPreview(res)
                    setIsLoading(false)
                }
            } else {
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
        }
        fetchPost()
    }, [content, fileId, title])
    return (<>
        {isLoading ? <div>Loading...</div> : <div data-theme={theme} dangerouslySetInnerHTML={{ __html: preview }} style={{
            height
        }} />}
    </>)

}

export default memo(MarkdownPreview)
