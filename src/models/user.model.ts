import mongoose, { Schema, Document } from 'mongoose';

// Interfaz para definir las propiedades de un Usuario
export interface IUser extends Document {
  nombre: string;
  email: string;
  fechaDeRegistro: Date;
}

// Definimos el esquema para MongoDB
const usuarioSchema = new Schema<IUser>({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  fechaDeRegistro: { type: Date, default: Date.now },
});

// Modelo de Mongoose
export const UsuarioModel = mongoose.model<IUser>('Usuario', usuarioSchema);

// Clase Usuario con métodos y propiedades
export class Usuario {
  private nombre: string;
  private email: string;
  private fechaDeRegistro: Date;

  constructor(nombre: string, email: string) {
    this.nombre = nombre;
    this.email = email;
    this.fechaDeRegistro = new Date();
  }

  // Método para obtener el nombre completo (ejemplo)
  getNombre(): string {
    return this.nombre;
  }

  // Método para establecer un nuevo email
  setEmail(email: string): void {
    this.email = email;
  }

  // Método para obtener los datos del usuario como un objeto, incluyendo _id después de ser guardado
  async toObject(): Promise<IUser> {
    const usuario = new UsuarioModel({
      nombre: this.nombre,
      email: this.email,
      fechaDeRegistro: this.fechaDeRegistro,
    });
    
    const savedUser = await usuario.save();  // Guarda el usuario y obtiene el _id

    // Retorna el documento completo con _id incluido
    return savedUser.toObject();
  }
}
