import { FormEvent, useState } from 'react'
import { Button, Card, Input, Text } from '@geist-ui/core'
import styles from './auth.module.css'
import { useRouter } from 'next/router'
import Link from '../Link'

const Auth = ({ page }: { page: "signup" | "signin" }) => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const signingIn = page === 'signin'

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {

        const handleJson = (json: any) => {
            if (json.error) {
                setError(json.error.message)
            } else {
                localStorage.setItem('drift-token', json.token)
                localStorage.setItem('drift-userid', json.userId)
                router.push('/new')
            }
        }

        const reqOpts = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        }

        e.preventDefault()
        if (signingIn) {
            try {
                const resp = await fetch('/api/users/login', reqOpts)
                const json = await resp.json()
                handleJson(json)
            } catch (err: any) {
                setError(err.message || "Something went wrong")
            }
        } else {
            try {
                const resp = await fetch('/api/users/signup', reqOpts)
                const json = await resp.json()
                handleJson(json)
            } catch (err: any) {
                setError(err.message || "Something went wrong")
            }
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.form}>
                <div className={styles.formHeader}>
                    <h1>{signingIn ? 'Sign In' : 'Sign Up'}</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <Card>
                        <div className={styles.formGroup}>
                            <Input
                                htmlType="text"
                                id="username"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                placeholder="Username"
                                required
                                label='Username'
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <Input
                                htmlType='password'
                                id="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="Password"
                                required
                                label='Password'
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Button type="success" ghost htmlType="submit">{signingIn ? 'Sign In' : 'Sign Up'}</Button>
                        </div>
                        <div className={styles.formGroup}>
                            {signingIn && <Text>Don&apos;t have an account? <Link color href="/signup" >Sign up</Link></Text>}
                            {!signingIn && <Text>Already have an account? <Link color href="/signin" >Sign in</Link></Text>}
                        </div>
                        {error && <Text type='error'>{error}</Text>}
                    </Card>
                </form>
            </div>
        </div >
    )
}

export default Auth