
import NextLink from "next/link"
import { useEffect, useMemo, useState } from "react"
import timeAgo from "@lib/time-ago"
import VisibilityBadge from "../visibility-badge"
import getPostPath from "@lib/get-post-path"
import { Link, Text, Card, Tooltip, Divider, Badge, Button } from "@geist-ui/core"
import { File, Post } from "@lib/types"
import FadeIn from "@components/fade-in"
import Trash from "@geist-ui/icons/trash"
import Cookies from "js-cookie"

// TODO: isOwner should default to false so this can be used generically
const ListItem = ({ post, isOwner = true, deletePost }: { post: Post, isOwner?: boolean, deletePost: () => void }) => {
    const createdDate = useMemo(() => new Date(post.createdAt), [post.createdAt])
    const [time, setTimeAgo] = useState(timeAgo(createdDate))

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeAgo(timeAgo(createdDate))
        }, 10000)
        return () => clearInterval(interval)
    }, [createdDate])

    const formattedTime = `${createdDate.toLocaleDateString()} ${createdDate.toLocaleTimeString()}`
    return (<FadeIn><li key={post.id}>

        <Card style={{ overflowY: 'scroll' }}>
            <Card.Body>
                <Text h3>
                    <NextLink passHref={true} href={getPostPath(post.visibility, post.id)}>
                        <Link color marginRight={'var(--gap)'}>
                            {post.title}
                        </Link>
                    </NextLink>
                    <div style={{ display: 'inline-flex' }}>
                        <span>
                            <VisibilityBadge visibility={post.visibility} />
                        </span>
                        <span style={{ marginLeft: 'var(--gap)' }}>
                            <Badge type="secondary"><Tooltip text={formattedTime}>{time}</Tooltip></Badge>
                        </span>
                        <span style={{ marginLeft: 'var(--gap)' }}>
                            <Badge type="secondary">{post.files.length === 1 ? "1 file" : `${post.files.length} files`}</Badge>
                        </span>
                    </div>
                    {isOwner && <span style={{ float: 'right' }}>
                        <Button iconRight={<Trash />} onClick={deletePost} auto />
                    </span>}
                </Text>

            </Card.Body>
            <Divider h="1px" my={0} />
            <Card.Content>
                {post.files.map((file: File) => {
                    return <div key={file.id}>
                        <Link color href={`${getPostPath(post.visibility, post.id)}#${file.title}`}>
                            {file.title || 'Untitled file'}
                        </Link></div>
                })}
            </Card.Content>

        </Card>

    </li> </FadeIn>)
}

export default ListItem