import prisma from "server/prisma";

async function handler(req, res) {
  if (req.method === "GET") {
    const { hash } = req.query;
    const image = await prisma.image.findUnique({
      select: {
        content: true,
      },
      where: {
        hash,
      },
    });
    if (!image) {
      res.status(404).end();
      return;
    }
    res.setHeader("Content-Type", "image/png");
    res.setHeader(
      "Cache-Control",
      `public, max-age=${10 * 365 * 24 * 60 * 60}, immutable`
    );
    res.end(image.content);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

export default handler;
