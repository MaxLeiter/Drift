"use client"

import FormattingIcons from "src/app/(drift)/(posts)/new/components/edit-document-list/edit-document/formatting-icons"
import {
	ChangeEvent,
	ClipboardEvent,
	ComponentProps,
	useRef,
	useState
} from "react"
import TextareaMarkdown, { TextareaMarkdownRef } from "textarea-markdown-editor"
import Preview, { StaticPreview } from "../preview"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/tabs"
import { Textarea } from "@components/textarea"

type Props = ComponentProps<typeof Tabs> & {
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
	children: rawContent,
	...props
}: Props) {
	const codeEditorRef = useRef<TextareaMarkdownRef>(null)
	const [activeTab, setActiveTab] = useState<"preview" | "edit">(defaultTab)
	const handleTabChange = (newTab: string) => {
		if (newTab === "preview") {
			codeEditorRef.current?.focus()
		}
		setActiveTab(newTab as "preview" | "edit")
	}

	return (
		<Tabs {...props} onValueChange={handleTabChange} defaultValue={defaultTab}>
			<TabsList className="flex flex-col items-start justify-start sm:flex-row sm:items-center sm:justify-between">
				<div>
					<TabsTrigger value="edit">{isEditing ? "Edit" : "Raw"}</TabsTrigger>
					<TabsTrigger value="preview">
						{isEditing ? "Preview" : "Rendered"}
					</TabsTrigger>
				</div>
				{isEditing && (
					<FormattingIcons
						textareaRef={codeEditorRef}
						className={`ml-auto ${
							activeTab === "preview" ? "hidden" : "hidden sm:block"
						}`}
					/>
				)}
			</TabsList>
			<TabsContent value="edit">
				<div
					style={{
						marginTop: 6,
						display: "flex",
						flexDirection: "column"
					}}
				>
					<FormattingIcons
						textareaRef={codeEditorRef}
						className={`ml-auto ${
							activeTab === "preview"
								? "hidden"
								: "block text-muted-foreground sm:hidden"
						}`}
					/>
					<TextareaMarkdown.Wrapper ref={codeEditorRef}>
						<Textarea
							readOnly={!isEditing}
							onPaste={onPaste ? onPaste : undefined}
							ref={codeEditorRef}
							placeholder=""
							value={rawContent}
							onChange={handleOnContentChange}
							// TODO: Textarea should grow to fill parent if height == 100%
							style={{ flex: 1, minHeight: 350 }}
							// className={styles.textarea}
						/>
					</TextareaMarkdown.Wrapper>
				</div>
			</TabsContent>
			<TabsContent value="preview">
				{isEditing ? (
					<Preview height={"100%"} title={title}>
						{rawContent}
					</Preview>
				) : (
					<StaticPreview height={"100%"}>{preview || ""}</StaticPreview>
				)}
			</TabsContent>
		</Tabs>
	)
}
