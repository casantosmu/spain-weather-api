import { runSeed } from "../../../db";
import { seedLocationsService } from "../locationService";

(async () => {
  await runSeed(seedLocationsService);
})();
