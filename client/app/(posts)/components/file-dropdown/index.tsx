import ShiftBy from "app/components/shift-by"
import { Button, Popover } from "@geist-ui/core/dist"
import ChevronDown from "@geist-ui/icons/chevronDown"
import CodeIcon from "@geist-ui/icons/fileFunction"
import FileIcon from "@geist-ui/icons/fileText"
import { codeFileExtensions } from "@lib/constants"
import type { File } from "@lib/types"
import { useCallback, useEffect, useState } from "react"
import styles from "./dropdown.module.css"

type Item = File & {
	icon: JSX.Element
}

const FileDropdown = ({
	files,
	isMobile
}: {
	files: File[]
	isMobile: boolean
}) => {
	const [expanded, setExpanded] = useState(false)
	const [items, setItems] = useState<Item[]>([])
	const changeHandler = (next: boolean) => {
		setExpanded(next)
	}

	const onOpen = () => setExpanded(true)
	const onClose = useCallback(() => setExpanded(false), [setExpanded])

	useEffect(() => {
		const newItems = files.map((file) => {
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
		setItems(newItems)
	}, [files])

	const content = (
		<ul className={styles.content}>
			{items.map((item) => (
				<li key={item.id} onClick={onClose}>
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

	// a list of files with an icon and a title
	return (
		<>
			<Button
				auto
				onClick={onOpen}
				className={styles.button}
				iconRight={<ChevronDown />}
				style={{ textTransform: "none" }}
			>
				Jump to {files.length} {files.length === 1 ? "file" : "files"}
			</Button>
			<Popover
				style={{
					transform: isMobile ? "translateX(110px)" : "translateX(-75px)"
				}}
				onVisibleChange={changeHandler}
				content={content}
				visible={expanded}
				hideArrow={true}
				onClick={onClose}
			/>
		</>
	)
}

export default FileDropdown
