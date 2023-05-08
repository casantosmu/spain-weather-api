import { provinceCodeRange, provincesLength } from "./constants";
import {
  InvalidNumberOfProvincesError,
  InvalidProvinceCodeError,
} from "./error";
import { type NewProvince, type Province } from "./types";

export const checkProvincesLength = (provinces: NewProvince[] | Province[]) => {
  if (provinces.length !== provincesLength) {
    throw new InvalidNumberOfProvincesError();
  }
};

export const checkProvinceCode = (province: NewProvince | Province) => {
  const code = Number(province.code);
  if (
    isNaN(code) ||
    code < provinceCodeRange.min ||
    code > provinceCodeRange.max
  ) {
    throw new InvalidProvinceCodeError(province.code);
  }
};
