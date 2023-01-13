"use client"

import { PropsWithChildren } from "react"
import styles from "./page.module.css"

export default function Layout({ children }: PropsWithChildren<unknown>) {
	return <div className={styles.page}>{children}</div>
}
