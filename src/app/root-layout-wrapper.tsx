"use client"

import Header from "@components/header"
import Page from "@components/page"
import { Toasts } from "@components/toasts"
import * as RadixTooltip from "@radix-ui/react-tooltip"
import { SessionProvider } from "next-auth/react"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
	return (
		<SessionProvider>
			<RadixTooltip.Provider delayDuration={200}>
				<Toasts />
				<Page>
					<Header />
					{children}
				</Page>
			</RadixTooltip.Provider>
		</SessionProvider>
	)
}
