function submit(url, body) {
  return fetch(url, {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(body),
  }).then((res) => {
    if (res.status === 200) return res.json();
    return res.json().then((r) => Promise.reject(r));
  });
}

export default submit;
