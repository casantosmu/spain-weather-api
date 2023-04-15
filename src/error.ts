import { logger } from "./logger";
import util from "util";

export const handleError = (error: unknown) => {
  if (error instanceof Error) {
    logger.error(error.message, error);
  } else {
    logger.error(
      `Unexpected value encountered at handleError: ${typeof error} ${util.inspect(
        error
      )}`
    );
  }

  process.exit(1);
};
