import type { Document } from "@lib/types"
import DocumentComponent from "@components/edit-document"
import { ChangeEvent, memo, useCallback } from "react"

const DocumentList = ({
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
	onPaste: (e: any) => void
}) => {
	const handleOnChange = useCallback(
		(i) => (e: ChangeEvent<HTMLTextAreaElement>) => {
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
						setContent={updateDocContent(i)}
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

export default memo(DocumentList)
