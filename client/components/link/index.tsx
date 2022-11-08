import { useRouter } from "next/router"
import NextLink from "next/link"
import styles from "./link.module.css"

type LinkProps = {
	href: string,
	colored?: boolean,
	children: React.ReactNode
} & React.ComponentProps<typeof NextLink>

const Link = ({ href, colored, children, ...props }: LinkProps) => {
	const { basePath } = useRouter()
	const propHrefWithoutLeadingSlash =
		href && href.startsWith("/") ? href.substring(1) : href

	const url = basePath ? `${basePath}/${propHrefWithoutLeadingSlash}` : href

	const className = colored ? `${styles.link} ${styles.color}` : styles.link
	return (
		<NextLink {...props} href={url} className={className}>
			{children}
		</NextLink>
	)
}

export default Link
