import clsx from "clsx"
import React from "react"
import styles from "./input.module.css"

type Props = React.HTMLProps<HTMLInputElement> & {
	label?: string
	width?: number | string
	height?: number | string
	labelClassName?: string
}

// we have two special rules on top of the props:
// if onChange or value is passed, we require both, unless `disabled`
// if label is passed, we forbid aria-label and vice versa
type InputProps = Omit<Props, "onChange" | "value" | "label" | "aria-label"> &
	(
		| {
				onChange: Props["onChange"]
				value: Props["value"]
		  } // if onChange or value is passed, we require both
		| {
				onChange?: never
				value?: never
		  }
		| {
				value: Props["value"]
				disabled: true
				onChange?: never
		  }
	) &
	(
		| {
				label: Props["label"]
				"aria-label"?: never
		  } // if label is passed, we forbid aria-label and vice versa
		| {
				label?: never
				"aria-label": Props["aria-label"]
		  }
	)
// eslint-disable-next-line react/display-name
const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ label, className, width, height, labelClassName, ...props }, ref) => {
		return (
			<div
				className={styles.wrapper}
				style={{
					width,
					height
				}}
			>
				{label && (
					<label
						aria-labelledby={label}
						className={clsx(styles.label, labelClassName)}
					>
						{label}
					</label>
				)}
				<input
					ref={ref}
					id={label}
					className={clsx(styles.input, label && styles.withLabel, className)}
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
