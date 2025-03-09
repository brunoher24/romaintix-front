import { initializeApp } from "firebase/app";
// import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import {/*connectFirestoreEmulator,*/ getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD_IU-sy41NoUg4Yk7xRGvstSx7xcYzAUU",
    authDomain: "romaintix-d5a2a.firebaseapp.com",
    projectId: "romaintix-d5a2a",
    storageBucket: "romaintix-d5a2a.firebasestorage.app",
    messagingSenderId: "805700723203",
    appId: "1:805700723203:web:7f6d2c508c95f637cca436"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// if ('prod' === process.env.REACT_APP_ENV) {
//     initializeAppCheck(app, {
//         provider: new ReCaptchaV3Provider(process.env.REACT_APP_RECAPTCHA_APP_CHECK),
//         isTokenAutoRefreshEnabled: true
//     });
// }

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// if ('prod' !== process.env.REACT_APP_ENV) {
//     connectFirestoreEmulator(db, '127.0.0.1', 8080);
// }
export { db };

export default app;
