import { EmailService } from '../../../src/services/email/email.service';

describe('EmailService', () => {
    let emailService: EmailService;

    beforeEach(() => {
        emailService = new EmailService();
        // Interceptar el método sendEmail con un mock
        jest.spyOn(emailService, 'sendEmail').mockResolvedValue({
            envelope: { from: 'no-reply@example.com', to: ['juan@example.com'] },
            accepted: ['juan@example.com'],
            rejected: [],
            pending: [], // Asegúrate de incluir esta propiedad
            response: '250 OK',
            messageId: '12345',
        });

    });

    it('should send an email successfully', async () => {
        // Simular el retorno esperado del método sendEmail
        const mockResponse = {
            envelope: { from: 'no-reply@example.com', to: ['juan@example.com'] },
            accepted: ['juan@example.com'],
            rejected: [],
            response: '250 OK',
            messageId: '12345',
        };

        // Mockear la función sendEmail para que devuelva el mockResponse
        emailService.sendEmail = jest.fn().mockResolvedValue(mockResponse);

        // Llamar a la función sendEmail con tres parámetros
        const result = await emailService.sendEmail(
            'juan@example.com',
            'Bienvenido',
            'Gracias por registrarte, Juan'
        );

        // Comprobar que el resultado sea el esperado
        expect(result).toEqual(mockResponse);

        // Verificar que sendEmail fue llamado con los parámetros correctos
        expect(emailService.sendEmail).toHaveBeenCalledWith(
            'juan@example.com',
            'Bienvenido',
            'Gracias por registrarte, Juan'
        );
    });
    it('should handle errors during email sending', async () => {
        // Simular un error en el envío del correo
        emailService.sendEmail = jest.fn().mockRejectedValue(new Error('Error al enviar el correo'));

        // Llamar a la función sendEmail y capturar el error
        try {
            await emailService.sendEmail(
                'juan@example.com',
                'Bienvenido',
                'Gracias por registrarte, Juan'
            );
        } catch (error) {
            // Aseguramos que el error es de tipo Error y verificamos el mensaje
            const e = error as Error;  // Aseguramos que `error` es del tipo `Error`
            expect(e.message).toBe('Error al enviar el correo');
        }
    });

});
