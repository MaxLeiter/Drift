import {
	PostWithFilesAndAuthor,
	serverPostToClientPost,
	ServerPostWithFilesAndAuthor
} from "@lib/server/prisma"
import ScrollToTop from "@components/scroll-to-top"
import { PostButtons } from "./components/header/post-buttons"
import styles from "./layout.module.css"
import { PostTitle } from "./components/header/title"
import { getPost } from "./get-post"

export default async function PostLayout({
	children,
	params
}: {
	children: React.ReactNode
	params: {
		id: string
	}
}) {
	const post = (await getPost(params.id)) as ServerPostWithFilesAndAuthor

	// TODO: type-safe
	const clientPost = serverPostToClientPost(post) as PostWithFilesAndAuthor
	return (
		<div className={styles.root}>
			<div className={styles.header}>
				{post.visibility !== "protected" && <PostButtons post={clientPost} />}
				{post.visibility !== "protected" && <PostTitle post={clientPost} />}
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
