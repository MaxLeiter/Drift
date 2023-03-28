import "@styles/globals.css"
import { Providers } from "./providers"
import Layout from "@components/layout"
import { Toasts } from "@components/toasts"
import Header from "@components/header"
import { Inter } from "next/font/google"
import { getMetadata } from "src/app/lib/metadata"
import dynamic from "next/dynamic"
import { cookies } from "next/headers"
const inter = Inter({ subsets: ["latin"], variable: "--inter-font" })
import { THEME_COOKIE, DEFAULT_THEME, SIGNED_IN_COOKIE } from "@lib/constants"
import { Suspense } from "react"

const CmdK = dynamic(() => import("@components/cmdk"), { ssr: false })

export default async function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	const cookiesList = cookies()
	const theme = cookiesList.get(THEME_COOKIE)?.value || DEFAULT_THEME
	const isAuthenticated = Boolean(cookiesList.get(SIGNED_IN_COOKIE)?.value)

	return (
		// suppressHydrationWarning is required because of next-themes
		<html lang="en" className={inter.variable} suppressHydrationWarning>
			<body>
				<Toasts />
				<Providers>
					<Layout>
						<CmdK />
						<Suspense fallback={<>Loading...</>}>
							<Header theme={theme} isAuthenticated={isAuthenticated} />
						</Suspense>
						{children}
					</Layout>
				</Providers>
			</body>
		</html>
	)
}

export const metadata = getMetadata()
