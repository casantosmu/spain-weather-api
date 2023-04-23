import { logger } from "./logger";
import util from "util";
import { terminateApp } from "./terminate";

export const handleError = (error: unknown) => {
  if (error instanceof AppError) {
    logger.error(error.message, error);

    if (error instanceof GeneralError) {
      terminateApp("error");
    }

    return;
  }

  if (error instanceof Error) {
    const appError = new GeneralError({
      cause: error,
      message: error.message,
    });
    logger.error(appError.message, appError);

    terminateApp("error");
    return;
  }

  logger.error(
    `Unexpected value encountered at handleError: ${typeof error} ${util.inspect(
      error
    )}`
  );

  terminateApp("error");
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
  cause?: Error;
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
