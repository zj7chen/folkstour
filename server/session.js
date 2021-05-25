import fs from "fs";
import jwt from "jsonwebtoken";
import prisma from "server/prisma";
import { ClientError } from "./api";

const PRIVATE_KEY = fs.readFileSync("private.key");
const PUBLIC_KEY = fs.readFileSync("public.pem");

const COOKIE_OPTIONS =
  process.env.NODE_ENV === "development"
    ? "; HttpOnly; Path=/"
    : "; HttpOnly; Path=/; Secure";

export function getSession(req, { optional } = {}) {
  const token = req.cookies.session || "";
  if (!token) {
    if (optional) {
      return null;
    } else {
      throw new ClientError(401, "Not logged in");
    }
  }
  // TODO: catch and rethrow with ClientError
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
    `session=${token}; Max-Age=${maxAge}${COOKIE_OPTIONS}`
  );
}

export function clearSession(res) {
  res.setHeader(
    "Set-Cookie",
    `session=; Expires=Thu, 01 Jan 1970 00:00:00 GMT${COOKIE_OPTIONS}`
  );
}

export const withSessionProps =
  (f, { optional } = {}) =>
  async (context) => {
    const { req, resolvedUrl } = context;
    const session = getSession(req, { optional: true });

    if (!optional && !session) {
      const destination = `/login?${new URLSearchParams({
        redirect: resolvedUrl,
      })}`;
      return { redirect: { destination, permanent: false } };
    }

    const { props, ...rest } = await f({ ...context, session });

    let currentUser = null;
    if (session) {
      const id = session.userId;
      const { name, avatarHash } = await prisma.user.findUnique({
        select: {
          name: true,
          avatarHash: true,
        },
        where: {
          id,
        },
      });
      currentUser = {
        id,
        name,
        avatarHash,
      };
    }
    return {
      props: {
        ...props,
        currentUser,
      },
      ...rest,
    };
  };
