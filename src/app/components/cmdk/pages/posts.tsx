import { Spinner } from "@components/spinner"
import { PostWithFiles } from "@lib/server/prisma"
import { useSessionSWR } from "@lib/use-session-swr"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { File } from "react-feather"
import { fetchWithUser } from "src/app/lib/fetch-with-user"
import Item from "../item"

export default function PostsPage({
	setOpen
}: {
	setOpen: (open: boolean) => void
}) {
	const { session } = useSessionSWR()
	const [posts, setPosts] = useState<PostWithFiles[]>()
	const [isLoading, setLoading] = useState(true)

	useEffect(() => {
		async function getPosts() {
			if (!session) return
			const data = await fetchWithUser(`/api/user/${session?.user.id}/posts/`, {
				method: "GET"
			})

			const posts = (await data.json()) as PostWithFiles[]
			setPosts(posts)
			setLoading(false)
		}
		getPosts()
	}, [session])

	const router = useRouter()
	return (
		<>
			{isLoading && (
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						height: 100
					}}
				>
					<Spinner />
				</div>
			)}
			{posts?.map((post) => (
				<Item
					onSelect={() => {
						router.push(`/post/${post.id}`)
						setOpen(false)
					}}
					key={post.id}
					icon={<File />}
				>
					{post.title}
				</Item>
			))}
		</>
	)
}
