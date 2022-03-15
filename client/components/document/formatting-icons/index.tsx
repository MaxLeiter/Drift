import { ButtonGroup, Button } from "@geist-ui/core";
import { Bold, Italic, Link, Image as ImageIcon } from "@geist-ui/icons";
import { RefObject, useCallback, useMemo } from "react";
import styles from "../document.module.css";
import useFormattingClick from "../../../lib/hooks/use-formatting-click";

const FormattingIcons = ({
  textareaRef,
  setText,
}: {
  textareaRef?: RefObject<HTMLTextAreaElement>;
  setText?: (text: string) => void;
}) => {
  const { currentTextareaRef, currentSetText, onClick } = useFormattingClick({
    currentTextareaRef: textareaRef,
    currentSetText: setText,
  });

  const handleBoldClick = useCallback(
    (e) => {
      if (currentTextareaRef?.current && currentSetText) {
        onClick("bold")!;
      }
    },
    [currentSetText, currentTextareaRef, onClick]
  );

  const handleItalicClick = useCallback(
    (e) => {
      if (currentTextareaRef?.current && currentSetText) {
        onClick("italic")!;
      }
    },
    [currentSetText, currentTextareaRef, onClick]
  );

  const handleLinkClick = useCallback(
    (e) => {
      if (currentTextareaRef?.current && currentSetText) {
        onClick("link")!;
      }
    },
    [currentSetText, currentTextareaRef, onClick]
  );

  const handleImageClick = useCallback(
    (e) => {
      if (currentTextareaRef?.current && currentSetText) {
        onClick("image")!;
      }
    },
    [currentSetText, currentTextareaRef, onClick]
  );

  const formattingActions = useMemo(
    () => [
      {
        icon: <Bold />,
        name: "bold",
        action: handleBoldClick,
      },
      {
        icon: <Italic />,
        name: "italic",
        action: handleItalicClick,
      },
      // {
      //     icon: <Underline />,
      //     name: 'underline',
      //     action: handleUnderlineClick
      // },
      {
        icon: <Link />,
        name: "hyperlink",
        action: handleLinkClick,
      },
      {
        icon: <ImageIcon />,
        name: "image",
        action: handleImageClick,
      },
    ],
    [handleBoldClick, handleImageClick, handleItalicClick, handleLinkClick]
  );

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
  );
};

export default FormattingIcons;
