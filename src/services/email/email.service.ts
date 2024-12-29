import nodemailer from 'nodemailer';

export class EmailService {
  private transporter;

  constructor() {
    // Configuración del transportador para nodemailer
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Usa el host del servicio de correo
      port: 465, // Puerto para conexiones seguras (SSL/TLS)
      secure: true, // Habilitamos SSL/TLS para cifrar las comunicaciones
      auth: {
        user: process.env.EMAIL_USER, // Usuario (correo electrónico)
        pass: process.env.EMAIL_PASSWORD, // Contraseña
      },
    });
  }

  // Función para enviar el correo
  async sendEmail(to: string, subject: string, text: string) {
    try {
      const info = await this.transporter.sendMail({
        from: `"No-Reply" <${process.env.EMAIL_USER}>`, // Formato del remitente
        to, // Destinatario
        subject, // Asunto del correo
        text, // Cuerpo del correo
      });
      return info; // Regresamos la información del correo enviado
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw new Error('Error al enviar el correo');
    }
  }
}
