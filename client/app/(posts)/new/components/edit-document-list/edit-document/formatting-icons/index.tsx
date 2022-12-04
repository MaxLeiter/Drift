import {
	Bold,
	Code,
	Image as ImageIcon,
	Italic,
	Link,
	List
} from "react-feather"
import { RefObject, useMemo } from "react"
import styles from "./formatting-icons.module.css"
import { TextareaMarkdownRef } from "textarea-markdown-editor"
import Tooltip from "@components/tooltip"
import Button from "@components/button"
import ButtonGroup from "@components/button-group"
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
		const handleCodeClick = () => textareaRef?.current?.trigger("code")
		const handleListClick = () =>
			textareaRef?.current?.trigger("unordered-list")
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
			{
				icon: <Link />,
				name: "hyperlink",
				action: handleLinkClick
			},
			{
				icon: <ImageIcon />,
				name: "image",
				action: handleImageClick
			},
			{
				icon: <Code />,
				name: "code",
				action: handleCodeClick
			},
			{
				icon: <List />,
				name: "unordered-list",
				action: handleListClick
			}
		]
	}, [textareaRef])

	return (
		<div className={styles.actionWrapper}>
			<ButtonGroup className={styles.actions}>
				{formattingActions.map(({ icon, name, action }) => (
					<Tooltip
						content={name[0].toUpperCase() + name.slice(1).replace("-", " ")}
						key={name}
					>
						<Button
							aria-label={name}
							iconRight={icon}
							onMouseDown={(e) => e.preventDefault()}
							onClick={action}
						/>
					</Tooltip>
				))}
			</ButtonGroup>
		</div>
	)
}

export default FormattingIcons
