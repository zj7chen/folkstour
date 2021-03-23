import admin from "firebase-admin";

// If not initialized, then load firebase
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

export default admin;
