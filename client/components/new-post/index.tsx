import { Button, useToasts, ButtonDropdown } from '@geist-ui/core'
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react'
import generateUUID from '@lib/generate-uuid';
import FileDropzone from './drag-and-drop';
import styles from './post.module.css'
import Title from './title';
import Cookies from 'js-cookie'
import type { PostVisibility, Document as DocumentType } from '@lib/types';
import PasswordModal from './password';
import getPostPath from '@lib/get-post-path';
import EditDocumentList from '@components/edit-document-list';
import { ChangeEvent } from 'react';

const Post = () => {
    const { setToast } = useToasts()
    const router = useRouter();
    const [title, setTitle] = useState<string>()

    const [docs, setDocs] = useState<DocumentType[]>([{
        title: '',
        content: '',
        id: generateUUID()
    }])

    const [passwordModalVisible, setPasswordModalVisible] = useState(false)
    const sendRequest = useCallback(async (url: string, data: { visibility?: PostVisibility, title?: string, files?: DocumentType[], password?: string, userId: string }) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Cookies.get('drift-token')}`
            },
            body: JSON.stringify({
                title,
                files: docs,
                ...data,
            })
        })

        if (res.ok) {
            const json = await res.json()
            router.push(getPostPath(json.visibility, json.id))
        } else {
            const json = await res.json()
            setToast({
                text: json.error.message || 'Please fill out all fields',
                type: 'error'
            })
            setPasswordModalVisible(false)
            setSubmitting(false)
        }

    }, [docs, router, setToast, title])

    const [isSubmitting, setSubmitting] = useState(false)

    const onSubmit = async (visibility: PostVisibility, password?: string) => {
        if (visibility === 'protected' && !password) {
            setPasswordModalVisible(true)
            return
        }
        setSubmitting(true)

        let hasErrored = false

        if (!title) {
            setToast({
                text: 'Please fill out the post title',
                type: 'error'
            })
            setSubmitting(false)
            hasErrored = true
        }

        for (const doc of docs) {
            if (!doc.title) {
                setToast({
                    text: 'Please fill out all the document titles',
                    type: 'error'
                })
                setSubmitting(false)
                hasErrored = true
            }
        }

        if (hasErrored) return

        await sendRequest('/server-api/posts/create', {
            title,
            files: docs,
            visibility,
            password,
            userId: Cookies.get('drift-userid') || ''
        })
    }

    const onClosePasswordModal = () => {
        setPasswordModalVisible(false)
        setSubmitting(false)
    }

    const onChangeTitle = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
    }, [setTitle])


    const updateDocTitle = useCallback((i: number) => (title: string) => {
        setDocs((docs) => docs.map((doc, index) => i === index ? { ...doc, title } : doc))
    }, [setDocs])

    const updateDocContent = useCallback((i: number) => (content: string) => {
        setDocs((docs) => docs.map((doc, index) => i === index ? { ...doc, content } : doc))
    }, [setDocs])

    const removeDoc = useCallback((i: number) => () => {
        setDocs((docs) => docs.filter((_, index) => i !== index))
    }, [setDocs])


    const uploadDocs = useCallback((files: DocumentType[]) => {
        // if no title is set and the only document is empty,
        const isFirstDocEmpty = docs.length <= 1 && (docs.length ? docs[0].title === '' : true)
        const shouldSetTitle = !title && isFirstDocEmpty
        if (shouldSetTitle) {
            if (files.length === 1) {
                setTitle(files[0].title)
            } else if (files.length > 1) {
                setTitle('Uploaded files')
            }
        }

        if (isFirstDocEmpty) setDocs(files)
        else setDocs((docs) => [...docs, ...files])
    }, [docs, title])

    // pasted files
    // const files = e.clipboardData.files as File[]
    // if (files.length) {
    //     const docs = Array.from(files).map((file) => ({
    //         title: file.name,
    //         content: '',
    //         id: generateUUID()
    //     }))
    // }

    const onPaste = useCallback((e: any) => {
        const pastedText = (e.clipboardData).getData('text')

        if (pastedText) {
            if (!title) {
                setTitle("Pasted text")
            }
        }
    }, [title])

    return (
        <div style={{ paddingBottom: 150 }}>
            <Title title={title} onChange={onChangeTitle} />
            <FileDropzone setDocs={uploadDocs} />
            <EditDocumentList onPaste={onPaste} docs={docs} updateDocTitle={updateDocTitle} updateDocContent={updateDocContent} removeDoc={removeDoc} />
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
                    <ButtonDropdown.Item onClick={() => onSubmit('protected')} >Create with Password</ButtonDropdown.Item>
                </ButtonDropdown>
                <PasswordModal isOpen={passwordModalVisible} onClose={onClosePasswordModal} onSubmit={(password) => onSubmit('protected', password)} />
            </div>
        </div>
    )
}

export default Post
