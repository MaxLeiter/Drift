import { Page, Text } from "@geist-ui/core";
import Skeleton from 'react-loading-skeleton';

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Document from '../../components/document'
import Header from "../../components/header";
import VisibilityBadge from "../../components/visibility-badge";
import { ThemeProps } from "../_app";
import Head from "next/head";

const Post = ({ theme, changeTheme }: ThemeProps) => {
    const [post, setPost] = useState<any>()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string>()
    const router = useRouter();

    useEffect(() => {
        async function fetchPost() {
            setIsLoading(true);
            if (router.query.id) {
                const post = await fetch(`/api/posts/${router.query.id}`, {
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

    return (
        <Page width={"100%"}>
            <Head>
                {isLoading && <title>loading - Drift</title>}
                {!isLoading && <title>{post.title} - Drift</title>}
                {!isLoading && post.visibility !== 'private' && <meta name="description" content={post.description} />}
            </Head>
            <Page.Header>
                <Header theme={theme} changeTheme={changeTheme} />
            </Page.Header>
            <Page.Content width={"var(--main-content-width)"} margin="auto">
                {error && <Text type="error">{error}</Text>}
                {/* {!error && (isLoading || !post?.files) && <Loading />} */}
                {!error && isLoading && <><Text h2><Skeleton width={400} /></Text>
                    <Document skeleton={true} />
                </>}
                {!isLoading && post && <><Text h2>{post.title} <VisibilityBadge visibility={post.visibility} /></Text>
                    {post.files.map(({ id, content, title }: { id: any, content: string, title: string }) => (
                        <Document
                            key={id}
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

