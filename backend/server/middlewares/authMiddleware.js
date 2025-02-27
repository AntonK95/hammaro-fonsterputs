// authMiddlewate.js
import { getAuth } from 'firebase-admin/auth';
import { db } from '../db.js';

const authenticate = async (req, res, next) => {
    console.log("Req headers: ", req.headers);
    try {
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    console.log("Received token: ", idToken);

    if (!idToken) {
        // Om ingen token finns, req.user = null och gå vidare
        req.user = null; // Detta är så att gäster skall kunna lägga beställningar
        return next();
    //   return res.status(401).json({ error: 'Unauthorized - ingen token' });
    }
  
      const decodedToken = await getAuth().verifyIdToken(idToken);
      req.user = { uid: decodedToken.uid, role: null};
      console.log("Decoded token: ", decodedToken); // Loggar decoded token
  
      // Hämta användarens roll från Firestore
      const userDoc = await db.collection('users').doc(decodedToken.uid).get();
      console.log("User document: ", userDoc.data());
      if (!userDoc.exists) {
        return res.status(403).json({ error: 'Access denied - Användaren finns inte i databasen' });
      }
  
      const userRole = userDoc.data().role;
      console.log("User role: ", userRole, "Type:", typeof userRole);
    //   if(userRole !== 'admin' && userRole !== 'staff') {
    //     console.log("Access denied - user role is: ", userRole);
    //     return res.status(403).json({ error: 'Access denied - Användaren har inte rättigheter'});
    //   }

      req.user.role = userRole; // Lägg till roll i req.user
      console.log("authenticate User role: ", req.user.role);
      next();
    } catch (error) {
      console.error('Fel vid autentisering:', error);
      res.status(401).json({ error: 'Unauthorized' });
    }
  };
  
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        console.log("authorize User role: ", req.user.role);
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied' });
        }
        next();
    };
};
  

export { authenticate, authorize };
