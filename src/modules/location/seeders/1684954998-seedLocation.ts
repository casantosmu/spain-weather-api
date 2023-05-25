import { runSeeder } from "../../../db";
import { handleError } from "../../../error";
import { seedLocationsService } from "../locationService";

(async () => {
  try {
    await runSeeder(
      "Add real spain locations to locations collection",
      seedLocationsService
    );
  } catch (error) {
    handleError(error);
  }
})();
