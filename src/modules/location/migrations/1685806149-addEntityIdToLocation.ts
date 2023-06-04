import { randomUUID } from "crypto";
import { runMigration } from "../../../db";
import { handleError } from "../../../error";
import {
  AutonomousCityModel,
  MunicipalityModel,
  ProvinceModel,
} from "../locationModels";

const addEntityIdToLocation = async () => {
  const municipalitiesToUpdate = await MunicipalityModel.find({
    municipalityId: { $exists: false },
  }).lean();
  await MunicipalityModel.bulkWrite(
    municipalitiesToUpdate.map((municipality) => ({
      updateOne: {
        filter: { _id: municipality._id },
        update: { $set: { municipalityId: randomUUID() } },
      },
    }))
  );

  const provincesToUpdate = await ProvinceModel.find({
    provinceId: { $exists: false },
  }).lean();
  await ProvinceModel.bulkWrite(
    provincesToUpdate.map((province) => ({
      updateOne: {
        filter: { _id: province._id },
        update: { $set: { provinceId: randomUUID() } },
      },
    }))
  );

  const autonomousCitiesToUpdate = await AutonomousCityModel.find({
    autonomousCityId: { $exists: false },
  }).lean();
  await AutonomousCityModel.bulkWrite(
    autonomousCitiesToUpdate.map((autonomousCity) => ({
      updateOne: {
        filter: { _id: autonomousCity._id },
        update: { $set: { autonomousCityId: randomUUID() } },
      },
    }))
  );
};

(async () => {
  try {
    await runMigration(
      "Add municipalityId to municipalities, provinceId to provinces and autonomousCityId to autonomous cities",
      addEntityIdToLocation
    );
  } catch (error) {
    handleError(error);
  }
})();
