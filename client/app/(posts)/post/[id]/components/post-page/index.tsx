"use client"

import VisibilityBadge from "@components/badges/visibility-badge"
import DocumentComponent from "./view-document"
import styles from "./post-page.module.css"

import { useEffect, useState } from "react"
import FileDropdown from "app/(posts)/components/file-dropdown"
import ScrollToTop from "@components/scroll-to-top"
import { useRouter } from "next/navigation"
import ExpirationBadge from "@components/badges/expiration-badge"
import CreatedAgoBadge from "@components/badges/created-ago-badge"
import PasswordModalPage from "./password-modal-wrapper"
import VisibilityControl from "@components/badges/visibility-control"
import { File, PostWithFilesAndAuthor } from "@lib/server/prisma"
import ButtonGroup from "@components/button-group"
import Button from "@components/button"
import { Archive, ArrowUpCircle, Edit } from "react-feather"

type Props = {
	post: string | PostWithFilesAndAuthor
	isProtected?: boolean
	isAuthor?: boolean
}

const PostPage = ({ post: initialPost, isProtected, isAuthor }: Props) => {
	const [post, setPost] = useState<PostWithFilesAndAuthor>(
		typeof initialPost === "string" ? JSON.parse(initialPost) : initialPost
	)

	const [visibility, setVisibility] = useState<string>(post.visibility)
	const router = useRouter()

	useEffect(() => {
		if (post.expiresAt) {
			if (new Date(post.expiresAt) < new Date()) {
				if (!isAuthor) {
					router.push("/expired")
				}

				const expirationDate = new Date(post.expiresAt ? post.expiresAt : "")
				if (!isAuthor && expirationDate < new Date()) {
					router.push("/expired")
				}

				let interval: NodeJS.Timer | null = null
				if (post.expiresAt) {
					interval = setInterval(() => {
						const expirationDate = new Date(
							post.expiresAt ? post.expiresAt : ""
						)
						if (expirationDate < new Date()) {
							if (!isAuthor) {
								router.push("/expired")
							}
							clearInterval(interval!)
						}
					}, 4000)
				}
				return () => {
					if (interval) clearInterval(interval)
				}
			}
		}
	}, [isAuthor, post.expiresAt, router])

	if (isProtected) {
		return <PasswordModalPage setPost={setPost} postId={post.id} />
	}

	const download = async () => {
		if (!post.files) return
		const downloadZip = (await import("client-zip")).downloadZip
		const blob = await downloadZip(
			post.files.map((file: any) => {
				return {
					name: file.title,
					input: file.content,
					lastModified: new Date(file.updatedAt)
				}
			})
		).blob()
		const link = document.createElement("a")
		link.href = URL.createObjectURL(blob)
		link.download = `${post.title}.zip`
		link.click()
		link.remove()
	}

	const editACopy = () => {
		router.push(`/new/from/${post.id}`)
	}

	const viewParentClick = () => {
		router.push(`/post/${post.parentId}`)
	}
	
	return (
		<>
			<div className={styles.header}>
				<span className={styles.buttons}>
					<ButtonGroup verticalIfMobile>
						<Button
							iconLeft={<Edit />}
							onClick={editACopy}
							style={{ textTransform: "none" }}
						>
							Edit a Copy
						</Button>
						{post.parentId && (
							<Button iconLeft={<ArrowUpCircle />} onClick={viewParentClick}>
								View Parent
							</Button>
						)}
						<Button
							onClick={download}
							iconLeft={<Archive />}
							style={{ textTransform: "none" }}
						>
							Download as ZIP Archive
						</Button>
						<FileDropdown files={post.files || []} />
					</ButtonGroup>
				</span>
				<span className={styles.title}>
					<h3>
						{post.title}{" "}
						<span style={{ color: "var(--gray)" }}>
							by {post.author?.displayName}
						</span>
					</h3>
					<span className={styles.badges}>
						<VisibilityBadge visibility={visibility} />
						<CreatedAgoBadge createdAt={post.createdAt} />
						<ExpirationBadge postExpirationDate={post.expiresAt} />
					</span>
				</span>
			</div>
			{post.description && (
				<div>
					<p>{post.description}</p>
				</div>
			)}
			{/* {post.files.length > 1 && <FileTree files={post.files} />} */}
			{post.files?.map(({ id, content, title, html }: File) => (
				<DocumentComponent
					key={id}
					title={title}
					initialTab={"preview"}
					id={id}
					content={content}
					preview={html}
				/>
			))}
			{isAuthor && (
				<span className={styles.controls}>
					<VisibilityControl
						postId={post.id}
						visibility={visibility}
						setVisibility={setVisibility}
					/>
				</span>
			)}
			<ScrollToTop />
		</>
	)
}

export default PostPage
