import { Button, Link, Text, Popover } from '@geist-ui/core'
import FileIcon from '@geist-ui/icons/fileText'
import CodeIcon from '@geist-ui/icons/fileFunction'
import styles from './dropdown.module.css'
import { useCallback, useEffect, useRef, useState } from "react"
import { codeFileExtensions } from "@lib/constants"
import ChevronDown from '@geist-ui/icons/chevronDown'
import ShiftBy from "@components/shift-by"
import type { File } from '@lib/types'
import FileTree from '@geist-ui/icons/list'

type Item = File & {
    icon: JSX.Element
}

const FileDropdown = ({
    files
}: {
    files: File[]
}) => {
    const [expanded, setExpanded] = useState(false)
    const [items, setItems] = useState<Item[]>([])

    const onOpen = useCallback(() => {
        setExpanded(true)
    }, [])

    const onClose = useCallback(() => {
        setExpanded(false)
        // contentRef.current?.focus()
    }, [])

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

    const content = useCallback(() => (<ul className={styles.content}>
        {items.map(item => (
            <li key={item.id} onClick={onClose}>
                <a href={`#${item.title}`}>
                    <ShiftBy y={5}><span className={styles.fileIcon}>
                        {item.icon}</span></ShiftBy>
                    <span className={styles.fileTitle}>{item.title ? item.title : 'Untitled'}</span>
                </a>
            </li>
        ))}
    </ul>
    ), [items, onClose])

    // a list of files with an icon and a title
    return (
        <Button auto onClick={onOpen} className={styles.button} iconRight={<ChevronDown />}>
            <Popover tabIndex={0} content={content} visible={expanded} trigger="click" hideArrow={true}>
                Jump to {files.length} {files.length === 1 ? 'file' : 'files'}
            </Popover>
        </Button >
    )
}

export default FileDropdown