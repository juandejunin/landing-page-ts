import { UserController } from '../../src/controllers/user.controller';
import { UserService } from '../../src/services/user.service';
import { Request, Response } from 'express';

// Mock del servicio
jest.mock('../../src/services/user.service'); 

describe('UserController', () => {
  let userController: UserController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeAll(() => {
    userController = new UserController();
  });

  beforeEach(() => {
    // Inicializamos los objetos mockeados para cada prueba
    mockRequest = {
      body: { nombre: 'Juan', email: 'juan@example.com' },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should register a user successfully', async () => {
    // Simula que el servicio crea un usuario correctamente
    (UserService.prototype.createUser as jest.Mock).mockResolvedValue({
      id: '1',
      nombre: 'Juan',
      email: 'juan@example.com',
    });

    // Ejecutar la acción del controlador
    await userController.register(mockRequest as Request, mockResponse as Response);

    // Comprobar que la respuesta es la esperada
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      mensaje: 'Usuario registrado correctamente',
      usuario: { id: '1', nombre: 'Juan', email: 'juan@example.com' },
    });
  });

  it('should handle errors during user registration', async () => {
    // Simula que el servicio lanza un error
    (UserService.prototype.createUser as jest.Mock).mockRejectedValue(new Error('Error en el servicio'));

    // Ejecutar la acción del controlador
    await userController.register(mockRequest as Request, mockResponse as Response);

    // Comprobar que la respuesta es la esperada
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Error en el servicio' });
  });
});
