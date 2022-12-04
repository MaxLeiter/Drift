import CreatedAgoBadge from '@components/badges/created-ago-badge'
import ExpirationBadge from '@components/badges/expiration-badge'
import VisibilityBadge from '@components/badges/visibility-badge'
import Skeleton from '@components/skeleton'
import styles from './title.module.css'

type TitleProps = {
	title: string
	loading?: boolean
	displayName?: string
	visibility?: string
	createdAt?: Date
	expiresAt?: Date
}

export const PostTitle = ({
    title,
    displayName,
    visibility,
    createdAt,
    expiresAt,
    loading
}: TitleProps) => {
	return (
		<span className={styles.title}>
			<h3>
				{title}{" "}
				<span style={{ color: "var(--gray)" }}>
					by {displayName || "anonymous"}
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
