"use client"

import * as RadixTooltip from "@radix-ui/react-tooltip"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "next-themes"

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<SessionProvider>
			<RadixTooltip.Provider delayDuration={200}>
				<ThemeProvider enableSystem defaultTheme="dark">
					{children}
				</ThemeProvider>
			</RadixTooltip.Provider>
		</SessionProvider>
	)
}
