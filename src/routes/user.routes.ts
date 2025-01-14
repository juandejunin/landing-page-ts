import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validateUserRegistration } from '../middlewares/validation.middleware';


const router = Router();
const userController = new UserController();

router.post('/register', validateUserRegistration, userController.register.bind(userController));  // Ruta para registrar usuario

router.get('/verify-email', userController.verifyEmail.bind(userController)); // Ruta para verificar email



export default router;
