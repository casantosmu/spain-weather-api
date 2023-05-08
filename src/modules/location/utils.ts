import { provinceCodeLength } from "./constants";

export const getProvinceCodeFromMunicipalityCode = (municipalityCode: string) =>
  municipalityCode.substring(0, provinceCodeLength);
