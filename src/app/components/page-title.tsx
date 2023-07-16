import { cn } from "@lib/cn"
import { PropsWithChildren } from "react"

export function PageTitle({
	children,
	className,
	...props
}: PropsWithChildren<React.HTMLProps<HTMLHeadingElement>>) {
	return (
		<h1 className={cn("pb-2 pt-2 text-4xl font-bold", className)} {...props}>
			{children}
		</h1>
	)
}
