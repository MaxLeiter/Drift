import { GeistProvider, CssBaseline } from "@geist-ui/core"
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

    const { theme } = useTheme();

    return (<GeistProvider themeType={theme}>
        <SkeletonTheme baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor}>
            <CssBaseline />
            <Component {...pageProps} />
        </SkeletonTheme>
    </GeistProvider>)
}

export default App