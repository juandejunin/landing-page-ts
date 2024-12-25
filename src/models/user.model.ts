import mongoose, { Schema, Document } from "mongoose";
import validator from "validator";

// Interfaz para definir las propiedades de un Usuario
export interface IUser extends Document {
  nombre: string;
  email: string;
  fechaDeRegistro: Date;
}

// Definimos el esquema para MongoDB
const usuarioSchema = new Schema<IUser>(
  {
    nombre: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
      match: /^[a-zA-ZáéíóúÁÉÍÓÚüÜ\s]+$/,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: { unique: true, collation: { locale: "en", strength: 2 } },
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: "El email no es válido.",
      },
      minlength: 5,
      maxlength: 100,
    },
    fechaDeRegistro: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  { strict: true }
);

// Pre-guardado para sanitizar entradas
usuarioSchema.pre<IUser>("save", function (next) {
  this.nombre = validator.escape(this.nombre.trim());
  this.email = validator.normalizeEmail(this.email.trim()) as string;
  next();
});

// Modelo de Mongoose
export const UsuarioModel = mongoose.model<IUser>("Usuario", usuarioSchema);

// Clase Usuario con métodos y propiedades
export class Usuario {
  private nombre: string;
  private email: string;
  private readonly fechaDeRegistro: Date;

  constructor(nombre: string, email: string) {
    this.nombre = nombre;
    this.email = email;
    this.fechaDeRegistro = new Date();
  }

  getNombre(): string {
    return this.nombre;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  async toObject(): Promise<IUser> {
    let usuario = await UsuarioModel.findOne({ email: this.email });
    if (!usuario) {
      usuario = new UsuarioModel({
        nombre: this.nombre,
        email: this.email,
        fechaDeRegistro: this.fechaDeRegistro,
      });
      await usuario.save();
    }
    return usuario.toObject();
  }
}
