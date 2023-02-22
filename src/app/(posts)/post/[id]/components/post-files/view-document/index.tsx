"use client"

import Button from "@components/button"
import ButtonGroup from "@components/button-group"
import Skeleton from "@components/skeleton"
import Tooltip from "@components/tooltip"
import DocumentTabs from "src/app/(posts)/components/tabs"
import Link from "next/link"
import { memo } from "react"
import { Download, ExternalLink } from "react-feather"
import styles from "./document.module.css"

type SharedProps = {
	title?: string
	initialTab: "edit" | "preview"
	id?: string
	content?: string
	preview?: string
}

type Props = (
	| {
			skeleton?: true
	  }
	| {
			skeleton?: false
	  }
) &
	SharedProps

const DownloadButtons = ({ rawLink }: { rawLink?: string }) => {
	return (
		<ButtonGroup>
			<Tooltip content="Download">
				<Link
					href={`${rawLink}?download=true`}
					target="_blank"
					rel="noopener noreferrer"
				>
					<Button
						iconRight={<Download color="var(--fg)" />}
						aria-label="Download"
						style={{ border: "none", background: "transparent" }}
					/>
				</Link>
			</Tooltip>
			<Tooltip content="Open raw in new tab">
				<Link href={rawLink || ""} target="_blank" rel="noopener noreferrer">
					<Button
						iconLeft={<ExternalLink color="var(--fg)" />}
						aria-label="Open raw file in new tab"
						style={{ border: "none", background: "transparent" }}
					/>
				</Link>
			</Tooltip>
		</ButtonGroup>
	)
}

const Document = ({ skeleton, ...props }: Props) => {
	if (skeleton) {
		return (
			<>
				<div className={styles.card}>
					<div>
						<Skeleton width={"100%"} height={36} />
					</div>
					<div className={styles.documentContainer}>
						<Skeleton width={175} height={36} borderRadius={"4px 4px 0 0"} />
						<Skeleton
							width={"100%"}
							height={350}
							borderRadius={"0 0 4px 4px"}
						/>
					</div>
				</div>
			</>
		)
	}

	const { title, initialTab, id, content = "", preview } = props

	// if the query has our title, we can use it to scroll to the file.
	// we can't use the browsers implementation because the data isn't loaded yet
	if (title && typeof window !== "undefined") {
		const hash = window.location.hash
		if (hash && hash === `#${title}`) {
			const element = document.getElementById(title)
			if (element) {
				element.scrollIntoView()
			}
		}
	}

	return (
		<>
			<div className={styles.card}>
				<header id={title}>
					<Link
						href={`#${title}`}
						aria-label="File"
						style={{
							textDecoration: "none",
							color: "var(--fg)"
						}}
					>
						{title}
					</Link>
					{/* TODO: switch to api once next.js bug is fixed */}
					{/* Not /api/ because of rewrites defined in next.config.mjs */}
					<DownloadButtons rawLink={`/api/file/raw/${id}`} />
				</header>
				<div className={styles.documentContainer}>
					<DocumentTabs
						defaultTab={initialTab}
						staticPreview={preview}
						isEditing={false}
					>
						{content}
					</DocumentTabs>
				</div>
			</div>
		</>
	)
}

export default memo(Document)
