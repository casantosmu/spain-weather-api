import logger from "../../logger";
import {
  createMunicipalitiesRepository,
  createProvincesRepository,
  getNewMunicipalitiesRepository,
  getNewProvincesRepository,
  hasLocationRepository,
} from "./locationRepository";
import { randomUUID } from "crypto";
import { checkProvincesLength } from "./provinceService";

export const seedLocationsService = async () => {
  const hasLocation = await hasLocationRepository();

  if (hasLocation) {
    logger.info("Locations already seeded");
    return;
  }

  const [newProvinces, newMunicipalities] = await Promise.all([
    getNewProvincesRepository(),
    getNewMunicipalitiesRepository(),
  ]);

  checkProvincesLength(newProvinces);

  const newProvincesWithUuid = newProvinces.map((province) => ({
    ...province,
    id: randomUUID(),
  }));

  const municipalities = newMunicipalities.map((municipality) => {
    const province = newProvincesWithUuid.find(
      (province) =>
        province.code === municipality.province.code &&
        province.name === municipality.province.name
    );

    if (!province) {
      throw new Error("not found!!!");
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

  const provinces = newProvincesWithUuid.map((province) => {
    const capital = municipalities.find(
      (municipality) =>
        municipality.name === province.capital.name &&
        municipality.code === province.capital.code &&
        municipality.province.id === province.id &&
        municipality.province.code === province.code &&
        municipality.province.name === province.name
    );

    if (!capital) {
      throw new Error("not found!!!");
    }

    return {
      ...province,
      capital: {
        ...province.capital,
        id: capital.id,
      },
    };
  });

  await Promise.all([
    createProvincesRepository(provinces),
    createMunicipalitiesRepository(municipalities),
  ]);
};
