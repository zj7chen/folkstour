import prisma from "server/prisma";
import admin from "server/server";

// req.body: {selfIntro, avatar?}
async function handler(req, res) {
  if (req.method === "POST") {
    const avatar = req.body.avatar
      ? Buffer.from(req.body.avatar, "base64")
      : undefined;
    console.log(avatar);
    const sessionCookie = req.cookies.session || "";
    // Verify the session cookie. In this case an additional check is added to detect
    // if the user's Firebase session was revoked, user deleted/disabled, etc.
    const decodedClaims = await admin
      .auth()
      .verifySessionCookie(sessionCookie, true);

    await prisma.user.update({
      where: {
        id: decodedClaims.uid,
      },
      data: {
        selfIntro: req.body.selfIntro,
        avatar,
      },
    });
    res.json({});
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

export default handler;
