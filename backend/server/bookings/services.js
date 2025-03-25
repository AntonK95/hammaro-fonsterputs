
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

// Hämta alla bekräftade bokningar (status: confirmed)
router.get('/calendar', async (req, res) => {
  try {
    // Hämta alla bokningar som är bekräftade/ har status confirmed
    const snapshot = await db.collection('bookings')
      .where("status", "==", "confirmed").get();

    if (snapshot.empty) {
      return res.json([]);
    }

    const confirmedBookings = snapshot.docs.map(doc => ({
      id: doc.id,
      confirmedDate: doc.data().confirmedDate,
      duration: doc.data().totalDuration
    }));

    res.json(confirmedBookings);
  } catch (error) {
    console.error("Fel vid hämtning av bekräftade bokningar:", error);
    res.status(500).json({ error: 'Något gick fel' });
  }
});

// Hämta alla bokningar
router.get('/', authenticate, authorize('admin', 'staff'), async (req, res) => { 
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
router.get('/:id', authenticate, authorize('admin', 'staff'), async (req, res) => {
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

// Lägg till en ny bokning (både gäster och inloggade användare)
router.post('/', authenticate, async (req, res) => { 
  try {
    const { requestedDate, items, notes } = req.body;

    // Kontrollera att items finns
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Minst en produkt/tjänst måste väljas' });
    }

    // Hämta customerId och användarinformation från inloggad användare
    let userInfo = {};
    console.log("req.user :", req.user);
    if (req.user) {
      const userDoc = await db.collection('users').doc(req.user.uid).get();
      console.log("userDoc: ", userDoc.data());
      if (userDoc.exists) {
        userInfo = userDoc.data();
        console.log("userInfo: ", userInfo);
      } else {
        return res.status(403).json({ error: 'Access denied - Användaren finns inte i databasen' });
      }
    }

    // Om användaren är inloggad, använd deras information. Annars, använd det som skickas från frontend
    const firstname = userInfo.firstname || req.body.firstname;
    const lastname = userInfo.lastname || req.body.lastname;
    const email = userInfo.email || req.body.email;
    const phone = userInfo.phone || req.body.phone;
    const address = userInfo.address || {
      street: req.body.address.street,
      postalCode: req.body.address.postalCode,
      city: req.body.address.city
    };

    // Kontrollera att vi har alla nödvändiga fält
    if (!firstname || !lastname || !email || !phone || !address.street || !address.postalCode || !address.city) {
      console.error("userInfo: ", userInfo, { firstname, lastname, email, phone, address });
      return res.status(400).json({ error: 'Alla kontaktuppgifter måste vara ifyllda' });
    }

    const newBooking = { 
      firstname,
      lastname,
      email,
      phone,
      address,
      customerId: req.user ? req.user.uid : null, // Använd customerId från token eller sätt till null
      requestedDate, 
      confirmedDate: null, // Bekräftat datum sätts när personal godkänner
      items, 
      totalDuration: calculateTotalDuration(items), 
      totalPrice: calculateTotalPrice(items), 
      status: 'pending', 
      notes: notes || "", 
      createdAt: new Date().toISOString() 
    };

    // Spara bokningen i Firestore
    const docRef = await db.collection('bookings').add(newBooking);

    res.json({ id: docRef.id, ...newBooking });
  } catch (error) {
    console.error("Fel vid tillägg:", error);
    res.status(500).json({ error: 'Något gick fel vid tillägg av bokning' });
  }
});

// Hjälpfunktioner för att beräkna total duration och price
const calculateTotalDuration = (items) => {
  return items.reduce((total, item) => {
    if (item.timePerUnit && item.quantity) {
      return total + item.timePerUnit * item.quantity;
    }
    return total;
  }, 0);
};

const calculateTotalPrice = (items) => {
  return items.reduce((total, item) => {
    if (item.price) {
      return total + item.price;
    }
    return total;
  }, 0);
};


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
