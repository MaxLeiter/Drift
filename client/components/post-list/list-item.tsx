
import NextLink from "next/link"
import { useEffect, useMemo, useState } from "react"
import timeAgo from "@lib/time-ago"
import ShiftBy from "../shift-by"
import VisibilityBadge from "../visibility-badge"
import getPostPath from "@lib/get-post-path"
import { Input, Link, Text, Card, Spacer, Grid, Tooltip, Divider } from "@geist-ui/core"

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
            <Spacer height={1 / 2} />
            <Grid.Container>
                <Grid md={14} xs={14}>
                    <Text h3 paddingLeft={1 / 2} >
                        <NextLink passHref={true} href={getPostPath(post.visibility, post.id)}>
                            <Link color>{post.title}
                                <ShiftBy y={-1}><VisibilityBadge visibility={post.visibility} /></ShiftBy>
                            </Link>
                        </NextLink>
                    </Text></Grid>
                <Grid paddingLeft={1 / 2} md={5} xs={9}><Text type="secondary" h5><Tooltip text={formattedTime}>{time}</Tooltip></Text></Grid>
                <Grid paddingLeft={1 / 2} md={5} xs={4}><Text type="secondary" h5>{post.files.length === 1 ? "1 file" : `${post.files.length} files`}</Text></Grid>
            </Grid.Container>

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