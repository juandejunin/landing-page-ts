import { UsuarioModel } from '../models/user.model';

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
