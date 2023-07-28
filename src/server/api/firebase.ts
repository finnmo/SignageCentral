// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import { getStorage } from "firebase/storage";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCIHruNoEKYWwYt0UuRNlA-RBxfv6Hie2Q",
    authDomain: "signage-central-image-db.firebaseapp.com",
    projectId: "signage-central-image-db",
    storageBucket: "signage-central-image-db.appspot.com",
    messagingSenderId: "1004715892121",
    appId: "1:1004715892121:web:f3b06c252ffcf1067e8708",
    measurementId: "G-GHSYBXT2G1",
    serviceAccountId: 'firebase-adminsdk-o6zp5@signage-central-image-db.iam.gserviceaccount.com',
};

let app;
if (!firebase.apps.length) {
    app = firebase.initializeApp(firebaseConfig);
  } else {
    app = firebase.app();
  }

 export const storage = getStorage(app);
