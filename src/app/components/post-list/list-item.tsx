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
import {
	ArrowUpCircle,
	Code,
	Database,
	Edit,
	FileText,
	Terminal,
	Trash
} from "react-feather"
import { codeFileExtensions } from "@lib/constants"

// TODO: isOwner should default to false so this can be used generically
const ListItem = ({
	post,
	isOwner,
	deletePost,
	hideActions
}: {
	post: PostWithFiles
	isOwner?: boolean
	deletePost: () => void
	hideActions?: boolean
}) => {
	const router = useRouter()

	const editACopy = () => {
		router.push(`/new/from/${post.id}`)
	}

	const viewParentClick = () => {
		router.push(`/post/${post.parentId}`)
	}

	const getIconFromFilename = (filename: string) => {
		const extension = filename.split(".").pop()
		switch (extension) {
			case "sql":
				return <Database />
			case "sh":
			case "fish":
			case "bash":
			case "zsh":
			case ".zshrc":
			case ".bashrc":
			case ".bash_profile":
				return <Terminal />
			default:
				if (codeFileExtensions.includes(extension || "")) {
					return <Code />
				} else {
					return <FileText />
				}
		}
	}

	return (
		<FadeIn>
			<li key={post.id}>
				<Card style={{ overflowY: "scroll" }}>
					<>
						<div className={styles.title}>
							<span className={styles.titleText}>
								<h4 style={{ display: "inline-block", margin: 0 }}>
									<Link
										colored
										style={{ marginRight: "var(--gap)" }}
										href={`/post/${post.id}`}
									>
										{post.title}
									</Link>
								</h4>
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
							</span>
							{!hideActions ? (
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
									{isOwner && (
										<Tooltip content={"Delete"}>
											<Button
												iconRight={<Trash />}
												onClick={deletePost}
												height={38}
											/>
										</Tooltip>
									)}
								</span>
							) : null}
						</div>

						{post.description && (
							<p className={styles.oneline}>{post.description}</p>
						)}
					</>
					<ul className={styles.files}>
						{post?.files?.map(
							(file: Pick<PostWithFiles, "files">["files"][0]) => {
								return (
									<li key={file.id}>
										<Link
											colored
											href={`/post/${post.id}#${file.title}`}
											style={{
												display: "flex",
												alignItems: "center"
											}}
										>
											{getIconFromFilename(file.title)}
											{file.title || "Untitled file"}
										</Link>
									</li>
								)
							}
						)}
					</ul>
				</Card>
			</li>
		</FadeIn>
	)
}

export default ListItem
