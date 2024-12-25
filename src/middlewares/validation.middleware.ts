import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import xss from 'xss'; // Protección contra XSS
import _ from 'lodash'; // Manejo seguro de objetos

export const validateUserRegistration = (req: Request, res: Response, next: NextFunction): void => {
  const sanitizedBody = _.pick(req.body, ['nombre', 'email']); // Solo permitir las claves esperadas
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

  // Sanitización de entradas: Eliminamos espacios extra y aseguramos que no haya caracteres peligrosos
  req.body.nombre = validator.escape(nombre.trim()); // Sanitizamos el nombre

  const normalizedEmail = validator.normalizeEmail(email.trim());
  if (!normalizedEmail) {
    res.status(400).json({ error: 'El email no pudo ser normalizado.' });
    return;
  }
  req.body.email = xss(normalizedEmail); 

  next();
};
