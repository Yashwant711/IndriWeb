// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "",
  authDomain: "indri-3095b.firebaseapp.com",
  databaseURL: "https://indri-3095b-default-rtdb.firebaseio.com",
  projectId: "indri-3095b",
  storageBucket: "indri-3095b.appspot.com",
  messagingSenderId: "892390390635",
  appId: "1:892390390635:web:ae801241ee6ccc4961ea2e",
  measurementId: "G-LLEBJW7Z16"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
// const analytics = getAnalytics(app);

export default database;