import { Loading, Card, Divider, Input, Text, Grid, Spacer } from "@geist-ui/core"
import Preview from "../preview"
import ShiftBy from "../shift-by"
import VisibilityBadge from "../visibility-badge"
import Link from '../Link'

import styles from './post-list.module.css'

type Props = {
    posts: any
    error: any
}

const PostList = ({ posts, error }: Props) => {
    const FilenameInput = ({ title }: { title: string }) => <Input
        value={title}
        marginTop="var(--gap-double)"
        size={1.2}
        font={1.2}
        label="Filename"
        readOnly
        width={"100%"}
    />

    return (
        <div className={styles.container}>
            {error && <Text type='error'>Failed to load.</Text>}
            {!posts && <Loading />}
            {posts?.length === 0 && <Text>You have no posts. Create one <Link href="/new">here</Link>.</Text>}
            {
                posts?.length > 0 && <div>
                    <ul>
                        {posts.map((post: any) => {
                            return <li key={post.id}>
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
                            </li>
                        })}
                    </ul>
                </div>
            }
        </div >
    )
}

export default PostList