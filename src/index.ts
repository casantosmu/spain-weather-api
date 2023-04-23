import { connectMongoDb } from "./db";
import { handleError } from "./error";
import { createProvinces } from "./modules/location/locationService";
import { startServer } from "./server";

(async () => {
  try {
    await connectMongoDb();
    await startServer();
    await createProvinces();
  } catch (error) {
    handleError(error);
  }
})();
