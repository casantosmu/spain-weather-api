import mongoose from "mongoose";
import { config } from "./config";
import logger from "./logger";
import { GeneralError, handleError } from "./error";
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

export const runSeeder = async (seederFn: () => Promise<void>) => {
  const seederName = seederFn.name;

  logger.info(`Stating seeder "${seederName}"`);

  try {
    await connectMongoDb();
    await seederFn();
    logger.info(`Seeder completed successfully "${seederName}"`);
    terminateApp("ok");
  } catch (error) {
    const seederError = new GeneralError({
      name: "SeedError",
      message: `An error occurred while seeding "${seederName}".`,
      cause: error,
    });
    handleError(seederError);
  }
};
