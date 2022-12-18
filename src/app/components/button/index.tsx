import styles from "./button.module.css"
import { forwardRef, Ref } from "react"
import clsx from "clsx"
import { Spinner } from "@components/spinner"

type Props = React.HTMLProps<HTMLButtonElement> & {
	children?: React.ReactNode
	buttonType?: "primary" | "secondary"
	className?: string
	onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
	iconRight?: React.ReactNode
	iconLeft?: React.ReactNode
	height?: string | number
	width?: string | number
	padding?: string | number
	margin?: string | number
	loading?: boolean
}

// eslint-disable-next-line react/display-name
const Button = forwardRef<HTMLButtonElement, Props>(
	(
		{
			children,
			onClick,
			className,
			buttonType = "primary",
			type = "button",
			disabled = false,
			iconRight,
			iconLeft,
			height,
			width,
			padding,
			margin,
			loading,
			...props
		},
		ref
	) => {
		return (
			<button
				ref={ref}
				className={clsx(
					styles.button,
					type === "primary" || (type === "secondary" && styles[type]),
					className
				)}
				disabled={disabled || loading}
				onClick={onClick}
				style={{ height, width, margin, padding }}
				{...props}
			>
				{children && iconLeft && (
					<span className={clsx(styles.icon, styles.iconLeft)}>{iconLeft}</span>
				)}
				{!loading &&
					(children ? (
						children
					) : (
						<span className={styles.icon}>{iconLeft || iconRight}</span>
					))}
				{loading && (
					<span
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center"
						}}
					>
						<Spinner />
					</span>
				)}
				{children && iconRight && (
					<span className={clsx(styles.icon, styles.iconRight)}>
						{iconRight}
					</span>
				)}
			</button>
		)
	}
)

export default Button
