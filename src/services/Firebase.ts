import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyBMje3MibXrD-RKtYdbi2Cs_yQNgXm4SDM",
    authDomain: "signalingservice-b7bd1.firebaseapp.com",
    projectId: "signalingservice-b7bd1",
    storageBucket: "signalingservice-b7bd1.appspot.com",
    messagingSenderId: "965539403854",
    appId: "1:965539403854:web:b761caf37356aa7c1ecb1f"
};


const app = initializeApp(firebaseConfig);

const Firestore = getFirestore(app);

export {
    Firestore,
}