import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import config from './config/config';
import { errorHandler } from './middleware/errorHanlder';
import appRouter from './routes';
import compressFilter from './utils/compressFilter.util';
import { xssMiddleware } from './middleware/xss.middleware';

const app: Express = express();

// Helmet is used to secure this app by configuring the http-header
app.use(helmet());

// parser json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// cookie parser
app.use(cookieParser());

// Compression is used to reduce the size of the response body
app.use(compression({ filter: compressFilter }));

// avoid xss attach
app.use(xssMiddleware());

// cors configuration
app.use(
  cors({
    // origin is given a array if we want to have multiple origins later
    origin: String(config.cors.cors_origin).split('|'),
    credentials: true
  })
);

// routes
app.use('/v1/api', appRouter);

app.use(errorHandler);

export default app;
