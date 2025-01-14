import { UsuarioModel } from '../models/user.model';
import { EmailService } from './email/email.service';
import jwt from "jsonwebtoken";

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
  constructor(private emailService = new EmailService()) { }

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
      // Enviar correo de verificación
      try {
        await this.emailService.sendVerificationEmail(email);
      } catch (emailError) {
        throw new Error('Email failed'); // Lanzar un error claro en caso de fallo
      }

      const usuarioGuardado = await nuevoUsuario.save();

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

  catch(error: unknown) {
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

  // Método para verificar el email del usuario
  async verifyUserEmail(token: string) {
    try {
      const secretKey = process.env.JWT_SECRET_KEY;

      if (!secretKey) {
        throw new Error("La clave secreta JWT no está configurada.");
      }


      // Decodificar el token para obtener el email
      const decoded = jwt.verify(token, secretKey) as { email: string };

      const usuario = await UsuarioModel.findOne({ email: decoded.email });
      if (!usuario) {
        throw new Error("Usuario no encontrado");
      }

      // Verificar si ya está verificado
      if (usuario.isVerified) {
        return { verificado: true, mensaje: "El usuario ya estaba verificado" };
      }

      // Actualizar el estado de verificación
      usuario.isVerified = true;
      await usuario.save();

      return { verificado: true, mensaje: "Email verificado correctamente" };
    } catch (error: unknown) {
      if (error instanceof jwt.JsonWebTokenError) {
        return { verificado: false, mensaje: "Token inválido o expirado" };
      }
      throw error;
    }
  }

}