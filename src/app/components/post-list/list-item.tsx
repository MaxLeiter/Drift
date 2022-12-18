import VisibilityBadge from "../badges/visibility-badge"
import FadeIn from "@components/fade-in"
import ExpirationBadge from "@components/badges/expiration-badge"
import CreatedAgoBadge from "@components/badges/created-ago-badge"
import { useRouter } from "next/navigation"
import styles from "./list-item.module.css"
import Link from "@components/link"
import type { PostWithFiles } from "@lib/server/prisma"
import Tooltip from "@components/tooltip"
import Badge from "@components/badges/badge"
import Card from "@components/card"
import Button from "@components/button"
import { ArrowUpCircle, Edit, Trash } from "react-feather"

// TODO: isOwner should default to false so this can be used generically
const ListItem = ({
	post,
	isOwner = true,
	deletePost
}: {
	post: PostWithFiles
	isOwner?: boolean
	deletePost: () => void
}) => {
	const router = useRouter()

	const editACopy = () => {
		router.push(`/new/from/${post.id}`)
	}

	const viewParentClick = () => {
		router.push(`/post/${post.parentId}`)
	}

	return (
		<FadeIn>
			<li key={post.id}>
				<Card style={{ overflowY: "scroll" }}>
					<>
						<div className={styles.title}>
							<h3 style={{ display: "inline-block", margin: 0 }}>
								<Link
									colored
									style={{ marginRight: "var(--gap)" }}
									href={`/post/${post.id}`}
								>
									{post.title}
								</Link>
							</h3>
							{isOwner && (
								<span className={styles.buttons}>
									{post.parentId && (
										<Tooltip content={"View parent"}>
											<Button
												iconRight={<ArrowUpCircle />}
												onClick={viewParentClick}
												height={38}
											/>
										</Tooltip>
									)}
									<Tooltip content={"Make a copy"}>
										<Button
											iconRight={<Edit />}
											onClick={editACopy}
											height={38}
										/>
									</Tooltip>
									<Tooltip content={"Delete"}>
										<Button
											iconRight={<Trash />}
											onClick={deletePost}
											height={38}
										/>
									</Tooltip>
								</span>
							)}
						</div>

						{post.description && (
							<p className={styles.oneline}>{post.description}</p>
						)}

						<div className={styles.badges}>
							<VisibilityBadge visibility={post.visibility} />
							<Badge type="secondary">
								{post.files?.length === 1
									? "1 file"
									: `${post.files?.length || 0} files`}
							</Badge>
							<CreatedAgoBadge createdAt={post.createdAt} />
							<ExpirationBadge postExpirationDate={post.expiresAt} />
						</div>
					</>
					<hr />
					<>
						{post?.files?.map((file: Pick<PostWithFiles, "files">["files"][0]) => {
							return (
								<div key={file.id}>
									<Link colored href={`/post/${post.id}#${file.title}`}>
										{file.title || "Untitled file"}
									</Link>
								</div>
							)
						})}
					</>
				</Card>
			</li>
		</FadeIn>
	)
}

export default ListItem
