import VisibilityBadge from "../badges/visibility-badge"
import FadeIn from "@components/fade-in"
import ExpirationBadge from "@components/badges/expiration-badge"
import CreatedAgoBadge from "@components/badges/created-ago-badge"
import { useRouter } from "next/navigation"
import styles from "./list-item.module.css"
import Link from "@components/link"
import type { PostWithFiles } from "@lib/server/prisma"
import { Tooltip } from "@components/tooltip"
import { Badge } from "@components/badges/badge"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@components/card"
import { Button } from "@components/button"
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
import DocumentTabs from "src/app/(drift)/(posts)/components/document-tabs"

// TODO: isOwner should default to false so this can be used generically
const HomeListItem = ({
	post
}: {
	post: PostWithFiles
	isOwner?: boolean
	deletePost: () => void
	hideActions?: boolean
}) => {
	const router = useRouter()

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
			<Card>
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
					</CardTitle>
					{post.description && (
						<CardDescription>
							<p className={styles.oneline}>{post.description}</p>
						</CardDescription>
					)}
				</CardHeader>
				<CardContent>
					<DocumentTabs
						isEditing={false}
						staticPreview={post.files[0].html}
						defaultTab={"preview"}
					>
						{post.files[0].content}
					</DocumentTabs>
				</CardContent>
			</Card>
		</FadeIn>
	)
}

export default HomeListItem
