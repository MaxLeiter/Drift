import { Card, CardContent, CardHeader, CardTitle } from "@components/card"
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
			<CardHeader>
				<CardTitle>
					<h4>{title}</h4>
				</CardTitle>
			</CardHeader>
			<hr className="pb-4" />
			<CardContent>
				<div className={styles.content}>{children}</div>
			</CardContent>
		</Card>
	)
}

export default SettingsGroup
