import mongoose from "mongoose";
import { config } from "./config";
import logger from "./logger";
import { handleError } from "./error";
import { terminateApp } from "./terminate";

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

export const runSeed = async (seedFn: () => Promise<void>) => {
  const seedName = seedFn.name;

  logger.info(`Stating seed: ${seedName}`);

  try {
    await connectMongoDb();
    await seedFn();
    logger.info(`Successful seed: ${seedName}`);
    terminateApp("ok");
  } catch (error) {
    logger.error(`Error at seed: ${seedName}`);
    handleError(error);
    terminateApp("error");
  }
};
