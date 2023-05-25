import { runMigration } from "../../../db";
import { handleError } from "../../../error";
import { LocationModel } from "../locationModels";

const updateLocation = async () => {
  await LocationModel.updateMany(
    {
      latitude: { $exists: true },
      longitude: { $exists: true },
    },
    [
      {
        $set: {
          geo2dPoint: {
            type: "Point",
            coordinates: ["$longitude", "$latitude"],
          },
        },
      },
      { $unset: ["longitude", "latitude"] },
    ],
    { strict: false }
  );
};

(async () => {
  try {
    await runMigration(
      "Change latitude longitude fields to GEOJson 2d schema",
      updateLocation
    );
  } catch (error) {
    handleError(error);
  }
})();
