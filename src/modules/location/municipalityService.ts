import { municipalityCodeLength } from "./constants";
import { type Municipality, type NewMunicipality } from "./types";
import { getProvinceCodeFromMunicipalityCode } from "./utils";

export const isValidMunicipalityCode = (
  municipality: NewMunicipality | Municipality
) =>
  getProvinceCodeFromMunicipalityCode(municipality.code) ===
    municipality.province.code &&
  municipality.code.length === municipalityCodeLength;
