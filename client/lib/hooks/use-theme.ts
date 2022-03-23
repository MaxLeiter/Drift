import { useCallback, useEffect } from "react"
import useSharedState from "./use-shared-state"

const useTheme = () => {
    const isClient = typeof window === "object"
    const [themeType, setThemeType] = useSharedState<string>('theme', 'light')

    useEffect(() => {
        if (!isClient) return
        const storedTheme = localStorage.getItem('drift-theme')
        if (storedTheme) {
            setThemeType(storedTheme)
        }
    }, [isClient, setThemeType])

    const changeTheme = useCallback(() => {
        setThemeType(last => {
            const newTheme = last === 'dark' ? 'light' : 'dark'
            localStorage.setItem('drift-theme', newTheme)
            return newTheme
        })
    }, [setThemeType])

    return { theme: themeType, changeTheme }
}

export default useTheme