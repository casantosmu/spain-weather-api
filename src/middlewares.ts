import { type NextFunction, type Request, type Response } from "express";
import { AppError, GeneralError, NotFoundError, handleError } from "./error";

const isPublicError = (error: Error | AppError): error is AppError =>
  error instanceof AppError && !(error instanceof GeneralError);

export const generalErrorMiddleware = (
  error: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  handleError(error);

  const { message, name, statusCode } = isPublicError(error)
    ? error
    : new GeneralError();

  res.status(statusCode).json({
    error: {
      name,
      message,
    },
  });
};

export const notFoundMiddleware = (_req: Request, res: Response) => {
  const { name, message, statusCode } = new NotFoundError();

  res.status(statusCode).json({
    error: {
      name,
      message,
    },
  });
};

export const asyncWrapper =
  (
    callback: (req: Request, res: Response, next: NextFunction) => Promise<void>
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await callback(req, res, next);
    } catch (error) {
      next(error);
    }
  };
