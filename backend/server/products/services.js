import express from 'express';
import { db } from '../db.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.use(express.json());

// Hämta alla produkter
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('products').get();
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(products);
  } catch (error) {
    console.error("Fel vid hämtning av produkter:", error);
    res.status(500).json({ error: 'Något gick fel vid hämtning av produkter' });
  }
});

// Hämta en specifik produkt
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('products').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: `Ingen produkt hittades med id ${id}` });
    }

    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Fel vid hämtning av produkt:", error);
    res.status(500).json({ error: 'Något gick fel vid hämtning av produkt' });
  }
});

// Skapa en ny produkt (endast admin)
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { serviceName, description, timePerUnit, priceRange, quantityRange } = req.body;

    if (!serviceName || !description || !timePerUnit || !priceRange || !quantityRange) {
      return res.status(400).json({ error: 'Alla fält måste fyllas i' });
    }

    const newProduct = {
      serviceName,
      description,
      timePerUnit,
      priceRange,
      quantityRange
    };

    const docRef = await db.collection('products').add(newProduct);
    res.status(201).json({ id: docRef.id, ...newProduct });
  } catch (error) {
    console.error("Fel vid skapande av produkt:", error);
    res.status(500).json({ error: 'Något gick fel vid skapande av produkt' });
  }
});

// Uppdatera en produkt (endast admin)
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = req.body;

    const productDoc = await db.collection('products').doc(id).get();
    if (!productDoc.exists) {
      return res.status(404).json({ error: `Ingen produkt med id ${id} hittades i databasen` });
    }

    await db.collection('products').doc(id).update(updatedProduct);
    res.json({ id, ...updatedProduct });
  } catch (error) {
    console.error("Fel vid uppdatering av produkt:", error);
    res.status(500).json({ error: 'Något gick fel vid uppdatering av produkt' });
  }
});

// Radera en produkt (endast admin)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('products').doc(id).delete();
    res.json({ message: `Produkten med id ${id} har raderats` });
  } catch (error) {
    console.error("Fel vid radering av produkt:", error);
    res.status(500).json({ error: 'Något gick fel vid radering av produkt' });
  }
});

export default router;
