import { THEME_COOKIE } from "@lib/constants"
import { Cookies } from "react-cookie"

const cookies = new Cookies()

export function setDriftTheme(theme: string, setter: (theme: string) => void) {
	setter(theme)
	cookies.set(THEME_COOKIE, theme, { path: "/" })
}
