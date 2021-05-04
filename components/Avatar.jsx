function Avatar({ hash }) {
  return (
    <img src={hash ? `/api/image?hash=${hash}` : "/avatar_placeholder.png"} />
  );
}

export default Avatar;
