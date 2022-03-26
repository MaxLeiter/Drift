import { Button, Code, Dot, Input, Note, Text } from "@geist-ui/core"
import NextLink from "next/link"
import Link from '../Link'

import styles from './post-list.module.css'
import ListItemSkeleton from "./list-item-skeleton"
import ListItem from "./list-item"
import { Post } from "@lib/types"
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react"
import debounce from "lodash.debounce"
import Cookies from "js-cookie"

type Props = {
    initialPosts: Post[]
    error: boolean
    morePosts: boolean
}

const PostList = ({ morePosts, initialPosts, error }: Props) => {
    const [search, setSearchValue] = useState('')
    const [posts, setPosts] = useState<Post[]>(initialPosts)
    const [searching, setSearching] = useState(false)
    const [hasMorePosts, setHasMorePosts] = useState(morePosts)

    const loadMoreClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (hasMorePosts) {
            async function fetchPosts() {
                const res = await fetch(`/server-api/posts/mine`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${Cookies.get('drift-token')}`,
                            "x-page": `${posts.length / 10 + 1}`,
                        }
                    }
                )
                const json = await res.json()
                setPosts([...posts, ...json.posts])
                setHasMorePosts(json.morePosts)
            }
            fetchPosts()
        }
    }, [posts, hasMorePosts])

    // update posts on search
    useEffect(() => {
        if (search) {
            // fetch results from /server-api/posts/search
            const fetchResults = async () => {
                setSearching(true)
                //encode search
                const res = await fetch(`/server-api/posts/search?q=${encodeURIComponent(search)}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${Cookies.get("drift-token")}`,
                        // "tok": process.env.SECRET_KEY || ''
                    }
                })
                const data = await res.json()
                setPosts(data)
                setSearching(false)
            }
            fetchResults()
        } else {
            setPosts(initialPosts)
        }
    }, [initialPosts, search])

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value)
    }

    const debouncedSearchHandler = useMemo(
        () => debounce(handleSearchChange, 300)
        , []);

    useEffect(() => {
        return () => {
            debouncedSearchHandler.cancel();
        }
    }, [debouncedSearchHandler]);

    const deletePost = useCallback((postId: string) => async () => {
        const res = await fetch(`/server-api/posts/${postId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Cookies.get("drift-token")}`
            },
        })

        if (!res.ok) {
            console.error(res)
            return
        } else {
            setPosts((posts) => posts.filter(post => post.id !== postId))
        }
    }, [])

    return (
        <div className={styles.container}>
            <div className={styles.searchContainer}>
                <Input scale={3 / 2}
                    clearable
                    placeholder="Search..."
                    onChange={debouncedSearchHandler} />
            </div>
            {error && <Text type='error'>Failed to load.</Text>}
            {!posts.length && searching && <ul>
                <li>
                    <ListItemSkeleton />
                </li>
                <li>
                    <ListItemSkeleton />
                </li>
            </ul>}
            {posts?.length === 0 && !error && <Text type='secondary'>No posts found.Create one <NextLink passHref={true} href="/new"><Link color>here</Link></NextLink>.</Text>}
            {
                posts?.length > 0 && <div>
                    <ul>
                        {posts.map((post) => {
                            return <ListItem deletePost={deletePost(post.id)} post={post} key={post.id} />
                        })}
                    </ul>
                </div>
            }
            {hasMorePosts && !setSearchValue && <div className={styles.moreContainer}>
                <Button width={"100%"} onClick={loadMoreClick}>
                    Load more
                </Button>
            </div>}
        </div>
    )
}

export default PostList
