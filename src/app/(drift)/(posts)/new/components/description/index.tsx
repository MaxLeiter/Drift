import Input from "@components/input"
import { ChangeEvent } from "react"

import styles from "../post.module.css"

type props = {
	onChange: (e: ChangeEvent<HTMLInputElement>) => void
	description: string
}

function Description({ onChange, description }: props) {
	return (
		<div className={styles.description}>
			<Input
				value={description || ""}
				onChange={onChange}
				label="Description"
				maxLength={256}
				width="100%"
				placeholder="An optional description"
			/>
		</div>
	)
}

export default Description
