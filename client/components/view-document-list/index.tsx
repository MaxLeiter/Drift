import type { Document } from "@lib/types"
import DocumentComponent from "@components/edit-document"
import { memo, } from "react"

const DocumentList = ({ docs }: {
    docs: Document[],
}) => {
    return (<>{
        docs.map(({ content, id, title }) => {
            return (
                <DocumentComponent
                    key={id}
                    content={content}
                    title={title}
                />
            )
        })
    }
    </>)
}

export default memo(DocumentList)
