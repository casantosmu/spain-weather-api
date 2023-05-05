import logger from "./logger";
import util from "util";
import { terminateApp } from "./terminate";

const normalizeError = (error: unknown) => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new GeneralError({
      name: error.name,
      message: error.message,
      cause: error,
    });
  }

  return new GeneralError({
    name: "UnexpectedErrorValue",
    message: `Unexpected value encountered at handleError: ${typeof error} ${util.inspect(
      error
    )}`,
  });
};

export const handleError = (error: unknown) => {
  const appError = normalizeError(error);

  if (appError instanceof GeneralError) {
    logger.error(appError.message, appError);
    terminateApp("error");
    return;
  }

  logger.warn(appError.message, appError);
};

export class AppError extends Error {
  constructor(
    readonly statusCode: number,
    override readonly name: string,
    override readonly message: string,
    readonly options?: ErrorOptions
  ) {
    super(message, options);
  }
}

type ErrorProps = {
  name?: string;
  message?: string;
  cause?: unknown;
};

export class GeneralError extends AppError {
  constructor({
    name = "InternalServerError",
    message = "Something went wrong",
    cause,
  }: ErrorProps | undefined = {}) {
    super(500, name, message, { cause });
  }
}

export class NotFoundError extends AppError {
  constructor({
    name = "NotFoundError",
    message = "Resource not found",
    cause,
  }: ErrorProps | undefined = {}) {
    super(404, name, message, { cause });
  }
}

export class BadRequestError extends AppError {
  constructor({
    name = "BadRequestError",
    message = "Bad Request",
    cause,
  }: ErrorProps | undefined = {}) {
    super(400, name, message, { cause });
  }
}

export class UnprocessableEntityError extends AppError {
  constructor({
    name = "UnprocessableEntityError",
    message = "Unprocessable Entity",
    cause,
  }: ErrorProps | undefined = {}) {
    super(422, name, message, { cause });
  }
}

export class ConflictError extends AppError {
  constructor({
    name = "ConflictError",
    message = "Conflict",
    cause,
  }: ErrorProps | undefined = {}) {
    super(409, name, message, { cause });
  }
}
