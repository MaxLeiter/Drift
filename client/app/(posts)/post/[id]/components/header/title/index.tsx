import CreatedAgoBadge from "@components/badges/created-ago-badge"
import ExpirationBadge from "@components/badges/expiration-badge"
import VisibilityBadge from "@components/badges/visibility-badge"
import Link from "@components/link"
import Skeleton from "@components/skeleton"
import styles from "./title.module.css"

type TitleProps = {
	title: string
	loading?: boolean
	displayName?: string
	visibility?: string
	createdAt?: string
	expiresAt?: string
	authorId?: string
}

export const PostTitle = ({
	title,
	displayName,
	visibility,
	createdAt,
	expiresAt,
	loading,
	authorId
}: TitleProps) => {
	return (
		<span className={styles.title}>
			<h3>
				{title}{" "}
				<span style={{ color: "var(--gray)" }}>
					by{" "}
					<Link href={`/author/${authorId}`}>{displayName || "anonymous"}</Link>
				</span>
			</h3>
			{!loading && (
				<span className={styles.badges}>
					{visibility && <VisibilityBadge visibility={visibility} />}
					{createdAt && <CreatedAgoBadge createdAt={createdAt} />}
					{expiresAt && <ExpirationBadge postExpirationDate={expiresAt} />}
				</span>
			)}
			{loading && (
				<span className={styles.badges}>
					<Skeleton width={100} height={20} />
					<Skeleton width={100} height={20} />
					<Skeleton width={100} height={20} />
				</span>
			)}
		</span>
	)
}
