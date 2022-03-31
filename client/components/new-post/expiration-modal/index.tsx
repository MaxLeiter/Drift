
import { Modal, Note, Spacer, Input } from "@geist-ui/core"
import { useCallback, useState } from "react"
import DatePicker from 'react-datepicker';
// import "react-datepicker/dist/react-datepicker.css";
import styles from './modal.module.css'

type Props = {
    isOpen: boolean
    onClose: () => void
    onSubmit: (expiresAt: Date) => void
}

const ExpirationModal = ({ isOpen, onClose, onSubmit: onSubmitAfterVerify }: Props) => {
    const [error, setError] = useState<string>()
    const [date, setDate] = useState(new Date());
    const onSubmit = () => {
        onSubmitAfterVerify(date)
    }

    const onDateChange = (date: Date) => {
        setDate(date)
    }

    const CustomTimeInput = ({ value, onChange }: {
        date: Date,
        value: string,
        onChange: (date: string) => void
    }) => {
        return (
            <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                htmlType="time"
            />)
    }

    return (<>
        {/* TODO: investigate disableBackdropClick not updating state? */}
        {<Modal visible={isOpen} wrapClassName={styles.wrapper} disableBackdropClick={true}>
            <Modal.Title>Enter an expiration time</Modal.Title>
            <Modal.Content>
                <DatePicker
                    selected={date}
                    onChange={onDateChange}
                    customInput={<Input />}
                    showTimeInput={true}
                    // @ts-ignore
                    customTimeInput={<CustomTimeInput />}
                    timeInputLabel="Time:"
                    dateFormat="MM/dd/yyyy h:mm aa"
                />
            </Modal.Content>
            <Modal.Action passive onClick={onClose}>Cancel</Modal.Action>
            <Modal.Action onClick={onSubmit}>Submit</Modal.Action>
        </Modal>}
    </>)
}


export default ExpirationModal