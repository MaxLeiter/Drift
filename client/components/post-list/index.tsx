import { Code, Dot, Input, Note, Text } from "@geist-ui/core"
import NextLink from "next/link"
import Link from '../Link'

import styles from './post-list.module.css'
import ListItemSkeleton from "./list-item-skeleton"
import ListItem from "./list-item"
import { Post } from "@lib/types"
import { ChangeEvent, useEffect, useMemo, useState } from "react"
import debounce from "lodash.debounce"

type Props = {
    posts: Post[]
    error: any
}

const PostList = ({ posts, error }: Props) => {
    const [search, setSearchValue] = useState('')
    // const [searching, setSearching] = useState(false)
    const [searchResults, setSearchResults] = useState<Post[]>(posts)

    // update posts on search
    useEffect(() => {
        if (search) {
            // support filters like "title is:private has:content" in the text
            // extract the filters
            const filters = search.split(' ').filter(s => s.includes(':'))
            const filtersMap = new Map<string, string>()
            filters.forEach(f => {
                const [key, value] = f.split(':')
                filtersMap.set(key, value)
            })

            const results = posts.filter(post => {
                if (filtersMap.has('is') && filtersMap.get('is') !== post.visibility) {
                    return false
                }
                for (const file of post.files) {
                    if (file.content.toLowerCase().includes(search.toLowerCase())) {
                        return true
                    }
                }
                return post.title.toLowerCase().includes(search.toLowerCase())
            })
            setSearchResults(results)

        } else {
            setSearchResults(posts)
        }
    }, [search, posts])

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value)
    }

    const debouncedSearchHandler = useMemo(
        () => debounce(handleSearchChange, 300)
        , []);

    useEffect(() => {
        return () => {
            debouncedSearchHandler.cancel();
        }
    }, [debouncedSearchHandler]);

    return (
        <div className={styles.container}>
            <div className={styles.searchContainer}>
                <Input scale={3 / 2}
                    clearable
                    placeholder="is:private"
                    onChange={debouncedSearchHandler} />
                <Text type="secondary">Available filters: <Code>is:visibility</Code></Text>
            </div>
            {error && <Text type='error'>Failed to load.</Text>}
            {
                !posts && <ul>
                    <li>
                        <ListItemSkeleton />
                    </li>
                    <li>
                        <ListItemSkeleton />
                    </li>
                </ul>
            }
            {posts.length === 0 && !error && <Text type='secondary'>No posts found.Create one <NextLink passHref={true} href="/new"><Link color>here</Link></NextLink>.</Text>}
            {searchResults.length === 0 && <Text>No posts returned. Create one <NextLink passHref={true} href="/new"><Link color>here</Link></NextLink>.</Text>}
            {
                searchResults?.length > 0 && <div>
                    <ul>
                        {searchResults.map((post) => {
                            return <ListItem post={post} key={post.id} />
                        })}
                    </ul>
                </div>
            }
        </div >
    )
}

export default PostList
