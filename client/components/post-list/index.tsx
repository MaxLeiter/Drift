import { Loading, Card, Divider, Input, Text } from "@geist-ui/core"
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
                                <Card height={'300px'} style={{ overflowY: 'scroll' }} hoverable>
                                    <Text h3 className={styles.postHeader}>
                                        <Link color href={`/post/${post.id}`}>{post.title} <ShiftBy y={-1}><VisibilityBadge visibility={post.visibility} /></ShiftBy></Link> <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                    </Text>
                                    <Divider h="1px" my={0} />

                                    <Card.Content >
                                        <Input
                                            placeholder="MyFile.md"
                                            value={post.files[0].title}
                                            marginTop="var(--gap-double)"
                                            size={1.2}
                                            font={1.2}
                                            label="Filename"
                                            disabled={true}
                                            readOnly
                                            width={"100%"}
                                        />
                                        <Preview height={220} content={post.files[0].content} />
                                    </Card.Content>
                                </Card>
                            </li>
                        })}
                    </ul>
                </div>
            }
        </div>
    )
}

export default PostList