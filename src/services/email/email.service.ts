import nodemailer from 'nodemailer';
import { generateToken } from '../../utils/jwt.utils';

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  /**
   * Envía un correo electrónico genérico.
   * @param to - Dirección del destinatario.
   * @param subject - Asunto del correo.
   * @param body - Contenido del correo.
   * @returns Información sobre el correo enviado.
   * @throws Error si ocurre un problema al enviar el correo.
   */
  async sendEmail(to: string, subject: string, body: string) {
    try {
      const info = await this.transporter.sendMail({
        from: `"No-Reply" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text: body,
      });

      return info;
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw new Error('Error al enviar el correo');
    }
  }

  /**
   * Envía un correo de verificación con un enlace que incluye un token.
   * @param to - Dirección del destinatario.
   * @returns Información sobre el correo enviado.
   */
  async sendVerificationEmail(to: string) {
    try {
      // Generar el token de validación
      const token = generateToken({ email: to }, '1h');

      // Construir el enlace de validación
      const verificationLink = `${process.env.BASE_URL}/api/users/verify-email?token=${token}`;

      // Construir el mensaje del correo
      const emailBody = `
      Hola,
    
      Para validar tu correo electrónico, haz clic en el siguiente enlace:
      ${verificationLink}
    
      Si no solicitaste esto, ignora este mensaje.
    `.trim();


      // Usar el método genérico para enviar el correo
      const info = await this.sendEmail(
        to,
        'Verifica tu correo electrónico',
        emailBody
      );

      return info;
    } catch (error) {
      console.error('Error al enviar el correo de verificación:', error);
      throw new Error('Error al enviar el correo de verificación');
    }
  }
}
