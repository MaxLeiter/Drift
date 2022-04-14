import NextLink from "next/link"
import VisibilityBadge from "../badges/visibility-badge"
import getPostPath from "@lib/get-post-path"
import {
	Link,
	Text,
	Card,
	Tooltip,
	Divider,
	Badge,
	Button
} from "@geist-ui/core"
import { File, Post } from "@lib/types"
import FadeIn from "@components/fade-in"
import Trash from "@geist-ui/icons/trash"
import ExpirationBadge from "@components/badges/expiration-badge"
import CreatedAgoBadge from "@components/badges/created-ago-badge"
import Edit from "@geist-ui/icons/edit"
import { useRouter } from "next/router"
import Parent from "@geist-ui/icons/arrowUpCircle"
import styles from "./list-item.module.css"

// TODO: isOwner should default to false so this can be used generically
const ListItem = ({
	post,
	isOwner = true,
	deletePost
}: {
	post: Post
	isOwner?: boolean
	deletePost: () => void
}) => {
	const router = useRouter()

	const editACopy = () => {
		router.push(`/new/from/${post.id}`)
	}

	return (
		<FadeIn>
			<li key={post.id}>
				<Card style={{ overflowY: "scroll" }}>
					<Card.Body>
						<Text h3 className={styles.title}>
							<NextLink
								passHref={true}
								href={getPostPath(post.visibility, post.id)}
							>
								<Link color marginRight={"var(--gap)"}>
									{post.title}
								</Link>
							</NextLink>
							{isOwner && (
								<span className={styles.buttons}>
									{post.parent && (
										<Tooltip text={"View parent"} hideArrow>
											<Button
												auto
												icon={<Parent />}
												onClick={() =>
													router.push(
														getPostPath(
															post.parent!.visibility,
															post.parent!.id
														)
													)
												}
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
							<VisibilityBadge visibility={post.visibility} />
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
						{post.files?.map((file: File) => {
							return (
								<div key={file.id}>
									<Link
										color
										href={`${getPostPath(post.visibility, post.id)}#${
											file.title
										}`}
									>
										{file.title || "Untitled file"}
									</Link>
								</div>
							)
						})}
					</Card.Content>
				</Card>
			</li>{" "}
		</FadeIn>
	)
}

export default ListItem
