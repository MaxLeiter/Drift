import "@styles/globals.css"
import { Providers } from "./providers"
import Layout from "@components/layout"
import { Toasts } from "@components/toasts"
import Header from "@components/header"
import { Inter } from "@next/font/google"
import { PropsWithChildren } from "react"

const inter = Inter({ subsets: ["latin"], variable: "--inter-font" })

export default async function RootLayout({
	children
}: PropsWithChildren<unknown>) {
	return (
		// suppressHydrationWarning is required because of next-themes
		<html lang="en" className={inter.variable} suppressHydrationWarning>
			<head />
			<body>
				<Toasts />
				<Layout>
					<Providers>
						<Header />
						{children}
					</Providers>
				</Layout>
			</body>
		</html>
	)
}