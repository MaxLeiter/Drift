"use client"

import * as RadixTabs from "@radix-ui/react-tabs"
import FormattingIcons from "src/app/(posts)/new/components/edit-document-list/edit-document/formatting-icons"
import { ChangeEvent, ClipboardEvent, useRef } from "react"
import TextareaMarkdown, { TextareaMarkdownRef } from "textarea-markdown-editor"
import Preview, { StaticPreview } from "../preview"
import styles from "./tabs.module.css"

type Props = RadixTabs.TabsProps & {
	isEditing: boolean
	defaultTab: "preview" | "edit"
	handleOnContentChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void
	onPaste?: (e: ClipboardEvent<HTMLTextAreaElement>) => void
	title?: string
	staticPreview?: string
	children: string
}

export default function DocumentTabs({
	isEditing,
	defaultTab,
	handleOnContentChange,
	onPaste,
	title,
	staticPreview: preview,
	children,
	...props
}: Props) {
	const codeEditorRef = useRef<TextareaMarkdownRef>(null)

	const handleTabChange = (newTab: string) => {
		if (newTab === "preview") {
			codeEditorRef.current?.focus()
		}
	}

	return (
		<RadixTabs.Root
			{...props}
			onValueChange={handleTabChange}
			className={styles.root}
			defaultValue={defaultTab}
		>
			<RadixTabs.List className={styles.listWrapper}>
				<div className={styles.list}>
					<RadixTabs.Trigger value="edit" className={styles.trigger}>
						{isEditing ? "Edit" : "Raw"}
					</RadixTabs.Trigger>
					<RadixTabs.Trigger value="preview" className={styles.trigger}>
						{isEditing ? "Preview" : "Rendered"}
					</RadixTabs.Trigger>
				</div>
				{isEditing && (
					<FormattingIcons
						className={styles.formattingIcons}
						textareaRef={codeEditorRef}
					/>
				)}
			</RadixTabs.List>
			<RadixTabs.Content value="edit">
				<div
					style={{
						marginTop: 6,
						display: "flex",
						flexDirection: "column"
					}}
				>
					<TextareaMarkdown.Wrapper ref={codeEditorRef}>
						<textarea
							readOnly={!isEditing}
							onPaste={onPaste ? onPaste : undefined}
							ref={codeEditorRef}
							placeholder=""
							value={children}
							onChange={handleOnContentChange}
							// TODO: Textarea should grow to fill parent if height == 100%
							style={{ flex: 1, minHeight: 350 }}
							// className={styles.textarea}
						/>
					</TextareaMarkdown.Wrapper>
				</div>
			</RadixTabs.Content>
			<RadixTabs.Content value="preview">
				{isEditing ? (
					<Preview height={"100%"} title={title}>
						{children}
					</Preview>
				) : (
					<StaticPreview height={"100%"}>{preview || ""}</StaticPreview>
				)}
			</RadixTabs.Content>
		</RadixTabs.Root>
	)
}
