import { Button, ButtonGroup, Card, Input, Spacer, Tabs, Textarea, Tooltip } from "@geist-ui/core"
import { ChangeEvent, memo, useCallback, useMemo, useRef, useState } from "react"
import styles from './document.module.css'
import MarkdownPreview from '../preview'
import { Trash, Download, ExternalLink } from '@geist-ui/icons'
import FormattingIcons from "./formatting-icons"
import Skeleton from "react-loading-skeleton"
// import Link from "next/link"
type Props = {
    editable?: boolean
    remove?: () => void
    title?: string
    content?: string
    setTitle?: (title: string) => void
    setContent?: (content: string) => void
    initialTab?: "edit" | "preview"
    skeleton?: boolean
    id?: string
}

const DownloadButton = ({ rawLink }: { rawLink?: string }) => {
    return (<div className={styles.actionWrapper}>
        <ButtonGroup className={styles.actions}>
            <Tooltip text="Download">
                <a href={`${rawLink}?download=true`} target="_blank" rel="noopener noreferrer">
                    <Button
                        scale={2 / 3} px={0.6}
                        icon={<Download />}
                        auto
                        aria-label="Download"
                    />
                </a>
            </Tooltip>
            <Tooltip text="Open raw in new tab">
                <a href={rawLink} target="_blank" rel="noopener noreferrer">
                    <Button
                        scale={2 / 3} px={0.6}
                        icon={<ExternalLink />}
                        auto
                        aria-label="Open raw file in new tab"
                    />
                </a>
            </Tooltip>
        </ButtonGroup>
    </div>)
}


const Document = ({ remove, editable, title, content, setTitle, setContent, initialTab = 'edit', skeleton, id }: Props) => {
    const codeEditorRef = useRef<HTMLTextAreaElement>(null)
    const [tab, setTab] = useState(initialTab)
    const height = editable ? "500px" : '100%'

    const handleTabChange = (newTab: string) => {
        if (newTab === 'edit') {
            codeEditorRef.current?.focus()
        }
        setTab(newTab as 'edit' | 'preview')
    }

    const getType = useMemo(() => {
        if (!title) return
        const pathParts = title.split(".")
        const language = pathParts.length > 1 ? pathParts[pathParts.length - 1] : ""
        return language
    }, [title])

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

    const rawLink = useMemo(() => {
        if (id) {
            return `/file/raw/${id}`
        }
    }, [id])

    if (skeleton) {
        return <>
            <Spacer height={1} />
            <Card marginBottom={'var(--gap)'} marginTop={'var(--gap)'} style={{ maxWidth: 980, margin: "0 auto" }}>
                <div className={styles.fileNameContainer}>
                    <Skeleton width={275} height={36} />
                    {editable && <Skeleton width={36} height={36} />}
                </div>
                <div className={styles.descriptionContainer}>
                    <div style={{ flexDirection: 'row', display: 'flex' }}><Skeleton width={125} height={36} /></div>
                    <Skeleton width={'100%'} height={350} />
                </div >
            </Card>
        </>
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
                    {rawLink && <DownloadButton rawLink={rawLink} />}
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
                            <MarkdownPreview height={height} content={content} type={getType} />
                        </Tabs.Item>
                    </Tabs>

                </div >
            </Card >
            <Spacer height={1} />
        </>
    )
}


export default memo(Document)