import express from 'express';
import cors from 'cors';
import bookingsRouter from './server/bookings/services.js';
import usersRouter from './server/users/services.js';
import authRouter from './server/middlewares/authUser.js';
import { authenticate } from './server/middlewares/authMiddleware.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/bookings', bookingsRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);


// Skyddad rutt för att testa autentisering
// app.get('/protected', authenticate, (req, res) => {
//   res.json({ message: 'Access granted', user: req.user });
// });

app.use((req, res, next) => {
  console.log(`Mottagen begäran: ${req.method} ${req.url}`);
  next();
});


app.listen(PORT, () => {
  console.log(`Servern körs på http://localhost:${PORT}`);
});
