import fs from "fs";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { ClientError } from "server/api";
import prisma from "server/prisma";

const PRIVATE_KEY = fs.readFileSync("private.key");
const PUBLIC_KEY = fs.readFileSync("public.pem");

const COOKIE_OPTIONS = [
  "HttpOnly",
  "Path=/",
  ...(process.env.NODE_ENV === "production" ? ["Secure"] : []),
];

export function getSession(req, { optional } = {}) {
  const token = req.cookies.session || "";
  let session = null;
  if (token) {
    try {
      session = jwt.verify(token, PUBLIC_KEY, { algorithms: ["RS256"] });
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        // ignore
      } else {
        throw e;
      }
    }
  }
  if (!session && !optional) {
    throw new ClientError(401, "Not logged in");
  }
  return session;
}

export function setSession(res, userId, { remember }) {
  // 5 days
  const maxAge = 60 * 60 * 24 * 5;
  const token = jwt.sign({ userId }, PRIVATE_KEY, {
    algorithm: "RS256",
    expiresIn: maxAge,
  });
  res.setHeader(
    "Set-Cookie",
    [
      `session=${token}`,
      ...COOKIE_OPTIONS,
      ...(remember ? [`Max-Age=${maxAge}`] : []),
    ].join("; ")
  );
}

export function clearSession(res) {
  res.setHeader(
    "Set-Cookie",
    [
      "session=",
      ...COOKIE_OPTIONS,
      "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
    ].join("; ")
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
