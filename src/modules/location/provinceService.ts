import { provinceCodeRange, provincesLength } from "./constants";
import {
  InvalidNumberOfProvincesError,
  InvalidProvinceCodeError,
} from "./error";
import { type NewProvince, type LocationProvince } from "./types";

export const checkProvincesLength = (
  provinces: NewProvince[] | LocationProvince[]
) => {
  if (provinces.length !== provincesLength) {
    throw new InvalidNumberOfProvincesError();
  }
};

export const checkProvinceCode = (province: NewProvince | LocationProvince) => {
  const code = Number(province.code);
  if (
    isNaN(code) ||
    code < provinceCodeRange.min ||
    code > provinceCodeRange.max
  ) {
    throw new InvalidProvinceCodeError(province.code);
  }
};
