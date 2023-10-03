import Joi from 'joi';
import type {
  EmailRequestBody,
  UserLoginCredentials,
  UserSignUpCredentials
} from '../types/types';

export const signUpSchema = {
  body: Joi.object<UserSignUpCredentials>().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    username: Joi.string().required().min(2)
  })
};

export const signInSchema = {
  body: Joi.object<UserLoginCredentials>().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6)
  })
};

export const emailVerifySchema = {
  body: Joi.object<EmailRequestBody>().keys({
    email: Joi.string().required().email()
  })
};

export const decodePayload = {
  body: Joi.object().keys({
    password: Joi.string().required()
  })
};
