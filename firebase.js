import * as firebase from "firebase";
import "firebase/firebase-firestore";

 // Your web app's Firebase configuration
 var firebaseConfig = {
  apiKey: "AIzaSyBezkELNu-TfdbkE0px0bMDLsMKLZiwNAY",
  authDomain: "mycard-93892.firebaseapp.com",
  databaseURL: "https://mycard-93892.firebaseio.com",
  projectId: "mycard-93892",
  storageBucket: "mycard-93892.appspot.com",
  messagingSenderId: "1062565496260",
  appId: "1:1062565496260:web:0aebd10f0fa015d0"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var firestore = firebase.firestore();

export default firestore;
