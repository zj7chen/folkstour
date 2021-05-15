import crypto from "crypto";
import prisma from "server/prisma";
import { withApiUser } from "server/session";
import sharp from "sharp";

// req.body: {selfIntro, avatar?}
export default withApiUser(async (req, res, { userId }) => {
  if (req.method === "POST") {
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
});
