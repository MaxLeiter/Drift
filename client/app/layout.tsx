import "@styles/globals.css"
import { ServerThemeProvider } from "next-themes"
import { LayoutWrapper } from "./root-layout-wrapper"
import styles from '@styles/Home.module.css';
import { cookies } from "next/headers";

interface RootLayoutProps {
	children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {	
	// TODO: this opts out of SSG
	const cookiesList = cookies();
	const hasNextAuth = cookiesList.get("next-auth.session-token") !== undefined;
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
					<LayoutWrapper signedIn={hasNextAuth}>{children}</LayoutWrapper>
				</body>
			</html>
		</ServerThemeProvider>
	)
}
