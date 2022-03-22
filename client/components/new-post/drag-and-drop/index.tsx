import { Text, useTheme, useToasts } from '@geist-ui/core'
import { memo } from 'react'
import { useDropzone } from 'react-dropzone'
import styles from './drag-and-drop.module.css'
import type { Document } from '@lib/types'
import generateUUID from '@lib/generate-uuid'
const allowedFileTypes = [
    'application/json',
    'application/x-javascript',
    'application/xhtml+xml',
    'application/xml',
    'text/xml',
    'text/plain',
    'text/html',
    'text/csv',
    'text/tab-separated-values',
    'text/x-c',
    'text/x-c++',
    'text/x-csharp',
    'text/x-java',
    'text/x-javascript',
    'text/x-php',
    'text/x-python',
    'text/x-ruby',
    'text/x-scala',
    'text/x-swift',
    'text/x-typescript',
    'text/x-vb',
    'text/x-vbscript',
    'text/x-yaml',
    'text/x-c++',
    'text/x-c#',
    'text/mathml',
    'text/x-markdown',
    'text/markdown',
]

// Files with no extension can't be easily detected as plain-text,
// so instead of allowing all of them we'll just allow common ones
const allowedFileNames = [
    'Makefile',
    'README',
    'Dockerfile',
    'Jenkinsfile',
    'LICENSE',
    '.env',
    '.gitignore',
    '.gitattributes',
    '.env.example',
    '.env.development',
    '.env.production',
    '.env.test',
    '.env.staging',
    '.env.development.local',
    'yarn.lock',
]

const allowedFileExtensions = [
    'json',
    'js',
    'jsx',
    'ts',
    'tsx',
    'c',
    'cpp',
    'c++',
    'c#',
    'java',
    'php',
    'py',
    'rb',
    'scala',
    'swift',
    'vb',
    'vbscript',
    'yaml',
    'less',
    'stylus',
    'styl',
    'sass',
    'scss',
    'lock',
    'md',
    'markdown',
    'txt',
    'html',
    'htm',
    'css',
    'csv',
    'log',
    'sql',
    'xml',
    'webmanifest',
]

function FileDropzone({ setDocs }: { setDocs: ((docs: Document[]) => void) }) {
    const { palette } = useTheme()
    const { setToast } = useToasts()
    const onDrop = async (acceptedFiles: File[]) => {
        const newDocs = await Promise.all(acceptedFiles.map((file) => {
            return new Promise<Document>((resolve) => {
                const reader = new FileReader()

                reader.onabort = () => setToast({ text: 'File reading was aborted', type: 'error' })
                reader.onerror = () => setToast({ text: 'File reading failed', type: 'error' })
                reader.onload = () => {
                    const content = reader.result as string
                    resolve({
                        title: file.name,
                        content,
                        id: generateUUID()
                    })
                }
                reader.readAsText(file)
            })
        }))

        setDocs(newDocs)
    }

    const validator = (file: File) => {
        // TODO: make this configurable
        const maxFileSize = 1000000;
        if (file.size > maxFileSize) {
            return {
                code: 'file-too-big',
                message: 'File is too big. Maximum file size is ' + (maxFileSize).toFixed(2) + ' MB.',
            }
        }
        // We initially try to use the browser provided mime type, and then fall back to file names and finally extensions
        if (allowedFileTypes.includes(file.type) || allowedFileNames.includes(file.name) || allowedFileExtensions.includes(file.name?.split('.').pop() || '')) {
            return null
        } else {
            return {
                code: "not-plain-text",
                message: `Only plain text files are allowed.`
            };
        }
    }

    const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({ onDrop, validator })

    const fileRejectionItems = fileRejections.map(({ file, errors }) => (
        <li key={file.name}>
            {file.name}:
            <ul>
                {errors.map(e => (
                    <li key={e.code}><Text>{e.message}</Text></li>
                ))}
            </ul>
        </li>
    ));

    return (
        <div className={styles.container}>
            <div {...getRootProps()} className={styles.dropzone} style={{
                borderColor: palette.accents_3,
            }}>
                <input {...getInputProps()} />
                {!isDragActive && <Text p>Drag some files here, or click to select files</Text>}
                {isDragActive && <Text p>Release to drop the files here</Text>}
            </div>
            {fileRejections.length > 0 && <ul className={styles.error}>
                {/* <Button style={{ float: 'right' }} type="abort" onClick={() => fileRejections.splice(0, fileRejections.length)} auto iconRight={<XCircle />}></Button> */}
                <Text h5>There was a problem with one or more of your files.</Text>
                {fileRejectionItems}
            </ul>}
        </div>
    )
}

export default memo(FileDropzone)