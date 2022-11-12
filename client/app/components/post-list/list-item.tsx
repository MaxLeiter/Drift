import VisibilityBadge from "../badges/visibility-badge"
import {
	Text,
	Card,
	Tooltip,
	Divider,
	Badge,
	Button
} from "@geist-ui/core/dist"
import FadeIn from "@components/fade-in"
import Trash from "@geist-ui/icons/trash"
import ExpirationBadge from "@components/badges/expiration-badge"
import CreatedAgoBadge from "@components/badges/created-ago-badge"
import Edit from "@geist-ui/icons/edit"
import { useRouter } from "next/navigation"
import Parent from "@geist-ui/icons/arrowUpCircle"
import styles from "./list-item.module.css"
import Link from "@components/link"
import type { PostWithFiles } from "@lib/server/prisma"
import type { PostVisibility } from "@lib/types"
import type { File } from "@lib/server/prisma"

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
					<Card.Body>
						<Text h3 className={styles.title}>
							<Link
								colored
								style={{ marginRight: "var(--gap)" }}
								href={`/post/${post.id}`}
							>
								{post.title}
							</Link>
							{isOwner && (
								<span className={styles.buttons}>
									{post.parentId && (
										<Tooltip text={"View parent"} hideArrow>
											<Button
												auto
												icon={<Parent />}
												onClick={viewParentClick}
											/>
										</Tooltip>
									)}
									<Tooltip text={"Make a copy"} hideArrow>
										<Button auto iconRight={<Edit />} onClick={editACopy} />
									</Tooltip>
									<Tooltip text={"Delete"} hideArrow>
										<Button iconRight={<Trash />} onClick={deletePost} auto />
									</Tooltip>
								</span>
							)}
						</Text>

						{post.description && (
							<Text p className={styles.oneline}>
								{post.description}
							</Text>
						)}

						<div className={styles.badges}>
							<VisibilityBadge visibility={post.visibility as PostVisibility} />
							<CreatedAgoBadge createdAt={post.createdAt} />
							<Badge type="secondary">
								{post.files?.length === 1
									? "1 file"
									: `${post.files?.length || 0} files`}
							</Badge>
							<ExpirationBadge postExpirationDate={post.expiresAt} />
						</div>
					</Card.Body>
					<Divider h="1px" my={0} />
					<Card.Content>
						{post?.files?.map((file: File) => {
							return (
								<div key={file.id}>
									<Link colored href={`/post/${post.id}#${file.title}`}>
										{file.title || "Untitled file"}
									</Link>
								</div>
							)
						})}
					</Card.Content>
				</Card>
			</li>
		</FadeIn>
	)
}

export default ListItem
