import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import xss from 'xss'; // Protección contra XSS
import _ from 'lodash'; // Manejo seguro de objetos

export const validateUserRegistration = (req: Request, res: Response, next: NextFunction): void => {
  console.log("Cuerpo recibido en el middleware (antes de filtrar):", req.body); // Inspección inicial

  // Filtrar únicamente las claves esperadas (nombre y email)
  const sanitizedBody = _.pick(req.body, ['nombre', 'email']);
  const { nombre, email } = sanitizedBody;

  // Validación de nombre
  const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜ\s]+$/; // Permitir solo letras y espacios
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

  // Sanitización de entradas
  const sanitizedNombre = validator.escape(nombre.trim()); // Eliminar caracteres peligrosos del nombre
  console.log("este es el sanitizadNombre en el middleware: ", sanitizedNombre)
  const sanitizedEmail = xss(validator.normalizeEmail(email.trim()) || ''); // Normalizar y proteger email contra XSS

  // Asignar los valores sanitizados de vuelta al objeto req.body
  req.body = { ...sanitizedBody, nombre: sanitizedNombre, email: sanitizedEmail };

  console.log("Cuerpo recibido en el middleware (después de filtrar y sanitizar):", req.body); // Inspección final

  next();
};
