'use client';
import Page from "@geist-ui/core/dist/page"
import Header from "./header"

export default function PageWrapper({
	children,
	signedIn
}: {
	children: React.ReactNode
	signedIn?: boolean
}) {
	return (
		<>
			<Page.Header>
				<Header signedIn={signedIn} />
			</Page.Header>
			{children}
		</>
	)
}

export function LoadingPageWrapper() {
	return (
		<>
			<Page.Header>
				<Header signedIn={false} />
			</Page.Header>
		</>
	)
}
