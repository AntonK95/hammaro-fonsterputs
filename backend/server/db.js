import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import 'dotenv/config';

// Läs Firebase-nyckeln och initiera Firebase
const serviceAccount = JSON.parse(fs.readFileSync('./firebase-key.json', 'utf8'));

initializeApp({ credential: cert(serviceAccount) });

const db = getFirestore();

export {db};
