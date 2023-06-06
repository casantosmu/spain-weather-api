import { type Request, type Response, type NextFunction } from "express";
import Ajv, { type ErrorObject, type ValidateFunction } from "ajv";
import { BadRequestError } from "./error";
import isIP from "validator/lib/isIP";
import isLatLong from "validator/lib/isLatLong";

export class ValidatorError extends BadRequestError {
  constructor(message: string) {
    super({
      name: "ValidatorError",
      message,
    });
  }
}

export const stringValidator = {
  isIp: isIP,
  isLatLng: isLatLong,
};
export const validator = new Ajv({ coerceTypes: true });

const convertAjvErrorToMessage = (ajvError: ErrorObject) => {
  const propertyName = ajvError.instancePath.split("/").pop();
  const errorMessage = ajvError.message ?? "Validator error";
  return propertyName ? `"${propertyName}": ${errorMessage}` : errorMessage;
};

export const validateMiddleware =
  (validateSchema: ValidateFunction, property: "body" | "query") =>
  (req: Request, _res: Response, next: NextFunction) => {
    validateSchema(req[property]);

    const validationError = validateSchema.errors?.[0];

    if (validationError) {
      const errorMessage = convertAjvErrorToMessage(validationError);
      const validatorError = new ValidatorError(errorMessage);
      next(validatorError);
      return;
    }

    next();
  };
