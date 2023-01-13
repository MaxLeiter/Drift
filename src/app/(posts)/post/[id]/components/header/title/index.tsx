import CreatedAgoBadge from "@components/badges/created-ago-badge"
import ExpirationBadge from "@components/badges/expiration-badge"
import VisibilityBadge from "@components/badges/visibility-badge"
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
	loading
}: // authorId
TitleProps) => {
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
