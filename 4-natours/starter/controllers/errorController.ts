import { ValidationError } from '../utils/error';
import * as jwt from 'jsonwebtoken';
import * as express from 'express';
import mongoose from 'mongoose';

const handleCastErrorDB = (err: mongoose.Error.ValidatorError) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new ValidationError(message, 400);
};

const handleDuplicateFieldsDB = (err: mongoose.Error.ValidatorError) => {
  const value = (err as any).errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new ValidationError(message, 400);
};

const handleValidationErrorDB = (err: mongoose.Error.ValidatorError) => {
  const errors = Object.values((err as any).errors).map(
    (el: Error) => el.message
  );
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new ValidationError(message, 400);
};

const handleJsonWebTokenError = (err: jwt.JsonWebTokenError) =>
  new ValidationError('Invalid token. Plekase log in again!', 401);

const handleTokenExpiredError = (err: jwt.JsonWebTokenError) =>
  new ValidationError('Your token has expired! Please log in again.', 401);

const sendErrorDev = (err: ValidationError, res: express.Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: ValidationError, res: express.Response) => {
  //Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('ERROR: ', err);

    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

export const handleError = (
  err: ValidationError,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError') error = handleCastErrorDB(error as any);
    if ((error as any).code === 11000)
      error = handleDuplicateFieldsDB(error as any);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error as any);
    if (error.name === 'JsonWebTokenError')
      error = handleJsonWebTokenError(error as any);
    if (error.name === 'TokenExpiredError')
      error = handleTokenExpiredError(error as any);

    sendErrorProd(error, res);
  }
};
