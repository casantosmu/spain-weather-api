import mongoose from "mongoose";
import express from "express";
import pinoHttp from "pino-http";
import pino, { type LoggerOptions } from "pino";

const loggerOptions: LoggerOptions = {
  errorKey: "error",
  messageKey: "message",
  level: process.env["LOG_LEVEL"]!,
};

const logger = pino(loggerOptions);
const httpLogger = pinoHttp(loggerOptions);

const app = express();
const port = process.env["SERVER_PORT"] ?? 3000;

app.use(httpLogger);
app.disable("x-powered-by");

const handleError = (error: unknown) => {
  logger.error(error);
};

(async () => {
  try {
    await mongoose.connect(process.env["MONGODB_URI"]!);
    logger.info("Database connection successful");
    app.listen(port, async () => {
      logger.info(`Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    handleError(error);
    process.exitCode = 1;
  }
})();
