import { Button, ButtonDropdown, useToasts } from '@geist-ui/core'
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react'
import generateUUID from '../../lib/generate-uuid';
import Document from '../document';
import styles from './post.module.css'
import Title from './title';
type Document = {
    title: string
    content: string
    id: string
}

const Post = () => {
    const { setToast } = useToasts()

    const router = useRouter();
    const [title, setTitle] = useState<string>()
    const [docs, setDocs] = useState<Document[]>([{
        title: '',
        content: '',
        id: generateUUID()
    }])
    const [isSubmitting, setSubmitting] = useState(false)

    const remove = (id: string) => {
        setDocs(docs.filter((doc) => doc.id !== id))
    }

    const onSubmit = async (visibility: string) => {
        setSubmitting(true)
        const response = await fetch('/api/posts/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("drift-token")}`
            },
            body: JSON.stringify({
                title,
                files: docs,
                visibility,
                userId: localStorage.getItem("drift-userid"),
            })
        })

        const json = await response.json()
        setSubmitting(false)
        if (json.id)
            router.push(`/post/${json.id}`)
        else {
            setToast({ text: json.error.message, type: "error" })
        }
    }

    const updateTitle = useCallback((title: string, id: string) => {
        setDocs(docs.map((doc) => doc.id === id ? { ...doc, title } : doc))
    }, [docs])

    const updateContent = useCallback((content: string, id: string) => {
        setDocs(docs.map((doc) => doc.id === id ? { ...doc, content } : doc))
    }, [docs])

    return (
        <div>
            <Title title={title} setTitle={setTitle} />
            {
                docs.map(({ id }) => {
                    const doc = docs.find((doc) => doc.id === id)
                    return (
                        <Document
                            remove={() => remove(id)}
                            key={id}
                            editable={true}
                            setContent={(content) => updateContent(content, id)}
                            setTitle={(title) => updateTitle(title, id)}
                            content={doc?.content}
                            title={doc?.title}
                        />
                    )
                })
            }

            <div className={styles.buttons}>
                <Button
                    className={styles.button}
                    onClick={() => {
                        setDocs([...docs, {
                            title: '',
                            content: '',
                            id: generateUUID()
                        }])
                    }}
                    style={{ flex: .5, lineHeight: '40px' }}
                    type="default"
                >
                    Add a File
                </Button>

                <ButtonDropdown loading={isSubmitting} type="success">
                    <ButtonDropdown.Item main onClick={() => onSubmit('private')}>Create Private</ButtonDropdown.Item>
                    <ButtonDropdown.Item onClick={() => onSubmit('public')} >Create Public</ButtonDropdown.Item>
                    <ButtonDropdown.Item onClick={() => onSubmit('unlisted')} >Create Unlisted</ButtonDropdown.Item>
                </ButtonDropdown>
            </div>
        </div >
    )
}

export default Post