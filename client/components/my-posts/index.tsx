import PostList from "../post-list"

const MyPosts = ({ posts, error }: { posts: any, error: any }) => {
    return <PostList posts={posts} error={error} />
}

export default MyPosts
