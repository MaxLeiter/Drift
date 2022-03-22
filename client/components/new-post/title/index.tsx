import { ChangeEvent, memo, useCallback } from 'react'
import Text from '@geist-ui/core/dist/text'
import Input from '@geist-ui/core/dist/input'

import ShiftBy from '@components/shift-by'
import styles from '../post.module.css'

const titlePlaceholders = [
    "How to...",
    "Status update for ...",
    "My new project",
    "My new idea",
    "Let's talk about...",
    "What's up with ...",
    "I'm thinking about ...",
]

type props = {
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    title?: string
}

const Title = ({ onChange, title }: props) => {
    return (<div className={styles.title}>
        <Text h1 width={"150px"} className={styles.drift}>Drift</Text>
        <ShiftBy y={-3}>
            <Input
                placeholder={titlePlaceholders[Math.floor(Math.random() * titlePlaceholders.length)]}
                value={title || ""}
                onChange={onChange}
                height={"55px"}
                font={1.5}
                label="Post title"
                style={{ width: "100%" }}
            />
        </ShiftBy>
    </div>)
}

export default memo(Title)