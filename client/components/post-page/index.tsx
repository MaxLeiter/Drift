import PageSeo from "@components/page-seo"
import VisibilityBadge from "@components/badges/visibility-badge"
import DocumentComponent from "@components/view-document"
import styles from "./post-page.module.css"
import homeStyles from "@styles/Home.module.css"

import type { File, Post, PostVisibility } from "@lib/types"
import {
	Page,
	Button,
	Text,
	ButtonGroup,
	useMediaQuery
} from "@geist-ui/core/dist"
import { useEffect, useState } from "react"
import Archive from "@geist-ui/icons/archive"
import Edit from "@geist-ui/icons/edit"
import Parent from "@geist-ui/icons/arrowUpCircle"
import FileDropdown from "@components/file-dropdown"
import ScrollToTop from "@components/scroll-to-top"
import { useRouter } from "next/router"
import ExpirationBadge from "@components/badges/expiration-badge"
import CreatedAgoBadge from "@components/badges/created-ago-badge"
import PasswordModalPage from "./password-modal-wrapper"
import VisibilityControl from "@components/badges/visibility-control"
import { USER_COOKIE_NAME } from "@lib/constants"
import { getCookie } from "cookies-next"

type Props = {
	post: Post
	isProtected?: boolean
}

const PostPage = ({ post: initialPost, isProtected }: Props) => {
	const [post, setPost] = useState<Post>(initialPost)
	const [visibility, setVisibility] = useState<PostVisibility>(post.visibility)
	const [isExpired, setIsExpired] = useState(
		post.expiresAt ? new Date(post.expiresAt) < new Date() : null
	)
	const [isLoading, setIsLoading] = useState(true)
	const [isOwner] = useState(
		post.users ? post.users[0].id === getCookie(USER_COOKIE_NAME) : false
	)
	const router = useRouter()
	const isMobile = useMediaQuery("mobile")

	useEffect(() => {
		if (!isOwner && isExpired) {
			router.push("/expired")
		}

		const expirationDate = new Date(post.expiresAt ? post.expiresAt : "")
		if (!isOwner && expirationDate < new Date()) {
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
	}, [isExpired, isOwner, post.expiresAt, post.users, router])

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
		router.push(`/post/${post.parent!.id}`)
	}

	if (isLoading) {
		return <></>
	}

	const isAvailable = !isExpired && !isProtected && post.title

	return (
		<>

			{!isAvailable && <PasswordModalPage setPost={setPost} />}
			<Page.Content className={homeStyles.main}>
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
				{isOwner && (
					<span className={styles.controls}>
						<VisibilityControl
							postId={post.id}
							visibility={visibility}
							setVisibility={setVisibility}
						/>
					</span>
				)}
				<ScrollToTop />
			</Page.Content>
		</>
	)
}

export default PostPage
