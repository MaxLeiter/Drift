

import { memo, useRef, useState } from "react"
import styles from './document.module.css'
import Download from '@geist-ui/icons/download'
import ExternalLink from '@geist-ui/icons/externalLink'
import Skeleton from "react-loading-skeleton"

import { Button, ButtonGroup, Card, Input, Spacer, Tabs, Textarea, Tooltip } from "@geist-ui/core"
import Preview from "@components/preview"
import HtmlPreview from "@components/preview/html"

// import Link from "next/link"
type Props = {
    title: string
    html: string
    initialTab?: "edit" | "preview"
    skeleton?: boolean
    id: string
    content: string
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


const Document = ({ content, title, html, initialTab = 'edit', skeleton, id }: Props) => {
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
                        value={title}
                        readOnly
                        marginTop="var(--gap-double)"
                        size={1.2}
                        font={1.2}
                        label="Filename"
                        width={"100%"}
                        id={title}
                    />
                </div>
                <div className={styles.descriptionContainer}>
                    <DownloadButton rawLink={rawLink()} />
                    <Tabs onChange={handleTabChange} initialValue={initialTab} hideDivider leftSpace={0}>
                        <Tabs.Item label={"Raw"} value="edit">
                            {/* <textarea className={styles.lineCounter} wrap='off' readOnly ref={lineNumberRef}>1.</textarea> */}
                            <div style={{ marginTop: 'var(--gap)', display: 'flex', flexDirection: 'column' }}>
                                <Textarea
                                    readOnly
                                    ref={codeEditorRef}
                                    value={content}
                                    width="100%"
                                    // TODO: Textarea should grow to fill parent if height == 100%
                                    style={{ flex: 1, minHeight: 350 }}
                                    resize="vertical"
                                    className={styles.textarea}
                                />
                            </div>
                        </Tabs.Item>
                        <Tabs.Item label="Preview" value="preview">
                            <HtmlPreview height={height} html={html} />
                        </Tabs.Item>
                    </Tabs>

                </div >
            </Card >
            <Spacer height={1} />
        </>
    )
}


export default memo(Document)