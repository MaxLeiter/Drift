"use client"

import Header from "@components/header"
import { Page } from "@geist-ui/core/dist"
import styles from "@styles/Home.module.css"

export default function PageWrapper({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<Page width={"100%"}>
			<Page.Header>
				<Header />
			</Page.Header>

			<Page.Content className={styles.main}>{children}</Page.Content>
		</Page>
	)
}
