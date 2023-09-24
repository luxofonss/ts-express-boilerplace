import { Router } from 'express';
import validate from '../middleware/validate';
import { signupSchema } from '../validations/auth.validation';
import authController from '../controller/auth.controller';

const authRouter = Router();

authRouter.post('/signup', validate(signupSchema), authController.signup);

export default authRouter;
