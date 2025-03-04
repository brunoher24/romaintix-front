import { initializeApp } from "firebase/app";
// import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import {/*connectFirestoreEmulator,*/ getFirestore } from "firebase/firestore";
import { /*connectFunctionsEmulator, */getFunctions } from "firebase/functions";

const firebaseConfig = {
    apiKey: "AIzaSyCOAF3SYb9bXWH50hcXZfKLc_raOslQvto",
    authDomain: "romaintix-3666a.firebaseapp.com",
    projectId: "romaintix-3666a",
    storageBucket: "romaintix-3666a.firebasestorage.app",
    messagingSenderId: "121615299240",
    appId: "1:121615299240:web:b769a055004530ab26489d"
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
const functions = getFunctions(app, "europe-west1");

// if ('prod' !== process.env.REACT_APP_ENV) {
//     connectFirestoreEmulator(db, '127.0.0.1', 8080);
//     connectFunctionsEmulator(functions, "127.0.0.1", 5001);
// }
export { db, functions };

export default app;
