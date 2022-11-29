import "@styles/globals.css"
import { LayoutWrapper } from "./root-layout-wrapper"
import styles from "@styles/Home.module.css"
import { getSession } from "@lib/server/session"
import ThemeProvider from "@components/theme/ThemeProvider"
import { THEME_COOKIE_NAME } from "@components/theme/theme"

interface RootLayoutProps {
	children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
	// TODO: this opts out of SSG
	const session = await getSession()
	return (
		<html lang="en">
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: `
							(function() {
								var theme = document.cookie
									.split('; ')
									.find(row => row.startsWith('${THEME_COOKIE_NAME}='))
									.split('=')[1];
								document.documentElement.setAttribute('data-theme', theme);
							})();
						`
					}}
				/>
			</head>
			<ThemeProvider>
				<body className={styles.main}>
					<LayoutWrapper
						signedIn={Boolean(session?.user)}
						isAdmin={session?.user.role === "admin"}
					>
						{children}
					</LayoutWrapper>
				</body>
			</ThemeProvider>
		</html>
	)
}
