import NextLink from "next/link"
import styles from "./link.module.css"

type LinkProps = {
	colored?: boolean
	children: React.ReactNode
} & React.ComponentProps<typeof NextLink>

const Link = ({ colored, children, ...props }: LinkProps) => {
	const className = colored ? `${styles.link} ${styles.color}` : styles.link
	return (
		<NextLink {...props} className={className}>
			{children}
		</NextLink>
	)
}

export default Link
