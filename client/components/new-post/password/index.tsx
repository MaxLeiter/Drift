import { Input, Modal, Note, Spacer } from "@geist-ui/core"
import { useState } from "react"

type Props = {
    creating?: boolean
    isOpen: boolean
    onClose: () => void
    onSubmit: (password: string) => void
}

const PasswordModal = ({ isOpen, onClose, onSubmit: onSubmitAfterVerify, creating }: Props) => {
    const [password, setPassword] = useState<string>()
    const [confirmPassword, setConfirmPassword] = useState<string>()
    const [error, setError] = useState<string>()

    const onSubmit = () => {
        if (!password || (creating && !confirmPassword)) {
            setError('Please enter a password')
            return
        }

        if (password !== confirmPassword && creating) {
            setError("Passwords do not match")
            return
        }

        onSubmitAfterVerify(password)
    }

    return (<>
        {<Modal visible={isOpen} >
            <Modal.Title>Enter a password</Modal.Title>
            <Modal.Content>
                {!error && creating && <Note type="warning" label='Warning'>
                    This doesn&apos;t protect your post from the server administrator.
                </Note>}
                {error && <Note type="error" label='Error'>
                    {error}
                </Note>}
                <Spacer />
                <Input width={"100%"} label="Password" marginBottom={1} htmlType="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                {creating && <Input width={"100%"} label="Confirm" htmlType="password" placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)} />}
            </Modal.Content>
            <Modal.Action passive onClick={onClose}>Cancel</Modal.Action>
            <Modal.Action onClick={onSubmit}>Submit</Modal.Action>
        </Modal>}
    </>)
}


export default PasswordModal