
import express from 'express';
import { db } from '../db.js';
import { getAuth } from 'firebase-admin/auth';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(express.json());

// Hämta alla användare
router.get('/', async (req, res) => { 
  try {
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log("Hämtade users:", users); 
    res.json(users);
  } catch (error) {
    console.error("Fel vid hämtning:", error);
    res.status(500).json({ error: 'Något gick fel', message: error.message });
  }
});

// Hämta en specifik användre
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('users').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: `Ingen användre hittades med id ${id}` });
    }

    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Fel vid hämtning av användre:", error);
    res.status(500).json({ error: 'Något gick fel vid hämtning av användre', message: error.message });
  }
});

router.post('/', async (req, res) => { 
  try {
    const { email, password, firstname, lastname, phone, address, type, role } = req.body;

    if (!email || !password || !firstname || !lastname || !phone || !address || !type || !role) {
      return res.status(400).json({ error: 'Alla fält måste fyllas i' });
    }

    // Skapa användaren i Firebase Authentication
    const userRecord = await getAuth().createUser({
      email,
      password,
    });

    const userData = {
      email,
      role,
      firstname,
      lastname,
      phone,
      address,
      type,
    };

    await db.collection('users').doc(userRecord.uid).set(userData);

    res.status(201).json({ message: 'Användare skapad', id: userRecord.uid, ...userData });
  } catch (error) {
    console.error("Fel vid skapande av användare:", error);
    res.status(500).json({ error: 'Något gick fel vid skapande av användare', message: error.message });
  }
});

// Radera en användre
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('users').doc(id).delete();
    res.json({ message: `Användare med id ${id} raderad` });
  } catch (error) {
    console.error("Fel vid radering:", error);
    res.status(500).json({ error: 'Något gick fel vid radering av användare' });
  }
});

// Uppdatera en användre
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = req.body;

    const userDoc = await db.collection('users').doc(id).get();
    if(!userDoc.exists) {
      return res.status(404).json({ error: `Ingen användare med id ${id} hittades i databasen`});
    }
    
    await db.collection('users').doc(id).update(updatedUser);
    res.json({ id, ...updatedUser });
  } catch (error) {
    console.error("Fel vid uppdatering:", error);
    res.status(500).json({ error: 'Något gick fel vid uppdatering av användare' });
  }
});

export default router;
