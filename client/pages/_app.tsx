import '@styles/globals.css'
import type { AppProps as NextAppProps } from "next/app";

import 'react-loading-skeleton/dist/skeleton.css'
import { SkeletonTheme } from 'react-loading-skeleton';
import Head from 'next/head';
import useTheme from '@lib/hooks/use-theme';
import { CssBaseline, GeistProvider } from '@geist-ui/core';

import nprogress from 'nprogress'
import debounce from 'lodash.debounce'
import Router from 'next/router';

// Only show nprogress after 500ms (slow loading)
const start = debounce(nprogress.start, 500)
Router.events.on('routeChangeStart', start)
Router.events.on('routeChangeComplete', () => {
  start.cancel()
  nprogress.done()
  window.scrollTo(0, 0)
})
Router.events.on('routeChangeError', () => {
  start.cancel()
  nprogress.done()
})

type AppProps<P = any> = {
  pageProps: P;
} & Omit<NextAppProps<P>, "pageProps">;


function MyApp({ Component, pageProps }: AppProps) {
  const { theme } = useTheme()
  const skeletonBaseColor = 'var(--light-gray)'
  const skeletonHighlightColor = 'var(--lighter-gray)'

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/assets/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="apple-mobile-web-app-title" content="Drift" />
        <meta name="application-name" content="Drift" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <title>Drift</title>
      </Head>
      <GeistProvider themeType={theme} >
        <SkeletonTheme baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor}>
          <CssBaseline />
          <Component {...pageProps} />
        </SkeletonTheme>
      </GeistProvider>
    </>
  )
}

export default MyApp
