import { Button, Page, Text } from "@geist-ui/core";

import { useRouter } from "next/router";
import Document from '../../components/document'
import Header from "../../components/header";
import VisibilityBadge from "../../components/visibility-badge";
import PageSeo from "components/page-seo";
import styles from './styles.module.css';
import cookie from "cookie";
import { GetServerSideProps } from "next";
import { PostVisibility, ThemeProps } from "@lib/types";

type File = {
    id: string
    title: string
    content: string
}

type Files = File[]

export type PostProps = ThemeProps & {
    post: {
        id: string
        title: string
        description: string
        visibility: PostVisibility
        files: Files
    }
}

const Post = ({ post, theme, changeTheme }: PostProps) => {
    const router = useRouter();

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
                isPrivate={post.visibility !== 'public'}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
    const headers = context.req.headers
    const host = headers.host
    const driftToken = cookie.parse(headers.cookie || '')[`drift-token`]
    let driftTheme = cookie.parse(headers.cookie || '')[`drift-theme`]
    if (driftTheme !== "light" && driftTheme !== "dark") {
        driftTheme = "light"
    }


    if (context.query.id) {
        const post = await fetch('http://' + host + `/server-api/posts/${context.query.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${driftToken}`
            }
        })

        if (!post.ok || post.status !== 200) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            }
        }
        try {
            const json = await post.json();
            const maxAge = 60 * 60 * 24 * 365;
            context.res.setHeader(
                'Cache-Control',
                `${json.visibility === "public" ? "public" : "private"}, s-maxage=${maxAge}, max-age=${maxAge}`
            )
            return {
                props: {
                    post: json
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    return {
        props: {
            post: null
        }
    }
}

export default Post
