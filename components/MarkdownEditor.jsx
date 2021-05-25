import { useState } from "react";
import RichTextEditor from "react-rte";
import styles from "./MarkdownEditor.module.css";

const toolbarConfig = {
  display: ["INLINE_STYLE_BUTTONS", "BLOCK_TYPE_BUTTONS", "HISTORY_BUTTONS"],
  INLINE_STYLE_BUTTONS: [
    { label: "Bold", style: "BOLD" },
    { label: "Italic", style: "ITALIC" },
    { label: "Monospace", style: "CODE" },
  ],
  BLOCK_TYPE_BUTTONS: [
    { label: "UL", style: "unordered-list-item" },
    { label: "OL", style: "ordered-list-item" },
    { label: "Blockquote", style: "blockquote" },
  ],
};

function MarkdownEditor({ initialValue, onChange, placeholder }) {
  const [value, setValue] = useState(() =>
    RichTextEditor.createValueFromString(initialValue, "markdown")
  );
  return (
    <RichTextEditor
      className={styles.editor}
      value={value}
      onChange={(value) => {
        setValue(value);
        onChange(value.toString("markdown"));
      }}
      placeholder={placeholder}
      toolbarConfig={toolbarConfig}
    />
  );
}

export default MarkdownEditor;
