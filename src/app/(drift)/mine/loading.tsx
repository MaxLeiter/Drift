"use client"

import { PageTitle } from "@components/page-title"
import { PageWrapper } from "@components/page-wrapper"
import PostList from "@components/post-list"

export default function Loading() {
	return (
		<>
			<PageTitle>Your Posts</PageTitle>
			<PageWrapper></PageWrapper>
			<PostList skeleton={true} initialPosts={[]} />
		</>
	)
}
