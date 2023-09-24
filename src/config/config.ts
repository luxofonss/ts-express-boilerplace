import * as dotenv from 'dotenv';
import * as path from 'path';
import Joi from 'joi';

dotenv.config({
  path: path.resolve(__dirname, '../../.env')
});

console.log('nodeenv:: ', process.env.NODE_ENV);

const envSchema = Joi.object().keys({
  NODE_ENV: Joi.string().required(),
  PORT: Joi.string().default('8080'),
  SERVER_URL: Joi.string().default('http://localhost:8080'),
  CORS_ORIGIN: Joi.string().default('http://localhost:3000'),
  ACCESS_TOKEN_SECRET: Joi.string().required(),
  ACCESS_TOKEN_EXPIRED: Joi.string().default('15m'),
  REFRESH_TOKEN_SECRET: Joi.string().required(),
  REFRESH_TOKEN_EXPIRED: Joi.string().default('7d'),
  REFRESH_TOKEN_COOKIE_NAME: Joi.string().default('refreshToken'),
  POSTGRES_DATABASE: Joi.string().required(),
  POSTGRES_ROOT_PASSWORD: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
  SMTP_HOST: Joi.string().required(),
  SMTP_PORT: Joi.string().default('587'),
  SMTP_USERNAME: Joi.string().required(),
  SMTP_PASSWORD: Joi.string().required(),
  EMAIL_FROM: Joi.string().email().required()
});

const { value: validatedEnv, error } = envSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env, { abortEarly: false, stripUnknown: true });

if (error) {
  throw new Error(
    `Environment variable validation error: \n${error.details
      .map((detail) => detail.message)
      .join('\n')}`
  );
}

const config = {
  node_env: validatedEnv.NODE_ENV,
  server: {
    port: validatedEnv.PORT,
    url: validatedEnv.SERVER_URL
  },
  cors: {
    cors_origin: validatedEnv.CORS_ORIGIN
  },
  jwt: {
    access_token: {
      secret: validatedEnv.ACCESS_TOKEN_SECRET,
      expire: validatedEnv.ACCESS_TOKEN_EXPIRE
    },
    refresh_token: {
      secret: validatedEnv.REFRESH_TOKEN_SECRET,
      expire: validatedEnv.REFRESH_TOKEN_EXPIRE,
      cookie_name: validatedEnv.REFRESH_TOKEN_COOKIE_NAME
    }
  },
  email: {
    smtp: {
      host: validatedEnv.SMTP_HOST,
      port: validatedEnv.SMTP_PORT,
      auth: {
        username: validatedEnv.SMTP_USERNAME,
        password: validatedEnv.SMTP_PASSWORD
      }
    },
    from: validatedEnv.EMAIL_FROM
  }
} as const;

export default config;
