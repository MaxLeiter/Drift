import config from "@lib/config"
import React from "react"

type PageSeoProps = {
	title?: string
	description?: string
	isLoading?: boolean
	isPrivate?: boolean
}

const PageSeo = ({
	title = "Drift",
	description = "A self-hostable clone of GitHub Gist",
	isPrivate = false
}: PageSeoProps) => {
	return (
		<>
			<title>Drift{title ? ` - ${title}` : ""}</title>
			<meta charSet="utf-8" />
			{!isPrivate && <meta name="description" content={description} />}
			{isPrivate && <meta name="robots" content="noindex" />}

			{/* TODO: verify the correct meta tags */}
			<meta
				name="viewport"
				content="width=device-width, initial-scale=1, shrink-to-fit=no"
			/>
			<ThemeAndIcons />
			<URLs />
		</>
	)
}

export default PageSeo

const ThemeAndIcons = () => (
	<>
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
		<meta
			name="theme-color"
			content="#ffffff"
			media="(prefers-color-scheme: light)"
		/>
		<meta
			name="theme-color"
			content="#000"
			media="(prefers-color-scheme: dark)"
		/>
	</>
)

const URLs = () => (
	<>
		<meta property="twitter:card" content="summary_large_image" />
		<meta property="twitter:url" content={config.url} />
		{/* TODO: OG image */}
		<meta property="twitter:image" content={`${config.url}/assets/og.png`} />
		<meta property="twitter:site" content="@" />
		<meta property="twitter:creator" content="@drift" />
		<meta property="og:type" content="website" />
		<meta property="og:url" content={config.url} />
	</>
)
