import jwt from "jsonwebtoken";
import fs from "fs";

const PRIVATE_KEY = fs.readFileSync("private.key");
const PUBLIC_KEY = fs.readFileSync("public.pem");

export function getSession(req) {
  const token = req.cookies.session || "";
  return jwt.verify(token, PUBLIC_KEY, { algorithms: ["RS256"] });
}

export function setSession(res, userId) {
  const maxAge = 60 * 60 * 24 * 5;
  const token = jwt.sign({ userId }, PRIVATE_KEY, {
    algorithm: "RS256",
    expiresIn: maxAge * 1000,
  });
  res.setHeader(
    "Set-Cookie",
    `session=${token}; Max-Age=${maxAge}; HttpOnly; Secure; Path=/`
  );
}

export function clearSession(res, userId) {
  const maxAge = 60 * 60 * 24 * 5;
  res.setHeader(
    "Set-Cookie",
    `session=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; Path=/`
  );
}
