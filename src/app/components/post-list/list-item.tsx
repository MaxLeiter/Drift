import VisibilityBadge from "../badges/visibility-badge"
import FadeIn from "@components/fade-in"
import ExpirationBadge from "@components/badges/expiration-badge"
import CreatedAgoBadge from "@components/badges/created-ago-badge"
import { useRouter } from "next/navigation"
import styles from "./list-item.module.css"
import Link from "@components/link"
import type { PostWithFiles } from "@lib/server/prisma"
import { Badge } from "@components/badges/badge"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@components/card"
import {
	ArrowUpCircle,
	Code,
	Database,
	Edit,
	FileText,
	MoreVertical,
	Terminal,
	Trash
} from "react-feather"
import { codeFileExtensions } from "@lib/constants"
import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "@components/dropdown-menu"
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu"

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
		<FadeIn key={post.id} as="li">
			<Card className="overflow-y-scroll h-42">
				<CardHeader>
					<CardTitle className="flex items-center justify-between gap-2">
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
								<Badge variant={"outline"}>
									{post.files?.length === 1
										? "1 file"
										: `${post.files?.length || 0} files`}
								</Badge>
								<CreatedAgoBadge createdAt={post.createdAt} />
								<ExpirationBadge postExpirationDate={post.expiresAt} />
							</div>
						</span>
						{!hideActions ? (
							<span className="flex gap-2">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<MoreVertical className="cursor-pointer" />
									</DropdownMenuTrigger>
									<DropdownMenuContent className="mt-2 border rounded-md shadow-sm border-border bg-background">
										<DropdownMenuItem
											onSelect={() => {
												editACopy()
											}}
											className="cursor-pointer bg-background"
										>
											<Edit className="w-4 h-4 mr-2" /> Edit a copy
										</DropdownMenuItem>
										{isOwner && (
											<DropdownMenuItem
												onSelect={() => {
													deletePost()
												}}
												className="cursor-pointer bg-background"
											>
												<Trash className="w-4 h-4 mr-2" />
												Delete
											</DropdownMenuItem>
										)}
										{post.parentId && (
											<DropdownMenuItem
												onSelect={() => {
													viewParentClick()
												}}
											>
												<ArrowUpCircle className="w-4 h-4 mr-2" />
												View parent
											</DropdownMenuItem>
										)}
									</DropdownMenuContent>
								</DropdownMenu>
							</span>
						) : null}
					</CardTitle>
					{post.description && (
						<CardDescription>
							<p className={styles.oneline}>{post.description}</p>
						</CardDescription>
					)}
				</CardHeader>
				<CardContent>
					<ul className={styles.files}>
						{post?.files?.map(
							(file: Pick<PostWithFiles, "files">["files"][0]) => {
								return (
									<li key={file.id} className="text-black">
										<Link
											href={`/post/${post.id}#${file.title}`}
											className="flex items-center gap-2 font-mono text-sm text-foreground"
										>
											{getIconFromFilename(file.title)}
											{file.title || "Untitled file"}
										</Link>
									</li>
								)
							}
						)}
					</ul>
				</CardContent>
			</Card>
		</FadeIn>
	)
}

export default ListItem
