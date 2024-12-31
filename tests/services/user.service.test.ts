// import { UsuarioModel } from '../../src/models/user.model';
// import { UserService } from '../../src/services/user.service';

// // Configuración del mock
// jest.mock('../../src/models/user.model'); // Mocks el módulo completo

// describe('UserService', () => {
//   let userService: UserService;
//   let mockSave: jest.Mock;

//   beforeAll(() => {
//     // Configura el mock del método save para que resuelva correctamente
//     mockSave = jest.fn().mockResolvedValue({ nombre: 'Test User', email: 'test@example.com' });
//     UsuarioModel.prototype.save = mockSave; // Asigna el mock a la instancia del modelo

//     userService = new UserService(); // Crea la instancia del servicio después de configurar el mock
//   });

//   it('should create a new user', async () => {
//     const result = await userService.createUser('Test User', 'test@example.com');

//     // Verifica que el mock se haya llamado
//     expect(mockSave).toHaveBeenCalled();
//     expect(result).toEqual({ nombre: 'Test User', email: 'test@example.com' });
//   });

//   it('should throw an error if saving the user fails', async () => {
//     const mockError = new Error('Database error');
//     mockSave.mockRejectedValueOnce(mockError); // Configura el mock para que rechace con un error
  
//     await expect(userService.createUser('Test User', 'test@example.com')).rejects.toThrow(
//       'Database error'
//     );
  
//     // Verifica que el método `save` fue llamado incluso cuando ocurre un error
//     expect(mockSave).toHaveBeenCalled();
//   });
  
// });
 
import { UsuarioModel } from '../../src/models/user.model';
import { UserService } from '../../src/services/user.service';

// Mock del módulo
jest.mock('../../src/models/user.model');

describe('UserService', () => {
  let userService: UserService;
  let mockSave: jest.Mock;

  beforeAll(() => {
    // Mock para el método de instancia findOne
    UsuarioModel.prototype.findOne = jest.fn().mockResolvedValue(null);

    // Mock para save
    mockSave = jest.fn().mockResolvedValue({ nombre: 'Test User', email: 'test@example.com' });
    UsuarioModel.prototype.save = mockSave;

    userService = new UserService();
  });

  beforeEach(() => {
    jest.clearAllMocks(); // Limpia los mocks antes de cada prueba
  });

  it('should create a new user', async () => {
    const result = await userService.createUser('Test User', 'test@example.com');

    // Verifica que los métodos sean llamados
    expect(UsuarioModel.prototype.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(mockSave).toHaveBeenCalled();
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
});
