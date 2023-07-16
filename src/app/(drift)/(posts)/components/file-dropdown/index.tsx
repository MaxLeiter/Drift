import { Popover, PopoverContent, PopoverTrigger } from "@components/popover"
import { codeFileExtensions } from "@lib/constants"
import type { PostWithFiles } from "src/lib/server/prisma"
import styles from "./dropdown.module.css"
import { ChevronDown, Code, File as FileIcon } from "react-feather"
import { Spinner } from "@components/spinner"
import Link from "next/link"
import { buttonVariants } from "@components/button"

function FileDropdown({
	files,
	loading
}: {
	files: Pick<PostWithFiles, "files">["files"]
	loading?: boolean
}) {
	if (loading) {
		return (
			<Popover>
				<PopoverTrigger
					className={buttonVariants({
						variant: "link"
					})}
				>
					<div style={{ minWidth: 125 }}>
						<Spinner />
					</div>
				</PopoverTrigger>
			</Popover>
		)
	}

	const items = files.map((file) => {
		const extension = file.title.split(".").pop()
		if (codeFileExtensions.includes(extension || "")) {
			return {
				...file,
				icon: <Code className="h-4 w-4" />
			}
		} else {
			return {
				...file,
				icon: <FileIcon className="h-4 w-4" />
			}
		}
	})

	const content = (
		<ul className="text-sm">
			{items.map((item) => (
				<li key={item.id} className="flex">
					<Link
						href={`#${item.title}`}
						className="flex w-full items-center gap-3 hover:underline"
					>
						{item.icon}
						{item.title ? item.title : "Untitled"}
					</Link>
				</li>
			))}
		</ul>
	)

	return (
		<Popover>
			<PopoverTrigger
				className={buttonVariants({
					variant: "secondary"
				})}
			>
				<div className={styles.chevron} style={{ marginRight: 6 }}>
					<ChevronDown />
				</div>
				<span>
					Jump to {files.length} {files.length === 1 ? "file" : "files"}
				</span>
			</PopoverTrigger>
			<PopoverContent>{content}</PopoverContent>
		</Popover>
	)
}

export default FileDropdown
