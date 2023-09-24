import { Router } from 'express';
import authRouter from './auth.route';

const app = Router();

app.use('/auth', authRouter);

export default app;
