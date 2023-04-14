import mongoose from "mongoose";
import express from "express";
import pinoHttp from "pino-http";
import pino, { type LoggerOptions } from "pino";
import router from "./router";
import { config } from "./config";

const loggerOptions: LoggerOptions = {
  errorKey: "error",
  messageKey: "message",
  level: config.logLevel,
};

const logger = pino(loggerOptions);
const httpLogger = pinoHttp(loggerOptions);

const app = express();
const port = config.serverPort;

app.use(httpLogger);
app.disable("x-powered-by");

app.use("/api/v1", router);

const handleError = (error: unknown) => {
  logger.error(error);
};

(async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    logger.info("Database connection successful");
    app.listen(port, async () => {
      logger.info(`Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    handleError(error);
    process.exit(1);
  }
})();
