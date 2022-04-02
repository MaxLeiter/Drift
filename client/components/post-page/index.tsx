import PageSeo from "@components/page-seo"
import VisibilityBadge from "@components/badges/visibility-badge"
import DocumentComponent from '@components/view-document'
import styles from './post-page.module.css'
import homeStyles from '@styles/Home.module.css'

import type { File, Post } from "@lib/types"
import { Page, Button, Text, ButtonGroup, useMediaQuery } from "@geist-ui/core"
import { useEffect, useState } from "react"
import Archive from '@geist-ui/icons/archive'
import Edit from '@geist-ui/icons/edit'
import Parent from '@geist-ui/icons/arrowUpCircle'
import FileDropdown from "@components/file-dropdown"
import ScrollToTop from "@components/scroll-to-top"
import { useRouter } from "next/router"
import ExpirationBadge from "@components/badges/expiration-badge"
import CreatedAgoBadge from "@components/badges/created-ago-badge"
import Cookies from "js-cookie"
import getPostPath from "@lib/get-post-path"

type Props = {
    post: Post
}

const PostPage = ({ post }: Props) => {
    const router = useRouter()

    const isMobile = useMediaQuery("mobile")
    const [isExpired, setIsExpired] = useState(post.expiresAt ? new Date(post.expiresAt) < new Date() : null)
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        if (isExpired) {
            router.push("/expired")
        }
        const isOwner = post.users ? post.users[0].id === Cookies.get("drift-userid") : false

        const expirationDate = new Date(post.expiresAt ? post.expiresAt : "")
        if (!isOwner && expirationDate < new Date()) {
            router.push("/expired")
        } else {
            setIsLoading(false)
        }

        let interval: NodeJS.Timer | null = null;
        if (post.expiresAt) {
            interval = setInterval(() => {
                const expirationDate = new Date(post.expiresAt ? post.expiresAt : "")
                setIsExpired(expirationDate < new Date())
            }, 4000)
        }
        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isExpired, post.expiresAt, post.users, router])


    const download = async () => {
        if (!post.files) return
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

    const editACopy = () => {
        router.push(`/new/from/${post.id}`)
    }

    if (isLoading) {
        return <></>
    }

    return (
        <Page width={"100%"}>
            <PageSeo
                title={`${post.title} - Drift`}
                description={post.description}
                isPrivate={false}
            />

            <Page.Content className={homeStyles.main}>
                <div className={styles.header}>
                    <span className={styles.title}>
                        <Text h3>{post.title}</Text>
                        <span className={styles.badges}>
                            <VisibilityBadge visibility={post.visibility} />
                            <CreatedAgoBadge createdAt={post.createdAt} />
                            <ExpirationBadge postExpirationDate={post.expiresAt} />
                        </span>
                    </span>

                    <span className={styles.buttons}>
                        <ButtonGroup vertical={isMobile}>
                            <Button auto onClick={download} icon={<Archive />} style={{ textTransform: 'none' }}>
                                Download as ZIP Archive
                            </Button>
                            <Button
                                auto
                                icon={<Edit />}
                                onClick={editACopy}
                                style={{ textTransform: 'none' }}>
                                Edit a Copy
                            </Button>
                            {post.parent && <Button
                                auto
                                icon={<Parent />}
                                onClick={() => router.push(getPostPath(post.parent!.visibility, post.parent!.id))}
                            >
                                View Parent
                            </Button>}
                            <FileDropdown isMobile={isMobile} files={post.files || []} />
                        </ButtonGroup>
                    </span>
                </div>
                {/* {post.files.length > 1 && <FileTree files={post.files} />} */}
                {post.files?.map(({ id, content, title }: File) => (
                    <DocumentComponent
                        key={id}
                        title={title}
                        initialTab={'preview'}
                        id={id}
                        content={content}
                    />
                ))}
                <ScrollToTop />

            </Page.Content>
        </Page >
    )
}

export default PostPage