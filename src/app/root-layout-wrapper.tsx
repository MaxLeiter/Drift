"use client"

import Header from "@components/header"
import Page from "@components/page"
import { Toasts } from "@components/toasts"
import * as RadixTooltip from "@radix-ui/react-tooltip"
import { ThemeProvider } from "@wits/next-themes"
import { SessionProvider } from "next-auth/react"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
	return (
		<SessionProvider>
			<RadixTooltip.Provider delayDuration={200}>
				<Toasts />
				<Page>
					<ThemeProvider
						enableSystem={true}
						defaultTheme="dark"
						disableTransitionOnChange
						attribute="data-theme"
						enableColorScheme={true}
					>
						<Header />
					</ThemeProvider>
					{children}
				</Page>
			</RadixTooltip.Provider>
		</SessionProvider>
	)
}
