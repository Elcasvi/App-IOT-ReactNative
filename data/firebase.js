// Initialize Firebase
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {

    apiKey: "AIzaSyCeicLSQJa0R729XlbWhgImQxsyuALV71I",

    authDomain: "iot-semanatec.firebaseapp.com",

    databaseURL: "https://iot-semanatec-default-rtdb.firebaseio.com",

    projectId: "iot-semanatec",

    storageBucket: "iot-semanatec.appspot.com",

    messagingSenderId: "1067490004176",

    appId: "1:1067490004176:web:86b644c745b9abe1c8a2d5",

    measurementId: "G-E9HYEH37M7"

  };
const app=initializeApp(firebaseConfig);
const database=getDatabase(app)
export default database



