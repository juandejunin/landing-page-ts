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

// import { UsuarioModel } from '../models/user.model';
// import { EmailService } from '../services/email/email.service';

// class ValidationError extends Error {
//   constructor(message: string) {
//     super(message);
//     this.name = 'ValidationError';
//   }
// }

// class DatabaseError extends Error {
//   constructor(message: string) {
//     super(message);
//     this.name = 'DatabaseError';
//   }
// }

// export class UserService {
//   private emailService = new EmailService();

//   async createUser(nombre: string, email: string) {
//     try {
//       // Verificar si el usuario ya existe
//       const usuarioExistente = await UsuarioModel.findOne({ email });

//       if (usuarioExistente) {
//         throw new ValidationError('No se pudo registrar el usuario.'); // Mensaje genérico
//       }

//       // Crear nuevo usuario
//       const nuevoUsuario = new UsuarioModel({ nombre, email });
//       const usuarioGuardado = await nuevoUsuario.save();

//       // Enviar correo de bienvenida
//       await this.emailService.sendEmail(
//         email,
//         'Bienvenido a nuestra plataforma',
//         `Hola ${nombre}, gracias por registrarte en nuestra plataforma.`
//       );

//       return usuarioGuardado;
//     } catch (error: unknown) {
//       if (error instanceof ValidationError) {
//         throw error; // Repropagar errores de validación
//       }
//       if (error instanceof Error) {
//         throw new DatabaseError(`Error al guardar el usuario: ${error.message}`);
//       }
//       throw new DatabaseError('Error desconocido al guardar el usuario');
//     }
//   }
// }
