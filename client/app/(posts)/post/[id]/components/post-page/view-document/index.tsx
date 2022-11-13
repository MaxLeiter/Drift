import { memo, useRef, useState } from "react"
import styles from "./document.module.css"
import Download from "@geist-ui/icons/download"
import ExternalLink from "@geist-ui/icons/externalLink"
import Skeleton from "react-loading-skeleton"
import Link from "next/link"

import {
	Button,
	ButtonGroup,
	Spacer,
	Tabs,
	Textarea,
	Tooltip,
	Tag
} from "@geist-ui/core/dist"
import { StaticPreview } from "app/(posts)/components/preview"
import FadeIn from "@components/fade-in"

// import Link from "next/link"
type Props = {
	title: string
	initialTab?: "edit" | "preview"
	skeleton?: boolean
	id: string
	content: string
	preview: string
}

const DownloadButton = ({ rawLink }: { rawLink?: string }) => {
	return (
		<div className={styles.actionWrapper}>
			<ButtonGroup className={styles.actions}>
				<Tooltip hideArrow text="Download">
					<Link
						href={`${rawLink}?download=true`}
						target="_blank"
						rel="noopener noreferrer"
					>
						<Button
							scale={2 / 3}
							px={0.6}
							icon={<Download />}
							auto
							aria-label="Download"
						/>
					</Link>
				</Tooltip>
				<Tooltip hideArrow text="Open raw in new tab">
					<Link href={rawLink || ""} target="_blank" rel="noopener noreferrer">
						<Button
							scale={2 / 3}
							px={0.6}
							icon={<ExternalLink />}
							auto
							aria-label="Open raw file in new tab"
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
	const codeEditorRef = useRef<HTMLTextAreaElement>(null)
	const [tab, setTab] = useState(initialTab)
	// const height = editable ? "500px" : '100%'
	const height = "100%"

	const handleTabChange = (newTab: string) => {
		if (newTab === "edit") {
			codeEditorRef.current?.focus()
		}
		setTab(newTab as "edit" | "preview")
	}

	const rawLink = () => {
		if (id) {
			return `/file/raw/${id}`
		}
	}

	if (skeleton) {
		return (
			<>
				<Spacer height={1} />
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
		<FadeIn>
			<Spacer height={1} />
			<div className={styles.card}>
				<Link href={`#${title}`} className={styles.fileNameContainer}>
					<Tag
						height={"100%"}
						id={`${title}`}
						width={"100%"}
						style={{ borderRadius: 0 }}
					>
						{title || "Untitled"}
					</Tag>
				</Link>
				<div className={styles.descriptionContainer}>
					<DownloadButton rawLink={rawLink()} />
					<Tabs
						onChange={handleTabChange}
						initialValue={initialTab}
						hideDivider
						leftSpace={0}
					>
						<Tabs.Item label={"Raw"} value="edit">
							{/* <textarea className={styles.lineCounter} wrap='off' readOnly ref={lineNumberRef}>1.</textarea> */}
							<div
								style={{
									marginTop: "var(--gap-half)",
									display: "flex",
									flexDirection: "column"
								}}
							>
								<Textarea
									readOnly
									ref={codeEditorRef}
									value={content}
									width="100%"
									// TODO: Textarea should grow to fill parent if height == 100%
									style={{ flex: 1, minHeight: 350 }}
									resize="vertical"
									className={styles.textarea}
								/>
							</div>
						</Tabs.Item>
						<Tabs.Item label="Preview" value="preview">
							<div style={{ marginTop: "var(--gap-half)" }}>
								<StaticPreview
									height={height}
									// fileId={id}
									content={preview}
									// title={title}
								/>
							</div>
						</Tabs.Item>
					</Tabs>
				</div>
			</div>
		</FadeIn>
	)
}

export default memo(Document)
