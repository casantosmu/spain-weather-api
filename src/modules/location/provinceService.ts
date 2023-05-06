import { provinceCodeRange, provincesLength } from "./constants";
import { InvalidNumberOfProvincesError } from "./error";
import { type NewProvince, type Province } from "./types";

export const checkProvincesLength = (provinces: unknown[]) => {
  if (provinces.length !== provincesLength) {
    throw new InvalidNumberOfProvincesError();
  }
};

export const isValidProvinceCode = (province: NewProvince | Province) =>
  Number(province.code) >= provinceCodeRange.min &&
  Number(province.code) <= provinceCodeRange.max;
