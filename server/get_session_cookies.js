import admin from "server/server";

export async function getSessionCookies(req) {
  const sessionCookie = req.cookies.session || "";
  // firebase-admin
  const decodedClaims = await admin
    .auth()
    .verifySessionCookie(sessionCookie, true);
  return decodedClaims;
}
