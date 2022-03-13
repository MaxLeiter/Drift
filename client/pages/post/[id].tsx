import { Button, Page, Text } from "@geist-ui/core";
import Skeleton from 'react-loading-skeleton';

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Document from '../../components/document'
import Header from "../../components/header";
import VisibilityBadge from "../../components/visibility-badge";
import { ThemeProps } from "../_app";
import PageSeo from "components/page-seo";

const Post = ({ theme, changeTheme }: ThemeProps) => {
    const [post, setPost] = useState<any>()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string>()
    const router = useRouter();

    useEffect(() => {
        async function fetchPost() {
            setIsLoading(true);
            if (router.query.id) {
                const post = await fetch(`/server-api/posts/${router.query.id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("drift-token")}`
                    }
                })

                if (post.ok) {
                    const res = await post.json()
                    if (res)
                        setPost(res)
                    else
                        setError("Post not found")
                } else {
                    if (post.status.toString().startsWith("4")) {
                        router.push("/signin")
                    } else {
                        setError(post.statusText)
                    }
                }
                setIsLoading(false)
            }
        }
        fetchPost()
    }, [router, router.query.id])

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
            {!isLoading && (
                <PageSeo
                    title={`${post.title} - Drift`}
                    description={post.description}
                    isPrivate={post.visibility === 'private'}
                />
            )}

            <Page.Header>
                <Header theme={theme} changeTheme={changeTheme} />
            </Page.Header>
            <Page.Content width={"var(--main-content-width)"} margin="auto">
                {error && <Text type="error">{error}</Text>}
                {/* {!error && (isLoading || !post?.files) && <Loading />} */}
                {!error && isLoading && <><Text h2><Skeleton width={400} /></Text>
                    <Document skeleton={true} />
                </>}
                {!isLoading && post && <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text h2>{post.title} <VisibilityBadge visibility={post.visibility} /></Text>
                        <Button auto onClick={download}>
                            Download as Zip
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
                </>}
            </Page.Content>
        </Page >
    )
}

export default Post

