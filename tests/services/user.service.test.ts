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
    // Preparar el mock para encontrar al usuario como no existente
    mockFindOne.mockResolvedValue(null); // No existe el usuario

    // Simular un fallo en el envío del correo electrónico
    mockSendEmail.mockRejectedValue(new Error('Email failed'));

    try {
      await userService.createUser('Test User', 'test@example.com');
    } catch (error: unknown) {
      // Verificar que el error es una instancia de Error antes de acceder a su mensaje
      if (error instanceof Error) {
        expect(error.message).toBe('Error al guardar el usuario: Email failed');
      } else {
        throw error; // Si no es un error esperado, lo lanzamos de nuevo
      }
    }

    // Verificar que el usuario no fue guardado si el email falló
    expect(mockSave).not.toHaveBeenCalled();

    // Verificar que se intentó buscar al usuario con el email dado
    expect(mockFindOne).toHaveBeenCalledWith({ email: 'test@example.com' });
  });



  it('should throw a generic error message if the email is already registered', async () => {
    // Simula que el usuario ya existe
    const existingUser = { nombre: 'Existing User', email: 'test@example.com' };
    mockFindOne.mockResolvedValueOnce(existingUser);

    await expect(userService.createUser('Test User', 'test@example.com')).rejects.toThrow(
      'No se pudo registrar el usuario.'
    );

    // Verifica que save no fue llamado
    expect(mockSave).not.toHaveBeenCalled();
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it('should throw an error if sending the welcome email fails', async () => {
    // Simula que el usuario no existe
    mockFindOne.mockResolvedValueOnce(null);

    // Simula que el correo no se puede enviar
    const mockEmailError = new Error('Email service failed');
    mockSendEmail.mockRejectedValueOnce(mockEmailError);

    await expect(userService.createUser('Test User', 'test@example.com')).rejects.toThrow(
      'Error al guardar el usuario: Email service failed'
    );

    // Verifica que no se haya guardado el usuario debido al error en el envío del correo
    expect(mockSave).not.toHaveBeenCalled();
  });

});
