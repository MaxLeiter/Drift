import useSWR from "swr"
import PostList from "../post-list"

const fetcher = (url: string) => fetch(url, {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("drift-token")}`
    },
}).then(r => r.json())

const MyPosts = () => {
    const { data, error } = useSWR('/server-api/users/mine', fetcher)
    return <PostList posts={data} error={error} />
}

export default MyPosts
