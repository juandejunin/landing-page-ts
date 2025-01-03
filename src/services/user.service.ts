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
  constructor(private emailService = new EmailService()) {}

  // Método para crear un usuario
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

  // Método para obtener un usuario por su email
  catch (error: unknown) {
    if (error instanceof Error) {
      throw new DatabaseError(`Error al obtener el usuario: ${error.message}`);
    } else {
      throw new DatabaseError('Error desconocido al obtener el usuario');
    }
  }
  

  // Método para actualizar un usuario
  async updateUser(email: string, nombre: string) {
    try {
      const usuario = await UsuarioModel.findOne({ email });
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      usuario.nombre = nombre;
      await usuario.save();

      return usuario;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new DatabaseError(`Error al actualizar el usuario: ${error.message}`);
      } else {
        throw new DatabaseError('Error desconocido al actualizar el usuario');
      }
    }
    
  }

  // Método para eliminar un usuario
  async deleteUser(email: string) {
    try {
      const usuario = await UsuarioModel.findOne({ email });
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      await UsuarioModel.findByIdAndDelete(usuario._id);

      return { message: 'Usuario eliminado exitosamente' };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new DatabaseError(`Error al eliminar el usuario: ${error.message}`);
      } else {
        throw new DatabaseError('Error desconocido al eliminar el usuario');
      }
    }
    
  }
}
