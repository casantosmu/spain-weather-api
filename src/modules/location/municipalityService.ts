import { municipalityCodeLength } from "./constants";
import { InvalidMunicipalityCodeError } from "./error";
import { type Municipality, type NewMunicipality } from "./types";
import { getProvinceCodeFromMunicipalityCode } from "./utils";

export const checkMunicipalityCode = (
  municipality: NewMunicipality | Municipality
) => {
  if (
    getProvinceCodeFromMunicipalityCode(municipality.code) !==
      municipality.province.code ||
    municipality.code.length !== municipalityCodeLength
  ) {
    throw new InvalidMunicipalityCodeError(municipality.code);
  }
};
