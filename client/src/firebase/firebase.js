import firebase from "firebase/app";
import "firebase/auth";

const config = {
  apiKey: "AIzaSyDGe968zxNTwXMPHsQzlVIC7YL3JOnnkDw",
  authDomain: "picapoint-dashboard.firebaseapp.com",
  databaseURL: "https://picapoint-dashboard.firebaseio.com",
  projectId: "picapoint-dashboard",
  storageBucket: "picapoint-dashboard.appspot.com",
  messagingSenderId: "357023800747"
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const auth = firebase.auth();

export { auth };
