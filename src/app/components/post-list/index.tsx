"use client"

import styles from "./post-list.module.css"
import ListItem from "./list-item"
import { ChangeEvent, useCallback, useState } from "react"
import type { PostWithFiles } from "@lib/server/prisma"
import Input from "@components/input"
import { useToasts } from "@components/toasts"
import { ListItemSkeleton } from "./list-item-skeleton"
import Link from "@components/link"
import debounce from "lodash.debounce"
import { fetchWithUser } from "src/app/lib/fetch-with-user"
import { Stack } from "@components/stack"

type Props = {
	initialPosts: PostWithFiles[]
	morePosts?: boolean
	hideSearch?: boolean
	hideActions?: boolean
	isOwner?: boolean
	skeleton?: boolean
	searchValue?: string
	userId?: string
}

const PostList = ({
	initialPosts,
	hideSearch,
	hideActions,
	isOwner,
	skeleton,
	userId
}: Props) => {
	const [searchValue, setSearchValue] = useState("")
	const [searching, setSearching] = useState(false)
	const [posts, setPosts] = useState<PostWithFiles[]>(initialPosts)

	const { setToast } = useToasts()

	const showSkeleton = skeleton || searching

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
				const res = await fetchWithUser(
					`/api/post/search?q=${encodeURIComponent(query)}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json"
						}
					}
				)
				const json = (await res.json()) as PostWithFiles[]
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
			const res = await fetchWithUser(`/api/post/${postId}`, {
				method: "DELETE"
			})

			if (!res?.ok) {
				console.error(res)
				return
			} else {
				setPosts((posts) => posts?.filter((post) => post.id !== postId))
				setToast({
					message: "Post deleted",
					type: "success"
				})
			}
		},
		[setPosts, setToast]
	)

	return (
		<Stack className={styles.container} alignItems="center">
			{!hideSearch && (
				<div className={styles.searchContainer}>
					<Input
						placeholder="Search..."
						onChange={onSearchChange}
						disabled={!posts}
						style={{ maxWidth: 300 }}
						aria-label="Search"
						value={searchValue}
					/>
				</div>
			)}
			{!posts && <p style={{ color: "var(--warning)" }}>Failed to load.</p>}
			{showSkeleton && (
				<ul>
					<ListItemSkeleton />
					<ListItemSkeleton />
				</ul>
			)}
			{!showSkeleton && posts && posts.length > 0 ? (
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
			) : null}
		</Stack>
	)
}

export default PostList

export function NoPostsFound() {
	return (
		<p>
			No posts found. Create one{" "}
			<Link colored href="/new">
				here
			</Link>
			.
		</p>
	)
}
