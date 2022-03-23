import type { GetStaticPaths, GetStaticProps } from "next";

import type { Post } from "@lib/types";
import PostPage from "@components/post-page";

export type PostProps = {
    post: Post
}

const PostView = ({ post }: PostProps) => {
    return <PostPage post={post} />
}

export const getStaticPaths: GetStaticPaths = async () => {
    const posts = await fetch(process.env.API_URL + `/posts/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-secret-key": process.env.SECRET_KEY || "",
        }
    })

    const json = await posts.json()
    const filtered = json.filter((post: any) => post.visibility === "public" || post.visibility === "unlisted")
    const paths = filtered.map((post: any) => ({
        params: { id: post.id }
    }))

    return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const post = await fetch(process.env.API_URL + `/posts/${params?.id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-secret-key": process.env.SECRET_KEY || "",
        }
    })

    return {
        props: {
            post: await post.json()
        },
    }
}

export default PostView

