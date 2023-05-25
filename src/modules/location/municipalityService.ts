import { municipalityCodeLength } from "./constants";
import { InvalidMunicipalityCodeError } from "./error";
import { type LocationMunicipality, type NewMunicipality } from "./types";
import { getProvinceCodeFromMunicipalityCode } from "./utils";

export const checkMunicipalityCode = (
  municipality: NewMunicipality | LocationMunicipality
) => {
  if (
    getProvinceCodeFromMunicipalityCode(municipality.code) !==
      municipality.province.code ||
    municipality.code.length !== municipalityCodeLength
  ) {
    throw new InvalidMunicipalityCodeError(municipality.code);
  }
};
