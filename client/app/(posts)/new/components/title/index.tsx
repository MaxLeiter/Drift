import { ChangeEvent, memo } from "react"

import Input from "@components/input"
import styles from "./title.module.css"

const titlePlaceholders = [
	"How to...",
	"Status update for ...",
	"My new project",
	"My new idea",
	"Let's talk about...",
	"What's up with ...",
	"I'm thinking about ..."
]

type props = {
	onChange: (e: ChangeEvent<HTMLInputElement>) => void
	title?: string
}

const Title = ({ onChange, title }: props) => {
	const placeholder =
		titlePlaceholders[Math.floor(Math.random() * titlePlaceholders.length)]
	return (
		<div className={styles.title}>
			<h1>Drift</h1>
			<Input
				placeholder={placeholder}
				value={title}
				onChange={onChange}
				label="Title"
				className={styles.labelAndInput}
				style={{ width: "100%" }}
				labelClassName={styles.labelAndInput}
			/>
		</div>
	)
}

export default memo(Title)
