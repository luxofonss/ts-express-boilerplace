/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/no-explicit-any */
import REASON_PHRASES from './reasonPhrases';
import STATUS_CODE from './statusCodes';

class BaseError extends Error {
  status: number;
  errors: any[];
  isOperational: boolean;

  constructor(
    message: string,
    status: number,
    errors: any[],
    isOperational: boolean
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.status = status;
    this.errors = errors;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ConflictError extends BaseError {
  constructor(
    message: string = REASON_PHRASES.CONFLICT,
    errors: any[] = [],
    status: number = STATUS_CODE.CONFLICT,
    isOperational: boolean = true
  ) {
    super(message, status, errors, isOperational);
  }
}

class BadRequestError extends BaseError {
  constructor(
    message: string = REASON_PHRASES.BAD_REQUEST,
    errors: any[] = [],
    status: number = STATUS_CODE.BAD_REQUEST,
    isOperational: boolean = true
  ) {
    super(message, status, errors, isOperational);
  }
}

class ForbiddenError extends BaseError {
  constructor(
    message: string = REASON_PHRASES.FORBIDDEN,
    errors: any[] = [],
    status: number = STATUS_CODE.FORBIDDEN,
    isOperational: boolean = true
  ) {
    super(message, status, errors, isOperational);
  }
}

class UnauthorizedError extends BaseError {
  constructor(
    message: string = REASON_PHRASES.UNAUTHORIZED,
    errors: any[] = [],
    status: number = STATUS_CODE.UNAUTHORIZED,
    isOperational: boolean = true
  ) {
    super(message, status, errors, isOperational);
  }
}

class InternalServerError extends BaseError {
  constructor(
    message: string = REASON_PHRASES.INTERNAL_SERVER_ERROR,
    errors: any[] = [],
    status: number = STATUS_CODE.INTERNAL_SERVER_ERROR,
    isOperational: boolean = true
  ) {
    super(message, status, errors, isOperational);
  }
}

class NotFoundError extends BaseError {
  constructor(
    message: string = REASON_PHRASES.NOT_FOUND,
    errors: any[] = [],
    status: number = STATUS_CODE.NOT_FOUND,
    isOperational: boolean = true
  ) {
    super(message, status, errors, isOperational);
  }
}

export {
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
  BadRequestError,
  BaseError
};
