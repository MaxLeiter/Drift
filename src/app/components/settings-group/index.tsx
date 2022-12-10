"use client"
import Card from "@components/card"
import styles from "./settings-group.module.css"

type Props = {
	title: string
	children: React.ReactNode | React.ReactNode[]
}

const SettingsGroup = ({ title, children }: Props) => {
	return (
		<Card>
			<h4>{title}</h4>
			<hr />
			<div className={styles.content}>{children}</div>
		</Card>
	)
}

export default SettingsGroup
