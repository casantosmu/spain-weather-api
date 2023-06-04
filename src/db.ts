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

// Enable Mongoose debug mode and log collection, method, query, and document
mongoose.set(
  "debug",
  (collectionName, method, query: unknown, doc: unknown) => {
    logger.debug(`${collectionName}.${method}`, {
      query,
      doc,
    });
  }
);

export const runSeeder = async (
  description: string,
  seederFn: () => Promise<void>
) => {
  logger.info(`Starting seeder "${description}"`);

  try {
    await connectMongoDb();
    await seederFn();
    logger.info("Seeder completed successfully");
  } catch (error) {
    logger.error("An error occurred while seeding");
    throw error;
  } finally {
    await closeMongoDb();
  }
};

export const runMigration = async (
  description: string,
  migrationFn: () => Promise<void>
) => {
  logger.info(`Stating migration "${description}"`);

  try {
    await connectMongoDb();
    await migrationFn();
    logger.info("Migration completed successfully");
  } catch (error) {
    logger.error("An error occurred while migrating");
    throw error;
  } finally {
    await closeMongoDb();
  }
};

// GeoJSON point format:
// MongoDB documentation: https://www.mongodb.com/docs/manual/reference/geojson/
// Mongoose documentation: https://mongoosejs.com/docs/geojson.html
export const pointSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  { _id: false }
);
