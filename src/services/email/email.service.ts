import nodemailer from 'nodemailer';

export class EmailService {
  private transporter;

  constructor() {
    // Configuración del transportador para nodemailer
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // Usa el servicio de correo que prefieras
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Función para enviar el correo
  async sendEmail(to: string, subject: string, text: string) {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.EMAIL_USER, // El correo desde el cual se enviará
        to,
        subject,
        text,
      });
      return info; // Regresamos la información del correo enviado
    } catch (error) {
      throw new Error('Error al enviar el correo');
    }
  }
}
