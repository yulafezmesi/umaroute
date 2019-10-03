import firebase from 'firebase'
import 'firebase/firebase-auth'
var firebaseConfig = {
    apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
    authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
    storageBucket: "",
    messagingSenderId: "1065734767549",
    appId: process.env.VUE_APP_FIREBASE_APP_ID,
};
const fb = firebase.initializeApp(firebaseConfig);


export { fb }