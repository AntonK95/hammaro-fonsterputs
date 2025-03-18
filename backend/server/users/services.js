
import express from 'express';
import { db } from '../db.js';
import { getAuth } from 'firebase-admin/auth';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import validateUser from '../middlewares/validateUser.js';
import { validationResult } from 'express-validator';

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

// En fristående route för att registrera en anändare som kund
router.post('/register', validateUser, async (req, res) => { 
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()});
  }
  try {
    const { email, password, firstname, lastname, phone, street, postalCode, city, type } = req.body;
    
    // Kanske inte behöver denna if sats då vi nu har validateUSer
    if (!email || !password || !firstname || !lastname || !phone || !street || !postalCode || !city || !type) {
      return res.status(400).json({ error: 'Alla fält måste fyllas i' });
    }

    // Skapa användaren i Firebase Authentication
    const userRecord = await getAuth().createUser({ email, password });

    const address = {
      street,
      postalCode,
      city
    }

    const userData = {
      email,
      role: 'customer',  // Endast customer kan registrera sig
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


router.post('/', authenticate, authorize('admin'), validateUser, async (req, res) => { 
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()});
  }
  try {
    const { email, password, firstname, lastname, phone, address, type, role } = req.body;

    // Kanske inte behöver denna if sats då vi nu har validateUSer
    if (!email || !password || !firstname || !lastname || !phone || !address || !type || !role) {
      return res.status(400).json({ error: 'Alla fält måste fyllas i' });
    }

    // Om användaren inte är inloggad och inte har rollen admin
    // Kanske inte behöver detta då vi har authorize('admin') på detta anrop.
    if(!req.user ||  req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Accenss denied - endast admin kan skapa användare med rollen staff'})
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
router.put('/:id', authenticate, validateUser, async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()});
  }
  try {
    const { id } = req.params;
    const updatedUser = req.body;

    console.log("Inloggad användare UID:", req.user.uid);
    console.log("Försöker uppdatera användare med ID:", id);

    if (req.user.role !== "admin" && req.user.uid !== id) {
      return res
        .status(403)
        .json({
          error:
            "Access denied - Du har inte rättigheter att uppdatera användaren",
        });
    }

    const userDoc = await db.collection("users").doc(id).get();
    if (!userDoc.exists) {
      return res
        .status(404)
        .json({ error: `Ingen användare med id ${id} hittades i databasen` });
    }

    // Om e-postadress har ändrats
    // Detta måste göras så att mail uppdateras både i Firebase Authentication och i Firestore
    if (updatedUser.email && updatedUser.email !== userDoc.data().email) {
      await getAuth().updateUser(id, {
        email: updatedUser.email,
      });
    }

    await db.collection("users").doc(id).update(updatedUser);
    res.json({ id, ...updatedUser });
  } catch (error) {
    console.error("Fel vid uppdatering:", error);
    res.status(500).json({ error: 'Något gick fel vid uppdatering av användare' });
  }
});

export default router;
