import { type Request, type Response } from "express";
import { GeneralError, NotFoundError } from "../src/error";
import { generalErrorMiddleware, notFoundMiddleware } from "../src/middlewares";

describe("generalErrorMiddleware", () => {
  describe("when receive a error", () => {
    it("should call res with a default general error response with a 500 status code", () => {
      const req = {} as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn();
      const generalError = new GeneralError();
      const error = new Error("Something went wrong");

      generalErrorMiddleware(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(generalError.statusCode);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          name: generalError.name,
          message: generalError.message,
        },
      });
    });
  });

  describe("when receive a general error", () => {
    it("should call res with a default general error response with a 500 status code", () => {
      const req = {} as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn();
      const generalError = new GeneralError();
      const error = new GeneralError({ message: "Custom message" });

      generalErrorMiddleware(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(generalError.statusCode);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          name: generalError.name,
          message: generalError.message,
        },
      });
    });
  });

  describe("when receive a non general app error", () => {
    it("should call res with error status code, name, and message from app error", () => {
      const req = {} as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn();
      const appError = new NotFoundError();

      generalErrorMiddleware(appError, req, res, next);

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
  it("should return a not found error with 404 status code", () => {
    const req = {} as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const notFoundError = new NotFoundError();

    notFoundMiddleware(req, res);

    expect(res.status).toHaveBeenCalledWith(notFoundError.statusCode);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        name: notFoundError.name,
        message: notFoundError.message,
      },
    });
  });
});
