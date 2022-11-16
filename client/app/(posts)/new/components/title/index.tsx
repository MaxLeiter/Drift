import { ChangeEvent, memo, useEffect, useState } from "react"

import ShiftBy from "@components/shift-by"
import styles from "../post.module.css"
import Input from "@components/input"

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
	const [placeholder, setPlaceholder] = useState(titlePlaceholders[0])
	useEffect(() => {
		// set random placeholder on load
		setPlaceholder(
			titlePlaceholders[Math.floor(Math.random() * titlePlaceholders.length)]
		)
	}, [])
	return (
		<div className={styles.title}>
			<h1 className={styles.drift}>Drift</h1>
			<Input
				placeholder={placeholder}
				value={title || ""}
				onChange={onChange}
				height={"55px"}
				label="Post title"
				style={{ width: "100%", fontSize: 18 }}
			/>
		</div>
	)
}

export default memo(Title)
