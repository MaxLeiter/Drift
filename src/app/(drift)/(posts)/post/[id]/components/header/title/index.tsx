import CreatedAgoBadge from "@components/badges/created-ago-badge"
import ExpirationBadge from "@components/badges/expiration-badge"
import VisibilityBadge from "@components/badges/visibility-badge"
import Skeleton from "@components/skeleton"
import { PostWithFilesAndAuthor } from "@lib/server/prisma"
import styles from "./title.module.css"

type TitleProps = {
	loading?: boolean
	post?: PostWithFilesAndAuthor
}

export const PostTitle = ({ post, loading }: TitleProps) => {
	const { title, author, visibility, createdAt, expiresAt } = post || {}
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore displayName should be present
	const displayName = author?.displayName
	return (
		<span className={styles.title}>
			<h1
				style={{
					fontSize: "1.175rem"
				}}
			>
				{title}{" "}
				<span style={{ color: "var(--gray)" }}>
					by {/* <Link colored href={`/author/${authorId}`}> */}
					{displayName || "anonymous"}
					{/* </Link> */}
				</span>
			</h1>
			{!loading && (
				<span className={styles.badges}>
					{visibility && <VisibilityBadge visibility={visibility} />}
					{createdAt && <CreatedAgoBadge createdAt={createdAt} />}
					{expiresAt && <ExpirationBadge postExpirationDate={expiresAt} />}
				</span>
			)}
			{loading && (
				<span className={styles.badges}>
					<div style={{ display: "flex", alignItems: "center" }}>
						<Skeleton width={100} height={20} />
						<Skeleton width={100} height={20} />
						<Skeleton width={100} height={20} />
					</div>
				</span>
			)}
		</span>
	)
}
