import "@styles/globals.css"
import { Providers } from "./providers"
// import { ServerThemeProvider } from "@wits/next-themes"
import Page from "@components/page"
import { Toasts } from "@components/toasts"
import Header from "@components/header"

interface RootLayoutProps {
	children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
	return (
		// <ServerThemeProvider
		// 	enableSystem={true}
		// 	disableTransitionOnChange
		// 	cookieName={"drift-theme"}
		// 	attribute="data-theme"
		// 	enableColorScheme={true}
		// >
		<html lang="en">
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
