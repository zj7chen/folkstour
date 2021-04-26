import { useState } from "react";
import RichTextEditor from "react-rte";

const toolbarConfig = {
  display: ["INLINE_STYLE_BUTTONS", "BLOCK_TYPE_BUTTONS", "HISTORY_BUTTONS"],
  INLINE_STYLE_BUTTONS: [
    { label: "Bold", style: "BOLD" },
    { label: "Italic", style: "ITALIC" },
    { label: "Strikethrough", style: "STRIKETHROUGH" },
    { label: "Monospace", style: "CODE" },
    { label: "Underline", style: "UNDERLINE" },
  ],
  BLOCK_TYPE_BUTTONS: [
    { label: "UL", style: "unordered-list-item" },
    { label: "OL", style: "ordered-list-item" },
    { label: "Blockquote", style: "blockquote" },
  ],
};

function MarkdownEditor({ initialValue, onChange }) {
  const [value, setValue] = useState(() =>
    RichTextEditor.createValueFromString(initialValue, "markdown")
  );
  return (
    <RichTextEditor
      value={value}
      onChange={(value) => {
        setValue(value);
        onChange(value.toString("markdown"));
      }}
      toolbarConfig={toolbarConfig}
    />
  );
}

export default MarkdownEditor;
