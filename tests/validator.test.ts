import { type Request, type Response } from "express";
import { validateMiddleware } from "../src/validator";
import { type ErrorObject, type ValidateFunction } from "ajv";
import { BadRequestError } from "../src/error";

describe("validateMiddleware", () => {
  describe("when called with a validateSchema and a property", () => {
    test("should call validateSchema with the corresponding property in req object", () => {
      const req = { query: { hello: "world" } };
      const res = {};
      const next = jest.fn();
      const validateSchema = jest.fn() as unknown as ValidateFunction;

      const middleware = validateMiddleware(validateSchema, "query");
      middleware(req as unknown as Request, res as Response, next);

      expect(validateSchema).toHaveBeenCalledWith(req.query);
    });
  });

  describe("when validateSchema have error without instancePath and message", () => {
    test("should call next with a bad request error", () => {
      const req = { body: { foo: "bar" } };
      const res = {};
      const next = jest.fn();
      const validateSchema = jest.fn() as unknown as ValidateFunction;
      validateSchema.errors = [{ instancePath: "" }] as ErrorObject[];
      const expectedError = new BadRequestError({
        name: "ValidatorError",
        message: "Validator error",
      });

      const middleware = validateMiddleware(validateSchema, "body");
      middleware(req as Request, res as Response, next);

      expect(next.mock.calls[0][0]).toEqual(expectedError);
    });
  });

  describe("when validateSchema have error with instancePath and message", () => {
    test("should call next with a bad request error message including instancePath", () => {
      const req = { body: { foo: "bar" } };
      const res = {};
      const next = jest.fn();
      const instancePath = "/foo";
      const errorMessage = "must be integer";
      const expectedError = new BadRequestError({
        name: "ValidatorError",
        message: `"foo": ${errorMessage}`,
      });

      const validateSchema = jest.fn() as unknown as ValidateFunction;
      validateSchema.errors = [
        { instancePath, message: errorMessage },
      ] as ErrorObject[];

      const middleware = validateMiddleware(validateSchema, "body");
      middleware(req as Request, res as Response, next);

      expect(next.mock.calls[0][0]).toEqual(expectedError);
    });
  });

  describe("when validateSchema hasn't errors", () => {
    test("should call next without arguments", () => {
      const req = { body: { foo: "bar" } };
      const res = {};
      const next = jest.fn();
      const validateSchema = jest.fn() as unknown as ValidateFunction;

      const middleware = validateMiddleware(validateSchema, "body");
      middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith();
    });
  });
});
