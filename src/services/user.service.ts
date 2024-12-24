import { UsuarioModel } from '../models/user.model';

export class UserService {
  // Método para crear un nuevo usuario
  async createUser(nombre: string, email: string) {
    try {
      // Verificar si ya existe un usuario con el mismo correo electrónico
      const usuarioExistente = await UsuarioModel.findOne({ email });
      
      if (usuarioExistente) {
        // Si el correo ya existe, lanzar un error con un mensaje específico
        throw new Error('El correo electrónico ya está registrado');
      }

      // Si no existe, crear un nuevo usuario
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
