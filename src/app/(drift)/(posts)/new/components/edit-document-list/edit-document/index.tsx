import { ChangeEvent, ClipboardEvent, useCallback } from "react"
import styles from "./document.module.css"
import { Button } from "@components/button"
import { Input } from "@components/input"
import DocumentTabs from "src/app/(drift)/(posts)/components/document-tabs"
import { Trash } from "react-feather"
import { Card, CardContent, CardHeader } from "@components/card"

type Props = {
	title?: string
	content?: string
	setTitle?: (title: string) => void
	handleOnContentChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void
	defaultTab?: "edit" | "preview"
	remove?: () => void
	onPaste?: (e: ClipboardEvent<HTMLTextAreaElement>) => void
}

function Document({
	onPaste,
	remove,
	title,
	content = "",
	setTitle,
	defaultTab = "edit",
	handleOnContentChange
}: Props) {
	const onTitleChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) =>
			setTitle ? setTitle(event.target.value) : null,
		[setTitle]
	)

	const removeFile = useCallback(
		(remove?: () => void) => {
			if (remove) {
				if (content && content.trim().length > 0) {
					const confirmed = window.confirm(
						"Are you sure you want to remove this file?"
					)
					if (confirmed) {
						remove()
					}
				} else {
					remove()
				}
			}
		},
		[content]
	)

	return (
		<Card className="min-h-[512px]">
			<CardHeader>
				<div className={styles.fileNameContainer}>
					<Input
						placeholder="MyFile.md"
						value={title}
						onChange={onTitleChange}
						label="Filename"
						width={"100%"}
						id={title}
						style={{
							borderTopRightRadius: remove ? 0 : "var(--radius)",
							borderBottomRightRadius: remove ? 0 : "var(--radius)"
						}}
					/>
					{remove && (
						// no left border
						<Button onClick={() => removeFile(remove)} variant="outline" className="border-color-[var(--border)] border-l-0 rounded-l-none">
							<Trash height={18} />
						</Button>
					)}
				</div>
			</CardHeader>
			<CardContent>
				<DocumentTabs
					isEditing={true}
					defaultTab={defaultTab}
					handleOnContentChange={handleOnContentChange}
					// TODO: solve types
					// @ts-expect-error Type 'HTMLDivElement' is missing the following properties from type 'HTMLTextAreaElement': autocomplete, cols, defaultValue, dirName, and 26 more
					onPaste={onPaste}
					title={title}
				>
					{content}
				</DocumentTabs>
			</CardContent>
		</Card>
	)
}

export default Document
