import { ChangeEvent, memo } from "react"
import { Input } from "@geist-ui/core"

import styles from "../post.module.css"

type props = {
	onChange: (e: ChangeEvent<HTMLInputElement>) => void
	description?: string
}

const Description = ({ onChange, description }: props) => {
	return (
		<div className={styles.description}>
			<Input
				value={description}
				onChange={onChange}
				label="Description"
				maxLength={256}
				width="100%"
			/>
		</div>
	)
}

export default memo(Description)
