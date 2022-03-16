import { Button, Page, Text } from "@geist-ui/core";
import Skeleton from 'react-loading-skeleton';

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Document from '../../components/document'
import Header from "../../components/header";
import VisibilityBadge from "../../components/visibility-badge";
import { PostProps } from "../_app";
import PageSeo from "components/page-seo";
import Head from "next/head";
import styles from './styles.module.css';
import Cookies from "js-cookie";
import cookie from "cookie";
import { GetServerSideProps } from "next";


const Post = ({renderedPost, theme, changeTheme}: PostProps) => {
    const [post, setPost] = useState<any>()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string>()
    const router = useRouter();

    useEffect(() => {
        async function fetchPost() {
            setIsLoading(true);

            if (renderedPost.ok) {
                setPost(renderedPost)
                setIsLoading(false)
                
                return;
            }

            if (renderedPost.status.toString().startsWith("4")) {
                router.push("/signin")
            } else {
                setError(renderedPost.statusText)
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
                    <div className={styles.header}>
                        <Text h2>{post.title} <VisibilityBadge visibility={post.visibility} /></Text>
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
                </>}
            </Page.Content>
        </Page >
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {

    const headers = context.req.headers;
    const host = headers.host;
    const driftToken = cookie.parse(headers.cookie || '')[`drift-token`];
    
    let post;
    
    if (context.query.id) {
        post = await fetch('http://' + host + `/server-api/posts/${context.query.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${driftToken}`
            }
        }).then(res => res.json());

        console.log(post);
    }

    return {
        props: {
            renderedPost: post
        }
    }
}

export default Post
