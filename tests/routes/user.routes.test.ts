// import request from 'supertest';
// import {app, server} from '../../src/index'; // Ajusta la ruta según corresponda
// import { UsuarioModel } from '../../src/models/user.model';
// import mongoose from 'mongoose';

// describe('User Routes', () => {
//   // Array para llevar un registro de los usuarios creados en las pruebas
//   let createdUsers: any[] = [];

//   // Simular un usuario en la base de datos para las pruebas
//   beforeAll(async () => {
//     // Crea el usuario de prueba si no existe para evitar duplicados
//     const existingUser = await UsuarioModel.findOne({ email: 'juan@example.com' });
//     if (!existingUser) {
//       const newUser = await UsuarioModel.create({ nombre: 'Juan', email: 'juan@example.com' });
//       createdUsers.push(newUser); // Guardamos el usuario creado
//     }
//   });

//   // Limpiar solo los usuarios creados durante las pruebas y cerrar la conexión
//   afterAll(async () => {
//     // Limpiar temporizadores si es necesario
//     jest.clearAllTimers();

//     // Eliminar solo los usuarios creados en las pruebas
//     await UsuarioModel.deleteMany({ _id: { $in: createdUsers.map(user => user._id) } });

//     // Asegurarse de que todas las conexiones de mongoose se cierren
//     // await mongoose.connection.close();
//     await mongoose.disconnect();
//     server.close(); 

//     // Cerrar cualquier otro proceso si es necesario
//   });

//   // Test de éxito para registro de usuario
//   it('should return 201 for successful user registration', async () => {
//     const response = await request(app)
//       .post('/api/users/register')
//       .send({ nombre: 'Carlos', email: 'carlos@example.com' });

//     expect(response.status).toBe(201);
//     expect(response.body.mensaje).toBe('Usuario registrado correctamente');
//     expect(response.body.usuario.nombre).toBe('Carlos');

//     // Guardamos el usuario creado durante esta prueba para eliminarlo más tarde
//     createdUsers.push(response.body.usuario);
//   });

//   // Test de error para registro de usuario con correo duplicado
//   it('should return 400 when user registration fails due to duplicate email', async () => {
//     const response = await request(app)
//       .post('/api/users/register')
//       .send({ nombre: 'Juan', email: 'juan@example.com' });

//     expect(response.status).toBe(400);
//     expect(response.body.error).toBe('No se pudo registrar el usuario.');
//   });

//   // Otros casos de prueba...
// });


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

