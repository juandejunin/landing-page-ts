// import 'dotenv/config';
// import app from './app';
// import { connectToDatabase } from './config/database';

// const PORT = process.env.PORT || 3000;

// // Conectar a la base de datos
// connectToDatabase();

// const server = app.listen(PORT, () => {
//   console.log(`Servidor corriendo en http://localhost:${PORT}`);
// });

// export { app, server }


import dotenv from 'dotenv';
dotenv.config()
import Server from './config/Server';

console.log("JWT_SECRET_KEY: ", process.env.JWT_SECRET_KEY); 

const server = new Server();

server.listen();