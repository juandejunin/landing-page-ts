import express, { Application } from 'express';
import userRoutes from '../routes/user.routes'
import path from 'path';
import { connectToDatabase } from './database';

class Server {

    private app: Application;
    private port: string;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '4000'

        this.middlewares();
        this.routes(); // Configuración de rutas
    }

    // Getter para acceder a 'app' de manera pública
    public getApp(): Application {
        return this.app;
    }

    private middlewares() {
        this.app.use(express.json()); // Middleware para parsear JSON

        // Middleware para servir archivos estáticos
        this.app.use(express.static(path.join(__dirname, '../../public')));
    }

    private routes() {
        this.app.use('/api/users', userRoutes); // Configura las rutas de usuarios

    }

    public async listen() {
        // Intentamos conectar a la base de datos antes de iniciar el servidor
        await connectToDatabase();

        // Levantamos el servidor
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en el puerto: ${this.port}`);
        });
    }

}

export default Server;