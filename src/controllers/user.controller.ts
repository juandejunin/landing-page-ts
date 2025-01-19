import { Request, Response } from 'express';
import { UserService } from '../services/user.service';



export class UserController {

  // Instancia de UserService almacenada en `this`
  private userService: UserService;

  // Constructor donde inicializamos `userService`
  constructor() {
    this.userService = new UserService(); // Instanciamos el servicio una sola vez
  }

  // Controlador para registrar un nuevo usuario
  async register(req: Request, res: Response) {
    const { nombre, email } = req.body;
    try {
      const usuario = await this.userService.createUser(nombre, email);
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

   async verifyEmail(req: Request, res: Response): Promise<void> {
    const { token } = req.query;

    if (!token) {
      res.status(400).json({
        redirect: "/error.html",
        message: "Token is required"
      });
      return;
    }

    try {
      const result = await this.userService.verifyUserEmail(token as string);

      if (result.verificado) {
        res.status(200).json({
          redirect: "/success.html",
          message: "Email verified successfully"
        });
      } else {
        res.status(400).json({
          redirect: "/error.html",
          message: "Invalid or expired token"
        });
      }
    } catch (error: unknown) {
      console.error("Error verifying email:", error);

      if (error instanceof Error) {
        if (error.message === 'Error generando el token') {
          res.status(500).json({
            error: 'Error generando el token',
            redirect: "/error.html"
          });
        } else {
          res.status(500).json({
            error: 'Internal server error',
            redirect: "/error.html"
          });
        }
      } else {
        res.status(500).json({
          error: 'Unknown error occurred',
          redirect: "/error.html"
        });
      }
    }
  }
}