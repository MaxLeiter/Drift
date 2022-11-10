"use client"

import { Note, Text } from "@geist-ui/core/dist"

export default function ExpiredPage() {
	return (
		<Note type="error" label={false}>
			<Text h4>Error: The Drift you&apos;re trying to view has expired.</Text>
		</Note>
	)
}
