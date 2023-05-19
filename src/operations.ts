import { BadRequestError } from "./error";

export const defaultCollection = {
  limit: {
    default: 25,
    min: 0,
    max: 1000,
  },
  skip: {
    default: 0,
    min: 0,
    max: Number.MAX_SAFE_INTEGER,
  },
};

export const checkCollectionParams = (
  params: { limit: number; skip: number },
  options = defaultCollection
) => {
  if (params.limit < options.limit.min || params.limit > options.limit.max) {
    throw new BadRequestError({
      message: `Invalid 'limit' value. It should be between ${options.limit.min} and ${options.limit.max}.`,
    });
  }

  if (params.skip < options.skip.min || params.skip > options.skip.max) {
    throw new BadRequestError({
      message: `Invalid 'skip' value. It should be between ${options.skip.min} and ${options.skip.max}.`,
    });
  }
};
