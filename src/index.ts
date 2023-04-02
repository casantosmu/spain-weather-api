import mongoose from "mongoose";
import express from "express";
import router from "./router";
import pinoHttp from "pino-http";
import pino from "pino";

const logger = pino();
const httpLogger = pinoHttp();

const app = express();
const port = process.env["SERVER_PORT"] ?? 3000;

app.use(httpLogger);
app.use("/v1", router);

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
