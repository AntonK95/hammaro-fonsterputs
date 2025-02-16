import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';

// Läs Firebase-nyckeln
const serviceAccount = JSON.parse(fs.readFileSync('./firebase-key.json', 'utf8'));

// Initiera Firebase
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Hämta alla bokningar

app.get('/bookings', async (req, res) => {
  try {
    const snapshot = await db.collection('bookings').get();
    const bookings = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log("Hämtade bookings:", bookings); // Lägg till denna rad
    res.json(bookings);
  } catch (error) {
    console.error("Fel vid hämtning:", error); // Logga fel
    res.status(500).json({ error: 'Något gick fel' });
  }
});

//  Hämta en specifik bokning baserat på ID
app.get('/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('bookings').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: `Ingen bokning hittades med id ${id}` });
    }

    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Fel vid hämtning av bokning:", error);
    res.status(500).json({ error: 'Något gick fel vid hämtning av bokning' });
  }
});

//  Lägg till en ny bokning
app.post('/bookings', async (req, res) => {
  try {
    const newBooking = req.body; // Tar emot JSON från frontend/Insomnia
    const docRef = await db.collection('bookings').add(newBooking);
    res.json({ id: docRef.id, ...newBooking });
  } catch (error) {
    console.error("Fel vid tillägg:", error);
    res.status(500).json({ error: 'Något gick fel vid tillägg av bokning' });
  }
});

//  Radera en bokning
app.delete('/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('bookings').doc(id).delete();
    res.json({ message: `Bokning med id ${id} raderad` });
  } catch (error) {
    console.error("Fel vid radering:", error);
    res.status(500).json({ error: 'Något gick fel vid radering av bokning' });
  }
});

//  Uppdatera en bokning
app.put('/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBooking = req.body;
    await db.collection('bookings').doc(id).update(updatedBooking);
    res.json({ id, ...updatedBooking });
  } catch (error) {
    console.error("Fel vid uppdatering:", error);
    res.status(500).json({ error: 'Något gick fel vid uppdatering av bokning' });
  }
});


app.listen(PORT, () => {
  console.log(`Servern körs på http://localhost:${PORT}`);
});
