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
const Input = React.forwardRef<HTMLInputElement, InputProps>(
	(
		{ label, className, required, width, height, labelClassName, ...props },
		ref
	) => {
		const labelId = label?.replace(/\s/g, "-").toLowerCase()
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
						htmlFor={labelId}
						className={clsx(styles.label, labelClassName)}
					>
						{label}
					</label>
				)}
				<input
					ref={ref}
					id={labelId}
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

Input.displayName = "Input"

export default Input
