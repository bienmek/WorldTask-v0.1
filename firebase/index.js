import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore"
import {initializeApp} from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyBK69eKBrOp3WUmoruEHnblILKI9fVMg44",
    authDomain: "worldtask-test.firebaseapp.com",
    projectId: "worldtask-test",
    storageBucket: "worldtask-test.appspot.com",
    messagingSenderId: "307170719486",
    appId: "1:307170719486:web:c8317245d1440ec6efd7af",
    measurementId: "G-LC7EMFQCNT"
};

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
