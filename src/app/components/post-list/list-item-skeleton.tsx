import styles from "./list-item.module.css"
import Card from "@components/card"
import Skeleton from "@components/skeleton"

export const ListItemSkeleton = () => (
	<li>
		<Card style={{ overflowY: "scroll" }}>
			<div style={{ display: "flex", gap: 16 }}>
				<div className={styles.title}>
					{/* title */}
					<Skeleton width={80} height={32} />
				</div>

				<div className={styles.badges}>
					<Skeleton width={60} height={32} />
					<Skeleton width={60} height={32} />
					<Skeleton width={60} height={32} />
				</div>
			</div>
			<Skeleton width={100} height={32} />
		</Card>
	</li>
)
