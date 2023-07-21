import * as React from "react"

import { cn } from "@lib/cn"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
	label?: string
	hideLabel?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, label, hideLabel, ...props }, ref) => {
		const id = React.useId()
		return (
			<span className="flex w-full flex-row items-center">
				{label && !hideLabel ? (
					<label
						htmlFor={id}
						className={cn(
							"h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm font-medium text-muted-foreground",
							"rounded-br-none rounded-tr-none",
							className
						)}
					>
						{label}
					</label>
				) : null}
				{label && hideLabel ? (
					<label htmlFor={id} className="sr-only">
						{label}
					</label>
				) : null}
				<input
					type={type}
					className={cn(
						"flex h-10 w-full border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
						label && !hideLabel
							? "rounded-bl-none rounded-tl-none border-l-0"
							: "rounded-md",
						className
					)}
					ref={ref}
					id={id}
					{...props}
				/>
			</span>
		)
	}
)
Input.displayName = "Input"

export { Input }
