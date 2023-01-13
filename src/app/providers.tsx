"use client"

import * as RadixTooltip from "@radix-ui/react-tooltip"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "next-themes"
import { PropsWithChildren } from "react"
import { SWRConfig } from "swr"

export type ChildrenProps = {
	children?: React.ReactNode
}

export function Providers({ children }: ChildrenProps) {
	return (
		<SessionProvider>
			<RadixTooltip.Provider delayDuration={200}>
				<ThemeProvider enableSystem defaultTheme="dark">
					<SWRProvider>{children}</SWRProvider>
				</ThemeProvider>
			</RadixTooltip.Provider>
		</SessionProvider>
	)
}

function SWRProvider({ children }: PropsWithChildren<unknown>) {
	return (
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
			{children}
		</SWRConfig>
	)
}
