import useTheme from "@lib/hooks/use-theme"
import { memo, useEffect, useState } from "react"
import styles from './preview.module.css'

type Props = {
    height?: number | string
    html: string
    //  file extensions we can highlight 
}

const HtmlPreview = ({ height = 500, html }: Props) => {
    const { theme } = useTheme()
    return (<article
        data-theme={theme}
        className={styles.markdownPreview}
        dangerouslySetInnerHTML={{ __html: html }}
        style={{ height }} />)
}

export default HtmlPreview
