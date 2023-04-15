import { connectMongoDb } from "./db";
import { handleError } from "./error";
import { startServer } from "./server";

(async () => {
  try {
    await connectMongoDb();
    await startServer();
  } catch (error) {
    handleError(error);
  }
})();
