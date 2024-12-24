import 'dotenv/config';
import express from 'express';
import path from 'path';
import { connectToDatabase } from './config/database';
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

// Asegurarse de que Express pueda manejar las solicitudes que buscan archivos estáticos como CSS, JS, imágenes, etc.
app.use('/assets', express.static(path.join(__dirname, '../public/assets')));
app.use('/css', express.static(path.join(__dirname, '../public/css')));
app.use('/js', express.static(path.join(__dirname, '../public/js')));

// Ruta para la landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Exportar la app y el servidor para usarlos en pruebas
const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export { app, server }; // Exportar tanto el app como el server
