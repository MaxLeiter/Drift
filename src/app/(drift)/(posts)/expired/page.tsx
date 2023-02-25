import Note from "@components/note"
import { getMetadata } from "src/app/lib/metadata"

export default function ExpiredPage() {
	return (
		<Note type="error">
			<strong>Error:</strong> The Drift you&apos;re trying to view has expired.
		</Note>
	)
}

export const metadata = getMetadata({
	title: "Post expired",
	hidden: true
})
