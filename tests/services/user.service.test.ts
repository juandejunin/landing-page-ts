import { UsuarioModel } from '../../src/models/user.model';
import { UserService } from '../../src/services/user.service';
import { EmailService } from '../../src/services/email/email.service';

// Mock del módulo
jest.mock('../../src/models/user.model');
jest.mock('../../src/services/email/email.service');

describe('UserService', () => {
  let userService: UserService;
  let mockSave: jest.Mock;
  let mockFindOne: jest.Mock;
  let mockSendEmail: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Configurar mocks
    mockFindOne = jest.fn().mockResolvedValue(null);
    mockSave = jest.fn().mockResolvedValue({ nombre: 'Test User', email: 'test@example.com' });
    mockSendEmail = jest.fn().mockResolvedValue(true);

    // Reemplazar los métodos con mocks
    (UsuarioModel.findOne as jest.Mock) = mockFindOne;
    UsuarioModel.prototype.save = mockSave;
    (EmailService.prototype.sendEmail as jest.Mock) = mockSendEmail;

    // Instanciar el servicio
    userService = new UserService();
  });

  it('should create a new user', async () => {
    const result = await userService.createUser('Test User', 'test@example.com');

    // Verificar llamadas a mocks y el resultado
    expect(mockFindOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(mockSave).toHaveBeenCalled();
    expect(mockSendEmail).toHaveBeenCalledWith(
      'test@example.com',
      'Bienvenido a nuestra plataforma',
      expect.stringContaining('Hola Test User')
    );
    expect(result).toEqual({ nombre: 'Test User', email: 'test@example.com' });
  });

  it('should throw an error if saving the user fails', async () => {
    const mockError = new Error('Database error');
    mockSave.mockRejectedValueOnce(mockError);

    await expect(userService.createUser('Test User', 'test@example.com')).rejects.toThrow(
      'Database error'
    );

    expect(mockSave).toHaveBeenCalled();
  });

  it('should throw an error if sending the email fails', async () => {
    const mockEmailError = new Error('Email error');
    mockSendEmail.mockRejectedValueOnce(mockEmailError);

    await expect(userService.createUser('Test User', 'test@example.com')).rejects.toThrow(
      'Email error'
    );

    expect(mockFindOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(mockSave).toHaveBeenCalled();
    expect(mockSendEmail).toHaveBeenCalledWith(
      'test@example.com',
      'Bienvenido a nuestra plataforma',
      expect.stringContaining('Hola Test User')
    );
  });
});
