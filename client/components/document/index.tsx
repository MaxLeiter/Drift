

import { ChangeEvent, memo, useCallback, useMemo, useRef, useState } from "react"
import styles from './document.module.css'
import Trash from '@geist-ui/icons/trash'
import Download from '@geist-ui/icons/download'
import ExternalLink from '@geist-ui/icons/externalLink'
import FormattingIcons from "./formatting-icons"
import Skeleton from "react-loading-skeleton"

import { Button, ButtonGroup, Card, Input, Spacer, Tabs, Textarea, Tooltip } from "@geist-ui/core"
import Preview from "@components/preview"

// import Link from "next/link"
type Props = {
    editable?: boolean
    remove?: () => void
    title?: string
    content?: string
    setTitle?: (title: string) => void
    setContent?: (content: string) => void
    handleOnContentChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void
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


const Document = ({ remove, editable, title, content, setTitle, setContent, initialTab = 'edit', skeleton, id, handleOnContentChange }: Props) => {
    const codeEditorRef = useRef<HTMLTextAreaElement>(null)
    const [tab, setTab] = useState(initialTab)
    // const height = editable ? "500px" : '100%'
    const height = "100%";

    const handleTabChange = (newTab: string) => {
        if (newTab === 'edit') {
            codeEditorRef.current?.focus()
        }
        setTab(newTab as 'edit' | 'preview')
    }

    const onTitleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => setTitle ? setTitle(event.target.value) : null, [setTitle])

    const removeFile = useCallback(() => (remove?: () => void) => {
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
    }, [content])

    const rawLink = () => {
        if (id) {
            return `/file/raw/${id}`
        }
    }

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
                        onChange={onTitleChange}
                        marginTop="var(--gap-double)"
                        size={1.2}
                        font={1.2}
                        label="Filename"
                        disabled={!editable}
                        width={"100%"}
                        id={title}
                    />
                    {remove && editable && <Button type="abort" ghost icon={<Trash />} auto height={'36px'} width={'36px'} onClick={removeFile} />}
                </div>
                <div className={styles.descriptionContainer}>
                    {tab === 'edit' && editable && <FormattingIcons setText={setContent} textareaRef={codeEditorRef} />}
                    {rawLink && id && <DownloadButton rawLink={rawLink()} />}
                    <Tabs onChange={handleTabChange} initialValue={initialTab} hideDivider leftSpace={0}>
                        <Tabs.Item label={editable ? "Edit" : "Raw"} value="edit">
                            {/* <textarea className={styles.lineCounter} wrap='off' readOnly ref={lineNumberRef}>1.</textarea> */}
                            <div style={{ marginTop: 'var(--gap)', display: 'flex', flexDirection: 'column' }}>
                                <Textarea
                                    ref={codeEditorRef}
                                    placeholder=""
                                    value={content}
                                    onChange={handleOnContentChange}
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
                            <Preview height={height} fileId={id} title={title} content={content} />
                        </Tabs.Item>
                    </Tabs>

                </div >
            </Card >
            <Spacer height={1} />
        </>
    )
}


export default memo(Document)