import "@styles/globals.css"
import { ServerThemeProvider } from "next-themes"
import { LayoutWrapper } from "./root-layout-wrapper"

interface RootLayoutProps {
	children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<ServerThemeProvider
			disableTransitionOnChange
			cookieName="drift-theme"
			attribute="data-theme"
		>
			<html lang="en">
				<head>
					<meta charSet="utf-8" />
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1, shrink-to-fit=no"
					/>
					<link
						rel="apple-touch-icon"
						sizes="180x180"
						href="/assets/apple-touch-icon.png"
					/>
					<link
						rel="icon"
						type="image/png"
						sizes="32x32"
						href="/assets/favicon-32x32.png"
					/>
					<link
						rel="icon"
						type="image/png"
						sizes="16x16"
						href="/assets/favicon-16x16.png"
					/>
					<link rel="manifest" href="/site.webmanifest" />
					<link
						rel="mask-icon"
						href="/assets/safari-pinned-tab.svg"
						color="#5bbad5"
					/>
					<meta name="apple-mobile-web-app-title" content="Drift" />
					<meta name="application-name" content="Drift" />
					<meta name="msapplication-TileColor" content="#da532c" />
					<meta name="theme-color" content="#ffffff" />
					<title>Drift</title>
				</head>
				<body>
					<LayoutWrapper>{children}</LayoutWrapper>
				</body>
			</html>
		</ServerThemeProvider>
	)
}
