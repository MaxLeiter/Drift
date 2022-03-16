import '@styles/globals.css'
import { GeistProvider, CssBaseline, useTheme } from '@geist-ui/core'
import { useEffect, useMemo, useState } from 'react'
import type { AppProps as NextAppProps } from "next/app";
import useSharedState from '@lib/hooks/use-shared-state';

import 'react-loading-skeleton/dist/skeleton.css'
import { SkeletonTheme } from 'react-loading-skeleton';
import Head from 'next/head';

export type ThemeProps = {
  theme: "light" | "dark" | string,
  changeTheme: () => void
}

export type PostProps = {
  renderedPost: any | null, // Still don't have an official data type for posts
  theme: "light" | "dark" | string,
  changeTheme: () => void
}

type AppProps<P = any> = {
  pageProps: P;
} & Omit<NextAppProps<P>, "pageProps">;

export type DriftProps = ThemeProps

function MyApp({ Component, pageProps }: AppProps<ThemeProps>) {
  const [themeType, setThemeType] = useSharedState<string>('theme', 'light')
  const theme = useTheme();
  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) return
    const storedTheme = window.localStorage.getItem('drift-theme')
    if (storedTheme) setThemeType(storedTheme)
    // TODO: useReducer?
  }, [setThemeType, themeType])

  const changeTheme = () => {
    const newTheme = themeType === 'dark' ? 'light' : 'dark'
    localStorage.setItem('drift-theme', newTheme)
    setThemeType(last => (last === 'dark' ? 'light' : 'dark'))
  }

  const skeletonBaseColor = useMemo(() => {
    if (themeType === 'dark') return '#333'
    return '#eee'
  }, [themeType])
  const skeletonHighlightColor = useMemo(() => {
    if (themeType === 'dark') return '#555'
    return '#ddd'
  }, [themeType])

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
      <GeistProvider themeType={themeType} >
        <SkeletonTheme baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor}>
          <CssBaseline />
          <Component {...pageProps} theme={themeType || 'light'} changeTheme={changeTheme} />
        </SkeletonTheme>
      </GeistProvider>
    </>
  )
}

export default MyApp
