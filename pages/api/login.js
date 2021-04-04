import admin from "server/server";
import firebase from "server/client";

function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;
    // When the user signs in with email and password.
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(({ user }) => {
        // Get the user's ID token as it is needed to exchange for a session cookie.
        return user.getIdToken();
      })
      .then((idToken) => {
        const maxAge = 60 * 60 * 24 * 5;
        return admin
          .auth()
          .createSessionCookie(idToken, { expiresIn: maxAge * 1000 })
          .then((sessionCookie) => {
            res.setHeader(
              "Set-Cookie",
              `session=${sessionCookie}; Max-Age=${maxAge}; HttpOnly; Secure; Path=/`
            );
            res.json({});
            // A page redirect would suffice as the persistence is set to NONE.
            return firebase.auth().signOut();
          });
      })
      .catch((error) => {
        console.log(error);
        res.status(401).send({ message: "Unauthorized" });
      });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

export default handler;
