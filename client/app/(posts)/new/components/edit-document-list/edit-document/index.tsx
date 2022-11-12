import {
	ChangeEvent,
	memo,
	useCallback,
	useMemo,
	useRef,
	useState
} from "react"
import styles from "./document.module.css"
import Trash from "@geist-ui/icons/trash"
import FormattingIcons from "./formatting-icons"
import TextareaMarkdown, { TextareaMarkdownRef } from "textarea-markdown-editor"

import { Button, Input, Spacer, Tabs, Textarea } from "@geist-ui/core/dist"
import Preview from "../../../../components/preview"

// import Link from "next/link"
type Props = {
	title?: string
	content?: string
	setTitle?: (title: string) => void
	handleOnContentChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void
	initialTab?: "edit" | "preview"
	remove?: () => void
	onPaste?: (e: any) => void
}

const Document = ({
	onPaste,
	remove,
	title,
	content,
	setTitle,
	initialTab = "edit",
	handleOnContentChange
}: Props) => {
	const codeEditorRef = useRef<TextareaMarkdownRef>(null)
	const [tab, setTab] = useState(initialTab)
	// const height = editable ? "500px" : '100%'
	const height = "100%"

	const handleTabChange = (newTab: string) => {
		if (newTab === "edit") {
			codeEditorRef.current?.focus()
		}
		setTab(newTab as "edit" | "preview")
	}

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

	// if (skeleton) {
	//     return <>
	//         <Spacer height={1} />
	//         <div className={styles.card}>
	//             <div className={styles.fileNameContainer}>
	//                 <Skeleton width={275} height={36} />
	//                 {remove && <Skeleton width={36} height={36} />}
	//             </div>
	//             <div className={styles.descriptionContainer}>
	//                 <div style={{ flexDirection: 'row', display: 'flex' }}><Skeleton width={125} height={36} /></div>
	//                 <Skeleton width={'100%'} height={350} />
	//             </div >
	//         </div>
	//     </>
	// }

	return (
		<>
			<Spacer height={1} />
			<div className={styles.card}>
				<div className={styles.fileNameContainer}>
					<Input
						placeholder="MyFile.md"
						value={title}
						onChange={onTitleChange}
						marginTop="var(--gap-double)"
						size={1.2}
						font={1.2}
						label="Filename"
						width={"100%"}
						id={title}
					/>
					{remove && (
						<Button
							type="abort"
							ghost
							icon={<Trash />}
							auto
							height={"36px"}
							width={"36px"}
							onClick={() => removeFile(remove)}
						/>
					)}
				</div>
				<div className={styles.descriptionContainer}>
					{tab === "edit" && <FormattingIcons textareaRef={codeEditorRef} />}
					<Tabs
						onChange={handleTabChange}
						initialValue={initialTab}
						hideDivider
						leftSpace={0}
					>
						<Tabs.Item label={"Edit"} value="edit">
							{/* <textarea className={styles.lineCounter} wrap='off' readOnly ref={lineNumberRef}>1.</textarea> */}
							<div
								style={{
									marginTop: "var(--gap-half)",
									display: "flex",
									flexDirection: "column"
								}}
							>
								<TextareaMarkdown.Wrapper ref={codeEditorRef}>
									<Textarea
										onPaste={onPaste ? onPaste : undefined}
										ref={codeEditorRef}
										placeholder=""
										value={content}
										onChange={handleOnContentChange}
										width="100%"
										// TODO: Textarea should grow to fill parent if height == 100%
										style={{ flex: 1, minHeight: 350 }}
										resize="vertical"
										className={styles.textarea}
									/>
								</TextareaMarkdown.Wrapper>
							</div>
						</Tabs.Item>
						<Tabs.Item label="Preview" value="preview">
							<div style={{ marginTop: "var(--gap-half)" }}>
								<Preview height={height} title={title} content={content} />
							</div>
						</Tabs.Item>
					</Tabs>
				</div>
			</div>
		</>
	)
}

export default memo(Document)
