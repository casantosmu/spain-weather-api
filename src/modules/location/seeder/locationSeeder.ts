import { runSeeder } from "../../../db";
import { handleError } from "../../../error";
import { seedLocationsService } from "../locationService";

(async () => {
  try {
    await runSeeder(seedLocationsService);
  } catch (error) {
    handleError(error);
  }
})();
