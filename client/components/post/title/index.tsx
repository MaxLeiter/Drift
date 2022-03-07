import { Text, Input } from '@geist-ui/core'
import { memo } from 'react'
import ShiftBy from '../../shift-by'
import styles from '../post.module.css'

const titlePlaceholders = [
    "How to...",
    "Status update for ...",
    "My new project",
    "My new idea",
]

type props = {
    setTitle: (title: string) => void
    title?: string
}

const Title = ({ setTitle, title }: props) => {
    return (<div className={styles.title}>
        <Text h1 width={"150px"} className={styles.drift}>Drift &mdash;</Text>
        <ShiftBy y={-6}>
            <Input
                placeholder={titlePlaceholders[Math.floor(Math.random() * titlePlaceholders.length)]}
                value={title || ""}
                onChange={(event) => setTitle(event.target.value)}
                height={"55px"}
                font={1.5}
                label="Your title"
                marginLeft={'var(--gap)'}
                style={{ width: "100%" }}
            />
        </ShiftBy>
    </div>)
}

export default memo(Title)