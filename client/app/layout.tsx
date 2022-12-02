import "@styles/globals.css"
import { LayoutWrapper } from "./root-layout-wrapper"
import { getSession } from "@lib/server/session"
import { ServerThemeProvider } from "@wits/next-themes"

interface RootLayoutProps {
	children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
	return (
		<ServerThemeProvider
			enableSystem={true}
			disableTransitionOnChange
			cookieName={"drift-theme"}
			attribute="data-theme"
			enableColorScheme={true}
		>
			<html lang="en">
				<head />
				<body>
					<LayoutWrapper>
						{children}
					</LayoutWrapper>
				</body>
			</html>
		</ServerThemeProvider>
	)
}
