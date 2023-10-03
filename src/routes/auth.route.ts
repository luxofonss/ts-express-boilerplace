import { Router } from 'express';
import authLimiter from '..//middleware/authLimiter';
import config from '../config/config';
import authController from '../controller/auth.controller';
import validate from '../middleware/validate';
import {
  decodePayload,
  signInSchema,
  signUpSchema
} from '../validations/auth.validation';
import isAuth from '../middleware/isAuth';

const authRouter = Router();

if (config.node_env === 'production') {
  authRouter.use('/api/v1/auth', authLimiter);
}

authRouter.post('/sign-in', validate(signInSchema), authController.signIn);
authRouter.post('/sign-up', validate(signUpSchema), authController.signUp);

/** routes that need authorization */
authRouter.use(isAuth);

authRouter.post(
  '/decode-key',
  validate(decodePayload),
  authController.decodePrivateKey
);

export default authRouter;
