import { ResponseFactory } from "./ResponseFactory.js";

export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.cause || 500;

  return ResponseFactory.error(res, err.message, statusCode);
};

