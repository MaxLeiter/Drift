import type { RefObject } from "react";

const useFormattingClick = ({
  currentTextareaRef,
  currentSetText,
}: {
  currentTextareaRef?: RefObject<HTMLTextAreaElement>;
  currentSetText?: (text: string) => void;
}) => {
  const onClick = (type?: string) => {
    if (currentTextareaRef?.current && currentSetText) {
      const selectionStart = currentTextareaRef.current.selectionStart;
      const selectionEnd = currentTextareaRef.current.selectionEnd;
      const text = currentTextareaRef.current.value;
      const before = text.substring(0, selectionStart);
      const after = text.substring(selectionEnd);
      const selectedText = text.substring(selectionStart, selectionEnd);

      switch (type) {
        case "bold": {
          const newText = `${before}**${selectedText}**${after}`;
          currentSetText(newText);
          break;
        }
        case "italic": {
          const newText = `${before}*${selectedText}*${after}`;
          currentSetText(newText);
          break;
        }
        case "link": {
          let formattedText = "";
          if (selectedText.includes("http")) {
            formattedText = `[](${selectedText})`;
          } else {
            formattedText = `[${selectedText}](https://)`;
          }
          const newText = `${before}${formattedText}${after}`;
          currentSetText(newText);
          break;
        }
        case "image": {
          let formattedText = "";
          if (selectedText.includes("http")) {
            formattedText = `![](${selectedText})`;
          } else {
            formattedText = `![${selectedText}](https://)`;
          }
          const newText = `${before}${formattedText}${after}`;
          currentSetText(newText);
          break;
        }
      }
      if (type === "bold") {
        currentTextareaRef.current.focus();
        currentTextareaRef.current.setSelectionRange(
          before.length + 2,
          before.length + 2 + selectedText.length,
        );
      }
      if (type === "italic" || type === "link" || type === "image") {
        currentTextareaRef.current.focus();
        currentTextareaRef.current.setSelectionRange(
          before.length + 1,
          before.length + 1 + selectedText.length,
        );
      }
    }
  };

  return { currentTextareaRef, currentSetText, onClick };
};

export default useFormattingClick;
