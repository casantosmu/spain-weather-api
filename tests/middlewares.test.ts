import { type Request, type Response } from "express";
import * as errorModule from "../src/error";
import { generalErrorMiddleware, notFoundMiddleware } from "../src/middlewares";

describe("generalErrorMiddleware", () => {
  describe("when receive a error", () => {
    test("should call handle Error with the error", () => {
      const req = {};
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();
      const error = new Error("Something went wrong");
      jest.spyOn(errorModule, "handleError");

      generalErrorMiddleware(error, req as Request, res as Response, next);

      expect(errorModule.handleError).toHaveBeenCalledWith(error);
    });
  });

  test("should call res with a default general error response with a 500 status code", () => {
    const req = {};
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    const defaultGeneralError = new errorModule.GeneralError();

    generalErrorMiddleware(new Error(), req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(defaultGeneralError.statusCode);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        name: defaultGeneralError.name,
        message: defaultGeneralError.message,
      },
    });
  });

  describe("when receive a general error", () => {
    test("should call res with a default general error response with a 500 status code", () => {
      const req = {};
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();
      const defaultGeneralError = new errorModule.GeneralError();
      const error = new errorModule.GeneralError({ message: "Custom message" });

      generalErrorMiddleware(error, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(defaultGeneralError.statusCode);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          name: defaultGeneralError.name,
          message: defaultGeneralError.message,
        },
      });
    });
  });

  describe("when receive a non general app error", () => {
    test("should call res with error status code, name, and message from app error", () => {
      const req = {};
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();
      const appError = new errorModule.NotFoundError();

      generalErrorMiddleware(appError, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(appError.statusCode);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          name: appError.name,
          message: appError.message,
        },
      });
    });
  });
});

describe("notFoundMiddleware", () => {
  test("should return a not found error with 404 status code", () => {
    const req = {};
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const notFoundError = new errorModule.NotFoundError();

    notFoundMiddleware(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(notFoundError.statusCode);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        name: notFoundError.name,
        message: notFoundError.message,
      },
    });
  });
});
