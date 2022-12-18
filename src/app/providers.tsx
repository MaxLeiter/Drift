"use client"

import * as RadixTooltip from "@radix-ui/react-tooltip"
import { SessionProvider } from "next-auth/react"

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<SessionProvider>
			<RadixTooltip.Provider delayDuration={200}>
				{children}
			</RadixTooltip.Provider>
		</SessionProvider>
	)
}
