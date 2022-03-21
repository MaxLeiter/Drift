export type PostVisibility = "unlisted" | "private" | "public" | "protected"

export type ThemeProps = {
    theme: "light" | "dark" | string,
    changeTheme: () => void
}

export type Document = {
    title: string
    content: string
    id: string
}
