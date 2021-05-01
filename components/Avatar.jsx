function Avatar({ id }) {
  // mw-100 = max width 100%
  return <img src={`/api/avatar?id=${id}`} className="d-block mw-100" />;
}

export default Avatar;
