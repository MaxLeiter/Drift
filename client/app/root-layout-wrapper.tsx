"use client"

import Header from "@components/header"
import Page from "@components/page"
import { Toasts } from "@components/toasts"
import * as RadixTooltip from "@radix-ui/react-tooltip"
import { Toaster } from "react-hot-toast"

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
			<Toasts />
			<Page>
				<Header isAdmin={isAdmin} signedIn={signedIn} />
				{children}
			</Page>
		</RadixTooltip.Provider>
	)
}
