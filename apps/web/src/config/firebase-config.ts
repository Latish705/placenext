// firebase-config.js
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

// Firebase configuration, environment variables are used here for security
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Initialize Firebase Auth
export const auth = getAuth();

// Set persistence to keep user logged in across sessions
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Persistence set to local");
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

// Sign-in with Google and handle tokens
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    // Check if a user is already signed in
    if (auth.currentUser) {
      await signOut(auth); // Sign-out the currently signed-in user if present
    }

    // Proceed with Google sign-in
    const result = await signInWithPopup(auth, provider);
    const newUser = result.user;

    // Force refresh the token to ensure it's for the new user
    const token = await newUser.getIdToken(true);

    // Firebase manages refresh tokens internally, but here's how to access it
    //@ts-ignore
    const refreshToken = newUser.stsTokenManager.refreshToken;

    console.log("User:", newUser);
    console.log("Access Token:", token);
    console.log("Refresh Token:", refreshToken); // Not necessary to log in production

    // Return both tokens if needed
    return { token, refreshToken };
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    throw new Error("Sign-in failed. Please try again.");
  }
};

// Sign up with email and password, and send email verification
export const signUpAndVerifyEmail = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Send verification email
    await sendEmailVerification(user);
    console.log("Verification email sent to", email);

    // Return the refresh token
    //@ts-ignore
    return user.stsTokenManager.refreshToken;
  } catch (error) {
    console.error("Error signing up:", error);
    throw new Error("Sign-up failed. Please try again.");
  }
};

// Check if the current user's email is verified
export const isUserVerified = () => {
  const user = auth.currentUser;
  if (user) {
    return user.emailVerified;
  }
  return false;
};

// Firebase Auth state listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    console.log("User signed in:", user);

    // Get the token for the currently signed-in user
    user.getIdToken().then((token) => {
      console.log("Current user's token:", token);
    });
  } else {
    // No user is signed in
    console.log("No user signed in");
  }
});

// Sign out the current user
export const logout = async () => {
  try {
    const currentUser = auth.currentUser;
    console.log("Current user:", currentUser);

    if (currentUser) {
      await signOut(auth);
      console.log("User signed out");
    } else {
      console.log("No user is currently signed in, cannot sign out.");
    }
  } catch (error) {
    console.error("Error during sign-out:", error);
  }
};

export default firebase;
