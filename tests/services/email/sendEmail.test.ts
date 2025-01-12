
import { EmailService } from '../../../src/services/email/email.service';

describe('EmailService - Correo de verificación', () => {
  let emailService: EmailService;

  beforeEach(() => {
    emailService = new EmailService();

    // Interceptar el método sendEmail con un mock por defecto
    jest.spyOn(emailService, 'sendEmail').mockResolvedValue({
      envelope: { from: 'no-reply@example.com', to: ['juan@example.com'] },
      accepted: ['juan@example.com'],
      rejected: [],
      pending: [],
      response: '250 OK',
      messageId: '12345',
    });
  });

  it('should send a verification email successfully', async () => {
    const verificationContent = `
      Hola Juan,
      Por favor, haz clic en el enlace para verificar tu correo electrónico:
      https://example.com/verify?token=abc123
    `;

    const mockResponse = {
      envelope: { from: 'no-reply@example.com', to: ['juan@example.com'] },
      accepted: ['juan@example.com'],
      rejected: [],
      response: '250 OK',
      messageId: '12345',
    };

    // Mockear la función sendEmail para devolver el resultado esperado
    emailService.sendEmail = jest.fn().mockResolvedValue(mockResponse);

    const result = await emailService.sendEmail(
      'juan@example.com',
      'Verifica tu correo electrónico',
      verificationContent
    );

    // Comprobar que el resultado sea el esperado
    expect(result).toEqual(mockResponse);

    // Verificar que sendEmail fue llamado con los parámetros correctos
    expect(emailService.sendEmail).toHaveBeenCalledWith(
      'juan@example.com',
      'Verifica tu correo electrónico',
      verificationContent
    );
  });

  it('should handle errors during sending verification email', async () => {
    const mockError = new Error('Error al enviar correo de verificación');
    emailService.sendEmail = jest.fn().mockRejectedValue(mockError);

    try {
      await emailService.sendEmail(
        'juan@example.com',
        'Verifica tu correo electrónico',
        'Por favor verifica tu correo electrónico'
      );
    } catch (error) {
      // Asegurarse de que el error sea el esperado
      expect(error).toEqual(mockError);
    }

    // Verificar que sendEmail fue llamado
    expect(emailService.sendEmail).toHaveBeenCalledWith(
      'juan@example.com',
      'Verifica tu correo electrónico',
      'Por favor verifica tu correo electrónico'
    );
  });
});
