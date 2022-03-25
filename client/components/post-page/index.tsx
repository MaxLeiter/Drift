import Header from "@components/header/header"
import PageSeo from "@components/page-seo"
import VisibilityBadge from "@components/visibility-badge"
import DocumentComponent from '@components/view-document'
import styles from './post-page.module.css'
import homeStyles from '@styles/Home.module.css'

import type { File, Post } from "@lib/types"
import { Page, Button, Text, Badge, Tooltip, Spacer } from "@geist-ui/core"
import ShiftBy from "@components/shift-by"
import { useMemo, useState } from "react"
import timeAgo from "@lib/time-ago"

type Props = {
    post: Post
}

const PostPage = ({ post }: Props) => {
    const download = async () => {
        const downloadZip = (await import("client-zip")).downloadZip
        const blob = await downloadZip(post.files.map((file: any) => {
            return {
                name: file.title,
                input: file.content,
                lastModified: new Date(file.updatedAt)
            }
        })).blob()
        const link = document.createElement("a")
        link.href = URL.createObjectURL(blob)
        link.download = `${post.title}.zip`
        link.click()
        link.remove()
    }
    const createdDate = useMemo(() => new Date(post.createdAt), [post.createdAt])
    const [time, setTimeAgo] = useState(timeAgo(createdDate))

    const formattedTime = `${createdDate.toLocaleDateString()} ${createdDate.toLocaleTimeString()}`

    return (
        <Page width={"100%"}>
            <PageSeo
                title={`${post.title} - Drift`}
                description={post.description}
                isPrivate={false}
            />

            <Page.Header>
                <Header />
            </Page.Header>
            <Page.Content className={homeStyles.main}>
                {/* {!isLoading && <PostFileExplorer files={post.files} />} */}
                <div className={styles.header}>
                    <div className={styles.titleAndBadge}>
                        <Text h2>{post.title}</Text>
                        <span>
                            <VisibilityBadge visibility={post.visibility} />
                            <Badge type="secondary"><Tooltip text={formattedTime}>{time}</Tooltip></Badge>
                        </span>
                    </div>
                    <Button auto onClick={download}>
                        Download as ZIP archive
                    </Button>
                </div>
                {post.files.map(({ id, content, title }: File) => (
                    <DocumentComponent
                        key={id}
                        title={title}
                        initialTab={'preview'}
                        id={id}
                        content={content}
                    />
                ))}
            </Page.Content>
        </Page >
    )
}

export default PostPage