"use client"

import clsx from "clsx"
import styles from "./page.module.css"

export default function Layout({
	children,
	forSites
}: {
	forSites?: boolean
	children: React.ReactNode
}) {
	return (
		<div className={clsx(styles.page, forSites && styles.forSites)}>
			{children}
		</div>
	)
}
