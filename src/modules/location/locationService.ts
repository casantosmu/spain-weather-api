import {
  createMunicipalitiesRepository,
  createProvincesRepository,
  getNewMunicipalitiesRepository,
  getNewProvincesRepository,
} from "./locationRepository";
import { randomUUID } from "crypto";

export const seedLocationsService = async () => {
  const newProvinces = await getNewProvincesRepository();

  const newProvincesWithUuid = newProvinces.map((province) => ({
    ...province,
    id: randomUUID(),
  }));

  const newMunicipalities = await getNewMunicipalitiesRepository();

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

  await createMunicipalitiesRepository(municipalities);
  await createProvincesRepository(provinces);
};
