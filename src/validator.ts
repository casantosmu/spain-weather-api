import { type Request, type Response, type NextFunction } from "express";
import Ajv, { type ErrorObject, type ValidateFunction } from "ajv";
import { BadRequestError } from "./error";

export const validator = new Ajv();

const convertAjvErrorToMessage = (ajvError: ErrorObject) => {
  const propertyName = ajvError.instancePath.split("/").pop();
  const errorMessage = ajvError.message ?? "Validation error";
  return propertyName ? `"${propertyName}": ${errorMessage}` : errorMessage;
};

export const validateMiddleware =
  (validateSchema: ValidateFunction, property: "body" | "query") =>
  (req: Request, _res: Response, next: NextFunction) => {
    validateSchema(req[property]);

    const validationError = validateSchema?.errors?.[0];

    if (validationError) {
      const errorMessage = convertAjvErrorToMessage(validationError);
      const error = new BadRequestError({
        name: "ValidationError",
        message: errorMessage,
      });
      next(error);
      return;
    }

    next();
  };
