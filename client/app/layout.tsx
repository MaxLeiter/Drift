import "@styles/globals.css"
import { ServerThemeProvider } from "next-themes"
import { LayoutWrapper } from "./root-layout-wrapper"
import styles from '@styles/Home.module.css';
import { cookies } from "next/headers";
import { getSession } from "@lib/server/session";

interface RootLayoutProps {
	children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {	
	// TODO: this opts out of SSG
	const session = await getSession()
	return (
		<ServerThemeProvider
			disableTransitionOnChange
			attribute="data-theme"
			enableColorScheme
		>
			<html lang="en">
				<head>
		
				</head>
				<body className={styles.main}>
					<LayoutWrapper signedIn={Boolean(session?.user)} isAdmin={session?.user.role === "admin"}>{children}</LayoutWrapper>
				</body>
			</html>
		</ServerThemeProvider>
	)
}
