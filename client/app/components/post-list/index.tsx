"use client"

import styles from "./post-list.module.css"
import { ListItemSkeleton } from "./list-item-skeleton"
import ListItem from "./list-item"
import { ChangeEvent, useCallback, useEffect, useState } from "react"
import useDebounce from "@lib/hooks/use-debounce"
import Link from "@components/link"
import type { PostWithFiles } from "@lib/server/prisma"
import Input from "@components/input"
import Button from "@components/button"
import { useToasts } from "@components/toasts"

type Props = {
	initialPosts: string | PostWithFiles[]
	morePosts: boolean
	userId?: string
}

const PostList = ({
	morePosts,
	initialPosts: initialPostsMaybeJSON,
	userId
}: Props) => {
	const initialPosts =
		typeof initialPostsMaybeJSON === "string"
			? JSON.parse(initialPostsMaybeJSON)
			: initialPostsMaybeJSON
	const [search, setSearchValue] = useState("")
	const [posts, setPosts] = useState<PostWithFiles[]>(initialPosts)
	const [searching, setSearching] = useState(false)
	const [hasMorePosts, setHasMorePosts] = useState(morePosts)
	const { setToast } = useToasts()

	const debouncedSearchValue = useDebounce(search, 200)

	const loadMoreClick = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			e.preventDefault()
			if (hasMorePosts) {
				async function fetchPosts() {
					const res = await fetch(`/server-api/posts/mine`, {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							"x-page": `${posts.length / 10 + 1}`
						}
					})
					const json = await res.json()
					setPosts([...posts, ...json.posts])
					setHasMorePosts(json.morePosts)
				}
				fetchPosts()
			}
		},
		[posts, hasMorePosts]
	)

	// update posts on search
	useEffect(() => {
		if (debouncedSearchValue) {
			setSearching(true)
			async function fetchPosts() {
				const res = await fetch(
					`/api/post/search?q=${encodeURIComponent(
						debouncedSearchValue
					)}&userId=${userId}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json"
						}
					}
				)
				const json = await res.json()
				setPosts(json)
				setSearching(false)
			}
			fetchPosts()
		} else {
			setPosts(initialPosts)
		}
		// TODO: fix cyclical dependency issue
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearchValue, userId])

	const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value)
	}

	const deletePost = useCallback(
		(postId: string) => async () => {
			const res = await fetch(`/api/post/${postId}`, {
				method: "DELETE"
			})

			if (!res.ok) {
				console.error(res)
				return
			} else {
				setPosts((posts) => posts.filter((post) => post.id !== postId))
				setToast({
					message: "Post deleted",
					type: "success"
				})
			}
		},
		[setToast]
	)

	return (
		<div className={styles.container}>
			<div className={styles.searchContainer}>
				<Input
					placeholder="Search..."
					onChange={handleSearchChange}
					disabled={!posts}
					style={{ maxWidth: 300 }}
					aria-label="Search"
				/>
			</div>
			{!posts && <p style={{ color: "var(--warning)" }}>Failed to load.</p>}
			{/* {!posts?.length && (
				<ul>
					<ListItemSkeleton />
					<ListItemSkeleton />
				</ul>
			)} */}
			{posts?.length === 0 && posts && (
				<p>
					No posts found. Create one{" "}
					<Link colored href="/new">
						here
					</Link>
					.
				</p>
			)}
			{posts?.length > 0 && (
				<div>
					<ul>
						{posts.map((post) => {
							return (
								<ListItem
									deletePost={deletePost(post.id)}
									post={post}
									key={post.id}
								/>
							)
						})}
					</ul>
				</div>
			)}
			{hasMorePosts && !setSearchValue && (
				<div className={styles.moreContainer}>
					<Button width={"100%"} onClick={loadMoreClick}>
						Load more
					</Button>
				</div>
			)}
		</div>
	)
}

export default PostList
