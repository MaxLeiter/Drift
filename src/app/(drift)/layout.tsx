import "@styles/globals.css"
import { Providers } from "./providers"
import Layout from "@components/layout"
import { Toasts } from "@components/toasts"
import Header from "@components/header"
import { Inter } from "next/font/google"
import { getMetadata } from "src/app/lib/metadata"
import dynamic from "next/dynamic"
import clsx from "clsx"
const inter = Inter({ subsets: ["latin"], variable: "--inter-font" })

const CmdK = dynamic(() => import("@components/cmdk"), { ssr: false })

export default async function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		// suppressHydrationWarning is required because of next-themes
		<html
			lang="en"
			className={clsx(inter.variable, "mx-auto w-[var(--main-content)]")}
			suppressHydrationWarning
		>
			<body>
				<Toasts />
				<Providers>
					<Layout>
						<CmdK />
						<Header />
						<main>{children}</main>
					</Layout>
				</Providers>
			</body>
		</html>
	)
}

export const metadata = getMetadata()
