"use client"

import { CssBaseline, GeistProvider, Page, Themes } from "@geist-ui/core/dist"
import { ThemeProvider } from "next-themes"
import { SkeletonTheme } from "react-loading-skeleton"

export function LayoutWrapper({
	children,
}: {
	children: React.ReactNode
}) {
	const skeletonBaseColor = "var(--light-gray)"
	const skeletonHighlightColor = "var(--lighter-gray)"

	const customTheme = Themes.createFromLight({
		type: "custom",
		palette: {
			background: "var(--bg)",
			foreground: "var(--fg)",
			accents_1: "var(--lightest-gray)",
			accents_2: "var(--lighter-gray)",
			accents_3: "var(--light-gray)",
			accents_4: "var(--gray)",
			accents_5: "var(--darker-gray)",
			accents_6: "var(--darker-gray)",
			accents_7: "var(--darkest-gray)",
			accents_8: "var(--darkest-gray)",
			border: "var(--light-gray)",
			warning: "var(--warning)"
		},
		expressiveness: {
			dropdownBoxShadow: "0 0 0 1px var(--lighter-gray)",
			shadowSmall: "0 0 0 1px var(--lighter-gray)",
			shadowLarge: "0 0 0 1px var(--lighter-gray)",
			shadowMedium: "0 0 0 1px var(--lighter-gray)"
		},
		layout: {
			gap: "var(--gap)",
			gapHalf: "var(--gap-half)",
			gapQuarter: "var(--gap-quarter)",
			gapNegative: "var(--gap-negative)",
			gapHalfNegative: "var(--gap-half-negative)",
			gapQuarterNegative: "var(--gap-quarter-negative)",
			radius: "var(--radius)"
		},
		font: {
			mono: "var(--font-mono)",
			sans: "var(--font-sans)"
		}
	})

	return (
		<GeistProvider themes={[customTheme]} themeType={"custom"}>
			<SkeletonTheme
				baseColor={skeletonBaseColor}
				highlightColor={skeletonHighlightColor}
			>
				<ThemeProvider
					disableTransitionOnChange
					cookieName="drift-theme"
					attribute="data-theme"
				>
					<CssBaseline />
					<Page width={"100%"}>
						{children}
					</Page>
				</ThemeProvider>
			</SkeletonTheme>
		</GeistProvider>
	)
}
