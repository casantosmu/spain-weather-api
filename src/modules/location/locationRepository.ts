import {
  type LocationAutonomousCity,
  type LocationMunicipality,
  type LocationProvince,
} from "./types";
import { LocationModel, MunicipalityModel } from "./locationModels";
import { mapToLocation, mapToLocationModel } from "./locationMappers";

export const createLocationsRepository = async (
  locations: Array<
    LocationMunicipality | LocationProvince | LocationAutonomousCity
  >
) => {
  const mappedLocations = locations.map(mapToLocationModel);
  await LocationModel.insertMany(mappedLocations);
};

export const createLocationRepository = async (
  location: LocationMunicipality | LocationProvince | LocationAutonomousCity
) => {
  const mappedLocation = mapToLocationModel(location);
  await LocationModel.create(mappedLocation);
};

export const hasLocationRepository = async () => {
  const hasLocation = await MunicipalityModel.findOne().exec();
  return Boolean(hasLocation);
};

type GetLocationsParams = {
  filter?: string;
  limit: number;
  skip: number;
};

export const getLocationsRepository = async ({
  filter,
  limit,
  skip,
}: GetLocationsParams) => {
  const query = {
    ...(filter && {
      $or: [
        { code: new RegExp(filter, "i") },
        { name: new RegExp(filter, "i") },
      ],
    }),
  };

  const locations = await LocationModel.find(query)
    .limit(limit)
    .skip(skip)
    .sort({ name: "asc" })
    .lean();
  const total = await LocationModel.countDocuments(query);

  return {
    limit,
    skip,
    total,
    data: locations.map((location) => mapToLocation(location)),
  };
};
