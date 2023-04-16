import { AppError, GeneralError, handleError } from "../src/error";
import { logger } from "../src/logger";

describe("handleError", () => {
  describe("when receives an AppError", () => {
    it("logs the error message and error object, but does not exit the process", () => {
      jest.spyOn(logger, "error");
      jest.spyOn(process, "exit").mockImplementation();
      const appError = new GeneralError();

      handleError(appError);

      expect(logger.error).toHaveBeenCalledWith(appError.message, appError);
      expect(process.exit).not.toHaveBeenCalled();
    });
  });

  describe("when receives an error", () => {
    it("creates and logs an AppError and exits the process", () => {
      jest.spyOn(logger, "error");
      jest.spyOn(process, "exit").mockImplementation();
      const error = new Error("Some error message");
      const errorExitCode = 1;

      handleError(error);

      expect(logger.error).toHaveBeenCalledWith(
        error.message,
        expect.any(GeneralError)
      );
      expect(process.exit).toHaveBeenCalledWith(errorExitCode);
    });
  });

  describe("when not receives an error", () => {
    it("logs an error message with the unexpected value and exits the process", () => {
      jest.spyOn(logger, "error");
      jest.spyOn(process, "exit").mockImplementation();
      const value = { foo: "bar" };
      const errorExitCode = 1;

      handleError(value);

      expect(logger.error).toHaveBeenCalledWith(
        "Unexpected value encountered at handleError: object { foo: 'bar' }"
      );
      expect(process.exit).toHaveBeenCalledWith(errorExitCode);
    });
  });
});

describe("AppError", () => {
  it("should create an instance with the correct properties", () => {
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
