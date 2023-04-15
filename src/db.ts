import mongoose from "mongoose";
import { config } from "./config";
import { logger } from "./logger";

export const connectMongoDb = async () => {
  await mongoose.connect(config.mongodbUri);
  logger.info("Database connection successful");
};
