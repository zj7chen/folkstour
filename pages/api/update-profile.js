import { GENDERS } from "client/choices";
import { selfIntroSchema, yup } from "client/validate";
import crypto from "crypto";
import { postApi } from "server/api";
import prisma from "server/prisma";
import { getSession } from "server/session";
import sharp from "sharp";

const schema = yup.object().shape({
  avatar: yup.string(),
  gender: yup.mixed().required().oneOf(Object.keys(GENDERS)),
  selfIntro: selfIntroSchema.required(),
});

export default postApi(schema, async ({ avatar, gender, selfIntro }, req) => {
  const { userId } = getSession(req);
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
});
