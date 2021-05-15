import { clearSession } from "server/session";

async function handler(req, res) {
  if (req.method === "POST") {
    clearSession(res);
    res.json({});
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

export default handler;
