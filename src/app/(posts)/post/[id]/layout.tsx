import { PostWithFilesAndAuthor } from "@lib/server/prisma"
import ScrollToTop from "@components/scroll-to-top"
import { title } from "process"
import { PostButtons } from "./components/header/post-buttons"
import styles from "./layout.module.css"
import { PostTitle } from "./components/header/title"
import { getPost } from "./get-post"

export default async function PostLayout({
	children,
	params
}: {
	params: {
		id: string
	}
	children: React.ReactNode
}) {
	const { post } = (await getPost(params.id)) as {
		post: PostWithFilesAndAuthor
	}

	return (
		<div className={styles.root}>
			<div className={styles.header}>
				{/* post.title is not set when the post is protected */}
				{post.title && (
					<PostButtons
						parentId={post.parentId || undefined}
						postId={post.id}
						files={post.files}
						title={title}
						authorId={post.authorId}
						visibility={post.visibility}
					/>
				)}
				{post.title && (
					<PostTitle
						title={post.title}
						createdAt={post.createdAt.toString()}
						expiresAt={post.expiresAt?.toString()}
						// displayName is an optional param
						displayName={post.author?.displayName || undefined}
						visibility={post.visibility}
						authorId={post.authorId}
					/>
				)}
			</div>
			{post.description && (
				<div>
					<p>{post.description}</p>
				</div>
			)}
			<ScrollToTop />
			{children}
		</div>
	)
}
