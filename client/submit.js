async function submit(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(body),
  });
  const resBody = await res.json();
  if (res.status === 401) {
    window.open("/login");
  }
  if (res.status !== 200) throw resBody;
  return resBody;
}

export default submit;
