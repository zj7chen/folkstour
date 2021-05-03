function Avatar({ hash }) {
  // mw-100 = max width 100%
  return (
    <img src={hash ? `/api/image?hash=${hash}` : "/avatar_placeholder.png"} />
  );
}

export default Avatar;
