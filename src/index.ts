import 'dotenv/config';
import app from './app';
import { connectToDatabase } from './config/database';

const PORT = process.env.PORT || 3000;

// Conectar a la base de datos
connectToDatabase();

const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export { app, server };
