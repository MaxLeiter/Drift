import "@styles/globals.css"
import { Providers } from "./providers"
import Layout from "@components/layout"
import { Toasts } from "@components/toasts"
import Header from "@components/header"
import { Inter } from "@next/font/google"
import { PropsWithChildren, Suspense } from "react"
import { Spinner } from "@components/spinner"

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
						<Suspense fallback={<Spinner />}>
							<Header />
						</Suspense>
						{children}
					</Providers>
				</Layout>
			</body>
		</html>
	)
}
