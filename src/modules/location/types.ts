import { type operations } from "../../generated/Docs";
import { type entity } from "./constants";

export type LatLng = readonly [number, number];

export type NewLocationBase = {
  code: string;
  name: string;
};

export type NewLocation = {
  latLng: LatLng;
  year: number;
} & NewLocationBase;

export type NewProvince = {
  capital: NewLocationBase;
} & NewLocation;

export type NewMunicipality = {
  province: NewLocationBase;
} & NewLocation;

export type NewAutonomousCity = NewLocation;

export type LocationBase = {
  id: string;
  code: string;
  name: string;
};

export type Location = {
  latLng: LatLng;
  year: number;
  entity: (typeof entity)[keyof typeof entity];
} & LocationBase;

export type Province = {
  capital: LocationBase;
  entity: typeof entity.province;
} & Location;

export type Municipality = {
  province: LocationBase;
  entity: typeof entity.municipality;
} & Location;

export type AutonomousCity = {
  entity: typeof entity.autonomousCity;
} & Location;

export type GetLocationsQuery =
  operations["getLocations"]["parameters"]["query"];
