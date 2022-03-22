import cookie from "cookie";
import type { GetServerSideProps } from "next";
import { PostVisibility, ThemeProps } from "@lib/types";
import PostPage from "@components/post-page";

type File = {
    id: string
    title: string
    content: string
}

type Files = File[]

export type PostProps = ThemeProps & {
    post: {
        id: string
        title: string
        description: string
        visibility: PostVisibility
        files: Files
    }
}

const Post = ({ post, theme, changeTheme }: PostProps) => {
    return (<PostPage post={post} changeTheme={changeTheme} theme={theme} />)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const headers = context.req.headers
    const host = headers.host
    const driftToken = cookie.parse(headers.cookie || '')[`drift-token`]

    if (context.query.id) {
        const post = await fetch('http://' + host + `/server-api/posts/${context.query.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${driftToken}`,
                "x-secret-key": process.env.SECRET_KEY || "",
            }
        })

        if (!post.ok || post.status !== 200) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            }
        }
        try {
            const json = await post.json();

            return {
                props: {
                    post: json
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    return {
        props: {
            post: null
        }
    }
}

export default Post

