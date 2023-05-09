import app from "./app";
import { connectMongoDb } from "./db";
import { handleError } from "./error";
import { startServer } from "./server";

(async () => {
  try {
    await connectMongoDb();
    await startServer(app);
  } catch (error) {
    handleError(error);
  }
})();
