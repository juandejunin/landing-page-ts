import { UsuarioModel } from '../models/user.model';
import { EmailService } from './email/email.service';

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class UserService {

  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService(); // Instancia del EmailService
  }

  async createUser(nombre: string, email: string) {
    try {
      // Verificar si el usuario ya existe
      const usuarioExistente = await UsuarioModel.findOne({ email });

      if (usuarioExistente) {
        throw new ValidationError('No se pudo registrar el usuario.'); // Mensaje genérico
      }

      // Crear nuevo usuario
      const nuevoUsuario = new UsuarioModel({ nombre, email });
      const usuarioGuardado = await nuevoUsuario.save();

      // Enviar correo de bienvenida
      await this.emailService.sendEmail(
        email,
        'Bienvenido a nuestra plataforma',
        `Hola ${nombre}, gracias por registrarte en nuestra plataforma.`
      );


      return usuarioGuardado;
    } catch (error: unknown) {
      if (error instanceof ValidationError) {
        throw error; // Repropagar errores de validación
      }
      if (error instanceof Error) {
        throw new DatabaseError(`Error al guardar el usuario: ${error.message}`);
      }
      throw new DatabaseError('Error desconocido al guardar el usuario');
    }
  }
}
