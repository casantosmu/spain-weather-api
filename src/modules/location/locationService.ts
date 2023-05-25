import logger from "../../logger";
import {
  createLocationsRepository,
  filterLikeNameLocationsRepository,
  getNewAutonomousCitiesRepository,
  getNewMunicipalitiesRepository,
  getNewProvincesRepository,
  hasLocationRepository,
} from "./locationRepository";
import { randomUUID } from "crypto";
import { checkProvinceCode, checkProvincesLength } from "./provinceService";
import { checkMunicipalityCode } from "./municipalityService";
import { MunicipalityNotFoundError, ProvinceNotFoundError } from "./error";
import { checkCollectionParams, defaultCollection } from "../../operations";
import { entity } from "./constants";

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
      entity: entity.province,
    };
  });

  const municipalities = newMunicipalities.map((municipality) => {
    checkMunicipalityCode(municipality);

    return {
      ...municipality,
      id: randomUUID(),
      entity: entity.municipality,
    };
  });

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
        id: capital.id,
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
        id: province.id,
      },
    };
  });

  const autonomousCities = newAutonomousCities.map((autonomousCity) => ({
    ...autonomousCity,
    id: randomUUID(),
    entity: entity.autonomousCity,
  }));

  await createLocationsRepository([
    ...provincesWithCapital,
    ...municipalitiesWithProvince,
    ...autonomousCities,
  ]);
};

type GetLocationsParams = {
  name?: string;
  limit?: number;
  skip?: number;
};

export const getLocationsService = async ({
  name,
  limit = defaultCollection.limit.default,
  skip = defaultCollection.skip.default,
}: GetLocationsParams = {}) => {
  checkCollectionParams({ limit, skip });

  return filterLikeNameLocationsRepository({ name, limit, skip });
};
