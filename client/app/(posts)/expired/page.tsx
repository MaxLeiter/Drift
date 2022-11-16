"use client"

import { Note, Text } from "@geist-ui/core/dist"

export default function ExpiredPage() {
	return (
		<Note type="error" label={false}>
			<h2>Error: The Drift you&apos;re trying to view has expired.</h2>
		</Note>
	)
}
