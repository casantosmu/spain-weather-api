import { AppError, handleError } from "../src/error";
import { logger } from "../src/logger";

describe("handleError", () => {
  describe("when receives an error", () => {
    it("logs the error message and exits the process", () => {
      jest.spyOn(logger, "error");
      jest.spyOn(process, "exit").mockImplementation();
      const error = new Error("Some error message");
      const errorExitCode = 1;

      handleError(error);

      expect(logger.error).toHaveBeenCalledWith(error.message, error);
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
