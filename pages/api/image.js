import { yup } from "client/validate";
import { ClientError, getApi } from "server/api";
import prisma from "server/prisma";

const schema = yup.object().shape({
  hash: yup.string().required(),
});

export default getApi(schema, async ({ hash }, req, res) => {
  const image = await prisma.image.findUnique({
    select: {
      content: true,
    },
    where: {
      hash,
    },
  });
  if (!image) {
    throw new ClientError(404, "image not found");
  }
  res.setHeader("Content-Type", "image/png");
  res.setHeader(
    "Cache-Control",
    `public, max-age=${10 * 365 * 24 * 60 * 60}, immutable`
  );
  res.end(image.content);
});
