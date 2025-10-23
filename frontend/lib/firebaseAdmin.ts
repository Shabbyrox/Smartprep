import * as admin from "firebase-admin";

// Make sure your .env.local has FIREBASE_SERVICE_ACCOUNT_KEY
// This is a JSON object, not just a key.
// You must get this from your Google Cloud project service accounts.
const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
);

// Check if app is already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const adminDb = admin.firestore();
const adminAuth = admin.auth(); // <-- This is needed for the token route

export { adminDb, adminAuth }; // <-- Export both

