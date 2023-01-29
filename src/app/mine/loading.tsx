"use client"

import PostList from "@components/post-list"

export default function Loading() {
	return <PostList skeleton={true} initialPosts={[]} />
}
