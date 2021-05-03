import prisma from "server/prisma";
import { setSession } from "server/session";
import bcrypt from "bcrypt";

async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;
    // When the user signs in with email and password.
    const user = await prisma.user.findUnique({
      select: {
        id: true,
        password: true,
      },
      where: {
        email,
      },
    });
    if (!(await bcrypt.compare(password, user.password))) {
      res.status(401).send({ message: "Unauthorized" });
      return;
    }

    setSession(res, user.id);
    res.json({});
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

export default handler;
