import express from 'express';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { db } from "../db.js";
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Firebase-konfiguration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Initiera Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Inloggningsrutt
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log("Försöker logga in med:", { email, password });

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();

    const userDock = await db.collection('users').doc(userCredential.user.uid).get();
    if (!userDock.exists) {
      return res.status(403).json({ error: 'Användaren finns inte i databasen' });
    }
    console.log("Firebase UID vid inloggning: ", userCredential.user.uid);

    const userData = userDock.data();

    res.json({ idToken, user: userData });
  } catch (error) {
    console.error('Fel vid inloggning:', error, error.code, error.message);
    res.status(401).json({ error: 'Inloggning misslyckades', details: error.message });
  }
});

export default router;