import PostPage from "./components/post-page"
import { notFound, redirect } from "next/navigation"
import { getPostById, Post, PostWithFilesAndAuthor } from "@lib/server/prisma"
import { getCurrentUser } from "@lib/server/session"
import ScrollToTop from "@components/scroll-to-top"
import { title } from "process"
import { PostButtons } from "./components/header/post-buttons"
import styles from "./styles.module.css"
import { PostTitle } from "./components/header/title"
import VisibilityControl from "@components/badges/visibility-control"

export type PostProps = {
	post: Post
	isProtected?: boolean
}

// export async function generateStaticParams() {
// 	const posts = await getAllPosts({
// 		 where: {
// 			visibility: {
// 				equals: "public"
// 			}
// 		 }
// 	})

// 	return posts.map((post) => ({
// 		id: post.id
// 	}))
// }

const fetchOptions = {
	withFiles: true,
	withAuthor: true
}

const getPost = async (id: string) => {
	const post = (await getPostById(id, fetchOptions)) as PostWithFilesAndAuthor

	if (!post) {
		return notFound()
	}

	const user = await getCurrentUser()
	const isAuthorOrAdmin = user?.id === post?.authorId || user?.role === "admin"

	if (post.visibility === "public") {
		return { post, isAuthor: isAuthorOrAdmin }
	}

	if (post.visibility === "private" && !isAuthorOrAdmin) {
		return notFound()
	}

	if (post.visibility === "private" && !isAuthorOrAdmin) {
		return notFound()
	}

	if (post.visibility === "protected" && !isAuthorOrAdmin) {
		return {
			// TODO: remove this. It's temporary to appease typescript
			post: {
				visibility: "protected",
				id: post.id,
				files: [],
				parentId: "",
				title: "",
				createdAt: new Date("1970-01-01"),
				expiresAt: new Date("1970-01-01"),
				author: {
					displayName: "",
				},
				description: "",
				authorId: "",
			},
			isProtected: true,
			isAuthor: isAuthorOrAdmin
		}
	}

	// if expired
	if (post.expiresAt && !isAuthorOrAdmin) {
		const expirationDate = new Date(post.expiresAt)
		if (expirationDate < new Date()) {
			return redirect("/expired")
		}
	}

	return { post, isAuthor: isAuthorOrAdmin }
}

const PostView = async ({
	params
}: {
	params: {
		id: string
	}
}) => {
	const { post, isProtected, isAuthor } = await getPost(params.id)
	// TODO: serialize dates in prisma middleware instead of passing as JSON
	const stringifiedPost = JSON.stringify(post)

	return (
		<>
			<div className={styles.header}>
				<PostButtons
					parentId={post.parentId || undefined}
					postId={post.id}
					files={post.files}
					title={title}
				/>
				<PostTitle
					title={post.title}
					createdAt={post.createdAt.toString()}
					expiresAt={post.expiresAt?.toString()}
					displayName={post.author?.displayName || ""}
					visibility={post.visibility}
					authorId={post.authorId}
				/>
			</div>
			{post.description && (
				<div>
					<p>{post.description}</p>
				</div>
			)}
			<PostPage
				isAuthor={isAuthor}
				isProtected={isProtected}
				post={stringifiedPost}
			/>
			{isAuthor && (
				<span className={styles.controls}>
					<VisibilityControl postId={post.id} visibility={post.visibility} />
				</span>
			)}
			<ScrollToTop />
		</>
	)
}

export default PostView
