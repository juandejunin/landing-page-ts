import 'dotenv/config';
import express from 'express';
import path from 'path';
import connectToDatabase from './config/database';
import userRoutes from './routes/user.routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());  // Para parsear JSON en el body de la solicitud

// Conectar a la base de datos
connectToDatabase();

// Rutas
app.use('/api/users', userRoutes);

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Ruta para la landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
