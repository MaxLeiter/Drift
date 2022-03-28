import { Text, Fieldset, Spacer, Link } from '@geist-ui/core'
import getPostPath from '@lib/get-post-path'
import { Post, User } from '@lib/types'
import Cookies from 'js-cookie'
import useSWR from 'swr'
import styles from './admin.module.css'
const fetcher = (url: string) => fetch(url, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Cookies.get('drift-token')}`,
    }
}).then(res => res.json())

const Admin = () => {
    const { data: posts, error } = useSWR<Post[]>('/server-api/admin/posts', fetcher)
    const { data: users, error: errorUsers } = useSWR<User[]>('/server-api/admin/users', fetcher)
    console.log(posts, error)
    return (
        <div className={styles.adminWrapper}>
            <Text h2>Administration</Text>
            <Fieldset>
                <Fieldset.Title>Users</Fieldset.Title>
                {users && <Fieldset.Subtitle>{users.length} users</Fieldset.Subtitle>}
                {!users && <Fieldset.Subtitle>Loading...</Fieldset.Subtitle>}
                {users && <table>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Posts</th>
                            <th>Created</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.map(user => (
                            <tr key={user.id}>
                                <td>{user.username}</td>
                                <td>{user.posts?.length}</td>
                                <td>{new Date(user.createdAt).toLocaleDateString()} {new Date(user.createdAt).toLocaleTimeString()}</td>
                                <td>{user.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>}

            </Fieldset>
            <Spacer height={1} />
            <Fieldset>
                <Fieldset.Title>Posts</Fieldset.Title>
                {posts && <Fieldset.Subtitle>{posts.length} posts</Fieldset.Subtitle>}
                {!posts && <Fieldset.Subtitle>Loading...</Fieldset.Subtitle>}
                {posts && <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Visibility</th>
                            <th>Created</th>
                            <th>Author</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts?.map(post => (
                            <tr key={post.id}>
                                <td><Link color href={getPostPath(post.visibility, post.id)}>{post.title}</Link></td>
                                <td>{post.visibility}</td>
                                <td>{new Date(post.createdAt).toLocaleDateString()} {new Date(post.createdAt).toLocaleTimeString()}</td>
                                <td>{post.users ? post.users[0].username : ''}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>}
            </Fieldset>

        </div >
    )
}

export default Admin