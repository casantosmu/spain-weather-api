import {
  AppError,
  BadRequestError,
  ConflictError,
  GeneralError,
  NotFoundError,
  UnprocessableEntityError,
  handleError,
} from "../src/error";
import logger from "../src/logger";
import { terminateApp } from "../src/terminate";

jest.mock("../src/terminate");

describe("handleError", () => {
  describe("when receives an AppError", () => {
    test("logs the error message and error object, but does not terminate the app", () => {
      jest.spyOn(logger, "warn");
      const appError = new NotFoundError();

      handleError(appError);

      expect(logger.warn).toHaveBeenCalledWith(appError.message, appError);
      expect(terminateApp).not.toHaveBeenCalled();
    });
  });

  describe("when receives a GeneralError", () => {
    test("logs the error message and error object and terminates the app", () => {
      jest.spyOn(logger, "error");
      const generalError = new GeneralError();

      handleError(generalError);

      expect(logger.error).toHaveBeenCalledWith(
        generalError.message,
        generalError
      );
      expect(terminateApp).toHaveBeenCalledWith("error");
    });
  });

  describe("when receives an error", () => {
    test("creates and logs an AppError with error stack and terminates the app", () => {
      const spyLoggerError = jest.spyOn(logger, "error");
      const error = new Error("Some error message");

      handleError(error);

      expect(spyLoggerError.mock.calls[0]?.[0]).toBe(error.message);
      expect(spyLoggerError.mock.calls[0]?.[1]?.name).toBe(error.name);
      expect(spyLoggerError.mock.calls[0]?.[1]?.message).toBe(error.message);
      expect(spyLoggerError.mock.calls[0]?.[1]?.stack).toBe(error.stack);
      expect(spyLoggerError.mock.calls[0]?.[1]?.cause).toBe(error);
      expect(spyLoggerError.mock.calls[0]?.[1]).toBeInstanceOf(GeneralError);
      expect(terminateApp).toHaveBeenCalledWith("error");
    });
  });

  describe("when not receives an error", () => {
    test("logs an error message with the unexpected value and terminates the app", () => {
      jest.spyOn(logger, "error");
      const value = { foo: "bar" };

      handleError(value);

      expect(logger.error).toHaveBeenCalledWith(
        "Unexpected value encountered at handleError: object { foo: 'bar' }",
        expect.any(GeneralError)
      );
      expect(terminateApp).toHaveBeenCalledWith("error");
    });
  });
});

describe("AppError", () => {
  test("should create an instance with the correct properties", () => {
    const statusCode = 500;
    const name = "TestError";
    const message = "This is a test error";
    const cause = new Error("Cause error");

    const error = new AppError(statusCode, name, message, { cause });

    expect(error).toBeInstanceOf(Error);
    expect(error.statusCode).toEqual(statusCode);
    expect(error.name).toEqual(name);
    expect(error.message).toEqual(message);
    expect(error.cause).toEqual(cause);
  });
});

describe("GeneralError", () => {
  test("should create a GeneralError instance with default values", () => {
    const error = new GeneralError();

    expect(error).toBeInstanceOf(AppError);
    expect(error.name).toBe("InternalServerError");
    expect(error.message).toBe("Something went wrong");
    expect(error.statusCode).toBe(500);
    expect(error.cause).toBeUndefined();
  });

  test("should create a GeneralError instance with provided values", () => {
    const errorCause = new Error("This is the cause");
    const errorName = "CustomError";
    const errorMessage = "This is a custom error message";

    const error = new GeneralError({
      name: errorName,
      message: errorMessage,
      cause: errorCause,
    });

    expect(error.name).toBe(errorName);
    expect(error.message).toBe(errorMessage);
    expect(error.statusCode).toBe(500);
    expect(error.cause).toBe(errorCause);
  });
});

describe("NotFoundError", () => {
  test("should create a NotFoundError instance with default values", () => {
    const error = new NotFoundError();

    expect(error).toBeInstanceOf(AppError);
    expect(error.name).toBe("NotFoundError");
    expect(error.message).toBe("Resource not found");
    expect(error.statusCode).toBe(404);
    expect(error.cause).toBeUndefined();
  });

  test("should create a NotFoundError instance with provided values", () => {
    const errorCause = new Error("This is the cause");
    const errorName = "CustomError";
    const errorMessage = "This is a custom error message";

    const error = new NotFoundError({
      name: errorName,
      message: errorMessage,
      cause: errorCause,
    });

    expect(error.name).toBe(errorName);
    expect(error.message).toBe(errorMessage);
    expect(error.statusCode).toBe(404);
    expect(error.cause).toBe(errorCause);
  });
});

describe("BadRequestError", () => {
  test("should create a BadRequestError instance with default values", () => {
    const error = new BadRequestError();

    expect(error).toBeInstanceOf(AppError);
    expect(error.name).toBe("BadRequestError");
    expect(error.message).toBe("Bad Request");
    expect(error.statusCode).toBe(400);
    expect(error.cause).toBeUndefined();
  });

  test("should create a BadRequestError instance with provided values", () => {
    const errorCause = new Error("This is the cause");
    const errorName = "CustomError";
    const errorMessage = "This is a custom error message";

    const error = new BadRequestError({
      name: errorName,
      message: errorMessage,
      cause: errorCause,
    });

    expect(error.name).toBe(errorName);
    expect(error.message).toBe(errorMessage);
    expect(error.statusCode).toBe(400);
    expect(error.cause).toBe(errorCause);
  });
});

describe("UnprocessableEntityError", () => {
  test("should create an UnprocessableEntityError instance with default values", () => {
    const error = new UnprocessableEntityError();

    expect(error).toBeInstanceOf(AppError);
    expect(error.name).toBe("UnprocessableEntityError");
    expect(error.message).toBe("Unprocessable Entity");
    expect(error.statusCode).toBe(422);
    expect(error.cause).toBeUndefined();
  });

  test("should create an UnprocessableEntityError instance with provided values", () => {
    const errorCause = new Error("This is the cause");
    const errorName = "CustomError";
    const errorMessage = "This is a custom error message";

    const error = new UnprocessableEntityError({
      name: errorName,
      message: errorMessage,
      cause: errorCause,
    });

    expect(error.name).toBe(errorName);
    expect(error.message).toBe(errorMessage);
    expect(error.statusCode).toBe(422);
    expect(error.cause).toBe(errorCause);
  });
});

describe("ConflictError", () => {
  test("should create a ConflictError instance with default values", () => {
    const error = new ConflictError();

    expect(error).toBeInstanceOf(AppError);
    expect(error.name).toBe("ConflictError");
    expect(error.message).toBe("Conflict");
    expect(error.statusCode).toBe(409);
    expect(error.cause).toBeUndefined();
  });

  test("should create a ConflictError instance with provided values", () => {
    const errorCause = new Error("This is the cause");
    const errorName = "CustomError";
    const errorMessage = "This is a custom error message";

    const error = new ConflictError({
      name: errorName,
      message: errorMessage,
      cause: errorCause,
    });

    expect(error.name).toBe(errorName);
    expect(error.message).toBe(errorMessage);
    expect(error.statusCode).toBe(409);
    expect(error.cause).toBe(errorCause);
  });
});
