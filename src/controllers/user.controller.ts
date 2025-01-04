import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

const userService = new UserService();

export class UserController {
  // Controlador para registrar un nuevo usuario
  async register(req: Request, res: Response) {
    console.log(req.body)
    const { nombre, email } = req.body;
    try {
      const usuario = await userService.createUser(nombre, email);
      res.status(201).json({ mensaje: 'Usuario registrado correctamente', usuario });
    } catch (error: unknown) {
      // Comprobamos si el error es una instancia de Error
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        // Si el error no es una instancia de Error, respondemos con un error genérico
        res.status(400).json({ error: 'Error desconocido al registrar el usuario' });
      }
    }
  }
}