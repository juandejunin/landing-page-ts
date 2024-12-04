// import { Request, Response, NextFunction } from 'express';
// import validator from 'validator';

// export const validateUserRegistration = (req: Request, res: Response, next: NextFunction): void => {
//   const { nombre, email } = req.body;

//   // Validación de nombre (no vacío)
//   if (!nombre || nombre.trim().length === 0) {
//     res.status(400).json({ error: 'El nombre es obligatorio.' });
//     return; // Detener la ejecución aquí si la validación falla
//   }

//   // Validación de email (email válido)
//   if (!email || !validator.isEmail(email)) {
//     res.status(400).json({ error: 'El email no es válido.' });
//     return; // Detener la ejecución aquí si la validación falla
//   }

//   // Si las validaciones pasan, continua con la ejecución
//   next(); // Llama a la siguiente función en el ciclo de middleware
// };


import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import xss from 'xss';  // Usamos xss para sanitizar entradas

export const validateUserRegistration = (req: Request, res: Response, next: NextFunction): void => {
  const { nombre, email } = req.body;

  // Validación de nombre
  const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜ\s]+$/; // Permitir letras acentuadas y espacios
  if (!nombre || nombre.trim().length === 0) {
    res.status(400).json({ error: 'El nombre es obligatorio.' });
    return;
  }
  if (!nombreRegex.test(nombre)) {
    res.status(400).json({ error: 'El nombre no puede contener caracteres especiales, solo letras y espacios.' });
    return;
  }
  if (nombre.length < 2 || nombre.length > 50) {
    res.status(400).json({ error: 'El nombre debe tener entre 2 y 50 caracteres.' });
    return;
  }

  // Validación de email
  if (!email || !validator.isEmail(email)) {
    res.status(400).json({ error: 'El email no es válido.' });
    return;
  }

  // Sanitización de entradas: Eliminamos espacios extra y aseguramos que no haya caracteres peligrosos
  req.body.nombre = validator.escape(nombre.trim());  // Sanitizamos el nombre
  req.body.email = validator.normalizeEmail(email.trim()); // Normalizamos el correo (elimina posibles inconsistencias)

  // Protección contra XSS usando xss
  req.body.nombre = xss(req.body.nombre); // Aplicamos sanitización contra XSS al nombre
  req.body.email = xss(req.body.email); // Aplicamos sanitización contra XSS al email

  // Si las validaciones pasan, continua con la ejecución
  next();
};
