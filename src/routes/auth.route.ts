import { Router } from 'express';
import validate from '../middleware/validate';
import {
  emailVerfifySchema,
  signInSchema,
  signUpSchema
} from '../validations/auth.validation';
import authController from '../controller/auth.controller';
import config from '../config/config';
import authLimiter from '..//middleware/authLimiter';
import emailController from '../controller/email.controller';

const authRouter = Router();

if (config.node_env === 'production') {
  authRouter.use('/api/v1/auth', authLimiter);
}

authRouter.post('/sign-in', validate(signInSchema), authController.signIn);
authRouter.post('/sign-up', validate(signUpSchema), authController.signUp);
authRouter.post(
  '/verify-email',
  validate(emailVerfifySchema),
  emailController.sendVerifyEmail
);

export default authRouter;
