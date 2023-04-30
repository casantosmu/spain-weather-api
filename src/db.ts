import mongoose from "mongoose";
import { config } from "./config";
import logger from "./logger";

export const connectMongoDb = async () => {
  await mongoose.connect(config.mongodbUri);
  logger.info("Database connection successful");
};

export const closeMongoDb = async () => {
  await mongoose.disconnect();
  logger.info("Close all database connections successful");
};

mongoose.set(
  "debug",
  (collectionName, method, query: unknown, doc: unknown) => {
    logger.debug(`${collectionName}.${method}`, {
      query,
      doc,
    });
  }
);
