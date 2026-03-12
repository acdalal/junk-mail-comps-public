import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "./firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

//sign up new user
export async function signUp(
  email: string,
  password: string,
  firstName?: string,
  lastName?: string,
) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    await updateProfile(user, { displayName: `${firstName} ${lastName}` });

    const userData = {
      uid: user.uid,
      firstName,
      lastName,
      email,
      createdAt: new Date().toISOString(),
    };

    //info we are storing
    if (firstName && lastName) {
      await setDoc(doc(db, "users", user.uid), userData);
    }

    return { success: true, user: { ...user, ...userData } };
  } catch (error: any) {
    console.error("Sign up error:", error);
    return { success: false, error: error.message };
  }
}

//signing in existing user
export async function signIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    console.error("Sign in error:", error);
    return { success: false, error: error.message };
  }
}

// send password reset email
export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
    console.error("Password reset error:", error);
    return { success: false, error: error.message };
  }
}

//sign out
export async function logOut() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    console.error("Sign out error:", error);
    return { success: false, error: error.message };
  }
}

//get user
export function getCurrentUser() {
  return auth.currentUser;
}

// returns the current user with their Expo push token (only if available)
export async function getCurrentUserWithToken(): Promise<
  (User & { expoPushToken?: string }) | null
> {
  const user = auth.currentUser;
  if (!user) return null;

  const userDoc = await getDoc(doc(db, "users", user.uid));
  const data = userDoc.data() || {};

  return { ...user, expoPushToken: data.expoPushToken };
}

//auth state changes
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
