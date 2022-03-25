import { File } from "@lib/types"
import { Card, Link, Text } from '@geist-ui/core'
import FileIcon from '@geist-ui/icons/fileText'
import CodeIcon from '@geist-ui/icons/fileLambda'
import styles from './file-tree.module.css'
import ShiftBy from "@components/shift-by"
import { useEffect, useState } from "react"
import { codeFileExtensions } from "@lib/constants"

type Item = File & {
    icon: JSX.Element
}

const FileTree = ({
    files
}: {
    files: File[]
}) => {
    const [items, setItems] = useState<Item[]>([])
    useEffect(() => {
        const newItems = files.map(file => {
            const extension = file.title.split('.').pop()
            if (codeFileExtensions.includes(extension || '')) {
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
            <Card height={'100%'} className={styles.card}>
                <div className={styles.cardContent}>
                    <Text h4>Files</Text>
                    <ul className={styles.fileTree}>
                        {items.map(({ id, title, icon }) => (
                            <li key={id}>
                                <Link color={false} href={`#${title}`}>
                                    <ShiftBy y={5}><span className={styles.fileTreeIcon}>
                                        {icon}</span></ShiftBy>
                                    <span className={styles.fileTreeTitle}>{title}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </Card>
        </div >
    )
}

export default FileTree