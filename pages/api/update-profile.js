import prisma from "server/prisma";
import { getSession } from "server/session";
import sharp from "sharp";
import crypto from "crypto";

// req.body: {selfIntro, avatar?}
async function handler(req, res) {
  if (req.method === "POST") {
    const { userId } = getSession(req);
    let { avatar, gender, selfIntro } = req.body;
    if (avatar) {
      const content = await sharp(Buffer.from(avatar, "base64"))
        .resize(480, 480)
        .png()
        .toBuffer();
      const hash = crypto.createHash("sha256").update(content).digest("hex");
      avatar = {
        connectOrCreate: {
          where: {
            hash,
          },
          create: {
            hash,
            content,
          },
        },
      };
    }
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
