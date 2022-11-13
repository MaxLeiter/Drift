import { memo, useEffect, useState } from "react"
import styles from "./preview.module.css"
import "@styles/markdown.css"
import "./marked.css"

type Props = {
	height?: number | string
	fileId?: string
	content?: string
	title?: string
}

const MarkdownPreview = ({
	height = 500,
	fileId,
	content: initial = "",
	title
}: Props) => {
	const [content, setPreview] = useState<string>(initial)
	const [isLoading, setIsLoading] = useState<boolean>(true)
	useEffect(() => {
		async function fetchPost() {
			if (fileId) {
				const resp = await fetch(`/api/file/html/${fileId}`, {
					method: "GET"
				})
				if (resp.ok) {
					const res = await resp.text()
					setPreview(res)
					setIsLoading(false)
				}
			} else if (content) {
				const urlQuery = new URLSearchParams({
					title: title || "",
					content
				})

				const resp = await fetch(`/api/file/get-html?${urlQuery}`, {
					method: "GET"
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
	return (
		<>
			{isLoading ? (
				<div>Loading...</div>
			) : (
				<StaticPreview content={content} height={height} />
			)}
		</>
	)
}

export default MarkdownPreview

export const StaticPreview = ({
	content,
	height = 500
}: {
	content: string
	height: string | number
}) => {
	return (
		<article
			className={styles.markdownPreview}
			dangerouslySetInnerHTML={{ __html: content }}
			style={{
				height
			}}
		/>
	)
}
