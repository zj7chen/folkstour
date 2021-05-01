import prisma from "server/prisma";
import { getSession } from "server/session";

// req.body: {selfIntro, avatar?}
async function handler(req, res) {
  if (req.method === "POST") {
    const { userId } = getSession(req);
    const { gender, selfIntro } = req.body;
    const avatar = req.body.avatar
      ? Buffer.from(req.body.avatar, "base64")
      : undefined;
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        gender,
        selfIntro,
        avatar,
      },
    });
    res.json({});
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

export default handler;
