import { Button, Page, Text, useToasts } from "@geist-ui/core";

import Document from '@components/document'
import Header from "@components/header";
import VisibilityBadge from "@components/visibility-badge";
import PageSeo from "components/page-seo";
import styles from '../styles.module.css';
import { Post, ThemeProps } from "@lib/types";
import PasswordModal from "@components/new-post/password";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const Post = ({ theme, changeTheme }: ThemeProps) => {
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(true);
    const [post, setPost] = useState<Post>()
    const router = useRouter()
    const { setToast } = useToasts()
    const download = async () => {
        if (!post) return;
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

    useEffect(() => {
        if (router.isReady) {
            const fetchPostWithAuth = async () => {
                const resp = await fetch(`/server-api/posts/${router.query.id}`, {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('drift-token')}`
                    }
                })
                if (!resp.ok) return
                const post = await resp.json()

                if (!post) return
                setPost(post)
            }
            fetchPostWithAuth()
        }
    }, [router.isReady, router.query.id])

    const onSubmit = async (password: string) => {
        const res = await fetch(`/server-api/posts/${router.query.id}?password=${password}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })

        if (!res.ok) {
            setToast({
                type: "error",
                text: "Wrong password"
            })
            return
        }

        const data = await res.json()
        if (data) {
            if (data.error) {
                setToast({
                    text: data.error,
                    type: "error"
                })
            } else {
                setPost(data)
                setIsPasswordModalOpen(false)
            }
        }
    }

    const onClose = () => {
        setIsPasswordModalOpen(false);
    }

    if (!router.isReady) {
        return <></>
    }

    if (!post) {
        return <Page><PasswordModal warning={false} onClose={onClose} onSubmit={onSubmit} isOpen={isPasswordModalOpen} /></Page>
    }

    return (
        <Page width={"100%"}>
            <PageSeo
                title={`${post.title} - Drift`}
                description={post.description}
                isPrivate={true}
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

export default Post

