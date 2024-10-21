import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FB_API_KEY,
    authDomain: import.meta.env.VITE_FB_AUTH,
    projectId: import.meta.env.VITE_FB_PROJECT,
    storageBucket: import.meta.env.VITE_FB_STORAGE,
    messagingSenderId: import.meta.env.VITE_FB_MESSAGING,
    appId: import.meta.env.VITE_FB_APP,
    measurementId: import.meta.env.VITE_FB_MEASUREMENT,
};

const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
const auth = getAuth(app);

export { auth, provider };