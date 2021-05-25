import ReactMarkdown from "react-markdown";

function MarkdownViewer({ value }) {
  return (
    <ReactMarkdown
      allowedElements={[
        "strong",
        "em",
        "ul",
        "ol",
        "code",
        "blockquote",
        "li",
        "p",
      ]}
      skipHtml
    >
      {value}
    </ReactMarkdown>
  );
}

export default MarkdownViewer;
