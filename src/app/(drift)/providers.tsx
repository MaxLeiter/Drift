"use client"

import * as RadixTooltip from "@radix-ui/react-tooltip"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "next-themes"
import { PropsWithChildren } from "react"
import { SWRConfig } from "swr"

export function Providers({ children }: PropsWithChildren<unknown>) {
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

export type ApiResponse<T> = {
	data: T
	error: never
} | {
	data: never
	error: string
}

async function fetcher<T>(url: string): Promise<unknown> {
	const response = await fetch(url)
	const data: ApiResponse<T> = await response.json() as ApiResponse<T>

	if (data.error) {
		throw new Error(data.error)
	}

	return data.data
}

function SWRProvider({ children }: PropsWithChildren<unknown>) {
	return (
		<SWRConfig
			value={{
				fetcher,
				keepPreviousData: true
			}}
		>
			{children}
		</SWRConfig>
	)
}
