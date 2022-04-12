import type { Post } from "@lib/types"
import PostList from "../post-list"

const MyPosts = ({
	posts,
	error,
	morePosts
}: {
	posts: Post[]
	error: boolean
	morePosts: boolean
}) => {
	return <PostList morePosts={morePosts} initialPosts={posts} error={error} />
}

export default MyPosts
