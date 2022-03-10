import { Card, Spacer, Grid, Divider, Link, Text, Input } from "@geist-ui/core"
import post from "../post"
import ShiftBy from "../shift-by"
import VisibilityBadge from "../visibility-badge"

const FilenameInput = ({ title }: { title: string }) => <Input
    value={title}
    marginTop="var(--gap-double)"
    size={1.2}
    font={1.2}
    label="Filename"
    readOnly
    width={"100%"}
/>

const ListItem = ({ post }: { post: any }) => {
    return (<li key={post.id}>
        <Card style={{ overflowY: 'scroll' }}>
            <Spacer height={1 / 2} />
            <Grid.Container justify={'space-between'}>
                <Grid xs={8}>
                    <Text h3 paddingLeft={1 / 2}>
                        <Link color href={`/post/${post.id}`}>{post.title}
                            <ShiftBy y={-1}><VisibilityBadge visibility={post.visibility} /></ShiftBy>
                        </Link>
                    </Text></Grid>
                <Grid xs={7}><Text type="secondary" h5>{new Date(post.createdAt).toLocaleDateString()} </Text></Grid>
                <Grid xs={4}><Text type="secondary" h5>{post.files.length === 1 ? "1 file" : `${post.files.length} files`}</Text></Grid>
            </Grid.Container>

            <Divider h="1px" my={0} />

            <Card.Content >
                {post.files.map((file: any) => {
                    return <FilenameInput key={file.id} title={file.title} />
                })}
            </Card.Content>

        </Card>
    </li>)
}

export default ListItem