import Header from "@components/header"
import PageSeo from "@components/page-seo"
import VisibilityBadge from "@components/visibility-badge"
import Page from "@geist-ui/core/dist/page"
import Button from "@geist-ui/core/dist/button"
import Text from "@geist-ui/core/dist/text"
import DocumentComponent from '@components/document'
import clientZip from 'client-zip'
import styles from './post-page.module.css'

import type { Post, ThemeProps } from "@lib/types"

type Props = ThemeProps & {
    post: Post
}

const PostPage = ({ post, changeTheme, theme }: Props) => {
    const download = async () => {

        const blob = await clientZip.downloadZip(post.files.map((file: any) => {
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

    return (
        <Page width={"100%"}>
            <PageSeo
                title={`${post.title} - Drift`}
                description={post.description}
                isPrivate={false}
            />

            <Page.Header>
                <Header theme={theme} changeTheme={changeTheme} />
            </Page.Header>
            <Page.Content width={"var(--main-content-width)"} margin="auto">
                {/* {!isLoading && <PostFileExplorer files={post.files} />} */}
                <div className={styles.header}>
                    <div className={styles.titleAndBadge}>
                        <Text h2>{post.title}</Text>
                        <span><VisibilityBadge visibility={post.visibility} /></span>
                    </div>
                    <Button auto onClick={download}>
                        Download as ZIP archive
                    </Button>
                </div>
                {post.files.map(({ id, content, title }: { id: any, content: string, title: string }) => (
                    <DocumentComponent
                        key={id}
                        id={id}
                        content={content}
                        title={title}
                        editable={false}
                        initialTab={'preview'}
                    />
                ))}
            </Page.Content>
        </Page >
    )
}

export default PostPage