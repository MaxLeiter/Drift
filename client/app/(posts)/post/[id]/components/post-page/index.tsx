"use client"

import VisibilityBadge from "app/components/badges/visibility-badge"
import DocumentComponent from "./view-document"
import styles from "./post-page.module.css"

import type { PostVisibility } from "@lib/types"
import { Button, Text, ButtonGroup, useMediaQuery } from "@geist-ui/core/dist"
import { useEffect, useState } from "react"
import Archive from "@geist-ui/icons/archive"
import Edit from "@geist-ui/icons/edit"
import Parent from "@geist-ui/icons/arrowUpCircle"
import FileDropdown from "app/(posts)/components/file-dropdown"
import ScrollToTop from "app/components/scroll-to-top"
import { useRouter } from "next/navigation"
import ExpirationBadge from "app/components/badges/expiration-badge"
import CreatedAgoBadge from "app/components/badges/created-ago-badge"
import PasswordModalPage from "./password-modal-wrapper"
import VisibilityControl from "app/components/badges/visibility-control"
import { File, PostWithFiles } from "@lib/server/prisma"
import Header from "app/components/header"

type Props = {
	post: PostWithFiles
	isProtected?: boolean
	isAuthor?: boolean
}

const PostPage = ({ post: initialPost, isProtected, isAuthor }: Props) => {
	const [post, setPost] = useState<PostWithFiles>(initialPost)
	const [visibility, setVisibility] = useState<string>(post.visibility)
	const [isExpired, setIsExpired] = useState(
		post.expiresAt ? new Date(post.expiresAt) < new Date() : null
	)
	const [isLoading, setIsLoading] = useState(true)
	const router = useRouter()
	const isMobile = useMediaQuery("mobile")

	useEffect(() => {
		if (!isAuthor && isExpired) {
			router.push("/expired")
		}

		const expirationDate = new Date(post.expiresAt ? post.expiresAt : "")
		if (!isAuthor && expirationDate < new Date()) {
			router.push("/expired")
		} else {
			setIsLoading(false)
		}

		let interval: NodeJS.Timer | null = null
		if (post.expiresAt) {
			interval = setInterval(() => {
				const expirationDate = new Date(post.expiresAt ? post.expiresAt : "")
				setIsExpired(expirationDate < new Date())
			}, 4000)
		}
		return () => {
			if (interval) clearInterval(interval)
		}
	}, [isExpired, isAuthor, post.expiresAt, router])

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

	if (isLoading) {
		return <></>
	}

	const isAvailable = !isExpired && !isProtected && post.title

	return (
		<>
			{!isAvailable && <PasswordModalPage setPost={setPost} />}
			<div className={styles.header}>
				<span className={styles.buttons}>
					<ButtonGroup
						vertical={isMobile}
						marginLeft={0}
						marginRight={0}
						marginTop={1}
						marginBottom={1}
					>
						<Button
							auto
							icon={<Edit />}
							onClick={editACopy}
							style={{ textTransform: "none" }}
						>
							Edit a Copy
						</Button>
						{post.parent && (
							<Button auto icon={<Parent />} onClick={viewParentClick}>
								View Parent
							</Button>
						)}
						<Button
							auto
							onClick={download}
							icon={<Archive />}
							style={{ textTransform: "none" }}
						>
							Download as ZIP Archive
						</Button>
						<FileDropdown isMobile={isMobile} files={post.files || []} />
					</ButtonGroup>
				</span>
				<span className={styles.title}>
					<Text h3>{post.title}</Text>
					<span className={styles.badges}>
						<VisibilityBadge visibility={visibility} />
						<CreatedAgoBadge createdAt={post.createdAt} />
						<ExpirationBadge postExpirationDate={post.expiresAt} />
					</span>
				</span>
			</div>
			{post.description && (
				<div>
					<Text p>{post.description}</Text>
				</div>
			)}
			{/* {post.files.length > 1 && <FileTree files={post.files} />} */}
			{post.files?.map(({ id, content, title }: File) => (
				<DocumentComponent
					key={id}
					title={title}
					initialTab={"preview"}
					id={id}
					content={content}
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
