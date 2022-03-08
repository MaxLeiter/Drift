import { ButtonGroup, Button } from "@geist-ui/core"
import { Bold, Italic, Underline, Link } from '@geist-ui/icons'
import { RefObject, useCallback, useMemo } from "react"

// TODO: clean up

const FormattingIcons = ({ textareaRef, setText }: { textareaRef?: RefObject<HTMLTextAreaElement>, setText?: (text: string) => void }) => {
    // const { textBefore, textAfter, selectedText } = useMemo(() => {
    //     if (textareaRef && textareaRef.current) {
    //         const textarea = textareaRef.current
    //         const text = textareaRef.current.value
    //         const selectionStart = textarea.selectionStart
    //         const selectionEnd = textarea.selectionEnd
    //         const textBefore = text.substring(0, selectionStart)
    //         const textAfter = text.substring(selectionEnd)
    //         const selectedText = text.substring(selectionStart, selectionEnd)
    //         return { textBefore, textAfter, selectedText }
    //     }
    //     return { textBefore: '', textAfter: '' }
    // }, [textareaRef,])

    const handleBoldClick = useCallback((e) => {
        if (textareaRef?.current && setText) {
            const selectionStart = textareaRef.current.selectionStart
            const selectionEnd = textareaRef.current.selectionEnd
            const text = textareaRef.current.value
            const before = text.substring(0, selectionStart)
            const after = text.substring(selectionEnd)
            const selectedText = text.substring(selectionStart, selectionEnd)

            const newText = `${before}**${selectedText}**${after}`
            setText(newText)

            // TODO; fails because settext async
            textareaRef.current.setSelectionRange(before.length + 2, before.length + 2 + selectedText.length)
        }
    }, [setText, textareaRef])

    const handleItalicClick = useCallback((e) => {
        if (textareaRef?.current && setText) {
            const selectionStart = textareaRef.current.selectionStart
            const selectionEnd = textareaRef.current.selectionEnd
            const text = textareaRef.current.value
            const before = text.substring(0, selectionStart)
            const after = text.substring(selectionEnd)
            const selectedText = text.substring(selectionStart, selectionEnd)
            const newText = `${before}*${selectedText}*${after}`
            setText(newText)
            textareaRef.current.focus()
            textareaRef.current.setSelectionRange(before.length + 1, before.length + 1 + selectedText.length)
        }
    }, [setText, textareaRef])

    const handleLinkClick = useCallback((e) => {
        if (textareaRef?.current && setText) {
            const selectionStart = textareaRef.current.selectionStart
            const selectionEnd = textareaRef.current.selectionEnd
            const text = textareaRef.current.value
            const before = text.substring(0, selectionStart)
            const after = text.substring(selectionEnd)
            const selectedText = text.substring(selectionStart, selectionEnd)
            let formattedText = '';
            if (selectedText.includes('http')) {
                formattedText = `[](${selectedText})`
            } else {
                formattedText = `[${selectedText}](https://)`
            }
            const newText = `${before}${formattedText}${after}`
            setText(newText)
            textareaRef.current.focus()
            textareaRef.current.setSelectionRange(before.length + 1, before.length + 1 + selectedText.length)
        }
    }, [setText, textareaRef])

    const formattingActions = useMemo(() => [
        {
            icon: <Bold />,
            name: 'bold',
            action: handleBoldClick
        },
        {
            icon: <Italic />,
            name: 'italic',
            action: handleItalicClick
        },
        // {
        //     icon: <Underline />,
        //     name: 'underline',
        //     action: handleUnderlineClick
        // },
        {
            icon: <Link />,
            name: 'hyperlink',
            action: handleLinkClick
        }
    ], [handleBoldClick, handleItalicClick, handleLinkClick])

    return (
        <div style={{ position: 'relative', zIndex: 1 }}>
            <ButtonGroup style={{
                position: 'absolute',
                right: 0,
            }}>
                {formattingActions.map(({ icon, name, action }) => (
                    <Button aria-label={name} key={name} icon={icon} onMouseDown={(e) => e.preventDefault()} onClick={action} />
                ))}
            </ButtonGroup>
        </div>
    )

}

export default FormattingIcons