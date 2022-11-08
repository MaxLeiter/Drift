import "@styles/globals.css"
import type { AppProps as NextAppProps } from "next/app"

import "react-loading-skeleton/dist/skeleton.css"
import Head from "next/head"
import { ThemeProvider } from "next-themes"
import App from "@components/app"
import React from "react"

type AppProps<P = any> = {
	pageProps: P
} & Omit<NextAppProps<P>, "pageProps">

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<div>
			<Head>
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
			</Head>
			<ThemeProvider defaultTheme="system" disableTransitionOnChange>
				<App Component={Component} pageProps={pageProps} />
			</ThemeProvider>
		</div>
	)
}

export default MyApp
