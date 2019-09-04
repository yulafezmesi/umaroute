import firebase from 'firebase'
import 'firebase/firebase-auth'
var firebaseConfig = {
    apiKey: "AIzaSyCrQVg-ZAdCxSgaAvRfsXZUlt8wHz1nSrs",
    authDomain: "routes-75247.firebaseapp.com",
    databaseURL: "https://routes-75247.firebaseio.com",
    projectId: "routes-75247",
    storageBucket: "",
    messagingSenderId: "1065734767549",
    appId: "1:1065734767549:web:1a768ae68c151937"
};
const fb = firebase.initializeApp(firebaseConfig);


export { fb }