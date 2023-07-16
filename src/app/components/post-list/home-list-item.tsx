import VisibilityBadge from "../badges/visibility-badge"
import FadeIn from "@components/fade-in"
import ExpirationBadge from "@components/badges/expiration-badge"
import CreatedAgoBadge from "@components/badges/created-ago-badge"
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
import DocumentTabs from "src/app/(drift)/(posts)/components/document-tabs"
import { useEffect, useRef, useState } from "react"

// TODO: isOwner should default to false so this can be used generically
const HomeListItem = ({
	post
}: {
	post: PostWithFiles
	isOwner?: boolean
	deletePost: () => void
	hideActions?: boolean
}) => {
	const [isExpanded, setIsExpanded] = useState(false)
	const [isOverflowing, setIsOverflowing] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)

	const handleExpandClick = () => {
		setIsExpanded(!isExpanded)
	}

	useEffect(() => {
		console.log("checking overflow", containerRef.current)
		if (!containerRef.current) return
		if (containerRef.current.scrollHeight > containerRef.current.clientHeight) {
			console.log("overflowing")
			setIsOverflowing(true)
		}
	}, [post])

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
					<div
						className={`overflow-y-hidden ${
							isExpanded ? "max-h-full" : "max-h-64"
						}`}
						ref={containerRef}
					>
						<DocumentTabs
							isEditing={false}
							staticPreview={post.files[0].html}
							defaultTab={"preview"}
						>
							{post.files[0].content}
						</DocumentTabs>
					</div>
					{isOverflowing && (
						<div className="flex items-center mt-2">
							<hr className="flex-grow border-gray-300 dark:border-gray-700" />
							<div className="inline-block px-2 border border-gray-300 rounded text-accent-foreground dark:border-gray-700">
								<button onClick={handleExpandClick} className="text-sm font-bold transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
									{isExpanded ? "Collapse" : "Expand"}
								</button>
							</div>
							<hr className="flex-grow border-gray-300 dark:border-gray-700" />
						</div>
					)}
				</CardContent>
			</Card>
		</FadeIn>
	)
}

export default HomeListItem
