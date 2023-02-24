import { memo, useEffect, useState } from "react"
import styles from "./preview.module.css"
import "@styles/markdown.css"
import "@styles/syntax.css"
import { Spinner } from "@components/spinner"
import { fetchWithUser } from "src/app/lib/fetch-with-user"

type Props = {
	height?: number | string
	fileId?: string
	title?: string
	children?: string
}

function MarkdownPreview({ height = 500, fileId, title, children }: Props) {
	const [preview, setPreview] = useState<string>(children || "")
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
						content: children
				  })

			const resp = await fetchWithUser(path, {
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
	}, [children, fileId, title])

	return (
		<>
			{isLoading ? (
				<Spinner />
			) : (
				<StaticPreview height={height}>{preview}</StaticPreview>
			)}
		</>
	)
}

export default memo(MarkdownPreview)

export function StaticPreview({
	children,
	height = 500
}: {
	children: string
	height: string | number
}) {
	return (
		<article
			className={styles.markdownPreview}
			dangerouslySetInnerHTML={{ __html: children }}
			style={{
				height
			}}
		/>
	)
}
