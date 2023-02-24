"use client"

import DocumentComponent from "./view-document"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import PasswordModalWrapper from "./password-modal-wrapper"
import { PostWithFilesAndAuthor } from "@lib/server/prisma"

type Props = {
	post: PostWithFilesAndAuthor
	isProtected?: boolean
	isAuthor?: boolean
}

const PostFiles = ({ post: initialPost }: Props) => {
	const [post, setPost] = useState<PostWithFilesAndAuthor>(initialPost)
	const router = useRouter()

	if (post?.expiresAt) {
		if (new Date(post.expiresAt) < new Date()) {
			router.push("/expired")
		}
	}

	useEffect(() => {
		let interval: NodeJS.Timer | null = null
		if (post?.expiresAt) {
			interval = setInterval(() => {
				const expirationDate = new Date(post.expiresAt ? post.expiresAt : "")
				if (expirationDate < new Date()) {
					router.push("/expired")
					if (interval) clearInterval(interval)
				}
			}, 4000)
		}
		return () => {
			if (interval) clearInterval(interval)
		}
	}, [post?.expiresAt, router])

	const isProtected = post?.visibility === "protected"
	const hasFetched = post?.files !== undefined
	if (isProtected && !hasFetched) {
		return (
			<PasswordModalWrapper
				authorId={post.authorId}
				setPost={setPost}
				postId={post.id}
			/>
		)
	}

	return (
		<main
			style={{
				display: "flex",
				flexDirection: "column",
				gap: "var(--gap-double)"
			}}
		>
			{post?.files?.map((file) => (
				<DocumentComponent
					skeleton={false}
					key={post.id}
					initialTab={"preview"}
					file={file}
					post={post}
				/>
			))}
		</main>
	)
}

export default PostFiles
