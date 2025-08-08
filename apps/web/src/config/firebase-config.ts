// src/firebase-config.ts

import { initializeApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  User,
  Auth,
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Auth and set persistence
export const auth: Auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting persistence:", error);
});

/**
 * Signs in the user with Google. If a user is already signed in,
 * they will be signed out first to ensure a clean login flow.
 * @returns {Promise<{ token: string }>} An object containing the user's ID token.
 */
export const signInWithGoogle = async () => {
  if (auth.currentUser) {
    await signOut(auth); // Sign out existing user for a clean flow
  }
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();
    return { token };
  } catch (error: any) {
    console.error("Error during Google sign-in:", error.message);
    throw new Error("Google Sign-in failed. Please try again.");
  }
};

/**
 * Signs up a new user with email and password and sends a verification email.
 * @param email - The user's email.
 * @param password - The user's password.
 * @returns {Promise<User>} The created user object.
 */
export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Send verification email without blocking the sign-up process
    sendEmailVerification(userCredential.user).then(() => {
        console.log("Verification email sent to", email);
    });
    return userCredential.user;
  } catch (error: any) {
    console.error("Error signing up:", error.message);
    if (error.code === 'auth/email-already-in-use') {
        throw new Error('This email is already in use. Please log in.');
    }
    throw new Error("Sign-up failed. Please try again.");
  }
};

/**
 * Signs in a user with their email and password.
 * @param email - The user's email.
 * @param password - The user's password.
 * @returns {Promise<{ token: string }>} An object containing the user's ID token.
 */
export const signInWithEmail = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();
        return { token };
    } catch (error: any) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            throw new Error('Invalid email or password.');
        } else if (error.code === 'auth/invalid-email') {
            throw new Error('Please enter a valid email address.');
        }
        console.error("Error signing in:", error.message);
        throw new Error("Login failed. Please try again.");
    }
};


/**
 * Signs out the current user.
 */
export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out successfully.");
  } catch (error: any) {
    console.error("Error during sign-out:", error.message);
    throw new Error("Logout failed. Please try again.");
  }
};

/**
 * Gets the current user's ID token. The SDK automatically handles refreshing the token if it's expired.
 * @returns {Promise<string | null>} The user's ID token, or null if no user is signed in.
 */
export const getCurrentUserToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) {
    console.log("No user is currently signed in.");
    return null;
  }
  try {
    // getIdToken() automatically refreshes the token if it's expired.
    const token = await user.getIdToken();
    return token;
  } catch (error) {
    console.error("Error getting user token:", error);
    return null;
  }
};

/**
 * Checks if the current user's email is verified.
 * @returns {boolean} True if the user is signed in and their email is verified.
 */
export const isUserVerified = (): boolean => {
    return auth.currentUser?.emailVerified || false;
};


/**
 * A wrapper around onAuthStateChanged to listen for authentication state changes.
 * This should be used in a central part of your app (e.g., a root component or context).
 * @param callback - A function to be called when the auth state changes. It receives the User object or null.
 * @returns {import("firebase/auth").Unsubscribe} A function to unsubscribe the listener.
 */
export const onAuthStateChange = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};

export default app;