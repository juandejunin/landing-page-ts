// Importaciones necesarias para la prueba
import { app, server } from '../../src/index'; // Ajusta la ruta según corresponda
const request = require('supertest');


// Simulación completa del módulo nodemailer
jest.mock('nodemailer', () => {
  const sendMailMock = jest.fn().mockResolvedValue({
    envelope: { from: 'no-reply@example.com', to: ['carlos@example.com'] },
    accepted: ['carlos@example.com'],
    rejected: [],
    pending: [],
    response: '250 OK',
    messageId: '12345',
  });

  return {
    createTransport: jest.fn().mockReturnValue({
      sendMail: sendMailMock,
    }),
  };
});

describe('User Routes', () => {
  it('should return 201 for successful user registration', async () => {
    // Enviar solicitud de registro de usuario
    const response = await request(app)
      .post('/api/users/register')
      .send({ nombre: 'Carlos', email: 'carlos@example.com' });

    // Verificar el estado de la respuesta y los detalles del mensaje
    expect(response.status).toBe(201);
    expect(response.body.mensaje).toBe('Usuario registrado correctamente');
    expect(response.body.usuario.nombre).toBe('Carlos');

    // Verificar que sendMail haya sido llamado con el objeto correcto
    const nodemailer = require('nodemailer');
    const sendMailMock = nodemailer.createTransport().sendMail;

    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledWith(expect.objectContaining({
      to: 'carlos@example.com',
      subject: 'Bienvenido a nuestra plataforma',
      text: 'Hola Carlos, gracias por registrarte en nuestra plataforma.',
      from: '"No-Reply" <juandejunin75@gmail.com>', // Aquí puedes verificar si el 'from' es correcto.
    }));
  });

  // Test de error para registro de usuario con correo duplicado
  it('should return 400 when user registration fails due to duplicate email', async () => {
    // Primero, asegurémonos de que el correo ya está en la base de datos
    await request(app)
      .post('/api/users/register')
      .send({ nombre: 'Carlos', email: 'juan@example.com' });

    // Ahora intentamos registrar el mismo correo de nuevo
    const response = await request(app)
      .post('/api/users/register')
      .send({ nombre: 'Juan', email: 'juan@example.com' });

    // Verificar que la respuesta tiene el estado 400 y el mensaje de error adecuado
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('No se pudo registrar el usuario.');
  });

});

