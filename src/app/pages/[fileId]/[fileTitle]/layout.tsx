import "@styles/globals.css"
import "@styles/markdown.css"

import Layout from "@components/layout"
import { Inter } from "next/font/google"
import ThemeProvider from "./theme-provider"

const inter = Inter({ subsets: ["latin"], variable: "--inter-font" })

export default async function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		// suppressHydrationWarning is required because of next-themes
		<html lang="en" className={inter.variable} suppressHydrationWarning>
			<body>
				<ThemeProvider>
					<Layout forSites>{children}</Layout>
				</ThemeProvider>
			</body>
		</html>
	)
}
