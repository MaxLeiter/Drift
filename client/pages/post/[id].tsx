import { Button, Page, Text } from "@geist-ui/core";

import Document from '@components/document'
import Header from "@components/header";
import VisibilityBadge from "@components/visibility-badge";
import PageSeo from "components/page-seo";
import styles from './styles.module.css';
import type { GetStaticPaths, GetStaticProps } from "next";
import { Post, ThemeProps } from "@lib/types";

export type PostProps = ThemeProps & {
    post: Post
}

const Post = ({ post, theme, changeTheme }: PostProps) => {
    const download = async () => {
        const clientZip = require("client-zip")

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
                    <Document
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

export const getStaticPaths: GetStaticPaths = async () => {
    const posts = await fetch(process.env.API_URL + `/posts/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-secret-key": process.env.SECRET_KEY || "",
        }
    })

    const json = await posts.json()
    const filtered = json.filter((post: any) => post.visibility === "public" || post.visibility === "unlisted")
    const paths = filtered.map((post: any) => ({
        params: { id: post.id }
    }))

    return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const post = await fetch(process.env.API_URL + `/posts/${params?.id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-secret-key": process.env.SECRET_KEY || "",
        }
    })

    return {
        props: {
            post: await post.json()
        },
    }
}

export default Post

