import config from "@lib/config"
import { Metadata } from "next"
import React from "react"

type PageSeoProps = {
	title?: string
	description?: string
	isLoading?: boolean
	isPrivate?: boolean
}

const PageSeo = ({
	title: pageTitle,
	description = "A self-hostable clone of GitHub Gist",
	isPrivate = false
}: PageSeoProps) => {
	const title = `Drift${pageTitle ? ` - ${pageTitle}` : ""}`
	return (
		<>
			<title>{title}</title>
			<meta charSet="utf-8" />
			{!isPrivate && <meta name="description" content={description} />}
			{isPrivate && <meta name="robots" content="noindex" />}

			<ThemeAndIcons />
		</>
	)
}

export default PageSeo

const ThemeAndIcons = () => (
	<>
		<link />
		<meta name="apple-mobile-web-app-title" content="Drift" />
		<meta name="application-name" content="Drift" />
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

export function getMetadata({
	title,
	description = "A self-hostable clone of GitHub Gist",
	hidden = false,
	overrides
}: {
	overrides?: Metadata
	title?: string
	description?: string
	hidden?: boolean
} = {}): Metadata {
	function undefinedIfHidden<T>(value: T): T | undefined {
		return hidden ? undefined : value
	}

	title = `Drift${title ? ` - ${title}` : ""}`

	return {
		title,
		description: undefinedIfHidden(description),
		themeColor: "#000",
		manifest: "/site.webmanifest",
		viewport: "width=device-width, initial-scale=1, shrink-to-fit=no",
		robots: hidden ? "noindex" : undefined,
		twitter: undefinedIfHidden({
			card: "summary_large_image",
			title,
			description,
			...overrides?.twitter
		}),
		applicationName: "Drift",
		icons: [
			{
				rel: "icon",
				sizes: "32x32",
				type: "image/png",
				url: "/assets/favicon-32x32.png"
			},
			{
				rel: "apple-touch-icon",
				sizes: "180x180",
				url: "/assets/apple-touch-icon.png"
			},
			{
				rel: "icon",
				sizes: "16x16",
				url: "/assets/favicon-16x16.png"
			},
			{
				rel: "mask-icon",
				url: "/assets/safari-pinned-tab.svg"
				// TODO: re-enable this when we have a better color
				// color: "#5bbad5"
			}
		],
		openGraph: undefinedIfHidden({
			type: "website",
			url: config.url,
			siteName: "Drift",
			title,
			description,
			...overrides?.openGraph
		}),
		keywords: undefinedIfHidden([
			"gist",
			"github",
			"drift",
			"next.js",
			"self-hosted",
			"paste",
			"pastebin",
			"clone",
			"code",
			"snippet"
		]),
		...overrides
	}
}
