
import { body, validationResult } from 'express-validator';


// Middleware för att validera inkommande data
const validateUser = [
    body('email').isEmail().withMessage('Ogiltig e-postadress'),
    body('password')
      .isLength({ min: 8 })
      .matches(/[A-Z]/).withMessage('Lösenordet måste innehålla minst en stor bokstav')
      .matches(/[a-z]/).withMessage('Lösenordet måste innehålla minst en liten bokstav')
      .matches(/\d/).withMessage('Lösenordet måste innehålla minst en siffra')
      .matches(/[@$!%*?&]/).withMessage('Lösenordet måste innehålla minst ett specialtecken'),
    body('phone').matches(/^(\+46|0)[1-9][0-9\s-]{6,11}$/).withMessage('Ogiltigt telefonnummer'),
  ];

  export default validateUser;