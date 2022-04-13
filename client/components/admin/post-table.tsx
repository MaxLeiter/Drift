import { Button, Fieldset, Link, Popover, useToasts } from "@geist-ui/core"
import MoreVertical from "@geist-ui/icons/moreVertical"
import { Post } from "@lib/types"
import Cookies from "js-cookie"
import { useEffect, useMemo, useState } from "react"
import { adminFetcher } from "."
import Table from "rc-table"
import byteToMB from "@lib/byte-to-mb"

const PostTable = () => {
	const [posts, setPosts] = useState<Post[]>()
	const { setToast } = useToasts()

	useEffect(() => {
		const fetchPosts = async () => {
			const res = await adminFetcher("/posts")
			const data = await res.json()
			setPosts(data)
		}
		fetchPosts()
	}, [])

	const tablePosts = useMemo(
		() =>
			posts?.map((post) => {
				return {
					id: post.id,
					title: post.title,
					files: post.files?.length || 0,
					createdAt: `${new Date(
						post.createdAt
					).toLocaleDateString()} ${new Date(
						post.createdAt
					).toLocaleTimeString()}`,
					visibility: post.visibility,
					size: post.files
						? byteToMB(
								post.files.reduce((acc, file) => acc + file.html.length, 0)
						  )
						: 0,
					actions: ""
				}
			}),
		[posts]
	)

	// const deletePost = async (id: number) => {
	//     const confirm = window.confirm("Are you sure you want to delete this post?")
	//     if (!confirm) return
	//     const res = await adminFetcher(`/posts/${id}`, {
	//         method: "DELETE",
	//     })

	//     const json = await res.json()

	//     if (res.status === 200) {
	//         setToast({
	//             text: "Post deleted",
	//             type: "success"
	//         })
	//     } else {
	//         setToast({
	//             text: json.error || "Something went wrong",
	//             type: "error"
	//         })
	//     }
	// }

	const tableColumns = [
		{
			title: "Title",
			dataIndex: "title",
			key: "title",
			width: 50
		},
		{
			title: "Files",
			dataIndex: "files",
			key: "files",
			width: 10
		},
		{
			title: "Created",
			dataIndex: "createdAt",
			key: "createdAt",
			width: 100
		},
		{
			title: "Visibility",
			dataIndex: "visibility",
			key: "visibility",
			width: 50
		},
		{
			title: "Size (MB)",
			dataIndex: "size",
			key: "size",
			width: 10
		},
		{
			title: "Actions",
			dataIndex: "",
			key: "actions",
			width: 50,
			render(post: any) {
				return (
					<Popover
						content={
							<div
								style={{
									width: 100,
									display: "flex",
									flexDirection: "column",
									alignItems: "center"
								}}
							>
								{/* <Link href="#" onClick={() => deletePost(post.id)}>Delete post</Link> */}
							</div>
						}
						hideArrow
					>
						<Button iconRight={<MoreVertical />} auto></Button>
					</Popover>
				)
			}
		}
	]

	return (
		<Fieldset>
			<Fieldset.Title>Posts</Fieldset.Title>
			{posts && <Fieldset.Subtitle>{posts.length} posts</Fieldset.Subtitle>}
			{!posts && <Fieldset.Subtitle>Loading...</Fieldset.Subtitle>}
			{posts && <Table columns={tableColumns} data={tablePosts} />}
		</Fieldset>
	)
}

export default PostTable
