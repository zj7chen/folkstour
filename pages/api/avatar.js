import prisma from "server/prisma";

async function handler(req, res) {
  if (req.method === "GET") {
    let { id } = req.query;
    id = parseInt(id);
    const { avatar } = await prisma.user.findUnique({
      select: {
        avatar: true,
      },
      where: {
        id,
      },
    });
    res.setHeader("Content-Type", "image/png");
    res.end(avatar);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

export default handler;
