import { type Request, type Response, type NextFunction } from "express";
import Ajv, { type ErrorObject, type ValidateFunction } from "ajv";

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
  (validateSchema: ValidateFunction) =>
  (req: Request, _res: Response, next: NextFunction) => {
    validateSchema(req.body);

    const validationError = validateSchema?.errors?.[0];

    if (validationError) {
      const errorMessage = convertAjvErrorToMessage(validationError);
      const error = new Error(errorMessage);
      next(error);
      return;
    }

    next();
  };
