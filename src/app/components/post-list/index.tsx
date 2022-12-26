"use client"

import styles from "./post-list.module.css"
import ListItem from "./list-item"
import { ChangeEvent, useCallback, useState } from "react"
import Link from "@components/link"
import type { PostWithFiles } from "@lib/server/prisma"
import Input from "@components/input"
import Button from "@components/button"
import { useToasts } from "@components/toasts"
import { ListItemSkeleton } from "./list-item-skeleton"
import debounce from "lodash.debounce"

type Props = {
	initialPosts: string | PostWithFiles[]
	morePosts?: boolean
	userId?: string
	hideSearch?: boolean
	hideActions?: boolean
	isOwner?: boolean
}

const PostList = ({
	morePosts,
	initialPosts: initialPostsMaybeJSON,
	userId,
	hideSearch,
	hideActions,
	isOwner
}: Props) => {
	const initialPosts =
		typeof initialPostsMaybeJSON === "string"
			? JSON.parse(initialPostsMaybeJSON)
			: initialPostsMaybeJSON
	const [search, setSearchValue] = useState("")
	const [posts, setPosts] = useState<PostWithFiles[]>(initialPosts)
	const [searching, setSearching] = useState(false)
	const [hasMorePosts] = useState(morePosts)
	const { setToast } = useToasts()

	const loadMoreClick = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			e.preventDefault()
			if (hasMorePosts) {
				// eslint-disable-next-line no-inner-declarations
				async function fetchPosts() {
					// const res = await fetch(`/api/posts/mine`, {
					// 	method: "GET",
					// 	headers: {
					// 		"Content-Type": "application/json",
					// 		"x-page": `${posts.length / 10 + 1}`
					// 	},
					// 	next: {
					// 		revalidate: 10
					// 	}
					// })
					// const json = await res.json()
					// setPosts([...posts, ...json.posts])
					// setHasMorePosts(json.morePosts)
				}
				fetchPosts()
			}
		},
		[hasMorePosts]
	)

	// eslint-disable-next-line react-hooks/exhaustive-deps -- TODO: address this
	const onSearch = useCallback(
		debounce((query: string) => {
			if (!query) {
				setPosts(initialPosts)
				setSearching(false)
				return
			}

			setSearching(true)
			async function fetchPosts() {
				const res = await fetch(
					`/api/post/search?q=${encodeURIComponent(query)}&userId=${userId}`,
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
		}, 300),
		[userId]
	)

	const onSearchChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			setSearchValue(e.target.value)
			onSearch(e.target.value)
		},
		[onSearch]
	)

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
			{!hideSearch && (
				<div className={styles.searchContainer}>
					<Input
						placeholder="Search..."
						onChange={onSearchChange}
						disabled={!posts}
						style={{ maxWidth: 300 }}
						aria-label="Search"
						value={search}
					/>
				</div>
			)}
			{!posts && <p style={{ color: "var(--warning)" }}>Failed to load.</p>}
			{searching && (
				<ul>
					<ListItemSkeleton />
					<ListItemSkeleton />
				</ul>
			)}
			{!searching && posts?.length === 0 && posts && (
				<p>
					No posts found. Create one{" "}
					<Link colored href="/new">
						here
					</Link>
					.
				</p>
			)}
			{!searching && posts?.length > 0 && (
				<div>
					<ul>
						{posts.map((post) => {
							return (
								<ListItem
									deletePost={deletePost(post.id)}
									post={post}
									key={post.id}
									hideActions={hideActions}
									isOwner={isOwner}
								/>
							)
						})}
					</ul>
				</div>
			)}
			{!searching && hasMorePosts && !setSearchValue && (
				<div>
					<Button width={"100%"} onClick={loadMoreClick}>
						Load more
					</Button>
				</div>
			)}
		</div>
	)
}

export default PostList
