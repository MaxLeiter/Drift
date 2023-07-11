import { Popover, PopoverContent, PopoverTrigger } from "@components/popover"
import { codeFileExtensions } from "@lib/constants"
import type { PostWithFiles } from "src/lib/server/prisma"
import styles from "./dropdown.module.css"
import { ChevronDown, Code, File as FileIcon } from "react-feather"
import { Spinner } from "@components/spinner"
import Link from "next/link"
import { buttonVariants } from "@components/button"
import { cn } from "@lib/cn"

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
				icon: <Code />
			}
		} else {
			return {
				...file,
				icon: <FileIcon />
			}
		}
	})

	const content = (
		<ul className="w-[150px]">
			{items.map((item) => (
				<li key={item.id}>
					<Link
						href={`#${item.title}`}
						className={cn(
							buttonVariants({
								variant: "secondary"
							}),
							"w-full"
						)}
					>
						<span className={styles.fileIcon}>{item.icon}</span>
						<span className={styles.fileTitle}>
							{item.title ? item.title : "Untitled"}
						</span>
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
			<PopoverContent className={styles.contentWrapper}>
				{content}
			</PopoverContent>
		</Popover>
	)
}

export default FileDropdown
