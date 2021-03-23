import admin from "server/server";
import prisma from "server/prisma";

function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;
    return admin
      .auth()
      .createUser({ email, password })
      .then((userRecord) => {
        return prisma.user
          .create({
            data: {
              id: userRecord.uid,
            },
          })
          .then(() => {
            console.log("Successfully created new user:", userRecord.uid);
            res.status(200).end();
          });
      })
      .catch((error) => {
        console.log("Error creating new user:", error);
        res.status(404).json({ message: error.message });
      });
  } else {
    res.status(405).end();
  }
}

export default handler;
