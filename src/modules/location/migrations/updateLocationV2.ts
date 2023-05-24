import { runMigration } from "../../../db";
import { GeneralError, handleError } from "../../../error";
import { LocationModel } from "../locationModels";

(async () => {
  try {
    await runMigration(
      "Change latitude longitude fields to GEOJson 2d schema",
      async () => {
        const locations = await LocationModel.find();

        const updatedLocations = locations.map((locationToMigrate) => {
          const locationToMigrateObj = locationToMigrate.toObject();

          if (
            !(
              "longitude" in locationToMigrateObj &&
              typeof locationToMigrateObj.longitude === "number" &&
              "latitude" in locationToMigrateObj &&
              typeof locationToMigrateObj.latitude === "number"
            )
          ) {
            throw new GeneralError({
              message:
                "Location schema required properties 'longitude' and 'latitude' are missing or not numbers.",
              cause: locationToMigrateObj,
            });
          }

          locationToMigrate.geo2dPoint = {
            type: "Point",
            coordinates: [
              locationToMigrateObj.longitude,
              locationToMigrateObj.latitude,
            ],
          };

          return locationToMigrate;
        });

        await LocationModel.bulkSave(updatedLocations);
        await LocationModel.updateMany(
          {},
          { $unset: { longitude: 1, latitude: 1 } },
          // Since these fields do not exist in the schema, we need to set strict to false.
          { strict: false }
        );
      }
    );
  } catch (error) {
    handleError(error);
  }
})();
