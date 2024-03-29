import { ChangeEvent, memo } from "react"

import { Input } from "@components/input"

const titlePlaceholders = [
	"How to...",
	"Status update for ...",
	"My new project",
	"My new idea",
	"Let's talk about...",
	"What's up with ...",
	"I'm thinking about ..."
]

const placeholder = titlePlaceholders[3]

type props = {
	onChange: (e: ChangeEvent<HTMLInputElement>) => void
	title?: string
	className?: string
}

function Title({ onChange, title, className }: props) {
	return (
		<div className={className}>
			<Input
				placeholder={placeholder}
				value={title}
				onChange={onChange}
				label="Title"
			/>
		</div>
	)
}

export default memo(Title)
