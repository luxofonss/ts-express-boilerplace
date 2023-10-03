import { Router } from 'express';
import authRouter from './auth.route';
import mailRouter from './email.route';

const app = Router();

app.use('/auth', authRouter);
app.use('/email', mailRouter);

export default app;
