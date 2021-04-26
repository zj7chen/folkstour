import bcrypt from "bcrypt";
import prisma from "server/prisma";
import { setSession } from "server/session";

async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password, name, gender } = req.body;
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    let user;
    try {
      user = await prisma.user.create({
        data: {
          email,
          password: hash,
          name,
          gender,
        },
      });
    } catch (error) {
      console.log("Error creating new user:", error);
      res.status(404).json({ message: error.message });
      return;
    }
    console.log("Successfully created new user:", user.id);
    setSession(res, user.id);
    res.json({});
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

export default handler;
