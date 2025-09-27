import express from "express";
import admin from "firebase-admin";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const router = express.Router();

/* ================= FIREBASE ADMIN INIT ================= */

// 1. Get the service account key from environment variables
const firebaseServiceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

// 2. Add a check to ensure the key exists before trying to parse it
if (!firebaseServiceAccountKey) {
  throw new Error(
    "FATAL ERROR: FIREBASE_SERVICE_ACCOUNT_KEY is not defined in the .env file."
  );
}

// 3. Parse the key and initialize Firebase Admin
try {
  const serviceAccount = JSON.parse(firebaseServiceAccountKey);

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
} catch (error) {
  console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:", error);
  throw new Error("The FIREBASE_SERVICE_ACCOUNT_KEY in your .env file is not valid JSON.");
}


const db = admin.firestore();

/* ================= ROUTES ================= */

// 1️⃣ Save User Info
router.post("/save-user", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { id, fullName, email } = req.body;
    const userRef = db.collection("users").doc(id);

    await userRef.set(
      {
        name: fullName,
        email,
        points: 0,
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );

    res.json({ success: true, message: "User saved in Firebase" });
  } catch (err) {
    console.error("Error saving user:", err);
    res.status(500).json({ error: "Failed to save user" });
  }
});

router.post("/add-points", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { userId, points } = req.body;
    if (!userId || points === undefined) {
        return res.status(400).json({ error: "userId and points are required."});
    }

    const userRef = db.collection("users").doc(userId);
    await userRef.update({
      points: admin.firestore.FieldValue.increment(points),
    });

    res.json({ success: true, message: `${points} points added!` });
  } catch (err) {
    console.error("Error adding points:", err);
    res.status(500).json({ error: "Failed to add points" });
  }
});


router.get("/user/:id", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const userId = req.params.id;
    const userRef = db.collection("users").doc(userId);
    const userSnap = await userRef.get();

    if (userSnap.exists) {
      res.json(userSnap.data());
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

export default router;
