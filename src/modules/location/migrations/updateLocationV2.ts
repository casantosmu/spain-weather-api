import { runMigration } from "../../../db";
import { GeneralError, handleError } from "../../../error";
import { LocationModel } from "../locationModels";

const updateLocationV2 = async () => {
  const locationsV1 = await LocationModel.find({
    schemaVersion: undefined,
  });

  const updatedLocations = locationsV1.map((locationToMigrate) => {
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
          "Location schema v1 required properties 'longitude' and 'latitude' are missing or not numbers.",
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

    locationToMigrate.schemaVersion = 2;

    return locationToMigrate;
  });

  await LocationModel.bulkSave(updatedLocations);
  await LocationModel.updateMany(
    {},
    { $unset: { longitude: 1, latitude: 1 } },
    // Since these fields do not exist in the schema, we need to set strict to false.
    { strict: false }
  );
};

(async () => {
  try {
    await runMigration(updateLocationV2);
  } catch (error) {
    handleError(error);
  }
})();
