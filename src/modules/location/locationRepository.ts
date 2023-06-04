/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  type Entity,
  type LatLng,
  type LocationAutonomousCity,
  type LocationMunicipality,
  type LocationProvince,
} from "./types";
import { LocationModel, MunicipalityModel } from "./locationModels";
import { entity } from "./constants";

export const mapToLocation = (
  location: any
): LocationMunicipality | LocationProvince | LocationAutonomousCity => {
  const defaultData = {
    id: location._id,
    name: location.name,
    latLng: [
      location.geo2dPoint.coordinates[1],
      location.geo2dPoint.coordinates[0],
    ] as const,
    code: location.code,
    entity: location.entity,
    year: location.year,
  };

  switch (location.entity) {
    case entity.municipality:
      return {
        ...defaultData,
        municipalityId: location.municipalityId,
        province: {
          id: location.province.provinceId,
          name: location.province.name,
          code: location.province.code,
        },
      };
    case entity.province:
      return {
        ...defaultData,
        provinceId: location.provinceId,
        capital: {
          id: location.capital.municipalityId,
          name: location.capital.name,
          code: location.capital.code,
        },
      };
    default:
      return {
        ...defaultData,
        autonomousCityId: location.autonomousCityId,
      };
  }
};

export const mapToLocationModel = (
  location: LocationMunicipality | LocationProvince | LocationAutonomousCity
) => {
  const defaultData = {
    _id: location.id,
    name: location.name,
    code: location.code,
    geo2dPoint: {
      type: "Point",
      coordinates: [location.latLng[1], location.latLng[0]],
    },
    year: location.year,
    entity: location.entity,
  };

  switch (location.entity) {
    case entity.municipality:
      return {
        ...defaultData,
        municipalityId: location.municipalityId,
        province: {
          provinceId: location.province.id,
          name: location.province.name,
          code: location.province.code,
        },
      };
    case entity.province:
      return {
        ...defaultData,
        provinceId: location.provinceId,
        capital: {
          municipalityId: location.capital.id,
          name: location.capital.name,
          code: location.capital.code,
        },
      };
    case entity.autonomousCity:
      return {
        ...defaultData,
        autonomousCityId: location.autonomousCityId,
      };
    default:
      return defaultData;
  }
};

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

type GetLocationByLatLngRepositoryParams = {
  latLng: LatLng;
  entity?: Entity;
};

export const getLocationByLatLngRepository = async ({
  latLng,
  entity,
}: GetLocationByLatLngRepositoryParams) => {
  const query = {
    geo2dPoint: {
      $geoWithin: {
        $geometry: {
          type: "Point",
          coordinates: [latLng[1], latLng[0]],
        },
      },
    },
    ...(entity && { entity }),
  };

  const location = await LocationModel.findOne(query);
  return mapToLocation(location);
};
