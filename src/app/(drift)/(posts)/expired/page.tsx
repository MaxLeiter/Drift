"use client"

import Note from "@components/note"

export default function ExpiredPage() {
	return (
		<Note type="error">
			<strong>Error:</strong> The Drift you&apos;re trying to view has expired.
		</Note>
	)
}
