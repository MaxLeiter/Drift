
import NextLink from "next/link"
import { useEffect, useMemo, useState } from "react"
import timeAgo from "@lib/time-ago"
import VisibilityBadge from "../visibility-badge"
import getPostPath from "@lib/get-post-path"
import { Input, Link, Text, Card, Spacer, Grid, Tooltip, Divider, Badge } from "@geist-ui/core"

const FilenameInput = ({ title }: { title: string }) => <Input
    value={title || 'No title'}
    marginTop="var(--gap)"
    size={1.2}
    font={1.2}
    label="Filename"
    readOnly
    width={"100%"}
    style={{ color: !!title ? 'var(--fg)' : 'var(--gray)' }}
/>

const ListItem = ({ post }: { post: any }) => {
    const createdDate = useMemo(() => new Date(post.createdAt), [post.createdAt])
    const [time, setTimeAgo] = useState(timeAgo(createdDate))

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeAgo(timeAgo(createdDate))
        }, 10000)
        return () => clearInterval(interval)
    }, [createdDate])

    const formattedTime = `${createdDate.toLocaleDateString()} ${createdDate.toLocaleTimeString()}`
    return (<li key={post.id}>
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
                </Text>

            </Card.Body>
            <Divider h="1px" my={0} />
            <Card.Content>
                {post.files.map((file: any) => {
                    return <FilenameInput key={file.id} title={file.title} />
                })}
            </Card.Content>

        </Card>
    </li>)
}

export default ListItem