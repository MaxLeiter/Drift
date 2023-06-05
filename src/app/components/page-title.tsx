import { cn } from "@lib/cn"
import { PropsWithChildren } from "react"

export function PageTitle({
	children,
	className,
	...props
}: PropsWithChildren<React.HTMLProps<HTMLHeadingElement>>) {
	return (
		<h1 className={cn("text-4xl font-bold pb-2 pt-2", className)} {...props}>
			{children}
		</h1>
	)
}
