import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validateUserRegistration } from '../middlewares/validation.middleware';

const router = Router();
const userController = new UserController();

router.post('/register', validateUserRegistration, userController.register);  // Ruta para registrar usuario

export default router;
