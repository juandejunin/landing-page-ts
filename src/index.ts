import dotenv from 'dotenv';
dotenv.config()
import Server from './config/Server';

console.log("JWT_SECRET_KEY: ", process.env.JWT_SECRET_KEY); 

const server = new Server();

server.listen();