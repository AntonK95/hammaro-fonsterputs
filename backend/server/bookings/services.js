
import express from 'express';
import { db } from '../db.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import userRouter from '../users/services.js';
import authRouter from '../middlewares/authUser.js';

const router = express.Router();

// Använd använderrutter
router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use(express.json());

// Hämta alla bokningar
router.get('/', async (req, res) => { 
  try {
    const snapshot = await db.collection('bookings').get();
    const bookings = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log("Hämtade bookings:", bookings); 
    res.json(bookings);
  } catch (error) {
    console.error("Fel vid hämtning:", error);
    res.status(500).json({ error: 'Något gick fel' });
  }
});

// Hämta en specifik bokning
router.get('/:id', async (req, res) => {
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

// Lägg till en ny bokning
router.post('/', async (req, res) => { 
  try {
    const newBooking = req.body;
    const docRef = await db.collection('bookings').add(newBooking);
    res.json({ id: docRef.id, ...newBooking });
  } catch (error) {
    console.error("Fel vid tillägg:", error);
    res.status(500).json({ error: 'Något gick fel vid tillägg av bokning' });
  }
});

// Radera en bokning (skyddad rutt)
router.delete('/bookings/:id', authenticate, authorize('admin', 'staff'), async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('bookings').doc(id).delete();
    res.json({ message: `Bokning med id ${id} raderad` });
  } catch (error) {
    console.error("Fel vid radering:", error);
    res.status(500).json({ error: 'Något gick fel vid radering av bokning' });
  }
});

// Uppdatera en bokning (skyddad rutt)
router.put('/:id', authenticate, authorize('admin', 'staff'), async (req, res) => {
  console.log("Uppdatera bokning med ID: ", req.params.id);
  console.log("Data som skickas:", req.body);
  console.log("Token: ", req.headers.authorization);
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

export default router;
