import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

// Ensure FIREBASE_CREDENTIALS is properly loaded and parsed
if (!process.env.FIREBASE_CREDENTIALS) {
  throw new Error("FIREBASE_CREDENTIALS environment variable is not set");
}

const FIREBASE_CREDENTIALS = JSON.parse(process.env.FIREBASE_CREDENTIALS as string);

admin.initializeApp({
  credential: admin.credential.cert(FIREBASE_CREDENTIALS),
});

export default admin;



// import * as admin from "firebase-admin";
// // import dotenv from "dotenv";
// import * as dotenv from 'dotenv';

// dotenv.config();

// const FIREBASE_CREDENTIALS = JSON.parse(
//   process.env.FIREBASE_CREDENTIALS as string
// );

// admin.initializeApp({
//   credential: admin.credential.cert(FIREBASE_CREDENTIALS),
// });

// export default admin;
