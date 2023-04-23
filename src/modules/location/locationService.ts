import { logger } from "../../logger";
import { getProvinces, createProvince } from "./locationRepository";
import { randomUUID } from "crypto";

export const createProvinces = async () => {
  const provinces = await getProvinces();

  const createProvincesPromises = provinces.map(async (province) =>
    createProvince({
      id: randomUUID(),
      ...province,
    })
  );
  const createdProvinces = await Promise.all(createProvincesPromises);

  logger.info("Provinces created successfully", {
    provinces: createdProvinces,
  });

  return createdProvinces;
};
