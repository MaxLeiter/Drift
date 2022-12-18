import Card from "@components/card"
import styles from "./settings-group.module.css"

type Props =
	| {
			skeleton: true
			title?: string
			children?: React.ReactNode
	  }
	| {
			skeleton?: false
			title: string
			children: React.ReactNode
	  }

const SettingsGroup = ({ title, children, skeleton }: Props) => {
	if (skeleton) {
		return (
			<Card
				style={{
					height: 365
				}}
			/>
		)
	}

	return (
		<Card>
			<h4>{title}</h4>
			<hr />
			<div className={styles.content}>{children}</div>
		</Card>
	)
}

export default SettingsGroup
