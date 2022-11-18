import Button from "@components/button"
import { Popover } from "@components/popover"
import ShiftBy from "@components/shift-by"
import ChevronDown from "@geist-ui/icons/chevronDown"
import CodeIcon from "@geist-ui/icons/fileFunction"
import FileIcon from "@geist-ui/icons/fileText"
import { codeFileExtensions } from "@lib/constants"
import clsx from "clsx"
import type { File } from "lib/server/prisma"
import styles from "./dropdown.module.css"
import buttonStyles from "@components/button/button.module.css"

type Item = File & {
	icon: JSX.Element
}

const FileDropdown = ({ files }: { files: File[] }) => {
	const items = files.map((file) => {
		const extension = file.title.split(".").pop()
		if (codeFileExtensions.includes(extension || "")) {
			return {
				...file,
				icon: <CodeIcon />
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
					<a href={`#${item.title}`}>
						<ShiftBy y={5}>
							<span className={styles.fileIcon}>{item.icon}</span>
						</ShiftBy>
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
			<Popover.Content>{content}</Popover.Content>
		</Popover>
	)
}

export default FileDropdown
