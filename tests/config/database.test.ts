import { connectToDatabase, disconnectFromDatabase } from '../../src/config/database';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Cargar las variables de entorno antes de realizar cualquier acción
dotenv.config();

describe('Database connection', () => {
  it('should connect to the MongoDB database successfully', async () => {
    jest.setTimeout(15000);  // Establece un timeout de 15 segundos para la conexión
    await connectToDatabase();
    expect(mongoose.connection.readyState).toBe(1);  // Verifica si la conexión está activa
  });

  afterAll(async () => {
    await disconnectFromDatabase();  // Desconecta la base de datos después de los tests
  });
});