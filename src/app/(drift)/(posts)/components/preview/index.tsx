import { memo, useEffect, useState } from "react"
import styles from "./preview.module.css"
import "@styles/markdown.css"
import "@styles/syntax.css"
import { fetchWithUser } from "src/app/lib/fetch-with-user"
import { Spinner } from "@components/spinner"
import React from "react"
import clsx from "clsx"

type Props = {
	height?: number | string
	fileId?: string
	title?: string
	children?: string
}

function MarkdownPreview({
	height = 500,
	fileId,
	title,
	children: rawContent
}: Props) {
	const [preview, setPreview] = useState<string>(rawContent || "")
	const [isLoading, setIsLoading] = useState<boolean>(true)
	useEffect(() => {
		async function fetchHTML() {
			// POST to avoid query string length limit
			const method = fileId ? "GET" : "POST"
			const path = fileId ? `/api/file/html/${fileId}` : "/api/file/get-html"
			const body = fileId
				? undefined
				: JSON.stringify({
						title: title || "",
						content: rawContent
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
		fetchHTML()
	}, [rawContent, fileId, title])

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

export function StaticPreviewSkeleton({
	children,
	height = 500
}: {
	children: string
	height: string | number
}) {
	return (
		<div
			className={clsx(styles.markdownPreview)}
			style={{
				height
			}}
		>
			{children}
		</div>
	)
}
