/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Response } from 'express';
import STATUS_CODE from './statusCodes';

class SuccessResponse {
  message: string;
  status: number;
  data: any;
  options: Record<string, any>;

  constructor({
    message,
    status = STATUS_CODE.OK,
    data = {},
    options = {}
  }: {
    message: string;
    status?: number;
    data?: any;
    options?: Record<string, any>;
  }) {
    this.message = message;
    this.status = status;
    this.data = data;
    this.options = options;
  }

  send(res: Response, _headers: Record<string, any> = {}): Response {
    return res.status(this.status).json(this);
  }
}

class Ok extends SuccessResponse {
  constructor({
    message,
    data = {},
    options = {}
  }: {
    message: string;
    data?: any;
    options?: Record<string, any>;
  }) {
    super({ message, data, options });
  }
}

class Create extends SuccessResponse {
  constructor({
    message,
    data = {},
    options = {}
  }: {
    message: string;
    data?: any;
    options?: Record<string, any>;
  }) {
    super({ message, status: STATUS_CODE.CREATED, data, options });
  }
}

const CREATED = (
  res: Response,
  message: string,
  data?: any,
  options: Record<string, any> = {}
) => {
  return new Create({
    message,
    data,
    options
  }).send(res);
};

const OK = (
  res: Response,
  message: string,
  data?: any,
  options: Record<string, any> = {}
) => {
  return new Ok({
    message,
    data,
    options
  }).send(res);
};

export { OK, CREATED };
