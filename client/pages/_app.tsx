import '../styles/globals.css'
import { GeistProvider, CssBaseline } from '@geist-ui/core'
import { useEffect, useState } from 'react'
import type { AppProps as NextAppProps } from "next/app";
import useSharedState from '../lib/hooks/use-shared-state';

export type ThemeProps = {
  theme: "light" | "dark" | string,
  changeTheme: () => void
}

type AppProps<P = any> = {
  pageProps: P;
} & Omit<NextAppProps<P>, "pageProps">;

export type DriftProps = ThemeProps

function MyApp({ Component, pageProps }: AppProps<ThemeProps>) {
  const [themeType, setThemeType] = useSharedState<string>('theme', 'light')

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

  return (
    <GeistProvider themeType={themeType} >
      <CssBaseline />
      <Component {...pageProps} theme={themeType || 'light'} changeTheme={changeTheme} />
    </GeistProvider>
  )
}

export default MyApp
