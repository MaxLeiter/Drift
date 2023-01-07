"use client"

import Button from "@components/button"
import ButtonGroup from "@components/button-group"
import FileDropdown from "src/app/(posts)/components/file-dropdown"
import { Edit, ArrowUpCircle, Archive } from "react-feather"
import styles from "./post-buttons.module.css"
import { useRouter } from "next/navigation"
import { PostWithFiles } from "@lib/server/prisma"

export const PostButtons = ({
	title,
	files,
	loading,
	postId,
	parentId
}: {
	title: string
	files?: Pick<PostWithFiles, "files">["files"]
	loading?: boolean
	postId?: string
	parentId?: string
	visibility?: string
	authorId?: string
}) => {
	const router = useRouter()
	const downloadClick = async () => {
		if (!files?.length) return
		const downloadZip = (await import("client-zip")).downloadZip
		const blob = await downloadZip(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			files.map((file: any) => {
				return {
					name: file.title,
					input: file.content,
					lastModified: new Date(file.updatedAt)
				}
			})
		).blob()
		const link = document.createElement("a")
		link.href = URL.createObjectURL(blob)
		link.download = `${title}.zip`
		link.click()
		link.remove()
	}

	const editACopy = () => {
		router.push(`/new/from/${postId}`)
	}

	const viewParentClick = () => {
		router.push(`/post/${parentId}`)
	}

	return (
		<span className={styles.buttons}>
			<ButtonGroup verticalIfMobile>
				<Button iconLeft={<Edit />} onClick={editACopy}>
					Edit a Copy
				</Button>
				{parentId && (
					<Button iconLeft={<ArrowUpCircle />} onClick={viewParentClick}>
						View Parent
					</Button>
				)}
				<Button onClick={downloadClick} iconLeft={<Archive />}>
					Download as ZIP Archive
				</Button>
				<FileDropdown loading={loading} files={files || []} />
			</ButtonGroup>
		</span>
	)
}
