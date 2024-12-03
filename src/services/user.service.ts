import { UsuarioModel } from '../models/user.model';

export class UserService {
  // Método para crear un nuevo usuario
  async createUser(nombre: string, email: string) {
    try {
      const nuevoUsuario = new UsuarioModel({ nombre, email });
      const usuarioGuardado = await nuevoUsuario.save();
      return usuarioGuardado;
    } catch (error: unknown) {
      // Comprobación de tipo para asegurarse de que 'error' es una instancia de Error
      if (error instanceof Error) {
        throw new Error(`Error al guardar el usuario: ${error.message}`);
      } else {
        // Si el error no es una instancia de Error, lanzar un error genérico
        throw new Error('Error desconocido al guardar el usuario');
      }
    }
  }
}
