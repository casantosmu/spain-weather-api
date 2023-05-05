import { municipalityCodeLength } from "./constants";
import { type Municipality, type NewMunicipality } from "./types";

export const isValidMunicipalityCode = (
  municipality: NewMunicipality | Municipality
) =>
  municipality.code.startsWith(municipality.province.code) &&
  municipality.code.length === municipalityCodeLength;
