import pino, { type LoggerOptions } from "pino";
import pinoHttp from "pino-http";
import { config } from "./config";

type LogLevels = "debug" | "info" | "warn" | "error" | "fatal";

const loggerOptions: LoggerOptions = {
  level: config.logLevel,
  messageKey: "message",
  errorKey: "error",
  formatters: {
    level(_label, number) {
      return { level: number };
    },
  },
};

const pinoLogger = pino(loggerOptions);

const log =
  (level: LogLevels) =>
  (message: string, metadata?: Record<string, unknown> | Error) => {
    if (metadata) {
      pinoLogger[level](metadata, message);
      return;
    }

    pinoLogger[level](message);
  };

export const httpLogger = pinoHttp(loggerOptions);

export const logger = {
  debug: log("debug"),
  error: log("error"),
  info: log("info"),
  warning: log("warn"),
  fatal: log("fatal"),
};
