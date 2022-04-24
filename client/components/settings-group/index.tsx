import { Fieldset, Text, Divider } from "@geist-ui/core"
import styles from "./settings-group.module.css"

type Props = {
	title: string
	children: React.ReactNode | React.ReactNode[]
}

const SettingsGroup = ({ title, children }: Props) => {
	return (
		<Fieldset>
			<Fieldset.Content>
				<Text h4>{title}</Text>
			</Fieldset.Content>
			<Divider />
			<Fieldset.Content className={styles.content}>{children}</Fieldset.Content>
		</Fieldset>
	)
}

export default SettingsGroup
