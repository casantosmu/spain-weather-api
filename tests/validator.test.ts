import { type Request, type Response } from "express";
import { validateMiddleware } from "../src/validator";
import { type ErrorObject, type ValidateFunction } from "ajv";

describe("validateMiddleware", () => {
  describe("when called", () => {
    it("should call validateSchema with req.body", () => {
      const req = { body: { foo: "bar" } };
      const res = {};
      const next = jest.fn();

      const validateSchema = jest.fn() as unknown as ValidateFunction;

      const middleware = validateMiddleware(validateSchema);
      middleware(req as Request, res as Response, next);

      expect(validateSchema).toHaveBeenCalledWith(req.body);
    });
  });

  describe("when validateSchema has errors", () => {
    it("should call next with an error", () => {
      const req = { body: { foo: "bar" } };
      const res = {};
      const next = jest.fn();

      const error = new Error("Validation error");

      const validateSchema = jest.fn() as unknown as ValidateFunction;
      validateSchema.errors = [{ instancePath: "" }] as ErrorObject[];

      const middleware = validateMiddleware(validateSchema);
      middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("when validateSchema have error with instancePath and message", () => {
    it("should call next with an error message including instancePath", () => {
      const req = { body: { foo: "bar" } };
      const res = {};
      const next = jest.fn();

      const instancePath = "/foo";
      const errorMessage = "must be integer";
      const error = new Error(`"foo": ${errorMessage}`);

      const validateSchema = jest.fn() as unknown as ValidateFunction;
      validateSchema.errors = [
        { instancePath, message: errorMessage },
      ] as ErrorObject[];

      const middleware = validateMiddleware(validateSchema);
      middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("when validateSchema hasn't errors", () => {
    it("should call next without arguments ", () => {
      const req = { body: { foo: "bar" } };
      const res = {};
      const next = jest.fn();

      const validateSchema = jest.fn() as unknown as ValidateFunction;

      const middleware = validateMiddleware(validateSchema);
      middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith();
    });
  });
});
