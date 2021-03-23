import firebase from "firebase/app";
import "firebase/auth";

if (firebase.apps.length == 0) {
  firebase.initializeApp({
    apiKey: "AIzaSyDlWVf2gV4K4SziB4E9v73xsF7uT_bXIBM",
    authDomain: "tripmate-e1c26.firebaseapp.com",
    projectId: "tripmate-e1c26",
    storageBucket: "tripmate-e1c26.appspot.com",
    messagingSenderId: "579896149557",
    appId: "1:579896149557:web:84a31829b3ebcce3d7937c",
  });

  // Do not persist any state server side.
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
}

export default firebase;
