import { notFound, redirect } from "next/navigation"
import { getPostById, Post, PostWithFilesAndAuthor } from "@lib/server/prisma"
import { getCurrentUser } from "@lib/server/session"
import ScrollToTop from "@components/scroll-to-top"
import { title } from "process"
import { PostButtons } from "./components/header/post-buttons"
import styles from "./layout.module.css"
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

// export const dynamic = 'error';

const getPost = async (id: string) => {
	const [post, user] = await Promise.all([
		getPostById(id, {
			select: {
				visibility: true,
				authorId: true,
				title: true,
				description: true,
				id: true,
				createdAt: true,
				expiresAt: true,
				parentId: true,
				author: {
					select: {
						displayName: true,
						image: true
					}
				},
				files: {
					select: {
						id: true,
						content: true,
						updatedAt: true,
						title: true
					}
				}
			}
		}).then((post) => {
			if (!post) {
				return notFound()
			}
			return post as PostWithFilesAndAuthor
		}),
		getCurrentUser()
	])

	const isAuthorOrAdmin = user?.id === post?.authorId || user?.role === "admin"

	if (post.visibility === "public" || post.visibility === "unlisted") {
		return { post, isAuthorOrAdmin }
	}

	if (post.visibility === "private" && !isAuthorOrAdmin) {
		return redirect("/signin")
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
				createdAt: "",
				expiresAt: "",
				author: {
					displayName: ""
				},
				description: "",
				authorId: ""
			},
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

export default async function PostLayout({
	children,
	params
}: {
	params: {
		id: string
	}
	children: React.ReactNode
}) {
	const { post, isAuthor } = await getPost(params.id)

	return (
		<div className={styles.root}>
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
					// displayName is an optional param
					displayName={post.author?.displayName || undefined}
					visibility={post.visibility}
					authorId={post.authorId}
				/>
			</div>
			{post.description && (
				<div>
					<p>{post.description}</p>
				</div>
			)}

			{isAuthor && (
				<span className={styles.controls}>
					<VisibilityControl postId={post.id} visibility={post.visibility} />
				</span>
			)}
			<ScrollToTop />
			{children}
		</div>
	)
}
