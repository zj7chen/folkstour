import prisma from "server/prisma";
import { withApiUser } from "server/session";

export default withApiUser(async (req, res, { userId }) => {
  console.log("1", req, res);
  if (req.method === "POST") {
    try {
      await prisma.reservation.create({
        data: {
          userId,
          tripId: req.body.tripId,
          status: "PENDING",
        },
      });
    } catch (e) {
      // TODO: find out exception type
      console.log(e);
      return;
    }

    res.json({});
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
});
