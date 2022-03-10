import { Text } from "@geist-ui/core"
import Link from '../Link'

import styles from './post-list.module.css'
import ListItemSkeleton from "./list-item-skeleton"
import ListItem from "./list-item"

type Props = {
    posts: any
    error: any
}

const PostList = ({ posts, error }: Props) => {
    return (
        <div className={styles.container}>
            {error && <Text type='error'>Failed to load.</Text>}
            {!posts && <ul>
                <li>
                    <ListItemSkeleton />
                </li>
                <li>
                    <ListItemSkeleton />
                </li>
            </ul>}
            {posts?.length === 0 && <Text>You have no posts. Create one <Link href="/new">here</Link>.</Text>}
            {
                posts?.length > 0 && <div>
                    <ul>
                        {posts.map((post: any) => {
                            return <ListItem post={post} key={post.id} />
                        })}
                    </ul>
                </div>
            }
        </div >
    )
}

export default PostList
