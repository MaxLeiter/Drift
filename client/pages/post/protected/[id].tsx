import { Page, useToasts } from '@geist-ui/core';

import type { Post } from "@lib/types";
import PasswordModal from "@components/new-post/password";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import PostPage from "@components/post-page";

const Post = () => {
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(true);
    const [post, setPost] = useState<Post>()
    const router = useRouter()
    const { setToast } = useToasts()

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
        return <Page><PasswordModal creating={false} onClose={onClose} onSubmit={onSubmit} isOpen={isPasswordModalOpen} /></Page>
    }

    return (<PostPage post={post} />)
}

export default Post

