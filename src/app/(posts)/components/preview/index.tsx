import { memo, useEffect, useState } from "react"
import styles from "./preview.module.css"
import "@styles/markdown.css"
import "@styles/syntax.css"
import { Spinner } from "@components/spinner"

type Props = {
	height?: number | string
	fileId?: string
	content?: string
	title?: string
}

const MarkdownPreview = ({
	height = 500,
	fileId,
	content = "",
	title
}: Props) => {
	const [preview, setPreview] = useState<string>(content)
	const [isLoading, setIsLoading] = useState<boolean>(true)
	useEffect(() => {
		async function fetchPost() {
			// POST to avoid query string length limit
			const method = fileId ? "GET" : "POST"
			const path = fileId ? `/api/file/html/${fileId}` : "/api/file/get-html"
			const body = fileId
				? undefined
				: JSON.stringify({
						title: title || "",
						content: content
				  })

			const resp = await fetch(path, {
				method: method,
				headers: {
					"Content-Type": "application/json"
				},
				body
			})

			if (resp.ok) {
				const res = await resp.text()
				setPreview(res)
			}

			setIsLoading(false)
		}
		fetchPost()
	}, [content, fileId, title])

	return (
		<>
			{isLoading ? (
				<Spinner />
			) : (
				<StaticPreview preview={preview} height={height} />
			)}
		</>
	)
}

export default memo(MarkdownPreview)

export const StaticPreview = ({
	preview,
	height = 500
}: {
	preview: string
	height: string | number
}) => {
	return (
		<article
			className={styles.markdownPreview}
			dangerouslySetInnerHTML={{ __html: preview }}
			style={{
				height
			}}
		/>
	)
}
