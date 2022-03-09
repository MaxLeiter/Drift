import { Button, ButtonGroup, Card, Input, Spacer, Tabs, Textarea } from "@geist-ui/core"
import { ChangeEvent, FormEvent, memo, useEffect, useReducer, useRef, useState } from "react"
import styles from './document.module.css'
import MarkdownPreview from '../preview'
import { Trash } from '@geist-ui/icons'
import FormattingIcons from "../formatting-icons"
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
    const [tab, setTab] = useState(initialTab)
    const height = editable ? "500px" : '100%'

    const handleTabChange = (newTab: string) => {
        if (newTab === 'edit') {
            codeEditorRef.current?.focus()
        }
        setTab(newTab as 'edit' | 'preview')
    }

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
        <>
            <Spacer height={1} />
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
                    {remove && editable && <Button type="abort" ghost icon={<Trash />} auto height={'36px'} width={'36px'} onClick={() => removeFile(remove)} />}
                </div>
                <div className={styles.descriptionContainer}>
                    {tab === 'edit' && editable && <FormattingIcons setText={setContent} textareaRef={codeEditorRef} />}
                    <Tabs onChange={handleTabChange} initialValue={initialTab} hideDivider leftSpace={0}>
                        <Tabs.Item label={editable ? "Edit" : "Raw"} value="edit">
                            {/* <textarea className={styles.lineCounter} wrap='off' readOnly ref={lineNumberRef}>1.</textarea> */}
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Textarea
                                    ref={codeEditorRef}
                                    placeholder="Type some contents..."
                                    value={content}
                                    onChange={(event) => setContent ? setContent(event.target.value) : null}
                                    width="100%"
                                    disabled={!editable}
                                    // TODO: Textarea should grow to fill parent if height == 100%
                                    style={{ flex: 1, minHeight: 350 }}
                                    resize="vertical"
                                    className={styles.textarea}
                                />
                            </div>
                        </Tabs.Item>
                        <Tabs.Item label="Preview" value="preview">
                            <MarkdownPreview height={height} content={content} />
                        </Tabs.Item>
                    </Tabs>

                </div >
            </Card >
            <Spacer height={1} />
        </>
    )
}


export default memo(Document)