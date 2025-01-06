import express from 'express';
import path from 'path';
import userRoutes from './routes/user.routes';

const app = express();
app.disable("x-powered-by");

// Middleware global
app.use(express.json());

// Rutas
app.use('/api/users', userRoutes);

// Archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

export default app;
