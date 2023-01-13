"use client"

import * as RadixTooltip from "@radix-ui/react-tooltip"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "next-themes"
import { SWRConfig } from "swr"

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<SessionProvider>
			<SWRConfig
				value={{
					fetcher: async (url: string) => {
						const data = await fetch(url).then((res) => res.json())
						if (data.error) {
							throw new Error(data.error)
						}
						return data
					},
					keepPreviousData: true
				}}
			>
				<RadixTooltip.Provider delayDuration={200}>
					<ThemeProvider enableSystem defaultTheme="dark">
						{children}
					</ThemeProvider>
				</RadixTooltip.Provider>
			</SWRConfig>
		</SessionProvider>
	)
}
