import styles from "./list-item.module.css"
import { Card, CardContent, CardHeader } from "@components/card"
import Skeleton from "@components/skeleton"

export const ListItemSkeleton = () => (
	<li>
		<Card style={{ overflowY: "scroll" }}>
			{/* TODO: this is a bad way to do skeletons and is only accurate on desktop */}
			<CardHeader>
				<div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
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
			</CardHeader>
			<CardContent>
				<Skeleton width={100} height={32} />
			</CardContent>
		</Card>
	</li>
)
