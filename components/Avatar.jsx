function Avatar({ content }) {
  // mw-100 = max width 100%
  return <img src={`data:image/png;base64,${content}`} className="mw-100" />;
}

export default Avatar;
