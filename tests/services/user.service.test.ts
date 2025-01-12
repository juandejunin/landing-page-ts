jest.mock('../../src/utils/jwt.utils', () => ({
  generateToken: jest.fn(() => 'fixedToken'), // Mock de token fijo
}));

jest.mock('../../src/models/user.model');
jest.mock('../../src/services/email/email.service');

import { UsuarioModel } from '../../src/models/user.model';
import { UserService } from '../../src/services/user.service';
import { EmailService } from '../../src/services/email/email.service';

describe('UserService', () => {
  let userService: UserService;
  let mockSave: jest.Mock;
  let mockFindOne: jest.Mock;
  let mockSendEmail: jest.Mock;

  beforeAll(() => {
    let llamada = process.env.BASE_URL;
    console.log("este es el resultado de probar las variables de entorno: ", llamada);
  });

  beforeEach(() => {
    jest.clearAllMocks();

    // Configurar mocks
    mockFindOne = jest.fn().mockResolvedValue(null); // Simula que no encuentra usuarios existentes
    mockSave = jest.fn().mockResolvedValue({ nombre: 'Test User', email: 'test@example.com' });
    mockSendEmail = jest.fn().mockResolvedValue({
      envelope: { from: 'no-reply@example.com', to: ['test@example.com'] },
      accepted: ['test@example.com'],
      rejected: [],
      pending: [],
      response: '250 OK',
      messageId: '12345',
    });

    // Reemplazar los métodos con mocks
    (UsuarioModel.findOne as jest.Mock) = mockFindOne;
    UsuarioModel.prototype.save = mockSave;

    // Instanciar el servicio
    userService = new UserService();
  });

  it('should create a new user and send a verification email', async () => {
    // Mock para que no encuentre al usuario existente
    mockFindOne.mockResolvedValue(null);

    // Mock para guardar al usuario
    mockSave.mockResolvedValue({ nombre: 'Test User', email: 'test@example.com' });

    // Espiar el método sendEmail
    const spySendEmail = jest.spyOn(EmailService.prototype, 'sendEmail').mockResolvedValue({
      envelope: { from: 'no-reply@example.com', to: ['test@example.com'] },
      accepted: ['test@example.com'],
      rejected: [],
      pending: [],
      response: '250 OK',
      messageId: '12345',
    });

    // Ejecutar el servicio
    await userService.createUser('Test User', 'test@example.com');

    // Verificar que el usuario haya sido guardado
    expect(mockSave).toHaveBeenCalled();

    // Verificar que sendVerificationEmail haya sido llamado
    expect(EmailService.prototype.sendVerificationEmail).toHaveBeenCalled();

    // Verificar que sendVerificationEmail haya sido llamado con el correo correcto
    expect(EmailService.prototype.sendVerificationEmail).toHaveBeenCalledWith('test@example.com');

    // Restaurar los espías
    spySendEmail.mockRestore();
  });

  test('should throw an error if sending the email fails', async () => {
    const mockSendEmail = jest.fn().mockRejectedValue(new Error('Email failed'));
    const mockEmailService = { sendVerificationEmail: mockSendEmail };
    const userService = new UserService(mockEmailService as any);

    await expect(userService.createUser('Test User', 'test@example.com')).rejects.toThrow(
      'Error al guardar el usuario: Email failed'
    );
  });


  it('should throw a generic error message if the email is already registered', async () => {
    // Simula que el usuario ya existe
    const existingUser = { nombre: 'Existing User', email: 'test@example.com' };
    mockFindOne.mockResolvedValueOnce(existingUser);

    await expect(userService.createUser('Test User', 'test@example.com')).rejects.toThrow(
      'No se pudo registrar el usuario.'
    );

    // Verificar que save no fue llamado
    expect(mockSave).not.toHaveBeenCalled();

    // Verificar que no se intentó enviar el correo
    expect(mockSendEmail).not.toHaveBeenCalled();
  });
});
