import { Popover } from "@components/popover"
import { codeFileExtensions } from "@lib/constants"
import clsx from "clsx"
import type { File, PostWithFiles } from "lib/server/prisma"
import styles from "./dropdown.module.css"
import buttonStyles from "@components/button/button.module.css"
import { ChevronDown, Code, File as FileIcon } from "react-feather"
import { Spinner } from "@components/spinner"

type Item = File & {
	icon: JSX.Element
}

const FileDropdown = ({
	files,
	loading
}: {
	files: Pick<PostWithFiles, "files">["files"]
	loading?: boolean
}) => {
	if (loading) {
		return (
			<Popover>
				<Popover.Trigger className={buttonStyles.button}>
					<div
						style={{ minWidth: 125 }}
					>
						<Spinner />
					</div>
				</Popover.Trigger>
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
		<ul className={styles.content}>
			{items.map((item) => (
				<li key={item.id}>
					<a href={`#${item.title}`} className={styles.listItem}>
						<span className={styles.fileIcon}>{item.icon}</span>
						<span className={styles.fileTitle}>
							{item.title ? item.title : "Untitled"}
						</span>
					</a>
				</li>
			))}
		</ul>
	)

	return (
		<Popover>
			<Popover.Trigger className={buttonStyles.button}>
				<div
					className={clsx(buttonStyles.icon, styles.chevron)}
					style={{ marginRight: 6 }}
				>
					<ChevronDown />
				</div>
				<span>
					Jump to {files.length} {files.length === 1 ? "file" : "files"}
				</span>
			</Popover.Trigger>
			<Popover.Content className={styles.contentWrapper}>
				{content}
			</Popover.Content>
		</Popover>
	)
}

export default FileDropdown
