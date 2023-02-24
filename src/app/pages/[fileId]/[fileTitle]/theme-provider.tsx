"use client"

import { PropsWithChildren } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export default function ThemeProvider({
	children
}: PropsWithChildren<unknown>) {
	return (
		<NextThemesProvider enableSystem defaultTheme="dark">
			{children}
		</NextThemesProvider>
	)
}
