import { Button, Card, Input, Tabs, Textarea } from "@geist-ui/core"
import { ChangeEvent, FormEvent, memo, useEffect, useRef, useState } from "react"
import styles from './document.module.css'
import MarkdownPreview from '../preview'
import { Trash } from '@geist-ui/icons'
type Props = {
    editable: boolean
    remove?: () => void
    title?: string
    content?: string
    setTitle?: (title: string) => void
    setContent?: (content: string) => void
    initialTab?: "edit" | "preview"
}

const Document = ({ remove, editable, title, content, setTitle, setContent, initialTab = 'edit' }: Props) => {
    const codeEditorRef = useRef<HTMLTextAreaElement>(null)

    const removeFile = (remove?: () => void) => {
        if (remove) {
            if (content && content.trim().length > 0) {
                const confirmed = window.confirm("Are you sure you want to remove this file?")
                if (confirmed) {
                    remove()
                }
            } else {
                remove()
            }
        }
    }

    return (
        <Card marginBottom={'var(--gap)'} marginTop={'var(--gap)'} style={{ maxWidth: 980, margin: "0 auto" }}>
            <div className={styles.fileNameContainer}>
                <Input
                    placeholder="MyFile.md"
                    value={title}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setTitle ? setTitle(event.target.value) : null}
                    marginTop="var(--gap-double)"
                    size={1.2}
                    font={1.2}
                    label="Filename"
                    disabled={!editable}
                    width={"100%"}
                />
                {remove && editable && <Button type="error" ghost icon={<Trash />} auto height={'36px'} width={'36px'} onClick={() => removeFile(remove)} />}
            </div>
            <div className={styles.descriptionContainer}>
                <Tabs initialValue={initialTab} hideDivider width={"100%"} >
                    <Tabs.Item label={editable ? "Edit" : "Raw"} value="edit">
                        {/* <textarea className={styles.lineCounter} wrap='off' readOnly ref={lineNumberRef}>1.</textarea> */}
                        <Textarea
                            ref={codeEditorRef}
                            placeholder="Type a description..."
                            value={content}
                            onChange={(event) => setContent ? setContent(event.target.value) : null}
                            width="100%"
                            height="500px"
                            disabled={!editable}
                            resize="vertical"
                            className={styles.textarea}
                        />
                    </Tabs.Item>
                    <Tabs.Item label="Preview" value="preview">
                        <MarkdownPreview height={500} content={content} />
                    </Tabs.Item>
                </Tabs>
            </div>
        </Card>
    )
}


export default memo(Document)