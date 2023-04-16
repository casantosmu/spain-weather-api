import { logger } from "./logger";
import util from "util";

export const handleError = (error: unknown) => {
  if (error instanceof AppError) {
    logger.error(error.message, error);
    return;
  }

  if (error instanceof Error) {
    const appError = new GeneralError({
      cause: error,
      message: error.message,
    });
    logger.error(appError.message, appError);

    process.exit(1);
  }

  logger.error(
    `Unexpected value encountered at handleError: ${typeof error} ${util.inspect(
      error
    )}`
  );

  process.exit(1);
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
