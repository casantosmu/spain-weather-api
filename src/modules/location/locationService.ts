import logger from "../../logger";
import {
  createAutonomousCityRepository,
  createMunicipalitiesRepository,
  createProvincesRepository,
  getNewAutonomousCitiesRepository,
  getNewMunicipalitiesRepository,
  getNewProvincesRepository,
  hasLocationRepository,
} from "./locationRepository";
import { randomUUID } from "crypto";
import { checkProvinceCode, checkProvincesLength } from "./provinceService";
import { checkMunicipalityCode } from "./municipalityService";
import {
  LocationCodeNotUniqueError,
  MunicipalityNotFoundError,
  ProvinceNotFoundError,
} from "./error";

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

  const newProvincesWithUuid = newProvinces.map((province) => ({
    ...province,
    id: randomUUID(),
  }));

  const municipalities = newMunicipalities.map((municipality, index) => {
    checkMunicipalityCode(municipality);

    const province = newProvincesWithUuid.find(
      (province) =>
        province.code === municipality.province.code &&
        province.name === municipality.province.name
    );

    if (!province) {
      throw new ProvinceNotFoundError(municipality.province.name);
    }

    const isNotUniqueCode = newMunicipalities.find(
      (municipality2, index2) =>
        municipality.code === municipality2.code && index !== index2
    );

    if (isNotUniqueCode) {
      throw new LocationCodeNotUniqueError(municipality.code);
    }

    return {
      ...municipality,
      id: randomUUID(),
      province: {
        ...municipality.province,
        id: province.id,
      },
    };
  });

  const provinces = newProvincesWithUuid.map((province, index) => {
    checkProvinceCode(province);

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

    const isNotUniqueCode = newProvinces.find(
      (province2, index2) =>
        province.code === province2.code && index !== index2
    );

    if (isNotUniqueCode) {
      throw new LocationCodeNotUniqueError(province.code);
    }

    return {
      ...province,
      capital: {
        ...province.capital,
        id: capital.id,
      },
    };
  });

  const autonomousCities = newAutonomousCities.map((autonomousCity) => ({
    ...autonomousCity,
    id: randomUUID(),
  }));

  await Promise.all([
    createProvincesRepository(provinces),
    createMunicipalitiesRepository(municipalities),
    createAutonomousCityRepository(autonomousCities),
  ]);
};
