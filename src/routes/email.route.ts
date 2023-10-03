import { emailVerifySchema } from '../validations/auth.validation';
import { Router } from 'express';
import validate from '../middleware/validate';
import emailController from '../controller/email.controller';

const mailRouter = Router();

mailRouter.get('/verify-email/:token', emailController.handleVerifyEmail);

mailRouter.post(
  '/verify-email',
  validate(emailVerifySchema),
  emailController.sendVerifyEmail
);

export default mailRouter;
