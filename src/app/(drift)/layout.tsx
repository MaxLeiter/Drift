import "@styles/globals.css"
import { Providers } from "./providers"
import Layout from "@components/layout"
import { Toasts } from "@components/toasts"
import Header from "@components/header"
import { Inter } from "next/font/google"
import { getMetadata } from "src/app/lib/metadata"
import dynamic from "next/dynamic"

const inter = Inter({ subsets: ["latin"], variable: "--inter-font" })

const CmdK = dynamic(() => import("@components/cmdk"), { ssr: false })

export default async function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		// suppressHydrationWarning is required because of next-themes
		<html lang="en" className={inter.variable} suppressHydrationWarning>
			<body>
				<Toasts />
				<Providers>
					<Layout>
						<CmdK />
						<Header />
						{children}
					</Layout>
				</Providers>
			</body>
		</html>
	)
}

export const metadata = getMetadata()
