import "@styles/globals.css"
import { Providers } from "./providers"
import Page from "@components/page"
import { Toasts } from "@components/toasts"
import Header from "@components/header"
import { Inter } from "@next/font/google"

const inter = Inter({ subsets: ["latin"], variable: "--inter-font" })

interface RootLayoutProps {
	children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="en" className={inter.variable}>
			<head />
			<body>
				<Toasts />
				<Page>
					<Providers>
						<Header />
						{children}
					</Providers>
				</Page>
			</body>
		</html>
	)
}
