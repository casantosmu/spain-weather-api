import { type Request, type Response, type NextFunction } from "express";
import Ajv, { type ErrorObject, type ValidateFunction } from "ajv";
import { BadRequestError } from "./error";

// AJV Example
//
// const schema = {
//   type: "object",
//   properties: {
//     foo: { type: "integer" },
//     bar: { type: "string" },
//   },
//   required: ["foo"],
//   additionalProperties: false,
// };

// export const validate = validator.compile(schema);

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
