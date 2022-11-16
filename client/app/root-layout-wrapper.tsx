"use client"

import Header from "@components/header"
import Page from "@components/page"
import * as RadixTooltip from "@radix-ui/react-tooltip"

export function LayoutWrapper({
	children,
	signedIn,
	isAdmin
}: {
	children: React.ReactNode
	signedIn?: boolean
	isAdmin?: boolean
}) {
	return (
		<RadixTooltip.Provider delayDuration={200}>
			<Page>
				<Header isAdmin={isAdmin} signedIn={signedIn} />
				{children}
			</Page>
		</RadixTooltip.Provider>
	)
}
