import { memo } from "react"
import styles from "./document.module.css"
import Skeleton from "@components/skeleton"
import Link from "next/link"

import Tooltip from "@components/tooltip"
import Button from "@components/button"
import ButtonGroup from "@components/button-group"
import DocumentTabs from "app/(posts)/components/tabs"
import Input from "@components/input"
import { Download, ExternalLink } from "react-feather"

// import Link from "next/link"
type Props = {
	title: string
	initialTab?: "edit" | "preview"
	skeleton?: boolean
	id: string
	content: string
	preview: string
}

const DownloadButtons = ({ rawLink }: { rawLink?: string }) => {
	return (
		<div className={styles.actionWrapper}>
			<ButtonGroup className={styles.actions}>
				<Tooltip content="Download">
					<Link
						href={`${rawLink}?download=true`}
						target="_blank"
						rel="noopener noreferrer"
					>
						<Button
							iconRight={<Download />}
							aria-label="Download"
							style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
						/>
					</Link>
				</Tooltip>
				<Tooltip content="Open raw in new tab">
					<Link href={rawLink || ""} target="_blank" rel="noopener noreferrer">
						<Button
							iconLeft={<ExternalLink />}
							aria-label="Open raw file in new tab"
							style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
						/>
					</Link>
				</Tooltip>
			</ButtonGroup>
		</div>
	)
}

const Document = ({
	content,
	preview,
	title,
	initialTab = "edit",
	skeleton,
	id
}: Props) => {
	if (skeleton) {
		return (
			<>
				<div className={styles.card}>
					<div className={styles.fileNameContainer}>
						<Skeleton width={275} height={36} />
					</div>
					<div className={styles.descriptionContainer}>
						<div style={{ flexDirection: "row", display: "flex" }}>
							<Skeleton width={125} height={36} />
						</div>
						<Skeleton width={"100%"} height={350} />
					</div>
				</div>
			</>
		)
	}

	return (
		<>
			<div className={styles.card}>
				<Link href={`#${title}`} className={styles.fileNameContainer}>
					<Input
						id={`${title}`}
						width={"100%"}
						height={"2rem"}
						style={{ borderRadius: 0 }}
						value={title || "Untitled"}
						disabled
						aria-label="Document title"
					/>
				</Link>
				<div className={styles.descriptionContainer}>
					<DownloadButtons rawLink={`/api/file/raw/${id}`} />
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
