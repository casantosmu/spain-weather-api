/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { entity } from "./constants";
import {
  type LocationAutonomousCity,
  type LocationMunicipality,
  type LocationProvince,
} from "./types";

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
