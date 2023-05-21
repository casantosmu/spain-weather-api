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

export const dropMongoDb = async () => {
  await mongoose.connection.dropDatabase();
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
  } catch (error) {
    logger.error(`An error occurred while seeding "${seederName}".`);
    throw error;
  } finally {
    await closeMongoDb();
  }
};

export const runMigration = async (migrationFn: () => Promise<void>) => {
  const migrationName = migrationFn.name;

  logger.info(`Stating migration "${migrationName}"`);

  try {
    await connectMongoDb();
    await migrationFn();
    logger.info(`Migration completed successfully "${migrationName}"`);
  } catch (error) {
    logger.error(`An error occurred while migrating "${migrationName}".`);
    throw error;
  } finally {
    await closeMongoDb();
  }
};
