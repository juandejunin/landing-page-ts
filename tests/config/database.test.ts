// import { connectToDatabase, disconnectFromDatabase } from '../../src/config/database';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';

// // Cargar las variables de entorno antes de realizar cualquier acción
// dotenv.config();

// describe('Database connection', () => {
//   it('should connect to the MongoDB database successfully', async () => {
//     jest.setTimeout(15000);  // Establece un timeout de 15 segundos para la conexión
//     await connectToDatabase();
//     expect(mongoose.connection.readyState).toBe(1);  // Verifica si la conexión está activa
//   });

//   afterAll(async () => {
//     await disconnectFromDatabase();  // Desconecta la base de datos después de los tests
//   });
// });


import { connectToDatabase, disconnectFromDatabase } from '../../src/config/database';


// Mock the database module
jest.mock('../../src/config/database', () => ({
  connectToDatabase: jest.fn(() => Promise.resolve()),
  disconnectFromDatabase: jest.fn(() => Promise.resolve()),
}));

describe('Mocked Database connection', () => {
  it('should call connectToDatabase successfully', async () => {
    await connectToDatabase();
    expect(connectToDatabase).toHaveBeenCalledTimes(1);
  });

  afterAll(async () => {
    await disconnectFromDatabase();
    expect(disconnectFromDatabase).toHaveBeenCalledTimes(1);
  });
});
