import { UserController } from '../../src/controllers/user.controller';
import { UserService } from '../../src/services/user.service';

jest.mock('../../src/services/user.service'); // Mock del servicio

describe('UserController', () => {
  let userController: UserController;

  beforeAll(() => {
    userController = new UserController();
  });

  it('should register a user successfully', async () => {
    // Simula que el servicio crea un usuario correctamente
    (UserService.prototype.createUser as jest.Mock).mockResolvedValue({
      id: '1',
      nombre: 'Juan',
      email: 'juan@example.com',
    });

    const req = { body: { nombre: 'Juan', email: 'juan@example.com' } } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    await userController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: 'Usuario registrado correctamente',
      usuario: { id: '1', nombre: 'Juan', email: 'juan@example.com' },
    });
  });

  it('should handle errors during user registration', async () => {
    // Simula que el servicio lanza un error
    (UserService.prototype.createUser as jest.Mock).mockRejectedValue(new Error('Error en el servicio'));

    const req = { body: { nombre: 'Juan', email: 'juan@example.com' } } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    await userController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error en el servicio' });
  });
});
