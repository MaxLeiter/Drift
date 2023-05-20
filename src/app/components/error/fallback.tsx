"use client"

import Button from "@components/button"
import Link from "@components/link"
import Note from "@components/note"
import { useRouter } from "next/navigation"
// an error fallback for react-error-boundary

import {
	ErrorBoundary as ErrorBoundaryComponent,
	FallbackProps,
	ErrorBoundaryPropsWithFallback
} from "react-error-boundary"

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
	return (
		<Note type="error" style={{ width: "100%" }}>
			<h3>Something went wrong:</h3>
			<pre>{error.message}</pre>
			<Link href="https://github.com/MaxLeiter/Drift/issues/new">
				<Button>Report an issue</Button>
			</Link>
			<Button onClick={resetErrorBoundary}>Try again</Button>
		</Note>
	)
}

export default function ErrorBoundary({
	children,
	onReset,
	...props
}: {
	children: React.ReactNode
	onReset?: ErrorBoundaryPropsWithFallback["onReset"]
	props?: ErrorBoundaryPropsWithFallback
}) {
	const router = useRouter()
	if (!onReset) {
		onReset = () => {
			router.refresh()
		}
	}

	return (
		<ErrorBoundaryComponent
			onReset={onReset}
			FallbackComponent={ErrorFallback}
			{...props}
		>
			{children}
		</ErrorBoundaryComponent>
	)
}
