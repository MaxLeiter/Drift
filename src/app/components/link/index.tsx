import NextLink from "next/link"
import styles from "./link.module.css"
import { cn } from "@lib/cn"

type LinkProps = {
	colored?: boolean
	children: React.ReactNode
} & React.ComponentProps<typeof NextLink>

const Link = ({ colored, className, children, ...props }: LinkProps) => {
	const classes = colored ? "text-blue-500 no-underline" : "no-underline"
	return (
		<NextLink {...props} className={cn(classes, className)}>
			{children}
		</NextLink>
	)
}

export default Link
