import { logger } from "../src/logger";

const mockErrorLevel = jest.fn();
const mockInfoLevel = jest.fn();

jest.mock("pino", () =>
  jest.fn().mockReturnValue({
    error(...arg: unknown[]) {
      mockErrorLevel(...arg);
    },
    info(...arg: unknown[]) {
      mockInfoLevel(...arg);
    },
  })
);
jest.mock("pino-http");

describe("Logger", () => {
  describe("when it receives a message", () => {
    test("should log a message with the specified level", () => {
      const logMessage = "test message";

      logger.info(logMessage);

      expect(mockInfoLevel).toHaveBeenCalledWith(logMessage);
    });
  });

  describe("when it receives an error and a message", () => {
    test("should log an error with the specified level and error object", () => {
      const error = new Error("Error msg");

      logger.error(error.message, error);

      expect(mockErrorLevel).toHaveBeenCalledWith(error, error.message);
    });
  });
});
