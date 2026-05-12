import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// import { initializeAuth, getReactNativePersistence} from '@firebase/auth';
import { initializeAuth } from '@firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
//@ts-ignore
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';


// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBOwbEFzAMjKGWRFBekvstSkeyvY_oB_n4",
  authDomain: "junk-mail-comps.firebaseapp.com",
  projectId: "junk-mail-comps",
  storageBucket: "junk-mail-comps.firebasestorage.app",
  messagingSenderId: "906231894382",
  appId: "1:906231894382:android:3f5b2c7d2a401653cdb17f",
  measurementId: "G-P9FH9H7QZK"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, 
  {
  persistence: getReactNativePersistence(AsyncStorage)
}
);

export { db, auth };
