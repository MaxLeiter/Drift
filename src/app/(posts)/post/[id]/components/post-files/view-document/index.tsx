"use client"

import { memo } from "react"
import styles from "./document.module.css"
import Skeleton from "@components/skeleton"
import Link from "next/link"

import Tooltip from "@components/tooltip"
import Button from "@components/button"
import ButtonGroup from "@components/button-group"
import DocumentTabs from "app/(posts)/components/tabs"
import { Download, ExternalLink } from "react-feather"

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
					<div className={styles.fileNameContainer}>
						<Skeleton width={"100%"} height={36} />
					</div>
					<div className={styles.documentContainer}>
						<Skeleton width={145} height={36} borderRadius={"4px 4px 0 0"} />
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

	const { title, initialTab, id, content, preview } = props

	return (
		<>
			<div className={styles.card}>
				<header>
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
					<DownloadButtons rawLink={`/file/raw/${id}`} />
				</header>
				<div className={styles.documentContainer}>
					{/* Not /api/ because of rewrites defined in next.config.mjs */}
					<DocumentTabs
						defaultTab={initialTab}
						preview={preview}
						content={content}
						isEditing={false}
					/>
				</div>
			</div>
		</>
	)
}

export default memo(Document)
