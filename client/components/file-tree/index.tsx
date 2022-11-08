import { File } from "@lib/types"
import FileIcon from "@geist-ui/icons/fileText"
import CodeIcon from "@geist-ui/icons/fileLambda"
import styles from "./file-tree.module.css"
import ShiftBy from "@components/shift-by"
import { useEffect, useState } from "react"
import { codeFileExtensions } from "@lib/constants"
import Link from "@components/link"

type Item = File & {
	icon: JSX.Element
}

const Card = ({
	children,
	className,
	...props
}: {
	children: React.ReactNode
	className?: string
} & React.ComponentProps<"div">) => (
	<div className={styles.card} {...props}>
		{children}
	</div>
)

const FileTree = ({ files }: { files: File[] }) => {
	const [items, setItems] = useState<Item[]>([])
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

	// a list of files with an icon and a title
	return (
		<div className={styles.fileTreeWrapper}>
			<Card className={styles.card}>
				<div className={styles.cardContent}>
					<h4>Files</h4>
					<ul className={styles.fileTree}>
						{items.map(({ id, title, icon }) => (
							<li key={id}>
								<Link href={`#${title}`}>
									<ShiftBy y={5}>
										<span className={styles.fileTreeIcon}>{icon}</span>
									</ShiftBy>
									<span className={styles.fileTreeTitle}>{title}</span>
								</Link>
							</li>
						))}
					</ul>
				</div>
			</Card>
		</div>
	)
}

export default FileTree
