"use client"

import {
	FunctionComponent,
	PropsWithChildren,
	useCallback,
	useMemo
} from "react"
import React, { useContext, useState, createContext } from "react"
import { DEFAULT_THEME, Theme, THEME_COOKIE_NAME } from "./theme"
import { setCookie } from "cookies-next"

interface UseThemeProps {
	theme: Theme
	setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<UseThemeProps | null>(null)

export function useTheme(): {
	theme: Theme
	setTheme: (theme: Theme) => void
} {
	return (
		useContext(ThemeContext) || {
			theme: DEFAULT_THEME,
			setTheme: () => {}
		}
	)
}

interface Props extends PropsWithChildren<{}> {
	defaultTheme: Theme
}

const ThemeClientContextProvider: FunctionComponent<Props> = ({
	defaultTheme,
	children
}) => {
	const [theme, setThemeState] = useState<Theme>(defaultTheme)
	const setCookieAndDocument = useCallback(
		(theme: Theme) => {
			setThemeState(theme)
			setCookie(THEME_COOKIE_NAME, theme)
			document.documentElement.setAttribute("data-theme", theme)
		},
		[setThemeState]
	)

	const setTheme = useCallback(
		(theme: Theme) => {
			setCookieAndDocument(theme)
		},
		[setCookieAndDocument]
	)

	const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme])

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export default ThemeClientContextProvider
