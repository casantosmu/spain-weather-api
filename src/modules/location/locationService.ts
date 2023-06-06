import logger from "../../logger";
import {
  createLocationsRepository,
  getLocationByLatLngRepository,
  getLocationsRepository,
  hasLocationRepository,
} from "./locationRepository";
import { randomUUID } from "crypto";
import { checkProvinceCode, checkProvincesLength } from "./provinceService";
import { checkMunicipalityCode } from "./municipalityService";
import {
  InvalidEntityError,
  MunicipalityNotFoundError,
  ProvinceNotFoundError,
} from "./error";
import { checkListParams, defaultList } from "../../operations";
import { entity } from "./constants";
import {
  getNewAutonomousCitiesRepository,
  getNewMunicipalitiesRepository,
  getNewProvincesRepository,
} from "./newLocationRepository";
import { type LatLng, type Entity } from "./types";
import { stringValidator } from "../../validator";
import { BadRequestError, NotFoundError } from "../../error";
import { getLatLngFromIpv4Repository } from "./ipLocationRepository";

export const isEntity = (string: string): string is Entity =>
  Object.keys(entity).includes(string);

export const isEntityArray = (array: string[]): array is Entity[] =>
  !array.some((entityName) => !isEntity(entityName));

export const seedLocationsService = async () => {
  const hasLocation = await hasLocationRepository();

  if (hasLocation) {
    logger.info("Locations already seeded");
    return;
  }

  const [newProvinces, newMunicipalities, newAutonomousCities] =
    await Promise.all([
      getNewProvincesRepository(),
      getNewMunicipalitiesRepository(),
      getNewAutonomousCitiesRepository(),
    ]);

  checkProvincesLength(newProvinces);

  // Generating identifiers first is necessary to establish circular relationships between provinces and municipalities.

  const provinces = newProvinces.map((province) => {
    checkProvinceCode(province);

    return {
      ...province,
      id: randomUUID(),
      provinceId: randomUUID(),
      entity: entity.province,
    };
  });

  const municipalities = newMunicipalities.map((municipality) => {
    checkMunicipalityCode(municipality);

    return {
      ...municipality,
      id: randomUUID(),
      municipalityId: randomUUID(),
      entity: entity.municipality,
    };
  });

  const autonomousCities = newAutonomousCities.map((autonomousCity) => ({
    ...autonomousCity,
    id: randomUUID(),
    autonomousCityId: randomUUID(),
    entity: entity.autonomousCity,
  }));

  const provincesWithCapital = provinces.map((province) => {
    const capital = municipalities.find(
      (municipality) =>
        province.capital.name === municipality.name &&
        province.capital.code === municipality.code &&
        municipality.province.code === province.code &&
        municipality.province.name === province.name
    );

    if (!capital) {
      throw new MunicipalityNotFoundError(province.capital.name);
    }

    return {
      ...province,
      capital: {
        ...province.capital,
        id: capital.municipalityId,
      },
    };
  });

  const municipalitiesWithProvince = municipalities.map((municipality) => {
    const province = provinces.find(
      (province) =>
        province.code === municipality.province.code &&
        province.name === municipality.province.name
    );

    if (!province) {
      throw new ProvinceNotFoundError(municipality.province.name);
    }

    return {
      ...municipality,
      province: {
        ...municipality.province,
        id: province.provinceId,
      },
    };
  });

  await createLocationsRepository([
    ...provincesWithCapital,
    ...municipalitiesWithProvince,
    ...autonomousCities,
  ]);
};

type GetLocationsServiceParams = {
  filter?: string;
  limit?: number;
  skip?: number;
};

export const getLocationsService = async ({
  filter,
  limit = defaultList.limit.default,
  skip = defaultList.skip.default,
}: GetLocationsServiceParams = {}) => {
  checkListParams({ limit, skip });

  return getLocationsRepository({ filter, limit, skip });
};

type GetReverseLocationServiceParams = {
  filter: string;
  entity?: string;
};

export const getReverseLocationService = async ({
  filter,
  entity,
}: GetReverseLocationServiceParams) => {
  const uniqueEntities = entity
    ? [...new Set(entity.split(",").map((entityName) => entityName.trim()))]
    : undefined;
  if (uniqueEntities && !isEntityArray(uniqueEntities)) {
    throw new InvalidEntityError(entity!);
  }

  let latLng: LatLng | undefined;

  if (stringValidator.isLatLng(filter)) {
    latLng = filter
      .split(",")
      .map((coordinate) => Number(coordinate.trim())) as [number, number];
  }

  if (stringValidator.isIp(filter, "4")) {
    const latLngFromIpResult = await getLatLngFromIpv4Repository(filter);

    if (!latLngFromIpResult) {
      throw new NotFoundError({ message: `IP not found: "${filter}"` });
    }

    latLng = latLngFromIpResult;
  }

  if (!latLng) {
    throw new BadRequestError({ message: `Invalid filter: ${filter}` });
  }

  return getLocationByLatLngRepository({
    latLng,
    entity:
      uniqueEntities && uniqueEntities.length > 1
        ? uniqueEntities
        : uniqueEntities?.[0],
  });
};
