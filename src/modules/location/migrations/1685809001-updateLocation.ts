/* eslint-disable @typescript-eslint/naming-convention */
import { runMigration } from "../../../db";
import { handleError } from "../../../error";
import { MunicipalityModel, ProvinceModel } from "../locationModels";

const updateLocation = async () => {
  const municipalitiesWithProvinceId = await MunicipalityModel.aggregate([
    {
      $match: {
        "province._id": { $exists: true },
        "province.provinceId": { $exists: false },
      },
    },
    {
      $lookup: {
        from: "locations",
        localField: "province._id",
        foreignField: "_id",
        as: "province",
      },
    },
    {
      $project: {
        _id: 1,
        provinceId: { $first: "$province.provinceId" },
      },
    },
  ]);
  await MunicipalityModel.bulkWrite(
    municipalitiesWithProvinceId.map(
      ({ _id, provinceId }: { _id: string; provinceId: string }) => ({
        updateOne: {
          filter: { _id },
          update: [
            {
              $set: {
                "province.provinceId": provinceId,
              },
            },
            { $unset: "province._id" },
          ],
        },
      })
    )
  );

  const provincesWithCapitalId = await ProvinceModel.aggregate([
    {
      $match: {
        "capital._id": { $exists: true },
        "capital.municipalityId": { $exists: false },
      },
    },
    {
      $lookup: {
        from: "locations",
        localField: "capital._id",
        foreignField: "_id",
        as: "capital",
      },
    },
    {
      $project: {
        _id: 1,
        capitalId: { $first: "$capital.municipalityId" },
      },
    },
  ]);
  await ProvinceModel.bulkWrite(
    provincesWithCapitalId.map(
      ({ _id, capitalId }: { _id: string; capitalId: string }) => ({
        updateOne: {
          filter: { _id },
          update: [
            {
              $set: {
                "capital.municipalityId": capitalId,
              },
            },
            { $unset: "capital._id" },
          ],
        },
      })
    )
  );
};

(async () => {
  try {
    await runMigration(
      "Update locations by relating them by province.provinceId or capital.municipalityId",
      updateLocation
    );
  } catch (error) {
    handleError(error);
  }
})();
