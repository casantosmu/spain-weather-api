import { runSeeder } from "../../../db";
import { seedLocationsService } from "../locationService";

(async () => {
  await runSeeder(seedLocationsService);
})();
