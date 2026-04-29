import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// import { initializeAuth, getReactNativePersistence} from '@firebase/auth';
import { initializeAuth } from '@firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
//@ts-ignore
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';


// Firebase config
const firebaseConfig = {
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, 
  {
  persistence: getReactNativePersistence(AsyncStorage)
}
);

export { db, auth };
