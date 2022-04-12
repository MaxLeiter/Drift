import Bold from "@geist-ui/icons/bold"
import Italic from "@geist-ui/icons/italic"
import Link from "@geist-ui/icons/link"
import ImageIcon from "@geist-ui/icons/image"
import { RefObject, useCallback, useMemo } from "react"
import styles from "../document.module.css"
import { Button, ButtonGroup } from "@geist-ui/core"
import { TextareaMarkdownRef } from "textarea-markdown-editor"

// TODO: clean up

const FormattingIcons = ({
	textareaRef
}: {
	textareaRef?: RefObject<TextareaMarkdownRef>
}) => {
	const formattingActions = useMemo(() => {
		const handleBoldClick = () => textareaRef?.current?.trigger("bold")
		const handleItalicClick = () => textareaRef?.current?.trigger("italic")
		const handleLinkClick = () => textareaRef?.current?.trigger("link")
		const handleImageClick = () => textareaRef?.current?.trigger("image")
		return [
			{
				icon: <Bold />,
				name: "bold",
				action: handleBoldClick
			},
			{
				icon: <Italic />,
				name: "italic",
				action: handleItalicClick
			},
			// {
			//     icon: <Underline />,
			//     name: 'underline',
			//     action: handleUnderlineClick
			// },
			{
				icon: <Link />,
				name: "hyperlink",
				action: handleLinkClick
			},
			{
				icon: <ImageIcon />,
				name: "image",
				action: handleImageClick
			}
		]
	}, [textareaRef])

	return (
		<div className={styles.actionWrapper}>
			<ButtonGroup className={styles.actions}>
				{formattingActions.map(({ icon, name, action }) => (
					<Button
						auto
						scale={2 / 3}
						px={0.6}
						aria-label={name}
						key={name}
						icon={icon}
						onMouseDown={(e) => e.preventDefault()}
						onClick={action}
					/>
				))}
			</ButtonGroup>
		</div>
	)
}

export default FormattingIcons
