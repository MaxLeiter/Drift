import type { Document } from "../new"
import DocumentComponent from "./edit-document"
import { ChangeEvent, useCallback, ClipboardEvent } from "react"

function DocumentList({
	docs,
	removeDoc,
	updateDocContent,
	updateDocTitle,
	onPaste
}: {
	docs: Document[]
	updateDocTitle: (i: number) => (title: string) => void
	updateDocContent: (i: number) => (content: string) => void
	removeDoc: (i: number) => () => void
	onPaste?: (e: ClipboardEvent<HTMLTextAreaElement>) => void
}) {
	const handleOnChange = useCallback(
		(i: number) => (e: ChangeEvent<HTMLTextAreaElement>) => {
			updateDocContent(i)(e.target.value)
		},
		[updateDocContent]
	)

	return (
		<>
			{docs.map(({ content, id, title }, i) => {
				return (
					<DocumentComponent
						onPaste={onPaste}
						key={id}
						remove={removeDoc(i)}
						setTitle={updateDocTitle(i)}
						handleOnContentChange={handleOnChange(i)}
						content={content}
						title={title}
					/>
				)
			})}
		</>
	)
}

export default DocumentList
