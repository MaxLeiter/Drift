import React from "react"
import styles from "./input.module.css"

type Props = React.HTMLProps<HTMLInputElement> & {
	label?: string
	width?: number | string
	height?: number | string
}

// eslint-disable-next-line react/display-name
const Input = React.forwardRef<HTMLInputElement, Props>(
	({ label, className, width, height, ...props }, ref) => {
		const classes = [styles.input, styles.withLabel, className].join(" ")
		return (
			<div
				className={styles.wrapper}
				style={{
					width,
					height
				}}
			>
				{label && <label className={styles.label}>{label}</label>}
				<input
					ref={ref}
					className={classes}
					{...props}
					style={{
						width,
						height,
						...(props.style || {})
					}}
				/>
			</div>
		)
	}
)

export default Input
