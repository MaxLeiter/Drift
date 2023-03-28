import { THEME_COOKIE } from "@lib/constants"
import { Cookies } from "react-cookie"

export function setDriftTheme(theme: string, setter: (theme: string) => void) {
	setter(theme)
	const cookies = new Cookies()
	cookies.set(THEME_COOKIE, theme, { path: "/" })
}
