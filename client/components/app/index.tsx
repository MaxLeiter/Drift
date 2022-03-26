import { GeistProvider, CssBaseline, Themes } from "@geist-ui/core"
import type { NextComponentType, NextPageContext } from "next"
import { SkeletonTheme } from "react-loading-skeleton"
import { useTheme } from 'next-themes'
const App = ({
    Component,
    pageProps,
}: {
    Component: NextComponentType<NextPageContext, any, any>
    pageProps: any
}) => {
    const skeletonBaseColor = 'var(--light-gray)'
    const skeletonHighlightColor = 'var(--lighter-gray)'

    const customTheme = Themes.createFromLight(
        {
            type: "custom",
            palette: {
                background: 'var(--bg)',
                foreground: 'var(--fg)',
                accents_1: 'var(--lightest-gray)',
                accents_2: 'var(--lighter-gray)',
                accents_3: 'var(--light-gray)',
                accents_4: 'var(--gray)',
                accents_5: 'var(--darker-gray)',
                accents_6: 'var(--darker-gray)',
                accents_7: 'var(--darkest-gray)',
                accents_8: 'var(--darkest-gray)',
                border: 'var(--light-gray)',
                warning: 'var(--warning)'
            },
            expressiveness: {
                dropdownBoxShadow: '0 0 0 1px var(--light-gray)',
                shadowSmall: '0 0 0 1px var(--light-gray)',
                shadowLarge: '0 0 0 1px var(--light-gray)',
                shadowMedium: '0 0 0 1px var(--light-gray)',
            },
            layout: {
                gap: 'var(--gap)',
                gapHalf: 'var(--gap-half)',
                gapQuarter: 'var(--gap-quarter)',
                gapNegative: 'var(--gap-negative)',
                gapHalfNegative: 'var(--gap-half-negative)',
                gapQuarterNegative: 'var(--gap-quarter-negative)',
                radius: 'var(--radius)',
            },
            font: {
                mono: 'var(--font-mono)',
                sans: 'var(--font-sans)',
            }
        }
    )
    return (<GeistProvider themes={[customTheme]} themeType={"custom"} >
        <SkeletonTheme baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor}>
            <CssBaseline />
            <Component {...pageProps} />
        </SkeletonTheme>
    </GeistProvider >)
}

export default App